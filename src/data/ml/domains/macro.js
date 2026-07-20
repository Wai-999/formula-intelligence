import { bl, blSame } from '../../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §6.2. The doc gives model
// comparisons and categories of proxy data ("financial markets, surveys,
// satellite/mobility data") but no single named driver list the way §6.1
// does for Gold — the five drivers below are a realistic, illustrative
// instantiation of those categories (yield curve, survey sentiment, labor
// market, mobility/spending, trade/freight are all genuinely used in
// real-world nowcasting practice), not a verbatim doc quote. Coefficients
// are illustrative throughout; there is no single real reported GDP nowcast
// figure to cite the way Gold's spot price could be, so the base value is
// synthetic too — see MLCitation usage below.
export const MACRO_BASE_VALUE = 2.1; // illustrative current-quarter GDP growth nowcast, % annualized
export const MACRO_BASE_BAND = 0.6; // percentage points

export const MACRO_CONTEXT = bl(
  "Official GDP numbers come out weeks after a quarter ends — by the time they're published, the quarter they describe is already old news. \"Nowcasting\" uses faster-moving signals (markets, surveys, mobility data) to estimate growth right now, before the official number exists.",
  'Official GDP/inflation/employment statistics publish with a multi-week lag, creating an information gap between what\'s happening and what can be measured. Nowcasting fills that gap with higher-frequency proxy data; central banks and the IMF now run econometric and ML nowcasts side-by-side.',
  'တရားဝင် GDP ကိန်းဂဏန်းတွေက သုံးလပတ်ပြီးမှ အပတ်အနည်းငယ်လောက် စောင့်ရတယ်။ ထုတ်ပြန်တဲ့အချိန်ရောက်တော့ ပြောနေတဲ့ သုံးလပတ်က ပြီးသွားပြီ။ "Nowcasting" က ပိုမြန်တဲ့ အချက်အလက်တွေ (စျေးကွက်၊ စစ်တမ်း၊ လှုပ်ရှားမှုဒေတာ) ကို သုံးပြီး ယခုလက်ရှိ ဖွံ့ဖြိုးတိုးတက်မှုကို ခန့်မှန်းတာဖြစ်တယ်။',
  'တရားဝင် GDP/ငွေကြေးဖောင်းပွမှု/အလုပ်အကိုင် ကိန်းဂဏန်းများသည် ရက်သတ္တပတ်များစွာ နှောင့်နှေးပြီးမှ ထုတ်ပြန်လေ့ရှိပြီး၊ "ဖြစ်ပျက်နေသည့်အရာ" နှင့် "တိုင်းတာနိုင်သည့်အရာ" ကြားတွင် သတင်းအချက်အလက်ကွာဟမှု ဖြစ်ပေါ်စေသည်။ Nowcasting သည် ထိုကွာဟချက်ကို ပိုမြန်သော proxy ဒေတာဖြင့် ဖြည့်ဆည်းပေးပြီး၊ ဗဟိုဘဏ်များနှင့် IMF တို့သည် ယခုအခါ econometric နှင့် ML nowcast များကို ယှဉ်တွဲလုပ်ဆောင်လေ့ရှိသည်။'
);

