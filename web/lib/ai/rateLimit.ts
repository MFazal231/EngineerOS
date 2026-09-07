import { prisma } from "@/lib/prisma";

/**
 * Per-user daily cap on AI calls. The provider quota (currently Gemini's
 * free tier, 1,000/day) is shared by every user on one API key, so without
 * this a single person refreshing or spamming chat could exhaust it for
 * everyone. Both the chat and the dashboard's "what to do next" refinement
 * draw from this same budget, and both degrade gracefully when it runs out.
 */
export const DAILY_AI_LIMIT = 30;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export type AiBudget = { allowed: boolean; used: number; limit: number };

/**
 * Records one AI call against today's budget and reports whether it was
 * within the limit. Counting first (rather than checking then counting)
 * keeps it a single atomic statement, so concurrent requests can't both
 * slip past the cap.
 */
export async function consumeAiCredit(userId: number): Promise<AiBudget> {
  const day = today();

  try {
    const row = await prisma.aiUsage.upsert({
      where: { userId_day: { userId, day } },
      update: { count: { increment: 1 } },
      create: { userId, day, count: 1 },
    });

    return { allowed: row.count <= DAILY_AI_LIMIT, used: row.count, limit: DAILY_AI_LIMIT };
  } catch (error) {
    // Never let a bookkeeping failure block the actual feature.
    console.warn("consumeAiCredit failed, allowing the call:", error);
    return { allowed: true, used: 0, limit: DAILY_AI_LIMIT };
  }
}

export async function getAiUsageToday(userId: number): Promise<AiBudget> {
  const day = today();
  const row = await prisma.aiUsage.findUnique({ where: { userId_day: { userId, day } } });
  const used = row?.count ?? 0;

  return { allowed: used < DAILY_AI_LIMIT, used, limit: DAILY_AI_LIMIT };
}
