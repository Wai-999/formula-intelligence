import { test, expect } from '@playwright/test';
import { PAGES, hashFor } from '../src/app/pages.js';
import { auditInstances } from '../src/data/curriculum/index.js';
import { expectNoCrash, VISIBLE } from './helpers.js';

// End-to-end checks for the V3.1 learning platform (docs/UPGRADE_PROGRESS.md).

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ml_entry_banner_seen_v1', 'true'));
  // E2E_FONT='DejaVu Sans' approximates CI's Linux runner (no Inter), where
  // wider text can wrap or overflow differently than on a laptop.
  if (process.env.E2E_FONT) {
    await page.addInitScript((f) => {
      document.addEventListener('DOMContentLoaded', () => {
        const st = document.createElement('style');
        st.textContent = `:root { --font-sans: ${f} !important } body, button, input, textarea, select { font-family: ${f} !important }`;
        document.head.appendChild(st);
      });
    }, process.env.E2E_FONT);
  }
});

test.describe('home and first run', () => {
  test('a new learner sees three ways to start, with one primary action', async ({ page }) => {
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'Where would you like to start?' })).toBeVisible();
    await expect(page.locator('a.home-option.primary')).toContainText('Take the diagnostic');
    await expect(page.getByRole('button', { name: /Start from Prealgebra/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Explore first/ })).toBeVisible();
    await expect(page.locator('.home-option.primary')).toHaveCount(1);
  });

  test('“Start from Prealgebra” sets the starting point and opens the course', async ({ page }) => {
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Start from Prealgebra/ }).click();
    await expect(page).toHaveURL(/#learn\/course\/prealgebra$/);
    await expect(page.locator('h1.page-title')).toHaveText('Prealgebra');
    await page.goto('./#home');
    await expect(page.locator('#home-continue')).toHaveText('Next recommended lesson');
    await expect(page.locator('.home-hero-title')).toHaveText('Ratios, rates and unit rates');
  });
});

test.describe('lessons', () => {
  test('acceptance 8: a keyboard-only learner completes a lesson checkpoint at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`./${hashFor('learn/lesson', { lessonId: 'a1-slope' })}`, { waitUntil: 'networkidle' });
    await expect(page.locator('h1.page-title')).toHaveText('Slope as rate of change');
    const checkpoint = page.locator(VISIBLE + '[data-section="checkpoint"]');
    // Item 1: numeric. Focus the field by keyboard: Tab from the section heading.
    await checkpoint.locator('h2').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('inputmode', 'decimal');
    await page.keyboard.type('2');
    await page.keyboard.press('Enter');
    await expect(checkpoint.locator('.item-card').nth(0)).toContainText('Correct');
    // Item 2: choice. Radio buttons are reached by Tab and chosen with arrows/space.
    const second = checkpoint.locator('.item-card').nth(1);
    await second.locator('input[type="radio"]').first().focus();
    await page.keyboard.press('Space');
    await second.getByRole('button', { name: 'Check' }).focus();
    await page.keyboard.press('Enter');
    await expect(second).toContainText('Correct');
    // Item 3: numeric.
    const third = checkpoint.locator('.item-card').nth(2);
    await third.locator('input').focus();
    await page.keyboard.type('14');
    await page.keyboard.press('Enter');
    await expect(checkpoint.getByText('3 of 3 correct on the first try.')).toBeVisible();
    // One sitting is evidence, not mastery — and a review is scheduled.
    await expect(checkpoint).toContainText('one sitting is not mastery');
    await expect(checkpoint).toContainText('Next review of');
    const status = page.locator(VISIBLE + '.lesson-comp').first();
    await expect(status).not.toContainText('Mastered');
    // No horizontal scrolling at 320 px.
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });

  test('a lesson’s lab works without the picture: the numbers view and live readout', async ({ page }) => {
    await page.goto(`./${hashFor('learn/lesson', { lessonId: 'la-dot-product' })}`, { waitUntil: 'networkidle' });
    const lab = page.locator(VISIBLE + '.lab').first();
    await expect(lab.locator('.lab-readout')).toContainText('u·v = 4·3 + 1·2 = 14');
    await lab.getByRole('button', { name: 'Show as numbers' }).click();
    await expect(lab.locator('table')).toContainText('u·v');
    await lab.getByRole('slider', { name: /v₁/ }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(lab.locator('.lab-readout')).toContainText('u·v = 4·3.5');
    await lab.getByRole('button', { name: 'Reset' }).click();
    await expect(lab.locator('.lab-readout')).toContainText('= 14');
  });

  test('math is typeset with MathML for screen readers', async ({ page }) => {
    await page.goto(`./${hashFor('learn/lesson', { lessonId: 'c1-derivative' })}`, { waitUntil: 'networkidle' });
    await expect(page.locator(VISIBLE + 'math').first()).toBeAttached();
    expect(await page.locator(VISIBLE + 'math').count()).toBeGreaterThan(20);
  });

  test('an unknown lesson explains itself instead of a blank page', async ({ page }) => {
    await page.goto('./#learn/lesson/no-such-lesson', { waitUntil: 'networkidle' });
    await expect(page.locator(VISIBLE)).toContainText('There is no lesson called');
    await expectNoCrash(page);
  });
});

