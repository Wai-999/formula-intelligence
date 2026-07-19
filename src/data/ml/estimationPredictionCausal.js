import { bl } from '../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §2. The single most
// important conceptual hinge between Stats mode and ML mode — built as its
// own interactive panel per the research doc's explicit design note.
export const EPC_INTRO = bl(
  'The same regression on gold price vs. real yields can be looked at two completely different ways. Click each column below to see what changes.',
  'The same underlying object — e.g. linear regression of gold price on real yields — supports three distinct questions. Confusing them is the single most common conceptual error at the Stats/ML boundary.',
  'ရွှေစျေးနှုန်းနှင့် real yields ကြားက regression တစ်ခုတည်းကို လုံးဝကွဲပြားသော နည်းလမ်းနှစ်မျိုးဖြင့် ကြည့်နိုင်သည်။ အောက်ပါ ကော်လံတစ်ခုစီကို နှိပ်ကြည့်ပါ။',
  'ရွှေစျေးနှုန်းကို real yields ပေါ်တွင် linear regression ပြုလုပ်သည့် object တစ်ခုတည်းသည် လုံးဝကွဲပြားသော မေးခွန်းသုံးခုကို ဖြေဆိုနိုင်သည်။ ၎င်းတို့ကို ရောထွေးမှုသည် Stats/ML နယ်စပ်တွင် အဖြစ်များဆုံး သဘောတရားအမှားဖြစ်သည်။'
);

