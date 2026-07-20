import { bl, blSame } from '../../lib/mlContent.js';

// Source: ML-Research-Reference.md §2 ("Estimation vs. Prediction vs.
// Causal Inference — the Stats↔ML Bridge") and §7 point 5. The doc's own
// §7.5 cites "your existing Stats/Gibbs/PGAS content" as the natural
// Bayesian bridge pairing — checked against src/data/nodes.js and found no
// such content exists in Stats mode (no Gibbs sampling, no PGAS). What
// Stats mode genuinely has is Chapter 7's t-distribution confidence
// interval for the mean (ci_mean_t) and Chapter 10's full regression
// toolkit (reg/pearson/r2/se_est/pred_int) — real, verified node ids this
// file links to instead of the doc's unverified claim. All worked-example
// numbers below are illustrative (no specific real study), clearly
// consistent with each other, not fabricated as real research findings.

export const BRIDGE_CONTEXT = bl(
  "The two modes aren't teaching two different subjects — they're often computing the exact same thing and asking a different question about it. These two examples use the exact numbers Stats mode would produce, then show what changes when you put on the ML lens.",
  'Stats and ML frequently converge on identical point estimates while diverging entirely in what question the surrounding machinery is built to answer — inference about a fixed population parameter vs. generalization to unseen data. Both worked examples below use one shared, internally consistent set of numbers.',
  'Mode နှစ်ခုက ဘာသာရပ်နှစ်ခု သင်နေတာမဟုတ်ပါ — မကြာခဏ အတူတူပဲ တွက်ချက်နေပြီး မေးခွန်းကွဲပြားနေတာဖြစ်တယ်။ ဒီဥပမာနှစ်ခုက Stats mode ထုတ်ပေးမည့် ဂဏန်းအတိအကျကို သုံးထားပြီး၊ ML lens တပ်လိုက်တော့ ဘာပြောင်းလဲသွားလဲ ပြသထားတယ်။',
  'Stats နှင့် ML သည် population parameter တစ်ခု၏ inference ကို ရှာဖွေခြင်း vs. မမြင်ရသေးသော ဒေတာသို့ generalization ကို ရှာဖွေခြင်း စသည့် ဝန်းကျင် mechanism ၏ ဖြေရှင်းမည့်မေးခွန်းကွဲပြားနေချိန်တွင် point estimate တူညီလေ့ရှိသည်။ အောက်ပါ ဥပမာနှစ်ခုစလုံးသည် တစ်ခုတည်းသော ကိုက်ညီသော ကိန်းဂဏန်းအစုံအလင်ကို သုံးထားသည်။'
);

// ── Comparison 1: Regression ────────────────────────────────────────────
export const REG_EXAMPLE_INTRO = bl(
  "8 students' study hours vs. exam scores. Fitted line: score' = 52 + 4.2 × hours.",
  "n=8, fitted via least squares: score' = 52 + 4.2×hours (b=4.2, a=52). Everything below is the same fitted line, read two ways.",
  'ကျောင်းသား ၈ ဦးရဲ့ လေ့လာချိန် vs. စာမေးပွဲရမှတ်။ Fit လုပ်ထားသော line: score\' = 52 + 4.2 × hours။',
  'n=8, least squares ဖြင့် fit: score\' = 52 + 4.2×hours (b=4.2, a=52)။ အောက်ပါ အားလုံးသည် fit လုပ်ထားသော line တစ်ခုတည်းကို နည်းလမ်းနှစ်မျိုးဖြင့် ဖတ်ရှုခြင်းဖြစ်သည်။'
);

