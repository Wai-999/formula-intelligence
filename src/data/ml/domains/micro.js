import { bl, blSame } from '../../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §6.3. The reference price/
// quantity/elasticity are illustrative (no specific real product or
// reported elasticity value is cited in the doc for this section, unlike
// Gold's §6.1 figures) — see src/features/ml/micro/demandModel.js for the
// mechanisms these numbers exist to demonstrate.
export const MICRO_CONTEXT = bl(
  "Cut a product's price and you'll usually sell more of it — but by how much, exactly? The classic answer assumes a smooth, constant relationship. Real demand is messier: promotions, seasonality, and psychological price points ($14.99 vs $15.00) all bend the curve in ways the classic model can't see.",
  'Classic log-log regression estimates a single constant elasticity coefficient, implicitly assuming a smooth power-law relationship between price and quantity everywhere. ML models (gradient boosting, deep feed-forward nets) incorporate promotions, seasonality, and nonlinear/non-monotonic effects the econometric baseline assumes away.',
  'ကုန်ပစ္စည်းတစ်ခု၏ဈေးနှုန်းကို လျှော့ချလိုက်ရင် ပုံမှန်အားဖြင့် ပိုရောင်းရလေ့ရှိတယ် — ဒါပေမဲ့ ဘယ်လောက်လဲ တိတိကျကျ? ရိုးရာအဖြေက ချောမွေ့ပြီး တည်ငြိမ်တဲ့ဆက်နွယ်မှုကို ယူဆထားတယ်။ တကယ့်လက်တွေ့ demand ကတော့ ပိုရှုပ်ထွေးတယ် — ပရိုမိုးရှင်း၊ ရာသီအလိုက်ပြောင်းလဲမှု၊ စိတ်ပိုင်းဆိုင်ရာ ဈေးနှုန်း ($14.99 vs $15.00) တို့က ရိုးရာမော်ဒယ် မမြင်နိုင်တဲ့ပုံစံနဲ့ curve ကို ကွေးစေတယ်။',
  'Classic log-log regression သည် ဈေးနှုန်းနှင့်ပမာဏကြား ချောမွေ့သော power-law ဆက်နွယ်မှုတစ်ခုကို ယူဆကာ constant elasticity coefficient တစ်ခုတည်းကို ခန့်မှန်းသည်။ ML မော်ဒယ်များ (gradient boosting, deep feed-forward nets) သည် econometric baseline က assume away လုပ်ထားသော promotion၊ ရာသီအလိုက်ပြောင်းလဲမှုနှင့် nonlinear/non-monotonic effect များကို ထည့်သွင်းစဉ်းစားသည်။'
);

