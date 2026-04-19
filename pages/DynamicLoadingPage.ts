import { Locator, Page } from '@playwright/test';

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
