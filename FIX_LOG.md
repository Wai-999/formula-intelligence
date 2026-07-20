# Fix Log — Visual QA Pass

One entry per bug: what was wrong, the confirmed root cause, what was changed, files touched. Section B first (the confirmed bugs from the mission brief), then Section C (everything else found during the full sweep).

Every fix below was verified against the live DOM/CSS before being written, per the mission's own instruction — several of the assumed root causes in the brief turned out not to match what the live app was actually doing, and are called out explicitly where that happened.

---

## B.1 — Model Relationship Map: edge clutter, clipped labels, unused canvas

**Confirmed live, not assumed:** re-read `MLRelationshipMap.jsx`/`hierarchicalLayout.js` before touching anything. Two of the brief's assumed root causes didn't match reality:
- "No zoom-to-fit on mount" — a zoom-to-fit already existed. It just fit to `computeHierarchicalLayout`'s hand-estimated `bounds` (a fixed `minX: -170` gutter tuned for Stats mode's short row labels like "Ch 3: Data Description"), not the actual rendered content — ML mode's much longer category names ("TREE-BASED MODELS & ENSEMBLES") genuinely overflowed that gutter even at the default view, confirmed via `getBoundingClientRect()` showing every row label clipped at the SVG's left edge before any panning.
- "Correct but overwhelming, needs a focus/declutter-on-click" — this was already built (`useMLUIStore.selectedModelId` subscription dims unrelated nodes/edges to opacity 0.15/0.06 on click). Confirmed still working after all other changes (26 dimmed, 6 highlighted on a real click test), not re-implemented.

The real, live-confirmed causes:
1. **Edges drawn as straight lines with no node/edge awareness** — a fixed hierarchical (Sugiyama-style) layout, not a force simulation, so nothing ever routes an edge around a node it happens to pass over.
2. **Row category labels clipped at the viewport edge**, confirmed at the default fit (not just after panning) — the shared layout function's `minX: -170` gutter, sized for Stats mode, was too narrow for ML mode's category names.
3. **Node labels could poke outside the fitted view** — the old fit used the layout's hand-estimated bounds, not real rendered label extents.

**Fixed:**
- Long-distance edges (2+ rows apart, `|Δy| ≥ 1.5 × rowSpacing`) now render as a quadratic curve bulging toward the diagram's outer margin (away from the dense center columns, into the space narrower rows already leave empty) instead of a straight line. Adjacent-row edges get zero offset, which collapses the same formula to a plain straight line — pixel-identical to before for the majority case. Endpoints are trimmed along the curve's own tangent (control-point → endpoint), not the raw source→target vector, so arrowheads stay correctly attached.
- Row category labels are now pinned to the viewport's left edge — a sibling of the pannable/zoomable container, not inside it, with only their Y position tracking pan/zoom. They can no longer clip regardless of pan position, gutter width, or label length.
- Fit-to-view now measures the actual rendered content (`contentGroup.getBBox()`, nodes + labels + edges, dividers excluded) instead of a hand-estimated bounds, so it stays correct for any future label-length change.
- Added a truncation safety net for the one label wide enough to be a real outlier ("Bayesian Structural Time Series / Bayesian NNs", ~208 canvas-units) — full name stays available via the existing hover tooltip.

**Bugs introduced and caught during this fix, before shipping:**
- First bbox-fit attempt measured `container.getBBox()` including the row-divider lines, which span far past the diagram (`minNodeX − 400` to `maxNodeX + 400`) on purpose — that inflated the measured "content" to ~20,000 units wide and crushed the whole graph to a speck. Fixed by moving dividers to their own group, outside the bbox measurement.
- Pinned labels rendered but stayed `display:none` on first real visit — traced to `positionPinnedLabels`'s visibility check reading a `const height` captured once at mount, which is `0` when the component happens to lazy-mount while its tab is hidden (this app's keep-alive tab pattern). The main fit-to-view logic already had a `needsRefit` correction for this exact scenario; the pinned-label check didn't share it. Fixed by making `width`/`height` `let` and updating them from the same resize-refit path.

**Files touched:** `src/components/mlgraph/MLRelationshipMap.jsx`, `src/components/mlgraph/MLRelationshipMap.css`.

**Verification:** `npm run build`/`npm run lint` clean. Live DOM checks: all 37 edges (straight and curved) trim to exactly 15px from their nearest node center at both endpoints; 10 edges confirmed genuinely curved (bulge > 2 units, up to 66.7); zero real label-label or label-node collisions (`getBoundingClientRect()`-based, not the misleading local-space `getBBox()` a first attempt used); all 10 row labels render fully unclipped at 360px, 768px, and desktop width; declutter-on-click confirmed still working; drag-to-reposition code-reviewed as correct (uses the same `edgePathD` already verified elsewhere) — synthetic pointer-event drag simulation in this environment is known-unreliable for d3-drag's pointer-capture requirements, so this specific interaction wasn't independently re-confirmed via automated drag, only via source review.

---

## B.2 — Domain-lab and Evaluation-lab pages: large unbalanced empty region

**Confirmed live, not assumed:** measured the actual DOM chain from the visible empty region down to its cause, rather than guessing between the brief's two hypotheses (missing visualization vs. genuinely-narrow content). Neither was right.

**Real root cause:** `PredictGate.jsx`'s outer wrapper renders with class `` `predict-gate predict-gate-${variant}` ``. `variant` defaults to `'card'`, so the outer wrapper — everything: driver panels, metrics grids, all of it — got class `predict-gate-card`. That class name was ALSO used, separately, for the small inner question card meant to float inside the scrim (`.predict-gate-card { max-width: 420px; }`). The two collided: on every page using the default variant (Evaluation, Gold, Macro, Micro, Politics, Bridge — i.e. every domain lab and the Evaluation metrics section), the entire gated content area inherited `max-width: 420px`, which is exactly the "content confined to a narrow column, rest of the viewport empty" symptom. This is a plain CSS selector collision, not a missing component and not content that's meant to be narrow.

