import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { hashFor } from '../src/app/pages.js';
import { VISIBLE, lessonSettled } from './helpers.js';

// Save my place, automatic checkpoints and Resume (docs/study-continuity/):
// the journeys A–F of the study-continuity brief, in a real browser against
// the production build. The core promise first: open a lesson → study to
// Step 4 → save → leave → come back → resume at Step 4.

const lesson = (id) => `./${hashFor('learn/lesson', { lessonId: id })}`;
const progressText = (page) => page.locator(VISIBLE + '.lesson-progress-text');
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('fi_resume_v1') || 'null'));

async function goToStep(page, title) {
  await lessonSettled(page);
  await page.locator(VISIBLE + '.lesson-steps-toggle').click();
  await page.locator(VISIBLE + '.lesson-trail button', { hasText: new RegExp(`^\\d\\. ${title}`) }).click();
  await expect(progressText(page)).toContainText(title);
  await lessonSettled(page);
}

/** Wait for the automatic checkpoint (it waits for the step to stay put). */
async function autoSaved(page, lessonId, sectionId) {
  await expect.poll(async () => {
    const r = await stored(page);
    return r?.current ? `${r.current.lessonId}/${r.current.sectionId}` : null;
  }, { timeout: 8000 }).toBe(`${lessonId}/${sectionId}`);
}

async function openLesson(page, id, title) {
  await page.goto(lesson(id), { waitUntil: 'networkidle' });
  if (title) await expect(page.locator('h1.page-title')).toHaveText(title);
  await expect(page.locator(VISIBLE + '[data-section="matters"]')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
});

test.describe('A: exact resume across visits', () => {
  test('save at Step 4, leave, reload, reopen the browser — Resume lands on Step 4 each time', async ({ page, context, browser }) => {
    test.setTimeout(90_000);
    await openLesson(page, 'a1-slope', 'Slope as rate of change');
    await goToStep(page, 'Try it');
    await autoSaved(page, 'a1-slope', 'try'); // saved without pressing anything
    await page.locator(VISIBLE + 'button.lesson-save').click();
    await expect(page.locator(VISIBLE + '.lesson-save-note[role="status"]')).toContainText('Saved on this device: Step 4 of 6 — Try it');
    expect((await stored(page)).pinned).toMatchObject({ lessonId: 'a1-slope', courseId: 'algebra-1', sectionId: 'try', source: 'manual' });

    const resumeFromHome = async (p) => {
      await p.goto('./#home', { waitUntil: 'networkidle' });
      await expect(p.locator('#home-continue')).toHaveText('Continue learning');
      await expect(p.locator('.home-hero')).toContainText('Step 4 of 6 — Try it');
      await expect(p.locator('.home-hero .studio-btn-primary')).toHaveCount(1);
      await p.getByRole('button', { name: 'Resume where I stopped' }).click();
      await expect(p).toHaveURL(/#learn\/lesson\/a1-slope$/);
      await expect(p.locator(VISIBLE + '.lesson-progress-text')).toContainText('Try it');
      await expect(p.locator(VISIBLE + '[data-section="try"] h2')).toBeFocused();
      const box = await p.locator(VISIBLE + '[data-section="try"] h2').boundingBox();
      expect(box.y).toBeGreaterThan(0);
      expect(box.y).toBeLessThan(400); // on screen, just under the sticky bar
    };

    await resumeFromHome(page);
    // A plain reload of the lesson starts at the top and offers the saved place.
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator(VISIBLE + '.lesson-resume-offer')).toContainText('Your saved place here: Step 4 of 6 — Try it');
    await resumeFromHome(page);

    // A new browser session: only what reached storage survives.
    const fresh = await browser.newContext({ storageState: await context.storageState(), baseURL: test.info().project.use.baseURL });
    const again = await fresh.newPage();
    await resumeFromHome(again);
    await fresh.close();
  });

  test('without pressing Save, the automatic checkpoint survives a reload', async ({ page }) => {
    await openLesson(page, 'c1-derivative', 'The derivative from first principles');
    await goToStep(page, 'Use it');
    await autoSaved(page, 'c1-derivative', 'use');
    await page.reload({ waitUntil: 'networkidle' });
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await expect(page.locator('#home-continue')).toHaveText('Continue recent lesson');
    await page.getByRole('button', { name: 'Continue recent lesson' }).click();
    await expect(progressText(page)).toContainText('Use it');
  });
});