export const MICRO_MODELS = [
  {
    key: 'econLogLog', name: blSame('Log-Log Regression (constant elasticity)', 'Log-Log Regression (constant elasticity)'),
    color: '#8b5cf6',
    note: bl(
      'The textbook model — assumes the same % relationship between price and demand everywhere. Clean and interpretable, but blind to promotions, seasonality, and psychological price points.',
      'Fits a single constant elasticity coefficient across the entire price range; the fitted curve is a smooth, unbroken power law by construction — mathematically incapable of representing a threshold effect or a covariate it was never given.',
      'သင်ခန်းစာအုပ်ထဲက မော်ဒယ် — ဈေးနှုန်းနှင့် demand ကြား ရာခိုင်နှုန်းဆက်နွယ်မှု တစ်နေရာလုံးတွင် တူညီသည်ဟု ယူဆသည်။ ရှင်းလင်းပြီး နားလည်ရလွယ်သော်လည်း ပရိုမိုးရှင်း၊ ရာသီအလိုက်ပြောင်းလဲမှု၊ စိတ်ပိုင်းဆိုင်ရာ ဈေးနှုန်းအမှတ်များကို မမြင်ပါ။',
      'ဈေးနှုန်းအပိုင်းအခြားတစ်ခုလုံးတွင် constant elasticity coefficient တစ်ခုတည်းကို fit လုပ်သည်; fitted curve သည် ဖွဲ့စည်းပုံအရ ချောမွေ့ပြီး မပြတ်တောက်သော power law ဖြစ်သည် — threshold effect သို့မဟုတ် ၎င်းအား မပေးထားသော covariate တစ်ခုကို ကိန်းဂဏန်းအရ ကိုယ်စားပြု၍မရနိုင်ပါ။'
    ),
  },
  {
    key: 'gradientBoost', name: blSame('Gradient Boosting', 'Gradient Boosting'),
    color: '#22d3ee',
    note: bl(
      'Learns whatever shape the data actually shows — including demand ceilings, price-point cliffs, and how much a promotion really moves the needle.',
      'Split-based thresholding captures the charm-pricing step and saturation ceiling directly from data structure; promotion/seasonality enter as ordinary features, so their effect is learned rather than assumed away. Leading approach for markdown optimization and demand forecasting in retail.',
      'ဒေတာက တကယ်ပြသနေတဲ့ ပုံသဏ္ဍာန်ကို ဘာပဲဖြစ်ဖြစ် သင်ယူသည် — demand အမြင့်ဆုံးအကန့်အသတ်၊ ဈေးနှုန်း cliff များ၊ ပရိုမိုးရှင်းက တကယ်ဘယ်လောက်အထိ သက်ရောက်မှုရှိသလဲဆိုတာအထိ ပါဝင်သည်။',
      'Split-based thresholding သည် charm-pricing step နှင့် saturation ceiling ကို ဒေတာဖွဲ့စည်းပုံမှ တိုက်ရိုက်ရယူသည်; promotion/seasonality သည် သာမန် feature များအဖြစ် ဝင်ရောက်လာသဖြင့် ၎င်းတို့၏ သက်ရောက်မှုကို assume away မလုပ်ဘဲ သင်ယူသည်။ retail တွင် markdown optimization နှင့် demand forecasting အတွက် ဦးဆောင်နည်းလမ်းဖြစ်သည်။'
    ),
  },
];

export const MICRO_GAP_LABELS = {
  saturation: { label: blSame('Demand ceiling (market saturates)', 'Demand အမြင့်ဆုံးအကန့်အသတ် (စျေးကွက် ပြည့်ဝမှု)') },
  charmThreshold: { label: blSame('Psychological price point ($15.00)', 'စိတ်ပိုင်းဆိုင်ရာ ဈေးနှုန်းအမှတ် ($15.00)') },
  promo: { label: blSame('Promotion active', 'ပရိုမိုးရှင်း လုပ်ဆောင်နေဆဲ') },
  season: { label: blSame('Peak season', 'အထွက်နှုန်းအမြင့်ဆုံး ရာသီ') },
};

export const MICRO_SCENARIOS = [
  {
    id: 'below-charm', label: blSame('Just below the charm threshold', 'Charm Threshold အောက်ကပဲ'),
    state: { price: 14.99, promoOn: 0, peakSeason: 0 },
  },
  {
    id: 'above-charm', label: blSame('Just above the charm threshold', 'Charm Threshold အထက်ကို ကျော်'),
    state: { price: 15.49, promoOn: 0, peakSeason: 0 },
  },
  {
    id: 'discount-promo', label: blSame('Deep discount + promo blitz', 'ဈေးနှုန်း လျှော့ချမှုကြီး + ပရိုမိုးရှင်း'),
    state: { price: 9.99, promoOn: 1, peakSeason: 0 },
  },
  {
    id: 'peak-premium', label: blSame('Peak season, premium price', 'အထွက်နှုန်းအမြင့်ဆုံးရာသီ၊ ဈေးနှုန်းမြင့်'),
    state: { price: 18.99, promoOn: 0, peakSeason: 1 },
  },
];

