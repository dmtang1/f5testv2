"use client";

import { t } from "@/data/locale/en";
import { getConsent, setConsent } from "@/lib/analytics";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null && pathname !== "/test");
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("has-consent-banner", visible);
    return () => document.body.classList.remove("has-consent-banner");
  }, [visible]);

  if (!visible) return null;

  function choose(value: "all" | "essential") {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div className="consent" role="dialog" aria-label="Analytics consent">
      <p style={{ margin: 0 }}>{t.consent.body}</p>
      <div className="actions">
        <button type="button" className="btn" onClick={() => choose("all")}>
          {t.consent.allow}
        </button>
        <button type="button" className="btn-secondary" onClick={() => choose("essential")}>
          {t.consent.essential}
        </button>
      </div>
    </div>
  );
}
