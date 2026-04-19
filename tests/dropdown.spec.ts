import { test, expect } from '../fixtures/pages';

test.describe('Dropdown page', () => {
  test('should have no option selected by default', async ({ dropdownPage }) => {
    await dropdownPage.visit();

    await expect(dropdownPage.dropdown).toHaveValue('');
  });

  test('should select option 1', async ({ dropdownPage }) => {
    await dropdownPage.visit();
    await dropdownPage.selectOption('1');

    await expect(dropdownPage.dropdown).toHaveValue('1');
  });

  test('should select option 2', async ({ dropdownPage }) => {
    await dropdownPage.visit();
    await dropdownPage.selectOption('2');

    await expect(dropdownPage.dropdown).toHaveValue('2');
  });

  test('should switch selection from option 1 to option 2', async ({ dropdownPage }) => {
    await dropdownPage.visit();
    await dropdownPage.selectOption('1');
    await expect(dropdownPage.dropdown).toHaveValue('1');

    await dropdownPage.selectOption('2');
    await expect(dropdownPage.dropdown).toHaveValue('2');
  });
});
