import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const VALID_STATUSES = new Set(["not-started", "in-progress", "solved"]);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ topic: string; problemId: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const { topic, problemId: problemIdParam } = await params;
  const problemId = Number(problemIdParam);
  const body = await request.json();
  const status = body.status;

  if (!Number.isInteger(problemId) || problemId < 1) {
    return Response.json(
      { status: "error", message: "Problem ID must be a positive integer" },
      { status: 400 },
    );
  }

  if (!VALID_STATUSES.has(status)) {
    return Response.json({ status: "error", message: "Invalid problem status" }, { status: 400 });
  }

  try {
    const row = await prisma.dsaProblemProgress.upsert({
      where: {
        userId_topicSlug_problemId: { userId: user.id, topicSlug: topic, problemId },
      },
      update: { status },
      create: { userId: user.id, topicSlug: topic, problemId, status },
    });

    return Response.json(row);
  } catch {
    return Response.json({ status: "error", message: "DSA topic not found" }, { status: 404 });
  }
}
