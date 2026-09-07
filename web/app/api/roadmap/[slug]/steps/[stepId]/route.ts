import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ROADMAP_BY_SLUG } from "@/lib/roadmaps/content";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string; stepId: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const { slug, stepId } = await params;
  const roadmap = ROADMAP_BY_SLUG[slug];

  if (!roadmap) {
    return Response.json({ status: "error", message: "Roadmap not found" }, { status: 404 });
  }

  // Only accept step ids that actually exist in this roadmap, so progress
  // rows can't be created for steps that were never real.
  const stepExists = roadmap.stages.some((stage) => stage.steps.some((step) => step.id === stepId));

  if (!stepExists) {
    return Response.json({ status: "error", message: "Step not found" }, { status: 404 });
  }

  const body = await request.json();
  const done = Boolean(body.done);

  const row = await prisma.roadmapProgress.upsert({
    where: { userId_roadmapSlug_stepId: { userId: user.id, roadmapSlug: slug, stepId } },
    update: { done },
    create: { userId: user.id, roadmapSlug: slug, stepId, done },
  });

  return Response.json({ status: "ok", done: row.done });
}
