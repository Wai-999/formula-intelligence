// Production smoke test for a release (docs/learning-8020/RELEASE_REPORT.md):
// in a real Chromium against the deployed site, Home → Learn/Courses → a
// lesson → Apply → My Progress → Save my place → reload → Resume → the next
// action. Prints each step with PASS/FAIL and saves a screenshot per step.
// Nothing is sent anywhere; the browser profile is fresh and discarded.
//
//   node scripts/learning-live-smoke.mjs https://wai-999.github.io/formula-intelligence/ docs/learning-8020/evidence/after-live

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [base = 'https://wai-999.github.io/formula-intelligence/', out = 'docs/learning-8020/evidence/after-live'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const VISIBLE = '.app-tab-keepalive:visible ';
const steps = [];
let n = 0;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

async function step(name, fn) {
  n += 1;
  try {
    const detail = await fn();
    steps.push({ n, name, ok: true, detail: detail ?? null });
    console.log(`PASS ${n}. ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (e) {
    steps.push({ n, name, ok: false, detail: String(e.message ?? e).split('\n')[0] });
    console.log(`FAIL ${n}. ${name} — ${String(e.message ?? e).split('\n')[0]}`);
  }
  await page.screenshot({ path: join(out, `smoke-${String(n).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 70 }).catch(() => {});
}
// Waits (up to 15 s) for the text to match: pages switch in place, so a check
// made straight after a click can still see the previous page.
const expectText = async (locator, re, what) => {
  let t = '';
  for (const until = Date.now() + 15000; Date.now() < until; await page.waitForTimeout(250)) {
    t = (await locator.first().innerText().catch(() => '')) ?? '';
    if (re.test(t)) return t.replace(/\s+/g, ' ').slice(0, 100);
  }
  throw new Error(`${what}: “${t.slice(0, 120)}” does not match ${re}`);
};
const nav = (label) => page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label, exact: true });

try {
  await step('Home loads and offers a starting point', async () => {
    await page.goto(`${base}#home`, { waitUntil: 'networkidle' });
    const bundle = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /assets\/index-/.test(s)) ?? '');
    await expectText(page.locator(`${VISIBLE}.home-first-title`), /Where would you like to start/, 'first-run title');
    return `bundle ${bundle.split('/').pop()}`;
  });

  await step('Learn → Courses lists the C++ course', async () => {
    await nav('Learn').click();
    await page.waitForLoadState('networkidle');
    await page.locator(`${VISIBLE}a[href="#learn/course/cpp-fundamentals"]`).first().waitFor({ timeout: 15000 });
    return 'C++ Programming Fundamentals present';
  });

  await step('A course page opens its first written lesson', async () => {
    await page.locator(`${VISIBLE}a[href="#learn/course/cpp-fundamentals"]`).first().click();
    await expectText(page.locator('h1.page-title'), /C\+\+ Programming Fundamentals/, 'course title');
    await page.locator(`${VISIBLE}.course-page a.studio-btn-primary[href*="learn/lesson"]`).first().click();
    return expectText(page.locator('h1.page-title'), /Loops you can trace/, 'lesson title');
  });

  await step('“Try a question now”, a wrong answer, and feedback that explains', async () => {
    await page.locator(`${VISIBLE}button.lesson-try-now`).click();
    await page.waitForTimeout(800);
    const card = page.locator(`${VISIBLE}[data-section="try"] > .item-card`).first();
    const radios = card.locator('input[type="radio"]');
    if (await radios.count()) await radios.last().check();
    else await card.locator('input').first().fill('987654');
    await card.getByRole('button', { name: 'Check' }).click();
    return expectText(card.locator('.item-feedback'), /Not yet\.[\s\S]+\S/, 'feedback');
  });

  await step('Save my place', async () => {
    await page.locator(`${VISIBLE}button.lesson-save`).click();
    return expectText(page.locator(`${VISIBLE}.lesson-save-note`), /Saved on this device/, 'save note');
  });

  await step('Apply → Projects', async () => {
    await nav('Apply').click();
    return expectText(page.locator('h1.page-title'), /Projects/, 'page title');
  });

  await step('My Progress shows the next step', async () => {
    await nav('My Progress').click();
    return expectText(page.locator(`${VISIBLE}#prog-next`), /Your next step/, 'section');
  });

  await step('Reload, then Home offers to resume the saved step', async () => {
    await page.reload({ waitUntil: 'networkidle' });
    await nav('Home').click();
    await page.waitForLoadState('networkidle');
    return expectText(page.locator(`${VISIBLE}.home-hero`), /Loops you can trace[\s\S]*Step 4 of 6/, 'hero');
  });

  await step('Resume opens the lesson at the saved step', async () => {
    await page.getByRole('button', { name: 'Resume where I stopped' }).click();
    await page.waitForTimeout(1200);
    await expectText(page.locator('h1.page-title'), /Loops you can trace/, 'lesson title');
    return expectText(page.locator(`${VISIBLE}.lesson-progress-text`), /Try it/, 'step');
  });

  await step('The next action leads to a real lesson', async () => {
    const next = page.locator(`${VISIBLE}.lesson-pager a`).last();
    const label = (await next.innerText()).trim();
    const href = await next.getAttribute('href');
    await next.click();
    // The page must actually change: the URL to the link's target, and the title away from this lesson.
    for (const until = Date.now() + 15000; Date.now() < until && !page.url().endsWith(href); ) await page.waitForTimeout(250);
    if (!page.url().endsWith(href)) throw new Error(`still at ${page.url()}, expected ${href}`);
    const title = await expectText(page.locator('h1.page-title'), /^(?!Loops you can trace$)\S/, 'next page title');
    return `${label} → ${href} (${title})`;
  });
} finally {
  await browser.close();
}

const result = { base, ranAt: new Date().toISOString(), passed: steps.filter((s) => s.ok).length, total: steps.length, pageErrors: errors, steps };
writeFileSync(join(out, 'smoke.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(`${result.passed}/${result.total} steps passed; ${errors.length} page errors`);
process.exit(result.passed === result.total && errors.length === 0 ? 0 : 1);
