"use client";

import { CheckCircle2, Pause, Play, Target } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "missionStates";

type MissionStatus = "not-started" | "running" | "paused" | "completed";

type MissionState = {
  completed: boolean;
  elapsedSeconds: number;
  status: MissionStatus;
  expanded: boolean;
};

const MISSIONS = [
  {
    label: "DSA FOCUS",
    title: "2 Binary Search Problems",
    estimate: "Estimated time: 40 minutes",
    meta: [
      { cls: "practice", text: "Practice" },
      { cls: "high", text: "High" },
      { cls: "time", text: "40 min" },
    ],
  },
  {
    label: "BUILD FOCUS",
    title: "EngineerOS Today's Mission",
    estimate: "Estimated time: 40 minutes",
    meta: [
      { cls: "build", text: "Project" },
      { cls: "medium", text: "Medium Priority" },
      { cls: "time", text: "60 min" },
    ],
  },
  {
    label: "LEARNING FOCUS",
    title: "JavaScript Fundamentals",
    estimate: "Estimated time: 40 minutes",
    meta: [
      { cls: "learning", text: "Learning" },
      { cls: "medium", text: "Medium Priority" },
      { cls: "time", text: "30 min" },
    ],
  },
  {
    label: "GIT FOCUS",
    title: "Commit & Push to GitHub",
    estimate: "Estimated time: 40 minutes",
    meta: [
      { cls: "git", text: "GitHub" },
      { cls: "low", text: "Low Priority" },
      { cls: "time", text: "10 min" },
    ],
  },
];

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function defaultState(): MissionState {
  return { completed: false, elapsedSeconds: 0, status: "not-started", expanded: false };
}

export function TodayMission() {
  const [missions, setMissions] = useState<MissionState[]>(() =>
    MISSIONS.map(() => defaultState()),
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<MissionState>[];
        // Server can't read localStorage; hydrate real state after mount, same as Greeting above.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMissions(
          MISSIONS.map((_, i) => ({
            completed: parsed[i]?.completed ?? false,
            elapsedSeconds: parsed[i]?.elapsedSeconds ?? 0,
            status: parsed[i]?.status ?? "not-started",
            expanded: false,
          })),
        );
      } catch {
        // ignore malformed storage, keep defaults
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
  }, [missions, loaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissions((prev) => {
        if (!prev.some((m) => m.status === "running")) {
          return prev;
        }
        return prev.map((m) =>
          m.status === "running" ? { ...m, elapsedSeconds: m.elapsedSeconds + 1 } : m,
        );
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function updateMission(index: number, patch: Partial<MissionState>) {
    setMissions((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function toggleCheckbox(index: number, checked: boolean) {
    if (checked) {
      updateMission(index, { completed: true, status: "completed" });
    } else {
      updateMission(index, { completed: false, status: "not-started", elapsedSeconds: 0 });
    }
  }

  function toggleExpanded(index: number) {
    updateMission(index, { expanded: !missions[index].expanded });
  }

  function handleStart(index: number) {
    updateMission(index, { status: "running" });
  }

  function handlePause(index: number) {
    const mission = missions[index];
    updateMission(index, { status: mission.status === "running" ? "paused" : "running" });
  }

  function handleComplete(index: number) {
    updateMission(index, { completed: true, status: "completed" });
  }

  const totalMissions = missions.length;
  const completedMissions = missions.filter((m) => m.completed).length;
  const allComplete = completedMissions === totalMissions && totalMissions > 0;

  return (
    <section className="today-mission">
      <div className="container today-mission-container">
        <header className="mission-header">
          <h2
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Target size={20} strokeWidth={2.25} />
            Today&apos;s Mission
          </h2>
          <p>Focus on what matters most today.</p>
        </header>

        <ul className="mission-list">
          {MISSIONS.map((mission, index) => {
            const state = missions[index];
            const showStart = state.status === "not-started";
            const showPause = state.status === "running" || state.status === "paused";
            const showComplete = state.status !== "not-started";

            return (
              <li
                key={mission.label}
                className={`mission-card${state.expanded ? " expanded" : ""}${state.completed ? " completed" : ""}`}
                onClick={() => toggleExpanded(index)}
              >
                <div className="mission-label">
                  <input
                    type="checkbox"
                    checked={state.completed}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => toggleCheckbox(index, e.target.checked)}
                  />

                  <div className="mission-content">
                    <p className="mission-label-text">{mission.label}</p>
                    <h3>{mission.title}</h3>
                    <div className="mission-meta">
                      {mission.meta.map((tag) => (
                        <span key={tag.cls} className={`meta-tag ${tag.cls}`}>
                          {tag.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mission-details">
                  <div className="mission-details-content">
                    <p>{mission.estimate}</p>
                    <div className="mission-timer">
                      <span>{formatTime(state.elapsedSeconds)}</span>
                    </div>
                    <div className="mission-actions">
                      <button
                        className="start-mission-btn"
                        style={{ display: showStart ? "flex" : "none" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStart(index);
                        }}
                      >
                        <Play size={13} fill="currentColor" /> Start Mission
                      </button>

                      <button
                        className="pause-mission-btn"
                        style={{ display: showPause ? "flex" : "none" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePause(index);
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

                      <button
                        className="complete-mission-btn"
                        style={{ display: showComplete ? "flex" : "none" }}
                        disabled={state.status === "completed"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete(index);
                        }}
                      >
                        <CheckCircle2 size={13} />{" "}
                        {state.status === "completed" ? "Completed" : "Complete"}
                      </button>
                    </div>
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
            <div
              className="progress-fill"
              style={{ width: `${(completedMissions / totalMissions) * 100}%` }}
            />
          </div>
        </section>

        <div className="mission-complete-message" style={{ display: allComplete ? "block" : "none" }}>
          <span>
            <CheckCircle2 size={28} />
          </span>
          <h3>Today&apos;s Mission Complete!</h3>
          <p>Great work. You completed everything planned for today.</p>
        </div>
      </div>
    </section>
  );
}
