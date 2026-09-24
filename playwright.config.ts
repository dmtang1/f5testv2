import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:3200",
    ...devices["Pixel 5"],
    viewport: { width: 375, height: 667 },
  },
  webServer: {
    command: "npm run dev -- --port 3200",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
