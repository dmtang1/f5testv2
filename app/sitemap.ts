import type { MetadataRoute } from "next";
import { featureFlags, site } from "@/data/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/test", "/types", "/types/director", "/types/motivator", "/types/defender", "/types/teammate", "/playbook", "/privacy"];
  if (featureFlags.enableTeamMap) paths.push("/team");
  return paths.map((path) => ({
    url: new URL(path || "/", site.siteUrl).toString(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6,
  }));
}
