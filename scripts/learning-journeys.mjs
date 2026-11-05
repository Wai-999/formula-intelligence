// Scripted learner journeys for the 80/20 usability report
// (docs/learning-8020/USABILITY_TEST_REPORT.md): six personas, walked in a
// real Chromium against any build of the app, counting deliberate decisions
// (clicks), what each primary action leads to, and what feedback says.
// Nothing is sent anywhere; results are written to a local folder.
//
//   node scripts/learning-journeys.mjs <baseURL> <outDir>
//   node scripts/learning-journeys.mjs https://wai-999.github.io/formula-intelligence/ docs/learning-8020/evidence/before
//   node scripts/learning-journeys.mjs http://127.0.0.1:4321/formula-intelligence/ docs/learning-8020/evidence/after
//
// The same script runs before and after an upgrade, so its numbers compare
// like with like. It reads lesson ids from the pages it visits, not from this
// checkout, because the build under test may have different lessons.

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [base = 'http://127.0.0.1:4321/formula-intelligence/', out = 'docs/learning-8020/evidence/local'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const T0 = 1793000000000;
const VISIBLE = '.app-tab-keepalive:visible ';

async function fresh(browser, { width = 1280, height = 900, theme = 'light', seed = null } = {}) {
  const context = await browser.newContext({ viewport: { width, height } });
  await context.addInitScript(({ theme, seed }) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('fi_theme_v1', JSON.stringify(theme));
    localStorage.setItem('ml_entry_banner_seen_v1', 'true');
    for (const [k, v] of Object.entries(seed ?? {})) localStorage.setItem(k, JSON.stringify(v));
  }, { theme, seed });
  const page = await context.newPage();
  return { context, page };
}

