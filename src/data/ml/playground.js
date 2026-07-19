import { bl, blSame } from '../../lib/mlContent.js';

export const PLAYGROUND_INTRO = bl(
  'Pick a model and drag the complexity slider to its extremes. Watch the fitted curve — and the gap between the two error lines below it — change.',
  'A regression-type node from Module 3, fit live against an adjustable-noise synthetic dataset. Complexity is polynomial degree or tree depth depending on the model; train/validation error is recomputed across the full complexity range on every change.',
  'မော်ဒယ်တစ်ခု ရွေးချယ်ပြီး ရှုပ်ထွေးမှု slider ကို အစွန်းများသို့ ဆွဲကြည့်ပါ။ fit လုပ်ထားသော မျဉ်းကွေးနှင့် အောက်ရှိ error မျဉ်းနှစ်ခုကြား ကွာဟချက် ပြောင်းလဲသွားပုံကို ကြည့်ပါ။',
  'Module 3 မှ regression-type node တစ်ခု၊ ချိန်ညှိနိုင်သော noise ပါသော synthetic dataset ပေါ်တွင် တိုက်ရိုက် fit လုပ်သည်။ ရှုပ်ထွေးမှုသည် မော်ဒယ်ပေါ်မူတည်၍ polynomial degree သို့ tree depth ဖြစ်သည်; ပြောင်းလဲမှုတိုင်းတွင် train/validation error ကို ရှုပ်ထွေးမှု အပိုင်းအခြားတစ်ခုလုံးတွင် ပြန်လည်တွက်ချက်သည်။'
);

export const MODEL_OPTIONS = [
  { id: 'poly', label: bl('Polynomial Regression', 'Polynomial Regression', 'Polynomial Regression', 'Polynomial Regression'), complexityLabel: bl('Degree', 'Degree (d)', 'Degree', 'Degree (d)'), max: 12 },
  { id: 'tree', label: bl('Decision Tree', 'Decision Tree Regressor', 'Decision Tree', 'Decision Tree Regressor'), complexityLabel: bl('Max depth', 'Max depth', 'Max depth', 'Max depth'), max: 8 },
];

export const FIT_ZONES = {
  under: bl(
    'Underfitting — the curve is too simple to follow the true pattern. Both errors are high because the model can\'t even capture the training data well.',
    'Underfitting (high bias): model capacity is insufficient to represent the true function; train and validation error are both elevated and close together.',
    'Underfit — မျဉ်းကွေးက စစ်မှန်သော pattern ကို လိုက်ရန် ရိုးရှင်းလွန်းသည်။ မော်ဒယ်က training data ကိုပင် ကောင်းစွာ ဖမ်းယူမနိုင်သောကြောင့် error နှစ်ခုစလုံး မြင့်နေသည်။',
    'Underfitting (bias မြင့်): မော်ဒယ်စွမ်းရည်သည် စစ်မှန်သော function ကို ကိုယ်စားပြုရန် မလုံလောက်ပါ; train နှင့် validation error နှစ်ခုစလုံး မြင့်ပြီး တစ်ခုနှင့်တစ်ခု နီးကပ်နေသည်။'
  ),
  good: bl(
    'Good fit — the curve follows the true pattern without chasing noise. Training and validation error are both low and close together.',
    'Near-optimal complexity: validation error is at or near its minimum; the gap between train and validation error is small.',
    'Good fit — မျဉ်းကွေးက noise ကို မလိုက်ဘဲ စစ်မှန်သော pattern ကို လိုက်နေသည်။ training နှင့် validation error နှစ်ခုစလုံး နိမ့်ပြီး နီးကပ်နေသည်။',
    'Optimal ရှုပ်ထွေးမှုနှင့် နီးစပ်: validation error သည် အနိမ့်ဆုံးတွင် သို့မဟုတ် အနီးတွင်ရှိသည်; train နှင့် validation error ကြား ကွာဟချက် သေးငယ်သည်။'
  ),
  over: bl(
    'Overfitting — the curve bends itself around every noisy point instead of the true pattern. Training error keeps dropping, but validation error is climbing back up.',
    'Overfitting (high variance): the model has enough capacity to fit noise in the training set; train error continues to fall while validation error rises, widening the generalization gap.',
    'Overfit — မျဉ်းကွေးက စစ်မှန်သော pattern အစား noise ရှိသည့် အမှတ်တိုင်းကို ကွေးညွတ်လိုက်နေသည်။ training error ဆက်ကျနေသော်လည်း validation error ပြန်တက်နေသည်။',
    'Overfitting (variance မြင့်): မော်ဒယ်သည် training set ရှိ noise ကို fit လုပ်ရန် စွမ်းရည်လုံလောက်သည်; train error ဆက်ကျနေစဉ် validation error တက်လာပြီး generalization gap ကျယ်လာသည်။'
  ),
};

