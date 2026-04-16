# Playwright: Python → TypeScript reference

A side-by-side cheat sheet for porting the patterns used in [playwright-e2e-testing](https://github.com/jpcarniel/playwright-e2e-testing) (Python + pytest) to this repo (Node.js + TypeScript).

## 1. Page Object

**Python:**
```python
class LoginPage:
    USERNAME_INPUT = "#username"

    def __init__(self, page):
        self.page = page

    def fill_username(self, username):
        self.page.fill(self.USERNAME_INPUT, username)
```

**TypeScript:**
```ts
import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }
}
```

Differences that matter:
- Every action is `async` and must be `await`ed.
- Locators are stored as `Locator` properties at construction time, not as selector strings.
- Methods return `Promise<void>` instead of implicit `None`.
- Property names are `camelCase` by convention.

## 2. Fixtures (dependency injection)

**Python (`conftest.py`):**
```python
import pytest
from pages.login_page import LoginPage

@pytest.fixture()
def login_page(page):
    return LoginPage(page)
```

**TypeScript (`fixtures/pages.ts`):**
```ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Pages = { loginPage: LoginPage };

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
```

Tests then import `test` and `expect` from `fixtures/pages.ts` instead of from `@playwright/test` directly.

## 3. Assertions

**Python:**
```python
from playwright.sync_api import expect

expect(page).to_have_url(re.compile(r"/secure"))
expect(login_page.flash_message).to_contain_text("You logged in")
expect(checkbox).not_to_be_checked()
```

**TypeScript:**
```ts
await expect(page).toHaveURL(/\/secure/);
await expect(loginPage.flashMessage).toContainText('You logged in');
await expect(checkbox).not.toBeChecked();
```

Differences:
- `snake_case` → `camelCase` method names.
- Every assertion on a `Locator` or `Page` is `async` and must be `await`ed.
- Python uses `not_to_be_checked()`; TypeScript uses `.not.toBeChecked()`.

## 4. Dialogs (alert / confirm / prompt)

**Python:**
```python
page.on("dialog", lambda dialog: dialog.accept())
page.on("dialog", lambda dialog: dialog.dismiss())
page.on("dialog", lambda dialog: dialog.accept("my text"))
```

**TypeScript:**
```ts
page.once('dialog', (dialog) => dialog.accept());
page.once('dialog', (dialog) => dialog.dismiss());
page.once('dialog', (dialog) => dialog.accept('my text'));
```

`page.once` (vs `page.on`) is preferred when only a single dialog is expected — it auto-removes the listener after firing.

## 5. API testing

**Python:** not included in the sister repo. Would typically use `requests` or `httpx`.

**TypeScript:** use the built-in `request` fixture — no extra library needed:

```ts
test('GET returns 200', async ({ request }) => {
  const response = await request.get('https://httpbin.org/status/200');
  expect(response.status()).toBe(200);
});
```

## 6. Configuration

| Concern | Python (`pytest.ini`) | TypeScript (`playwright.config.ts`) |
|---------|----------------------|-------------------------------------|
| Base URL | `base_url = https://...` | `use: { baseURL: '...' }` |
| Parallelism | pytest-xdist (`-n auto`) | `fullyParallel: true`, `workers` |
| Retries | plugin-specific | `retries: 1` |
| Tracing | `--tracing=retain-on-failure` | `use: { trace: 'on-first-retry' }` |
| Browsers | `pytest-playwright --browser` | `projects: [{ use: devices[...] }]` |

## 7. Running tests

| Action | Python | TypeScript |
|--------|--------|------------|
| All tests | `pytest -v` | `npx playwright test` |
| Single file | `pytest tests/test_login.py -v` | `npx playwright test login.spec.ts` |
| Headed | `pytest --headed` | `npx playwright test --headed` |
| UI mode | n/a | `npx playwright test --ui` |
| Show report | n/a (uses pytest output) | `npx playwright show-report` |

## 8. When to use which

- **Prototyping, quick scripts:** Python is faster to read and write.
- **Shared Node.js codebase, front-end team:** TypeScript integrates directly with the project's tooling (ESLint, tsconfig, same CI).
- **API testing in the same suite:** Node.js has `request` context built in; Python needs an external HTTP client.
- **Tight ecosystem with front-end:** TypeScript + `@playwright/test` is the default in most modern QA orgs that ship JavaScript/TypeScript products.
