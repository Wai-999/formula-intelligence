import { bl, blSame } from '../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §5.
export const METRICS_INTRO = bl(
  'Every model needs a score. These five are the most common — pick the fitted model from the playground above and see how each one scores it differently.',
  'MAE/RMSE/MAPE/R²/AIC/BIC computed against the currently-selected playground fit, illustrating that "which metric" is itself a modeling choice.',
  'မော်ဒယ်တိုင်းအတွက် အမှတ်ပေးမှုတစ်ခု လိုအပ်သည်။ ဒါငါးမျိုးသည် အသုံးအများဆုံးဖြစ်သည် — အထက်ပါ playground မှ fit လုပ်ထားသော မော်ဒယ်ကို ရွေးချယ်ပြီး တစ်ခုစီက ဘယ်လို မတူညီစွာ အမှတ်ပေးသလဲ ကြည့်ပါ။',
  'လက်ရှိရွေးချယ်ထားသော playground fit အပေါ် MAE/RMSE/MAPE/R²/AIC/BIC ကို တွက်ချက်ပြီး၊ "ဘယ် metric သုံးမလဲ" ဆိုသည်ကိုယ်တိုင်ကလည်း မော်ဒယ်ရွေးချယ်မှုတစ်ခုဖြစ်ကြောင်း ပြသသည်။'
);

export const METRIC_DEFS = [
  { key: 'mae', label: 'MAE', name: bl('Average absolute error', 'Mean Absolute Error', 'ပျမ်းမျှ အကြွင်းမဲ့အမှား', 'Mean Absolute Error'), note: blSame('Robust to outliers.', 'outlier များကို ကြံ့ခိုင်စွာ ခံနိုင်သည်။') },
  { key: 'rmse', label: 'RMSE', name: bl('Root mean squared error', 'Root Mean Squared Error', 'Root mean squared error', 'Root Mean Squared Error'), note: blSame('Penalizes large misses harder — good when big misses (e.g., missing a gold price spike) are especially costly.', 'အမှားကြီးများကို ပိုပြင်းထန်စွာ ပြစ်ဒဏ်ပေးသည် — ရွှေစျေးနှုန်း ရုတ်တရက်မြင့်တက်မှုကို လွတ်သွားခြင်းကဲ့သို့ အမှားကြီးများ အထူးကုန်ကျစရိတ်များသောအခါ ကောင်းသည်။') },
  { key: 'mape', label: 'MAPE', name: bl('Average % error', 'Mean Absolute Percentage Error', 'ပျမ်းမျှ % အမှား', 'Mean Absolute Percentage Error'), note: blSame('Intuitive for non-technical stakeholders; unstable near zero values.', 'နည်းပညာမဟုတ်သူများအတွက် နားလည်လွယ်; သုညနှင့်နီးသောတန်ဖိုးများတွင် မတည်ငြိမ်သည်။') },
  { key: 'r2', label: 'R²', name: bl('Variance explained', 'Coefficient of Determination', 'ရှင်းပြနိုင်သော အပြောင်းအလဲ', 'Coefficient of Determination'), note: blSame('Goodness-of-fit summary.', 'fit ကောင်းမှု အနှစ်ချုပ်။') },
  { key: 'aic', label: 'AIC', name: bl('Penalized fit score', 'Akaike Information Criterion', 'ပယ်ဒဏ်ပါ fit ရမှတ်', 'Akaike Information Criterion'), note: blSame('Penalized likelihood for model comparison.', 'မော်ဒယ်နှိုင်းယှဉ်ရန် ပယ်ဒဏ်ပါ likelihood။') },
  { key: 'bic', label: 'BIC', name: bl('Stricter penalized fit score', 'Bayesian Information Criterion', 'ပိုတင်းကျပ်သော ပယ်ဒဏ်ပါ fit ရမှတ်', 'Bayesian Information Criterion'), note: blSame('Penalizes complexity more heavily — favors simpler models on small/medium samples.', 'ရှုပ်ထွေးမှုကို ပိုပြင်းထန်စွာ ပယ်ဒဏ်ပေးသည် — နမူနာသေး/အလယ်အလတ်တွင် ရိုးရှင်းသောမော်ဒယ်များကို ပိုနှစ်သက်သည်။') },
];