export const MACRO_DRIVERS = [
  {
    key: 'yieldCurve', coefficient: 0.35,
    label: blSame('Yield curve slope (10y−2y)', 'Bond Yield Curve အနားသတ် (10y−2y)'),
    relation: bl('Steeper/positive curve → healthy growth signal; inverted → recession warning', 'Positive — the most-cited leading indicator; inversion is the classic recession predictor', 'ချောမွေ့/အပေါင်း curve → ကျန်းမာသော ဖွံ့ဖြိုးမှု အချက်ပြ; ပြောင်းပြန်ဖြစ်လျှင် → စီးပွားပျက်ကပ် သတိပေးချက်', 'Positive — အများဆုံးကိုးကားခံရသော leading indicator; inversion သည် classic စီးပွားပျက်ကပ် ခန့်မှန်းကိရိယာဖြစ်သည်'),
  },
  {
    key: 'surveySentiment', coefficient: 0.30,
    label: blSame('Survey sentiment (PMI / confidence)', 'စစ်တမ်း စိတ်ခံစားမှု (PMI / ယုံကြည်မှု)'),
    relation: bl('Stronger business/consumer sentiment → nowcast rises', 'Positive — one of the doc\'s named high-frequency proxy categories', 'စီးပွားရေး/စားသုံးသူ စိတ်ခံစားမှု ပိုကောင်းလာ → nowcast တက်', 'Positive — ဆောင်းပါး၏ named high-frequency proxy category တစ်ခု'),
  },
  {
    key: 'laborMarket', coefficient: 0.30,
    label: blSame('Labor market strength', 'အလုပ်အကိုင်ဈေးကွက် အားကောင်းမှု'),
    relation: bl('Fewer jobless claims, stronger hiring → nowcast rises', 'Positive — a classic weekly high-frequency proxy for the (lagging) official employment report', 'အလုပ်လက်မဲ့ တောင်းဆိုမှု နည်းလာ၊ အလုပ်ခန့်အပ်မှု ပိုကောင်းလာ → nowcast တက်', 'Positive — (နှောင့်နှေးလေ့ရှိသော) တရားဝင် အလုပ်အကိုင် အစီရင်ခံစာအတွက် classic အပတ်စဉ် high-frequency proxy'),
  },
  {
    key: 'mobilityActivity', coefficient: 0.25,
    label: blSame('Mobility & spending activity', 'ခရီးသွားလာမှု နှင့် အသုံးစရိတ် လှုပ်ရှားမှု'),
    relation: bl('More card-spending and mobility/satellite activity → nowcast rises', 'Positive — the doc\'s "satellite/mobility data" proxy category, made concrete', 'ကတ်ဖြင့် အသုံးစရိတ် နှင့် ခရီးသွားလာမှု/ဂြိုဟ်တု လှုပ်ရှားမှု ပိုများလာ → nowcast တက်', 'Positive — ဆောင်းပါး၏ "ဂြိုဟ်တု/ခရီးသွားလာမှု ဒေတာ" proxy category ကို တိကျစွာ ဖော်ပြထားခြင်း'),
  },
  {
    key: 'tradeFreight', coefficient: 0.20,
    label: blSame('Trade & freight volume', 'ကုန်သွယ်မှု နှင့် ကုန်ပို့ ပမာဏ'),
    relation: bl('More shipping/freight throughput → nowcast rises', 'Positive — smallest weight here, but often the earliest-available signal of a demand shock', 'သင်္ဘောကုန်တင်/ကုန်ပို့ ပမာဏ ပိုများလာ → nowcast တက်', 'Positive — ဒီမှာ အလေးချိန်အနည်းဆုံးဖြစ်သော်လည်း chock တစ်ခု၏ အစောဆုံး ရရှိနိုင်သော signal ဖြစ်လေ့ရှိသည်'),
  },
];

