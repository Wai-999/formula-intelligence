import { bl, blSame } from '../../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §6.1. Current spot price
// and 2026 bank-forecast range are the doc's real cited figures; the
// driver→price sensitivity coefficients below are illustrative (Section
// C.4) — calibrated so each driver's *direction* matches the doc exactly,
// magnitudes are for teaching the shape of the relationship, not a real
// trading model.
export const GOLD_BASE_PRICE = 4015; // midpoint of the doc's $4,000-$4,030 current range
export const GOLD_BASE_BAND = 90;

export const GOLD_CONTEXT = bl(
  'Gold trades around $4,000–$4,030/oz right now. Big banks think it could reach $4,800–$6,500/oz sometime in 2026 — but "could reach" depends entirely on which of these five forces wins out.',
  'Current spot: ~$4,000–$4,030/oz. 2026 bank targets range $4,800–$6,500/oz (Goldman Sachs ≈$5,800, JPMorgan ≈$5,500, UBS $6,000+). The five drivers below are the literature\'s consensus feature set.',
  'ရွှေသည် ယခုအခါ $4,000–$4,030/oz ဝန်းကျင်တွင် ရောင်းဝယ်နေသည်။ ဘဏ်ကြီးများက ၂၀၂၆ ခုနှစ်တွင် $4,800–$6,500/oz ရောက်နိုင်သည်ဟု ယူဆကြသည် — သို့သော် "ရောက်နိုင်သည်" ဆိုသည်မှာ အောက်ပါ အင်အားငါးမျိုးထဲက ဘယ်ဟာ အနိုင်ရမလဲအပေါ် လုံးလုံးမူတည်သည်။',
  'လက်ရှိ spot: ~$4,000–$4,030/oz။ ၂၀၂၆ ဘဏ် target များမှာ $4,800–$6,500/oz (Goldman Sachs ≈$5,800, JPMorgan ≈$5,500, UBS $6,000+) ဖြစ်သည်။ အောက်ပါ driver ငါးခုသည် သုတေသနစာပေ၏ သဘောတူညီချက် feature set ဖြစ်သည်။'
);

export const GOLD_DRIVERS = [
  {
    key: 'realYields', coefficient: -180,
    label: blSame('Real yields', 'Real yields (တကယ့်အတိုးနှုန်း)'),
    relation: bl('Higher real yields → gold falls', 'Inverse — the single most-cited driver', 'Real yields မြင့်တက် → ရွှေကျ', 'Inverse — အများဆုံးကိုးကားခံရသော driver'),
  },
  {
    key: 'dxy', coefficient: -150,
    label: blSame('US Dollar Index (DXY)', 'US Dollar Index (DXY)'),
    relation: bl('Stronger dollar → gold falls (priced in USD globally)', 'Inverse — gold priced in USD globally', 'ဒေါ်လာသန်မာ → ရွှေကျ (ကမ္ဘာတစ်ဝှမ်း USD ဖြင့် စျေးနှုန်းသတ်မှတ်)', 'Inverse — ရွှေကို ကမ္ဘာတစ်ဝှမ်း USD ဖြင့် စျေးနှုန်းသတ်မှတ်'),
  },
  {
    key: 'inflationFedPath', coefficient: 130,
    label: blSame('Inflation / Fed dovishness', 'ငွေကြေးဖောင်းပွမှု / Fed အနူးညံ့သဘော'),
    relation: bl('More rate-cut expectation → gold rises', 'Positive — rate-cut expectations are a major 2026 tailwind narrative', 'အတိုးနှုန်းလျှော့ချမည့် မျှော်လင့်ချက်များလာ → ရွှေတက်', 'Positive — ၂၀၂၆ အဓိက tailwind narrative'),
  },
  {
    key: 'geoRisk', coefficient: 110, volDriver: true,
    label: blSame('Geopolitical risk', 'ပထဝီရေးအန္တရာယ်'),
    relation: bl('More conflict/tension → gold rises (safe haven)', 'Positive — one study found ~19% prediction-accuracy improvement from this feature', 'ပဋိပက္ခ/တင်းမာမှု များလာ → ရွှေတက် (ဘေးကင်းရာနေရာ)', 'Positive — လေ့လာမှုတစ်ခုက ဤ feature မှ တိကျမှု ~၁၉% တိုးတက်ကြောင်း တွေ့ရှိသည်'),
  },
  {
    key: 'cbDemand', coefficient: 90,
    label: blSame('Central bank demand', 'ဗဟိုဘဏ် ဝယ်လိုအား'),
    relation: bl('Heavier central-bank buying → gold rises', 'Positive — structural buyer since 2021 (~225 tons/quarter 2021-2025), though flows can reverse sharply', 'ဗဟိုဘဏ် ဝယ်ယူမှု ပိုများလာ → ရွှေတက်', 'Positive — 2021 ကတည်းက ဖွဲ့စည်းပုံအရ ဝယ်ယူသူ (~225 tons/quarter 2021-2025) သော်လည်း flow များ ရုတ်တရက် ပြောင်းပြန်ဖြစ်နိုင်'),
  },
];