export const REG_STATS_CARD = {
  title: blSame('Stats lens: is this the true relationship?', 'Stats lens: ၎င်းသည် စစ်မှန်သော ဆက်နွယ်မှုလား?'),
  points: bl(
    [
      'r = 0.87 — strong positive correlation',
      'r² = 0.76 — 76% of score variation explained by hours',
      'Standard error of estimate = 5.8 points — typical size of a residual',
      'For one new student studying 6 hours: predicted 77.2, prediction interval 77.2 ± 12.4 (wide — it covers one individual)',
    ].join('\n'),
    [
      'r = 0.87, r² = 0.76 (variance explained on the fitting sample itself)',
      'sₑ = 5.8 — in-sample average residual magnitude',
      'Prediction interval for x=6: 77.2 ± 12.4, using sₑ and the standard pred_int formula — wide because a single future y has both parameter uncertainty and irreducible noise',
    ].join('\n'),
    [
      'r = 0.87 — အပေါင်း ဆက်နွယ်မှု ခိုင်မာသည်',
      'r² = 0.76 — score ကွဲပြားမှု၏ 76% ကို hours က ရှင်းပြသည်',
      'Standard error of estimate = 5.8 မှတ် — residual ပုံမှန်အရွယ်အစား',
      'ကျောင်းသားအသစ်တစ်ဦး 6 နာရီ လေ့လာလျှင်: ခန့်မှန်း 77.2, prediction interval 77.2 ± 12.4 (ကျယ်သည် — တစ်ဦးတည်းအတွက်ဖြစ်သောကြောင့်)',
    ].join('\n'),
    [
      'r = 0.87, r² = 0.76 (fit လုပ်သည့် sample ပေါ်ရှိ variance explained)',
      'sₑ = 5.8 — in-sample ပျမ်းမျှ residual ပမာဏ',
      'x=6 အတွက် prediction interval: 77.2 ± 12.4, sₑ နှင့် standard pred_int ဖော်မြူလာအသုံးပြု — တစ်ခုတည်းသော future y တွင် parameter uncertainty နှင့် irreducible noise နှစ်မျိုးလုံးပါသောကြောင့် ကျယ်သည်',
    ].join('\n')
  ),
  interpretation: bl(
    'b=4.2 is our best estimate of the true population relationship between study hours and scores — with quantified uncertainty around the estimate itself.',
    'b is a point estimate of a fixed population parameter β; every quantity above (r², sₑ, the interval) describes uncertainty in that estimate, computed once on the full sample.',
    'b=4.2 သည် လေ့လာချိန်နှင့် ရမှတ်ကြား စစ်မှန်သော population ဆက်နွယ်မှု၏ အကောင်းဆုံးခန့်မှန်းချက်ဖြစ်ပြီး — ခန့်မှန်းချက်ကိုယ်တိုင်ပတ်ဝန်းကျင် ပမာဏတိုင်းတာထားသော မသေချာမှုပါသည်။',
    'b သည် fixed population parameter β ၏ point estimate ဖြစ်ပြီး; အထက်ပါ ပမာဏတိုင်း (r², sₑ, interval) သည် sample အပြည့်အစုံပေါ်တွင် တစ်ကြိမ်တွက်ချက်ထားသော ထိုခန့်မှန်းချက်ရှိ မသေချာမှုကို ဖော်ပြသည်။'
  ),
};

export const REG_ML_CARD = {
  title: blSame('ML lens: does this generalize?', 'ML lens: ၎င်းက generalize လုပ်နိုင်ရဲ့လား?'),
  points: bl(
    [
      'Same b=4.2, now reported as a learned weight from training data',
      'Trained on 80 students, evaluated on 20 held-out students the model never saw',
      'Test RMSE = 6.1 points — error measured on unseen data, not the fitting data',
    ].join('\n'),
    [
      'Same coefficient, fit by the identical least-squares objective — the difference is entirely in what happens next',
      '80/20 train/test split; test RMSE = 6.1, measured strictly out-of-sample',
      'No population-parameter claim is made — the coefficient is judged only by held-out predictive error',
    ].join('\n'),
    [
      'တူညီသော b=4.2, ယခု training data မှ သင်ယူထားသော weight တစ်ခုအဖြစ် ဖော်ပြသည်',
      'ကျောင်းသား ၈၀ ဖြင့် train, model မမြင်ဖူးသော ကျောင်းသား ၂၀ ဖြင့် evaluate',
      'Test RMSE = 6.1 မှတ် — မမြင်ဖူးသော ဒေတာပေါ် တိုင်းတာထားသော error',
    ].join('\n'),
    [
      'တူညီသောcoefficient, least-squares objective တူညီစွာဖြင့် fit — ကွာခြားချက်က နောက်ဆက်တွဲတွင် လုံးဝရှိသည်',
      '80/20 train/test split; test RMSE = 6.1, strictly out-of-sample တိုင်းတာထားသည်',
      'Population-parameter claim မရှိပါ — coefficient ကို held-out predictive error ဖြင့်သာ တိုင်းတာသည်',
    ].join('\n')
  ),
  interpretation: bl(
    'The same number is now judged by a different question: not "is this the true relationship?" but "how well does this predict students we didn\'t train on?"',
    'Evaluation moves from in-sample fit statistics (r², sₑ) to out-of-sample generalization error (test RMSE) — the coefficient is unchanged, the entire evaluation philosophy is not.',
    'ဂဏန်းတူတူဖြစ်ပေမယ့် မေးခွန်းကွဲပြားသွားပြီ: "ဒါက စစ်မှန်တဲ့ ဆက်နွယ်မှုလား" မဟုတ်ဘဲ "train မလုပ်ရသေးတဲ့ ကျောင်းသားတွေကို ဒါက ဘယ်လောက်ကောင်းကောင်း ခန့်မှန်းနိုင်လဲ"။',
    'Evaluation သည် in-sample fit statistics (r², sₑ) မှ out-of-sample generalization error (test RMSE) သို့ ရွှေ့သွားသည် — coefficient မပြောင်းလဲသော်လည်း evaluation philosophy တစ်ခုလုံး ပြောင်းလဲသွားသည်။'
  ),
};

export const REG_STATS_NODES = [
  { id: 'reg', label: blSame('Regression Line', 'Regression Line') },
  { id: 'pearson', label: blSame('Pearson r', 'Pearson r') },
  { id: 'r2', label: blSame('Coeff. of Determination', 'Coeff. of Determination') },
  { id: 'se_est', label: blSame('Std Error of Estimate', 'Std Error of Estimate') },
  { id: 'pred_int', label: blSame('Prediction Interval', 'Prediction Interval') },
];

