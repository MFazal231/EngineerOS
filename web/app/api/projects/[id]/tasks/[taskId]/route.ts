import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

async function assertOwnership(projectId: number, taskId: number, userId: number) {
  const task = await prisma.projectTask.findFirst({
    where: { id: taskId, projectId, project: { userId } },
  });
  return task !== null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const { id, taskId } = await params;
  const projectId = Number(id);
  const taskIdNum = Number(taskId);
  const body = await request.json();

  if (!(await assertOwnership(projectId, taskIdNum, user.id))) {
    return Response.json({ status: "error", message: "Task not found" }, { status: 404 });
  }

  const task = await prisma.projectTask.update({
    where: { id: taskIdNum },
    data: { done: Boolean(body.done) },
  });

  return Response.json(task);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const { id, taskId } = await params;
  const projectId = Number(id);
  const taskIdNum = Number(taskId);

  if (!(await assertOwnership(projectId, taskIdNum, user.id))) {
    return Response.json({ status: "error", message: "Task not found" }, { status: 404 });
  }

  await prisma.projectTask.delete({ where: { id: taskIdNum } });

  return Response.json({ status: "ok" });
}
