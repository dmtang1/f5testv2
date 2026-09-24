import type { Metadata } from "next";
import { t } from "@/data/locale/en";
import { PlaybookExplorer } from "@/components/PlaybookExplorer";
import { Suspense } from "react";

export const metadata: Metadata = { title: t.meta.playbookTitle, description: t.playbook.intro };

export default function PlaybookPage() {
  return (
    <Suspense fallback={<main id="main" className="section narrow"><p>{t.test.loading}</p></main>}>
      <PlaybookExplorer />
    </Suspense>
  );
}
