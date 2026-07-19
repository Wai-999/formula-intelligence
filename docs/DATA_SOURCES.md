# Data Sources — ML Mode

Every number, claim, and comparison shown anywhere in ML mode traces back to exactly one of two places:

1. **`docs/research/ML-Research-Reference.md`** — a research document compiled July 18, 2026, cited in-app via `<MLCitation section="N" />` (rendered as "Source: ML-Research-Reference.md §N").
2. **Illustrative/synthetic data**, disclosed in-app via `<MLCitation synthetic />` (rendered as "Illustrative data, calibrated to real-world patterns").

There are no other sources. **ML mode makes zero live API calls, ever** — no fetch to a market data provider, no polling service, no external network request of any kind. Every figure is a value frozen into the source code at build time. This is a deliberate constraint from the mission this build was executed under (Section C.4: "all data static/synthetic-and-labeled-as-such"), not a missing feature — a forecasting-lab teaching tool that quietly called a live price feed would misrepresent itself as more current, and more authoritative, than a static teaching example should claim to be.

If you are reading this after July 18, 2026 and using this app to reason about actual current gold prices, actual current GDP nowcasts, or an actual election: **don't.** Every "current" figure below was current on the date the research doc was compiled and has not been updated since.

## How to tell which is which, on any given screen

Every section of every ML page ends with a citation line. There are only two forms it ever takes:

- `Source: ML-Research-Reference.md §N` — the number(s) or claim(s) just above are traceable to that document's section N.
- `Illustrative data, calibrated to real-world patterns` — everything just above is a synthetic value chosen to demonstrate a *mechanism* the doc describes, not a real reported figure.

A single page section can cite a real figure for context and then immediately disclose synthetic driver coefficients for the interactive part — that's intentional, and each half is labeled independently. See the module-by-module breakdown below for exactly where that split falls.

## Module-by-module breakdown

### Module 2 — Pipeline (`src/data/ml/pipeline.js`, `estimationPredictionCausal.js`)
- **Real (§1, §2):** the seven pipeline stages themselves, their descriptions, and the estimation/prediction/causal-inference comparison table (goal / typical output / method family / failure mode per lens) are the doc's actual content, not paraphrased around synthetic numbers.
- **Synthetic:** the worked example threaded through the pipeline stages ("real yields move gold by roughly −312") and the regression coefficient (β = −312, 95% CI [−400, −224]) used to illustrate Estimation vs. Prediction — chosen to be plausible and directionally consistent with §6.1's real gold/real-yields relationship, not itself a reported statistic.

### Module 3 — Model Map (`src/data/ml/models.js`)
- **Real (§3, §4):** almost entirely doc-sourced. Every model's advantages/weaknesses/usage-area text, every family grouping, every edge (extends/competes/combines) between models, and the four Model Selection Compass axes are the doc's actual catalog (§3.1–§3.10) and its explicit relationship notes (§7, point 2). This is the one module where the content *is* the citation — there is very little to label synthetic because there's very little invented here.

### Module 4 — Playground (`src/data/ml/playground.js`)
- **Fully synthetic**, and correctly so — this module is a generic bias-variance sandbox (polynomial/tree fit against an adjustable-noise dataset), illustrating a general ML concept the doc discusses only in passing, not a real-world domain claim. Every dataset point is generated at runtime from a seeded PRNG (`src/lib/mlSandbox.js`); nothing here has or needs a §-citation.

### Module 5 — Evaluation (`src/data/ml/evaluation.js`)
- **Real (§5):** the definitions of MAE/RMSE/MAPE/R²/AIC/BIC, the walk-forward-vs-naive-split validation argument, and the SHAP-vs-LIME (global-vs-local explanation) distinction are the doc's actual content.
- **Synthetic:** the metrics panel scores the Playground's synthetic fit, not a real forecast. The SHAP feature-importance bars and the LIME single-prediction breakdown use an illustrative gold-forecast example (feature names match Module 6's real driver set so it previews that lab, but the importance percentages and the $4,020→$4,287 prediction are invented for the demonstration).