export const MACRO_MODELS = [
  {
    key: 'dfm', name: blSame('Dynamic Factor Model (DFM)', 'Dynamic Factor Model (DFM)'),
    note: bl(
      "The classic approach — steady and structural, but slow to update: it trusts its underlying model more than any single new data point.",
      "Damped response (0.5×) and the narrowest, most stable band — reflects DFM's documented strength at backcasts (revising already-elapsed quarters), not fast-moving nowcasts.",
      'ရိုးရာနည်းလမ်း — တည်ငြိမ်ပြီး ဖွဲ့စည်းပုံအခြေခံသော်လည်း update လုပ်ရန် နှေးသည် — ၎င်း၏ underlying model ကို ဒေတာအသစ်တစ်ခုတည်းထက် ပိုယုံကြည်သည်။',
      'Damped response (0.5×) နှင့် အကျဉ်းဆုံး၊ အတည်ငြိမ်ဆုံး band — DFM ၏ backcast (ကုန်ဆုံးပြီးသား သုံးလပတ်များကို ပြန်လည်ပြင်ဆင်ခြင်း) တွင် အားကောင်းချက်ကို ထင်ဟပ်ပြီး၊ လျင်မြန်သော nowcast မဟုတ်ပါ။'
    ),
    color: '#8b5cf6',
  },
  {
    key: 'randomForest', name: blSame('Random Forest', 'Random Forest'),
    note: bl(
      'Reacts to every signal but each one saturates instead of piling up without limit — the most accurate all-rounder for nowcasts in real comparative studies, especially for inflation.',
      'Per-driver tanh saturation (split-based thresholding); band widens once any single signal turns extreme. Documented as most accurate for forecasts/nowcasts generally, and specifically the single most precise method for inflation.',
      'အချက်ပြမှုတိုင်းကို တုံ့ပြန်သော်လည်း တစ်ခုစီသည် အကန့်အသတ်မရှိ မတိုးဘဲ ရပ်တန့်သွားသည် — real-world comparative study များတွင် nowcast အတွက် အတိကျဆုံး all-rounder ဖြစ်ပြီး inflation ခန့်မှန်းရာတွင် အထူးအားကောင်းသည်။',
      'Driver တစ်ခုစီအတွက် tanh saturation (split-based thresholding); အချက်ပြမှုတစ်ခုခု အလွန်အမင်းဖြစ်လာလျှင် band ကျယ်လာသည်။ forecast/nowcast အတွက် ယေဘုယျအားဖြင့် အတိကျဆုံးဟု မှတ်တမ်းတင်ထားပြီး၊ inflation ခန့်မှန်းခြင်းအတွက် အတိကျဆုံးနည်းလမ်းအထူးဖြစ်သည်။'
    ),
    color: '#22d3ee',
  },
  {
    key: 'lassoElasticNet', name: blSame('LASSO / Elastic Net', 'LASSO / Elastic Net'),
    note: bl(
      'The simplest model here — just adds up the signals directly, no damping, no saturation. Often beats the fancier models when there\'s enough high-frequency data to work with.',
      'Full, undamped linear response — regularized linear regression, no structural anchoring or nonlinear shaping. Frequently outperforms both DFM and more complex ML when data is rich and high-frequency (see callout below).',
      'ဒီမှာအရိုးရှင်းဆုံး မော်ဒယ် — အချက်ပြမှုတွေကို တိုက်ရိုက်ပေါင်းလိုက်တာပဲ၊ damping မရှိ၊ saturation မရှိ။ high-frequency ဒေတာ လုံလောက်တဲ့အခါ ပိုရှုပ်ထွေးတဲ့ မော်ဒယ်တွေကို အောင်နိုင်လေ့ရှိတယ်။',
      'အပြည့်အဝ undamped linear response — regularized linear regression ဖြစ်ပြီး ဖွဲ့စည်းပုံအခြေပြု anchoring သို့မဟုတ် nonlinear shaping မရှိပါ။ ဒေတာ ကြွယ်ဝပြီး high-frequency ဖြစ်သောအခါ DFM နှင့် ပိုရှုပ်ထွေးသော ML နှစ်မျိုးလုံးကို မကြာခဏ ကျော်လွန်လေ့ရှိသည် (အောက်ပါ callout ကိုကြည့်ပါ)။'
    ),
    color: '#fbbf24',
  },
];

export const MACRO_SCENARIOS = [
  {
    id: 'curve-inverts', label: blSame('Yield curve inverts sharply', 'Yield Curve ပြင်းထန်စွာ ပြောင်းပြန်ဖြစ်'),
    state: { yieldCurve: -1.8, surveySentiment: -0.6, laborMarket: -0.2, mobilityActivity: -0.3, tradeFreight: -0.4 },
  },
  {
    id: 'broad-expansion', label: blSame('Broad-based expansion', 'ကျယ်ပြန့်သော ဖွံ့ဖြိုးတိုးတက်မှု'),
    state: { yieldCurve: 0.8, surveySentiment: 1.0, laborMarket: 1.2, mobilityActivity: 0.9, tradeFreight: 0.7 },
  },
  {
    id: 'soft-landing', label: blSame('Soft-landing signals', 'Soft-landing အချက်ပြမှုများ'),
    state: { yieldCurve: 0.2, surveySentiment: 0.5, laborMarket: 0.6, mobilityActivity: 0.1, tradeFreight: 0.1 },
  },
  {
    id: 'trade-mobility-shock', label: blSame('Trade & mobility shock', 'ကုန်သွယ်မှု နှင့် ခရီးသွားလာမှု Shock'),
    state: { yieldCurve: -0.3, surveySentiment: -0.4, laborMarket: 0, mobilityActivity: -1.6, tradeFreight: -1.7 },
  },
];

