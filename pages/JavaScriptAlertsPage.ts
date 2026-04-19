import { Locator, Page } from '@playwright/test';

export class JavaScriptAlertsPage {
  readonly page: Page;
  readonly alertButton: Locator;
  readonly confirmButton: Locator;
  readonly promptButton: Locator;
  readonly result: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alertButton = page.getByRole('button', { name: 'Click for JS Alert' });
    this.confirmButton = page.getByRole('button', { name: 'Click for JS Confirm' });
    this.promptButton = page.getByRole('button', { name: 'Click for JS Prompt' });
    this.result = page.locator('#result');
  }

  async visit(): Promise<void> {
    await this.page.goto('/javascript_alerts');
  }

  async triggerAlert(): Promise<void> {
    await this.alertButton.click();
  }

  async triggerConfirm(): Promise<void> {
    await this.confirmButton.click();
  }

  async triggerPrompt(): Promise<void> {
    await this.promptButton.click();
  }
}
