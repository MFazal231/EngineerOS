import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const VALID_STATUSES = new Set(["planning", "active", "completed"]);

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { tasks: { orderBy: { id: "asc" } } },
    orderBy: { id: "asc" },
  });

  return Response.json(projects);
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

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

  const project = await prisma.project.create({
    data: { userId: user.id, name, description, status, tech, nextStep },
    include: { tasks: true },
  });

  return Response.json(project, { status: 201 });
}
