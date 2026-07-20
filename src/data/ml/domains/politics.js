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

// Learning Design System retrofit (Module 9): two Constructive Thought
// Loops (election reweighting; geo-risk "objectivity") feeding one
// consolidated Depth Ladder. Critical Frontier carries "less biased than
// humans" (docs/research/ML-Mode-Pedagogy-Research.md §3's unlabeled
// seventh entry, assigned here specifically) with a concrete example, per
// the mission. The Formalism worked example is computed from the real
// computeElection() formula at fundamentalsLean=+0.2/pollsLean=-0.2 (the
// page's own "Toss-up race" preset's lean values) at two different days-
// out, independently re-derivable by applying that preset and scrubbing
// the days slider.
export const ELECTION_PREDICT_Q = blSame(
  'As election day gets closer, which input gains more influence over the model\'s final call — the fundamentals (economy, past patterns), or the current polls?',
  'ရွေးကောက်ပွဲနေ့ နီးလာသည်နှင့်အမျှ မော်ဒယ်၏ နောက်ဆုံးဆုံးဖြတ်ချက်အပေါ် ဘယ် input က ပိုအရေးပါလာသလဲ — fundamentals (စီးပွားရေး၊ ယခင်ပုံစံများ) လား၊ လက်ရှိ poll များလား?'
);
export const ELECTION_PREDICT_FUNDAMENTALS = blSame(
  'Fundamentals — economic structure is the more reliable long-term signal',
  'Fundamentals — စီးပွားရေးဖွဲ့စည်းပုံသည် ပိုယုံကြည်ရသော ရေရှည် signal ဖြစ်သည်'
);
export const ELECTION_PREDICT_POLLS = blSame(
  'Polls — real, current voter opinion eventually outweighs structural assumptions',
  'Poll များ — တကယ့်၊ လက်ရှိ ရွေးချယ်သူများ၏ ထင်မြင်ချက်သည် နောက်ဆုံးတွင် structural assumption ထက် အလေးချိန်ပိုသည်'
);
export const ELECTION_PREDICT_EXPLAIN = blSame(
  'Set fundamentals to +0.2 and polls to −0.2 — they disagree — then scrub the days slider from 180 down to 1 and watch which one the win-probability gauge ends up following.',
  'Fundamentals ကို +0.2 နှင့် poll ကို −0.2 ထား — သဘောထားကွဲနေသည် — ပြီးနောက် ရက်အရေအတွက် slider ကို 180 မှ 1 အထိ ဆွဲကာ win-probability gauge က ဘယ်ဟာကို လိုက်နာသွားလဲ ကြည့်ပါ။'
);

export const GEO_PREDICT_Q = blSame(
  'This risk score blends structured country data with AI-read news sentiment. Does combining sources this way make it more objective than a human analyst\'s own judgment?',
  'ဒီ risk score သည် ဖွဲ့စည်းထားသော နိုင်ငံဒေတာကို AI-ဖတ်ရှုသော သတင်း sentiment နှင့် ပေါင်းစပ်သည်။ ဒီလိုပေါင်းစပ်ခြင်းက လူ့ analyst တစ်ဦး၏ ဆုံးဖြတ်ချက်ထက် ပိုပြီး objective ဖြစ်စေသလား?'
);
export const GEO_PREDICT_YES = blSame(
  'Yes — combining automated sources removes human bias from the process',
  'ဟုတ်သည် — automated source များ ပေါင်းစပ်ခြင်းက လုပ်ငန်းစဉ်မှ human bias ကို ဖယ်ရှားသည်'
);
export const GEO_PREDICT_NO = blSame(
  "No — the score is still built entirely from human choices about data, sources, and labels",
  'မဟုတ်ပါ — score သည် data, source, label များအကြောင်း human ရွေးချယ်ချက်များမှ လုံးဝ တည်ဆောက်ထားဆဲဖြစ်သည်'
);
export const GEO_PREDICT_EXPLAIN = blSame(
  'The Critical Frontier tab below works through exactly why, with a concrete example.',
  'အောက်ပါ Critical Frontier tab သည် ဘာကြောင့်ဆိုတာကို ဥပမာအတိအကျဖြင့် ရှင်းပြသည်။'
);

export const POLITICS_SPARK_ANALOGY = blSame(
  "A judge and a spreadsheet both have to make a call under uncertainty — the spreadsheet just hides the judgment calls inside formulas instead of stating them out loud. Every weight in these two models (how much polls count, how much a military signal counts) is a human decision wearing a number's clothing.",
  'တရားသူကြီးတစ်ဦးနှင့် spreadsheet တစ်ခုစလုံးသည် uncertainty အောက်တွင် ဆုံးဖြတ်ချက်ချရသည် — spreadsheet က ဆုံးဖြတ်ချက်များကို အသံထွက်ပြောမည့်အစား formula ထဲတွင် ဝှက်ထားခြင်းသာဖြစ်သည်။ ဒီမော်ဒယ်နှစ်ခု၏ weight တိုင်း (poll က ဘယ်လောက်အရေးပါလဲ၊ စစ်ရေး signal က ဘယ်လောက်အရေးပါလဲ) သည် ဂဏန်း၏ အဝတ်အစားဝတ်ထားသော လူ့ဆုံးဖြတ်ချက်တစ်ခုဖြစ်သည်။'
);