export const EPC_COLUMNS = [
  {
    id: 'estimation',
    label: bl('Estimation', 'Estimation', 'ခန့်မှန်းခြင်း (Estimation)', 'ခန့်မှန်းခြင်း (Estimation)'),
    territory: bl('Classic Stats territory', 'Classic Stats territory', 'Stats ၏ ရိုးရာနယ်ပယ်', 'Stats ၏ ရိုးရာနယ်ပယ်'),
    goal: bl(
      'Pin down the true value of a fixed number hiding in the data — like "how much does gold really move per 1% change in real yields?"',
      'Infer the true value of a fixed but unknown parameter (a coefficient, a mean, a variance) from a sample.',
      'အချက်အလက်ထဲ ဝှက်နေသော ဂဏန်းအမှန်ကို ရှာဖွေသည် — "real yields ၁% ပြောင်းလဲတိုင်း ရွှေက အမှန်တကယ် ဘယ်လောက်ရွေ့လဲ" ကဲ့သို့။',
      'နမူနာတစ်ခုမှ ခိုင်မာသော်လည်း မသိသေးသော ပါရာမီတာတစ်ခု (coefficient၊ mean၊ variance) ၏ တန်ဖိုးအမှန်ကို ခန့်မှန်းသည်။'
    ),
    output: bl(
      'A number plus how confident we are in it.',
      'A parameter estimate + standard error / confidence interval.',
      'ဂဏန်းတစ်ခုနှင့် ၎င်းကို ဘယ်လောက်ယုံကြည်သလဲဆိုတဲ့ အတိုင်းအတာ။',
      'ပါရာမီတာ ခန့်မှန်းချက် + standard error / ယုံကြည်မှုအပိုင်းအခြား (confidence interval)။'
    ),
    example: bl(
      '"Real yields\' effect on gold is about −312 — and we\'re 95% confident the true effect is somewhere between −400 and −224."',
      '"The coefficient on real yields in a gold-price regression is −312, 95% CI [−400, −224]."',
      '"Real yields က ရွှေပေါ် သက်ရောက်မှုက −312 ခန့်ရှိပြီး — အမှန်တကယ် သက်ရောက်မှုက −400 နှင့် −224 ကြားရှိမယ်လို့ ၉၅% ယုံကြည်ပါတယ်။"',
      '"Gold-price regression ရှိ real yields ၏ coefficient သည် −312 ဖြစ်ပြီး၊ 95% CI [−400, −224] ဖြစ်သည်။"'
    ),
    methods: bl(
      'OLS, Maximum Likelihood, Bayesian methods — the same toolkit as Stats mode\'s Gibbs/PGAS content.',
      'OLS, Maximum Likelihood Estimation (MLE), Bayesian posterior estimation (Gibbs/PGAS — Stats mode\'s existing content).',
      'OLS, Maximum Likelihood, Bayesian နည်းလမ်းများ — Stats mode ၏ Gibbs/PGAS content အတိုင်းပင်။',
      'OLS, Maximum Likelihood Estimation (MLE), Bayesian posterior estimation (Gibbs/PGAS — Stats mode ရှိ content အတိုင်း)။'
    ),
    failure: bl(
      'Mistaking "I\'m confident about this coefficient" for "I know what gold will do next month" — those are different questions.',
      'Mistaking a tight confidence interval for a guarantee about a future value — the interval describes the parameter, not next quarter\'s price.',
      '"ဒီ coefficient ကို ယုံကြည်ပါတယ်" ဆိုတာနဲ့ "လာမယ့်လ ရွှေဘယ်လိုဖြစ်မလဲ သိပါတယ်" ဆိုတာ မှားနေတတ်သည် — ၎င်းတို့သည် မတူညီသောမေးခွန်းများဖြစ်သည်။',
      'Confidence interval ကျဉ်းမြောင်းခြင်းကို အနာဂတ်တန်ဖိုးအတွက် အာမခံချက်ဟု မှားထင်တတ်သည် — interval သည် ပါရာမီတာကို ဖော်ပြခြင်းဖြစ်ပြီး နောက်သုံးလပတ်စျေးနှုန်းကို မဟုတ်ပါ။'
    ),
    accentVar: '--primary',
  },
  {
    id: 'prediction',
    label: bl('Prediction', 'Prediction', 'ခန့်မှန်းချက် (Prediction)', 'ခန့်မှန်းချက် (Prediction)'),
    territory: bl('Classic ML territory', 'Classic ML territory', 'ML ၏ ရိုးရာနယ်ပယ်', 'ML ၏ ရိုးရာနယ်ပယ်'),
    goal: bl(
      'Take a real guess at a number we don\'t know yet — "what will gold actually trade at next month?"',
      'Guess the value of a random, currently-unobserved outcome.',
      'မသိသေးသော ဂဏန်းတစ်ခုကို အစစ်အမှန် ခန့်မှန်းသည် — "လာမယ့်လ ရွှေဘယ်လောက်ရောင်းဝယ်မှာလဲ" ကဲ့သို့။',
      'ကျပန်း၊ လက်ရှိမတွေ့ရသေးသော ရလဒ်တစ်ခု၏ တန်ဖိုးကို ခန့်မှန်းသည်။'
    ),
    output: bl(
      'A single best-guess number plus a plausible range around it.',
      'A point forecast + prediction interval.',
      'အကောင်းဆုံးခန့်မှန်းဂဏန်းတစ်ခုနှင့် ၎င်းပတ်ဝန်းကျင်ရှိ ဖြစ်နိုင်ချေအပိုင်းအခြား။',
      'Point forecast + prediction interval။'
    ),
    example: bl(
      '"Gold will trade around $4,180, plus or minus $150."',
      '"Gold will trade at $4,180 ± $150 next month."',
      '"ရွှေက $4,180 ဝန်းကျင်မှာ ရောင်းဝယ်မယ်၊ $150 လောက် အထက်အောက်ရှိနိုင်တယ်။"',
      '"လာမယ့်လ ရွှေက $4,180 ± $150 မှာ ရောင်းဝယ်မည်။"'
    ),
    methods: bl(
      'Regularized regression, decision trees/ensembles, neural networks — anything trained to minimize prediction error.',
      'Regularized regression, trees/ensembles, neural nets, any loss-minimizing algorithm.',
      'Regularized regression, decision tree/ensemble များ၊ neural network များ — ခန့်မှန်းအမှားကို လျှော့ချရန် လေ့ကျင့်ထားသော မည်သည့်အယ်လဂိုရီသမ်မဆို။',
      'Regularized regression, tree/ensemble များ၊ neural net များ၊ loss-minimizing algorithm မည်သည့်မဆို။'
    ),
    failure: bl(
      'Mistaking "this feature predicts well" for "this feature causes the outcome" — a model can lean hard on a variable that\'s just a bystander.',
      'Mistaking a highly predictive feature for a causal driver — ML routinely "dismisses" covariates with low predictive power even when they\'re crucial confounders.',
      '"ဒီ feature က ကောင်းကောင်းခန့်မှန်းနိုင်တယ်" ဆိုတာနဲ့ "ဒီ feature က ရလဒ်ကို ဖြစ်စေတယ်" ဆိုတာ မှားနေတတ်သည် — မော်ဒယ်တစ်ခုသည် ကပ်ပါလိုက်ရုံမျှသော variable တစ်ခုကို အလေးအနက်ထားနိုင်သည်။',
      'ခန့်မှန်းအားကောင်းသော feature ကို causal driver ဟု မှားထင်တတ်သည် — ML သည် ခန့်မှန်းအားနည်းသော covariate များကို အရေးကြီးသော confounder ဖြစ်နေသော်လည်း "ပယ်ချ" လေ့ရှိသည်။'
    ),
    accentVar: '--accent',
  },
  {
    id: 'causal',
    label: bl('Causal Inference', 'Causal Inference', 'အကြောင်းရင်း ခြေရာခံခြင်း (Causal Inference)', 'အကြောင်းရင်း ခြေရာခံခြင်း (Causal Inference)'),
    territory: bl('The often-confused third sibling', "The third, often-confused sibling", 'မကြာခဏ ရောထွေးတတ်သော တတိယညီအစ်ကို', 'မကြာခဏ ရောထွေးတတ်သော တတိယညီအစ်ကို'),
    goal: bl(
      'Work out what would have happened under a hypothetical "what if" — "if the Fed had cut rates, would gold actually have risen because of that?"',
      'Determine what a variable\'s value would have been under a hypothetical intervention.',
      '"ဒီလိုဖြစ်ခဲ့ရင်ကော" ဆိုတဲ့ ယူဆချက်တစ်ခုအောက်တွင် ဘာဖြစ်ပျက်မလဲဆိုတာကို ရှာဖွေသည် — "Fed က အတိုးနှုန်းလျှော့ခဲ့ရင် ရွှေက အဲဒါကြောင့် တကယ်တက်ခဲ့မလား" ကဲ့သို့။',
      'ယူဆချက်ဆိုင်ရာ ဝင်ရောက်စွက်ဖက်မှု (intervention) တစ်ခုအောက်တွင် variable တစ်ခု၏ တန်ဖိုးသည် မည်သို့ဖြစ်ခဲ့မည်ကို ဆုံးဖြတ်သည်။'
    ),
    output: bl(
      'An estimate of the effect of deliberately changing one thing, holding everything else fixed.',
      'An average treatment effect.',
      'တခြားအရာအားလုံးကို မပြောင်းဘဲ တစ်ခုတည်းကို တမင်ပြောင်းလိုက်လျှင် ဖြစ်ပေါ်လာမည့် သက်ရောက်မှု ခန့်မှန်းချက်။',
      'ပျမ်းမျှ ကုသမှု/ဝင်ရောက်စွက်ဖက်မှု သက်ရောက်မှု (average treatment effect)။'
    ),
    example: bl(
      '"If the Fed cuts rates by 50bps, gold rises by roughly X — holding the dollar, inflation expectations, and everything else fixed."',
      '"If the Fed cuts rates by 50bps, gold rises by X, holding everything else fixed."',
      '"Fed က အတိုးနှုန်း 50bps လျှော့ရင် ရွှေက ခန့်မှန်း X လောက် မြင့်တက်လာမယ် — ဒေါ်လာ၊ ငွေကြေးဖောင်းပွမှု မျှော်မှန်းချက်နဲ့ တခြားအရာအားလုံးကို မပြောင်းဘဲထားရင်။"',
      '"Fed က အတိုးနှုန်း 50bps လျှော့ရင်၊ တခြားအရာအားလုံးကို မပြောင်းဘဲထားလျှင် ရွှေက X လောက် မြင့်တက်မည်။"'
    ),
    methods: bl(
      'Potential-outcomes framework, instrumental variables, "double ML", randomized controlled trials.',
      'Potential-outcomes framework, instrumental variables, double ML, RCTs.',
      'Potential-outcomes framework, instrumental variable, "double ML", randomized controlled trial များ။',
      'Potential-outcomes framework, instrumental variable, double ML, RCT များ။'
    ),
    failure: bl(
      'Using a purely predictive model to claim "X causes Y" — a model can predict gold well using DXY without DXY actually driving it (both could be reacting to a third factor).',
      'Using purely predictive ML models to claim "X causes Y" — correlation ≠ causation, and predictive accuracy alone can never establish the direction or existence of a causal link.',
      'Predictive မော်ဒယ်တစ်ခုတည်းသုံးပြီး "X က Y ကို ဖြစ်စေသည်" ဟု ဆိုတတ်သည် — DXY သည် ရွှေကို တကယ်တွန်းအားမပေးဘဲလျက် ရွှေကို ကောင်းစွာခန့်မှန်းနိုင်သည် (နှစ်ခုစလုံးက တတိယအချက်တစ်ခုကို တုံ့ပြန်နေခြင်းသာ ဖြစ်နိုင်သည်)။',
      'Purely predictive ML မော်ဒယ်များသုံးပြီး "X က Y ကို ဖြစ်စေသည်" ဟု ဆိုတတ်သည် — correlation ≠ causation ဖြစ်ပြီး၊ ခန့်မှန်းတိကျမှုတစ်ခုတည်းက အကြောင်းရင်းဆက်စပ်မှု ဦးတည်ချက် (သို့) ရှိမရှိကို ဘယ်တော့မှ သက်သေမပြနိုင်ပါ။'
    ),
    accentVar: '--warning',
  },
];

