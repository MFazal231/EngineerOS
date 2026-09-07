import { describe, it, expect } from "vitest";
import { ROADMAPS, ROADMAP_BY_SLUG, countSteps, searchRoadmaps } from "./content";

describe("roadmap data integrity", () => {
  it("has unique slugs", () => {
    const slugs = ROADMAPS.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  // Step ids are half the key progress is stored under, so a collision would
  // make ticking one step silently tick another.
  it("has globally unique step ids", () => {
    const ids = ROADMAPS.flatMap((r) => r.stages.flatMap((s) => s.steps.map((step) => step.id)));
    expect(new Set(ids).size, "duplicate step id across roadmaps").toBe(ids.length);
  });

  it("gives every roadmap stages, and every stage steps", () => {
    for (const roadmap of ROADMAPS) {
      expect(roadmap.stages.length, `"${roadmap.slug}" has no stages`).toBeGreaterThan(0);

      for (const stage of roadmap.stages) {
        expect(stage.steps.length, `"${roadmap.slug}" / "${stage.title}" has no steps`).toBeGreaterThan(0);
      }
    }
  });

  it("gives every step a title and detail", () => {
    for (const roadmap of ROADMAPS) {
      for (const stage of roadmap.stages) {
        for (const step of stage.steps) {
          expect(step.title.trim(), step.id).not.toBe("");
          expect(step.detail.trim(), step.id).not.toBe("");
        }
      }
    }
  });

  it("indexes every roadmap by slug", () => {
    for (const roadmap of ROADMAPS) {
      expect(ROADMAP_BY_SLUG[roadmap.slug]).toBe(roadmap);
    }
  });

  it("counts steps across all stages", () => {
    for (const roadmap of ROADMAPS) {
      const manual = roadmap.stages.reduce((sum, stage) => sum + stage.steps.length, 0);
      expect(countSteps(roadmap)).toBe(manual);
    }
  });
});

describe("searchRoadmaps", () => {
  it("returns everything for an empty query", () => {
    expect(searchRoadmaps("")).toHaveLength(ROADMAPS.length);
    expect(searchRoadmaps("   ")).toHaveLength(ROADMAPS.length);
  });

  it("finds a roadmap by its title", () => {
    expect(searchRoadmaps("web3").map((r) => r.slug)).toContain("web3");
  });

  it("is case insensitive", () => {
    expect(searchRoadmaps("WEB3").map((r) => r.slug)).toContain("web3");
  });

  // The point of keywords: "solidity" never appears in the Web3 title or
  // tagline, but someone searching it clearly wants that roadmap.
  it("finds a roadmap by keyword rather than title", () => {
    expect(searchRoadmaps("solidity").map((r) => r.slug)).toContain("web3");
    expect(searchRoadmaps("kubernetes").map((r) => r.slug)).toContain("devops");
  });

  it("finds a roadmap by the text of one of its steps", () => {
    expect(searchRoadmaps("reentrancy").map((r) => r.slug)).toContain("web3");
  });

  it("returns nothing for a term no roadmap mentions", () => {
    expect(searchRoadmaps("zzzznotathing")).toHaveLength(0);
  });
});
