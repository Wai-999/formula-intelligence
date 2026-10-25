# Python runtime: design, isolation and limits

Python runs in the browser with **Pyodide 0.28.3** (CPython compiled to WebAssembly), loaded from jsDelivr on first use. There is no server. This document says exactly what that does and does not protect.

## Architecture

```
page (React) ── pyodideRunner.js ──postMessage──> pyWorker.js (dedicated Web Worker)
   │  runPython / gradePython / stopPython          │  importScripts(pyodide.js) → loadPyodide()
   │  timeout → worker.terminate() + new worker     │  allowlisted loadPackage()
   └─ renders output, errors, figures, test results │  exec user code; matplotlib → PNG (Agg)
```

- `src/lib/pyodideRunner.js` — the only entry point. Owns the worker, a request id per call, progress messages and the timeout.
- `src/lib/python/pyWorker.js` — boots Pyodide, installs helpers, runs or grades code, returns `{ output, error, figures, results, ms }`.

## What the worker buys

| Problem (baseline) | Now |
|---|---|
| F-01: a non-yielding loop froze the whole tab; the "timeout" could not fire because synchronous WebAssembly blocked the main thread | The page stays responsive. **Stop** and the timeout call `worker.terminate()`, which always ends the code; the next run starts a fresh worker. Tested: `e2e/python-worker.spec.js` (`while True: pass` is stopped, the page responds during it, Python works afterwards). |
| User code could read `localStorage` (all learner data) and the DOM | A worker has **no DOM and no `localStorage`**. Nothing from the stores is ever posted to it — only the code, the exercise's setup/tests and three theme colours. |
| Packages fetched on any import | Only an **allowlist** is ever downloaded: `numpy`, `scipy`, `pandas`, `scikit-learn` (`sklearn`), `statsmodels`, `matplotlib`. Any other non-stdlib import fails with a message naming the allowlist, without a network fetch (tested). |

Timeouts: 30 s for free runs (Python lab, lesson snippets), 20 s for graded exercises; the first run adds 120 s for downloading the runtime. Messages say what happened and that earlier definitions are gone after a restart.

## What the worker does NOT protect — read this

A Web Worker is **a responsiveness boundary, not a security sandbox**:

- It runs on the **same origin** as the app. Code in it can call `fetch` (Pyodide exposes `pyodide.http` and `js.fetch`), so it can make network requests, and it can open the origin's **IndexedDB** and **Cache Storage** (which holds the offline copy of the app).
- It cannot read `localStorage`, where every learner record lives, or touch the page.
- Learners only run code they typed or that the app ships. There is no code sharing, no import from URLs, and no feature that runs someone else's code. **Do not add one** without a real isolation boundary (a sandboxed cross-origin iframe with its own worker).
- No secrets exist in the app: no API keys, tokens or accounts. Nothing secret is ever passed to Python.

## Supply chain

- Pyodide is **pinned** to 0.28.3 and loaded over HTTPS from `cdn.jsdelivr.net/pyodide/v0.28.3/full/`.
- **Subresource Integrity is not applied** (baseline F-09, still open). `importScripts()` has no integrity option, and Pyodide then loads its WebAssembly and package wheels itself from the same base URL. Verifying only `pyodide.js` would protect one file of many.
- Mitigation that would close it: self-host the pinned Pyodide distribution (or the subset used) on the same origin and precache it. Cost: ~10–30 MB more on GitHub Pages and in the offline cache. Not done; tracked in `docs/UPGRADE_PROGRESS.md`.

## Grading

`gradePython(exercise, code)` runs, in a **fresh namespace** each time: the exercise's `setup`, then the learner's code, then each named test. A test passes if it raises nothing; an `AssertionError` shows the test's own message as the reason (e.g. "slope((-1, 4), (3, -4)) should be -2 — check the order of subtraction"). Tests compare numbers with tolerances (`math.isclose`, `numpy.allclose`), never printed digits.

`npm run verify:python` runs every exercise's reference solution with real CPython + NumPy and requires all its tests to pass, and runs every **starter** to make sure it fails — an exercise whose starter already passes is a broken exercise. It also runs every lesson's Python block and requires its output to match the "Expected output" printed on the page exactly, and every exercise's **no-code output** (below) against what the reference solution really prints. Current result: **78/78** (CPython 3 with NumPy and pandas). Runs in CI.

## The no-code path (V4 §8)

Python must not become a barrier to learning the mathematics. Every coding exercise (26 of 29; the other three are already about reading code) offers "Not coding yet? Read the result instead": the reference solution's printed output and a question about what it means. It runs no code in the browser, downloads nothing, and is not recorded as Python evidence. Every exercise can also be downloaded as a `.py` file with its setup and tests, to run locally with `python3`.

## Offline

The app works offline after one visit (`docs/PERFORMANCE_REPORT.md`), Python excepted: Pyodide is **not** in the app's offline cache (it is ~10 MB and changes on its own schedule). If the browser's HTTP cache kept it, Python may still start offline; if not, the run ends with "Could not download the Python runtime — you may be offline … the rest of the app works offline." Settings → Offline use says the same.

## Threat summary

| Threat | Status |
|---|---|
| Infinite loop / heavy compute freezes the app | **Mitigated** — worker + terminate |
| Learner code reads learner data in `localStorage` | **Mitigated** — not reachable from a worker |
| Learner code makes network requests | **Not mitigated** — same origin; acceptable because only the learner's own code runs |
| Learner code tampers with the offline cache | **Not mitigated** — same reason; worst case a broken offline copy, fixed by reloading online |
| Malicious package download | **Mitigated** by the allowlist; packages come from the pinned Pyodide index |
| Compromised CDN serving altered Pyodide | **Open** — no SRI (see Supply chain) |
| Secrets exfiltrated | **N/A** — none exist |