export const EPC_BRIDGE_NOTE = bl(
  'Why this matters for the mode switch: the exact same model (e.g. "linear regression on gold price vs. real yields") can be looked at from either lens. Stats asks "how confident am I in this coefficient?" ML asks "how well does this generalize to gold prices next quarter?" A good learner can flip between the two questions on the same node — try it in Module 10\'s Stats↔ML Bridge.',
  'Why this matters for the mode switch: the same underlying object supports two questions — the Stats lens asks whether a coefficient is statistically significant, the ML lens asks how well the fitted model generalizes out-of-sample. Module 10 makes this a live, side-by-side interaction on identical data.',
  'Mode switch အတွက် ဘာကြောင့်အရေးကြီးလဲဆိုတော့: မော်ဒယ်တစ်ခုတည်း (ဥပမာ "ရွှေစျေးနှုန်းကို real yields ပေါ် linear regression") ကို မှန်ဘီလူးနှစ်မျိုးဖြင့် ကြည့်နိုင်သည်။ Stats က "ဒီ coefficient ကို ဘယ်လောက်ယုံကြည်လဲ" ဟု မေးပြီး ML က "ဒါက လာမယ့်သုံးလပတ် ရွှေစျေးနှုန်းအတွက် ဘယ်လောက်ကောင်းစွာ အလုပ်လုပ်မလဲ" ဟု မေးသည်။ Module 10 ၏ Stats↔ML Bridge တွင် စမ်းကြည့်ပါ။',
  'Mode switch အတွက် အရေးကြီးသည့်အကြောင်းရင်း: underlying object တစ်ခုတည်းသည် မေးခွန်းနှစ်ခုကို ဖြေဆိုနိုင်သည် — Stats မှန်ဘီလူးက coefficient သည် statistically significant ဖြစ်မဖြစ် မေးပြီး၊ ML မှန်ဘီလူးက fit လုပ်ပြီးသား မော်ဒယ်သည် out-of-sample တွင် မည်မျှ generalize ဖြစ်သည်ကို မေးသည်။ Module 10 တွင် တူညီသော data ပေါ်၌ side-by-side live interaction အဖြစ် ပြသထားသည်။'
);
