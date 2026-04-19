import { Locator, Page } from '@playwright/test';

export class DropdownPage {
  readonly page: Page;
  readonly dropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdown = page.locator('#dropdown');
  }

  async visit(): Promise<void> {
    await this.page.goto('/dropdown');
  }

  async selectOption(value: string): Promise<void> {
    await this.dropdown.selectOption(value);
  }
}
