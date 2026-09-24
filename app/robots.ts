import type { MetadataRoute } from "next";
import { site } from "@/data/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/results", "/r/", "/debug", "/api/"] },
    sitemap: new URL("/sitemap.xml", site.siteUrl).toString(),
  };
}
