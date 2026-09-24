import type { Metadata } from "next";
import { DebugScorer } from "@/components/DebugScorer";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Scoring debug", robots: { index: false, follow: false } };

export default function DebugPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <DebugScorer />;
}
