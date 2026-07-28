import { expect } from '@playwright/test';

// Every tab that has been visited stays mounted (see useVisitedTabs), so a
// bare selector matches hidden panes too. Scoping to the visible pane is
// what makes these assertions mean "on the page the user is looking at".
export const VISIBLE = '.app-tab-keepalive:visible ';

export async function openApp(page, { theme } = {}) {
  await page.goto('./', { waitUntil: 'domcontentloaded' });
  if (theme) {
    await page.evaluate((t) => localStorage.setItem('fi_theme_v1', JSON.stringify(t)), theme);
  }
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
}

export async function goToStatsTab(page, label) {
  await page.locator(`.icon-rail-btn[aria-label="${label}"]`).click();
  await page.waitForTimeout(320);
}

export async function goToMLTab(page, label) {
  // Scoped to the mode switcher: the Pipeline page has its own tablist
  // containing a tab whose name also includes "ML", so a bare role query
  // matches two elements and fails strict mode.
  const mlSwitch = page.locator('.mode-switcher-btn', { hasText: /^ML$/ });
  if (await mlSwitch.getAttribute('aria-selected') !== 'true') {
    await mlSwitch.click();
    await page.waitForTimeout(420);
  }
  // First ML visit shows a modal that intercepts every subsequent click.
  const banner = page.locator('.entry-banner-dismiss');
  if (await banner.count()) {
    await banner.click();
    await page.waitForTimeout(250);
  }
  await page.locator(`.icon-rail-btn[aria-label="${label}"]`).click();
  await page.waitForTimeout(400);
}

/**
 * Seed spaced-repetition mastery for N real formula ids, read from the map's
 * own bound data so the seed can never drift from the content.
 */
export async function seedMastery(page, count) {
  await goToStatsTab(page, 'Map');
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
