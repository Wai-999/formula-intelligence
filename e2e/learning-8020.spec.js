import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CURRICULUM as cur } from '../src/data/curriculum/path.js';
import { firstGap } from '../src/lib/nextAction.js';
import { VISIBLE } from './helpers.js';

// The 80/20 learning upgrade in a real browser (docs/learning-8020/): wrong
// answers explain themselves and offer a short bridge; failing the chain
// rule sends Home to composite functions, once; the faded example; an
// honest "next lesson not written yet"; the four course statuses; and the
// session summary. Lesson ids are read from the catalog.

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const T = 1793000000000;
const calc1 = cur.courseLessons['calculus-1'];
const bridgeTitle = cur.lessonById['a2-composition'].title;

async function seed(page, { completed = [], placement = null } = {}) {
  await page.addInitScript(({ completed, placement }) => {
    localStorage.setItem('ml_entry_banner_seen_v1', 'true');
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    const lessons = Object.fromEntries(completed.map((id, i) => [id, { opened: 1793000000000 + i, visited: 1793000000000 + i, sections: [], completed: 1793000000000 + i, checkpoint: { correct: 3, total: 3, at: 1793000000000 + i } }]));
    localStorage.setItem('fi_lessons_v1', JSON.stringify({ schemaVersion: 1, lessons, last: completed.at(-1) ?? null }));
    localStorage.setItem('fi_diagnostic_v1', JSON.stringify({ schemaVersion: 1, firstRun: 'explore', attempts: [], placement, path: null }));
  }, { completed, placement });
}

const tryCards = (page) => page.locator(`${VISIBLE}[data-section="try"] > .item-card`);
const progress = (page) => page.locator(`${VISIBLE}.lesson-progress-text`);

async function answerWrong(card) {
  await card.scrollIntoViewIfNeeded();
  const radios = card.locator('input[type="radio"]');
  if (await radios.count()) await radios.last().check();
  else await card.locator('input').first().fill('987654');
  await card.getByRole('button', { name: 'Check' }).click();
}

