import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DropdownPage } from '../pages/DropdownPage';
import { CheckboxesPage } from '../pages/CheckboxesPage';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';
import { JavaScriptAlertsPage } from '../pages/JavaScriptAlertsPage';

/**
 * Custom Playwright fixtures that inject Page Objects into tests.
 *
 * Each test declares the pages it needs in the destructured first argument,
 * e.g. `test('...', async ({ loginPage, page }) => { ... })`. Playwright
 * handles the lifecycle — one fresh instance per test.
 *
 * This is the TypeScript equivalent of pytest's `conftest.py` fixtures.
 */
type Pages = {
  loginPage: LoginPage;
  dropdownPage: DropdownPage;
  checkboxesPage: CheckboxesPage;
  dynamicLoadingPage: DynamicLoadingPage;
  javascriptAlertsPage: JavaScriptAlertsPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dropdownPage: async ({ page }, use) => {
    await use(new DropdownPage(page));
  },
  checkboxesPage: async ({ page }, use) => {
    await use(new CheckboxesPage(page));
  },
  dynamicLoadingPage: async ({ page }, use) => {
    await use(new DynamicLoadingPage(page));
  },
  javascriptAlertsPage: async ({ page }, use) => {
    await use(new JavaScriptAlertsPage(page));
  },
});

export { expect } from '@playwright/test';
