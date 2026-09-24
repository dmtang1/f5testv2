import { QUESTION_BANK_VERSION } from "@/data/questions";

export type AnalyticsProps = Record<string, string | number>;

type Consent = "all" | "essential" | null;

const QUEUE_LIMIT = 40;
const queue: { event: string; props?: AnalyticsProps }[] = [];

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem("f5-consent");
    if (value === "all" || value === "essential") return value;
  } catch {
    return null;
  }
  return null;
}

function emit(event: string, props?: AnalyticsProps) {
  const payload = { event, props: props ?? {}, ts: Date.now(), version: QUESTION_BANK_VERSION };
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", payload);
  }
  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  if (endpoint && typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, JSON.stringify(payload));
  }
}

export function track(event: string, props?: AnalyticsProps) {
  const consent = getConsent();
  if (consent === "essential") return;
  if (consent !== "all") {
    if (queue.length < QUEUE_LIMIT) queue.push({ event, props });
    return;
  }
  emit(event, props);
}

export function setConsent(value: "all" | "essential") {
  try {
    localStorage.setItem("f5-consent", value);
  } catch {
    /* storage blocked; keep the choice in memory for this page via the queue rules below */
  }
  if (value === "all") {
    while (queue.length) {
      const item = queue.shift();
      if (item) emit(item.event, item.props);
    }
  } else {
    queue.length = 0;
  }
}
