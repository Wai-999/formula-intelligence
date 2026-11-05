# Quality and security (V5.1)

V5 ships together with the 80/20 learning upgrade, so one final gate run covers both: **docs/learning-8020/TEST_RESULTS.md** (every command, result and exception). This page records what is specific to V5.

## Gates that exist because of V5

| Gate | What it checks | Last result |
|---|---|---|
| `npm run validate:college` | Every Ohlone, CSU and UC record names an official source and the year it was read from; statuses are one of verified-current, verified-prior-year, candidate, unverified; no current-year claim rests on a prior-year source; every course code used exists in the catalog | PASS — 86 records (71 verified-current, 10 verified-prior-year, 5 unverified), 12 sources |
| `npm run verify:cpp` | Every C++ lesson program compiles as C++17 with `-Wall -Wextra -pedantic -Werror` and prints exactly its stated output; every trace matches an instrumented run; every exercise’s reference solution passes its tests and its starter fails them; sanitizers (ASan/UBSan) run where the platform supports them | PASS — 20 / 20 (sanitizers on Linux CI; skipped on macOS when the probe fails) |
| `npm run verify:python` | Also checks the Python programs in the trace lab | PASS — 90 / 90 |
| `src/data/college/__tests__/college.test.js` | Data valid; a verified-current record without a source or year is rejected; a study mapping or credit claim can never pose as official; the 2026–27 SJSU agreement as read, including what does not articulate; an older agreement is never shown as current; the Ohlone A.S. list matches the catalog; study coverage counts written lessons, outlines and gaps honestly | PASS |
| `src/lib/__tests__/diagnostic.test.js` | “Not enough evidence” when a deciding area rests on one answer | PASS |

Both CI workflows (`ci.yml`, `deploy.yml`) run `validate:college` and `verify:cpp`.

## Runtime and data decisions

- **No C++ compiler in the browser.** C++ is shown, traced and downloaded; learners compile it locally. Lesson programs are compiled in CI, not on the page. (A WebAssembly compiler would add megabytes and a supply-chain risk for little learning value.)
- **Python** runs in the existing Pyodide worker, off the main thread; nothing new was added to it.
- **Storage:** one new key, `fi_study_v1` (time box and transfer target, plain JSON), included in backups as a preference. No learner data leaves the browser; no analytics, no accounts, no network calls added.
- **Official academic data** was read from the official pages and ASSIST’s public interface as data only; no tokens were replayed, nothing was submitted, and nothing on those pages was treated as an instruction. Each record is dated; the page says which are verified for 2026–27, which come from an earlier year and which are not verified.
- **No credit claims.** Every page that mentions Ohlone, CSU or UC carries the self-study disclaimer, and an articulation chip names the campus and agreement it comes from.

## Walkthroughs

Three expert walkthroughs at 375 px were done by the author (simulated, not learners) — see WORK_LOG.md. The 80/20 upgrade added scripted persona journeys on the live site and on this branch (docs/learning-8020/USABILITY_TEST_REPORT.md), including a novice C++ learner, who now reaches *Loops you can trace* in 3 decisions instead of finding no C++ course.

## Known limits

- All 12 V5 lessons are AI drafts awaiting independent review, like every lesson.
- 5 college records are unverified and say so; the UC Merced agreement is from 2025–26 (labelled as earlier-year).
- Screen readers have not been tested by a person.
