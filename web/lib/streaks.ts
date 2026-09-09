/**
 * Streak math, shared by the dashboard and Insights so they can't drift
 * apart the way they briefly did before this file existed.
 */

export const FREEZES_PER_MONTH = 2;

export type StreakResult = {
  current: number;
  longest: number;
  /** How many freezes this month's budget has already spent. */
  freezesUsed: number;
  /** How many of this month's freezes are still available to spend. */
  freezesRemaining: number;
  /** Calendar dates (YYYY-MM-DD) a freeze covered, most recent first. */
  frozenDates: string[];
};

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, delta: number): Date {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + delta);
  return next;
}

function monthOf(dateStr: string): string {
  return dateStr.slice(0, 7);
}

/**
 * The longest run ever achieved, as a plain historical fact — freezes are not
 * retroactively applied here. "Current streak" is the number worth protecting
 * with a freeze; "longest streak" is a record of what actually happened, and
 * rewriting history to flatter it would make the record meaningless.
 */
export function computeLongestStreak(activityDates: Set<string>): number {
  if (activityDates.size === 0) return 0;

  const sorted = [...activityDates].sort();
  let longest = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i += 1) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00Z`);
    const curr = new Date(`${sorted[i]}T00:00:00Z`);
    const gap = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);

    run = gap === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  return longest;
}

/**
 * Current streak, with up to FREEZES_PER_MONTH freezes per calendar month
 * able to bridge an isolated single missed day without breaking the count.
 *
 * A freeze only covers a lone gap — the day immediately before it (older)
 * must itself be active. Two consecutive missed days never get frozen, even
 * with budget to spare: that matches how streak freezes work elsewhere (one
 * freeze, one day), and a mechanic that resurrects a multi-day break would
 * make the number stop meaning "you kept showing up."
 *
 * `now` is injectable so tests don't depend on the clock.
 */
export function computeStreak(activityDates: Set<string>, now: Date = new Date()): StreakResult {
  const longest = computeLongestStreak(activityDates);
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const currentMonth = monthOf(dateKey(today));

  let cursor = new Date(today);
  if (!activityDates.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1);
    if (!activityDates.has(dateKey(cursor))) {
      return { current: 0, longest, freezesUsed: 0, freezesRemaining: FREEZES_PER_MONTH, frozenDates: [] };
    }
  }

  let current = 0;
  const freezesUsedByMonth = new Map<string, number>();
  const frozenDates: string[] = [];

  for (;;) {
    const key = dateKey(cursor);

    if (activityDates.has(key)) {
      current += 1;
      cursor = addDays(cursor, -1);
      continue;
    }

    const olderKey = dateKey(addDays(cursor, -1));
    if (!activityDates.has(olderKey)) break; // start of a real, un-freezable break

    const month = monthOf(key);
    const usedThisMonth = freezesUsedByMonth.get(month) ?? 0;
    if (usedThisMonth >= FREEZES_PER_MONTH) break; // budget exhausted for that gap's month

    freezesUsedByMonth.set(month, usedThisMonth + 1);
    frozenDates.push(key);
    cursor = addDays(cursor, -1);
  }

  const usedThisCalendarMonth = freezesUsedByMonth.get(currentMonth) ?? 0;

  return {
    current,
    longest,
    freezesUsed: frozenDates.length,
    freezesRemaining: FREEZES_PER_MONTH - usedThisCalendarMonth,
    frozenDates,
  };
}