export const MICRO_TRACE_INTRO = bl(
  'This is why the two curves disagree at the current price — each row is one mechanism the gradient-boosted model captures that log-log regression structurally cannot.',
  'Additive decomposition of the ML curve\'s construction (saturation cap → charm-price step → promotion → seasonality), in units relative to the log-log baseline at the same price.',
  'ဒါက curve နှစ်ခု ယခုဈေးနှုန်းမှာ ဘာကြောင့် သဘောထားကွဲလွဲနေလဲဆိုတာ — တစ်တန်းစီက log-log regression ဖွဲ့စည်းပုံအရ လုံးဝမမီနိုင်တဲ့ gradient-boosted မော်ဒယ်၏ mechanism တစ်ခုစီဖြစ်သည်။',
  'ML curve ၏ ဖွဲ့စည်းတည်ဆောက်မှု (saturation cap → charm-price step → promotion → seasonality) ကို တူညီသောဈေးနှုန်းတွင် log-log baseline နှင့် နှိုင်းယှဉ်ကာ ယူနစ်များဖြင့် ပေါင်းစပ်ဖြင့်ခွဲခြမ်းစိတ်ဖြာထားသည်။'
);

export const MICRO_PRICE_LABEL = blSame('Price', 'ဈေးနှုန်း');
export const MICRO_PROMO_LABEL = blSame('Promotion active', 'ပရိုမိုးရှင်း လုပ်ဆောင်နေဆဲ');
export const MICRO_SEASON_LABEL = blSame('Peak season', 'အထွက်နှုန်းအမြင့်ဆုံး ရာသီ');

// Module 11 audit (see gold.js's identical note).
export const MICRO_PAGE_TITLE = blSame('Micro Economics Lab — Price Elasticity', 'Micro စီးပွားရေး Lab — ဈေးနှုန်း Elasticity');
export const MICRO_PRICE_SECTION_TITLE = blSame('Set the price', 'ဈေးနှုန်း သတ်မှတ်ပါ');
export const MICRO_MODELS_TITLE = blSame('Two models, one price axis', 'မော်ဒယ် နှစ်ခု၊ ဈေးနှုန်း axis တစ်ခု');
export const MICRO_MODELS_SUB = blSame(
  'The dashed line assumes one constant % relationship everywhere. The solid line learns whatever shape the data actually has.',
  'အစက်ရွေးမျဉ်းက ရာခိုင်နှုန်းဆက်နွယ်မှု တစ်နေရာလုံးတွင် တူညီသည်ဟု ယူဆသည်။ အမြဲမျဉ်းက ဒေတာ၏ တကယ့်ပုံသဏ္ဍာန်ကို သင်ယူသည်။'
);
export const MICRO_TRACE_TITLE = blSame('Why do the curves disagree here?', 'ဒီနေရာမှာ curve တွေ ဘာကြောင့် သဘောထားကွဲနေတာလဲ?');

// Found during the same verification pass as the note above: DemandCurveChart's
// own SVG y-axis title, missed by the file-by-file audit since it's a bespoke
// chart component's internal text, not page chrome.
export const MICRO_UNITS_LABEL = blSame('units/week', 'unit/အပတ်');

// Learning Design System retrofit (Module 8): the mission's "predict-the-
// curve-shape" exercise gates the chart section itself (not the price
// slider) since the shape is what's being predicted, not the price choice.
// The worked example is computed from the real demandModel.js functions at
// $14.99 vs $15.49 (the page's own below/above-charm scenario presets) —
// independently re-derivable by applying those two presets and reading the
// trace panel.
export const MICRO_PREDICT_Q = blSame(
  'Before you look at the chart below: will the gradient-boosting model\'s demand curve be one smooth line like the econometric model, or will it show a visible kink somewhere?',
  'အောက်ပါ chart ကို မကြည့်ခင်: gradient-boosting မော်ဒယ်၏ demand curve သည် econometric မော်ဒယ်ကဲ့သို့ မျဉ်းချောတစ်ခုတည်း ဖြစ်မလား၊ ဒါမှမဟုတ် တစ်နေရာရာတွင် မြင်သာသော kink ပြမလား?'
);
export const MICRO_PREDICT_SMOOTH = blSame(
  'One smooth line, just like the econometric model',
  'econometric မော်ဒယ်ကဲ့သို့ပင် မျဉ်းချောတစ်ခုတည်း'
);
export const MICRO_PREDICT_KINK = blSame(
  "A visible kink — real-world demand isn't perfectly smooth",
  'မြင်သာသော kink တစ်ခု — လက်တွေ့ demand သည် လုံးဝ ချောမွေ့သည် မဟုတ်ပါ'
);
export const MICRO_PREDICT_EXPLAIN = blSame(
  'Try the "Just below the charm threshold" and "Just above" scenario presets back to back and watch the solid ML line specifically — it steps down right at $15.00 while the dashed econometric line just keeps gliding smoothly through the same point.',
  '"Charm Threshold အောက်ကပဲ" နှင့် "Charm Threshold အထက်ကို ကျော်" scenario preset များကို အဆက်တိုက် စမ်းကြည့်ပြီး ML မျဉ်းအမြဲကို အထူးကြည့်ပါ — $15.00 တွင် အတိအကျ step ကျသွားပြီး econometric မျဉ်းက အစက်ရွေးမျဉ်းသည် တူညီသောအမှတ်ကို ချောမွေ့စွာ ဆက်ရွေ့နေသည်။'
);

