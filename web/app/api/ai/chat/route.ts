import { getSessionUser } from "@/lib/auth";
import { buildUserContext } from "@/lib/ai/context";
import { chatWithAI, isAIChatConfigured, type ChatMessage } from "@/lib/ai/chat";
import { consumeAiCredit } from "@/lib/ai/rateLimit";

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

  if (!isAIChatConfigured()) {
    return Response.json(
      { status: "error", message: "AI Engineer isn't configured yet — no API key set." },
      { status: 503 },
    );
  }

  const budget = await consumeAiCredit(user.id);

  if (!budget.allowed) {
    return Response.json(
      {
        status: "error",
        message: `You've used all ${budget.limit} AI messages for today. It resets tomorrow.`,
      },
      { status: 429 },
    );
  }

  const context = await buildUserContext(user.id);
  const reply = await chatWithAI(context, messages);

  if (!reply) {
    return Response.json(
      {
        status: "error",
        message: "AI Engineer is temporarily unavailable (likely rate-limited) — try again in a minute.",
      },
      { status: 503 },
    );
  }

  return Response.json({ reply: reply.trim() });
}
