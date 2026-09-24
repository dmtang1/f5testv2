import type { Metadata } from "next";
import { t } from "@/data/locale/en";
import { Assessment } from "@/components/Assessment";

export const metadata: Metadata = { title: t.meta.testTitle, description: t.test.measures };

export default function TestPage() {
  return <Assessment />;
}
