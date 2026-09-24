"use client";

import { track } from "@/lib/analytics";
import { useEffect, useRef } from "react";

export function TrackOnView({ event, props }: { event: string; props?: Record<string, string | number> }) {
  const seen = useRef(false);
  useEffect(() => {
    if (seen.current) return;
    seen.current = true;
    track(event, props);
  }, [event, props]);
  return null;
}
