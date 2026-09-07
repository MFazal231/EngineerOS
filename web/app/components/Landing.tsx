import Link from "next/link";
import { ArrowRight, Code2, Flame, Sparkles, Target } from "lucide-react";
import { DSA_TOPICS, TOPIC_SLUGS } from "@/lib/dsa/topics";

const FEATURES = [
  {
    Icon: Sparkles,
    color: "purple",
    title: "An AI that knows your actual progress",
    body: "Ask what to work on and it answers from your real solved problems and open tasks — not generic advice. It's told not to invent progress you haven't made.",
  },
  {
    Icon: Flame,
    color: "orange",
    title: "Problems ordered to build on each other",
    body: "The full NeetCode 150 set, sorted easiest first within each topic and across topics, so you're never thrown from Contains Duplicate straight into Regular Expression Matching.",
  },
  {
    Icon: Target,
    color: "green",
    title: "A daily mission from your own state",
    body: "Each day it picks your next unsolved problem, your next open project task, and a topic you haven't touched. Checking one off updates your real progress, not a separate checklist.",
  },
  {
    Icon: Code2,
    color: "blue",
    title: "Projects that count toward your streak",
    body: "Break work into tasks and tick them off. Finished tasks feed the same streak and weekly activity as your DSA practice.",
  },
];

export function Landing() {
  const problemCount = TOPIC_SLUGS.reduce((sum, slug) => sum + DSA_TOPICS[slug].problems.length, 0);

  return (
    <main className="main">
      <section className="landing-hero">
        <div className="container">
          <p className="section-label">ENGINEEROS</p>
          {/* The space before the break matters: on mobile the <br> is hidden,
              and without it the two lines run together as "engineeryou". */}
          <h1>
            Build the engineer{" "}
            <br />
            you want to become.
          </h1>
          <p className="landing-sub">
            A single place to track your DSA practice and your projects — with an AI that reads that
            progress and tells you what to do next.
          </p>

          <div className="landing-cta">
            <Link href="/auth" className="landing-primary">
              Create an account <ArrowRight size={15} />
            </Link>
            <Link href="/dsa" className="landing-secondary">
              Browse the problems first
            </Link>
          </div>

          <p className="landing-meta">
            {problemCount} problems · {TOPIC_SLUGS.length} topics · free to use right now
          </p>
        </div>
      </section>

      <section className="landing-features">
        <div className="container">
          <div className="landing-feature-grid">
            {FEATURES.map(({ Icon, color, title, body }) => (
              <article key={title} className={`landing-feature ${color}`}>
                <div className="card-top" />
                <div className="landing-feature-content">
                  <span className="landing-feature-icon">
                    <Icon size={20} />
                  </span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="landing-footer-cta">
            <div>
              <h3>Ready to start?</h3>
              <p>Takes about ten seconds — name, email, password.</p>
            </div>
            <Link href="/auth" className="landing-primary">
              Get started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
