# Build Summary — ML Mode + Learning Design System

## What was built

This build has two layers, completed in two consecutive phases.

**Phase 1 (12 modules)** built ML mode itself: a second, parallel mode for Formula Intelligence sitting alongside the existing Stats mode behind a header switcher. Nine tabs — an ML Pipeline visualizer with an explicit Estimation/Prediction/Causal-Inference bridge, a full model relationship map, a hands-on bias-variance playground, an evaluation & explainability lab, four real-world forecasting labs (Gold, Macro, Micro, Politics), and a Stats↔ML Bridge with live cross-links back into Stats mode's own formula map. Every ML page supports two independent, cross-cutting toggles — Beginner/Researcher explanation depth and English/Burmese language — and every factual claim traces to a cited research document or is explicitly disclosed as illustrative (`docs/DATA_SOURCES.md`).

**Phase 2 (this mission)** retrofitted a full pedagogical framework — the **Learning Design System** — onto all nine tabs, grounded in `docs/research/ML-Mode-Pedagogy-Research.md`: a 4-layer Depth Ladder (Spark → Mechanism → Formalism → Critical Frontier) on every explorable node/driver/model, a Predict → Explore → Compare → Explain Constructive Thought Loop on every driver slider and scenario preset (not just showcase examples), a 7-entry named-misconceptions registry refuted as real in-context UI (not prose), cross-domain interleaving via a Mixed-Review panel, and a Dreyfus-stage Understanding Tracker driven by actual engagement, never time. Model Map alone got 32 individual Depth Ladders (one per model node); every other module got one consolidated ladder per page/sub-topic, deliberately, per the pedagogy doc's own "full depth over broad shallow coverage" principle.

Nothing in either phase calls a live API; every figure is frozen at build time and labeled real or illustrative throughout.

## Section H checklist — final state

