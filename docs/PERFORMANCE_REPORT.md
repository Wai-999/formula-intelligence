# Performance report

**Everything below is lab data from one machine.** No field (real-user) Core Web Vitals exist for this app — it has no analytics, by design — so **field CWV are UNVERIFIED** and no claim about them is made (§13).

## Initial bundle

`npm run budget` (`scripts/check-bundle-budget.mjs`) sums the gzip size of every script the HTML loads before any interaction. CI fails above **90 KB**.

| When | Initial JS (gzip) |
|---|---|
| Baseline (Phase 0, production `d1d0ce1`) | 81.4 KB |
| End of Phase 1 | 73.9 KB |
| **This release** | **71.9 KB** (67.8 app shell + 3.0 React glue + 1.1 storage keys) |

How it stays small while the app grew by 20 lessons, 20 labs, a diagnostic, maps and a Python worker:

- **Every page is a lazy chunk** (`src/app/pageComponents.js`); every **lesson body** and every **lab** is its own chunk.
- **KaTeX** (76 KB gzip, `MathText` chunk) loads only with the first page that renders math.
- **Curriculum metadata** registers page titles lazily (`src/app/pageMeta.js`) — importing it eagerly had pushed the shell to 86.3 KB during Phase 3.
- **Pyodide is never bundled**: ~10 MB from the CDN, inside a worker, only when someone runs code. The 148 KB-gzip `python` chunk is the Python *library* page's 126 reference entries, loaded only on that page.
- Search builds its index on first open.

Total built JS is 782 KB gzip across 158 files; a learner downloads only what they open.

## Lab timings — `npm run evidence:perf`

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

**Lighthouse: NOT MEASURED.** Lighthouse is not a project dependency and was not installed for this run. To measure: `npx lighthouse http://127.0.0.1:4321/formula-intelligence/#home --preset=desktop` against `npx vite preview --port 4321`.

## Offline (acceptance test 7, baseline F-08)

- A service worker generated at build time precaches **the exact build: 181 files, 2.64 MB** (everything in `dist/` except source maps, the worker itself and the HTML, which is fetched network-first with the cached copy as fallback).
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
```
