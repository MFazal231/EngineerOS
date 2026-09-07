import { notFound } from "next/navigation";
import { CheckCircle2, FolderKanban, TrendingUp, Users } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { isAdmin, getAdminOverview, getRecentFeedback } from "@/lib/admin";
import { AdminDeleteUserButton } from "@/app/components/AdminDeleteUserButton";
import { AdminResetPasswordButton } from "@/app/components/AdminResetPasswordButton";

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user || !(await isAdmin(user.id))) {
    notFound();
  }

  const [overview, feedback] = await Promise.all([getAdminOverview(), getRecentFeedback()]);

  return (
    <main className="main">
      <section className="dsa-hero">
        <div className="container">
          <div className="dsa-header">
            <div>
              <p className="section-label">ADMIN</p>
              <h2>Overview</h2>
              <p>Who&apos;s using EngineerOS, and how much.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dsa-section">
        <div className="container">
          <div className="stats" style={{ marginBottom: 32 }}>
            <div className="stat-card blue">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <Users size={22} />
                </span>
                <h3>{overview.userCount}</h3>
                <p>Total Users</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <CheckCircle2 size={22} />
                </span>
                <h3>{overview.totalSolved}</h3>
                <p>DSA Problems Solved</p>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <TrendingUp size={22} />
                </span>
                <h3>{overview.totalProblems}</h3>
                <p>DSA Status Changes Logged</p>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">
                  <FolderKanban size={22} />
                </span>
                <h3>{overview.totalProjects}</h3>
                <p>Projects Created</p>
              </div>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Problems Solved</th>
                  <th>Projects</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {overview.users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.createdAt.toLocaleDateString()}</td>
                    <td>{u.solvedCount}</td>
                    <td>{u.projectCount}</td>
                    <td>
                      <div className="admin-row-actions">
                        <AdminResetPasswordButton userId={u.id} userName={u.name} />
                        {u.id !== user.id && <AdminDeleteUserButton userId={u.id} userName={u.name} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dsa-section-header" style={{ marginTop: 40 }}>
            <div>
              <p className="section-label">FEEDBACK</p>
              <h3>What people are saying</h3>
            </div>
          </div>

          {feedback.length === 0 ? (
            <div className="problem-empty-state">
              <strong>No feedback yet</strong>
              <span>Anything sent through the in-app feedback button shows up here.</span>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Message</th>
                    <th>Page</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((f) => (
                    <tr key={f.id}>
                      <td>{f.from}</td>
                      <td style={{ whiteSpace: "normal", maxWidth: 420 }}>{f.message}</td>
                      <td>{f.page ?? "—"}</td>
                      <td>{f.createdAt.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
