// Python Hub content — ML families 1–4 (linear, instance/probabilistic,
// trees & ensembles, SVM). Ids mirror src/data/ml/models.js. Code samples
// use # comments only (no docstrings) — see PyCodeBlock.jsx.
export const PY_ML_CLASSIC = [
  {
    id: 'linreg', group: 'fam1', name: 'Linear Regression', formula: 'ŷ = β₀ + β₁x',
    tags: ['regression', 'ols', 'baseline', 'supervised'],
    overview: "Fits the single straight line (or hyperplane) that minimizes squared prediction error. It is the baseline every regression project should start with: fast, fully interpretable, and surprisingly hard to beat on small, roughly-linear datasets.",
    variables: [
      ['β₀', 'intercept — predicted y when every x is 0'],
      ['β₁', 'slope — change in ŷ per one-unit change in x, all else fixed'],
      ['ŷ', 'the model’s predicted value of the target'],
      ['residual', 'y − ŷ, the part of the outcome the line fails to explain'],
    ],
    thinking: {
      workflow: [
        'Business problem: predict a numeric outcome (price, demand, score)',
        'Data check: is the target continuous? Are candidate drivers numeric or encodable?',
        'Assumption scan: scatter plots — do relationships look roughly linear?',
        'Fit OLS as the baseline before anything fancier',
        'Interpret: each coefficient is a direct, unit-level statement about the driver',
        'Decision: keep if residuals look healthy; escalate to regularized/tree models if not',
      ],
      when: [
        'You need an interpretable baseline before trying complex models',
        'Relationships are roughly linear and features are few',
        'Stakeholders need "one more year of experience = +$2,340 salary"-style statements',
      ],
      notWhen: [
        'Strong non-linear patterns or interactions dominate (trees/GBMs will win)',
        'More features than observations without regularization',
        'Heavy outliers you cannot clean — OLS chases squared error and gets dragged',
      ],
      assumptions: [
        'Linearity of the mean relationship',
        'Independent errors (watch out for time-series data)',
        'Constant error variance (homoscedasticity)',
        'Approximately normal residuals for valid small-sample inference',
      ],
    },
    code: `import numpy as np
import pandas as pd
import statsmodels.api as sm
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

# --- toy dataset: house prices driven by size + age ------------------
rng = np.random.default_rng(42)
n = 300
df = pd.DataFrame({
    "sqft": rng.uniform(600, 3200, n),
    "age_years": rng.uniform(0, 50, n),
})
df["price_k"] = 40 + 0.12 * df["sqft"] - 0.9 * df["age_years"] + rng.normal(0, 25, n)

X_train, X_test, y_train, y_test = train_test_split(
    df[["sqft", "age_years"]], df["price_k"], test_size=0.25, random_state=0
)

# --- scikit-learn: the prediction workhorse --------------------------
model = LinearRegression()
model.fit(X_train, y_train)
pred = model.predict(X_test)
print(f"MAE  : {mean_absolute_error(y_test, pred):.1f} thousand USD")
print(f"R^2  : {r2_score(y_test, pred):.3f}")
print("slopes:", dict(zip(X_train.columns, model.coef_.round(3))))

# --- statsmodels: same fit, but with full inference ------------------
# Use this view when you need p-values and confidence intervals.
ols = sm.OLS(y_train, sm.add_constant(X_train)).fit()
print(ols.summary().tables[1])   # coef, std err, t, p-value, 95% CI`,
    scenario: {
      title: 'House price prediction',
      problem: 'A brokerage wants sane list-price suggestions for incoming properties.',
      dataset: 'Historical sales: square footage, age, location features, and the realized sale price.',
      why: 'Prices are continuous, drivers are mostly additive, and agents must be able to justify the number to sellers — interpretability is a hard requirement.',
      output: 'A predicted price plus per-feature contributions ("+$120 per extra sqft, −$900 per year of age").',
      interpretation: 'Coefficients become talking points in the listing conversation; R² tells you how much of price variation the drivers explain.',
      pitfalls: 'Correlated drivers (size and rooms) make individual coefficients unstable even when predictions stay fine.',
    },
    mistakes: [
      'Reading coefficients causally — OLS describes association, not intervention',
      'Ignoring residual plots: a curved residual pattern means the linearity assumption failed',
      'Comparing coefficients across features without standardizing units first',
      'Fitting on time-series data and trusting i.i.d.-based p-values',
    ],
    tips: [
      'Always fit this first — it is the benchmark that justifies (or kills) anything complex',
      'Use statsmodels when you need inference, scikit-learn when you need pipelines',
      'Plot residuals vs fitted values before believing any metric',
      'Standardize features if you want comparable coefficient magnitudes',
    ],
  },
  {
    id: 'ridge_lasso_en', group: 'fam1', name: 'Ridge / Lasso / Elastic Net', formula: 'min ‖y−Xβ‖² + α·penalty(β)',
    tags: ['regularization', 'l1', 'l2', 'shrinkage', 'feature selection'],
    overview: "Ordinary least squares with a penalty that discourages large coefficients. Ridge (L2) shrinks everything smoothly; Lasso (L1) can push coefficients exactly to zero, doing automatic feature selection; Elastic Net blends both. The cure for many-correlated-features instability.",
    variables: [
      ['α (alpha)', 'penalty strength — 0 recovers plain OLS, large values shrink harder'],
      ['L2 penalty', 'α·Σβ² (Ridge) — smooth shrinkage, keeps all features'],
      ['L1 penalty', 'α·Σ|β| (Lasso) — corners in the constraint zero coefficients out'],
      ['l1_ratio', 'Elastic Net’s mix: 0 = pure Ridge, 1 = pure Lasso'],
    ],
    thinking: {
      workflow: [
        'Business problem: predict with MANY candidate drivers, possibly correlated',
        'Diagnosis: does plain OLS give huge, sign-flipping coefficients? Classic instability',
        'Choose penalty: need feature selection → Lasso; correlated groups → Ridge/Elastic Net',
        'Cross-validate α — never hand-pick it',
        'Inspect surviving coefficients; refit and sanity-check on held-out data',
      ],
      when: [
        'High-dimensional data — dozens to thousands of features',
        'Correlated predictors making OLS coefficients unstable',
        'You want an automatic, defensible feature-selection story (Lasso)',
      ],
      notWhen: [
        'A handful of well-understood features — plain OLS is simpler and unbiased',
        'You need unbiased coefficient estimates for inference (shrinkage biases them)',
        'Strong non-linearities — penalties do not fix the wrong functional form',
      ],
      assumptions: [
        'Same linear-form assumption as OLS',
        'Features standardized to comparable scales (the penalty is scale-sensitive)',
        'Penalty strength chosen by cross-validation, not by eye',
      ],
    },
    code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import RidgeCV, LassoCV, ElasticNetCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split

# --- 100 features, only 8 truly matter, heavy correlation ------------
X, y = make_regression(n_samples=400, n_features=100, n_informative=8,
                       noise=12.0, random_state=7)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

# Scaling INSIDE the pipeline so test data never leaks into the scaler.
ridge = make_pipeline(StandardScaler(), RidgeCV(alphas=np.logspace(-3, 3, 25)))
lasso = make_pipeline(StandardScaler(), LassoCV(cv=5, random_state=0))
enet  = make_pipeline(StandardScaler(),
                      ElasticNetCV(l1_ratio=[0.2, 0.5, 0.8, 0.95], cv=5,
                                   random_state=0))

for name, mdl in [("Ridge", ridge), ("Lasso", lasso), ("ElasticNet", enet)]:
    mdl.fit(X_tr, y_tr)
    est = mdl[-1]                       # the fitted regressor inside the pipe
    nonzero = int(np.sum(np.abs(est.coef_) > 1e-8))
    print(f"{name:10s}  R^2={mdl.score(X_te, y_te):.3f}  "
          f"alpha={est.alpha_:.4f}  nonzero coefs={nonzero}/100")
# Lasso should recover roughly the 8 real drivers and zero out the rest.`,
    scenario: {
      title: 'Macro nowcasting with hundreds of indicators',
      problem: 'Forecast this quarter’s GDP growth from hundreds of monthly indicators before official numbers arrive.',
      dataset: 'A wide panel: surveys, industrial production, retail sales, credit aggregates — far more series than quarters of history.',
      why: 'n ≪ p with heavy correlation between indicators is exactly where OLS collapses and shrinkage shines; Lasso additionally names WHICH indicators carry the signal.',
      output: 'A nowcast plus a short list of surviving indicators with signed weights.',
      interpretation: 'The sparse model doubles as an explanation: "credit growth and PMI are doing the work this quarter."',
      pitfalls: 'Lasso picks one of several correlated twins arbitrarily — do not over-read which twin survived.',
    },
    mistakes: [
      'Forgetting to standardize — the penalty then punishes features for having small units',
      'Fixing α by hand instead of cross-validating it',
      'Interpreting shrunken coefficients as unbiased effect sizes',
      'Letting the scaler see test data (fit it inside a pipeline)',
    ],
    tips: [
      'Elastic Net with l1_ratio ≈ 0.5 is the safest default when features come in correlated groups',
      'Use LassoCV/RidgeCV — the CV machinery is built in',
      'Plot the coefficient path (alpha vs coefficients) to explain the selection story',
      'Regularized macro baselines routinely beat fancier ML in nowcasting bake-offs',
    ],
  },
  {
    id: 'logreg', group: 'fam1', name: 'Logistic Regression', formula: 'P(y=1) = 1 / (1 + e^−(β₀+β₁x))',
    tags: ['classification', 'probability', 'odds', 'sigmoid', 'supervised'],
    overview: "The linear model for yes/no outcomes: a weighted sum of features pushed through a sigmoid so the output is a calibrated probability between 0 and 1. Coefficients speak in odds ratios, which is why it dominates in credit, medicine, and anywhere decisions must be defended.",
    variables: [
      ['σ(z)', 'sigmoid 1/(1+e^−z) — maps any number into (0, 1)'],
      ['β₁', 'change in log-odds of the positive class per unit of x'],
      ['e^β₁', 'odds ratio — multiplicative change in odds per unit of x'],
      ['threshold', 'the probability cutoff that turns scores into decisions (NOT always 0.5)'],
    ],
    thinking: {
      workflow: [
        'Business problem: predict a binary event (churn, default, disease)',
        'Data check: binary target, mostly monotone drivers',
        'Fit logistic regression as the interpretable baseline',
        'Look at calibration AND ranking (ROC-AUC), not accuracy alone',
        'Pick the decision threshold from business costs, not from 0.5',
        'Decision: ship if adequate; else escalate to GBMs and keep this as the challenger',
      ],
      when: [
        'Binary outcomes where you must explain each driver’s effect',
        'You need well-calibrated probabilities, not just labels',
        'Regulated settings (credit, healthcare) demanding transparent models',
      ],
      notWhen: [
        'Heavy non-linear feature interactions dominate (trees/GBMs win)',
        'Extreme class imbalance without reweighting or resampling',
        'Perfectly separable data — coefficients diverge without regularization',
      ],
      assumptions: [
        'Linearity between features and the LOG-ODDS (not the probability itself)',
        'Independent observations',
        'Little multicollinearity among features',
      ],
    },
    code: `import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import roc_auc_score, classification_report

# --- toy churn data --------------------------------------------------
rng = np.random.default_rng(1)
n = 2000
df = pd.DataFrame({
    "tenure_months": rng.uniform(1, 72, n),
    "support_calls": rng.poisson(2, n),
    "monthly_fee": rng.uniform(20, 110, n),
})
logit = -0.5 - 0.06 * df["tenure_months"] + 0.55 * df["support_calls"] \\
        + 0.015 * df["monthly_fee"]
df["churned"] = (rng.uniform(size=n) < 1 / (1 + np.exp(-logit))).astype(int)

X = df[["tenure_months", "support_calls", "monthly_fee"]]
X_tr, X_te, y_tr, y_te = train_test_split(X, df["churned"],
                                          stratify=df["churned"], random_state=0)

clf = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
clf.fit(X_tr, y_tr)

proba = clf.predict_proba(X_te)[:, 1]        # calibrated churn probabilities
print(f"ROC-AUC: {roc_auc_score(y_te, proba):.3f}")

# Odds ratios: the business-facing translation of the coefficients.
coefs = clf[-1].coef_[0]
for feat, b in zip(X.columns, coefs):
    print(f"{feat:15s} odds ratio per 1 SD = {np.exp(b):.2f}")

# Decision threshold chosen from costs (retention offer vs lost customer),
# NOT hard-coded at 0.5:
threshold = 0.30
print(classification_report(y_te, (proba >= threshold).astype(int), digits=3))`,
    scenario: {
      title: 'Customer churn prediction',
      problem: 'A telecom wants to target retention offers at subscribers likely to cancel next month.',
      dataset: 'Per-customer tenure, plan price, usage trends, and support-call counts, labeled with who actually churned.',
      why: 'Marketing needs a ranked call-list AND reasons ("3+ support calls triples churn odds") — logistic regression delivers both, with probabilities good enough to budget the campaign.',
      output: 'A churn probability per customer plus odds ratios per driver.',
      interpretation: 'Everyone above the cost-derived threshold gets an offer; the odds ratios feed the "why are they leaving" conversation.',
      pitfalls: 'Accuracy looks great at 90% when only 10% churn — judge on AUC, precision/recall, and calibration instead.',
    },
    mistakes: [
      'Using accuracy on imbalanced classes',
      'Leaving the threshold at 0.5 regardless of business costs',
      'Reading coefficients as probability changes (they are log-odds changes)',
      'Skipping regularization with many features — sklearn defaults to L2, keep it',
    ],
    tips: [
      'Report odds ratios (e^β), not raw coefficients, to non-technical audiences',
      'Check calibration with sklearn.calibration.calibration_curve before trusting probabilities',
      'class_weight="balanced" is the one-line fix to try first on imbalanced data',
      'Standardize features so coefficient magnitudes are comparable',
    ],
  },
  {
    id: 'knn', group: 'fam2', name: 'K-Nearest Neighbors (KNN)', formula: 'ŷ = vote / mean of k closest points',
    tags: ['classification', 'regression', 'instance-based', 'lazy learning'],
    overview: "No equations get fitted at all: to predict a new point, find the k most similar historical points and let them vote (classification) or average (regression). The whole model IS the training data plus a distance metric — simple, local, and assumption-free.",
    variables: [
      ['k', 'number of neighbors consulted — small k = flexible/noisy, large k = smooth/blurry'],
      ['distance', 'similarity metric (Euclidean by default) — the heart of the model'],
      ['weights', '"uniform" (each neighbor equal) or "distance" (closer counts more)'],
    ],
    thinking: {
      workflow: [
        'Business problem: "things similar to X behaved like Y" is a plausible story',
        'Data check: features numeric and scaled? Distance is meaningless otherwise',
        'Pick k by cross-validation; odd k avoids classification ties',
        'Sanity-check speed: prediction cost grows with the training set',
        'Decision: great baseline / prototype; swap for a parametric model at scale',
      ],
      when: [
        'Decision boundaries are irregular and local patterns matter',
        'Small-to-medium datasets where prediction latency is acceptable',
        'You want a no-training-step baseline in minutes',
      ],
      notWhen: [
        'High-dimensional feature spaces — distances concentrate and lose meaning',
        'Millions of rows with tight latency budgets (every prediction scans neighbors)',
        'Features on wildly different scales that you refuse to standardize',
      ],
      assumptions: [
        'Locality: nearby points share outcomes',
        'A distance metric that reflects real similarity',
        'Features scaled so no single unit dominates the distance',
      ],
    },
    code: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import GridSearchCV, train_test_split

# --- crescent-shaped classes: a boundary lines cannot draw -----------
X, y = make_moons(n_samples=600, noise=0.25, random_state=3)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

# Scaling matters: KNN is 100% distance-based.
pipe = make_pipeline(StandardScaler(), KNeighborsClassifier())

# Choose k (and voting scheme) by cross-validation, never by gut feel.
grid = GridSearchCV(
    pipe,
    {"kneighborsclassifier__n_neighbors": [3, 5, 9, 15, 25, 41],
     "kneighborsclassifier__weights": ["uniform", "distance"]},
    cv=5,
)
grid.fit(X_tr, y_tr)
print("best params:", grid.best_params_)
print(f"test accuracy: {grid.score(X_te, y_te):.3f}")

# Peek at one prediction's neighborhood — the model's entire "reasoning".
knn = grid.best_estimator_
dist, idx = knn[-1].kneighbors(knn[0].transform(X_te[:1]))
print("nearest-neighbor labels:", y_tr[idx[0]], "-> predicted:",
      knn.predict(X_te[:1])[0])`,
    scenario: {
      title: 'Product recommendation cold-start',
      problem: 'Recommend a plan tier for a brand-new customer with no usage history.',
      dataset: 'Existing customers’ signup attributes (company size, industry, region) and the tier they ended up happy with.',
      why: '"Customers who looked like you at signup chose Pro" is exactly the KNN mechanism — and doubles as the user-facing explanation.',
      output: 'A recommended tier plus the k most similar customers behind the vote.',
      interpretation: 'The neighbor list is the explanation — show it to sales as "lookalike accounts."',
      pitfalls: 'One unscaled feature (revenue in dollars vs headcount in units) silently owns the whole distance.',
    },
    mistakes: [
      'Skipping standardization — the #1 KNN bug',
      'Even k in binary classification, producing coin-flip ties',
      'Using it on hundreds of features where distance stops meaning anything',
      'Forgetting that the whole training set ships with the model',
    ],
    tips: [
      'Start with k ≈ √n and tune from there with CV',
      'weights="distance" usually helps when classes overlap',
      'Reduce dimensions (PCA) before KNN in high-dimensional data',
      'Use KDTree/BallTree (sklearn picks automatically) — but latency still scales with n',
    ],
  },
  {
    id: 'naive_bayes', group: 'fam2', name: 'Naive Bayes', formula: 'P(y|x) ∝ P(y)·Π P(xᵢ|y)',
    tags: ['classification', 'bayes', 'text', 'probabilistic', 'spam'],
    overview: "Applies Bayes' theorem with one bold simplification: treat every feature as independent given the class. Wrong in theory, absurdly effective in practice for text — spam filtering ran on this for a decade. Trains in one pass and needs almost no data to get useful.",
    variables: [
      ['P(y)', 'prior — how common each class is before seeing features'],
      ['P(xᵢ|y)', 'likelihood of feature i within class y (e.g., word frequency in spam)'],
      ['P(y|x)', 'posterior — updated class probability after seeing all features'],
      ['naive part', 'the Π: features multiplied as if independent given the class'],
    ],
    thinking: {
      workflow: [
        'Business problem: classify items with MANY sparse features (words, event flags)',
        'Data check: counts or frequencies? → Multinomial; continuous → Gaussian variant',
        'Fit in seconds; establish the baseline before anything heavier',
        'Check whether the independence lie is costing you (correlated features double-count)',
        'Decision: keep for speed/streaming, or graduate to linear/GBM models',
      ],
      when: [
        'Text classification: spam, topic tagging, sentiment baselines',
        'Tiny training sets — priors and smoothing keep it stable',
        'Streaming settings needing instant retraining',
      ],
      notWhen: [
        'Strongly correlated features whose evidence gets double-counted',
        'You need well-calibrated probabilities (NB is famously overconfident)',
        'Feature interactions carry the signal',
      ],
      assumptions: [
        'Conditional independence of features given the class (knowingly false, often harmless)',
        'Training data represents the true class priors — or set them explicitly',
      ],
    },
    code: `from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report

# --- classic text task: which newsgroup did a post come from? --------
cats = ["sci.space", "rec.sport.hockey", "comp.graphics"]
train = fetch_20newsgroups(subset="train", categories=cats,
                           remove=("headers", "footers", "quotes"))
test = fetch_20newsgroups(subset="test", categories=cats,
                          remove=("headers", "footers", "quotes"))

# Bag-of-words -> class-conditional word likelihoods. alpha is Laplace
# smoothing: no word ever gets probability exactly zero.
clf = make_pipeline(TfidfVectorizer(stop_words="english"),
                    MultinomialNB(alpha=0.1))
clf.fit(train.data, train.target)

print(classification_report(test.target, clf.predict(test.data),
                            target_names=cats, digits=3))

# The model's "reasoning": the most spam^H^H space-flavored words.
import numpy as np
vec, nb = clf[0], clf[1]
words = np.array(vec.get_feature_names_out())
space_idx = cats.index("sci.space")
top = np.argsort(nb.feature_log_prob_[space_idx])[-8:]
print("most space-y words:", words[top][::-1])`,
    scenario: {
      title: 'Spam / phishing email filtering',
      problem: 'Route obvious junk away from inboxes in real time, retraining as attackers adapt.',
      dataset: 'Emails labeled spam/ham, features = word and header-token counts.',
      why: 'Millions of sparse word features, need for one-pass training and instant updates: the exact regime NB owns. Priors handle the ham-heavy imbalance naturally.',
      output: 'Per-email spam probability and the most incriminating tokens.',
      interpretation: 'Tokens with the highest spam-likelihood ratios become explainable filter evidence.',
      pitfalls: 'Correlated phrases ("free" + "viagra" + "click here") get double-counted, inflating confidence — rank by score, distrust the raw probability.',
    },
    mistakes: [
      'Using Gaussian NB on word counts (use MultinomialNB/ComplementNB)',
      'Forgetting smoothing and letting one unseen word zero out a class',
      'Trusting its overconfident probabilities without calibration',
      'Judging by accuracy under class imbalance',
    ],
    tips: [
      'ComplementNB is a drop-in that handles imbalanced text better',
      'Tune alpha (smoothing) — it is the model’s only real knob',
      'Great as the "how much do fancier models actually buy us?" benchmark',
      'Calibrate with CalibratedClassifierCV if downstream code consumes probabilities',
    ],
  },
  {
    id: 'dtree', group: 'fam3', name: 'Decision Tree', formula: 'recursive if/else splits',
    tags: ['classification', 'regression', 'interpretable', 'cart'],
    overview: "Learns a flowchart: at each node, pick the single feature-threshold split that best purifies the outcome, and recurse. The result reads like business rules ('IF tenure < 6mo AND support_calls > 3 THEN high churn risk') — which is both its superpower and, unpruned, its downfall (memorizing noise).",
    variables: [
      ['split', 'a feature + threshold that partitions the data (e.g., age < 30)'],
      ['impurity', 'Gini or entropy — how mixed a node’s outcomes are'],
      ['max_depth', 'how many questions deep the flowchart may go'],
      ['leaf', 'a terminal node — its majority class / mean is the prediction'],
    ],
    thinking: {
      workflow: [
        'Business problem: need predictions AND human-readable rules',
        'Fit a shallow tree first (max_depth 3–4) and READ it',
        'Check: do the top splits match domain intuition? Great sanity check on the data',
        'Tune depth/min_samples_leaf by CV to stop noise-memorization',
        'Decision: ship the tree if rules matter most; feed it to a forest/GBM if accuracy does',
      ],
      when: [
        'Stakeholders must audit the decision logic line by line',
        'Mixed numeric + categorical features, no scaling patience',
        'Non-linear thresholds and interactions matter ("only risky IF young AND high-limit")',
      ],
      notWhen: [
        'Maximum accuracy is the goal — ensembles of trees beat single trees ~always',
        'Smooth linear relationships (a line beats a staircase)',
        'Tiny datasets where one noisy split reroutes the whole flowchart',
      ],
      assumptions: [
        'Almost none about data distribution — the appeal',
        'But: axis-aligned splits (thresholds on one feature at a time)',
        'Stability is NOT assumed — small data changes can rebuild the tree',
      ],
    },
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split, GridSearchCV

data = load_breast_cancer()
X_tr, X_te, y_tr, y_te = train_test_split(data.data, data.target,
                                          stratify=data.target, random_state=0)

# Depth is THE overfitting knob — cross-validate it, don't guess it.
grid = GridSearchCV(
    DecisionTreeClassifier(random_state=0),
    {"max_depth": [2, 3, 4, 5, 8, None],
     "min_samples_leaf": [1, 5, 20]},
    cv=5,
)
grid.fit(X_tr, y_tr)
tree = grid.best_estimator_
print("best:", grid.best_params_, f" test acc: {tree.score(X_te, y_te):.3f}")

# The whole model, printed as readable rules:
print(export_text(tree, feature_names=list(data.feature_names),
                  max_depth=2, decimals=1))

# Which features drive the splits?
import numpy as np
top = np.argsort(tree.feature_importances_)[-5:][::-1]
for i in top:
    print(f"{data.feature_names[i]:25s} importance={tree.feature_importances_[i]:.2f}")`,
    scenario: {
      title: 'Loan application triage rules',
      problem: 'A lender wants an auditable first-pass rule set that routes applications to approve / review / decline.',
      dataset: 'Historical applications: income, debt ratio, credit history length, past delinquencies, and the repayment outcome.',
      why: 'Regulators and credit officers must read the exact logic; a depth-4 tree IS the policy document.',
      output: 'A printable flowchart of thresholds with default rates per leaf.',
      interpretation: 'Each leaf becomes a policy cell: "debt ratio > 0.45 and delinquencies ≥ 2 → 31% default rate → decline."',
      pitfalls: 'A tree grown to purity memorizes the training set — depth control is not optional.',
    },
    mistakes: [
      'No depth/leaf-size limits — unpruned trees overfit almost by definition',
      'Re-fitting on slightly different data and being surprised the rules changed completely',
      'Reading feature_importances_ as causal effects',
      'Using a single tree when accuracy (not auditability) is the actual goal',
    ],
    tips: [
      'Start at max_depth=3: if it is not already useful, more depth rarely saves you',
      'export_text / plot_tree turn the model into the documentation',
      'min_samples_leaf ≥ ~20 keeps leaves statistically meaningful',
      'Trees are the building block — understand one before trusting a forest of them',
    ],
  },
  {
    id: 'rf', group: 'fam3', name: 'Random Forest', formula: 'average of B decorrelated trees',
    tags: ['ensemble', 'bagging', 'classification', 'regression', 'tabular'],
    overview: "Grow hundreds of deep trees, each on a bootstrap resample AND a random subset of features per split, then average. Individual trees overfit wildly; their decorrelated errors cancel in the average. The most reliable 'works out of the box' model on tabular data.",
    variables: [
      ['n_estimators', 'number of trees — more is better until it plateaus'],
      ['max_features', 'features sampled per split — the decorrelation knob'],
      ['bootstrap sample', 'each tree trains on n rows drawn with replacement'],
      ['OOB score', 'free validation from rows each tree never saw'],
    ],
    thinking: {
      workflow: [
        'Business problem: strong tabular accuracy with minimal tuning time',
        'Fit RF with defaults — it is the honest first benchmark',
        'Check OOB score vs test score for a quick generalization read',
        'Use permutation importance to hand analysts a driver ranking',
        'Decision: often good enough; GBMs when the last few % matter',
      ],
      when: [
        'Tabular data, mixed feature types, unknown interactions',
        'You want strong results TODAY with near-zero tuning',
        'Noisy features abound — the ensemble shrugs them off',
      ],
      notWhen: [
        'You must extrapolate beyond the training range (trees predict constants out there)',
        'Model size / latency is tight (hundreds of deep trees are heavy)',
        'A single explainable rule set is the requirement',
      ],
      assumptions: [
        'Essentially distribution-free',
        'Errors of individual trees are (made) roughly independent — that is the whole trick',
      ],
    },
    code: `import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.inspection import permutation_importance
from sklearn.metrics import mean_absolute_error

X, y = fetch_california_housing(return_X_y=True, as_frame=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

rf = RandomForestRegressor(
    n_estimators=400,       # plateaus around a few hundred
    min_samples_leaf=2,
    max_features=0.5,       # feature subsampling = tree decorrelation
    oob_score=True,         # free validation from out-of-bag rows
    n_jobs=-1,
    random_state=0,
)
rf.fit(X_tr, y_tr)

print(f"OOB  R^2: {rf.oob_score_:.3f}")
print(f"test R^2: {rf.score(X_te, y_te):.3f}")
print(f"test MAE: {mean_absolute_error(y_te, rf.predict(X_te)):.3f} (x$100k)")

# Permutation importance > impurity importance (less biased toward
# high-cardinality features):
imp = permutation_importance(rf, X_te, y_te, n_repeats=5, random_state=0)
for i in np.argsort(imp.importances_mean)[::-1][:5]:
    print(f"{X.columns[i]:12s} {imp.importances_mean[i]:.3f}")`,
    scenario: {
      title: 'House price prediction at scale',
      problem: 'An aggregator needs automated valuations across heterogeneous regions without per-region modeling.',
      dataset: 'Property attributes, census-block demographics, coordinates, and sale prices.',
      why: 'Non-linearities (coastal premiums, density thresholds) and interactions everywhere; RF captures them with default settings and gives a defensible driver ranking.',
      output: 'Valuation per property plus permutation-importance ranking of drivers.',
      interpretation: 'Median income and location dominate; the MAE (~$30k) frames how much to trust individual valuations.',
      pitfalls: 'Prices beyond the training range (new luxury tier) get clipped — trees cannot extrapolate.',
    },
    mistakes: [
      'Tuning n_estimators as if more trees could overfit (they just plateau)',
      'Trusting impurity-based importances with high-cardinality categoricals',
      'Expecting extrapolation beyond the training range',
      'Skipping the OOB score — it is a free honest estimate',
    ],
    tips: [
      'Defaults are strong: n_estimators=300–500, min_samples_leaf=1–5, tune max_features first',
      'n_jobs=-1 — forests parallelize perfectly',
      'Use it as the benchmark every deep-learning proposal must beat on tabular data',
      'For intervals, look at quantile forests / per-tree prediction spread',
    ],
  },
  {
    id: 'gbm', group: 'fam3', name: 'Gradient Boosting (general)', formula: 'Fₘ = Fₘ₋₁ + η·hₘ(residuals)',
    tags: ['ensemble', 'boosting', 'sequential', 'tabular'],
    overview: "Builds shallow trees one at a time, each fitted to the errors the ensemble still makes, added with a small learning rate. Where a forest averages away variance, boosting relentlessly chews down bias — usually the most accurate family on tabular data, at the price of real tuning.",
    variables: [
      ['Fₘ', 'ensemble prediction after m trees'],
      ['hₘ', 'the m-th weak tree, fit to current residuals/gradients'],
      ['η (learning_rate)', 'shrinkage per step — small η + more trees generalizes better'],
      ['max_depth', 'weak-learner depth, typically just 2–6'],
    ],
    thinking: {
      workflow: [
        'Business problem: squeeze maximum accuracy from tabular data',
        'Baseline first (linear/RF) so the gain is measurable',
        'Fit GBM with early stopping on a validation set',
        'Tune learning_rate + n_estimators together, then depth/subsampling',
        'Decision: worth the tuning when a % of accuracy has business value',
      ],
      when: [
        'Tabular prediction where accuracy is the KPI',
        'Complex non-linearities and interactions in medium-sized data',
        'You can afford proper validation and tuning discipline',
      ],
      notWhen: [
        'Very noisy targets — boosting happily fits the noise without early stopping',
        'You need a fit-and-forget model (that is the forest’s job)',
        'Latency-critical scoring of enormous ensembles',
      ],
      assumptions: [
        'Distribution-free like all trees',
        'But assumes you will validate honestly — boosting WILL overfit if allowed',
      ],
    },
    code: `from sklearn.datasets import make_classification
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

X, y = make_classification(n_samples=8000, n_features=25, n_informative=8,
                           weights=[0.85], random_state=5)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, stratify=y, random_state=0)

# sklearn's modern LightGBM-style implementation: histogram binning,
# native NaN handling, built-in early stopping.
gbm = HistGradientBoostingClassifier(
    learning_rate=0.06,
    max_iter=1000,             # ceiling; early stopping picks the real number
    max_depth=4,               # weak learners stay shallow
    validation_fraction=0.15,
    early_stopping=True,
    n_iter_no_change=30,
    random_state=0,
)
gbm.fit(X_tr, y_tr)

print(f"trees actually used: {gbm.n_iter_}")
proba = gbm.predict_proba(X_te)[:, 1]
print(f"test ROC-AUC: {roc_auc_score(y_te, proba):.3f}")

# The core trade-off, made visible: lower learning rate -> more trees,
# usually better generalization.
for lr in [0.3, 0.1, 0.03]:
    m = HistGradientBoostingClassifier(learning_rate=lr, max_iter=2000,
                                       early_stopping=True, random_state=0)
    m.fit(X_tr, y_tr)
    auc = roc_auc_score(y_te, m.predict_proba(X_te)[:, 1])
    print(f"lr={lr:4}  trees={m.n_iter_:4d}  AUC={auc:.3f}")`,
    scenario: {
      title: 'Fraud detection scoring',
      problem: 'A payments company must rank transactions by fraud risk in near-real-time, catching subtle interaction patterns.',
      dataset: 'Transaction amount, merchant category, device, velocity counters, and confirmed-fraud labels (heavily imbalanced).',
      why: 'Fraud signal lives in interactions (new device AND unusual hour AND high amount); boosting finds them and ranks with state-of-the-art AUC.',
      output: 'A fraud score per transaction; thresholds map to block / challenge / allow.',
      interpretation: 'Every point of AUC translates directly to fraud caught vs customers annoyed — tuning pays for itself.',
      pitfalls: 'Class imbalance + noisy labels: without early stopping and careful thresholds, the model memorizes yesterday’s fraud patterns.',
    },
    mistakes: [
      'No early stopping — the single biggest boosting error',
      'Tuning depth like a forest (boosted trees should stay shallow)',
      'Judging on accuracy with 1% positives',
      'Letting validation data leak through feature engineering',
    ],
    tips: [
      'HistGradientBoosting* is sklearn’s fast modern default — start there',
      'Lower the learning rate whenever you can afford more trees',
      'subsample<1.0 (stochastic boosting) adds useful regularization',
      'Track train-vs-validation curves; diverging curves = stop earlier',
    ],
  },
  {
    id: 'xgboost', group: 'fam3', name: 'XGBoost', formula: 'boosting + L1/L2 regularization',
    tags: ['ensemble', 'boosting', 'kaggle', 'regularized', 'tabular'],
    overview: "Gradient boosting re-engineered: regularization terms in the objective itself, clever split-finding, column subsampling, and native missing-value handling. The competition-winning workhorse of the 2015–2020 tabular era, still a top choice in production.",
    variables: [
      ['eta / learning_rate', 'shrinkage per boosting round'],
      ['lambda, alpha', 'L2 / L1 penalties on leaf weights — the "regularized" part'],
      ['subsample, colsample_bytree', 'row/column sampling per tree'],
      ['early_stopping_rounds', 'stop when validation stops improving'],
    ],
    thinking: {
      workflow: [
        'Business problem: top-tier tabular accuracy with production tooling',
        'Start from sane defaults (eta 0.05–0.1, max_depth 4–6)',
        'Always fit with eval_set + early stopping',
        'Tune subsample/colsample and the L1/L2 penalties for noise control',
        'Decision: XGBoost vs LightGBM/CatBoost is a benchmark, not a religion',
      ],
      when: [
        'Structured/tabular problems where accuracy is paramount',
        'Missing values and mixed features you would rather not babysit',
        'You need mature deployment tooling (ONNX, SHAP, every cloud)',
      ],
      notWhen: [
        'Images, audio, raw text — deep learning territory',
        'Tiny datasets where a linear model is honest and sufficient',
        'Strict interpretability mandates (use SHAP, or use simpler models)',
      ],
      assumptions: [
        'Distribution-free; assumes honest validation discipline',
        'Hyperparameters interact — tune learning rate and tree count together',
      ],
    },
    code: `# pip install xgboost
import numpy as np
import xgboost as xgb
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

X, y = make_classification(n_samples=10000, n_features=30, n_informative=10,
                           weights=[0.9], random_state=11)
X_tr, X_va, y_tr, y_va = train_test_split(X, y, stratify=y, random_state=0)

model = xgb.XGBClassifier(
    n_estimators=2000,            # ceiling — early stopping decides
    learning_rate=0.05,
    max_depth=5,
    subsample=0.8,                # row sampling per tree
    colsample_bytree=0.8,         # column sampling per tree
    reg_lambda=1.0,               # L2 on leaf weights
    scale_pos_weight=9.0,         # class-imbalance correction (~neg/pos)
    eval_metric="auc",
    early_stopping_rounds=50,
    random_state=0,
)
model.fit(X_tr, y_tr, eval_set=[(X_va, y_va)], verbose=False)

print(f"best iteration: {model.best_iteration}")
print(f"val ROC-AUC   : {roc_auc_score(y_va, model.predict_proba(X_va)[:,1]):.3f}")

# Feature attribution the modern way (SHAP-style, built in):
booster = model.get_booster()
scores = booster.get_score(importance_type="gain")
top = sorted(scores.items(), key=lambda kv: -kv[1])[:5]
print("top gain features:", top)`,
    scenario: {
      title: 'Loan default prediction',
      problem: 'A fintech underwrites personal loans and needs default probabilities that beat the incumbent scorecard.',
      dataset: 'Bureau attributes, income, utilization, delinquency history, alternative data; labeled by repayment outcome.',
      why: 'Tabular, imbalanced, interaction-heavy, riddled with missing bureau fields — XGBoost handles all four natively and its SHAP integration satisfies model-risk review.',
      output: 'Default probability per application; SHAP values per decision for adverse-action reasons.',
      interpretation: 'A 2-point AUC gain over the scorecard = measurable losses avoided at the same approval rate.',
      pitfalls: 'Temporal leakage — always split train/validation by application date, not randomly.',
    },
    mistakes: [
      'Random CV splits on time-stamped credit data (leakage)',
      'Skipping scale_pos_weight or resampling under heavy imbalance',
      'Grid-searching everything at once instead of lr→trees→sampling→regularization',
      'Ignoring best_iteration and predicting with all 2000 trees',
    ],
    tips: [
      'eta 0.05 with early stopping is a reliable starting recipe',
      'Use the sklearn wrapper for pipelines, the native API for speed at scale',
      'SHAP (shap.TreeExplainer) is effectively standard for explaining XGBoost',
      'Benchmark against LightGBM — one of them usually wins per dataset, cheaply',
    ],
  },
  {
    id: 'lightgbm', group: 'fam3', name: 'LightGBM', formula: 'histogram-based leaf-wise boosting',
    tags: ['ensemble', 'boosting', 'fast', 'large-scale', 'tabular'],
    overview: "Microsoft's gradient boosting built for speed: features binned into histograms, trees grown leaf-wise (deepening wherever loss falls fastest), plus native categorical support. On large tabular datasets it trains many times faster than classic XGBoost at comparable accuracy.",
    variables: [
      ['num_leaves', 'complexity knob of leaf-wise growth (NOT the same as depth)'],
      ['min_data_in_leaf', 'main overfitting guard for leaf-wise trees'],
      ['feature/bagging_fraction', 'column/row subsampling'],
      ['categorical_feature', 'columns LightGBM splits natively, no one-hot needed'],
    ],
    thinking: {
      workflow: [
        'Business problem: boosting-grade accuracy on data too big to iterate slowly',
        'Mark categoricals with dtype "category" — skip one-hot entirely',
        'Fit with early stopping; watch num_leaves vs min_data_in_leaf balance',
        'Profile: if experiments now take minutes not hours, iterate more, tune less',
        'Decision: default GBM for large data; validate against XGBoost when close',
      ],
      when: [
        'Hundreds of thousands to hundreds of millions of rows',
        'High-cardinality categoricals (store IDs, SKUs) you refuse to one-hot',
        'Fast experiment cycles matter — retraining daily, tuning at scale',
      ],
      notWhen: [
        'Small datasets — leaf-wise growth overfits them faster than depth-wise',
        'Unstructured data (images/text) — wrong tool family',
        'When default XGBoost already meets the bar and is entrenched',
      ],
      assumptions: [
        'Distribution-free; histogram binning trades a little precision for a lot of speed',
        'Leaf-wise growth assumes you will cap num_leaves / min_data_in_leaf honestly',
      ],
    },
    code: `# pip install lightgbm
import numpy as np
import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# --- retail demand: numeric + high-cardinality categoricals ----------
rng = np.random.default_rng(0)
n = 100_000
df = pd.DataFrame({
    "store_id": pd.Categorical(rng.integers(0, 500, n)),   # 500 stores
    "sku_id": pd.Categorical(rng.integers(0, 2000, n)),    # 2000 SKUs
    "price": rng.uniform(1, 60, n),
    "promo": rng.integers(0, 2, n),
    "dow": rng.integers(0, 7, n),
})
base = 20 - 0.25 * df["price"] + 8 * df["promo"] + 2 * np.sin(df["dow"])
df["units"] = np.maximum(0, base + rng.normal(0, 4, n)).round()

feats = ["store_id", "sku_id", "price", "promo", "dow"]
X_tr, X_va, y_tr, y_va = train_test_split(df[feats], df["units"],
                                          random_state=0)

model = lgb.LGBMRegressor(
    n_estimators=3000,
    learning_rate=0.05,
    num_leaves=63,              # leaf-wise complexity knob
    min_child_samples=50,       # overfitting guard
    subsample=0.8, colsample_bytree=0.8,
    random_state=0,
)
model.fit(X_tr, y_tr,
          eval_set=[(X_va, y_va)],
          eval_metric="l1",
          callbacks=[lgb.early_stopping(100), lgb.log_evaluation(0)])

pred = model.predict(X_va, num_iteration=model.best_iteration_)
print(f"best iter: {model.best_iteration_}   val MAE: "
      f"{mean_absolute_error(y_va, pred):.2f} units")`,
    scenario: {
      title: 'Product demand forecasting',
      problem: 'A retail chain forecasts daily units per store × SKU to drive replenishment for thousands of stores.',
      dataset: 'Two years of sales with store/SKU ids, price, promotions, calendar features — tens of millions of rows.',
      why: 'Massive rows + high-cardinality categoricals + retrain-nightly requirements: LightGBM’s histogram + native-categorical design is built for exactly this.',
      output: 'Per store-SKU-day unit forecasts feeding the replenishment optimizer.',
      interpretation: 'MAE in units converts directly to stockout vs spoilage costs in the ordering policy.',
      pitfalls: 'Random splits leak future promotions into training — split by date, always.',
    },
    mistakes: [
      'One-hot encoding 2000 SKUs instead of using native categoricals',
      'num_leaves cranked high with min_data_in_leaf left tiny (classic overfit)',
      'Random instead of temporal validation on demand data',
      'Forgetting num_iteration=best_iteration_ at predict time',
    ],
    tips: [
      'Rule of thumb: num_leaves ≤ 2^max_depth if you also cap depth',
      'dtype="category" on id-like columns unlocks the native categorical handling',
      'lgb.early_stopping(100) callbacks keep training honest',
      'Its speed is a strategy: more feature-engineering iterations beats deeper tuning',
    ],
  },
  {
    id: 'catboost', group: 'fam3', name: 'CatBoost', formula: 'ordered boosting + target-encoded categoricals',
    tags: ['ensemble', 'boosting', 'categorical', 'tabular'],
    overview: "Yandex's boosting library whose signature trick is safe, automatic target encoding of categorical features (ordered so no row sees its own label), plus ordered boosting against overfitting. Frequently the best out-of-the-box performer on category-heavy business data.",
    variables: [
      ['cat_features', 'columns CatBoost target-encodes internally'],
      ['ordered target encoding', 'category → smoothed outcome average, computed causally row-by-row'],
      ['iterations / learning_rate', 'the usual boosting pair'],
      ['depth', 'symmetric-tree depth (CatBoost trees are oblivious/balanced)'],
    ],
    thinking: {
      workflow: [
        'Business problem: prediction on data dominated by categorical columns',
        'Hand CatBoost the raw categoricals — no encoding pipeline at all',
        'Fit with eval_set + early stopping (use_best_model=True)',
        'Compare against LightGBM: whoever wins the benchmark ships',
        'Decision: strongest default when categories are the story',
      ],
      when: [
        'Many high-cardinality categoricals (city, merchant, occupation…)',
        'You want minimal preprocessing and strong defaults',
        'Small-to-medium datasets where its regularization shines',
      ],
      notWhen: [
        'Purely numeric data — its edge mostly disappears',
        'Tightest training-speed budgets (LightGBM is usually faster)',
        'Unstructured data — as with all GBMs',
      ],
      assumptions: [
        'Distribution-free; ordered encoding specifically guards against target leakage',
        'Categories seen in serving should mostly exist in training',
      ],
    },
    code: `# pip install catboost
import numpy as np
import pandas as pd
from catboost import CatBoostClassifier, Pool
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# --- insurance-style data: mostly categorical drivers ----------------
rng = np.random.default_rng(2)
n = 20_000
df = pd.DataFrame({
    "region": rng.choice([f"R{i}" for i in range(40)], n),
    "occupation": rng.choice([f"job_{i}" for i in range(120)], n),
    "vehicle": rng.choice(["hatch", "sedan", "suv", "truck", "sport"], n),
    "age": rng.integers(18, 80, n),
    "premium": rng.uniform(300, 3000, n),
})
risk = (df["vehicle"].isin(["sport", "truck"]) * 0.8
        + (df["age"] < 25) * 0.9 + rng.normal(0, 1, n))
df["claim"] = (risk > 1.0).astype(int)

cats = ["region", "occupation", "vehicle"]
X = df[cats + ["age", "premium"]]
X_tr, X_va, y_tr, y_va = train_test_split(X, df["claim"],
                                          stratify=df["claim"], random_state=0)

model = CatBoostClassifier(
    iterations=2000,
    learning_rate=0.05,
    depth=6,
    eval_metric="AUC",
    early_stopping_rounds=100,
    use_best_model=True,
    verbose=0,
    random_seed=0,
)
# Raw strings in, no one-hot, no manual target encoding:
model.fit(Pool(X_tr, y_tr, cat_features=cats),
          eval_set=Pool(X_va, y_va, cat_features=cats))

print(f"best iter: {model.get_best_iteration()}")
print(f"val AUC  : {roc_auc_score(y_va, model.predict_proba(X_va)[:,1]):.3f}")
print(dict(zip(X.columns, model.get_feature_importance().round(1))))`,
    scenario: {
      title: 'Insurance claim risk scoring',
      problem: 'An insurer prices policies using applicant attributes that are almost entirely categorical.',
      dataset: 'Region, occupation, vehicle class, plus a few numerics; labeled with first-year claim occurrence.',
      why: 'Naive one-hot explodes dimensionality and manual target encoding leaks labels; CatBoost’s ordered encoding does it correctly and automatically.',
      output: 'Claim probability per applicant feeding the pricing engine.',
      interpretation: 'Feature importances name which categorical dimensions actually drive risk — direct input for actuarial review.',
      pitfalls: 'Rare categories (an occupation seen 3 times) get heavily smoothed — their effects are conservative by design.',
    },
    mistakes: [
      'One-hot encoding before CatBoost, throwing away its main advantage',
      'Manual target encoding computed on the full dataset (label leakage)',
      'Ignoring use_best_model / early stopping',
      'Comparing to other GBMs without giving each its natural preprocessing',
    ],
    tips: [
      'Pass cat_features and let it work — that IS the workflow',
      'Strong small-data performer: ordered boosting resists overfitting',
      'get_feature_importance(type="LossFunctionChange") is more faithful than default',
      'One of the three GBMs (XGB/LGBM/CatBoost) wins per dataset — benchmark all three when stakes justify it',
    ],
  },
  {
    id: 'bagging', group: 'fam3', name: 'Bagging (general)', formula: 'avg of models on bootstrap samples',
    tags: ['ensemble', 'variance reduction', 'bootstrap'],
    overview: "The general recipe behind random forests: train the same unstable model on many bootstrap resamples and average the results. Averaging cancels the variance that comes from any single model overreacting to its particular sample — a pure variance-reduction machine.",
    variables: [
      ['bootstrap sample', 'n rows drawn WITH replacement (~63% unique rows each)'],
      ['base estimator', 'any high-variance model — deep trees are the classic choice'],
      ['n_estimators', 'number of resampled models averaged'],
      ['OOB estimate', 'validation from the ~37% of rows each model missed'],
    ],
    thinking: {
      workflow: [
        'Diagnosis: does your model change a lot when the training sample changes? High variance',
        'Wrap it in bagging: same model, B bootstrap fits, average',
        'Verify variance actually fell (OOB / CV spread shrinks)',
        'Decision: bagging for variance problems; boosting for bias problems',
      ],
      when: [
        'Unstable base learners: deep trees, k-small KNN',
        'You want a conceptually simple, parallelizable accuracy boost',
        'Free validation via OOB appeals (no separate holdout burn)',
      ],
      notWhen: [
        'The base model UNDERFITS — averaging biased models keeps the bias',
        'Stable learners (linear regression) — averaging near-identical fits buys nothing',
        'A single interpretable model is the requirement',
      ],
      assumptions: [
        'Base learners must be unstable enough that resampling diversifies them',
        'Errors across resampled models are at least partly independent',
      ],
    },
    code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.ensemble import BaggingRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import cross_val_score

X, y = make_regression(n_samples=500, n_features=12, noise=25, random_state=4)

# A deliberately high-variance base learner: an unpruned deep tree.
deep_tree = DecisionTreeRegressor(random_state=0)

bagged = BaggingRegressor(
    estimator=DecisionTreeRegressor(),
    n_estimators=200,
    oob_score=True,      # free validation from out-of-bag rows
    n_jobs=-1,
    random_state=0,
)

# Bagging's entire value proposition, in two cross-validation lines:
for name, mdl in [("single deep tree", deep_tree), ("bagged x200", bagged)]:
    scores = cross_val_score(mdl, X, y, cv=5, scoring="r2")
    print(f"{name:18s} R^2 = {scores.mean():.3f} (+/- {scores.std():.3f})")
# Same bias family, dramatically lower variance -> higher, steadier score.

bagged.fit(X, y)
print(f"OOB R^2: {bagged.oob_score_:.3f}")`,
    scenario: {
      title: 'Stabilizing a volatile pricing model',
      problem: 'A pricing team’s decision-tree model changes recommendations sharply every time it is retrained on a new month.',
      dataset: 'The same transactional pricing data — the instability is the model’s, not the data’s.',
      why: 'Retraining churn is textbook variance; bagging the same tree over bootstrap months averages the churn away without changing the modeling approach.',
      output: 'A bagged ensemble whose month-over-month recommendations move smoothly.',
      interpretation: 'Stakeholders regain trust because recommendations stop whipsawing; accuracy typically improves too.',
      pitfalls: 'If the underlying tree was also biased (too shallow), bagging locks that bias in.',
    },
    mistakes: [
      'Bagging a stable model and expecting gains',
      'Using it to fix underfitting (that is boosting’s job)',
      'Forgetting oob_score=True and burning a holdout unnecessarily',
    ],
    tips: [
      'Remember the diagnosis rule: variance → bag, bias → boost',
      'Random forest = bagging + per-split feature sampling; prefer it for trees',
      'Perfectly parallel — n_jobs=-1 scales linearly',
    ],
  },
  {
    id: 'boosting', group: 'fam3', name: 'Boosting (general)', formula: 'sequential reweighted weak learners',
    tags: ['ensemble', 'bias reduction', 'adaboost', 'sequential'],
    overview: "The complementary recipe to bagging: train weak models in sequence, each focusing on what the ensemble still gets wrong (reweighted points in AdaBoost, gradients in gradient boosting), and sum them. A bias-reduction machine that turns stumps into a strong learner.",
    variables: [
      ['weak learner', 'a model barely better than chance — depth-1/2 trees classically'],
      ['sample weights', 'AdaBoost: mistakes get heavier, forcing the next learner to focus'],
      ['stage weight', 'how much say each weak learner gets in the final sum'],
      ['learning_rate', 'shrinks each stage — the overfitting brake'],
    ],
    thinking: {
      workflow: [
        'Diagnosis: model too simple — high bias, underfitting everywhere',
        'Boost it: sequential weak learners attacking remaining errors',
        'Watch validation curves — boosting can eventually overfit noise',
        'Decision: in practice, reach for gradient boosting implementations (XGB/LGBM)',
      ],
      when: [
        'Weak, fast base learners and a bias problem',
        'You want to understand WHY XGBoost works (this is the concept underneath)',
        'Clean-ish labels — boosting concentrates hard on whatever it gets wrong',
      ],
      notWhen: [
        'Very noisy labels — it will obsess over mislabeled points',
        'A variance problem (bag instead)',
        'Need for parallel training of members (boosting is inherently sequential)',
      ],
      assumptions: [
        'Weak learners are genuinely better than chance',
        'Errors are learnable signal, not pure noise — else boosting amplifies noise',
      ],
    },
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=3000, n_features=15, n_informative=6,
                           random_state=8)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

# The base learner is a STUMP — one split, barely better than chance.
stump = DecisionTreeClassifier(max_depth=1)
print(f"single stump accuracy: {stump.fit(X_tr, y_tr).score(X_te, y_te):.3f}")

# AdaBoost: each round reweights the points the ensemble still misses.
ada = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1),
    n_estimators=300,
    learning_rate=0.5,
    random_state=0,
)
ada.fit(X_tr, y_tr)
print(f"300 boosted stumps   : {ada.score(X_te, y_te):.3f}")

# Watch bias fall as stages accumulate:
from sklearn.metrics import accuracy_score
for i, pred in enumerate(ada.staged_predict(X_te)):
    if i in (0, 4, 24, 99, 299):
        print(f"after {i+1:3d} stumps: acc={accuracy_score(y_te, pred):.3f}")`,
    scenario: {
      title: 'From rules-of-thumb to a strong classifier',
      problem: 'A risk team has a pile of individually weak heuristics ("flag if amount > $900", "flag if new device") and wants one strong decision.',
      dataset: 'Transactions with outcomes; each heuristic is roughly a decision stump.',
      why: 'Boosting is literally the machinery for combining weak rules into a strong learner, weighting each by how much it helps where others fail.',
      output: 'A weighted vote over the heuristics with dramatically better accuracy than any one rule.',
      interpretation: 'Stage weights show which heuristics carry real signal and which are redundant.',
      pitfalls: 'A few mislabeled historical cases get relentlessly upweighted — audit the highest-weight training points.',
    },
    mistakes: [
      'Boosting an already-strong deep learner (gains vanish, overfitting soars)',
      'Ignoring label noise — boosting chases it harder every round',
      'Confusing AdaBoost (reweighting) with gradient boosting (residual fitting) — same family, different mechanics',
    ],
    tips: [
      'staged_predict is the best teaching tool for WATCHING bias reduction',
      'In production you will use gradient boosting — but this is the concept to explain in reviews',
      'Inspect the most-upweighted samples: they are either hard cases or label errors',
    ],
  },
  {
    id: 'stacking', group: 'fam3', name: 'Stacking Ensemble', formula: 'meta-model over base-model predictions',
    tags: ['ensemble', 'meta-learning', 'blending'],
    overview: "Train diverse base models, then train a meta-model whose INPUTS are the base models' out-of-fold predictions. The meta-learner discovers which model to trust where — the last few percent of accuracy in competitions, and occasionally in production.",
    variables: [
      ['base models', 'a diverse set (linear, KNN, GBM…) — diversity is the fuel'],
      ['out-of-fold predictions', 'base predictions on rows they never trained on (prevents leakage)'],
      ['meta-model', 'usually simple (logistic/linear) — it only combines'],
      ['passthrough', 'optionally give the meta-model the raw features too'],
    ],
    thinking: {
      workflow: [
        'Prerequisite: several genuinely different models with comparable, decent scores',
        'Generate out-of-fold predictions via CV (sklearn handles this)',
        'Fit a simple meta-learner on those predictions',
        'Measure the gain honestly vs the best single model',
        'Decision: is +0.3% AUC worth double the serving complexity? Often no — sometimes very yes',
      ],
      when: [
        'Multiple diverse models plateau at similar scores',
        'Competition settings or high-value margins (fraud, pricing) where fractions of a % pay',
        'Model errors are complementary (check their correlation first)',
      ],
      notWhen: [
        'One model already dominates the others (stack ≈ that model)',
        'Serving latency/complexity budgets are tight',
        'Too little data to afford honest out-of-fold machinery',
      ],
      assumptions: [
        'Base-model errors are imperfectly correlated — the diversity assumption',
        'Out-of-fold discipline is followed exactly (else leakage inflates everything)',
      ],
    },
    code: `from sklearn.datasets import make_classification
from sklearn.ensemble import StackingClassifier, RandomForestClassifier, \\
    HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

X, y = make_classification(n_samples=6000, n_features=25, n_informative=10,
                           random_state=21)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, stratify=y, random_state=0)

base_models = [
    ("logit", make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))),
    ("knn",   make_pipeline(StandardScaler(), KNeighborsClassifier(15))),
    ("rf",    RandomForestClassifier(n_estimators=300, random_state=0)),
    ("gbm",   HistGradientBoostingClassifier(random_state=0)),
]

# cv=5 -> base models produce OUT-OF-FOLD predictions for the meta-model;
# this is the leakage guard that makes stacking legitimate.
stack = StackingClassifier(
    estimators=base_models,
    final_estimator=LogisticRegression(max_iter=1000),
    cv=5, n_jobs=-1,
)

for name, mdl in base_models + [("STACK", stack)]:
    mdl.fit(X_tr, y_tr)
    auc = roc_auc_score(y_te, mdl.predict_proba(X_te)[:, 1])
    print(f"{name:6s} AUC = {auc:.4f}")

# The meta-model's coefficients say which base model it trusts:
print("meta weights:", dict(zip([n for n, _ in base_models],
                                stack.final_estimator_.coef_[0].round(2))))`,
    scenario: {
      title: 'Squeezing the last AUC points in fraud detection',
      problem: 'Fraud losses are large enough that +0.5% AUC is worth real money; three tuned models sit within a hair of each other.',
      dataset: 'The same transaction features — the ensemble works on model DIVERSITY, not new data.',
      why: 'GBM sees interactions, logistic sees calibrated monotone effects, KNN sees local pockets: their errors differ, and the meta-learner arbitrages the differences.',
      output: 'A stacked score outperforming every base model, plus meta-weights showing who contributes.',
      interpretation: 'Meta-weights double as a model-portfolio report: if one weight ≈ 0, drop that base model.',
      pitfalls: 'Without strict out-of-fold predictions the stack looks amazing in validation and collapses live.',
    },
    mistakes: [
      'Training the meta-model on in-fold base predictions (the classic leakage)',
      'Stacking five variants of the same GBM (no diversity, no gain)',
      'A complex meta-learner overfitting the tiny meta-feature space',
      'Ignoring the serving cost of running every base model per request',
    ],
    tips: [
      'Check base-model prediction correlations first — high correlation predicts no gain',
      'Keep the meta-learner simple: logistic or ridge',
      'passthrough=True sometimes helps — the meta-model sees raw features too',
      'Ship the stack only when the measured gain beats the operational cost',
    ],
  },
  {
    id: 'svm', group: 'fam4', name: 'SVM / SVR', formula: 'max-margin boundary, kernel trick',
    tags: ['classification', 'regression', 'kernel', 'margin'],
    overview: "Finds the decision boundary that maximizes the margin — the buffer to the closest points (support vectors), which alone define the model. The kernel trick computes similarity in implicit high-dimensional spaces, letting a 'linear' method draw curved boundaries.",
    variables: [
      ['margin', 'distance from boundary to nearest points — SVM maximizes it'],
      ['support vectors', 'the boundary-defining points; everything else is ignored'],
      ['C', 'violation cost: high C = strict/wiggly, low C = tolerant/smooth'],
      ['gamma (RBF)', 'kernel reach: high = local/complex, low = broad/smooth'],
    ],
    thinking: {
      workflow: [
        'Business problem: classification on modest-sized, feature-rich data',
        'Scale features (mandatory), start with RBF kernel',
        'Grid-search C × gamma on log scales — SVMs are tuning-sensitive',
        'Check the support-vector fraction: near 100% = overfitting alarm',
        'Decision: strong for medium data; GBMs at big-tabular scale',
      ],
      when: [
        'Hundreds-to-tens-of-thousands of samples, many features',
        'Clean margins plausible: text vectors, bio-signals, images-with-features',
        'High-dimensional p ≫ n settings where margins generalize well',
      ],
      notWhen: [
        'Millions of rows — kernel training scales super-linearly',
        'You need probabilities natively (SVM outputs margins, not calibrated probs)',
        'Heavy label noise near the boundary',
      ],
      assumptions: [
        'Meaningful (scaled) distances between points',
        'A margin worth maximizing exists — classes are separable-ish in some kernel space',
      ],
    },
    code: `import numpy as np
from sklearn.datasets import make_circles
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import GridSearchCV, train_test_split

# --- concentric circles: linearly impossible, RBF-trivial ------------
X, y = make_circles(n_samples=800, factor=0.45, noise=0.12, random_state=0)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

pipe = make_pipeline(StandardScaler(), SVC(kernel="rbf"))

# C and gamma are searched on LOG scales — always.
grid = GridSearchCV(
    pipe,
    {"svc__C": np.logspace(-1, 3, 5),
     "svc__gamma": np.logspace(-3, 1, 5)},
    cv=5, n_jobs=-1,
)
grid.fit(X_tr, y_tr)
best = grid.best_estimator_
print("best:", grid.best_params_)
print(f"test accuracy: {best.score(X_te, y_te):.3f}")

# Support vectors ARE the model — a compact fraction is a health sign:
svc = best[-1]
frac = len(svc.support_) / len(X_tr)
print(f"support vectors: {len(svc.support_)} ({frac:.0%} of training set)")

# Need probabilities? Calibrate explicitly:
from sklearn.calibration import CalibratedClassifierCV
cal = CalibratedClassifierCV(best, cv=3).fit(X_tr, y_tr)
print("calibrated P(class=1) for 3 points:",
      cal.predict_proba(X_te[:3])[:, 1].round(2))`,
    scenario: {
      title: 'Medical diagnosis from lab panels',
      problem: 'Classify patients as high/low risk from a few hundred labeled cases with dozens of biomarker features.',
      dataset: 'n≈500 patients, 40 standardized lab measurements, expert-confirmed labels.',
      why: 'Small-n / high-dim is SVM home turf: max-margin resists overfitting where flexible models memorize, and the RBF kernel captures non-linear biomarker interactions.',
      output: 'Risk classification with the support-vector patients highlighted as the boundary cases.',
      interpretation: 'Support vectors literally identify the clinically ambiguous patients — useful for review prioritization.',
      pitfalls: 'Unscaled features silently break the kernel geometry; calibrate before quoting probabilities to clinicians.',
    },
    mistakes: [
      'Skipping feature scaling (distance-based, like KNN)',
      'Tuning C or gamma alone — they interact, search jointly',
      'Using predict_proba without CalibratedClassifierCV and trusting it',
      'Applying kernel SVMs to millions of rows',
    ],
    tips: [
      'LinearSVC scales much further when a linear boundary suffices (text!)',
      'Support-vector fraction is your overfitting gauge: lower is healthier',
      'class_weight="balanced" for imbalanced margins',
      'SVR (epsilon-insensitive) is the regression sibling for outlier-tolerant fits',
    ],
  },
];
