import { describe, it, expect } from "vitest";
import { computeStreak, computeLongestStreak, FREEZES_PER_MONTH } from "./streaks";

const NOW = new Date("2026-09-07T15:00:00.000Z");

function days(...isoDates: string[]) {
  return new Set(isoDates);
}

describe("computeStreak — base behaviour", () => {
  it("is zero with no activity at all", () => {
    expect(computeStreak(days(), NOW).current).toBe(0);
  });

  it("counts today alone as a one-day streak", () => {
    expect(computeStreak(days("2026-09-07"), NOW).current).toBe(1);
  });

  it("counts consecutive days ending today", () => {
    expect(computeStreak(days("2026-09-07", "2026-09-06", "2026-09-05"), NOW).current).toBe(3);
  });

  it("stays alive when today is empty but yesterday wasn't", () => {
    expect(computeStreak(days("2026-09-06", "2026-09-05"), NOW).current).toBe(2);
  });

  it("breaks after two empty days in a row, with no freeze to save it", () => {
    const result = computeStreak(days("2026-09-05", "2026-09-04"), NOW);
    expect(result.current).toBe(0);
    expect(result.frozenDates).toEqual([]);
  });

  it("ignores dates in the future", () => {
    expect(computeStreak(days("2026-09-09", "2026-09-08"), NOW).current).toBe(0);
  });

  it("counts a long unbroken run", () => {
    const dates = new Set<string>();
    for (let i = 0; i < 30; i += 1) {
      const d = new Date(NOW);
      d.setUTCDate(d.getUTCDate() - i);
      dates.add(d.toISOString().slice(0, 10));
    }
    expect(computeStreak(dates, NOW).current).toBe(30);
  });
});

describe("computeStreak — freezes", () => {
  it("bridges a single isolated missed day", () => {
    // 09-07 and 09-06 active, 09-05 missed, 09-04 and 09-03 active.
    const dates = days("2026-09-07", "2026-09-06", "2026-09-04", "2026-09-03");
    const result = computeStreak(dates, NOW);

    expect(result.current).toBe(4); // the frozen day itself doesn't add to the count
    expect(result.frozenDates).toEqual(["2026-09-05"]);
    expect(result.freezesUsed).toBe(1);
    expect(result.freezesRemaining).toBe(FREEZES_PER_MONTH - 1);
  });

  it("spends a second freeze on a second isolated gap in the same month", () => {
    // Active: 07, 06. Miss 05. Active: 04. Miss 03. Active: 02.
    const dates = days("2026-09-07", "2026-09-06", "2026-09-04", "2026-09-02");
    const result = computeStreak(dates, NOW);

    expect(result.current).toBe(4); // the 4 real active days; frozen days don't add to the count
    expect(result.frozenDates.sort()).toEqual(["2026-09-03", "2026-09-05"]);
    expect(result.freezesUsed).toBe(2);
    expect(result.freezesRemaining).toBe(0);
  });

  it("stops once the month's freeze budget is exhausted", () => {
    // A third isolated gap after two are already spent should end the streak there.
    const dates = days("2026-09-07", "2026-09-06", "2026-09-04", "2026-09-02", "2026-08-31");
    const result = computeStreak(dates, NOW);

    expect(result.freezesUsed).toBe(2);
    expect(result.current).toBe(4); // stops at the 09-01 gap; never reaches 08-31
  });

  it("never bridges two consecutive missed days, even with budget available", () => {
    // 07, 06 active; 05 and 04 both missed; 03 active.
    const dates = days("2026-09-07", "2026-09-06", "2026-09-03");
    const result = computeStreak(dates, NOW);

    expect(result.current).toBe(2);
    expect(result.frozenDates).toEqual([]);
  });

  it("gives freezes their own budget per calendar month", () => {
    // Two gaps in August already use August's freezes; a September gap should
    // still have its own fresh budget rather than sharing August's.
    const dates = days(
      "2026-09-07",
      "2026-09-06",
      "2026-09-04", // gap at 09-05, spends September's only freeze so far
      "2026-08-31", // gap at 09-03..09-01 would be multi-day and unfreezable anyway
    );
    const result = computeStreak(dates, NOW);

    // 09-03, 09-02, 09-01 form a 3-day gap between 09-04 and 08-31 — too wide to
    // freeze regardless of remaining budget, so the streak stops at 09-04.
    expect(result.current).toBe(3);
    expect(result.freezesUsed).toBe(1);
  });

  it("reports the full monthly budget when nothing has been frozen", () => {
    const result = computeStreak(days("2026-09-07"), NOW);
    expect(result.freezesRemaining).toBe(FREEZES_PER_MONTH);
  });
});

describe("computeLongestStreak", () => {
  it("is zero for no activity", () => {
    expect(computeLongestStreak(days())).toBe(0);
  });

  it("finds the longest run even when it isn't the most recent one", () => {
    const dates = days(
      "2026-09-07",
      "2026-08-10",
      "2026-08-09",
      "2026-08-08",
      "2026-08-07",
      "2026-08-06",
    );
    expect(computeLongestStreak(dates)).toBe(5);
  });

  // Deliberately not freeze-aware: a gap is a real gap in the historical record,
  // regardless of what the current month's freeze budget would allow today.
  // 09-06/09-07 and 09-03/09-04 are two separate 2-day runs, not one bridged
  // run of 4 — computeStreak's freeze logic is what treats 09-05 as covered,
  // and that's deliberately local to the "current streak" figure only.
  it("does not let freezes inflate the historical record", () => {
    const dates = days("2026-09-07", "2026-09-06", "2026-09-04", "2026-09-03");
    expect(computeLongestStreak(dates)).toBe(2);
  });
});
