"use client";

import { t } from "@/data/locale/en";
import { track } from "@/lib/analytics";
import Link from "next/link";
import { useId, useState } from "react";
import type { Result } from "@/lib/model";

export function EmailCapture({ source, result, compact = false }: { source: "landing" | "results"; result?: Result; compact?: boolean }) {
  const emailId = useId();
  const consentId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsentChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting" || status === "success") return;
    if (!consent) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage(t.email.invalid);
      return;
    }
    setStatus("submitting");
    const form = new FormData(event.currentTarget);
    try {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const response = await fetch(`${base}/api/leads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          consent: true,
          source,
          company_website: String(form.get("company_website") ?? ""),
          ...(result?.name ? { name: result.name } : {}),
          ...(source === "results" && result
            ? { type: result.primary, focus: result.focus, style: result.style }
            : {}),
        }),
      });
      if (!response.ok) {
        setStatus("error");
        setMessage(response.status === 429 ? t.email.rate : response.status === 400 ? t.email.invalid : t.email.failed);
        return;
      }
      track("email_submit", { source });
      setStatus("success");
      setMessage(t.email.success);
    } catch {
      setStatus("error");
      setMessage(t.email.failed);
    }
  }

  if (status === "success") return <p role="status" className="status">{message}</p>;

  return (
    <form onSubmit={onSubmit} noValidate>
      {compact ? null : (
        <p className="font-display" style={{ fontSize: "1.4rem", margin: "0 0 0.25rem" }}>
          {t.teasers.formTitle}
        </p>
      )}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${emailId}-hp`}>{t.email.honeypot}</label>
        <input id={`${emailId}-hp`} name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor={emailId}>{t.email.label}</label>
        <input id={emailId} name="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>
      <label className="check" htmlFor={consentId}>
        <input id={consentId} type="checkbox" checked={consent} onChange={(event) => setConsentChecked(event.target.checked)} />
        <span>{t.email.consent}</span>
      </label>
      <p className="fine">
        {t.email.micro} <Link href="/privacy">{t.email.privacy}</Link>
      </p>
      {status === "error" ? <p role="alert" className="alert">{message}</p> : null}
      <button className="btn" type="submit" disabled={!consent || status === "submitting"}>
        {t.email.submit}
      </button>
    </form>
  );
}
