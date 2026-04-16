import { test, expect } from '../fixtures/pages';

test.describe('Login page', () => {
  test('should log in with valid credentials', async ({ loginPage, page }) => {
    await loginPage.visit();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    await expect(page).toHaveURL(/\/secure/);
    await expect(loginPage.flashMessage).toContainText('You logged into a secure area!');
  });

  test('should display an error for an invalid username', async ({ loginPage }) => {
    await loginPage.visit();
    await loginPage.login('invaliduser', 'SuperSecretPassword!');

    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });

  test('should display an error for an invalid password', async ({ loginPage }) => {
    await loginPage.visit();
    await loginPage.login('tomsmith', 'wrongpassword');

    await expect(loginPage.flashMessage).toContainText('Your password is invalid!');
  });

  test('should display an error when submitting empty fields', async ({ loginPage }) => {
    await loginPage.visit();
    await loginPage.submit();

    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });

  test('should log out after a successful login', async ({ loginPage, page }) => {
    await loginPage.visit();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await loginPage.logout();

    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.flashMessage).toContainText('You logged out of the secure area!');
  });
});
