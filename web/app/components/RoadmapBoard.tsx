"use client";

import { ChevronDown, Search, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { Roadmap } from "@/lib/roadmaps/content";

type Props = {
  roadmaps: Roadmap[];
  initialProgress: Record<string, string[]>;
  signedIn: boolean;
};

export function RoadmapBoard({ roadmaps, initialProgress, signedIn }: Props) {
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(roadmaps.map((r) => [r.slug, new Set(initialProgress[r.slug] ?? [])])),
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return roadmaps;

    return roadmaps.filter((roadmap) => {
      const haystack = [
        roadmap.title,
        roadmap.tagline,
        ...roadmap.keywords,
        ...roadmap.stages.flatMap((stage) => [stage.title, ...stage.steps.map((s) => s.title)]),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [query, roadmaps]);

  function statsFor(roadmap: Roadmap) {
    const done = completed[roadmap.slug]?.size ?? 0;
    const total = roadmap.stages.reduce((sum, stage) => sum + stage.steps.length, 0);
    return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
  }

  async function toggleStep(slug: string, stepId: string, next: boolean) {
    setCompleted((prev) => {
      const set = new Set(prev[slug] ?? []);
      if (next) set.add(stepId);
      else set.delete(stepId);
      return { ...prev, [slug]: set };
    });

    try {
      await fetch(`/api/roadmap/${slug}/steps/${stepId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: next }),
      });
    } catch {
      // Local state already reflects the change; a failed sync corrects itself
      // on the next load rather than yanking the checkbox back mid-click.
    }
  }

  return (
    <>
      <div className="roadmap-search">
        <span className="roadmap-search-icon">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search roadmaps — try web3, react, security…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search">
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="problem-empty-state">
          <strong>No roadmap matches “{query}”</strong>
          <span>Try a broader word, like “web”, “data”, or “security”.</span>
        </div>
      ) : (
        <div className="roadmap-grid">
          {filtered.map((roadmap) => {
            const open = openSlug === roadmap.slug;
            const stats = statsFor(roadmap);

            return (
              <article
                key={roadmap.slug}
                className={`roadmap-card ${roadmap.accent}${open ? " open" : ""}`}
              >
                <div className="card-top" />

                <button
                  className="roadmap-card-head"
                  onClick={() => setOpenSlug(open ? null : roadmap.slug)}
                  aria-expanded={open}
                >
                  <div className="roadmap-card-title">
                    <h3>{roadmap.title}</h3>
                    <p>{roadmap.tagline}</p>
                  </div>

                  <div className="roadmap-card-meta">
                    <span className="roadmap-card-count">
                      {stats.done} / {stats.total}
                    </span>
                    <ChevronDown size={18} className="roadmap-chevron" />
                  </div>
                </button>

                <div className="roadmap-card-bar">
                  <div className="roadmap-card-fill" style={{ width: `${stats.percent}%` }} />
                </div>

                {open && (
                  <div className="roadmap-stages">
                    {roadmap.stages.map((stage, index) => (
                      <section key={stage.title} className="roadmap-stage">
                        <div className="roadmap-stage-head">
                          <span className="roadmap-stage-index">{index + 1}</span>
                          <div>
                            <h4>{stage.title}</h4>
                            <p>{stage.summary}</p>
                          </div>
                        </div>

                        <ul className="roadmap-steps">
                          {stage.steps.map((step) => {
                            const isDone = completed[roadmap.slug]?.has(step.id) ?? false;

                            return (
                              <li key={step.id} className={isDone ? "done" : undefined}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={isDone}
                                    disabled={!signedIn}
                                    onChange={(e) => toggleStep(roadmap.slug, step.id, e.target.checked)}
                                  />
                                  <span>
                                    <strong>{step.title}</strong>
                                    <em>{step.detail}</em>
                                  </span>
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    ))}

                    {!signedIn && (
                      <p className="roadmap-signin-note">
                        Sign in to tick steps off and keep your progress.
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
