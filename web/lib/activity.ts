import { prisma } from "@/lib/prisma";
import { DSA_TOPICS, type TopicSlug } from "@/lib/dsa/topics";
import { ROADMAP_BY_SLUG } from "@/lib/roadmaps/content";

/**
 * The single source of truth for "what counts as activity" — solving a DSA
 * problem, creating or finishing project work, ticking a roadmap step.
 * Dashboard stats, Insights, and Milestones all read from this rather than
 * each assembling their own version, which is how the streak shown on the
 * dashboard and the one on Insights briefly disagreed during development.
 */

export type ActivityKind = "dsa" | "project-created" | "task-created" | "task-done" | "roadmap";

export type ActivityEvent = { at: Date; kind: ActivityKind; label: string };

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getActivityEvents(userId: number): Promise<ActivityEvent[]> {
  const [dsaRows, projects, tasks, roadmapRows] = await Promise.all([
    prisma.dsaProblemProgress.findMany({
      where: { userId },
      select: { updatedAt: true, status: true, topicSlug: true, problemId: true },
    }),
    prisma.project.findMany({ where: { userId }, select: { name: true, createdAt: true } }),
    prisma.projectTask.findMany({
      where: { project: { userId } },
      select: { title: true, done: true, createdAt: true, updatedAt: true },
    }),
    prisma.roadmapProgress.findMany({
      where: { userId, done: true },
      select: { roadmapSlug: true, updatedAt: true },
    }),
  ]);

  const events: ActivityEvent[] = [];

  for (const row of dsaRows) {
    if (row.status !== "solved") continue;
    const topic = DSA_TOPICS[row.topicSlug as TopicSlug];
    const problem = topic?.problems.find((p) => p.id === row.problemId);
    events.push({ at: row.updatedAt, kind: "dsa", label: problem ? `Solved ${problem.title}` : "Solved a problem" });
  }

  for (const project of projects) {
    events.push({ at: project.createdAt, kind: "project-created", label: `Started “${project.name}”` });
  }

  for (const task of tasks) {
    events.push({ at: task.createdAt, kind: "task-created", label: `Added “${task.title}”` });
    if (task.done) {
      events.push({ at: task.updatedAt, kind: "task-done", label: `Finished “${task.title}”` });
    }
  }

  for (const row of roadmapRows) {
    const roadmap = ROADMAP_BY_SLUG[row.roadmapSlug];
    events.push({
      at: row.updatedAt,
      kind: "roadmap",
      label: roadmap ? `Step done in ${roadmap.title}` : "Roadmap step done",
    });
  }

  events.sort((a, b) => b.at.getTime() - a.at.getTime());
  return events;
}

export function toActivityDates(events: ActivityEvent[]): Set<string> {
  return new Set(events.map((e) => dateKey(e.at)));
}