// ── Comparison 2: Estimation philosophy ─────────────────────────────────
export const EST_EXAMPLE_INTRO = bl(
  'Average commute time from a sample of 40 commuters: X̄ = 32.4 min, s = 8.1 min.',
  'n=40, X̄=32.4, s=8.1. The 95% interval below comes out numerically identical under both lenses — deliberately, since the real difference is what the interval means, not what it looks like.',
  'ခရီးသွားလာချိန် ပျမ်းမျှကို ခရီးသွား ၄၀ ဦးထံမှ နမူနာယူသည်: X̄ = 32.4 မိနစ်, s = 8.1 မိနစ်။',
  'n=40, X̄=32.4, s=8.1။ အောက်ပါ 95% interval သည် lens နှစ်မျိုးလုံးအောက်တွင် ဂဏန်းအားဖြင့် တူညီသည် — တမင်ဖြစ်သည်၊ အမှန်တကယ်ကွာခြားချက်မှာ interval ရဲ့ အဓိပ္ပာယ်ဖြစ်ပြီး ပုံစံမဟုတ်ပါ။'
);

export const EST_STATS_CARD = {
  title: blSame('Stats lens: frequentist confidence interval', 'Stats lens: frequentist confidence interval'),
  points: bl(
    '95% CI: [29.8, 35.0] minutes, via X̄ ± t·(s/√n)',
    "95% CI: [29.8, 35.0], via ci_mean_t's exact t-distribution formula",
    '95% CI: [29.8, 35.0] မိနစ်, X̄ ± t·(s/√n) မှတစ်ဆင့်',
    '95% CI: [29.8, 35.0], ci_mean_t ၏ တိကျသော t-distribution ဖော်မြူလာမှတစ်ဆင့်'
  ),
  interpretation: bl(
    'The true average commute time is a fixed, unknown number. This interval is what\'s random — if we repeated this survey many times, 95% of such intervals would capture the true average.',
    'μ is fixed; the interval [X̄ − t·s/√n, X̄ + t·s/√n] is the random quantity — a long-run coverage guarantee over repeated sampling, not a probability statement about μ itself.',
    'စစ်မှန်သော ခရီးသွားလာချိန်ပျမ်းမျှသည် ပုံသေ၊ မသိရသေးသော ဂဏန်းဖြစ်သည်။ ဒီ interval ကသာ ကျပန်းဖြစ်သည် — ဒီစစ်တမ်းကို အကြိမ်များစွာ ထပ်လုပ်ခဲ့ရင် ထို interval ၏ 95% သည် စစ်မှန်သော ပျမ်းမျှကို ဖမ်းယူနိုင်လိမ့်မည်။',
    'μ သည် ပုံသေဖြစ်သည်; interval [X̄ − t·s/√n, X̄ + t·s/√n] သည် ကျပန်းပမာဏဖြစ်သည် — μ ကိုယ်တိုင်အကြောင်း probability statement မဟုတ်ဘဲ ထပ်ခါထပ်ခါ sampling ပေါ်ရှိ long-run coverage guarantee ဖြစ်သည်။'
  ),
};

export const EST_BAYES_CARD = {
  title: blSame('ML/Bayesian lens: credible interval', 'ML/Bayesian lens: credible interval'),
  points: bl(
    '95% credible interval: [29.8, 35.0] minutes — same numbers, under a weak/uninformative prior',
    'Posterior for μ concentrates near X̄ under a flat prior; 95% credible interval ≈ [29.8, 35.0] — numerically close to the frequentist CI here, which is expected, not a coincidence to explain away',
    '95% credible interval: [29.8, 35.0] မိနစ် — ဂဏန်းတူတူဖြစ်ပေမယ့် weak/uninformative prior အောက်တွင်',
    'μ ၏ posterior သည် flat prior အောက်တွင် X̄ အနီးတွင် စုစည်းသည်; 95% credible interval ≈ [29.8, 35.0] — ဒီနေရာတွင် frequentist CI နှင့် ဂဏန်းနီးစပ်သည်၊ ရှင်းပြရန်လိုသော ပဋိပက္ခမဟုတ်ဘဲ မျှော်လင့်ထားသင့်သည်'
  ),
  interpretation: bl(
    'The true average itself is treated as uncertain — a probability distribution, not a fixed number. This interval means: given this data, there\'s a 95% probability the true average falls in this range.',
    'μ is a random variable with a posterior distribution; the credible interval is a direct probability statement about μ given the observed data — the interpretation Bayesian election models (see the Politics lab) apply throughout, not just at the reporting stage.',
    'စစ်မှန်သော ပျမ်းမျှကိုယ်တိုင်ကို မသေချာဟု သတ်မှတ်သည် — ပုံသေဂဏန်းမဟုတ်ဘဲ probability distribution တစ်ခုအဖြစ်။ ဒီ interval ရဲ့ အဓိပ္ပာယ်က: ဒီဒေတာပေးထားချက်နှင့်အညီ၊ စစ်မှန်သော ပျမ်းမျှသည် ဒီအပိုင်းအခြားထဲ ကျရောက်နိုင်ခြေ 95% ရှိသည်။',
    'μ သည် posterior distribution ရှိသော random variable ဖြစ်သည်; credible interval သည် တွေ့ရှိထားသော ဒေတာပေးထားချက်နှင့်အညီ μ အကြောင်း တိုက်ရိုက် probability statement ဖြစ်သည် — Bayesian election မော်ဒယ်များ (Politics lab တွင်ကြည့်ပါ) က reporting အဆင့်တွင်သာမက အစဉ်တစိုက် အသုံးပြုသည့် အဓိပ္ပာယ်ဖွင့်ဆိုချက်ဖြစ်သည်။'
  ),
};