export const MICRO_SPARK_ANALOGY = bl(
  "A thermometer reads temperature smoothly, degree by degree — but a light switch doesn't dim gradually, it's off, then suddenly on. Some real-world relationships are thermometers; others are light switches. The question is never which model is fancier, it's which shape actually matches the thing you're modeling.",
  'သာမိတာသည် အပူချိန်ကို ဒီဂရီအလိုက် ချောမွေ့စွာ ဖတ်ပေးသည် — သို့သော် မီးခလုတ်တစ်ခုသည် တဖြည်းဖြည်း မမှိန်ပါ၊ ပိတ်၊ ပြီးရင် ရုတ်တရက် ဖွင့်သည်။ လက်တွေ့ဆက်နွယ်မှု အချို့သည် သာမိတာများဖြစ်ပြီး အချို့ကတော့ မီးခလုတ်များဖြစ်သည်။ ဘယ်မော်ဒယ်က ပိုချောမွေ့လဲ ဆိုသည့်မေးခွန်းမဟုတ်ဘဲ၊ ဘယ်ပုံသဏ္ဍာန်က သင် model လုပ်နေသောအရာနှင့် တကယ်ကိုက်ညီလဲဆိုသည့်မေးခွန်းသာဖြစ်သည်။'
);

export const MICRO_MECHANISM_NOTE = blSame(
  "You already ran this mechanism above — every price you set and every toggle you flip redraws both curves live from the same demand math. Scrub price across $15.00 slowly and watch only the solid ML line react.",
  'အထက်ပါ mechanism ကို run လုပ်ပြီးသားပါ — သင်သတ်မှတ်သော ဈေးနှုန်းနှင့် toggle တိုင်းသည် curve နှစ်ခုစလုံးကို demand math တူညီမှ live ပြန်ဆွဲသည်။ ဈေးနှုန်းကို $15.00 ဖြတ်၍ နှေးကွေးစွာ ဆွဲကြည့်ပြီး ML မျဉ်းသာ တုံ့ပြန်ပုံကို ကြည့်ပါ။'
);

