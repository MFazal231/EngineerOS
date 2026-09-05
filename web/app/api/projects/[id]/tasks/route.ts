import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const { id } = await params;
  const projectId = Number(id);
  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";

  if (!title) {
    return Response.json({ status: "error", message: "Task title is required" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });

  if (!project) {
    return Response.json({ status: "error", message: "Project not found" }, { status: 404 });
  }

  const task = await prisma.projectTask.create({ data: { projectId, title } });

  return Response.json(task, { status: 201 });
}
