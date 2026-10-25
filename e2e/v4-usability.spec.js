import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { hashFor } from '../src/app/pages.js';
import { VISIBLE } from './helpers.js';

// The five usability tasks of the V4 brief (§11), scripted. Each runs on a
// desktop and a phone viewport. These prove the paths exist and are short;
// they do NOT replace watching real learners use them (docs/v4/TEST_REPORT.md).

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'phone', width: 375, height: 760 },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
});

for (const vp of VIEWPORTS) {
  test.describe(`V4 usability (${vp.name})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
    });

    test('(a) a first-time learner is in a lesson within 2 clicks of Home', async ({ page }) => {
      await page.goto('./#home', { waitUntil: 'networkidle' });
      let clicks = 0;
      await page.getByRole('button', { name: /Start from Prealgebra/ }).click(); clicks += 1;
      await expect(page.locator('h1.page-title')).toHaveText('Prealgebra');
      await page.locator(VISIBLE + 'a', { hasText: 'Ratios, rates and unit rates' }).first().click(); clicks += 1;
      await expect(page.locator('h1.page-title')).toHaveText('Ratios, rates and unit rates');
      expect(clicks).toBeLessThan(3);
    });

    test('(b) a returning learner resumes the lesson in one action', async ({ page }) => {
      await page.goto(`./${hashFor('learn/lesson', { lessonId: 'c1-marginal-cost' })}`, { waitUntil: 'networkidle' });
      await expect(page.locator('h1.page-title')).toHaveText('Marginal cost: what does one more unit cost?');
      await page.goto('./#home', { waitUntil: 'networkidle' });
      await expect(page.locator('#home-continue')).toHaveText('Continue where you left off');
      await expect(page.locator(VISIBLE + '.studio-btn-primary')).toHaveCount(1); // one clear next action
      await page.getByRole('link', { name: 'Continue the lesson' }).click();
      await expect(page.locator('h1.page-title')).toHaveText('Marginal cost: what does one more unit cost?');
    });

    test('(c) completes a lesson and its transfer task by following the lesson itself', async ({ page }) => {
      await page.goto(`./${hashFor('learn/lesson', { lessonId: 'a1-break-even' })}`, { waitUntil: 'networkidle' });
      // The only navigation used: the lesson's own "Next:" step button.
      const next = page.locator(VISIBLE + '.lesson-progress button');
      for (const step of ['Understand', 'See it', 'Try it', 'Use it']) {
        await expect(next).toHaveText(`Next: ${step}`);
        await next.click();
        await expect(page.locator(VISIBLE + '.lesson-progress-text')).toContainText(step);
      }
      // The real-world transfer task, by keyboard.
      const use = page.locator(VISIBLE + '[data-section="use"]');
      await use.locator('.item-card').first().locator('input').focus();
      await page.keyboard.type('25');
      await page.keyboard.press('Enter');
      await expect(use.locator('.item-card').first()).toContainText('Correct');
      await expect(next).toHaveText('Next: Check understanding');
      await next.click();
      const check = page.locator(VISIBLE + '[data-section="check"]');
      const cards = check.locator('.item-card');
      await cards.nth(0).locator('input').fill('100');
      await cards.nth(0).locator('input').press('Enter');
      await cards.nth(1).locator('input').fill('21');
      await cards.nth(1).locator('input').press('Enter');
      await cards.nth(2).locator('input[type="radio"]').first().check();
      await cards.nth(2).getByRole('button', { name: 'Check' }).click();
      await expect(check.getByText('3 of 3 correct on the first try.')).toBeVisible();
      // The lesson says where to go next.
      await expect(check.getByRole('link', { name: /Slope as rate of change/ })).toBeVisible();
    });

    test('(d) finds a formula connection on demand', async ({ page }) => {
      await page.goto(`./${hashFor('learn/lesson', { lessonId: 'la-matrix-scores' })}`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'See connections' }).click();
      const panel = page.getByRole('region', { name: 'Connections' });
      await expect(panel).toContainText('The dot product');
      await panel.getByRole('link', { name: 'Open the full concept map here' }).click();
      await expect(page.locator('h1.page-title')).toHaveText('Concept map');
      await expect(page.locator(VISIBLE + '.cmap-detail h2')).toHaveText('Matrix–vector products as weighted scores');
    });

    test('(e) locates a backup from Home and restores it', async ({ page }) => {
      await page.goto('./#home', { waitUntil: 'networkidle' });
      await page.evaluate(() => localStorage.setItem('bluman_journal_v1', JSON.stringify([{ id: 1, text: 'keep me', date: '2026-10-24' }])));
      // Home → My Progress → Settings: two clicks on visible labels (the
      // phone bar says "Progress"; hidden navigation is not in the a11y tree).
      await page.getByRole('link', { name: vp.name === 'phone' ? 'Progress' : 'My Progress', exact: true }).click();
      await page.getByRole('navigation', { name: 'My Progress pages' }).getByRole('link', { name: 'Settings' }).click();
      await expect(page.getByRole('heading', { name: 'Privacy and your data' })).toBeVisible();
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: 'Download backup' }).click(),
      ]);
      const file = await download.path();
      expect(JSON.parse(readFileSync(file, 'utf8')).format).toBe('formula-intelligence-backup');
      await page.evaluate(() => localStorage.removeItem('bluman_journal_v1'));
      await page.locator(VISIBLE + '.backup-panel input[type="file"]').setInputFiles(file);
      await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Replace my progress' }).click()]);
      await page.waitForLoadState('networkidle');
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('bluman_journal_v1'))[0].text)).toBe('keep me');
    });
  });
}
