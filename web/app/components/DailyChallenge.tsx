import { Zap } from "lucide-react";
import { getDailyChallengeForUser } from "@/lib/dailyChallenge";
import { DSA_TOPICS } from "@/lib/dsa/topics";
import { DailyChallengeCard } from "./DailyChallengeCard";

export async function DailyChallenge({ userId }: { userId: number }) {
  const challenge = await getDailyChallengeForUser(userId);

  return (
    <section className="daily-challenge">
      <div className="container">
        <p className="daily-challenge-label">
          <Zap size={12} /> DAILY CHALLENGE · SAME PROBLEM FOR EVERYONE TODAY
        </p>
        <DailyChallengeCard
          topic={challenge.topic}
          topicName={DSA_TOPICS[challenge.topic].name}
          problem={challenge.problem}
          initialSolved={challenge.solved}
        />
      </div>
    </section>
  );
}
