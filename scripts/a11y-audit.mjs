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
import { PAGES, hashFor } from '../src/app/pages.js';
import { ML_LESSONS } from '../src/data/ml/lessons.js';
import { auditInstances } from '../src/data/curriculum/index.js';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = process.env.A11Y_PORT || 4319;
const BASE = `http://127.0.0.1:${PORT}/formula-intelligence/`;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Every surface, read from the app's own registries: every listed page of
// the information architecture (src/app/pages.js), every parameterised page
// the curriculum declares worth auditing (one per course, every authored
// lesson), and the embedded ML lessons. The hand-written lists this replaced
// once covered 11 of 20 surfaces (docs/audits/BASELINE_AUDIT.md F-06).
const SURFACES = [
  ...PAGES.filter((p) => !p.hidden).map((p) => ({ label: p.id, hash: hashFor(p.id) })),
  ...auditInstances().map((i) => ({ label: `${i.page}/${Object.values(i.params)[0]}`, hash: hashFor(i.page, i.params) })),
];

let server;
async function serve() {
  // --host 127.0.0.1 is explicit on purpose. Vite defaults to `localhost`,
  // which on some hosts (GitHub runners among them) resolves to ::1 — so a
  // server listening on IPv6 is invisible to a poll of 127.0.0.1: the
  // request never connects and the wait times out while the server is
  // running perfectly. Binding and polling the same literal address removes
  // the ambiguity entirely.
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  // Keep the child's output. The first version discarded it and failed with
  // a bare "preview server did not start" — the least useful sentence
  // available, since it cannot tell a slow start from a crashed process, an
  // occupied port or a missing build.
  const log = [];
  const capture = (buf) => {
    log.push(buf.toString());
    if (log.length > 40) log.shift();
  };
  server.stdout.on('data', capture);
  server.stderr.on('data', capture);

  let exited = null;
  server.on('exit', (code, signal) => { exited = { code, signal }; });

  // 60s rather than 20: a cold CI runner is slower than a warm laptop, and a
  // false timeout here fails the whole deploy.
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (exited) {
      throw new Error(
        `preview server exited early (code ${exited.code}, signal ${exited.signal})\n`
        + `--- server output ---\n${log.join('')}`
      );
    }
    try {
      const r = await fetch(BASE);
      if (r.ok) return;
    } catch { /* not listening yet */ }
    await sleep(500);
  }
  throw new Error(
    `preview server did not answer ${BASE} within 60s\n`
    + `--- server output ---\n${log.join('') || '(no output captured)'}`
  );
}

const violations = new Map();
function record(label, result) {
  for (const v of result.violations) {
    const prev = violations.get(v.id) || { id: v.id, impact: v.impact, help: v.help, nodes: 0, pages: new Set(), samples: [] };
    prev.nodes += v.nodes.length;
    prev.pages.add(label);
    // Keep a few complete examples — target, markup and axe's own summary —
    // so a failure that only happens on another machine (CI fonts differ
    // from a laptop's) can be diagnosed from the log alone.
    for (const n of v.nodes) {
      if (prev.samples.length >= 3) break;
      prev.samples.push({ page: label, target: n.target.join(' '), html: n.html, summary: n.failureSummary });
    }
    violations.set(v.id, prev);
  }
}

async function main() {
  await serve();
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  // A11Y_FONT='DejaVu Sans' (or Arial) approximates the CI runner, which has
  // no Inter: wider text wraps differently, and target-size failures that a
  // laptop never shows appear there first.
  if (process.env.A11Y_FONT) {
    await context.addInitScript((f) => {
      document.addEventListener('DOMContentLoaded', () => {
        const st = document.createElement('style');
        st.textContent = `:root { --font-sans: ${f} !important } body, button, input, textarea, select { font-family: ${f} !important }`;
        document.head.appendChild(st);
      });
    }, process.env.A11Y_FONT);
  }
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

  const open = async (hash) => {
    await page.evaluate((h) => { window.location.hash = h; }, hash);
    await page.locator('.app-tab-keepalive:visible').first().waitFor();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(450);
    // First visit to an ML page shows a one-time explainer that would
    // otherwise be the only thing audited.
    if (await page.locator('.entry-banner-dismiss').count()) {
      await page.locator('.entry-banner-dismiss').click();
      await page.waitForTimeout(250);
    }
  };

  for (const s of SURFACES) {
    await open(s.hash);
    await scan(s.label);
  }

  // Embedded lessons (src/data/ml/lessons.js) render only when opened, so a
  // scan of their host page alone would never see them.
  for (const lesson of ML_LESSONS) {
    await open(hashFor('learn/ml'));
    const toggle = page.locator('.app-tab-keepalive:visible .ml-lesson-toggle', { hasText: lesson.title });
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
    await page.locator('.app-tab-keepalive:visible .ml-lesson-body').first().waitFor();
    await page.waitForTimeout(600);
    await scan(`learn/ml#lesson:${lesson.id}`);
  }

  // Phone layout: the bottom bar only exists below 768 px. (V4 removed the
  // More sheet: all five destinations fit in the bar.)
  await page.setViewportSize({ width: 375, height: 760 });
  await open(hashFor('home'));
  await scan('phone/home');
  await open(hashFor('learn/lesson', { lessonId: 'a1-break-even' }));
  await scan('phone/lesson');

  await browser.close();

  const found = [...violations.values()].sort((a, b) => b.nodes - a.nodes);
  const pages = SURFACES.length + ML_LESSONS.length + 2;
  if (found.length === 0) {
    console.log(`\x1b[32m✓ No WCAG A/AA violations across ${pages} pages (${theme} theme).\x1b[0m`);
    return 0;
  }
  console.log(`\x1b[31m✗ ${found.length} violation type(s) in the ${theme} theme:\x1b[0m\n`);
  for (const v of found) {
    console.log(`  [${v.impact}] ${v.id} — ${v.nodes} element(s) on ${[...v.pages].join(', ')}`);
    console.log(`      ${v.help}`);
    for (const x of v.samples) {
      console.log(`      on ${x.page}: ${x.target}`);
      console.log(`        ${x.html.slice(0, 240)}`);
      console.log(`        ${(x.summary || '').replace(/\s+/g, ' ').slice(0, 300)}`);
    }
    console.log();
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
