import { bl, blSame } from '../../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §6.4. All numeric weights/
// scales in politicsModel.js are illustrative — the doc describes the
// *mechanisms* (hierarchical Bayesian blending of polls+fundamentals that
// reweights over time; a composite risk index feeding into asset prices)
// without a specific reference election or a numeric risk-index formula to
// cite. The Stats-mode cross-reference below points to real, verified
// content (Chapter 14: Monte Carlo) — checked against src/data/chapters.js
// and src/data/nodes.js rather than assumed.
export const POLITICS_CONTEXT = bl(
  'Two very different forecasting problems live under one roof here: predicting who wins an election, and scoring how risky the world looks right now. Both blend structured data with judgment calls under uncertainty — and the second one feeds directly into the gold price lab you already saw.',
  'Election forecasting and geopolitical risk scoring share a common structure — combining heterogeneous signals into a single probabilistic estimate — but serve different purposes. The geopolitical risk index specifically feeds forward into asset-price models, demonstrated below via a live link to the Gold lab.',
  'ဒီနေရာမှာ ကွာခြားတဲ့ ခန့်မှန်းမှုပြဿနာနှစ်ခု ရှိတယ် — ရွေးကောက်ပွဲ ဘယ်သူနိုင်မလဲဆိုတာ ခန့်မှန်းခြင်းနှင့် ယခုကမ္ဘာက ဘယ်လောက်အန္တရာယ်များနေလဲဆိုတာ အမှတ်ပေးခြင်း။ နှစ်ခုစလုံးက ဖွဲ့စည်းထားသော ဒေတာနှင့် မသေချာမှုအောက်မှာ ဆုံးဖြတ်ချက်ချရသည်ကို ပေါင်းစပ်ထားသည် — ဒုတိယအချက်က သင်တွေ့ခဲ့ပြီးသား ရွှေဈေးနှုန်း lab ထဲကို တိုက်ရိုက်ဝင်သွားသည်။',
  'ရွေးကောက်ပွဲ ခန့်မှန်းခြင်းနှင့် ပထဝီရေးအန္တရာယ် အမှတ်ပေးခြင်းတို့သည် ဆက်စပ်ပုံစံတူညီသည် — ကွဲပြားသော signal များကို probabilistic estimate တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ခြင်း — သို့သော် ရည်ရွယ်ချက်ကွဲပြားသည်။ ပထဝီရေးအန္တရာယ် index သည် အောက်တွင် ရွှေ lab သို့ live link ဖြင့် ပြသထားသကဲ့သို့ asset-price မော်ဒယ်များထဲသို့ တိုက်ရိုက်ပေါင်းစပ်ဝင်ရောက်သည်။'
);

export const ELECTION_CONTEXT = bl(
  "The Economist's election model blends national and state polls with \"fundamentals\" — the economy, past voting patterns — updated fresh every day. Move the calendar closer to election day and watch the uncertainty band shrink as real polls outweigh the model's structural assumptions.",
  'A dynamic hierarchical Bayesian framework updated daily via Stan, blending national + state-level polls with fundamentals. This structure is architecturally close to Stats mode\'s own Chapter 14: Monte Carlo content — both are simulation-based approaches to quantifying uncertainty rather than a single closed-form estimate.',
  'The Economist ၏ ရွေးကောက်ပွဲ မော်ဒယ်သည် national နှင့် state poll များကို "fundamentals" — စီးပွားရေးအခြေအနေ၊ ယခင်ရွေးကောက်ပွဲ ပုံစံများ — နှင့် ပေါင်းစပ်ပြီး နေ့စဉ် update လုပ်သည်။ ပြက္ခဒိန်ကို ရွေးကောက်ပွဲနေ့နှင့် နီးအောင်ရွှေ့ပြီး တကယ့် poll များက မော်ဒယ်၏ ဖွဲ့စည်းပုံ ယူဆချက်များထက် အလေးချိန်ပိုလာသည်နှင့်အမျှ မသေချာမှု band ကျဉ်းလာတာကို ကြည့်ပါ။',
  'Stan မှတစ်ဆင့် နေ့စဉ် update လုပ်သော dynamic hierarchical Bayesian framework တစ်ခုဖြစ်ပြီး national + state-level poll များကို fundamentals နှင့် ပေါင်းစပ်သည်။ ဤဖွဲ့စည်းပုံသည် Stats mode ၏ Chapter 14: Monte Carlo အကြောင်းအရာနှင့် ဖွဲ့စည်းပုံအရ နီးစပ်သည် — နှစ်ခုလုံးသည် closed-form estimate တစ်ခုတည်းအစား simulation ကို အခြေခံ၍ မသေချာမှုကို ပမာဏတိုင်းတာသော နည်းလမ်းများဖြစ်သည်။'
);

