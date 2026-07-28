#!/usr/bin/env node
// Accessibility gate. Run: npm run a11y  (CI runs it before build)
//
// The audit that found 36 violations was a thing a person ran once. This
// makes it a machine's job, because the failure mode it guards is silent:
// contrast, missing accessible names and keyboard-unreachable regions do
// not break anything visible, so nothing else in the pipeline would notice.
//
// Real browser, not jsdom — colour contrast and focusability require actual
// layout and computed styles, which jsdom does not provide.

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = process.env.A11Y_PORT || 4319;
const BASE = `http://127.0.0.1:${PORT}/formula-intelligence/`;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// One page per distinct layout — auditing all 20 tabs doubles the runtime to
// re-test the same shell. These cover every layout pattern in the app.
const STATS_TABS = ['Map', 'Learning Path', 'Dashboard', 'Quiz', 'Journal', 'Practice'];
const ML_TABS = ['Model Map', 'Python', 'Lab', 'Sources', 'Gold'];

let server;
async function serve() {
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    stdio: 'ignore', detached: false,
  });
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return;
    } catch { /* not up yet */ }
    await sleep(500);
  }
  throw new Error('preview server did not start');
}

const violations = new Map();
function record(label, result) {
  for (const v of result.violations) {
    const prev = violations.get(v.id) || { id: v.id, impact: v.impact, help: v.help, nodes: 0, pages: new Set(), sample: '' };
    prev.nodes += v.nodes.length;
    prev.pages.add(label);
    if (!prev.sample) prev.sample = v.nodes[0]?.target?.join(' ') ?? '';
    violations.set(v.id, prev);
  }
}

async function main() {
  await serve();
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  // Set the theme the way the app itself persists it, then load. Poking
  // [data-theme] directly would switch the CSS but leave the store — and so
  // every JS-driven colour, like the chapter swatches — on the other theme,
  // auditing a state no real user can reach.
  const theme = process.env.A11Y_THEME || 'dark';
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate((t) => localStorage.setItem('fi_theme_v1', JSON.stringify(t)), theme);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const scan = async (label) => record(label, await new AxeBuilder({ page }).withTags(TAGS).analyze());

  for (const tab of STATS_TABS) {
    await page.locator(`.icon-rail-btn[aria-label="${tab}"]`).click();
    await page.waitForTimeout(320);
    await scan(`Stats/${tab}`);
  }

  await page.getByRole('tab', { name: 'ML' }).click();
  await page.waitForTimeout(450);
  // First visit shows a modal that would otherwise be the only thing audited.
  if (await page.locator('.entry-banner-dismiss').count()) {
    await page.locator('.entry-banner-dismiss').click();
    await page.waitForTimeout(250);
  }
  for (const tab of ML_TABS) {
    await page.locator(`.icon-rail-btn[aria-label="${tab}"]`).click();
    await page.waitForTimeout(400);
    await scan(`ML/${tab}`);
  }

  await browser.close();

  const found = [...violations.values()].sort((a, b) => b.nodes - a.nodes);
  const pages = STATS_TABS.length + ML_TABS.length;
  if (found.length === 0) {
    console.log(`\x1b[32m✓ No WCAG A/AA violations across ${pages} pages (${theme} theme).\x1b[0m`);
    return 0;
  }
  console.log(`\x1b[31m✗ ${found.length} violation type(s) in the ${theme} theme:\x1b[0m\n`);
  for (const v of found) {
    console.log(`  [${v.impact}] ${v.id} — ${v.nodes} element(s) on ${[...v.pages].join(', ')}`);
    console.log(`      ${v.help}`);
    console.log(`      e.g. ${v.sample.slice(0, 90)}\n`);
  }
  return 1;
}

let code = 1;
try {
  code = await main();
} catch (err) {
  console.error('\x1b[31maudit failed to run:\x1b[0m', err.message);
} finally {
  server?.kill();
}
process.exit(code);