// Constructive Thought Loop on the backtest scrubber/play control (D.2) —
// applies to every driver, not only "showcase" ones like this animation.
export const EV_BACKTEST_PREDICT_Q = blSame(
  'Before you press play: which split below is actually safe to trust for a time-series forecast?',
  'Play မနှိပ်ခင်: အောက်ပါ split ထဲက အချိန်စီးရီး forecast အတွက် တကယ်ယုံကြည်စိတ်ချရသည့်တစ်ခုက ဘယ်ဟာလဲ?'
);
export const EV_BACKTEST_PREDICT_NAIVE = blSame(
  'The naive random split — every point still comes from the same dataset either way',
  'Naive random split — ဘယ်လိုပဲဖြစ်ဖြစ် အမှတ်တိုင်းက dataset တစ်ခုတည်းကနေပဲ ဖြစ်သည်'
);
export const EV_BACKTEST_PREDICT_WF = blSame(
  "Walk-forward — it never trains on a point time-stamped after the one it's being tested on",
  'Walk-forward — စမ်းသပ်နေတဲ့အချိန်ထက်နောက်ကျတဲ့ အမှတ်ပေါ်တွင် ဘယ်တော့မှ train မလုပ်ပါ'
);
export const EV_BACKTEST_PREDICT_EXPLAIN = blSame(
  "Scrub the walk-forward row and watch its train region only ever grow forward from the left — it can never include a cell to the right of the current test window. The naive split above has no such rule: some of its blue \"train\" cells sit chronologically after some of its orange \"test\" cells, meaning the model would have trained on the future before being tested on the past.",
  'Walk-forward row ကို scrub လုပ်ပြီး ၎င်း၏ train region သည် ဘယ်ဘက်မှ ရှေ့သို့သာ ဆက်ကြီးလာသည်ကို ကြည့်ပါ — လက်ရှိ test window ၏ ညာဘက်ရှိ cell တစ်ခုကိုမှ ဘယ်တော့မှ မထည့်နိုင်ပါ။ အထက်ပါ naive split တွင် ထိုစည်းမျဉ်း မရှိပါ — ၎င်း၏ အပြာရောင် "train" cell အချို့သည် အချို့သော လိမ္မော်ရောင် "test" cell များ၏ နောက်ပိုင်းတွင် အချိန်အလိုက် ရှိနေသည်၊ ဆိုလိုသည်မှာ မော်ဒယ်သည် အတိတ်ကို စမ်းသပ်ခြင်းမပြုမီ အနာဂတ်ကို train လုပ်ခဲ့မည်ဖြစ်သည်။'
);

// Constructive Thought Loop directly on the Metrics panel's own model/
// complexity controls (D.2) — not just the conceptual Spark-layer predict.
export const EV_METRICS_PREDICT_Q = blSame(
  'Switch models and drag complexity around. As the fit gets worse and validation errors get more erratic, what happens to each metric\'s ± margin?',
  'Model ပြောင်းပြီး complexity ကို ဆွဲပါ။ fit ပိုဆိုးလာပြီး validation error ပို မမှန်မကန်ဖြစ်လာသည်နှင့်အမျှ metric တစ်ခုစီ၏ ± margin ကို ဘာဖြစ်လာမလဲ?'
);
export const EV_METRICS_PREDICT_SHRINKS = blSame(
  'The margin shrinks — more complexity always means a more precise estimate',
  'margin ကျဉ်းလာသည် — complexity ပိုများလေ ခန့်မှန်းချက် ပိုတိကျလေ'
);
export const EV_METRICS_PREDICT_WIDENS = blSame(
  'The margin can widen — more erratic errors mean this particular estimate is less trustworthy',
  'margin ကျယ်လာနိုင်သည် — error ပို မမှန်မကန်ဖြစ်လေ ဒီခန့်မှန်းချက် ယုံကြည်ရမှုနည်းလေ'
);
export const EV_METRICS_PREDICT_EXPLAIN = blSame(
  'Push complexity high enough to overfit and watch RMSE/MAE\'s margin move — an erratic, overfit model doesn\'t just score worse on average, its score is also less reliable point-to-point, and the margin is built to say so.',
  'Overfit ဖြစ်အောင် complexity ကို လုံလောက်စွာ မြှင့်ပြီး RMSE/MAE ၏ margin ရွေ့သွားပုံကို ကြည့်ပါ — မမှန်မကန်ဖြစ်၊ overfit ဖြစ်တဲ့ မော်ဒယ်တစ်ခုသည် ပျမ်းမျှအားဖြင့် ပိုဆိုးရုံသာမက၊ ၎င်း၏ score သည်လည်း အမှတ်တစ်ခုချင်းအလိုက် ပိုယုံကြည်ရမှုနည်းလာပြီး margin က ဒါကို ဖော်ပြရန် တည်ဆောက်ထားခြင်းဖြစ်သည်။'
);