export const POLITICS_MECHANISM_NOTE = blSame(
  "You already ran both mechanisms above — the election model reweights fundamentals vs. polls as you move the days slider, and the geo-risk model recombines its three sliders into one score live. Both react instantly; neither one is thinking about it.",
  'အထက်ပါ mechanism နှစ်ခုစလုံးကို run လုပ်ပြီးသားပါ — ရွေးကောက်ပွဲ မော်ဒယ်သည် ရက်အရေအတွက် slider ကို ရွှေ့သည်နှင့်အမျှ fundamentals vs. poll ကို ပြန်လည်ချိန်ညှိပြီး၊ geo-risk မော်ဒယ်သည် ၎င်း၏ slider သုံးခုကို score တစ်ခုအဖြစ် live ပြန်ပေါင်းစပ်သည်။ နှစ်ခုလုံး ချက်ချင်း တုံ့ပြန်သော်လည်း၊ ဘယ်တစ်ခုမှ စဉ်းစားနေခြင်း မဟုတ်ပါ။'
);

export const POLITICS_FORMALISM_WORKED = bl(
  'Worked example: set fundamentals to +0.2, polls to −0.2 (they disagree). At 180 days out, polls\' weight is exactly 0% — the model relies entirely on fundamentals, giving the incumbent a ≈54.7% win probability. Scrub to 1 day out with the SAME two numbers: polls now carry ≈99% of the weight, and the probability flips to ≈45.3% — now favoring the challenger. Neither input value changed; only how much each one was allowed to count did.',
  'Worked example: set fundamentals to +0.2, polls to −0.2 (they disagree). At 180 days out, polls\' weight is exactly 0% — the model relies entirely on fundamentals, giving the incumbent a ≈54.7% win probability. Scrub to 1 day out with the SAME two numbers: polls now carry ≈99% of the weight, and the probability flips to ≈45.3% — now favoring the challenger. Neither input value changed; only how much each one was allowed to count did.',
  'ဖြေရှင်းချက်ဥပမာ: fundamentals ကို +0.2၊ poll ကို −0.2 ထား (သဘောထားကွဲနေသည်)။ ရက် ၁၈၀ ကျန်ချိန်တွင် poll ၏ weight သည် အတိအကျ 0% ဖြစ်သည် — မော်ဒယ်သည် fundamentals အပေါ်သာ လုံးဝမှီခိုသည်၊ လက်ရှိအာဏာရပါတီအား ≈54.7% အနိုင်ရနိုင်ခြေ ပေးသည်။ ရက် ၁ ရက်ကျန်ချိန်သို့ ဂဏန်းနှစ်ခုတူညီအတိုင်း ဆွဲပါ: poll များသည် ယခု weight ၏ ≈99% ကို သယ်ဆောင်ပြီး၊ ဖြစ်နိုင်ခြေသည် ≈45.3% သို့ ပြောင်းသွားသည် — ယခု စိန်ခေါ်သူဘက်ကို ဦးတည်သည်။ input တန်ဖိုးနှစ်ခုစလုံး မပြောင်းလဲပါ; တစ်ခုစီ ဘယ်လောက်ရေတွက်ခွင့်ရသလဲသာ ပြောင်းလဲခဲ့သည်။',
  'ဖြေရှင်းချက်ဥပမာ: fundamentals ကို +0.2၊ poll ကို −0.2 ထား (သဘောထားကွဲနေသည်)။ ရက် ၁၈၀ ကျန်ချိန်တွင် poll ၏ weight သည် အတိအကျ 0% ဖြစ်သည် — မော်ဒယ်သည် fundamentals အပေါ်သာ လုံးဝမှီခိုသည်၊ လက်ရှိအာဏာရပါတီအား ≈54.7% အနိုင်ရနိုင်ခြေ ပေးသည်။ ရက် ၁ ရက်ကျန်ချိန်သို့ ဂဏန်းနှစ်ခုတူညီအတိုင်း ဆွဲပါ: poll များသည် ယခု weight ၏ ≈99% ကို သယ်ဆောင်ပြီး၊ ဖြစ်နိုင်ခြေသည် ≈45.3% သို့ ပြောင်းသွားသည် — ယခု စိန်ခေါ်သူဘက်ကို ဦးတည်သည်။ input တန်ဖိုးနှစ်ခုစလုံး မပြောင်းလဲပါ; တစ်ခုစီ ဘယ်လောက်ရေတွက်ခွင့်ရသလဲသာ ပြောင်းလဲခဲ့သည်။'
);
export const POLITICS_FORMALISM_FADED = blSame(
  'Now you try: keep fundamentals at +0.2 and polls at −0.2, and set days-until-election to 45. Step 1 — roughly what fraction of the weight do polls carry at 45 of 180 days (hint: it\'s not linear — check pollsWeight\'s formula shape)? Step 2 — will the win probability at 45 days sit closer to the 180-day answer (≈54.7%) or the 1-day answer (≈45.3%), and why: _____.',
  'အခု သင့်အလှည့်: fundamentals ကို +0.2၊ poll ကို −0.2 ထားဆဲ၊ ရွေးကောက်ပွဲအထိ ရက်ကို 45 ထား။ အဆင့် ၁ — ရက် ၁၈၀ ထဲက ၄၅ ရက်တွင် poll က weight ဘယ်လောက်ခန့် သယ်ဆောင်သလဲ (အကြံပြုချက်: linear မဟုတ်ပါ — pollsWeight ပုံသဏ္ဍာန်ကို စစ်ကြည့်ပါ)? အဆင့် ၂ — ရက် ၄၅ ရက်တွင် win probability သည် ရက် ၁၈၀ အဖြေ (≈54.7%) နှင့် ရက် ၁ အဖြေ (≈45.3%) ထဲက ဘယ်ဟာနှင့် ပိုနီးမလဲ၊ ဘာကြောင့်လဲ: _____။'
);

