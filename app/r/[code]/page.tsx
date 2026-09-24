import type { Metadata } from "next";
import { getType } from "@/data/types";
import { t } from "@/data/locale/en";
import { SharedResult } from "@/components/SharedResult";
import { resultTitle } from "@/lib/result-copy";
import { decodeShareCode } from "@/lib/share-code";
import { Suspense } from "react";

export function generateStaticParams() {
  return [{ code: "DE-0-0" }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const decoded = decodeShareCode(code);
  if (!decoded) return { title: t.meta.siteTitle, robots: { index: false, follow: false } };
  const title = resultTitle(undefined, getType(decoded.primary).label);
  const description = getType(decoded.primary).headline;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function SharedResultPage() {
  return (
    <Suspense fallback={<main id="main" className="section narrow"><p>{t.test.loading}</p></main>}>
      <SharedResult />
    </Suspense>
  );
}
