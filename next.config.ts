import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/f5testv2" : "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  agentRules: false,
  ...(pages
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: `${basePath}/`,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
