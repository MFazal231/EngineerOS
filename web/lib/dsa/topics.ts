import {
  arrayProblems,
  binarySearchProblems,
  stringProblems,
  twoPointersProblems,
  stackProblems,
  slidingWindowProblems,
  linkedListProblems,
  treeProblems,
  trieProblems,
  heapProblems,
  backtrackingProblems,
  graphProblems,
  advancedGraphProblems,
  oneDDpProblems,
  intervalProblems,
  greedyProblems,
  twoDDpProblems,
  bitManipulationProblems,
  mathGeometryProblems,
  type DsaProblem,
} from "./problems";

export type TopicSlug =
  | "arrays"
  | "strings"
  | "two-pointers"
  | "sliding-window"
  | "stack"
  | "binary-search"
  | "linked-list"
  | "trees"
  | "tries"
  | "heap-priority-queue"
  | "backtracking"
  | "graphs"
  | "advanced-graphs"
  | "dp-1d"
  | "intervals"
  | "greedy"
  | "dp-2d"
  | "bit-manipulation"
  | "math-geometry";

const DIFFICULTY_RANK: Record<DsaProblem["difficulty"], number> = { Easy: 1, Medium: 2, Hard: 3 };

/**
 * Orders a topic's problems Easy -> Medium -> Hard (stable, so problems within
 * the same difficulty keep their original relative order) so that working
 * through a topic top-to-bottom, or following "Continue Practicing"/the AI
 * widget's suggestion, always builds from foundational to advanced instead of
 * jumping around. Sorting only reorders the array — each problem keeps its
 * own `id`, so existing per-user progress rows still point at the right one.
 */
function bySeniority(problems: DsaProblem[]): DsaProblem[] {
  return [...problems].sort((a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty]);
}

// Topic order follows the standard NeetCode-style learning path: broad,
// foundational patterns first, narrowing into more specialized and advanced
// territory later. This is also the order "Continue Practicing" and the AI
// Engineer widget walk when picking the next problem to suggest.
export const DSA_TOPICS: Record<TopicSlug, { slug: TopicSlug; name: string; problems: DsaProblem[] }> = {
  arrays: { slug: "arrays", name: "Arrays & Hashing", problems: bySeniority(arrayProblems) },
  strings: { slug: "strings", name: "Strings", problems: bySeniority(stringProblems) },
  "two-pointers": { slug: "two-pointers", name: "Two Pointers", problems: bySeniority(twoPointersProblems) },
  "sliding-window": {
    slug: "sliding-window",
    name: "Sliding Window",
    problems: bySeniority(slidingWindowProblems),
  },
  stack: { slug: "stack", name: "Stack", problems: bySeniority(stackProblems) },
  "binary-search": { slug: "binary-search", name: "Binary Search", problems: bySeniority(binarySearchProblems) },
  "linked-list": { slug: "linked-list", name: "Linked List", problems: bySeniority(linkedListProblems) },
  trees: { slug: "trees", name: "Trees", problems: bySeniority(treeProblems) },
  tries: { slug: "tries", name: "Tries", problems: bySeniority(trieProblems) },
  "heap-priority-queue": {
    slug: "heap-priority-queue",
    name: "Heap / Priority Queue",
    problems: bySeniority(heapProblems),
  },
  backtracking: { slug: "backtracking", name: "Backtracking", problems: bySeniority(backtrackingProblems) },
  graphs: { slug: "graphs", name: "Graphs", problems: bySeniority(graphProblems) },
  "advanced-graphs": {
    slug: "advanced-graphs",
    name: "Advanced Graphs",
    problems: bySeniority(advancedGraphProblems),
  },
  "dp-1d": { slug: "dp-1d", name: "1-D Dynamic Programming", problems: bySeniority(oneDDpProblems) },
  intervals: { slug: "intervals", name: "Intervals", problems: bySeniority(intervalProblems) },
  greedy: { slug: "greedy", name: "Greedy", problems: bySeniority(greedyProblems) },
  "dp-2d": { slug: "dp-2d", name: "2-D Dynamic Programming", problems: bySeniority(twoDDpProblems) },
  "bit-manipulation": {
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    problems: bySeniority(bitManipulationProblems),
  },
  "math-geometry": { slug: "math-geometry", name: "Math & Geometry", problems: bySeniority(mathGeometryProblems) },
};

export const TOPIC_SLUGS = Object.keys(DSA_TOPICS) as TopicSlug[];

export function isTopicSlug(value: string): value is TopicSlug {
  return value in DSA_TOPICS;
}
