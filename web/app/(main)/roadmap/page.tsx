import { getSessionUser } from "@/lib/auth";
import { ROADMAPS, countSteps } from "@/lib/roadmaps/content";
import { getRoadmapProgress } from "@/lib/roadmaps/progress";
import { RoadmapBoard } from "@/app/components/RoadmapBoard";

export default async function RoadmapPage() {
  const user = await getSessionUser();
  const progress = await getRoadmapProgress(user?.id);

  // Sets don't survive the server-to-client boundary, so hand arrays over.
  const initialProgress = Object.fromEntries(
    Object.entries(progress).map(([slug, steps]) => [slug, [...steps]]),
  );

  const totalSteps = ROADMAPS.reduce((sum, roadmap) => sum + countSteps(roadmap), 0);

  return (
    <main className="main">
      <section className="dsa-hero">
        <div className="container">
          <div className="dsa-header">
            <div>
              <p className="section-label">ROADMAP</p>
              <h2>Pick a path</h2>
              <p>
                {ROADMAPS.length} roadmaps · {totalSteps} steps. Search for what you want to learn, then
                open it to see the whole path.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dsa-section">
        <div className="container">
          <RoadmapBoard roadmaps={ROADMAPS} initialProgress={initialProgress} signedIn={Boolean(user)} />
        </div>
      </section>
    </main>
  );
}
