import { test, expect } from '@playwright/test';
import { expectNoCrash } from './helpers.js';
import { PAGES, hashFor } from '../src/app/pages.js';
import { auditInstances } from '../src/data/curriculum/index.js';

// Master Prompt V3.1 §4: English-only visible UI, with beginner/researcher
// depth preserved independently of language. The learner below saved
// Burmese + Researcher before the change — the worst case for both rules.
const MYANMAR = /[\u1000-\u109F\uAA60-\uAA7F]/g;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ml_entry_banner_seen_v1', 'true');
    localStorage.setItem('ml_mode_prefs_v1', JSON.stringify({ level: 'researcher', lang: 'my' }));
  });
});

const surfaces = [
  ...PAGES.filter((p) => !p.hidden).map((p) => hashFor(p.id).slice(1)),
  ...auditInstances().map((i) => hashFor(i.page, i.params).slice(1)),
];

for (const route of surfaces) {
  test(`no Myanmar script renders on #${route}`, async ({ page }) => {
    await page.goto(`./#${route}`, { waitUntil: 'networkidle' });
    await expectNoCrash(page);
    const text = await page.evaluate(() => document.body.innerText);
    expect(text.match(MYANMAR) ?? []).toEqual([]);
  });
}

test('there is no language switch, and saved depth survives the change', async ({ page }) => {
  await page.goto('./#learn/ml', { waitUntil: 'networkidle' });
  await expect(page.getByRole('tablist', { name: 'Language' })).toHaveCount(0);
  // Since V4 the depth is a setting (Settings → Learning), not a header switch.
  await page.goto('./#progress/settings', { waitUntil: 'networkidle' });
  await expect(page.getByRole('group', { name: 'Explanation depth' }).getByRole('radio', { name: 'Researcher' })).toBeChecked();
});
