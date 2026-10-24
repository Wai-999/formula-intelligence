// Phase 0 baseline browser harness (docs/audits/BASELINE_AUDIT.md). Read-only:
// navigates, measures, screenshots. Serve a build first:  npx vite preview --port 4322 --host 127.0.0.1
// then: node scripts/audit/baseline-harness.mjs [outDir] [baseURL]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [outDir = 'docs/audits/evidence', BASE = 'http://127.0.0.1:4322/formula-intelligence/'] = process.argv.slice(2);
mkdirSync(join(outDir, 'shots'), { recursive: true });

const STATS = ['map', 'path', 'story', 'flashcards', 'quiz', 'dashboard', 'practice', 'errors', 'journal'];
const ML = ['pipeline', 'modelmap', 'playground', 'evaluation', 'gold', 'macro', 'micro', 'politics', 'python', 'pylab', 'sources'];
const WIDTHS = [320, 375, 430, 768, 1280, 1440];
const SHOT_WIDTHS = new Set([375, 1280]);

const browser = await chromium.launch();
const results = { overflow: [], crashes: [], consoleErrors: [], legacy: [], corrupt: [], timing: [], burmese: [] };

async function freshPage(width, theme = 'dark') {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate((t) => {
    localStorage.setItem('fi_theme_v1', JSON.stringify(t));
    localStorage.setItem('ml_entry_banner_seen_v1', JSON.stringify(true));
  }, theme);
  return { ctx, page, errors };
}

async function measure(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const visiblePanes = [...document.querySelectorAll('.app-tab-keepalive')].filter((p) => getComputedStyle(p).display !== 'none');
    // Find the widest element poking past the viewport, to name the culprit.
    let worst = null;
    if (doc.scrollWidth > window.innerWidth + 1) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.right > window.innerWidth + 1 && r.width > 0) {
          if (!worst || r.right > worst.right) worst = { right: Math.round(r.right), cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 60), tag: el.tagName };
        }
      }
    }
    return {
      scrollWidth: doc.scrollWidth, innerWidth: window.innerWidth,
      overflowX: doc.scrollWidth > window.innerWidth + 1,
      worst,
      visiblePanes: visiblePanes.length,
      visibleTextLen: visiblePanes.reduce((n, p) => n + (p.innerText || '').trim().length, 0),
      crashCards: document.querySelectorAll('.errb-card').length,
      hasLangToggle: !!document.querySelector('[class*="lang"] button, button[aria-label*="Burmese" i], button[lang="my"]'),
      myanmarChars: (document.body.innerText.match(/[\u1000-\u109F]/g) || []).length,
    };
  });
}

// 1. Every surface at every width: overflow, crash cards, console errors.
for (const width of WIDTHS) {
  const { ctx, page, errors } = await freshPage(width);
  for (const [mode, tabs] of [['stats', STATS], ['ml', ML]]) {
    for (const tab of tabs) {
      errors.length = 0;
      await page.goto(`${BASE}#${mode}/${tab}`, { waitUntil: 'domcontentloaded' });
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const m = await measure(page);
      const id = `${mode}/${tab}@${width}`;
      if (m.overflowX) results.overflow.push({ id, scrollWidth: m.scrollWidth, innerWidth: m.innerWidth, worst: m.worst });
      if (m.crashCards || m.visiblePanes === 0) results.crashes.push({ id, crashCards: m.crashCards, visiblePanes: m.visiblePanes });
      if (errors.length) results.consoleErrors.push({ id, errors: [...errors].slice(0, 3) });
      if (SHOT_WIDTHS.has(width)) await page.screenshot({ path: join(outDir, 'shots', `${mode}-${tab}-${width}.png`) });
    }
  }
  await ctx.close();
}