export const MACRO_TRACE_INTRO = bl(
  'Move any signal above, then check this panel — it shows exactly which one pushed the nowcast, in which direction, and by roughly how much.',
  "Per-driver percentage-point contribution to the linear-response baseline, sorted by magnitude — the same decomposition as Gold's trace panel, applied to the nowcast.",
  'အထက်ပါ အချက်ပြမှုတစ်ခုခုကို ရွှေ့ပြီး ဒီ panel ကို စစ်ကြည့်ပါ — ဘယ် signal က nowcast ကို ဘယ်ဘက်ကို ဘယ်လောက် တွန်းအားပေးလဲ တိတိကျကျ ပြသသည်။',
  'Linear-response baseline သို့ driver တစ်ခုစီ၏ ရာခိုင်နှုန်းအမှတ် contribution ကို ပမာဏအလိုက် စီထားသည် — ရွှေ trace panel နှင့် တူညီသော decomposition ကို nowcast တွင် အသုံးချထားသည်။'
);

export const MACRO_GAP_INTRO = bl(
  "Here's the actual problem nowcasting solves: by the time official GDP data for a quarter is published, that quarter is already over — and the next one is well underway.",
  'Official statistical releases lag the reference period by roughly a month or more; by publication, the described quarter has already ended. Nowcasting substitutes higher-frequency proxy data for the missing "hard" figures during that gap.',
  'Nowcasting က ဘာကို ဖြေရှင်းလဲဆိုတာ ဒီမှာ — သုံးလပတ်တစ်ခုရဲ့ တရားဝင် GDP ဒေတာ ထွက်လာချိန်မှာ ဒီသုံးလပတ်က ပြီးသွားပြီ — နောက်တစ်ခုက စလို့တောင် ရှိနေပြီ။',
  'တရားဝင် စာရင်းအင်း ထုတ်ပြန်ချက်များသည် ရည်ညွှန်းကာလထက် တစ်လခန့် (သို့မဟုတ် ပိုများ) နှောင့်နှေးလေ့ရှိပြီး၊ ထုတ်ပြန်ချိန်တွင် ဖော်ပြထားသော သုံးလပတ်သည် ပြီးဆုံးသွားပြီဖြစ်သည်။ Nowcasting သည် ထိုကွာဟချက်အတွင်း ပျောက်နေသော "တိကျသေချာသော" ကိန်းဂဏန်းအစား ပိုမြန်သော proxy ဒေတာကို အစားထိုးအသုံးပြုသည်။'
);

export const MACRO_GAP_LABELS = {
  quarterEnd: blSame('Quarter ends', 'သုံးလပတ် ပြီးဆုံး'),
  today: blSame('Today', 'ယနေ့'),
  officialRelease: blSame('Official GDP released (~4 weeks later)', 'တရားဝင် GDP ထုတ်ပြန် (~၄ ပတ်အကြာ)'),
  gapZone: blSame('Information gap', 'သတင်းအချက်အလက် ကွာဟမှု'),
  nowcastPin: blSame('Nowcast fills the gap', 'Nowcast က ကွာဟချက်ကို ဖြည့်ပေး'),
};

