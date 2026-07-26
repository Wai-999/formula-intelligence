// Python Hub content — ML families 5–7 (unsupervised, classical
// time-series/econometric, modern applied TS tools).
export const PY_ML_UNSUP_TS = [
  {
    id: 'kmeans', group: 'fam5', name: 'K-Means Clustering', formula: 'argmin Σ‖x − centroidₖ‖²',
    tags: ['clustering', 'unsupervised', 'segmentation'],
    overview: "Partitions unlabeled data into k groups by alternating two steps: assign each point to its nearest centroid, then move each centroid to its members' mean. Fast, scalable, and the default first move for segmentation — as long as you remember it only finds round, similar-sized blobs.",
    variables: [
      ['k', 'number of clusters — chosen by you, not learned'],
      ['centroid', 'the mean point of a cluster'],
      ['inertia', 'total within-cluster squared distance (what k-means minimizes)'],
      ['silhouette', 'per-point score of cohesion vs separation, for validating k'],
    ],
    thinking: {
      workflow: [
        'Business problem: find natural groups with no labels (segments, profiles)',
        'Scale features — distance-based, as always',
        'Sweep k; judge with elbow (inertia) + silhouette, then business sense',
        'Profile the clusters: means per feature → human-readable personas',
        'Decision: clusters are useful if teams can NAME them and act differently per group',
      ],
      when: [
        'Customer/product segmentation on numeric behavior features',
        'Compressing many rows into a few prototypes',
        'A quick unsupervised structure-check on new data',
      ],
      notWhen: [
        'Clusters are elongated, nested, or vary wildly in density (DBSCAN/GMM instead)',
        'Heavy categorical data (k-modes / embeddings first)',
        'You expect a "no structure" answer — k-means ALWAYS returns k clusters',
      ],
      assumptions: [
        'Roughly spherical clusters of comparable size in scaled space',
        'The chosen k matches reality (validate it, do not decree it)',
        'Features scaled so distance is meaningful',
      ],
    },
    code: `import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# --- customer behavior features -------------------------------------
rng = np.random.default_rng(7)
segments = [
    dict(n=400, spend=(25, 6),  visits=(2, 0.7), tenure=(6, 2)),    # casual
    dict(n=250, spend=(90, 15), visits=(8, 2),   tenure=(30, 8)),   # loyal
    dict(n=120, spend=(60, 10), visits=(1, 0.4), tenure=(46, 6)),   # lapsing big-spender
]
rows = []
for s in segments:
    rows.append(np.column_stack([
        rng.normal(*s["spend"], s["n"]),
        rng.normal(*s["visits"], s["n"]).clip(0),
        rng.normal(*s["tenure"], s["n"]).clip(1),
    ]))
X = pd.DataFrame(np.vstack(rows), columns=["monthly_spend", "visits", "tenure"])

Xs = StandardScaler().fit_transform(X)

# Sweep k and let silhouette + elbow argue it out:
for k in range(2, 7):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Xs)
    print(f"k={k}  inertia={km.inertia_:7.1f}  "
          f"silhouette={silhouette_score(Xs, km.labels_):.3f}")

# Fit the chosen k and translate centroids back to business units:
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(Xs)
X["cluster"] = km.labels_
print(X.groupby("cluster").mean().round(1))   # <- the persona table`,
    scenario: {
      title: 'Customer segmentation for campaign targeting',
      problem: 'Marketing wants 3–5 actionable customer groups instead of one-size-fits-all messaging.',
      dataset: 'Per-customer spend, visit frequency, tenure, basket mix — no labels.',
      why: 'No ground truth exists; the goal is discovering structure. K-means on scaled behavior features is the fastest path to nameable segments.',
      output: 'A cluster id per customer plus a centroid profile table.',
      interpretation: 'Clusters become personas ("loyal high-spenders", "lapsing veterans") with distinct campaign treatments.',
      pitfalls: 'K-means will happily split one true segment into two if you ask for too many clusters — validate k, then sanity-check with the business.',
    },
    mistakes: [
      'Forgetting to scale (spend in dollars swamps visits in counts)',
      'Trusting a single random init — use n_init≥10',
      'Reading clusters as ground truth instead of a useful compression',
      'Using k-means on non-globular structure and blaming the data',
    ],
    tips: [
      'Elbow suggests, silhouette scores, business names decide',
      'MiniBatchKMeans scales to millions of rows',
      'Always profile centroids in ORIGINAL units for stakeholders',
      'Re-run across months: unstable memberships = weak structure',
    ],
  },
  {
    id: 'hclust', group: 'fam5', name: 'Hierarchical Clustering', formula: 'dendrogram of merges',
    tags: ['clustering', 'unsupervised', 'dendrogram', 'taxonomy'],
    overview: "Builds a full tree of nested clusters: start with every point alone, repeatedly merge the two closest clusters until one remains. You choose the granularity afterwards by cutting the dendrogram — no k needed up front, and the tree itself is often the deliverable.",
    variables: [
      ['linkage', 'how cluster distance is defined: ward, complete, average, single'],
      ['dendrogram', 'the merge tree; height = distance at which merges happen'],
      ['cut height / n_clusters', 'where you slice the tree to get flat clusters'],
      ['cophenetic distance', 'tree-implied distance between any two points'],
    ],
    thinking: {
      workflow: [
        'Business problem: need a taxonomy, not just flat groups',
        'Scale features; pick linkage (ward is the k-means-like default)',
        'Plot the dendrogram BEFORE choosing cluster count',
        'Cut where merge heights jump — big jumps = natural separations',
        'Decision: hierarchy for insight and small data; k-means at scale',
      ],
      when: [
        'You want the nested structure itself (product taxonomies, bio data)',
        'Small-to-medium n (the algorithm is O(n²) memory)',
        'k is genuinely unknown and the dendrogram should reveal it',
      ],
      notWhen: [
        'Hundreds of thousands of rows (quadratic cost bites)',
        'You just need fast flat segments (k-means)',
        'Single linkage on noisy data (chaining artifacts)',
      ],
      assumptions: [
        'A meaningful distance metric on scaled features',
        'The linkage choice matches cluster shape expectations (ward ≈ compact)',
      ],
    },
    code: `import numpy as np
from scipy.cluster.hierarchy import linkage, dendrogram, fcluster
from scipy.spatial.distance import pdist
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# --- store performance profiles -------------------------------------
rng = np.random.default_rng(3)
X = np.vstack([
    rng.normal([10, 200, 0.3], [2, 30, 0.05], (12, 3)),   # small urban
    rng.normal([45, 120, 0.5], [6, 25, 0.08], (9, 3)),    # suburban big-box
    rng.normal([25, 400, 0.2], [4, 50, 0.04], (7, 3)),    # flagship
])
labels = [f"store_{i:02d}" for i in range(len(X))]
Xs = StandardScaler().fit_transform(X)

# Ward linkage: merges that minimize within-cluster variance growth.
Z = linkage(Xs, method="ward")

fig, ax = plt.subplots(figsize=(10, 4))
dendrogram(Z, labels=labels, ax=ax, color_threshold=6)
ax.set_title("Store similarity dendrogram (cut height -> cluster count)")
plt.tight_layout(); plt.savefig("dendrogram.png", dpi=120)

# Flat clusters from cutting the tree:
clusters = fcluster(Z, t=3, criterion="maxclust")
for c in np.unique(clusters):
    members = [l for l, k in zip(labels, clusters) if k == c]
    print(f"cluster {c}: {members}")

# Does the tree respect the raw distances? (>0.7 is decent)
from scipy.cluster.hierarchy import cophenet
coph_corr, _ = cophenet(Z, pdist(Xs))
print(f"cophenetic correlation: {coph_corr:.2f}")`,
    scenario: {
      title: 'Retail store taxonomy',
      problem: 'A chain of 28 stores wants a grouping for merchandising strategy — AND to see which stores are near-twins.',
      dataset: 'Per-store size, foot traffic, basket mix, margin profile.',
      why: 'The dendrogram answers both questions at once: cut high for 3 strategic formats, cut low to find twin stores for A/B testing.',
      output: 'A dendrogram plus flat clusters at the chosen cut.',
      interpretation: 'Merge heights quantify similarity: stores merging early are natural test/control pairs.',
      pitfalls: 'With only 28 stores one outlier store can distort ward merges — check it is not forcing the structure.',
    },
    mistakes: [
      'Choosing cluster count without ever looking at the dendrogram',
      'Single linkage on noisy data → one long chained mega-cluster',
      'Running it on 500k rows and running out of memory',
      'Comparing merge heights across different linkage methods',
    ],
    tips: [
      'Ward linkage is the sane default for compact numeric clusters',
      'The biggest vertical gap in the dendrogram suggests the natural cut',
      'Cophenetic correlation sanity-checks tree faithfulness',
      'Use AgglomerativeClustering(sklearn) for pipeline integration',
    ],
  },
  {
    id: 'pca', group: 'fam5', name: 'PCA (dimensionality reduction)', formula: 'project onto top eigenvectors of cov',
    tags: ['unsupervised', 'dimensionality', 'compression', 'factors'],
    overview: "Finds the orthogonal directions of maximum variance and re-expresses the data in those coordinates, keeping only the top few. Decorrelates features, compresses dimensions, denoises, and in macro/finance doubles as factor extraction ('the first PC of yields is the level factor').",
    variables: [
      ['component', 'a unit direction in feature space (eigenvector of the covariance)'],
      ['explained variance ratio', 'share of total variance each component captures'],
      ['loading', 'a feature’s weight in a component — how to interpret the factor'],
      ['score', 'a data point’s coordinate along a component'],
    ],
    thinking: {
      workflow: [
        'Business problem: too many correlated features (or need latent factors)',
        'Standardize first — PCA chases variance, units distort it',
        'Fit; read the explained-variance curve (scree)',
        'Keep components covering ~80–95% variance, or with clear meaning',
        'Interpret loadings: name each factor or treat as pure compression',
      ],
      when: [
        'Highly correlated feature blocks (rates across maturities, survey batteries)',
        'Preprocessing for distance-based models (KNN, k-means) in high dims',
        'Latent-factor stories: level/slope/curvature, market factor',
      ],
      notWhen: [
        'Features are already few and interpretable — PCA obscures them',
        'Maximum-variance directions are not the predictive ones (supervised task ≠ PCA’s objective)',
        'Hard interpretability constraints on inputs',
      ],
      assumptions: [
        'Linear structure — components are linear combinations',
        'Variance ≈ importance (the core, sometimes wrong, bet)',
        'Standardized features unless units are genuinely comparable',
      ],
    },
    code: `import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# --- yield curve: 8 maturities, famously ~3 latent factors -----------
rng = np.random.default_rng(0)
n = 500
level = rng.normal(0, 1.0, n)          # parallel shifts
slope = rng.normal(0, 0.5, n)          # short vs long
curve = rng.normal(0, 0.25, n)         # belly
mats = np.array([0.25, 0.5, 1, 2, 3, 5, 10, 30])
X = (level[:, None]
     + slope[:, None] * (mats - mats.mean()) / 10
     + curve[:, None] * ((mats - 5) ** 2 - 40) / 100
     + rng.normal(0, 0.05, (n, len(mats))))
cols = [f"y{m}" for m in mats]

Xs = StandardScaler().fit_transform(X)
pca = PCA().fit(Xs)

evr = pca.explained_variance_ratio_
print("explained variance:", evr[:4].round(3), "cum:", evr.cumsum()[:4].round(3))
# Expect ~3 components to carry ~99% -- the level/slope/curvature story.

loadings = pd.DataFrame(pca.components_[:3].T, index=cols,
                        columns=["PC1", "PC2", "PC3"]).round(2)
print(loadings)
# PC1: same sign everywhere -> LEVEL. PC2: sign flips short vs long ->
# SLOPE. PC3: ends vs belly -> CURVATURE.

# Compress to the 3 factor scores for downstream models:
scores = PCA(n_components=3).fit_transform(Xs)
print("compressed shape:", scores.shape)`,
    scenario: {
      title: 'Yield-curve factor extraction',
      problem: 'A rates desk wants to summarize daily moves of 8 maturities into a few risk factors for hedging and scenario design.',
      dataset: 'Daily yield changes across the curve for two years.',
      why: 'Maturities are ~99% explained by three latent factors; PCA recovers them from data alone, and the loadings identify them as level, slope, curvature.',
      output: 'Three factor series + loadings; portfolio risk restated in factor space.',
      interpretation: '"We are long level, short slope" replaces eight partial exposures with two sentences.',
      pitfalls: 'Component signs are arbitrary — fix conventions before automating reports.',
    },
    mistakes: [
      'Skipping standardization and letting the biggest-unit feature own PC1',
      'Keeping components by rote (95%) when the task needed the small-variance ones',
      'Interpreting components causally',
      'Fitting PCA on train+test together (leakage — fit on train only)',
    ],
    tips: [
      'Scree plot + cumulative variance, then judgment',
      'Always read loadings — an unnamed factor is a missed insight',
      'PCA-then-cluster/KNN is a strong pattern in high dimensions',
      'For sparse interpretable factors, see SparsePCA / factor rotation',
    ],
  },
  {
    id: 'arima', group: 'fam6', name: 'ARIMA / SARIMA', formula: 'ARIMA(p,d,q)×(P,D,Q)ₛ',
    tags: ['time series', 'forecasting', 'econometrics', 'box-jenkins'],
    overview: "The classical univariate forecaster: difference the series to stationarity (d), then model it as a mix of its own lags (AR p) and past shocks (MA q); SARIMA adds the same at seasonal lag s. Fifty years old and still the benchmark every fancy forecaster must beat.",
    variables: [
      ['p', 'AR order — how many past values feed the prediction'],
      ['d', 'differencing order — how many times to difference to stationarity'],
      ['q', 'MA order — how many past forecast errors feed the prediction'],
      ['(P,D,Q)ₛ', 'the seasonal counterparts at period s (12 for monthly)'],
    ],
    thinking: {
      workflow: [
        'Plot the series: trend? seasonality? variance growth (→ log)?',
        'Test stationarity (ADF); difference until stationary → d',
        'Read ACF/PACF for candidate p, q (or let auto-selection search AIC)',
        'Fit; check residuals: white noise (Ljung-Box) or the model is incomplete',
        'Forecast WITH intervals; backtest against naive/seasonal-naive',
      ],
      when: [
        'Univariate series with stable autocorrelation structure',
        'Short-to-medium horizons where recent dynamics dominate',
        'You need interpretable, interval-bearing baseline forecasts',
      ],
      notWhen: [
        'Rich exogenous drivers dominate (→ ARIMAX, or ML with features)',
        'Multiple seasonalities / irregular events (→ Prophet, TBATS)',
        'Regime breaks — ARIMA extrapolates the old regime confidently',
      ],
      assumptions: [
        'Stationarity after differencing',
        'Linear dynamics; residuals ≈ white noise',
        'Constant parameters over the sample (no structural breaks)',
      ],
    },
    code: `import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.stattools import adfuller
from statsmodels.stats.diagnostic import acorr_ljungbox

# --- monthly sales with trend + annual seasonality -------------------
rng = np.random.default_rng(1)
n = 96
t = np.arange(n)
y = 200 + 1.5 * t + 30 * np.sin(2 * np.pi * t / 12) + rng.normal(0, 8, n)
idx = pd.date_range("2017-01-01", periods=n, freq="MS")
series = pd.Series(y, index=idx)

# Stationarity check drives d:
print(f"ADF p-value (raw)  : {adfuller(series)[1]:.3f}")     # non-stationary
print(f"ADF p-value (diff) : {adfuller(series.diff().dropna())[1]:.3f}")

train, test = series[:-12], series[-12:]

model = SARIMAX(train, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
res = model.fit(disp=False)
print(res.summary().tables[1])

# Residuals must be white noise or the spec is missing structure:
lb = acorr_ljungbox(res.resid, lags=[12])
print(f"Ljung-Box p at lag 12: {lb['lb_pvalue'].iloc[0]:.3f}  (>0.05 = ok)")

# Forecast with uncertainty — the interval IS part of the answer:
fc = res.get_forecast(steps=12)
out = pd.DataFrame({"forecast": fc.predicted_mean,
                    "lo95": fc.conf_int().iloc[:, 0],
                    "hi95": fc.conf_int().iloc[:, 1],
                    "actual": test})
print(out.round(1).head())
mape = (abs(out["actual"] - out["forecast"]) / out["actual"]).mean() * 100
print(f"12-month backtest MAPE: {mape:.1f}%")`,
    scenario: {
      title: 'Monthly revenue forecasting for budgeting',
      problem: 'Finance needs a 12-month revenue forecast with honest uncertainty bands for the annual plan.',
      dataset: 'Eight years of monthly revenue with trend and a strong December peak.',
      why: 'Univariate, seasonal, stable dynamics — SARIMA territory. The interval, not just the point forecast, drives the conservative/base/upside budget scenarios.',
      output: 'Point forecasts + 95% intervals per month; parameter table for review.',
      interpretation: 'The widening interval quantifies how much trust to place in month 12 vs month 1 — budget flexibility should match it.',
      pitfalls: 'A structural break (new product line) invalidates the fitted dynamics; re-estimate after regime changes.',
    },
    mistakes: [
      'Fitting on a non-stationary series and admiring the spurious fit',
      'Ignoring residual autocorrelation (Ljung-Box exists for a reason)',
      'Reporting point forecasts without intervals',
      'Random train/test splits — time series validate on the FUTURE',
    ],
    tips: [
      'Beat seasonal-naive first; many series never justify more',
      'pmdarima.auto_arima automates the order search when you need speed',
      'Log-transform when seasonal amplitude grows with the level',
      'Rolling-origin backtests are the honest evaluation',
    ],
  },
  {
    id: 'var', group: 'fam6', name: 'VAR (Vector Autoregression)', formula: 'yₜ = A₁yₜ₋₁ + … + Aₚyₜ₋ₚ + εₜ',
    tags: ['time series', 'multivariate', 'macro', 'impulse response'],
    overview: "The multivariate generalization of AR: several series forecast jointly, each from everyone's lags. The macro workhorse for studying how variables move together — impulse responses ('what does a rate shock do to GDP over 12 quarters?') fall out naturally.",
    variables: [
      ['yₜ', 'vector of all series at time t (e.g., [GDP growth, inflation, rate])'],
      ['Aᵢ', 'coefficient matrix at lag i — cross-effects live off-diagonal'],
      ['p', 'lag order, chosen by AIC/BIC'],
      ['IRF', 'impulse response: the path of every variable after a one-time shock'],
    ],
    thinking: {
      workflow: [
        'Business problem: forecast interacting series / trace shock propagation',
        'Check each series for stationarity (difference or use growth rates)',
        'Select lag order by information criteria',
        'Fit; validate residuals; run Granger causality for lead-lag structure',
        'Use IRFs and forecast-error variance decomposition for the story',
      ],
      when: [
        'A small set (2–8) of interrelated macro/finance series',
        'The QUESTION is dynamics: who leads, how shocks propagate',
        'Joint forecasts where consistency between series matters',
      ],
      notWhen: [
        'Many series with short history (parameters explode: k²·p of them)',
        'One target with true exogenous drivers (ARIMAX/regression instead)',
        'Nonstationary levels without cointegration handling (→ VECM)',
      ],
      assumptions: [
        'Stationarity of all included series',
        'Stable linear dynamics; enough observations for k²·p parameters',
        'For causal IRF reading: a credible shock-identification scheme',
      ],
    },
    code: `import numpy as np
import pandas as pd
from statsmodels.tsa.api import VAR

# --- three linked macro series (quarterly growth rates) --------------
rng = np.random.default_rng(4)
n = 160
gdp = np.zeros(n); infl = np.zeros(n); rate = np.zeros(n)
for t in range(1, n):
    gdp[t]  = 0.5 * gdp[t-1] - 0.2 * rate[t-1] + rng.normal(0, 0.5)
    infl[t] = 0.6 * infl[t-1] + 0.15 * gdp[t-1] + rng.normal(0, 0.3)
    rate[t] = 0.8 * rate[t-1] + 0.3 * infl[t-1] + rng.normal(0, 0.2)
df = pd.DataFrame({"gdp": gdp, "infl": infl, "rate": rate},
                  index=pd.period_range("1985Q1", periods=n, freq="Q"))

model = VAR(df)
print(model.select_order(8).summary())        # AIC/BIC lag choice

res = model.fit(2)
print(res.test_causality("gdp", ["rate"], kind="f").summary())  # Granger

# Impulse responses: what a 1-sd rate shock does over 12 quarters
irf = res.irf(12)
rate_to_gdp = irf.irfs[:, df.columns.get_loc("gdp"),
                       df.columns.get_loc("rate")]
print("GDP response to rate shock (q1..q6):", rate_to_gdp[1:7].round(3))

# Joint 8-quarter forecast:
fc = res.forecast(df.values[-res.k_ar:], steps=8)
print(pd.DataFrame(fc, columns=df.columns).round(2).head())`,
    scenario: {
      title: 'Policy-rate shock analysis',
      problem: 'A research desk must answer: if the central bank hikes 50bp, what happens to growth and inflation over two years?',
      dataset: 'Quarterly GDP growth, inflation, and the policy rate for ~40 years.',
      why: 'The question is inherently multivariate and dynamic — exactly what VAR impulse responses are built to answer.',
      output: 'IRF paths with confidence bands for each variable after a rate shock.',
      interpretation: '"GDP growth dips ~0.3pp, troughing at quarter 4, fading by quarter 10" — with bands honest about uncertainty.',
      pitfalls: 'IRFs depend on the shock-identification ordering (Cholesky) — report robustness to alternative orderings.',
    },
    mistakes: [
      'Feeding nonstationary levels and reading spurious dynamics',
      'Too many variables/lags for the sample (overparameterization)',
      'Treating Granger causality as true causality',
      'Ignoring that Cholesky IRFs depend on variable ordering',
    ],
    tips: [
      'Keep VARs small (2–6 variables) unless you go Bayesian (BVAR)',
      'Use growth rates / first differences for macro levels',
      'FEVD (variance decomposition) complements IRFs for the narrative',
      'statsmodels VAR has select_order, IRFs, causality tests built in',
    ],
  },
  {
    id: 'garch', group: 'fam6', name: 'GARCH / ARCH', formula: 'σₜ² = ω + α·εₜ₋₁² + β·σₜ₋₁²',
    tags: ['volatility', 'finance', 'risk', 'time series'],
    overview: "Models the VARIANCE of a series instead of its level: today's volatility depends on yesterday's squared shock (ARCH) and yesterday's volatility (GARCH). Captures the defining fact of financial returns — calm and turbulent periods cluster — and powers VaR and option-pricing inputs.",
    variables: [
      ['εₜ', 'return shock (residual) at time t'],
      ['σₜ²', 'conditional variance — today’s risk level'],
      ['α', 'reaction to news (yesterday’s squared shock)'],
      ['β', 'persistence (yesterday’s variance); α+β near 1 = long-memory vol'],
    ],
    thinking: {
      workflow: [
        'Plot returns: volatility clustering visible? ARCH-LM test confirms',
        'Model the mean simply (constant/AR); GARCH(1,1) for variance',
        'Check α+β: near 1 means shocks decay slowly',
        'Forecast conditional vol; feed VaR / position sizing',
        'Decision: GARCH(1,1) first; EGARCH/GJR if downside asymmetry matters',
      ],
      when: [
        'Financial return series with visible calm/turbulent regimes',
        'Risk metrics needed: VaR, expected shortfall, vol forecasts',
        'Position sizing or option inputs that react to current risk',
      ],
      notWhen: [
        'Series without conditional heteroskedasticity (test first)',
        'Forecasting the LEVEL of returns (GARCH says almost nothing there)',
        'Low-frequency data with few observations',
      ],
      assumptions: [
        'Variance dynamics follow the specified recursion',
        'Innovations from an assumed distribution (normal / Student-t)',
        'Parameters stable over the estimation window',
      ],
    },
    code: `# pip install arch
import numpy as np
import pandas as pd
from arch import arch_model

# --- daily returns with volatility clustering ------------------------
rng = np.random.default_rng(2)
n = 1500
sigma2 = np.zeros(n); r = np.zeros(n)
omega, alpha, beta = 0.04, 0.12, 0.85
sigma2[0] = omega / (1 - alpha - beta)
for t in range(1, n):
    sigma2[t] = omega + alpha * r[t-1]**2 + beta * sigma2[t-1]
    r[t] = np.sqrt(sigma2[t]) * rng.standard_t(df=7)
returns = pd.Series(100 * r / r.std() * 0.01 * 100)   # ~1% daily vol scale

# GARCH(1,1) with fat-tailed innovations:
am = arch_model(returns, mean="Constant", vol="GARCH", p=1, q=1, dist="t")
res = am.fit(disp="off")
print(res.summary().tables[1])
a, b = res.params["alpha[1]"], res.params["beta[1]"]
print(f"persistence alpha+beta = {a+b:.3f}  (near 1 = slow-decaying vol)")

# 10-day-ahead volatility forecast:
fc = res.forecast(horizon=10)
vol_path = np.sqrt(fc.variance.iloc[-1])
print("vol forecast (next 5 days):", vol_path[:5].round(3).tolist())

# 1-day 99% VaR from conditional vol (t-quantile x sigma):
from scipy import stats
q = stats.t.ppf(0.01, df=res.params["nu"])
var99 = -(res.params["mu"] + q * vol_path.iloc[0])
print(f"1-day 99% VaR: {var99:.2f}% of portfolio value")`,
    scenario: {
      title: 'Value-at-Risk for a trading book',
      problem: 'Risk management must report how much the desk could lose on a bad day (99% VaR), updated daily as markets calm or panic.',
      dataset: 'Daily P&L / return history of the book.',
      why: 'Unconditional VaR ignores that risk clusters; GARCH VaR breathes with the market — tight in calm regimes, wide after shocks — passing regulatory backtests where static VaR fails.',
      output: 'Daily conditional vol and VaR; exceedance backtest counts.',
      interpretation: '"Today’s 99% VaR is 2.1%, vs 0.9% a month ago" — risk limits and position sizes scale accordingly.',
      pitfalls: 'Normal innovations understate tails — use Student-t; backtest exceedances (≈1% of days should breach).',
    },
    mistakes: [
      'Fitting GARCH to prices instead of returns',
      'Normal innovations on fat-tailed assets',
      'Reading GARCH as a return forecaster (it forecasts risk, not direction)',
      'Ignoring asymmetry when downside moves spike vol more (use GJR/EGARCH)',
    ],
    tips: [
      'GARCH(1,1)-t is the industry default — start there, complicate only with evidence',
      'Check α+β < 1 for stationarity of variance',
      'Annualize: daily vol × √252',
      'Backtest VaR by counting exceedances, not by eyeballing',
    ],
  },
  {
    id: 'expsmooth', group: 'fam6', name: 'Exponential Smoothing / Holt-Winters', formula: 'level/trend/season, recency-weighted',
    tags: ['time series', 'forecasting', 'smoothing', 'operations'],
    overview: "Forecasts by exponentially-weighted averages: recent observations count most, with explicit components for level, trend, and seasonality (Holt-Winters). Robust, fast, almost tuning-free — the operational forecasting workhorse for thousands of series at once.",
    variables: [
      ['α', 'level smoothing — how fast the base level updates'],
      ['β', 'trend smoothing — how fast the slope updates'],
      ['γ', 'seasonal smoothing — how fast seasonal factors update'],
      ['additive vs multiplicative', 'seasonality as ± amount vs × factor'],
    ],
    thinking: {
      workflow: [
        'Inspect: trend? seasonality? does seasonal swing scale with level?',
        'Choose components: none/additive/multiplicative for trend & season',
        'Fit (parameters auto-optimized); damp the trend for long horizons',
        'Backtest vs seasonal-naive; deploy per-series at fleet scale',
      ],
      when: [
        'Operational forecasting of MANY series (SKUs, call volumes) automatically',
        'Clear level/trend/seasonal structure, short horizons',
        'Speed and robustness beat squeezing the last percent',
      ],
      notWhen: [
        'Rich exogenous drivers matter (promos, price) — regression/ML instead',
        'Complex multiple seasonalities (→ TBATS/Prophet)',
        'Long horizons with undamped trends (they extrapolate linearly forever)',
      ],
      assumptions: [
        'Components evolve smoothly (no sudden regime jumps)',
        'Single dominant seasonal period',
        'Errors roughly homoscedastic (else multiplicative form)',
      ],
    },
    code: `import numpy as np
import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing

# --- weekly demand: trend + strong weekly-of-year seasonality --------
rng = np.random.default_rng(5)
n = 156  # 3 years of weeks
t = np.arange(n)
y = (120 + 0.4 * t) * (1 + 0.25 * np.sin(2 * np.pi * t / 52)) \\
    + rng.normal(0, 6, n)
idx = pd.date_range("2022-01-02", periods=n, freq="W")
series = pd.Series(y, index=idx)
train, test = series[:-26], series[-26:]

# Multiplicative season: the seasonal swing grows with the level.
model = ExponentialSmoothing(
    train,
    trend="add", damped_trend=True,     # damping tames long-horizon trend
    seasonal="mul", seasonal_periods=52,
)
res = model.fit(optimized=True)
print({k: round(v, 3) for k, v in res.params.items()
       if k in ("smoothing_level", "smoothing_trend", "smoothing_seasonal",
                "damping_trend")})

fc = res.forecast(26)
mape = (abs(test - fc) / test).mean() * 100
print(f"26-week backtest MAPE: {mape:.1f}%")

# The always-required sanity benchmark — seasonal naive:
snaive = train[-52:][:26].values
mape_naive = (abs(test.values - snaive) / test.values).mean() * 100
print(f"seasonal-naive  MAPE: {mape_naive:.1f}%  (must beat this)")`,
    scenario: {
      title: 'Call-center staffing forecasts',
      problem: 'Workforce planning needs weekly call-volume forecasts for 200 queues to schedule agents two months ahead.',
      dataset: 'Three years of weekly volumes per queue — trend plus strong annual pattern.',
      why: 'Two hundred series, retrained weekly, no analyst per series: Holt-Winters’ auto-fit robustness is the right trade. Damped trend prevents runaway long-horizon extrapolation.',
      output: 'Per-queue 8-week forecasts refreshed weekly.',
      interpretation: 'Forecast × handle-time ÷ occupancy = agents required; MAPE tolerance maps to over/under-staffing cost.',
      pitfalls: 'Holiday weeks break the smooth-seasonality assumption — overlay a holiday adjustment.',
    },
    mistakes: [
      'Additive seasonality when swings clearly scale with level',
      'Undamped trends extrapolated 52 weeks out',
      'Not benchmarking against seasonal-naive',
      'One global model for wildly heterogeneous series — fit per series',
    ],
    tips: [
      'damped_trend=True is almost always the safer long-horizon choice',
      'Multiplicative season for demand data; additive for temperature-like series',
      'statsmodels optimizes α, β, γ automatically — let it',
      'This family (ETS) wins forecasting competitions more often than people expect',
    ],
  },
  {
    id: 'prophet', group: 'fam7', name: 'Prophet', formula: 'y = trend + seasonality + holidays + ε',
    tags: ['time series', 'forecasting', 'business', 'holidays'],
    overview: "Meta's decomposable forecaster: piecewise-linear trend with automatic changepoints, Fourier-series seasonalities (weekly/yearly), and explicit holiday effects, fit as a curve — robust to missing data and outliers, tunable by analysts rather than statisticians.",
    variables: [
      ['g(t)', 'piecewise trend with automatic changepoints'],
      ['s(t)', 'seasonal components as Fourier series'],
      ['h(t)', 'holiday/event effects you declare'],
      ['changepoint_prior_scale', 'trend flexibility — THE main tuning knob'],
    ],
    thinking: {
      workflow: [
        'Business series with human rhythms? (weekly/yearly/holidays) → Prophet fits',
        'Assemble the holiday/event table — this is where domain knowledge enters',
        'Fit with defaults; inspect the components plot (trend/weekly/yearly)',
        'Tune changepoint_prior_scale if trend over/under-flexes',
        'Cross-validate with rolling origins (built in) and compare to SARIMA/ETS',
      ],
      when: [
        'Daily business data: traffic, sales, signups with strong calendar structure',
        'Missing days, outliers, promo/holiday spikes to model explicitly',
        'Analysts need understandable components, not ARIMA orders',
      ],
      notWhen: [
        'Sub-daily/high-frequency data or long-memory dynamics',
        'Strong autocorrelation beyond calendar structure (ARIMA does better)',
        'Series without calendar rhythm (Prophet’s priors add nothing)',
      ],
      assumptions: [
        'The series decomposes into trend + periodic seasonality + events',
        'Trend changes at discrete changepoints, smooth otherwise',
        'Seasonal patterns are stable year over year',
      ],
    },
    code: `# pip install prophet
import numpy as np
import pandas as pd
from prophet import Prophet

# --- daily website traffic with weekly + yearly cycles + promos ------
rng = np.random.default_rng(9)
days = pd.date_range("2022-01-01", "2025-06-30", freq="D")
n = len(days)
t = np.arange(n)
weekly = 40 * (days.dayofweek < 5)                # weekday lift
yearly = 60 * np.sin(2 * np.pi * t / 365.25)
trend = 500 + 0.3 * t - 0.15 * np.maximum(0, t - 600)   # slope change!
y = trend + weekly + yearly + rng.normal(0, 25, n)
df = pd.DataFrame({"ds": days, "y": y})

promos = pd.DataFrame({
    "holiday": "promo",
    "ds": pd.to_datetime(["2023-11-24", "2024-11-29"]),
    "lower_window": 0, "upper_window": 3,
})

m = Prophet(holidays=promos,
            changepoint_prior_scale=0.05,     # trend flexibility
            weekly_seasonality=True, yearly_seasonality=True)
m.fit(df)

future = m.make_future_dataframe(periods=90)
fc = m.predict(future)
print(fc[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(3).round(0))

# Where did Prophet detect trend changes?
print("changepoints near:", m.changepoints[
      np.abs(np.nanmean(m.params["delta"], axis=0)) > 0.01].tolist()[:3])

# Honest evaluation: rolling-origin cross-validation (built in)
from prophet.diagnostics import cross_validation, performance_metrics
cv = cross_validation(m, initial="730 days", period="90 days",
                      horizon="90 days", parallel="processes")
print(performance_metrics(cv)[["horizon", "mape"]].tail(2))`,
    scenario: {
      title: 'Website traffic forecasting for capacity planning',
      problem: 'An e-commerce platform forecasts daily traffic 90 days out to plan infrastructure and content staffing, Black Friday included.',
      dataset: 'Three+ years of daily sessions with weekday rhythm, seasonal cycle, promo spikes, and a growth-slowdown mid-history.',
      why: 'Calendar-driven structure, a trend changepoint, and known promo dates: Prophet models each explicitly and the components plot explains the forecast to stakeholders.',
      output: '90-day forecast with intervals plus decomposed trend/weekly/yearly/holiday components.',
      interpretation: 'The trend component ends the "are we still growing?" debate; the promo effect sizes next year’s Black Friday capacity.',
      pitfalls: 'Untracked special events leak into seasonality; keep the event table maintained.',
    },
    mistakes: [
      'Skipping the holiday table and wondering why spikes are missed',
      'changepoint_prior_scale too high — trend chases noise, intervals balloon',
      'Using Prophet on autocorrelation-dominated series and losing to ARIMA',
      'Ignoring the built-in cross_validation tooling',
    ],
    tips: [
      'Always look at plot_components — it is the product',
      'Tune changepoint_prior_scale first; most other defaults hold',
      'Add regressors (price, marketing spend) via add_regressor when drivers exist',
      'Compare against ETS/SARIMA — Prophet is convenient, not always superior',
    ],
  },
  {
    id: 'hybrid', group: 'fam7', name: 'Hybrid Econometric + ML', formula: 'ARIMA(level) + ML(residuals)',
    tags: ['time series', 'ensemble', 'residual learning', 'forecasting'],
    overview: "Two-stage forecasting: let a classical model (ARIMA/ETS) capture the linear, interpretable dynamics, then train an ML model (XGBoost/LSTM) on its residuals with exogenous features. The ML layer only learns what the econometrics couldn't — often beating either alone.",
    variables: [
      ['stage 1', 'econometric fit: trend/seasonal/autocorrelation structure'],
      ['residuals', 'what stage 1 missed — the ML target'],
      ['stage 2', 'ML on residuals with feature lags, calendar, drivers'],
      ['final forecast', 'stage-1 forecast + stage-2 residual prediction'],
    ],
    thinking: {
      workflow: [
        'Fit the best simple econometric model; verify it captures the obvious',
        'Diagnose residuals: structure left? (nonlinear? driver-related?)',
        'If yes, build features and fit ML on residuals with temporal CV',
        'Add the two forecasts; verify the ensemble beats BOTH stages alone',
        'Decision: complexity is only justified by that verified gain',
      ],
      when: [
        'Clear linear/seasonal core PLUS nonlinear driver effects (promos, weather)',
        'You want interpretability for the base and accuracy on top',
        'Residual diagnostics show real remaining structure',
      ],
      notWhen: [
        'Stage-1 residuals are already white noise (nothing left to learn)',
        'Too little data to validate two stages honestly',
        'Ops cannot maintain a two-model pipeline',
      ],
      assumptions: [
        'Additive decomposition: total = linear part + learnable remainder',
        'Stage-2 features are available at forecast time (no future leakage)',
      ],
    },
    code: `import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error

# --- daily sales: seasonal core + NONLINEAR promo/weather effects ----
rng = np.random.default_rng(11)
n = 730
t = np.arange(n)
promo = rng.integers(0, 2, n)
temp = 18 + 10 * np.sin(2 * np.pi * t / 365) + rng.normal(0, 2, n)
core = 100 + 10 * np.sin(2 * np.pi * t / 7) + 0.05 * t
effect = 25 * promo * (temp > 22)           # promo works ONLY when warm
y = core + effect + rng.normal(0, 5, n)

split = n - 90
y_tr, y_te = y[:split], y[split:]

# --- stage 1: SARIMA captures weekly seasonality + trend -------------
s1 = SARIMAX(y_tr, order=(1, 1, 1), seasonal_order=(1, 0, 1, 7)).fit(disp=False)
base_fc = s1.forecast(90)
resid_tr = y_tr - s1.fittedvalues

# --- stage 2: GBM learns the promo x temperature interaction ---------
feats = pd.DataFrame({"promo": promo, "temp": temp,
                      "dow": t % 7, "doy": t % 365})
s2 = HistGradientBoostingRegressor(random_state=0)
s2.fit(feats.iloc[:split], resid_tr)
resid_fc = s2.predict(feats.iloc[split:])

# --- combine and score every contender -------------------------------
hybrid = base_fc + resid_fc
for name, pred in [("SARIMA alone", base_fc),
                   ("GBM alone", s2.fit(feats.iloc[:split], y_tr)
                                   .predict(feats.iloc[split:])),
                   ("HYBRID", hybrid)]:
    print(f"{name:13s} MAE = {mean_absolute_error(y_te, pred):.2f}")
# The hybrid wins: SARIMA can't see promo x temp; GBM alone wastes
# capacity relearning the seasonality SARIMA gets for free.`,
    scenario: {
      title: 'Store sales with promotions and weather',
      problem: 'A grocery chain forecasts daily store sales where promos interact with weather (ice-cream promos only work in heat).',
      dataset: 'Two years of daily sales, promo calendar, temperature; weekly seasonality plus trend.',
      why: 'SARIMA nails the calendar core but is blind to the promo×weather interaction; a GBM on residuals learns exactly that. The decomposition also splits the forecast into an explainable base + event effects.',
      output: 'Base forecast + residual adjustment; MAE comparison of the three contenders.',
      interpretation: '"Baseline 112 units, +19 promo-in-heat adjustment" reads better in ops meetings than one black-box number.',
      pitfalls: 'Stage-2 features must be known at forecast time — next week’s temperature is itself a forecast with error.',
    },
    mistakes: [
      'Adding an ML stage when stage-1 residuals were already white noise',
      'Leaking future information through stage-2 features',
      'Never verifying the hybrid beats both components alone',
      'Random CV instead of temporal splits in stage 2',
    ],
    tips: [
      'Ljung-Box on stage-1 residuals decides whether stage 2 is even warranted',
      'Keep stage 1 simple and stable; let ML absorb the weird stuff',
      'Report the decomposition — it is an interpretability feature for free',
      'The same pattern works as LSTM-on-residuals for longer memory',
    ],
  },
];
