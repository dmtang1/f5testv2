"use client";

import { t } from "@/data/locale/en";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="section narrow">
      <h1>{t.errors.genericTitle}</h1>
      <p>{t.errors.genericBody}</p>
      <button className="btn" type="button" onClick={reset}>{t.errors.tryAgain}</button>
    </main>
  );
}
