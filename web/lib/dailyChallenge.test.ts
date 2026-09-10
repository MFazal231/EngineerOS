import { describe, expect, it } from "vitest";
import { pickDailyChallenge } from "./dailyChallenge";

describe("pickDailyChallenge", () => {
  it("is deterministic for the same UTC day", () => {
    const a = pickDailyChallenge(new Date("2026-09-10T02:00:00Z"));
    const b = pickDailyChallenge(new Date("2026-09-10T22:00:00Z"));
    expect(a).toEqual(b);
  });

  it("changes when the UTC day changes", () => {
    const a = pickDailyChallenge(new Date("2026-09-10T12:00:00Z"));
    const b = pickDailyChallenge(new Date("2026-09-11T12:00:00Z"));
    expect(a.dateKey).not.toBe(b.dateKey);
  });

  it("returns a real problem with a topic and difficulty", () => {
    const { topic, problem } = pickDailyChallenge(new Date("2026-01-01T00:00:00Z"));
    expect(typeof topic).toBe("string");
    expect(problem.id).toBeGreaterThan(0);
    expect(["Easy", "Medium", "Hard"]).toContain(problem.difficulty);
  });

  it("rotates through the full problem set rather than sticking to one topic", () => {
    const topics = new Set<string>();
    for (let i = 0; i < 30; i += 1) {
      const date = new Date(Date.UTC(2026, 0, 1 + i));
      topics.add(pickDailyChallenge(date).topic);
    }
    expect(topics.size).toBeGreaterThan(1);
  });

  it("reports the UTC date key for the given date", () => {
    expect(pickDailyChallenge(new Date("2026-03-15T18:30:00Z")).dateKey).toBe("2026-03-15");
  });
});
