import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Lead } from "@/lib/model";
import { isDuplicate } from "@/lib/lead-validation";

export interface StoredLead extends Lead {
  id: string;
}

export function leadsFilePath(): string {
  return process.env.LEADS_FILE ?? path.join(process.cwd(), ".data", "leads.json");
}

export async function readLeads(): Promise<StoredLead[]> {
  try {
    const raw = await readFile(/* turbopackIgnore: true */ leadsFilePath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
  } catch {
    return [];
  }
}

/**
 * Stub store plus one integration point.
 * Set LEAD_WEBHOOK_URL to POST the lead JSON to Mailchimp, ConvertKit, Resend, or a Sheets webhook.
 */
export async function forwardLead(lead: StoredLead): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!response.ok) throw new Error(`webhook ${response.status}`);
}

export async function storeLead(lead: Lead): Promise<{ duplicate: boolean }> {
  const existing = await readLeads();
  if (isDuplicate(existing, lead, Date.now())) return { duplicate: true };
  const stored: StoredLead = { ...lead, id: crypto.randomUUID() };
  existing.push(stored);
  const file = leadsFilePath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(existing, null, 2));
  try {
    await forwardLead(stored);
  } catch (error) {
    console.error("lead webhook failed", error);
  }
  return { duplicate: false };
}
