import { Locator, Page } from '@playwright/test';

/**
 * Page Object for /dynamic_loading.
 *
 * Two examples live on this page:
 *   /dynamic_loading/1 — element is hidden, then shown after a delay.
 *   /dynamic_loading/2 — element does not exist in the DOM, then is rendered.
 */
export class DynamicLoadingPage {
  readonly page: Page;
  readonly startButton: Locator;
  readonly loadedText: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startButton = page.locator('#start button');
    this.loadedText = page.locator('#finish h4');
    this.loadingIndicator = page.locator('#loading');
  }

  async visitExample(exampleNumber: 1 | 2): Promise<void> {
    await this.page.goto(`/dynamic_loading/${exampleNumber}`);
  }

  async clickStart(): Promise<void> {
    await this.startButton.click();
  }
}