export const GOLD_MODELS = [
  { key: 'econometric', name: blSame('ARIMA', 'ARIMA'), color: '#8b5cf6', note: bl('Stable, explainable — but slow to adapt when a driver moves a lot at once.', 'Damped linear response; band widens disproportionately once any driver exceeds ~1 SD, reflecting known weakness with structural breaks.', 'တည်ငြိမ်၊ ရှင်းပြရလွယ် — သို့သော် driver တစ်ခု တစ်ပြိုင်နက်ကြီးကြီးမားမား ရွေ့လျားလျှင် လိုက်လျောညီထွေဖြစ်ရန် နှေးသည်။', 'Damped linear response; driver တစ်ခုသည် ~1 SD ကျော်လွန်သည်နှင့် band ကျယ်ပြန့်လာသည်၊ structural break များတွင် အားနည်းချက်ကို ထင်ဟပ်သည်။') },
  { key: 'deepLearning', name: blSame('LSTM', 'LSTM'), color: '#a78bfa', note: bl('Best at spotting complex combinations — when several drivers point the same way, LSTM reacts more than the others.', 'Full linear response amplified when drivers align in the same direction, reflecting its documented strength at complex nonlinear + multivariate patterns.', 'ရှုပ်ထွေးသော ပေါင်းစပ်မှုများကို ရှာဖွေရာတွင် အကောင်းဆုံး — driver များစွာ တစ်ဖက်တည်း ညွှန်းသောအခါ LSTM သည် တခြားများထက် ပိုတွန်းအားရှိသည်။', 'Driver များ တစ်ဖက်တည်း ညီညွတ်သောအခါ full linear response ကို တိုးမြှင့်သည်၊ ရှုပ်ထွေးသော nonlinear + multivariate pattern များတွင် စွမ်းဆောင်ရည်ကို ထင်ဟပ်သည်။') },
  { key: 'treeEnsemble', name: blSame('XGBoost', 'XGBoost'), color: '#22d3ee', note: bl('A strong, well-balanced all-rounder — reacts to every driver but each driver\'s effect saturates instead of growing without limit.', 'Saturating (tanh) response per driver, reflecting split-based thresholding; frequently the top performer with SHAP explainability in the literature.', 'ခိုင်မာပြီး ဟန်ချက်ညီသော all-rounder — driver တိုင်းကို တုံ့ပြန်သော်လည်း driver တစ်ခုစီ၏ သက်ရောက်မှုသည် အကန့်အသတ်မရှိ မကြီးထွားဘဲ ရပ်တန့်သွားသည်။', 'Driver တစ်ခုစီအတွက် saturating (tanh) response, split-based thresholding ကို ထင်ဟပ်သည်; သုတေသနစာပေတွင် SHAP explainability ဖြင့် ထိပ်တန်းစွမ်းဆောင်ရည်ရှိလေ့ရှိသည်။') },
  { key: 'volatility', name: blSame('GARCH (volatility overlay)', 'GARCH (volatility overlay)'), color: '#fbbf24', note: bl('Doesn\'t move the center forecast much on its own — its real job is widening or narrowing the uncertainty band, especially around geopolitical risk.', 'Point forecast tracks the econometric lens; band width instead responds to driver magnitude and geopolitical risk specifically, reflecting GARCH\'s purpose (modeling variance, not the mean).', 'ဗဟိုချက် ခန့်မှန်းချက်ကို သူ့ဘာသာကိုယ်တိုင် များစွာ မရွှေ့ပါ — သူ့တကယ့်အလုပ်က မသေချာမှုအပိုင်းအခြားကို ကျယ်/ကျဉ်းစေခြင်းဖြစ်ပြီး၊ အထူးသဖြင့် ပထဝီရေးအန္တရာယ်ပတ်ဝန်းကျင်တွင်ဖြစ်သည်။', 'Point forecast သည် econometric lens ကို လိုက်နာသည်; band width မှာမူ driver ပမာဏနှင့် ပထဝီရေးအန္တရာယ်အပေါ် တိကျစွာ တုံ့ပြန်သည်၊ GARCH ၏ ရည်ရွယ်ချက် (mean မဟုတ်ဘဲ variance ကို ပုံဖော်ခြင်း) ကို ထင်ဟပ်သည်။') },
];

