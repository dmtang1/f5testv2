"use client";

import { decisionPairs, disclaimer, feelers, platinumShort, spotCueOrder, thinkers } from "@/data/principles";
import { tipsFor } from "@/data/playbook";
import { getType } from "@/data/types";
import { t } from "@/data/locale/en";
import { TYPE_IDS, type Result, type TypeId } from "@/lib/model";
import { profileLine } from "@/lib/result-copy";
import { buildSharePath } from "@/lib/share-code";
import { track } from "@/lib/analytics";
import { clearProgress, clearResult, loadResult } from "@/lib/storage";
import { EmailCapture } from "@/components/EmailCapture";
import { FiveprintCard } from "@/components/FiveprintCard";
import { TypeIcon } from "@/components/TypeIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ResultView({
  result,
  mode,
  versionNote,
}: {
  result: Result;
  mode: "self" | "public";
  versionNote?: string;
}) {
  const type = getType(result.primary);
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [manual, setManual] = useState("");
  const [viewer, setViewer] = useState<TypeId | null>(null);

  useEffect(() => {
    if (mode === "public") {
      track("share_link_open", { type: result.primary });
      const saved = loadResult();
      if (saved) setViewer(saved.primary);
    }
  }, [mode, result.primary]);

  async function share() {
    track("share_click", { type: result.primary });
    const path = buildSharePath(result);
    const url = `${window.location.origin}${path}`;
    const title = t.results.sharedTitle(result.shareName && result.name ? result.name : t.results.someone, type.label);
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus(t.results.copied);
      setManual("");
    } catch {
      setShareStatus(t.results.copyFailed);
      setManual(url);
    }
  }

  async function download() {
    const { drawFiveprint } = await import("@/lib/render-fiveprint");
    const canvas = document.createElement("canvas");
    drawFiveprint(canvas, result);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `f5-${result.primary}.png`;
    link.click();
  }

  const ordered = mode === "public" && viewer ? [viewer, ...TYPE_IDS.filter((id) => id !== viewer)] : TYPE_IDS;

  return (
    <main id="main" className="section">
      <div className="wrap" style={{ display: "grid", gap: "1.5rem" }}>
        {mode === "public" ? (
          <div>
            <p className="eyebrow">{t.results.sharedKicker}</p>
            <h1>{t.results.sharedTitle(result.name || t.results.someone, type.label)}</h1>
            <p className="lede">{type.headline}</p>
            <Link className="btn" href="/test">
              {t.results.takeYourself}
            </Link>
          </div>
        ) : (
          <div>
            <h1>{t.results.yours(result.name, type.label)}</h1>
            <p>{profileLine(result)}</p>
          </div>
        )}
        {versionNote ? <p className="notice">{t.results.versionNote(versionNote)}</p> : null}
        <FiveprintCard result={result} />
        <p className="fine">{t.results.draft}</p>
        <p className="fine">{t.results.letterNote}</p>
        {mode === "self" ? (
          <>
            <section>
              <h2>{t.results.traits}</h2>
              <ul className="traits">
                {type.traits.map((trait) => (
                  <li key={trait}>{trait}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2>{t.results.decide}</h2>
              <p>{t.results.decideBody}</p>
              <div className="axis">
                <div className="axis-label-row">
                  <span>{t.results.thinking}</span>
                  <span>{t.results.feeling}</span>
                </div>
                <div className="track" role="img" aria-label={`${t.results.focus} ${result.focus}. Center is 50.`}>
                  <i className="mid" />
                  <span className="knob" style={{ left: `${result.focus}%` }} />
                </div>
              </div>
              <p className="eyebrow">{t.results.pairsLabel}</p>
              <ul>
                {decisionPairs.map(([left, right]) => (
                  <li key={left}>
                    {left} ↔ {right}
                  </li>
                ))}
              </ul>
              <div className="split">
                <div>
                  <h3>{t.results.thinkers}</h3>
                  <ul>{thinkers.map((word) => <li key={word}>{word}</li>)}</ul>
                </div>
                <div>
                  <h3>{t.results.feelers}</h3>
                  <ul>{feelers.map((word) => <li key={word}>{word}</li>)}</ul>
                </div>
              </div>
            </section>
            <section>
              <h2>{t.results.spot}</h2>
              <dl className="spots">
                {spotCueOrder.map((cue) => (
                  <div key={cue}>
                    <dt>{t.results.cues[cue]}</dt>
                    <dd>{type.spot[cue]}</dd>
                  </div>
                ))}
              </dl>
              <p className="fine">{t.results.spotNote}</p>
            </section>
            <section className="panel" style={{ padding: "1rem 1.1rem" }}>
              <h2>{platinumShort}</h2>
              <p>{t.results.workIntro}</p>
            </section>
            <section>
              <h2>{t.results.work}</h2>
              {TYPE_IDS.map((other) => (
                <details key={other} className="panel" style={{ marginTop: "0.75rem" }} open={other === result.primary}>
                  <summary>
                    <span className={`type-mark type-${other}`}>
                      <TypeIcon id={other} />
                      {other === result.primary ? t.results.yourType(getType(other).label) : t.results.withType(getType(other).label)}
                    </span>
                  </summary>
                  <ul className="tips" aria-label={t.playbook.tips}>
                    {tipsFor(result.primary, other).map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </details>
              ))}
              <p>
                <Link href={`/playbook?you=${result.primary}&other=director`}>{t.results.openPlaybook}</Link>
              </p>
            </section>
            <div className="actions">
              <button type="button" className="btn" onClick={share}>{t.results.share}</button>
              <a className="btn-secondary" href="#save-results">{t.results.emailJump}</a>
              <button type="button" className="btn-secondary" onClick={download}>{t.results.download}</button>
              <button type="button" className="btn-secondary" onClick={() => setConfirm(true)}>{t.results.retake}</button>
              <Link className="btn-secondary" href="/types">{t.results.explore}</Link>
            </div>
            {shareStatus ? <p role="status">{shareStatus}</p> : null}
            {manual ? <input readOnly value={manual} aria-label={t.results.copy} /> : null}
            {confirm ? (
              <div className="notice">
                <p>{t.results.retakeConfirm}</p>
                <div className="actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      track("retake");
                      clearProgress();
                      clearResult();
                      router.push("/test");
                    }}
                  >
                    {t.results.retakeYes}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setConfirm(false)}>{t.results.cancel}</button>
                </div>
              </div>
            ) : null}
            <div id="save-results">
              <EmailCapture source="results" result={result} />
            </div>
          </>
        ) : (
          <section>
            <h2>{t.results.howToWork(type.label)}</h2>
            <p>{platinumShort}</p>
            {ordered.map((you) => (
              <details key={you} className="panel" style={{ marginTop: "0.75rem" }} open={you === viewer}>
                <summary>
                  {you === viewer ? t.results.becauseYou(getType(you).label) : t.results.ifYouAre(getType(you).label)}
                </summary>
                <ul className="tips" aria-label={t.playbook.tips}>
                  {tipsFor(you, result.primary).map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </details>
            ))}
          </section>
        )}
        <p className="fine">{disclaimer}</p>
      </div>
    </main>
  );
}