### Module 6 — Gold (`src/data/ml/domains/gold.js`)
- **Real (§6.1):** the current spot-price range ($4,000–$4,030/oz), the named banks' 2026 targets (Goldman Sachs ≈$5,800, JPMorgan ≈$5,500, UBS $6,000+), the five-driver feature set itself (real yields, DXY, inflation/Fed path, geopolitical risk, central bank demand), and the qualitative behavior of each of the four model families (ARIMA/LSTM/XGBoost/GARCH) as described in the literature.
- **Synthetic:** `GOLD_BASE_PRICE` (4015, the midpoint of the cited range) and `GOLD_BASE_BAND` (90) are derived from the real range but are themselves a chosen simulation baseline, not a reported point estimate. Every driver's coefficient (e.g. real yields: −180) is illustrative — calibrated so each driver's *direction* matches the doc exactly, but the magnitude is for teaching the shape of the relationship, not a real fitted model.

### Module 7 — Macro (`src/data/ml/domains/macro.js`)
- **Real (§6.2):** the information-gap/nowcasting concept itself, the three cited findings (DFM gives the best backcasts; Random Forest is most accurate for nowcasts/inflation specifically; LASSO/Elastic Net often outperforms both when data is rich) — each is reflected directly in a model's note text and in `MACRO_SIMPLICITY_CALLOUT`.
- **Synthetic:** `MACRO_BASE_VALUE` (2.1% annualized GDP growth) and `MACRO_BASE_BAND` (0.6pp) are illustrative — the doc gives no specific nowcast figure to cite the way it does Gold's spot price — as are all five driver coefficients (yield curve, survey sentiment, labor market, mobility/activity, trade/freight).

### Module 8 — Micro (`src/data/ml/domains/micro.js`, `src/features/ml/micro/demandModel.js`)
- **Real (§6.3):** the qualitative claim itself — ML-based elasticity models (gradient boosting, deep feed-forward nets) outperform classic log-log regression by capturing promotions, seasonality, and nonlinear/non-monotonic price effects that the econometric baseline assumes away.
- **Synthetic, entirely:** §6.3 states the *mechanisms*, not a reference product or a reported elasticity value, so every number in `MICRO_REFERENCE` (reference price $14.99, reference quantity 500 units/week, elasticity 1.8, saturation cap 900, charm threshold $15.00, promo/season boosts) is illustrative by necessity, disclosed in the file's own header comment.

### Module 9 — Politics (`src/data/ml/domains/politics.js`, `src/features/ml/politics/politicsModel.js`)
- **Real (§6.4):** the modeling *approach* — a dynamic hierarchical Bayesian framework blending national/state polls with structural "fundamentals," reweighted as an election nears (the real mechanism behind models like The Economist's) — and the geopolitical-risk-index concept (structured country data + NLP-derived sentiment blended into one score).
- **Synthetic, entirely:** `ELECTION_REFERENCE` (max 180 days, credible-interval width shrinking from 22pp to 3pp) and `GEO_REFERENCE` (baseline 50/100, military/diplomatic/sanctions weights) are illustrative — there is no real election or real country risk score behind either meter.

### Module 10 — Bridge (`src/data/ml/bridge.js`)
- **Real:** the two comparisons' *structure* — that a regression coefficient means something different read as an in-sample Stats parameter vs. a held-out-evaluated ML weight; that a frequentist confidence interval and a Bayesian credible interval can be numerically identical under a weak prior while meaning something philosophically different — are the doc's actual conceptual content (§2, §6.4).
- **Synthetic:** both worked examples (8 students' study-hours-vs-score; 40 commuters' average commute time) are invented, disclosed in the file's own header comment. The doc supports the mechanisms being illustrated, not a specific study to cite numbers from.

## A known inaccuracy in the source document itself

`ML-Research-Reference.md` §3.9 and §7 (point 5) both claim the Bayesian ML content is "the *direct* ML-side sibling of your existing Gibbs/PGAS Stats content" and "architecturally very close to your existing Bayesian/Gibbs-sampling Stats content." **This is false.** `src/data/nodes.js` (Stats mode's own formula data) has no Gibbs sampling or PGAS content anywhere — verified directly by grep, not assumed. What Stats mode actually has is Chapter 7's t-distribution confidence interval for the mean (`ci_mean_t`) and Chapter 10's regression toolkit (`reg`/`pearson`/`r2`/`se_est`/`pred_int`), which is what Module 10's Bridge and every cross-link into Stats mode actually use.

This false claim had already been copied from the doc into three places before it was caught (`EstimationDemo.jsx`'s displayed paragraph, `estimationPredictionCausal.js`'s "Method family" cell, `models.js`'s BSTS/Bayesian-NN usage-areas field) — all three were corrected during Module 10 to reference the real `ci_mean_t` content instead. The research doc itself was left as-is; this file is the correction record.