export const GOLD_SCENARIOS = [
  {
    id: 'fed-cuts', label: blSame('Fed accelerates rate cuts', 'Fed အတိုးနှုန်းလျှော့ချမှု အရှိန်မြှင့်'),
    state: { realYields: -1.0, dxy: -0.3, inflationFedPath: 1.6, geoRisk: 0, cbDemand: 0 },
  },
  {
    id: 'dollar-strength', label: blSame('Dollar strengthens sharply', 'ဒေါ်လာ ပြင်းထန်စွာ သန်မာ'),
    state: { realYields: 0.5, dxy: 1.8, inflationFedPath: -0.3, geoRisk: 0, cbDemand: 0 },
  },
  {
    id: 'geo-shock', label: blSame('Geopolitical shock', 'ပထဝီရေးအရေးအခင်း'),
    state: { realYields: -0.2, dxy: 0.2, inflationFedPath: 0, geoRisk: 1.8, cbDemand: 0.5 },
  },
  {
    id: 'cb-buying', label: blSame('Central banks resume heavy buying', 'ဗဟိုဘဏ်များ ဝယ်ယူမှုပြင်းထန်စွာ ပြန်စ'),
    state: { realYields: 0, dxy: -0.2, inflationFedPath: 0, geoRisk: 0.3, cbDemand: 1.8 },
  },
];

export const GOLD_TRACE_INTRO = bl(
  'Move any driver above, then check this panel — it shows exactly which driver pushed the forecast, in which direction, and by roughly how much.',
  'Per-driver dollar contribution to the linear-response baseline, sorted by magnitude — the same decomposition idea as Module 5\'s LIME panel, applied live.',
  'အထက်ပါ driver တစ်ခုခုကို ရွှေ့ပြီး ဒီ panel ကို စစ်ကြည့်ပါ — driver ဘယ်ဟာက ခန့်မှန်းချက်ကို ဘယ်လိုတွန်းအားပေးလဲ၊ ဘယ်လောက်လဲ တိတိကျကျ ပြသသည်။',
  'Linear-response baseline သို့ driver တစ်ခုစီ၏ ဒေါ်လာ contribution ကို ပမာဏအလိုက် စီထားသည် — Module 5 ၏ LIME panel အတွေးအခေါ်တူညီသည်၊ live အသုံးချထားသည်။'
);

