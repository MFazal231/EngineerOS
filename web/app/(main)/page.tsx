import { getSessionUser } from "@/lib/auth";
import { Greeting } from "@/app/components/Greeting";
import { NextActionWidget } from "@/app/components/NextActionWidget";
import { TodayMission } from "@/app/components/TodayMission";

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <main className="main">
      <section className="hero">
        <div className="container hero-container">
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
