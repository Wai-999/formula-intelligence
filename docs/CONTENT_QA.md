# Content QA

What has been checked about the curriculum content, how, and what has **not** been checked. Status words follow §17: *code-complete*, *content-complete*, *review-complete*, *production-released*.

## Status of the new curriculum

| | Count | Status |
|---|---|---|
| Authored lessons | **37** (of 207 planned + authored titles): the 23 of V3.1/V4, 12 added in V5 (Algebra II ×2, Precalculus ×2, Calculus I ×1, C++ ×3, Data Structures ×1, Discrete Structures ×2, Python ×1) and 2 prerequisite lessons in phase 5 of the 80/20 upgrade (Algebra I, Calculus I; docs/learning-8020/PHASE5_PREREQUISITES.md) | **content-complete** for these 37 · **review-complete: 0** |
| Assessable items in lessons (practice, Use it tasks, checkpoints) | 413, plus 74 readiness checks and 18 faded-example blanks | machine-checked; choice options shown in a fixed per-question shuffle (`src/lib/choiceOrder.js`) |
| Diagnostic (placement) items | 96, bank `dx-2026.11-1` (46 of 58 competencies, nine areas; the 12 left out are past what placement decides) | machine-checked, **uncalibrated**; the items added in `dx-2026.10-2` and `dx-2026.11-1` are AI drafts awaiting the same review as the lessons |
| Curriculum formulas | 49 | LaTeX parses; claim type stated; references checked |
| Concepts / knowledge graph | 98 concepts; graph 345 nodes, 538 edges | acyclic, no dangling ids; **pedagogy unreviewed** |
| Code exercises / projects | 30 Python (27 with a verified no-code path) and 5 C++ / 10 projects (7 featured) | Python and C++ reference solutions pass, starters fail; no-code outputs verified |
| C++ programs | 9 lesson and trace programs, 5 exercises | compiled and run in CI (`npm run verify:cpp`, C++17, warnings as errors, sanitizers on Linux) |
| Datasets | 11: 4 real (Anscombe, Palmer Penguins, HadCET, Breast Cancer Wisconsin), 7 synthetic and labelled | provenance and licence recorded; Anscombe checked against its published statistics (`projects.test.js`) |
| Labs | 31 | math helpers checked against closed-form cases (`labMath.test.js`); trace-lab steps verified against instrumented runs; numbers view on every `LabFrame` lab |
| Academic data (Ohlone, CSU, UC, ASSIST) | 86 records, 12 sources | `npm run validate:college`; see `docs/major-prep/ACADEMIC_EVIDENCE.md` |

**Every lesson is an AI draft** (author: "AI-drafted (Claude) for the project owner", 2026-10-24; the two phase 5 lessons 2026-11-05) with `reviewer: null` and `status: 'awaiting-human-review'`. Each lesson page shows a *Draft: awaiting independent math review* label. A test fails if any lesson claims a reviewer it does not have.

### Real-world problems and explain-back prompts (2026-10-28)