test('B: a saved place is not overwritten by browsing; saving elsewhere replaces it explicitly', async ({ page }) => {
  test.setTimeout(60_000);
  await openLesson(page, 'a1-slope');
  await goToStep(page, 'Use it');
  await page.locator(VISIBLE + 'button.lesson-save').click();

  await openLesson(page, 'la-dot-product', 'Vectors and the dot product');
  await goToStep(page, 'Understand');
  await autoSaved(page, 'la-dot-product', 'understand');

  await page.goto('./#home', { waitUntil: 'networkidle' });
  await expect(page.locator('.home-hero-title')).toHaveText('Slope as rate of change');
  await expect(page.locator('.home-hero')).toContainText('Step 5 of 6 — Use it');

  await openLesson(page, 'la-dot-product');
  await goToStep(page, 'Understand');
  await page.locator(VISIBLE + '.lesson-steps-toggle').click();
  await expect(page.locator(VISIBLE + '.lesson-steps-panel')).toContainText('Saving here replaces your saved place in “Slope as rate of change”.');
  await page.locator(VISIBLE + '.lesson-steps-panel').getByRole('button', { name: 'Save my place' }).click();
  await page.goto('./#home', { waitUntil: 'networkidle' });
  await expect(page.locator('.home-hero-title')).toHaveText('Vectors and the dot product');
  await expect(page.locator('.home-hero')).toContainText('Step 2 of 6 — Understand');
});

