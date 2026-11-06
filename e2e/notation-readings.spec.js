import { test, expect } from '@playwright/test';
import { VISIBLE, expectNoCrash } from './helpers.js';

// How to say each symbol (docs/learning-8020/NOTATION_READINGS.md): the
// lesson's notation list and its formula breakdown name every symbol, and the
// speaker button speaks the reading in the browser's own voice. The voice is
// replaced by a recorder here, so the test hears what would be said.

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__said = [];
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { cancel() {}, speak(u) { window.__said.push(u.text); } } });
  });
});

test('a lesson says how to read each symbol, in its notation list and its formula', async ({ page }) => {
  await page.goto('./#learn/lesson/a1-break-even', { waitUntil: 'networkidle' });
  const glossary = page.locator(`${VISIBLE}.lesson-glossary`);
  await expect(glossary.getByText('q star', { exact: true })).toBeVisible();

  const formula = page.locator(`${VISIBLE}.lesson-formula`).first();
  await expect(formula.getByText('q star equals F over p minus v')).toBeVisible();
  const rows = formula.locator('.formula-symbols tbody tr');
  await expect(rows).toHaveCount(4);
  await expect(rows.first()).toContainText('capital F');
  await expect(rows.first()).toContainText('fixed costs per period');

  await formula.getByRole('button', { name: 'Hear it: capital F' }).click();
  expect(await page.evaluate(() => window.__said)).toEqual(['capital F']);
  await expectNoCrash(page);
});

test('Greek letters are named on the page and respelled only for the voice', async ({ page }) => {
  await page.goto('./#learn/lesson/st-sampling-clt', { waitUntil: 'networkidle' });
  const button = page.locator(`${VISIBLE}.lesson-glossary`).getByRole('button', { name: 'Hear it: mu, sigma' });
  await expect(button).toBeVisible();
  await button.click();
  expect(await page.evaluate(() => window.__said)).toEqual(['mew, sigma']);
});
