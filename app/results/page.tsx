"use client";

import { t } from "@/data/locale/en";
import { track } from "@/lib/analytics";
import { loadResult } from "@/lib/storage";
import { ResultView } from "@/components/ResultView";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Result } from "@/lib/model";

export default function ResultsPage() {
  const [result, setResult] = useState<Result | null | undefined>(undefined);

  useEffect(() => {
    setResult(loadResult());
    track("result_view");
  }, []);

  if (result === undefined) {
    return (
      <main id="main" className="section narrow">
        <p>{t.test.loading}</p>
      </main>
    );
  }
  if (!result) {
    return (
      <main id="main" className="section narrow">
        <h1>{t.results.missing}</h1>
        <Link className="btn" href="/test">{t.results.missingAction}</Link>
      </main>
    );
  }
  return <ResultView result={result} mode="self" />;
}