test('C: each course page resumes into its own course', async ({ page }) => {
  test.setTimeout(60_000);
  await openLesson(page, 'c1-derivative');
  await goToStep(page, 'See it');
  await autoSaved(page, 'c1-derivative', 'see');
  await openLesson(page, 'la-dot-product');
  await goToStep(page, 'Try it');
  await autoSaved(page, 'la-dot-product', 'try');

  await page.goto(`./${hashFor('learn/course', { courseId: 'calculus-1' })}`, { waitUntil: 'networkidle' });
  await page.locator(VISIBLE).getByRole('button', { name: 'Continue where you were: Step 3' }).click();
  await expect(page).toHaveURL(/#learn\/lesson\/c1-derivative$/);
  await expect(progressText(page)).toContainText('See it');

  await page.goto(`./${hashFor('learn/course', { courseId: 'linear-algebra' })}`, { waitUntil: 'networkidle' });
  await page.locator(VISIBLE).getByRole('button', { name: 'Continue where you were: Step 4' }).click();
  await expect(page).toHaveURL(/#learn\/lesson\/la-dot-product$/);
  await expect(progressText(page)).toContainText('Try it');
});

test('D: finishing a session completes nothing; the course end is stated honestly', async ({ page }) => {
  test.setTimeout(90_000);
  // The other three Algebra I lessons are already done; break-even is not.
  await page.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    const done = { opened: 1793000000000, completed: 1793000000000, checkpoint: { correct: 3, total: 3, at: 1793000000000 }, sections: [] };
    localStorage.setItem('fi_lessons_v1', JSON.stringify({ schemaVersion: 1, last: null, lessons: { 'a1-slope': done, 'a1-slope-intercept': done, 'a1-line-fit': done } }));
  });
  await openLesson(page, 'a1-break-even');
  await goToStep(page, 'Use it');
  await page.locator(VISIBLE + 'button.lesson-finish').click();
  await expect(page).toHaveURL(/#learn\/session$/);
  await expect(page.locator('h1.page-title')).toHaveText('Study session');
  await expect(page.getByRole('status').filter({ hasText: 'Your place is saved on this device.' })).toBeVisible();
  await expect(page.locator(VISIBLE + '.session-facts')).toContainText('Not answered yet — finishing a session does not complete a lesson');

  await page.goto(`./${hashFor('learn/course', { courseId: 'algebra-1' })}`, { waitUntil: 'networkidle' });
  await expect(page.locator(VISIBLE + '.course-signals')).toContainText('3 of 4 checked');
  await expect(page.locator(VISIBLE + '#course-finish-h')).toHaveCount(0);

  // Now the checkpoint, answered for real.
  await page.locator(VISIBLE).getByRole('button', { name: 'Resume saved place: Step 5' }).click();
  await goToStep(page, 'Check understanding');
  const cards = page.locator(VISIBLE + '[data-section="check"] .item-card');
  await cards.nth(0).locator('input').fill('100');
  await cards.nth(0).locator('input').press('Enter');
  await cards.nth(1).locator('input').fill('21');
  await cards.nth(1).locator('input').press('Enter');
  await cards.nth(2).locator('input[type="radio"]').first().check();
  await cards.nth(2).getByRole('button', { name: 'Check' }).click();
  await expect(page.locator(VISIBLE + '[data-section="check"]').getByText('3 of 3 correct on the first try.')).toBeVisible();

  await page.goto(`./${hashFor('learn/course', { courseId: 'algebra-1' })}`, { waitUntil: 'networkidle' });
  await expect(page.locator(VISIBLE + '.course-signals')).toContainText('4 of 4 checked');
  await expect(page.locator(VISIBLE + '#course-finish-h')).toHaveText('You finished the available lessons in this course');
  await expect(page.locator(VISIBLE + '.course-finish')).toContainText('the full course is not yet complete');
  await expect(page.locator(VISIBLE + '.course-finish')).toContainText('not a grade, transcript or credential');
  // Planned titles stay titles: never links, never "complete".
  const planned = page.locator(VISIBLE + '.course-lesson.planned');
  expect(await planned.count()).toBeGreaterThan(0);
  await expect(planned.locator('a')).toHaveCount(0);
  await expect(planned.first()).toContainText('Not written yet');
  const next = page.locator(VISIBLE + '.course-finish').getByRole('link', { name: /^Continue to / });
  await expect(next).toHaveAttribute('href', /^#learn\/lesson\//);
});

test.describe('E: data protection', () => {
  test('a backup carries saved places; reset removes them; restore brings them and everything else back', async ({ page }) => {
    test.setTimeout(90_000);
    await page.addInitScript(() => localStorage.setItem('fi_theme_v1', JSON.stringify('light')));
    await openLesson(page, 'a1-slope');
    await goToStep(page, 'Try it');
    const item = page.locator(VISIBLE + '[data-section="try"] .item-card').first();
    await item.locator('input').fill('3');
    await item.locator('input').press('Enter');
    await expect(item).toContainText('Correct');
    await page.locator(VISIBLE + '.lesson-notes textarea').fill('rise over run');
    await expect(page.locator(VISIBLE + '.lesson-notes [role="status"]')).toHaveText('Saved.');
    await page.locator(VISIBLE + 'button.lesson-save').click();

    await page.goto('./#progress/settings', { waitUntil: 'networkidle' });
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator(VISIBLE + '.backup-panel').getByRole('button', { name: 'Download backup' }).click(),
    ]);
    const file = await download.path();
    expect(Object.keys(JSON.parse(readFileSync(file, 'utf8')).data)).toEqual(expect.arrayContaining(['fi_resume_v1', 'fi_learning_v1', 'fi_notes_v1']));

    await page.locator(VISIBLE + '.backup-panel').getByRole('button', { name: 'Reset progress…' }).click();
    await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Delete my progress' }).click()]);
    await page.waitForLoadState('networkidle');
    expect(await page.evaluate(() => localStorage.getItem('fi_resume_v1'))).toBeNull();
    expect(await page.evaluate(() => localStorage.getItem('fi_theme_v1'))).toBe(JSON.stringify('light'));

    await page.locator(VISIBLE + '.backup-panel input[type="file"]').setInputFiles(file);
    await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Replace my progress' }).click()]);
    await page.waitForLoadState('networkidle');
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await expect(page.locator('.home-hero')).toContainText('Step 4 of 6 — Try it');
    const restored = await page.evaluate(() => ({
      notes: JSON.parse(localStorage.getItem('fi_notes_v1')).notes['a1-slope'].text,
      evidence: JSON.parse(localStorage.getItem('fi_learning_v1')).evidence.length,
    }));
    expect(restored).toEqual({ notes: 'rise over run', evidence: 1 });
  });

  test('an older backup without saved places restores, and the app carries on without inventing one', async ({ page }) => {
    await page.goto('./#progress/settings', { waitUntil: 'networkidle' });
    const legacy = { format: 'formula-intelligence-backup', version: 1, exportedAt: '2026-10-20T10:00:00.000Z', data: {
      fi_lessons_v1: JSON.stringify({ schemaVersion: 1, last: 'c1-derivative', lessons: { 'c1-derivative': { opened: 1792900000000, sections: [] } } }),
    } };
    await page.locator(VISIBLE + '.backup-panel input[type="file"]').setInputFiles({ name: 'old.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(legacy)) });
    await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Replace my progress' }).click()]);
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await expect(page.locator('#home-continue')).toHaveText('Continue recent lesson');
    await expect(page.locator('.home-hero')).toContainText('no step has been saved yet');
  });

  for (const [what, raw] of [['damaged', '{"schemaVersion":1,"pinned":'], ['from a newer app', '{"schemaVersion":9,"pinned":{"x":1}}']]) {
    test(`a ${what} saved-places record is set aside; the app keeps working`, async ({ page }) => {
      await page.addInitScript((r) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('fi_resume_v1', r); } }, raw);
      await page.goto('./#home', { waitUntil: 'networkidle' });
      await expect(page.locator('h1.page-title')).toHaveText('Home');
      await openLesson(page, 'a1-slope', 'Slope as rate of change');
      await page.locator(VISIBLE + 'button.lesson-save').click();
      await expect(page.locator(VISIBLE + '.lesson-save-note[role="status"]')).toContainText('Saved on this device');
      const q = await page.evaluate(() => JSON.parse(localStorage.getItem('fi_quarantine_v1') || '{}'));
      expect(q.fi_resume_v1?.raw).toBe(raw);
    });
  }

  test('when the browser refuses storage, Save says so and never claims success', async ({ page }) => {
    await page.addInitScript(() => {
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function setItem(k, v) {
        if (k === 'fi_resume_v1') throw new DOMException('full', 'QuotaExceededError');
        return set.call(this, k, v);
      };
    });
    await openLesson(page, 'a1-slope');
    await page.locator(VISIBLE + 'button.lesson-save').click();
    await expect(page.locator(VISIBLE + '[role="alert"]')).toContainText('Couldn’t save to this browser');
    await expect(page.locator(VISIBLE + '.lesson-save-note[role="status"]')).toHaveText('');
    await page.locator(VISIBLE + 'button.lesson-finish').click();
    await expect(page.getByRole('alert').filter({ hasText: 'Your place could not be saved in this browser.' })).toBeVisible();
  });
});

