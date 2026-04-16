import { test, expect } from '../fixtures/pages';

test.describe('Checkboxes page', () => {
  test('should have correct initial states', async ({ checkboxesPage }) => {
    await checkboxesPage.visit();

    await expect(checkboxesPage.getCheckbox(0)).not.toBeChecked();
    await expect(checkboxesPage.getCheckbox(1)).toBeChecked();
  });

  test('should check the first checkbox', async ({ checkboxesPage }) => {
    await checkboxesPage.visit();
    await checkboxesPage.toggle(0);

    await expect(checkboxesPage.getCheckbox(0)).toBeChecked();
  });

  test('should uncheck the second checkbox', async ({ checkboxesPage }) => {
    await checkboxesPage.visit();
    await checkboxesPage.toggle(1);

    await expect(checkboxesPage.getCheckbox(1)).not.toBeChecked();
  });

  test('should toggle both checkboxes', async ({ checkboxesPage }) => {
    await checkboxesPage.visit();
    await checkboxesPage.toggle(0);
    await checkboxesPage.toggle(1);

    await expect(checkboxesPage.getCheckbox(0)).toBeChecked();
    await expect(checkboxesPage.getCheckbox(1)).not.toBeChecked();
  });
});
