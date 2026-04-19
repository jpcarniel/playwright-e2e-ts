import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DropdownPage } from '../pages/DropdownPage';
import { CheckboxesPage } from '../pages/CheckboxesPage';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';
import { JavaScriptAlertsPage } from '../pages/JavaScriptAlertsPage';

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