const go = async (page, hash) => {
  await page.goto(base + hash, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
};
const hashOf = (page) => new URL(page.url()).hash;
const shot = (page, name) => page.screenshot({ path: join(out, `${name}.jpg`), type: 'jpeg', quality: 70, fullPage: false });

/** Where the first "Try it" question sits, and how much reading comes before it. */
async function firstQuestion(page) {
  return page.evaluate(() => {
    const root = [...document.querySelectorAll('.app-tab-keepalive')].find((el) => el.getClientRects().length) ?? document;
    const card = root.querySelector('[data-section="try"] .item-card');
    if (!card) return null;
    const sections = [...root.querySelectorAll('.lesson-section')];
    const before = sections.slice(0, sections.findIndex((s) => s.dataset.section === 'try'));
    const words = before.reduce((n, s) => n + s.innerText.split(/\s+/).filter(Boolean).length, 0);
    const scroller = card.closest('.studio-scroll') ?? document.scrollingElement;
    const top = card.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    return { wordsBefore: words, pxFromTop: Math.round(top), screensAt900: Math.round((top / 900) * 10) / 10 };
  });
}

const results = { base, ranAt: new Date().toISOString(), personas: [] };
const record = (r) => { results.personas.push(r); console.log(`${r.id}: ${JSON.stringify(r.measures)}`); };

const browser = await chromium.launch();
try {
  // 1. Absolute beginner: no records at all.
  {
    const { context, page } = await fresh(browser);
    await go(page, '#home');
    await shot(page, 'p1-home-first-run');
    const firstRunText = await page.locator(`${VISIBLE}main, ${VISIBLE}`).first().innerText();
    let clicks = 0;
    await page.getByRole('button', { name: /Start from Prealgebra/ }).click(); clicks++;
    await page.waitForTimeout(500);
    const courseHash = hashOf(page);
    const start = page.locator(`${VISIBLE}a.studio-btn-primary[href*="learn/lesson"]`).first();
    const startLabel = await start.innerText();
    await start.click(); clicks++;
    await page.waitForTimeout(800);
    const fq = await firstQuestion(page);
    await shot(page, 'p1-first-lesson');
    record({
      id: 'P1 absolute beginner',
      steps: ['Home (first run)', 'Start from Prealgebra', courseHash, startLabel, hashOf(page)],
      measures: { decisionsToFirstLesson: clicks, lesson: hashOf(page), firstQuestion: fq, homeOffersStartingPoint: /Where would you like to start/.test(firstRunText) },
    });
    await context.close();
  }

  // 2. Algebra-ready learner who wants Calculus I.
  {
    const { context, page } = await fresh(browser);
    await go(page, '#home');
    let clicks = 0;
    await page.getByRole('button', { name: /Explore first/ }).click(); clicks++;
    await page.waitForTimeout(500);
    await shot(page, 'p2-courses');
    const coursesText = await page.locator(`${VISIBLE}`).first().innerText();
    await page.locator(`${VISIBLE}a[href*="learn/course/calculus-1"]`).first().click(); clicks++;
    await page.waitForTimeout(500);
    const course = await page.locator(`${VISIBLE}`).first().innerText();
    const start = page.locator(`${VISIBLE}a.studio-btn-primary[href*="learn/lesson"]`).first();
    const startLabel = await start.innerText().catch(() => null);
    await start.click(); clicks++;
    await page.waitForTimeout(800);
    record({
      id: 'P2 algebra-ready calculus learner',
      steps: ['Home (first run)', 'Explore first', 'Calculus I', startLabel, hashOf(page)],
      measures: {
        decisionsToFirstLesson: clicks,
        lesson: hashOf(page),
        coursePageWarnsAboutPrerequisites: /builds on|not finished|Bridge/i.test(course),
        coursesPageWordCount: coursesText.split(/\s+/).length,
      },
    });
    await context.close();
  }

  // 3. Novice C++ programmer (Ohlone CS-102).
  {
    const { context, page } = await fresh(browser);
    await go(page, '#home');
    let clicks = 0;
    await page.getByRole('button', { name: /Explore first/ }).click(); clicks++;
    await page.waitForTimeout(500);
    const cpp = page.locator(`${VISIBLE}a[href*="learn/course/cpp"]`).first();
    const found = await cpp.count();
    let lesson = null;
    let startLabel = null;
    if (found) {
      await cpp.click(); clicks++;
      await page.waitForTimeout(500);
      const start = page.locator(`${VISIBLE}a.studio-btn-primary[href*="learn/lesson"]`).first();
      startLabel = await start.innerText();
      await start.click(); clicks++;
      await page.waitForTimeout(800);
      lesson = hashOf(page);
      await shot(page, 'p3-cpp-lesson');
    }
    const search = await (async () => {
      await go(page, '#home');
      await page.keyboard.press('Control+k');
      await page.keyboard.type('C++');
      await page.waitForTimeout(400);
      return page.locator('[role="option"], .search-result, [role="listbox"] a').count().catch(() => 0);
    })();
    record({
      id: 'P3 novice C++ programmer',
      steps: found ? ['Home (first run)', 'Explore first', 'C++ course', startLabel, lesson] : ['Home (first run)', 'Explore first', 'no C++ course in the catalog'],
      measures: { cppCourseExists: !!found, decisionsToFirstLesson: found ? clicks : null, lesson, searchResultsForCpp: search },
    });
    await context.close();
  }

  // 4. Returning learner with a saved step (Algebra I, "Try it").
  {
    const pinned = { courseId: 'algebra-1', lessonId: 'a1-slope', sectionId: 'try', fraction: 0.3, at: T0, source: 'manual' };
    const seed = {
      fi_resume_v1: { schemaVersion: 1, pinned, current: pinned, recent: [pinned] },
      fi_lessons_v1: { schemaVersion: 1, last: 'a1-slope', lessons: { 'a1-slope': { opened: T0, visited: T0, sections: ['matters', 'understand', 'see', 'try'] } } },
      fi_diagnostic_v1: { schemaVersion: 1, firstRun: 'prealgebra', attempts: [], placement: { course: 'algebra-1', source: 'manual', at: T0 }, path: null },
    };
    const { context, page } = await fresh(browser, { seed });
    await go(page, '#home');
    await shot(page, 'p4-home-returning');
    const hero = await page.locator(`${VISIBLE}.home-hero`).first().innerText();
    let clicks = 0;
    await page.getByRole('button', { name: /Resume where I stopped/ }).click(); clicks++;
    await page.waitForTimeout(1200);
    const at = await page.evaluate(() => {
      const root = [...document.querySelectorAll('.app-tab-keepalive')].find((el) => el.getClientRects().length) ?? document;
      const sec = root.querySelector('[data-section="try"]');
      if (!sec) return null;
      const r = sec.getBoundingClientRect();
      // The saved place is a point inside the step, so the step's heading may
      // be above the fold: what matters is that the step fills the view.
      return { top: Math.round(r.top), inView: r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5 };
    });
    const progress = await page.locator(`${VISIBLE}.lesson-progress-text`).first().innerText().catch(() => null);
    await shot(page, 'p4-resumed');
    record({
      id: 'P4 returning learner with a saved step',
      steps: ['Home', 'Resume where I stopped', hashOf(page)],
      measures: { decisionsToResume: clicks, lesson: hashOf(page), progressText: progress, savedStepInView: at?.inView ?? false, heroNamesStep: /Step 4/.test(hero) },
    });
    await context.close();
  }

  // 5. Learner who gets two questions wrong (Calculus I, first lesson).
  {
    const { context, page } = await fresh(browser, { seed: { fi_diagnostic_v1: { schemaVersion: 1, firstRun: 'explore', attempts: [], placement: null, path: null } } });
    await go(page, '#learn/course/calculus-1');
    const first = await page.locator(`${VISIBLE}a.studio-btn-primary[href*="learn/lesson"]`).first().getAttribute('href');
    await page.goto(base + first, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const cards = page.locator(`${VISIBLE}[data-section="try"] .item-card`);
    const feedback = [];
    for (let i = 0; i < 2; i++) {
      const card = cards.nth(i);
      await card.scrollIntoViewIfNeeded();
      const radios = card.locator('input[type="radio"]');
      if (await radios.count()) {
        // Pick the last option; if that happens to be right, the next run notes it.
        await radios.last().check();
      } else {
        for (const input of await card.locator('input').all()) await input.fill('123456');
      }
      await card.getByRole('button', { name: 'Check' }).click();
      await page.waitForTimeout(300);
      const fb = (await card.locator('.item-feedback').innerText()).replace(/\s+/g, ' ').trim();
      const links = await card.locator('.item-feedback a').evaluateAll((as) => as.map((a) => `${a.textContent.trim()} → ${a.getAttribute('href')}`));
      feedback.push({
        wrong: !/^Correct/.test(fb),
        feedbackWords: fb.split(' ').filter(Boolean).length,
        explainsBeyondVerdict: fb.replace(/^Not yet\.?/, '').trim().length > 0,
        solutionOffered: await card.getByRole('button', { name: 'Show solution' }).count() > 0,
        linksFromFeedback: links,
        feedbackText: fb.slice(0, 400),
      });
    }
    await shot(page, 'p5-wrong-answers');
    await go(page, '#home');
    const hero = await page.locator(`${VISIBLE}.home-hero`).first().innerText();
    await shot(page, 'p5-home-after-errors');
    record({
      id: 'P5 learner who failed two questions',
      steps: ['Calculus I first lesson', 'two wrong answers in Try it', 'Home'],
      measures: {
        lesson: first,
        feedback,
        homeAfterErrors: hero.replace(/\s+/g, ' ').slice(0, 300),
        homeOffersBridgeOrReview: /bridge|review|practise|practice/i.test(hero),
      },
    });
    await context.close();
  }

  // 6. Finished every written lesson of Calculus I; the course has planned lessons.
  {
    const probe = await fresh(browser);
    await go(probe.page, '#learn/course/calculus-1');
    const ids = await probe.page.locator(`${VISIBLE}a[href*="learn/lesson/"]`).evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href').split('/').pop()))]);
    await probe.context.close();
    const lessons = Object.fromEntries(ids.map((id, i) => [id, { opened: T0 + i, visited: T0 + i, sections: [], completed: T0 + i, checkpoint: { correct: 3, total: 3, at: T0 + i } }]));
    const seed = {
      fi_lessons_v1: { schemaVersion: 1, last: ids.at(-1), lessons },
      fi_diagnostic_v1: { schemaVersion: 1, firstRun: 'explore', attempts: [], placement: { course: 'calculus-1', source: 'manual', at: T0 - 1 }, path: null },
    };
    const { context, page } = await fresh(browser, { seed });
    await go(page, '#learn/course/calculus-1');
    const coursePage = await page.locator(`${VISIBLE}`).first().innerText();
    await shot(page, 'p6-course-finished-available');
    await go(page, '#home');
    const hero = await page.locator(`${VISIBLE}.home-hero`).first().innerText();
    const primary = await page.locator(`${VISIBLE}.home-hero .studio-btn-primary`).first().innerText().catch(() => null);
    await shot(page, 'p6-home');
    record({
      id: 'P6 finished the written lessons of a partly written course',
      steps: ['Calculus I: every written lesson done', 'Course page', 'Home'],
      measures: {
        writtenLessonsInCourse: ids.length,
        courseSaysNotComplete: /not complete|not written yet/i.test(coursePage),
        courseClaimsCompleted: /course (is )?complete(d)?\b(?! *—)|you have completed calculus/i.test(coursePage),
        homePrimary: primary,
        homeJumpsToNextCourse: /Calculus II|Continue to/i.test(primary ?? ''),
        homeNamesGap: /not written yet/i.test(hero),
        homeExcerpt: hero.replace(/\s+/g, ' ').slice(0, 400),
      },
    });
    await context.close();
  }

  // Screens for the audit, both themes, desktop and phone.
  for (const theme of ['light', 'dark']) {
    for (const [w, h] of [[1280, 900], [375, 812]]) {
      const pinned = { courseId: 'algebra-1', lessonId: 'a1-slope', sectionId: 'try', fraction: 0.3, at: T0, source: 'manual' };
      const seed = {
        fi_resume_v1: { schemaVersion: 1, pinned, current: pinned, recent: [pinned] },
        fi_lessons_v1: { schemaVersion: 1, last: 'a1-slope', lessons: { 'a1-slope': { opened: T0, visited: T0, sections: ['matters'] } } },
        fi_diagnostic_v1: { schemaVersion: 1, firstRun: 'prealgebra', attempts: [], placement: { course: 'algebra-1', source: 'manual', at: T0 }, path: null },
      };
      const { context, page } = await fresh(browser, { width: w, height: h, theme, seed });
      for (const [name, hash] of [['home', '#home'], ['courses', '#learn/courses'], ['course', '#learn/course/calculus-1'], ['lesson', '#learn/lesson/a1-slope'], ['practice', '#practice/review'], ['projects', '#apply/projects'], ['progress', '#progress/overview'], ['settings', '#progress/settings']]) {
        await go(page, hash);
        await shot(page, `screen-${name}-${w}-${theme}`);
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}

writeFileSync(join(out, 'journeys.json'), `${JSON.stringify(results, null, 2)}\n`);
console.log(`wrote ${join(out, 'journeys.json')}`);
