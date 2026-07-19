# Machine Learning Research Reference

### For the Formula Relationship Map — ML Mode

*Compiled July 18, 2026\. Sources listed at the end of each major section.*

This document organizes deep research on machine learning into the shape needed for a visual "ML mode" companion to your existing Stats page: the ML pipeline (with estimation and prediction treated as the conceptual bridge to Stats), the full model catalog with advantages/weaknesses/usage areas, and four real-world forecasting domains — Gold, Macro, Micro, and Politics.

---

## 1\. The ML Pipeline: From Data to Decision

Every ML system moves through the same seven stages, whether it's predicting gold prices or classifying emails. This sequence is the natural skeleton for an "ML Pipeline Visualizer" module.

| \# | Stage | What happens | Key question it answers |
| :---- | :---- | :---- | :---- |
| 1 | **Problem framing** | Decide regression (continuous number, e.g. gold price), classification (category, e.g. recession/no recession), or forecasting (sequential, time-indexed) | "What kind of answer am I trying to produce?" |
| 2 | **Data collection** | Pull from APIs, databases, scraped sources, statistical agencies (FRED, IMF, World Gold Council, polling aggregators) | "What evidence do I have?" |
| 3 | **Data preparation** | Clean missing values/outliers, align frequencies (daily price vs. quarterly GDP), normalize/scale | "Is the evidence usable?" |
| 4 | **Feature engineering** | Build lags, rolling averages, technical indicators, macro spreads, sentiment scores | "What signals might explain the target?" |
| 5 | **Estimation (training/fitting)** | The model's internal parameters are *estimated* from historical data | "What did the data teach the model?" |
| 6 | **Prediction (inference)** | The fitted model is applied to new/unseen inputs to generate an output | "What does the model say will happen next?" |
| 7 | **Evaluation → Deployment → Monitoring** | Score accuracy, ship the model, watch for drift, retrain | "Is it still right, and for how long?" |

For time series specifically (gold, GDP, elections are all time-indexed), step 4 also requires **no shuffling** — train/validation/test splits must respect chronological order, and validation should use **walk-forward (rolling-origin) backtesting** rather than a single random split, otherwise the model "sees the future" during training and accuracy looks artificially good.

