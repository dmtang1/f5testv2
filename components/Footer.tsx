"use client";

import { site } from "@/data/config";
import { t } from "@/data/locale/en";
import { disclaimer } from "@/data/principles";
import { EmailCapture } from "@/components/EmailCapture";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/test") return null;
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="font-display" style={{ fontSize: "1.6rem", margin: 0 }}>
            {site.productName}
          </p>
          <p className="fine">{site.attribution}</p>
          <p className="fine">{disclaimer}</p>
          <p>
            <Link href="/privacy">{t.footer.privacy}</Link>
            {" · "}
            <a href={site.privacyPolicyUrl}>crowdcreate.us privacy policy</a>
          </p>
          <p className="fine">© {new Date().getFullYear()} {t.footer.rights}</p>
        </div>
        <EmailCapture source="landing" compact />
      </div>
    </footer>
  );
}
