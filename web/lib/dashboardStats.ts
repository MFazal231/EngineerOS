import { prisma } from "@/lib/prisma";
import { getUserProgressMap } from "@/lib/dsa/progress";
import { TOPIC_SLUGS } from "@/lib/dsa/topics";

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Counts consecutive days of activity ending today. A day with no activity
 * yet doesn't break the streak — only two empty days in a row do — so opening
 * the app in the morning doesn't show yesterday's work wiped out.
 * Exported for testing; `now` is injectable so tests don't depend on the clock.
 */
export function computeStreak(activityDates: Set<string>, now: Date = new Date()): number {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);

  const cursor = new Date(today);
  if (!activityDates.has(dateKey(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!activityDates.has(dateKey(cursor))) {
      return 0;
    }
  }

  let streak = 0;
  while (activityDates.has(dateKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

export async function getDashboardStats(userId: number) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [progress, dsaRows, projects, tasks, roadmapSteps] = await Promise.all([
    getUserProgressMap(userId),
    prisma.dsaProblemProgress.findMany({ where: { userId }, select: { updatedAt: true, status: true } }),
    prisma.project.findMany({ where: { userId }, select: { createdAt: true } }),
    prisma.projectTask.findMany({
      where: { project: { userId } },
      select: { done: true, createdAt: true, updatedAt: true },
    }),
    prisma.roadmapProgress.findMany({ where: { userId, done: true }, select: { updatedAt: true } }),
  ]);

  const learningModules = TOPIC_SLUGS.filter((slug) =>
    Object.values(progress[slug]).some((status) => status === "solved"),
  ).length;

  const activityDates = new Set<string>();
  for (const row of dsaRows) activityDates.add(dateKey(row.updatedAt));
  for (const project of projects) activityDates.add(dateKey(project.createdAt));
  for (const task of tasks) {
    activityDates.add(dateKey(task.createdAt));
    if (task.done) activityDates.add(dateKey(task.updatedAt));
  }

  for (const step of roadmapSteps) activityDates.add(dateKey(step.updatedAt));

  const weeklyDsaSolved = dsaRows.filter((r) => r.status === "solved" && r.updatedAt >= weekAgo).length;
  const weeklyTasksDone = tasks.filter((t) => t.done && t.updatedAt >= weekAgo).length;
  const weeklyRoadmapSteps = roadmapSteps.filter((s) => s.updatedAt >= weekAgo).length;

  return {
    codingStreak: computeStreak(activityDates),
    learningModules,
    projectsCount: projects.length,
    weeklyActions: weeklyDsaSolved + weeklyTasksDone + weeklyRoadmapSteps,
  };
}
