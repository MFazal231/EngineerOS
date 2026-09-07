import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request) {
  const user = await getSessionUser();
  const body = await request.json();

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const page = typeof body.page === "string" ? body.page.slice(0, 200) : null;

  if (!message) {
    return Response.json({ status: "error", message: "Write something first" }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return Response.json(
      { status: "error", message: `Keep it under ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 },
    );
  }

  // Signed-out feedback is still worth capturing — userId just stays null.
  await prisma.feedback.create({
    data: { userId: user?.id ?? null, message, page },
  });

  return Response.json({ status: "ok" });
}
