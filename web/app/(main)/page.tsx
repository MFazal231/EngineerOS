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
                marginBottom: "16px",
                padding: "12px 16px",
                background: "#ecfdf5",
                color: "#059669",
                borderRadius: "var(--radius-sm)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              ✅ Email verified — welcome to EngineerOS!
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
                <span className="emoji">🔥</span>
                <h3>15</h3>
                <p>Coding Streak</p>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">📚</span>
                <h3>3</h3>
                <p>Learning Modules</p>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">💻</span>
                <h3>5</h3>
                <p>Projects</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">⏱</span>
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
