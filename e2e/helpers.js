import { expect } from '@playwright/test';
import { pageById, sectionById, sectionHome } from '../src/app/pages.js';

// Recently visited pages stay mounted (useKeepAlive), so a bare selector can
// match hidden panes too. Scoping to the visible pane is what makes these
// assertions mean "on the page the user is looking at".
export const VISIBLE = '.app-tab-keepalive:visible ';

export async function openApp(page, { theme, path = './' } = {}) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((t) => {
    if (t) localStorage.setItem('fi_theme_v1', JSON.stringify(t));
  }, theme);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
}

/**
 * The first visit to an ML page shows a one-time explainer above the page.
 * It no longer blocks anything (it is inline, not a modal), but dismissing it
 * keeps layout-sensitive assertions measuring the page itself.
 */
export async function dismissEntryBanner(page) {
  const banner = page.locator('.entry-banner-dismiss');
  if (await banner.count()) {
    await banner.click();
    await page.waitForTimeout(150);
  }
}

/**
 * Open a page the way a learner does: the section in the primary navigation,
 * then the page in the section's own navigation. Pages outside the primary
 * sections (Settings, Sources) are opened by their address.
 */
export async function openPage(page, pageId) {
  const def = pageById[pageId];
  if (!def) throw new Error(`unknown page ${pageId}`);
  if (!def.section) {
    await page.evaluate((h) => { window.location.hash = h; }, `#${pageId}`);
  } else {
    const primary = page.getByRole('navigation', { name: 'Primary' });
    await primary.getByRole('link', { name: sectionById[def.section].label, exact: true }).click();
    const home = sectionHome(def.section);
    await expect(page.locator('h1.page-title')).toHaveText(pageById[home].title);
    if (home !== pageId) {
      const sub = page.getByRole('navigation', { name: `${sectionById[def.section].label} pages` });
      await sub.getByRole('link', { name: def.title, exact: true }).click();
    }
  }
  await expect(page.locator('h1.page-title')).toHaveText(def.title);
  await page.waitForLoadState('networkidle');
  await dismissEntryBanner(page);
  await page.waitForTimeout(250);
}

/**
 * Seed spaced-repetition mastery for N real formula ids, read from the map's
 * own bound data so the seed can never drift from the content.
 */
export async function seedMastery(page, count) {
  await openPage(page, 'maps/formulas');
  await page.locator('g.gnode').first().waitFor({ state: 'attached' });
  const seeded = await page.evaluate((n) => {
    const ids = [...document.querySelectorAll('g.gnode')]
      .map((g) => g.__data__?.id).filter(Boolean).slice(0, n);
    const sr = {};
    for (const id of ids) {
      sr[id] = { ef: 2.5, interval: 30, reps: 5, due: Date.now() + 3e9, rating: 3, reviews: 6 };
    }
    localStorage.setItem('bluman_sr_v1', JSON.stringify(sr));
    return ids.length;
  }, count);
  expect(seeded, 'should have seeded real formula ids').toBe(count);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  return seeded;
}

/** The app has no error boundary fallback showing anywhere. */
export async function expectNoCrash(page) {
  await expect(page.locator('.errb-card')).toHaveCount(0);
}
