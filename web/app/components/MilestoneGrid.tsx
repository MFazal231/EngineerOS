import { Award, Code2, Flame, Map as MapIcon, Lock } from "lucide-react";
import type { Milestone, MilestoneCategory } from "@/lib/milestones";

const CATEGORY_ICON: Record<MilestoneCategory, typeof Award> = {
  dsa: Code2,
  streak: Flame,
  project: Award,
  roadmap: MapIcon,
};

const CATEGORY_COLOR: Record<MilestoneCategory, string> = {
  dsa: "orange",
  streak: "orange",
  project: "purple",
  roadmap: "green",
};

export function MilestoneGrid({ milestones }: { milestones: Milestone[] }) {
  const unlockedCount = milestones.filter((m) => m.unlocked).length;

  return (
    <div className="insight-panel">
      <div className="insight-panel-head">
        <div>
          <p className="section-label">TROPHY CASE</p>
          <h3>Milestones</h3>
        </div>
        <span className="insight-chip">
          {unlockedCount} / {milestones.length}
        </span>
      </div>

      <div className="milestone-grid">
        {milestones.map((milestone) => {
          const Icon = CATEGORY_ICON[milestone.category];
          const color = CATEGORY_COLOR[milestone.category];

          return (
            <div
              key={milestone.id}
              className={`milestone ${milestone.unlocked ? `unlocked ${color}` : "locked"}`}
              title={milestone.description}
            >
              <span className="milestone-icon">{milestone.unlocked ? <Icon size={18} /> : <Lock size={15} />}</span>
              <strong>{milestone.title}</strong>
              {!milestone.unlocked && milestone.progress && (
                <span className="milestone-progress">
                  {milestone.progress.current} / {milestone.progress.target}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
