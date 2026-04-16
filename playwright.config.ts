import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the-internet.herokuapp.com E2E suite.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Fail the build on CI if test.only is committed.
  forbidOnly: !!process.env.CI,

  // Run tests in parallel inside a file.
  fullyParallel: true,

  // Retry once on CI, never locally.
  retries: process.env.CI ? 1 : 0,

  // Workers: one less than available cores on CI to leave room for the runner.
  workers: process.env.CI ? 2 : undefined,

  // Reporter: HTML locally, list + HTML on CI.
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : [['html', { open: 'never' }]],

  use: {
    baseURL: 'https://the-internet.herokuapp.com',

    // Collect a Playwright trace only when a test is retried.
    trace: 'on-first-retry',

    // Capture a screenshot on failure.
    screenshot: 'only-on-failure',

    // Video is heavy; keep it for failures only.
    video: 'retain-on-failure',

    // Wait for actions up to 10s (navigation + click).
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
