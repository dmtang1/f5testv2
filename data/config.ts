/**
 * Assumptions live here so the client can change them without editing components.
 * Hero copy is the softened line in the locale file (PRD section 12).
 */
export const featureFlags = {
  /** Optional Team Map (FR-80). Set false to hide the route and nav link. */
  enableTeamMap: true,
};

export const limits = {
  teamMembers: 12,
  questions: 22,
};

export const site = {
  brandName: "F5",
  productName: "F5 Test",
  edition: "Chemistry by Design",
  attribution: "Chemistry by Design is credited to Bink Inc.",
  privacyPolicyUrl: "https://crowdcreate.us/privacy-policy/",
  deletionContactUrl: "https://crowdcreate.us/privacy-policy/",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

/**
 * Lead delivery.
 * The API stores leads in .data/leads.json.
 * Set LEAD_WEBHOOK_URL to forward each lead to Mailchimp, ConvertKit, Resend, or a Google Sheets webhook.
 */
export const leadIntegration = {
  webhookEnv: "LEAD_WEBHOOK_URL",
};
