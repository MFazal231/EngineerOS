import Link from "next/link";
import { AlertTriangle, Calendar, Clock, Flame, Sparkles, TrendingUp } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getInsights } from "@/lib/insights";
import { ActivityHeatmap } from "@/app/components/ActivityHeatmap";

const TONE_ICON = {
  good: TrendingUp,
  warning: AlertTriangle,
  neutral: Sparkles,
};

export default async function InsightsPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <main className="main">
        <section className="dsa-hero">
          <div className="container">
            <div className="dsa-header">
              <div>
                <p className="section-label">INSIGHTS</p>
                <h2>Your patterns</h2>
                <p>
                  <Link href="/auth" style={{ color: "var(--primary)", fontWeight: 700 }}>
                    Sign in
                  </Link>{" "}
                  to see what your habits actually look like.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const insights = await getInsights(user.id);

  return (
    <main className="main">
      <section className="dsa-hero">
        <div className="container">
          <div className="dsa-header">
            <div>
              <p className="section-label">INSIGHTS</p>
              <h2>What you actually did</h2>
              <p>
                Not advice — a record. Everything here is drawn from your own timestamps, which is the
                one thing a chatbot can&apos;t see.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dsa-section">
        <div className="container">
          <div className="stats" style={{ marginBottom: 32 }}>
            <div className="stat-card orange">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <Flame size={22} />
                </span>
                <h3>{insights.currentStreak}</h3>
                <p>Current Streak</p>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <TrendingUp size={22} />
                </span>
                <h3>{insights.longestStreak}</h3>
                <p>Longest Ever</p>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <Calendar size={22} />
                </span>
                <h3>{insights.activeDays}</h3>
                <p>Active Days</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <Clock size={22} />
                </span>
                <h3>{insights.totalActions}</h3>
                <p>Total Actions</p>
              </div>
            </div>
          </div>

          <div className="insight-panel">
            <div className="insight-panel-head">
              <div>
                <p className="section-label">LAST 17 WEEKS</p>
                <h3>Your activity</h3>
              </div>
              {insights.busiestWeekday && insights.busiestWeekday.count > 0 && (
                <span className="insight-chip">Busiest: {insights.busiestWeekday.day}</span>
              )}
            </div>

            <ActivityHeatmap days={insights.heatmap} />
          </div>

          <div className="dsa-section-header" style={{ marginTop: 40 }}>
            <div>
              <p className="section-label">WHAT WE NOTICED</p>
              <h3>Patterns in your own data</h3>
            </div>
          </div>

          <div className="observation-grid">
            {insights.observations.map((observation) => {
              const Icon = TONE_ICON[observation.tone];

              return (
                <article className={`observation ${observation.tone}`} key={observation.headline}>
                  <span className="observation-icon">
                    <Icon size={17} />
                  </span>
                  <div>
                    <strong>{observation.headline}</strong>
                    <p>{observation.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {insights.recent.length > 0 && (
            <>
              <div className="dsa-section-header" style={{ marginTop: 40 }}>
                <div>
                  <p className="section-label">TIMELINE</p>
                  <h3>Recently</h3>
                </div>
              </div>

              <ul className="insight-timeline">
                {insights.recent.map((event, index) => (
                  <li key={`${event.at.toISOString()}-${index}`} className={event.kind}>
                    <span className="insight-timeline-dot" />
                    <div>
                      <strong>{event.label}</strong>
                      <span>{event.at.toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
