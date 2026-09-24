import { comparison, framework, teasers } from "@/data/site";
import { sampleResult } from "@/data/sample";
import { getType } from "@/data/types";
import { t } from "@/data/locale/en";
import { platinumRule } from "@/data/principles";
import { EmailCapture } from "@/components/EmailCapture";
import { LinkNotice } from "@/components/LinkNotice";
import { TrackOnView } from "@/components/TrackOnView";
import { TypeGrid } from "@/components/TypeGrid";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main id="main">
      <TrackOnView event="landing_view" />
      <section className="hero-fold">
        <div className="wrap hero">
          <div>
            <p className="eyebrow">{t.hero.edition}</p>
            <p>{t.hero.audience}</p>
            <h1>{t.hero.headline}</h1>
            <p className="lede">{t.hero.sub}</p>
            <Suspense fallback={null}>
              <LinkNotice />
            </Suspense>
            <div className="actions">
              <Link className="btn" href="/test">
                {t.hero.cta}
              </Link>
              <Link className="btn-secondary" href="/types">
                {t.hero.secondary}
              </Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="false">
            <span className="orb orb-a" />
            <span className="orb orb-b" />
            <span className="orb orb-c" />
            <span className="orb orb-d" />
            <article className="preview-card" aria-label={`${getType(sampleResult.primary).label} ${t.results.fiveprint}`}>
              <p className="preview-kicker">{t.results.fiveprint}</p>
              <p className="preview-type">{getType(sampleResult.primary).label}</p>
              <p className="preview-line">{getType(sampleResult.primary).headline}</p>
              <div className="preview-row">
                <span>{t.results.tell}</span>
                <div className="preview-track" role="img" aria-label={`${t.results.style} ${sampleResult.style} toward ${t.results.tell}`}>
                  <span style={{ width: `${sampleResult.style}%` }} />
                </div>
                <span>{sampleResult.style}</span>
              </div>
              <div className="preview-row">
                <span>{t.results.task}</span>
                <div className="preview-track" role="img" aria-label={`${t.results.focus} ${sampleResult.focus} toward ${t.results.task}`}>
                  <span style={{ width: `${sampleResult.focus}%` }} />
                </div>
                <span>{sampleResult.focus}</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section band-sky">
        <div className="wrap">
          <p className="eyebrow">{t.how.eyebrow}</p>
          <h2>{t.how.title}</h2>
          <div className="steps">
            {t.how.steps.map((step, index) => (
              <article key={step.title} className="card step">
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="chemistry">
        <div className="wrap">
          <p className="eyebrow">{t.chemistry.eyebrow}</p>
          <h2>{t.chemistry.title}</h2>
          <blockquote className="quote">{platinumRule}</blockquote>
          <p className="lede">{t.chemistry.body}</p>
          <TypeGrid />
        </div>
      </section>

      <section id="compare" className="section band-peach">
        <div className="wrap">
          <p className="eyebrow">{t.compare.eyebrow}</p>
          <h2>{t.compare.title}</h2>
          <table className="compare">
            <caption className="fine">{comparison.caption}</caption>
            <thead>
              <tr>
                <th scope="col"> </th>
                {comparison.columns.map((column) => (
                  <th key={column} scope="col">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  <td>{row.f5}</td>
                  <td>{row.traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="framework" className="section band-lilac">
        <div className="wrap">
          <p className="eyebrow">{t.framework.eyebrow}</p>
          <h2>{t.framework.title}</h2>
          {framework[0] ? (
            <article className="feature-live">
              <span className="badge status-live">{framework[0].status}</span>
              <h3>
                {framework[0].id} {framework[0].title}
              </h3>
              <p>{framework[0].body}</p>
            </article>
          ) : null}
          <div className="framework-rest">
            {framework.slice(1).map((item) => (
              <article key={item.id} className="soon-row">
                <span className={item.status === "Partly live" ? "badge status-part" : "badge status-soon"}>{item.status}</span>
                <div>
                  <h3>
                    {item.id} {item.title}
                  </h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="early-access" className="section band-mint">
        <div className="wrap early-layout">
          <div>
            <p className="eyebrow">{t.teasers.eyebrow}</p>
            <h2>{t.teasers.title}</h2>
            {teasers.map((item) => (
              <article key={item.id} className="soon-row">
                <span className="badge status-soon">{item.status}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
          <EmailCapture source="landing" />
        </div>
      </section>
    </main>
  );
}
