# Performance report

**Everything below is lab data from one machine.** No field (real-user) Core Web Vitals exist for this app — it has no analytics, by design — so **field CWV are UNVERIFIED** and no claim about them is made (§13).

## Initial bundle

`npm run budget` (`scripts/check-bundle-budget.mjs`) sums the gzip size of every script the HTML loads before any interaction. CI fails above **90 KB**.

| When | Initial JS (gzip) |
|---|---|
| Baseline (Phase 0, production `d1d0ce1`) | 81.4 KB |
| End of Phase 1 | 73.9 KB |
| V3.1 release | 71.9 KB |
| **V4 release** | **71.6 KB** |
| Self-hosted icon subset (2026-10-27) | 71.6 KB — and no third-party stylesheet: see *Icon font* below |

How it stays small while the app grew by 20 lessons, 20 labs, a diagnostic, maps and a Python worker:

- **Every page is a lazy chunk** (`src/app/pageComponents.js`); every **lesson body** and every **lab** is its own chunk.
- **KaTeX** (76 KB gzip, `MathText` chunk) loads only with the first page that renders math.
- **Curriculum metadata** registers page titles lazily (`src/app/pageMeta.js`) — importing it eagerly had pushed the shell to 86.3 KB during Phase 3.
- **Pyodide is never bundled**: ~10 MB from the CDN, inside a worker, only when someone runs code. The 148 KB-gzip `python` chunk is the Python *library* page's 126 reference entries, loaded only on that page.
- Search builds its index on first open.

Total built JS is 782 KB gzip across 158 files; a learner downloads only what they open.

### Icon font (2026-10-27)

Until this change every page loaded Tabler Icons from cdnjs: a **render-blocking 209 KB stylesheet (36 KB gzip) on a third-party origin** and a **447 KB WOFF2 font** with ~5,000 icons, of which the app uses 107. The font was most of a first visit's bytes (Lighthouse: 447 of 588 KB on Home), and the stylesheet held back first paint (Lighthouse: "render-blocking requests, est. savings 2.5 s" on mobile). The Phase 0 baseline audit had flagged it as render-blocking, third-party and offline-breaking (`docs/audits/BASELINE_AUDIT.md`, `FEATURE_INVENTORY.md`).