**Sources:** [GeeksforGeeks — ML Pipeline](https://www.geeksforgeeks.org/blogs/machine-learning-pipeline/) · [IBM — ML Pipeline](https://www.ibm.com/think/topics/machine-learning-pipeline) · [Evaluating Time Series Forecasts — Cross-Validation](https://medium.com/@sumeyyesahinsavaskan/evaluating-time-series-forecasts-a-clear-guide-to-metrics-and-cross-validation-468949d4c995)

---

## 2\. Estimation vs. Prediction vs. Causal Inference — the Stats↔ML Bridge

This distinction is the single most important conceptual hinge between your existing Stats mode and the new ML mode. It deserves to be a first-class, explicit module — not a footnote.

|  | Estimation (classic Stats territory) | Prediction (classic ML territory) | Causal Inference (the third, often-confused sibling) |
| :---- | :---- | :---- | :---- |
| **Goal** | Infer the true value of a fixed but unknown *parameter* (a coefficient, a mean, a variance) from a sample | Guess the value of a *random, currently-unobserved* outcome | Determine what a variable's value *would have been* under a hypothetical intervention |
| **Typical output** | A parameter estimate \+ standard error / confidence interval | A point forecast \+ prediction interval | An average treatment effect |
| **Example** | "The coefficient on real yields in a gold-price regression is −312, 95% CI \[−400, −224\]" | "Gold will trade at $4,180 ± $150 next month" | "If the Fed cuts rates by 50bps, gold rises by X, holding everything else fixed" |
| **Method family** | OLS, Maximum Likelihood Estimation (MLE), Bayesian posterior estimation (Gibbs/PGAS — your existing Stats page) | Regularized regression, trees/ensembles, neural nets, any loss-minimizing algorithm | Potential-outcomes framework, instrumental variables, double ML, RCTs |
| **Failure mode if confused** | Mistaking a tight confidence interval for a guarantee about a *future* value | Mistaking a highly predictive feature for a *causal* driver (ML "dismisses" covariates with low predictive power even when they're crucial confounders) | Using purely predictive ML models to claim "X causes Y" — correlation ≠ causation |

**Why this matters for the mode switch:** the same underlying object (say, "linear regression on gold price vs. real yields") can be looked at two ways — the *Stats* lens asks "how confident am I in this coefficient, and is it statistically significant?" while the *ML* lens asks "how well does this generalize to gold prices next quarter that the model has never seen?" A well-designed mode switch should let a learner flip between these two questions on the *same* formula/model node.

**Sources:** [Estimation, Prediction and Forecasting — TDS](https://medium.com/data-science/estimation-prediction-and-forecasting-40c56a5be0c9) · [Petamind — Predictor vs Estimator](https://petamind.com/predictor-vs-estimator-quick-note/) · [Inference vs Predictive Models](https://medium.com/thedeephub/inference-causal-vs-predictive-models-6546f814f44b) · [Why ML Is Not Made for Causal Estimation](https://towardsdatascience.com/why-machine-learning-is-not-made-for-causal-estimation-f2add4a36e85/)

---

## 3\. Model Catalog — Advantages, Weaknesses, Usage Areas

Organized by family. This table is the content backbone for the "Formula Relationship Map — ML" visual graph (each row \= one node).

### 3.1 Linear & Regularized Models

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **Linear Regression** | Simple, fast, fully interpretable coefficients; cheap to estimate | Assumes linearity; sensitive to outliers and multicollinearity | Baseline for any driver-based forecast (e.g., gold vs. real yields \+ DXY) |
| **Ridge / Lasso / Elastic Net** | Handles many correlated macro features without overfitting; Lasso does automatic feature selection | Requires tuning the penalty strength; coefficients biased toward zero | High-dimensional macro nowcasting — often *beats* fancier ML in GDP/inflation nowcasting |
| **Logistic Regression** | Interpretable probabilities; strong baseline for binary events | Only linear decision boundary (in log-odds space) | Recession-probability models, "will the incumbent win" binary election models |

### 3.2 Instance-Based & Probabilistic

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **K-Nearest Neighbors (KNN)** | Simple, no training phase, captures local nonlinearity | Slow at prediction time on large data; degrades in high dimensions ("curse of dimensionality"); needs feature scaling | Finding "similar historical regimes" (analog forecasting) |
| **Naive Bayes** | Very fast; works well on text; needs little data | Assumes feature independence (often false) | News/sentiment classification for geopolitical or market-mood signals |

### 3.3 Tree-Based Models & Ensembles

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **Decision Tree** | Fully interpretable, handles nonlinearity and mixed data types, fast | Low accuracy alone; prone to overfitting; unstable (small data changes → different tree) | Explaining a single forecast's logic to a non-technical audience |
| **Random Forest** (bagging) | Reduces overfitting via averaging; robust defaults; good with little tuning; ranks feature importance | Less interpretable than a single tree; large model size; among the *most accurate* methods for macro nowcasting and inflation forecasting in recent studies | GDP/inflation nowcasting, gold-driver importance ranking |
| **Gradient Boosting (general)** | Sequentially corrects errors → typically higher accuracy than bagging | More prone to overfitting/variance; needs careful tuning; slower to train than RF | Structured/tabular forecasting problems generally |
| **XGBoost** | Mature, stable, extremely well documented; strong enterprise default; fast with regularization built in | Many hyperparameters; can overfit small datasets without care | Gold price prediction (frequently top performer with SHAP explainability), retail demand forecasting |
| **LightGBM** | Fastest training on large datasets (histogram-based splitting) | Can overfit on small data; sensitive to parameter choices | Large panel datasets, high-frequency financial features |
| **CatBoost** | Best native handling of categorical variables; often best generalization/AUC in comparative studies | Slower to train than LightGBM | Datasets with many categorical macro/political variables (country, regime type, party) |
| **Bagging (general)** | Reduces variance, parallelizable | Does **not** reduce bias — a bad base learner stays bad on average | Stabilizing noisy, high-variance base models |
| **Boosting (general)** | Reduces bias, often the most accurate single-model family | Prone to overfitting/variance if unchecked; sequential \= slower to train | Whenever maximum predictive accuracy is the goal and overfitting is monitored |
| **Stacking** | Combines heterogeneous models (e.g., ARIMA \+ XGBoost \+ LSTM) for the best overall accuracy | Most compute- and complexity-expensive; harder to explain | Flagship "ensemble of everything" forecasts (e.g., final gold-price consensus module) |

### 3.4 Support Vector Machines

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **SVM / SVR** | Effective in high dimensions; robust to outliers (only support vectors matter); memory-efficient | Poor scaling to large datasets; struggles with noisy/overlapping classes; kernel choice is fiddly | Medium-sized, high-dimensional classification (e.g., crisis/no-crisis regime classification) |

### 3.5 Unsupervised Learning

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **K-Means Clustering** | Fast, simple, scalable | Must pre-specify number of clusters; assumes spherical clusters | Segmenting historical market "regimes," country clustering for political risk |
| **Hierarchical Clustering** | No need to pre-specify cluster count; produces interpretable dendrogram | Computationally expensive at scale | Building the *visual relationship map itself* (grouping related models/formulas) |
| **PCA (dimensionality reduction)** | Compresses many correlated macro series into a few "factors"; reduces noise | Components lose direct interpretability; loses some information | Feeding a Dynamic-Factor-Model-style "common macro factor" into both Stats and ML views |

### 3.6 Classical Time-Series / Econometric Models

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **ARIMA / SARIMA** | Strong theory, fast, often lowest error on stable/linear series; highly explainable | Assumes linearity & stationarity; struggles with structural breaks and missing data; manual tuning (p,d,q) is time-consuming | Short-horizon macro series with clear trend/seasonality |
| **VAR (Vector Autoregression)** | Captures feedback *between* multiple series (e.g., gold ↔ DXY ↔ real yields jointly) | Parameters grow quickly with more variables ("curse of dimensionality"); needs stationarity | Multi-variable macro systems — natural econometric sibling of your DFM content |
| **GARCH / ARCH** | Purpose-built for volatility clustering (calm/turbulent regimes); improves confidence-interval realism | Choosing the estimation window is contested — too long dilutes recent regime, too short is noisy | Gold/FX/equity volatility forecasting, VaR risk models — pairs naturally with your Stats page's stochastic-volatility content |
| **Exponential Smoothing / Holt-Winters** | Very fast, intuitive, good for trend+seasonality | Weaker with irregular shocks or structural change | Quick operational forecasts, baseline comparisons |

### 3.7 Modern Applied Time-Series Tools

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **Prophet** | Extremely quick to deploy; handles sparse/missing seasonal data gracefully; built-in holiday effects | Consistently *less accurate* than ARIMA/LSTM/XGBoost in comparative studies; struggles with short-term fluctuations | Fast baseline dashboards, non-expert users |
| **Hybrid statistical+ML (e.g., ARIMA-residual → XGBoost/LSTM)** | Combines linear-trend strength of econometrics with nonlinear pattern-capture of ML; statistically significant accuracy gains over either alone | More moving parts, harder to maintain/explain | Flagship gold/commodity/crypto forecasting pipelines — an ideal "Stats \+ ML working together" teaching module |

### 3.8 Deep Learning

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **RNN (vanilla)** | Purpose-built for sequences; captures temporal state | Vanishing/exploding gradients on long sequences; slow, hard to parallelize | Short-sequence pattern learning |
| **LSTM / GRU** | Best-in-class for complex nonlinear \+ seasonal patterns given enough data; handles multivariate inputs well; frequently the most accurate on gold-price studies | Needs large data and careful architecture tuning; long training time; "black box" | Gold price, crypto, multivariate macro-financial series with rich history |
| **CNN (1D, for sequences)** | Good at local pattern/motif detection; parallelizable | Not natively suited to long-range temporal dependency | Feature extraction step before an LSTM/Transformer (hybrid CNN-LSTM) |
| **Transformer / Temporal Fusion Transformer (TFT)** | Attention weights are interpretable (shows *which* past periods/features mattered); handles static \+ known-future \+ observed inputs together; highly parallelizable | Data-hungry, compute-expensive; recent studies show it does **not consistently beat** simpler LSTM/BiLSTM baselines despite the added complexity | Multi-horizon forecasts needing built-in interpretability (e.g., "why did the 6-month gold forecast move?") |

### 3.9 Bayesian Machine Learning

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **Gaussian Processes** | Closed-form uncertainty; fits a huge range of nonlinear functions; excellent for small data | Computationally expensive at scale (cubic in data size) | Small-sample forecasting with rigorous uncertainty bands |
| **Bayesian Structural Time Series / Bayesian NNs** | Full posterior uncertainty, not just point estimates; mitigates overfitting by treating weights as distributions; superior in studies on both accuracy *and* uncertainty quantification over long horizons | Slower to fit (sampling-based); more complex to implement | This is the *direct* ML-side sibling of your existing Gibbs/PGAS Stats content — natural bridge module |

### 3.10 Reinforcement Learning

| Model | Advantages | Weaknesses | Best Usage Areas |
| :---- | :---- | :---- | :---- |
| **RL (Q-learning, Actor-Critic, etc.)** | Learns a full *decision policy*, not just a forecast; optimizes long-term reward; adapts continuously; can embed risk penalties directly | High data noise in finance is easily mistaken for signal; markets are non-reproducible (only one historical path exists); unpredictable/unstable in live deployment; needs large data | Algorithmic trading strategy simulators, portfolio-allocation teaching modules (best framed as "policy," distinct from the forecasting models above) |

**Sources:** [ARIMA vs ML Review — MDPI](https://www.mdpi.com/1999-5903/15/8/255) · [ARIMA/LSTM/Prophet/XGBoost Energy Comparison](https://scholars.hkmu.edu.hk/en/publications/comparative-analysis-of-arima-lstm-prophet-and-xgboost-for-energy/) · [Ensemble Learning — Analytics Vidhya](https://www.analyticsvidhya.com/blog/2023/01/ensemble-learning-methods-bagging-boosting-and-stacking/) · [Gradient Boosting Comparison — ml4devs](https://www.ml4devs.com/what-is/gradient-boosting-machines-xgboost-lightgbm-catboost/) · [CatBoost vs LightGBM vs XGBoost](https://towardsdatascience.com/catboost-vs-lightgbm-vs-xgboost-c80f40662924/) · [SVM vs KNN](https://www.geeksforgeeks.org/machine-learning/svm-vs-knn-in-machine-learning/) · [TFT Interpretability — Google Research](https://research.google/blog/interpretable-deep-learning-for-time-series-forecasting/) · [Hybrid Financial Forecasting Models](https://arxiv.org/html/2505.19617v1) · [Bayesian Deep Learning Uncertainty](https://link.springer.com/article/10.1007/s10462-023-10698-8) · [RL in Finance — PLANERGY](https://planergy.com/blog/reinforcement-learning-in-finance/) · [RL Trading Limitations](https://medium.com/@survexman/the-limitations-of-reinforcement-learning-in-algorithmic-trading-a-closer-look-7312d692ffe5) · [CNN vs RNN vs Transformer](https://www.techtarget.com/searchenterpriseai/feature/CNN-vs-RNN-How-they-differ-and-where-they-overlap)

---

## 4\. The Model Selection Compass

A simple 2×2 way to teach *why* you'd pick one model over another — good candidate for an interactive quadrant chart:

- **Interpretability axis:** Linear Regression / Decision Tree / ARIMA (high) → Random Forest / XGBoost (medium, needs SHAP) → LSTM / Transformer / Deep RL (low, "black box")  
- **Data-hunger axis:** Linear/ARIMA/Naive Bayes (low data needs) → Random Forest/XGBoost (medium) → LSTM/Transformer/RL (high — want years of history)  
- **Nonlinearity-capture axis:** Linear models (none) → Trees/Ensembles (good) → Deep learning (best, but only pays off with enough data)  
- **Uncertainty quantification:** Bayesian methods and GARCH-family models give proper probabilistic intervals natively; plain XGBoost/LSTM need extra work (quantile loss, conformal prediction, or a Bayesian wrapper) to produce anything beyond a point estimate.

---

## 5\. Evaluation, Explainability & Production Monitoring

### Metrics

| Metric | What it measures | Notes |
| :---- | :---- | :---- |
| **MAE** | Average absolute error | Robust to outliers |
| **RMSE** | Root mean squared error | Penalizes large misses harder — good when big misses (e.g., missing a gold price spike) are especially costly |
| **MAPE** | Average % error | Intuitive for non-technical stakeholders; unstable near zero values |
| **R²** | Variance explained | Goodness-of-fit summary |
| **AIC / BIC** | Penalized likelihood for model comparison | BIC penalizes complexity more heavily — favors simpler models on small/medium samples |

### Validation

Time series must use **walk-forward / rolling-origin backtesting** (repeatedly train on data up to time *t*, test on *t+1…t+h*, roll forward) instead of one random train/test split — otherwise the evaluation leaks future information into training.

### Explainability

- **SHAP** (Shapley values, game-theoretic): consistent, theoretically grounded, *global* feature importance across the whole model — best for "which macro variables drive the gold forecast overall?"  
- **LIME**: fast, *local* explanation of one specific prediction — best for "why did the model predict a spike *this particular* month?"

### Production Monitoring

Deployed forecasting models degrade via **concept drift** — the relationship between features and target changes over time (e.g., gold's relationship to real yields shifts after a regime change like sustained central-bank buying). Production systems should track feature/prediction distributions against a training-time baseline and trigger retraining when drift crosses a threshold. This is a natural "living system" module: a model that was accurate in 2024 quietly degrading through 2026 as central-bank buying patterns shifted is a great visual teaching moment.

**Sources:** [Time Series Evaluation Metrics](https://medium.com/@sumeyyesahinsavaskan/evaluating-time-series-forecasts-a-clear-guide-to-metrics-and-cross-validation-468949d4c995) · [SHAP vs LIME](https://www.markovml.com/blog/lime-vs-shap) · [Model Drift 2026](https://ekfrazo.com/resources/blogs/machine-learning-model-drift/) · [Concept Drift Detection](https://arxiv.org/pdf/2410.09190)

---

## 6\. Real-World Forecasting Domains

### 6.1 Gold Price Forecasting (flagship use case)

**Current context (as of July 18, 2026):** spot gold trades around **$4,000–$4,030/oz**, up from lower levels earlier in the cycle. Major bank 2026 targets range from **$4,800 to $6,500/oz** (Goldman Sachs ≈$5,800, JPMorgan ≈$5,500, UBS $6,000+).

**Primary drivers to encode as features:**

1. **Real yields** — the single most-cited driver; inverse relationship (rising real yields → falling gold, and vice versa).  
2. **US Dollar Index (DXY)** — inverse relationship; gold priced in USD globally.  
3. **Inflation & Fed policy path** — rate-cut expectations are currently a major 2026 tailwind narrative.  
4. **Geopolitical risk** — conflict, trade tensions; a geopolitical-risk index contributed a measured **\~19% improvement** in prediction accuracy in one recent study.  
5. **Central bank demand** — a structural buyer since 2021 (averaged \~225 tons/quarter 2021–2025), though flows can reverse sharply (net purchases fell to just 16 tons in Q1 2026 after large sales including Türkiye's 60-ton sale).

**Models used in the literature:** ARIMA, LSTM, Prophet, SVM, Random Forest, XGBoost, LightGBM, GBM, and hybrid LSTM-autoencoder / GARCH-LSTM architectures. Findings converge on: **LSTM** for capturing complex nonlinear temporal patterns; **XGBoost \+ SHAP** for a strong, *explainable* accuracy/interpretability balance; **hybrid econometric+ML stacks** for the best overall accuracy.

**Sources:** [J.P. Morgan Gold Price Predictions 2026–2027](https://www.jpmorgan.com/insights/global-research/commodities/gold-prices) · [PIMCO — Understanding Gold Prices](https://www.pimco.com/us/en/resources/education/understanding-gold-prices) · [CBS News — Gold & USD](https://www.cbsnews.com/news/relationship-between-gold-prices-and-us-dollar-what-to-know-for-2026/) · [Gold Outlook 2026 — World Gold Council](https://www.gold.org/goldhub/research/gold-outlook-2026) · [Gold Price Forecast 2026 — GoldSilver](https://goldsilver.com/industry-news/article/gold-price-forecast-2026-2027-key-predictions-from-top-analysts/) · [Geopolitics/Geoeconomics ML Approach](https://arxiv.org/pdf/2510.12416) · [Gold Price ML Forecasting — ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0960077923009803) · [Hybrid LSTM-Autoencoder Gold Forecasting](https://link.springer.com/article/10.1007/s44163-025-00464-w)

### 6.2 Macroeconomic Forecasting (GDP, inflation, unemployment — "Nowcasting")

Official GDP/inflation/employment statistics are published with a lag, creating an **information gap**. "Nowcasting" uses higher-frequency proxy data (financial markets, surveys, satellite/mobility data) to estimate the *current* quarter before official data arrives.

- **Dynamic Factor Models (DFM)** — the classic econometric approach (your Stats page's home turf) — give the most accurate *backcasts*.  
- **Random Forest** gives the most accurate *forecasts and nowcasts* in several comparative studies, and is specifically the most precise method for **inflation** forecasting.  
- **LASSO / Elastic Net** (linear ML) frequently **outperform** more complex ML *and* traditional econometric models when data is rich and high-frequency — a great "simplicity wins" teaching moment.  
- Central banks and the IMF now run both traditional econometric and ML nowcasts side-by-side and compare (e.g., IMF working paper "GDP Nowcasting Performance of Traditional Econometric Models vs Machine-Learning Algorithms").

**Sources:** [Nowcasting GDP with ML — Springer](https://link.springer.com/article/10.1007/s10182-024-00515-0) · [IMF Working Paper — Econometric vs ML Nowcasting](https://www.elibrary.imf.org/view/journals/001/2025/252/article-A001-en.xml) · [Explainable ML for Macro Nowcasting](https://arxiv.org/html/2512.00399v1) · [Nowcasting GDP — ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S016920702030159X)

### 6.3 Microeconomic Forecasting (demand, pricing, consumer behavior)

- ML-based **price elasticity** models outperform classic log-log regression by incorporating promotions, seasonality, and nonlinear/non-monotonic price-demand relationships that traditional econometrics assumes away.  
- **Gradient boosting** and **deep feed-forward networks** are the leading approaches for markdown optimization and demand forecasting in retail.  
- Traditional econometric elasticity models remain valuable as an interpretable *baseline* — another natural Stats↔ML comparison pair.

**Sources:** [RELEX — ML in Retail Demand Forecasting](https://www.relexsolutions.com/resources/machine-learning-in-retail-demand-forecasting/) · [ML Price Elasticity Modeling](https://www.linkedin.com/pulse/traditional-vs-machine-learning-approaches-price-modeling-olaniyi-w6use)

### 6.4 Political & Geopolitical Forecasting

- **Election forecasting** (e.g., The Economist's model): a **dynamic hierarchical Bayesian** framework blending national \+ state-level polls with "fundamentals" (economic indicators, historical voting patterns), updated daily via Stan — this is architecturally very close to your existing Bayesian/Gibbs-sampling Stats content, making it an excellent cross-mode bridge module.  
- **Geopolitical risk indices** (e.g., BlackRock's Geopolitical Risk Indicator, Geoquant) combine structured country-level data with NLP-derived sentiment from news/diplomatic text — hundreds of variables blended into a single risk score used to predict conflict, investment shifts, and — per the gold research above — asset prices.  
- **NLP/sentiment pipelines** track shifts in political discourse as leading indicators.

**Sources:** [Dynamic Hierarchical Bayesian Election Forecasting](https://www.cambridge.org/core/journals/political-analysis/article/abs/polls-context-and-time-a-dynamic-hierarchical-bayesian-forecasting-model-for-us-senate-elections/1833074B3BEBC0E36912FBFF3437A974) · [Bayesian Forecasting — Multiparty Systems](https://www.cambridge.org/core/journals/political-analysis/article/forecasting-elections-in-multiparty-systems-a-bayesian-approach-combining-polls-and-fundamentals/CA929544F672A09A0E34C5529EBFA482) · [Geopolitics/Geoeconomics ML Approach](https://arxiv.org/pdf/2510.12416) · [AI Tools for Geopolitical Risk](https://www.mezzi.com/blog/geopolitical-risk-forecasting-for-investors/)

### 6.5 Hybrid Econometrics \+ ML (the connective tissue)

Across every domain above, the strongest recent results come from **hybrids**: feed an econometric model's residuals into an ML model, or use the econometric forecast as one more input feature to a tree/neural model. Studies consistently find hybrid stacks **statistically significantly** beat either pure econometrics or pure ML alone. This finding alone is a strong argument for a "Stats \+ ML" combined mode, not just a switch between two silos.

**Sources:** [Hybrid Models for Financial Forecasting](https://arxiv.org/html/2505.19617v1) · [ARIMA Meets XGBoost and LSTM — Carbon Prices](https://onlinelibrary.wiley.com/doi/10.1002/for.70025)

---

## 7\. Design Implications Carried Into the Build

1. **"Estimation vs. Prediction" is the headline bridge concept** — build it as an explicit, explorable module, not buried text.  
2. **The model catalog above maps directly onto a relationship-graph** — the same visual grammar as your Stats formula map (nodes \= models, edges \= "extends / competes with / combines with", e.g., XGBoost→extends→Gradient Boosting→extends→Decision Tree; GARCH→extends→ARCH; LSTM→extends→RNN; Hybrid ARIMA-LSTM→combines→ARIMA+LSTM).  
3. **Gold is the strongest flagship domain** — rich, current, numerically concrete data; a clean 5-driver feature story (real yields, DXY, inflation/Fed path, geopolitical risk, central-bank demand); and direct literature on which models work best.  
4. **Macro/Micro/Politics all reuse the same pipeline and model components** — they differ mainly in *feature sets* and *target framing*, which keeps the module-by-module build additive rather than duplicative.  
5. **Bayesian ML (§3.9) and the election/nowcasting Bayesian models (§6.2, §6.4) are natural "same-family, different-lens" pairs with your existing Stats/Gibbs/PGAS content** — the best candidates for a literal shared node between Stats mode and ML mode.