export const ELECTION_DRIVERS = [
  {
    key: 'fundamentalsLean', coefficient: 1,
    label: blSame('Economic/fundamentals lean', 'စီးပွားရေး/Fundamentals ဦးတည်ချက်'),
    relation: bl('Positive → favors incumbent; negative → favors challenger. Weighted more heavily far from election day.', 'Structural prior — dominates when polling data is scarce', 'အပေါင်း → လက်ရှိအာဏာရပါတီ ကျိုးကျေးဇူးဖြစ်; အနှုတ် → စိန်ခေါ်သူ ကျိုးကျေးဇူးဖြစ်။ ရွေးကောက်ပွဲနေ့နှင့် ဝေးလေ အလေးချိန်ပိုပေးလေဖြစ်သည်။', 'Structural prior — poll ဒေတာ ရှားပါးသောအခါ လွှမ်းမိုးသည်'),
  },
  {
    key: 'pollsLean', coefficient: 1,
    label: blSame('Current polling average', 'လက်ရှိ Poll ပျမ်းမျှ'),
    relation: bl('Positive → incumbent leads polls; negative → challenger leads. Weighted more heavily close to election day.', 'Likelihood/data term — dominates as polls accumulate near election day', 'အပေါင်း → လက်ရှိအာဏာရပါတီ poll ဦးဆောင်; အနှုတ် → စိန်ခေါ်သူ ဦးဆောင်။ ရွေးကောက်ပွဲနေ့နှင့် နီးလေ အလေးချိန်ပိုပေးလေဖြစ်သည်။', 'Likelihood/data term — ရွေးကောက်ပွဲနေ့နှင့်နီးလာသည်နှင့်အမျှ poll များစုဆောင်းလာသောအခါ လွှမ်းမိုးသည်'),
  },
];

export const ELECTION_SCENARIOS = [
  {
    id: 'tossup-6mo', label: blSame('Toss-up race, 6 months out', 'Toss-up ပြိုင်ပွဲ၊ ၆ လခန့်ကျန်'),
    state: { fundamentalsLean: 0.2, pollsLean: -0.2, daysUntilElection: 180, military: 0, diplomatic: 0, sanctions: 0 },
  },
  {
    id: 'landslide-eve', label: blSame('Landslide, election eve', 'Landslide၊ ရွေးကောက်ပွဲနေ့ အနီးဆုံး'),
    state: { fundamentalsLean: 1.5, pollsLean: 1.8, daysUntilElection: 1, military: 0, diplomatic: 0, sanctions: 0 },
  },
];

export const ELECTION_TRACE_INTRO = bl(
  'These two inputs are blended by weight, not added straight — how much each one counts depends entirely on how many days remain.',
  'Contribution = lean × current weight (fundamentals weight + polls weight always sum to 1, set by days-until-election).',
  'ဒီ input နှစ်ခုကို weight အလိုက် ပေါင်းစပ်တာဖြစ်ပြီး တိုက်ရိုက်ပေါင်းတာမဟုတ်ပါ — တစ်ခုစီက ဘယ်လောက်အရေးပါလဲဆိုတာ ကျန်ရှိတဲ့နေ့ အရေအတွက်အပေါ် လုံးဝမူတည်တယ်။',
  'Contribution = lean × လက်ရှိ weight (fundamentals weight + polls weight ပေါင်းလဒ်သည် daysUntilElection ဖြင့် သတ်မှတ်ထားသည့် 1 အမြဲညီသည်)။'
);

export const ELECTION_INCUMBENT_LABEL = blSame('Incumbent', 'လက်ရှိအာဏာရပါတီ');
export const ELECTION_CHALLENGER_LABEL = blSame('Challenger', 'စိန်ခေါ်သူ');
export const ELECTION_DAYS_LABEL = blSame('Days until election', 'ရွေးကောက်ပွဲအထိ ကျန်ရှိသောရက်');

export const GEO_CONTEXT = bl(
  'Geopolitical risk indices blend structured country data with AI-read sentiment from news and diplomatic text into one score — used to anticipate conflict, investment shifts, and (as you saw in the Gold lab) asset prices.',
  "Real-world indices (BlackRock's Geopolitical Risk Indicator, Geoquant) blend hundreds of structured and NLP-derived variables into a single score. The three sliders below are an illustrative simplification of that same structure.",
  'ပထဝီရေးအန္တရာယ် index များသည် ဖွဲ့စည်းထားသော နိုင်ငံအလိုက်ဒေတာကို သတင်းနှင့် သံတမန်စာသားများမှ AI-ဖတ်ရှုသော sentiment နှင့် ပေါင်းစပ်ကာ score တစ်ခုအဖြစ် ဖြစ်စေသည် — ပဋိပက္ခ၊ ရင်းနှီးမြှုပ်နှံမှု ပြောင်းလဲမှုနှင့် (ရွှေ lab တွင် တွေ့ခဲ့သကဲ့သို့) asset ဈေးနှုန်းများကို ကြိုတင်မှန်းဆရန် အသုံးပြုသည်။',
  'လက်တွေ့ index များ (BlackRock ၏ Geopolitical Risk Indicator, Geoquant) သည် ဖွဲ့စည်းထားသောနှင့် NLP-ရယူထားသော variable ရာနှင့်ချီကို score တစ်ခုတည်းအဖြစ် ပေါင်းစပ်သည်။ အောက်ပါ slider သုံးခုသည် ထိုဖွဲ့စည်းပုံတူညီသည့် သရုပ်ဖော်ရိုးရှင်းမှုတစ်ခုဖြစ်သည်။'
);

