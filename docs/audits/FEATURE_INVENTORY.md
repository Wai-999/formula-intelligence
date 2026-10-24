# Feature Inventory — Phase 0

Baseline: `d1d0ce1`. Disposition key: **Keep** (stays, possibly re-homed in the new IA) · **Rehome** (content preserved, moves into lessons; its top-level tab goes) · **Archive** (code kept out of navigation until reused) · **Remove** · **Decide** (needs the owner).

## 1. Surfaces

### Stats mode — 9 tabs (`src/store/useUIStore.js` `TABS`)
| Tab id | Surface | Disposition → V3.1 IA (§3) |
|---|---|---|
| `map` | 94-formula relationship map, 13 chapters, detail panel | Keep → **Knowledge Maps › Formula Map** (needs keyboard path + outline view, F-04) |
| `path` | Learning paths / tracks | Keep → **Learn** (becomes the course/unit spine) |
| `story` | Story Walk narratives | Keep → **Learn** (applied lessons) |
| `flashcards` | SM-2 spaced repetition | Keep → **Practice** (review queue) |
| `quiz` | Quiz | Keep → **Practice** |
| `dashboard` | Mastery, XP, badges | Keep → **Progress** (spec §2: remove streak pressure / noisy badges — review in Phase 2) |
| `practice` | Generated practice problems | Keep → **Practice** |
| `errors` | Error log | Keep → **Progress** |
| `journal` | Journal / Feynman notes | Keep → **Notebook** |

### ML mode — 11 tabs (`src/store/useMLUIStore.js` `ML_TABS`)
| Tab id | Surface | Disposition |
|---|---|---|
| `pipeline` | 7-stage ML pipeline, estimation/prediction/causal | Keep → **Learn › Machine Learning** |
| `modelmap` | 32-model relationship graph | Keep → **Knowledge Maps** |
| `python` | Python Hub, 126 samples | Keep → **Practice / Projects** |
| `pylab` | Python Lab (learner notebooks) | Keep → **Projects** |
| `sources` | Sources & data provenance | Keep → reference page (not primary nav) |
| `playground` | Bias–variance lab (poly/tree fit, overfitting) | **Rehome** → ML lesson "Bias–variance & regularization" (spec §4 bullet 2) |
| `evaluation` | Metrics w/ margins, walk-forward backtest, SHAP/LIME, concept drift | **Rehome** → ML lessons "Validation & leakage", "Metrics & uncertainty", "Interpretability", "Drift" (spec §4 bullet 1) |
| `gold` | Gold forecasting lab | **Archive** (spec §4 bullet 3) — reusable: `DriverPanel`, `ForecastBandChart`, `TracePanel`, `PredictGate` |
| `macro` | GDP nowcasting lab | **Archive** |
| `micro` | Demand / pricing lab | **Archive** |
| `politics` | Election + geopolitical-risk lab | **Archive** |

`bridge` (Stats↔ML) was removed before this audit; its deep link is already broken (BASELINE F-03).

## 2. Deletion test — legacy route map (acceptance test 1)

Every saved/bookmarked destination must resolve. Proposed resolution rules, to be enforced by one validated route table (replacing the unvalidated `hashRoute.js` parse):

| Legacy hash / saved `mlActiveTab` | Resolves to | Notes |
|---|---|---|
| `#ml/bridge` | `#ml/pipeline` + notice "Stats ↔ ML comparisons now live in the lessons" | broken today |
| `#ml/playground` | ML lesson: Bias–variance (until it exists: `#ml/pipeline`) | |
| `#ml/evaluation` | ML lesson: Validation & metrics (until it exists: `#ml/pipeline`) | |
| `#ml/gold`, `#ml/macro`, `#ml/micro`, `#ml/politics` | `#ml/pipeline` + one-time notice that domain labs were retired | |
| any unknown `#ml/<x>` | `#ml/pipeline` | today: blank page |
| any unknown `#stats/<x>` | `#stats/map` | today: blank page |
| persisted `mlActiveTab` (in-memory today, but hash restores it) | same rules | |

### Inbound links that must be rewritten before the tabs go
| Source | References | Count |
|---|---|---|
| `src/data/ml/modelDepthLadder.js` — "try it live" mechanism links | gold ×5, macro ×2, micro ×2, playground ×2 | 11 |
| `src/data/learningTracks.js` — track items | evaluation ×2, playground, macro, gold, politics | 6 |
| `src/data/ml/provenance.js` — Sources page "open" buttons | gold, macro, micro, politics | 4 |
| `src/data/ml/mixedReview.js` — interleaving questions | **all 6** require ≥2 domain-lab visits | 6 |
| `src/features/ml/politics/PoliticsLabPage.jsx:120` — geo-risk → Gold cross-link | gold | 1 |
| `src/lib/hashRoute.js`, `src/hooks/useGlobalShortcuts.js`, `src/components/layout/MLIconRail.jsx` | generic tab ids | — |
| `scripts/a11y-audit.mjs:24` | `'Gold'` | 1 |
| `src/data/python/pyMLUnsupTs.js` | string mention | review |

