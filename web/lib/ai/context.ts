import { prisma } from "@/lib/prisma";
import { DSA_TOPICS, TOPIC_SLUGS } from "@/lib/dsa/topics";
import { getUserProgressMap, computeTopicStats, computeOverallStats } from "@/lib/dsa/progress";

/**
 * A plain-text summary of a user's REAL activity, for grounding the AI chat.
 * The model is instructed to treat this as the only source of truth about
 * the user — never invent progress or projects that aren't listed here.
 */
export async function buildUserContext(userId: number): Promise<string> {
  const [progress, projects] = await Promise.all([
    getUserProgressMap(userId),
    prisma.project.findMany({
      where: { userId },
      include: { tasks: { orderBy: { id: "asc" } } },
      orderBy: { id: "asc" },
    }),
  ]);

  const overall = computeOverallStats(progress);

  const dsaLines = TOPIC_SLUGS.map((slug) => {
    const stats = computeTopicStats(slug, progress);
    return `- ${DSA_TOPICS[slug].name}: ${stats.solved}/${stats.total} solved (${stats.percent}%)`;
  }).join("\n");

  const projectLines = projects.length
    ? projects
        .map((p) => {
          const done = p.tasks.filter((t) => t.done).length;
          const openTasks = p.tasks.filter((t) => !t.done).map((t) => t.title);
          const taskSummary =
            p.tasks.length === 0
              ? "no tasks defined yet"
              : `${done}/${p.tasks.length} tasks done${openTasks.length ? `, open: ${openTasks.join("; ")}` : ""}`;
          return `- "${p.name}" (${p.status}) — ${taskSummary}. Tech: ${p.tech.join(", ") || "none listed"}.`;
        })
        .join("\n")
    : "- No projects created yet.";

  return `DSA Progress:
${dsaLines}
Overall: ${overall.solved}/${overall.total} problems solved (${overall.percent}%)

Projects:
${projectLines}`;
}
