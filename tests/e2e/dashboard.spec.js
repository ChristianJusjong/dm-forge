// @ts-check
const { test, expect } = require('@playwright/test');

test('Dashboard loads and requires login', async ({ page }) => {
    await page.goto('/');

    // Should redirect to welcome or login if not authenticated
    await expect(page).toHaveURL(/.*(welcome|login)\.html/);
});

test('Login flow', async ({ page }) => {
    await page.goto('/login.html');

    // Fill login form (assuming test user exists)
    await page.fill('#email', 'demo');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // Should navigate to dashboard
    await expect(page).toHaveURL(/.*dashboard\.html/);
    await expect(page.locator('.page-title')).toContainText('Dashboard');
});
