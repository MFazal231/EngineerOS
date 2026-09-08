"use client";

import { Check, ChevronDown, ExternalLink, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Roadmap, RoadmapStage, RoadmapStep } from "@/lib/roadmaps/content";

type MapRow =
  | { kind: "stage"; stage: RoadmapStage; index: number }
  | { kind: "step"; step: RoadmapStep; number: number };

/**
 * Flattens stages and steps into one list so the whole roadmap shares a single
 * lane column. Kept separate per stage, the connector after a stage's last step
 * had nothing to reach and just trailed off beside the next heading.
 */
function buildRows(roadmap: Roadmap): MapRow[] {
  const rows: MapRow[] = [];
  let number = 0;

  roadmap.stages.forEach((stage, index) => {
    rows.push({ kind: "stage", stage, index });

    for (const step of stage.steps) {
      number += 1;
      rows.push({ kind: "step", step, number });
    }
  });

  return rows;
}

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
                    {buildRows(roadmap).map((row, rowIndex, allRows) => {
                      // One unbroken spine: the line keeps running through stage
                      // headers, and stops dead at the final dot rather than
                      // trailing off into nothing.
                      const laterStep = allRows.slice(rowIndex + 1).some((r) => r.kind === "step");
                      const earlierStep = allRows.slice(0, rowIndex).some((r) => r.kind === "step");

                      if (row.kind === "stage") {
                        return (
                          <div className="map-row map-row-stage" key={`stage-${row.index}`}>
                            <div className="map-lane">
                              {earlierStep && laterStep && <Connector bend={row.index % 2 === 0 ? -1 : 1} />}
                            </div>

                            <header className="map-stage-head">
                              <span className="map-stage-badge">Stage {row.index + 1}</span>
                              <h4>{row.stage.title}</h4>
                              <p>{row.stage.summary}</p>

                              <div className="map-resources">
                                <span className="map-resources-label">Learn it from</span>
                                {row.stage.resources.map((resource) => (
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
                          </div>
                        );
                      }

                      const isDone = completed[roadmap.slug]?.has(row.step.id) ?? false;

                      return (
                        <div className={`map-row map-node${isDone ? " done" : ""}`} key={row.step.id}>
                          <div className="map-lane">
                            <button
                              className="map-dot"
                              onClick={() => toggleStep(roadmap.slug, row.step.id, !isDone)}
                              disabled={!signedIn}
                              aria-pressed={isDone}
                              aria-label={
                                isDone
                                  ? `Mark "${row.step.title}" not done`
                                  : `Mark "${row.step.title}" done`
                              }
                              title={signedIn ? "Mark this step" : "Sign in to track progress"}
                            >
                              {isDone ? <Check size={13} strokeWidth={3} /> : <span>{row.number}</span>}
                            </button>

                            {laterStep && <Connector bend={row.number % 2 === 0 ? 1 : -1} />}
                          </div>

                          <div className="map-node-body">
                            <strong>{row.step.title}</strong>
                            <p>{row.step.detail}</p>
                          </div>
                        </div>
                      );
                    })}

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
