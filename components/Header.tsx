"use client";

import { featureFlags } from "@/data/config";
import { t } from "@/data/locale/en";
import { track } from "@/lib/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/#compare", label: t.nav.compare },
  { href: "/#how-it-works", label: t.nav.how },
  { href: "/types", label: t.nav.types },
  { href: "/playbook", label: t.nav.playbook },
  ...(featureFlags.enableTeamMap ? [{ href: "/team", label: t.nav.team }] : []),
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const testing = pathname === "/test";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        {t.a11y.skip}
      </a>
      <div className="header-inner">
        <Link href="/" aria-label={t.nav.home} className="wordmark">
          <span className="stamp">F5</span>
          <span>F5 TEST</span>
        </Link>
        {testing ? (
          <ThemeToggle />
        ) : (
          <>
            <nav className="nav-desktop" aria-label="Primary">
              {links.map((link) => (
                <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="actions">
              <ThemeToggle />
              <button type="button" className="nav-toggle" aria-expanded={open} aria-label={open ? t.nav.close : t.a11y.openMenu} onClick={() => setOpen((value) => !value)}>
                {open ? t.nav.close : t.nav.menu}
              </button>
              <Link className="btn" href="/test" onClick={() => track("cta_click", { location: "header" })}>
                {t.nav.cta}
              </Link>
            </div>
          </>
        )}
      </div>
      {open && !testing ? (
        <nav className="nav-mobile" aria-label="Primary mobile">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