export const MACRO_SIMPLICITY_CALLOUT = bl(
  'Surprising but true: the simplest model on this page — LASSO/Elastic Net — often beats both the classic econometric model and the fancier machine-learning model, once there\'s enough fast-moving data feeding it. More complexity isn\'t automatically more accurate.',
  '"LASSO/Elastic Net (linear ML) frequently outperform more complex ML and traditional econometric models when data is rich and high-frequency — a great simplicity-wins teaching moment" — a documented finding in the nowcasting literature, not a fluke of this illustration.',
  'အံ့ဩစရာ ဒါပေမဲ့ မှန်တယ် — ဒီစာမျက်နှာမှာ အရိုးရှင်းဆုံး မော်ဒယ်ဖြစ်တဲ့ LASSO/Elastic Net သည် fast-moving ဒေတာ လုံလောက်စွာ ရရှိလာသည်နှင့် ရိုးရာ econometric မော်ဒယ်နှင့် ပိုရှုပ်ထွေးသော machine-learning မော်ဒယ် နှစ်မျိုးလုံးကို မကြာခဏ အနိုင်ယူလေ့ရှိသည်။ ပိုရှုပ်ထွေးလေ ပိုတိကျလေ မဟုတ်ပါ။',
  'ဒေတာ ကြွယ်ဝပြီး high-frequency ဖြစ်သောအခါ LASSO/Elastic Net (linear ML) သည် ရိုးရာ econometric မော်ဒယ်များနှင့် ပိုရှုပ်ထွေးသော ML နည်းလမ်းများ နှစ်မျိုးလုံးကို မကြာခဏ ကျော်လွန်လေ့ရှိသည် — ၎င်းသည် nowcasting သုတေသနစာပေတွင် ကောင်းစွာ မှတ်တမ်းတင်ထားသော "ရိုးရှင်းမှု အနိုင်ရ" ရလဒ်ဖြစ်ပြီး ဤသရုပ်ဖော်မှု၏ မတော်တဆမှု မဟုတ်ပါ။'
);

// Module 11 audit (see gold.js's identical note).
export const MACRO_PAGE_TITLE = blSame('Macro Economics Lab — Nowcasting', 'Macro စီးပွားရေး Lab — Nowcasting');
export const MACRO_GAP_SECTION_TITLE = blSame('The information gap', 'သတင်းအချက်အလက် ကွာဟမှု');
export const MACRO_SIGNALS_TITLE = blSame('High-frequency signals', 'High-frequency အချက်ပြမှုများ');
export const MACRO_MODELS_TITLE = blSame('Three models, three different jobs', 'မော်ဒယ် သုံးခု၊ အလုပ် သုံးမျိုး');
export const MACRO_MODELS_SUB = blSame(
  'Move a signal above and watch the nowcast move — but not by the same amount, or for the same reason.',
  'အထက်ပါ signal တစ်ခုကို ရွှေ့ပြီး nowcast ဘယ်လိုရွေ့လဲ ကြည့်ပါ — ပမာဏတူ၊ အကြောင်းရင်းတူ မဟုတ်ပါ။'
);
export const MACRO_TRACE_TITLE = blSame('Why did the nowcast move?', 'Nowcast ဒါက ဘာကြောင့် ရွေ့သွားတာလဲ?');
export const MACRO_SIMPLICITY_TITLE = blSame('Simplicity can win', 'ရိုးရှင်းမှုက အနိုင်ရနိုင်သည်');

