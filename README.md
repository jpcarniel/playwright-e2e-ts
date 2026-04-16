# Playwright E2E Testing — Node.js / TypeScript

End-to-end test automation against [the-internet.herokuapp.com](https://the-internet.herokuapp.com) using **Playwright Test** with **TypeScript**.

Companion to [playwright-e2e-testing](https://github.com/jpcarniel/playwright-e2e-testing) (same targets, written in Python + pytest). This repo shows the same engineering patterns — Page Object Model, fixtures, CI — in the Node.js/TypeScript stack.

## What is tested

| Area | Tests |
|------|-------|
| Login (UI) | Valid credentials, invalid username, invalid password, empty fields, logout |
| Dropdown (UI) | Default state, single selection, switching between options |
| Checkboxes (UI) | Initial states, toggling, combined interactions |
| Dynamic Loading (UI) | Hidden-then-shown, rendered-on-click |
| JavaScript Alerts (UI) | Alert, confirm (accept/dismiss), prompt (accept with text/dismiss) |
| HTTP API | GET, POST, query params, custom headers, 2xx/4xx status codes |

**Total:** 25 tests across 6 specs.

## Stack

- [Playwright Test](https://playwright.dev/) 1.48
- TypeScript 5 (strict mode)
- Node.js 20
- Chromium (headless)
- GitHub Actions (CI)

## How to run

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium

# Run all tests (headless)
npm test

# Run with a visible browser
npm run test:headed

# Open the Playwright UI mode (interactive test runner)
npm run test:ui

# Run a single spec
npm run test:login
npm run test:api

# Open the HTML report after a run
npm run report
```

## Project structure

```
playwright-e2e-ts/
├── .github/workflows/     # CI with GitHub Actions
├── docs/                  # Python-to-TypeScript reference
├── pages/                 # Page Objects (typed classes)
│   ├── LoginPage.ts
│   ├── DropdownPage.ts
│   ├── CheckboxesPage.ts
│   ├── DynamicLoadingPage.ts
│   └── JavaScriptAlertsPage.ts
├── fixtures/
│   └── pages.ts           # Custom fixtures that inject Page Objects
├── tests/
│   ├── login.spec.ts
│   ├── dropdown.spec.ts
│   ├── checkboxes.spec.ts
│   ├── dynamic-loading.spec.ts
│   ├── javascript-alerts.spec.ts
│   └── api.spec.ts        # API layer using request context
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Architecture

- **Page Object Model.** Each page under test has a typed class in `pages/` that exposes locators and high-level actions. Tests never touch selectors directly.
- **Typed fixtures.** `fixtures/pages.ts` uses `test.extend()` to inject Page Object instances into tests — one fresh instance per test. This is the Node.js/TypeScript equivalent of pytest's `conftest.py`.
- **Auto-waiting.** Playwright waits for elements to be visible/stable before interacting. No explicit sleeps.
- **Dialog handling.** JS alerts/confirms/prompts are handled via `page.once('dialog', ...)` **before** the action that triggers them.
- **API coverage.** `api.spec.ts` uses Playwright's built-in `request` context to hit an HTTP API directly — same project, no extra library.
- **Parallelism.** `fullyParallel: true` runs tests inside a single spec in parallel.
- **CI.** GitHub Actions runs the full suite on push and PR to `main`; the HTML report is uploaded as an artifact on every run.

## Documentation

- [Study guide (GitHub Pages)](https://jpcarniel.github.io/playwright-e2e-ts/) — full walkthrough of the codebase: architecture, config, fixtures, Page Objects, API testing, dialogs, CI, and interview Q&A.
- [Python → TypeScript reference](docs/python-to-typescript.md) — how each pattern in the sister Python repo maps to TypeScript.
