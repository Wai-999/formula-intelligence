import { test, expect } from '@playwright/test';
import { VISIBLE } from './helpers.js';

// Acceptance test 7: after one online visit, core learning works without a
// network; Python-dependent features say plainly that they need one.

test('acceptance 7: lessons, labs, maps and the diagnostic work offline; Python explains its limit', async ({ page, context }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
  await page.goto('./#home', { waitUntil: 'networkidle' });
  // Wait for the service worker to install (precache) and take control.
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 30_000 }).toBe(true);

  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1.page-title')).toHaveText('Home');

  // A lesson never opened before: its code, its lab and its fonts come from the precache.
  await page.evaluate(() => { location.hash = '#learn/lesson/c2-taylor'; });
  await expect(page.locator('h1.page-title')).toHaveText('Taylor polynomials');
  await expect(page.locator(VISIBLE + '.lab').first()).toBeVisible();
  expect(await page.locator(VISIBLE + 'math').count()).toBeGreaterThan(10);

  await page.evaluate(() => { location.hash = '#maps/concepts'; });
  await expect(page.locator(VISIBLE + '.cmap-node').first()).toBeVisible();

  await page.evaluate(() => { location.hash = '#progress/diagnostic'; });
  await page.getByRole('button', { name: 'Start the diagnostic' }).click();
  await expect(page.locator('.dx-question')).toBeVisible();

  // Python cannot download offline — and says why instead of hanging.
  await page.evaluate(() => { location.hash = '#projects/lab'; });
  await page.locator(VISIBLE + '.pylab-run').filter({ hasText: 'Run' }).click();
  await expect(page.locator(VISIBLE + '.pylab-out-err')).toContainText('you may be offline', { timeout: 30_000 });
  await context.setOffline(false);
});
