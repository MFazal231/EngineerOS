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
  | "binary-search"
  | "strings"
  | "two-pointers"
  | "stack"
  | "sliding-window"
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

export const DSA_TOPICS: Record<TopicSlug, { slug: TopicSlug; name: string; problems: DsaProblem[] }> = {
  arrays: { slug: "arrays", name: "Arrays & Hashing", problems: arrayProblems },
  "binary-search": { slug: "binary-search", name: "Binary Search", problems: binarySearchProblems },
  strings: { slug: "strings", name: "Strings", problems: stringProblems },
  "two-pointers": { slug: "two-pointers", name: "Two Pointers", problems: twoPointersProblems },
  stack: { slug: "stack", name: "Stack", problems: stackProblems },
  "sliding-window": { slug: "sliding-window", name: "Sliding Window", problems: slidingWindowProblems },
  "linked-list": { slug: "linked-list", name: "Linked List", problems: linkedListProblems },
  trees: { slug: "trees", name: "Trees", problems: treeProblems },
  tries: { slug: "tries", name: "Tries", problems: trieProblems },
  "heap-priority-queue": {
    slug: "heap-priority-queue",
    name: "Heap / Priority Queue",
    problems: heapProblems,
  },
  backtracking: { slug: "backtracking", name: "Backtracking", problems: backtrackingProblems },
  graphs: { slug: "graphs", name: "Graphs", problems: graphProblems },
  "advanced-graphs": { slug: "advanced-graphs", name: "Advanced Graphs", problems: advancedGraphProblems },
  "dp-1d": { slug: "dp-1d", name: "1-D Dynamic Programming", problems: oneDDpProblems },
  intervals: { slug: "intervals", name: "Intervals", problems: intervalProblems },
  greedy: { slug: "greedy", name: "Greedy", problems: greedyProblems },
  "dp-2d": { slug: "dp-2d", name: "2-D Dynamic Programming", problems: twoDDpProblems },
  "bit-manipulation": { slug: "bit-manipulation", name: "Bit Manipulation", problems: bitManipulationProblems },
  "math-geometry": { slug: "math-geometry", name: "Math & Geometry", problems: mathGeometryProblems },
};

export const TOPIC_SLUGS = Object.keys(DSA_TOPICS) as TopicSlug[];

export function isTopicSlug(value: string): value is TopicSlug {
  return value in DSA_TOPICS;
}
