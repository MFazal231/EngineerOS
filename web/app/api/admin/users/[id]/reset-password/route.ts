import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

/**
 * Admin-initiated password reset. The usual self-serve "email me a reset
 * link" flow can't work yet — no verified sending domain, so Resend can only
 * deliver to the account owner. Until that exists, this gives a locked-out
 * tester a way back in: the admin generates a temporary password here and
 * passes it to them directly. It's shown exactly once, in this response.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();

  if (!user || !(await isAdmin(user.id))) {
    return Response.json({ status: "error", message: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const targetId = Number(id);

  if (!Number.isInteger(targetId)) {
    return Response.json({ status: "error", message: "Invalid user id" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true, email: true } });

  if (!target) {
    return Response.json({ status: "error", message: "User not found" }, { status: 404 });
  }

  // 12 url-safe chars — long enough to not be guessable, short enough to
  // retype by hand from a chat message.
  const tempPassword = crypto.randomBytes(9).toString("base64url");
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  await prisma.user.update({ where: { id: targetId }, data: { passwordHash } });

  return Response.json({ status: "ok", email: target.email, tempPassword });
}
