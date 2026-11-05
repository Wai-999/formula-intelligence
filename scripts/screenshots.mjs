#!/usr/bin/env node
// Screenshots of the built app at three breakpoints, dark and light (§14:
// "screenshots at multiple breakpoints"). Run after `npm run build`:
//   npm run evidence:screenshots
// Writes <SHOT_DIR>/<page>-<width>-<theme>.jpg and an index.json listing
// what was captured. Pages are opened as a returning learner (two lessons
// opened) so Home and Mixed practice show real state.
//
// V5 options (environment):
//   SHOT_BASE    capture a deployed site instead of the local build, e.g.
//                https://wai-999.github.io/formula-intelligence/ for the
//                "before" evidence (read-only page visits)
//   SHOT_SET     'v5' adds the V5 pages (Ohlone prep, new lessons)
//   SHOT_WIDTHS  comma-separated widths, e.g. 375,1280 (default 320,768,1280)
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { hashFor } from '../src/app/pages.js';
import { startPreview } from './lib/preview.mjs';

const OUT = process.env.SHOT_DIR || 'docs/audits/evidence/screenshots/v4';
const HEIGHT = { 320: 720, 375: 812, 768: 1024, 1280: 800 };
const WIDTHS = (process.env.SHOT_WIDTHS || '320,768,1280').split(',').map(Number).map((w) => ({ w, h: HEIGHT[w] ?? 900 }));
const SHOTS = [
  ['home', hashFor('home')],
  ['courses', hashFor('learn/courses')],
  ['lesson-a1-break-even', hashFor('learn/lesson', { lessonId: 'a1-break-even' })],
  ['lesson-c1-marginal-cost', hashFor('learn/lesson', { lessonId: 'c1-marginal-cost' })],
  ['lesson-la-matrix-scores', hashFor('learn/lesson', { lessonId: 'la-matrix-scores' })],
  ['maps', hashFor('learn/maps')],
  ['review', hashFor('practice/review')],
  ['projects', hashFor('apply/projects')],
  ['placement', hashFor('learn/placement')],
  ['progress', hashFor('progress/overview')],
  ['python-lab', hashFor('apply/lab')],
];
if (process.env.SHOT_SET === 'v5') {
  SHOTS.push(
    ['ohlone-prep', hashFor('learn/prep')],
    ['lesson-a2-composition', hashFor('learn/lesson', { lessonId: 'a2-composition' })],
    ['lesson-pc-limits', hashFor('learn/lesson', { lessonId: 'pc-limits' })],
    ['lesson-c1-chain-rule', hashFor('learn/lesson', { lessonId: 'c1-chain-rule' })],
    ['lesson-pc-unit-circle', hashFor('learn/lesson', { lessonId: 'pc-unit-circle' })],
    ['lesson-cpp-loops-trace', hashFor('learn/lesson', { lessonId: 'cpp-loops-trace' })],
    ['lesson-dm-logic', hashFor('learn/lesson', { lessonId: 'dm-logic' })],
  );
}

const { base, stop } = process.env.SHOT_BASE
  ? { base: process.env.SHOT_BASE, stop: () => {} }
  : await startPreview(process.env.SHOT_PORT || 4325);
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const index = [];
try {
  for (const theme of ['dark', 'light']) {
    for (const { w, h } of WIDTHS) {
      // Light at every width would double the folder for little new
      // information; one desktop and one phone width show the palette.
      if (theme === 'light' && w === 768) continue;
      const context = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
      await context.addInitScript((t) => {
        if (sessionStorage.getItem('seeded')) return;
        sessionStorage.setItem('seeded', '1');
        localStorage.setItem('fi_theme_v1', JSON.stringify(t));
        localStorage.setItem('ml_entry_banner_seen_v1', 'true');
      }, theme);
      const page = await context.newPage();
      await page.goto(`${base}${hashFor('learn/lesson', { lessonId: 'a1-slope' })}`, { waitUntil: 'networkidle' });
      await page.goto(`${base}${hashFor('learn/lesson', { lessonId: 'la-dot-product' })}`, { waitUntil: 'networkidle' });
      for (const [name, hash] of SHOTS) {
        await page.goto(`${base}${hash}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(700);
        const file = `${name}-${w}-${theme}.jpg`;
        await page.screenshot({ path: join(OUT, file), type: 'jpeg', quality: 70 });
        index.push({ file, page: hash, width: w, height: h, theme });
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
  stop();
}
writeFileSync(join(OUT, 'index.json'), `${JSON.stringify({ captured: new Date().toISOString(), site: base, browser: 'Chromium (Playwright)', shots: index }, null, 2)}\n`);
console.log(`${index.length} screenshots in ${OUT}`);
