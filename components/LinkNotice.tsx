"use client";

import { t } from "@/data/locale/en";
import { useSearchParams } from "next/navigation";

export function LinkNotice() {
  const params = useSearchParams();
  if (params.get("notice") !== "link") return null;
  return <p className="notice">{t.errors.badLink}</p>;
}