test.describe('F: devices, keyboard, accessibility, offline, two tabs', () => {
  for (const width of [320, 375, 768, 1280]) {
    for (const theme of ['light', 'dark']) {
      test(`${width}px ${theme}: the save controls fit, and pass axe with the steps panel open`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.emulateMedia({ colorScheme: theme });
        await openLesson(page, 'a1-slope');
        await expect(page.locator(VISIBLE + 'button.lesson-save')).toBeVisible();
        await expect(page.locator(VISIBLE + '.lesson-next-step')).toBeVisible();
        await page.locator(VISIBLE + '.lesson-steps-toggle').click();
        await expect(page.locator(VISIBLE + '.lesson-steps-panel').getByRole('button', { name: 'Finish study session' })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).include('.app-tab-keepalive:not([hidden]) .lesson-progress').analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`)).toEqual([]);
      });
    }
  }

  test('the new pages pass axe: Home with a saved place, course, My Progress, session summary', async ({ page }) => {
    test.setTimeout(90_000);
    await openLesson(page, 'a1-slope');
    await goToStep(page, 'See it');
    await page.locator(VISIBLE + 'button.lesson-finish').click();
    const check = async () => {
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).include('.app-tab-keepalive:not([hidden])').analyze();
      expect(r.violations.map((v) => v.id), page.url()).toEqual([]);
    };
    await expect(page.locator('h1.page-title')).toHaveText('Study session');
    await check();
    for (const hash of ['#home', hashFor('learn/course', { courseId: 'algebra-1' }), '#progress/overview']) {
      await page.goto(`./${hash}`, { waitUntil: 'networkidle' });
      await check();
    }
  });

  test('keyboard only: open the steps, jump, save; Back after Resume returns Home', async ({ page }) => {
    await openLesson(page, 'a1-slope');
    await page.locator(VISIBLE + '.lesson-steps-toggle').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(VISIBLE + '.lesson-steps-toggle')).toHaveAttribute('aria-expanded', 'true');
    await page.locator(VISIBLE + '.lesson-trail button', { hasText: /^3\. See it/ }).focus();
    await page.keyboard.press('Enter');
    await expect(progressText(page)).toContainText('See it');
    await page.locator(VISIBLE + 'button.lesson-save').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(VISIBLE + '.lesson-save-note[role="status"]')).toContainText('Step 3 of 6 — See it');
    await page.locator(VISIBLE + '.lesson-steps-toggle').focus();
    await page.keyboard.press('Enter');
    await page.locator(VISIBLE + '.lesson-trail button').first().focus();
    await page.keyboard.press('Escape');
    await expect(page.locator(VISIBLE + '.lesson-steps-panel')).toHaveCount(0);
    await expect(page.locator(VISIBLE + '.lesson-steps-toggle')).toBeFocused();

    await page.goto('./#home', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Resume where I stopped' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(VISIBLE + '[data-section="see"] h2')).toBeFocused();
    await page.goBack();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('h1.page-title')).toHaveText('Home');
  });

  test('offline after one visit: Resume still opens the saved step', async ({ page, context }) => {
    test.setTimeout(90_000);
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload({ waitUntil: 'networkidle' });
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 30_000 }).toBe(true);
    await openLesson(page, 'la-projection');
    await goToStep(page, 'Use it');
    await page.locator(VISIBLE + 'button.lesson-save').click();
    await context.setOffline(true);
    await page.goto('./#home', { waitUntil: 'domcontentloaded' });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Resume where I stopped' }).click();
    await expect(progressText(page)).toContainText('Use it');
    await context.setOffline(false);
  });

  test('two tabs: a save in one shows in the other, and the other tab’s automatic saves never undo it', async ({ context }) => {
    test.setTimeout(60_000);
    const a = await context.newPage();
    const b = await context.newPage();
    await b.goto('./#home', { waitUntil: 'networkidle' });
    await openLesson(a, 'a1-slope');
    await goToStep(a, 'Use it');
    await a.locator(VISIBLE + 'button.lesson-save').click();
    // Tab B was already open on Home: it updates without a reload.
    await expect(b.locator('.home-hero')).toContainText('Step 5 of 6 — Use it');
    await openLesson(b, 'la-dot-product');
    await goToStep(b, 'Understand');
    await autoSaved(b, 'la-dot-product', 'understand');
    const r = await stored(a);
    expect(r.pinned).toMatchObject({ lessonId: 'a1-slope', sectionId: 'use' });
  });
});

// Its own block: with the service worker on, the chunk would come from its
// precache and the simulated network failure would never happen.
test.describe('F: a missing code chunk', () => {
  test.use({ serviceWorkers: 'block' });

  test('a lesson whose code cannot be downloaded explains itself and offers a way on; it loads once the network is back', async ({ page }) => {
    await page.goto('./#home', { waitUntil: 'networkidle' });
    const chunk = /\/assets\/a1-slope-[\w-]{8}\.js$/; // not a1-slope-intercept-…
    await page.route(chunk, (route) => route.abort());
    await page.evaluate(() => { location.hash = '#learn/lesson/a1-slope'; });
    await expect(page.locator(VISIBLE + '.studio-callout-bad')).toContainText('This lesson could not be loaded');
    await expect(page.locator(VISIBLE).getByRole('link', { name: 'Open the course outline' })).toHaveAttribute('href', '#learn/course/algebra-1');
    await page.unroute(chunk);
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator(VISIBLE + '[data-section="matters"]')).toBeVisible();
  });
});
