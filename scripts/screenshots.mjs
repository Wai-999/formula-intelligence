#!/usr/bin/env node
// Screenshots of the built app at three breakpoints, dark and light (§14:
// "screenshots at multiple breakpoints"). Run after `npm run build`:
//   npm run evidence:screenshots
// Writes docs/audits/evidence/screenshots/v31/<page>-<width>-<theme>.jpg and
// an index.json listing what was captured. Pages are opened as a returning
// learner (two lessons opened) so Home and Mixed practice show real state.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { hashFor } from '../src/app/pages.js';
import { startPreview } from './lib/preview.mjs';

const OUT = 'docs/audits/evidence/screenshots/v31';
const WIDTHS = [{ w: 320, h: 720 }, { w: 768, h: 1024 }, { w: 1280, h: 800 }];
const SHOTS = [
  ['home', hashFor('home')],
  ['courses', hashFor('learn/courses')],
  ['lesson-a1-slope', hashFor('learn/lesson', { lessonId: 'a1-slope' })],
  ['lesson-la-matrix-transform', hashFor('learn/lesson', { lessonId: 'la-matrix-transform' })],
  ['concept-map', hashFor('maps/concepts')],
  ['formula-map', hashFor('maps/formulas')],
  ['mixed-practice', hashFor('practice/mixed')],
  ['code-exercises', hashFor('practice/code')],
  ['diagnostic', hashFor('progress/diagnostic')],
  ['settings', hashFor('settings')],
];

const { base, stop } = await startPreview(process.env.SHOT_PORT || 4325);
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
writeFileSync(join(OUT, 'index.json'), `${JSON.stringify({ captured: new Date().toISOString(), browser: 'Chromium (Playwright)', shots: index }, null, 2)}\n`);
console.log(`${index.length} screenshots in ${OUT}`);
