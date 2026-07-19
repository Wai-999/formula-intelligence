import { bl } from '../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §1. The Gold worked example
// threads through every stage so this module previews Module 6 (research
// doc's own design note §7.3: "Gold is the strongest flagship domain").
export const PIPELINE_STAGES = [
  {
    id: 'framing',
    n: 1,
    stage: 'Problem framing',
    question: bl(
      'What kind of answer am I even trying to produce?',
      'What kind of answer am I trying to produce — regression, classification, or forecasting?',
      'ငါဖြေချင်တဲ့ အဖြေက ဘယ်လိုအမျိုးအစားလဲ။',
      'ဖြေရှင်းလိုသည့် ပြဿနာသည် regression (ဆက်တိုက်ကိန်း)၊ classification (အမျိုးအစားခွဲခြင်း) သို့မဟုတ် forecasting (အချိန်ကာလအလိုက် ခန့်မှန်းခြင်း) တို့အနက် မည်သည့်အမျိုးအစားလဲ။'
    ),
    what: bl(
      'Decide up front what shape the output needs: a number (regression), a category (classification), or a sequence of future values (forecasting).',
      'Decide regression (continuous number), classification (category), or forecasting (sequential, time-indexed) before touching data — this choice determines every downstream step, including which models in Module 3 are even candidates.',
      'အဖြေက ဂဏန်းတစ်ခုလား (regression)၊ အမျိုးအစားတစ်ခုလား (classification)၊ ဒါမှမဟုတ် အနာဂတ်တန်ဖိုးများ တစ်ဆက်တည်း (forecasting) လား ဆိုတာကို အချက်အလက်မထိခင် ဦးစွာဆုံးဖြတ်ရမည်။',
      'Regression (ဆက်တိုက်ဂဏန်း)၊ classification (အမျိုးအစား) သို့မဟုတ် forecasting (အချိန်-အညွှန်း အစီအစဉ်) ဟူ၍ ဦးစွာဆုံးဖြတ်ရသည် — ဤရွေးချယ်မှုသည် Module 3 ရှိ မည်သည့်ပုံစံများ အသုံးပြုနိုင်သည်ကိုပါ ဆုံးဖြတ်ပေးသည်။'
    ),
    goldExample: bl(
      'Gold price is a number that changes every day → this is a regression/forecasting problem, not classification.',
      'Gold spot price is a continuous, time-indexed target → framed as a time-series regression (forecasting) problem, ruling out classification-only models like plain Naive Bayes.',
      'ရွှေစျေးနှုန်းသည် နေ့စဉ်ပြောင်းလဲနေသော ဂဏန်းတစ်ခုဖြစ်သည် → ၎င်းသည် classification မဟုတ်ဘဲ regression/forecasting ပြဿနာဖြစ်သည်။',
      'ရွှေစျေးနှုန်းသည် အချိန်နှင့်တပြေးညီ ပြောင်းလဲနေသော ဆက်တိုက်တန်ဖိုးဖြစ်သဖြင့် time-series regression (forecasting) ပြဿနာအဖြစ် သတ်မှတ်သည် — Naive Bayes ကဲ့သို့ classification-only ပုံစံများကို ဖယ်ထုတ်ထားသည်။'
    ),
  },
  {
    id: 'collection',
    n: 2,
    stage: 'Data collection',
    question: bl(
      'What evidence do I actually have?',
      'What evidence do I have, and from which sources?',
      'ငါ့မှာ ဘယ်လို အထောက်အထားရှိသလဲ။',
      'မည်သည့် အချက်အလက်ရင်းမြစ်များမှ အထောက်အထားများ ရရှိထားသနည်း။'
    ),
    what: bl(
      'Pull raw numbers from wherever they live: government statistics agencies, market data feeds, polling aggregators, news archives.',
      'Pull from APIs, databases, scraped sources, statistical agencies (FRED, IMF, World Gold Council, polling aggregators) — the quality ceiling of every later stage is set here.',
      'အစိုးရစာရင်းအင်းဌာနများ၊ စျေးကွက်အချက်အလက်များ၊ စစ်တမ်းစုစည်းရေးဌာနများ၊ သတင်းမော်ကွန်းများကဲ့သို့ ရင်းမြစ်များမှ ကြမ်းအချက်အလက်များကို ရယူသည်။',
      'API များ၊ ဒေတာဘေ့စ်များ၊ statistical agencies (FRED, IMF, World Gold Council, စစ်တမ်းစုစည်းရေးများ) မှ ရယူသည် — နောက်ပိုင်းအဆင့်အားလုံး၏ အရည်အသွေးအမြင့်ဆုံးအကန့်အသတ်ကို ဤနေရာတွင် သတ်မှတ်လိုက်သည်။'
    ),
    goldExample: bl(
      'Pull real yields and DXY from market data, central-bank gold purchase reports from the World Gold Council, and geopolitical event feeds.',
      'Real yields (TIPS), DXY, Fed policy statements, World Gold Council central-bank purchase reports, geopolitical event/news feeds — five distinct source types for five drivers (Module 6).',
      'အမှန်တကယ် အတိုးနှုန်းနှင့် DXY ကို စျေးကွက်အချက်အလက်မှ၊ ဗဟိုဘဏ်ရွှေဝယ်ယူမှု အစီရင်ခံစာများကို World Gold Council မှ၊ နိုင်ငံရေးအခြေအနေ သတင်းများကို ရယူသည်။',
      'Real yields (TIPS)၊ DXY၊ Fed မူဝါဒထုတ်ပြန်ချက်များ၊ World Gold Council ၏ ဗဟိုဘဏ်ဝယ်ယူမှုအစီရင်ခံစာများ၊ နိုင်ငံရေးအဖြစ်အပျက်/သတင်းရင်းမြစ်များ — Module 6 ၏ drivers ငါးခုအတွက် ရင်းမြစ်ငါးမျိုး။'
    ),
  },
  {
    id: 'preparation',
    n: 3,
    stage: 'Data preparation',
    question: bl(
      'Is the evidence actually usable yet?',
      'Is the evidence usable — cleaned, aligned, and scaled?',
      'အထောက်အထားက တကယ် သုံးလို့ရပြီလား။',
      'အထောက်အထားသည် သန့်ရှင်းပြီး၊ ကြိမ်နှုန်းညီညွတ်ပြီး၊ scale ချိန်ညှိပြီး သုံးနိုင်ပြီလား။'
    ),
    what: bl(
      'Clean up gaps and weird outliers, and line up data that arrives on different schedules — daily prices next to quarterly GDP, for example.',
      'Clean missing values/outliers, align frequencies (daily price vs. quarterly GDP), normalize/scale — mismatched frequency is the single most common silent bug in a nowcasting pipeline (Module 7).',
      'ကွက်လပ်များနှင့် ထူးခြားသော outlier များကို သန့်ရှင်းပြီး၊ ကွဲပြားသောကြိမ်နှုန်းဖြင့် ရောက်ရှိလာသော အချက်အလက်များကို ချိန်ညှိသည် — ဥပမာ နေ့စဉ်စျေးနှုန်းနှင့် သုံးလပတ် GDP။',
      'ကွက်လပ်များ/outlier များကို သန့်ရှင်းပြီး၊ ကြိမ်နှုန်းများကို ချိန်ညှိပြီး (နေ့စဉ်စျေးနှုန်း vs. သုံးလပတ် GDP)၊ normalize/scale ပြုလုပ်သည် — ကြိမ်နှုန်းမတူညီမှုသည် nowcasting pipeline (Module 7) ရှိ အသိမသိ bug အများဆုံးဖြစ်သည်။'
    ),
    goldExample: bl(
      'Gold trades daily but central-bank purchase data only arrives quarterly — these need to be aligned before they can sit in the same model.',
      'Daily gold price vs. quarterly WGC central-bank demand figures — a frequency mismatch resolved by forward-filling or aggregating, exactly the kind of alignment problem Module 7\'s nowcasting "information gap" generalizes.',
      'ရွှေကို နေ့စဉ်ရောင်းဝယ်နေသော်လည်း ဗဟိုဘဏ်ဝယ်ယူမှုအချက်အလက်က သုံးလတစ်ကြိမ်သာ ထွက်သည် — မော်ဒယ်တစ်ခုတည်းထဲ မတွဲမီ ချိန်ညှိရန်လိုသည်။',
      'ရွှေစျေးနှုန်းကို နေ့စဉ် vs. WGC ဗဟိုဘဏ်ဝယ်ယူမှုကို သုံးလတစ်ကြိမ် — ကြိမ်နှုန်းမတူညီမှုကို forward-fill သို့မဟုတ် aggregate ဖြင့် ဖြေရှင်းသည်၊ Module 7 ၏ nowcasting "information gap" ကွန်ဆက်ဖြစ်သည့် ပြဿနာအမျိုးအစားတူညီသည်။'
    ),
  },
  {
    id: 'features',
    n: 4,
    stage: 'Feature engineering',
    question: bl(
      'What signals might actually explain the target?',
      'What signals might explain the target — lags, rolling averages, spreads, sentiment?',
      'ဘယ် signal တွေက ရလဒ်ကို ရှင်းပြနိုင်မလဲ။',
      'Target ကို ရှင်းပြနိုင်မည့် signal များမှာ lag များ၊ rolling average များ၊ spread များ၊ sentiment score များ ဖြစ်နိုင်သလား။'
    ),
    what: bl(
      'Build new columns from the raw data that make patterns easier for a model to see: yesterday\'s value, a 30-day average, the gap between two related rates.',
      'Build lags, rolling averages, technical indicators, macro spreads, sentiment scores. For time series specifically, this stage also requires no shuffling — splits must respect chronological order (walk-forward backtesting, Module 5).',
      'မော်ဒယ်တစ်ခုအတွက် ပုံစံများကို ပိုမြင်သာစေမည့် ကော်လံအသစ်များ တည်ဆောက်သည် — မနေ့ကတန်ဖိုး၊ ရက် ၃၀ ပျမ်းမျှ၊ ဆက်စပ်နှုန်းနှစ်ခုကြား ကွာဟချက်။',
      'Lag များ၊ rolling average များ၊ technical indicator များ၊ macro spread များ၊ sentiment score များ တည်ဆောက်သည်။ Time series အတွက် ဤအဆင့်တွင် shuffle မလုပ်ရ — အစီအစဉ်များသည် အချိန်ကြောင်းအတိုင်း လိုက်နာရမည် (walk-forward backtesting, Module 5)။'
    ),
    goldExample: bl(
      'Build the real-yield 30-day moving average, the month-over-month change in DXY, and a rolling geopolitical-risk score.',
      'Real-yield MA(30), DXY month-over-month delta, lagged central-bank purchase volume, rolling geopolitical-risk index — the geopolitical-risk feature alone contributed a measured ~19% accuracy improvement in one cited study.',
      'အမှန်တကယ် အတိုးနှုန်း ရက် ၃၀ ရွေ့လျားပျမ်းမျှ၊ DXY လစဉ်ပြောင်းလဲမှု၊ ရွေ့လျား နိုင်ငံရေးအန္တရာယ်ရမှတ်တို့ကို တည်ဆောက်သည်။',
      'Real-yield MA(30)၊ DXY လစဉ်ပြောင်းလဲမှု၊ lag ထားသော ဗဟိုဘဏ်ဝယ်ယူမှုပမာဏ၊ ရွေ့လျား geopolitical-risk index — geopolitical-risk feature တစ်ခုတည်းကပင် ကိုးကားထားသော လေ့လာမှုတစ်ခုတွင် တိကျမှု ~၁၉% တိုးတက်စေခဲ့သည်။'
    ),
  },
  {
    id: 'estimation',
    n: 5,
    stage: 'Estimation (training/fitting)',
    question: bl(
      'What did the data actually teach the model?',
      'What did the data teach the model\'s internal parameters?',
      'အချက်အလက်က မော်ဒယ်ကို ဘာသင်ပေးခဲ့သလဲ။',
      'အချက်အလက်များက မော်ဒယ်၏ အတွင်းပါရာမီတာများကို ဘာများ သင်ကြားပေးခဲ့သနည်း။'
    ),
    what: bl(
      'The model\'s internal numbers get tuned against historical data — this is the "learning" part, and it\'s exactly what Stats mode calls estimation.',
      'The model\'s internal parameters are estimated from historical data — OLS, MLE, gradient descent, or Bayesian posterior sampling, depending on the model family. This is the literal hinge to Stats mode (Module 10) and Module 2\'s own headline concept below.',
      'မော်ဒယ်၏ အတွင်းပါရာမီတာများကို သမိုင်းအချက်အလက်များနှင့် ချိန်ညှိသည် — ၎င်းသည် "သင်ယူခြင်း" အပိုင်းဖြစ်ပြီး Stats mode က estimation ဟုခေါ်သည့်အရာပင်ဖြစ်သည်။',
      'မော်ဒယ်၏ အတွင်းပါရာမီတာများကို သမိုင်းအချက်အလက်များမှ ခန့်မှန်းသည် — OLS, MLE, gradient descent, သို့မဟုတ် Bayesian posterior sampling ကို မော်ဒယ်မိသားစုပေါ်မူတည်၍ သုံးသည်။ ၎င်းသည် Stats mode (Module 10) နှင့် ချိတ်ဆက်ချက်အမှန်ဖြစ်သည်။'
    ),
    goldExample: bl(
      'Feed 10 years of gold price + the 5 driver features into an XGBoost model; the training process finds the internal split-points that best fit the historical relationship.',
      'Fit XGBoost/LSTM/ARIMA on 2015–2025 gold + drivers; each family estimates differently (gradient-boosted splits, backprop through time, MLE on ARMA coefficients) but all are "estimation" in the pipeline sense.',
      'ရွှေစျေးနှုန်းနှင့် driver features ငါးခုကို ဆယ်နှစ်စာ XGBoost မော်ဒယ်ထဲသို့ ထည့်သွင်းသည်; လေ့ကျင့်မှုလုပ်ငန်းစဉ်က သမိုင်းဆက်စပ်မှုနှင့် အကိုက်ညီဆုံးသော split-point များကို ရှာဖွေသည်။',
      '2015-2025 ရွှေစျေးနှုန်းနှင့် driver များကို XGBoost/LSTM/ARIMA ဖြင့် fit လုပ်သည်; မော်ဒယ်မိသားစုတစ်ခုစီက မတူညီစွာ ခန့်မှန်းသော်လည်း (gradient-boosted splits, backprop through time, MLE) pipeline အဓိပ္ပာယ်အရ "estimation" ဟုသာ ခေါ်သည်။'
    ),
  },
  {
    id: 'prediction',
    n: 6,
    stage: 'Prediction (inference)',
    question: bl(
      'What does the trained model say will happen next?',
      'What does the fitted model say will happen for new, unseen inputs?',
      'လေ့ကျင့်ပြီးသား မော်ဒယ်က ဘာဖြစ်လာမယ်လို့ ပြောသလဲ။',
      'Fit လုပ်ပြီးသား မော်ဒယ်က မမြင်ဖူးသေးသည့် input အသစ်များအတွက် မည်သို့ ခန့်မှန်းသနည်း။'
    ),
    what: bl(
      'The trained model is pointed at fresh inputs it has never seen and produces a guess — a point forecast plus (ideally) a range of uncertainty around it.',
      'The fitted model is applied to new/unseen inputs to generate an output: a point forecast + prediction interval. This is the pipeline\'s other hinge to Stats mode — Module 2\'s Estimation vs. Prediction panel below makes the contrast explicit.',
      'လေ့ကျင့်ပြီးသား မော်ဒယ်ကို မမြင်ဖူးသေးသော input အသစ်များနှင့် စမ်းသပ်ပြီး ခန့်မှန်းချက်တစ်ခု ထုတ်ပေးသည် — point forecast နှင့် (အကောင်းဆုံးဆိုရင်) မသေချာမှု အပိုင်းအခြားတစ်ခုပါ။',
      'Fit လုပ်ပြီးသား မော်ဒယ်ကို input အသစ်များတွင် အသုံးချပြီး output ထုတ်ပေးသည်: point forecast + prediction interval။ ဤသည်မှာ Stats mode သို့ ချိတ်ဆက်ချက်တစ်ခုဖြစ်ပြီး၊ အောက်ပါ Estimation vs. Prediction panel က ကွာခြားချက်ကို ရှင်းလင်းစွာ ပြသသည်။'
    ),
    goldExample: bl(
      'Feed next month\'s expected real-yield/DXY/inflation values into the fitted model → it outputs "gold: $4,180 ± $150".',
      'Feed next-period driver forecasts into the fitted ensemble → point forecast + interval, e.g. "$4,180 ± $150 (95%)" — an inference step, not a re-estimation of parameters.',
      'လာမည့်လအတွက် မျှော်မှန်းထားသော real-yield/DXY/inflation တန်ဖိုးများကို fit လုပ်ပြီးသား မော်ဒယ်ထဲထည့်သွင်းလိုက်သောအခါ → "ရွှေ: $4,180 ± $150" ဟု ထုတ်ပေးသည်။',
      'နောက်ကာလ driver ခန့်မှန်းချက်များကို fit လုပ်ပြီးသား ensemble ထဲထည့်လိုက်သောအခါ → point forecast + interval, ဥပမာ "$4,180 ± $150 (95%)" — ၎င်းသည် inference အဆင့်ဖြစ်ပြီး ပါရာမီတာ ပြန်လည်ခန့်မှန်းခြင်း မဟုတ်ပါ။'
    ),
  },
  {
    id: 'evaluation',
    n: 7,
    stage: 'Evaluation → Deployment → Monitoring',
    question: bl(
      'Is it still right, and for how much longer?',
      'Is it still right, and for how long — how do we know when to retrain?',
      'ဒါက ဆက်မှန်နေသေးလား၊ ဘယ်လောက်ကြာအောင်လဲ။',
      '၎င်းသည် ဆက်မှန်နေသေးသလား၊ ဘယ်လောက်ကြာအောင်လဲ — ဘယ်အချိန်မှာ ပြန်လေ့ကျင့်ရမလဲ ဘယ်လိုသိနိုင်သလဲ။'
    ),
    what: bl(
      'Score the model\'s accuracy honestly, ship it, then keep watching — because the real world keeps changing underneath it, and a model that was right last year can quietly go wrong.',
      'Score accuracy (MAE/RMSE/MAPE/R²/AIC/BIC), ship the model, watch for concept drift, retrain on a schedule or trigger. See Module 5 for the full evaluation/explainability/drift toolkit this stage uses.',
      'မော်ဒယ်၏ တိကျမှုကို ရိုးသားစွာ အမှတ်ပေးပြီး ဖြန့်ချိပြီးနောက် ဆက်ကြည့်နေရမည် — ကမ္ဘာကြီးက အောက်ခြေမှာ ပြောင်းလဲနေဆဲဖြစ်ပြီး၊ မနှစ်ကမှန်ခဲ့သော မော်ဒယ်တစ်ခုသည် တိတ်တဆိတ် မှားလာနိုင်သည်။',
      'တိကျမှုကို အမှတ်ပေးပြီး (MAE/RMSE/MAPE/R²/AIC/BIC)၊ မော်ဒယ်ကို ဖြန့်ချိပြီး၊ concept drift ကို စောင့်ကြည့်ပြီး၊ အချိန်ဇယားအလိုက် သို့မဟုတ် trigger အလိုက် ပြန်လေ့ကျင့်သည်။ ဤအဆင့်က အသုံးပြုသော evaluation/explainability/drift toolkit အပြည့်အစုံအတွက် Module 5 ကို ကြည့်ပါ။'
    ),
    goldExample: bl(
      'Track the model\'s error month by month; when central banks suddenly changed their buying pattern in 2026, the old model\'s errors grew — a sign it needs retraining.',
      'RMSE tracked monthly against a training-time baseline; the 2021–2025 central-bank buying regime shift (net purchases fell to 16 tons in Q1 2026 after averaging ~225 tons/quarter) is exactly the kind of regime change that trips a drift alarm (Module 5).',
      'မော်ဒယ်၏ အမှားကို လစဉ် စောင့်ကြည့်သည်; ၂၀၂၆ ခုနှစ်တွင် ဗဟိုဘဏ်များ၏ ဝယ်ယူမှုပုံစံ ရုတ်တရက်ပြောင်းလဲသွားသောအခါ မော်ဒယ်ဟောင်း၏ အမှားများ ကြီးထွားလာသည် — ပြန်လေ့ကျင့်ရန် လိုအပ်ကြောင်း လက္ခဏာတစ်ခုဖြစ်သည်။',
      'RMSE ကို လစဉ် training-time baseline နှင့် နှိုင်းယှဉ်စောင့်ကြည့်သည်; 2021-2025 ဗဟိုဘဏ် ဝယ်ယူမှုပုံစံပြောင်းလဲမှု (တစ်လျှပတ် ~225 တန် ပျမ်းမျှမှ 2026 Q1 တွင် 16 တန်သို့ကျဆင်း) သည် drift alarm ကို လှုံ့ဆော်စေမည့် regime change အမျိုးအစားပင်ဖြစ်သည် (Module 5)။'
    ),
  },
];
