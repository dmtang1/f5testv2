import { describe, expect, it } from "vitest";
import { isDuplicate, isHoneypot, validateLead } from "@/lib/lead-validation";

const valid = {
  email: "Ada@Example.com",
  name: "Ada",
  type: "director",
  focus: 41,
  style: 78,
  consent: true,
  source: "results",
  company_website: "",
};

describe("leads", () => {
  it("requires consent and a real email", () => {
    expect(validateLead({ ...valid, consent: false }).ok).toBe(false);
    expect(validateLead({ ...valid, email: "nope" }).ok).toBe(false);
    const parsed = validateLead(valid);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.lead.email).toBe("ada@example.com");
  });

  it("treats a filled honeypot as a bot and collapses rapid duplicates", () => {
    expect(isHoneypot({ ...valid, company_website: "https://spam.test" })).toBe(true);
    expect(isHoneypot(valid)).toBe(false);
    const lead = validateLead(valid);
    if (!lead.ok) throw new Error("expected valid");
    const now = Date.parse(lead.lead.createdAt);
    expect(isDuplicate([lead.lead], { ...lead.lead, createdAt: new Date(now + 1000).toISOString() }, now + 1000)).toBe(true);
    expect(isDuplicate([lead.lead], { ...lead.lead, createdAt: new Date(now + 20000).toISOString() }, now + 20000)).toBe(false);
  });
});
