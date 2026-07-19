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
