import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { isAdmin, getAdminOverview } from "@/lib/admin";

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user || !(await isAdmin(user.id))) {
    notFound();
  }

  const overview = await getAdminOverview();

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
                <span className="emoji">👤</span>
                <h3>{overview.userCount}</h3>
                <p>Total Users</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">✅</span>
                <h3>{overview.totalSolved}</h3>
                <p>DSA Problems Solved</p>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">📈</span>
                <h3>{overview.totalProblems}</h3>
                <p>DSA Status Changes Logged</p>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="card-top" />
              <div className="card-content">
                <span className="emoji">💻</span>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