// Learning Design System retrofit (Module 7): Constructive Thought Loop on
// the signals panel + one consolidated Depth Ladder whose Critical Frontier
// formalizes the "fancier isn't always better" moment the page already had
// informally (MACRO_SIMPLICITY_CALLOUT above, kept as-is on the page — this
// content extends rather than duplicates it). The worked example is
// computed from the exact computeMacroForecasts() formulas the chart above
// uses (yieldCurve=1.0, all else 0), independently re-derivable live.
export const MACRO_PREDICT_Q = blSame(
  'Push every signal to its strongest positive reading. Which model do you expect to be most accurate in the real world — the fanciest one, or the simplest one?',
  'Signal တိုင်းကို အပေါင်းဆုံး တန်ဖိုးဆီသို့ တွန်းပါ။ လက်တွေ့ကမ္ဘာမှာ ဘယ်မော်ဒယ်က အတိကျဆုံးဖြစ်လိမ့်မယ်လို့ မျှော်လင့်လဲ — ရှုပ်ထွေးဆုံးတစ်ခု၊ ဒါမှမဟုတ် ရိုးရှင်းဆုံးတစ်ခု?'
);
export const MACRO_PREDICT_FANCY = blSame(
  'The fanciest one (Random Forest) — more sophistication should mean more accuracy',
  'ရှုပ်ထွေးဆုံးတစ်ခု (Random Forest) — ပိုကျွမ်းကျင်လေ ပိုတိကျလေ ဖြစ်သင့်သည်'
);
export const MACRO_PREDICT_DEPENDS = blSame(
  'It depends — the simplest one (LASSO) sometimes wins when data is rich and high-frequency',
  'အခြေအနေပေါ် မူတည်သည် — ဒေတာ ကြွယ်ဝပြီး high-frequency ဖြစ်သောအခါ ရိုးရှင်းဆုံးတစ်ခု (LASSO) တစ်ခါတစ်ရံ အနိုင်ရသည်'
);
export const MACRO_PREDICT_EXPLAIN = blSame(
  "There's no universal winner visible in the chart alone — but the callout below the models explains why the answer is genuinely \"it depends,\" not a trick question.",
  'Chart တစ်ခုတည်းကြည့်ရုံနှင့် universal အနိုင်ရသူ မမြင်ရပါ — သို့သော် မော်ဒယ်များအောက်ရှိ callout က အဖြေက "အခြေအနေပေါ် မူတည်သည်" ဆိုတာ genuinely ဘာကြောင့်ဖြစ်သလဲ၊ လှည့်ဖျားမေးခွန်းမဟုတ်ကြောင်း ရှင်းပြသည်။'
);

export const MACRO_SPARK_ANALOGY = blSame(
  "A master chef with forty ingredients can make a worse dish than a home cook with five, if the chef adds ingredients that don't actually belong. More model complexity is the same bet: it only pays off if the extra machinery is capturing something real, not just extra noise.",
  'ပါရဂူ စားဖိုမှူးတစ်ဦးသည် ပါဝင်ပစ္စည်း ၄၀ ဖြင့် အိမ်တွင်းချက်တစ်ဦးထက် ဆိုးရွားသော ဟင်းလျာတစ်ခု ချက်နိုင်သည်၊ မလိုအပ်သော ပါဝင်ပစ္စည်း ထည့်လိုက်လျှင်။ Model complexity ပိုများခြင်းသည် လောင်းကစားတူညီသည် — extra machinery က real သောအရာကို ဖမ်းယူနေမှသာ အကျိုးရှိမည်၊ extra noise သာ ဖမ်းယူနေလျှင် မဟုတ်ပါ။'
);

export const MACRO_MECHANISM_NOTE = blSame(
  "You already ran this mechanism above — push any signal and all three models react from the identical driver state. Watch DFM's damped, cautious move versus LASSO's full, undamped one on the exact same push.",
  'အထက်ပါ mechanism ကို run လုပ်ပြီးသားပါ — signal တစ်ခုကို တွန်းလိုက်ပါ၊ မော်ဒယ်သုံးခုစလုံးသည် driver state တူညီမှ တုံ့ပြန်သည်။ DFM ၏ damped, သတိထားသော ရွေ့လျားမှုကို LASSO ၏ တွန်းအားတူညီပေါ်ရှိ full, undamped ရွေ့လျားမှုနှင့် နှိုင်းယှဉ်ကြည့်ပါ။'
);

