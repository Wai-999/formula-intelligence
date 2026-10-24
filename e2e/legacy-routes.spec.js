import { test, expect } from '@playwright/test';
import { expectNoCrash } from './helpers.js';

// Acceptance test 1 (docs/audits/TRACEABILITY_MATRIX.md). At baseline,
// #ml/bridge, #ml/doesnotexist and #stats/nope each rendered a blank page
// with no error (docs/audits/evidence/screenshots/legacy-ml-bridge-1280.png).
const CASES = [
  // [opened, expected final hash, expected notice substring or null]
  ['#ml/bridge', '#ml/pipeline', 'Stats ↔ ML comparison page was retired'],
  ['#ml/doesnotexist', '#ml/pipeline', null],
  ['#stats/nope', '#stats/map', null],
  ['#ml/pipeline', '#ml/pipeline', null],
  ['#stats/journal', '#stats/journal', null],
];

for (const [opened, expected, notice] of CASES) {
  test(`${opened} resolves to ${expected}`, async ({ page }) => {
    // A cold load of the bookmark, as a learner would open it. (Loading and
    // then reloading would reload the already-corrected URL.)
    await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
    await page.goto(`./${opened}`, { waitUntil: 'networkidle' });
    await expect.poll(() => page.evaluate(() => location.hash)).toBe(expected);
    await expectNoCrash(page);
    const pane = page.locator('.app-tab-keepalive:visible');
    await expect(pane).toHaveCount(1);
    expect((await pane.innerText()).trim().length).toBeGreaterThan(100);
    if (notice) await expect(page.getByText(notice)).toBeVisible();
  });
}

test('a hash change to an unknown tab while the app is open also resolves', async ({ page }) => {
  await page.goto('./#stats/map', { waitUntil: 'networkidle' });
  await page.evaluate(() => { location.hash = '#stats/definitely-not-a-tab'; });
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#stats/map');
  await expect(page.locator('.app-tab-keepalive:visible')).toHaveCount(1);
});
