import { arrayProblems, binarySearchProblems, stringProblems, type DsaProblem } from "./problems";

export type TopicSlug = "arrays" | "binary-search" | "strings";

export const DSA_TOPICS: Record<TopicSlug, { slug: TopicSlug; name: string; problems: DsaProblem[] }> = {
  arrays: { slug: "arrays", name: "Arrays", problems: arrayProblems },
  "binary-search": { slug: "binary-search", name: "Binary Search", problems: binarySearchProblems },
  strings: { slug: "strings", name: "Strings", problems: stringProblems },
};

export const TOPIC_SLUGS = Object.keys(DSA_TOPICS) as TopicSlug[];

export function isTopicSlug(value: string): value is TopicSlug {
  return value in DSA_TOPICS;
}