**False positives — do NOT change:** `'gold'` in `useMasteryStore.js:14`, `NavSidebar.jsx:36`, `JournalPage.jsx:18,24,27,205,245` is the **"Feynman-verified" mastery state**, not the tab. A find-and-replace on the id would corrupt mastery tracking.

**Feature orphaned by removal:** Mixed-Review interleaving (`MixedReviewPanel` + `mixedReview.js`) is driven solely by `domainsVisited` of the four domain labs. Removing the labs leaves it permanently hidden. It must be re-sourced (e.g. interleave across rehomed ML lessons and Stats units) or explicitly retired.

## 3. Persistence inventory (`src/data/storageKeys.js`)

All `localStorage`, JSON via `src/lib/storage.js` (parse errors caught; wrong shapes not). No in-value schema version anywhere.

| Key | Owner | Crash on malformed? (BASELINE §4) |
|---|---|---|
| `bluman_sr_v1` | `useSRStore` — spaced-repetition cards | yes (`null`) |
| `bluman_quiz_v1` | quiz stats | yes (`null`) |
| `bluman_sessions_v1` | session history | yes (string, `null`, future) |
| `bluman_visits_v1`, `bluman_session_v1` | visit/session counters | not tested |
| `bluman_lp_v1` | learning path | no |
| `bluman_sw_v1` | story walk | no |
| `bluman_recall_v1`, `bluman_recallstats_v1` | recall | not tested |
| `bluman_prac_v1` | practice score | not tested |
| `bluman_errlog_v1` | error log | yes (string, `null`, future) |
| `bluman_journal_v1` | journal | yes (string) |
| `bluman_jtarget_v1` | journal target — **read/written directly via `localStorage`**, bypassing `storage.js` (`useJournalStore.js:7,15`) | not tested |
| `feynman_<nodeId>` (prefix) | per-node Feynman text | not tested |
| `ml_mode_prefs_v1` | `{ level, lang }` — **depth and language share one record** | yes — `null` blanks all ML |
| `ml_understanding_v1` | Understanding Tracker, predictions, `domainsVisited` | yes — blanks all ML |
| `ml_entry_banner_seen_v1` | one-time banner flag | no |
| `py_lab_v1` | learner Python notebooks (capped) | no |
| `fi_theme_v1` | `'dark' \| 'light'` | no |

## 4. Bilingual layer (English-only migration scope)

| Measure | Count |
|---|---|
| `bl(enB, enR, myB, myR)` constructors | 305 calls / 18 files |
| `blSame(en, my)` constructors | 820 calls / 20 files |
| `useT(...)` resolution sites | 307 calls / 40 files |
| `resolveT(...)` call sites | 27 / 11 files |
| Source lines containing Myanmar script | 1,252 / 17 files |
| UI: `LevelLangToggle` (EN/မြန်မာ buttons) | 1 component, in ML shell header |

Depth (beginner/researcher) is genuinely forked in the 305 `bl()` calls and must survive the language removal (spec §4 last bullet).

## 5. Reusable assets worth preserving

- **Learning Design System components** — `DepthLadder`, `PredictGate` (predict-before-reveal, spec §6.6), `MisconceptionCallout`, `RetrievalCheck`, Understanding Tracker. Directly reusable by the new lesson renderer.
- **Content validation script** (`scripts/validate-content.mjs`) — basis for spec §7's graph integrity checks.
- **Hierarchical layout** (`src/components/graph/hierarchicalLayout.js`) — shared by both graphs.
- **SM-2 scheduler** (`useSRStore`) — a documented, testable method (spec §8) once its behavior is pinned by tests.
- **Error boundaries** around every lazy tab, outside `Suspense`.
- **Unshipped redesign patch** — `formula-intelligence-app/_ai-workspace/patches/redesign-phase-0-2.patch` (motion tokens, `ContextBar`, `PrimaryNavigation`, +1.4 KB gzip, 29 e2e tests). Motion tokens and reduced-motion handling align with spec §10; its navigation does not match spec §3. See MIGRATION_RISKS R-01.

## 6. Dependencies

| Package | Status |
|---|---|
| `framer-motion` ^12 | In `package.json`, **imported nowhere** — 0 bytes shipped. The redesign patch already removes it. |
| `d3` ^7 | Used (graphs, charts). |
| `zustand` ^5 | All state. |
| External: Tabler icons (cdnjs CSS) | Render-blocking, third-party, breaks offline. |
| External: Pyodide 0.28.3 (jsDelivr) | Lazy; no SRI. |
