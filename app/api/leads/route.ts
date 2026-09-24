import { isHoneypot, validateLead } from "@/lib/lead-validation";
import { storeLead } from "@/lib/lead-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();

function allowed(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 8) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function sameOrigin(request: Request): boolean {
  const host = request.headers.get("host");
  if (!host) return false;
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const site = request.headers.get("sec-fetch-site");
  return site === "same-origin" || site === "none";
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 20_000) return NextResponse.json({ ok: false }, { status: 413 });
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowed(ip)) return NextResponse.json({ ok: false }, { status: 429 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (isHoneypot(body)) return NextResponse.json({ ok: true });
  const parsed = validateLead(body);
  if (!parsed.ok) return NextResponse.json({ ok: false }, { status: 400 });
  await storeLead(parsed.lead);
  return NextResponse.json({ ok: true });
}
