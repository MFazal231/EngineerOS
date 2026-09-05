import { prisma } from "@/lib/prisma";
import { DSA_TOPICS, TOPIC_SLUGS, type TopicSlug } from "./topics";
import type { ProblemStatus } from "./problems";

export type ProgressMap = Record<TopicSlug, Record<number, ProblemStatus>>;

export async function getUserProgressMap(userId: number | undefined): Promise<ProgressMap> {
  const empty = Object.fromEntries(TOPIC_SLUGS.map((slug) => [slug, {}])) as ProgressMap;

  if (!userId) {
    return empty;
  }

  const rows = await prisma.dsaProblemProgress.findMany({
    where: { userId, topicSlug: { in: TOPIC_SLUGS } },
    select: { topicSlug: true, problemId: true, status: true },
  });

  for (const row of rows) {
    empty[row.topicSlug as TopicSlug][row.problemId] = row.status as ProblemStatus;
  }

  return empty;
}

export function computeTopicStats(slug: TopicSlug, progress: ProgressMap) {
  const problems = DSA_TOPICS[slug].problems;
  const statuses = progress[slug];
  const total = problems.length;
  const solved = problems.filter((p) => statuses[p.id] === "solved").length;
  const percent = total === 0 ? 0 : Math.round((solved / total) * 100);

  return { total, solved, percent };
}

export function computeOverallStats(progress: ProgressMap) {
  let total = 0;
  let solved = 0;
  let activeTopics = 0;

  for (const slug of TOPIC_SLUGS) {
    const problems = DSA_TOPICS[slug].problems;
    if (problems.length > 0) {
      activeTopics += 1;
    }
    total += problems.length;
    solved += problems.filter((p) => progress[slug][p.id] === "solved").length;
  }

  const percent = total === 0 ? 0 : Math.round((solved / total) * 100);

  return { total, solved, activeTopics, percent };
}

export function computeContinuePractice(progress: ProgressMap) {
  for (const slug of TOPIC_SLUGS) {
    const problem = DSA_TOPICS[slug].problems.find((p) => progress[slug][p.id] === "in-progress");
    if (problem) {
      return { topic: slug, problem, status: "in-progress" as const };
    }
  }

  for (const slug of TOPIC_SLUGS) {
    const problem = DSA_TOPICS[slug].problems.find((p) => (progress[slug][p.id] ?? "not-started") === "not-started");
    if (problem) {
      return { topic: slug, problem, status: "not-started" as const };
    }
  }

  return null;
}
