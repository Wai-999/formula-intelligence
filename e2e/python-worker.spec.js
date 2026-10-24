import { test, expect } from '@playwright/test';
import { VISIBLE } from './helpers.js';

// Acceptance test 6 (docs/PYTHON_RUNTIME_SECURITY.md): an infinite loop
// terminates, the page stays usable while it runs, and the runtime recovers.
// Downloads Pyodide (~10 MB) from the CDN, so it is tagged @heavy and runs
// as its own process: npm run e2e:python.

test.describe('python worker', () => {
  test.setTimeout(240_000);

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
  });

  test('@heavy an infinite loop is stopped, the page stays responsive, and Python recovers', async ({ page }) => {
    await page.goto('./#projects/lab', { waitUntil: 'networkidle' });
    const editor = page.locator(VISIBLE + '.pylab-editor');

    // Warm the runtime first, so the timing below measures the loop, not the download.
    await editor.fill('x = 41\nprint("ready", x + 1)');
    await page.locator(VISIBLE + '.pylab-run').filter({ hasText: 'Run' }).click();
    await expect(page.locator(VISIBLE + '.pylab-out-body').first()).toContainText('ready 42', { timeout: 180_000 });

    await editor.fill('while True:\n    pass');
    await page.locator(VISIBLE + '.pylab-run').filter({ hasText: 'Run' }).click();
    await expect(page.locator(VISIBLE + '.pylab-stop')).toBeVisible();

    // The main thread is free while Python spins: the UI still responds.
    const t0 = Date.now();
    await page.getByRole('button', { name: 'Focus mode' }).click();
    await expect(page.getByRole('button', { name: 'Leave focus mode' })).toBeVisible();
    expect(Date.now() - t0, 'the page must respond while the loop runs').toBeLessThan(3000);
    await page.getByRole('button', { name: 'Leave focus mode' }).click();

    // Stop terminates the worker immediately.
    await page.locator(VISIBLE + '.pylab-stop').click();
    await expect(page.locator(VISIBLE + '.pylab-out-err')).toContainText('Stopped');

    // A fresh runtime runs new code (state from before the restart is gone, as stated).
    await editor.fill('print("recovered", 6 * 7)\nprint("x" in globals())');
    await page.locator(VISIBLE + '.pylab-run').filter({ hasText: 'Run' }).click();
    await expect(page.locator(VISIBLE + '.pylab-out-body').first()).toContainText('recovered 42\nFalse', { timeout: 180_000 });

    // And the time limit stops a loop nobody stops by hand.
    await editor.fill('while True:\n    pass');
    await page.locator(VISIBLE + '.pylab-run').filter({ hasText: 'Run' }).click();
    await expect(page.locator(VISIBLE + '.pylab-out-err')).toContainText('Stopped after 30 s', { timeout: 60_000 });
  });

  test('@heavy a graded exercise reports per-check results with tolerance', async ({ page }) => {
    await page.goto('./#practice/code', { waitUntil: 'networkidle' });
    const ex = page.locator(VISIBLE + '.code-ex').filter({ hasText: 'Write a slope function' });
    const editor = ex.locator('textarea');
    // A wrong answer first: the checks say what failed.
    await editor.fill('def slope(p1, p2):\n    (x1, y1), (x2, y2) = p1, p2\n    return (y2 - y1) / (x1 - x2)\n');
    await ex.getByRole('button', { name: 'Check my code' }).click();
    await expect(ex.locator('.code-tests')).toContainText('slope((2, 7), (6, 15)) should be 2', { timeout: 180_000 });
    await expect(ex).toContainText('of 4 checks passed');
    // The right answer passes every check.
    await editor.fill('def slope(p1, p2):\n    (x1, y1), (x2, y2) = p1, p2\n    if x1 == x2:\n        raise ValueError("vertical")\n    return (y2 - y1) / (x2 - x1)\n');
    await ex.getByRole('button', { name: 'Check my code' }).click();
    await expect(ex).toContainText('All checks passed.', { timeout: 60_000 });
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fi_pyex_v1')));
    expect(saved.results['py.slope-fn'].passed).toBe(true);
  });

  test('@heavy importing a package outside the allowlist fails clearly, without a network fetch', async ({ page }) => {
    await page.goto('./#projects/lab', { waitUntil: 'networkidle' });
    await page.locator(VISIBLE + '.pylab-editor').fill('import requests');
    await page.locator(VISIBLE + '.pylab-run').filter({ hasText: 'Run' }).click();
    await expect(page.locator(VISIBLE + '.pylab-out-err')).toContainText('only the standard library and', { timeout: 180_000 });
  });
});