export const BACKTEST_INTRO = bl(
  'Time series can\'t be shuffled. Watch why: the naive split peeks at the future during training, while walk-forward validation never does.',
  'Walk-forward (rolling-origin) backtesting repeatedly trains on data up to time t and tests on t+1…t+h, rolling forward — contrasted against a single random train/test split, which leaks future information into training for time-indexed data.',
  'အချိန်စီးရီးကို shuffle မလုပ်နိုင်ပါ။ အကြောင်းရင်းကို ကြည့်ပါ: naive split က training အတွင်း အနာဂတ်ကို ချောင်းကြည့်နေသော်လည်း walk-forward validation က ဘယ်တော့မှ မလုပ်ပါ။',
  'Walk-forward (rolling-origin) backtesting သည် အချိန် t အထိ ဒေတာပေါ်တွင် ဆက်တိုက် train လုပ်ပြီး t+1…t+h ပေါ်တွင် test လုပ်ကာ ရှေ့သို့ ရွေ့လျားသည် — အချိန်-အညွှန်းဒေတာအတွက် training ထဲသို့ အနာဂတ်အချက်အလက် ယိုဖိတ်စေသော random train/test split တစ်ခုတည်းနှင့် နှိုင်းယှဉ်ထားသည်။'
);

export const SHAP_INTRO = bl(
  'This chart answers: "which macro variables drive the gold forecast overall?" — averaged across every prediction the model makes.',
  'SHAP (Shapley values): consistent, theoretically grounded, global feature importance across the whole model.',
  'ဒီဇယားက ဖြေတဲ့မေးခွန်းက: "ဘယ် macro variable တွေက ရွှေခန့်မှန်းချက်ကို အားလုံးသုံးရင် ဘယ်လိုတွန်းအားပေးလဲ" — မော်ဒယ်လုပ်တဲ့ ခန့်မှန်းချက်တိုင်းကို ပျမ်းမျှထားသည်။',
  'SHAP (Shapley value) — မော်ဒယ်တစ်ခုလုံးအတွက် တသမတ်တည်း၊ သီအိုရီအခြေခံရှိသော global feature အရေးပါမှု။'
);

// Static, precomputed — no live SHAP/LIME library run (Module 5's own spec
// explicitly allows a faithful approximation). Feature set matches Module
// 6's gold drivers so this previews that lab rather than using a disjoint
// example.
export const SHAP_FEATURES = [
  { key: 'realYields', label: blSame('Real yields', 'Real yields'), importance: 0.34 },
  { key: 'dxy', label: blSame('US Dollar Index (DXY)', 'US Dollar Index (DXY)'), importance: 0.27 },
  { key: 'geoRisk', label: blSame('Geopolitical risk', 'Geopolitical risk'), importance: 0.19 },
  { key: 'cbDemand', label: blSame('Central bank demand', 'Central bank demand'), importance: 0.13 },
  { key: 'inflation', label: blSame('Inflation / Fed path', 'Inflation / Fed path'), importance: 0.07 },
];

export const LIME_INTRO = bl(
  'This view answers a different question: "why did the model predict a spike this particular month?" — for one single prediction, not the model overall.',
  'LIME: fast, local explanation of one specific prediction, decomposed as a base value plus each feature\'s individual push.',
  'ဒီမြင်ကွင်းက မတူညီသော မေးခွန်းကို ဖြေသည်: "ဒီလကို ဘာကြောင့် မော်ဒယ်က ခန့်မှန်းချက် ရုတ်တရက်မြင့်တက်မှုကို ခန့်မှန်းခဲ့သလဲ" — ခန့်မှန်းချက်တစ်ခုတည်းအတွက်၊ မော်ဒယ်တစ်ခုလုံးအတွက် မဟုတ်ပါ။',
  'LIME — ခန့်မှန်းချက်တစ်ခုတည်း၏ လျင်မြန်သော local ရှင်းလင်းချက်၊ base value တစ်ခုအပေါ် feature တစ်ခုစီ၏ တစ်ဦးချင်း တွန်းအားအဖြစ် ခွဲခြမ်းထားသည်။'
);

