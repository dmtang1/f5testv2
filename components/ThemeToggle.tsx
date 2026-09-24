"use client";

import { t } from "@/data/locale/en";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const explicit = document.documentElement.getAttribute("data-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(explicit ? explicit === "dark" : prefers);
  }, []);

  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("f5-theme", next);
    } catch {
      /* ignore */
    }
    setDark(!dark);
  }

  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={dark ? t.a11y.themeToLight : t.a11y.themeToDark}>
      {dark ? "Light" : "Dark"}
    </button>
  );
}
