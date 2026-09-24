import type { Metadata } from "next";
import { t } from "@/data/locale/en";
import { TypeGrid } from "@/components/TypeGrid";

export const metadata: Metadata = { title: t.meta.typesTitle, description: t.typesPage.intro };

export default function TypesPage() {
  return (
    <main id="main" className="section">
      <div className="wrap">
        <h1>{t.typesPage.title}</h1>
        <p className="lede">{t.typesPage.intro}</p>
        <TypeGrid />
      </div>
    </main>
  );
}
