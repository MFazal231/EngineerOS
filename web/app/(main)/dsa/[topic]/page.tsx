import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { DSA_TOPICS, isTopicSlug } from "@/lib/dsa/topics";
import { getUserProgressMap } from "@/lib/dsa/progress";
import { DsaProblemBoard } from "@/app/components/DsaProblemBoard";

const TOPIC_COPY: Record<string, { label: string; description: string }> = {
  arrays: {
    label: "DSA / ARRAYS",
    description: "Practice array problems and strengthen your problem-solving skills.",
  },
  "binary-search": {
    label: "DSA / BINARY SEARCH",
    description: "Master search-space reduction and binary search patterns.",
  },
  strings: {
    label: "DSA / STRINGS",
    description: "Practice manipulation, searching, and pattern problems.",
  },
};

export default async function DsaTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;

  if (!isTopicSlug(topic)) {
    notFound();
  }

  const user = await getSessionUser();
  const progress = await getUserProgressMap(user?.id);
  const topicData = DSA_TOPICS[topic];
  const copy = TOPIC_COPY[topic];

  return (
    <main className="main">
      <section className="dsa-hero">
        <div className="container">
          <div className="dsa-header">
            <div>
              <p className="section-label">{copy.label}</p>
              <h2>{topicData.name}</h2>
              <p>{copy.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dsa-section">
        <div className="container">
          <DsaProblemBoard topic={topic} problems={topicData.problems} initialStatuses={progress[topic]} />
        </div>
      </section>
    </main>
  );
}
