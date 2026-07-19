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
