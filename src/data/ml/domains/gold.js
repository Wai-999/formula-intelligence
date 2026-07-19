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
