import type { Metadata } from "next";
import { tipsFor } from "@/data/playbook";
import { spotCueOrder } from "@/data/principles";
import { getType, isTypeId } from "@/data/types";
import { t } from "@/data/locale/en";
import { TYPE_IDS, type TypeId } from "@/lib/model";
import { TypeIcon } from "@/components/TypeIcon";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return TYPE_IDS.map((type) => ({ type }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  if (!isTypeId(type)) return { title: t.meta.typesTitle };
  const content = getType(type);
  return { title: content.label, description: content.headline };
}

export default async function TypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isTypeId(type)) notFound();
  const content = getType(type as TypeId);
  return (
    <main id="main" className="section">
      <div className="wrap" style={{ display: "grid", gap: "1.25rem" }}>
        <p className={`type-mark type-${content.id}`}>
          <TypeIcon id={content.id} />
          {content.code}
        </p>
        <h1>{content.label}</h1>
        <p className="lede">{content.headline}</p>
        <p className="fine">{content.quadrant}</p>
        <p className="fine">{t.results.draft}</p>
        <section>
          <h2>{t.results.traits}</h2>
          <ul className="traits">
            {content.traits.map((trait) => (
              <li key={trait}>{trait}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t.results.spot}</h2>
          <dl className="spots">
            {spotCueOrder.map((cue) => (
              <div key={cue}>
                <dt>{t.results.cues[cue]}</dt>
                <dd>{content.spot[cue]}</dd>
              </div>
            ))}
          </dl>
          <p className="fine">{t.results.spotNote}</p>
        </section>
        <section>
          <h2>{t.typesPage.howTo(content.label)}</h2>
          {TYPE_IDS.map((you) => (
            <article key={you} className="panel" style={{ padding: "1rem", marginTop: "0.75rem" }}>
              <h3>{t.typesPage.from(getType(you).label)}</h3>
              <ul className="tips">
                {tipsFor(you, content.id).map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
        <Link className="btn" href="/test">{t.hero.cta}</Link>
      </div>
    </main>
  );
}