// Module 11 audit: page-chrome strings (title/labels/legend) that were
// previously hardcoded English in PlaygroundPage.jsx.
export const PG_TITLE = blSame('Model Playground', 'မော်ဒယ် Playground');
export const PG_MODEL_LBL = blSame('Model', 'မော်ဒယ်');
export const PG_NOISE_LBL = blSame('Noise level', 'Noise ပမာဏ');
export const PG_NEW_SAMPLE_BTN = blSame('New sample', 'နမူနာအသစ်');
export const PG_FIT_LBL = blSame('Fit', 'Fit');
export const PG_TRAINING_POINTS = blSame('training points', 'training အချက်များ');
export const PG_VALIDATION_POINTS = blSame('validation points', 'validation အချက်များ');
export const PG_TRUE_FUNCTION = blSame('true function', 'စစ်မှန်သော function');
export const PG_ERROR_CURVE_LBL = blSame(
  'Train vs. validation error across all complexities',
  'ရှုပ်ထွေးမှု အပိုင်းအခြားတစ်ခုလုံးရှိ Train vs. validation error'
);
export const PG_TRAINING_ERROR = blSame('training error', 'training error');
export const PG_VALIDATION_ERROR = blSame('validation error', 'validation error');
export const PG_BEST_ON_VAL = blSame('best on validation', 'validation ပေါ်တွင် အကောင်းဆုံး');
export const PG_UNDERFITTING = blSame('Underfitting', 'Underfitting');
export const PG_OVERFITTING = blSame('Overfitting', 'Overfitting');
export const PG_GOOD_FIT = blSame('Good fit', 'Good Fit');
export const PG_TRAIN_MSE_LBL = blSame('train MSE', 'train MSE');
export const PG_VAL_MSE_LBL = blSame('validation MSE', 'validation MSE');
export const PG_LOW_COMPLEXITY = blSame('low complexity', 'ရှုပ်ထွေးမှု နိမ့်');
export const PG_HIGH_COMPLEXITY = blSame('high complexity', 'ရှုပ်ထွေးမှု မြင့်');

