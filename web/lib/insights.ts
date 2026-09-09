import { prisma } from "@/lib/prisma";
import { DSA_TOPICS, type TopicSlug } from "@/lib/dsa/topics";
import { computeStreak, FREEZES_PER_MONTH } from "@/lib/streaks";
import { getActivityEvents, toActivityDates, type ActivityEvent } from "@/lib/activity";

export const HEATMAP_DAYS = 119; // 17 weeks, so the grid comes out square-ish.

export type { ActivityEvent, ActivityKind } from "@/lib/activity";

export type HeatmapDay = { date: string; count: number };

export type Observation = {
  /** Short enough to scan; this is the line people actually read. */
  headline: string;
  detail: string;
  tone: "good" | "warning" | "neutral";
};

export type Insights = {
  totalActions: number;
  currentStreak: number;
  longestStreak: number;
  freezesRemaining: number;
  streakFrozen: boolean;
  activeDays: number;
  heatmap: HeatmapDay[];
  busiestWeekday: { day: string; count: number } | null;
  busiestPeriod: { period: string; count: number } | null;
  topTopic: { name: string; solved: number } | null;
  observations: Observation[];
  recent: ActivityEvent[];
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000);
}

/**
 * Hour and weekday as the user experienced them, not as the server's clock
 * saw them. Without this, someone coding at 9pm in Delhi on a server running
 * UTC gets told they work "late at night" on the wrong day — which would
 * discredit the one thing this page is selling.
 */
function localParts(d: Date, timezone: string | null): { hour: number; weekday: number } {
  if (!timezone) {
    return { hour: d.getUTCHours(), weekday: d.getUTCDay() };
  }

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
      weekday: "short",
    }).formatToParts(d);

    const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
    const weekdayName = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayName);

    return { hour: hour % 24, weekday: weekday === -1 ? 0 : weekday };
  } catch {
    return { hour: d.getUTCHours(), weekday: d.getUTCDay() };
  }
}

function periodOf(hour: number): string {
  if (hour < 6) return "late at night";
  if (hour < 12) return "in the morning";
  if (hour < 18) return "in the afternoon";
  return "in the evening";
}

export async function getInsights(userId: number): Promise<Insights> {
  const now = new Date();

  const [account, events, dsaRows, projects, roadmapRows] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } }),
    getActivityEvents(userId),
    prisma.dsaProblemProgress.findMany({
      where: { userId, status: "solved" },
      select: { topicSlug: true },
    }),
    prisma.project.findMany({
      where: { userId },
      select: { id: true, name: true, createdAt: true, tasks: { select: { done: true, updatedAt: true } } },
    }),
    prisma.roadmapProgress.findMany({ where: { userId, done: true }, select: { roadmapSlug: true } }),
  ]);

  const dayCounts = new Map<string, number>();
  const weekdayCounts = new Array(7).fill(0);
  const periodCounts = new Map<string, number>();

  const timezone = account?.timezone ?? null;

  for (const event of events) {
    const key = dateKey(event.at);
    dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);

    const { hour, weekday } = localParts(event.at, timezone);
    weekdayCounts[weekday] += 1;
    const period = periodOf(hour);
    periodCounts.set(period, (periodCounts.get(period) ?? 0) + 1);
  }

  const heatmap: HeatmapDay[] = [];
  for (let i = HEATMAP_DAYS; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    heatmap.push({ date: key, count: dayCounts.get(key) ?? 0 });
  }

  const activeDaySet = toActivityDates(events);
  const { current, longest, freezesRemaining, frozenDates } = computeStreak(activeDaySet, now);

  const busiestWeekdayIndex = weekdayCounts.indexOf(Math.max(...weekdayCounts));
  const busiestWeekday =
    events.length > 0 ? { day: WEEKDAYS[busiestWeekdayIndex], count: weekdayCounts[busiestWeekdayIndex] } : null;

  let busiestPeriod: Insights["busiestPeriod"] = null;
  for (const [period, count] of periodCounts) {
    if (!busiestPeriod || count > busiestPeriod.count) busiestPeriod = { period, count };
  }

  const solvedByTopic = new Map<string, number>();
  for (const row of dsaRows) {
    solvedByTopic.set(row.topicSlug, (solvedByTopic.get(row.topicSlug) ?? 0) + 1);
  }

  let topTopic: Insights["topTopic"] = null;
  for (const [slug, solved] of solvedByTopic) {
    const name = DSA_TOPICS[slug as TopicSlug]?.name ?? slug;
    if (!topTopic || solved > topTopic.solved) topTopic = { name, solved };
  }

  return {
    totalActions: events.length,
    currentStreak: current,
    longestStreak: longest,
    freezesRemaining,
    streakFrozen: frozenDates.length > 0,
    activeDays: activeDaySet.size,
    heatmap,
    busiestWeekday,
    busiestPeriod,
    topTopic,
    observations: buildObservations({
      events,
      now,
      projects,
      roadmapRows,
      busiestWeekday,
      busiestPeriod,
      current,
      longest,
      frozenDates,
    }),
    recent: events.slice(0, 8),
  };
}

