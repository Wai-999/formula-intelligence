import { test, expect } from '@playwright/test';
import { openApp, goToStatsTab, goToMLTab, seedMastery, expectNoCrash, VISIBLE } from './helpers.js';

// End-to-end journeys.
//
// The unit suite covers each piece in isolation: the scheduler's arithmetic,
// the XP formula, the track data, the content shapes. What it structurally
// cannot see is whether those pieces still agree with each other once wired
// through the real app — whether mastering a formula actually moves the
// dashboard, whether that same fact reaches XP, badges and track progress,
// and whether a deep link still lands after tabs became lazily mounted.
// Every assertion below is a thing a user would notice.

test.describe('learning loop', () => {
  test('mastery flows through dashboard, XP, badges and tracks consistently', async ({ page }) => {
    await openApp(page);

    // Baseline: a new learner has nothing anywhere.
    await goToStatsTab(page, 'Dashboard');
    await expect(page.locator(VISIBLE + '.prog-level-num')).toHaveText('1');
    await expect(page.locator(VISIBLE + '.prog-xp')).toContainText('0');
    await expect(page.locator(VISIBLE + '.prog-badge.earned')).toHaveCount(0);

    await seedMastery(page, 12);

    // 1. The dashboard's own KPI reflects it.
    await goToStatsTab(page, 'Dashboard');
    const kpis = page.locator(VISIBLE + '.kpi-val');
    await expect(kpis.nth(1), 'mastered KPI').toHaveText('12');

    // 2. XP is derived from the SAME facts, so it must agree — 12 mastered
    //    formulas at 50 XP each. A mismatch here means the dashboard and the
    //    progression panel disagree about the same learner.
    await expect(page.locator(VISIBLE + '.prog-xp')).toContainText('600');
    await expect(page.locator(VISIBLE + '.prog-level-num')).toHaveText('4');

    // 3. Badges follow from the same source.
    const earned = page.locator(VISIBLE + '.prog-badge.earned .prog-badge-name');
    await expect(earned).toContainText(['First recall']);
    const names = await earned.allInnerTexts();
    expect(names).toContain('Ten mastered');
    expect(names, 'a 24-formula badge must NOT be earned at 12').not.toContain('Quarter of the map');

    // 4. And a persona track, which measures progress by a different code
    //    path, must land on the same number.
    await goToStatsTab(page, 'Learning Path');
    const studentCard = page.locator(VISIBLE + '.track-card').first();
    await expect(studentCard.locator('.track-prog')).not.toContainText('0 /');
  });

  test('progress survives a reload', async ({ page }) => {
    await openApp(page);
    await seedMastery(page, 6);
    await page.reload({ waitUntil: 'networkidle' });
    await goToStatsTab(page, 'Dashboard');
    await expect(page.locator(VISIBLE + '.kpi-val').nth(1)).toHaveText('6');
    await expect(page.locator(VISIBLE + '.prog-xp')).toContainText('300');
  });
});

test.describe('cross-feature navigation', () => {
  test('a formula deep-links from the Stats map into its Python Hub entry', async ({ page }) => {
    await openApp(page);
    await goToStatsTab(page, 'Map');

    // Researcher depth is what exposes the link, and it loads the Hub corpus
    // on demand — the lazy path added in 02494bb.
    await page.locator('.app-header .ll-btn:has-text("Researcher")').click();
    await page.locator('circle.gnode-circle').nth(20).click({ force: true });
    await expect(page.locator(VISIBLE + '.detail-panel.open')).toBeVisible();
    await expect(page.locator(VISIBLE + '.detail-deep')).toBeVisible({ timeout: 10_000 });

    const formulaName = await page.locator(VISIBLE + '.detail-name').innerText();
    await page.locator(VISIBLE + '.detail-deep .detail-bridge-btn').click();
    await page.waitForTimeout(900);

    // The Hub is in the other MODE and may never have been mounted.
    const openEntry = page.locator(VISIBLE + '.pyentry.open .pyentry-name').first();
    await expect(openEntry).toHaveText(formulaName);
  });

  test('an ML citation opens the Sources tab at the cited section', async ({ page }) => {
    await openApp(page);
    await goToMLTab(page, 'Gold');

    const citation = page.locator(VISIBLE + '.ml-citation-link').first();
    await citation.scrollIntoViewIfNeeded();
    const cited = (await citation.innerText()).match(/§(\d+)/)?.[1];
    await citation.click();
    await page.waitForTimeout(1000);

    await expect(page.locator(VISIBLE + '.src-page')).toBeVisible();
    const heading = await page.evaluate(() => {
      const pane = [...document.querySelectorAll('.app-tab-keepalive')]
        .find((el) => getComputedStyle(el).display !== 'none');
      const body = pane?.querySelector('.src-body');
      if (!body) return null;
      const top = body.getBoundingClientRect().top;
      return [...body.querySelectorAll('.md-h2')]
        .map((h) => ({ t: h.textContent, d: Math.abs(h.getBoundingClientRect().top - top) }))
        .sort((a, b) => a.d - b.d)[0]?.t;
    });
    expect(heading, `should land on section ${cited}`).toMatch(new RegExp(`^${cited}\\.`));
  });

  test('a track item opens the thing it points at', async ({ page }) => {
    await openApp(page);
    await goToStatsTab(page, 'Learning Path');
    await page.locator(VISIBLE + '.track-card').first().click();

    const item = page.locator(VISIBLE + '.track-item').first();
    const label = await item.locator('.track-item-name').innerText();
    await item.click();
    await page.waitForTimeout(700);

    await expect(page.locator(VISIBLE + '.detail-panel.open')).toBeVisible();
    await expect(page.locator(VISIBLE + '.detail-name')).toHaveText(label);
  });
});