// Module 9's Politics lab computes a composite geopolitical risk score and
// can send it here to set the geoRisk driver directly (navigateToLinkedConcept
// → GoldLabPage's linkedConcept consumer). This is the banner shown when
// that just happened.
export const GOLD_LINK_BANNER = blSame(
  "Geopolitical risk was just set from the Politics lab's risk index.",
  'ပထဝီရေးအန္တရာယ်ကို Politics lab ၏ risk index မှ အခုလေးတင် သတ်မှတ်လိုက်သည်။'
);

// Module 11 audit: section titles were hardcoded English in GoldLabPage.jsx
// (missed during Module 6 — every module built since repeated the same
// gap, see BUILD_LOG.md Module 11). Titles don't fork by depth level, only
// language, hence blSame().
export const GOLD_PAGE_TITLE = blSame('Gold Price Forecasting Lab', 'ရွှေဈေးနှုန်း ခန့်မှန်းချက် Lab');
export const GOLD_DRIVERS_TITLE = blSame('Drivers', 'Driver များ');
export const GOLD_MODELS_TITLE = blSame('Four models, one set of drivers', 'မော်ဒယ် လေးခု၊ Driver အစုံတစ်ခု');
export const GOLD_TRACE_TITLE = blSame('Why did this move?', 'ဒါက ဘာကြောင့် ရွှေ့သွားတာလဲ?');
export const GOLD_MODELS_SUB = blSame(
  'Move a driver above and watch all four react — differently.',
  'အထက်ပါ driver တစ်ခုကို ရွှေ့ပြီး လေးခုလုံး ဘယ်လိုတုံ့ပြန်လဲ ကြည့်ပါ — ကွဲပြားစွာဖြစ်သည်။'
);

// Learning Design System retrofit (Module 6): Constructive Thought Loop on
// the driver panel + one consolidated Depth Ladder whose Critical Frontier
// is the mission's assigned "bank-forecast-spread disagreement" teaching
// moment. The worked example's numbers are computed from the exact same
// computeModelForecasts() formulas the chart above uses (geoRisk=1.0, all
// other drivers 0) — not fabricated, independently re-derivable by anyone
// who pushes that same slider and reads the trace panel.
export const GOLD_PREDICT_Q = blSame(
  'Push geopolitical risk to its maximum, everything else at zero. Do the four models\' point forecasts move by the same dollar amount, or different amounts?',
  'ပထဝီရေးအန္တရာယ်ကို အမြင့်ဆုံးအထိ တွန်းပါ၊ ကျန်တာအားလုံး သုညထား။ မော်ဒယ်လေးခု၏ point forecast များသည် ဒေါ်လာပမာဏ တူညီစွာ ရွှေ့မလား၊ ကွဲပြားစွာ ရွှေ့မလား?'
);
export const GOLD_PREDICT_SAME = blSame(
  'The same amount — they all see the same drivers',
  'ပမာဏတူညီသည် — ၎င်းတို့အားလုံးသည် driver တူညီစွာ မြင်ကြသည်'
);
export const GOLD_PREDICT_DIFFERENT = blSame(
  'Different amounts — each model weighs the same evidence differently',
  'ပမာဏကွဲပြားသည် — မော်ဒယ်တစ်ခုစီသည် သက်သေအထောက်အထားတူညီကို မတူညီစွာ ချိန်ဆသည်'
);
export const GOLD_PREDICT_EXPLAIN = blSame(
  'Check the forecast chart and trace panel after pushing geopolitical risk — ARIMA and GARCH share a point forecast but GARCH\'s band is far wider, while LSTM and XGBoost land at different dollar figures entirely. Same evidence, four different reactions.',
  'ပထဝီရေးအန္တရာယ်ကို တွန်းပြီးနောက် forecast chart နှင့် trace panel ကို စစ်ကြည့်ပါ — ARIMA နှင့် GARCH သည် point forecast တူညီသော်လည်း GARCH ၏ band ပိုကျယ်သည်၊ LSTM နှင့် XGBoost သည် လုံးဝကွဲပြားသော ဒေါ်လာဂဏန်းများသို့ ရောက်သည်။ သက်သေအထောက်အထားတူညီ၊ တုံ့ပြန်မှုကွဲပြား လေးမျိုး။'
);

