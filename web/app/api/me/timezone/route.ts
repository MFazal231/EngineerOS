import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const body = await request.json();
  const timezone = typeof body.timezone === "string" ? body.timezone.slice(0, 64) : "";

  // Only accept zones this runtime actually recognises, so a junk value can't
  // land in the database and blow up date formatting later.
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    return Response.json({ status: "error", message: "Unrecognised timezone" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { timezone } });

  return Response.json({ status: "ok" });
}
