import { getSessionUser } from "@/lib/auth";
import { getNextAction } from "@/lib/ai/nextAction";
import { refineWithLLM } from "@/lib/ai/refine";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ status: "error", message: "Authentication is required" }, { status: 401 });
  }

  const action = await refineWithLLM(await getNextAction(user.id));

  return Response.json(action);
}
