import { bl, blSame } from '../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §3 (model catalog) and §4
// (Model Selection Compass). One node per model/row in the doc's tables —
// see BUILD_LOG.md Module 3 for the handful of places the edge list in the
// build spec named a sub-concept that isn't its own doc row (e.g. "Bayesian
// Linear Regression"), and how those were resolved.
// FIX_LOG.md Section C.3: name was a plain string (English-only regardless
// of language toggle) — unlike model/algorithm names (Linear Regression,
// XGBoost), which are deliberately kept English throughout this app as
// term-of-art proper nouns, these are descriptive category/grouping labels
// (the Model Map's row headers), the same kind of UI chrome as
// MM_LEGEND_EXTENDS below — which IS bilingual. Translated the common
// words, kept genuinely technical terms as English loanwords, matching
// this app's established mixed-language convention throughout (e.g. "Model
// မြေပုံ").
export const ML_FAMILIES = [
  { id: 1, name: blSame('Linear & Regularized', 'Linear နှင့် Regularized'), color: '#8b5cf6' },
  { id: 2, name: blSame('Instance-Based & Probabilistic', 'Instance-Based နှင့် Probabilistic'), color: '#6366f1' },
  { id: 3, name: blSame('Tree-Based Models & Ensembles', 'Tree-Based မော်ဒယ်များ နှင့် Ensembles'), color: '#22d3ee' },
  { id: 4, name: blSame('Support Vector Machines', 'Support Vector Machines'), color: '#34d399' },
  { id: 5, name: blSame('Unsupervised Learning', 'Unsupervised သင်ယူမှု'), color: '#fbbf24' },
  { id: 6, name: blSame('Classical Time-Series / Econometric', 'Classical Time-Series / Econometric'), color: '#fb7185' },
  { id: 7, name: blSame('Modern Applied Time-Series Tools', 'ခေတ်မီ အသုံးချ Time-Series ကိရိယာများ'), color: '#f472b6' },
  { id: 8, name: blSame('Deep Learning', 'Deep သင်ယူမှု'), color: '#a78bfa' },
  { id: 9, name: blSame('Bayesian Machine Learning', 'Bayesian စက်သင်ယူမှု'), color: '#60a5fa' },
  { id: 10, name: blSame('Reinforcement Learning', 'Reinforcement သင်ယူမှု'), color: '#f87171' },
];

export const mlFamilyColorMap = Object.fromEntries(ML_FAMILIES.map((f) => [f.id, f.color]));