export const POLITICS_CF_CONCRETE_EXAMPLE = blSame(
  "A concrete example: suppose the diplomatic-tension signal is built mostly from English-language wire-service coverage. A conflict where one side's state media dominates local reporting but is rarely translated or cited by those same wire services could have its tension systematically under-read — not because the model is deliberately unfair, but because it only ever sees one side's framing of events. The score would still look like a clean, objective number; the bias would just be harder to spot than it would be in a human analyst's written opinion.",
  'တိကျသောဥပမာ: သံတမန်ရေး တင်းမာမှု signal ကို အများစု English-language wire-service ဖော်ပြချက်များမှ တည်ဆောက်ထားသည်ဆိုပါစို့။ တစ်ဖက်၏ state media သည် local reporting ကို လွှမ်းမိုးသော်လည်း ထို wire service များက ရှားရှားပါးပါး ဘာသာပြန် (သို့) ကိုးကားသော ပဋိပက္ခတစ်ခုသည် ၎င်း၏ တင်းမာမှုကို စနစ်တကျ အားနည်းစွာ ဖတ်ရှုနိုင်သည် — မော်ဒယ်က တမင်တကာ မမျှတသောကြောင့် မဟုတ်ဘဲ၊ ၎င်းသည် ဖြစ်ရပ်များ၏ တစ်ဖက်တည်း framing ကိုသာ တွေ့မြင်နေသောကြောင့်ဖြစ်သည်။ Score သည် ဆက်လက်၍ ရှင်းလင်း၊ objective ဂဏန်းတစ်ခုဟု ထင်ရမည်ဖြစ်သော်လည်း၊ bias သည် လူ့ analyst တစ်ဦး၏ ရေးသားထားသော ထင်မြင်ချက်ထက် ရှာဖွေရန် ခက်ခဲမည်ဖြစ်သည်။'
);
export const POLITICS_CF_RETRIEVAL_Q = blSame(
  'A newsroom says "we switched from a human risk analyst to an AI risk score, so our coverage is now unbiased." What is the one-sentence problem with this claim?',
  'သတင်းအခန်းတစ်ခုက "ကျွန်ုပ်တို့သည် လူ့ risk analyst မှ AI risk score သို့ ပြောင်းလိုက်ပြီဖြစ်၍ ကျွန်ုပ်တို့၏ ဖော်ပြချက်သည် ယခု unbiased ဖြစ်သည်" ဟုပြောသည်။ ဒီအခိုင်အမာချက်၏ တစ်ကြောင်းတည်း ပြဿနာက ဘာလဲ?'
);
export const POLITICS_CF_RETRIEVAL_A = blSame(
  "The AI score is only as unbiased as the data, sources, and labels it was trained on — all of which were chosen by people — so switching from a human analyst to a score doesn't remove human judgment, it just moves that judgment earlier in the pipeline and makes it harder to see or question.",
  'AI score သည် ၎င်း train လုပ်ခဲ့ရသော data, source, label များအတိုင်းသာ unbiased ဖြစ်နိုင်သည် — အားလုံးကို လူများက ရွေးချယ်ခဲ့ကြသည် — ဒါကြောင့် လူ့ analyst မှ score သို့ ပြောင်းခြင်းသည် human judgment ကို ဖယ်ရှားလိုက်ခြင်း မဟုတ်ဘဲ၊ ထိုဆုံးဖြတ်ချက်ကို pipeline ၏ ပိုစောသောနေရာသို့ ရွှေ့ပြီး တွေ့ရှိရန် (သို့) မေးခွန်းထုတ်ရန် ပိုခက်ခဲစေသည်။'
);
