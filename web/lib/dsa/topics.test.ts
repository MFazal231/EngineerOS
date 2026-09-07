import { describe, it, expect } from "vitest";
import { DSA_TOPICS, TOPIC_SLUGS, isTopicSlug } from "./topics";

const DIFFICULTY_RANK = { Easy: 1, Medium: 2, Hard: 3 } as const;

describe("DSA topic registry", () => {
  it("exposes every registered topic in TOPIC_SLUGS", () => {
    expect(TOPIC_SLUGS.sort()).toEqual(Object.keys(DSA_TOPICS).sort());
  });

  it("keys each entry by its own slug", () => {
    for (const slug of TOPIC_SLUGS) {
      expect(DSA_TOPICS[slug].slug).toBe(slug);
    }
  });

  it("recognises real slugs and rejects made-up ones", () => {
    expect(isTopicSlug("arrays")).toBe(true);
    expect(isTopicSlug("not-a-topic")).toBe(false);
  });
});

describe("problem data integrity", () => {
  // Problem ids are half of the composite key used to store per-user progress
  // (userId + topicSlug + problemId). A duplicate id inside a topic would make
  // two problems silently share one progress row.
  it("has unique problem ids within every topic", () => {
    for (const slug of TOPIC_SLUGS) {
      const ids = DSA_TOPICS[slug].problems.map((p) => p.id);
      expect(new Set(ids).size, `duplicate problem id in "${slug}"`).toBe(ids.length);
    }
  });

  it("has no duplicate problem titles within a topic", () => {
    for (const slug of TOPIC_SLUGS) {
      const titles = DSA_TOPICS[slug].problems.map((p) => p.title);
      expect(new Set(titles).size, `duplicate title in "${slug}"`).toBe(titles.length);
    }
  });

  it("gives every problem a title, description, difficulty and working-looking url", () => {
    for (const slug of TOPIC_SLUGS) {
      for (const problem of DSA_TOPICS[slug].problems) {
        const where = `${slug} #${problem.id}`;
        expect(problem.title.trim(), where).not.toBe("");
        expect(problem.description.trim(), where).not.toBe("");
        expect(["Easy", "Medium", "Hard"], where).toContain(problem.difficulty);
        expect(problem.url, where).toMatch(/^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/$/);
        expect(problem.topics.length, where).toBeGreaterThan(0);
      }
    }
  });

  it("orders each topic's problems easiest first", () => {
    for (const slug of TOPIC_SLUGS) {
      const ranks = DSA_TOPICS[slug].problems.map((p) => DIFFICULTY_RANK[p.difficulty]);
      const sorted = [...ranks].sort((a, b) => a - b);
      expect(ranks, `"${slug}" is not ordered easy-to-hard`).toEqual(sorted);
    }
  });

  it("has at least one problem in every active topic", () => {
    for (const slug of TOPIC_SLUGS) {
      expect(DSA_TOPICS[slug].problems.length, `"${slug}" is empty`).toBeGreaterThan(0);
    }
  });
});
