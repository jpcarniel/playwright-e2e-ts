# Playwright: referência Python → TypeScript

Cheat sheet lado a lado pra portar os padrões usados em [playwright-e2e-testing](https://github.com/jpcarniel/playwright-e2e-testing) (Python + pytest) pra este repo (Node.js + TypeScript).

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

Diferenças que importam:
- Toda ação é `async` e precisa de `await`.
- Locators são guardados como propriedades `Locator` no construtor, não como strings de seletor.
- Métodos retornam `Promise<void>` em vez de `None` implícito.
- Nomes de propriedade em `camelCase` por convenção.

## 2. Fixtures (injeção de dependência)

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

Os testes então importam `test` e `expect` de `fixtures/pages.ts`, em vez de `@playwright/test` diretamente.

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

Diferenças:
- Nomes de método em `snake_case` → `camelCase`.
- Toda assertion em `Locator` ou `Page` é `async` e precisa de `await`.
- Python usa `not_to_be_checked()`; TypeScript usa `.not.toBeChecked()`.

## 4. Dialogs (alert / confirm / prompt)

**Python:**
```python
page.on("dialog", lambda dialog: dialog.accept())
page.on("dialog", lambda dialog: dialog.dismiss())
page.on("dialog", lambda dialog: dialog.accept("meu texto"))
```

**TypeScript:**
```ts
page.once('dialog', (dialog) => dialog.accept());
page.once('dialog', (dialog) => dialog.dismiss());
page.once('dialog', (dialog) => dialog.accept('meu texto'));
```

`page.once` (vs `page.on`) é preferido quando só um dialog é esperado — remove o listener automaticamente após disparar.

## 5. Testes de API

**Python:** não tem no repo irmão. Tipicamente usaria `requests` ou `httpx`.

**TypeScript:** usa o `request` fixture nativo — sem lib extra:

```ts
test('GET retorna 200', async ({ request }) => {
  const response = await request.get('https://httpbin.org/status/200');
  expect(response.status()).toBe(200);
});
```

## 6. Configuração

| Aspecto | Python (`pytest.ini`) | TypeScript (`playwright.config.ts`) |
|---------|----------------------|-------------------------------------|
| Base URL | `base_url = https://...` | `use: { baseURL: '...' }` |
| Paralelismo | pytest-xdist (`-n auto`) | `fullyParallel: true`, `workers` |
| Retries | via plugin | `retries: 1` |
| Tracing | `--tracing=retain-on-failure` | `use: { trace: 'on-first-retry' }` |
| Browsers | `pytest-playwright --browser` | `projects: [{ use: devices[...] }]` |

## 7. Executando os testes

| Ação | Python | TypeScript |
|------|--------|------------|
| Todos os testes | `pytest -v` | `npx playwright test` |
| Arquivo único | `pytest tests/test_login.py -v` | `npx playwright test login.spec.ts` |
| Com browser visível | `pytest --headed` | `npx playwright test --headed` |
| Modo UI | n/a | `npx playwright test --ui` |
| Abrir report | n/a (usa a saída do pytest) | `npx playwright show-report` |

## 8. Quando usar cada um

- **Prototipagem, scripts rápidos:** Python é mais rápido de ler e escrever.
- **Codebase Node.js compartilhado com o time de front-end:** TypeScript integra direto com o tooling do projeto (ESLint, tsconfig, mesmo CI).
- **Testes de API na mesma suíte:** Node.js tem o `request` context embutido; Python precisa de cliente HTTP externo.
- **Ecossistema alinhado com o front-end:** TypeScript + `@playwright/test` é o padrão na maioria das orgs de QA modernas que entregam produtos em JavaScript/TypeScript.