export const MICRO_FORMALISM_WORKED = bl(
  'Worked example: at $14.99 (the reference price), both models agree exactly — 500 units. Move to $15.49 (the "above-charm" preset): the smooth elasticity decline alone would put log-log at ≈471 units, but crossing $15.00 triggers the ML model\'s extra 12% step-down, landing it at ≈415 units — a real ≈56-unit gap that exists ONLY because of the threshold, on top of the elasticity drop both models already agree on.',
  'Worked example: at $14.99 (the reference price), both models agree exactly — 500 units. Move to $15.49 (the "above-charm" preset): the smooth elasticity decline alone would put log-log at ≈471 units, but crossing $15.00 triggers the ML model\'s extra 12% step-down, landing it at ≈415 units — a real ≈56-unit gap that exists ONLY because of the threshold, on top of the elasticity drop both models already agree on.',
  'ဖြေရှင်းချက်ဥပမာ: $14.99 (reference price) တွင် မော်ဒယ်နှစ်ခုစလုံး အတိအကျ သဘောတူသည် — unit 500။ $15.49 ("above-charm" preset) သို့ ရွှေ့ပါ: ချောမွေ့သော elasticity ကျဆင်းမှုတစ်ခုတည်းက log-log ကို ≈471 units ရောက်စေမည်၊ သို့သော် $15.00 ကို ဖြတ်ကျော်ခြင်းက ML မော်ဒယ်၏ အပို 12% step-down ကို လှုံ့ဆော်ပြီး ≈415 units ရောက်စေသည် — threshold ကြောင့်သာ ရှိနေသော real ≈56-unit ကွာဟမှုတစ်ခု၊ မော်ဒယ်နှစ်ခုစလုံး သဘောတူပြီးသား elasticity ကျဆင်းမှုအပေါ် ထပ်ပေါင်းထားသည်။',
  'ဖြေရှင်းချက်ဥပမာ: $14.99 (reference price) တွင် မော်ဒယ်နှစ်ခုစလုံး အတိအကျ သဘောတူသည် — unit 500။ $15.49 ("above-charm" preset) သို့ ရွှေ့ပါ: ချောမွေ့သော elasticity ကျဆင်းမှုတစ်ခုတည်းက log-log ကို ≈471 units ရောက်စေမည်၊ သို့သော် $15.00 ကို ဖြတ်ကျော်ခြင်းက ML မော်ဒယ်၏ အပို 12% step-down ကို လှုံ့ဆော်ပြီး ≈415 units ရောက်စေသည် — threshold ကြောင့်သာ ရှိနေသော real ≈56-unit ကွာဟမှုတစ်ခု၊ မော်ဒယ်နှစ်ခုစလုံး သဘောတူပြီးသား elasticity ကျဆင်းမှုအပေါ် ထပ်ပေါင်းထားသည်။'
);
export const MICRO_FORMALISM_FADED = blSame(
  'Now you try: apply the "Deep discount + promo blitz" preset ($9.99, promo on). Step 1 — at a price this far below the charm threshold, does the step-down effect apply at all? Step 2 — which single toggle do you expect to produce the biggest gap between the two curves at this price, and why: _____. Check the trace panel to confirm.',
  'အခု သင့်အလှည့်: "ဈေးနှုန်း လျှော့ချမှုကြီး + ပရိုမိုးရှင်း" preset ($9.99, promo on) ကို အသုံးချပါ။ အဆင့် ၁ — charm threshold အောက် ဒီလောက်ဝေးသော ဈေးနှုန်းတွင် step-down effect အသုံးချမလား? အဆင့် ၂ — ဒီဈေးနှုန်းတွင် curve နှစ်ခုကြား အကွာဟကြီးဆုံး ဖြစ်စေမည့် toggle တစ်ခုတည်းက ဘယ်ဟာလဲ၊ ဘာကြောင့်လဲ: _____။ trace panel ဖြင့် အတည်ပြုပါ။'
);

