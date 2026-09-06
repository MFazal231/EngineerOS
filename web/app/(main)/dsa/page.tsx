import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { DSA_TOPICS, TOPIC_SLUGS, type TopicSlug } from "@/lib/dsa/topics";
import { getUserProgressMap, computeTopicStats, computeOverallStats, computeContinuePractice } from "@/lib/dsa/progress";

const TOPIC_CARD_COPY: Record<TopicSlug, string> = {
  arrays: "Learn the fundamentals of storing and processing data.",
  strings: "Practice manipulation, searching, and pattern problems.",
  "binary-search": "Master search-space reduction and binary search patterns.",
};

const COMING_SOON = [
  { name: "Hashing", description: "Master hash tables, frequency counting, and fast lookups." },
  {
    name: "Two Pointers",
    description: "Solve array and string problems using pointer-based techniques.",
  },
  {
    name: "Sliding Window",
    description: "Learn efficient techniques for subarray and substring problems.",
  },
  { name: "Linked Lists", description: "Understand nodes, pointers, insertion, and deletion." },
  { name: "Stack & Queue", description: "Learn LIFO and FIFO structures and their applications." },
  {
    name: "Trees",
    description: "Explore hierarchical data structures, traversal, and recursion.",
  },
  { name: "Graphs", description: "Practice graph traversal, connectivity, and shortest paths." },
  {
    name: "Dynamic Programming",
    description: "Learn to break complex problems into reusable subproblems.",
  },
  { name: "Greedy", description: "Build solutions by making locally optimal decisions." },
];

function topicTitle(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function DsaOverviewPage() {
  const user = await getSessionUser();
  const progress = await getUserProgressMap(user?.id);
  const overall = computeOverallStats(progress);
  const continuePractice = computeContinuePractice(progress);

  return (
    <main className="main">
      <section className="dsa-hero">
        <div className="container">
          <div className="dsa-header">
            <div>
              <p className="section-label">LEARN</p>
              <h2>Data Structures &amp; Algorithms</h2>
              <p>Build problem-solving skills through consistent practice.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dsa-section">
        <div className="container">
          <div className="dsa-section-header">
            <div>
              <p className="section-label">ROADMAP</p>
              <h3>DSA Topics</h3>
            </div>
          </div>

          <div className="dsa-overall-progress">
            <div className="dsa-overall-progress-header">
              <div>
                <p className="section-label">YOUR PROGRESS</p>
                <h3>DSA Progress</h3>
              </div>
              <strong>{overall.percent}%</strong>
            </div>

            <div className="dsa-overall-progress-bar">
              <div className="dsa-overall-progress-fill" style={{ width: `${overall.percent}%` }} />
            </div>

            <div className="dsa-overall-progress-stats">
              <span>
                Problems Solved: <strong>{overall.solved} / {overall.total}</strong>
              </span>
              <span>
                Active Topics: <strong>{overall.activeTopics}</strong>
              </span>
            </div>
          </div>

          <section className="dsa-continue">
            <div className="dsa-section-header">
              <div>
                <p className="section-label">PICK UP WHERE YOU LEFT OFF</p>
                <h3>Continue Practicing</h3>
              </div>
            </div>

            <div className="dsa-continue-card">
              {continuePractice ? (
                <>
                  <div className="dsa-continue-info">
                    <span className="dsa-continue-topic">{topicTitle(continuePractice.topic)}</span>
                    <h4 className="dsa-continue-title">{continuePractice.problem.title}</h4>
                    <span className="dsa-continue-meta">
                      {continuePractice.problem.difficulty} ·{" "}
                      {continuePractice.status === "in-progress" ? "In Progress" : "Not Started"}
                    </span>
                  </div>
                  <Link href={`/dsa/${continuePractice.topic}`} className="dsa-continue-action">
                    Continue <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <div className="dsa-continue-info">
                  <span className="dsa-continue-topic">DSA</span>
                  <h4 className="dsa-continue-title">All caught up!</h4>
                  <span className="dsa-continue-meta">You&apos;ve solved every available DSA problem.</span>
                </div>
              )}
            </div>
          </section>

          <div className="dsa-topics-grid">
            {TOPIC_SLUGS.map((slug) => {
              const stats = computeTopicStats(slug, progress);
              return (
                <Link key={slug} href={`/dsa/${slug}`} className="dsa-topic-card">
                  <div className="dsa-topic-card-header">
                    <h4>{DSA_TOPICS[slug].name}</h4>
                    <span className="topic-status active">Active</span>
                  </div>

                  <p>{TOPIC_CARD_COPY[slug]}</p>

                  <div className="dsa-topic-progress">
                    <div className="dsa-topic-progress-header">
                      <span>Progress</span>
                      <strong>{stats.percent}%</strong>
                    </div>
                    <div className="dsa-topic-progress-bar">
                      <div className="dsa-topic-progress-fill" style={{ width: `${stats.percent}%` }} />
                    </div>
                    <span>
                      {stats.solved} / {stats.total} solved
                    </span>
                  </div>

                  <span className="topic-action">
                    Open Topic <ArrowRight size={13} />
                  </span>
                </Link>
              );
            })}

            {COMING_SOON.map((topic) => (
              <article className="dsa-topic-card" key={topic.name}>
                <div className="dsa-topic-card-header">
                  <h4>{topic.name}</h4>
                  <span className="topic-status">Coming Soon</span>
                </div>
                <p>{topic.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
