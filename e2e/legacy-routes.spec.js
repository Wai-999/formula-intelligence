import { test, expect } from '@playwright/test';
import { expectNoCrash } from './helpers.js';

// Acceptance test 1 (docs/audits/TRACEABILITY_MATRIX.md). At baseline,
// #ml/bridge, #ml/doesnotexist and #stats/nope each rendered a blank page
// with no error (docs/audits/evidence/screenshots/legacy-ml-bridge-1280.png).
// Since the V3.1 information architecture every old #stats/x and #ml/x
// address also has to land on the page that now hosts it.
const CASES = [
  // [opened, expected final hash, expected notice substring or null]
  ['#ml/bridge', '#learn/ml', 'Stats ↔ ML comparison page was retired'],
  // The four domain labs, retired by Master Prompt V3.1 §4.
  ['#ml/gold', '#learn/ml', 'Gold forecasting lab was retired'],
  ['#ml/macro', '#learn/ml', 'Macro (GDP nowcasting) forecasting lab was retired'],
  ['#ml/micro', '#learn/ml', 'Micro (retail demand) forecasting lab was retired'],
  ['#ml/politics', '#learn/ml', 'Politics forecasting lab was retired'],
  ['#ml/doesnotexist', '#learn/ml', null],
  ['#stats/nope', '#maps/formulas', null],
  // Every surviving tab of the two-mode app, to its new home.
  ['#stats/map', '#maps/formulas', null],
  ['#stats/path', '#learn/paths', null],
  ['#stats/story', '#learn/stories', null],
  ['#stats/flashcards', '#practice/review', null],
  ['#stats/quiz', '#practice/quiz', null],
  ['#stats/practice', '#practice/problems', null],
  ['#stats/dashboard', '#progress/overview', null],
  ['#stats/errors', '#progress/errors', null],
  ['#stats/journal', '#notebook/journal', null],
  ['#ml/pipeline', '#learn/ml', null],
  ['#ml/modelmap', '#maps/models', null],
  ['#ml/python', '#practice/python', null],
  ['#ml/pylab', '#projects/lab', null],
  ['#ml/sources', '#sources', null],
  // The new format's own fallbacks.
  ['#no-such-page', '#home', null],
  ['#maps', '#maps/concepts', null],
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
  await page.goto('./#maps/formulas', { waitUntil: 'networkidle' });
  await page.evaluate(() => { location.hash = '#stats/definitely-not-a-tab'; });
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#maps/formulas');
  await expect(page.locator('.app-tab-keepalive:visible')).toHaveCount(1);
});

test('Back returns to the previous page instead of looping on a corrected address', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
  await page.goto('./#practice/quiz', { waitUntil: 'networkidle' });
  await page.evaluate(() => { location.hash = '#ml/gold'; });
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#learn/ml');
  await page.goBack();
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#practice/quiz');
  await expect(page.locator('h1.page-title')).toHaveText('Quiz');
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
    await expect.poll(() => page.evaluate(() => location.hash)).toBe('#learn/ml');
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
