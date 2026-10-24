import { bl, blSame } from '../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §3 (model catalog) and §4
// (Model Selection Compass). One node per model/row in the doc's tables —
// see BUILD_LOG.md Module 3 for the handful of places the edge list in the
// build spec named a sub-concept that isn't its own doc row (e.g. "Bayesian
// Linear Regression"), and how those were resolved.
// Family names are depth objects (blSame) because the Model Map resolves
// them like all other ML content; model names stay plain strings because
// they are rendered directly (see the ML_MODEL schema in src/data/schema.js).
export const ML_FAMILIES = [
  { id: 1, name: blSame('Linear & Regularized'), color: '#8b5cf6' },
  { id: 2, name: blSame('Instance-Based & Probabilistic'), color: '#6366f1' },
  { id: 3, name: blSame('Tree-Based Models & Ensembles'), color: '#22d3ee' },
  { id: 4, name: blSame('Support Vector Machines'), color: '#34d399' },
  { id: 5, name: blSame('Unsupervised Learning'), color: '#fbbf24' },
  { id: 6, name: blSame('Classical Time-Series / Econometric'), color: '#fb7185' },
  { id: 7, name: blSame('Modern Applied Time-Series Tools'), color: '#f472b6' },
  { id: 8, name: blSame('Deep Learning'), color: '#a78bfa' },
  { id: 9, name: blSame('Bayesian Machine Learning'), color: '#60a5fa' },
  { id: 10, name: blSame('Reinforcement Learning'), color: '#f87171' },
];

export const mlFamilyColorMap = Object.fromEntries(ML_FAMILIES.map((f) => [f.id, f.color]));

