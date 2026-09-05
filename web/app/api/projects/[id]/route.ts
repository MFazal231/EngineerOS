import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const VALID_STATUSES = new Set(["planning", "active", "completed"]);

export async function PATCH(
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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const status = VALID_STATUSES.has(body.status) ? body.status : "active";
  const tech = Array.isArray(body.tech) ? body.tech.filter((t: unknown) => typeof t === "string") : [];
  const nextStep = typeof body.nextStep === "string" ? body.nextStep.trim() : "";

  if (!name || !description) {
    return Response.json(
      { status: "error", message: "Name and description are required" },
      { status: 400 },
    );
  }

  const { count } = await prisma.project.updateMany({
    where: { id: projectId, userId: user.id },
    data: { name, description, status, tech, nextStep },
  });

  if (count === 0) {
    return Response.json({ status: "error", message: "Project not found" }, { status: 404 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { tasks: { orderBy: { id: "asc" } } },
  });

  return Response.json(project);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const { id } = await params;
  const { count } = await prisma.project.deleteMany({
    where: { id: Number(id), userId: user.id },
  });

  if (count === 0) {
    return Response.json({ status: "error", message: "Project not found" }, { status: 404 });
  }

  return Response.json({ status: "ok" });
}
