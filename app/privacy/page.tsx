import type { Metadata } from "next";
import { site } from "@/data/config";
import { t } from "@/data/locale/en";
import { disclaimer } from "@/data/principles";

export const metadata: Metadata = { title: t.meta.privacyTitle, description: t.privacy.intro };

export default function PrivacyPage() {
  return (
    <main id="main" className="section">
      <div className="narrow">
        <h1>{t.privacy.title}</h1>
        <p className="lede">{t.privacy.intro}</p>
        {t.privacy.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <p>
          <a href={site.deletionContactUrl}>Request deletion</a>
          {" · "}
          <a href={site.privacyPolicyUrl}>Existing privacy policy</a>
        </p>
        <p className="fine">{disclaimer}</p>
        <p className="fine">{site.attribution}</p>
      </div>
    </main>
  );
}
