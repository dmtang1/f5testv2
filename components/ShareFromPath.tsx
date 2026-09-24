"use client";

import { QUESTION_BANK_VERSION } from "@/data/questions";
import { t } from "@/data/locale/en";
import { ResultView } from "@/components/ResultView";
import { decodeShareCode, sanitizeName } from "@/lib/share-code";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Result } from "@/lib/model";

function shareFromLocation(): { result: Result; versionNote?: string } | "invalid" | null {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const index = parts.indexOf("r");
  const code = index >= 0 ? parts[index + 1] : undefined;
  if (!code) return null;
  const decoded = decodeShareCode(code);
  if (!decoded) return "invalid";
  const query = new URLSearchParams(window.location.search);
  const name = sanitizeName(query.get("n"));
  const version = query.get("v");
  return {
    versionNote: version && version !== QUESTION_BANK_VERSION ? version : undefined,
    result: {
      ...decoded,
      ...(name ? { name, shareName: true } : {}),
      completedAt: new Date(0).toISOString(),
    },
  };
}

/** GitHub Pages serves 404.html for unknown /r/:code paths. Render those here. */
export function ShareFromPath() {
  const [share, setShare] = useState<ReturnType<typeof shareFromLocation>>(null);

  useEffect(() => {
    const found = shareFromLocation();
    if (found === "invalid") {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      window.location.replace(`${base}/?notice=link`);
      return;
    }
    setShare(found);
  }, []);

  if (!share || share === "invalid") {
    return (
      <main id="main" className="section narrow">
        <h1>{t.errors.notFoundTitle}</h1>
        <p>{t.errors.notFoundBody}</p>
        <Link className="btn" href="/">{t.errors.goHome}</Link>
      </main>
    );
  }

  return <ResultView mode="public" versionNote={share.versionNote} result={share.result} />;
}
