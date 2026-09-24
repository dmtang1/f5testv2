import { QUESTION_BANK_VERSION } from "@/data/questions";
import type { Result, TypeId } from "@/lib/model";
import { secondaryType, strength, typeFromScores } from "@/lib/scoring";

const CODE_TO_TYPE = {
  DI: "director",
  MO: "motivator",
  DE: "defender",
  TE: "teammate",
} as const;

const TYPE_TO_CODE: Record<TypeId, keyof typeof CODE_TO_TYPE> = {
  director: "DI",
  motivator: "MO",
  defender: "DE",
  teammate: "TE",
};

export function encodeShareCode(result: Pick<Result, "primary" | "secondary" | "style" | "focus">): string {
  const primary = TYPE_TO_CODE[result.primary];
  const head = result.secondary ? `${primary}-${TYPE_TO_CODE[result.secondary]}` : primary;
  return `${head}-${result.style}-${result.focus}`;
}

export function decodeShareCode(raw: string): Omit<Result, "completedAt" | "name" | "shareName"> | null {
  let code = raw.trim();
  try {
    code = decodeURIComponent(code);
  } catch {
    return null;
  }
  const match = /^(DI|MO|DE|TE)(?:-(DI|MO|DE|TE))?-(\d{1,3})-(\d{1,3})$/i.exec(code);
  if (!match) return null;
  const primary = CODE_TO_TYPE[match[1].toUpperCase() as keyof typeof CODE_TO_TYPE];
  const secondaryCode = match[2]?.toUpperCase() as keyof typeof CODE_TO_TYPE | undefined;
  const secondary = secondaryCode ? CODE_TO_TYPE[secondaryCode] : undefined;
  const style = Number(match[3]);
  const focus = Number(match[4]);
  if (!Number.isInteger(style) || !Number.isInteger(focus) || style > 100 || focus > 100) return null;
  if (secondary && secondary === primary) return null;
  if (typeFromScores(focus, style) !== primary) return null;
  const expectedSecondary = secondaryType(focus, style);
  if ((expectedSecondary ?? undefined) !== secondary) return null;
  return {
    version: QUESTION_BANK_VERSION,
    focus,
    style,
    primary,
    ...(secondary ? { secondary } : {}),
    focusStrength: strength(focus),
    styleStrength: strength(style),
  };
}

export function sanitizeName(input: string | undefined | null): string | undefined {
  if (!input || input.includes("@")) return undefined;
  const cleaned = input.replace(/[^\p{L}\p{M}\s'.-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 40);
  if (!cleaned || cleaned.includes("@")) return undefined;
  return cleaned;
}

export function buildSharePath(result: Pick<Result, "primary" | "secondary" | "style" | "focus" | "version" | "name" | "shareName">): string {
  const params = new URLSearchParams();
  params.set("v", result.version);
  if (result.shareName && result.name) params.set("n", result.name);
  return `/r/${encodeShareCode(result)}?${params.toString()}`;
}

export function parseShareInput(input: string): { type: TypeId; name?: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  let code = trimmed;
  let name: string | undefined;
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    const index = parts.indexOf("r");
    code = index >= 0 ? parts[index + 1] ?? "" : parts[parts.length - 1] ?? "";
    name = sanitizeName(url.searchParams.get("n"));
  } catch {
    const [pathPart, query] = trimmed.split("?");
    code = pathPart.split("/").filter(Boolean).pop() ?? pathPart;
    if (query) name = sanitizeName(new URLSearchParams(query).get("n"));
  }
  const decoded = decodeShareCode(code);
  if (!decoded) return null;
  return { type: decoded.primary, ...(name ? { name } : {}) };
}
