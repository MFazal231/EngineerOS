import { getSessionUser } from "@/lib/auth";
import { buildUserContext } from "@/lib/ai/context";
import { chatWithAI, type ChatMessage } from "@/lib/ai/chat";

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const body = await request.json();
  const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];

  if (messages.length === 0 || messages.length > 20) {
    return Response.json(
      { status: "error", message: "Send between 1 and 20 messages" },
      { status: 400 },
    );
  }

  const context = await buildUserContext(user.id);
  const reply = await chatWithAI(context, messages);

  if (!reply) {
    return Response.json(
      { status: "error", message: "AI Engineer isn't configured yet — no API key set." },
      { status: 503 },
    );
  }

  return Response.json({ reply: reply.trim() });
}
