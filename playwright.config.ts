import { defineConfig, devices } from "@playwright/test";

/**
 * Accessibility checks run against the production standalone server, the same artifact Pantheon runs.
 * Build first (`pnpm build`); CI does this before invoking `pnpm test:a11y`.
 */
const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: `http://127.0.0.1:${PORT}`, colorScheme: "dark" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "node .next/standalone/server.js",
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: String(PORT),
      HOSTNAME: "127.0.0.1",
      // Deterministic by default: with a placeholder key P1 reads fail, so bio, tour and merch render from the
      // repo copy exactly as they do in CI. Set P1_LIVE=1 (with real credentials in .env) to test live content.
      ...(process.env.P1_LIVE ? {} : { CSS_API_KEY: "e2e-placeholder" }),
    },
    timeout: 60_000,
  },
});
