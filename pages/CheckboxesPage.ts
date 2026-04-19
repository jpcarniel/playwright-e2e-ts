import { Locator, Page } from '@playwright/test';

export class CheckboxesPage {
  readonly page: Page;
  readonly checkboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkboxes = page.locator('#checkboxes input[type="checkbox"]');
  }

  async visit(): Promise<void> {
    await this.page.goto('/checkboxes');
  }

  getCheckbox(index: number): Locator {
    return this.checkboxes.nth(index);
  }

  async toggle(index: number): Promise<void> {
    await this.getCheckbox(index).click();
  }
}