export const LIME_EXAMPLE = {
  baseValue: 4020,
  finalPrediction: 4287,
  contributions: [
    { key: 'geoRisk', label: blSame('Geopolitical risk spike', 'ပထဝီရေးအန္တရာယ် ရုတ်တရက်မြင့်တက်မှု'), value: 145 },
    { key: 'cbDemand', label: blSame('Central bank buying resumed', 'ဗဟိုဘဏ် ဝယ်ယူမှု ပြန်စတင်'), value: 88 },
    { key: 'realYields', label: blSame('Real yields ticked up slightly', 'Real yields အနည်းငယ် မြင့်တက်'), value: -42 },
    { key: 'dxy', label: blSame('Dollar roughly flat', 'ဒေါ်လာ အခြေခံအားဖြင့် တည်ငြိမ်'), value: 6 },
    { key: 'inflation', label: blSame('Inflation in line with expectations', 'ငွေကြေးဖောင်းပွမှု မျှော်မှန်းချက်နှင့်ကိုက်ညီ'), value: 70 },
  ],
};

export const DRIFT_INTRO = bl(
  'A model that was accurate last year can quietly go wrong this year if the relationship it learned stops holding. Press play and watch the error spike the moment the regime shifts.',
  'Concept drift: the relationship between features and target changes over time (e.g., gold\'s relationship to real yields shifts after a regime change like sustained central-bank buying). Production systems track feature/prediction distributions against a training-time baseline and trigger retraining when drift crosses a threshold.',
  'မနှစ်ကမှန်ခဲ့သော မော်ဒယ်တစ်ခုသည် သင်ယူထားသည့် ဆက်စပ်မှု ရပ်တန့်သွားလျှင် ယခုနှစ်တွင် တိတ်တဆိတ် မှားလာနိုင်သည်။ Play နှိပ်ပြီး regime ပြောင်းလဲသည့်အခိုက် အမှား ရုတ်တရက်မြင့်တက်ပုံကို ကြည့်ပါ။',
  'Concept drift — feature များနှင့် target ကြား ဆက်စပ်မှုသည် အချိန်နှင့်အမျှ ပြောင်းလဲသည် (ဥပမာ ရွှေ၏ real yields နှင့် ဆက်စပ်မှုသည် ဗဟိုဘဏ် အဆက်မပြတ် ဝယ်ယူမှုကဲ့သို့ regime ပြောင်းလဲမှုနောက် ပြောင်းသွားသည်)။ Production system များသည် feature/prediction distribution ကို training-time baseline နှင့် နှိုင်းယှဉ်စောင့်ကြည့်ပြီး drift သည် threshold ကျော်လွန်လျှင် ပြန်လေ့ကျင့်ရန် လှုံ့ဆော်သည်။'
);

// Module 11 audit: page-chrome strings (titles/labels/legend/buttons) that
// were previously hardcoded English across the five Evaluation components.
export const EV_METRICS_TITLE = blSame('Evaluation Metrics', 'အကဲဖြတ်မှု Metrics');
export const EV_POLY_BTN = blSame('Polynomial', 'Polynomial');
export const EV_TREE_BTN = blSame('Decision Tree', 'Decision Tree');
export const EV_COMPLEXITY_LBL = blSame('Complexity', 'ရှုပ်ထွေးမှု');