export const MACRO_FORMALISM_WORKED = bl(
  "Worked example: push yield curve to 1.0 (coefficient +0.35), everything else at 0. Linear baseline = +0.35pp. DFM's 0.5× damping gives +0.175pp; LASSO takes the full, undamped +0.35pp; Random Forest's tanh saturation lands at roughly +0.28pp — between the two. With only one signal active, LASSO isn't \"cutting corners,\" it's just not damping or saturating a response the data may genuinely warrant.",
  "Worked example: push yield curve to 1.0 (coefficient +0.35), everything else at 0. Linear baseline = +0.35pp. DFM's 0.5× damping gives +0.175pp; LASSO takes the full, undamped +0.35pp; Random Forest's tanh saturation lands at roughly +0.28pp — between the two. With only one signal active, LASSO isn't \"cutting corners,\" it's just not damping or saturating a response the data may genuinely warrant.",
  'ဖြေရှင်းချက်ဥပမာ: yield curve ကို 1.0 (coefficient +0.35) သို့ တွန်းပါ၊ ကျန်တာအားလုံး 0။ Linear baseline = +0.35pp။ DFM ၏ 0.5× damping က +0.175pp ပေးသည်; LASSO က full, undamped +0.35pp ယူသည်; Random Forest ၏ tanh saturation သည် ခန့်မှန်း +0.28pp ရောက်သည် — နှစ်ခုကြားတွင်။ Signal တစ်ခုတည်းသာ active ဖြစ်နေစဉ်၊ LASSO သည် "အတိုကောက်လုပ်" နေခြင်း မဟုတ်ပါ၊ ဒေတာက တကယ်ခွင့်ပြုနိုင်သော တုံ့ပြန်မှုကို damping (သို့) saturation မလုပ်ခြင်းသာဖြစ်သည်။',
  'ဖြေရှင်းချက်ဥပမာ: yield curve ကို 1.0 (coefficient +0.35) သို့ တွန်းပါ၊ ကျန်တာအားလုံး 0။ Linear baseline = +0.35pp။ DFM ၏ 0.5× damping က +0.175pp ပေးသည်; LASSO က full, undamped +0.35pp ယူသည်; Random Forest ၏ tanh saturation သည် ခန့်မှန်း +0.28pp ရောက်သည် — နှစ်ခုကြားတွင်။ Signal တစ်ခုတည်းသာ active ဖြစ်နေစဉ်၊ LASSO သည် "အတိုကောက်လုပ်" နေခြင်း မဟုတ်ပါ၊ ဒေတာက တကယ်ခွင့်ပြုနိုင်သော တုံ့ပြန်မှုကို damping (သို့) saturation မလုပ်ခြင်းသာဖြစ်သည်။'
);
export const MACRO_FORMALISM_FADED = blSame(
  'Now you try: set every signal to 1.0 at once (a "broad-based expansion"). Step 1 — what\'s the simple sum of all five coefficients (the LASSO/undamped answer)? Step 2 — will DFM\'s damped answer be closer to or further from that sum than it was with only one signal active, and why: _____.',
  'အခု သင့်အလှည့်: signal ငါးခုလုံးကို 1.0 တစ်ပြိုင်နက်ထား ("broad-based expansion")။ အဆင့် ၁ — coefficient ငါးခု၏ ရိုးရှင်းသော ပေါင်းလဒ် (LASSO/undamped အဖြေ) ဘယ်လောက်လဲ? အဆင့် ၂ — DFM ၏ damped အဖြေသည် signal တစ်ခုတည်းသာ active ဖြစ်စဉ်ကထက် ထိုပေါင်းလဒ်နှင့် ပိုနီးမလား ပိုဝေးမလား၊ ဘာကြောင့်လဲ: _____။'
);

