import { describe, it, expect } from "vitest";
import { computeStreak } from "./dashboardStats";

const NOW = new Date("2026-09-07T15:00:00.000Z");

function days(...isoDates: string[]) {
  return new Set(isoDates);
}

describe("computeStreak", () => {
  it("is zero with no activity at all", () => {
    expect(computeStreak(days(), NOW)).toBe(0);
  });

  it("counts today alone as a one-day streak", () => {
    expect(computeStreak(days("2026-09-07"), NOW)).toBe(1);
  });

  it("counts consecutive days ending today", () => {
    expect(computeStreak(days("2026-09-07", "2026-09-06", "2026-09-05"), NOW)).toBe(3);
  });

  // The forgiving part: you haven't acted yet today, but yesterday counts,
  // so the streak is still alive rather than reset to zero.
  it("stays alive when today is empty but yesterday wasn't", () => {
    expect(computeStreak(days("2026-09-06", "2026-09-05"), NOW)).toBe(2);
  });

  it("breaks after two empty days in a row", () => {
    expect(computeStreak(days("2026-09-05", "2026-09-04"), NOW)).toBe(0);
  });

  it("stops at the first gap rather than counting older clusters", () => {
    const dates = days("2026-09-07", "2026-09-06", "2026-09-03", "2026-09-02");
    expect(computeStreak(dates, NOW)).toBe(2);
  });

  it("ignores dates in the future", () => {
    expect(computeStreak(days("2026-09-09", "2026-09-08"), NOW)).toBe(0);
  });

  it("counts a long unbroken run", () => {
    const dates = new Set<string>();
    for (let i = 0; i < 30; i += 1) {
      const d = new Date(NOW);
      d.setUTCDate(d.getUTCDate() - i);
      dates.add(d.toISOString().slice(0, 10));
    }
    expect(computeStreak(dates, NOW)).toBe(30);
  });
});
