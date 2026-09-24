import type { TypeId } from "@/lib/model";

export function TypeIcon({ id }: { id: TypeId }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true as const };
  if (id === "director") {
    return (
      <svg {...common}>
        <path d="M5 12h12" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    );
  }
  if (id === "motivator") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
      </svg>
    );
  }
  if (id === "defender") {
    return (
      <svg {...common}>
        <path d="M12 3l7 3v6c0 4.2-2.8 7.2-7 8.5C7.8 19.2 5 16.2 5 12V6l7-3z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="8" cy="10" r="2.2" />
      <circle cx="16" cy="10" r="2.2" />
      <path d="M4.5 18c.6-2.2 2.2-3.3 3.5-3.3S11 15.8 11.5 18M12.5 18c.6-2.2 2.2-3.3 3.5-3.3S18.9 15.8 19.5 18" />
    </svg>
  );
}