export const EST_STATS_NODES = [
  { id: 'x_bar', label: blSame('Sample Mean', 'Sample Mean') },
  { id: 'ci_mean_t', label: blSame('t CI (Mean)', 't CI (Mean)') },
];

export const EST_TO_POLITICS_LABEL = bl(
  'See a genuinely Bayesian model in action — the Politics lab\'s election forecast →',
  'See a genuinely Bayesian model in action — the Politics lab\'s election forecast →',
  'တကယ့် Bayesian မော်ဒယ်ကို အသုံးချထားပုံ ကြည့်ရန် — Politics lab ၏ ရွေးကောက်ပွဲ ခန့်မှန်းချက် →',
  'တကယ့် Bayesian မော်ဒယ်ကို အသုံးချထားပုံ ကြည့်ရန် — Politics lab ၏ ရွေးကောက်ပွဲ ခန့်မှန်းချက် →'
);

export const VIEW_ON_STATS_MAP_LABEL = blSame('View on Stats map →', 'Stats map တွင်ကြည့်ရန် →');

// Module 11 audit (see gold.js's identical note).
export const BRIDGE_PAGE_TITLE = blSame('Stats ↔ ML Bridge', 'Stats ↔ ML Bridge');
export const REG_SECTION_TITLE = blSame('Regression: two lenses, one line', 'Regression: Lens နှစ်ခု၊ Line တစ်ခု');
export const EST_SECTION_TITLE = blSame('Estimation philosophy: frequentist vs. Bayesian', 'ခန့်မှန်းခြင်း အတွေးအခေါ်: Frequentist vs. Bayesian');
export const REG_NODES_LABEL = blSame(
  'Real Stats-mode content behind the Stats-lens numbers',
  'Stats-lens ဂဏန်းများနောက်ကွယ်ရှိ Stats-mode ၏ တကယ့်အကြောင်းအရာ'
);
export const EST_NODES_LABEL = blSame(
  'Real Stats-mode content behind the frequentist numbers',
  'Frequentist ဂဏန်းများနောက်ကွယ်ရှိ Stats-mode ၏ တကယ့်အကြောင်းအရာ'
);

// ── Comparison 3: Causal vs. Predictive (Learning Design System retrofit,
// Module 10) — the mission's own explicit requirement for this module: a
// concrete causal-vs-predictive counterexample, not an abstract statement.
// Grounded in Micro's own promo/season toggles (Module 8) rather than a
// generic textbook example (ice cream sales & drowning), since a learner
// who's already used that exact lab can check the claim directly instead
// of taking it on faith.
export const CAUSAL_SECTION_TITLE = blSame(
  'Predictive power isn\'t proof of cause',
  'ခန့်မှန်းနိုင်စွမ်းသည် အကြောင်းရင်း၏ သက်သေ မဟုတ်ပါ'
);
export const CAUSAL_EXAMPLE_INTRO = bl(
  "Module 8's demand model gives \"promotion active\" a clean +30% multiplier, entirely independent of \"peak season\"'s own +20%. That independence is true here by construction — the toy model was built that way. Real historical retail data usually isn't nearly this tidy.",
  "Module 8's toy demand model applies promoBoost (+30%) and seasonBoost (+20%) as independent multiplicative factors by construction (see demandModel.js). This section examines what breaks when that same \"promotion → higher demand\" correlation is read off real historical data instead of a clean simulation.",
  'Module 8 ၏ demand model သည် "ပရိုမိုးရှင်း လုပ်ဆောင်နေဆဲ" ကို "အထွက်နှုန်းအမြင့်ဆုံး ရာသီ" ၏ ကိုယ်ပိုင် +20% နှင့် လုံးဝသီးခြားဖြစ်သော +30% multiplier တစ်ခု ပေးထားသည်။ ဒီနေရာတွင် သီးခြားဖြစ်ခြင်းသည် ဖွဲ့စည်းပုံအရ မှန်ကန်သည် — toy model ကို အဲဒီလို တည်ဆောက်ထားခြင်းဖြစ်သည်။ တကယ့် historical retail data များသည် ပုံမှန်အားဖြင့် ဒီလောက်စနစ်တကျ မဟုတ်တတ်ပါ။',
  'Module 8 ၏ toy demand model သည် promoBoost (+30%) နှင့် seasonBoost (+20%) ကို ဖွဲ့စည်းပုံအရ (demandModel.js ကိုကြည့်ပါ) သီးခြား multiplicative factor များအဖြစ် အသုံးချသည်။ ဒီအပိုင်းသည် "ပရိုမိုးရှင်း → demand မြင့်တက်" ဆက်နွယ်မှုတူညီကို clean simulation တစ်ခုအစား တကယ့် historical data မှ ဖတ်ရှုသောအခါ ဘာပျက်စီးလဲဆိုတာကို စိစစ်သည်။'
);

