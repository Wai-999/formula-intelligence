import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { hashFor } from '../src/app/pages.js';
import { CURRICULUM as cur } from '../src/data/curriculum/path.js';
import { VISIBLE, lessonSettled } from './helpers.js';

// Course-to-course continuity (docs/CONTINUOUS_LEARNING_UPGRADE.md): the
// navigation matrix in a real browser, against the production build. Course
// and lesson ids come from the real catalog and route, so a new lesson or
// course is covered without editing this file.

const route = cur.pathById[cur.defaultPath];
const written = route.courses.filter((c) => cur.courseLessons[c].length);
const lessonsOf = (...courses) => courses.flatMap((c) => cur.courseLessons[c]);
const title = (id) => cur.lessonById[id].title;
const courseTitle = (id) => cur.courseById[id].title;
const lesson = (id) => `./${hashFor('learn/lesson', { lessonId: id })}`;
const course = (id) => `./${hashFor('learn/course', { courseId: id })}`;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Learner records written once, before the app loads (reloads keep what the app wrote since). */
async function seed(page, { completed = [], placement = null, path = null } = {}) {
  await page.addInitScript(({ completed, placement, path }) => {
    localStorage.setItem('ml_entry_banner_seen_v1', 'true');
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    const t = 1793000000000;
    const lessons = Object.fromEntries(completed.map((id, i) => [id, { opened: t + i, visited: t + i, sections: [], completed: t + i, checkpoint: { correct: 3, total: 3, at: t + i } }]));
    localStorage.setItem('fi_lessons_v1', JSON.stringify({ schemaVersion: 1, lessons, last: completed.at(-1) ?? null }));
    localStorage.setItem('fi_diagnostic_v1', JSON.stringify({ schemaVersion: 1, firstRun: 'explore', attempts: [], placement, path }));
  }, { completed, placement, path });
}

/** Answer a lesson's checkpoint correctly, from the lesson's own answer key. */
async function answerCheckpoint(page, lessonId) {
  const body = (await import(`../src/data/curriculum/lessons/${lessonId}.js`)).default;
  const check = page.locator(`${VISIBLE}[data-section="check"]`);
  await check.scrollIntoViewIfNeeded();
  for (const [i, item] of body.checkpoint.entries()) {
    const card = check.locator('.item-card').nth(i);
    if (item.answer.type === 'numeric') {
      await card.locator('input').fill(String(item.answer.value));
    } else if (item.answer.type === 'choice') {
      await card.locator('input[type="radio"]').nth(item.answer.correct).check();
    } else {
      for (const [k, v] of item.answer.values.entries()) await card.locator('input').nth(k).fill(String(v));
    }
    await card.getByRole('button', { name: 'Check' }).click();
    await expect(card).toContainText('Correct');
  }
  await expect(check.getByText(`${body.checkpoint.length} of ${body.checkpoint.length} correct on the first try.`)).toBeVisible();
}

const heroTitle = (page) => page.locator(`${VISIBLE}.home-hero-title`);

test.describe('A: Next, lesson by lesson, through a course', () => {
  test('the pager visits every written lesson in course order across units, then offers the next course', async ({ page }) => {
    // The course with the most units, so unit boundaries are crossed.
    const c = written.reduce((a, b) => (new Set(lessonsOf(b).map((l) => cur.unitOf[l].id)).size > new Set(lessonsOf(a).map((l) => cur.unitOf[l].id)).size ? b : a));
    const order = cur.courseLessons[c];
    const before = route.courses.slice(0, route.courses.indexOf(c));
    await seed(page, { completed: [...lessonsOf(...before), ...order.slice(0, -1)] });
    await page.goto(lesson(order[0]), { waitUntil: 'networkidle' });
    for (const next of order.slice(1)) {
      const link = page.locator(`${VISIBLE}.lesson-pager a`, { hasText: `Next lesson: ${title(next)}` });
      await link.click();
      await expect(page.locator('h1.page-title')).toHaveText(title(next));
    }
    const nextCourse = written[written.indexOf(c) + 1];
    const finish = page.locator(`${VISIBLE}.lesson-pager a`, { hasText: /^Finish course & continue/ });
    await expect(finish).toContainText(courseTitle(nextCourse));
    await expect(finish).toHaveAttribute('href', `#learn/lesson/${cur.courseLessons[nextCourse][0]}`);
  });

  test('at a unit end, the pager goes on to the next unit, not back to the course outline', async ({ page }) => {
    const id = Object.keys(cur.courseOf).find((l) => {
      const order = cur.courseLessons[cur.courseOf[l]];
      const next = order[order.indexOf(l) + 1];
      return next && cur.unitOf[next].id !== cur.unitOf[l].id;
    });
    const order = cur.courseLessons[cur.courseOf[id]];
    const next = order[order.indexOf(id) + 1];
    await seed(page);
    await page.goto(lesson(id), { waitUntil: 'networkidle' });
    await expect(page.locator(`${VISIBLE}.lesson-pager`)).not.toContainText('Back to the course');
    await expect(page.locator(`${VISIBLE}.lesson-pager a`).last()).toHaveAttribute('href', `#learn/lesson/${next}`);
  });
});

