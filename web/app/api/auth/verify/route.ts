import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return Response.redirect(new URL("/auth?verifyError=missing", request.url));
  }

  const user = await prisma.user.findUnique({ where: { verificationToken: token } });

  if (!user || !user.verificationTokenExpiresAt || user.verificationTokenExpiresAt < new Date()) {
    return Response.redirect(new URL("/auth?verifyError=expired", request.url));
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null, verificationTokenExpiresAt: null },
    select: { id: true, name: true, email: true },
  });

  await createSession(updated);

  return Response.redirect(new URL("/?verified=1", request.url));
}