// 2. Burmese visibility: switch ML language to 'my' via the persisted pref and count Myanmar glyphs.
{
  const { ctx, page } = await freshPage(1280);
  await page.evaluate(() => localStorage.setItem('ml_mode_prefs_v1', JSON.stringify({ level: 'beginner', lang: 'my' })));
  for (const tab of ['pipeline', 'modelmap', 'gold']) {
    await page.goto(`${BASE}#ml/${tab}`); await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    const m = await measure(page);
    results.burmese.push({ tab, myanmarChars: m.myanmarChars });
  }
  await page.screenshot({ path: join(outDir, 'shots', 'burmese-ml-gold-1280.png') });
  await ctx.close();
}

// 3. Legacy / unknown deep links.
for (const hash of ['#ml/bridge', '#ml/gold', '#ml/doesnotexist', '#stats/nope', '#garbage', '#ml', '#stats/map']) {
  const { ctx, page, errors } = await freshPage(1280);
  await page.goto(`${BASE}${hash}`); await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(600);
  const m = await measure(page);
  const title = await page.evaluate(() => (document.querySelector('.ml-main-title')?.textContent ?? null));
  results.legacy.push({ hash, finalHash: await page.evaluate(() => location.hash), visiblePanes: m.visiblePanes, visibleTextLen: m.visibleTextLen, mlTitle: title, crashCards: m.crashCards, consoleErrors: errors.length });
  if (hash === '#ml/bridge') await page.screenshot({ path: join(outDir, 'shots', 'legacy-ml-bridge-1280.png') });
  await ctx.close();
}

// 4. Corrupt / wrong-shape / future-version persisted state, one key at a time.
const KEYS = ['bluman_sr_v1', 'bluman_quiz_v1', 'bluman_sessions_v1', 'bluman_lp_v1', 'bluman_sw_v1', 'bluman_errlog_v1', 'bluman_journal_v1', 'ml_mode_prefs_v1', 'ml_understanding_v1', 'py_lab_v1', 'fi_theme_v1'];
const BAD = { truncatedJSON: '{"a":', wrongType: '"a string"', nullValue: 'null', futureVersion: JSON.stringify({ schemaVersion: 99, data: { unexpected: true } }) };
for (const key of KEYS) {
  for (const [kind, raw] of Object.entries(BAD)) {
    const { ctx, page, errors } = await freshPage(1280);
    await page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, raw]);
    // Visit a page likely to read the key, plus the landing map.
    const target = key.startsWith('ml_') || key.startsWith('py_') ? '#ml/pipeline' : '#stats/dashboard';
    await page.goto(`${BASE}${target}`); await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(400);
    const m = await measure(page);
    const survived = await page.evaluate((k) => localStorage.getItem(k), key);
    results.corrupt.push({ key, kind, target, crashCards: m.crashCards, visiblePanes: m.visiblePanes, consoleErrors: errors.length, firstError: errors[0]?.slice(0, 140) ?? null, storedValueAfter: survived === raw ? 'unchanged' : 'overwritten' });
    await ctx.close();
  }
}

// 5. Lab timing, landing page (local preview, no throttling — NOT field data).
for (let i = 0; i < 3; i++) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const t = await page.evaluate(() => new Promise((resolve) => {
    let lcp = null; let cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      resolve({ lcpMs: lcp && Math.round(lcp), cls: +cls.toFixed(4), domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd), loadMs: Math.round(nav.loadEventEnd), transferKB: Math.round(performance.getEntriesByType('resource').reduce((n, r) => n + (r.transferSize || 0), 0) / 1024) });
    }, 300);
  }));
  results.timing.push({ run: i + 1, ...t });
  await ctx.close();
}

await browser.close();
writeFileSync(join(outDir, 'harness-results.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify({
  overflowCount: results.overflow.length, crashCount: results.crashes.length, consoleErrorPages: results.consoleErrors.length,
  burmese: results.burmese, legacy: results.legacy, timing: results.timing,
  corruptProblems: results.corrupt.filter((c) => c.crashCards || c.visiblePanes === 0 || c.consoleErrors),
}, null, 1));