test('B: answering the last checkpoint of a course leads, in one click, to the next course — with the reason', async ({ page }) => {
  const [first, second] = written;
  const order = cur.courseLessons[first];
  await seed(page, { completed: order.slice(0, -1) });
  await page.goto(lesson(order.at(-1)), { waitUntil: 'networkidle' });
  await answerCheckpoint(page, order.at(-1));
  const done = page.locator(`${VISIBLE}.lesson-complete`);
  await expect(done).toBeVisible();
  await expect(done).toContainText(`every written lesson in ${courseTitle(first)}`);
  await expect(done).toContainText('the full course is not complete'); // planned lessons remain
  await expect(done).not.toContainText(/mastered|course complete/i);
  const go = done.getByRole('link', { name: new RegExp(`^Continue to ${escape(courseTitle(second))}: `) });
  await go.click();
  await expect(page.locator('h1.page-title')).toHaveText(title(cur.courseLessons[second][0]));
});

test('C: when the next course on the path is not written, it is named and the next written course is offered', async ({ page }) => {
  const i = route.courses.findIndex((c, k) => cur.courseLessons[c].length && route.courses[k + 1] && !cur.courseLessons[route.courses[k + 1]].length);
  const c = route.courses[i];
  const skipped = route.courses[i + 1];
  const nextWritten = route.courses.slice(i + 1).find((x) => cur.courseLessons[x].length);
  await seed(page, { completed: lessonsOf(...route.courses.slice(0, i + 1)) });
  await page.goto(course(c), { waitUntil: 'networkidle' });
  const finish = page.locator(`${VISIBLE}.course-finish`);
  await expect(finish.getByRole('link', { name: new RegExp(`^Continue to ${escape(courseTitle(nextWritten))}`) })).toBeVisible();
  await expect(finish).toContainText(courseTitle(skipped));
  await expect(finish).toContainText('not written yet');
  await expect(page.locator(`${VISIBLE}.course-journey`)).toContainText(courseTitle(skipped));
  await expect(page.locator(`${VISIBLE}.course-after`)).toContainText(courseTitle(nextWritten));
  // Browsing the whole catalog is a choice, never the default.
  await expect(finish.locator('.studio-btn-primary')).not.toHaveAttribute('href', '#learn/courses');
});

test('D: the last written course ends the path honestly, with useful next choices', async ({ page }) => {
  const last = cur.courseLessons[written.at(-1)].at(-1);
  await seed(page, { completed: lessonsOf(...route.courses) });
  await page.goto(lesson(last), { waitUntil: 'networkidle' });
  const done = page.locator(`${VISIBLE}.lesson-complete`);
  await expect(done).toContainText('every written lesson on');
  await expect(done).toContainText('planned lessons on this path are not written yet');
  await expect(done.getByRole('link', { name: 'Review your skills in Practice' })).toBeVisible();
  await done.getByRole('link', { name: 'See your whole path' }).click();
  await expect(page.locator('h1.page-title')).toHaveText('Your learning path');
});

test('E: Home after finishing any course continues to the next course on the path — never back to the start', async ({ browser }) => {
  for (const [i, c] of written.slice(0, -1).entries()) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await seed(page, { completed: lessonsOf(c) });
    await page.goto('./#home', { waitUntil: 'networkidle' });
    const expected = cur.courseLessons[written[i + 1]][0];
    await expect(heroTitle(page), `after ${c}`).toHaveText(title(expected));
    await expect(page.locator(`${VISIBLE}#home-continue`)).toHaveText('Next course on your path');
    await expect(page.locator(`${VISIBLE}.home-hero .studio-btn-primary`)).toHaveCount(1);
    await context.close();
  }
});

test('F: a placement at an intermediate course starts there, not at Prealgebra', async ({ page }) => {
  const c = written[3];
  await seed(page, { placement: { course: c, source: 'diagnostic', attemptId: null, at: 1793000000000 } });
  await page.goto('./#home', { waitUntil: 'networkidle' });
  await expect(heroTitle(page)).toHaveText(title(cur.courseLessons[c][0]));
  await expect(page.locator(`${VISIBLE}.home-hero`)).toContainText(courseTitle(c));
});

