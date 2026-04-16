import { test, expect } from '@playwright/test';

/**
 * API tests using Playwright's built-in `request` fixture.
 *
 * These tests exercise the httpbin.org public API to demonstrate that
 * Playwright can cover the API layer in the same project as the UI tests —
 * no extra tool (Postman, supertest, axios) needed.
 */
test.describe('API testing with Playwright request context', () => {
  const baseURL = 'https://httpbin.org';

  test('GET /status/200 returns 200 OK', async ({ request }) => {
    const response = await request.get(`${baseURL}/status/200`);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
  });

  test('GET /status/404 returns 404 Not Found', async ({ request }) => {
    const response = await request.get(`${baseURL}/status/404`);

    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
  });

  test('POST /post echoes the JSON payload', async ({ request }) => {
    const payload = { user: 'tomsmith', action: 'login' };

    const response = await request.post(`${baseURL}/post`, {
      data: payload,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.json).toEqual(payload);
    expect(body.headers['Content-Type']).toBe('application/json');
  });

  test('GET /headers echoes a custom Authorization header', async ({ request }) => {
    const response = await request.get(`${baseURL}/headers`, {
      headers: { Authorization: 'Bearer fake-token-123' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.headers.Authorization).toBe('Bearer fake-token-123');
  });

  test('GET /get returns JSON with query params', async ({ request }) => {
    const response = await request.get(`${baseURL}/get`, {
      params: { q: 'playwright', lang: 'typescript' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.args).toEqual({ q: 'playwright', lang: 'typescript' });
  });
});
