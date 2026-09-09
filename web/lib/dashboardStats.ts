import { prisma } from "@/lib/prisma";
import { getUserProgressMap } from "@/lib/dsa/progress";
import { TOPIC_SLUGS } from "@/lib/dsa/topics";
import { computeStreak } from "@/lib/streaks";
import { getActivityEvents, toActivityDates } from "@/lib/activity";

export async function getDashboardStats(userId: number) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [progress, events, projectsCount] = await Promise.all([
    getUserProgressMap(userId),
    getActivityEvents(userId),
    prisma.project.count({ where: { userId } }),
  ]);

  const learningModules = TOPIC_SLUGS.filter((slug) =>
    Object.values(progress[slug]).some((status) => status === "solved"),
  ).length;

  const activityDates = toActivityDates(events);
  const weeklyActions = events.filter((e) => e.at >= weekAgo && (e.kind === "dsa" || e.kind === "task-done" || e.kind === "roadmap")).length;

  const streak = computeStreak(activityDates);

  return {
    codingStreak: streak.current,
    longestStreak: streak.longest,
    freezesRemaining: streak.freezesRemaining,
    streakFrozen: streak.frozenDates.length > 0,
    learningModules,
    projectsCount,
    weeklyActions,
  };
}