// compass axes are 1 (low) – 5 (high), per doc §4's three named axes.
export const ML_MODELS = [
  // 3.1 Linear & Regularized Models
  {
    id: 'linreg', ch: 1, name: 'Linear Regression', short: 'ŷ = a + bx',
    howItWorks: bl(
      'Draws the single straight line through the data that keeps the total prediction error as small as possible.',
      'Fits ŷ = β₀ + β₁x (+ …) by minimizing squared residuals (OLS); coefficients have closed-form solutions under Gauss-Markov assumptions.',
      'ခန့်မှန်းအမှား စုစုပေါင်းကို အနည်းဆုံးဖြစ်စေမည့် တစ်ကြောင်းတည်းသော မျဉ်းဖြောင့်ကို ဒေတာထဲတွင် ဆွဲသည်။',
      'Squared residuals (OLS) ကို minimize ပြုလုပ်ပြီး ŷ = β₀ + β₁x (+ …) ကို fit လုပ်သည်; Gauss-Markov ယူဆချက်များအောက်တွင် coefficient များသည် closed-form solution ရှိသည်။'
    ),
    advantages: blSame('Simple, fast, fully interpretable coefficients; cheap to estimate.', 'ရိုးရှင်း၊ မြန်ဆန်၊ coefficient များကို အပြည့်အဝ နားလည်နိုင်၊ ခန့်မှန်းရန် ကုန်ကျစရိတ်နည်း။'),
    weaknesses: blSame('Assumes linearity; sensitive to outliers and multicollinearity.', 'linear ဖြစ်သည်ဟု ယူဆထား; outlier နှင့် multicollinearity တို့ကို အထိခိုက်လွယ်သည်။'),
    usageAreas: blSame('Baseline for any driver-based forecast (e.g., gold vs. real yields + DXY).', 'driver-based forecast မည်သည့်အတွက်မဆို baseline (ဥပမာ ရွှေ vs. real yields + DXY)။'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 1 },
  },
  {
    id: 'ridge_lasso_en', ch: 1, name: 'Ridge / Lasso / Elastic Net', short: 'penalized OLS',
    howItWorks: bl(
      'Same straight-line idea as linear regression, but adds a penalty that discourages coefficients from growing too large — this keeps the model stable even with many correlated features.',
      'Adds an L2 (Ridge), L1 (Lasso), or blended (Elastic Net) penalty term to the OLS loss, shrinking coefficients toward zero; Lasso\'s L1 term can zero coefficients out entirely (automatic selection).',
      'Linear regression အတိုင်းပင် မျဉ်းဖြောင့်သဘောတရားသုံးသော်လည်း coefficient များ များလွန်းစွာ ကြီးမလာအောင် ပယ်ဒဏ်ပေါ့ဒါတစ်ခု ထည့်သွင်းသည် — ဆက်စပ်နေသော feature များစွာရှိလျှင်ပင် မော်ဒယ်ကို တည်ငြိမ်စေသည်။',
      'OLS loss ထဲသို့ L2 (Ridge)၊ L1 (Lasso)၊ သို့မဟုတ် ရောနှော (Elastic Net) ပယ်ဒဏ်ပေါ့ဒါ ထည့်ပြီး coefficient များကို သုညသို့ချုံ့သည်; Lasso ၏ L1 term သည် coefficient များကို လုံးဝသုညဖြစ်စေနိုင်သည် (အလိုအလျောက် feature ရွေးချယ်မှု)။'
    ),
    advantages: blSame('Handles many correlated macro features without overfitting; Lasso does automatic feature selection.', 'ဆက်စပ်နေသော macro feature များစွာကို overfitting မဖြစ်စေဘဲ ကိုင်တွယ်နိုင်; Lasso သည် feature ရွေးချယ်မှုကို အလိုအလျောက်ပြုလုပ်ပေးသည်။'),
    weaknesses: blSame('Requires tuning the penalty strength; coefficients biased toward zero.', 'ပယ်ဒဏ်ပေါ့ဒါ အားကို ချိန်ညှိရန်လိုအပ်; coefficient များသည် သုညဘက်သို့ bias ဖြစ်တတ်သည်။'),
    usageAreas: blSame('High-dimensional macro nowcasting — often beats fancier ML in GDP/inflation nowcasting.', 'အလေးထိုးမှုမြင့်သော macro nowcasting — GDP/inflation nowcasting တွင် ML ခေတ်မီများထက် မကြာခဏ ပိုကောင်းသည်။'),
    compass: { interpretability: 4, dataHunger: 2, nonlinearity: 1 },
  },
  {
    id: 'logreg', ch: 1, name: 'Logistic Regression', short: 'P(y=1) = σ(a+bx)',
    howItWorks: bl(
      'Squeezes a linear combination of inputs through an S-shaped curve so the output always lands between 0 and 1, giving a probability instead of a raw number.',
      'Models log-odds as linear in the predictors: logit(P) = β₀ + β₁x, fit by maximum likelihood; decision boundary is linear in the original feature space.',
      'Input များ၏ linear ပေါင်းစပ်မှုကို S-ပုံသဏ္ဍာန် လိမ်ကွေးမျဉ်းတစ်ခုမှတဆင့် ညှစ်ထုတ်ပြီး output ကို ၀ နှင့် ၁ ကြားတွင် အမြဲရှိစေသည်၊ ဂဏန်းစိုးစဉ် အစား ဖြစ်နိုင်ချေတန်ဖိုးတစ်ခု ရရှိသည်။',
      'Log-odds ကို predictor များတွင် linear အဖြစ် ပုံသေနိုင်သည်: logit(P) = β₀ + β₁x, maximum likelihood ဖြင့် fit လုပ်သည်; decision boundary သည် မူရင်း feature space တွင် linear ဖြစ်သည်။'
    ),
    advantages: blSame('Interpretable probabilities; strong baseline for binary events.', 'နားလည်နိုင်သော ဖြစ်နိုင်ချေများ; binary event များအတွက် strong baseline။'),
    weaknesses: blSame('Only linear decision boundary (in log-odds space).', 'log-odds space တွင်သာ linear decision boundary ရှိသည်။'),
    usageAreas: blSame('Recession-probability models, "will the incumbent win" binary election models.', 'စီးပွားပျက်ကပ် ဖြစ်နိုင်ချေမော်ဒယ်များ၊ "လက်ရှိအာဏာရှင် နိုင်မလား" binary ရွေးကောက်ပွဲမော်ဒယ်များ။'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 1 },
  },
  // 3.2 Instance-Based & Probabilistic
  {
    id: 'knn', ch: 2, name: 'K-Nearest Neighbors (KNN)', short: 'vote of k closest points',
    howItWorks: bl(
      'To predict a new point, finds the k most similar past examples and averages (or votes on) their answers — no formula is ever "learned," it just remembers everything.',
      'Non-parametric: prediction for x is an average (regression) or majority vote (classification) over the k nearest training points under a distance metric; no explicit training phase.',
      'အချက်အသစ်တစ်ခုကို ခန့်မှန်းရန် အလားတူဆုံးသော အတိတ်ဥပမာ k ခုကို ရှာဖွေပြီး ၎င်းတို့၏ အဖြေများကို ပျမ်းမျှ (သို့) မဲပေးသည် — ဖော်မြူလာ တစ်ခုမှ "သင်ယူ" ခြင်း မရှိဘဲ အားလုံးကို မှတ်သားထားရုံသာဖြစ်သည်။',
      'Non-parametric ဖြစ်သည်: x အတွက် ခန့်မှန်းချက်သည် distance metric အောက်တွင် k အနီးဆုံး training point များအပေါ် ပျမ်းမျှ (regression) သို့မဟုတ် များစုမဲ (classification) ဖြစ်သည်; ရှင်းလင်းသော training အဆင့် မရှိပါ။'
    ),
    advantages: blSame('Simple, no training phase, captures local nonlinearity.', 'ရိုးရှင်း၊ training အဆင့်မရှိ၊ local nonlinearity ကို ဖမ်းယူနိုင်သည်။'),
    weaknesses: blSame('Slow at prediction time on large data; degrades in high dimensions ("curse of dimensionality"); needs feature scaling.', 'ဒေတာကြီးမားလျှင် ခန့်မှန်းချိန်တွင် နှေးသည်; dimension မြင့်လျှင် စွမ်းဆောင်ရည်ကျသည် ("curse of dimensionality"); feature scaling လိုအပ်သည်။'),
    usageAreas: blSame('Finding "similar historical regimes" (analog forecasting).', '"ဆင်တူသမိုင်းဝင် အခြေအနေများ" ရှာဖွေခြင်း (analog forecasting)။'),
    compass: { interpretability: 3, dataHunger: 2, nonlinearity: 3 },
  },
  {
    id: 'naive_bayes', ch: 2, name: 'Naive Bayes', short: 'P(y|x) ∝ P(x|y)P(y)',
    howItWorks: bl(
      'Guesses the most likely category by combining how common each category is with how typical the observed features are for that category — assuming, for simplicity, that features don\'t interact.',
      'Applies Bayes\' theorem with the (naive) assumption of conditional independence between features given the class: P(y|x) ∝ P(y)∏P(xᵢ|y).',
      'အမျိုးအစားတစ်ခုစီ၏ အဖြစ်များမှုနှင့် တွေ့ရှိထားသော feature များ ထိုအမျိုးအစားအတွက် ဘယ်လောက်ပုံမှန်ရှိသလဲကို ပေါင်းစပ်ပြီး အဖြစ်နိုင်ဆုံး အမျိုးအစားကို ခန့်မှန်းသည် — ရိုးရှင်းရန် feature များ တစ်ခုနှင့်တစ်ခု အပြန်အလှန်သက်ရောက်မှုမရှိဟု ယူဆသည်။',
      'Class ပေးထားလျှင် feature များကြား conditional independence ဟူသော (naive) ယူဆချက်ဖြင့် Bayes သီအိုရမ်ကို အသုံးချသည်: P(y|x) ∝ P(y)∏P(xᵢ|y)။'
    ),
    advantages: blSame('Very fast; works well on text; needs little data.', 'အလွန်မြန်ဆန်; စာသားပေါ်တွင် ကောင်းစွာအလုပ်လုပ်; ဒေတာအနည်းငယ်သာလိုအပ်သည်။'),
    weaknesses: blSame('Assumes feature independence (often false).', 'feature independence ဟု ယူဆထား (မကြာခဏ မှားနေတတ်သည်)။'),
    usageAreas: blSame('News/sentiment classification for geopolitical or market-mood signals.', 'နိုင်ငံရေး သို့မဟုတ် စျေးကွက်စိတ်ခံစားမှု signal များအတွက် သတင်း/sentiment classification။'),
    compass: { interpretability: 4, dataHunger: 1, nonlinearity: 1 },
  },
  // 3.3 Tree-Based Models & Ensembles
  {
    id: 'dtree', ch: 3, name: 'Decision Tree', short: 'if/else splits',
    howItWorks: bl(
      'Repeatedly asks the single yes/no question about the data that best separates outcomes, building a flowchart of splits down to a final answer.',
      'Recursively partitions the feature space by choosing the split (feature + threshold) that maximizes information gain / minimizes impurity (Gini, entropy, or variance reduction) at each node.',
      'ရလဒ်များကို အကောင်းဆုံးခွဲခြားပေးမည့် ဟုတ်/မဟုတ် မေးခွန်းတစ်ခုစီကို ထပ်ခါထပ်ခါမေးပြီး၊ နောက်ဆုံးအဖြေအထိ ခွဲခြမ်းမှုများ၏ flowchart တစ်ခုကို တည်ဆောက်သည်။',
      'Node တစ်ခုစီတွင် information gain ကို maximize ပြု (သို့) impurity (Gini, entropy, or variance reduction) ကို minimize ပြုမည့် split (feature + threshold) ကို ရွေးချယ်ပြီး feature space ကို ထပ်ခါထပ်ခါ ပိုင်းခြားသည်။'
    ),
    advantages: blSame('Fully interpretable, handles nonlinearity and mixed data types, fast.', 'အပြည့်အဝ နားလည်နိုင်၊ nonlinearity နှင့် ရောနှော data type များကို ကိုင်တွယ်နိုင်၊ မြန်ဆန်သည်။'),
    weaknesses: blSame('Low accuracy alone; prone to overfitting; unstable (small data changes → different tree).', 'တစ်ခုတည်းသုံးလျှင် တိကျမှုနည်း; overfitting ဖြစ်လွယ်; မတည်ငြိမ် (ဒေတာအနည်းငယ်ပြောင်းလျှင် → tree မတူတော့)။'),
    usageAreas: blSame('Explaining a single forecast\'s logic to a non-technical audience.', 'နည်းပညာမဟုတ်သော ပရိသတ်အား ခန့်မှန်းချက်တစ်ခု၏ ယုတ္တိကို ရှင်းပြခြင်း။'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 3 },
  },
  {
    id: 'rf', ch: 3, name: 'Random Forest', short: 'bagged trees',
    howItWorks: bl(
      'Grows hundreds of slightly-different decision trees (each on a random slice of the data) and averages their answers — the averaging cancels out each individual tree\'s mistakes.',
      'Bagging ensemble: trains B trees on bootstrap resamples with random feature subsets per split, aggregates via averaging (regression) or majority vote (classification), reducing variance without increasing bias.',
      'သိမ်ငယ်စွာ ကွဲပြားနေသော decision tree ရာနှင့်ချီကို (တစ်ခုစီကို ဒေတာ၏ ကျပန်းအစိတ်အပိုင်းတစ်ခုပေါ်တွင်) စိုက်ပျိုးပြီး ၎င်းတို့၏ အဖြေများကို ပျမ်းမျှသည် — ပျမ်းမျှခြင်းက tree တစ်ခုစီ၏ အမှားများကို ပယ်ဖျက်ပေးသည်။',
      'Bagging ensemble: bootstrap resample များပေါ်တွင် tree B ခုကို split တစ်ခုစီတွင် ကျပန်း feature subset ဖြင့် လေ့ကျင့်ပြီး၊ ပျမ်းမျှခြင်း (regression) သို့မဟုတ် များစုမဲ (classification) ဖြင့် ပေါင်းစည်းသည်၊ bias မတိုးဘဲ variance ကို လျှော့ချသည်။'
    ),
    advantages: blSame('Reduces overfitting via averaging; robust defaults; good with little tuning; ranks feature importance; among the most accurate methods for macro nowcasting and inflation forecasting in recent studies.', 'ပျမ်းမျှခြင်းဖြင့် overfitting လျှော့ချ; robust defaults; ချိန်ညှိမှုအနည်းငယ်ဖြင့် ကောင်းသည်; feature အရေးပါမှုကို အဆင့်သတ်မှတ်ပေးသည်; မကြာသေးမီ လေ့လာမှုများတွင် macro nowcasting နှင့် inflation forecasting အတွက် တိကျဆုံး နည်းလမ်းများထဲပါဝင်သည်။'),
    weaknesses: blSame('Less interpretable than a single tree; large model size.', 'tree တစ်ခုတည်းထက် နားလည်ရခက်; မော်ဒယ်အရွယ်အစားကြီးသည်။'),
    usageAreas: blSame('GDP/inflation nowcasting, gold-driver importance ranking.', 'GDP/inflation nowcasting, ရွှေ driver အရေးပါမှု အဆင့်သတ်မှတ်ခြင်း။'),
    compass: { interpretability: 3, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'gbm', ch: 3, name: 'Gradient Boosting (general)', short: 'sequential error correction',
    howItWorks: bl(
      'Builds trees one at a time, where each new tree focuses specifically on fixing the mistakes the trees before it made — like a series of tutors, each correcting the last one\'s errors.',
      'Sequentially fits weak learners (typically shallow trees) to the negative gradient of the loss function w.r.t. current predictions, additively combining them: Fₘ(x) = Fₘ₋₁(x) + ν·hₘ(x).',
      'Tree များကို တစ်ခုချင်းစီ တည်ဆောက်ပြီး၊ tree အသစ်တစ်ခုစီသည် ယခင် tree များ၏ အမှားများကို ပြင်ရန်သာ အာရုံစိုက်သည် — ဆရာဆက်တိုက် တစ်ဦးချင်းစီက ရှေ့ဆရာ၏ အမှားများကို ပြင်ပေးသကဲ့သို့ဖြစ်သည်။',
      'ယခုလက်ရှိ ခန့်မှန်းချက်များနှင့် ပတ်သက်သည့် loss function ၏ negative gradient ကို weak learner (များသောအားဖြင့် shallow tree) များဖြင့် ဆက်တိုက် fit လုပ်ပြီး ပေါင်းစပ်သည်: Fₘ(x) = Fₘ₋₁(x) + ν·hₘ(x)။'
    ),
    advantages: blSame('Sequentially corrects errors → typically higher accuracy than bagging.', 'အမှားများကို ဆက်တိုက် ပြင်ဆင်သည် → bagging ထက် များသောအားဖြင့် တိကျမှုမြင့်သည်။'),
    weaknesses: blSame('More prone to overfitting/variance; needs careful tuning; slower to train than RF.', 'overfitting/variance ဖြစ်လွယ်; ဂရုတစိုက် ချိန်ညှိရန်လိုအပ်; RF ထက် လေ့ကျင့်ရန် နှေးသည်။'),
    usageAreas: blSame('Structured/tabular forecasting problems generally.', 'ယေဘုယျ structured/tabular forecasting ပြဿနာများ။'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'xgboost', ch: 3, name: 'XGBoost', short: 'regularized gradient boosting',
    howItWorks: bl(
      'The same "fix the last mistake" idea as gradient boosting, but with extra built-in guardrails that automatically prevent it from overfitting and make it fast to train.',
      'Gradient boosting with regularized objective (L1/L2 on leaf weights), second-order (Newton) gradient approximation, and built-in handling for sparse/missing data.',
      'Gradient boosting ၏ "နောက်ဆုံးအမှားကို ပြင်" ဆိုတဲ့ သဘောတရားအတိုင်းပင် ဖြစ်သော်လည်း overfitting မဖြစ်အောင် အလိုအလျောက် ကာကွယ်ပေးသော ထပ်လောင်း built-in guardrail များပါဝင်ပြီး လေ့ကျင့်ရန် မြန်ဆန်သည်။',
      'Leaf weight များပေါ် L1/L2 regularized objective ဖြင့်၊ second-order (Newton) gradient approximation ဖြင့်၊ sparse/missing data အတွက် built-in ကိုင်တွယ်မှုပါသော gradient boosting။'
    ),
    advantages: blSame('Mature, stable, extremely well documented; strong enterprise default; fast with regularization built in.', 'ရင့်ကျက်၊ တည်ငြိမ်၊ documentation အလွန်ကောင်း; enterprise default အနေနှင့်ကောင်း; regularization built-in ဖြင့် မြန်ဆန်သည်။'),
    weaknesses: blSame('Many hyperparameters; can overfit small datasets without care.', 'hyperparameter များစွာရှိ; ဂရုမစိုက်ပါက ဒေတာအနည်းငယ်ပေါ်တွင် overfit ဖြစ်တတ်သည်။'),
    usageAreas: blSame('Gold price prediction (frequently top performer with SHAP explainability), retail demand forecasting.', 'ရွှေစျေးနှုန်း ခန့်မှန်းခြင်း (SHAP explainability ဖြင့် ထိပ်တန်းစွမ်းဆောင်ရည်ရှိလေ့ရှိ)၊ retail demand forecasting။'),
    compass: { interpretability: 3, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'lightgbm', ch: 3, name: 'LightGBM', short: 'histogram gradient boosting',
    howItWorks: bl(
      'Speeds up the same gradient-boosting idea by grouping data values into buckets before searching for the best split, and by growing trees leaf-by-leaf instead of level-by-level.',
      'Histogram-based split finding (bucketing continuous features) plus leaf-wise (best-first) tree growth rather than level-wise, trading some overfitting risk for large training-speed gains.',
      'ကွန်တင်နျူးသော feature များကို bucket များအဖြစ် အုပ်စုဖွဲ့ပြီးမှ အကောင်းဆုံး split ကို ရှာဖွေခြင်းဖြင့်၊ level အလိုက်မဟုတ်ဘဲ leaf အလိုက် tree ကြီးထွားစေခြင်းဖြင့် gradient boosting သဘောတရားတူကို မြန်ဆန်စေသည်။',
      'Level-wise အစား leaf-wise (best-first) tree growth ဖြင့်၊ histogram-based split ရှာဖွေမှု (ကွန်တင်နျူးဖော် feature များကို bucket ခွဲ) — overfitting အန္တရာယ်အနည်းငယ်နှင့် လဲလှယ်ပြီး လေ့ကျင့်မှုမြန်နှုန်း များစွာတိုးတက်စေသည်။'
    ),
    advantages: blSame('Fastest training on large datasets (histogram-based splitting).', 'ဒေတာအထုအထည်ကြီးများတွင် အမြန်ဆုံး လေ့ကျင့်နိုင် (histogram-based splitting)။'),
    weaknesses: blSame('Can overfit on small data; sensitive to parameter choices.', 'ဒေတာအနည်းငယ်ပေါ်တွင် overfit ဖြစ်တတ်; parameter ရွေးချယ်မှုကို အထိခိုက်လွယ်သည်။'),
    usageAreas: blSame('Large panel datasets, high-frequency financial features.', 'panel dataset ကြီးများ၊ high-frequency ဘဏ္ဍာရေး feature များ။'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'catboost', ch: 3, name: 'CatBoost', short: 'categorical-native boosting',
    howItWorks: bl(
      'Same gradient-boosting family, but handles categories (like "country" or "party") natively and cleverly, without needing them converted to numbers first.',
      'Ordered boosting + ordered target statistics for categorical features, avoiding the target leakage that naive one-hot/mean-encoding introduces.',
      'Gradient boosting မိသားစုတူညီသော်လည်း "နိုင်ငံ" သို့မဟုတ် "ပါတီ" ကဲ့သို့ အမျိုးအစားများကို ဂဏန်းသို့ ပြောင်းရန်မလိုဘဲ အသုံးချနိုင်သည်။',
      'Naive one-hot/mean-encoding က ဖြစ်စေတတ်သော target leakage ကို ရှောင်ရှားရန် ordered boosting + categorical feature များအတွက် ordered target statistics သုံးသည်။'
    ),
    advantages: blSame('Best native handling of categorical variables; often best generalization/AUC in comparative studies.', 'categorical variable များကို အကောင်းဆုံး native ကိုင်တွယ်မှု; နှိုင်းယှဉ်လေ့လာမှုများတွင် generalization/AUC အကောင်းဆုံးဖြစ်လေ့ရှိသည်။'),
    weaknesses: blSame('Slower to train than LightGBM.', 'LightGBM ထက် လေ့ကျင့်ရန် နှေးသည်။'),
    usageAreas: blSame('Datasets with many categorical macro/political variables (country, regime type, party).', 'categorical macro/နိုင်ငံရေး variable များစွာပါသော dataset များ (နိုင်ငံ၊ အုပ်ချုပ်ရေးစနစ်၊ ပါတီ)။'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'bagging', ch: 3, name: 'Bagging (general)', short: 'bootstrap + average',
    howItWorks: bl(
      'Trains many copies of the same model on different random resamples of the data, then averages their answers to smooth out noise.',
      'Bootstrap Aggregating: trains B base learners on independent bootstrap resamples, aggregates by averaging/voting — reduces variance, Var(avg) shrinks with B for uncorrelated errors.',
      'တူညီသော မော်ဒယ်၏ မိတ္တူများစွာကို ဒေတာ၏ ကျပန်း resample မတူညီသောအပေါ်တွင် လေ့ကျင့်ပြီး၊ noise ကို ချောမွေ့စေရန် အဖြေများကို ပျမ်းမျှသည်။',
      'Bootstrap Aggregating: base learner B ခုကို independent bootstrap resample များပေါ်တွင် လေ့ကျင့်ပြီး၊ ပျမ်းမျှ/မဲပေးခြင်းဖြင့် ပေါင်းစည်းသည် — variance လျှော့ချသည်။'
    ),
    advantages: blSame('Reduces variance, parallelizable.', 'variance လျှော့ချ၊ parallel လုပ်နိုင်သည်။'),
    weaknesses: blSame('Does not reduce bias — a bad base learner stays bad on average.', 'bias ကို မလျှော့ချပါ — base learner ညံ့ဖျင်းလျှင် ပျမ်းမျှအားဖြင့် ဆက်ညံ့နေမည်။'),
    usageAreas: blSame('Stabilizing noisy, high-variance base models.', 'noise များပြီး variance မြင့်သော base model များကို တည်ငြိမ်စေခြင်း။'),
    compass: { interpretability: 3, dataHunger: 2, nonlinearity: 3 },
  },
  {
    id: 'boosting', ch: 3, name: 'Boosting (general)', short: 'sequential bias reduction',
    howItWorks: bl(
      'The umbrella idea behind gradient boosting and XGBoost: chain together many weak, simple models so each one patches the previous ones\' blind spots.',
      'General framework for additive, sequential ensembling that minimizes bias by re-weighting or re-fitting to residuals at each stage; AdaBoost and gradient boosting are specific instances.',
      'Gradient boosting နှင့် XGBoost ၏ နောက်ကွယ်ရှိ ယေဘုယျအယူအဆ: အားနည်းသော ရိုးရှင်းသော မော်ဒယ်များစွာကို ဆက်တင်ကာ တစ်ခုစီက ယခင်များ၏ မမြင်သာသည့်နေရာများကို ဖာပေးသည်။',
      'အဆင့်တစ်ခုစီတွင် residual များကို ပြန်လည် weight ချ (သို့) ပြန် fit လုပ်ခြင်းဖြင့် bias ကို minimize ပြုသည့် ပေါင်းစပ်၊ ဆက်တိုက် ensembling ယေဘုယျ framework; AdaBoost နှင့် gradient boosting တို့သည် နမူနာများဖြစ်သည်။'
    ),
    advantages: blSame('Reduces bias, often the most accurate single-model family.', 'bias လျှော့ချ၊ မော်ဒယ်တစ်ခုတည်း မိသားစုအတွင်း အတိကျဆုံးဖြစ်လေ့ရှိသည်။'),
    weaknesses: blSame('Prone to overfitting/variance if unchecked; sequential = slower to train.', 'မထိန်းညှိပါက overfitting/variance ဖြစ်လွယ်; sequential ဖြစ်၍ လေ့ကျင့်ရန်နှေးသည်။'),
    usageAreas: blSame('Whenever maximum predictive accuracy is the goal and overfitting is monitored.', 'ခန့်မှန်းတိကျမှု အများဆုံးလိုအပ်ပြီး overfitting ကို စောင့်ကြည့်နိုင်သည့်အခါတိုင်း။'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  {
    id: 'stacking', ch: 3, name: 'Stacking Ensemble', short: 'meta-model of models',
    howItWorks: bl(
      'Runs several different models on the same problem, then trains one more "referee" model that learns how to best blend their individual answers together.',
      'Trains diverse base learners, then fits a meta-learner on their out-of-fold predictions to learn an optimal (often nonlinear) combination — typically the strongest ceiling on accuracy, at the cost of complexity.',
      'ပြဿနာတစ်ခုတည်းအတွက် ကွဲပြားသော မော်ဒယ်များစွာကို run ပြီး၊ ၎င်းတို့၏ တစ်ဦးချင်းအဖြေများကို အကောင်းဆုံး ရောနှောနည်းကို သင်ယူမည့် "တရားသူကြီး" မော်ဒယ်တစ်ခုထပ်ထပ် လေ့ကျင့်သည်။',
      'ကွဲပြားသော base learner များကို လေ့ကျင့်ပြီး ၎င်းတို့၏ out-of-fold ခန့်မှန်းချက်များပေါ်တွင် optimal ပေါင်းစပ်မှု (မကြာခဏ nonlinear) ကို သင်ယူရန် meta-learner ကို fit လုပ်သည် — ရှုပ်ထွေးမှုနှင့်လဲလှယ်ပြီး များသောအားဖြင့် တိကျဆုံးအကန့်ရှိသည်။'
    ),
    advantages: blSame('Combines heterogeneous models (e.g., ARIMA + XGBoost + LSTM) for the best overall accuracy.', 'ကွဲပြားသော မော်ဒယ်များ (ဥပမာ ARIMA + XGBoost + LSTM) ကို ပေါင်းစပ်ပြီး အကောင်းဆုံး စုစုပေါင်း တိကျမှု ရရှိစေသည်။'),
    weaknesses: blSame('Most compute- and complexity-expensive; harder to explain.', 'တွက်ချက်မှုနှင့် ရှုပ်ထွေးမှု အကုန်အကျဆုံး; ရှင်းပြရန် ခက်ခဲသည်။'),
    usageAreas: blSame('Flagship "ensemble of everything" forecasts (e.g., final gold-price consensus module).', 'flagship "အားလုံးပေါင်းစပ်" ခန့်မှန်းချက်များ (ဥပမာ ရွှေစျေးနှုန်း နောက်ဆုံး သဘောတူညီချက် module)။'),
    compass: { interpretability: 1, dataHunger: 4, nonlinearity: 5 },
  },
  // 3.4 Support Vector Machines
  {
    id: 'svm', ch: 4, name: 'SVM / SVR', short: 'max-margin boundary',
    howItWorks: bl(
      'Finds the boundary line (or curve, via a "kernel trick") that separates classes with the widest possible safety margin, paying attention only to the trickiest borderline cases.',
      'Finds the maximum-margin separating hyperplane in a (possibly kernel-transformed) feature space; only support vectors (points on/inside the margin) affect the solution.',
      'အမျိုးအစားများကို အကျယ်ဆုံး ဘေးကင်းရေးအကွာအဝေးဖြင့် ခွဲခြားပေးမည့် နယ်နိမိတ်မျဉ်း (သို့ "kernel trick" မှတဆင့် မျဉ်းကွေး) ကို ရှာဖွေပြီး၊ အနက်ရှိန်ဆုံး နယ်စပ်ကိစ္စများကိုသာ အာရုံစိုက်သည်။',
      '(Kernel-ပြောင်းလဲထားနိုင်သော) feature space တွင် maximum-margin ခွဲခြားပေးသည့် hyperplane ကို ရှာဖွေသည်; support vector များ (margin ပေါ်/အတွင်းရှိ point များ) သာ solution ကို သက်ရောက်စေသည်။'
    ),
    advantages: blSame('Effective in high dimensions; robust to outliers (only support vectors matter); memory-efficient.', 'dimension မြင့်တွင် ထိရောက်; outlier များကို ကြံ့ခိုင်စွာ ခံနိုင် (support vector များသာ အရေးကြီး); memory သက်သာသည်။'),
    weaknesses: blSame('Poor scaling to large datasets; struggles with noisy/overlapping classes; kernel choice is fiddly.', 'ဒေတာအထုအထည်ကြီးမားလျှင် scaling ညံ့သည်; noise/overlap ရှိသော class များနှင့် အခက်တွေ့; kernel ရွေးချယ်မှု ခက်ခဲသည်။'),
    usageAreas: blSame('Medium-sized, high-dimensional classification (e.g., crisis/no-crisis regime classification).', 'အလယ်အလတ်အရွယ်၊ dimension မြင့် classification (ဥပမာ ကပ်ဘေး/ကပ်ဘေးမဟုတ် regime classification)။'),
    compass: { interpretability: 2, dataHunger: 2, nonlinearity: 4 },
  },
  // 3.5 Unsupervised Learning
  {
    id: 'kmeans', ch: 5, name: 'K-Means Clustering', short: 'partition into k groups',
    howItWorks: bl(
      'Sorts data points into k groups by repeatedly assigning each point to its nearest group center, then recomputing each center as the average of its assigned points.',
      'Alternates between assignment (each point to nearest centroid under Euclidean distance) and update (recompute centroids as cluster means) until convergence; minimizes within-cluster sum of squares.',
      'ဒေတာအမှတ်များကို k အုပ်စုအဖြစ် အမှတ်တစ်ခုစီကို အနီးဆုံးအုပ်စုဗဟိုသို့ ထပ်ခါထပ်ခါ သတ်မှတ်ပြီး၊ ဗဟိုတစ်ခုစီကို ၎င်းသို့သတ်မှတ်ထားသော အမှတ်များ၏ ပျမ်းမျှအဖြစ် ပြန်တွက်ချက်ခြင်းဖြင့် ခွဲခြားသည်။',
      'ပေါင်းစည်းမှုမရောက်မချင်း assignment (Euclidean distance အောက် အမှတ်တစ်ခုစီကို အနီးဆုံး centroid သို့) နှင့် update (centroid များကို cluster mean အဖြစ် ပြန်တွက်ချက်) ကို အလှည့်လှည့်ပြုလုပ်သည်။'
    ),
    advantages: blSame('Fast, simple, scalable.', 'မြန်ဆန်၊ ရိုးရှင်း၊ scale တိုးနိုင်သည်။'),
    weaknesses: blSame('Must pre-specify number of clusters; assumes spherical clusters.', 'cluster အရေအတွက်ကို ကြိုတင်သတ်မှတ်ရမည်; cluster များသည် ဂုံးပုံသဏ္ဍာန်ဖြစ်သည်ဟု ယူဆထား။'),
    usageAreas: blSame('Segmenting historical market "regimes," country clustering for political risk.', 'သမိုင်းဝင် စျေးကွက် "regime" များ ခွဲခြားခြင်း၊ နိုင်ငံရေးအန္တရာယ်အတွက် နိုင်ငံ clustering။'),
    compass: { interpretability: 4, dataHunger: 1, nonlinearity: 2 },
  },
  {
    id: 'hclust', ch: 5, name: 'Hierarchical Clustering', short: 'dendrogram merge/split',
    howItWorks: bl(
      'Builds a family tree of the data by repeatedly merging the two most similar groups (or splitting the least cohesive one), producing a full tree of every possible grouping at once.',
      'Agglomerative (bottom-up, merging closest clusters by a linkage criterion) or divisive (top-down) construction of a dendrogram, no k needed in advance; a cut height determines the final clusters.',
      'အလားတူဆုံး အုပ်စုနှစ်စုကို ထပ်ခါထပ်ခါ ပေါင်းစည်း (သို့ စည်းလုံးမှုအနည်းဆုံးကို ပိုင်း) ခြင်းဖြင့် ဒေတာ၏ မျိုးရိုးစဉ် တစ်ခုကို တည်ဆောက်ပြီး၊ ဖြစ်နိုင်သော အုပ်စုဖွဲ့မှုအားလုံးကို tree တစ်ခုတည်းဖြင့် တစ်ပြိုင်နက်ပြသသည်။',
      'Linkage criterion တစ်ခုဖြင့် အနီးဆုံး cluster များကို ပေါင်းစည်းသည့် (agglomerative, အောက်မှအပေါ်) သို့မဟုတ် (divisive, အပေါ်မှအောက်) dendrogram တည်ဆောက်မှု၊ k ကို ကြိုတင်သတ်မှတ်ရန်မလို; ဖြတ်တောက်မှု အမြင့်က နောက်ဆုံး cluster များကို ဆုံးဖြတ်သည်။'
    ),
    advantages: blSame('No need to pre-specify cluster count; produces interpretable dendrogram.', 'cluster အရေအတွက်ကို ကြိုတင်သတ်မှတ်ရန်မလို; နားလည်နိုင်သော dendrogram ထုတ်ပေးသည်။'),
    weaknesses: blSame('Computationally expensive at scale.', 'scale ကြီးလာလျှင် တွက်ချက်မှု ကုန်ကျစရိတ်များသည်။'),
    usageAreas: blSame('Building the visual relationship map itself (grouping related models/formulas).', 'ဆက်စပ်မှုပုံစံ (relationship map) ကိုယ်တိုင် တည်ဆောက်ခြင်း (ဆက်စပ်သော မော်ဒယ်/ဖော်မြူလာများကို အုပ်စုဖွဲ့ခြင်း)။'),
    compass: { interpretability: 4, dataHunger: 1, nonlinearity: 2 },
  },
  {
    id: 'pca', ch: 5, name: 'PCA (dimensionality reduction)', short: 'compress to k factors',
    howItWorks: bl(
      'Finds a handful of "summary directions" that capture most of what\'s moving together across many correlated variables, so a large messy dataset can be replaced by a few clean numbers.',
      'Finds an orthogonal basis (principal components) ranked by variance explained, via eigendecomposition of the covariance matrix; the first few components typically capture most of the signal in correlated panels.',
      'ဆက်စပ်နေသော variable များစွာတွင် အတူတကွ ရွေ့လျားနေသည့် အရာအများစုကို ဖမ်းယူပေးမည့် "အနှစ်ချုပ်ဦးတည်ချက်" အနည်းငယ်ကို ရှာဖွေပြီး၊ ရှုပ်ထွေးသော dataset ကြီးကို သန့်ရှင်းသောဂဏန်း အနည်းငယ်ဖြင့် အစားထိုးနိုင်သည်။',
      'Covariance matrix ၏ eigendecomposition မှတဆင့် ရှင်းပြထားသော variance ဖြင့် အဆင့်သတ်မှတ်ထားသော orthogonal basis (principal component) များကို ရှာဖွေသည်; ပထမဆုံး component အနည်းငယ်သည် ဆက်စပ်သော panel များရှိ signal အများစုကို ဖမ်းယူလေ့ရှိသည်။'
    ),
    advantages: blSame('Compresses many correlated macro series into a few "factors"; reduces noise.', 'ဆက်စပ်နေသော macro series များစွာကို "factor" အနည်းငယ်အဖြစ် ချုံ့ပေးသည်; noise လျှော့ချသည်။'),
    weaknesses: blSame('Components lose direct interpretability; loses some information.', 'component များသည် တိုက်ရိုက်နားလည်နိုင်မှု ဆုံးရှုံးသည်; အချက်အလက်အချို့ ဆုံးရှုံးသည်။'),
    usageAreas: blSame('Feeding a Dynamic-Factor-Model-style "common macro factor" into both Stats and ML views.', 'Dynamic-Factor-Model ပုံစံ "ဘုံ macro factor" ကို Stats နှင့် ML views နှစ်ခုစလုံးထဲသို့ ထည့်သွင်းခြင်း။'),
    compass: { interpretability: 2, dataHunger: 1, nonlinearity: 1 },
  },
  // 3.6 Classical Time-Series / Econometric Models
  {
    id: 'arima', ch: 6, name: 'ARIMA / SARIMA', short: 'autoregressive + differencing',
    howItWorks: bl(
      'Predicts the next value mainly from a weighted mix of recent past values and recent past errors, after first removing trend by differencing the series.',
      'Combines AutoRegressive (p lags), Integrated (d-order differencing for stationarity), and Moving Average (q lagged error terms) components; SARIMA adds seasonal (P,D,Q,s) terms.',
      'Series ကို differencing ဖြင့် ဦးစွာ trend ဖယ်ထုတ်ပြီးနောက် လတ်တလော အတိတ်တန်ဖိုးများနှင့် အတိတ်အမှားများ၏ weight ပေါင်းစပ်မှုမှ နောက်တန်ဖိုးကို ခန့်မှန်းသည်။',
      'AutoRegressive (p lag)၊ Integrated (stationarity အတွက် d-order differencing)၊ Moving Average (q lag error term) components များကို ပေါင်းစပ်သည်; SARIMA သည် seasonal (P,D,Q,s) term များ ထပ်ထည့်သည်။'
    ),
    advantages: blSame('Strong theory, fast, often lowest error on stable/linear series; highly explainable.', 'သီအိုရီခိုင်မာ၊ မြန်ဆန်၊ တည်ငြိမ်/linear series တွင် အမှားအနည်းဆုံးဖြစ်လေ့ရှိ; ရှင်းပြရလွယ်ကူသည်။'),
    weaknesses: blSame('Assumes linearity & stationarity; struggles with structural breaks and missing data; manual tuning (p,d,q) is time-consuming.', 'linearity နှင့် stationarity ဟု ယူဆထား; structural break နှင့် missing data နှင့် အခက်တွေ့; (p,d,q) manual tuning အချိန်ကုန်သည်။'),
    usageAreas: blSame('Short-horizon macro series with clear trend/seasonality.', 'ရှင်းလင်းသော trend/seasonality ရှိသော short-horizon macro series များ။'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 1 },
  },
  {
    id: 'var', ch: 6, name: 'VAR (Vector Autoregression)', short: 'multivariate AR',
    howItWorks: bl(
      'Extends the "predict from recent past values" idea of ARIMA to several series at once, letting each one\'s future depend on everyone\'s recent past — so gold, DXY, and real yields can all inform each other.',
      'Each of n variables is modeled as a linear function of p lags of itself and all other variables in the system; estimated jointly, capturing feedback loops that univariate models miss.',
      'ARIMA ၏ "လတ်တလော အတိတ်တန်ဖိုးများမှ ခန့်မှန်း" သဘောတရားကို series များစွာသို့ တစ်ပြိုင်နက် ချဲ့ထွင်ပြီး၊ တစ်ခုစီ၏ အနာဂတ်ကို အားလုံး၏ လတ်တလော အတိတ်ပေါ် မှီခိုစေသည် — ရွှေ၊ DXY၊ real yields အားလုံး အချင်းချင်း အချက်ပြနိုင်သည်။',
      'Variable n ခုစီကို system ရှိ ၎င်းနှင့် အခြားအားလုံး၏ lag p ခု၏ linear function အဖြစ် ပုံသေသည်; univariate မော်ဒယ်များ လွတ်သွားတတ်သော feedback loop များကို ဖမ်းယူသည်။'
    ),
    advantages: blSame('Captures feedback between multiple series (e.g., gold ↔ DXY ↔ real yields jointly).', 'series များစွာကြား feedback ကို ဖမ်းယူသည် (ဥပမာ ရွှေ ↔ DXY ↔ real yields ပူးတွဲ)။'),
    weaknesses: blSame('Parameters grow quickly with more variables ("curse of dimensionality"); needs stationarity.', 'variable များလာလေ parameter များ လျင်မြန်စွာတိုးလေ ("curse of dimensionality"); stationarity လိုအပ်သည်။'),
    usageAreas: blSame('Multi-variable macro systems — natural econometric sibling of DFM content.', 'multi-variable macro system များ — DFM content ၏ သဘာဝ econometric ညီအစ်ကို။'),
    compass: { interpretability: 4, dataHunger: 2, nonlinearity: 1 },
  },
  {
    id: 'garch', ch: 6, name: 'GARCH / ARCH', short: 'volatility clustering',
    howItWorks: bl(
      'Models the size of price swings itself as changing over time — calm periods tend to stay calm and turbulent periods tend to stay turbulent, and this model predicts which regime is coming.',
      'Models conditional variance as a function of past squared residuals (ARCH term) and past variance (GARCH term): σ²ₜ = ω + α·ε²ₜ₋₁ + β·σ²ₜ₋₁, capturing volatility clustering.',
      'စျေးနှုန်းအတက်အကျ ကိုယ်တိုင်၏ အရွယ်အစားကို အချိန်နှင့်အမျှ ပြောင်းလဲနေသည်ဟု ပုံသေသည် — အေးဆေးသောကာလများသည် အေးဆေးဆဲရှိတတ်ပြီး ဒွန်တွန်းသောကာလများသည် ဒွန်တွန်းဆဲရှိတတ်ကြောင်း၊ ဘယ် regime လာမည်ကို ခန့်မှန်းသည်။',
      'Conditional variance ကို အတိတ် squared residual (ARCH term) နှင့် အတိတ် variance (GARCH term) ၏ function အဖြစ် ပုံသေသည်: σ²ₜ = ω + α·ε²ₜ₋₁ + β·σ²ₜ₋₁, volatility clustering ကို ဖမ်းယူသည်။'
    ),
    advantages: blSame('Purpose-built for volatility clustering (calm/turbulent regimes); improves confidence-interval realism.', 'volatility clustering (အေးဆေး/ဒွန်တွန်း regime) အတွက် အထူးတည်ဆောက်ထား; confidence-interval အစစ်ဆန်မှု တိုးတက်စေသည်။'),
    weaknesses: blSame('Choosing the estimation window is contested — too long dilutes recent regime, too short is noisy.', 'estimation window ရွေးချယ်မှု အငြင်းပွားဖွယ်ရှိ — ရှည်လွန်းလျှင် လက်ရှိ regime ပါးလွယ်ပြီး တိုလွန်းလျှင် noise များသည်။'),
    usageAreas: blSame('Gold/FX/equity volatility forecasting, VaR risk models — pairs naturally with Stats mode\'s stochastic-volatility content.', 'ရွှေ/FX/equity volatility forecasting, VaR risk model များ — Stats mode ၏ stochastic-volatility content နှင့် သဘာဝကျစွာ တွဲနိုင်သည်။'),
    compass: { interpretability: 4, dataHunger: 2, nonlinearity: 2 },
  },
  {
    id: 'expsmooth', ch: 6, name: 'Exponential Smoothing / Holt-Winters', short: 'weighted recency average',
    howItWorks: bl(
      'Forecasts the next value as a smoothly-weighted average of all past values, where more recent observations count more — extended with extra terms for trend and repeating seasonal patterns.',
      'Recursively updates level (α), trend (β), and seasonal (γ) smoothing states; forecast = level + trend·h + seasonal component, with weights decaying exponentially into the past.',
      'အနာဂတ်တန်ဖိုးကို အတိတ်တန်ဖိုးအားလုံး၏ ချောမွေ့စွာ weight ချထားသော ပျမ်းမျှအဖြစ် ခန့်မှန်းပြီး၊ လက်ရှိနှင့်နီးသော တွေ့ရှိချက်များက ပိုအလေးထား — trend နှင့် ထပ်ခါထပ်ခါ ဖြစ်ပေါ်သော seasonal pattern များအတွက် term ထပ်ထည့်ထားသည်။',
      'Level (α)၊ trend (β)၊ seasonal (γ) smoothing state များကို ထပ်ခါထပ်ခါ update ပြုသည်; forecast = level + trend·h + seasonal component, weight များသည် အတိတ်ဘက်သို့ exponentially လျော့ကျသည်။'
    ),
    advantages: blSame('Very fast, intuitive, good for trend+seasonality.', 'အလွန်မြန်ဆန်၊ နားလည်လွယ်၊ trend+seasonality အတွက် ကောင်းသည်။'),
    weaknesses: blSame('Weaker with irregular shocks or structural change.', 'ပုံမှန်မဟုတ်သော ရုတ်တရက်ဖြစ်ပေါ်မှု (သို့) ဖွဲ့စည်းပုံပြောင်းလဲမှုတွင် အားနည်းသည်။'),
    usageAreas: blSame('Quick operational forecasts, baseline comparisons.', 'လျင်မြန်သော operational forecast များ၊ baseline နှိုင်းယှဉ်မှုများ။'),
    compass: { interpretability: 5, dataHunger: 1, nonlinearity: 1 },
  },
  // 3.7 Modern Applied Time-Series Tools
  {
    id: 'prophet', ch: 7, name: 'Prophet', short: 'decomposable trend+seasonality',
    howItWorks: bl(
      'Breaks a series into a flexible trend curve, repeating seasonal patterns, and holiday effects, fits each piece separately, then adds them back together into one forecast.',
      'Additive (or multiplicative) decomposition y(t) = g(t) + s(t) + h(t) + εₜ, with a piecewise-linear/logistic trend g(t), Fourier-series seasonality s(t), and holiday indicators h(t), fit via MAP estimation in Stan.',
      'Series ကို ပြောင်းလွယ်ပြင်လွယ် trend မျဉ်းကွေး၊ ထပ်ခါထပ်ခါ ဖြစ်ပေါ်သော seasonal pattern များ၊ ရုံးပိတ်ရက် သက်ရောက်မှုများအဖြစ် ခွဲခြမ်းပြီး၊ တစ်ခုစီကို သီးခြားစီ fit လုပ်ပြီးမှ ပြန်ပေါင်းပြီး ခန့်မှန်းချက်တစ်ခု ရရှိသည်။',
      'Piecewise-linear/logistic trend g(t)၊ Fourier-series seasonality s(t)၊ holiday indicator h(t) တို့ဖြင့် additive (သို့ multiplicative) decomposition y(t) = g(t) + s(t) + h(t) + εₜ ကို Stan တွင် MAP estimation ဖြင့် fit လုပ်သည်။'
    ),
    advantages: blSame('Extremely quick to deploy; handles sparse/missing seasonal data gracefully; built-in holiday effects.', 'အလွန်လျင်မြန်စွာ ဖြန့်ချိနိုင်; sparse/missing seasonal data ကို ချောမွေ့စွာ ကိုင်တွယ်; built-in ရုံးပိတ်ရက် သက်ရောက်မှုများ။'),
    weaknesses: blSame('Consistently less accurate than ARIMA/LSTM/XGBoost in comparative studies; struggles with short-term fluctuations.', 'နှိုင်းယှဉ်လေ့လာမှုများတွင် ARIMA/LSTM/XGBoost ထက် စဉ်ဆက်မပြတ် တိကျမှုနည်း; short-term အတက်အကျများနှင့် အခက်တွေ့သည်။'),
    usageAreas: blSame('Fast baseline dashboards, non-expert users.', 'လျင်မြန်သော baseline dashboard များ၊ ကျွမ်းကျင်သူမဟုတ်သူများ။'),
    compass: { interpretability: 4, dataHunger: 2, nonlinearity: 2 },
  },
  {
    id: 'hybrid', ch: 7, name: 'Hybrid Econometric+ML', short: 'ARIMA-residual → XGBoost/LSTM',
    howItWorks: bl(
      'Lets a classical model like ARIMA capture the obvious trend first, then hands its leftover errors (the part it couldn\'t explain) to an ML model, which hunts for hidden nonlinear patterns in what\'s left.',
      'Fits ARIMA (or similar) first, then trains XGBoost/LSTM on the residual series εₜ = yₜ − ŷₜᴬᴿᴵᴹᴬ, combining the linear-trend strength of econometrics with nonlinear pattern-capture of ML; final forecast = ŷᴬᴿᴵᴹᴬ + ŷᴹᴸ(residual).',
      'ARIMA ကဲ့သို့ classical မော်ဒယ်ကို ထင်ရှားသော trend ဦးစွာ ဖမ်းယူစေပြီး၊ ကျန်ကြွင်းအမှားများ (ရှင်းပြမပြီးသေးသော အပိုင်း) ကို ML မော်ဒယ်တစ်ခုသို့ လွှဲပေး၍ ကျန်ရှိနေသော ဝှက်ထားသော nonlinear pattern များကို ရှာဖွေစေသည်။',
      'ARIMA (သို့ ဆင်တူ) ကို ဦးစွာ fit လုပ်ပြီး၊ residual series εₜ = yₜ − ŷₜᴬᴿᴵᴹᴬ ပေါ်တွင် XGBoost/LSTM ကို လေ့ကျင့်သည်; econometrics ၏ linear-trend အားသာချက်ကို ML ၏ nonlinear pattern ဖမ်းယူနိုင်စွမ်းနှင့် ပေါင်းစပ်သည်။'
    ),
    advantages: blSame('Combines linear-trend strength of econometrics with nonlinear pattern-capture of ML; statistically significant accuracy gains over either alone.', 'econometrics ၏ linear-trend အားသာချက်ကို ML ၏ nonlinear pattern ဖမ်းယူနိုင်စွမ်းနှင့် ပေါင်းစပ်သည်; နှစ်ခုတည်းသုံးထားရာထက် statistically significant တိကျမှုတိုးတက်မှု ရရှိသည်။'),
    weaknesses: blSame('More moving parts, harder to maintain/explain.', 'ရွေ့လျားနေသော အစိတ်အပိုင်းများစွာ၊ ထိန်းသိမ်း/ရှင်းပြရန် ခက်ခဲသည်။'),
    usageAreas: blSame('Flagship gold/commodity/crypto forecasting pipelines — an ideal "Stats + ML working together" teaching module.', 'flagship ရွှေ/ကုန်ပစ္စည်း/crypto forecasting pipeline များ — "Stats + ML အတူတကွ လုပ်ဆောင်" သင်ကြားရေး module အကောင်းဆုံး။'),
    compass: { interpretability: 2, dataHunger: 3, nonlinearity: 4 },
  },
  // 3.8 Deep Learning
  {
    id: 'rnn', ch: 8, name: 'RNN (vanilla)', short: 'recurrent hidden state',
    howItWorks: bl(
      'Reads a sequence one step at a time while carrying forward a running "memory" summary that gets updated at every step, so earlier context can influence later predictions.',
      'Maintains hidden state hₜ = f(Whₕhₜ₋₁ + Wₓₕxₜ + b), updated recurrently at each timestep; trained via backpropagation through time (BPTT).',
      'Sequence ကို တစ်ဆင့်ချင်းစီ ဖတ်နေစဉ် ဆင့်ကမ်းစီးဆင်းနေသော "မှတ်ဉာဏ်" အကျဉ်းချုပ်ကို ရွက်ဆောင်ပြီး တစ်ဆင့်စီတွင် update ပြုသည်၊ ထို့ကြောင့် အစောပိုင်း context က နောက်ပိုင်း ခန့်မှန်းချက်များကို သက်ရောက်စေနိုင်သည်။',
      'Timestep တစ်ခုစီတွင် ဆက်တိုက် update ပြုသည့် hidden state hₜ = f(Whₕhₜ₋₁ + Wₓₕxₜ + b) ကို ထိန်းသိမ်းသည်; backpropagation through time (BPTT) ဖြင့် လေ့ကျင့်သည်။'
    ),
    advantages: blSame('Purpose-built for sequences; captures temporal state.', 'sequence များအတွက် အထူးတည်ဆောက်ထား; ယာယီအခြေအနေကို ဖမ်းယူသည်။'),
    weaknesses: blSame('Vanishing/exploding gradients on long sequences; slow, hard to parallelize.', 'sequence ရှည်ပါက gradient များ ပျောက်ကွယ်/ကြီးထွားလွန်းတတ်; နှေး၊ parallel လုပ်ရန်ခက်ခဲသည်။'),
    usageAreas: blSame('Short-sequence pattern learning.', 'sequence တိုသော pattern သင်ယူမှု။'),
    compass: { interpretability: 1, dataHunger: 4, nonlinearity: 5 },
  },
  {
    id: 'lstm', ch: 8, name: 'LSTM / GRU', short: 'gated memory cells',
    howItWorks: bl(
      'Like an RNN, but with built-in "gates" that learn what to remember, what to forget, and what to output at each step — solving the vanilla RNN\'s tendency to forget things that happened too long ago.',
      'Introduces forget/input/output gates (LSTM) or reset/update gates (GRU) controlling information flow through the cell state, mitigating vanishing gradients and enabling learning of long-range dependencies.',
      'RNN ကဲ့သို့ပင် ဖြစ်သော်လည်း ဘာကိုမှတ်ရမည်၊ ဘာကိုမေ့ရမည်၊ ဘာကို output ထုတ်ရမည်ကို တစ်ဆင့်စီတွင် သင်ယူသော built-in "gate" များပါဝင်သည် — RNN ရိုးရိုး၏ ကြာမြင့်စွာ ဖြစ်ပျက်ခဲ့သည့်အရာများကို မေ့တတ်သော ဂုဏ်သတ္တိကို ဖြေရှင်းပေးသည်။',
      'Cell state မှတဆင့် အချက်အလက်စီးဆင်းမှုကို ထိန်းချုပ်သည့် forget/input/output gate (LSTM) သို့ reset/update gate (GRU) များ မိတ်ဆက်ပေးပြီး၊ vanishing gradient ကို လျော့ချကာ long-range dependency များကို သင်ယူနိုင်စေသည်။'
    ),
    advantages: blSame('Best-in-class for complex nonlinear + seasonal patterns given enough data; handles multivariate inputs well; frequently the most accurate on gold-price studies.', 'ဒေတာလုံလောက်ပါက ရှုပ်ထွေးသော nonlinear + seasonal pattern များအတွက် အကောင်းဆုံးအတန်း; multivariate input များကို ကောင်းစွာကိုင်တွယ်; ရွှေစျေးနှုန်း လေ့လာမှုများတွင် အတိကျဆုံးဖြစ်လေ့ရှိသည်။'),
    weaknesses: blSame('Needs large data and careful architecture tuning; long training time; "black box".', 'ဒေတာကြီးမားစွာနှင့် ဂရုတစိုက် architecture tuning လိုအပ်; လေ့ကျင့်ချိန် ကြာမြင့်; "black box" ဖြစ်သည်။'),
    usageAreas: blSame('Gold price, crypto, multivariate macro-financial series with rich history.', 'ရွှေစျေးနှုန်း၊ crypto၊ သမိုင်းကြောင်းကြွယ်ဝသော multivariate macro-financial series များ။'),
    compass: { interpretability: 1, dataHunger: 5, nonlinearity: 5 },
  },
  {
    id: 'cnn', ch: 8, name: 'CNN (1D, for sequences)', short: 'sliding local filters',
    howItWorks: bl(
      'Slides small pattern-detecting filters along the sequence, each learning to recognize a specific local shape (like a sudden spike or a specific short pattern) wherever it appears.',
      'Applies learned 1D convolutional filters (kernel size k) that slide across the time axis, detecting translation-invariant local motifs; stacked layers build increasingly abstract, longer-range features.',
      'Sequence တစ်လျှောက် pattern-ဖော်ထုတ်သော filter သေးငယ်များကို ရွေ့လျားစေပြီး၊ တစ်ခုစီက ဘယ်နေရာမှာ ပေါ်လာလာ တိကျသော local ပုံသဏ္ဍာန် (ရုတ်တရက်ြမင့်တက်ခြင်း (သို့) တိကျသော pattern တို) ကို မှတ်မိအောင် သင်ယူသည်။',
      'အချိန်ဝင်ရိုးတစ်လျှောက် ရွေ့လျားသော သင်ယူထားသော 1D convolutional filter (kernel size k) များကို အသုံးချပြီး၊ translation-invariant local motif များကို ဖော်ထုတ်သည်; layer များစုပုံလာလေ ပိုပြီး abstract၊ ခရီးရှည် feature များ တည်ဆောက်လေဖြစ်သည်။'
    ),
    advantages: blSame('Good at local pattern/motif detection; parallelizable.', 'local pattern/motif ရှာဖွေမှုတွင် ကောင်းသည်; parallel လုပ်နိုင်သည်။'),
    weaknesses: blSame('Not natively suited to long-range temporal dependency.', 'ခရီးရှည် temporal dependency အတွက် သဘာဝအားဖြင့် မသင့်လျော်ပါ။'),
    usageAreas: blSame('Feature extraction step before an LSTM/Transformer (hybrid CNN-LSTM).', 'LSTM/Transformer မတိုင်မီ feature ထုတ်ယူခြင်း အဆင့် (hybrid CNN-LSTM)။'),
    compass: { interpretability: 1, dataHunger: 4, nonlinearity: 5 },
  },
  {
    id: 'transformer', ch: 8, name: 'Transformer / TFT', short: 'attention over all timesteps',
    howItWorks: bl(
      'Instead of reading step-by-step like an RNN, looks at the entire sequence at once and learns which past moments matter most for right now — those "attention weights" can even be inspected to see what the model focused on.',
      'Self-attention computes weighted combinations of all timesteps simultaneously (Attention(Q,K,V) = softmax(QKᵀ/√d)V); the Temporal Fusion Transformer additionally separates static, known-future, and observed inputs with variable-selection networks.',
      'RNN ကဲ့သို့ တစ်ဆင့်ချင်းစီ မဖတ်ဘဲ Sequence တစ်ခုလုံးကို တစ်ပြိုင်နက်ကြည့်ပြီး ဘယ်အတိတ်အချိန်များက ယခုအတွက် အရေးကြီးဆုံးလဲ ဆိုတာ သင်ယူသည် — ထို "attention weight" များကို မော်ဒယ်က ဘာကို အာရုံစိုက်ခဲ့လဲ ကြည့်ရှုနိုင်သည်။',
      'Timestep အားလုံးကို တစ်ပြိုင်နက် weight ချထားသော ပေါင်းစပ်မှု တွက်ချက်သည့် Self-attention (Attention(Q,K,V) = softmax(QKᵀ/√d)V); Temporal Fusion Transformer သည် static, known-future, observed input များကို variable-selection network များဖြင့် ထပ်မံခွဲခြားသည်။'
    ),
    advantages: blSame('Attention weights are interpretable (shows which past periods/features mattered); handles static + known-future + observed inputs together; highly parallelizable.', 'attention weight များကို နားလည်နိုင် (ဘယ်အတိတ်ကာလ/feature များ အရေးကြီးလဲ ပြသသည်); static + known-future + observed input များကို အတူတကွ ကိုင်တွယ်; parallel လုပ်နိုင်စွမ်းမြင့်သည်။'),
    weaknesses: blSame('Data-hungry, compute-expensive; recent studies show it does not consistently beat simpler LSTM/BiLSTM baselines despite the added complexity.', 'ဒေတာစားလွန်း၊ တွက်ချက်မှုကုန်ကျစရိတ်များ; ရှုပ်ထွေးမှုတိုးပါသော်လည်း ရိုးရှင်းသော LSTM/BiLSTM baseline များထက် စဉ်ဆက်မပြတ် သာလွန်ကြောင်း မကြာသေးမီလေ့လာမှုများက ပြသသည်။'),
    usageAreas: blSame('Multi-horizon forecasts needing built-in interpretability (e.g., "why did the 6-month gold forecast move?").', 'built-in interpretability လိုအပ်သော multi-horizon forecast များ (ဥပမာ "၆လ ရွှေခန့်မှန်းချက် ဘာကြောင့်ပြောင်းလဲ?")။'),
    compass: { interpretability: 2, dataHunger: 5, nonlinearity: 5 },
  },
  // 3.9 Bayesian Machine Learning
  {
    id: 'gp', ch: 9, name: 'Gaussian Processes', short: 'distribution over functions',
    howItWorks: bl(
      'Instead of fitting one curve, keeps an entire family of plausible curves through the data, weighted by how well each fits — this naturally gives an honest, wider uncertainty band far from any observed data.',
      'Places a prior directly over functions, specified by a mean function and covariance kernel k(x,x\'); posterior predictive is Gaussian with closed-form mean and variance conditioned on observed points.',
      'မျဉ်းကွေးတစ်ခုတည်း fit လုပ်မည့်အစား ဒေတာကို ဖြတ်သန်းနိုင်သော ဖြစ်နိုင်ချေရှိသော မျဉ်းကွေးမိသားစုတစ်ခုလုံးကို ၎င်းတို့ တစ်ခုစီ ဘယ်လောက်ကိုက်ညီသလဲ ဆိုသည့် weight ဖြင့် ထိန်းသိမ်းထားသည် — ၎င်းက တွေ့ရှိထားသော ဒေတာနှင့် ဝေးလေ ရိုးသားပြီး ကျယ်ပြန့်လေ မသေချာမှုအပိုင်းအခြားကို သဘာဝကျစွာ ပေးသည်။',
      'Mean function နှင့် covariance kernel k(x,x\') ဖြင့် သတ်မှတ်ထားသော function များပေါ်တွင် တိုက်ရိုက် prior တစ်ခု ချထားသည်; posterior predictive သည် တွေ့ရှိထားသော point များပေါ်မူတည်၍ closed-form mean နှင့် variance ရှိသော Gaussian ဖြစ်သည်။'
    ),
    advantages: blSame('Closed-form uncertainty; fits a huge range of nonlinear functions; excellent for small data.', 'closed-form မသေချာမှု; nonlinear function အမျိုးမျိုးစွာကို fit လုပ်နိုင်; ဒေတာအနည်းငယ်အတွက် ထူးချွန်သည်။'),
    weaknesses: blSame('Computationally expensive at scale (cubic in data size).', 'scale ကြီးလာလျှင် တွက်ချက်မှု ကုန်ကျစရိတ်များသည် (ဒေတာအရွယ်အစား၏ cubic)။'),
    usageAreas: blSame('Small-sample forecasting with rigorous uncertainty bands.', 'တင်းကျပ်သော မသေချာမှုအပိုင်းအခြားနှင့် ဒေတာနမူနာငယ် forecasting။'),
    compass: { interpretability: 3, dataHunger: 1, nonlinearity: 4 },
  },
  {
    id: 'bstsbnn', ch: 9, name: 'Bayesian Structural Time Series / Bayesian NNs', short: 'posterior over states/weights',
    howItWorks: bl(
      'Treats the unknown quantities (like trend level, seasonal effect, or a neural network\'s weights) as uncertain from the start, and updates a full range of plausible values as data arrives — rather than settling on one single best-fit answer.',
      'BSTS decomposes a series into latent state components (trend, seasonal, regression) estimated via Kalman filtering/Gibbs sampling; Bayesian NNs place priors over weights and approximate the posterior via variational inference or MCMC, yielding calibrated predictive uncertainty.',
      'မသိသေးသော ပမာဏများ (trend level, seasonal effect, သို့ neural network weight များကဲ့သို့) ကို အစမှစပြီး မသေချာဟု သတ်မှတ်ပြီး ဒေတာရောက်ရှိလာသည်နှင့်အမျှ ဖြစ်နိုင်ချေရှိသော တန်ဖိုးအပိုင်းအခြားတစ်ခုလုံးကို update ပြုသည် — အကောင်းဆုံး fit တစ်ခုတည်း ဆုံးဖြတ်မည့်အစား ဖြစ်သည်။',
      'BSTS သည် series ကို Kalman filtering/Gibbs sampling ဖြင့် ခန့်မှန်းထားသော latent state component (trend, seasonal, regression) များအဖြစ် ခွဲခြမ်းသည်; Bayesian NN များသည် weight များပေါ်တွင် prior များချထားပြီး variational inference သို့ MCMC ဖြင့် posterior ကို ခန့်မှန်းတွက်ချက်သည်။'
    ),
    advantages: blSame('Full posterior uncertainty, not just point estimates; mitigates overfitting by treating weights as distributions; superior in studies on both accuracy and uncertainty quantification over long horizons.', 'point estimate သာမက posterior မသေချာမှု အပြည့်အစုံ; weight များကို distribution အဖြစ်သတ်မှတ်ခြင်းဖြင့် overfitting လျှော့ချ; ခရီးရှည် horizon များတွင် တိကျမှုနှင့် မသေချာမှု quantification နှစ်ခုစလုံးတွင် သာလွန်ကြောင်း လေ့လာမှုများက ပြသသည်။'),
    weaknesses: blSame('Slower to fit (sampling-based); more complex to implement.', 'fit လုပ်ရန် နှေး (sampling-based); အကောင်အထည်ဖော်ရန် ပိုရှုပ်ထွေးသည်။'),
    usageAreas: blSame('The ML-side sibling of frequentist confidence intervals (Stats mode\'s ci_mean_t) — see the Stats ↔ ML Bridge for the same-numbers, different-meaning comparison.', 'Frequentist confidence interval (Stats mode ၏ ci_mean_t) ၏ ML-ဘက် ညီအစ်ကို — ဂဏန်းတူတူ၊ အဓိပ္ပာယ်ကွဲပြားမှု နှိုင်းယှဉ်ချက်အတွက် Stats ↔ ML Bridge ကိုကြည့်ပါ။'),
    compass: { interpretability: 3, dataHunger: 3, nonlinearity: 4 },
  },
  // 3.10 Reinforcement Learning
  {
    id: 'qlearning', ch: 10, name: 'Q-Learning', short: 'learn action values',
    howItWorks: bl(
      'Learns, through trial and error, a running scorecard of "how good is each possible action in each situation," and always picks the highest-scoring action once that scorecard is trustworthy.',
      'Learns an action-value function Q(s,a) via the Bellman update Q(s,a) ← Q(s,a) + α[r + γ·maxₐ\'Q(s\',a\') − Q(s,a)], converging to the optimal policy under sufficient exploration.',
      'စမ်းသပ်မှုနှင့် အမှားများမှတဆင့် "အခြေအနေတစ်ခုစီတွင် ဖြစ်နိုင်သော လုပ်ဆောင်ချက်တစ်ခုစီ ဘယ်လောက်ကောင်းသလဲ" ဆိုသည့် ဆက်တိုက် အမှတ်ပေးစာရင်းကို သင်ယူပြီး၊ ထိုစာရင်းကို ယုံကြည်ရလာသောအခါ အမှတ်အမြင့်ဆုံး လုပ်ဆောင်ချက်ကို အမြဲရွေးချယ်သည်။',
      'Bellman update Q(s,a) ← Q(s,a) + α[r + γ·maxₐ\'Q(s\',a\') − Q(s,a)] မှတဆင့် action-value function Q(s,a) ကို သင်ယူပြီး၊ လုံလောက်သော exploration အောက်တွင် optimal policy သို့ ပေါင်းစည်းသည်။'
    ),
    advantages: blSame('Learns a full decision policy, not just a forecast; optimizes long-term reward; adapts continuously; can embed risk penalties directly.', 'forecast တစ်ခုတည်းမက ဆုံးဖြတ်ချက် policy အပြည့်အစုံကို သင်ယူ; ရေရှည် ဆုလာဘ်ကို optimize ပြု; စဉ်ဆက်မပြတ် ချိန်ညှိ; အန္တရာယ်ပယ်ဒဏ်ကို တိုက်ရိုက် ထည့်သွင်းနိုင်သည်။'),
    weaknesses: blSame('High data noise in finance is easily mistaken for signal; markets are non-reproducible (only one historical path exists); unpredictable/unstable in live deployment; needs large data.', 'ဘဏ္ဍာရေးတွင် ဒေတာ noise မြင့်မားမှုကို signal ဟု အလွယ်တကူ မှားထင်တတ်; စျေးကွက်များသည် ပြန်လည်မထုတ်လုပ်နိုင် (သမိုင်းလမ်းကြောင်း တစ်ခုသာရှိ); live deployment တွင် ခန့်မှန်းရခက်/မတည်ငြိမ်; ဒေတာကြီးမားစွာလိုအပ်သည်။'),
    usageAreas: blSame('Algorithmic trading strategy simulators, portfolio-allocation teaching modules.', 'algorithmic trading strategy simulator များ၊ portfolio-allocation သင်ကြားရေး module များ။'),
    compass: { interpretability: 2, dataHunger: 5, nonlinearity: 4 },
  },
  {
    id: 'actorcritic', ch: 10, name: 'Actor-Critic', short: 'policy + value together',
    howItWorks: bl(
      'Runs two learners side by side: an "actor" that directly decides what action to take, and a "critic" that scores how good that decision turned out — the critic\'s feedback trains the actor to keep improving.',
      'Combines a parameterized policy πθ(a|s) (actor, updated via policy gradient) with a learned value function Vφ(s) or Qφ(s,a) (critic) that reduces variance in the policy gradient estimate.',
      'Learner နှစ်ခုကို တွဲဖက်ပြေးဆွဲသည်: လုပ်ဆောင်ချက် တိုက်ရိုက်ဆုံးဖြတ်ပေးသော "actor" နှင့် ထိုဆုံးဖြတ်ချက် ဘယ်လောက်ကောင်းသလဲ အမှတ်ပေးသော "critic" — critic ၏ တုံ့ပြန်မှုက actor ကို စဉ်ဆက်မပြတ် တိုးတက်စေရန် လေ့ကျင့်ပေးသည်။',
      'Policy gradient ဖြင့် update ပြုသော parameterized policy πθ(a|s) (actor) ကို policy gradient estimate ၏ variance ကို လျှော့ချပေးမည့် သင်ယူထားသော value function Vφ(s) (critic) နှင့် ပေါင်းစပ်သည်။'
    ),
    advantages: blSame('Learns a full decision policy with lower-variance updates than pure policy-gradient methods; adapts continuously; can embed risk penalties directly.', 'ကွဲပြားမှုနည်းသော update ဖြင့် ဆုံးဖြတ်ချက် policy အပြည့်အစုံကို သင်ယူ; စဉ်ဆက်မပြတ် ချိန်ညှိ; အန္တရာယ်ပယ်ဒဏ်ကို တိုက်ရိုက် ထည့်သွင်းနိုင်သည်။'),
    weaknesses: blSame('High data noise in finance is easily mistaken for signal; markets are non-reproducible; unpredictable/unstable in live deployment; needs large data.', 'ဘဏ္ဍာရေးတွင် ဒေတာ noise မြင့်မားမှုကို signal ဟု အလွယ်တကူ မှားထင်တတ်; စျေးကွက်များသည် ပြန်လည်မထုတ်လုပ်နိုင်; live deployment တွင် ခန့်မှန်းရခက်/မတည်ငြိမ်; ဒေတာကြီးမားစွာလိုအပ်သည်။'),
    usageAreas: blSame('Algorithmic trading strategy simulators, portfolio-allocation teaching modules.', 'algorithmic trading strategy simulator များ၊ portfolio-allocation သင်ကြားရေး module များ။'),
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
export const MM_LEGEND_TITLE = blSame('Connections', 'ဆက်စပ်မှုများ');
export const MM_LEGEND_EXTENDS = blSame('Extends (same family)', 'ဆက်ခံသည် (မိသားစုတူ)');
export const MM_LEGEND_COMPETES = blSame('Competes with', 'ယှဉ်ပြိုင်သည်');
export const MM_LEGEND_COMBINES = blSame('Combines with', 'ပေါင်းစပ်သည်');

export const MM_EDGE_TYPE_LABEL = {
  extends: blSame('Extends', 'ဆက်ခံသည်'),
  competes: blSame('Competes with', 'ယှဉ်ပြိုင်သည်'),
  combines: blSame('Combines with', 'ပေါင်းစပ်သည်'),
};

export const MM_HOW_IT_WORKS_LBL = blSame('How it works', 'ဘယ်လိုအလုပ်လုပ်လဲ');
export const MM_ADVANTAGES_LBL = blSame('Advantages', 'အားသာချက်များ');
export const MM_WEAKNESSES_LBL = blSame('Weaknesses', 'အားနည်းချက်များ');
export const MM_USAGE_AREAS_LBL = blSame('Best usage areas', 'သင့်လျော်ဆုံး အသုံးပြုမှုနယ်ပယ်များ');
export const MM_COMPASS_LBL = blSame('Model selection compass', 'Model ရွေးချယ်ရေး Compass');
export const MM_CONNECTIONS_LBL = blSame('Connections', 'ဆက်စပ်မှုများ');

// CompassMeter.jsx's three axes (research doc §4).
export const COMPASS_AXES = [
  {
    key: 'interpretability',
    label: blSame('Interpretability', 'ရှင်းပြနိုင်မှု'),
    hint: blSame('High = easy to explain a single prediction', 'မြင့်လျှင် = ခန့်မှန်းချက်တစ်ခုကို ရှင်းပြရလွယ်ကူသည်'),
  },
  {
    key: 'dataHunger',
    label: blSame('Data hunger', 'ဒေတာ လိုအင်'),
    hint: blSame('High = needs years of history to work well', 'မြင့်လျှင် = ကောင်းစွာအလုပ်လုပ်ရန် နှစ်ပေါင်းများစွာ history လိုအပ်သည်'),
  },
  {
    key: 'nonlinearity',
    label: blSame('Nonlinearity capture', 'Nonlinearity ဖမ်းယူနိုင်မှု'),
    hint: blSame('High = can learn complex, curved relationships', 'မြင့်လျှင် = ရှုပ်ထွေး၊ ကွေးသော ဆက်နွယ်မှုများကို သင်ယူနိုင်သည်'),
  },
];
