"use client";

import { Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { DsaProblem } from "@/lib/dsa/problems";
import type { TopicSlug } from "@/lib/dsa/topics";

type Props = {
  topic: TopicSlug;
  topicName: string;
  problem: DsaProblem;
  initialSolved: boolean;
};

export function DailyChallengeCard({ topic, topicName, problem, initialSolved }: Props) {
  const [solved, setSolved] = useState(initialSolved);
  const [pending, setPending] = useState(false);

  async function markSolved() {
    setPending(true);
    setSolved(true);
    try {
      await fetch(`/api/dsa/${topic}/problems/${problem.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "solved" }),
      });
    } catch {
      // local state already reflects the change; a failed sync corrects itself on the next load
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={`daily-challenge-card orange${solved ? " solved" : ""}`}>
      <div className="card-top" />
      <div className="daily-challenge-body">
        <div className="daily-challenge-info">
          <span className="daily-challenge-topic">{topicName}</span>
          <div className="daily-challenge-title-row">
            <h3>{problem.title}</h3>
            <span className={`problem-difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          </div>
        </div>

        <div className="daily-challenge-actions">
          {solved ? (
            <span className="daily-challenge-solved">
              <Check size={14} /> Solved
            </span>
          ) : (
            <button className="daily-challenge-mark-btn" onClick={markSolved} disabled={pending}>
              <Check size={13} /> Mark solved
            </button>
          )}
          <a className="daily-challenge-open-btn" href={`/dsa/${topic}`}>
            Open <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
