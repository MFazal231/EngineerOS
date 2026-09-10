import { prisma } from "@/lib/prisma";
import { DSA_TOPICS, TOPIC_SLUGS, type TopicSlug } from "@/lib/dsa/topics";
import type { DsaProblem } from "@/lib/dsa/problems";

export type DailyChallenge = {
  dateKey: string;
  topic: TopicSlug;
  problem: DsaProblem;
};

const ALL_PROBLEMS: { topic: TopicSlug; problem: DsaProblem }[] = TOPIC_SLUGS.flatMap((slug) =>
  DSA_TOPICS[slug].problems.map((problem) => ({ topic: slug, problem })),
);

function epochDay(date: Date): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

/**
 * Same problem for every user on a given UTC calendar day, rotating through
 * the full 159-problem set. Epoch-day-mod-length rather than a random seed so
 * the pick is trivially reproducible and needs no stored state.
 */
export function pickDailyChallenge(date: Date = new Date()): DailyChallenge {
  const index = epochDay(date) % ALL_PROBLEMS.length;
  const { topic, problem } = ALL_PROBLEMS[index];
  return { dateKey: date.toISOString().slice(0, 10), topic, problem };
}

export async function getDailyChallengeForUser(
  userId: number | undefined,
  date: Date = new Date(),
): Promise<DailyChallenge & { solved: boolean }> {
  const challenge = pickDailyChallenge(date);

  if (!userId) {
    return { ...challenge, solved: false };
  }

  const row = await prisma.dsaProblemProgress.findUnique({
    where: {
      userId_topicSlug_problemId: { userId, topicSlug: challenge.topic, problemId: challenge.problem.id },
    },
    select: { status: true },
  });

  return { ...challenge, solved: row?.status === "solved" };
}
