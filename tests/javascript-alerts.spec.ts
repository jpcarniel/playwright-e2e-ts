import { test, expect } from '../fixtures/pages';

test.describe('JavaScript Alerts page', () => {
  test('should accept a JS alert', async ({ javascriptAlertsPage, page }) => {
    await javascriptAlertsPage.visit();

    // IMPORTANT: register the dialog handler before the action that opens it.
    page.once('dialog', (dialog) => dialog.accept());

    await javascriptAlertsPage.triggerAlert();

    await expect(javascriptAlertsPage.result).toHaveText('You successfully clicked an alert');
  });

  test('should accept a JS confirm', async ({ javascriptAlertsPage, page }) => {
    await javascriptAlertsPage.visit();

    page.once('dialog', (dialog) => dialog.accept());

    await javascriptAlertsPage.triggerConfirm();

    await expect(javascriptAlertsPage.result).toHaveText('You clicked: Ok');
  });

  test('should dismiss a JS confirm', async ({ javascriptAlertsPage, page }) => {
    await javascriptAlertsPage.visit();

    page.once('dialog', (dialog) => dialog.dismiss());

    await javascriptAlertsPage.triggerConfirm();

    await expect(javascriptAlertsPage.result).toHaveText('You clicked: Cancel');
  });

  test('should enter text in a JS prompt and accept it', async ({ javascriptAlertsPage, page }) => {
    await javascriptAlertsPage.visit();

    page.once('dialog', (dialog) => dialog.accept('Hello from Playwright'));

    await javascriptAlertsPage.triggerPrompt();

    await expect(javascriptAlertsPage.result).toHaveText('You entered: Hello from Playwright');
  });

  test('should dismiss a JS prompt without text', async ({ javascriptAlertsPage, page }) => {
    await javascriptAlertsPage.visit();

    page.once('dialog', (dialog) => dialog.dismiss());

    await javascriptAlertsPage.triggerPrompt();

    await expect(javascriptAlertsPage.result).toHaveText('You entered: null');
  });
});
