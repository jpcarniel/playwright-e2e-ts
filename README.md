![CI](https://github.com/jpcarniel/playwright-e2e-ts/actions/workflows/playwright.yml/badge.svg)

# Playwright E2E Testing — Node.js / TypeScript

Projeto de automação de testes end-to-end e de API para o [The Internet](https://the-internet.herokuapp.com) usando **Playwright Test** com **TypeScript**.

Projeto irmão do [playwright-e2e-testing](https://github.com/jpcarniel/playwright-e2e-testing) (mesmo alvo, escrito em Python + pytest). Este repo mostra os mesmos padrões de engenharia — Page Object Model, fixtures, CI — na stack Node.js/TypeScript.

## O que é testado

| Área | Testes |
|------|--------|
| Login (UI) | Credenciais válidas, usuário inválido, senha inválida, campos vazios, logout |
| Dropdown (UI) | Estado inicial, seleção única, troca entre opções |
| Checkboxes (UI) | Estados iniciais, toggle, interações combinadas |
| Dynamic Loading (UI) | Elementos ocultos-e-exibidos, renderizados-ao-clicar |
| JavaScript Alerts (UI) | Alert, confirm (aceitar/cancelar), prompt (aceitar com texto/cancelar) |
| HTTP API | GET, POST, query params, headers customizados, status codes 2xx/4xx |

**Total:** 25 testes em 6 specs.

## Stack

- [Playwright Test](https://playwright.dev/) 1.48
- TypeScript 5 (strict mode)
- Node.js 20
- Chromium (headless)
- GitHub Actions (CI)

## Como executar

```bash
# Instalar dependências
npm install

# Instalar os browsers do Playwright
npx playwright install --with-deps chromium

# Rodar todos os testes (headless)
npm test

# Rodar com browser visível
npm run test:headed

# Abrir o modo UI do Playwright (test runner interativo)
npm run test:ui

# Rodar um spec específico
npm run test:login
npm run test:api

# Abrir o HTML report após uma execução
npm run report
```

## Estrutura do projeto

```
playwright-e2e-ts/
├── .github/workflows/     # CI com GitHub Actions
├── pages/                 # Page Objects (classes tipadas)
│   ├── LoginPage.ts
│   ├── DropdownPage.ts
│   ├── CheckboxesPage.ts
│   ├── DynamicLoadingPage.ts
│   └── JavaScriptAlertsPage.ts
├── fixtures/
│   └── pages.ts           # Fixtures customizadas que injetam os Page Objects
├── tests/
│   ├── login.spec.ts
│   ├── dropdown.spec.ts
│   ├── checkboxes.spec.ts
│   ├── dynamic-loading.spec.ts
│   ├── javascript-alerts.spec.ts
│   └── api.spec.ts        # Camada de API via request context
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Arquitetura

- **Page Object Model.** Cada página testada tem uma classe tipada em `pages/` que expõe locators e ações de alto nível. Os testes nunca tocam em seletores diretamente.
- **Fixtures tipadas.** `fixtures/pages.ts` usa `test.extend()` pra injetar instâncias de Page Objects nos testes — uma instância nova por teste. É o equivalente Node.js/TypeScript do `conftest.py` do pytest.
- **Auto-waiting.** Playwright aguarda elementos ficarem visíveis/estáveis antes de interagir. Sem sleeps explícitos.
- **Tratamento de dialogs.** Alerts/confirms/prompts são tratados com `page.once('dialog', ...)` **antes** da ação que os dispara.
- **Cobertura de API.** `api.spec.ts` usa o `request` context nativo do Playwright pra bater direto numa API HTTP — mesmo projeto, sem lib extra.
- **Paralelismo.** `fullyParallel: true` roda os testes de um spec em paralelo.
- **CI.** GitHub Actions roda a suíte completa em push e PR pra `main`; o HTML report é enviado como artifact em toda execução.
