import { test, expect } from '@playwright/test';
import { expectNoCrash } from './helpers.js';
import { TABS } from '../src/store/useUIStore.js';
import { ML_TABS } from '../src/store/useMLUIStore.js';

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
  ...TABS.map((t) => `stats/${t.id}`),
  ...ML_TABS.map((t) => `ml/${t.id}`),
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
  await page.goto('./#ml/pipeline', { waitUntil: 'networkidle' });
  await expect(page.getByRole('tablist', { name: 'Language' })).toHaveCount(0);
  await expect(page.getByRole('tab', { name: 'Researcher' }).first()).toHaveAttribute('aria-selected', 'true');
});