| Item | State |
|---|---|
| All modules reachable, mode switcher intact | ✅ 9 ML tabs + Stats/ML switcher, verified via the icon rail's `aria-label`s |
| All 4 Depth-Ladder layers present on every node | ✅ 9 page-level ladders (Pipeline/Model Map's detail panel/Playground/Evaluation/Gold/Macro/Micro/Politics/Bridge) + 32 individual model-node ladders in Model Map |
| Constructive Thought Loop is real interaction, not just showcased | ✅ 11 `PredictGate` instances across the app; every driver slider/scenario-reveal in Modules 5-10 is gated, not just a handful of examples |
| All 6 named misconceptions + the unlabeled 7th refuted as real UI | ✅ all 7 confirmed wired to reachable UI (see BUILD_LOG.md's Module 11 entry for the full per-misconception location list, including one deliberate dual-placement investigated and confirmed intentional, not a bug) |
| Mixed-Review live after 2+ domains visited, recurring not one-time | ✅ confirmed live globally (not per-page) after wiring `markDomainVisited()` into all four domain pages — this call was missing entirely before this phase, so the panel (built correctly from the start) had been unreachable |
| Understanding Tracker reflects real engagement, never gates content | ✅ observed live-progressing Novice → Advanced Beginner → Competent → Proficient across this session's own engagement; never blocks access to any tab or layer |
| 3-bucket Estimation/Prediction/Causal sort exercise works | ✅ confirmed rendering (Module 2, untouched this phase, spot-checked in the Module 11 audit) |
| Model Map fully 4-layered, correct edge types, no label overlap at any width | ✅ (built and verified in the prior Module 3 retrofit; not touched or re-broken this phase) |
| Playground's try-first-then-explain sequencing is real | ✅ (built and verified in the prior Module 4 retrofit; code re-read and confirmed still intact this phase) |
| Evaluation never shows a bare point forecast/metric | ✅ `computeMetrics()` returns `{value, margin}` for every metric; LIME's base/final values carry a labeled illustrative margin |
| Gold/Macro/Micro/Politics each surface their assigned Critical Frontier moment | ✅ Gold: bank-forecast-spread disagreement · Macro: "fancier isn't always better" (formalizing a pre-existing page callout) · Micro: predict-the-curve-shape before reveal · Politics: "less biased than humans" with a concrete example |
| Cross-links live | ✅ Politics→Gold geo-risk link, Bridge→Politics/Stats-map links all confirmed still functional after being nested inside new `PredictGate`s |
| Bridge's causal-vs-predictive counterexample is concrete | ✅ new third Bridge section, grounded in Module 8's own promo/season model rather than a generic example |
| Bilingual toggles complete | ✅ extensively verified EN/Burmese × Beginner/Researcher across every module touched; one real, previously-shipped bilingual bug found and fixed (see Known gaps below) |
| Static/synthetic data fully labeled | ✅ `MLCitation synthetic` used throughout; new hypothetical examples (Bridge's causal decomposition) explicitly labeled as such, not presented as live-computed |
| Build/lint passing throughout | ✅ `npm run build` + `npm run lint` (oxlint) pass at every checkpoint; this is a JS/JSX project with no separate typecheck script — a clean Vite build is the closest equivalent and was verified repeatedly |
| `docs/ML_MODE_README.md` / `BUILD_LOG.md` / `BUILD_SUMMARY.md` complete | ✅ README gained a full "Learning Design System" section (components, `useUnderstandingStore`, the `markDomainVisited` and `bl()`-vs-`blSame()` gotchas, the 13th-domain step-by-step); BUILD_LOG has a Built/Files-touched/Decisions/Verification entry per module; this file rewritten per the required format |

## Known gaps / next steps

- **Two real, previously-shipped bugs were found and fixed during this phase's own verification, not left as known gaps** — worth naming so the pattern that caught them is understood, not just the fixes: (1) `PredictGate` originally hardcoded `markLayerEngaged(nodeId, 'mechanism')` regardless of which layer it was actually used inside, mis-crediting Spark-layer predicts to Mechanism (fixed by adding a `layer` prop); (2) `mixedReview.js` called the 4-arg `bl()` with only 2 arguments, silently misrouting Burmese text into the wrong depth-level slot (fixed by switching to `blSame()`). Both were caught by directly inspecting rendered output/`localStorage`, not by build or lint.
- **No error boundary anywhere in the component tree** — flagged repeatedly since the original Phase 1 build (Modules 9, 10, 11) and still not fixed; a single bad prop or lookup white-screens the whole app. Cross-cutting shell infrastructure, deliberately left for whoever picks up the app next. See `docs/ML_MODE_README.md`'s "Known limitation" section.
- **Model Map's 32 individual Depth Ladders were not re-verified line-by-line in this phase** — they were built and verified in the prior Module 3 retrofit; this phase's Module 11 audit confirmed structural presence (`misconceptionId` assignments, node count) and investigated one specific surprising-looking assignment, but did not re-click through all 32 nodes' four tabs each. Low risk (nothing in this phase touched that file), but a genuinely from-scratch future audit should still do this once.
- **A 13th domain lab** is the natural next extension — `docs/ML_MODE_README.md` now documents both the original driver/chart/trace scaffold and the Learning Design System layer as one combined step-by-step.

## How to run, and where ML mode lives

```
npm install
npm run dev      # local dev server
npm run build    # production build
npm run lint     # oxlint
```

ML mode is reachable via the Stats/ML switcher in the top-right of the app header. Its code lives under `src/features/ml/` (one directory per tab), `src/data/ml/` (all bilingual content), `src/components/ml/learning/` (the Learning Design System's shared components), and `src/store/useUnderstandingStore.js` + `useMLDomainStore.js` + `useMLUIStore.js` (state). Nothing in it depends on Stats mode or vice versa beyond the shared shell and the two modes' cross-link buttons.

## One full worked Depth-Ladder example (Gold Price Forecasting Lab)

Pasted in full — all four layers, exactly as authored in `src/data/ml/domains/gold.js` and rendered in the app. Numbers were verified live in-browser (push geopolitical risk to 1.0 in the Gold lab and read the forecast chart) before being written here, not asserted.

> **Spark**
> Ask five weather forecasters for tomorrow's high temperature and you'll get five slightly different numbers — not because someone's wrong, but because each reads slightly different evidence and weighs it differently. Ask five investment banks where gold will be next year and the same thing happens, just with far higher stakes.
>
> *Predict first:* Push geopolitical risk to its maximum, everything else at zero. Do the four models' point forecasts move by the same dollar amount, or different amounts?
> - The same amount — they all see the same drivers
> - **Different amounts — each model weighs the same evidence differently** ✓
>
> *Explain:* Check the forecast chart and trace panel after pushing geopolitical risk — ARIMA and GARCH share a point forecast but GARCH's band is far wider, while LSTM and XGBoost land at different dollar figures entirely. Same evidence, four different reactions.
>
> **Mechanism**
> You already ran this mechanism above — every push of a driver slider re-computes all four models' forecasts live from the same driver state. Push geopolitical risk toward its extreme and watch the forecast band chart and trace panel react in real time.
>
> **Formalism**
> *Worked example:* push geoRisk to 1.0 (its coefficient is +110), everything else at 0. Linear baseline move = +$110. ARIMA (0.7× damping) lands at +$77; LSTM (full response, only one driver active so no amplification yet) also lands at +$110; XGBoost's tanh saturation gives +$88; GARCH shares ARIMA's +$77 point but its band balloons to $153 (vs ARIMA's unchanged $90) because geopolitical risk is specifically the variable GARCH's band responds to. Four different numbers from one identical push.
> *(Live-verified: at geoRisk=1.0 the app displays ARIMA $4,092, LSTM $4,125, XGBoost $4,103, GARCH $4,092 — i.e. base $4,015 plus exactly +77/+110/+88/+77 — confirming the worked numbers above against the running app, not just the formula.)*
>
> *Now you try:* set every driver to 0 except real yields at −1.0 (its coefficient is −180). Step 1 — what's the linear baseline move (coefficient × driver value)? Step 2 — which of the four models do you expect to land furthest from that baseline this time, and why: _____. Check your answer against the trace panel and forecast chart above.
>
> **Critical Frontier**
> *Where the analogy breaks down:* The weather-forecaster analogy breaks down on accountability: a weather forecaster is graded again tomorrow, every single day, so bad judgment gets corrected fast. A 2026 gold price forecast won't be checked for months — leaving far more room for a bank's own trading position, marketing incentive, or institutional house-view to quietly shape a number before reality ever grades it.
>
> *A real caveat:* This page's own context noted Goldman Sachs (~$5,800), JPMorgan (~$5,500), and UBS ($6,000+) — three serious institutions, over $1,200 apart, looking at broadly the same evidence. That real spread is the same phenomenon this page's four toy model-lenses illustrate when they react differently to one identical driver push — a wide spread is not proof someone is incompetent, it is a signal of how much genuine uncertainty the evidence actually contains.
>
> *Retrieval check:* If two reputable banks publish gold forecasts $1,000+ apart, does that necessarily mean one of them made a mistake?
> *(click to reveal)* No — it more likely means they're weighting the same uncertain evidence differently (how much of a rate-cut path to assume, how much further central-bank buying to project forward), the same way this page's four model lenses reacted differently to one identical driver push. A large forecast spread is genuine, informative signal about how much real uncertainty the underlying evidence contains — not proof that someone made an error.

## Deliverables

- `docs/DATA_SOURCES.md` — every real vs. synthetic figure, module by module, plus the source-document inaccuracy record (Phase 1, unchanged this phase).
- `docs/ML_MODE_README.md` — architecture map, the bilingual system's rules, the domain-lab template, and (new this phase) the full Learning Design System section: the four shared components, `useUnderstandingStore`, the two real gotchas (`markDomainVisited`, `bl()` vs `blSame()`), the one-ladder-per-page granularity decision, and a 13th-domain step-by-step covering both phases' worth of scaffold.
- `BUILD_LOG.md` — a Built/Files touched/Decisions/Verification entry for every module across both phases, in build order.
- This file.
