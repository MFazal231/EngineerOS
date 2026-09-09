import { describe, it, expect } from "vitest";
import { dsaMilestone, streakMilestone } from "./milestones";

describe("dsaMilestone", () => {
  it("is locked below the target", () => {
    const m = dsaMilestone(10, 9);
    expect(m.unlocked).toBe(false);
    expect(m.progress).toEqual({ current: 9, target: 10 });
  });

  it("unlocks exactly at the target", () => {
    const m = dsaMilestone(10, 10);
    expect(m.unlocked).toBe(true);
    expect(m.progress).toBeUndefined();
  });

  it("stays unlocked past the target", () => {
    expect(dsaMilestone(10, 50).unlocked).toBe(true);
  });

  it("gives the full-clear target its own title", () => {
    expect(dsaMilestone(159, 159).title).toBe("Cleared the board");
    expect(dsaMilestone(10, 10).title).not.toBe("Cleared the board");
  });

  it("has a distinct title for the very first one", () => {
    expect(dsaMilestone(1, 1).title).toBe("First blood");
  });
});

describe("streakMilestone", () => {
  it("is locked below the target", () => {
    const m = streakMilestone(7, 5);
    expect(m.unlocked).toBe(false);
    expect(m.progress).toEqual({ current: 5, target: 7 });
  });

  it("unlocks exactly at the target", () => {
    expect(streakMilestone(7, 7).unlocked).toBe(true);
  });

  it("mentions the target length in its description", () => {
    expect(streakMilestone(30, 0).description).toContain("30");
  });
});
