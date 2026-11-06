# Phase 5 — missing prerequisite lessons

The brief's Phase 5: “author real missing prerequisite lessons in the most common blocked routes. Target gaps identified by graph centrality and diagnostic evidence, not every outline equally. Mark any unfinished lessons clearly.”

This round adds two lessons, both written to the professor contract from the start, and nothing else to the catalog.

| Lesson | Course, unit | Replaces the planned title |
|---|---|---|
| `a1-functions` — *What is a function?* | Algebra I, “Functions and graph interpretation” | “What is a function?” |
| `c1-power-rules` — *Power, product and quotient rules* | Calculus I, “Derivative rules” (before the chain rule) | “Power, product and quotient rules” |

## How the two were chosen

**Graph centrality.** For every concept with no written lesson before this phase, the number of written lessons whose concepts depend on it, directly or through other concepts (`src/data/curriculum/concepts.js`, the `requires` edges):

| Unwritten concept | Written lessons that build on it | Concepts that build on it |
|---|---|---|
| Integers and signed arithmetic | 33 | 93 |
| Expressions and order of operations | 29 | 77 |
| Fractions, decimals and percentages | 26 | 71 |
| The coordinate plane | 26 | 67 |
| **Functions** | **16** | 40 |
| Exponents, radicals and scientific notation | 14 | 45 |
| Essential geometry | 9 | 30 |
| Vectors in the plane | 8 | 25 |
| Descriptive statistics | 6 | 17 |
| … | | |
| **Derivative rules** (16th of 49) | **2** | 4 |

**Diagnostic evidence.** The placement test asks about both skills, and until now no lesson taught either: `dx.f1` and `dx.f2` (function notation, `func.notation`) and `dx.c7` and `dx.c9` (the power rule, `calc.rules`).

**Blocked routes.** “What is a function?” and “Power, product and quotient rules” were the gaps the next-action engine named first in Algebra I and Calculus I. The Calculus I gap was the dead end the persona journeys found (USABILITY_TEST_REPORT.md, P6).

The choices, and why:

- **Functions** is the most central concept above arithmetic. Composite and inverse functions (a priority lesson) and Limits both build on it directly, and neither had a bridge to fall back on.
- **Derivative rules** is *not* central by this count. It was chosen for three reasons. The chain-rule lesson, a priority lesson, used the power rule without teaching it: its readiness check sent learners to *The derivative from first principles*, which does not teach the rule. Placement tests the rule. And it was the documented dead end.
- **Arithmetic foundations** rank higher by raw count, because everything sits on them. They were left for a later round, because they are review for most learners on this route, while functions and derivative rules are new material that the next written lessons assume. This is a judgement, recorded so that it can be challenged.

## What each lesson contains

Both lessons meet the ten-part professor contract. `src/data/curriculum/__tests__/professorContract.test.js` checks every part for `CONTRACT_LESSONS`, which is the five priority lessons plus these two (`src/data/curriculum/priority.js`).

| Part | *What is a function?* | *Power, product and quotient rules* |
|---|---|---|
| Concrete start | A greenhouse log: “temperature at 3 pm” has one answer, “when was it 20 °C?” may have several | A café: price rising, sales falling — is revenue rising? |
| Simpler explanation | A vending machine | A rectangle whose sides change |
| Step-by-step reasoning | Why the vertical line test works; the domain and range of a half-circle | The power rule from the binomial expansion; product rule from the rectangle; quotient rule from the product rule |
| Worked examples (checked) | Notation incl. $f(a + 1)$; a table that is not a function; the domain of a model | A product two ways; a polynomial; average cost as a quotient |
| Tempting mistake | $f(a + 1)$ read as $f(a) + 1$ | $(fg)' = f'g'$ |
| Prediction | $f(2x)$ against $2f(x)$ | A growing rectangle's area |
| Faded example | A parking fee (3 blanks) | Bakery revenue (3 blanks) |
| Independent and transfer practice | 3 independent, 1 transfer (a battery's domain) | 3 independent, 1 transfer (a concentration curve) |
| Explain it back | What makes a rule a function | Why the derivative of a product is not the product of derivatives |
| Checkpoint | 4 items, incl. a domain question about Python code | 4 items, incl. town water use |
| Python | A rule as code; a table check that finds inputs with two outputs | The product rule against a measured slope |

Applied problems (`src/data/curriculum/problems.js`), three per lesson, four continuing a project's running case:

| Problem | Lesson | Project |
|---|---|---|
| One reading per time — duplicate timestamps change the heater decision (19.8 °C against a naive 20.38 °C) | Functions | Clean a sensor log (`proj.sensor-log`) |
| Is sales a function of price? — weekly data no, the demand model yes, and only for \$5–\$7 | Functions | Price and demand (`proj.pricing`) |
| What did that phone bill buy? — a piecewise rule read forwards and backwards | Functions | — |
| Revenue when price and demand both move — revenue peaks at \$25, profit at \$27.50 | Derivative rules | Price and demand (`proj.pricing`) |
| Does a bigger batch make soup cheaper? — cost per portion falls; waste decides | Derivative rules | Restaurant demand (`proj.restaurant`) |
| When does the charger deliver most power? — the product rule; the tempting rule even has the wrong sign | Derivative rules | — |

New formulas: power, product and quotient rules (`f.power-rule`, `f.product-rule`, `f.quotient-rule`), linked to the lesson and to OpenStax *Calculus Volume 1*, 3.3.

## What changed around them

- **Bridges after wrong answers** (src/lib/nextAction.js `bridgeFor`, COURSE_GAP_MAP.md):
  - *Composite and inverse functions*, *Limits* and *Taylor polynomials* had no bridge. They now offer 5 minutes of *What is a function?*, *What is a function?* and *Power, product and quotient rules* respectively.
  - *Functions and vectors* (C++) would have switched to *What is a function?*, because the default bridge picks the last idea a lesson builds on. It is pinned to *Loops you can trace*, its previous bridge: its mistakes are about tracing values, not about algebra.
- **The chain rule** now lists the derivative rules as its prerequisite. Its power-rule readiness check sends a learner who misses it to the new lesson.
- **The next gaps the engine names** are now Algebra I “Domain and range” and Calculus I “Implicit differentiation and related rates”. “Domain and range” stays planned: the new lesson introduces domain and range, but a full lesson (interval notation, domains of composites, ranges of quadratics) is still to be written.
- **Counts:**

  | | Before | After |
  |---|---|---|
  | Written lessons | 35 | 37 |
  | Planned lessons | 172 | 170 |
  | Applied problems | 38 | 44 |
  | Explain-back prompts | 28 | 30 |
  | Lessons with a faded example | 5 | 7 |
  | Curriculum formulas | 46 | 49 |

## Status

Both lessons, their problems and explain-backs are **AI drafts** (`review: awaiting-human-review`, `reviewer: null`). They are labelled as drafts on the page, like every other lesson. Machine checks: every number is recomputed, the LaTeX parses, the Python output is verified, the links are checked and the contract is enforced. No human has reviewed the teaching.

## Verification

See TEST_RESULTS.md §5.