export const CAUSAL_PREDICTIVE_CARD = {
  title: blSame(
    'The predictive view: promotion is a strong signal',
    'ခန့်မှန်းချက် ရှုထောင့်: ပရိုမိုးရှင်းသည် အားကောင်းသော signal ဖြစ်သည်'
  ),
  points: blSame(
    [
      'In this lab\'s data, promo-on periods show noticeably higher demand',
      'A predictive model is right to flag "promotion" as an important feature',
      'Using it as an input genuinely improves forecast accuracy',
      'The model never needs to know WHY the correlation exists to benefit from it',
    ].join('\n'),
    [
      'ဒီ lab ၏ data တွင် ပရိုမိုးရှင်းရှိသောကာလများသည် သိသိသာသာ ပိုများသော demand ကို ပြသသည်',
      'ခန့်မှန်းချက် model တစ်ခုသည် "ပရိုမိုးရှင်း" ကို အရေးပါသော feature တစ်ခုအဖြစ် ဖော်ပြခြင်းသည် မှန်ကန်သည်',
      '၎င်းကို input တစ်ခုအဖြစ် အသုံးပြုခြင်းသည် forecast တိကျမှုကို တကယ်တိုးတက်စေသည်',
      'ဆက်နွယ်မှု ဘာကြောင့်ရှိနေသလဲဆိုတာ model က သိစရာမလိုပဲ အကျိုးရရှိနိုင်သည်',
    ].join('\n')
  ),
  interpretation: blSame(
    'A good predictive model is right to use promotion as a signal — it improves accuracy regardless of the mechanism behind it. This is a completely reasonable, correct use of the correlation.',
    'ခန့်မှန်းချက် model ကောင်းတစ်ခုသည် ပရိုမိုးရှင်းကို signal တစ်ခုအဖြစ် အသုံးပြုခြင်းသည် မှန်ကန်သည် — ၎င်းနောက်ကွယ်ရှိ mechanism မည်သို့ပင်ရှိစေ တိကျမှုကို တိုးတက်စေသည်။ ဒါသည် ဆက်နွယ်မှုကို လုံးဝသင့်လျော်၊ မှန်ကန်စွာ အသုံးပြုခြင်းဖြစ်သည်။'
  ),
};

