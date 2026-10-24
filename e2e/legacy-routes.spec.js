import { test, expect } from '@playwright/test';
import { expectNoCrash } from './helpers.js';

// Acceptance test 1 (docs/audits/TRACEABILITY_MATRIX.md). At baseline,
// #ml/bridge, #ml/doesnotexist and #stats/nope each rendered a blank page
// with no error (docs/audits/evidence/screenshots/legacy-ml-bridge-1280.png).
const CASES = [
  // [opened, expected final hash, expected notice substring or null]
  ['#ml/bridge', '#ml/pipeline', 'Stats ↔ ML comparison page was retired'],
  // The four domain labs, retired by Master Prompt V3.1 §4.
  ['#ml/gold', '#ml/pipeline', 'Gold forecasting lab was retired'],
  ['#ml/macro', '#ml/pipeline', 'Macro (GDP nowcasting) forecasting lab was retired'],
  ['#ml/micro', '#ml/pipeline', 'Micro (retail demand) forecasting lab was retired'],
  ['#ml/politics', '#ml/pipeline', 'Politics forecasting lab was retired'],
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

// Playground and Evaluation were rehomed, not retired: their old links must
// land on the lesson itself, open, with its real content rendered — the
// spec's deletion test requires removing the tabs WITHOUT removing the
// evaluation teaching.
const REHOMED = [
  ['#ml/playground', 'Bias–variance and model complexity', '.pg-model-toggle'],
  ['#ml/evaluation', 'Evaluating a model', '.mp-grid'],
];
for (const [opened, title, contentSelector] of REHOMED) {
  test(`${opened} opens the "${title}" lesson on Pipeline`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
    await page.goto(`./${opened}`, { waitUntil: 'networkidle' });
    await expect.poll(() => page.evaluate(() => location.hash)).toBe('#ml/pipeline');
    const toggle = page.locator('.app-tab-keepalive:visible .ml-lesson-toggle', { hasText: title });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(`.app-tab-keepalive:visible .ml-lesson-body ${contentSelector}`).first()).toBeVisible();
    await expect(page.getByText(`became the lesson "${title}"`)).toBeVisible();
    await expectNoCrash(page);
  });
}

test('lessons start collapsed and toggle from the keyboard', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
  await page.goto('./#ml/pipeline', { waitUntil: 'networkidle' });
  const toggle = page.locator('.app-tab-keepalive:visible .ml-lesson-toggle').first();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
