import { test, expect } from '@playwright/test';
import { VISIBLE, expectNoCrash } from './helpers.js';

// The study habit (docs/learning-8020/STUDY_HABITS.md) in a real browser:
// a welcome back after time away, with no guilt, and the pace of a course
// at the learner's own plan. The making of a plan is in v5-journeys.spec.js.

const DAY = 24 * 60 * 60 * 1000;

function seed(page, { daysAgo, habit }) {
  return page.addInitScript(({ daysAgo: ago, habit: h, DAY: day }) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    const t = Date.now() - ago * day;
    localStorage.setItem('fi_lessons_v1', JSON.stringify({ schemaVersion: 1, last: 'pa-ratios-rates', lessons: { 'pa-ratios-rates': { opened: t, visited: t, sections: ['matters'] } } }));
    localStorage.setItem('fi_learning_v1', JSON.stringify({ schemaVersion: 1, evidence: [{ c: 'arith.ratios', item: 'pa-rr.p1', ok: true, d: 1, l: 'pa-ratios-rates', s: 'practice', at: t }], cards: {} }));
    localStorage.setItem('fi_study_v1', JSON.stringify({ timebox: '15', target: 'sjsu', habit: h }));
  }, { daysAgo, habit, DAY });
}

test('after ten days away, Home welcomes the learner back without guilt and offers a small start', async ({ page }) => {
  await seed(page, { daysAgo: 10, habit: { days: [1, 3, 5], cue: 'After dinner', time: '' } });
  await page.goto('./#home', { waitUntil: 'networkidle' });
  const plan = page.locator(VISIBLE + 'section.habit');
  await expect(plan.getByText(/Welcome back\. It has been 10 days — that is fine, and nothing was lost\./)).toBeVisible();
  await expect(plan.locator('.home-timebox-steps')).toContainText('Start small');
  // The welcome and the week's message never scold (the footnote saying
  // “a missed day costs nothing” is the one place those words appear).
  await expect(plan.locator('.habit-welcome')).not.toContainText(/streak|missed|failed/i);
  await expect(plan.locator('.habit-message')).not.toContainText(/streak|missed|failed/i);
  await expectNoCrash(page);
});

test('a course page says how long the rest takes at the learner’s plan', async ({ page }) => {
  await seed(page, { daysAgo: 1, habit: { days: [1, 3, 5], cue: '', time: '' } });
  await page.goto('./#learn/course/prealgebra', { waitUntil: 'networkidle' });
  await expect(page.locator(VISIBLE + '.course-signals')).toContainText(/At your study plan\s*About \d+ weeks? for the 3 written lessons left \(Mon, Wed and Fri — 15 minutes\)/);
});

test('without a plan, the course page offers to make one', async ({ page }) => {
  await seed(page, { daysAgo: 1, habit: null });
  await page.goto('./#learn/course/prealgebra', { waitUntil: 'networkidle' });
  await expect(page.locator(VISIBLE + '.course-signals')).toContainText('Make a study plan');
});