export const EV_WALKFORWARD_TITLE = blSame('Walk-Forward vs. Naive Split', 'Walk-Forward နှင့် Naive Split နှိုင်းယှဉ်ချက်');
export const EV_NAIVE_SPLIT_LBL = blSame('Naive random split', 'Naive ကျပန်း split');
export const EV_NAIVE_SPLIT_SUB = blSame(
  'fixed — notice train (blue) cells appearing after test (amber) cells',
  'fixed — train (အပြာရောင်) cell များသည် test (အဝါရောင်) cell များနောက်တွင် ပေါ်လာသည်ကို သတိပြုပါ'
);
export const EV_WALKFORWARD_LBL = blSame('Walk-forward backtest', 'Walk-forward backtest');
// {origin} and {steps} are replaced with live numbers by the component —
// kept as a full-sentence template (not concatenated fragments) so Burmese
// word order stays grammatical.
export const EV_WF_SUB_TEMPLATE = blSame(
  'origin t={origin} — train up to origin, test the next {steps} steps, then roll forward',
  'origin t={origin} — origin အထိ train လုပ်ပြီး နောက် {steps} steps ကို test လုပ်သည်, ပြီးရင် ရှေ့ဆက်ရွှေ့သည်'
);
export const EV_PLAY_BTN = blSame('Play', 'ဖွင့်ပါ');
export const EV_PAUSE_BTN = blSame('Pause', 'ခဏရပ်ပါ');
export const EV_RESET_BTN = blSame('Reset', 'ပြန်လည်သတ်မှတ်ပါ');
export const EV_TRAIN_LEGEND = blSame('train', 'train');
export const EV_TEST_LEGEND = blSame('test', 'test');
export const EV_UNUSED_LEGEND = blSame('not yet used', 'မသုံးရသေး');

export const EV_SHAP_TITLE = blSame('Global Feature Importance (SHAP-style)', 'Global Feature အရေးပါမှု (SHAP-style)');
export const EV_LIME_TITLE = blSame('Local Explanation (LIME-style)', 'Local ရှင်းလင်းချက် (LIME-style)');
export const EV_BASE_VALUE_LBL = blSame('Base value (average forecast)', 'အခြေခံတန်ဖိုး (ပျမ်းမျှ ခန့်မှန်းချက်)');
export const EV_THIS_PREDICTION_LBL = blSame('This prediction', 'ဒီခန့်မှန်းချက်');

export const EV_DRIFT_TITLE = blSame('Concept Drift', 'Concept Drift');
export const EV_RETRAIN_THRESHOLD_LBL = blSame('retrain threshold', 'ပြန်လေ့ကျင့်ရန် threshold');
export const EV_REGIME_CHANGE_LBL = blSame('regime change', 'regime ပြောင်းလဲမှု');
export const EV_TIME_PROGRESS_LBL = blSame('Time progress', 'အချိန် တိုးတက်မှု');
export const EV_DRIFT_ALERT = blSame('Drift detected — retrain?', 'Drift တွေ့ရှိသည် — ပြန်လေ့ကျင့်မလား?');
export const EV_DRIFT_OK = blSame('Model tracking within normal error range', 'မော်ဒယ်သည် ပုံမှန် အမှားအကွာအဝေးအတွင်း လိုက်နေသည်');

// Module 5 Learning Design System retrofit: refutes "Exactness" (every
// metric/forecast display shows a margin, never a bare point) and
// "Continuous Learning" (the drift demo), plus one consolidated Depth
// Ladder for the module — see BUILD_LOG.md Module 5 for why one ladder
// covering the whole page rather than four separate ones.
export const EV_LIME_BASE_MARGIN = blSame('± $85 (illustrative)', '± $85 (သရုပ်ဖော်)');
export const EV_LIME_FINAL_MARGIN = blSame('± $110 (illustrative)', '± $110 (သရုပ်ဖော်)');

