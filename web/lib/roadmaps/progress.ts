import { prisma } from "@/lib/prisma";
import { ROADMAPS, countSteps, type Roadmap } from "./content";

/** roadmapSlug -> set of completed step ids. */
export type RoadmapProgressMap = Record<string, Set<string>>;

export async function getRoadmapProgress(userId: number | undefined): Promise<RoadmapProgressMap> {
  const empty: RoadmapProgressMap = Object.fromEntries(ROADMAPS.map((r) => [r.slug, new Set<string>()]));

  if (!userId) {
    return empty;
  }

  const rows = await prisma.roadmapProgress.findMany({
    where: { userId, done: true },
    select: { roadmapSlug: true, stepId: true },
  });

  for (const row of rows) {
    empty[row.roadmapSlug]?.add(row.stepId);
  }

  return empty;
}

export function computeRoadmapStats(roadmap: Roadmap, progress: RoadmapProgressMap) {
  const completed = progress[roadmap.slug] ?? new Set<string>();
  const total = countSteps(roadmap);
  const done = roadmap.stages.reduce(
    (sum, stage) => sum + stage.steps.filter((step) => completed.has(step.id)).length,
    0,
  );

  return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}
