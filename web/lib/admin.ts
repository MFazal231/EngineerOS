import { prisma } from "@/lib/prisma";

export async function isAdmin(userId: number): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  return user?.isAdmin ?? false;
}

export async function getRecentFeedback(limit = 50) {
  const rows = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      message: true,
      page: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    message: row.message,
    page: row.page,
    createdAt: row.createdAt,
    from: row.user ? `${row.user.name} (${row.user.email})` : "Signed out",
  }));
}

export async function getAdminOverview() {
  const [users, totalSolved, totalProblems, totalProjects] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { projects: true } },
        dsaProgress: { where: { status: "solved" }, select: { problemId: true } },
      },
    }),
    prisma.dsaProblemProgress.count({ where: { status: "solved" } }),
    prisma.dsaProblemProgress.count(),
    prisma.project.count(),
  ]);

  return {
    userCount: users.length,
    totalSolved,
    totalProblems,
    totalProjects,
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      projectCount: u._count.projects,
      solvedCount: u.dsaProgress.length,
    })),
  };
}
