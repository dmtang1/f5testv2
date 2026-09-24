import { getType } from "@/data/types";
import { t } from "@/data/locale/en";
import { QUADRANT_IDS, type Result, type TypeId } from "@/lib/model";
import { positionSentence } from "@/lib/result-copy";

const place: Record<TypeId, { x: number; y: number }> = {
  defender: { x: 100, y: 70 },
  director: { x: 300, y: 70 },
  teammate: { x: 100, y: 250 },
  motivator: { x: 300, y: 250 },
};

export function QuadrantMap({ result, compact = false }: { result: Pick<Result, "primary" | "focus" | "style" | "focusStrength" | "styleStrength">; compact?: boolean }) {
  const x = 16 + (result.style / 100) * 368;
  const y = 16 + (result.focus / 100) * 368;
  const label = t.results.mapLabel(getType(result.primary).label, result.style, result.focus);
  return (
    <div className="map">
      <p className="quad-caption">{compact ? "Task" : "Task / Private"}</p>
      <svg viewBox="0 0 400 400" role="img" aria-label={label}>
        {QUADRANT_IDS.map((id) => {
          const spot = place[id];
          const qx = id === "director" || id === "motivator" ? 200 : 0;
          const qy = id === "teammate" || id === "motivator" ? 200 : 0;
          const yours = id === result.primary;
          return (
            <g key={id}>
              <rect
                x={qx + 8}
                y={qy + 8}
                width="184"
                height="184"
                rx="18"
                fill={`var(--type-${id}-bg)`}
                stroke={yours ? "var(--ink)" : "transparent"}
                strokeWidth={yours ? 4 : 0}
              />
              <text x={spot.x} y={spot.y} textAnchor="middle" fill="var(--ink)" fontSize={compact ? 22 : 18} fontFamily="inherit" fontWeight={yours ? 700 : 500}>
                {getType(id).label}
              </text>
            </g>
          );
        })}
        <circle cx={x} cy={y} r="11" fill="var(--ink)" stroke="var(--bg-elevated)" strokeWidth="3" />
      </svg>
      <p className="quad-caption">{compact ? "People" : "People / Open"}</p>
      <div className="axis-label-row fine">
        <span>{compact ? "Ask" : "Ask / Indirect"}</span>
        <span>{compact ? "Tell" : "Tell / Direct"}</span>
      </div>
      {compact ? null : <p>{positionSentence(result)}</p>}
    </div>
  );
}
