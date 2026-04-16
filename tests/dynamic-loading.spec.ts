import { test, expect } from '../fixtures/pages';

test.describe('Dynamic Loading page', () => {
  test('should reveal a hidden element after loading (example 1)', async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.visitExample(1);
    await dynamicLoadingPage.clickStart();

    // Playwright auto-waits for visibility; 10s covers the simulated latency.
    await expect(dynamicLoadingPage.loadedText).toBeVisible({ timeout: 10_000 });
    await expect(dynamicLoadingPage.loadedText).toHaveText('Hello World!');
  });

  test('should render an element that was not in the DOM (example 2)', async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.visitExample(2);
    await dynamicLoadingPage.clickStart();

    await expect(dynamicLoadingPage.loadedText).toBeVisible({ timeout: 10_000 });
    await expect(dynamicLoadingPage.loadedText).toHaveText('Hello World!');
  });
});
