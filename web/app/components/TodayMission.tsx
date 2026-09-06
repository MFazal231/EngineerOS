import { Target } from "lucide-react";
import { getTodayMissions } from "@/lib/missions";
import { TodayMissionBoard } from "./TodayMissionBoard";

export async function TodayMission({ userId }: { userId: number }) {
  const missions = await getTodayMissions(userId);

  return (
    <section className="today-mission">
      <div className="container today-mission-container">
        <header className="mission-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={20} strokeWidth={2.25} />
            Today&apos;s Mission
          </h2>
          <p>Focus on what matters most today.</p>
        </header>

        {missions.length === 0 ? (
          <div className="mission-complete-message" style={{ display: "block" }}>
            <h3>Nothing open right now</h3>
            <p>You&apos;re caught up on DSA and projects. Start something new to get today&apos;s mission back.</p>
          </div>
        ) : (
          <TodayMissionBoard missions={missions} />
        )}
      </div>
    </section>
  );
}
