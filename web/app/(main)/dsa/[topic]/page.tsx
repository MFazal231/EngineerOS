import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { DSA_TOPICS, isTopicSlug } from "@/lib/dsa/topics";
import { getUserProgressMap } from "@/lib/dsa/progress";
import { DsaProblemBoard } from "@/app/components/DsaProblemBoard";

const TOPIC_COPY: Record<string, { label: string; description: string }> = {
  arrays: {
    label: "DSA / ARRAYS & HASHING",
    description: "Practice array and hash table problems and strengthen your problem-solving skills.",
  },
  "binary-search": {
    label: "DSA / BINARY SEARCH",
    description: "Master search-space reduction and binary search patterns.",
  },
  strings: {
    label: "DSA / STRINGS",
    description: "Practice manipulation, searching, and pattern problems.",
  },
  "two-pointers": {
    label: "DSA / TWO POINTERS",
    description: "Solve array and string problems using pointer-based techniques.",
  },
  stack: {
    label: "DSA / STACK",
    description: "Learn LIFO structures and monotonic-stack techniques.",
  },
  "sliding-window": {
    label: "DSA / SLIDING WINDOW",
    description: "Learn efficient techniques for subarray and substring problems.",
  },
  "linked-list": {
    label: "DSA / LINKED LIST",
    description: "Understand nodes, pointers, insertion, and deletion.",
  },
  trees: {
    label: "DSA / TREES",
    description: "Explore hierarchical data structures, traversal, and recursion.",
  },
  tries: {
    label: "DSA / TRIES",
    description: "Practice prefix trees for fast string search and autocomplete.",
  },
  "heap-priority-queue": {
    label: "DSA / HEAP & PRIORITY QUEUE",
    description: "Practice priority-based problems with heaps.",
  },
  backtracking: {
    label: "DSA / BACKTRACKING",
    description: "Explore recursive search over all valid combinations.",
  },
  graphs: {
    label: "DSA / GRAPHS",
    description: "Practice graph traversal, connectivity, and shortest paths.",
  },
  "advanced-graphs": {
    label: "DSA / ADVANCED GRAPHS",
    description: "Tackle weighted graphs, shortest paths, and minimum spanning trees.",
  },
  "dp-1d": {
    label: "DSA / 1-D DYNAMIC PROGRAMMING",
    description: "Learn to break complex problems into reusable subproblems.",
  },
  intervals: {
    label: "DSA / INTERVALS",
    description: "Practice merging, scheduling, and sweeping over ranges.",
  },
  greedy: {
    label: "DSA / GREEDY",
    description: "Build solutions by making locally optimal decisions.",
  },
  "dp-2d": {
    label: "DSA / 2-D DYNAMIC PROGRAMMING",
    description: "Extend dynamic programming to two-dimensional state spaces.",
  },
  "bit-manipulation": {
    label: "DSA / BIT MANIPULATION",
    description: "Practice bitwise tricks and binary representations.",
  },
  "math-geometry": {
    label: "DSA / MATH & GEOMETRY",
    description: "Practice math, simulation, and matrix geometry problems.",
  },
};

export default async function DsaTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;

  if (!isTopicSlug(topic)) {
    notFound();
  }

  const user = await getSessionUser();
  const progress = await getUserProgressMap(user?.id);
  const topicData = DSA_TOPICS[topic];
  const copy = TOPIC_COPY[topic];

  return (
    <main className="main">
      <section className="dsa-hero">
        <div className="container">
          <div className="dsa-header">
            <div>
              <p className="section-label">{copy.label}</p>
              <h2>{topicData.name}</h2>
              <p>{copy.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dsa-section">
        <div className="container">
          <DsaProblemBoard topic={topic} problems={topicData.problems} initialStatuses={progress[topic]} />
        </div>
      </section>
    </main>
  );
}
