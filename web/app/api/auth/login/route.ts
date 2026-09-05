import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json(
      { status: "error", message: "Email and password are required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return Response.json(
      { status: "error", message: "Email or password is incorrect" },
      { status: 401 },
    );
  }

  const sessionUser = { id: user.id, name: user.name, email: user.email };
  await createSession(sessionUser);

  return Response.json({ user: sessionUser });
}
