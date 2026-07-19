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