export const GOLD_SPARK_ANALOGY = bl(
  "Ask five weather forecasters for tomorrow's high temperature and you'll get five slightly different numbers — not because someone's wrong, but because each reads slightly different evidence and weighs it differently. Ask five investment banks where gold will be next year and the same thing happens, just with far higher stakes.",
  'ရာသီဥတု ခန့်မှန်းသူ ငါးယောက်ကို မနက်ဖြန် အပူချိန်အမြင့်ဆုံး မေးကြည့်ပါ၊ အနည်းငယ် ကွဲပြားသော ဂဏန်း ငါးလုံး ရလိမ့်မည် — တစ်ယောက်ယောက် မှားလို့ မဟုတ်ပါ၊ တစ်ဦးစီက အနည်းငယ်ကွဲပြားသော သက်သေအထောက်အထားကို ဖတ်ပြီး မတူညီစွာ ချိန်ဆလို့ ဖြစ်သည်။ ရင်းနှီးမြှုပ်နှံမှု ဘဏ်ငါးခုကို လာမည့်နှစ် ရွှေ ဘယ်နေရာရောက်မလဲ မေးကြည့်ပါ၊ အလားတူဖြစ်ပေါ်မည်၊ အရေးပါမှု ပိုမြင့်ရုံသာ ကွဲပြားသည်။'
);

export const GOLD_MECHANISM_NOTE = blSame(
  "You already ran this mechanism above — every push of a driver slider re-computes all four models' forecasts live from the same driver state. Push geopolitical risk toward its extreme and watch the forecast band chart and trace panel react in real time.",
  'အထက်ပါ mechanism ကို သင် run လုပ်ပြီးသားပါ — driver slider ကို တွန်းတိုင်း မော်ဒယ်လေးခုစလုံး၏ forecast ကို driver state တူညီမှ live ပြန်တွက်သည်။ ပထဝီရေးအန္တရာယ်ကို အစွန်းဆုံးဆီသို့ တွန်းပြီး forecast band chart နှင့် trace panel ဘယ်လို real time တုံ့ပြန်လဲ ကြည့်ပါ။'
);