Now the app ships its own subset: `src/styles/tabler-icons.css` (4.7 KB, 1.4 KB gzip, bundled into the app's CSS) and `src/styles/fonts/tabler-icons-subset.woff2` (**13.5 KB**), built by `npm run icons` and precached by the service worker. A page load makes **no third-party request** at all (Python and external links aside). `src/styles/__tests__/icons.test.js` fails if a used icon is missing from the subset. Building the subset also found one icon class, `ti-player-play-off`, that does not exist in Tabler 3.44.0 and had been rendering nothing; it is now `ti-code-off`.

The cold-transfer figures in the tables below (e.g. Home 134 KB) do not include the cdnjs font: at 447 KB it cannot fit in them. Resource Timing reports 0 bytes for a cross-origin response without `Timing-Allow-Origin`, which is the likely reason. Those figures therefore understate a first visit before this change by roughly 480 KB.

## V4 against V3.1 (same machine, same throttling, same pages)

`docs/audits/evidence/perf-lab-v31.json` (before) and `perf-lab.json` (after); medians of 3 cold loads.

| Page | Cold LCP before → after | Cold transfer before → after |
|---|---|---|
| Home (new learner) | 2 248 → **1 328 ms** | 222 → **134 KB** (Home no longer loads the review session and lesson components) |
| Courses | 1 348 → 1 356 ms | 132 → 132 KB |
| Lesson: Slope as rate of change | 2 524 → 2 532 ms | 256 → 258 KB |
| Formula map | 968 → 956 ms | 159 → 159 KB |
| Code exercises | 2 164 → 2 200 ms | 212 → 227 KB (the six projects’ data — penguins CSV, temperatures, radii — ride with the exercise list) |

CLS 0 and no long tasks on every page, before and after. Differences under ~50 ms are within run-to-run noise.

## Lab timings (V3.1 detail) — `npm run evidence:perf`

`scripts/perf-lab.mjs` → `docs/audits/evidence/perf-lab.json`. Production build served locally; Chromium (Playwright, headless) on an Apple M4 Pro with **4× CPU slowdown** and **150 ms RTT, 1.6 Mbit/s down / 750 kbit/s up** (CDP emulation); 1280 × 800; median of 3 runs. *Cold* = fresh context (empty HTTP cache, no service worker). *Warm* = reload in the same context (service worker active).

| Page | Cold FCP | Cold LCP | Cold transfer | Warm LCP | Warm transfer | CLS | Long tasks |
|---|---|---|---|---|---|---|---|
| Home (new learner) | 960 ms | 2 248 ms | 222 KB | 356 ms | 2 KB | 0 | 0 |
| Courses | 968 ms | 1 348 ms | 132 KB | 356 ms | 2 KB | 0 | 0 |
| Lesson: Slope as rate of change | 960 ms | **2 524 ms** | 256 KB | 416 ms | 2 KB | 0 | 0 |
| Formula map | 968 ms | 968 ms | 159 KB | 56 ms | 2 KB | 0 | 0 |
| Code exercises (Python not started) | 960 ms | 2 164 ms | 212 KB | 360 ms | 2 KB | 0 | 0 |

Reading it:

- **CLS 0** on every page in every run; no long task (> 50 ms) was observed at all, before or after first paint, so lab TBT is 0. (The observer was confirmed to report a deliberate 120 ms task under the same throttling.)
- Cold LCP is dominated by the network at this throttle: the lesson's LCP (2.5 s, right at the "good" boundary) waits for the lesson chunk, KaTeX and the icon font. On an unthrottled connection the same pages paint in 188–492 ms (Phase 0 harness).
- Warm loads come from the service worker: ~2 KB over the network (the navigation request itself).
- **Lab only.** The device is far faster than a median phone even at 4× slowdown; the targets (LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms at p75) can only be confirmed with field data. **INP was not measured.**

## Lighthouse (2026-10-27)

Lighthouse **13.5.0**, headless Chromium 153, the five pages above, **3 runs each, median**, mobile (Lighthouse's default: simulated 150 ms RTT, 1.6 Mbit/s, 4× CPU slowdown, 412 × 823) and desktop (`--preset=desktop`). Per-run evidence: `docs/audits/evidence/lighthouse/before-icon-subset.json` and `after-icon-subset.json`.

**Where:** the production build served locally with gzip, not https://wai-999.github.io — the measuring machine's network policy blocks both github.io and cdnjs. For the *before* run, the exact Tabler 3.44.0 files (from npm) were served from a **second local origin**, so the icon stylesheet was still a cross-origin, render-blocking request. A local origin has no DNS or TLS cost, so the *before* numbers are, if anything, slightly flattering. Lab data only; not field Core Web Vitals.

| Mobile | Perf before → after | FCP | LCP | TBT | Bytes |
|---|---|---|---|---|---|
| Home (new learner) | 74 → **98** | 4.2 → **1.7 s** | 4.6 → **2.1 s** | 0 → 22 ms | 588 → **121 KB** |
| Courses | 74 → **98** | 4.2 → **1.9 s** | 4.4 → **2.2 s** | 0 → 39 ms | 587 → **120 KB** |
| Lesson: Slope as rate of change | 69 → **89** | 4.5 → **2.3 s** | 5.3 → **3.1 s** | 0 → 165 ms | 711 → **244 KB** |
| Formula map | 74 → **93** | 4.3 → **1.9 s** | 4.6 → **2.3 s** | 0 → 214 ms | 613 → **146 KB** |
| Code exercises | 71 → **93** | 4.4 → **2.1 s** | 5.0 → **2.8 s** | 0 → 40 ms | 686 → **219 KB** |

**Desktop:** performance 97–99 → **100** on all five pages; FCP 0.8–0.9 → 0.4–0.5 s; LCP 0.9–1.0 → 0.5–0.7 s. **CLS 0.000** everywhere, before and after. **Accessibility 100**, best practices 100 and SEO 100 on every page. The one exception was Code exercises at 98: its exercise titles were `h3` straight under the page's `h1` (axe *heading-order*, a best-practice rule outside the WCAG tags `npm run a11y` checks). They are now `h2` there, and Lighthouse scores that page and Projects 100.

Reading it:

- **TBT rose from 0 because first paint moved earlier, not because of new work.** Main-thread time fell slightly (Formula map 3.5 → 3.2 s, lesson 2.1 → 1.9 s). The same long tasks (up to ~390 ms on the lesson) existed before, but they ran before the 4+ s first paint, where TBT does not count them. (This machine is slower than the M4 Pro behind the lab timings above, which saw no long tasks.)
- **Still above the 2.5 s LCP target on Lighthouse's mobile profile:** the lesson (3.1 s), which waits for the lesson chunk and KaTeX, and Code exercises (2.8 s), which carries the projects' data. Those are the next things to look at.

Reproduce (after `npm run build`, with the build served at port 4321, e.g. `npx vite preview --port 4321`):

```
npx lighthouse@13.5.0 "http://127.0.0.1:4321/formula-intelligence/#home" --output=json --output-path=home.json
npx lighthouse@13.5.0 "http://127.0.0.1:4321/formula-intelligence/#home" --preset=desktop --output=json --output-path=home-desktop.json
```

`vite preview` serves gzip, as GitHub Pages does. The runs above used a small gzip-serving static server instead, because the *before* run needed the second origin for the icon stylesheet.

## Offline (acceptance test 7, baseline F-08)

- A service worker generated at build time precaches **the exact build: 189 files, 2.78 MB** (2026-10-27) (everything in `dist/` except source maps, the worker itself and the HTML, which is fetched network-first with the cached copy as fallback).
- After one online visit, the whole app works offline: Home, a lesson never opened before (with its lab and math), the maps, practice, the diagnostic, notes and progress. Tested by `e2e/offline.spec.js` with the browser context switched offline.
- **Python is the exception** (not precached, ~10 MB; see `docs/PYTHON_RUNTIME_SECURITY.md`), as are external links. The app and Settings → Offline use say so.
- Installing a new build: the new worker waits until every tab of the old build is closed (no `skipWaiting`), so a tab never mixes chunks from two builds; old caches are deleted on activation.

## Other measures

- **Keep-alive cap**: at most five pages stay mounted (`useKeepAlive`, LRU), replacing the old "every visited tab forever" pattern whose memory grew without bound.
- **Lists** are short enough not to need virtualization (largest: 126 Python-library entries, 94 formulas); no long task was observed rendering them.
- **Graph computations**: the Concept-map layout and the Careers & applications links are memoized (`useMemo`); the Formula and Model maps keep their existing D3 simulations, which stay mounted (and keep their zoom) while in the keep-alive set.
- **Storage**: `localStorage` only. IndexedDB was considered and **not justified** — the largest record (evidence, capped at 10 000 entries) stays under 1 MB.

## Reproduce

```
npm run build
npm run budget
npm run evidence:perf        # lab timings → docs/audits/evidence/perf-lab.json
npx playwright test e2e/offline.spec.js
npx lighthouse@13.5.0 "http://127.0.0.1:4321/formula-intelligence/#home"   # see Lighthouse above
```
