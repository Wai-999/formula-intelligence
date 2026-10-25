import { test, expect } from '@playwright/test';
import { expectNoCrash } from './helpers.js';

// Acceptance test 1 (docs/audits/TRACEABILITY_MATRIX.md). At baseline,
// #ml/bridge, #ml/doesnotexist and #stats/nope each rendered a blank page
// with no error (docs/audits/evidence/screenshots/legacy-ml-bridge-1280.png).
// Since the V3.1 information architecture every old #stats/x and #ml/x
// address also has to land on the page that now hosts it — and since V4,
// every V3.1 address too.
const CASES = [
  // [opened, expected final hash, expected notice substring or null]
  ['#ml/bridge', '#learn/ml', 'Stats ↔ ML comparison page was retired'],
  // The four domain labs, retired by Master Prompt V3.1 §4.
  ['#ml/gold', '#learn/ml', 'Gold forecasting lab was retired'],
  ['#ml/macro', '#learn/ml', 'Macro (GDP nowcasting) forecasting lab was retired'],
  ['#ml/micro', '#learn/ml', 'Micro (retail demand) forecasting lab was retired'],
  ['#ml/politics', '#learn/ml', 'Politics forecasting lab was retired'],
  ['#ml/doesnotexist', '#learn/ml', null],
  ['#stats/nope', '#learn/formulas', null],
  // Every surviving tab of the two-mode app, to its V4 home.
  ['#stats/map', '#learn/formulas', null],
  ['#stats/path', '#learn/paths', null],
  ['#stats/story', '#apply/cases', null],
  ['#stats/flashcards', '#practice/formulas/flashcards', null],
  ['#stats/quiz', '#practice/formulas/quiz', null],
  ['#stats/practice', '#practice/formulas/problems', null],
  ['#stats/dashboard', '#progress/overview', null],
  ['#stats/errors', '#progress/errors', null],
  ['#stats/journal', '#progress/notebook/journal', null],
  ['#ml/pipeline', '#learn/ml', null],
  ['#ml/modelmap', '#learn/models', null],
  ['#ml/python', '#apply/library', null],
  ['#ml/pylab', '#apply/lab', null],
  ['#ml/sources', '#sources', null],
  // V3.1 addresses (live 2026-10-24) → V4 (docs/v4/SIMPLIFICATION_PLAN.md).
  ['#maps/concepts/c.slope', '#learn/concepts/c.slope', null],
  ['#maps/formulas', '#learn/formulas', null],
  ['#maps/models', '#learn/models', null],
  ['#maps/knowledge', '#learn/careers', null],
  ['#learn/stories', '#apply/cases', null],
  ['#practice/mixed', '#practice/review', null],
  ['#practice/quiz', '#practice/formulas/quiz', null],
  ['#practice/problems', '#practice/formulas/problems', null],
  ['#practice/code', '#apply/exercises', null],
  ['#practice/python', '#apply/library', null],
  ['#projects/list', '#apply/projects', null],
  ['#projects/lab', '#apply/lab', null],
  ['#progress/diagnostic', '#learn/placement', null],
  ['#notebook/notes', '#progress/notebook/notes', null],
  ['#notebook/journal', '#progress/notebook/journal', null],
  ['#settings', '#progress/settings', null],
  // The new format's own fallbacks.
  ['#no-such-page', '#home', null],
  ['#maps', '#learn/maps', null],
  ['#projects', '#apply/projects', null],
  ['#apply', '#apply/projects', null],
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
  await page.goto('./#learn/formulas', { waitUntil: 'networkidle' });
  await page.evaluate(() => { location.hash = '#stats/definitely-not-a-tab'; });
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#learn/formulas');
  await expect(page.locator('.app-tab-keepalive:visible')).toHaveCount(1);
});

test('Back returns to the previous page instead of looping on a corrected address', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
  await page.goto('./#practice/formulas/quiz', { waitUntil: 'networkidle' });
  await page.evaluate(() => { location.hash = '#ml/gold'; });
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#learn/ml');
  await page.goBack();
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#practice/formulas/quiz');
  await expect(page.locator('h1.page-title')).toHaveText('Formula drills');
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