export const GOLD_FORMALISM_WORKED = bl(
  "Worked example: push geoRisk to 1.0 (its coefficient is +110), everything else at 0. Linear baseline move = +$110. ARIMA (0.7× damping) lands at +$77; LSTM (full response, only one driver active so no amplification yet) also lands at +$110; XGBoost's tanh saturation gives +$88; GARCH shares ARIMA's +$77 point but its band balloons to $153 (vs ARIMA's unchanged $90) because geopolitical risk is specifically the variable GARCH's band responds to. Four different numbers from one identical push.",
  "Worked example: push geoRisk to 1.0 (its coefficient is +110), everything else at 0. Linear baseline move = +$110. ARIMA (0.7× damping) lands at +$77; LSTM (full response, only one driver active so no amplification yet) also lands at +$110; XGBoost's tanh saturation gives +$88; GARCH shares ARIMA's +$77 point but its band balloons to $153 (vs ARIMA's unchanged $90) because geopolitical risk is specifically the variable GARCH's band responds to. Four different numbers from one identical push.",
  'ဖြေရှင်းချက်ဥပမာ: geoRisk ကို 1.0 (coefficient +110) သို့ တွန်းပါ၊ ကျန်တာအားလုံး 0။ Linear baseline move = +$110။ ARIMA (0.7× damping) သည် +$77 ရောက်သည်; LSTM (full response, driver တစ်ခုတည်းသာ active ဖြစ်၍ amplification မရှိသေး) သည်လည်း +$110 ရောက်သည်; XGBoost ၏ tanh saturation က +$88 ပေးသည်; GARCH သည် ARIMA ၏ +$77 point ကို မျှဝေသော်လည်း ၎င်း၏ band သည် $153 အထိ ကျယ်ထွက်သွားသည် (ARIMA ၏ မပြောင်းလဲသေးသော $90 နှင့်နှိုင်းယှဉ်) — ပထဝီရေးအန္တရာယ်သည် GARCH ၏ band တုံ့ပြန်ရာ variable အတိအကျဖြစ်သောကြောင့်ဖြစ်သည်။ တွန်းအားတူညီတစ်ခုမှ ဂဏန်းလေးမျိုး ကွဲပြားထွက်လာသည်။',
  'ဖြေရှင်းချက်ဥပမာ: geoRisk ကို 1.0 (coefficient +110) သို့ တွန်းပါ၊ ကျန်တာအားလုံး 0။ Linear baseline move = +$110။ ARIMA (0.7× damping) သည် +$77 ရောက်သည်; LSTM (full response, driver တစ်ခုတည်းသာ active ဖြစ်၍ amplification မရှိသေး) သည်လည်း +$110 ရောက်သည်; XGBoost ၏ tanh saturation က +$88 ပေးသည်; GARCH သည် ARIMA ၏ +$77 point ကို မျှဝေသော်လည်း ၎င်း၏ band သည် $153 အထိ ကျယ်ထွက်သွားသည် (ARIMA ၏ မပြောင်းလဲသေးသော $90 နှင့်နှိုင်းယှဉ်) — ပထဝီရေးအန္တရာယ်သည် GARCH ၏ band တုံ့ပြန်ရာ variable အတိအကျဖြစ်သောကြောင့်ဖြစ်သည်။ တွန်းအားတူညီတစ်ခုမှ ဂဏန်းလေးမျိုး ကွဲပြားထွက်လာသည်။'
);
export const GOLD_FORMALISM_FADED = blSame(
  'Now you try: set every driver to 0 except real yields at −1.0 (its coefficient is −180). Step 1 — what\'s the linear baseline move (coefficient × driver value)? Step 2 — which of the four models do you expect to land furthest from that baseline this time, and why: _____. Check your answer against the trace panel and forecast chart above.',
  'အခု သင့်အလှည့်: real yields ကို −1.0 (coefficient −180) ထား၊ ကျန် driver အားလုံး 0 ထား။ အဆင့် ၁ — linear baseline move (coefficient × driver value) ဘယ်လောက်လဲ? အဆင့် ၂ — ဒီတစ်ကြိမ် ဘယ်မော်ဒယ်က baseline နှင့် အဝေးဆုံးရောက်မယ်လို့ မျှော်လင့်လဲ၊ ဘာကြောင့်လဲ: _____။ အထက်ပါ trace panel နှင့် forecast chart နှင့် စစ်ဆေးပါ။'
);

