import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();

  if (!user || !(await isAdmin(user.id))) {
    return Response.json({ status: "error", message: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const targetId = Number(id);

  if (!Number.isInteger(targetId)) {
    return Response.json({ status: "error", message: "Invalid user id" }, { status: 400 });
  }

  if (targetId === user.id) {
    return Response.json({ status: "error", message: "You can't delete your own account here" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: targetId } });

  return Response.json({ status: "ok" });
}
