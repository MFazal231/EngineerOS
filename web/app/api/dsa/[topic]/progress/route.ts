import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ topic: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const { topic } = await params;

  const rows = await prisma.dsaProblemProgress.findMany({
    where: { userId: user.id, topicSlug: topic },
    orderBy: { problemId: "asc" },
    select: { problemId: true, status: true },
  });

  return Response.json(rows);
}
