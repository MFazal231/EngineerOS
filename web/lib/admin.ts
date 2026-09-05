import { prisma } from "@/lib/prisma";

export async function isAdmin(userId: number): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  return user?.isAdmin ?? false;
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
