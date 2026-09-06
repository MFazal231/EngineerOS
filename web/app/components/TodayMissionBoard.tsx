"use client";

import { CheckCircle2, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Mission } from "@/lib/missions";

type TimerStatus = "not-started" | "running" | "paused";

type LocalState = {
  completed: boolean;
  elapsedSeconds: number;
  status: TimerStatus;
  expanded: boolean;
  pending: boolean;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function timerStorageKey(mission: Mission) {
  return `mission-timer:${mission.key}:${todayKey()}:${mission.title}`;
}

function gitStorageKey() {
  return `mission-git:${todayKey()}`;
}

function defaultState(mission: Mission): LocalState {
  let elapsedSeconds = 0;
  try {
    elapsedSeconds = Number(localStorage.getItem(timerStorageKey(mission))) || 0;
  } catch {
    // localStorage unavailable, start from zero
  }

  let completed = false;
  if (mission.key === "git") {
    try {
      completed = localStorage.getItem(gitStorageKey()) === "true";
    } catch {
      // ignore
    }
  }

  return { completed, elapsedSeconds, status: "not-started", expanded: false, pending: false };
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

async function markMission(mission: Mission, complete: boolean) {
  if (!mission.action) return;

  if (mission.action.type === "dsa") {
    await fetch(`/api/dsa/${mission.action.topic}/problems/${mission.action.problemId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: complete ? "solved" : "not-started" }),
    });
  } else {
    await fetch(`/api/projects/${mission.action.projectId}/tasks/${mission.action.taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: complete }),
    });
  }
}

export function TodayMissionBoard({ missions }: { missions: Mission[] }) {
  const router = useRouter();
  const [states, setStates] = useState<Record<string, LocalState>>(() =>
    Object.fromEntries(missions.map((m) => [m.key, defaultState(m)])),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setStates((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const mission of missions) {
          if (next[mission.key]?.status === "running") {
            next[mission.key] = { ...next[mission.key], elapsedSeconds: next[mission.key].elapsedSeconds + 1 };
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    for (const mission of missions) {
      const state = states[mission.key];
      if (!state) continue;
      try {
        localStorage.setItem(timerStorageKey(mission), String(state.elapsedSeconds));
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states]);

  function update(key: string, patch: Partial<LocalState>) {
    setStates((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  async function toggleComplete(mission: Mission, checked: boolean) {
    if (mission.key === "git" || !mission.action) {
      update(mission.key, { completed: checked, status: checked ? "paused" : "not-started" });
      if (mission.key === "git") {
        try {
          localStorage.setItem(gitStorageKey(), String(checked));
        } catch {
          // ignore
        }
      }
      return;
    }

    update(mission.key, { pending: true });
    await markMission(mission, checked);
    router.refresh();
  }

  const totalMissions = missions.length;
  const completedMissions = missions.filter((m) => states[m.key]?.completed).length;
  const allComplete = completedMissions === totalMissions && totalMissions > 0;

  return (
    <>
      <ul className="mission-list">
        {missions.map((mission) => {
          const state = states[mission.key];
          if (!state) return null;

          const showStart = state.status === "not-started" && !state.completed;
          const showPause = state.status === "running" || (state.status === "paused" && !state.completed);
          const trackable = mission.action !== null || mission.key === "git";

          return (
            <li
              key={mission.key}
              className={`mission-card${state.expanded ? " expanded" : ""}${state.completed ? " completed" : ""}`}
              onClick={() => update(mission.key, { expanded: !state.expanded })}
            >
              <div className="mission-label">
                {trackable ? (
                  <input
                    type="checkbox"
                    checked={state.completed}
                    disabled={state.pending}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => toggleComplete(mission, e.target.checked)}
                  />
                ) : (
                  <span style={{ width: 18 }} />
                )}

                <div className="mission-content">
                  <p className="mission-label-text">{mission.label}</p>
                  <h3>{mission.title}</h3>
                  <div className="mission-meta">
                    {mission.meta.map((tag) => (
                      <span key={tag.cls + tag.text} className={`meta-tag ${tag.cls}`}>
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mission-details">
                <div className="mission-details-content">
                  {!trackable ? (
                    <div className="mission-actions">
                      <a className="problem-solve-btn" href={mission.href} onClick={(e) => e.stopPropagation()}>
                        Open
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="mission-timer">
                        <span>{formatTime(state.elapsedSeconds)}</span>
                      </div>
                      <div className="mission-actions">
                        <button
                          className="start-mission-btn"
                          style={{ display: showStart ? "flex" : "none" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            update(mission.key, { status: "running" });
                          }}
                        >
                          <Play size={13} fill="currentColor" /> Start Mission
                        </button>

                        <button
                          className="pause-mission-btn"
                          style={{ display: showPause ? "flex" : "none" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            update(mission.key, { status: state.status === "running" ? "paused" : "running" });
                          }}
                        >
                          {state.status === "paused" ? (
                            <>
                              <Play size={13} fill="currentColor" /> Resume
                            </>
                          ) : (
                            <>
                              <Pause size={13} fill="currentColor" /> Pause
                            </>
                          )}
                        </button>

                        {mission.action !== null && (
                          <a
                            className="problem-solve-btn"
                            href={mission.href}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open
                          </a>
                        )}

                        <button
                          className="complete-mission-btn"
                          disabled={state.completed || state.pending}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComplete(mission, true);
                          }}
                        >
                          <CheckCircle2 size={13} /> {state.completed ? "Completed" : "Complete"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mission-progress">
        <div className="progress-header">
          <h3>Today&apos;s Progress</h3>
          <span>
            {completedMissions} / {totalMissions} Completed
          </span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completedMissions / totalMissions) * 100}%` }} />
        </div>
      </section>

      <div className="mission-complete-message" style={{ display: allComplete ? "block" : "none" }}>
        <span>
          <CheckCircle2 size={28} />
        </span>
        <h3>Today&apos;s Mission Complete!</h3>
        <p>Great work. You completed everything planned for today.</p>
      </div>
    </>
  );
}