export const CAUSAL_ACTUAL_CARD = {
  title: blSame(
    'The causal question: does the promotion itself do this?',
    'အကြောင်းရင်း မေးခွန်း: ပရိုမိုးရှင်းကိုယ်တိုင်က ဒါလုပ်တာလား?'
  ),
  points: bl(
    [
      'In this lab\'s toy model: yes, cleanly — promo and season are independent multipliers by construction',
      'In real retail history: promotions are usually SCHEDULED during peak season (Black Friday, holiday sales) — the two overlap heavily',
      'A model trained on real historical data can\'t automatically separate "promotion caused this" from "season caused this, and promotion just happened alongside it"',
      'Answering the causal question for real needs a deliberate design — running promos in the off-season, or a controlled experiment',
    ].join('\n'),
    [
      'In this lab\'s toy model: yes, cleanly — promo and season are independent multipliers by construction',
      'In real retail history: promotions are usually SCHEDULED during peak season (Black Friday, holiday sales) — the two overlap heavily, a real confound',
      'A model trained on real historical data can\'t automatically separate "promotion caused this" from "season caused this, and promotion just happened alongside it" without deliberate design',
      'Answering the causal question for real needs randomization or a natural experiment (e.g. promos deliberately run in the off-season) — observational correlation alone can\'t settle it',
    ].join('\n'),
    [
      'ဒီ lab ၏ toy model တွင်: ဟုတ်သည်၊ စနစ်တကျ — ပရိုမိုးရှင်းနှင့် ရာသီသည် ဖွဲ့စည်းပုံအရ သီးခြား multiplier များဖြစ်သည်',
      'တကယ့် retail history တွင်: ပရိုမိုးရှင်းများကို အထွက်နှုန်းအမြင့်ဆုံးရာသီအတွင်း (Black Friday, holiday sale) ရက်ချိန်းလေ့ရှိသည် — နှစ်ခုသည် အလွန်ထပ်နေသည်',
      'တကယ့် historical data ဖြင့် train လုပ်ထားသော model တစ်ခုသည် "ပရိုမိုးရှင်းက ဒါဖြစ်စေတယ်" ကို "ရာသီက ဒါဖြစ်စေတယ်၊ ပရိုမိုးရှင်းက အတူတကွ ဖြစ်ခဲ့တာပါပဲ" နှင့် အလိုအလျောက် ခွဲခြား၍မရနိုင်ပါ',
      'အကြောင်းရင်း မေးခွန်းကို တကယ်ဖြေရန် deliberate design လိုအပ်သည် — off-season တွင် promo လုပ်ခြင်း (သို့) controlled experiment တစ်ခု',
    ].join('\n'),
    [
      'ဒီ lab ၏ toy model တွင်: ဟုတ်သည်၊ စနစ်တကျ — ပရိုမိုးရှင်းနှင့် ရာသီသည် ဖွဲ့စည်းပုံအရ သီးခြား multiplier များဖြစ်သည်',
      'တကယ့် retail history တွင်: ပရိုမိုးရှင်းများကို အထွက်နှုန်းအမြင့်ဆုံးရာသီအတွင်း (Black Friday, holiday sale) ရက်ချိန်းလေ့ရှိသည် — နှစ်ခုသည် အလွန်ထပ်နေသည်၊ တကယ့် confound တစ်ခုဖြစ်သည်',
      'တကယ့် historical data ဖြင့် train လုပ်ထားသော model တစ်ခုသည် deliberate design မရှိဘဲ "ပရိုမိုးရှင်းက ဒါဖြစ်စေတယ်" ကို "ရာသီက ဒါဖြစ်စေတယ်၊ ပရိုမိုးရှင်းက အတူတကွ ဖြစ်ခဲ့တာပါပဲ" နှင့် အလိုအလျောက် ခွဲခြား၍မရနိုင်ပါ',
      'အကြောင်းရင်း မေးခွန်းကို တကယ်ဖြေရန် randomization သို့မဟုတ် natural experiment တစ်ခု လိုအပ်သည် (ဥပမာ off-season တွင် တမင် promo လုပ်ခြင်း) — observational correlation တစ်ခုတည်းနှင့် ဒါကို အဆုံးအဖြတ်မပေးနိုင်ပါ',
    ].join('\n')
  ),
  interpretation: blSame(
    'This lab\'s model is clean by construction — promo and season truly are independent multipliers here. Real historical retail data usually isn\'t nearly this tidy — that gap is exactly the difference between "this feature predicts well" and "this feature causes the outcome."',
    'ဒီ lab ၏ model သည် ဖွဲ့စည်းပုံအရ သန့်ရှင်းသည် — ပရိုမိုးရှင်းနှင့် ရာသီသည် ဒီနေရာတွင် တကယ်ပင် သီးခြား multiplier များဖြစ်သည်။ တကယ့် historical retail data သည် ပုံမှန်အားဖြင့် ဒီလောက် စနစ်တကျ မဟုတ်တတ်ပါ — ထိုကွာဟချက်သည် "ဒီ feature က ကောင်းစွာ ခန့်မှန်းသည်" နှင့် "ဒီ feature က ရလဒ်ကို ဖြစ်စေသည်" ကြား ကွာခြားချက်အတိအကျပင်ဖြစ်သည်။'
  ),
};

export const CAUSAL_PREDICT_Q = blSame(
  'A retailer sees "promotion active" strongly predicts higher sales in their historical data, and concludes that running more promotions will directly cause more sales. Is that conclusion safe?',
  'လက်လီရောင်းချသူတစ်ဦးသည် "ပရိုမိုးရှင်း လုပ်ဆောင်နေဆဲ" က သူတို့၏ historical data တွင် အရောင်းများခြင်းကို ခိုင်မာစွာ ခန့်မှန်းကြောင်း တွေ့ရှိပြီး၊ ပရိုမိုးရှင်း ပိုလုပ်ခြင်းသည် အရောင်းများခြင်းကို တိုက်ရိုက် ဖြစ်စေမည်ဟု ကောက်ချက်ချသည်။ ထိုကောက်ချက်သည် ယုံကြည်စိတ်ချရပါသလား?'
);
export const CAUSAL_PREDICT_YES = blSame(
  'Yes — if promotion predicts sales well, running more of it should increase sales',
  'ဟုတ်သည် — ပရိုမိုးရှင်းက အရောင်းကို ကောင်းစွာ ခန့်မှန်းလျှင် ပိုလုပ်ခြင်းက အရောင်းကို တိုးစေသင့်သည်'
);
export const CAUSAL_PREDICT_NOT_SAFE = blSame(
  'Not necessarily — promotion can be a good predictor without being the true cause, if it\'s historically confounded with something else',
  'မလိုအပ်ပါ — ပရိုမိုးရှင်းသည် historically အခြားအရာတစ်ခုနှင့် ရောထွေးနေလျှင် တကယ့်အကြောင်းရင်း မဖြစ်ဘဲ ခန့်မှန်းချက် ကောင်းနိုင်သည်'
);
export const CAUSAL_PREDICT_EXPLAIN = blSame(
  "The Critical Frontier tab below works through exactly this — what happens when promotion and season are historically confounded, the way they usually are in real retail data.",
  'အောက်ပါ Critical Frontier tab သည် ဒါကို အတိအကျ ရှင်းပြသည် — ပရိုမိုးရှင်းနှင့် ရာသီသည် တကယ့် retail data တွင် များသောအားဖြင့်ရှိသည့်အတိုင်း historically ရောထွေးနေသောအခါ ဘာဖြစ်လဲဆိုတာဖြစ်သည်။'
);

