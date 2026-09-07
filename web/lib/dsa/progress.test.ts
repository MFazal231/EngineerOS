import { describe, it, expect } from "vitest";
import { computeTopicStats, computeOverallStats, computeContinuePractice, type ProgressMap } from "./progress";
import { DSA_TOPICS, TOPIC_SLUGS, type TopicSlug } from "./topics";

function emptyProgress(): ProgressMap {
  return Object.fromEntries(TOPIC_SLUGS.map((slug) => [slug, {}])) as ProgressMap;
}

function firstProblemId(slug: TopicSlug, index = 0) {
  return DSA_TOPICS[slug].problems[index].id;
}

describe("computeTopicStats", () => {
  it("reports zero solved for an untouched topic", () => {
    const stats = computeTopicStats("arrays", emptyProgress());
    expect(stats.solved).toBe(0);
    expect(stats.percent).toBe(0);
    expect(stats.total).toBe(DSA_TOPICS.arrays.problems.length);
  });

  it("counts only solved problems, not in-progress ones", () => {
    const progress = emptyProgress();
    progress.arrays[firstProblemId("arrays", 0)] = "solved";
    progress.arrays[firstProblemId("arrays", 1)] = "in-progress";

    expect(computeTopicStats("arrays", progress).solved).toBe(1);
  });

  it("reaches 100 percent when every problem is solved", () => {
    const progress = emptyProgress();
    for (const problem of DSA_TOPICS.strings.problems) {
      progress.strings[problem.id] = "solved";
    }

    expect(computeTopicStats("strings", progress).percent).toBe(100);
  });
});

describe("computeOverallStats", () => {
  it("sums solved problems across topics", () => {
    const progress = emptyProgress();
    progress.arrays[firstProblemId("arrays")] = "solved";
    progress.strings[firstProblemId("strings")] = "solved";

    expect(computeOverallStats(progress).solved).toBe(2);
  });

  it("counts every non-empty topic as active", () => {
    expect(computeOverallStats(emptyProgress()).activeTopics).toBe(TOPIC_SLUGS.length);
  });
});

describe("computeContinuePractice", () => {
  it("suggests the very first problem for a brand new user", () => {
    const suggestion = computeContinuePractice(emptyProgress());
    expect(suggestion?.topic).toBe(TOPIC_SLUGS[0]);
    expect(suggestion?.problem.id).toBe(firstProblemId(TOPIC_SLUGS[0]));
    expect(suggestion?.status).toBe("not-started");
  });

  // Finishing something already started beats beginning something new,
  // even when the in-progress item sits in a much later topic.
  it("prefers an in-progress problem over an untouched one", () => {
    const progress = emptyProgress();
    progress.trees[firstProblemId("trees")] = "in-progress";

    const suggestion = computeContinuePractice(progress);
    expect(suggestion?.topic).toBe("trees");
    expect(suggestion?.status).toBe("in-progress");
  });

  it("skips solved problems and moves to the next unsolved one", () => {
    const progress = emptyProgress();
    const first = firstProblemId("arrays", 0);
    const second = firstProblemId("arrays", 1);
    progress.arrays[first] = "solved";

    expect(computeContinuePractice(progress)?.problem.id).toBe(second);
  });

  it("returns null once everything is solved", () => {
    const progress = emptyProgress();
    for (const slug of TOPIC_SLUGS) {
      for (const problem of DSA_TOPICS[slug].problems) {
        progress[slug][problem.id] = "solved";
      }
    }

    expect(computeContinuePractice(progress)).toBeNull();
  });
});