test('G: choosing another course as the starting point is respected', async ({ page }) => {
  const [, , third] = written;
  await seed(page, { completed: lessonsOf(written[1]).slice(0, 1) });
  const choice = written[written.length - 2];
  await page.goto(course(choice), { waitUntil: 'networkidle' });
  await page.locator(VISIBLE).getByRole('button', { name: 'Make this my starting point' }).click();
  await page.goto('./#home', { waitUntil: 'networkidle' });
  await expect(heroTitle(page)).toHaveText(title(cur.courseLessons[choice][0]));
  expect(choice).not.toBe(third);
});

test('H: an outline-only course offers something to do instead of a dead end', async ({ page }) => {
  await seed(page);
  for (const c of route.courses.filter((x) => !cur.courseLessons[x].length)) {
    await page.goto(course(c), { waitUntil: 'networkidle' });
    const note = page.locator(`${VISIBLE}.course-outline-note`);
    await expect(note).toContainText('No lesson of this course is written yet');
    const go = note.locator('.studio-btn-primary');
    await expect(go).toBeVisible();
    expect(await go.getAttribute('href')).not.toBe('#learn/courses');
  }
});

test('I: the path page shows where you are; following a track changes Home, survives a reload and is in the backup', async ({ page }) => {
  const [first, second] = written;
  await seed(page, { completed: lessonsOf(first, second) });
  await page.goto('./#learn/pathway', { waitUntil: 'networkidle' });
  await expect(page.locator(`${VISIBLE}.pathway-course.here`)).toContainText(courseTitle(second));
  const track = cur.paths.find((p) => p.kind === 'track' && p.steps.some((s) => s.lesson && !lessonsOf(first, second).includes(s.lesson)));
  const card = page.locator(`${VISIBLE}.pathway-track`, { hasText: track.title });
  await card.getByRole('button', { name: 'Follow this track' }).click();
  await expect(card).toContainText('You are following this track');
  const nextStep = track.steps.find((s) => s.lesson && !lessonsOf(first, second).includes(s.lesson)).lesson;
  await page.goto('./#home', { waitUntil: 'networkidle' });
  await expect(heroTitle(page)).toHaveText(title(nextStep));
  await expect(page.locator(`${VISIBLE}.home-hero`).getByRole('link', { name: /^Continue your track: / })).toBeVisible();
  await page.reload({ waitUntil: 'networkidle' });
  await expect(heroTitle(page)).toHaveText(title(nextStep));

  await page.goto('./#progress/settings', { waitUntil: 'networkidle' });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator(`${VISIBLE}.backup-panel`).getByRole('button', { name: 'Download backup' }).click(),
  ]);
  const backup = readFileSync(await download.path(), 'utf8');
  expect(backup).toContain(track.id);

  await page.goto('./#learn/pathway', { waitUntil: 'networkidle' });
  await page.locator(`${VISIBLE}.pathway-track`, { hasText: track.title }).getByRole('button', { name: /^Stop following/ }).click();
  await page.goto('./#home', { waitUntil: 'networkidle' });
  await expect(page.locator(`${VISIBLE}.home-hero`).getByRole('link', { name: /^Continue your track: / })).toHaveCount(0);
});

for (const viewport of [{ width: 1280, height: 800 }, { width: 375, height: 760 }]) {
  test(`J (${viewport.width}px): two quick presses of “Next” move two steps`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await seed(page);
    await page.goto(lesson(written.length ? cur.courseLessons[written[1]][0] : ''), { waitUntil: 'networkidle' });
    const next = page.locator(`${VISIBLE}.lesson-next-step`);
    await expect(next).toHaveText('Next: Understand');
    await next.dblclick();
    await expect(page.locator(`${VISIBLE}.lesson-progress-text`)).toContainText('See it');
    await expect(next).toHaveText('Next: Try it');
    await lessonSettled(page);
    await expect(page.locator(`${VISIBLE}.lesson-progress-text`)).toContainText('See it');
  });
}

test.describe('K: layout and accessibility of the new parts', () => {
  for (const width of [320, 1280]) {
    for (const theme of ['light', 'dark']) {
      test(`${width}px ${theme}: path page, finished course and lesson summary fit and pass axe`, async ({ page }) => {
        test.setTimeout(90_000);
        await page.setViewportSize({ width, height: 800 });
        await page.emulateMedia({ colorScheme: theme });
        const [first] = written;
        await seed(page, { completed: lessonsOf(first) });
        for (const hash of ['#learn/pathway', `#learn/course/${first}`, `#learn/lesson/${cur.courseLessons[first].at(-1)}`, '#learn/courses', '#home']) {
          await page.goto(`./${hash}`, { waitUntil: 'networkidle' });
          await expect(page.locator('h1.page-title')).toBeVisible();
          expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), hash).toBeLessThanOrEqual(0);
          const r = await new AxeBuilder({ page }).withTags(AXE_TAGS).include('.app-tab-keepalive:not([hidden])').analyze();
          expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`), hash).toEqual([]);
        }
      });
    }
  }
});