test('a wrong answer says what went wrong and where to look, offers a short bridge, and shows the reasoning after a second miss', async ({ page }) => {
  await seed(page);
  await page.goto('./#learn/lesson/c1-chain-rule', { waitUntil: 'networkidle' });
  const card = tryCards(page).first();
  await answerWrong(card);
  const fb = card.locator('.item-feedback');
  await expect(fb).toContainText('Not yet.');
  await expect(fb.locator('.item-what')).not.toBeEmpty();
  await expect(fb).toContainText('Where to look:');
  await expect(fb.getByRole('link', { name: `${bridgeTitle} — the worked examples` })).toBeVisible();
  await expect(card.locator('.item-solution')).toHaveCount(0);
  await card.getByRole('button', { name: 'Check' }).click();
  await expect(card.locator('.item-solution')).toBeVisible();
  // The bridge opens composite functions at its worked examples (Step 2).
  await fb.getByRole('link', { name: `${bridgeTitle} — the worked examples` }).click();
  await expect(page).toHaveURL(/#learn\/lesson\/a2-composition$/);
  await expect(progress(page)).toContainText('Step 2 of 6');
});

test('after two misses in the chain rule, Home offers a five-minute composition bridge — once', async ({ page }) => {
  await seed(page, { placement: { course: 'calculus-1', source: 'manual', at: T } });
  await page.goto('./#learn/lesson/c1-chain-rule', { waitUntil: 'networkidle' });
  await answerWrong(tryCards(page).nth(0));
  await answerWrong(tryCards(page).nth(1));
  await page.goto('./#home', { waitUntil: 'networkidle' });
  const hero = page.locator(`${VISIBLE}.home-hero`);
  await expect(page.locator(`${VISIBLE}#home-continue`)).toHaveText('A short bridge first');
  await expect(hero).toContainText('2 of your last 2 answers in “The chain rule');
  await expect(hero).toContainText('about 5 min');
  await expect(hero.getByRole('link', { name: /^Back to “The chain rule/ })).toBeVisible();
  await hero.locator('.studio-btn-primary').click();
  await expect(page).toHaveURL(/#learn\/lesson\/a2-composition$/);
  await expect(progress(page)).toContainText('Understand');
  // Taken: Home moves on instead of sending the learner back again.
  await page.goto('./#home', { waitUntil: 'networkidle' });
  await expect(page.locator(`${VISIBLE}#home-continue`)).not.toHaveText('A short bridge first');
});

test('the faded example: blanks are questions, and the finished example appears once each is tried', async ({ page }) => {
  await seed(page);
  await page.goto('./#learn/lesson/c1-chain-rule', { waitUntil: 'networkidle' });
  const faded = page.locator(`${VISIBLE}.lesson-faded`);
  await faded.scrollIntoViewIfNeeded();
  await expect(faded.getByRole('heading', { name: /^Faded example:/ })).toBeVisible();
  const body = (await import('../src/data/curriculum/lessons/c1-chain-rule.js')).default;
  const blanks = body.faded.steps.filter((s) => s.item).map((s) => s.item);
  await expect(faded).toContainText('the finished example appears when you have tried each one');
  for (const [i, it] of blanks.entries()) {
    const card = faded.locator('.item-card').nth(i);
    await card.locator('input').fill(String(it.answer.value));
    await card.getByRole('button', { name: 'Check' }).click();
    await expect(card).toContainText('Correct');
  }
  await expect(faded.locator('.lesson-answer')).toContainText('difference quotient agrees');
  // The rest of the contract is on the page: outcomes, a simpler explanation, the tempting mistake.
  await expect(page.locator(`${VISIBLE}.lesson-outcomes`)).toContainText('After this lesson you can');
  await expect(page.locator(`${VISIBLE}summary`, { hasText: 'Explain it more simply' })).toBeVisible();
  await expect(page.locator(`${VISIBLE}.lesson-tempting`).first()).toContainText('The tempting shortcut');
});

test('finishing the written lessons of Calculus I: Home names the unwritten lesson, offers practice and the next course, and the course page keeps four statuses apart', async ({ page }) => {
  await seed(page, { completed: calc1, placement: { course: 'calculus-1', source: 'manual', at: T - 10 } });
  await page.goto('./#home', { waitUntil: 'networkidle' });
  const gap = firstGap(cur.courseById['calculus-1']).title;
  await expect(page.locator(`${VISIBLE}#home-continue`)).toHaveText('The next lesson is not written yet');
  await expect(page.locator(`${VISIBLE}.home-hero-title`)).toHaveText(`Next lesson not written yet: ${gap}`);
  await expect(page.locator(`${VISIBLE}.home-hero .studio-btn-primary`)).toContainText('Practise Calculus I');
  await expect(page.locator(`${VISIBLE}.home-hero a`, { hasText: /^Continue to Calculus II/ })).toBeVisible();

  await page.goto('./#learn/course/calculus-1', { waitUntil: 'networkidle' });
  const finish = page.locator(`${VISIBLE}.course-finish`);
  await expect(finish).toContainText(`Next lesson not written yet: ${gap}`);
  const done = page.locator(`${VISIBLE}.course-completion`);
  await done.locator('summary').click();
  // (The colon after each term is drawn by CSS, so it is not in the text.)
  await expect(done).toContainText('Written lessons finishedYes');
  await expect(done).toContainText('Whole course writtenNot yet');
  await expect(done).toContainText('Ready for what comes nextNot yet');
  await expect(done).toContainText('None of them is college credit');

  // My Progress gives the same next step as Home.
  await page.goto('./#progress/overview', { waitUntil: 'networkidle' });
  const next = page.locator(`${VISIBLE}[aria-labelledby="prog-next"]`);
  await expect(next.locator('.studio-btn-primary')).toContainText('Practise Calculus I');
  await expect(next).toContainText(/Before Calculus I .* counts as ready/);
});

test('finishing a study session summarises what was practised, what needs review and the next step', async ({ page }) => {
  await seed(page);
  await page.goto('./#learn/lesson/a2-composition', { waitUntil: 'networkidle' });
  const body = (await import('../src/data/curriculum/lessons/a2-composition.js')).default;
  const first = body.practice[0];
  const one = tryCards(page).nth(0);
  await one.scrollIntoViewIfNeeded();
  await one.locator('input').fill(String(first.answer.value));
  await one.getByRole('button', { name: 'Check' }).click();
  await answerWrong(tryCards(page).nth(1));
  await page.locator(`${VISIBLE}button.lesson-finish`).click();
  await expect(page).toHaveURL(/#learn\/session$/);
  const facts = page.locator(`${VISIBLE}.session-facts`);
  await expect(facts).toContainText('1 of 2 right on the first try');
  await expect(facts).toContainText('Composite and inverse functions');
  await expect(page.getByRole('heading', { name: 'Next useful step' })).toBeVisible();
  await expect(page.locator(`${VISIBLE}.session-page .studio-btn-primary`)).toHaveCount(1);
});

test('no accessibility violations on the new states, in both themes', async ({ page }) => {
  test.setTimeout(90_000);
  for (const theme of ['light', 'dark']) {
    await page.addInitScript((t) => localStorage.setItem('fi_theme_v1', JSON.stringify(t)), theme);
    await seed(page, { completed: calc1, placement: { course: 'calculus-1', source: 'manual', at: T - 10 } });
    for (const hash of ['#home', '#learn/course/calculus-1', '#progress/overview']) {
      await page.goto(`./${hash}`, { waitUntil: 'networkidle' });
      const r = await new AxeBuilder({ page }).withTags(AXE_TAGS).include('.app-tab-keepalive:not([hidden])').analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`), `${theme} ${hash}`).toEqual([]);
    }
    await page.goto('./#learn/lesson/c1-chain-rule', { waitUntil: 'networkidle' });
    await answerWrong(tryCards(page).first());
    const r = await new AxeBuilder({ page }).withTags(AXE_TAGS).include('.app-tab-keepalive:not([hidden])').analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`), `${theme} lesson feedback`).toEqual([]);
  }
});

test('at phone width the lesson with a faded example does not scroll sideways', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await seed(page);
  await page.goto('./#learn/lesson/cpp-loops-trace', { waitUntil: 'networkidle' });
  await page.locator(`${VISIBLE}.lesson-faded`).scrollIntoViewIfNeeded();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
