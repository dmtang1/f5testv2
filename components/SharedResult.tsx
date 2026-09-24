"use client";

import { QUESTION_BANK_VERSION } from "@/data/questions";
import { getType } from "@/data/types";
import { t } from "@/data/locale/en";
import { ResultView } from "@/components/ResultView";
import { resultTitle } from "@/lib/result-copy";
import { decodeShareCode, sanitizeName } from "@/lib/share-code";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function SharedResult() {
  const params = useParams<{ code: string }>();
  const query = useSearchParams();
  const router = useRouter();
  const code = params.code ?? "";
  const decoded = decodeShareCode(code);
  const name = sanitizeName(query.get("n"));
  const version = query.get("v");

  useEffect(() => {
    if (!decoded) {
      router.replace("/?notice=link");
      return;
    }
    const title = resultTitle(name, getType(decoded.primary).label);
    document.title = `${title} · F5 Test`;
  }, [code, name, router, decoded]);

  if (!decoded) {
    return (
      <main id="main" className="section narrow">
        <p>{t.test.loading}</p>
      </main>
    );
  }

  const versionNote = version && version !== QUESTION_BANK_VERSION ? version : undefined;
  return (
    <ResultView
      mode="public"
      versionNote={versionNote}
      result={{
        ...decoded,
        ...(name ? { name, shareName: true } : {}),
        completedAt: new Date(0).toISOString(),
      }}
    />
  );
}
