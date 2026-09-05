import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { isEmailVerificationEnabled, sendVerificationEmail } from "@/lib/email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || name.length > 100) {
    return Response.json(
      { status: "error", message: "Name must be between 1 and 100 characters" },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json(
      { status: "error", message: "Enter a valid email address" },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return Response.json(
      { status: "error", message: "Password must contain at least 8 characters" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return Response.json(
      { status: "error", message: "An account already exists for this email address" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verificationRequired = isEmailVerificationEnabled();
  const verificationToken = verificationRequired ? crypto.randomBytes(32).toString("hex") : null;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      emailVerified: !verificationRequired,
      verificationToken,
      verificationTokenExpiresAt: verificationRequired
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : null,
    },
    select: { id: true, name: true, email: true },
  });

  if (verificationRequired && verificationToken) {
    await sendVerificationEmail(user.email, user.name, verificationToken);
    return Response.json(
      { status: "ok", requiresVerification: true, message: "Check your email to verify your account." },
      { status: 201 },
    );
  }

  await createSession(user);

  return Response.json({ user }, { status: 201 });
}
