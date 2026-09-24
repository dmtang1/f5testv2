import type { Metadata } from "next";
import { featureFlags } from "@/data/config";
import { t } from "@/data/locale/en";
import { TeamMap } from "@/components/TeamMap";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: t.meta.teamTitle, description: t.team.intro };

export default function TeamPage() {
  if (!featureFlags.enableTeamMap) notFound();
  return <TeamMap />;
}
