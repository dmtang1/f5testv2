"use client";

import { featureFlags } from "@/data/config";
import { t } from "@/data/locale/en";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
        <nav className="nav-desktop" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? t.nav.close : t.a11y.openMenu}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? t.nav.close : t.nav.menu}</span>
          {open ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="nav-mobile" aria-label="Primary mobile">
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
