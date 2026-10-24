#!/usr/bin/env node
// Lab performance timings for representative pages (§13). LAB ONLY: one
// machine, emulated throttling, headless Chromium. These are NOT field Core
// Web Vitals and must never be reported as such (docs/PERFORMANCE_REPORT.md).
//
//   npm run build && npm run evidence:perf
//
// Each page is loaded cold (fresh browser context: empty HTTP cache, no
// service worker) and then warm (reload in the same context, so the
// service worker and HTTP cache are in play), RUNS times each, under
// 4× CPU slowdown and a "slow 4G"-like network (150 ms RTT, 1.6 Mbit/s
// down, 750 kbit/s up). Reports the median. Writes
// docs/audits/evidence/perf-lab.json.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { hashFor } from '../src/app/pages.js';
import { startPreview } from './lib/preview.mjs';

const RUNS = Number(process.env.RUNS || 3);
const NETWORK = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };
const CPU = 4;
const PAGES = [
  ['Home (new learner)', hashFor('home')],
  ['Courses', hashFor('learn/courses')],
  ['Lesson: Slope as rate of change', hashFor('learn/lesson', { lessonId: 'a1-slope' })],
  ['Formula map', hashFor('maps/formulas')],
  ['Code exercises (Python not started)', hashFor('practice/code')],
];

// Installed before any page script: collects paint, LCP, layout shifts and
// long tasks from the very start of the load.
function observe() {
  const m = { lcp: 0, cls: 0, longTasks: [] };
  window.__perf = m;
  new PerformanceObserver((l) => { for (const e of l.getEntries()) m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) m.longTasks.push([e.startTime, e.duration]); }).observe({ type: 'longtask', buffered: true });
}

async function measure(page, url, reload) {
  if (reload) await page.reload({ waitUntil: 'load' });
  else await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(2500); // let LCP settle and late long tasks land
  return page.evaluate(() => {
    const m = window.__perf;
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
    const nav = performance.getEntriesByType('navigation')[0];
    // Total blocking time, lab-style: the part of each long task past 50 ms,
    // between first paint and the end of the observation window.
    const tbt = m.longTasks.filter(([s]) => fcp != null && s >= fcp).reduce((t, [, d]) => t + Math.max(0, d - 50), 0);
    const bytes = performance.getEntriesByType('resource').reduce((t, r) => t + (r.transferSize || 0), nav?.transferSize || 0);
    // Every long task, including any before first paint, so a 0 TBT cannot
    // hide work that happened earlier.
    const longestTask = m.longTasks.reduce((t, [, d]) => Math.max(t, d), 0);
    return { fcp, lcp: m.lcp || null, cls: m.cls, tbt, longTasks: m.longTasks.length, longestTask, load: nav ? nav.loadEventEnd : null, transferKB: bytes / 1024 };
  });
}

const median = (xs) => {
  const v = xs.filter((x) => x != null).sort((a, b) => a - b);
  return v.length ? v[Math.floor(v.length / 2)] : null;
};
const summarize = (runs) => Object.fromEntries(Object.keys(runs[0]).map((k) => [k, Number((median(runs.map((r) => r[k])) ?? NaN).toFixed(k === 'cls' ? 3 : 0))]));

const { base, stop } = await startPreview(process.env.PERF_PORT || 4326);
const browser = await chromium.launch();
const results = [];
try {
  for (const [label, hash] of PAGES) {
    const cold = [];
    const warm = [];
    for (let i = 0; i < RUNS; i += 1) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
      await context.addInitScript(observe);
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', NETWORK);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
      cold.push(await measure(page, `${base}${hash}`, false));
      warm.push(await measure(page, `${base}${hash}`, true));
      await context.close();
    }
    results.push({ page: label, hash, cold: summarize(cold), warm: summarize(warm) });
    console.log(label, JSON.stringify(results.at(-1).cold), JSON.stringify(results.at(-1).warm));
  }
} finally {
  await browser.close();
  stop();
}

writeFileSync('docs/audits/evidence/perf-lab.json', `${JSON.stringify({
  measured: new Date().toISOString(),
  kind: 'LAB ONLY — not field Core Web Vitals',
  browser: `Chromium ${browser.version()} (Playwright, headless)`,
  device: `${process.platform} ${process.arch}, ${CPU}× CPU slowdown`,
  network: '150 ms RTT, 1.6 Mbit/s down, 750 kbit/s up (CDP emulation)',
  viewport: '1280×800',
  runs: RUNS,
  statistic: 'median',
  units: { fcp: 'ms', lcp: 'ms', tbt: 'ms (long-task time past 50 ms, after first paint)', longTasks: 'count over the whole load', longestTask: 'ms', load: 'ms', cls: 'unitless', transferKB: 'KB transferred' },
  results,
}, null, 2)}\n`);