export const MACRO_CF_ANALOGY_BREAK = blSame(
  "The chef analogy breaks down on measurability: a bad ingredient ruins a dish in a way every diner can taste immediately. A model that's \"too fancy\" for its data doesn't announce itself — it can look impressively sophisticated in a demo and only reveal its overfitting months later, on data it hasn't seen yet. That's exactly why this simplicity finding required real comparative studies to establish, not a single convincing-looking example.",
  'စားဖိုမှူး ဆင်တူပုံရိပ်သည် တိုင်းတာနိုင်မှုတွင် ပျက်စီးသည်: ပါဝင်ပစ္စည်း ဆိုးတစ်ခုသည် စားသုံးသူတိုင်း ချက်ချင်း မြည်းစမ်းနိုင်သည့်ပုံစံဖြင့် ဟင်းလျာကို ဖျက်စီးသည်။ ၎င်း၏ data အတွက် "ရှုပ်ထွေးလွန်း" သော မော်ဒယ်တစ်ခုသည် ကိုယ်တိုင် ကြေညာသွားခြင်း မရှိပါ — demo တစ်ခုတွင် ရှုပ်ထွေးစွာ ခန့်ညားစွာ မြင်ရနိုင်ပြီး၊ မမြင်ဖူးသေးသော data ပေါ်တွင် လများကြာမှသာ ၎င်း၏ overfitting ကို ဖော်ပြလိမ့်မည်။ ဒါကြောင့်ပဲ ဒီရိုးရှင်းမှု ရလဒ်ကို တည်ထောင်ရန် real comparative study များ လိုအပ်ခဲ့ခြင်းဖြစ်ပြီး၊ စိတ်ဝင်စားဖွယ် ဥပမာတစ်ခုတည်းနှင့် မဟုတ်ပါ။'
);
export const MACRO_CF_CAVEAT = blSame(
  'A real caveat: "simplicity can win" is not "simplicity always wins." The callout above is specific — LASSO tends to outperform when data is rich and high-frequency. With scarce or noisy data, DFM\'s structural anchoring and caution are exactly what keeps it from chasing noise the way an undamped linear model might.',
  'တကယ့် caveat: "ရိုးရှင်းမှုက အနိုင်ရနိုင်သည်" ဆိုသည်မှာ "ရိုးရှင်းမှုက အမြဲအနိုင်ရသည်" မဟုတ်ပါ။ အထက်ပါ callout သည် တိကျသည် — ဒေတာ ကြွယ်ဝပြီး high-frequency ဖြစ်သောအခါ LASSO က ပိုကောင်းလေ့ရှိသည်။ ဒေတာ ရှားပါး (သို့) noise များသောအခါ DFM ၏ structural anchoring နှင့် သတိထားမှုသည် undamped linear model တစ်ခုကဲ့သို့ noise ကို လိုက်ဖမ်းမနေအောင် တားဆီးပေးသည့်အရာအတိအကျဖြစ်သည်။'
);
export const MACRO_CF_RETRIEVAL_Q = blSame(
  'A colleague says "always use the most complex model available, it can only help." What is the one-sentence rebuttal this page supports?',
  'လုပ်ဖော်ကိုင်ဖက်တစ်ဦးက "ရနိုင်သမျှ အရှုပ်ထွေးဆုံးမော်ဒယ်ကို အမြဲသုံးပါ၊ ကူညီရုံသာရှိမည်" ဟုပြောသည်။ ဒီစာမျက်နှာက ထောက်ခံသော တစ်ကြောင်းတည်း ငြင်းချက်က ဘာလဲ?'
);
export const MACRO_CF_RETRIEVAL_A = blSame(
  "More complexity only helps if the extra machinery captures a real pattern the data actually contains — otherwise it's just extra capacity to overfit noise, which is exactly why the simplest model here (LASSO) frequently outperforms both the classic econometric model and the fancier ML model in real nowcasting comparisons.",
  'Complexity ပိုများခြင်းသည် extra machinery က data တွင် တကယ်ပါဝင်သော pattern တစ်ခုကို ဖမ်းယူမှသာ ကူညီသည် — မဟုတ်လျှင် noise ကို overfit လုပ်ရန် extra capacity သာဖြစ်သည်၊ ဒါကြောင့်ပဲ ဒီနေရာမှာ အရိုးရှင်းဆုံးမော်ဒယ် (LASSO) သည် real nowcasting comparison များတွင် ရိုးရာ econometric မော်ဒယ်နှင့် ပိုရှုပ်ထွေးသော ML မော်ဒယ် နှစ်မျိုးလုံးကို မကြာခဏ ကျော်လွန်လေ့ရှိသည်။'
);
