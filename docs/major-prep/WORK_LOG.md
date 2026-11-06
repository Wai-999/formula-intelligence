# Work log — V5.1 (append-only)

Factual record of what was done, in order. Newer entries go at the bottom; earlier entries are not edited.

## 2026-10-24 — Phase 0: audit and protect

- Created branch `feat/ohlone-major-mastery-v5` from `origin/main` (`3557155`) in the existing worktree; the owner's primary checkout (uncommitted redesign) left untouched.
- Baseline: `npm run lint` PASS, `npm run validate:content` PASS, `npm test` 350/350, `npm run budget` 71.6 KB. `g++ --version` → Apple clang 17.

## 2026-10-24 — Phase 1: official research

- Ohlone 2026–2027 catalog: `ohlone.edu` returns 403 to WebFetch and curl, so chapters 7 and 8 were read in the in-app browser with pdf.js. Data Science A.S. requirements and 15 course records captured.
- SJSU program-specific transfer coursework (Fall 2027 admission, page updated Aug 28, 2026) fetched with curl.
- CSU East Bay Data Science B.S. read in the 2026–2027 catalog (catalog id 44, confirmed as the current catalog).
- UC Data Science Transfer Pathway (no academic year stated), UC Davis 2026–2027 General Catalog, UC Merced Fall 2027 major-preparation page.
- ASSIST: `/api/institutions` and `/api/AcademicYears` return 400 to curl and to plain in-page fetches. Replaying the site's anti-forgery token was rejected as working around its protection.
- An outage of the tool-safety check blocked shell and browser actions for a period; work continued on read-only code review and file authoring.

## 2026-10-24/25 — Phase 2: vertical slice (Algebra II → Precalculus → Calculus I)

- Lessons `a2-composition`, `pc-limits`, `c1-chain-rule`; labs Composition and the chain rule, Limits. 21/21 curriculum tests; 81/81 Python blocks. Commit `e466671`.
- Placement: “not enough evidence” outcome, two chain-rule items (bank `dx-2026.10-2`). Mastery: evidence breakdown, next-step text, hinted answers excluded from the two-day rule. Home: 15 / 30–45 / 60–90 minute session plan (`fi_study_v1`). Commit `f310851`.
- Browser checks: chain-rule small plots were illegible in a narrow column → stacked; the limits lab hid the hole at small h → zoom view. Commit `677d557`.

## 2026-10-25 — Phase 3: Computer Science track

- Catalog: Computer Science (C++) subject; C++ Fundamentals, OOP in C++, Data Structures and Algorithms, Discrete Structures; 11 competencies; 7 placement items. Commit `cda9aff`.
- `scripts/verify-cpp.mjs`: C++17, `-Wall -Wextra -pedantic -Werror`, sanitizers when available. Locally the AddressSanitizer runtime hung inside the sandbox, so the probe now times out after 5 s and the local run uses plain warnings-as-errors builds; CI (Linux) keeps the sanitizers.
- Trace lab, C++ panel with `.cpp` download and compile instructions, first C++ lesson. Commit `c705e97`. Lessons on functions/references and classes/invariants (`b1ef2a4`), stacks and queues (`fe8cea8`), logic and induction (`be1f178`). 18/18 then 20/20 C++ checks.

## 2026-10-25 — ASSIST articulation obtained

- Through ASSIST's own search page: Ohlone → SJSU Data Science B.S. (2026–2027), Ohlone → CSU East Bay Data Science B.S. (2026–2027), Ohlone → UC Davis department agreements for Statistics, Mathematics and Computer Science (2026–2027), Ohlone → UC Merced Data Science and Computing (Applied Mathematics emphasis) — newest available 2025–2026.
- Ohlone counseling URL confirmed (`/counseling` redirects to `/counseling-department`).

## 2026-10-25 — Phase 6: Ohlone prep

- `src/data/college/` + `scripts/validate-college-data.mjs` (86 records: 71 verified-current, 10 verified-prior-year, 5 unverified). Commit `e96c211`.
- Prep page under Learn → Courses (a fifth Learn tab failed the V4 four-tab test). Six V5 journey tests. Commit `31685c1`.
- Full e2e: 247 passed, 1 failed — the every-page sweep could not find the prep page's link text; fixed by giving the Courses card the page title. `npm run a11y`: 0 violations, 74 pages.

## 2026-10-25 — Projects, Phase 2B and Python

- Sensor-log project (Python graded in the browser, C++ with tests), rubrics and extensions for the three §13.5 projects, `projects.test.js` (incl. the Anscombe check the data file had claimed). Commit `5148145`. While editing, a script truncated `src/data/projects/index.js`; it had no other uncommitted changes and was restored from git before the edit was re-applied.
- Lessons `a2-exp-log` and `pc-unit-circle` with Log-scale and Unit-circle labs. Commit `80b885c`.
- First Python lesson `py-first-steps`; Python programs in the trace lab, verified by `verify:python`. Commit `073712e`.

## 2026-10-25 — Walkthroughs and evidence

- Three expert walkthroughs at 375 px (simulated — author, not learners); fixes: university named in the equivalence chip, stepping controls above the code on phones, duplicate retake link removed. Commit `9fa0b4f`.
- Screenshots: `evidence/before/` (live V4) and `evidence/after-local/` (this branch).
- Generated reports: `npm run docs:college`, `npm run docs:curriculum`. Commit `7874261`.

## 2026-11-04 — Merge with main, then the 80/20 upgrade

- Merged `origin/main` (PRs #5–#7: learning path, study continuity, applied problems, icon subset). Integration: the four C++/discrete courses on the data-science route; Python's outline alternative removed; outline-only path cases moved to a catalog copy in tests; 12 applied problems and explain-back prompts for the V5 lessons; four C++ Fundamentals placement items (`dx-2026.11-1`). Commit `c17f789`.
- Continued as the 80/20 learning upgrade on `feat/learning-8020-professor-experience`: docs/learning-8020/.

## 2026-11-05 — 80/20 phase 5: two prerequisite lessons

- After PR #8 shipped the 80/20 upgrade, phase 5 of the brief on `feat/learning-8020-phase5-prereq-lessons`: *What is a function?* (Algebra I) and *Power, product and quotient rules* (Calculus I), chosen by graph centrality, placement items with no lesson behind them, and the dead ends the engine named. Both meet the professor contract (the contract test now covers `CONTRACT_LESSONS`), with three applied problems each (four on project cases), explain-backs and three new formulas. The C++ *Functions and vectors* bridge is pinned to *Loops you can trace* so the new algebra lesson does not take it over. Details: docs/learning-8020/PHASE5_PREREQUISITES.md.

## 2026-11-06 — Notation readings, then 80/20 phase 6: four lessons

- The owner asked for the name of each notation. PR #12 (merged `eb89a63`, deployed and checked live): a reading for every symbol in lesson glossaries, formula symbol tables and the Formula map, with a speaker button using the browser's own voice. Details: docs/learning-8020/NOTATION_READINGS.md.
- Phase 6 on `content/phase6-lessons`: *Exponents and roots* (Prealgebra), *Center and spread* and *Probability rules* (Probability & Statistics), and Python *Functions*, each to the professor contract, with three applied problems each (six on project cases), two new labs (center and spread, two dice) and eight formulas. Bayes’ theorem and the CLT lesson gain bridges; PCA and validation keep theirs. Details: docs/learning-8020/PHASE6_LESSONS.md.