export const EV_SPARK_ANALOGY = bl(
  "A weather app that says \"73°F\" sounds more confident than one that says \"70–76°F,\" but the second one is the honest one — a single-model forecast has exactly the same hidden range, it's just choosing not to show it.",
  'Every metric and every forecast computed from a finite sample carries sampling uncertainty; reporting only the point estimate discards the single most decision-relevant part of the result.',
  '"73°F" ဟု ပြောသော ရာသီဥတု app တစ်ခုသည် "70–76°F" ဟုပြောသည့်တစ်ခုထက် ပိုယုံကြည်စိတ်ချသည့်အသံ ထွက်သော်လည်း ဒုတိယတစ်ခုက ရိုးသားသော တစ်ခုဖြစ်သည် — model တစ်ခုတည်း၏ forecast တွင် ထိုအတိုင်းအတာ ဝှက်ထားသော range ရှိပြီး ပြသရန်သာ မရွေးချယ်ခြင်းဖြစ်သည်။',
  'ကန့်သတ်ထားသော နမူနာမှ တွက်ချက်ထားသော metric တစ်ခုစီနှင့် forecast တစ်ခုစီတွင် sampling uncertainty ပါဝင်သည်; point estimate တစ်ခုတည်းသာ report ပြုခြင်းသည် ရလဒ်၏ ဆုံးဖြတ်ချက်ချရန် အရေးအကြီးဆုံးအပိုင်းကို စွန့်ပစ်လိုက်ခြင်းဖြစ်သည်။'
);
export const EV_SPARK_PREDICT_Q = blSame(
  'A model reports "RMSE = 1.27" with no margin shown. If you tested it on a different, equally-valid sample of validation data, would you expect to get exactly 1.27 again?',
  'Model တစ်ခုသည် margin မပြသဘဲ "RMSE = 1.27" ဟု report ပြုသည်။ တခြား၊ တန်ဖိုးတူညီသော validation data နမူနာတစ်ခုပေါ်တွင် စမ်းသပ်ခဲ့လျှင် 1.27 အတိအကျ ထပ်ရမည်ဟု မျှော်လင့်ပါသလား?'
);
export const EV_SPARK_PREDICT_YES = blSame('Yes, exactly 1.27 again', 'ဟုတ်သည်၊ 1.27 အတိအကျ ထပ်ရမည်');
export const EV_SPARK_PREDICT_NO = blSame('No — a different sample would give a somewhat different number', 'မဟုတ်ပါ — nn မတူညီသော နမူနာက အနည်းငယ်ကွဲပြားသော ဂဏန်းပေးလိမ့်မည်');

