import { QUESTION_BANK_VERSION, questions } from "@/data/questions";
import type { Question, Result, Strength, TypeId } from "@/lib/model";

export const ITEMS_PER_AXIS = 11;

export function axisScore(poleBCount: number): number {
  if (!Number.isInteger(poleBCount) || poleBCount < 0 || poleBCount > ITEMS_PER_AXIS) {
    throw new Error("pole count out of range");
  }
  return Math.round((poleBCount / ITEMS_PER_AXIS) * 100);
}

/** Distance from 50: <15 slight, 15–34 moderate, ≥35 strong. */
export function strength(score: number): Strength {
  const distance = Math.abs(score - 50);
  if (distance < 15) return "slight";
  if (distance < 35) return "moderate";
  return "strong";
}

export function typeFromScores(focus: number, style: number): TypeId {
  const taskPrivate = focus < 50;
  const askIndirect = style < 50;
  if (taskPrivate && askIndirect) return "defender";
  if (taskPrivate && !askIndirect) return "director";
  if (!taskPrivate && askIndirect) return "teammate";
  return "motivator";
}

function crossed(score: number): number {
  return score < 50 ? 100 : 0;
}

/**
 * Flip the axis closer to 50. Equal distance flips Style.
 * Hide the secondary type when that distance is 25 or more.
 */
export function secondaryType(focus: number, style: number): TypeId | undefined {
  const focusDistance = Math.abs(focus - 50);
  const styleDistance = Math.abs(style - 50);
  const flipStyle = styleDistance <= focusDistance;
  const distance = flipStyle ? styleDistance : focusDistance;
  if (distance >= 25) return undefined;
  const nextFocus = flipStyle ? focus : crossed(focus);
  const nextStyle = flipStyle ? crossed(style) : style;
  return typeFromScores(nextFocus, nextStyle);
}

export function scoreAnswers(
  answers: Record<string, 0 | 1>,
  bank: Question[] = questions,
  extras?: { name?: string; shareName?: boolean; completedAt?: string },
): Result {
  let focusB = 0;
  let styleB = 0;
  let focusN = 0;
  let styleN = 0;
  for (const question of bank) {
    const value = answers[question.id];
    if (value !== 0 && value !== 1) throw new Error(`missing answer ${question.id}`);
    if (question.axis === "focus") {
      focusB += value;
      focusN += 1;
    } else {
      styleB += value;
      styleN += 1;
    }
  }
  if (focusN !== ITEMS_PER_AXIS || styleN !== ITEMS_PER_AXIS) {
    throw new Error("expected 11 items per axis");
  }
  const focus = axisScore(focusB);
  const style = axisScore(styleB);
  const name = extras?.name?.trim() || undefined;
  const secondary = secondaryType(focus, style);
  return {
    version: QUESTION_BANK_VERSION,
    focus,
    style,
    primary: typeFromScores(focus, style),
    ...(secondary ? { secondary } : {}),
    focusStrength: strength(focus),
    styleStrength: strength(style),
    ...(name ? { name } : {}),
    shareName: Boolean(name && extras?.shareName),
    completedAt: extras?.completedAt ?? new Date().toISOString(),
  };
}
