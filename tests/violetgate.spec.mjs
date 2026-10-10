import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const noHorizontalOverflow = async (page) => {
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('initial layout is a readable non-functional authentication demo', async ({ page }) => {
  await expect(page).toHaveTitle(/VioletGate/);
  await expect(page.locator('#signInSection .demo-notice')).toBeVisible();
  await expect(page.locator('#signInSection')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#signUpSection')).toHaveAttribute('aria-hidden', 'true');
  await noHorizontalOverflow(page);
});

test('switching forms preserves keyboard focus and removes hidden panels from tab order', async ({ page }) => {
  await page.locator('#register').click();
  await expect(page.locator('#signup-title')).toBeFocused();
  await expect(page.locator('#signUpSection')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#toggleRight')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#toggleRight')).toHaveJSProperty('inert', true);
  await expect(page.locator('#signInSection')).toHaveJSProperty('inert', true);
  await page.locator('#login').click();
  await expect(page.locator('#signin-title')).toBeFocused();
  await expect(page.locator('#toggleLeft')).toHaveJSProperty('inert', true);
  await noHorizontalOverflow(page);
});

test('light/dark switch updates ARIA and survives a reload', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('violetgate-theme', 'light'));
  await page.reload();
  const theme = page.locator('#themeToggle');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await theme.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(theme).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('demo does not transmit credentials or navigate on interaction', async ({ page }) => {
  const externalRequests = [];
  page.on('request', req => {
    if (!req.url().startsWith('http://127.0.0.1:4173/')) externalRequests.push(req.url());
  });
  await page.locator('#signin-email').fill('test@example.invalid');
  await page.locator('#signin-password').fill('NOT_A_REAL_PASSWORD');
  await page.locator('#signInForm [data-demo-submit]').click();
  await expect(page.locator('#signin-status')).toContainText('Frontend demo only');
  await page.locator('#signInForm [data-social="GitHub"]').click();
  await expect(page.locator('#signin-status')).toContainText('not available');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  expect(externalRequests).toEqual([]);
});

test('axe: sign-in and sign-up meet WCAG A/AA with no serious or critical issues', async ({ page }) => {
  for (const signUp of [false, true]) {
    if (signUp) await page.locator('#register').click();
    await page.waitForTimeout(650);
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const actionable = scan.violations.filter(v => ['serious', 'critical'].includes(v.impact));
    expect(actionable.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  }
});

test('desktop/mobile remain within viewport across modes', async ({ page }) => {
  for (const width of [320, 390, 768, 1366]) {
    await page.setViewportSize({ width, height: 844 });
    await noHorizontalOverflow(page);
    await page.locator('#register').click();
    await page.waitForTimeout(650);
    await noHorizontalOverflow(page);
    await page.locator('#login').click();
    await page.waitForTimeout(650);
  }
});


test('forms do not submit when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/');
    await page.locator('#signin-email').fill('test@example.invalid');
    await page.locator('#signin-password').fill('not-a-real-password');
    await page.locator('#signInForm [data-demo-submit]').click();
    await expect(page).toHaveURL('http://127.0.0.1:4173/');
    const inputsNamed = await page.locator('input[name]').count();
    expect(inputsNamed).toBe(0);
  } finally {
    await context.close();
  }
});
