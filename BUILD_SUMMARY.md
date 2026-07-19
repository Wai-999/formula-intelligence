# Build Summary — ML Mode

## What was built

A second, parallel mode for Formula Intelligence — "ML mode" — sitting alongside the existing Stats mode behind a switcher in the app header. Nine tabs: an ML Pipeline visualizer with an explicit Estimation/Prediction/Causal-Inference bridge, a full model relationship map, a hands-on bias-variance playground, an evaluation & explainability lab, four real-world forecasting labs (Gold, Macro, Micro, Politics), and a Stats↔ML Bridge with live cross-links back into Stats mode's own formula map. Every ML page supports two independent, cross-cutting toggles — Beginner/Researcher explanation depth and English/Burmese language — and every factual claim traces to a cited research document or is explicitly disclosed as illustrative (`docs/DATA_SOURCES.md`).

47 source files, ~4,250 lines, 11 commits (one per module, `git log --oneline` from `07a383d` through `38c9a71`), zero live API calls anywhere in the mode.

## Module-by-module

| Module | What it is | Key decision |
|---|---|---|
| 1 | Shared shell & mode switcher | Stats/ML mode state lives in `useUIStore`; each mode remembers its own last-open tab independently |
| 2 | Pipeline visualizer + Estimation/Prediction/Causal bridge | Built as the explicit "headline bridge concept" the research doc calls for, not buried text |
| 3 | Model relationship map | Reuses Stats mode's own graph visual grammar (nodes/edges, extends/competes/combines) for a different node set |
| 4 | Bias-variance playground | Live polynomial/tree fit against a seeded synthetic dataset — the one module needing no real-world citation at all |
| 5 | Evaluation & explainability lab | Walk-forward-vs-naive-split backtest animation; SHAP/LIME previewing Gold's real driver set |
| 6 | Gold forecasting lab | Flagship domain — real spot price, real bank targets, real 5-driver feature set, four model lenses |
| 7 | Macro (nowcasting) lab | Extended the chart/trace components with unit/decimals props after Gold's dollar-scale assumptions broke on percentage-point data |
| 8 | Micro (elasticity) lab | Bespoke continuous-price chart instead of the discrete-driver template — a genuinely different shape, not a shortcut |
| 9 | Politics & geopolitical lab | Two independent sub-mechanisms (election model, geo-risk score) on one page; first real cross-domain link (→ Gold) |
| 10 | Stats↔ML Bridge | Two shared worked examples, each reachable from both modes; closes the cross-link loop Module 2 opened |
| 11 | Bilingual/depth cross-cutting audit | Found and fixed a systemic gap — see below |
| 12 | Final verification & docs | This summary, `docs/DATA_SOURCES.md`, `docs/ML_MODE_README.md` |

## Architecture patterns established

- **One generic domain-lab template** (`useMLDomainStore`, `DriverPanel`, `ScenarioPresets`, `ForecastBandChart`/`TracePanel`, `computeModelForecasts`/`driverContributions`) serves Gold/Macro exactly as built, and — because every shared piece is genuinely shape-agnostic — still serves Micro/Politics with only the chart and math swapped out, not the whole scaffold. Documented as a step-by-step template for a hypothetical 13th domain in `docs/ML_MODE_README.md`, since the code itself (`domainModel.js`'s header comment) already pointed here.
- **Keep-alive tab mounting**: every ML page mounts simultaneously and stays in the DOM (`display:none` when inactive), so per-page state survives tab switches with no extra plumbing — and, as a consequence, every page's effects run on every store change, which is why cross-link consumers check the incoming payload's own address rather than assuming "this effect ran" means "this payload is mine."
- **A two-axis content system** (`bl()`/`blSame()`/`useT()`) makes every string simultaneously depth-forkable and bilingual, authored once next to the concept it describes rather than in a separate translation file.
- **A shared, generic driver→forecast math core** (`domainModel.js`) that four different model "lenses" (econometric/deep-learning/tree-ensemble/volatility) read identically, each shaped to match the research doc's own qualitative comparative findings for that model family — deliberately not rigged to make any one lens "win," including in Macro's explicit "simplicity can beat complexity" teaching moment.

## Verification approach, throughout

Every module was hand-verified end-to-end against its own computed math (slider → expected number by hand → displayed number), not just clicked through. This discipline caught several real product bugs that could easily have been misdiagnosed as testing artifacts: a crash-causing key mismatch (Module 9), a race condition in a cross-link effect (Module 10), an array-vs-string type bug (Module 10), a reserved-prop-name collision (Module 8), and — across the whole build — a systemic hardcoded-string gap (Module 11) found by direct browser-rendered-text inspection rather than trusting that "the code compiles" meant "the toggle works." Every module's build/lint/console-error/responsive/bilingual checks are recorded individually in `BUILD_LOG.md`.

## Known limitations (flagged, not fixed)

- **No error boundary anywhere in the component tree.** A single bad prop or lookup white-screens the entire app, not just the offending component. Flagged in Modules 9, 10, and 11; deliberately left as a Module 12+ hardening candidate since it's shell-level infrastructure touching both modes, not something that belongs in any one module's diff. Full detail and a suggested approach in `docs/ML_MODE_README.md`.
- **The research document's own §3.9/§7 claim that Stats mode has existing "Gibbs/PGAS" Bayesian content is false** — checked directly, not assumed (`docs/DATA_SOURCES.md` has the full record). Every place in ML mode that would have repeated this claim was corrected to reference the real content (`ci_mean_t`) instead; the source document itself was left as-is.

## Deliverables

- `docs/DATA_SOURCES.md` — every real vs. synthetic figure, module by module, plus the source-document inaccuracy record.
- `docs/ML_MODE_README.md` — architecture map, the bilingual system's rules (with the Module 11 lesson as a cautionary example), and a step-by-step template for adding a 13th domain lab.
- `BUILD_LOG.md` — a Built/Files touched/Decisions/Verification entry for every module, in build order.
- This file.
