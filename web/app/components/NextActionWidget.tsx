import Link from "next/link";
import { getNextAction } from "@/lib/ai/nextAction";
import { refineWithLLM } from "@/lib/ai/refine";

export async function NextActionWidget({ userId }: { userId: number }) {
  const action = await refineWithLLM(await getNextAction(userId));

  return (
    <section className="next-action">
      <p className="next-action-label">🤖 AI ENGINEER · WHAT TO DO NEXT</p>
      <div className="next-action-card">
        <div className="next-action-info">
          <h3 className="next-action-headline">{action.headline}</h3>
          <span className="next-action-reason">{action.reason}</span>
        </div>
        <Link href={action.actionHref} className="next-action-cta">
          {action.actionLabel} →
        </Link>
      </div>
    </section>
  );
}