export const GEO_DRIVERS = [
  {
    key: 'military', coefficient: 1,
    label: blSame('Military/conflict signals', 'စစ်ရေး/ပဋိပက္ခ အချက်ပြမှုများ'),
    relation: bl('Positive → escalating conflict activity', 'Structured country-level indicator', 'အပေါင်း → ပဋိပက္ခ လှုပ်ရှားမှု တိုးလာ', 'ဖွဲ့စည်းထားသော နိုင်ငံအဆင့် indicator'),
  },
  {
    key: 'diplomatic', coefficient: 1,
    label: blSame('Diplomatic tension (NLP sentiment)', 'သံတမန်ရေး တင်းမာမှု (NLP sentiment)'),
    relation: bl('Positive → more hostile rhetoric detected in news/diplomatic text', 'NLP-derived sentiment signal', 'အပေါင်း → သတင်း/သံတမန်စာသားများတွင် ရန်လိုသောစကားများ ပိုတွေ့ရ', 'NLP-မှ ရယူထားသော sentiment signal'),
  },
  {
    key: 'sanctions', coefficient: 1,
    label: blSame('Economic sanctions activity', 'စီးပွားရေး ပိတ်ဆို့မှု လှုပ်ရှားမှု'),
    relation: bl('Positive → sanctions regime tightening', 'Structured country-level indicator', 'အပေါင်း → ပိတ်ဆို့မှု စည်းမျဉ်း ပိုတင်းကျပ်လာ', 'ဖွဲ့စည်းထားသော နိုင်ငံအဆင့် indicator'),
  },
];

export const GEO_SCENARIOS = [
  {
    id: 'conflict-escalates', label: blSame('Regional conflict escalates', 'ဒေသတွင်း ပဋိပက္ခ ပိုပြင်းထန်'),
    state: { fundamentalsLean: 0, pollsLean: 0, daysUntilElection: 90, military: 1.8, diplomatic: 1.2, sanctions: 0.8 },
  },
  {
    id: 'diplomatic-thaw', label: blSame('Diplomatic thaw', 'သံတမန်ရေး နွေးထွေးလာမှု'),
    state: { fundamentalsLean: 0, pollsLean: 0, daysUntilElection: 90, military: -1.5, diplomatic: -1.8, sanctions: -1.0 },
  },
];

export const GEO_TO_GOLD_LABEL = bl(
  'See how this moves the gold price →',
  'Apply this risk score to Gold lab\'s geopolitical risk driver →',
  'ဒါက ရွှေဈေးနှုန်းကို ဘယ်လိုရွှေ့စေလဲ ကြည့်ရန် →',
  'ဒီ risk score ကို ရွှေ lab ၏ ပထဝီရေးအန္တရာယ် driver သို့ အသုံးချရန် →'
);

// Module 11 audit (see gold.js's identical note).
export const POLITICS_PAGE_TITLE = blSame('Political & Geopolitical Forecasting', 'နိုင်ငံရေး နှင့် ပထဝီရေး ခန့်မှန်းချက်');
export const ELECTION_SECTION_TITLE = blSame('Election forecasting', 'ရွေးကောက်ပွဲ ခန့်မှန်းချက်');
export const GEO_SECTION_TITLE = blSame('Geopolitical risk index', 'ပထဝီရေးအန္တရာယ် Index');
export const GEO_RISK_METER_LABEL = blSame('Composite risk score', 'ပေါင်းစပ် Risk Score');
export const ELECTION_DAYS_RELATION = blSame(
  'Closer to election day → real polls outweigh the structural prior, and the credible interval narrows.',
  'ရွေးကောက်ပွဲနေ့နှင့် နီးလာလေ → တကယ့် poll များက structural prior ထက် အလေးချိန်ပိုလာလေ၊ credible interval ကျဉ်းလာလေဖြစ်သည်။'
);
export const ELECTION_TRACE_LABEL = blSame('Why this estimate?', 'ဒီခန့်မှန်းချက်ဟာ ဘာကြောင့်လဲ?');
