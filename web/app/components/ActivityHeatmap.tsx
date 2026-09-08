import type { HeatmapDay } from "@/lib/insights";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Intensity buckets rather than a continuous scale — with the small daily
 * counts a single person generates, four steps read more clearly than a
 * gradient where 2 and 3 look identical.
 */
function level(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function ActivityHeatmap({ days }: { days: HeatmapDay[] }) {
  // Pad the front so the first column starts on a Sunday and the weeks line up.
  const firstDay = new Date(`${days[0]?.date ?? new Date().toISOString().slice(0, 10)}T00:00:00Z`);
  const padding = firstDay.getUTCDay();

  const cells: (HeatmapDay | null)[] = [...new Array(padding).fill(null), ...days];
  const weeks: (HeatmapDay | null)[][] = [];

  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // A month label sits above the week where that month first appears.
  const monthLabels = weeks.map((week, index) => {
    const first = week.find((cell) => cell !== null);
    if (!first) return null;

    const date = new Date(`${first.date}T00:00:00Z`);
    if (date.getUTCDate() > 7) return null;

    const previous = weeks[index - 1]?.find((c) => c !== null);
    if (previous && new Date(`${previous.date}T00:00:00Z`).getUTCMonth() === date.getUTCMonth()) {
      return null;
    }

    return MONTHS[date.getUTCMonth()];
  });

  return (
    <div className="heatmap">
      <div className="heatmap-months">
        {weeks.map((_, index) => (
          <span key={index}>{monthLabels[index] ?? ""}</span>
        ))}
      </div>

      <div className="heatmap-grid">
        {weeks.map((week, weekIndex) => (
          <div className="heatmap-week" key={weekIndex}>
            {week.map((cell, dayIndex) =>
              cell === null ? (
                <span className="heatmap-cell empty" key={dayIndex} />
              ) : (
                <span
                  key={cell.date}
                  className={`heatmap-cell level-${level(cell.count)}`}
                  title={`${cell.count === 0 ? "Nothing" : `${cell.count} action${cell.count === 1 ? "" : "s"}`} on ${cell.date}`}
                />
              ),
            )}
          </div>
        ))}
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        <span className="heatmap-cell level-0" />
        <span className="heatmap-cell level-1" />
        <span className="heatmap-cell level-2" />
        <span className="heatmap-cell level-3" />
        <span className="heatmap-cell level-4" />
        <span>More</span>
      </div>
    </div>
  );
}