export const EV_FORMALISM_WORKED = bl(
  'Worked example: validation squared errors [1, 9, 4, 1, 25] give mean MSE=8. Their own spread (variance of these five numbers) is large relative to the mean — a coefficient of variation of roughly 1.1 — so the illustrative margin this panel shows is wide, reflecting that one big miss (25) makes this MSE estimate genuinely less stable than five evenly-sized errors would.',
  'margin ≈ value × min(0.4, 0.5×CV), CV = std(squared errors)/mean(squared errors) — a simplified stand-in for a bootstrap confidence interval; the exact multiplier is illustrative, but the underlying relationship (more variable errors → less trustworthy point estimate) is real.',
  'ဖြေရှင်းချက်ဥပမာ: validation squared error [1, 9, 4, 1, 25] သည် mean MSE=8 ပေးသည်။ ၎င်းတို့ကိုယ်ပိုင် ပြန့်ကျဲမှု (ဂဏန်း ငါးလုံး၏ variance) သည် mean နှင့်နှိုင်းယှဉ်လျှင် ကြီးမားသည် — coefficient of variation ခန့်မှန်းအားဖြင့် 1.1 — ဒါကြောင့် ဒီ panel ပြသသော illustrative margin ကျယ်ပြန့်သည်၊ အမှားကြီးတစ်ခု (25) က ဒီ MSE ခန့်မှန်းချက်ကို error ငါးခု အညီအမျှရှိရင်ထက် တကယ်ပင် တည်ငြိမ်မှုနည်းစေကြောင်း ထင်ဟပ်သည်။',
  'margin ≈ value × min(0.4, 0.5×CV), CV = std(squared error)/mean(squared error) — bootstrap confidence interval အတွက် ရိုးရှင်းသော အစားထိုးတစ်ခုဖြစ်သည်; multiplier အတိအကျသည် illustrative ဖြစ်သော်လည်း underlying ဆက်နွယ်မှု (error ပိုပြောင်းလဲလေ point estimate ပိုယုံကြည်ရနည်းလေ) မှာ real ဖြစ်သည်။'
);
export const EV_FORMALISM_FADED = bl(
  'Validation squared errors [4, 5, 4, 5, 4] (very consistent) vs. [1, 1, 1, 1, 21] (one big outlier) both average to MSE=4.4-ish. Step 1 — which set has higher variance? Step 2 — which set\'s MSE estimate should get a wider illustrative margin, and why: _____.',
  'Validation squared errors [4, 5, 4, 5, 4] (very consistent) vs. [1, 1, 1, 1, 21] (one big outlier) both average to MSE=4.4-ish. Step 1 — which set has higher variance? Step 2 — which set\'s MSE estimate should get a wider illustrative margin, and why: _____.',
  'Validation squared error [4, 5, 4, 5, 4] (အလွန်တသမတ်တည်း) vs. [1, 1, 1, 1, 21] (outlier ကြီးတစ်ခု) နှစ်ခုစလုံးသည် MSE=4.4 ခန့် ပျမ်းမျှသည်။ အဆင့် ၁ — ဘယ်အစုက variance ပိုမြင့်သလဲ? အဆင့် ၂ — ဘယ်အစု၏ MSE ခန့်မှန်းချက်က illustrative margin ပိုကျယ်သင့်သလဲ၊ ဘာကြောင့်လဲ: _____။',
  'Validation squared error [4, 5, 4, 5, 4] (အလွန်တသမတ်တည်း) vs. [1, 1, 1, 1, 21] (outlier ကြီးတစ်ခု) နှစ်ခုစလုံးသည် MSE=4.4 ခန့် ပျမ်းမျှသည်။ အဆင့် ၁ — ဘယ်အစုက variance ပိုမြင့်သလဲ? အဆင့် ၂ — ဘယ်အစု၏ MSE ခန့်မှန်းချက်က illustrative margin ပိုကျယ်သင့်သလဲ၊ ဘာကြောင့်လဲ: _____။'
);
export const EV_MECHANISM_NOTE = blSame(
  'You already ran this mechanism — every metric above now carries its own ± margin instead of a bare number, and the drift chart below reacts live as you scrub through time. Scroll back through the panels above and compare a metric with a wide margin against one with a narrow one.',
  'Mechanism ကို သင်တကယ် run လုပ်ပြီးသားပါ — အထက်ပါ metric တိုင်းသည် ယခု ဂဏန်းသက်သက်အစား ကိုယ်ပိုင် ± margin ပါလာသည်၊ အောက်ပါ drift chart သည် အချိန်ကို scrub လုပ်သည်နှင့်အမျှ live တုံ့ပြန်သည်။ အထက်ပါ panel များကို ပြန်လှိမ့်ပြီး margin ကျယ်သော metric တစ်ခုကို margin ကျဉ်းသော တစ်ခုနှင့် နှိုင်းယှဉ်ကြည့်ပါ။'
);
export const EV_CF_ANALOGY_BREAK = blSame(
  "The weather-forecast analogy breaks down on stakes: a wrong temperature forecast is mildly inconvenient. A wrong gold-price point estimate presented as certain, acted on as if certain, can drive a real financial decision — the cost of hiding the margin scales with what's riding on the number.",
  'ရာသီဥတု ခန့်မှန်းချက် ဆင်တူပုံရိပ်သည် အန္တရာယ်တွင် ပျက်စီးသည်: အပူချိန် ခန့်မှန်းချက် မှားခြင်းသည် အနည်းငယ်သာ အဆင်မပြေစေသည်။ ရွှေဈေးနှုန်း point estimate မှားယွင်းသည်ကို သေချာသည်ဟု ပြသ၊ သေချာသည်ဟု ယူဆလုပ်ဆောင်ခြင်းသည် တကယ့် ငွေကြေးဆုံးဖြတ်ချက်ကို တွန်းအားပေးနိုင်သည် — margin ကို ဝှက်ထားခြင်း၏ ကုန်ကျစရိတ်သည် ဂဏန်းပေါ်တွင် အခြေခံနေသည့်အရာနှင့် scale ညီသည်။'
);
export const EV_CF_CAVEAT = blSame(
  'A real caveat: a wide margin is itself useful information, not just an inconvenience — it tells you this particular metric or forecast is genuinely less trustworthy right now, which is exactly the signal a bare point number destroys.',
  'တကယ့် caveat: margin ကျယ်ခြင်းသည် ကိုယ်တိုင်ကလည်း အသုံးဝင်သော အချက်အလက်ဖြစ်ပြီး အဆင်မပြေစရာသက်သက် မဟုတ်ပါ — ဒီ metric (သို့) forecast တစ်ခုသည် ယခုအခါ တကယ်ပင် ယုံကြည်ရမှုနည်းနေကြောင်း ပြောပြသည်၊ ဒါသည် ဂဏန်းသက်သက်တစ်ခုက ဖျက်ဆီးလိုက်သော signal အတိအကျပင်ဖြစ်သည်။'
);
export const EV_CF_RETRIEVAL_Q = blSame(
  'Without looking back: why does a metric computed from a SMALLER validation set generally deserve a WIDER uncertainty margin than the same metric from a larger one?',
  'ပြန်မကြည့်ဘဲ: validation set သေးငယ်သောနေရာမှ တွက်ချက်ထားသော metric သည် ပိုကြီးသောနေရာမှ metric တူတူထက် ဘာကြောင့် ပိုကျယ်သော uncertainty margin ခံထိုက်သလဲ?'
);
export const EV_CF_RETRIEVAL_A = blSame(
  "A smaller sample gives any summary statistic (mean, MAE, RMSE...) less evidence to average over, so a single unusual point has a proportionally bigger say in the result — the same logic behind why a standard error shrinks as sample size n grows (it typically scales with 1/√n).",
  'နမူနာသေးငယ်လျှင် summary statistic (mean, MAE, RMSE...) တစ်ခုစီအတွက် ပျမ်းမျှစရာ သက်သေအထောက်အထား နည်းသွားပြီး၊ ထူးဆန်းသော အမှတ်တစ်ခုတည်းသည် ရလဒ်ပေါ်တွင် အချိုးကျ ပိုအရေးပါလာသည် — sample size n ကြီးလာသည်နှင့်အမျှ standard error ကျဆင်းရသည့် ယုတ္တိတူညီသည် (ပုံမှန်အားဖြင့် 1/√n နှင့် scale ညီသည်)။'
);

