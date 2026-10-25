import { test, expect } from '@playwright/test';
import { hashFor } from '../src/app/pages.js';
import { VISIBLE, openPage, expectNoCrash } from './helpers.js';

// The V5.1 acceptance journeys (§13.8) that can be automated. Like the V4
// usability tasks, these prove the paths work by mouse and keyboard on a
// desktop and a phone; they are not a study with real learners.

const DISCLAIMER = 'Formula Intelligence is a self-study tool. It does not award college credit, determine college placement, waive prerequisites, or guarantee transfer admission.';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
});

async function goToStep(page, name) {
  for (let i = 0; i < 6; i += 1) {
    if (await page.getByText(new RegExp(`Step \\d of 6 · ${name}`)).first().isVisible()) return;
    await page.getByRole('button', { name: /^Next:/ }).first().click();
    await page.waitForTimeout(150);
  }
}

test.describe('V5 journeys', () => {
  test('a student comparing transfer routes sees verified, earlier-year and unverified facts, dated and sourced', async ({ page }) => {
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await openPage(page, 'learn/courses');
    await page.locator(VISIBLE + 'a', { hasText: 'Ohlone Data Science prep' }).click();
    await expect(page.locator('h1.page-title')).toHaveText('Ohlone Data Science prep');
    const prep = page.locator(VISIBLE);
    await expect(prep.getByText(DISCLAIMER)).toBeVisible();
    // SJSU (default): CS-116 is the course SJSU's CS 46A accepts.
    await prep.locator('.prep-course summary', { hasText: 'CS-116' }).click();
    await expect(prep.locator('.prep-course[open]')).toContainText('CS 46A Introduction to Programming ← Ohlone CS-116');
    await expect(prep.locator('.prep-course[open]')).toContainText('checked 2026-10-24');
    // CSU East Bay: most of its core has no Ohlone match, and the page says so.
    await prep.getByRole('radio', { name: 'CSU East Bay' }).check();
    await prep.getByText(/Course-by-course ASSIST agreement/).click();
    const agreement = prep.locator('details[open]', { hasText: 'Course-by-course ASSIST agreement' });
    await expect(agreement.getByText('No Ohlone course articulated').first()).toBeVisible();
    await expect(agreement.getByText('Verified · current year').first()).toBeVisible();
    // UC: an older agreement is labelled as such; an undated page is not verified.
    await prep.getByRole('radio', { name: 'UC options' }).check();
    await expect(prep.getByText('Not yet verified').first()).toBeVisible();
    await expect(prep.getByText('Verified · earlier year').first()).toBeAttached();
    // The choice is a saved preference.
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator(VISIBLE).getByRole('radio', { name: 'UC options' })).toBeChecked();
    await expectNoCrash(page);
  });

  test('the prep page fits a phone without sideways scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 760 });
    await page.goto(`./${hashFor('learn/prep')}`, { waitUntil: 'networkidle' });
    await page.locator(VISIBLE + '.prep-course summary').first().click();
    const overflow = await page.evaluate(() => {
      const el = document.querySelector('.app-tab-keepalive:not([hidden]) .studio-scroll') ?? document.scrollingElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('a learner moving from algebra to calculus is sent back to the right prerequisite', async ({ page }) => {
    await page.goto(`./${hashFor('learn/lesson', { lessonId: 'c1-chain-rule' })}`, { waitUntil: 'networkidle' });
    await expect(page.locator('h1.page-title')).toHaveText('The chain rule: rates that multiply');
    // The prior-knowledge check sits behind "Ready? Two quick checks…".
    await page.locator(VISIBLE).getByText(/^Ready\? Two quick checks/).click();
    const card = page.locator(VISIBLE + '.item-card').first();
    await card.locator('input').first().fill('21');
    await card.getByRole('button', { name: 'Check' }).click();
    const refresher = card.getByRole('link', { name: 'Composite and inverse functions' });
    await expect(refresher).toBeVisible();
    await refresher.click();
    await expect(page.locator('h1.page-title')).toHaveText('Composite and inverse functions');
    await expectNoCrash(page);
  });

  test('a C++ beginner traces a loop by keyboard and downloads the program', async ({ page }) => {
    await page.goto(`./${hashFor('learn/lesson', { lessonId: 'cpp-loops-trace' })}`, { waitUntil: 'networkidle' });
    await expect(page.locator('h1.page-title')).toHaveText('Loops you can trace');
    await goToStep(page, 'See it');
    const lab = page.locator(VISIBLE + '.lab', { hasText: 'Trace it' });
    await expect(lab).toBeVisible();
    await lab.getByRole('button', { name: 'Step', exact: true }).focus();
    for (let i = 0; i < 4; i += 1) await page.keyboard.press('Enter');
    await expect(lab.locator('.lab-readout')).toContainText('Step 4 of 10');
    await expect(lab.locator('.lab-readout')).toContainText('total changes from 0 to 14');
    await lab.getByRole('button', { name: 'Run to the end' }).click();
    await expect(lab.locator('.trace-console')).toContainText('44');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator(VISIBLE).getByRole('button', { name: 'Download bakery_hours.cpp' }).click(),
    ]);
    expect(download.suggestedFilename()).toBe('bakery_hours.cpp');
    await expectNoCrash(page);
  });

  test('a working student picks a session length and gets a short plan that is remembered', async ({ page }) => {
    await page.goto(`./${hashFor('learn/lesson', { lessonId: 'a2-composition' })}`, { waitUntil: 'networkidle' });
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await page.getByRole('radio', { name: '15 minutes' }).check();
    await expect(page.locator('.home-timebox-steps li')).toHaveCount(1);
    await page.getByRole('radio', { name: '60–90 minutes' }).check();
    await expect(page.locator('.home-timebox-steps')).toContainText('real-world project');
    await expect(page.getByText(/No streaks and no daily quota/)).toBeVisible();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('radio', { name: '60–90 minutes' })).toBeChecked();
    // Still one primary action on Home.
    await expect(page.locator(VISIBLE + '.studio-btn-primary')).toHaveCount(1);
  });

  test('the placement check says when it has too little evidence, and offers more questions', async ({ page }) => {
    await page.goto('./#learn/placement', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Start the placement check' }).click();
    await page.getByRole('button', { name: 'Stop and see results' }).click();
    await expect(page.getByText('Not enough evidence yet — a default, not a finding')).toBeVisible();
    await expect(page.getByText(/No mathematics questions were answered/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Answer more questions' })).toBeVisible();
  });
});