export const MICRO_CF_ANALOGY_BREAK = blSame(
  "The thermometer/light-switch analogy breaks down on certainty: a real light switch either is or isn't wired to a specific voltage, no ambiguity. A $15.00 psychological threshold is a genuine pattern in real purchase data, but it's a soft behavioral regularity, not a law of physics — the exact threshold, and whether it holds at all, can shift by product, market, and time period in ways a light switch never does.",
  'သာမိတာ/မီးခလုတ် ဆင်တူပုံရိပ်သည် သေချာမှုတွင် ပျက်စီးသည်: တကယ့် မီးခလုတ်သည် voltage အတိအကျတစ်ခုနှင့် ဆက်သွယ်ထား၊ မထားဆိုတာ ရှင်းရှင်းလင်းလင်းရှိသည်။ $15.00 စိတ်ပိုင်းဆိုင်ရာ threshold သည် တကယ့် ဝယ်ယူမှု ဒေတာတွင် စစ်မှန်သော pattern တစ်ခုဖြစ်သော်လည်း ရူပဗေဒ ဥပဒေ မဟုတ်ဘဲ ပျော့ပျောင်းသော ကျင့်ဝတ် regularity တစ်ခုဖြစ်သည် — threshold အတိအကျ၊ ၎င်းရှိမရှိပင် ကုန်ပစ္စည်း၊ ဈေးကွက်နှင့် ကာလအလိုက် မီးခလုတ်တစ်ခုလို ဘယ်တော့မှ မဖြစ်နိုင်သော ပုံစံဖြင့် ပြောင်းလဲနိုင်သည်။'
);
export const MICRO_CF_CAVEAT = blSame(
  'A real caveat: a model flexible enough to fit a real kink is also flexible enough to fit a fake one — a small, noisy dataset can show what looks exactly like a charm-price step at some price point purely by chance. The gradient-boosting model here is shown a threshold that genuinely exists in this synthetic data by construction; on messy real data, confirming a kink is real (not noise) takes more evidence than one convincing-looking chart.',
  'တကယ့် caveat: တကယ့် kink ကို fit လုပ်နိုင်လောက်အောင် flexible ဖြစ်သော မော်ဒယ်တစ်ခုသည် အတု kink တစ်ခုကိုလည်း fit လုပ်နိုင်လောက်အောင် flexible ဖြစ်သည် — သေးငယ်၊ noise ရှိသော dataset တစ်ခုသည် ကံအားလျော်စွာသာ charm-price step နှင့် အတိအကျ တူညီသည့်အရာကို ဈေးနှုန်းတစ်ခုတွင် ပြနိုင်သည်။ ဒီနေရာမှာ gradient-boosting မော်ဒယ်ကို ဒီ synthetic data တွင် ဖွဲ့စည်းပုံအရ တကယ်ရှိသော threshold တစ်ခု ပြထားခြင်းဖြစ်သည်; ရှုပ်ထွေးသော real data တွင် kink တစ်ခုသည် တကယ်ဖြစ်ကြောင်း (noise မဟုတ်ကြောင်း) အတည်ပြုရန် ချောမွေ့စွာ ကြည့်ကောင်းသော chart တစ်ခုထက် ပိုသော သက်သေအထောက်အထား လိုအပ်သည်။'
);
export const MICRO_CF_RETRIEVAL_Q = blSame(
  'Without looking back: why can\'t the log-log regression model ever represent the $15.00 step, no matter how much data you give it?',
  'ပြန်မကြည့်ဘဲ: log-log regression မော်ဒယ်သည် ဒေတာ မည်မျှပေးထားစေကာမူ $15.00 step ကို ဘာကြောင့် ဘယ်တော့မှ ကိုယ်စားပြု၍မရနိုင်သလဲ?'
);
export const MICRO_CF_RETRIEVAL_A = blSame(
  "It's not a data problem, it's a structural one: log-log regression is built to fit a single smooth power-law curve by construction, so no amount of additional data can make it draw a discontinuous jump — the model family itself doesn't contain that shape. Only a model flexible enough to represent thresholds (like the gradient-boosted tree here) can ever capture one, regardless of how much data either model sees.",
  'ဒါက data ပြဿနာ မဟုတ်ပါ၊ structural ပြဿနာဖြစ်သည်: log-log regression သည် ဖွဲ့စည်းပုံအရ မျဉ်းချော power-law curve တစ်ခုတည်းကိုသာ fit လုပ်ရန် တည်ဆောက်ထားသဖြင့် ဒေတာ မည်မျှထပ်ပေးစေကာမူ discontinuous jump ကို ဆွဲ၍မရနိုင်ပါ — model family ကိုယ်တိုင်တွင် ထိုပုံသဏ္ဍာန် မပါဝင်ပါ။ threshold များကို ကိုယ်စားပြုနိုင်လောက်အောင် flexible ဖြစ်သော မော်ဒယ် (ဒီနေရာမှ gradient-boosted tree ကဲ့သို့) သာလျှင် ဒေတာ မည်မျှတွေ့သည်ဖြစ်စေ ၎င်းကို ဖမ်းယူနိုင်မည်ဖြစ်သည်။'
);