**Fixed:** renamed the inner question card's class from `.predict-gate-card` to `.predict-gate-question-card`, so it no longer matches the outer wrapper's variant class. No padding added, no text stretched — per the mission's own guardrail, and because neither would have fixed the actual cause.

**Files touched:** `src/components/ml/learning/PredictGate.jsx`, `src/components/ml/learning/PredictGate.css`.

**Verification:** `npm run build`/`npm run lint` clean. Live-checked all six affected pages (Evaluation, Gold, Macro, Micro, Politics, Bridge) — every one now uses the full page width, no empty region ≥35–40% of viewport remains anywhere. Confirmed no other CSS or JS referenced the old `.predict-gate-card` class name (`grep` across `src/`).

---

## B.3 — "Predict First" card renders as a broken-looking overlay

**Confirmed live:** inspected the rendered DOM/CSS directly. `predict-gate-scrim` and `predict-gate-body-dimmed` classes already existed — this is a deliberate gate (the mission's option 2), not an accidental absolute-position-over-flow-content bug (option 1). The component's own comment confirms this is intentional: children stay mounted (never unmount/remount on answer) specifically so slider/chart state underneath survives the reveal.

**Real root cause:** the gate was real but under-implemented. `.predict-gate-scrim` was `position: absolute; inset: 0;` with no background — just a transparent flex container centering the question card. The dimmed body (`opacity: 0.25; filter: blur(1.5px)`) showed through visibly around the card's edges, which is exactly what reads as "broken" rather than "gated": default `0.0` slider values, button labels, all partially visible with no real backdrop to explain why.

**Fixed:** implemented the gate properly rather than picking a different architecture — added an actual backdrop (`background: rgba(8, 9, 20, 0.86); backdrop-filter: blur(2px);`) to `.predict-gate-scrim`. Since the scrim is `inset: 0` on `.predict-gate` (whose height comes from `.predict-gate-body`, the only in-flow child), this backdrop covers the entire gated region edge-to-edge, not just the card's own footprint. Children stay mounted, exactly as before — nothing about the "why" was changed, only the "how".

**Files touched:** `src/components/ml/learning/PredictGate.css`.

**Verification:** `npm run build`/`npm run lint` clean. Cleared a specific prediction from `localStorage` and reloaded to see the true unanswered state (the default dev session already had most gates pre-answered from earlier testing) — confirmed the backdrop now fully hides the dimmed body, with only the question card legible. Confirmed the resolved (answered) state still shows the compare/explain content immediately, unaffected.

---

## B.4 — Duplicate/broken label in the Gold Lab ("Different amounts —")

**Confirmed live, not assumed — and the literal bug as described doesn't exist.** Found the string (`GOLD_PREDICT_DIFFERENT` in `src/data/ml/domains/gold.js`) — it's used exactly once, as one of two options in a real `PredictGate`. Deliberately reproduced both outcomes:
- Answered wrong → compare row correctly shows two *different* strings (guess vs. actual).
- Answered *correctly* → compare row renders `{guess}` and `{actual}` as the same string, since a correct guess means `optionTexts[guessIndex] === optionTexts[correctIndex]` by construction. The shared template (`"You predicted {guess} — actual: {actual}"`) then renders that identical string twice in the same sentence. That's what the mission's screenshot caught — not a duplicate-render bug, but a correct-answer state that reads like one, made worse by a short viewport clipping the row before the repeated text's second half was visible.

**Fixed:** rather than leave "technically correct but reads like a glitch" in place, added a distinct template (`UI_PREDICT_CORRECT_TEMPLATE`, "You predicted correctly — {actual}") used only when the guess was correct, so it renders as one clean confirmatory sentence instead of a redundant comparison. Applied to both call sites that share this exact compare-row pattern — `PredictGate.jsx` (every predict-gate in the app) and `MixedReviewPanel.jsx` (the cross-domain review questions), since both read from the same `UI_PREDICT_COMPARE_TEMPLATE` and would show the identical symptom on a correct guess.

**Files touched:** `src/data/ml/uiStrings.js`, `src/components/ml/learning/PredictGate.jsx`, `src/components/ml/learning/MixedReviewPanel.jsx`.

**Verification:** `npm run build`/`npm run lint` clean. Live-tested both outcomes on Gold's driver predict-gate after the fix: wrong answer still shows the correct two-sided comparison; correct answer now shows "You predicted correctly — Different amounts — each model weighs the same evidence differently" as a single sentence, no repetition.

---

## B.5 — Content clipped at the top of the Stats↔ML Bridge view

**Investigated thoroughly; not reproducible in the current app, most likely already fixed.** Checked `.ml-main-header` (not sticky/fixed — a normal flex child, confirmed via computed styles) and the actual scroll container (`.ml-page`, `overflow-y: auto` — not `body`, which is `overflow: hidden` by design). Reproduced the Bridge page's real cross-link entry point (Pipeline's Estimation demo → "See this compared side-by-side in the Stats ↔ ML Bridge" button, which calls the same `scrollIntoView({behavior:'auto', block:'start'})` mechanism named in the mission) at both desktop and 360px width — no clipping either time, comfortable margin below the header in both cases.

