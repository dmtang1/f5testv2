import { getType } from "@/data/types";
import { t } from "@/data/locale/en";
import type { Result } from "@/lib/model";
import { QuadrantMap } from "@/components/QuadrantMap";

export function FiveprintCard({ result, sample = false, compact = false }: { result: Result; sample?: boolean; compact?: boolean }) {
  const type = getType(result.primary);
  return (
    <article className={compact ? "fiveprint fiveprint-compact" : "fiveprint"} aria-label={`${type.label} ${t.results.fiveprint}`}>
      <div className="fiveprint-top">
        <span className="stamp">F5</span>
        <span className="fine">{sample ? t.results.sample : t.results.fiveprint}</span>
      </div>
      {compact ? (
        <div className="fiveprint-body">
          <div>
            <p className="fiveprint-type">{type.label}</p>
            <p className="fiveprint-headline">{type.headline}</p>
          </div>
          <QuadrantMap result={result} compact />
        </div>
      ) : (
        <div>
          {result.name ? <p className="fine">{result.name}</p> : null}
          <p className="fiveprint-type">{type.label}</p>
          <p className="fiveprint-code">
            {type.code} · {type.quadrant}
          </p>
          <p className="fiveprint-headline">{type.headline}</p>
          <Axis name={t.results.style} low={t.results.ask} high={t.results.tell} value={result.style} strength={t.results.strength[result.styleStrength]} />
          <Axis name={t.results.focus} low={t.results.task} high={t.results.people} value={result.focus} strength={t.results.strength[result.focusStrength]} />
          <div className="fiveprint-map">
            <p className="fine">The dot is you. Each square is a type.</p>
            <QuadrantMap result={result} />
          </div>
        </div>
      )}
    </article>
  );
}

function Axis({ name, low, high, value, strength }: { name: string; low: string; high: string; value: number; strength: string }) {
  const toward = value < 50 ? low : high;
  return (
    <div className="axis">
      <div className="axis-label-row">
        <span>
          {name} · {strength} lean toward {toward}
        </span>
        <span>{value}</span>
      </div>
      <div className="axis-label-row">
        <span>{low}</span>
        <span>{high}</span>
      </div>
      <div className="track" role="img" aria-label={`${name} ${value}. ${strength} lean toward ${toward}. Center is 50.`}>
        <i className="mid" />
        <span className="knob" style={{ left: `${value}%` }} />
      </div>
    </div>
  );
}