export const CAUSAL_SPARK_ANALOGY = blSame(
  "Ice cream sales and drowning deaths rise and fall together throughout the year — with real statistical strength. Nobody concludes ice cream causes drowning. Both are driven by a third factor entirely: summer heat brings out both swimmers and ice cream vendors. A correlation this strong can be 100% real and 0% causal.",
  'ရေခဲမုန့် အရောင်းနှင့် ရေနစ်သေဆုံးမှုများသည် တစ်နှစ်ပတ်လုံး အတူတကွ တက်ကျသည် — real statistical strength ဖြင့်။ ရေခဲမုန့်က ရေနစ်ခြင်းကို ဖြစ်စေသည်ဟု ဘယ်သူမှ မကောက်ချက်ချပါ။ နှစ်ခုစလုံးကို တတိယ အချက်တစ်ခုလုံးက တွန်းအားပေးနေသည်: နွေရာသီအပူသည် ရေကူးသူများနှင့် ရေခဲမုန့်ရောင်းသူများ နှစ်ဦးစလုံးကို ခေါ်ဆောင်လာသည်။ ဒီလို ခိုင်မာသော ဆက်နွယ်မှုသည် 100% real ဖြစ်ပြီး 0% causal ဖြစ်နိုင်သည်။'
);

export const CAUSAL_MECHANISM_NOTE = blSame(
  "Go back to Module 8's Micro lab and toggle promotion and season independently — notice the demand curve responds to each one cleanly, on its own, no matter what the other is set to. That clean independence is the toy model's own design choice, not a fact about real retail demand.",
  'Module 8 ၏ Micro lab သို့ ပြန်သွားပြီး ပရိုမိုးရှင်းနှင့် ရာသီကို သီးခြားစီ toggle လုပ်ကြည့်ပါ — ကျန်တစ်ခုက ဘာဖြစ်နေစေ demand curve သည် တစ်ခုစီအပေါ် သန့်ရှင်းစွာ၊ ကိုယ်တိုင်သီးသန့် တုံ့ပြန်ပုံကို သတိပြုပါ။ ထိုသန့်ရှင်းသော သီးခြားဖြစ်မှုသည် toy model ၏ ကိုယ်ပိုင် ဒီဇိုင်းရွေးချယ်မှုဖြစ်ပြီး၊ တကယ့် retail demand အကြောင်း အချက်အလက်မဟုတ်ပါ။'
);

export const CAUSAL_FORMALISM_WORKED = blSame(
  'Worked example (hypothetical historical data, not this app\'s live model): suppose a retailer\'s past year shows demand jumps 40% on promo days vs. non-promo days. But suppose promo days were peak-season days 80% of the time, and peak season alone lifts demand 20% regardless of promotion. A naive read credits the full 40% to the promotion. A more careful read recognizes a large share of that 40% may really be season\'s +20% showing up disproportionately on promo days — the true promo-only effect could be substantially smaller than 40%.',
  'ဖြေရှင်းချက်ဥပမာ (hypothetical historical data, ဒီ app ၏ live model မဟုတ်ပါ): လက်လီရောင်းချသူတစ်ဦး၏ ယခင်နှစ်တွင် promo ရက်များ၏ demand သည် promo မရှိသောရက်များထက် 40% ပိုများသည်ဆိုပါစို့။ သို့သော် promo ရက်များ၏ 80% သည် အထွက်နှုန်းအမြင့်ဆုံးရာသီ ရက်များဖြစ်ပြီး၊ ရာသီတစ်ခုတည်းကပင် ပရိုမိုးရှင်းမရှိစေကာမူ demand ကို 20% မြှင့်တင်သည်ဆိုပါစို့။ Naive အဖတ်တစ်ခုသည် 40% အားလုံးကို ပရိုမိုးရှင်းကို ချီးမြှင့်သည်။ ပိုသတိထားသော အဖတ်တစ်ခုက ထို 40% ၏ အစိတ်အပိုင်းအများစုသည် ရာသီ၏ +20% ကို promo ရက်များတွင် အချိုးမညီစွာ ပေါ်လွင်နေခြင်းဖြစ်နိုင်ကြောင်း အသိအမှတ်ပြုသည် — တကယ့် promo-only effect သည် 40% ထက် သိသိသာသာ ငယ်နိုင်သည်။'
);
export const CAUSAL_FORMALISM_FADED = blSame(
  'Now you try: this time suppose promo days and peak-season days barely overlap at all (only 5% of promo days are also peak-season days) — everything else the same. Step 1 — would you now trust the observed 40% "promo effect" more or less than in the worked example above? Step 2 — why: _____.',
  'အခု သင့်အလှည့်: ဒီတစ်ကြိမ် promo ရက်များနှင့် အထွက်နှုန်းအမြင့်ဆုံးရာသီ ရက်များသည် တစ်ခုနှင့်တစ်ခု အနည်းငယ်သာ ထပ်နေသည်ဆိုပါစို့ (promo ရက်များ၏ 5% သာ peak-season ရက်များလည်း ဖြစ်သည်) — ကျန်တာအားလုံး အတူတူ။ အဆင့် ၁ — အထက်ပါ ဖြေရှင်းချက်ဥပမာထက် ယခုတွေ့ရသော 40% "promo effect" ကို ပိုယုံကြည်မလား၊ နည်းယုံကြည်မလား? အဆင့် ၂ — ဘာကြောင့်လဲ: _____။'
);