// compass axes are 1 (low) – 5 (high), per doc §4's three named axes.
export const ML_MODELS = [
  // 3.1 Linear & Regularized Models
  {
    id: 'linreg', ch: 1, name: 'Linear Regression', short: 'ŷ = a + bx',
    howItWorks: bl(
      'Draws the single straight line through the data that keeps the total prediction error as small as possible.',
      'Fits ŷ = β₀ + β₁x (+ …) by minimizing squared residuals (OLS); coefficients have closed-form solutions under Gauss-Markov assumptions.'
    ),
    advantages: blSame('Simple, fast, fully interpretable coefficients; cheap to estimate.'),
    weaknesses: blSame('Assumes linearity; sensitive to outliers and multicollinearity.'),
    usageAreas: blSame('Baseline for any driver-based forecast (e.g., gold vs. real yields + DXY).'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 1 },
  },
  {
    id: 'ridge_lasso_en', ch: 1, name: 'Ridge / Lasso / Elastic Net', short: 'penalized OLS',
    howItWorks: bl(
      'Same straight-line idea as linear regression, but adds a penalty that discourages coefficients from growing too large — this keeps the model stable even with many correlated features.',
      'Adds an L2 (Ridge), L1 (Lasso), or blended (Elastic Net) penalty term to the OLS loss, shrinking coefficients toward zero; Lasso\'s L1 term can zero coefficients out entirely (automatic selection).'
    ),
    advantages: blSame('Handles many correlated macro features without overfitting; Lasso does automatic feature selection.'),
    weaknesses: blSame('Requires tuning the penalty strength; coefficients biased toward zero.'),
    usageAreas: blSame('High-dimensional macro nowcasting — often beats fancier ML in GDP/inflation nowcasting.'),
    compass: { interpretability: 4, dataHunger: 2, nonlinearity: 1 },
  },
  {
    id: 'logreg', ch: 1, name: 'Logistic Regression', short: 'P(y=1) = σ(a+bx)',
    howItWorks: bl(
      'Squeezes a linear combination of inputs through an S-shaped curve so the output always lands between 0 and 1, giving a probability instead of a raw number.',
      'Models log-odds as linear in the predictors: logit(P) = β₀ + β₁x, fit by maximum likelihood; decision boundary is linear in the original feature space.'
    ),
    advantages: blSame('Interpretable probabilities; strong baseline for binary events.'),
    weaknesses: blSame('Only linear decision boundary (in log-odds space).'),
    usageAreas: blSame('Recession-probability models, "will the incumbent win" binary election models.'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 1 },
  },
  // 3.2 Instance-Based & Probabilistic
  {
    id: 'knn', ch: 2, name: 'K-Nearest Neighbors (KNN)', short: 'vote of k closest points',
    howItWorks: bl(
      'To predict a new point, finds the k most similar past examples and averages (or votes on) their answers — no formula is ever "learned," it just remembers everything.',
      'Non-parametric: prediction for x is an average (regression) or majority vote (classification) over the k nearest training points under a distance metric; no explicit training phase.'
    ),
    advantages: blSame('Simple, no training phase, captures local nonlinearity.'),
    weaknesses: blSame('Slow at prediction time on large data; degrades in high dimensions ("curse of dimensionality"); needs feature scaling.'),
    usageAreas: blSame('Finding "similar historical regimes" (analog forecasting).'),
    compass: { interpretability: 3, dataHunger: 2, nonlinearity: 3 },
  },
  {
    id: 'naive_bayes', ch: 2, name: 'Naive Bayes', short: 'P(y|x) ∝ P(x|y)P(y)',
    howItWorks: bl(
      'Guesses the most likely category by combining how common each category is with how typical the observed features are for that category — assuming, for simplicity, that features don\'t interact.',
      'Applies Bayes\' theorem with the (naive) assumption of conditional independence between features given the class: P(y|x) ∝ P(y)∏P(xᵢ|y).'
    ),
    advantages: blSame('Very fast; works well on text; needs little data.'),
    weaknesses: blSame('Assumes feature independence (often false).'),
    usageAreas: blSame('News/sentiment classification for geopolitical or market-mood signals.'),
    compass: { interpretability: 4, dataHunger: 1, nonlinearity: 1 },
  },
  // 3.3 Tree-Based Models & Ensembles
  {
    id: 'dtree', ch: 3, name: 'Decision Tree', short: 'if/else splits',
    howItWorks: bl(
      'Repeatedly asks the single yes/no question about the data that best separates outcomes, building a flowchart of splits down to a final answer.',
      'Recursively partitions the feature space by choosing the split (feature + threshold) that maximizes information gain / minimizes impurity (Gini, entropy, or variance reduction) at each node.'
    ),
    advantages: blSame('Fully interpretable, handles nonlinearity and mixed data types, fast.'),
    weaknesses: blSame('Low accuracy alone; prone to overfitting; unstable (small data changes → different tree).'),
    usageAreas: blSame('Explaining a single forecast\'s logic to a non-technical audience.'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 3 },
  },
  {
    id: 'rf', ch: 3, name: 'Random Forest', short: 'bagged trees',
    howItWorks: bl(
      'Grows hundreds of slightly-different decision trees (each on a random slice of the data) and averages their answers — the averaging cancels out each individual tree\'s mistakes.',
      'Bagging ensemble: trains B trees on bootstrap resamples with random feature subsets per split, aggregates via averaging (regression) or majority vote (classification), reducing variance without increasing bias.'
    ),
    advantages: blSame('Reduces overfitting via averaging; robust defaults; good with little tuning; ranks feature importance; among the most accurate methods for macro nowcasting and inflation forecasting in recent studies.'),
    weaknesses: blSame('Less interpretable than a single tree; large model size.'),
    usageAreas: blSame('GDP/inflation nowcasting, gold-driver importance ranking.'),
    compass: { interpretability: 3, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'gbm', ch: 3, name: 'Gradient Boosting (general)', short: 'sequential error correction',
    howItWorks: bl(
      'Builds trees one at a time, where each new tree focuses specifically on fixing the mistakes the trees before it made — like a series of tutors, each correcting the last one\'s errors.',
      'Sequentially fits weak learners (typically shallow trees) to the negative gradient of the loss function w.r.t. current predictions, additively combining them: Fₘ(x) = Fₘ₋₁(x) + ν·hₘ(x).'
    ),
    advantages: blSame('Sequentially corrects errors → typically higher accuracy than bagging.'),
    weaknesses: blSame('More prone to overfitting/variance; needs careful tuning; slower to train than RF.'),
    usageAreas: blSame('Structured/tabular forecasting problems generally.'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'xgboost', ch: 3, name: 'XGBoost', short: 'regularized gradient boosting',
    howItWorks: bl(
      'The same "fix the last mistake" idea as gradient boosting, but with extra built-in guardrails that automatically prevent it from overfitting and make it fast to train.',
      'Gradient boosting with regularized objective (L1/L2 on leaf weights), second-order (Newton) gradient approximation, and built-in handling for sparse/missing data.'
    ),
    advantages: blSame('Mature, stable, extremely well documented; strong enterprise default; fast with regularization built in.'),
    weaknesses: blSame('Many hyperparameters; can overfit small datasets without care.'),
    usageAreas: blSame('Gold price prediction (frequently top performer with SHAP explainability), retail demand forecasting.'),
    compass: { interpretability: 3, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'lightgbm', ch: 3, name: 'LightGBM', short: 'histogram gradient boosting',
    howItWorks: bl(
      'Speeds up the same gradient-boosting idea by grouping data values into buckets before searching for the best split, and by growing trees leaf-by-leaf instead of level-by-level.',
      'Histogram-based split finding (bucketing continuous features) plus leaf-wise (best-first) tree growth rather than level-wise, trading some overfitting risk for large training-speed gains.'
    ),
    advantages: blSame('Fastest training on large datasets (histogram-based splitting).'),
    weaknesses: blSame('Can overfit on small data; sensitive to parameter choices.'),
    usageAreas: blSame('Large panel datasets, high-frequency financial features.'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'catboost', ch: 3, name: 'CatBoost', short: 'categorical-native boosting',
    howItWorks: bl(
      'Same gradient-boosting family, but handles categories (like "country" or "party") natively and cleverly, without needing them converted to numbers first.',
      'Ordered boosting + ordered target statistics for categorical features, avoiding the target leakage that naive one-hot/mean-encoding introduces.'
    ),
    advantages: blSame('Best native handling of categorical variables; often best generalization/AUC in comparative studies.'),
    weaknesses: blSame('Slower to train than LightGBM.'),
    usageAreas: blSame('Datasets with many categorical macro/political variables (country, regime type, party).'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'bagging', ch: 3, name: 'Bagging (general)', short: 'bootstrap + average',
    howItWorks: bl(
      'Trains many copies of the same model on different random resamples of the data, then averages their answers to smooth out noise.',
      'Bootstrap Aggregating: trains B base learners on independent bootstrap resamples, aggregates by averaging/voting — reduces variance, Var(avg) shrinks with B for uncorrelated errors.'
    ),
    advantages: blSame('Reduces variance, parallelizable.'),
    weaknesses: blSame('Does not reduce bias — a bad base learner stays bad on average.'),
    usageAreas: blSame('Stabilizing noisy, high-variance base models.'),
    compass: { interpretability: 3, dataHunger: 2, nonlinearity: 3 },
  },
  {
    id: 'boosting', ch: 3, name: 'Boosting (general)', short: 'sequential bias reduction',
    howItWorks: bl(
      'The umbrella idea behind gradient boosting and XGBoost: chain together many weak, simple models so each one patches the previous ones\' blind spots.',
      'General framework for additive, sequential ensembling that minimizes bias by re-weighting or re-fitting to residuals at each stage; AdaBoost and gradient boosting are specific instances.'
    ),
    advantages: blSame('Reduces bias, often the most accurate single-model family.'),
    weaknesses: blSame('Prone to overfitting/variance if unchecked; sequential = slower to train.'),
    usageAreas: blSame('Whenever maximum predictive accuracy is the goal and overfitting is monitored.'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'stacking', ch: 3, name: 'Stacking Ensemble', short: 'meta-model of models',
    howItWorks: bl(
      'Runs several different models on the same problem, then trains one more "referee" model that learns how to best blend their individual answers together.',
      'Trains diverse base learners, then fits a meta-learner on their out-of-fold predictions to learn an optimal (often nonlinear) combination — typically the strongest ceiling on accuracy, at the cost of complexity.'
    ),
    advantages: blSame('Combines heterogeneous models (e.g., ARIMA + XGBoost + LSTM) for the best overall accuracy.'),
    weaknesses: blSame('Most compute- and complexity-expensive; harder to explain.'),
    usageAreas: blSame('Flagship "ensemble of everything" forecasts (e.g., final gold-price consensus module).'),
    compass: { interpretability: 1, dataHunger: 4, nonlinearity: 5 },
  },
  // 3.4 Support Vector Machines
  {
    id: 'svm', ch: 4, name: 'SVM / SVR', short: 'max-margin boundary',
    howItWorks: bl(
      'Finds the boundary line (or curve, via a "kernel trick") that separates classes with the widest possible safety margin, paying attention only to the trickiest borderline cases.',
      'Finds the maximum-margin separating hyperplane in a (possibly kernel-transformed) feature space; only support vectors (points on/inside the margin) affect the solution.'
    ),
    advantages: blSame('Effective in high dimensions; robust to outliers (only support vectors matter); memory-efficient.'),
    weaknesses: blSame('Poor scaling to large datasets; struggles with noisy/overlapping classes; kernel choice is fiddly.'),
    usageAreas: blSame('Medium-sized, high-dimensional classification (e.g., crisis/no-crisis regime classification).'),
    compass: { interpretability: 2, dataHunger: 2, nonlinearity: 4 },
  },
  // 3.5 Unsupervised Learning
  {
    id: 'kmeans', ch: 5, name: 'K-Means Clustering', short: 'partition into k groups',
    howItWorks: bl(
      'Sorts data points into k groups by repeatedly assigning each point to its nearest group center, then recomputing each center as the average of its assigned points.',
      'Alternates between assignment (each point to nearest centroid under Euclidean distance) and update (recompute centroids as cluster means) until convergence; minimizes within-cluster sum of squares.'
    ),
    advantages: blSame('Fast, simple, scalable.'),
    weaknesses: blSame('Must pre-specify number of clusters; assumes spherical clusters.'),
    usageAreas: blSame('Segmenting historical market "regimes," country clustering for political risk.'),
    compass: { interpretability: 4, dataHunger: 1, nonlinearity: 2 },
  },
  {
    id: 'hclust', ch: 5, name: 'Hierarchical Clustering', short: 'dendrogram merge/split',
    howItWorks: bl(
      'Builds a family tree of the data by repeatedly merging the two most similar groups (or splitting the least cohesive one), producing a full tree of every possible grouping at once.',
      'Agglomerative (bottom-up, merging closest clusters by a linkage criterion) or divisive (top-down) construction of a dendrogram, no k needed in advance; a cut height determines the final clusters.'
    ),
    advantages: blSame('No need to pre-specify cluster count; produces interpretable dendrogram.'),
    weaknesses: blSame('Computationally expensive at scale.'),
    usageAreas: blSame('Building the visual relationship map itself (grouping related models/formulas).'),
    compass: { interpretability: 4, dataHunger: 1, nonlinearity: 2 },
  },
  {
    id: 'pca', ch: 5, name: 'PCA (dimensionality reduction)', short: 'compress to k factors',
    howItWorks: bl(
      'Finds a handful of "summary directions" that capture most of what\'s moving together across many correlated variables, so a large messy dataset can be replaced by a few clean numbers.',
      'Finds an orthogonal basis (principal components) ranked by variance explained, via eigendecomposition of the covariance matrix; the first few components typically capture most of the signal in correlated panels.'
    ),
    advantages: blSame('Compresses many correlated macro series into a few "factors"; reduces noise.'),
    weaknesses: blSame('Components lose direct interpretability; loses some information.'),
    usageAreas: blSame('Feeding a Dynamic-Factor-Model-style "common macro factor" into both Stats and ML views.'),
    compass: { interpretability: 2, dataHunger: 1, nonlinearity: 1 },
  },
  // 3.6 Classical Time-Series / Econometric Models
  {
    id: 'arima', ch: 6, name: 'ARIMA / SARIMA', short: 'autoregressive + differencing',
    howItWorks: bl(
      'Predicts the next value mainly from a weighted mix of recent past values and recent past errors, after first removing trend by differencing the series.',
      'Combines AutoRegressive (p lags), Integrated (d-order differencing for stationarity), and Moving Average (q lagged error terms) components; SARIMA adds seasonal (P,D,Q,s) terms.'
    ),
    advantages: blSame('Strong theory, fast, often lowest error on stable/linear series; highly explainable.'),
    weaknesses: blSame('Assumes linearity & stationarity; struggles with structural breaks and missing data; manual tuning (p,d,q) is time-consuming.'),
    usageAreas: blSame('Short-horizon macro series with clear trend/seasonality.'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 1 },
  },
  {
    id: 'var', ch: 6, name: 'VAR (Vector Autoregression)', short: 'multivariate AR',
    howItWorks: bl(
      'Extends the "predict from recent past values" idea of ARIMA to several series at once, letting each one\'s future depend on everyone\'s recent past — so gold, DXY, and real yields can all inform each other.',
      'Each of n variables is modeled as a linear function of p lags of itself and all other variables in the system; estimated jointly, capturing feedback loops that univariate models miss.'
    ),
    advantages: blSame('Captures feedback between multiple series (e.g., gold ↔ DXY ↔ real yields jointly).'),
    weaknesses: blSame('Parameters grow quickly with more variables ("curse of dimensionality"); needs stationarity.'),
    usageAreas: blSame('Multi-variable macro systems — natural econometric sibling of DFM content.'),
    compass: { interpretability: 4, dataHunger: 2, nonlinearity: 1 },
  },
  {
    id: 'garch', ch: 6, name: 'GARCH / ARCH', short: 'volatility clustering',
    howItWorks: bl(
      'Models the size of price swings itself as changing over time — calm periods tend to stay calm and turbulent periods tend to stay turbulent, and this model predicts which regime is coming.',
      'Models conditional variance as a function of past squared residuals (ARCH term) and past variance (GARCH term): σ²ₜ = ω + α·ε²ₜ₋₁ + β·σ²ₜ₋₁, capturing volatility clustering.'
    ),
    advantages: blSame('Purpose-built for volatility clustering (calm/turbulent regimes); improves confidence-interval realism.'),
    weaknesses: blSame('Choosing the estimation window is contested — too long dilutes recent regime, too short is noisy.'),
    usageAreas: blSame('Gold/FX/equity volatility forecasting, VaR risk models — pairs naturally with Stats mode\'s stochastic-volatility content.'),
    compass: { interpretability: 4, dataHunger: 2, nonlinearity: 2 },
  },
  {
    id: 'expsmooth', ch: 6, name: 'Exponential Smoothing / Holt-Winters', short: 'weighted recency average',
    howItWorks: bl(
      'Forecasts the next value as a smoothly-weighted average of all past values, where more recent observations count more — extended with extra terms for trend and repeating seasonal patterns.',
      'Recursively updates level (α), trend (β), and seasonal (γ) smoothing states; forecast = level + trend·h + seasonal component, with weights decaying exponentially into the past.'
    ),
    advantages: blSame('Very fast, intuitive, good for trend+seasonality.'),
    weaknesses: blSame('Weaker with irregular shocks or structural change.'),
    usageAreas: blSame('Quick operational forecasts, baseline comparisons.'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 1 },
  },
  // 3.7 Modern Applied Time-Series Tools
  {
    id: 'prophet', ch: 7, name: 'Prophet', short: 'decomposable trend+seasonality',
    howItWorks: bl(
      'Breaks a series into a flexible trend curve, repeating seasonal patterns, and holiday effects, fits each piece separately, then adds them back together into one forecast.',
      'Additive (or multiplicative) decomposition y(t) = g(t) + s(t) + h(t) + εₜ, with a piecewise-linear/logistic trend g(t), Fourier-series seasonality s(t), and holiday indicators h(t), fit via MAP estimation in Stan.'
    ),
    advantages: blSame('Extremely quick to deploy; handles sparse/missing seasonal data gracefully; built-in holiday effects.'),
    weaknesses: blSame('Consistently less accurate than ARIMA/LSTM/XGBoost in comparative studies; struggles with short-term fluctuations.'),
    usageAreas: blSame('Fast baseline dashboards, non-expert users.'),
    compass: { interpretability: 4, dataHunger: 2, nonlinearity: 2 },
  },
  {
    id: 'hybrid', ch: 7, name: 'Hybrid Econometric+ML', short: 'ARIMA-residual → XGBoost/LSTM',
    howItWorks: bl(
      'Lets a classical model like ARIMA capture the obvious trend first, then hands its leftover errors (the part it couldn\'t explain) to an ML model, which hunts for hidden nonlinear patterns in what\'s left.',
      'Fits ARIMA (or similar) first, then trains XGBoost/LSTM on the residual series εₜ = yₜ − ŷₜᴬᴿᴵᴹᴬ, combining the linear-trend strength of econometrics with nonlinear pattern-capture of ML; final forecast = ŷᴬᴿᴵᴹᴬ + ŷᴹᴸ(residual).'
    ),
    advantages: blSame('Combines linear-trend strength of econometrics with nonlinear pattern-capture of ML; statistically significant accuracy gains over either alone.'),
    weaknesses: blSame('More moving parts, harder to maintain/explain.'),
    usageAreas: blSame('Flagship gold/commodity/crypto forecasting pipelines — an ideal "Stats + ML working together" teaching module.'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  // 3.8 Deep Learning
  {
    id: 'rnn', ch: 8, name: 'RNN (vanilla)', short: 'recurrent hidden state',
    howItWorks: bl(
      'Reads a sequence one step at a time while carrying forward a running "memory" summary that gets updated at every step, so earlier context can influence later predictions.',
      'Maintains hidden state hₜ = f(Whₕhₜ₋₁ + Wₓₕxₜ + b), updated recurrently at each timestep; trained via backpropagation through time (BPTT).'
    ),
    advantages: blSame('Purpose-built for sequences; captures temporal state.'),
    weaknesses: blSame('Vanishing/exploding gradients on long sequences; slow, hard to parallelize.'),
    usageAreas: blSame('Short-sequence pattern learning.'),
    compass: { interpretability: 1, dataHunger: 4, nonlinearity: 5 },
  },
  {
    id: 'lstm', ch: 8, name: 'LSTM / GRU', short: 'gated memory cells',
    howItWorks: bl(
      'Like an RNN, but with built-in "gates" that learn what to remember, what to forget, and what to output at each step — solving the vanilla RNN\'s tendency to forget things that happened too long ago.',
      'Introduces forget/input/output gates (LSTM) or reset/update gates (GRU) controlling information flow through the cell state, mitigating vanishing gradients and enabling learning of long-range dependencies.'
    ),
    advantages: blSame('Best-in-class for complex nonlinear + seasonal patterns given enough data; handles multivariate inputs well; frequently the most accurate on gold-price studies.'),
    weaknesses: blSame('Needs large data and careful architecture tuning; long training time; "black box".'),
    usageAreas: blSame('Gold price, crypto, multivariate macro-financial series with rich history.'),
    compass: { interpretability: 1, dataHunger: 5, nonlinearity: 5 },
  },
  {
    id: 'cnn', ch: 8, name: 'CNN (1D, for sequences)', short: 'sliding local filters',
    howItWorks: bl(
      'Slides small pattern-detecting filters along the sequence, each learning to recognize a specific local shape (like a sudden spike or a specific short pattern) wherever it appears.',
      'Applies learned 1D convolutional filters (kernel size k) that slide across the time axis, detecting translation-invariant local motifs; stacked layers build increasingly abstract, longer-range features.'
    ),
    advantages: blSame('Good at local pattern/motif detection; parallelizable.'),
    weaknesses: blSame('Not natively suited to long-range temporal dependency.'),
    usageAreas: blSame('Feature extraction step before an LSTM/Transformer (hybrid CNN-LSTM).'),
    compass: { interpretability: 1, dataHunger: 4, nonlinearity: 5 },
  },
  {
    id: 'transformer', ch: 8, name: 'Transformer / TFT', short: 'attention over all timesteps',
    howItWorks: bl(
      'Instead of reading step-by-step like an RNN, looks at the entire sequence at once and learns which past moments matter most for right now — those "attention weights" can even be inspected to see what the model focused on.',
      'Self-attention computes weighted combinations of all timesteps simultaneously (Attention(Q,K,V) = softmax(QKᵀ/√d)V); the Temporal Fusion Transformer additionally separates static, known-future, and observed inputs with variable-selection networks.'
    ),
    advantages: blSame('Attention weights are interpretable (shows which past periods/features mattered); handles static + known-future + observed inputs together; highly parallelizable.'),
    weaknesses: blSame('Data-hungry, compute-expensive; recent studies show it does not consistently beat simpler LSTM/BiLSTM baselines despite the added complexity.'),
    usageAreas: blSame('Multi-horizon forecasts needing built-in interpretability (e.g., "why did the 6-month gold forecast move?").'),
    compass: { interpretability: 2, dataHunger: 5, nonlinearity: 5 },
  },
  // 3.9 Bayesian Machine Learning
  {
    id: 'gp', ch: 9, name: 'Gaussian Processes', short: 'distribution over functions',
    howItWorks: bl(
      'Instead of fitting one curve, keeps an entire family of plausible curves through the data, weighted by how well each fits — this naturally gives an honest, wider uncertainty band far from any observed data.',
      'Places a prior directly over functions, specified by a mean function and covariance kernel k(x,x\'); posterior predictive is Gaussian with closed-form mean and variance conditioned on observed points.'
    ),
    advantages: blSame('Closed-form uncertainty; fits a huge range of nonlinear functions; excellent for small data.'),
    weaknesses: blSame('Computationally expensive at scale (cubic in data size).'),
    usageAreas: blSame('Small-sample forecasting with rigorous uncertainty bands.'),
    compass: { interpretability: 3, dataHunger: 1, nonlinearity: 4 },
  },
  {
    id: 'bstsbnn', ch: 9, name: 'Bayesian Structural Time Series / Bayesian NNs', short: 'posterior over states/weights',
    howItWorks: bl(
      'Treats the unknown quantities (like trend level, seasonal effect, or a neural network\'s weights) as uncertain from the start, and updates a full range of plausible values as data arrives — rather than settling on one single best-fit answer.',
      'BSTS decomposes a series into latent state components (trend, seasonal, regression) estimated via Kalman filtering/Gibbs sampling; Bayesian NNs place priors over weights and approximate the posterior via variational inference or MCMC, yielding calibrated predictive uncertainty.'
    ),
    advantages: blSame('Full posterior uncertainty, not just point estimates; mitigates overfitting by treating weights as distributions; superior in studies on both accuracy and uncertainty quantification over long horizons.'),
    weaknesses: blSame('Slower to fit (sampling-based); more complex to implement.'),
    usageAreas: blSame('The ML-side sibling of frequentist confidence intervals (Stats mode\'s ci_mean_t): the same numbers, read with a different meaning.'),
    compass: { interpretability: 3, dataHunger: 3, nonlinearity: 4 },
  },
  // 3.10 Reinforcement Learning
  {
    id: 'qlearning', ch: 10, name: 'Q-Learning', short: 'learn action values',
    howItWorks: bl(
      'Learns, through trial and error, a running scorecard of "how good is each possible action in each situation," and always picks the highest-scoring action once that scorecard is trustworthy.',
      'Learns an action-value function Q(s,a) via the Bellman update Q(s,a) ← Q(s,a) + α[r + γ·maxₐ\'Q(s\',a\') − Q(s,a)], converging to the optimal policy under sufficient exploration.'
    ),
    advantages: blSame('Learns a full decision policy, not just a forecast; optimizes long-term reward; adapts continuously; can embed risk penalties directly.'),
    weaknesses: blSame('High data noise in finance is easily mistaken for signal; markets are non-reproducible (only one historical path exists); unpredictable/unstable in live deployment; needs large data.'),
    usageAreas: blSame('Algorithmic trading strategy simulators, portfolio-allocation teaching modules.'),
    compass: { interpretability: 2, dataHunger: 5, nonlinearity: 4 },
  },
  {
    id: 'actorcritic', ch: 10, name: 'Actor-Critic', short: 'policy + value together',
    howItWorks: bl(
      'Runs two learners side by side: an "actor" that directly decides what action to take, and a "critic" that scores how good that decision turned out — the critic\'s feedback trains the actor to keep improving.',
      'Combines a parameterized policy πθ(a|s) (actor, updated via policy gradient) with a learned value function Vφ(s) or Qφ(s,a) (critic) that reduces variance in the policy gradient estimate.'
    ),
    advantages: blSame('Learns a full decision policy with lower-variance updates than pure policy-gradient methods; adapts continuously; can embed risk penalties directly.'),
    weaknesses: blSame('High data noise in finance is easily mistaken for signal; markets are non-reproducible; unpredictable/unstable in live deployment; needs large data.'),
    usageAreas: blSame('Algorithmic trading strategy simulators, portfolio-allocation teaching modules.'),
    compass: { interpretability: 1, dataHunger: 5, nonlinearity: 5 },
  },
];

export const mlNodeById = Object.fromEntries(ML_MODELS.map((m) => [m.id, m]));

// Edge types: 'extends' (same-family extension), 'competes' (alternative),
// 'combines' (used together). See BUILD_LOG.md Module 3 for the few edges
// adapted from the build spec's wording to this doc-row-derived node set
// (e.g. "Bayesian Linear Regression" isn't its own doc row, so its edges
// were re-anchored to Linear Regression; "Q-Learning"/"Actor-Critic" were
// split out of the doc's single combined RL row so their named evolution
// edge could exist at all).
export const ML_LINKS = [
  // 3.1
  { s: 'linreg', t: 'ridge_lasso_en', type: 'extends' },
  { s: 'ridge_lasso_en', t: 'logreg', type: 'extends' },
  // 3.2
  { s: 'knn', t: 'svm', type: 'competes' },
  { s: 'naive_bayes', t: 'logreg', type: 'competes' },
  // 3.3
  { s: 'dtree', t: 'rf', type: 'extends' },
  { s: 'dtree', t: 'gbm', type: 'extends' },
  { s: 'gbm', t: 'xgboost', type: 'extends' },
  { s: 'gbm', t: 'lightgbm', type: 'extends' },
  { s: 'gbm', t: 'catboost', type: 'extends' },
  { s: 'dtree', t: 'bagging', type: 'extends' },
  { s: 'bagging', t: 'rf', type: 'extends' },
  { s: 'boosting', t: 'gbm', type: 'extends' },
  { s: 'rf', t: 'stacking', type: 'combines' },
  { s: 'xgboost', t: 'stacking', type: 'combines' },
  { s: 'linreg', t: 'stacking', type: 'combines' },
  // 3.5
  { s: 'kmeans', t: 'hclust', type: 'competes' },
  { s: 'pca', t: 'bstsbnn', type: 'combines' },
  { s: 'pca', t: 'rf', type: 'combines' },
  { s: 'pca', t: 'lstm', type: 'combines' },
  // 3.6
  { s: 'arima', t: 'var', type: 'extends' },
  { s: 'garch', t: 'arima', type: 'combines' },
  { s: 'expsmooth', t: 'arima', type: 'competes' },
  // 3.6 ↔ 3.7 competing forecasting alternatives
  { s: 'arima', t: 'prophet', type: 'competes' },
  { s: 'prophet', t: 'xgboost', type: 'competes' },
  { s: 'xgboost', t: 'lstm', type: 'competes' },
  // hybrid combination
  { s: 'arima', t: 'hybrid', type: 'combines' },
  { s: 'lstm', t: 'hybrid', type: 'combines' },
  { s: 'xgboost', t: 'hybrid', type: 'combines' },
  // 3.8
  { s: 'rnn', t: 'lstm', type: 'extends' },
  { s: 'lstm', t: 'transformer', type: 'extends' },
  { s: 'cnn', t: 'transformer', type: 'extends' },
  { s: 'cnn', t: 'hybrid', type: 'combines' },
  // 3.9
  { s: 'linreg', t: 'gp', type: 'extends' },
  { s: 'linreg', t: 'bstsbnn', type: 'extends' },
  { s: 'lstm', t: 'bstsbnn', type: 'combines' },
  { s: 'gp', t: 'bstsbnn', type: 'extends' },
  // 3.10
  { s: 'qlearning', t: 'actorcritic', type: 'extends' },
];

// Module 11 audit (see gold.js's identical note in domains/). Covers both
// ModelMapPage.jsx's legend and MLModelDetailPanel.jsx's labels.
export const MM_LEGEND_TITLE = blSame('Connections');
export const MM_LEGEND_EXTENDS = blSame('Extends (same family)');
export const MM_LEGEND_COMPETES = blSame('Competes with');
export const MM_LEGEND_COMBINES = blSame('Combines with');

export const MM_EDGE_TYPE_LABEL = {
  extends: blSame('Extends'),
  competes: blSame('Competes with'),
  combines: blSame('Combines with'),
};

export const MM_HOW_IT_WORKS_LBL = blSame('How it works');
export const MM_ADVANTAGES_LBL = blSame('Advantages');
export const MM_WEAKNESSES_LBL = blSame('Weaknesses');
export const MM_USAGE_AREAS_LBL = blSame('Best usage areas');
export const MM_COMPASS_LBL = blSame('Model selection compass');
export const MM_CONNECTIONS_LBL = blSame('Connections');

// CompassMeter.jsx's three axes (research doc §4).
export const COMPASS_AXES = [
  {
    key: 'interpretability',
    label: blSame('Interpretability'),
    hint: blSame('High = easy to explain a single prediction'),
  },
  {
    key: 'dataHunger',
    label: blSame('Data hunger'),
    hint: blSame('High = needs years of history to work well'),
  },
  {
    key: 'nonlinearity',
    label: blSame('Nonlinearity capture'),
    hint: blSame('High = can learn complex, curved relationships'),
  },
];
