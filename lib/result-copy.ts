import { getType } from "@/data/types";
import { t } from "@/data/locale/en";
import type { Result } from "@/lib/model";

export function resultTitle(name: string | undefined, typeLabel: string): string {
  const who = name?.trim() || t.results.someone;
  return t.results.sharedTitle(who, typeLabel);
}

export function profileLine(result: Pick<Result, "primary" | "secondary">): string {
  if (result.secondary) return t.results.also(getType(result.secondary).label);
  return t.results.strongly(getType(result.primary).label);
}

export function positionSentence(result: Pick<Result, "primary" | "focus" | "style" | "focusStrength" | "styleStrength">): string {
  const label = getType(result.primary).label;
  const focusSide = result.focus < 50 ? t.results.task : t.results.people;
  const styleSide = result.style < 50 ? t.results.ask : t.results.tell;
  return t.results.position(
    label,
    t.results.lean(result.focusStrength, focusSide),
    t.results.lean(result.styleStrength, styleSide),
  );
}
