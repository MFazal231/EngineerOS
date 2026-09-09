import { prisma } from "@/lib/prisma";
import { DSA_TOPICS, TOPIC_SLUGS } from "@/lib/dsa/topics";
import { ROADMAPS, countSteps } from "@/lib/roadmaps/content";
import { computeLongestStreak } from "@/lib/streaks";
import { getActivityEvents, toActivityDates } from "@/lib/activity";

export type MilestoneCategory = "dsa" | "streak" | "project" | "roadmap";

export type Milestone = {
  id: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  unlocked: boolean;
  /** For locked milestones close enough to be worth showing progress on. */
  progress?: { current: number; target: number };
};

const DSA_TARGETS = [1, 10, 25, 50, 100, 159] as const;
const STREAK_TARGETS = [3, 7, 14, 30, 100] as const;

export function dsaMilestone(target: number, solved: number): Milestone {
  const isAll = target === 159;
  return {
    id: `dsa-${target}`,
    title: isAll ? "Cleared the board" : target === 1 ? "First blood" : `${target} solved`,
    description: isAll
      ? "Solved every problem in the DSA set."
      : `Solve ${target} DSA problem${target === 1 ? "" : "s"}.`,
    category: "dsa",
    unlocked: solved >= target,
    progress: solved < target ? { current: solved, target } : undefined,
  };
}

export function streakMilestone(target: number, longest: number): Milestone {
  return {
    id: `streak-${target}`,
    title: `${target}-day streak`,
    description: `Reach a ${target}-day streak, real or freeze-covered.`,
    category: "streak",
    unlocked: longest >= target,
    progress: longest < target ? { current: longest, target } : undefined,
  };
}

export async function getMilestones(userId: number): Promise<Milestone[]> {
  const [solvedCount, progressByTopic, projects, roadmapRows, events] = await Promise.all([
    prisma.dsaProblemProgress.count({ where: { userId, status: "solved" } }),
    prisma.dsaProblemProgress.groupBy({
      by: ["topicSlug"],
      where: { userId, status: "solved" },
      _count: { _all: true },
    }),
    prisma.project.findMany({
      where: { userId },
      select: { id: true, tasks: { select: { done: true } } },
    }),
    prisma.roadmapProgress.findMany({ where: { userId, done: true }, select: { roadmapSlug: true, stepId: true } }),
    getActivityEvents(userId),
  ]);

  const longest = computeLongestStreak(toActivityDates(events));

  const milestones: Milestone[] = [
    ...DSA_TARGETS.map((t) => dsaMilestone(t, solvedCount)),
    ...STREAK_TARGETS.map((t) => streakMilestone(t, longest)),
  ];

  // First fully-shipped project: at least one task, and every task done.
  const shippedProject = projects.find((p) => p.tasks.length > 0 && p.tasks.every((t) => t.done));
  const shippedCount = projects.filter((p) => p.tasks.length > 0 && p.tasks.every((t) => t.done)).length;
  milestones.push({
    id: "project-shipped",
    title: "Shipped it",
    description: "Finish every task in a project.",
    category: "project",
    unlocked: Boolean(shippedProject),
    progress: shippedCount === 0 && projects.length > 0 ? { current: 0, target: 1 } : undefined,
  });

  // First DSA topic solved 100%.
  const solvedByTopic = new Map(progressByTopic.map((row) => [row.topicSlug, row._count._all]));
  const masteredTopic = TOPIC_SLUGS.find((slug) => {
    const total = DSA_TOPICS[slug].problems.length;
    return total > 0 && (solvedByTopic.get(slug) ?? 0) >= total;
  });
  milestones.push({
    id: "topic-mastered",
    title: "Topic mastered",
    description: "Solve every problem in a single DSA topic.",
    category: "dsa",
    unlocked: Boolean(masteredTopic),
  });

  // Roadmap milestones: first step, first fully-done stage, first fully-done roadmap.
  const doneStepsByRoadmap = new Map<string, Set<string>>();
  for (const row of roadmapRows) {
    if (!doneStepsByRoadmap.has(row.roadmapSlug)) doneStepsByRoadmap.set(row.roadmapSlug, new Set());
    doneStepsByRoadmap.get(row.roadmapSlug)!.add(row.stepId);
  }

  milestones.push({
    id: "roadmap-started",
    title: "On the map",
    description: "Tick off your first roadmap step.",
    category: "roadmap",
    unlocked: roadmapRows.length > 0,
  });

  const stageCompleted = ROADMAPS.some((roadmap) => {
    const done = doneStepsByRoadmap.get(roadmap.slug);
    if (!done) return false;
    return roadmap.stages.some((stage) => stage.steps.every((step) => done.has(step.id)));
  });
  milestones.push({
    id: "roadmap-stage-done",
    title: "Stage clear",
    description: "Finish every step in one stage of a roadmap.",
    category: "roadmap",
    unlocked: stageCompleted,
  });

  const roadmapCompleted = ROADMAPS.some((roadmap) => {
    const done = doneStepsByRoadmap.get(roadmap.slug);
    return Boolean(done) && done!.size >= countSteps(roadmap);
  });
  milestones.push({
    id: "roadmap-done",
    title: "Path complete",
    description: "Finish every step in an entire roadmap.",
    category: "roadmap",
    unlocked: roadmapCompleted,
  });

  return milestones;
}