export const GOLD_CF_ANALOGY_BREAK = blSame(
  "The weather-forecaster analogy breaks down on accountability: a weather forecaster is graded again tomorrow, every single day, so bad judgment gets corrected fast. A 2026 gold price forecast won't be checked for months — leaving far more room for a bank's own trading position, marketing incentive, or institutional house-view to quietly shape a number before reality ever grades it.",
  'ရာသီဥတု ခန့်မှန်းသူ ဆင်တူပုံရိပ်သည် တာဝန်ခံမှုတွင် ပျက်စီးသည်: ရာသီဥတု ခန့်မှန်းသူသည် မနက်ဖြန် နေ့တိုင်း ထပ်စစ်ဆေးခံရသောကြောင့် ညံ့ဖျင်းသော ဆုံးဖြတ်ချက်ကို မြန်မြန် ပြင်ရသည်။ ၂၀၂၆ ရွှေဈေးနှုန်း ခန့်မှန်းချက်ကို လများကြာ မစစ်ဆေးရသေးပါ — ဘဏ်တစ်ခု၏ ကိုယ်ပိုင် trading position, marketing motivation, သို့မဟုတ် institutional house-view က တကယ့်ရလဒ်က မစစ်ဆေးမီ ဂဏန်းတစ်ခုကို တိတ်တဆိတ် ပုံဖော်ရန် နေရာပိုများစေသည်။'
);
export const GOLD_CF_CAVEAT = blSame(
  'A real caveat: this page\'s own context noted Goldman Sachs (~$5,800), JPMorgan (~$5,500), and UBS ($6,000+) — three serious institutions, over $1,200 apart, looking at broadly the same evidence. That real spread is the same phenomenon this page\'s four toy model-lenses illustrate when they react differently to one identical driver push — a wide spread is not proof someone is incompetent, it is a signal of how much genuine uncertainty the evidence actually contains.',
  'တကယ့် caveat: ဒီစာမျက်နှာ၏ ကိုယ်ပိုင် context က Goldman Sachs (~$5,800), JPMorgan (~$5,500), UBS ($6,000+) ကို မှတ်သားခဲ့သည် — ခိုင်မာသော institution သုံးခု၊ $1,200 ကျော် ကွဲပြားပြီး၊ အကြမ်းဖျင်းအားဖြင့် သက်သေအထောက်အထားတူညီကို ကြည့်နေကြသည်။ ထိုတကယ့် spread သည် ဒီစာမျက်နှာ၏ toy model-lens လေးခုက တွန်းအားတူညီတစ်ခုကို မတူညီစွာ တုံ့ပြန်သောအခါ ပြသသော ဖြစ်စဉ်တူညီပင်ဖြစ်သည် — spread ကျယ်ခြင်းသည် တစ်စုံတစ်ယောက် ကျွမ်းကျင်မှုမရှိကြောင်း သက်သေမဟုတ်ဘဲ၊ သက်သေအထောက်အထားတွင် တကယ်ပါဝင်သော uncertainty ပမာဏကို ညွှန်ပြခြင်းဖြစ်သည်။'
);
export const GOLD_CF_RETRIEVAL_Q = blSame(
  'If two reputable banks publish gold forecasts $1,000+ apart, does that necessarily mean one of them made a mistake?',
  'ဂုဏ်သတင်းကောင်းသော ဘဏ်နှစ်ခုက ရွှေဈေးနှုန်း ခန့်မှန်းချက် $1,000+ ကွာဟစွာ ထုတ်ပြန်လျှင် တစ်ခုခုက မှားယွင်းသည်ဟု လုံးလုံးဆိုလိုပါသလား?'
);
export const GOLD_CF_RETRIEVAL_A = blSame(
  "No — it more likely means they're weighting the same uncertain evidence differently (how much of a rate-cut path to assume, how much further central-bank buying to project forward), the same way this page's four model lenses reacted differently to one identical driver push. A large forecast spread is genuine, informative signal about how much real uncertainty the underlying evidence contains — not proof that someone made an error.",
  'မဟုတ်ပါ — သူတို့သည် မသေချာသော သက်သေအထောက်အထားတူညီကို မတူညီစွာ ချိန်ဆနေခြင်း (အတိုးလျှော့ချမည့် လမ်းကြောင်း မည်မျှယူဆမလဲ၊ ဗဟိုဘဏ် ဝယ်ယူမှု ရှေ့ဆက်မည်မျှ ထင်မြင်မလဲ) ဖြစ်နိုင်ခြေပိုများသည်၊ ဒီစာမျက်နှာ၏ မော်ဒယ် lens လေးခုက တွန်းအားတူညီတစ်ခုကို မတူညီစွာ တုံ့ပြန်သကဲ့သို့ပင်ဖြစ်သည်။ Forecast spread ကျယ်ခြင်းသည် underlying သက်သေအထောက်အထားတွင် တကယ်ပါဝင်သော uncertainty ပမာဏအကြောင်း စစ်မှန်၍ အသိပေးနိုင်သော signal ဖြစ်ပြီး၊ တစ်စုံတစ်ယောက် မှားယွင်းကြောင်း သက်သေမဟုတ်ပါ။'
);