// Concept-drift demo (Constructive Thought Loop on this driver slider, D.2)
// + explicit "Continuous Learning" refutation, in the mission's own words.
export const EV_DRIFT_PREDICT_Q = blSame(
  'Drag time forward past the "regime change" line without ever pressing a retrain button. What happens to the model\'s error?',
  '"regime change" မျဉ်းကို retrain ခလုတ် တစ်ခါမှ မနှိပ်ဘဲ အချိန်ကို ရှေ့ဆွဲပါ။ မော်ဒယ်၏ error ကို ဘာဖြစ်လာမလဲ?'
);
export const EV_DRIFT_PREDICT_ADAPTS = blSame(
  'It gradually adapts on its own and the error settles back down',
  'သူ့ဘာသာ တဖြည်းဖြည်း လိုက်လျောညီထွေဖြစ်ပြီး error ပြန်ကျသွားသည်'
);
export const EV_DRIFT_PREDICT_SPIKES = blSame(
  'It has no way to adapt — the error spikes and stays high until someone retrains it',
  'လိုက်လျောညီထွေဖြစ်ရန် နည်းလမ်းမရှိပါ — error ရုတ်တရက်မြင့်တက်ပြီး တစ်စုံတစ်ယောက်က ပြန်မလေ့ကျင့်မချင်း မြင့်နေမည်'
);
export const EV_CONTINUOUS_LEARNING_NOTE = blSame(
  "The model did not get worse because it kept learning the wrong thing — it got worse because it stopped learning entirely the moment training ended, while the world kept changing underneath it. Nothing in this chart is adapting in real time; the line only moves because you're scrubbing through pre-computed history against one model that was frozen at t=0.",
  'မော်ဒယ်သည် မှားယွင်းသောအရာကို ဆက်သင်ယူနေခဲ့လို့ ပိုဆိုးလာတာ မဟုတ်ပါ — training ပြီးဆုံးတဲ့ချိန်မှာ လုံးဝ သင်ယူခြင်း ရပ်တန့်သွားပြီး၊ ကမ္ဘာက အောက်ခြေမှာ ဆက်ပြောင်းလဲနေတာကြောင့် ပိုဆိုးလာတာဖြစ်သည်။ ဒီဇယားထဲက ဘာမှ real time မှာ လိုက်လျောညီထွေ ဖြစ်နေတာ မဟုတ်ပါ — t=0 မှာ အေးခဲထားတဲ့ မော်ဒယ်တစ်ခုတည်းအတိုက် precompute ထားတဲ့ history ကို scrub လုပ်နေလို့ မျဉ်းက ရွေ့နေတာသာ ဖြစ်သည်။'
);
