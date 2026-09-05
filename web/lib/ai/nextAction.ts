import { prisma } from "@/lib/prisma";
import { getUserProgressMap, computeContinuePractice } from "@/lib/dsa/progress";

export type NextAction = {
  headline: string;
  reason: string;
  actionLabel: string;
  actionHref: string;
  source: "heuristic" | "ai";
};

type ProjectWithTasks = {
  id: number;
  name: string;
  tasks: { id: number; title: string; done: boolean }[];
};

/**
 * Looks across DSA progress AND Projects together to find the single best
 * next thing to work on. Priority mirrors how a person would actually
 * triage their own day: finish what's already open before starting
 * something new, and never leave a project with no defined next step.
 */
export async function getNextAction(userId: number): Promise<NextAction> {
  const [progress, projects] = await Promise.all([
    getUserProgressMap(userId),
    prisma.project.findMany({
      where: { userId },
      include: { tasks: { orderBy: { id: "asc" } } },
      orderBy: { id: "asc" },
    }),
  ]);

  const continuePractice = computeContinuePractice(progress);

  // 1. An in-progress DSA problem is the most concrete "unfinished" signal there is.
  if (continuePractice && continuePractice.status === "in-progress") {
    return {
      headline: `Finish "${continuePractice.problem.title}"`,
      reason: `You already started this ${continuePractice.problem.difficulty} problem in ${topicTitle(continuePractice.topic)} — finishing it is faster than starting something new.`,
      actionLabel: "Continue in DSA",
      actionHref: `/dsa/${continuePractice.topic}`,
      source: "heuristic",
    };
  }

  // 2. A project that's partway done (at least one task complete, not all) is a stalled build.
  const stalledProject = findStalledProject(projects);
  if (stalledProject) {
    const nextTask = stalledProject.tasks.find((t) => !t.done);
    return {
      headline: `Pick "${stalledProject.name}" back up`,
      reason: nextTask
        ? `You're partway through this project — the next open task is "${nextTask.title}".`
        : `You're partway through this project's tasks.`,
      actionLabel: "Open Projects",
      actionHref: "/projects",
      source: "heuristic",
    };
  }

  // 3. A project with zero tasks has no defined next step — that's a real gap to close.
  const emptyProject = projects.find((p) => p.tasks.length === 0);
  if (emptyProject) {
    return {
      headline: `Break down "${emptyProject.name}" into tasks`,
      reason: "This project doesn't have any tasks yet, so there's no clear next step defined for it.",
      actionLabel: "Add tasks",
      actionHref: "/projects",
      source: "heuristic",
    };
  }

  // 4. Nothing open — fall back to starting a fresh DSA problem.
  if (continuePractice && continuePractice.status === "not-started") {
    return {
      headline: `Start "${continuePractice.problem.title}"`,
      reason: `Nothing else is in progress right now — this is the next unsolved problem in ${topicTitle(continuePractice.topic)}.`,
      actionLabel: "Start in DSA",
      actionHref: `/dsa/${continuePractice.topic}`,
      source: "heuristic",
    };
  }

  // 5. Genuinely all caught up.
  return {
    headline: "You're all caught up",
    reason: "Every DSA problem is solved and every project task is done. Consider starting a new project.",
    actionLabel: "New project",
    actionHref: "/projects",
    source: "heuristic",
  };
}

function findStalledProject(projects: ProjectWithTasks[]) {
  return projects.find((p) => {
    if (p.tasks.length === 0) return false;
    const done = p.tasks.filter((t) => t.done).length;
    return done > 0 && done < p.tasks.length;
  });
}

function topicTitle(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
