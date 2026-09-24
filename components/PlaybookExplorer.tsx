"use client";

import { spotCueOrder } from "@/data/principles";
import { tipsFor } from "@/data/playbook";
import { getType, isTypeId } from "@/data/types";
import { t } from "@/data/locale/en";
import { TYPE_IDS, type TypeId } from "@/lib/model";
import { track } from "@/lib/analytics";
import { loadResult } from "@/lib/storage";
import { TypeIcon } from "@/components/TypeIcon";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function PlaybookExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const youParam = params.get("you");
  const otherParam = params.get("other");
  const [you, setYou] = useState<TypeId>(isTypeId(youParam ?? "") ? (youParam as TypeId) : "director");
  const [other, setOther] = useState<TypeId>(isTypeId(otherParam ?? "") ? (otherParam as TypeId) : "motivator");
  const [grid, setGrid] = useState(false);

  useEffect(() => {
    if (!isTypeId(youParam ?? "")) {
      const saved = loadResult();
      if (saved) setYou(saved.primary);
    }
  }, [youParam]);

  useEffect(() => {
    track("playbook_cell_view", { you, other });
  }, [you, other]);

  function update(nextYou: TypeId, nextOther: TypeId) {
    setYou(nextYou);
    setOther(nextOther);
    router.replace(`/playbook?you=${nextYou}&other=${nextOther}`, { scroll: false });
  }

  const otherType = getType(other);
  const tips = tipsFor(you, other);

  return (
    <main id="main" className="section">
      <div className="wrap" style={{ display: "grid", gap: "1.25rem" }}>
        <div>
          <h1>{t.playbook.title}</h1>
          <p className="lede">{t.playbook.intro}</p>
        </div>
        <div className="split no-print">
          <div className="panel" style={{ padding: "1rem" }}>
            <div className="field">
              <label htmlFor="you">{t.playbook.iAm}</label>
              <select id="you" value={you} onChange={(event) => update(event.target.value as TypeId, other)}>
                {TYPE_IDS.map((id) => (
                  <option key={id} value={id}>{getType(id).label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="other">{t.playbook.with}</label>
              <select id="other" value={other} onChange={(event) => update(you, event.target.value as TypeId)}>
                {TYPE_IDS.map((id) => (
                  <option key={id} value={id}>{getType(id).label}</option>
                ))}
              </select>
            </div>
            <p className={`type-mark type-${other}`}>
              <TypeIcon id={other} />
              {otherType.label}
            </p>
            <ul className="tips" aria-label={t.playbook.tips}>
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
          <aside className="panel" style={{ padding: "1rem" }}>
            <h2>{t.playbook.spot}</h2>
            <dl className="spots">
              {spotCueOrder.map((cue) => (
                <div key={cue}>
                  <dt>{t.results.cues[cue]}</dt>
                  <dd>{otherType.spot[cue]}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
        <button type="button" className="btn-secondary no-print" aria-expanded={grid} onClick={() => setGrid((value) => !value)}>
          {grid ? t.playbook.hideGrid : t.playbook.grid}
        </button>
        <div className={grid ? "print-grid" : "print-grid"} style={{ display: grid ? "block" : undefined }} hidden={!grid}>
          <p>{t.playbook.read}</p>
          <table>
            <caption>{t.playbook.caption}</caption>
            <thead>
              <tr>
                <th>{t.playbook.workingWith}</th>
                {TYPE_IDS.map((id) => (
                  <th key={id} scope="col">{t.playbook.youAre(getType(id).label)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TYPE_IDS.map((row) => (
                <tr key={row}>
                  <th scope="row">{getType(row).label}</th>
                  {TYPE_IDS.map((column) => (
                    <td key={column}>{tipsFor(column, row).join(" · ")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
