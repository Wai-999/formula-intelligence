import { defineConfig, devices } from '@playwright/test';

// End-to-end journeys run against a real build, not the dev server: the
// lazy-chunk boundaries introduced in 0f146e1 only exist after bundling, and
// they are precisely what a cross-feature journey can break.
export default defineConfig({
  testDir: './e2e',
  // Journeys are stateful walks through the app; running them in parallel
  // inside one browser context would have them fight over localStorage.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // One retry in CI only. Locally a flake should be seen and fixed, not
  // papered over; in CI a single retry keeps an unrelated timing blip from
  // blocking a deploy.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:4321/formula-intelligence/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npx vite preview --port 4321 --strictPort',
    url: 'http://127.0.0.1:4321/formula-intelligence/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