`src/data/curriculum/problems.js`: 44 applied problems (178 graded steps) and 30 "Explain it back" prompts with model answers, for the first and last written lesson of every written course (16 problems from 2026-10-28; 12 added with the V5 lessons and 10 more on the five priority lessons on 2026-11-04, 13 of them linked to a project's running case; 6 more with the two phase 5 lessons on 2026-11-05, 4 of them linked to a project). The five priority lessons and the two phase 5 lessons also meet the professor teaching contract (`src/data/curriculum/__tests__/professorContract.test.js`; docs/learning-8020/TEACHING_RUBRIC.md). AI-drafted, `reviewedStatus: 'awaiting-human-review'`, and labelled as drafts on the page. All numbers are invented and labelled so. Machine checks in `src/data/curriculum/__tests__/problems.test.js`: every numeric answer recomputed independently (`compute`) within rounding-only tolerances, every formula parsed, feedback on every wrong choice, references to real lessons, courses and competencies. Coverage and decisions: `docs/CONTINUOUS_LEARNING_UPGRADE.md`.

## Independent human math review — BLOCKED

§5 (and V4 §11: "math reviewer sign-off required … mark unreviewed content as draft") requires review by someone other than the author. No such reviewer was available in this environment, so **review-complete is 0 of 37** and stays so until one signs off. Machine checks below catch arithmetic, syntax and broken links; they cannot catch a misleading explanation, a wrong emphasis, a missing assumption or a prerequisite edge that is technically valid but pedagogically wrong.

### How a reviewer signs off

1. Read the lesson in the app (all ten sections, every hint and solution, the lab, the Python block).
2. Record findings below under *Review log*, one line per issue with the section id.
3. When resolved, set the lesson's `review` in `src/data/curriculum/lessons/index.js` to `{ ..., reviewer: '<name>', reviewed: '<YYYY-MM-DD>', status: 'reviewed' }` and change the `lesson index` test in `curriculum.test.js`, which currently requires every lesson to be unreviewed, to accept reviewed lessons with a named reviewer and date.
4. Review the `requires` edges the lesson introduces (`src/data/curriculum/concepts.js`).

### Review log

*(empty — no independent review has taken place)*

## Machine checks — all run in CI

| Check | Command | What it proves | Last result |
|---|---|---|---|
| Content schema | `npm run validate:content` | Legacy content (formula map, models, ladders, Python library) has unique ids and valid references | PASS |
| Curriculum invariants | `npm test` (`curriculum.test.js`, 21 tests) | Ids unique; every reference resolves; authored lessons listed once, planned titles labelled; Algebra ≠ Linear Algebra; all ten elements in every lesson; **every worked example's answer recomputed independently**; **every numeric item key agrees with an independent recomputation**; keys accepted, obvious wrong answers rejected; every inline/display formula and derivation step **parses with KaTeX**; graph valid and acyclic; no orphan concepts; all 17 required labs exist and are hosted | PASS |
| Applied lab arithmetic | `npm test` (`labMath.test.js`) | Break-even, marginal cost (difference quotient = $a + 2bq + bh$ exactly; a \$1 record error adds $1/h$), matrix–vector scores and standardization match NumPy | PASS |
| Model Map ladders | `npm test` (`depthLadders.test.js`) | 32 ladders × 4 layers resolve; every widget's `compute()` is finite over its range; the nine Phase 8 widgets' predict answers agree with their own formulas | PASS |
| Python outputs | `npm run verify:python` | Every lesson's Python block, run with CPython 3 + NumPy (+ pandas), prints **exactly** its stated output; every exercise's reference solution passes its tests; every starter fails; every no-code output is exactly what the reference prints; Python trace-lab programs print exactly their steps | see `docs/major-prep/QUALITY_AND_SECURITY.md` |
| C++ programs | `npm run verify:cpp` | Every lesson's C++ block prints exactly its stated output; trace-lab steps match an instrumented build; reference solutions pass, starters fail | see `docs/major-prep/QUALITY_AND_SECURITY.md` |
| Citations | `npm run check:citations` (network; not in CI) | Every cited URL answers and its title matches; writes `docs/audits/evidence/citations.json` | **54 OK · 1 UNVERIFIED · 0 broken** (2026-10-24, after V4) |

The one UNVERIFIED citation is Anscombe (1973), *The American Statistician* 27(1), via `doi.org/10.1080/00031305.1973.10478966`: the publisher returns HTTP 403 to automated requests. The DOI resolves to the publisher (it redirected before the 403); the dataset values were checked against the cited secondary source, Wikipedia's *Anscombe's quartet* table, which loads and is reported OK.

Sources cited: OpenStax, MIT OCW, Stanford, Lamar University (Paul's Notes), NumPy, scikit-learn, Python docs, *Deep Learning* (Goodfellow et al.), *ISLR* (statlearning.com), Distill, Seeing Theory, Google developers, *Fairness and Machine Learning*, arXiv, Wikipedia. No citation was written without being fetched.

## Accuracy rules applied while drafting

- Every statement of a formula carries its claim type (definition / identity / theorem / approximation / heuristic / empirical) and its assumptions and domain.
- Worked examples state units and are recomputed by tests, not copied.
- Synthetic data is labelled synthetic on the page and in the dataset record (`DATASETS[].kind`); the one real dataset (Anscombe's quartet) cites its source.
- Expected Python outputs were captured by running the code, never typed.
- The Model Map's nine new mechanism widgets compute the formula given in that ladder's own Formalism layer; where numbers are illustrative (the hybrid model's 60/40 variance split) the label says so.

## Legacy content

The Bluman formula map, Stats quizzes/flashcards and ML-mode content predate this upgrade. They keep their own validation (`validate:content`, existing unit tests) and were not re-reviewed; English-only migration (Phase 1) changed their language, not their mathematics.
