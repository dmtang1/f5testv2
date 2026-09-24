import type { Lead, TypeId } from "@/lib/model";
import { TYPE_IDS } from "@/lib/model";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCES = new Set(["landing", "results"]);

export function isHoneypot(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const value = (body as Record<string, unknown>).company_website;
  return typeof value === "string" && value.trim().length > 0;
}

export function validateLead(body: unknown): { ok: true; lead: Lead } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "invalid" };
  const record = body as Record<string, unknown>;
  if (record.consent !== true) return { ok: false, error: "consent" };
  if (typeof record.email !== "string" || record.email.length > 254 || !EMAIL.test(record.email.trim())) {
    return { ok: false, error: "email" };
  }
  if (typeof record.source !== "string" || !SOURCES.has(record.source)) return { ok: false, error: "source" };
  const source = record.source as Lead["source"];
  let name: string | undefined;
  if (record.name !== undefined && record.name !== null && record.name !== "") {
    if (typeof record.name !== "string") return { ok: false, error: "name" };
    name = record.name.replace(/[^\p{L}\p{M}\s'.-]/gu, "").trim().slice(0, 40);
  }
  let type: TypeId | undefined;
  if (record.type !== undefined && record.type !== null && record.type !== "") {
    if (typeof record.type !== "string" || !(TYPE_IDS as string[]).includes(record.type)) {
      return { ok: false, error: "type" };
    }
    type = record.type as TypeId;
  }
  const score = (value: unknown, key: string) => {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 100) {
      return key;
    }
    return value;
  };
  const focus = score(record.focus, "focus");
  const style = score(record.style, "style");
  if (focus === "focus" || style === "style") return { ok: false, error: "score" };
  if (source === "results" && (type === undefined || typeof focus !== "number" || typeof style !== "number")) {
    return { ok: false, error: "result" };
  }
  return {
    ok: true,
    lead: {
      email: record.email.trim().toLowerCase(),
      ...(name ? { name } : {}),
      ...(type ? { type } : {}),
      ...(typeof focus === "number" ? { focus } : {}),
      ...(typeof style === "number" ? { style } : {}),
      consent: true,
      source,
      createdAt: new Date().toISOString(),
    },
  };
}

export function isDuplicate(existing: Lead[], incoming: Lead, now: number, windowMs = 15000): boolean {
  return existing.some(
    (lead) =>
      lead.email.toLowerCase() === incoming.email.toLowerCase() &&
      lead.source === incoming.source &&
      now - Date.parse(lead.createdAt) < windowMs,
  );
}