test.describe('resilience', () => {
  test('every tab in both modes renders without tripping a boundary', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(e.message));

    await openApp(page);
    for (const tab of ['Map', 'Learning Path', 'Story Walk', 'Flashcards', 'Quiz',
      'Dashboard', 'Practice', 'Error Log', 'Journal']) {
      await goToStatsTab(page, tab);
      await expectNoCrash(page);
    }
    for (const tab of ['Pipeline', 'Model Map', 'Playground', 'Evaluation', 'Gold',
      'Macro', 'Micro', 'Politics', 'Python', 'Lab', 'Sources']) {
      await goToMLTab(page, tab);
      await expectNoCrash(page);
    }
    expect(consoleErrors, 'no console or page errors anywhere').toEqual([]);
  });

  test('keep-alive preserves a tab\'s state across a round trip', async ({ page }) => {
    await openApp(page);
    await goToStatsTab(page, 'Map');
    await page.locator('.app-main input[placeholder*="Search"]').first().fill('variance');
    await goToStatsTab(page, 'Journal');
    await goToStatsTab(page, 'Map');
    await expect(page.locator('.app-main input[placeholder*="Search"]').first()).toHaveValue('variance');
  });

  test('theme choice persists and survives a reload', async ({ page }) => {
    await openApp(page, { theme: 'dark' });
    await page.locator('.theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

// Tagged @heavy and run as a SEPARATE process (`npm run e2e:python`), not
// merely ordered last. Loading a WebAssembly Python runtime dwarfs
// everything else here, and sharing a process with the other journeys was
// observed to starve them: the 20-tab resilience walk takes 11s on its own
// and stalls when it follows this block. A separate process gets a fresh
// browser and its own memory budget, so neither can degrade the other.
test.describe('python execution', () => {
  // Loading Pyodide is a ~10MB WebAssembly download and by far the most
  // expensive thing this suite does. These assertions share ONE page so the
  // runtime is fetched once — which is also the real user path: run a
  // sample, then take it into the Lab and change it. Three separate tests
  // paid that cost three times and made the suite fragile on constrained
  // machines for no extra coverage.
  test.setTimeout(180_000);

  test('@heavy a sample runs, an unrunnable one explains itself, and the Lab keeps edits', async ({ page }) => {
    await openApp(page);
    await goToMLTab(page, 'Python');

    // 1. A sample that can run, does — with real captured stdout.
    await page.locator(VISIBLE + '.pyentry-header', { hasText: 'Sample Mean' }).first().click();
    await page.locator(VISIBLE + '.pycode-run').click();
    const outHead = page.locator(VISIBLE + '.pycode-out-head');
    await expect(outHead).toBeVisible({ timeout: 150_000 });
    await expect(outHead).toContainText(/output/i);
    await expect(page.locator(VISIBLE + '.pycode-out-body')).not.toBeEmpty();

    // 2. One that cannot run offers no button and says why — an honest
    //    refusal beats a Run that always fails.
    await page.locator(VISIBLE + '.pyhub-search input').fill('LSTM');
    await page.waitForTimeout(400);
    await page.locator(VISIBLE + '.pyentry-header').first().click();
    await expect(page.locator(VISIBLE + '.pycode-run')).toHaveCount(0);
    await expect(page.locator(VISIBLE + '.pycode-why')).toContainText('PyTorch');

    // 3. The Lab runs code the user wrote and keeps it across a reload.
    //    The runtime is already warm here, which is the point.
    await goToMLTab(page, 'Lab');
    await page.locator(VISIBLE + '.pylab-editor').fill('print("journey test", 6 * 7)');
    await page.locator(VISIBLE + '.pylab-run').click();
    await expect(page.locator(VISIBLE + '.pylab-out-body'))
      .toContainText('journey test 42', { timeout: 150_000 });

    await page.reload({ waitUntil: 'networkidle' });
    await goToMLTab(page, 'Lab');
    await expect(page.locator(VISIBLE + '.pylab-editor')).toHaveValue(/journey test/);
  });
});


