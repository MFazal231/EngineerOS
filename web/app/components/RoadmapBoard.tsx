"use client";

import { Check, ChevronDown, ExternalLink, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Roadmap } from "@/lib/roadmaps/content";

type Props = {
  roadmaps: Roadmap[];
  initialProgress: Record<string, string[]>;
  signedIn: boolean;
};

/**
 * The dashed connector between two dots. Drawn with preserveAspectRatio="none"
 * so one fixed curve stretches to whatever height the row needs, and
 * non-scaling-stroke so the dashes don't stretch with it. `bend` alternates
 * per step, which is what makes the path wind rather than run straight down.
 */
function Connector({ bend }: { bend: 1 | -1 }) {
  const c = 14 * bend;

  return (
    <svg className="map-link" viewBox="0 0 40 100" preserveAspectRatio="none" aria-hidden="true">
      <path
        d={`M 20 0 C ${20 + c} 30, ${20 - c} 70, 20 100`}
        fill="none"
        strokeWidth="2"
        strokeDasharray="5 6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

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
    if (!signedIn) return;

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
      // on the next load rather than yanking the dot back mid-click.
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
            let stepNumber = 0;

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
                  <div className="roadmap-map">
                    {roadmap.stages.map((stage, stageIndex) => (
                      <section key={stage.title} className="map-stage">
                        <header className="map-stage-head">
                          <span className="map-stage-badge">Stage {stageIndex + 1}</span>
                          <h4>{stage.title}</h4>
                          <p>{stage.summary}</p>

                          <div className="map-resources">
                            <span className="map-resources-label">Learn it from</span>
                            {stage.resources.map((resource) => (
                              <a
                                key={resource.url}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="map-resource"
                              >
                                {resource.label}
                                <em>{resource.note}</em>
                                <ExternalLink size={11} />
                              </a>
                            ))}
                          </div>
                        </header>

                        <ol className="map-nodes">
                          {stage.steps.map((step, stepIndex) => {
                            const isDone = completed[roadmap.slug]?.has(step.id) ?? false;
                            const isLast =
                              stageIndex === roadmap.stages.length - 1 &&
                              stepIndex === stage.steps.length - 1;
                            stepNumber += 1;

                            return (
                              <li key={step.id} className={`map-node${isDone ? " done" : ""}`}>
                                <div className="map-lane">
                                  <button
                                    className="map-dot"
                                    onClick={() => toggleStep(roadmap.slug, step.id, !isDone)}
                                    disabled={!signedIn}
                                    aria-pressed={isDone}
                                    aria-label={
                                      isDone ? `Mark "${step.title}" not done` : `Mark "${step.title}" done`
                                    }
                                    title={signedIn ? "Mark this step" : "Sign in to track progress"}
                                  >
                                    {isDone ? <Check size={13} strokeWidth={3} /> : <span>{stepNumber}</span>}
                                  </button>

                                  {!isLast && <Connector bend={stepIndex % 2 === 0 ? 1 : -1} />}
                                </div>

                                <div className="map-node-body">
                                  <strong>{step.title}</strong>
                                  <p>{step.detail}</p>
                                </div>
                              </li>
                            );
                          })}
                        </ol>
                      </section>
                    ))}

                    <footer className="map-footer">
                      <h5>Certification</h5>
                      <p>{roadmap.certificationNote}</p>

                      {roadmap.certifications.length > 0 && (
                        <div className="map-certs">
                          {roadmap.certifications.map((cert) => (
                            <a
                              key={cert.url + cert.name}
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="map-cert"
                            >
                              <strong>{cert.name}</strong>
                              <span>{cert.provider}</span>
                              <em>{cert.note}</em>
                            </a>
                          ))}
                        </div>
                      )}

                      {!signedIn && (
                        <p className="roadmap-signin-note">
                          Sign in to tick steps off and keep your progress.
                        </p>
                      )}
                    </footer>
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
