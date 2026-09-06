import { prisma } from "@/lib/prisma";
import { getUserProgressMap, computeContinuePractice, computeTopicStats } from "@/lib/dsa/progress";
import { DSA_TOPICS, TOPIC_SLUGS } from "@/lib/dsa/topics";

export type Mission = {
  key: string;
  label: string;
  title: string;
  meta: { cls: string; text: string }[];
  href: string;
  action: { type: "dsa"; topic: string; problemId: number } | { type: "task"; projectId: number; taskId: number } | null;
};

function difficultyMeta(difficulty: string): { cls: string; text: string } {
  if (difficulty === "Easy") return { cls: "low", text: "Easy" };
  if (difficulty === "Hard") return { cls: "high", text: "Hard" };
  return { cls: "medium", text: "Medium" };
}

function topicTitle(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getTodayMissions(userId: number): Promise<Mission[]> {
  const [progress, projects] = await Promise.all([
    getUserProgressMap(userId),
    prisma.project.findMany({
      where: { userId },
      include: { tasks: { orderBy: { id: "asc" } } },
      orderBy: { id: "asc" },
    }),
  ]);

  const missions: Mission[] = [];

  const continuePractice = computeContinuePractice(progress);
  if (continuePractice) {
    missions.push({
      key: "dsa",
      label: "DSA FOCUS",
      title: continuePractice.problem.title,
      meta: [
        { cls: "practice", text: topicTitle(continuePractice.topic) },
        difficultyMeta(continuePractice.problem.difficulty),
      ],
      href: `/dsa/${continuePractice.topic}`,
      action: { type: "dsa", topic: continuePractice.topic, problemId: continuePractice.problem.id },
    });
  }

  const projectWithOpenTask = projects.find((p) => p.tasks.some((t) => !t.done));
  if (projectWithOpenTask) {
    const nextTask = projectWithOpenTask.tasks.find((t) => !t.done);
    if (nextTask) {
      missions.push({
        key: "build",
        label: "BUILD FOCUS",
        title: nextTask.title,
        meta: [
          { cls: "build", text: projectWithOpenTask.name },
          { cls: "medium", text: "Project" },
        ],
        href: "/projects",
        action: { type: "task", projectId: projectWithOpenTask.id, taskId: nextTask.id },
      });
    }
  }

  const untouchedTopic = TOPIC_SLUGS.find((slug) => {
    if (continuePractice && slug === continuePractice.topic) return false;
    return computeTopicStats(slug, progress).solved === 0;
  });
  if (untouchedTopic) {
    const firstProblem = DSA_TOPICS[untouchedTopic].problems[0];
    if (firstProblem) {
      missions.push({
        key: "learning",
        label: "LEARNING FOCUS",
        title: `Start ${DSA_TOPICS[untouchedTopic].name}: "${firstProblem.title}"`,
        meta: [
          { cls: "learning", text: DSA_TOPICS[untouchedTopic].name },
          difficultyMeta(firstProblem.difficulty),
        ],
        href: `/dsa/${untouchedTopic}`,
        action: { type: "dsa", topic: untouchedTopic, problemId: firstProblem.id },
      });
    }
  }

  missions.push({
    key: "git",
    label: "GIT FOCUS",
    title: "Commit & push today's work to GitHub",
    meta: [
      { cls: "git", text: "Habit" },
      { cls: "low", text: "Self-tracked" },
    ],
    href: "#",
    action: null,
  });

  return missions;
}
