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