export const CAUSAL_CF_ANALOGY_BREAK = blSame(
  "The ice-cream analogy breaks down on obviousness: nobody seriously believes ice cream causes drowning because the confound (summer heat) is completely obvious once stated. Real business confounds are rarely this obvious — \"we always run promotions around the holidays\" can feel like an unrelated scheduling fact, not a variable quietly contaminating a model's promotion coefficient, until someone specifically goes looking for it.",
  'ရေခဲမုန့် ဆင်တူပုံရိပ်သည် ထင်ရှားမှုတွင် ပျက်စီးသည်: confound (နွေရာသီအပူ) ကို တစ်ကြိမ်ဖော်ပြလိုက်သည်နှင့် လုံးဝထင်ရှားသွားသောကြောင့် ရေခဲမုန့်က ရေနစ်ခြင်းကို ဖြစ်စေသည်ဟု မည်သူမျှ တကယ်မယုံကြည်ပါ။ တကယ့် စီးပွားရေး confound များသည် ဒီလောက်ထင်ရှားလေ့မရှိပါ — "ကျွန်ုပ်တို့ အားလပ်ရက်ဝန်းကျင်တွင် ပရိုမိုးရှင်းတွေ အမြဲလုပ်ကြသည်" ဆိုသည်မှာ တစ်စုံတစ်ယောက်က တမင်ရှာဖွေမှသာ တွေ့မည့် model ၏ ပရိုမိုးရှင်း coefficient ကို တိတ်တဆိတ် ညစ်ညမ်းစေနေသော variable တစ်ခုအဖြစ်မဟုတ်ဘဲ၊ မသက်ဆိုင်သော ရက်ချိန်း အချက်အလက်တစ်ခုအဖြစ် ခံစားရနိုင်သည်။'
);
export const CAUSAL_CF_CAVEAT = blSame(
  'A real caveat: this doesn\'t mean predictive models are useless for business decisions — it means the specific decision "should we run MORE promotions" is a causal question that predictive accuracy alone cannot answer, no matter how good the model\'s test-set score is. Answering it for real requires a randomized or natural experiment, not a better model.',
  'တကယ့် caveat: ဒါက ခန့်မှန်းချက် model များသည် စီးပွားရေးဆုံးဖြတ်ချက်များအတွက် အသုံးမဝင်ကြောင်း မဆိုလိုပါ — "ပရိုမိုးရှင်း ပိုလုပ်သင့်သလား" ဆိုသည့် တိကျသော ဆုံးဖြတ်ချက်သည် model ၏ test-set score မည်မျှကောင်းစေကာမူ ခန့်မှန်းတိကျမှုတစ်ခုတည်းက မဖြေနိုင်သော အကြောင်းရင်း မေးခွန်းဖြစ်ကြောင်း ဆိုလိုသည်။ ဒါကို တကယ်ဖြေရန် randomized (သို့) natural experiment တစ်ခု လိုအပ်ပြီး ပိုကောင်းသော model တစ်ခု မလိုအပ်ပါ။'
);
export const CAUSAL_CF_RETRIEVAL_Q = blSame(
  'A model\'s feature-importance chart ranks "promotion" as the #1 driver of sales. Does that alone tell you running more promotions will increase sales?',
  'Model တစ်ခု၏ feature-importance chart သည် "ပရိုမိုးရှင်း" ကို အရောင်းအရေးပါဆုံး driver #1 အဖြစ် rank ချသည်။ ဒါတစ်ခုတည်းက ပရိုမိုးရှင်းပိုလုပ်ခြင်းသည် အရောင်းကို တိုးမြှင့်စေမည်ဟု ပြောပြပါသလား?'
);
export const CAUSAL_CF_RETRIEVAL_A = blSame(
  "No. Feature importance measures how useful a variable is for prediction, given the patterns already in the historical data — it says nothing about what happens if you deliberately change that variable while everything it was historically entangled with (like season) stays fixed. High predictive importance and true causal effect can coincide, but neither one implies the other.",
  'မဟုတ်ပါ။ Feature importance သည် historical data ထဲက pattern များပေးထားချက်နှင့်အညီ variable တစ်ခု prediction အတွက် မည်မျှအသုံးဝင်သလဲကို တိုင်းတာသည် — ၎င်း historically ရောထွေးနေသောအရာများ (ရာသီကဲ့သို့) ပုံသေနေချိန် variable ကို တမင်ပြောင်းလဲလိုက်လျှင် ဘာဖြစ်မည်ဆိုသည်ကို ဘာမှမပြောပါ။ predictive importance မြင့်ခြင်းနှင့် တကယ့် causal effect တို့သည် တွဲဖက်ဖြစ်နိုင်သော်လည်း၊ တစ်ခုကမှ တစ်ခုကို မဆိုလိုပါ။'
);
