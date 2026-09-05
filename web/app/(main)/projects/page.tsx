import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectsBoard } from "@/app/components/ProjectsBoard";

export default async function ProjectsPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <main className="main">
        <section className="projects-hero">
          <div className="container">
            <div className="projects-header">
              <div>
                <p className="section-label">BUILD</p>
                <h2>Projects</h2>
                <p>
                  <Link href="/auth" style={{ color: "var(--primary)", fontWeight: 700 }}>
                    Sign in
                  </Link>{" "}
                  to create and track your projects.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { tasks: { orderBy: { id: "asc" } } },
    orderBy: { id: "asc" },
  });

  return (
    <main className="main">
      <ProjectsBoard initialProjects={projects} />
    </main>
  );
}