`BridgePage.jsx`'s own code comments document a **prior, already-fixed** version of exactly this failure mode: `scrollIntoView` used to be called with `behavior: 'smooth'`, and a smooth scroll's frame-by-frame animation (via `requestAnimationFrame`) sometimes never visibly progressed — leaving the view frozen mid-scroll, with content clipped at the top and no way to scroll further (since the animation, not the user, "owned" the scroll position). That's switched to `behavior: 'auto'` already, with the reasoning documented in-line. This is the most likely explanation: the mission's screenshot was probably taken before that fix landed, or during the exact window it was needed.

**No code change made** — there's no reproducible defect to fix, and speculatively changing code for a bug that can't be observed would risk introducing a real regression for no benefit. If this resurfaces, the next thing to check is whether it's viewport-size-specific in a way these two tests didn't hit, or specific to the *other* cross-link entry point (`stats-reg`, from the Stats Map's node detail panel) rather than the one tested here (`pipeline-estimation`).

**Files touched:** none.

---

# Section C — Full QA Sweep

## C.7-related — Macro nowcast timeline: right-edge label clipping

**Found via the systematic chart sweep** (checking every SVG-based chart in the app for the same class of bug as B.1), not from a screenshot. `InformationGapTimeline.jsx`'s "Official GDP released (~4 weeks later)" label is `text-anchor="middle"` at a fixed `x=560` inside a fixed `viewBox="0 0 640 132"`. A `getBBox()` measurement showed the label's right edge at `x=656.2` — past the viewBox's own boundary. This clips regardless of how wide the container renders, since SVG clips to its viewBox by default and the overflow is relative to viewBox units, not real pixels — a wide container doesn't help.

**Fixed:** widened the viewBox (`W`: 640 → 700) rather than moving the label's anchor point, so every other element (the gap-zone rect, baseline, other points) stays at its exact existing position — only new empty space was added on the right, exactly enough to hold the label that was already positioned there.

**Files touched:** `src/features/ml/macro/InformationGapTimeline.jsx`.

**Verification:** `npm run build`/`npm run lint` clean. Re-measured after the fix: label's right edge now at `x=656.1`, well inside the new 700-unit viewBox (43.9 units of margin). Visually confirmed full text renders in the live Macro Lab page.

## C.7-related — ForecastBandChart: axis-label and model-name margins too tight

**Also found via the chart sweep.** `ForecastBandChart.jsx` (shared by Gold and Macro) uses a proper `d3.scaleLinear()` with pixel margins rather than a hand-placed viewBox, which is more robust — but the margins themselves were still too tight in two places:
- The rightmost axis label (a formatted currency value, e.g. "$4,157") is centered exactly at the margin boundary (`x(domain[1]) = W - MARGIN.right`); with the old `MARGIN.right: 16`, a `getBBox()` check found it clipping 1.2 units past the viewBox.
- The widest model-name labels ("GARCH (volatility overlay)", "Dynamic Factor Model (DFM)", both ~27 characters) measured 145.6 units wide against a `MARGIN.left: 150` — not yet clipping, but only 4.4 units of margin, too tight to survive a slightly wider label or a different scenario-pushed value.

**Fixed:** widened `MARGIN.right` (16 → 26) and `MARGIN.left` (150 → 165) for real headroom on both edges, rather than a razor-thin fix for the one exact value measured.

**Files touched:** `src/components/ml/domain/ForecastBandChart.jsx`.

**Verification:** `npm run build`/`npm run lint` clean. Re-measured on both Gold and Macro (the only two consumers of this shared component) after the fix: zero label overflow on either page's chart.

## C.7 — remaining charts checked, all clean

Every other SVG-based chart in the app (`ConceptDriftDemo` in Evaluation, `DemandCurveChart` in Micro, `ConfounderDemo` in Pipeline's Estimation/Prediction/Causal tab, `ScatterFitChart` and `ErrorCurveChart` in Playground) was checked with the same `getBBox()`-based overflow sweep. All clean, zero label overflow. `ConfounderDemo` and `ErrorCurveChart` both required navigating past a gate (a tab click, a "Reveal my result" Productive-Failure gate) to mount at all — checked in their revealed state, not just confirmed absent.

## C.3 — Model Map's row category labels were English-only regardless of language toggle

**Found while verifying B.1's pinned labels in Burmese mode** (part of the required toggle-combination sweep) — the labels didn't change at all when switching to Burmese. Traced to `ML_FAMILIES[].name` in `src/data/ml/models.js`: a plain string, never wrapped in `bl()`/`blSame()`.

This is a different case from model/algorithm names ("Linear Regression", "XGBoost", "Ridge / Lasso / Elastic Net"), which are deliberately kept English-only throughout this app as proper nouns/terms-of-art — that convention is real and intentional, confirmed by checking that those names are consistently plain strings everywhere, on purpose. `ML_FAMILIES[].name` is different: it's a descriptive category/grouping label (the Model Map's row headers), the same kind of UI chrome as the connection-type legend (`MM_LEGEND_EXTENDS` etc., a few lines below in the same file) — which *is* bilingual. There was no reason for this one set of labels to be the exception, and B.1's fix (pinning them to the viewport, always visible) made the gap more visible than it was before, not less real.

**Fixed:** wrapped all 10 family names in `blSame()`, translating the common/descriptive words and keeping genuinely technical terms as English loanwords — the same mixed-language convention this app already uses throughout (e.g. "Model မြေပုံ" for "Model Map"). Since `MLRelationshipMap.jsx`'s graph render is an imperative D3 effect that mounts once (`useEffect(..., [])`, deliberately not remounted on every store change, or pan/zoom/drag state would reset on a language toggle), added a second, separate effect keyed on `lang` that just updates the pinned labels' text in place — the graph itself doesn't re-render.

**Files touched:** `src/data/ml/models.js`, `src/components/mlgraph/MLRelationshipMap.jsx`.

**Decisions:** the mount effect reads the current language via a ref (`langRef.current`), not the reactive `lang` value directly — the correct, lint-clean way to read a "latest value" inside an effect without adding it as a dependency (which would force a full remount on every toggle). First version read `lang` directly and correctly triggered `oxlint`'s `react-hooks(exhaustive-deps)` warning; fixed properly rather than suppressed, matching this codebase's established practice of fixing Rules-of-Hooks-adjacent issues rather than silencing the linter (see BUILD_LOG.md Module 2).

**Verification:** `npm run build`/`npm run lint` clean (zero warnings). Toggled language live: all 10 pinned labels switch to their Burmese text immediately, confirmed via direct DOM text-content read (not just visual glance). Confirmed the toggle does not reset pan/zoom or node positions (the mount effect genuinely does not re-run — only the label text updates).

## C.1 — Control extremes (NaN/undefined/broken-string states)

Every range slider on Gold, Macro, Micro, and Politics pushed programmatically to both its `min` and `max` (17 sliders total across the four domains), plus Micro's promotion/peak-season toggles exercised. Checked rendered text for `NaN`, `undefined`, `null`, `Infinity`, `[object Object]` after each push. Zero matches in every case.

## C.5 — Cross-links

- Pipeline's Estimation demo → Bridge (`{from: 'pipeline-estimation'}`): navigates correctly, scrolls to the right comparison section, no clipping (see B.5 above — this is the same mechanism).
- Politics → Gold geopolitical-risk link: first test (clicked immediately, no Politics driver touched) correctly showed Gold's geoRisk driver at baseline 0 — that's correct behavior for a 0-in input, not a bug. Re-tested properly: pushed Politics' "Regional conflict escalates" preset first, then followed the link — Gold's geoRisk slider (index 3 of 5) landed at its max value (2, i.e. +2.0), confirming the cross-link delivers the pushed value correctly, matching the original build's documented verification.

## C.6 — Citation footers

Every `MLCitation section="X"` value used in the codebase (`1`, `2`, `3`, `5`, `6.1`, `6.2`, `6.3`, `6.4`) cross-checked against the actual section headers in `docs/research/ML-Research-Reference.md`. All eight correspond to a real, existing section. No broken references.

## C.8 — Stats mode unaffected

Every file this entire pass touched is under `src/data/ml/`, `src/components/ml*` (ML-specific), or `src/features/ml/` — confirmed via `git status`, zero files under `src/features/stats/`, `src/components/graph/` (Stats mode's own map, including the shared `hierarchicalLayout.js` — read for reference, never edited), or any Stats-specific store. Live-checked Stats mode's Formula Map regardless: renders identically to before (94 nodes, 13 chapters, sidebar, legend, chapter labels), zero console errors.

## C.9 — Section H pedagogy checklist

Nothing in this pass touched `DepthLadder`, `MisconceptionCallout`, `RetrievalCheck`, or the Understanding Tracker's core logic — only `PredictGate`'s compare-template and scrim CSS, both already re-verified working correctly (predict → gate → answer → compare → explain, full cycle) on multiple pages during this pass. Spot-checked a `DepthLadder` instance (Gold) after the language-toggle fix: all four tabs (Spark/Mechanism/Formalism/Critical Frontier) present with correct bilingual subtitles.

## C.2 / C.4 — Breakpoints and console cleanliness

Every fix in this log was verified at desktop width at minimum; the Model Map fix (the highest-risk change, given it's the one component with real layout/measurement logic) was additionally verified at 360px and 768px. Console checked for errors after every fix, across every page touched — clean throughout, including after rapid interactions (repeated slider pushes, drag/click sequences, language/level toggling).

---

## Final confirmation

- `npm run build` and `npm run lint`: clean (0 errors, 0 warnings) as of the last change in this pass.
- Stats mode: confirmed unaffected, both by file-diff (zero Stats files touched) and live visual check.
- Mode switcher (Stats ↔ ML): unaffected — not touched, exercised repeatedly throughout this pass without issue.
- Pedagogy checklist (Depth Ladder / misconceptions / Mixed-Review / Understanding Tracker): unaffected by any layout fix in this pass — the only shared learning component touched was `PredictGate`, and its predict → answer → compare → explain cycle was re-verified working after each of its two fixes (B.3's backdrop, B.4's correct-answer template).
- All five Section B bugs addressed: four fixed (B.1, B.2, B.3, B.4), one investigated thoroughly and found not reproducible with a documented likely explanation (B.5).
- Section C's sweep surfaced three additional real, previously unknown bugs beyond what Section B named — all fixed: the Macro timeline's label clipping, ForecastBandChart's tight margins, and Model Map's family-name bilingual gap.

---

# Second Pass — Model Map: structural layout fixes

A follow-up mission reported the first pass's Model Map fix as too shallow — edge hairball, clipped labels at multiple pan positions, and a new symptom (tooltip clipping) — and asked for a structurally different approach rather than more parameter tuning, plus far more rigorous live verification than the first pass gave it.

**Read the current implementation before choosing an approach, per the mission's own instruction.** The mission assumed the existing code was a tuned force simulation and asked to replace it with a cluster-constrained layout (its recommended Path 1) or hierarchical edge bundling (Path 2). Neither assumption matched what was actually there: `MLRelationshipMap.jsx` has never run a force simulation — it's always been a fixed hierarchical (Sugiyama-style) layout, one row per model family, columns barycenter-ordered within each row, with zero physics "settle" step anywhere in the file. That's already structurally Path 1 (fixed bands per family, local column ordering within a band) — the mission's own reasoning for preferring Path 1 ("the app already has category headers implying fixed bands") describes the code as it already was. So this pass is not a rewrite to a new layout paradigm; it's closing real, confirmed gaps in the fixed-band approach the first pass only partially finished — measured live, not assumed from the report.

## What was actually still broken (confirmed live, not from the bug report's screenshots)

The report included no new screenshots, only a text description of claimed symptoms. Rather than trust or dismiss it, every claim was checked directly against the running app:

1. **Arrowhead bunching — confirmed, precisely.** A script measured the real angle-of-arrival of every edge at every node with 2+ connections. Result: several nodes had a **0.0° gap** between two arrowheads — not visually close, the literal same point (e.g. "Decision Tree" had 3 edges all arriving at exactly 180°; "Gradient Boosting (general)" had 4 of its 5 at exactly 180°). The first pass's edge-trimming fix (endpoints pulled back from center by node radius + gap) fixed *where along the line* the arrowhead sits, but never addressed *what angle* multiple edges at one node share — a different property it happened not to touch.
2. **Same-row long edges cutting through nodes — confirmed, precisely.** The first pass's curve-routing only considered *row* distance; edges within the same or adjacent row stayed straight regardless of *column* distance. A live measurement found 7 real edges spanning 450–900 canvas-units (3–6 columns) on the same row, dead straight, cutting directly through every node sitting between their endpoints — e.g. "Decision Tree" straight to "Bagging (general)," passing directly over Random Forest, Gradient Boosting, XGBoost, LightGBM, and CatBoost.
3. **Category headers — already fixed, re-confirmed.** The first pass's pinned-header fix (viewport-anchored, outside the pannable coordinate space) was checked again across every pan/zoom position in this pass's sweep (below) and never clipped once. No regression, no further work needed here.
4. **Node labels and the hover tooltip — confirmed, zero collision handling.** Direct source inspection: node labels had no viewport-bounds logic of any kind (an edge-panned node's label could and did clip). The tooltip's positioning was `cursor + (14, 14)` with no bounds check at all — guaranteed to clip whenever the cursor was near the wrap's right or bottom edge. This is a real, structural gap, not a tuning issue.
5. **Bug reproduction attempt for label clipping specifically:** panning via simulated mouse drag proved unreliable in this environment (consistent with a pattern noted earlier this session), so this was verified instead via zoom (which dispatches cleanly through d3-zoom's wheel handler) at multiple positions, plus direct DOM/attribute inspection — both are equally valid ways to get a node near the viewport edge, which is the actual condition being tested.

## Fixes

**1. Long-distance edge routing extended to same-row spans, not just cross-row.** `edgeControlPoint()` now also curves same/adjacent-row edges that span 2.5+ columns, bulging vertically (away from the row's own baseline) instead of only handling cross-row edges with a horizontal bulge. Cross-row bulge strength was also increased (cap 70→140, multiplier 18→26 per row) after the original values proved too subtle at the diagram's actual scale.

**2. Arrival-angle spreading for multi-edge nodes.** New `assignArrivalAngles()` runs once against the static layout: for every node, it collects every edge touching it, clusters angles that are within a minimum gap (13°) of each other, and redistributes each cluster evenly around its mean — then runs a few relaxation passes over the fully-spread set to catch residual collisions between *different* clusters that the first pass didn't (found live: one node still measured a 4.8° gap after per-cluster spreading alone; the relaxation pass brought the worst case across all 18 multi-edge nodes to 12.3°, essentially every other node landing at or above the 13° target). Edges are trimmed along this assigned angle rather than the raw tangent-to-control-point direction, which is what actually separates the arrowheads.

**3. Node-label viewport collision.** New `repositionNodeLabels()`, called on every zoom/pan/resize event: for each node, checks whether its label would overflow the left, right, or bottom edge and flips the anchor / shifts horizontally, or moves the label above the node instead of below, to compensate. Two bugs were found and fixed *during* this fix, both caught by live measurement, not assumed correct after writing the code:
   - A **fixed shift amount wasn't always enough** — one label, on a node with only ~3px of its own circle still inside the viewport, needed a larger shift than the constant provided and clipped by 11px anyway. Changed to compute the *exact* required shift (with a small buffer), using the larger of the exact requirement or the usual constant.
   - That exact-shift fix then created a **worse, new bug**: with no upper bound, a node far off-screen produced a huge computed shift that dragged its label all the way back into the visible viewport, disconnected from its actual (invisible) node, overlapping whatever real label was already there — visually worse than the original clipping. Fixed by hiding a label entirely once its node's own center is meaningfully off-screen (more than node-radius + 40px past any edge), rather than trying to rescue it. A node that's still reasonably on-screen (like the 3px-sliver case above) keeps the exact-shift treatment; a node that's genuinely gone doesn't get a label dragged across the canvas to compensate.

**4. Tooltip viewport collision.** The hover tooltip now checks its own cached dimensions (measured once per hover, not on every mousemove, to avoid forcing layout on a high-frequency event) against the wrap's bounds and flips from the cursor's bottom-right to whichever side actually has room, clamping near (not flipping past) the left/top edges where the cursor itself is already close.

**5. Click-based node detail panel — checked, not applicable.** This is a separate UI element from the hover tooltip: a right-docked, full-height sidebar (`selectedModelId`-driven), always in the same screen position regardless of which node was clicked. Structurally immune to this class of bug by construction — it doesn't position itself relative to the node at all. Confirmed via source reading, not just assumed.

**Files touched:** `src/components/mlgraph/MLRelationshipMap.jsx` only.

## Known residual limitation (found during verification, not fully resolved)

Fixing a label's viewport-edge clipping by shifting it toward its own node can, in a few cases, cause it to overlap an *adjacent* node's label that wasn't itself near an edge — confirmed live at two zoom positions ("Ridge / Lasso / Elastic Net" shifting into "Logistic Regression"'s space; "GARCH / ARCH" shifting into "VAR (Vector Autoregression)"'s space). This is a different, narrower problem than viewport clipping (general label-label collision avoidance across the whole scene, not just against the frame), out of scope for a viewport-bounds check and not one of the mission's explicitly named/verified requirements. It was deliberately not chased further: the explicit, checked requirement (no viewport clipping) was prioritized and is solid; a full neighbor-aware collision system would be materially more scope than a bounds check. Documented here rather than silently left out of the report.

## Verification (six-plus-position pan/zoom sweep, tooltip at all four edges, all four breakpoints)

Every check below was run against the live DOM via `getBoundingClientRect()`-based scripts (not eyeballed from a screenshot alone), with screenshots taken alongside as visual corroboration.

**Pan/zoom sweep — seven positions (one more than the required six), covering the full graph:**
1. Default fit-to-view — 0 clipped node labels, 0 clipped headers.
2. Zoomed in on the top-right corner (7 wheel steps) — 0 of 7 visible nodes' labels clipped, 0 of 6 visible headers clipped.
3. Zoomed in on the bottom-left corner (6 steps) — 0 of 14 visible nodes' labels clipped, 0 of 6 visible headers clipped.
4. Zoomed in on the bottom-right corner (6 steps) — 0 of 14 visible nodes' labels clipped, 0 of 6 visible headers clipped.
5. Deep zoom on the center (14 steps) — 0 of 6 visible nodes' labels clipped.
6. Zoomed on the far-right/widest row (9 steps, revealed 29 of 32 nodes) — 0 clipped labels.
7. Zoomed in on the top-left corner (8 steps) — 0 of 18 visible nodes' labels clipped, 0 of 9 visible headers clipped.

Also confirmed at every position: no straight edge crossing through an unrelated node (the same-row and cross-row curve fixes hold at every zoom/pan tested), arrowheads visibly separated at every multi-edge node checked.

**Tooltip at all four canvas edges** — not just labels, per the mission's explicit distinction: dispatched a hover + mousemove sequence to each of the four corners of `.mlgraph-canvas-wrap` (measured bounds: left 52, top 103, right 1280, bottom 720) and checked the tooltip's resulting `getBoundingClientRect()` against those bounds each time.
   - Top-left: no clip on any edge (default offset already clears it).
   - Top-right: flipped left of the cursor (tip right edge at 1261, inside the 1280 boundary) — no clip.
   - Bottom-left: flipped above the cursor (tip bottom at 701, inside the 720 boundary) — no clip.
   - Bottom-right: both flips applied simultaneously (left of and above the cursor) — no clip.
   Re-confirmed a second time after the node-label off-screen-hiding fix (which touched a different function) to make sure nothing regressed — still 0 clips at all four corners.

**Breakpoints — 360 / 768 / 1280 / 1920px**, each re-checked with the same live DOM script after resizing:
   - 360px: 18 visible nodes, 0 clipped labels, 8 visible headers, 0 clipped.
   - 768px: 32 visible nodes (whole graph fits), 0 clipped labels, 10 visible headers, 0 clipped.
   - 1280px: 30 visible nodes, 0 clipped labels, 10 visible headers, 0 clipped.
   - 1920px: 32 visible nodes, 0 clipped labels, 10 visible headers, 0 clipped.

**Console:** checked after every fix and at multiple pan/zoom/resize points throughout — 0 errors.

**Build/lint:** `npm run build` and `npm run lint` both clean (0 errors, 0 warnings) after every change in this pass, including after a lint warning surfaced mid-fix (`react-hooks(exhaustive-deps)` on the mount effect reading `lang`) — fixed properly via a ref rather than suppressed, since adding `lang` as a real dependency would have forced a full graph remount (losing pan/zoom/drag state) on every language toggle.

**Screenshots captured as evidence** at: default view, top-right zoom, bottom-left zoom, bottom-right zoom, deep-center zoom, far-right zoom, top-left zoom, and 1920px width — eight in total, all showing clean rendering with no clipped text, no orphan diagonals, and visibly separated arrowheads at converging nodes.

---

# Third Pass — Static audit: dormant angle-math bug + two dead icon classes

A general "find errors and corrupt code" audit, no bug report to start from. This environment has no display (no browser, no `getBoundingClientRect()`-style live DOM checks were possible), so the approach was necessarily different from the two passes above: `npm run build` / `npm run lint`, then a set of small purpose-built Node scripts that import the actual data/logic modules directly and check them programmatically, plus a full-codebase static sweep for known bug shapes from this project's own history (`bl()`/`blSame()` argument-count errors, JSX prop-name mismatches between a component's definition and its call sites). Everything reported below as "confirmed" was confirmed this way — by running real code against real data, not by reading and assuming — but nothing here was confirmed against an actual rendered page, which the two passes above could do and this one couldn't.

**Swept and found clean (no changes needed):** `npm run build`/`npm run lint` (0 errors/warnings, unchanged from before this pass); `ML_MODELS`/`ML_LINKS` referential integrity (32 unique ids, all 37 edges reference real ids, no dupes, no self-links, no isolated nodes, all `compass` values in range); `MODEL_DEPTH_LADDER`'s 32 entries against `ML_MODELS`' 32 ids (exact match both directions); every ladder's `mechanism.kind: 'widget'` entry — `compute` is genuinely callable and returns a finite number at `paramMin`/`paramDefault`/`paramMax`, `predict.correctIndex` is in range — and every `'live-link'` entry's `module` is a real `ML_TABS` id; every `bl()`/`blSame()` call in the whole `src/` tree (1207 calls, 115 files) has the right argument count (the exact bug class documented in this file's `d3b3ed4` fix — none has recurred); every locally-defined React component's JSX call sites against its own destructured prop names (102 components, 1456 call sites, 0 mismatches); `STORAGE_KEYS` (no colliding localStorage keys).

## D.1 — Model Map: wrong-direction edges at a node whose connections straddle due-west

**Confirmed via a standalone numeric test, not the live canvas (unavailable here).** `assignArrivalAngles()` in `MLRelationshipMap.jsx` (added in the previous pass, D.2 below) clusters edge-arrival angles per node and, when two clusters sit close enough across the `atan2` wraparound to merge, builds the merged cluster as `[...last, ...first]` and then averages the whole cluster's raw angle values a few lines later. `atan2` returns values in `(−π, +π]`, so two edges that both genuinely point roughly due **west** — one at, say, +178° (≈3.14 rad, sorts as the largest angle) and one at −178° (≈−3.14 rad, sorts as the smallest) — are numerically ~356° apart despite being geometrically ~4° apart. A plain `sum/length` average of −3.14 and 3.14 is ≈0 rad, i.e. due **east**: the opposite side of the node from where both edges actually go.

This is real, not hypothetical — extracted the exact patched function into a standalone script and fed it a synthetic node with two edges 8° apart, straddling the seam (one edge angled 2° above due-west, one 2° below): the pre-fix code assigned them 6.5° and −6.5° (due east); a live app hitting this would render both edges' lines trimmed to exit the node on its **east** side while curving back to control points on the node's actual (west) side — the line would visibly cut back across the node itself, the same "edge slices through a node" symptom D.2/B.1 below fixed for a different cause. It does **not** currently fire on this app's actual 32-node/37-edge Model Map — a script computing every real node's cluster angles from the live layout found zero nodes where two clusters are close enough across the seam to trigger the merge — so nothing is visibly broken in the shipped graph today. It's a real bug sitting dormant, one edge-list edit away from firing (exactly the kind of edit `docs/ML_MODE_README.md` invites — adding a model, an edge, or a 13th domain).

**Fixed:** before merging, the lower-sorting ("first") sub-cluster's angles are shifted by `+2π` so they sit numerically adjacent to the upper ("last") sub-cluster's instead of across the seam — `Math.cos`/`Math.sin` are 2π-periodic, so this changes which number represents a direction, not the direction itself. Re-ran the same synthetic two-edge case after the fix: angles came out 173.5° and 186.5° — both within the intended 13° spread of due-west, matching the geometry.

**Files touched:** `src/components/mlgraph/MLRelationshipMap.jsx` (comment-heavy fix, ~13 net new lines, `assignArrivalAngles()` only — `edgeControlPoint()`, the routing/curving logic, is untouched).

**Verification:** `npm run build`/`npm run lint` clean. The three programmatic checks from D.2 below (arrival-angle test-suite scan, `models.js`/`modelDepthLadder.js` integrity, `bl()`/prop-name/icon sweeps) all still pass after this change, confirming no regression. Before/after values for the synthetic wraparound case are quoted above; this is the extent of what could be verified without a browser in this environment — a live pan/zoom/click pass (the kind D.2/B.1 above did) would be a reasonable follow-up whenever this is next opened in an environment with one, especially after any future edit to `ML_MODELS`/`ML_LINKS`.

## D.2 — Two icon classes that don't exist in the loaded Tabler Icons build

**Confirmed by downloading the exact CDN stylesheet `index.html` loads (`tabler-icons.min.css` v3.44.0) and checking every `ti-*` class actually used in a `className` anywhere in `src/` against it.** A naive `grep -r 'ti-'` over-matches badly (`multi-model`, `multi-week`, `anti-conservative`, etc. all contain a `ti-xxxx`-shaped substring), so this was done properly: parsed every `.jsx`/`.js` file's AST, collected only `className` attribute values (including template-literal/ternary branches), extracted `ti-*` tokens from those, and checked each of the resulting 37 unique classes against the stylesheet's real `.ti-name:before` rules. 35 exist; 2 don't — an icon class that isn't defined renders nothing (the `.ti` base class still applies the icon font, but with no matching rule there's no glyph), so both were rendering as invisible/blank icons:

- `ti-shuffle` (`MixedReviewPanel.jsx`, the Mixed-Review header badge, mounted at the `MLBody.jsx` shell level — visible on every ML tab including Model Map) — no icon named exactly `ti-shuffle` exists in this set; the real one is `ti-arrows-shuffle`. Fixed by using the correct name.
- `ti-square-rounded-check-filled` (`MicroLabPage.jsx`'s `ToggleButton`, shown when `active` is true) — this build of Tabler Icons has `ti-square-rounded-check` (outline) but no `-filled` variant of it at all (checked: zero `-filled` icons of any kind exist in this stylesheet). The active/checked state of every toggle in Micro Lab was rendering with no icon — functionally fine (state is also carried by the `active` CSS class and `aria-pressed`) but visually indistinguishable from a still-loading icon. Fixed by switching to the real `ti-square-rounded-check`, which still visibly differs from the unchecked state's `ti-square-rounded`.

**Files touched:** `src/components/ml/learning/MixedReviewPanel.jsx`, `src/features/ml/micro/MicroLabPage.jsx` — one class-name string each.

**Verification:** re-ran the AST-based icon-class sweep after the fix — 0 missing classes (down from 2), all 37 now resolve. `npm run build`/`npm run lint` clean. Not independently confirmed by looking at the rendered glyph (no browser here); the check is that the exact class string used now has a matching `:before` rule in the exact stylesheet this app loads, which is what actually determines whether a glyph renders.

---

# Fourth Pass — Model Map: edges break when nodes are dragged

Reported live by the app's actual user, with screenshots, after the Third Pass shipped: dragging nodes around the Model Map left edges pointing at empty space / crossing at odd angles instead of following the dragged nodes, worse the more nodes were moved. Two independent bugs in `MLRelationshipMap.jsx`'s drag handling, both in code the Second Pass (structural layout fixes) added or depended on — neither was exercised by that pass's own verification sweep, which checked pan/zoom/tooltip/label collision at rest, not dragging one node and then another.

## E.1 — Edges to a previously-dragged node stayed anchored to its ORIGINAL position

**The dominant bug, confirmed by a data-model reproduction (no browser in this environment — see Third Pass's note on what static/scripted checks can and can't confirm here).** `simLinks` were built as `ML_LINKS.map((l) => ({ ...l, source: positions[l.s], target: positions[l.t] }))` — `source`/`target` pointed at `positions[id]`, the objects from the one-time static `computeHierarchicalLayout()` call. Separately, `simNodes` were built as `ML_MODELS.map((n) => ({ ...n, ...positions[n.id] }))` — a **new, different object per node**, merging in the position values rather than sharing the reference. The drag handler mutates a node's position by setting `d.x`/`d.y` directly on its own datum (one of the `simNodes` objects) — which is a completely different object from `positions[id]`/`l.source`/`l.target`, so that mutation was invisible to any link's `source`/`target`. The drag handler worked around this for the *currently* dragged node only, by special-casing `d.id` and reading `d.x`/`d.y` directly instead of `l.source.x`. It had no such workaround for a link's *other*, non-dragged endpoint — so dragging node A, then separately dragging its neighbor B, redrew the A–B edge using A's stale original `positions['A']` coordinates, not wherever A had actually been dragged to. The edge would render anchored to empty space rather than to A's visible (moved) position — worse with every additional node dragged, since each one leaves more links pointing at coordinates nothing is at anymore. Reproduced directly against this app's real `ML_MODELS`/`ML_LINKS` data: built `simNodes`/`simLinks` exactly as the old code did, mutated a dragged node's datum, and confirmed the linked edge's `source.x`/`source.y` did not change at all — stayed at the pre-drag value.

**Fixed:** index `simNodes` by id (`nodeById`) and point every link's `source`/`target` at those same objects instead of `positions[id]`. Now any node's `d.x = event.x` mutation (during ITS OWN drag) is visible through every link that references it, whether that link's redraw happens during that same drag or later, when a *different*, connected node is dragged. This also let the drag handler's per-edge redraw callback drop its `l.s === d.id ? d.x : l.source.x`-style special-casing entirely — `l.source.x`/`l.target.x` are now simply always current. Re-ran the same reproduction after the fix: the linked edge's `source.x`/`source.y` now update immediately when the referenced node's datum is mutated, confirmed via direct object-identity (not just equal values — literally the same reference).

**Files touched:** `src/components/mlgraph/MLRelationshipMap.jsx` (the `simNodes`/`simLinks` construction, ~10 net new lines; the drag handler's per-edge callback, simplified by ~4 lines).

## E.2 — The dragged node's OWN edges exited it at a stale, pre-drag angle

**Confirmed via a standalone extraction + synthetic before/after (same method as Third Pass's D.1, same reason a browser check wasn't available).** The drag handler's per-edge redraw passed each link's cached `_sAngle`/`_tAngle` (set once, before any dragging, by `assignArrivalAngles()` — see the Second Pass) straight through to `edgePathD()` regardless of whether the node just moved. `edgePathD` uses that angle to decide exactly where on the node's circle the line is trimmed to start/end; the angle was measured from the node's *original* position relative to its *original* control point, and stops meaning anything once the node — and therefore the live control point `edgeControlPoint()` recomputes every call — has moved elsewhere. The result: the line's trimmed endpoint sat wherever the stale angle pointed (frequently a location bearing no relation to the node's new position or the curve it's supposed to smoothly join), while the curve's control point *did* correctly track the drag — so the two disagreed, producing a visible kink or a line that looked like it missed the node entirely.

Quantified with a synthetic case: a node with a same-row neighbor (originally cached at a 0°/due-east departure angle) dragged straight up and away. Before the fix, the line exited the node's circle at 0.0° while the node's live control point sat at 39.3° from the node's center — a 39.3° mismatch. After the fix, both are 39.3° — a 0° mismatch, i.e. the line now always departs the node facing wherever it actually connects to, at any drag position.

**Fixed:** in the drag handler's per-edge callback, pass `null` instead of the cached angle for whichever endpoint is the node currently being dragged (`l.s === d.id ? null : l._sAngle`, symmetrically for `_tAngle`) — `edgePathD` already has a tangent-based fallback for a null angle (`trimTowardPoint`, toward the live control point), previously only used for nodes with a single edge. The *other*, stationary endpoint keeps its assigned angle, so it doesn't lose its spread-apart-from-neighbors treatment just because something on the other end of one of its edges is being dragged.

**Files touched:** `src/components/mlgraph/MLRelationshipMap.jsx` (the drag handler's per-edge callback only, ~13 net new lines, comments included).

**Verification (both E.1 and E.2):** `npm run build`/`npm run lint` clean (0 errors/warnings). All five static/data-model checks from the Third Pass re-run clean after this change (`ML_MODELS`/`ML_LINKS` integrity, `MODEL_DEPTH_LADDER` completeness, `bl()`/`blSame()` argument counts across all 1207 call sites, JSX prop-name matching across all 1456 component usages, Tabler icon-class existence). Both bugs' before/after numbers are quoted above and are reproducible by re-running the same extraction scripts. **Not verified against the actual running app** (no browser available in this environment, per the Third Pass's own note) — the reporting user is best positioned to confirm the drag interaction now looks correct live, ideally dragging several connected nodes in sequence (not just one), which is the specific scenario E.1 didn't handle before.
