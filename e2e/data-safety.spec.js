import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { VISIBLE, expectNoCrash } from './helpers.js';

// Acceptance test 2 (docs/audits/TRACEABILITY_MATRIX.md). The 13 cases below
// each crashed a page — two blanked all of ML mode — in the Phase 0 audit
// (docs/audits/BASELINE_AUDIT.md §4).
const CRASHED_AT_BASELINE = [
  ['bluman_sr_v1', 'null', 'stats/dashboard'],
  ['bluman_quiz_v1', 'null', 'stats/dashboard'],
  ['bluman_sessions_v1', '"a string"', 'stats/dashboard'],
  ['bluman_sessions_v1', 'null', 'stats/dashboard'],
  ['bluman_sessions_v1', '{"schemaVersion":99,"data":{}}', 'stats/dashboard'],
  ['bluman_errlog_v1', '"a string"', 'stats/errors'],
  ['bluman_errlog_v1', 'null', 'stats/errors'],
  ['bluman_errlog_v1', '{"schemaVersion":99,"data":{}}', 'stats/errors'],
  ['bluman_journal_v1', '"a string"', 'stats/journal'],
  ['ml_mode_prefs_v1', 'null', 'ml/pipeline'],
  ['ml_understanding_v1', '"a string"', 'ml/pipeline'],
  ['ml_understanding_v1', 'null', 'ml/pipeline'],
  ['ml_understanding_v1', '{"schemaVersion":99,"data":{}}', 'ml/pipeline'],
];

test.describe('malformed saved data', () => {
  for (const [key, raw, route] of CRASHED_AT_BASELINE) {
    test(`${key} = ${raw} no longer breaks #${route}`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('./', { waitUntil: 'domcontentloaded' });
      await page.evaluate(([k, v]) => {
        localStorage.setItem('ml_entry_banner_seen_v1', 'true');
        localStorage.setItem(k, v);
      }, [key, raw]);
      await page.goto(`./#${route}`, { waitUntil: 'domcontentloaded' });
      await page.reload({ waitUntil: 'networkidle' });
      await expectNoCrash(page);
      await expect(page.locator('.app-tab-keepalive:visible')).toHaveCount(1);
      expect(errors).toEqual([]);
      // The original is kept, not destroyed.
      const q = await page.evaluate(() => JSON.parse(localStorage.getItem('fi_quarantine_v1') || '{}'));
      expect(q[key]?.raw).toBe(raw);
    });
  }
});

test('backup: download, wipe, restore from file — identical state', async ({ page }) => {
  await page.goto('./', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('bluman_sr_v1', JSON.stringify({ x_bar: { ef: 2.5, interval: 6, reps: 2, due: 0, rating: 3, reviews: 2 } }));
    localStorage.setItem('bluman_journal_v1', JSON.stringify([{ id: 1, text: 'Σ(x−x̄)² — unicode survives', date: '2026-10-23' }]));
    localStorage.setItem('feynman_x_bar', JSON.stringify({ text: 'mean', score: 0.8 }));
    localStorage.setItem('fi_theme_v1', JSON.stringify('light'));
  });
  await page.goto('./#stats/dashboard', { waitUntil: 'domcontentloaded' });
  await page.reload({ waitUntil: 'networkidle' });

  const appState = () => page.evaluate(() => {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (/^(bluman_|ml_|py_|fi_|feynman_)/.test(k)) out[k] = localStorage.getItem(k);
    }
    return out;
  });
  const before = await appState();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator(VISIBLE + '.backup-panel').getByRole('button', { name: 'Download backup' }).click(),
  ]);
  const file = await download.path();
  expect(JSON.parse(readFileSync(file, 'utf8')).format).toBe('formula-intelligence-backup');

  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  await page.locator(VISIBLE + '.backup-panel input[type="file"]').setInputFiles(file);
  await expect(page.getByRole('alertdialog')).toContainText('replaces all of your current progress');
  await Promise.all([
    page.waitForEvent('load'),
    page.getByRole('button', { name: 'Replace my progress' }).click(),
  ]);
  await page.waitForLoadState('networkidle');
  const after = await appState();
  // Restored keys are byte-identical. (Opening the app may add bookkeeping
  // keys such as the visit counter, so compare what the backup held.)
  for (const [k, v] of Object.entries(before)) expect(after[k], k).toBe(v);
});

test('backup: a non-backup file is refused without touching progress', async ({ page }) => {
  await page.goto('./#stats/dashboard', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('bluman_journal_v1', '[{"id":1,"text":"keep me"}]'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator(VISIBLE + '.backup-panel input[type="file"]').setInputFiles({
    name: 'notes.json', mimeType: 'application/json', buffer: Buffer.from('{"hello":"world"}'),
  });
  await expect(page.getByRole('alert')).toContainText('not a Formula Intelligence backup');
  expect(await page.evaluate(() => localStorage.getItem('bluman_journal_v1'))).toBe('[{"id":1,"text":"keep me"}]');
});
