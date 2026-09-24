import { getType } from "@/data/types";
import { QUADRANT_IDS } from "@/lib/model";
import { TypeIcon } from "@/components/TypeIcon";
import Link from "next/link";

export function TypeGrid() {
  return (
    <div>
      <p className="eyebrow" style={{ textAlign: "center" }}>
        Task / Private
      </p>
      <div className="type-board">
        {QUADRANT_IDS.map((id) => {
          const type = getType(id);
          return (
            <Link key={id} href={`/types/${id}`} className="type-cell">
              <span className={`type-mark type-${id}`}>
                <TypeIcon id={id} />
                {type.label}
              </span>
              <span className="fine">{type.code}</span>
              <span>{type.headline}</span>
            </Link>
          );
        })}
      </div>
      <p className="eyebrow" style={{ textAlign: "center" }}>
        People / Open
      </p>
      <p className="axis-label-row fine">
        <span>Ask / Indirect</span>
        <span>Tell / Direct</span>
      </p>
    </div>
  );
}
