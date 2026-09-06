import { CheckCircle2, Clock, Code2, BookOpen, Flame } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { Greeting } from "@/app/components/Greeting";
import { NextActionWidget } from "@/app/components/NextActionWidget";
import { TodayMission } from "@/app/components/TodayMission";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const user = await getSessionUser();
  const { verified } = await searchParams;

  return (
    <main className="main">
      <section className="hero">
        <div className="container hero-container">
          {verified && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                padding: "12px 16px",
                background: "var(--success-light)",
                color: "var(--success)",
                borderRadius: "var(--radius-sm)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              <CheckCircle2 size={16} /> Email verified — welcome to EngineerOS!
            </p>
          )}

          <div className="hero-content">
            <Greeting name={user?.name ?? "there"} />
            <p>Keep building. Every commit counts.</p>
          </div>

          <div className="stats">
            <div className="stat-card orange">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <Flame size={22} />
                </span>
                <h3>15</h3>
                <p>Coding Streak</p>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <BookOpen size={22} />
                </span>
                <h3>3</h3>
                <p>Learning Modules</p>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <Code2 size={22} />
                </span>
                <h3>5</h3>
                <p>Projects</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <Clock size={22} />
                </span>
                <h3>18h</h3>
                <p>This Week</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {user && <NextActionWidget userId={user.id} />}

      <TodayMission />
    </main>
  );
}