// Module 4 Learning Design System retrofit: Productive Failure sequencing
// (docs/research/ML-Mode-Pedagogy-Research.md §1) — the learner tries to
// find the best fit blind, before any error numbers or bias-variance
// vocabulary appear, then reveals their result as the trigger for the
// explanation. See BUILD_LOG.md Module 4.
export const PG_SPARK_ANALOGY = bl(
  "Buying shoes one size too small pinches; a size too big slips off — either way, the wrong fit fails you, just in different ways. A model's complexity works the same way: too simple and it can't capture the pattern, too complex and it starts fitting noise instead of signal.",
  'A model\'s complexity trades bias against variance: too little capacity underfits (high bias, can\'t represent the true function); too much overfits (high variance, fits noise the training sample happened to contain).',
  'ဖိနပ်တစ်ရွယ်ငယ်သော ဖိနပ်သည် နာကျင်စေပြီး တစ်ရွယ်ကြီးသော ဖိနပ်ကမူ ချွတ်ကျသွားတတ်သည် — ဘယ်လိုပဲဖြစ်ဖြစ် အရွယ်အစားမမှန်လျှင် မကောင်းပါ၊ မတူညီသောပုံစံဖြင့်သာ ဖြစ်သည်။ Model ၏ ရှုပ်ထွေးမှုသည်လည်း အလားတူပင်ဖြစ်သည်: ရိုးရှင်းလွန်းလျှင် pattern ကို မဖမ်းယူနိုင်ပါ၊ ရှုပ်ထွေးလွန်းလျှင် signal အစား noise ကို ဖမ်းယူနေတော့သည်။',
  'Model ၏ ရှုပ်ထွေးမှုသည် bias နှင့် variance ကို လဲလှယ်ပေးသည်: စွမ်းရည်နည်းလွန်းလျှင် underfit ဖြစ်သည် (bias မြင့်, စစ်မှန်သော function ကို ကိုယ်စားပြုမနိုင်); များလွန်းလျှင် overfit ဖြစ်သည် (variance မြင့်, training နမူနာတွင်ရှိခဲ့သော noise ကို fit လုပ်သည်)။'
);
export const PG_SPARK_PREDICT_Q = blSame(
  'Will the MOST complex model available always achieve the LOWEST error on the training data it was fit to?',
  'ရနိုင်သမျှ အရှုပ်ထွေးဆုံး model သည် ၎င်း fit လုပ်ခဲ့သော training data ပေါ်တွင် အနိမ့်ဆုံး error ကို အမြဲရရှိမည်လား?'
);
export const PG_SPARK_PREDICT_YES = blSame('Yes, more complexity always fits training data at least as well', 'ဟုတ်သည်၊ ရှုပ်ထွေးမှုပိုများလေ training data ကို အနည်းဆုံး တူတူ fit လုပ်နိုင်လေဖြစ်သည်');
export const PG_SPARK_PREDICT_NO = blSame('No, past some point training error gets worse too', 'မဟုတ်ပါ၊ အမှတ်တစ်ခုကျော်ပြီးနောက် training error ပါ ပိုဆိုးလာသည်');