test.describe('diagnostic', () => {
  test('adapts, can be stopped, reports uncertainty and reasons, and can be overridden', async ({ page }) => {
    await page.goto('./#progress/diagnostic', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Start the diagnostic' }).click();
    // Skip one area entirely, answer a few, then stop early.
    await page.getByRole('button', { name: /I haven’t studied/ }).click();
    for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Skip this question' }).click();
    await page.getByRole('button', { name: 'Stop and see results' }).click();
    await expect(page.getByText('Suggested starting point — provisional')).toBeVisible();
    await expect(page.getByText(/not a placement test, a grade, or an official/)).toBeVisible();
    await expect(page.locator('.dx-domain').first()).toBeVisible();
    await expect(page.getByText('Not assessed').first()).toBeVisible();
    await page.getByLabel('Choose your own starting point instead').selectOption('linear-algebra');
    await page.getByRole('button', { name: 'Use this' }).click();
    await expect(page.getByText(/Current starting point: Linear Algebra \(your choice\)/)).toBeVisible();
    // The attempt is kept, and a retake adds rather than overwrites.
    await expect(page.getByRole('heading', { name: 'Your attempts' })).toBeVisible();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fi_diagnostic_v1')));
    expect(saved.schemaVersion).toBe(1);
    expect(saved.attempts).toHaveLength(1);
    expect(saved.attempts[0].bankVersion).toMatch(/^dx-/);
  });
});

test.describe('practice', () => {
  test('mixed practice unlocks with two subjects and alternates between them (D2)', async ({ page }) => {
    await page.goto(`./${hashFor('practice/mixed')}`, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'Open lessons from two subjects first' })).toBeVisible();
    await page.goto(`./${hashFor('learn/lesson', { lessonId: 'a1-slope' })}`);
    await expect(page.locator('h1.page-title')).toHaveText('Slope as rate of change');
    await page.goto(`./${hashFor('learn/lesson', { lessonId: 'la-dot-product' })}`);
    await expect(page.locator('h1.page-title')).toContainText('dot product');
    await page.goto(`./${hashFor('practice/mixed')}`);
    const label = page.locator('#mixed-q');
    await expect(label).toContainText('Question 1 of 6');
    const subjectAt = async () => (await label.textContent()).split('·')[1].trim();
    const seen = [await subjectAt()];
    for (let i = 2; i <= 4; i += 1) {
      await page.getByRole('button', { name: 'Next question' }).click();
      await expect(label).toContainText(`Question ${i} of 6`);
      seen.push(await subjectAt());
    }
    expect(new Set(seen)).toEqual(new Set(['Algebra', 'Linear Algebra']));
    for (let i = 1; i < seen.length; i += 1) expect(seen[i]).not.toBe(seen[i - 1]);
  });
});

test.describe('maps', () => {
  test('the concept map is keyboard-navigable and deep-linkable', async ({ page }) => {
    await page.goto(`./${hashFor('maps/concepts', { conceptId: 'c.dot-product' })}`, { waitUntil: 'networkidle' });
    await expect(page.locator(VISIBLE + '.cmap-detail h2')).toHaveText('The dot product');
    const node = page.locator(VISIBLE + '.cmap-node[aria-pressed="true"]');
    await node.focus();
    await page.keyboard.press('ArrowLeft'); // to a prerequisite
    await page.keyboard.press('Enter');
    await expect(page.locator(VISIBLE + '.cmap-detail h2')).not.toHaveText('The dot product');
    await page.getByRole('button', { name: 'Outline' }).click();
    await expect(page.locator(VISIBLE + '.cmap-outline')).toContainText('Projection onto a vector');
  });

  test('the formula map can be explored from the keyboard (F-04)', async ({ page }) => {
    await page.goto('./#maps/formulas', { waitUntil: 'networkidle' });
    await page.locator('g.gnode[tabindex="0"]').first().waitFor({ state: 'attached' });
    await page.locator('g.gnode[tabindex="0"]').focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page.locator(VISIBLE + '.detail-panel.open')).toBeVisible();
    await page.getByRole('button', { name: 'Outline' }).click();
    await expect(page.locator(VISIBLE + '.formula-outline')).toContainText('Sample Mean');
  });

  test('the model map can be explored from the keyboard (F-04)', async ({ page }) => {
    await page.goto('./#maps/models', { waitUntil: 'networkidle' });
    await page.locator('g.mlgnode[tabindex="0"]').first().waitFor({ state: 'attached' });
    await page.locator('g.mlgnode[tabindex="0"]').focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => !!document.querySelector('.mm-detail-panel.open, .ml-detail-panel.open, [class*="detail"][class*="open"]'))).toBe(true);
  });
});

