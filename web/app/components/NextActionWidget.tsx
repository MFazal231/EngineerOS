import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getNextAction } from "@/lib/ai/nextAction";
import { refineWithLLM } from "@/lib/ai/refine";
import { isAIChatConfigured } from "@/lib/ai/chat";
import { consumeAiCredit } from "@/lib/ai/rateLimit";

export async function NextActionWidget({ userId }: { userId: number }) {
  const heuristic = await getNextAction(userId);

  // This runs on every dashboard load, so it draws from the same daily budget
  // as the chat. Out of budget just means the (already clear) rule-based
  // wording shows instead of an LLM-polished one.
  let action = heuristic;
  if (isAIChatConfigured() && (await consumeAiCredit(userId)).allowed) {
    action = await refineWithLLM(heuristic);
  }

  return (
    <section className="next-action">
      <div className="container">
        <p className="next-action-label">
          <Sparkles size={12} /> AI ENGINEER · WHAT TO DO NEXT
        </p>
        <div className="next-action-card">
          <div className="next-action-info">
            <h3 className="next-action-headline">{action.headline}</h3>
            <span className="next-action-reason">{action.reason}</span>
          </div>
          <Link href={action.actionHref} className="next-action-cta">
            {action.actionLabel} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