export const PG_TRY_FIRST_PROMPT = bl(
  'Move the complexity slider until you think you\'ve found the model that fits this data best. There are no error numbers yet — trust your eye, then reveal your result.',
  'Adjust complexity to what you judge is the best fit, using only the visual fit against the scatter — no train/validation error feedback is shown until you reveal.',
  'ဒီ data နှင့် အကောင်းဆုံးကိုက်ညီမည်ဟု ထင်သော model ကို ရှာတွေ့သည်ဟု ယူဆသည်အထိ ရှုပ်ထွေးမှု slider ကို ရွှေ့ကြည့်ပါ။ error ဂဏန်းများ မရှိသေးပါ — မျက်စိကို ယုံပြီး ရလဒ်ကို reveal ပြုလုပ်ပါ။',
  'Scatter ပေါ်ရှိ visual fit ကိုသာသုံးပြီး အကောင်းဆုံးဖြစ်သည်ဟု ဆုံးဖြတ်သည့် ရှုပ်ထွေးမှုသို့ ချိန်ညှိပါ — reveal မလုပ်မချင်း train/validation error feedback ဘာမှ မပြပါ။'
);
export const PG_REVEAL_BTN = blSame('Reveal my result', 'ကျွန်ုပ်၏ ရလဒ်ကို ပြပါ');
export const PG_REVEAL_INTRO = blSame(
  "Here's how your choice actually did, and why:",
  'သင့်ရွေးချယ်မှု တကယ်ဘယ်လိုရလဒ်ရခဲ့သလဲ၊ ဘာကြောင့်ဆိုတာ ဒီမှာ:'
);
export const PG_FORMALISM_WORKED = bl(
  'Worked example: 3 validation points with errors (actual−predicted) of 2, -3, 1. Squared: 4, 9, 1. MSE = (4+9+1)/3 = 4.67. A model with errors 0.5, -0.5, 0.5 gets MSE=(0.25+0.25+0.25)/3=0.25 — far better, because squaring punishes the one big miss (the -3) much harder than three small ones.',
  'MSE = (1/n)Σ(yᵢ-ŷᵢ)²; squaring means one large residual contributes disproportionately more than several small ones of the same total magnitude — this is why a model that\'s usually close but occasionally wildly wrong scores worse than one that\'s consistently moderately off.',
  'ဖြေရှင်းချက်ဥပမာ: validation point ၃ ခု error (actual−predicted) 2, -3, 1 ရှိသည်။ Square: 4, 9, 1။ MSE = (4+9+1)/3 = 4.67။ error 0.5, -0.5, 0.5 ရှိသော model တစ်ခုသည် MSE=(0.25+0.25+0.25)/3=0.25 ရသည် — များစွာပိုကောင်းသည်၊ ဘာကြောင့်ဆိုသော် square ပြုခြင်းက အမှားကြီးတစ်ခု (-3) ကို အမှားသေးသုံးခုထက် ပိုပြင်းထန်စွာ ပြစ်ဒဏ်ပေးသောကြောင့်ဖြစ်သည်။',
  'MSE = (1/n)Σ(yᵢ-ŷᵢ)²; square ပြုခြင်းက residual ကြီးတစ်ခုသည် တန်ဖိုးစုစုပေါင်းတူညီသော residual သေးများစွာထက် အချိုးမညီ ပိုများစွာ contribute ပြုသည်ဟု ဆိုလိုသည် — ဒါကြောင့် ပုံမှန်နီးစပ်သော်လည်း တစ်ခါတစ်ရံ လွန်စွာမှားသော model တစ်ခုသည် အမြဲတမ်း အလယ်အလတ် လွဲနေသော model တစ်ခုထက် ရမှတ်ညံ့သည်။'
);
export const PG_FORMALISM_FADED = bl(
  'A model has validation errors of 4 and -4 (average magnitude 4). Another has errors of 1, 1, 1, 1, 9 (also average magnitude ~2.6, but one big miss). Step 1 — compute each model\'s MSE. Step 2 — which one does MSE penalize more harshly, and why: _____.',
  'A model has validation errors of 4 and -4 (average magnitude 4). Another has errors of 1, 1, 1, 1, 9 (also average magnitude ~2.6, but one big miss). Step 1 — compute each model\'s MSE. Step 2 — which one does MSE penalize more harshly, and why: _____.',
  'Model တစ်ခုတွင် validation error 4 နှင့် -4 ရှိသည် (ပျမ်းမျှ magnitude 4)။ နောက်တစ်ခုတွင် error 1, 1, 1, 1, 9 ရှိသည် (ပျမ်းမျှ magnitude ~2.6 ခန့်ဖြစ်သော်လည်း အမှားကြီးတစ်ခုပါ)။ အဆင့် ၁ — model တစ်ခုစီ၏ MSE ကို တွက်ပါ။ အဆင့် ၂ — ဘယ်ဟာကို MSE က ပိုပြင်းထန်စွာ ပြစ်ဒဏ်ပေးသလဲ၊ ဘာကြောင့်လဲ: _____။',
  'Model တစ်ခုတွင် validation error 4 နှင့် -4 ရှိသည် (ပျမ်းမျှ magnitude 4)။ နောက်တစ်ခုတွင် error 1, 1, 1, 1, 9 ရှိသည် (ပျမ်းမျှ magnitude ~2.6 ခန့်ဖြစ်သော်လည်း အမှားကြီးတစ်ခုပါ)။ အဆင့် ၁ — model တစ်ခုစီ၏ MSE ကို တွက်ပါ။ အဆင့် ၂ — ဘယ်ဟာကို MSE က ပိုပြင်းထန်စွာ ပြစ်ဒဏ်ပေးသလဲ၊ ဘာကြောင့်လဲ: _____။'
);
export const PG_CF_ANALOGY_BREAK = blSame(
  "The shoe-size analogy breaks down on measurability: you can measure a foot with a ruler and know the right shoe size in advance. There's no equivalent ruler for the \"right\" model complexity ahead of time — you generally have to try several and check validation error, exactly what this Playground's complexity slider and error curve let you do.",
  'ဖိနပ်အရွယ်အစား ဆင်တူပုံရိပ်သည် တိုင်းတာနိုင်မှုတွင် ပျက်စီးသည်: ခြေဖဝါးကို scale ဖြင့် တိုင်းပြီး ဖိနပ်အရွယ်အစားမှန်ကို ကြိုတင်သိနိုင်သည်။ "မှန်ကန်သော" model ရှုပ်ထွေးမှုအတွက် ကြိုတင်သိနိုင်သော scale တူတူ မရှိပါ — ပုံမှန်အားဖြင့် အများအပြားကို စမ်းသပ်ပြီး validation error ကို စစ်ဆေးရသည်၊ ဒီ Playground ၏ ရှုပ်ထွေးမှု slider နှင့် error curve က ခွင့်ပြုနေသည့်အရာအတိအကျပင်ဖြစ်သည်။'
);
export const PG_CF_CAVEAT = blSame(
  'A real caveat: "best complexity" isn\'t a fixed property of a dataset — it depends on how much data you have and how noisy it is. The exact same underlying true function needs a simpler model when data is scarce/noisy and can support a more complex one when data is abundant/clean.',
  'တကယ့် caveat: "အကောင်းဆုံး ရှုပ်ထွေးမှု" ဆိုသည်မှာ dataset ၏ ပုံသေဂုဏ်သတ္တိတစ်ခု မဟုတ်ပါ — data ဘယ်လောက်ရှိသလဲ၊ ဘယ်လောက် noisy ဖြစ်သလဲအပေါ် မူတည်သည်။ underlying true function အတူတူပင်ဖြစ်စေ data ရှားပါး/noisy ဖြစ်လျှင် ပိုရိုးရှင်းသော model လိုအပ်ပြီး data များ/သန့်ရှင်းလျှင် ပိုရှုပ်ထွေးသော model ကို ထောက်ပံ့ပေးနိုင်သည်။'
);
export const PG_CF_RETRIEVAL_Q = blSame(
  'Without looking back: why can a model with LOWER training error still be a WORSE choice than one with higher training error?',
  'ပြန်မကြည့်ဘဲ: training error ပိုနိမ့်သော model တစ်ခုသည် training error ပိုမြင့်သော model တစ်ခုထက် ဘာကြောင့် ရွေးချယ်မှုအနေဖြင့် ပိုညံ့ဖျင်းနေသေးနိုင်သလဲ?'
);
export const PG_MECHANISM_NOTE = blSame(
  'You already ran the mechanism — the fit chart and slider above. Now that you know what "underfitting" and "overfitting" actually look like, scroll back up and try a few more complexity values with informed eyes, watching both charts react together.',
  'Mechanism ကို သင်တကယ် run လုပ်ပြီးသားပါ — အထက်ပါ fit chart နှင့် slider ဖြစ်သည်။ "underfitting" နှင့် "overfitting" ဆိုတာ တကယ်ဘယ်လိုပုံစံလဲ သိပြီးသည့်အခု အထက်ကို ပြန်လှိမ့်ပြီး ရှုပ်ထွေးမှုတန်ဖိုး နောက်ထပ်အနည်းငယ်ကို သိပြီးသား မျက်စိဖြင့် စမ်းကြည့်ပါ၊ chart နှစ်ခုလုံး အတူတကွ တုံ့ပြန်ပုံကို ကြည့်ပါ။'
);
export const PG_CF_RETRIEVAL_A = blSame(
  "Because training error only measures how well the model fits data it already memorized — a complex enough model can drive training error arbitrarily low by fitting the noise in that specific sample, which then actively hurts its predictions on new, unseen data. Lower training error and better real-world performance are not the same thing.",
  'ဘာကြောင့်ဆိုသော် training error သည် model ၏ ၎င်းသိပြီးသား data ကို ဘယ်လောက်ကောင်းစွာ fit လုပ်နိုင်သလဲကိုသာ တိုင်းတာသောကြောင့်ဖြစ်သည် — ရှုပ်ထွေးလုံလောက်သော model တစ်ခုသည် ထိုနမူနာအတိအကျရှိ noise ကို fit လုပ်ခြင်းဖြင့် training error ကို ကျပန်းအနိမ့်ဆုံး ရောက်အောင်လုပ်နိုင်ပြီး ၎င်းက မမြင်ဖူးသေးသော data အသစ်ပေါ်ရှိ ခန့်မှန်းချက်ကို တက်ကြွစွာ ထိခိုက်စေသည်။ Training error နိမ့်ခြင်းနှင့် လက်တွေ့ကမ္ဘာ့ စွမ်းဆောင်ရည် ပိုကောင်းခြင်းသည် တူညီသောအရာ မဟုတ်ပါ။'
);