test.describe('shell', () => {
  test('global search opens with Ctrl+K and goes to a lesson', async ({ page }) => {
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await page.keyboard.press('Control+k');
    const box = page.getByRole('combobox', { name: /Search lessons/ });
    await expect(box).toBeFocused();
    await box.fill('gradient descent');
    await expect(page.getByRole('option').first()).toContainText('Gradient descent');
    await page.keyboard.press('Enter');
    await expect(page.locator('h1.page-title')).toHaveText('Gradient descent');
  });

  test('number keys jump between sections and [ ] move within one', async ({ page }) => {
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await page.keyboard.press('4');
    await expect(page).toHaveURL(/#practice\/review$/);
    await page.keyboard.press(']');
    await expect(page).toHaveURL(/#practice\/mixed$/);
    await page.keyboard.press('[');
    await expect(page).toHaveURL(/#practice\/review$/);
  });

  test('theme: system, light and dark persist from Settings', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('./#settings', { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light'); // follows the system by default
    await page.getByRole('radio', { name: 'Dark' }).check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('radio', { name: /Match my device/ }).first().check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('reset progress needs confirmation and keeps preferences', async ({ page }) => {
    await page.goto('./#settings', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('bluman_journal_v1', '[{"id":1,"text":"x"}]');
      localStorage.setItem('fi_theme_v1', '"dark"');
    });
    await page.getByRole('button', { name: 'Reset progress…' }).click();
    await expect(page.getByRole('alertdialog')).toContainText('cannot be undone unless you download a backup first');
    await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Delete my progress' }).click()]);
    expect(await page.evaluate(() => localStorage.getItem('bluman_journal_v1'))).toBeNull();
    expect(await page.evaluate(() => localStorage.getItem('fi_theme_v1'))).toBe('"dark"');
  });

  test('focus mode hides the navigation and comes back', async ({ page }) => {
    await page.goto('./#learn/courses', { waitUntil: 'networkidle' });
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await page.keyboard.press('f');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
    await page.getByRole('button', { name: 'Leave focus mode' }).click();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  });

  test('navigating moves focus to the new page’s heading and updates the title', async ({ page }) => {
    await page.goto('./#home', { waitUntil: 'networkidle' });
    await page.getByRole('navigation', { name: /primary/i }).getByRole('link', { name: 'Practice' }).click();
    await expect(page.locator('h1.page-title')).toHaveText('Review');
    await expect(page.locator('h1.page-title')).toBeFocused();
    await expect(page).toHaveTitle('Review · Formula Intelligence');
  });

  test('the skip link moves focus to the main content', async ({ page }) => {
    await page.goto('./#learn/courses', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('phones get a bottom bar with an accessible More menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 760 });
    await page.goto('./#home', { waitUntil: 'networkidle' });
    const more = page.getByRole('button', { name: 'More' });
    await more.click();
    await expect(page.getByRole('dialog', { name: 'More' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'More' })).toBeHidden();
    await expect(more).toBeFocused();
  });
});

// §10 "no horizontal overflow" and acceptance test 8 — every surface at 320 px.
test.describe('responsive: no horizontal overflow at 320 px', () => {
  const surfaces = [
    ...PAGES.filter((p) => !p.hidden).map((p) => hashFor(p.id)),
    ...auditInstances().map((i) => hashFor(i.page, i.params)),
  ];
  for (const hash of surfaces) {
    test(hash, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(`./${hash}`, { waitUntil: 'networkidle' });
      await expectNoCrash(page);
      const over = await page.evaluate(() => {
        const W = document.documentElement.clientWidth;
        const offenders = [];
        for (const el of document.querySelectorAll('.app-tab-keepalive:not([hidden]) *, .app-header *, .bottom-nav *')) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > W + 1 && getComputedStyle(el).position !== 'fixed') {
            // Content inside its own horizontal scroller is allowed (tables, code, math).
            let p = el.parentElement;
            let scrolls = false;
            while (p && p !== document.body) {
              const o = getComputedStyle(p).overflowX;
              if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') { if (p.getBoundingClientRect().right <= W + 1) { scrolls = true; break; } }
              p = p.parentElement;
            }
            if (!scrolls) offenders.push(`${el.tagName}.${String(el.className).split(' ')[0]} → ${Math.round(r.right)}`);
          }
        }
        return { doc: document.documentElement.scrollWidth - W, offenders: offenders.slice(0, 5) };
      });
      expect(over.doc, 'document must not scroll sideways').toBeLessThanOrEqual(0);
      expect(over.offenders).toEqual([]);
    });
  }
});
