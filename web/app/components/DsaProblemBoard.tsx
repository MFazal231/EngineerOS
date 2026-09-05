"use client";

import { useMemo, useState } from "react";
import type { DsaProblem, ProblemStatus } from "@/lib/dsa/problems";
import type { TopicSlug } from "@/lib/dsa/topics";

type Filters = {
  difficulty: "all" | "Easy" | "Medium" | "Hard";
  status: "all" | ProblemStatus;
  search: string;
  sort: "default" | "name-asc" | "name-desc" | "difficulty" | "status";
};

const DEFAULT_FILTERS: Filters = { difficulty: "all", status: "all", search: "", sort: "default" };

const DIFFICULTY_ORDER: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
const STATUS_ORDER: Record<string, number> = { "not-started": 1, "in-progress": 2, solved: 3 };

export function DsaProblemBoard({
  topic,
  problems,
  initialStatuses,
}: {
  topic: TopicSlug;
  problems: DsaProblem[];
  initialStatuses: Record<number, ProblemStatus>;
}) {
  const [statuses, setStatuses] = useState<Record<number, ProblemStatus>>(initialStatuses);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const merged = useMemo(
    () => problems.map((p) => ({ ...p, status: statuses[p.id] ?? "not-started" })),
    [problems, statuses],
  );

  const total = merged.length;
  const solved = merged.filter((p) => p.status === "solved").length;
  const inProgress = merged.filter((p) => p.status === "in-progress").length;
  const percent = total === 0 ? 0 : Math.round((solved / total) * 100);

  const filtered = useMemo(() => {
    const searchText = filters.search.toLowerCase();

    const result = merged.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchText) ||
        problem.description.toLowerCase().includes(searchText) ||
        problem.topics.some((t) => t.toLowerCase().includes(searchText));

      const matchesDifficulty = filters.difficulty === "all" || problem.difficulty === filters.difficulty;
      const matchesStatus = filters.status === "all" || problem.status === filters.status;

      return matchesSearch && matchesDifficulty && matchesStatus;
    });

    if (filters.sort === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sort === "name-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (filters.sort === "difficulty") {
      result.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
    } else if (filters.sort === "status") {
      result.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
    }

    return result;
  }, [merged, filters]);

  async function handleStatusChange(problemId: number, status: ProblemStatus) {
    setStatuses((prev) => ({ ...prev, [problemId]: status }));

    try {
      await fetch(`/api/dsa/${topic}/problems/${problemId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      // best-effort sync; local state already reflects the change
    }
  }

  return (
    <>
      <div className="array-progress">
        <div className="array-progress-stats">
          <div className="progress-stat">
            <span>Total</span>
            <strong>{total}</strong>
          </div>
          <div className="progress-stat">
            <span>Solved</span>
            <strong>{solved}</strong>
          </div>
          <div className="progress-stat">
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>
        </div>

        <div className="array-progress-header">
          <span>Progress</span>
          <strong>{percent}%</strong>
        </div>

        <div className="array-progress-bar">
          <div className="array-progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="problem-search">
        <span className="problem-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search problems..."
          autoComplete="off"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
      </div>

      <div className="problem-filter-area">
        <div className="problem-filter-groups">
          <div className="problem-filter-group">
            <span>Difficulty</span>
            <div className="problem-filters">
              {(["all", "Easy", "Medium", "Hard"] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  className={`problem-filter difficulty-filter${filters.difficulty === difficulty ? " active" : ""}`}
                  onClick={() => setFilters((f) => ({ ...f, difficulty }))}
                >
                  {difficulty === "all" ? "All" : difficulty}
                </button>
              ))}
            </div>
          </div>

          <div className="problem-filter-group">
            <span>Status</span>
            <div className="problem-filters">
              {(
                [
                  ["all", "All"],
                  ["not-started", "Not Started"],
                  ["in-progress", "In Progress"],
                  ["solved", "Solved"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  className={`problem-filter status-filter${filters.status === value ? " active" : ""}`}
                  onClick={() => setFilters((f) => ({ ...f, status: value }))}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="problem-filter-actions">
          <div className="problem-sort">
            <label htmlFor="problemSort">Sort by</label>
            <select
              id="problemSort"
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as Filters["sort"] }))}
            >
              <option value="default">Default</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="difficulty">Difficulty</option>
              <option value="status">Status</option>
            </select>
          </div>

          <button className="reset-filters-btn" onClick={() => setFilters(DEFAULT_FILTERS)}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className={`${topic === "arrays" ? "array-problems" : topic === "binary-search" ? "binary-search-problems" : "string-problems"}`}>
        {filtered.length === 0 ? (
          <div className="problem-empty-state">
            <strong>No problems found</strong>
            <span>No problems match your current filters.</span>
          </div>
        ) : (
          filtered.map((problem) => (
            <article className="dsa-problem-card" key={problem.id}>
              <div className="dsa-problem-header">
                <div className="dsa-problem-title">
                  <h4>{problem.title}</h4>
                  <span className={`problem-difficulty ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p>{problem.description}</p>
              </div>

              <div className="dsa-problem-topics">
                {problem.topics.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className="dsa-problem-footer">
                <select
                  className={`problem-status-select status-${problem.status}`}
                  value={problem.status}
                  onChange={(e) => handleStatusChange(problem.id, e.target.value as ProblemStatus)}
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="solved">Solved</option>
                </select>

                <button
                  className="problem-solve-btn"
                  onClick={() => window.open(problem.url, "_blank")}
                >
                  Solve
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