type ObservationInput = {
  events: ActivityEvent[];
  now: Date;
  projects: { id: number; name: string; createdAt: Date; tasks: { done: boolean; updatedAt: Date }[] }[];
  roadmapRows: { roadmapSlug: string }[];
  busiestWeekday: Insights["busiestWeekday"];
  busiestPeriod: Insights["busiestPeriod"];
  current: number;
  longest: number;
  frozenDates: string[];
};

/**
 * The point of the whole page: statements about what this person actually did,
 * which no general-purpose assistant could make. Every one is derived from
 * stored timestamps — nothing here is guessed or generic encouragement.
 */
function buildObservations(input: ObservationInput): Observation[] {
  const { events, now, projects, roadmapRows, busiestWeekday, busiestPeriod, current, longest, frozenDates } = input;
  const out: Observation[] = [];

  if (events.length === 0) {
    return [
      {
        headline: "Nothing to reflect back yet",
        detail:
          "Solve a problem, finish a task, or tick a roadmap step, and this page starts telling you what your habits actually look like.",
        tone: "neutral",
      },
    ];
  }

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const lastWeek = events.filter((e) => e.at >= weekAgo).length;

  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const weekBefore = events.filter((e) => e.at >= twoWeeksAgo && e.at < weekAgo).length;

  if (lastWeek === 0) {
    const daysSince = daysBetween(now, events[0].at);
    out.push({
      headline: `Nothing logged for ${daysSince} day${daysSince === 1 ? "" : "s"}`,
      detail: `Your last activity was “${events[0].label}”. Your longest streak was ${longest} day${longest === 1 ? "" : "s"} — that's the version of you this is waiting on.`,
      tone: "warning",
    });
  } else if (weekBefore > 0 && lastWeek < weekBefore / 2) {
    out.push({
      headline: "You've slowed down noticeably",
      detail: `${lastWeek} action${lastWeek === 1 ? "" : "s"} this week against ${weekBefore} the week before. Not a judgement — just what the data says.`,
      tone: "warning",
    });
  } else if (lastWeek > weekBefore && weekBefore > 0) {
    out.push({
      headline: "You're speeding up",
      detail: `${lastWeek} action${lastWeek === 1 ? "" : "s"} this week, up from ${weekBefore}. Whatever changed, it's working.`,
      tone: "good",
    });
  }

  if (frozenDates.length > 0) {
    const dayWord = frozenDates.length === 1 ? "day" : "days";
    out.push({
      headline: `A streak freeze covered ${frozenDates.length} missed ${dayWord}`,
      detail: `You get ${FREEZES_PER_MONTH} a month for exactly this — a day you miss without losing what you built.`,
      tone: "neutral",
    });
  }

  if (busiestWeekday && busiestWeekday.count >= 3) {
    const share = Math.round((busiestWeekday.count / events.length) * 100);
    if (share >= 30) {
      out.push({
        headline: `${busiestWeekday.day} is your day`,
        detail: `${share}% of everything you've done here happened on a ${busiestWeekday.day}. Worth knowing when you plan the rest of your week.`,
        tone: "neutral",
      });
    }
  }

  if (busiestPeriod && busiestPeriod.count >= 3) {
    out.push({
      headline: `You work ${busiestPeriod.period}`,
      detail: `${busiestPeriod.count} of your ${events.length} logged actions happened ${busiestPeriod.period}.`,
      tone: "neutral",
    });
  }

  // Projects that were started and then quietly dropped.
  const stalled = projects.filter((p) => {
    const open = p.tasks.filter((t) => !t.done).length;
    if (open === 0) return false;
    const lastTouch = p.tasks.reduce<Date>((latest, t) => (t.updatedAt > latest ? t.updatedAt : latest), p.createdAt);
    return daysBetween(now, lastTouch) >= 14;
  });

  if (stalled.length > 0) {
    const names = stalled.slice(0, 2).map((p) => `“${p.name}”`).join(" and ");
    out.push({
      headline: `${stalled.length} project${stalled.length === 1 ? "" : "s"} sitting untouched`,
      detail: `${names} ${stalled.length === 1 ? "has" : "have"} open tasks nobody has touched in over two weeks.`,
      tone: "warning",
    });
  }

  const emptyProjects = projects.filter((p) => p.tasks.length === 0);
  if (emptyProjects.length >= 2) {
    out.push({
      headline: "You start projects without breaking them down",
      detail: `${emptyProjects.length} of your projects have no tasks at all. That's usually where things stall before they've begun.`,
      tone: "warning",
    });
  }

  const roadmapSlugs = new Set(roadmapRows.map((r) => r.roadmapSlug));
  if (roadmapSlugs.size >= 3) {
    out.push({
      headline: `You've dipped into ${roadmapSlugs.size} roadmaps`,
      detail: "Breadth is fine early on, but finishing one path tends to teach more than starting several.",
      tone: "neutral",
    });
  }

  if (current > 0 && current === longest && current >= 3) {
    out.push({
      headline: `${current} days — your best run yet`,
      detail: "This is the longest streak you've had here. Everything after today is new ground.",
      tone: "good",
    });
  }

  return out.slice(0, 5);
}
