import { bl, blSame } from '../../lib/mlContent.js';

// Learning Design System retrofit (docs/research/ML-Mode-Pedagogy-Research.md
// §4.1) for Module 3's Model Relationship Map. Kept as its own lookup,
// keyed by ML_MODELS' node id, rather than interleaved into models.js —
// that file is already 550 lines and this adds a comparable amount of new
// content per node; a separate file is lower-risk to build up incrementally
// and keeps models.js's existing catalog untouched.
//
// mechanism.kind is 'live-link' for any model with a real, already-working
// interactive counterpart elsewhere in ML mode (send the learner there
// instead of building a redundant toy) or 'widget' for a small, genuine,
// model-specific MechanismWidget otherwise — see BUILD_LOG.md's Phase 1
// note for why this split exists.
export const MODEL_DEPTH_LADDER = {
  linreg: {
    spark: {
      analogy: bl(
        "Like drawing one straight ruler-line through a scatter of dots on graph paper, positioned so it's as close as possible to all of them at once — not perfectly through any single dot, but fair to every dot.",
        'A single straight-line hypothesis fit by minimizing total squared distance to every observed point simultaneously.',
        'Graph paper ပေါ်ရှိ အစက်များကို ဖြတ်သန်းသော မျဉ်းတိုင်တစ်ခုတည်းကို ဆွဲသကဲ့သို့ — အစက်တစ်ခုချင်းစီကို အတိအကျဖြတ်သွားခြင်းမဟုတ်ဘဲ အားလုံးနှင့် တတ်နိုင်သမျှ နီးအောင် ထားခြင်းဖြစ်သည်။',
        'ကြည့်ရှုတွေ့ရှိထားသော အမှတ်တိုင်းသို့ squared distance စုစုပေါင်းကို တစ်ပြိုင်နက် minimize ပြုလျှင် fit လုပ်ထားသော မျဉ်းဖြောင့် hypothesis တစ်ခုတည်း။'
      ),
      predict: {
        question: blSame(
          'If every dot lay exactly on a perfect line already, would linear regression\'s fitted line pass through all of them?',
          'အစက်တိုင်းသည် ပြီးပြည့်စုံသော မျဉ်းပေါ်တွင် အတိအကျ ရှိနေခဲ့လျှင်၊ linear regression ၏ fit လုပ်ထားသော မျဉ်းသည် အားလုံးကို ဖြတ်သွားမည်လား?'
        ),
        options: [blSame('Yes', 'ဟုတ်သည်'), blSame('No, it would still average around them', 'မဟုတ်ပါ၊ ၎င်းတို့ ပတ်ဝန်းကျင် ပျမ်းမျှနေဆဲဖြစ်လိမ့်မည်')],
        correctIndex: 0,
      },
    },
    mechanism: { kind: 'live-link', module: 'playground', label: blSame('Playground — Polynomial Regression at degree 1', 'Playground — Degree 1 ရှိ Polynomial Regression') },
    formalism: {
      worked: bl(
        'Three points (1,2), (2,4), (3,7): OLS finds the slope and intercept minimizing total squared vertical distance — here roughly ŷ = -0.83 + 2.5x, predicting ŷ≈6.67 at x=4.',
        'β₁ = Σ(xᵢ-x̄)(yᵢ-ȳ)/Σ(xᵢ-x̄)² ; for (1,2),(2,4),(3,7): x̄=2, ȳ=4.33, giving β₁=2.5, β₀=-0.67.',
        'အမှတ်သုံးခု (1,2), (2,4), (3,7): OLS သည် squared vertical distance စုစုပေါင်းကို minimize ပြုသော slope နှင့် intercept ကို ရှာသည် — ဒီနေရာမှာ ŷ = -0.83 + 2.5x ခန့်ဖြစ်ပြီး x=4 တွင် ŷ≈6.67 ခန့်မှန်းသည်။',
        'β₁ = Σ(xᵢ-x̄)(yᵢ-ȳ)/Σ(xᵢ-x̄)² ; (1,2),(2,4),(3,7) အတွက်: x̄=2, ȳ=4.33, β₁=2.5, β₀=-0.67 ရသည်။'
      ),
      faded: bl(
        'For points (0,1) and (2,5): what slope β₁ connects them? Step 1 — change in y: _____. Step 2 — change in x: _____. Step 3 — β₁ = _____.',
        'For points (0,1) and (2,5): what slope β₁ connects them? Step 1 — change in y: _____. Step 2 — change in x: _____. Step 3 — β₁ = _____.',
        'အမှတ် (0,1) နှင့် (2,5) အတွက်: ၎င်းတို့ကို ချိတ်ဆက်သော slope β₁ ဘာလဲ? အဆင့် ၁ — y ပြောင်းလဲမှု: _____။ အဆင့် ၂ — x ပြောင်းလဲမှု: _____။ အဆင့် ၃ — β₁ = _____။',
        'အမှတ် (0,1) နှင့် (2,5) အတွက်: ၎င်းတို့ကို ချိတ်ဆက်သော slope β₁ ဘာလဲ? အဆင့် ၁ — y ပြောင်းလဲမှု: _____။ အဆင့် ၂ — x ပြောင်းလဲမှု: _____။ အဆင့် ၃ — β₁ = _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The ruler analogy breaks down with more than one input: with two or more predictors, it's a flat plane (or hyperplane) through a cloud of points in higher dimensions, not a single visualizable line.",
        'Ruler ဆင်တူပုံရိပ်သည် input တစ်ခုထက်ပိုလျှင် ပျက်စီးသည်: predictor နှစ်ခု (သို့) ထို့ထက်ပိုလျှင် ၎င်းသည် dimension မြင့်ရှိ point cloud တစ်ခုကို ဖြတ်သန်းသော ပြားပြားသော plane (hyperplane) တစ်ခုဖြစ်ပြီး မြင်နိုင်သော မျဉ်းတစ်ခုတည်း မဟုတ်တော့ပါ။'
      ),
      caveat: blSame(
        'A real caveat: OLS is very sensitive to outliers — one wild data point can swing the whole fitted line noticeably, since squared error punishes large misses heavily.',
        'တကယ့် caveat: OLS သည် outlier များကို အလွန်ထိခိုက်လွယ်သည် — data point တစ်ခု ထူးဆန်းလွန်းလျှင် fit လုပ်ထားသော မျဉ်းတစ်ခုလုံးကို သိသိသာသာ ရွှေ့နိုင်သည်၊ squared error က ကြီးမားသော အမှားများကို ပြင်းထန်စွာ ပြစ်ဒဏ်ပေးသောကြောင့်ဖြစ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does OLS use squared error rather than just absolute distance?', 'ပြန်မကြည့်ဘဲ: OLS သည် ဘာကြောင့် absolute distance မဟုတ်ဘဲ squared error ကို သုံးသလဲ?'),
        answer: blSame(
          'Squaring makes the math tractable (a closed-form solution exists) and penalizes large errors disproportionately more than small ones — a design choice with real consequences (outlier sensitivity), not an arbitrary default.',
          'Square ပြုလုပ်ခြင်းက math ကို ဖြေရှင်းရလွယ်စေသည် (closed-form solution ရှိသည်) နှင့် ကြီးမားသော error များကို သေးငယ်သော error များထက် အချိုးမညီ ပိုပြင်းထန်စွာ ပြစ်ဒဏ်ပေးသည် — real သက်ရောက်မှုရှိသော ဒီဇိုင်းရွေးချယ်မှုတစ်ခုဖြစ်ပြီး ကျပန်း default မဟုတ်ပါ။'
        ),
      },
    },
  },

  ridge_lasso_en: {
    spark: {
      analogy: bl(
        "Like a strict editor who forces a writer to cut unnecessary words — Ridge/Lasso force a model's coefficients to stay small or disappear entirely, keeping only what earns its place.",
        "A penalty term added to OLS's loss function shrinks coefficients toward zero, trading a little bias for a lot less variance.",
        'အနှစ်ချုပ်စာအယ်ဒီတာတစ်ဦးက စာရေးဆရာအား မလိုအပ်သော စကားလုံးများ ဖြတ်ခိုင်းသကဲ့သို့ — Ridge/Lasso က model ၏ coefficient များကို သေးငယ်နေစေရန် (သို့) လုံးဝပျောက်ကွယ်စေရန် အတင်းလုပ်ပြီး ထိုက်တန်သည့်အရာများကိုသာ ထားရှိသည်။',
        'OLS ၏ loss function တွင် ပေါင်းထည့်ထားသော ပယ်ဒဏ်ပေါ့ဒါတစ်ခုသည် coefficient များကို သုညဘက်သို့ ချုံ့ပေးသည်၊ bias အနည်းငယ်ကို variance အများကြီး လျော့ချရန် လဲလှယ်ပေးသည်။'
      ),
      predict: {
        question: blSame(
          "As you increase the penalty strength, do the model's coefficients grow larger or shrink smaller?",
          'ပယ်ဒဏ်ပေါ့ဒါအားကို တိုးလျှင် model ၏ coefficient များ ကြီးလာမလား သေးလာမလား?'
        ),
        options: [blSame('Grow larger', 'ကြီးလာသည်'), blSame('Shrink smaller (toward zero)', 'သေးလာသည် (သုညဘက်သို့)')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'macro', label: blSame('Macro Lab — the LASSO/Elastic Net lens', 'Macro Lab — LASSO/Elastic Net lens') },
    formalism: {
      worked: bl(
        'OLS gives β=10 for a noisy feature. Add a Lasso penalty λ=2: the coefficient shrinks toward zero, and if the feature is weak enough, Lasso can push it to exactly 0 — dropping it from the model entirely, unlike Ridge which only shrinks toward (but never exactly to) zero.',
        'Lasso minimizes Σ(y-ŷ)² + λΣ|βⱼ| (L1); Ridge minimizes Σ(y-ŷ)² + λΣβⱼ² (L2). L1\'s corner-shaped constraint region is why it can produce exact zeros; L2\'s round region cannot.',
        'OLS သည် noisy feature တစ်ခုအတွက် β=10 ပေးသည်။ Lasso penalty λ=2 ထည့်ပါ: coefficient သည် သုညဘက်ချုံ့သွားပြီး၊ feature အားနည်းလွန်းလျှင် Lasso က ၎င်းကို အတိအကျ 0 သို့ တွန်းချနိုင်သည် — model ထဲမှ လုံးဝထုတ်ပယ်ခြင်း၊ Ridge ကတော့ သုညဘက်သာချုံ့ပြီး (သုညအတိအကျ) မရောက်ပါ။',
        'Lasso သည် Σ(y-ŷ)² + λΣ|βⱼ| (L1) ကို minimize ပြုသည်; Ridge သည် Σ(y-ŷ)² + λΣβⱼ² (L2) ကို minimize ပြုသည်။ L1 ၏ ထောင့်ပုံသဏ္ဍာန် constraint region ကြောင့် သုညအတိအကျ ထုတ်ပေးနိုင်ခြင်းဖြစ်သည်; L2 ၏ လုံးဝန်းပုံစံက မထုတ်ပေးနိုင်ပါ။'
      ),
      faded: bl(
        'A Ridge model with λ=0 is equivalent to what simpler model? Step 1 — recall what λ=0 does to the penalty term. Step 2 — conclusion: _____.',
        'A Ridge model with λ=0 is equivalent to what simpler model? Step 1 — recall what λ=0 does to the penalty term. Step 2 — conclusion: _____.',
        'λ=0 ရှိသော Ridge model သည် ဘယ်ပိုရိုးရှင်းသော model နှင့် ညီမျှသလဲ? အဆင့် ၁ — λ=0 က penalty term ကို ဘာဖြစ်စေသလဲ သတိရပါ။ အဆင့် ၂ — နိဂုံး: _____။',
        'λ=0 ရှိသော Ridge model သည် ဘယ်ပိုရိုးရှင်းသော model နှင့် ညီမျှသလဲ? အဆင့် ၁ — λ=0 က penalty term ကို ဘာဖြစ်စေသလဲ သတိရပါ။ အဆင့် ၂ — နိဂုံး: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The strict editor breaks down in one way: an editor decides which words to cut using judgment. Lasso decides using pure math (the L1 penalty geometry) — it has no sense of which feature is "actually" important, only which one the optimization finds cheapest to zero out.',
        'တင်းကျပ်သော အယ်ဒီတာ ဆင်တူပုံရိပ်သည် နည်းလမ်းတစ်ခုတွင် ပျက်စီးသည်: အယ်ဒီတာသည် ဘယ်စကားလုံးဖြတ်ရမလဲကို ဆင်ခြင်တုံတရားဖြင့် ဆုံးဖြတ်သည်။ Lasso သည် pure math (L1 penalty geometry) ဖြင့် ဆုံးဖြတ်သည် — ဘယ် feature က "တကယ်" အရေးကြီးသလဲဆိုတာ သိစိတ်မရှိပါ၊ optimization က ဘယ်ဟာကို zero ချရန် ပိုသက်သာမည်ဆိုတာသာ သိသည်။'
      ),
      caveat: blSame(
        'A real caveat: with strongly correlated features, Lasso tends to arbitrarily keep one and zero out the other, even if both are equally meaningful — Elastic Net (blending L1+L2) exists specifically to fix this.',
        'တကယ့် caveat: feature များ ပြင်းထန်စွာ ဆက်စပ်နေလျှင် Lasso သည် နှစ်ခုစလုံး အလားတူအဓိပ္ပာယ်ရှိသော်လည်း တစ်ခုကို ကျပန်းသိမ်းထားပြီး တစ်ခုကို zero ချတတ်သည် — Elastic Net (L1+L2 ရောနှော) သည် ဒါကို ပြင်ဆင်ရန် အထူးရှိသည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why can Lasso perform automatic feature selection but Ridge cannot?', 'ပြန်မကြည့်ဘဲ: Lasso သည် ဘာကြောင့် feature selection ကို အလိုအလျောက်လုပ်နိုင်ပြီး Ridge မလုပ်နိုင်သလဲ?'),
        answer: blSame(
          "Lasso's L1 penalty geometry has corners that intersect the loss function exactly at zero for weak coefficients; Ridge's L2 penalty is smooth and round, so it only ever shrinks coefficients close to zero, never landing exactly on it.",
          'Lasso ၏ L1 penalty geometry သည် အားနည်းသော coefficient များအတွက် loss function ကို သုညအတိအကျတွင် ဖြတ်သွားသော ထောင့်များရှိသည်; Ridge ၏ L2 penalty သည် ချောမွေ့ပြီး လုံးဝန်းသောကြောင့် coefficient များကို သုညအနီးသို့သာ ချုံ့ပေးပြီး သုညအတိအကျ ဘယ်တော့မှ မရောက်ပါ။'
        ),
      },
    },
  },

  logreg: {
    spark: {
      analogy: bl(
        "Like a dimmer switch that only ever settles between fully off and fully on — logistic regression squeezes any input into a smooth probability between 0 and 1, never below or above.",
        'A linear combination of inputs passed through the sigmoid function, converting an unbounded score into a valid probability.',
        'လုံးဝပိတ်ခြင်းနှင့် လုံးဝဖွင့်ခြင်း ကြားတွင်သာ အမြဲအေးမကျင်သည့် dimmer switch တစ်ခုသကဲ့သို့ — logistic regression သည် input မည်သည့်အရာမဆို ၀ နှင့် ၁ ကြား ချောမွေ့သော probability တစ်ခုအဖြစ် ညှစ်ထုတ်သည်၊ ၀ အောက် (သို့) ၁ အထက် ဘယ်တော့မှ မရောက်ပါ။',
        'Sigmoid function မှတဆင့် ဖြတ်သန်းသော input များ၏ linear ပေါင်းစပ်မှုတစ်ခုသည် အကန့်အသတ်မရှိသော score ကို ခိုင်မာသော probability တစ်ခုအဖြစ် ပြောင်းလဲသည်။'
      ),
      predict: {
        question: blSame(
          'As the raw linear score (before the sigmoid) goes to a very large positive number, what does the output probability approach?',
          'Sigmoid မတိုင်မီ raw linear score သည် အလွန်ကြီးမားသော positive ဂဏန်းသို့ သွားလျှင် output probability သည် ဘာဆီသို့ နီးကပ်သွားသလဲ?'
        ),
        options: [blSame('1', '1'), blSame('0', '0'), blSame('It keeps growing past 1', '1 ကို ကျော်ပြီး ဆက်ကြီးလာသည်')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you drag the raw score higher, does the output probability rise or fall?', 'Raw score ကို ပိုမြင့်စွာ ဆွဲလျှင် output probability တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 0 },
      paramLabel: blSame('Raw linear score (before sigmoid)', 'Raw linear score (sigmoid မတိုင်မီ)'),
      paramMin: -6, paramMax: 6, paramDefault: 0, paramStep: 0.5, paramDecimals: 1,
      compute: (v) => 1 / (1 + Math.exp(-v)),
      outputLabel: blSame('Output probability', 'Output probability'),
      outputDecimals: 3,
    },
    formalism: {
      worked: bl(
        'A raw score of 0 gives σ(0) = 1/(1+e⁰) = 0.5 exactly — 50/50, the natural "undecided" point. A raw score of 2 gives σ(2) = 1/(1+e⁻²) ≈ 0.88 — fairly confident.',
        'σ(z) = 1/(1+e⁻ᶻ); σ(0)=0.5 exactly by symmetry; σ(2)≈0.881, σ(-2)≈0.119.',
        'Raw score 0 က σ(0) = 1/(1+e⁰) = 0.5 အတိအကျ ပေးသည် — 50/50, သဘာဝ "မဆုံးဖြတ်ရသေး" အမှတ်ဖြစ်သည်။ Raw score 2 က σ(2) = 1/(1+e⁻²) ≈ 0.88 ပေးသည် — တော်တော်လေး ယုံကြည်စိတ်ချသည်။',
        'σ(z) = 1/(1+e⁻ᶻ); σ(0)=0.5 symmetry အရ အတိအကျ; σ(2)≈0.881, σ(-2)≈0.119။'
      ),
      faded: bl(
        'What raw score gives exactly σ(z)=0.5? Step 1 — recall the symmetry point of the sigmoid. Step 2 — answer: _____.',
        'What raw score gives exactly σ(z)=0.5? Step 1 — recall the symmetry point of the sigmoid. Step 2 — answer: _____.',
        'ဘယ် raw score က σ(z)=0.5 အတိအကျ ပေးမလဲ? အဆင့် ၁ — sigmoid ၏ symmetry အမှတ်ကို သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'ဘယ် raw score က σ(z)=0.5 အတိအကျ ပေးမလဲ? အဆင့် ၁ — sigmoid ၏ symmetry အမှတ်ကို သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The dimmer-switch analogy breaks down on the shape: a physical dimmer is usually linear (twist it twice as far, get twice the brightness). The sigmoid is emphatically not — it's steepest near the middle and flattens out hard near 0 and 1, so equal nudges to the raw score matter far less once you're already confident.",
        'Dimmer switch ဆင်တူပုံရိပ်သည် ပုံသဏ္ဍာန်တွင် ပျက်စီးသည်: ရုပ်ပိုင်းဆိုင်ရာ dimmer သည် ပုံမှန်အားဖြင့် linear ဖြစ်သည် (နှစ်ဆလှည့်ပါက အလင်းရောင် နှစ်ဆရသည်)။ Sigmoid မူ ဒီလိုမဟုတ်ပါ — အလယ်အနီးတွင် အစောက်ဆုံးဖြစ်ပြီး 0 နှင့် 1 အနီးတွင် ပြားလွှာသွားသည်၊ ဒါကြောင့် ယုံကြည်စိတ်ချပြီးသားဖြစ်လျှင် raw score ကို တူညီစွာနှိုးဆွမှု၏ သက်ရောက်မှု ပိုနည်းသွားသည်။'
      ),
      caveat: blSame(
        'A real caveat: logistic regression\'s decision boundary is linear in the original feature space unless features are explicitly transformed (e.g. squared terms added) — it cannot natively learn a curved boundary the way a tree or SVM with a kernel can.',
        'တကယ့် caveat: logistic regression ၏ decision boundary သည် feature များကို ရှင်းရှင်းလင်းလင်း ပြောင်းလဲမထားလျှင် (ဥပမာ squared term ထပ်ထည့်ခြင်း) မူရင်း feature space တွင် linear ဖြစ်နေမည် — tree (သို့) kernel ပါသော SVM ကဲ့သို့ ကွေးသော boundary ကို native အနေဖြင့် သင်ယူနိုင်မည်မဟုတ်ပါ။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is the sigmoid\'s output always strictly between 0 and 1, never equal to either?', 'ပြန်မကြည့်ဘဲ: sigmoid ၏ output သည် ဘာကြောင့် 0 နှင့် 1 ကြားတွင်သာ အမြဲရှိပြီး နှစ်ခုစလုံးနှင့် ဘယ်တော့မှ မတူညီသလဲ?'),
        answer: blSame(
          "e⁻ᶻ is strictly positive for any finite z (it can get extremely small or large but never reach exactly 0), so 1/(1+e⁻ᶻ) can get arbitrarily close to 0 or 1 but never actually touch either endpoint.",
          'e⁻ᶻ သည် finite z မည်သည့်အတွက်မဆို strictly positive ဖြစ်သည် (အလွန်သေးငယ် (သို့) ကြီးမားနိုင်သော်လည်း 0 အတိအကျ ဘယ်တော့မှ မရောက်ပါ)၊ ဒါကြောင့် 1/(1+e⁻ᶻ) သည် 0 (သို့) 1 အနီးသို့ မည်မျှမဆို ချဉ်းကပ်နိုင်သော်လည်း အစွန်းတစ်ခုခုကို ဘယ်တော့မှ အမှန်တကယ် မထိနိုင်ပါ။'
        ),
      },
    },
  },

  knn: {
    spark: {
      analogy: bl(
        "Like asking your five closest neighbors what they think before making a decision, then going with the majority — KNN predicts a new point by literally looking up the most similar past examples and averaging their answers.",
        'A non-parametric method predicting a new point from the k most similar stored training examples, with no fitted formula at all.',
        'ဆုံးဖြတ်ချက်မချမီ သင့်အနီးဆုံး အိမ်နီးချင်း ငါးဦးကို ထင်မြင်ချက်မေးပြီး များစုအလိုက် လိုက်နာသကဲ့သို့ — KNN သည် အမှတ်အသစ်တစ်ခုကို အလားတူဆုံး သိမ်းထားသော training ဥပမာများကို တကယ် ပြန်ရှာပြီး ၎င်းတို့၏ အဖြေများကို ပျမ်းမျှသည်။',
        'Non-parametric method တစ်ခုသည် fit လုပ်ထားသော formula လုံးဝမရှိဘဲ သိမ်းထားသော training ဥပမာ k ခုအနက် အလားတူဆုံးများမှ အမှတ်အသစ်တစ်ခုကို ခန့်မှန်းသည်။'
      ),
      predict: {
        question: blSame(
          'As k (the number of neighbors consulted) grows very large, does the prediction get smoother/more stable, or noisier?',
          'k (ဆွေးနွေးအကြံဉာဏ်ယူသည့် အိမ်နီးချင်းအရေအတွက်) အလွန်ကြီးလာလျှင် ခန့်မှန်းချက်သည် ချောမွေ့/ပိုတည်ငြိမ်လာမလား၊ noise ပိုများလာမလား?'
        ),
        options: [blSame('Smoother/more stable', 'ချောမွေ့/ပိုတည်ငြိမ်လာသည်'), blSame('Noisier', 'noise ပိုများလာသည်')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase k, does the prediction swing around more or settle down?', 'k ကို တိုးလျှင် ခန့်မှန်းချက်သည် ပိုလှုပ်ရှားမလား တည်ငြိမ်သွားမလား?'), options: [blSame('Swings around more', 'ပိုလှုပ်ရှားသည်'), blSame('Settles down', 'တည်ငြိမ်သွားသည်')], correctIndex: 1 },
      paramLabel: blSame('k (number of neighbors)', 'k (အိမ်နီးချင်းအရေအတွက်)'),
      paramMin: 1, paramMax: 25, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.max(0.5, 8 / Math.sqrt(v)),
      outputLabel: blSame('Toy prediction variance (illustrative)', 'ဥပမာ ခန့်မှန်းချက် variance (သရုပ်ဖော်)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Predicting demand at a new price with k=3: the three historical price points closest to the query are $14, $15, $16 with demands 520, 480, 470. The k=3 prediction is their average: (520+480+470)/3 ≈ 490.',
        'ŷ(x) = (1/k)Σᵢ∈Nₖ(x) yᵢ where Nₖ(x) is the set of k training points closest to x under a chosen distance metric.',
        'ဈေးနှုန်းအသစ်တစ်ခုတွင် k=3 ဖြင့် demand ခန့်မှန်းခြင်း: query နှင့် အနီးဆုံး သမိုင်းဝင် ဈေးနှုန်းအမှတ်သုံးခုသည် $14, $15, $16 ဖြစ်ပြီး demand 520, 480, 470 ဖြစ်သည်။ k=3 ခန့်မှန်းချက်သည် ၎င်းတို့၏ ပျမ်းမျှ: (520+480+470)/3 ≈ 490 ဖြစ်သည်။',
        'ŷ(x) = (1/k)Σᵢ∈Nₖ(x) yᵢ, Nₖ(x) သည် ရွေးချယ်ထားသော distance metric အောက်တွင် x နှင့် အနီးဆုံး training point k ခု၏ အစုအဖြစ်ဖြစ်သည်။'
      ),
      faded: bl(
        'With k=1 instead of k=3 at the same query point, which single historical value would the prediction equal? Step 1 — find the single closest point. Step 2 — answer: _____.',
        'With k=1 instead of k=3 at the same query point, which single historical value would the prediction equal? Step 1 — find the single closest point. Step 2 — answer: _____.',
        'တူညီသော query အမှတ်တွင် k=3 အစား k=1 ဖြင့်၊ ခန့်မှန်းချက်သည် ဘယ် သမိုင်းဝင်တန်ဖိုးတစ်ခုတည်းနှင့် ညီမျှမည်နည်း? အဆင့် ၁ — အနီးဆုံး အမှတ်တစ်ခုတည်းကို ရှာပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'တူညီသော query အမှတ်တွင် k=3 အစား k=1 ဖြင့်၊ ခန့်မှန်းချက်သည် ဘယ် သမိုင်းဝင်တန်ဖိုးတစ်ခုတည်းနှင့် ညီမျှမည်နည်း? အဆင့် ၁ — အနီးဆုံး အမှတ်တစ်ခုတည်းကို ရှာပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'dataStorage',
      analogyBreakdown: blSame(
        'The neighbor-asking analogy is unusually faithful here — this is one of the few models where the analogy barely breaks down, because KNN really does just look things up rather than compress them into learned parameters. If anything, the analogy undersells how literally this happens.',
        'အိမ်နီးချင်းမေးခြင်း ဆင်တူပုံရိပ်သည် ဒီနေရာမှာ ထူးထူးခြားခြား တိကျသည် — KNN သည် သင်ယူထားသော parameter များအဖြစ် ချုံ့ခြင်းအစား တကယ်ပင် ပြန်ရှာဖွေရုံသာဖြစ်သော model အနည်းငယ်ထဲမှ တစ်ခုဖြစ်သောကြောင့် ဆင်တူပုံရိပ် ဒီနေရာတွင် ဗွက်မထူပါ။ တကယ်ဆိုရင် ဆင်တူပုံရိပ်က ဒါမည်မျှ အတိအကျဖြစ်ကြောင်း လျှော့တွက်ထားသည်ဟု ပြောနိုင်သည်။'
      ),
      caveat: blSame(
        'A real caveat: KNN needs feature scaling — if one feature ranges 0-1 and another ranges 0-10000, distance calculations get dominated by the large-scale feature entirely, even if it\'s not actually more important.',
        'တကယ့် caveat: KNN သည် feature scaling လိုအပ်သည် — feature တစ်ခု 0-1 range ရှိပြီး တစ်ခု 0-10000 range ရှိလျှင်, distance တွက်ချက်မှုများကို scale ကြီးသော feature က လွှမ်းမိုးသွားမည်ဖြစ်ပြီး ၎င်းသည် တကယ်ပင် ပိုအရေးကြီးသည်ဟု မဆိုလိုပါ။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does KNN specifically get slower as the training dataset grows, unlike most other models here?', 'ပြန်မကြည့်ဘဲ: ဒီနေရာက တခြား model အများစုနှင့် မတူဘဲ KNN သည် ဘာကြောင့် training dataset ကြီးလာသည်နှင့်အမျှ နှေးလာသလဲ?'),
        answer: blSame(
          "Every other model here compresses the training data into a fixed set of parameters once, at training time — prediction afterward is fast regardless of dataset size. KNN never compresses anything; every single prediction has to search through the entire stored dataset again, so more stored data directly means more work per prediction.",
          'ဒီနေရာက တခြား model အားလုံးသည် training data ကို training time တွင် တစ်ကြိမ် parameter အစုတစ်ခု အဖြစ် ချုံ့ထားသည် — နောက်ပိုင်း ခန့်မှန်းချက်သည် dataset အရွယ်အစားနှင့်မသက်ဆိုင်ဘဲ မြန်ဆန်သည်။ KNN သည် ဘာမှ ဘယ်တော့မှ မချုံ့ပါ; ခန့်မှန်းချက်တစ်ခုစီသည် သိမ်းထားသော dataset တစ်ခုလုံးကို ပြန်လည်ရှာဖွေရသည်၊ ဒါကြောင့် သိမ်းထားသောဒေတာ ပိုများလေ ခန့်မှန်းချက်တစ်ခုစီအတွက် အလုပ်ပိုများလေဖြစ်သည်။'
        ),
      },
    },
  },

  naive_bayes: {
    spark: {
      analogy: bl(
        "Like guessing someone's profession from a few overheard words, assuming each word is an independent clue rather than checking if the words make sense together — fast, often right, but occasionally missing an obvious combination.",
        "Applies Bayes' theorem with a simplifying (and often false) independence assumption between features, trading some accuracy for speed and simplicity.",
        'ကြားရသော စကားလုံးအနည်းငယ်မှ တစ်ဦး၏ အလုပ်အကိုင်ကို ခန့်မှန်းသကဲ့သို့ — စကားလုံးတစ်ခုစီကို အတူတကွ အဓိပ္ပာယ်ရှိမရှိ စစ်ဆေးမည့်အစား သီးခြားလွတ်လပ်သော clue တစ်ခုစီအဖြစ် ယူဆသည် — မြန်ဆန်၊ များသောအားဖြင့် မှန်ကန်သော်လည်း တစ်ခါတစ်ရံ ထင်ရှားသော ပေါင်းစပ်မှုတစ်ခုကို လွတ်သွားနိုင်သည်။',
        'Feature များကြား ရိုးရှင်းစေသော (မကြာခဏ မှားနေတတ်သော) independence ယူဆချက်ဖြင့် Bayes သီအိုရမ်ကို အသုံးချသည်၊ တိကျမှုအနည်းငယ်ကို အမြန်နှုန်းနှင့် ရိုးရှင်းမှုအတွက် လဲလှယ်သည်။'
      ),
      predict: {
        question: blSame(
          "If two features are actually strongly correlated (e.g. \"mentions war\" and \"mentions sanctions\"), does Naive Bayes' independence assumption hurt or help its accuracy on that pair?",
          'Feature နှစ်ခု တကယ်ပင် ပြင်းထန်စွာ ဆက်စပ်နေလျှင် (ဥပမာ "စစ်ပွဲ ဖော်ပြခြင်း" နှင့် "ပိတ်ဆို့မှု ဖော်ပြခြင်း"), Naive Bayes ၏ independence ယူဆချက်သည် ထိုနှစ်ခုတွင် တိကျမှုကို ထိခိုက်စေမလား ကူညီမလား?'
        ),
        options: [blSame('Hurts it', 'ထိခိုက်စေသည်'), blSame('Helps it', 'ကူညီသည်')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As a word becomes more typical of "positive news" in training data, does its contribution to a positive prediction rise or fall?', 'စကားလုံးတစ်ခုသည် training data ထဲတွင် "အပြုသဘောသတင်း" ၏ ပိုမိုပုံမှန်လာလျှင် အပြုသဘော ခန့်မှန်းချက်သို့ ၎င်း၏ contribution တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 0 },
      paramLabel: blSame('P(word | positive news) — how typical the word is', '"P(word | positive news)" — စကားလုံး ဘယ်လောက်ပုံမှန်ရှိသလဲ'),
      paramMin: 0.05, paramMax: 0.95, paramDefault: 0.5, paramStep: 0.05, paramDecimals: 2,
      compute: (v) => v / (v + (1 - v)) * 100,
      outputLabel: blSame('Toy contribution to "positive" score (%)', '"အပြုသဘော" score သို့ ဥပမာ contribution (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Classifying a headline as positive/negative news: P(positive)=0.5 prior. Word "cut" appears in 70% of positive headlines, 20% of negative ones. Posterior odds shift toward positive by a factor of 0.7/0.2=3.5, multiplied in for every independent word in the headline.',
        'P(y|x)∝P(y)∏ᵢP(xᵢ|y); each word contributes a multiplicative factor P(word|y) independently, so log P(y|x) = log P(y) + Σᵢ log P(xᵢ|y) — a simple sum once in log-space.',
        'Headline တစ်ခုကို positive/negative သတင်းအဖြစ် classify ခြင်း: P(positive)=0.5 prior။ "cut" စကားလုံးသည် positive headline ၏ 70% တွင် ပေါ်လာပြီး negative ၏ 20% တွင်သာ ပေါ်သည်။ Posterior odds သည် 0.7/0.2=3.5 ဆ positive ဘက်သို့ ရွှေ့သွားသည်၊ headline ထဲရှိ လွတ်လပ်သော စကားလုံးတိုင်းအတွက် မြှောက်သွားသည်။',
        'P(y|x)∝P(y)∏ᵢP(xᵢ|y); စကားလုံးတစ်ခုစီသည် P(word|y) မြှောက်ကိန်း factor တစ်ခုစီ contribute ပြုသည်၊ ဒါကြောင့် log P(y|x) = log P(y) + Σᵢ log P(xᵢ|y) — log-space တွင် ရိုးရှင်းသော ပေါင်းခြင်းတစ်ခုဖြစ်သည်။'
      ),
      faded: bl(
        'If a word appears equally often (50/50) in positive and negative headlines, what factor does it multiply the odds by? Step 1 — compute P(word|positive)/P(word|negative). Step 2 — answer: _____ (does this word carry any signal?)',
        'If a word appears equally often (50/50) in positive and negative headlines, what factor does it multiply the odds by? Step 1 — compute P(word|positive)/P(word|negative). Step 2 — answer: _____ (does this word carry any signal?)',
        'စကားလုံးတစ်ခုသည် positive နှင့် negative headline များတွင် အညီအမျှ (50/50) ပေါ်လျှင် odds ကို ဘယ် factor ဖြင့် မြှောက်သလဲ? အဆင့် ၁ — P(word|positive)/P(word|negative) ကို တွက်ပါ။ အဆင့် ၂ — အဖြေ: _____ (ဒီစကားလုံးက signal တစ်ခုခု ဆောင်သလား?)',
        'စကားလုံးတစ်ခုသည် positive နှင့် negative headline များတွင် အညီအမျှ (50/50) ပေါ်လျှင် odds ကို ဘယ် factor ဖြင့် မြှောက်သလဲ? အဆင့် ၁ — P(word|positive)/P(word|negative) ကို တွက်ပါ။ အဆင့် ၂ — အဖြေ: _____ (ဒီစကားလုံးက signal တစ်ခုခု ဆောင်သလား?)'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The overheard-words analogy breaks down on scale: a human listener would naturally notice when two clues are clearly related and adjust. Naive Bayes has no such adjustment mechanism built in at all — the independence assumption isn't a rough approximation it can self-correct, it's baked permanently into the math.",
        'ကြားရသော စကားလုံးများ ဆင်တူပုံရိပ်သည် scale တွင် ပျက်စီးသည်: လူသားနားထောင်သူတစ်ဦးသည် clue နှစ်ခု ဆက်စပ်နေကြောင်း သဘာဝကျစွာ သတိထားမိပြီး ချိန်ညှိတတ်သည်။ Naive Bayes တွင် ဒီလို ချိန်ညှိမှု mechanism လုံးဝမရှိပါ — independence ယူဆချက်သည် ကိုယ်တိုင် ပြင်ဆင်နိုင်သော အကြမ်းဖျင်း approximation မဟုတ်ဘဲ math ထဲသို့ အမြဲအတွက် ထည့်သွင်းထားခြင်းဖြစ်သည်။'
      ),
      caveat: blSame(
        'A real caveat: despite the "naive" independence assumption being frequently technically false, Naive Bayes still performs surprisingly well in practice on many text classification tasks — the assumption being wrong doesn\'t always mean the predictions are wrong.',
        'တကယ့် caveat: "naive" independence ယူဆချက်သည် technically မှားနေလေ့ရှိသော်လည်း Naive Bayes သည် စာသား classification task များစွာတွင် လက်တွေ့တွင် အံ့သြဖွယ် ကောင်းစွာ လုပ်ဆောင်နိုင်သည် — ယူဆချက် မှားနေခြင်းသည် ခန့်မှန်းချက် မှားနေမည်ဟု အမြဲမဆိုလိုပါ။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does Naive Bayes need "little data" compared to models like deep networks?', 'ပြန်မကြည့်ဘဲ: Naive Bayes သည် deep network ကဲ့သို့ model များနှင့် နှိုင်းယှဉ်လျှင် ဘာကြောင့် "ဒေတာအနည်းငယ်" သာ လိုအပ်သလဲ?'),
        answer: blSame(
          "Because it estimates each feature's probability independently and separately (one small table per feature) rather than jointly learning complex interactions between all features at once — independent estimates need far fewer examples to become reliable than joint ones do.",
          'ဘာကြောင့်ဆိုသော် ၎င်းသည် feature အားလုံးကြား ရှုပ်ထွေးသော interaction များကို တစ်ပြိုင်နက် ပူးတွဲသင်ယူမည့်အစား feature တစ်ခုစီ၏ probability ကို သီးခြား၊ လွတ်လပ်စွာ ခန့်မှန်းသောကြောင့်ဖြစ်သည် (feature တစ်ခုစီအတွက် table သေးသေးလေးတစ်ခု) — လွတ်လပ်သော ခန့်မှန်းချက်များသည် ယုံကြည်ရလာရန် ပူးတွဲခန့်မှန်းချက်များထက် ဥပမာ ပိုနည်းနည်းသာ လိုအပ်သည်။'
        ),
      },
    },
  },

  dtree: {
    spark: {
      analogy: bl(
        "Like a game of 20 questions — each yes/no question narrows down the possibilities, and after enough questions you land on an answer, following one specific path down a flowchart.",
        'Repeatedly splits the data by the single feature/threshold that best separates outcomes, building a flowchart of decisions.',
        'မေးခွန်း ၂၀ ဂိမ်းကစားခြင်းသကဲ့သို့ — ဟုတ်/မဟုတ် မေးခွန်းတစ်ခုစီက ဖြစ်နိုင်ခြေများကို ကျဉ်းစေပြီး၊ လုံလောက်စွာ မေးပြီးနောက် flowchart တစ်ခုအောက်ရှိ လမ်းကြောင်းအတိအကျတစ်ခုကို လိုက်နာကာ အဖြေတစ်ခုသို့ ရောက်ရှိသည်။',
        'ရလဒ်များကို အကောင်းဆုံးခွဲခြားပေးမည့် feature/threshold တစ်ခုစီဖြင့် data ကို ထပ်ခါထပ်ခါ ပိုင်းခြားပြီး ဆုံးဖြတ်ချက် flowchart တစ်ခု တည်ဆောက်သည်။'
      ),
      predict: {
        question: blSame(
          'Does a decision tree ever produce a smoothly curved prediction boundary, or only sharp, blocky steps?',
          'Decision tree သည် ချောမွေ့သော ကွေးသော prediction boundary ထုတ်ပေးဖူးသလား၊ ဒါမှမဟုတ် ထက်မြက်သော block ပုံစံ အဆင့်များကိုသာ ထုတ်ပေးသလား?'
        ),
        options: [blSame('Smoothly curved', 'ချောမွေ့စွာ ကွေးသည်'), blSame('Sharp, blocky steps only', 'ထက်မြက်သော block ပုံစံအဆင့်များသာ')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'playground', label: blSame('Playground — Decision Tree', 'Playground — Decision Tree') },
    formalism: {
      worked: bl(
        'Splitting 10 gold-forecast examples by "real yields > 0?": 6 examples with yields>0 have average outcome "price falls" (say -50), 4 with yields≤0 average "price rises" (+40). This single split already separates the two groups cleanly — a good candidate first split.',
        'At each node, the algorithm picks (feature, threshold) maximizing information gain: IG = impurity(parent) − Σ(nᵢ/n)·impurity(childᵢ), using Gini or entropy as the impurity measure.',
        'Gold ခန့်မှန်းချက် ဥပမာ ၁၀ ခုကို "real yields > 0?" ဖြင့် ပိုင်းခြားခြင်း: yields>0 ရှိသော ဥပမာ ၆ ခု၏ ပျမ်းမျှရလဒ်မှာ "ဈေးကျ" (−50 ဆိုပါစို့) ဖြစ်ပြီး yields≤0 ရှိသော ၄ ခု၏ ပျမ်းမျှမှာ "ဈေးတက်" (+40) ဖြစ်သည်။ ဒီ split တစ်ခုတည်းက အုပ်စုနှစ်စုကို သန့်ရှင်းစွာ ပိုင်းခြားပေးပြီးသား — ပထမဆုံး split ကောင်းကောင်းတစ်ခုဖြစ်သည်။',
        'Node တစ်ခုစီတွင် algorithm သည် information gain ကို maximize ပြုမည့် (feature, threshold) ကို ရွေးချယ်သည်: IG = impurity(parent) − Σ(nᵢ/n)·impurity(childᵢ), Gini (သို့) entropy ကို impurity measure အဖြစ်သုံးသည်။'
      ),
      faded: bl(
        'If a split perfectly separates two classes (impurity=0 on both sides), what is the information gain relative to a useless split (impurity unchanged)? Step 1 — recall the IG formula. Step 2 — answer: _____.',
        'If a split perfectly separates two classes (impurity=0 on both sides), what is the information gain relative to a useless split (impurity unchanged)? Step 1 — recall the IG formula. Step 2 — answer: _____.',
        'Split တစ်ခုသည် class နှစ်ခုကို ပြီးပြည့်စုံစွာ ပိုင်းခြားလျှင် (နှစ်ဖက်စလုံး impurity=0), အသုံးမဝင်သော split (impurity မပြောင်းလဲ) နှင့် နှိုင်းယှဉ်လျှင် information gain ဘယ်လောက်လဲ? အဆင့် ၁ — IG formula ကို သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Split တစ်ခုသည် class နှစ်ခုကို ပြီးပြည့်စုံစွာ ပိုင်းခြားလျှင် (နှစ်ဖက်စလုံး impurity=0), အသုံးမဝင်သော split (impurity မပြောင်းလဲ) နှင့် နှိုင်းယှဉ်လျှင် information gain ဘယ်လောက်လဲ? အဆင့် ၁ — IG formula ကို သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The 20-questions analogy breaks down on flexibility: a clever human player can change strategy mid-game based on unexpected answers. A trained tree's questions and their order are completely fixed after training — every input follows a rigid, pre-determined path with no room for improvisation.",
        'မေးခွန်း ၂၀ ဆင်တူပုံရိပ်သည် လိုက်လျောညီထွေမှုတွင် ပျက်စီးသည်: ဉာဏ်ကောင်းသော လူသားကစားသမားသည် မမျှော်လင့်ထားသော အဖြေများပေါ်မူတည်ပြီး ဂိမ်းအလယ်တွင် strategy ပြောင်းနိုင်သည်။ Train လုပ်ပြီးသား tree ၏ မေးခွန်းများနှင့် ၎င်းတို့ order သည် training ပြီးနောက် လုံးဝ ပုံသေဖြစ်နေသည် — input တိုင်းသည် improvisation ခွင့်မရှိသော တင်းကျပ်၊ ကြိုတင်ဆုံးဖြတ်ထားသော လမ်းကြောင်းကို လိုက်နာသည်။'
      ),
      caveat: blSame(
        'A real caveat: a single decision tree is notoriously unstable — a tiny change in the training data can produce a completely different tree structure from the top down, which is exactly the instability Random Forest and Gradient Boosting exist to fix by averaging many trees.',
        'တကယ့် caveat: decision tree တစ်ခုတည်းသည် ကျော်ကြားစွာ မတည်ငြိမ်ပါ — training data တွင် အနည်းငယ်ပြောင်းလဲမှုသည် အပေါ်မှအောက်အထိ လုံးဝကွဲပြားသော tree structure တစ်ခု ထုတ်ပေးနိုင်သည်၊ ဒါသည် Random Forest နှင့် Gradient Boosting က tree များစွာ ပျမ်းမျှခြင်းဖြင့် ပြင်ဆင်ရန် ရှိနေသော မတည်ငြိမ်မှုပင်ဖြစ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is a single decision tree usually less accurate than an ensemble like Random Forest, even though it\'s more interpretable?', 'ပြန်မကြည့်ဘဲ: decision tree တစ်ခုတည်းသည် ပိုနားလည်ရလွယ်ကူသော်လည်း ဘာကြောင့် Random Forest ကဲ့သို့ ensemble ထက် ပုံမှန်အားဖြင့် တိကျမှုနည်းသလဲ?'),
        answer: blSame(
          "A single tree's structure depends heavily on the exact training sample it saw — it overfits to noise as well as real patterns. Averaging many independently-grown trees cancels out each one's individual noise-driven mistakes while keeping the real pattern they all share.",
          'Tree တစ်ခုတည်း၏ structure သည် ၎င်းတွေ့ခဲ့သော training sample အတိအကျအပေါ် အလွန်မှီခိုနေသည် — real pattern များကဲ့သို့ noise ကိုပါ overfit ဖြစ်တတ်သည်။ လွတ်လပ်စွာ ကြီးထွားထားသော tree များစွာကို ပျမ်းမျှခြင်းက ၎င်းတို့အားလုံး မျှဝေထားသော real pattern ကို ထိန်းသိမ်းစဉ် တစ်ခုချင်းစီ၏ noise-driven အမှားများကို ပယ်ဖျက်ပေးသည်။'
        ),
      },
    },
  },

  rf: {
    spark: {
      analogy: bl(
        "Like polling hundreds of independent forecasters who each saw a slightly different slice of the evidence, then averaging their guesses — no single forecaster's blind spot dominates the final answer.",
        'An ensemble of many decision trees, each trained on a bootstrap resample with a random feature subset per split, combined by averaging.',
        'သက်သေအထောက်အထား၏ အနည်းငယ်ကွဲပြားသော အပိုင်းအစတစ်ခုစီကို တွေ့ရှိထားသော ခန့်မှန်းသူ လွတ်လပ်စွာရာနှင့်ချီကို စစ်တမ်းကောက်ပြီး ၎င်းတို့၏ ခန့်မှန်းချက်များကို ပျမ်းမျှသကဲ့သို့ — ခန့်မှန်းသူတစ်ဦးတည်း၏ မျက်စိကန်းရာသည် နောက်ဆုံးအဖြေကို လွှမ်းမိုးမည်မဟုတ်ပါ။',
        'Bootstrap resample တစ်ခုစီပေါ်တွင် split တစ်ခုစီတွင် ကျပန်း feature subset ဖြင့် decision tree များစွာကို train လုပ်ထားပြီး ပျမ်းမျှခြင်းဖြင့် ပေါင်းစည်းထားသော ensemble တစ်ခု။'
      ),
      predict: {
        question: blSame('Does adding more trees to a Random Forest ever make it systematically MORE biased (not just slower)?', 'Random Forest သို့ tree ပိုများများ ထည့်ခြင်းသည် ၎င်းကို systematically ပို bias ဖြစ်စေဖူးသလား (နှေးရုံသာမက)?'),
        options: [blSame('Yes', 'ဟုတ်သည်'), blSame('No, it mostly reduces variance without changing bias much', 'မဟုတ်ပါ၊ bias ကို သိသိသာသာ မပြောင်းလဲဘဲ variance ကိုသာ လျှော့ချသည်')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'macro', label: blSame('Macro Lab — the Random Forest lens', 'Macro Lab — Random Forest lens') },
    formalism: {
      worked: bl(
        'Three trees predict tomorrow\'s gold move as +$30, -$10, +$50 respectively (each saw a different bootstrap sample). Random Forest\'s prediction is their average: (30-10+50)/3 ≈ $23 — smoothing away each tree\'s individual noise.',
        'ŷ(x) = (1/B)Σᵦ Tᵦ(x) over B bootstrap-trained trees; Var(ŷ) = ρσ² + (1-ρ)σ²/B, where ρ is inter-tree correlation — decorrelating trees via random feature subsets is what makes averaging actually help.',
        'Tree သုံးခုသည် မနက်ဖြန် ရွှေ့ရွှေ့လျား ($30, -$10, +$50) အသီးသီးကို ခန့်မှန်းသည် (တစ်ခုစီက bootstrap sample မတူညီစွာ တွေ့ခဲ့သည်)။ Random Forest ၏ ခန့်မှန်းချက်သည် ၎င်းတို့၏ ပျမ်းမျှ: (30-10+50)/3 ≈ $23 — tree တစ်ခုချင်းစီ၏ noise ကို ချောမွေ့ပေးသည်။',
        'ŷ(x) = (1/B)Σᵦ Tᵦ(x), bootstrap-trained tree B ခုအပေါ်; Var(ŷ) = ρσ² + (1-ρ)σ²/B, ρ သည် tree ကြား correlation ဖြစ်သည် — ကျပန်း feature subset မှတဆင့် tree များကို decorrelate ပြုခြင်းသည် ပျမ်းမျှခြင်းကို တကယ်အသုံးဝင်စေသည့်အချက်ဖြစ်သည်။'
      ),
      faded: bl(
        'If all trees in the forest were identical (ρ=1, perfectly correlated), what would averaging them actually accomplish for variance? Step 1 — plug ρ=1 into Var(ŷ)=ρσ²+(1-ρ)σ²/B. Step 2 — answer: _____.',
        'If all trees in the forest were identical (ρ=1, perfectly correlated), what would averaging them actually accomplish for variance? Step 1 — plug ρ=1 into Var(ŷ)=ρσ²+(1-ρ)σ²/B. Step 2 — answer: _____.',
        'တောထဲရှိ tree အားလုံးတူညီနေလျှင် (ρ=1, ပြီးပြည့်စုံစွာ correlate), ၎င်းတို့ကို ပျမ်းမျှခြင်းက variance အတွက် တကယ်ဘာအောင်မြင်စေမလဲ? အဆင့် ၁ — Var(ŷ)=ρσ²+(1-ρ)σ²/B ထဲ ρ=1 ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'တောထဲရှိ tree အားလုံးတူညီနေလျှင် (ρ=1, ပြီးပြည့်စုံစွာ correlate), ၎င်းတို့ကို ပျမ်းမျှခြင်းက variance အတွက် တကယ်ဘာအောင်မြင်စေမလဲ? အဆင့် ၁ — Var(ŷ)=ρσ²+(1-ρ)σ²/B ထဲ ρ=1 ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The polling-forecasters analogy breaks down on independence: real human forecasters often read each other's opinions and converge. Random Forest actively engineers its trees to stay independent (random feature subsets per split specifically prevent them from converging on the same reasoning) — the decorrelation is deliberate, not assumed.",
        'ခန့်မှန်းသူများ စစ်တမ်းကောက်ခြင်း ဆင်တူပုံရိပ်သည် လွတ်လပ်မှုတွင် ပျက်စီးသည်: တကယ့်လူသား ခန့်မှန်းသူများသည် တစ်ဦးနှင့်တစ်ဦး၏ ထင်မြင်ချက်ကို မကြာခဏ ဖတ်ပြီး တစ်ထပ်တည်းဖြစ်လာတတ်သည်။ Random Forest သည် ၎င်း၏ tree များကို လွတ်လပ်နေစေရန် တက်ကြွစွာ ဒီဇိုင်းလုပ်သည် (split တစ်ခုစီတွင် ကျပန်း feature subset များသည် ၎င်းတို့ ယုတ္တိတူညီစွာ ရောက်ရှိခြင်းမှ တိကျစွာ တားဆီးသည်) — decorrelation သည် တမင်ပြုလုပ်ထားခြင်းဖြစ်ပြီး ယူဆထားခြင်း မဟုတ်ပါ။'
      ),
      caveat: blSame(
        'A real caveat: Random Forest\'s feature-importance rankings can be misleading when features are correlated — importance gets split arbitrarily between correlated features, making any single one look less important than it really is.',
        'တကယ့် caveat: Random Forest ၏ feature-importance အဆင့်သတ်မှတ်ချက်များသည် feature များ ဆက်စပ်နေလျှင် လမ်းလွှဲစေနိုင်သည် — importance သည် ဆက်စပ်နေသော feature များကြား ကျပန်းခွဲသွားပြီး တစ်ခုချင်းစီကို ၎င်း၏ တကယ့်အရေးပါမှုထက် နည်းသည်ဟု ထင်ရစေသည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does Random Forest use both bootstrap resampling AND random feature subsets, rather than just one of the two?', 'ပြန်မကြည့်ဘဲ: Random Forest သည် ဘာကြောင့် နှစ်ခုအနက် တစ်ခုတည်းမဟုတ်ဘဲ bootstrap resampling နှင့် ကျပန်း feature subset နှစ်ခုစလုံးကို သုံးသလဲ?'),
        answer: blSame(
          "Bootstrap resampling alone still lets trees end up very similar if one feature is overwhelmingly predictive — every tree would split on it first regardless of resample. Random feature subsets force genuine diversity by sometimes hiding even the strongest feature from a given split, which is what actually drives the decorrelation averaging depends on.",
          'Bootstrap resampling တစ်ခုတည်းက feature တစ်ခု အလွန်ခန့်မှန်းနိုင်စွမ်းရှိလျှင် tree များကို resample မည်သို့ဖြစ်စေ တူညီနေစေသေးသည် — tree တိုင်းသည် ၎င်းအပေါ် ဦးစွာ split ပြုမည်ဖြစ်သည်။ ကျပန်း feature subset များက split တစ်ခုစီမှ အားအကောင်းဆုံး feature ကိုပင် တစ်ခါတစ်ရံ ဝှက်ထားခြင်းဖြင့် စစ်မှန်သော ကွဲပြားမှုကို အတင်းလုပ်ဆောင်စေသည်၊ ၎င်းသည် ပျမ်းမျှခြင်းမှီခိုနေသည့် decorrelation ကို တကယ်တွန်းအားပေးသည့်အချက်ဖြစ်သည်။'
        ),
      },
    },
  },

  gbm: {
    spark: {
      analogy: bl(
        "Like a series of tutors, each one specifically studying and correcting the mistakes the previous tutor's student made — every new tree exists only to patch what came before, not to solve the whole problem from scratch.",
        'Sequentially fits weak learners to the residual errors of the current ensemble, additively combining them.',
        'ဆရာဆက်တိုက်တစ်ဦးချင်းစီက ယခင်ဆရာ၏ ကျောင်းသား လုပ်ခဲ့သော အမှားများကို တိကျစွာ လေ့လာပြီး ပြင်ဆင်ပေးသကဲ့သို့ — tree အသစ်တိုင်းသည် ရှေ့ကလာခဲ့သောအရာကို ပြင်ရန်သာ ရှိပြီး ပြဿနာတစ်ခုလုံးကို အစမှ ဖြေရှင်းရန် မဟုတ်ပါ။',
        'လက်ရှိ ensemble ၏ residual error များကို weak learner များဖြင့် ဆက်တိုက် fit လုပ်ပြီး ပေါင်းစပ်သည်။'
      ),
      predict: {
        question: blSame('If the first tree in a boosted ensemble already predicts perfectly (zero residual error), does the second tree learn anything useful?', 'Boosted ensemble ရှိ ပထမဆုံး tree သည် ပြီးပြည့်စုံစွာ ခန့်မှန်းပြီးသား (residual error သုည) ဖြစ်ရင် ဒုတိယ tree က တစ်ခုခု အသုံးဝင်စွာ သင်ယူနိုင်သေးသလား?'),
        options: [blSame('Yes, always finds more to learn', 'ဟုတ်သည်၊ ဆက်သင်ယူစရာ အမြဲရှိနေသည်'), blSame('No — nothing left to correct, so it contributes ~nothing', 'မဟုတ်ပါ — ပြင်စရာ ဘာမှမကျန်တော့ပါ၊ contribute ပြုသည့်အရာ ~ဘာမှမရှိသလောက်ပင်ဖြစ်သည်')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'micro', label: blSame('Micro Lab — the Gradient Boosting curve', 'Micro Lab — Gradient Boosting curve') },
    formalism: {
      worked: bl(
        'Tree 1 predicts gold moves +$40 when actual was +$55 — residual error +$15. Tree 2 is fit specifically to predict that leftover +$15, learning to add a correction where Tree 1 undershot. Combined prediction: $40+$15=$55.',
        'Fₘ(x) = Fₘ₋₁(x) + ν·hₘ(x), where hₘ is fit to −∂L/∂F evaluated at Fₘ₋₁ (the negative gradient, i.e. the residual for squared-error loss) and ν is a learning rate shrinking each step\'s contribution.',
        'Tree 1 သည် ရွှေ +$40 ရွှေ့မည်ဟု ခန့်မှန်းသော်လည်း တကယ့်ရလဒ်မှာ +$55 ဖြစ်သည် — residual error +$15 ဖြစ်သည်။ Tree 2 သည် ထို ကျန်ရှိသော +$15 ကို အတိအကျ ခန့်မှန်းရန် fit လုပ်ထားပြီး Tree 1 လျော့ကျခဲ့ရာတွင် ပြင်ဆင်မှုတစ်ခု ထပ်ထည့်ရန် သင်ယူသည်။ ပေါင်းစည်းထားသော ခန့်မှန်းချက်: $40+$15=$55။',
        'Fₘ(x) = Fₘ₋₁(x) + ν·hₘ(x), hₘ ကို Fₘ₋₁ တွင် တွက်ချက်ထားသော −∂L/∂F (negative gradient, squared-error loss အတွက် residual) ကို fit လုပ်ထားပြီး ν သည် အဆင့်တစ်ခုစီ၏ contribution ကို ချုံ့ပေးသော learning rate ဖြစ်သည်။'
      ),
      faded: bl(
        'If the learning rate ν is set very close to 0, how many trees would roughly be needed to reach the same total correction as ν=1 in one tree? Step 1 — think about how much each tree contributes at small ν. Step 2 — answer: _____ (more or fewer trees?)',
        'If the learning rate ν is set very close to 0, how many trees would roughly be needed to reach the same total correction as ν=1 in one tree? Step 1 — think about how much each tree contributes at small ν. Step 2 — answer: _____ (more or fewer trees?)',
        'Learning rate ν ကို 0 အနီးဆုံးသတ်မှတ်လျှင် tree 1 ခုတည်း ν=1 ဖြင့်ရသော ပြင်ဆင်မှုစုစုပေါင်းအတိုင်းသို့ ရောက်ရန် tree ဘယ်နှစ်ခုခန့် လိုအပ်မလဲ? အဆင့် ၁ — ν သေးငယ်လျှင် tree တစ်ခုစီ ဘယ်လောက် contribute ပြုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____ (tree ပိုများလား ပိုနည်းလား?)',
        'Learning rate ν ကို 0 အနီးဆုံးသတ်မှတ်လျှင် tree 1 ခုတည်း ν=1 ဖြင့်ရသော ပြင်ဆင်မှုစုစုပေါင်းအတိုင်းသို့ ရောက်ရန် tree ဘယ်နှစ်ခုခန့် လိုအပ်မလဲ? အဆင့် ၁ — ν သေးငယ်လျှင် tree တစ်ခုစီ ဘယ်လောက် contribute ပြုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____ (tree ပိုများလား ပိုနည်းလား?)'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The tutor-chain analogy breaks down on independence: each real human tutor could, in principle, teach the whole subject from scratch if asked. Each tree in gradient boosting genuinely cannot — it's fit only to a residual, and would be a useless predictor of the original target entirely on its own.",
        'ဆရာဆက်တိုက် ဆင်တူပုံရိပ်သည် လွတ်လပ်မှုတွင် ပျက်စီးသည်: လူသားဆရာတစ်ဦးချင်းစီသည် တောင်းဆိုလျှင် ဘာသာရပ်တစ်ခုလုံးကို အစမှ သင်ကြားနိုင်သည်။ Gradient boosting ရှိ tree တစ်ခုချင်းစီသည် တကယ့်ကို မတတ်နိုင်ပါ — residual တစ်ခုတည်းကို fit လုပ်ထားပြီး၊ ကိုယ်တိုင် တစ်ကိုယ်တည်း မူရင်း target ကို ခန့်မှန်းရန် အသုံးမဝင်သော predictor တစ်ခုသာ ဖြစ်လိမ့်မည်။'
      ),
      caveat: blSame(
        'A real caveat: because each tree corrects the specific residual left by all previous trees, gradient boosting is inherently sequential — unlike Random Forest\'s trees, which can all be grown in parallel, boosting can\'t be sped up simply by throwing more computers at it.',
        'တကယ့် caveat: tree တစ်ခုစီသည် ယခင် tree အားလုံးက ချန်ထားခဲ့သော တိကျသော residual ကို ပြင်ဆင်ပေးသောကြောင့် gradient boosting သည် သဘာဝအားဖြင့် sequential ဖြစ်သည် — parallel ကြီးထွားနိုင်သော Random Forest ၏ tree များနှင့်မတူဘဲ boosting ကို computer ပိုသုံးလိုက်ရုံဖြင့် အမြန်နှုန်းမတိုးနိုင်ပါ။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does gradient boosting typically need more careful tuning than Random Forest to avoid overfitting?', 'ပြန်မကြည့်ဘဲ: gradient boosting သည် overfitting ကို ရှောင်ရှားရန် ဘာကြောင့် Random Forest ထက် ပုံမှန်အားဖြင့် ဂရုတစိုက် tuning ပိုလိုအပ်သလဲ?'),
        answer: blSame(
          "Because each new tree keeps chasing whatever residual error remains, it will eventually start fitting noise once it has captured every real pattern — there's no built-in stopping point the way averaging naturally stabilizes Random Forest. Too many boosting rounds, or too high a learning rate, means literally fitting to noise on purpose.",
          'Tree အသစ်တိုင်းသည် ကျန်ရှိနေသေးသော residual error ကို ဆက်လိုက်ဖမ်းနေသောကြောင့် real pattern အားလုံးကို ဖမ်းယူပြီးသည်နှင့် noise ကို fit လုပ်စတင်လိမ့်မည် — ပျမ်းမျှခြင်းက Random Forest ကို သဘာဝကျစွာ တည်ငြိမ်စေသကဲ့သို့ built-in ရပ်တန့်ချက် မရှိပါ။ boosting round များများလွန်းခြင်း (သို့) learning rate မြင့်လွန်းခြင်းသည် noise ကို တမင်ဖမ်းယူခြင်းပင်ဖြစ်သည်။'
        ),
      },
    },
  },

  xgboost: {
    spark: {
      analogy: bl(
        'Same "chain of correcting tutors" idea as gradient boosting, but with extra automatic safety rails built in — like a tutor-chain program with a built-in coach who slaps the brakes the moment any tutor starts overcorrecting.',
        'Gradient boosting with L1/L2 regularization on leaf weights and second-order gradient information, adding overfitting guardrails on top of the base algorithm.',
        'Gradient boosting ၏ "ဆရာဆက်တိုက် ပြင်ဆင်" သဘောတရားတူသော်လည်း built-in automatic safety rail ထပ်ပါဝင်သည် — ဆရာတစ်ဦးဦး ပြင်လွန်းစတင်သည့်အခိုက် ဘရိတ်နှိပ်ပေးသော built-in coach ပါသည့် ဆရာဆက်တိုက် program တစ်ခုသကဲ့သို့။',
        'Leaf weight များပေါ် L1/L2 regularization နှင့် second-order gradient information ဖြင့် gradient boosting ဖြစ်ပြီး base algorithm ပေါ်တွင် overfitting guardrail များ ထပ်ထည့်ထားသည်။'
      ),
      predict: {
        question: blSame('Compared to plain gradient boosting on the same data, is XGBoost typically more or less prone to overfitting, thanks to its built-in regularization?', 'Data အတူတူပေါ်တွင် plain gradient boosting နှင့် နှိုင်းယှဉ်လျှင် XGBoost သည် built-in regularization ကြောင့် overfitting ဖြစ်ရန် ပုံမှန်အားဖြင့် ပိုများသလား ပိုနည်းသလား?'),
        options: [blSame('More prone', 'ပိုများသည်'), blSame('Less prone', 'ပိုနည်းသည်')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'gold', label: blSame('Gold Lab — the XGBoost lens', 'Gold Lab — XGBoost lens') },
    formalism: {
      worked: bl(
        'XGBoost\'s objective adds Ω(f)=γT+½λΣwⱼ² to the loss, where T is the number of leaves and wⱼ their weights. A tree with 20 tiny, barely-useful leaves gets penalized more than one with 5 substantial ones — this is the "automatic guardrail" in concrete math form.',
        'Obj = Σᵢl(yᵢ,ŷᵢ) + Σₖ Ω(fₖ), Ω(f)=γT+½λ‖w‖²; the second-order Taylor expansion of the loss (using both gradient and Hessian) lets XGBoost find optimal leaf weights in closed form per iteration, faster than plain gradient descent.',
        'XGBoost ၏ objective သည် Ω(f)=γT+½λΣwⱼ² ကို loss ထဲသို့ ပေါင်းထည့်သည်၊ T သည် leaf အရေအတွက်၊ wⱼ သည် ၎င်းတို့၏ weight ဖြစ်သည်။ အသုံးဝင်မှုနည်းသော leaf ၂၀ ရှိသော tree တစ်ခုသည် leaf ၅ ခုသာရှိသော tree တစ်ခုထက် ပိုပြင်းထန်စွာ ပြစ်ဒဏ်ခံရသည် — ဒါသည် "automatic guardrail" ၏ ကွန်ကရစ် math ပုံစံဖြစ်သည်။',
        'Obj = Σᵢl(yᵢ,ŷᵢ) + Σₖ Ω(fₖ), Ω(f)=γT+½λ‖w‖²; loss ၏ second-order Taylor expansion (gradient နှင့် Hessian နှစ်ခုစလုံးသုံး) က XGBoost ကို iteration တစ်ခုစီအတွက် optimal leaf weight များကို closed form ဖြင့် ရှာဖွေစေသည်၊ plain gradient descent ထက် ပိုမြန်သည်။'
      ),
      faded: bl(
        'If λ (the L2 penalty on leaf weights) is set to a very large number, what happens to the leaf weights, and therefore to how much any single tree can influence the final prediction? Step 1 — recall what a large penalty does to weights. Step 2 — answer: _____.',
        'If λ (the L2 penalty on leaf weights) is set to a very large number, what happens to the leaf weights, and therefore to how much any single tree can influence the final prediction? Step 1 — recall what a large penalty does to weights. Step 2 — answer: _____.',
        'λ (leaf weight ပေါ်ရှိ L2 penalty) ကို အလွန်ကြီးမားသော ဂဏန်းတစ်ခုသတ်မှတ်လျှင် leaf weight များကို ဘာဖြစ်စေမလဲ၊ ဒါကြောင့် tree တစ်ခုတည်းက နောက်ဆုံးခန့်မှန်းချက်ကို ဘယ်လောက်သက်ရောက်နိုင်မလဲ? အဆင့် ၁ — penalty ကြီးလျှင် weight ကို ဘာဖြစ်စေသလဲ သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'λ (leaf weight ပေါ်ရှိ L2 penalty) ကို အလွန်ကြီးမားသော ဂဏန်းတစ်ခုသတ်မှတ်လျှင် leaf weight များကို ဘာဖြစ်စေမလဲ၊ ဒါကြောင့် tree တစ်ခုတည်းက နောက်ဆုံးခန့်မှန်းချက်ကို ဘယ်လောက်သက်ရောက်နိုင်မလဲ? အဆင့် ၁ — penalty ကြီးလျှင် weight ကို ဘာဖြစ်စေသလဲ သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The built-in-coach analogy is fairly faithful, but understates one thing: XGBoost's guardrails don't just apply brakes, they also use second-order information (curvature, not just direction) to take smarter, faster steps in the first place — closer to a coach who both prevents overcorrection AND plans a more efficient training route from the start.",
        'Built-in coach ဆင်တူပုံရိပ်သည် တော်တော်လေးတိကျသော်လည်း အချက်တစ်ခုကို လျှော့တွက်ထားသည်: XGBoost ၏ guardrail များသည် ဘရိတ်ချရုံသာမက second-order information (direction တစ်ခုတည်းမက curvature ပါ) ကို သုံးပြီး ပိုဉာဏ်ကောင်း၊ ပိုမြန်သော အဆင့်များ ရှေးဦးစွာ လုပ်ဆောင်ပါသည် — overcorrection ကို ကာကွယ်ပေးရုံသာမက စတင်ကတည်းက ပိုထိရောက်သော training လမ်းကြောင်း စီစဉ်ပေးသော coach တစ်ဦးနှင့် ပိုနီးစပ်သည်။'
      ),
      caveat: blSame(
        'A real caveat: XGBoost still has many hyperparameters (learning rate, tree depth, λ, γ, subsample rate) that all interact — the built-in regularization reduces overfitting risk, it doesn\'t eliminate the need for careful tuning entirely, especially on small datasets.',
        'တကယ့် caveat: XGBoost တွင် အချင်းချင်း အပြန်အလှန်သက်ရောက်နေသော hyperparameter များစွာ (learning rate, tree depth, λ, γ, subsample rate) ရှိနေသေးသည် — built-in regularization သည် overfitting အန္တရာယ်ကို လျှော့ချသော်လည်း ဂရုတစိုက် tuning လိုအပ်ချက်ကို လုံးဝ ဖယ်ရှားပေးမည် မဟုတ်ပါ၊ အထူးသဖြင့် ဒေတာအနည်းငယ်ပေါ်တွင်။'
      ),
      retrieval: {
        question: blSame('Without looking back: what does XGBoost specifically add on top of plain gradient boosting that makes it a "strong enterprise default"?', 'ပြန်မကြည့်ဘဲ: XGBoost သည် ၎င်းကို "enterprise default ခိုင်မာသော" ဖြစ်စေရန် plain gradient boosting ပေါ်တွင် အထူး ဘာထပ်ထည့်ထားသလဲ?'),
        answer: blSame(
          "Built-in L1/L2 regularization on leaf weights (guarding against overfitting automatically), second-order (Newton) gradient approximation (faster, more precise optimization steps), and native handling of sparse/missing data — three concrete engineering additions, not just a rebranding of the same algorithm.",
          'Leaf weight များပေါ် built-in L1/L2 regularization (overfitting ကို အလိုအလျောက် ကာကွယ်ခြင်း), second-order (Newton) gradient approximation (ပိုမြန်၊ ပိုတိကျသော optimization အဆင့်များ), နှင့် sparse/missing data ၏ native ကိုင်တွယ်မှု — algorithm တစ်ခုတည်း၏ rebranding မဟုတ်ဘဲ concrete engineering ထပ်ထည့်မှုသုံးခုဖြစ်သည်။'
        ),
      },
    },
  },

  lightgbm: {
    spark: {
      analogy: bl(
        "Like sorting a giant pile of receipts into rough price buckets before adding them up, instead of adding every exact number one by one — you lose a little precision but gain enormous speed.",
        'Groups continuous feature values into histogram buckets before searching for splits, and grows trees leaf-wise rather than level-wise, trading a little accuracy risk for large speed gains.',
        'ကုန်စည်ခံစာရွက်ကြီးတစ်ပုံကို အတိအကျ ဂဏန်းတစ်ခုချင်းစီ ပေါင်းမည့်အစား ကြမ်းပြင်း ဈေးနှုန်း bucket များအဖြစ် စီထားသကဲ့သို့ — တိကျမှုအနည်းငယ် ဆုံးရှုံးသော်လည်း အမြန်နှုန်း အလွန်များစွာ ရရှိသည်။',
        'Split ကို ရှာမီ ကွန်တင်နျူးသော feature တန်ဖိုးများကို histogram bucket များအဖြစ် အုပ်စုဖွဲ့ပြီး level-wise အစား leaf-wise tree ကြီးထွားစေသည်၊ overfitting အန္တရာယ်အနည်းငယ်ကို အမြန်နှုန်း အများကြီးနှင့် လဲလှယ်သည်။'
      ),
      predict: {
        question: blSame('On a very large dataset, would you expect LightGBM to train faster or slower than a standard level-wise gradient booster?', 'Dataset အလွန်ကြီးမားသောနေရာတွင် LightGBM သည် standard level-wise gradient booster ထက် ပိုမြန်စွာ (သို့) ပိုနှေးစွာ train လုပ်လိမ့်မည်ဟု မျှော်လင့်ပါသလား?'),
        options: [blSame('Faster', 'ပိုမြန်သည်'), blSame('Slower', 'ပိုနှေးသည်')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase the number of histogram buckets, does training speed rise or fall?', 'Histogram bucket အရေအတွက်ကို တိုးလျှင် training speed တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 1 },
      paramLabel: blSame('Histogram buckets (fewer = coarser, faster)', 'Histogram bucket (နည်းလျှင် = ကြမ်း၊ ပိုမြန်)'),
      paramMin: 8, paramMax: 256, paramDefault: 32, paramStep: 8, paramDecimals: 0,
      compute: (v) => Math.max(2, 900 / v),
      outputLabel: blSame('Toy training time (relative units)', 'ဥပမာ training time (relative unit)'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'A continuous feature ranging $8-$22 gets binned into, say, 16 buckets of $0.875 each instead of testing all possible split points across every unique value — with 10,000 rows, that\'s 16 candidate splits to evaluate instead of potentially thousands.',
        'Split-finding cost drops from O(n) per feature (testing every unique value) to O(bins) — a large constant-factor speedup, especially pronounced on continuous features with many unique values.',
        '$8-$22 range ရှိသော ကွန်တင်နျူးသော feature တစ်ခုကို row 10,000 တွင် unique value တိုင်းပေါ်ရှိ split point ဖြစ်နိုင်သမျှအားလုံး စမ်းသပ်မည့်အစား $0.875 စီရှိသော bucket ၁၆ ခုအဖြစ် bin ချထားသည် — ဒါဆိုရင် အကဲဖြတ်ရမည့် candidate split ၁၆ ခုသာရှိပြီး ထောင်ပေါင်းများစွာအစား ဖြစ်သွားသည်။',
        'Split-finding ကုန်ကျစရိတ်သည် feature တစ်ခုစီအတွက် O(n) (unique value တိုင်းစမ်းသပ်ခြင်း) မှ O(bins) သို့ ကျဆင်းသွားသည် — constant-factor speedup ကြီးမားပြီး unique value များစွာပါသော ကွန်တင်နျူး feature များတွင် အထူးထင်ရှားသည်။'
      ),
      faded: bl(
        'If you increased the bucket count from 16 to 256, would split-finding get more precise, faster, both, or neither? Step 1 — think about what more/finer buckets trade off against speed. Step 2 — answer: _____.',
        'If you increased the bucket count from 16 to 256, would split-finding get more precise, faster, both, or neither? Step 1 — think about what more/finer buckets trade off against speed. Step 2 — answer: _____.',
        'Bucket အရေအတွက်ကို 16 မှ 256 သို့ တိုးလျှင် split-finding ပိုတိကျလာမလား၊ ပိုမြန်လာမလား၊ နှစ်ခုစလုံးလား၊ ဘာမှမဖြစ်လား? အဆင့် ၁ — bucket ပိုများ/ပိုသေးလျှင် speed နှင့် ဘယ်လိုလဲလှယ်သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Bucket အရေအတွက်ကို 16 မှ 256 သို့ တိုးလျှင် split-finding ပိုတိကျလာမလား၊ ပိုမြန်လာမလား၊ နှစ်ခုစလုံးလား၊ ဘာမှမဖြစ်လား? အဆင့် ၁ — bucket ပိုများ/ပိုသေးလျှင် speed နှင့် ဘယ်လိုလဲလှယ်သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The receipt-bucketing analogy breaks down on the second trick: leaf-wise growth isn\'t about bucketing at all — it\'s about which leaf to split next (the most-promising one, wherever it is in the tree) rather than expanding every leaf at the current depth uniformly, which is a separate speed/accuracy tradeoff from histogram binning.',
        'ခံစာရွက် bucket ခွဲခြင်း ဆင်တူပုံရိပ်သည် ဒုတိယနည်းလမ်းတွင် ပျက်စီးသည်: leaf-wise growth သည် bucketing အကြောင်း လုံးဝမဟုတ်ပါ — ၎င်းသည် နောက်ထပ် ဘယ် leaf ကို split ရမလဲ (tree ထဲက မည်သည့်နေရာမှာမဆို အနိုင်ရဆုံးတစ်ခု) ဆိုတာအကြောင်းဖြစ်ပြီး လက်ရှိအနက်ရှိ leaf တိုင်းကို ညီညီညာညာ ချဲ့ထွင်ခြင်းထက် histogram binning နှင့် သီးခြားသော speed/accuracy trade-off တစ်ခုဖြစ်သည်။'
      ),
      caveat: blSame(
        'A real caveat: leaf-wise growth can produce deeper, more unbalanced trees than level-wise growth, which increases overfitting risk on small datasets — LightGBM typically needs a max-depth limit to compensate.',
        'တကယ့် caveat: leaf-wise growth သည် level-wise growth ထက် ပိုနက်ရှိုင်း၊ ပိုမမျှတသော tree များ ထုတ်ပေးနိုင်ပြီး ဒေတာအနည်းငယ်ပေါ်တွင် overfitting အန္တရာယ်ကို တိုးစေသည် — LightGBM သည် ပုံမှန်အားဖြင့် ၎င်းကို ပြန်လျော်ကြေးပေးရန် max-depth ကန့်သတ်ချက် လိုအပ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does LightGBM\'s speed advantage matter most specifically on large datasets rather than small ones?', 'ပြန်မကြည့်ဘဲ: LightGBM ၏ speed အားသာချက်သည် ဒေတာအနည်းငယ်ထက် ဘာကြောင့် ဒေတာကြီးမားသောနေရာတွင် ပိုအရေးကြီးသလဲ?'),
        answer: blSame(
          "Histogram binning's win is turning O(n) split-search into O(bins) — the bigger n (rows/unique values) is, the bigger that gap becomes. On a small dataset, testing every unique value directly was never slow to begin with, so there's little speed advantage left to gain.",
          'Histogram binning ၏ အနိုင်ရမှုသည် O(n) split-search ကို O(bins) အဖြစ်ပြောင်းလဲခြင်းဖြစ်သည် — n (row/unique value) ကြီးလေ ဒီကွာဟချက် ပိုကြီးလေဖြစ်သည်။ ဒေတာအနည်းငယ်ပေါ်တွင် unique value တိုင်းကို တိုက်ရိုက်စမ်းသပ်ခြင်းသည် အစကတည်းက ဘယ်တော့မှ နှေးမနေခဲ့ပါ၊ ဒါကြောင့် ရရှိစရာ speed အားသာချက် အနည်းငယ်သာ ကျန်တော့သည်။'
        ),
      },
    },
  },

  catboost: {
    spark: {
      analogy: bl(
        "Like a form that understands \"country: Japan\" and \"country: Brazil\" are just different labels without needing you to first translate them into numbers — CatBoost handles categories natively instead of forcing them into a numeric costume first.",
        'A gradient boosting variant with native, leakage-resistant handling of categorical features via ordered target statistics.',
        '"နိုင်ငံ: ဂျပန်" နှင့် "နိုင်ငံ: ဘရာဇီး" ဆိုတာ ဂဏန်းအဖြစ် ဦးစွာ ပြန်ဘာသာမပြန်ဘဲ label ကွဲပြားရုံသာဖြစ်ကြောင်း နားလည်သော form တစ်ခုသကဲ့သို့ — CatBoost သည် category များကို ဂဏန်းဝတ်စုံ ဦးစွာ မဝတ်စေဘဲ native အနေဖြင့် ကိုင်တွယ်သည်။',
        'Ordered target statistics မှတဆင့် categorical feature များကို native, leakage-resistant ကိုင်တွယ်မှုပါသော gradient boosting variant တစ်ခု။'
      ),
      predict: {
        question: blSame('Would naively converting "country" into a single number (e.g. alphabetical rank) risk implying a false ordering (like "Japan < Kenya") that CatBoost specifically avoids?', '"နိုင်ငံ" ကို ဂဏန်းတစ်ခု (ဥပမာ အက္ခရာစဉ်) အဖြစ် naive ပြောင်းလဲခြင်းသည် CatBoost အထူးရှောင်ရှားသော မှားယွင်းသော order (ဥပမာ "ဂျပန် < ကင်ညာ") ကို ဆိုလိုနေမလား?'),
        options: [blSame('Yes, it risks a false ordering', 'ဟုတ်သည်၊ မှားယွင်းသော order ကို ဆိုလိုနိုင်သည်'), blSame('No, numbers never imply ordering', 'မဟုတ်ပါ၊ ဂဏန်းများက order ကို ဘယ်တော့မှ မဆိုလိုပါ')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As the number of distinct categories (like countries) in a feature grows, does naive one-hot encoding\'s column count rise or fall?', 'Feature တစ်ခုရှိ distinct category (နိုင်ငံများကဲ့သို့) အရေအတွက် တိုးလာလျှင် naive one-hot encoding ၏ ကော်လံအရေအတွက် တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 0 },
      paramLabel: blSame('Distinct categories (e.g. countries)', 'Distinct category (ဥပမာ နိုင်ငံများ)'),
      paramMin: 2, paramMax: 200, paramDefault: 20, paramStep: 2, paramDecimals: 0,
      compute: (v) => v,
      outputLabel: blSame('One-hot columns needed (CatBoost avoids this)', 'One-hot ကော်လံ လိုအပ်ချက် (CatBoost ဒါကို ရှောင်သည်)'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'One-hot encoding "regime type" (democracy/autocracy/hybrid/monarchy) creates 4 separate 0/1 columns. CatBoost instead replaces each category with an ordered target-statistic (roughly, the average outcome for that category using only prior-seen examples) — one column, no artificial ordering, and no peeking at the current row\'s own answer.',
        "Ordered target statistic: for row i, categoryⱼ's encoded value uses only rows before i in a random permutation, avoiding the target leakage naive mean-encoding introduces by using the full dataset including the row itself.",
        '"Regime type" (ဒီမိုကရေစီ/အာဏာရှင်/ရောစပ်/ဘုရင်စနစ်) ကို one-hot encoding ပြုလုပ်ခြင်းသည် သီးခြား 0/1 ကော်လံ ၄ ခု ဖန်တီးသည်။ CatBoost ကမူ category တစ်ခုစီကို ordered target-statistic (အကြမ်းအားဖြင့် အရင်တွေ့ဖူးသော ဥပမာများသာသုံးထားသော ထိုclass ၏ ပျမ်းမျှရလဒ်) ဖြင့် အစားထိုးသည် — ကော်လံတစ်ခုတည်း၊ artificial order မရှိ၊ လက်ရှိ row ၏ ကိုယ်ပိုင်အဖြေကို ချောင်းကြည့်ခြင်းမရှိ။',
        'Ordered target statistic: row i အတွက် categoryⱼ ၏ encode တန်ဖိုးသည် ကျပန်း permutation တစ်ခုတွင် i အရင် row များကိုသာ သုံးသည်၊ naive mean-encoding က row ကိုယ်တိုင်ပါသော dataset အပြည့်အစုံကို သုံးခြင်းဖြင့် ဖြစ်ပေါ်စေတတ်သော target leakage ကို ရှောင်ရှားသည်။'
      ),
      faded: bl(
        'If a naive mean-encoding used the FULL dataset (including the current row\'s own outcome) to compute a category\'s average, what problem would that create when evaluating the model on that same row? Step 1 — think about what the model would effectively "know" already. Step 2 — answer: _____.',
        'If a naive mean-encoding used the FULL dataset (including the current row\'s own outcome) to compute a category\'s average, what problem would that create when evaluating the model on that same row? Step 1 — think about what the model would effectively "know" already. Step 2 — answer: _____.',
        'Naive mean-encoding သည် category တစ်ခု၏ ပျမ်းမျှကို တွက်ချက်ရန် dataset အပြည့်အစုံ (လက်ရှိ row ကိုယ်ပိုင်ရလဒ်အပါအဝင်) ကို သုံးလျှင် ထို row တစ်ခုတည်းအပေါ် model ကို အကဲဖြတ်သည့်အခါ ဘာပြဿနာ ဖြစ်စေမလဲ? အဆင့် ၁ — model က တကယ်တမ်း ဘာ "သိပြီးသား" ဖြစ်နေမလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Naive mean-encoding သည် category တစ်ခု၏ ပျမ်းမျှကို တွက်ချက်ရန် dataset အပြည့်အစုံ (လက်ရှိ row ကိုယ်ပိုင်ရလဒ်အပါအဝင်) ကို သုံးလျှင် ထို row တစ်ခုတည်းအပေါ် model ကို အကဲဖြတ်သည့်အခါ ဘာပြဿနာ ဖြစ်စေမလဲ? အဆင့် ၁ — model က တကယ်တမ်း ဘာ "သိပြီးသား" ဖြစ်နေမလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The "understanding form" analogy breaks down technically: CatBoost doesn\'t actually "understand" categories semantically (it has no idea Japan is a country) — it\'s still converting categories to numbers internally, just via a leakage-resistant statistical procedure instead of an arbitrary or naive one.',
        '"နားလည်တဲ့ form" ဆင်တူပုံရိပ်သည် technical အရ ပျက်စီးသည်: CatBoost သည် category များကို semantically "နားလည်" တာ တကယ်မဟုတ်ပါ (ဂျပန်သည် နိုင်ငံတစ်ခုဖြစ်ကြောင်း လုံးဝမသိပါ) — ၎င်းသည် category များကို ကျပန်း သို့မဟုတ် naive ပုံစံအစား leakage-resistant statistical procedure တစ်ခုမှတဆင့်သာ internal ဂဏန်းများသို့ ဆက်ပြောင်းလဲနေဆဲဖြစ်သည်။'
      ),
      caveat: blSame(
        "A real caveat: ordered boosting's leakage-avoidance comes at a real computational cost — it's typically slower to train than LightGBM, a direct tradeoff the doc's own comparative tables note.",
        'တကယ့် caveat: ordered boosting ၏ leakage-avoidance သည် တကယ့် တွက်ချက်မှု ကုန်ကျစရိတ် ပါလာသည် — ၎င်းသည် LightGBM ထက် ပုံမှန်အားဖြင့် train လုပ်ရန် နှေးသည်၊ research doc ၏ နှိုင်းယှဉ်ဇယားကိုယ်တိုင်ကလည်း ဒီ trade-off ကို ဖော်ပြထားသည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does one-hot encoding become impractical for a feature with hundreds of categories, in a way CatBoost\'s approach avoids?', 'ပြန်မကြည့်ဘဲ: CatBoost ၏ နည်းလမ်းက ရှောင်ရှားထားနည်းတူ one-hot encoding သည် category ရာနှင့်ချီရှိသော feature တစ်ခုအတွက် ဘာကြောင့် လက်တွေ့မကျဖြစ်လာသလဲ?'),
        answer: blSame(
          "One-hot encoding creates one new column per distinct category, so hundreds of categories mean hundreds of new, mostly-empty (sparse) columns — bloating the dataset's width and diluting each column's signal. CatBoost's ordered target statistic stays a single column regardless of how many categories exist.",
          'One-hot encoding သည် distinct category တစ်ခုစီအတွက် ကော်လံအသစ်တစ်ခု ဖန်တီးသည်၊ ဒါကြောင့် category ရာနှင့်ချီဆိုသည်မှာ ကော်လံအသစ် ရာနှင့်ချီ၊ အများစု ဗလာနီးပါး (sparse) ဖြစ်သွားခြင်းဖြစ်သည် — dataset ၏ ကျယ်ပြန့်မှုကို ဖောင်းလွှေးစေပြီး ကော်လံတစ်ခုစီ၏ signal ကို ဖျက်ချသည်။ CatBoost ၏ ordered target statistic သည် category ဘယ်နှစ်ခုရှိပါစေ ကော်လံတစ်ခုတည်း ဆက်ရှိနေသည်။'
        ),
      },
    },
  },

  bagging: {
    spark: {
      analogy: bl(
        'Like averaging many separate weather forecasts made from slightly different starting readings — no single reading\'s quirks dominate, so the average is steadier than any one forecast alone.',
        'The general "bootstrap + average" recipe: train B independent copies of a model on resampled data, then average their outputs to reduce variance.',
        'အနည်းငယ်ကွဲပြားသော အစပြု ဖတ်ချက်များမှ ပြုလုပ်ထားသော ရာသီဥတု ခန့်မှန်းချက်များစွာကို ပျမ်းမျှသကဲ့သို့ — ဖတ်ချက်တစ်ခုတည်း၏ ထူးဆန်းချက်က လွှမ်းမိုးမည်မဟုတ်ပါ၊ ဒါကြောင့် ပျမ်းမျှချက်သည် ခန့်မှန်းချက်တစ်ခုတည်းထက် ပိုတည်ငြိမ်သည်။',
        '"Bootstrap + ပျမ်းမျှ" ယေဘုယျ recipe: model B ခု လွတ်လပ်စွာ resample လုပ်ထားသော data ပေါ်တွင် train လုပ်ပြီး ၎င်းတို့၏ output ကို ပျမ်းမျှခြင်းဖြင့် variance ကို လျှော့ချသည်။'
      ),
      predict: {
        question: blSame('Does bagging a systematically biased base model (one that\'s consistently wrong in the same direction) fix that bias?', 'Systematically bias ရှိသော base model (တစ်ဖက်တည်းသို့ တသမတ်တည်း မှားနေသော) ကို bagging လုပ်ခြင်းသည် ထို bias ကို ပြင်ပေးသလား?'),
        options: [blSame('Yes', 'ဟုတ်သည်'), blSame('No — averaging biased models still gives a biased average', 'မဟုတ်ပါ — bias ရှိသော model များကို ပျမ်းမျှခြင်းသည် bias ရှိသော ပျမ်းမျှချက်ကိုသာ ပေးသည်')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase B (the number of bagged models), does the ensemble\'s variance rise or fall?', 'B (bagged model အရေအတွက်) ကို တိုးလျှင် ensemble ၏ variance တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 1 },
      paramLabel: blSame('B (number of bagged models)', 'B (bagged model အရေအတွက်)'),
      paramMin: 1, paramMax: 100, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => 10 / Math.sqrt(v),
      outputLabel: blSame('Toy ensemble variance (illustrative)', 'ဥပမာ ensemble variance (သရုပ်ဖော်)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Five bootstrap-trained models predict +$20, +$45, -$5, +$30, +$15 for the same query. Bagged prediction: their mean, (20+45-5+30+15)/5=$21 — closer to the "true" pattern than any single noisy model.',
        'For B independent, unbiased base learners each with variance σ², Var(average) = σ²/B — variance shrinks proportionally to 1/B as more independent models are added.',
        'ကွဲပြားသော bootstrap-trained model ငါးခုသည် query တစ်ခုတည်းအတွက် +$20, +$45, -$5, +$30, +$15 ကို ခန့်မှန်းသည်။ Bagged ခန့်မှန်းချက်: ၎င်းတို့၏ ပျမ်းမျှ, (20+45-5+30+15)/5=$21 — noisy model တစ်ခုတည်းထက် "စစ်မှန်သော" pattern နှင့် ပိုနီးစပ်သည်။',
        'Independent, unbiased base learner B ခုတစ်ခုစီ variance σ² ရှိပါက, Var(average) = σ²/B — model လွတ်လပ်စွာ ပိုများလာလေ variance သည် 1/B နှင့် အချိုးကျ ကျဆင်းလေဖြစ်သည်။'
      ),
      faded: bl(
        'If B goes from 4 to 16 (quadrupling), by roughly what factor does variance shrink, per Var=σ²/B? Step 1 — compute σ²/4 vs σ²/16 as a ratio. Step 2 — answer: _____.',
        'If B goes from 4 to 16 (quadrupling), by roughly what factor does variance shrink, per Var=σ²/B? Step 1 — compute σ²/4 vs σ²/16 as a ratio. Step 2 — answer: _____.',
        'B သည် 4 မှ 16 (လေးဆ) သို့ တိုးလျှင် Var=σ²/B အရ variance သည် ဘယ် factor နှင့် ခန့်မှန်းအားဖြင့် ကျဆင်းသလဲ? အဆင့် ၁ — σ²/4 vs σ²/16 ratio တွက်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'B သည် 4 မှ 16 (လေးဆ) သို့ တိုးလျှင် Var=σ²/B အရ variance သည် ဘယ် factor နှင့် ခန့်မှန်းအားဖြင့် ကျဆင်းသလဲ? အဆင့် ၁ — σ²/4 vs σ²/16 ratio တွက်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The weather-forecasts analogy breaks down on independence: real weather stations often share regional biases (a whole region's thermometers reading slightly hot, say). Bagging's Var=σ²/B formula assumes truly independent errors — correlated base-model errors don't shrink nearly as much, which is exactly why Random Forest adds random feature subsets on top of plain bagging.",
        'ရာသီဥတု ခန့်မှန်းချက်များ ဆင်တူပုံရိပ်သည် လွတ်လပ်မှုတွင် ပျက်စီးသည်: တကယ့် ရာသီဥတုစခန်းများသည် ဒေသဆိုင်ရာ bias (ဒေသတစ်ခုလုံး၏ thermometer များ အနည်းငယ် ပူနေခြင်း) ကို မကြာခဏ မျှဝေတတ်သည်။ Bagging ၏ Var=σ²/B ဖော်မြူလာသည် တကယ့် လွတ်လပ်သော error များဟု ယူဆထားသည် — ဆက်စပ်နေသော base-model error များသည် ထိုမျှလောက် ကျဆင်းမည်မဟုတ်ပါ၊ ဒါကြောင့်ပင် Random Forest သည် plain bagging ပေါ်တွင် ကျပန်း feature subset များ ထပ်ထည့်ထားခြင်းဖြစ်သည်။'
      ),
      caveat: blSame(
        'A real caveat: bagging works best on high-variance, low-bias base learners (like deep, unpruned trees) — bagging a stable, low-variance model like linear regression barely helps, since there\'s little variance left to reduce.',
        'တကယ့် caveat: bagging သည် variance မြင့်၊ bias နည်းသော base learner (deep, unpruned tree ကဲ့သို့) များတွင် အကောင်းဆုံးအလုပ်လုပ်သည် — linear regression ကဲ့သို့ တည်ငြိမ်၊ variance နည်းသော model ကို bagging လုပ်ခြင်းသည် ကျဆင်းစရာ variance အနည်းငယ်သာ ကျန်နေသောကြောင့် ကူညီမှု နည်းသည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does bagging reduce variance but NOT bias?', 'ပြန်မကြည့်ဘဲ: bagging သည် variance ကို ဘာကြောင့် လျှော့ချသော်လည်း bias ကို မလျှော့ချသလဲ?'),
        answer: blSame(
          "Averaging cancels out random, independent fluctuations around the true pattern (that's variance) — but if every base model shares the same systematic blind spot (that's bias), averaging identically-blind models just produces an equally blind average.",
          'ပျမ်းမျှခြင်းသည် စစ်မှန်သော pattern ပတ်ဝန်းကျင်ရှိ ကျပန်း၊ လွတ်လပ်သော လှုပ်ရှားမှုများကို ပယ်ဖျက်ပေးသည် (ဒါက variance) — သို့သော် base model တိုင်းသည် တူညီသော systematic blind spot ရှိလျှင် (ဒါက bias), တူညီစွာ မျက်စိကန်းသော model များကို ပျမ်းမျှခြင်းသည် တူညီစွာ မျက်စိကန်းသော ပျမ်းမျှချက်ကိုသာ ထုတ်ပေးသည်။'
        ),
      },
    },
  },

  boosting: {
    spark: {
      analogy: bl(
        'The umbrella idea behind gradient boosting: chain many weak, simple models together so each one patches the specific blind spots of everything before it — a relay race of specialists rather than one generalist.',
        'General framework for additive, sequential ensembling minimizing bias by re-weighting or re-fitting to residuals at each stage.',
        'Gradient boosting ၏ နောက်ကွယ်ရှိ ယေဘုယျအယူအဆ: အားနည်းသော ရိုးရှင်းသော model များစွာကို ဆက်တင်ကာ တစ်ခုစီက ရှေ့ကလာခဲ့သောအားလုံး၏ တိကျသော မျက်စိကန်းရာများကို ဖာပေးသည် — generalist တစ်ခုတည်းထက် ကျွမ်းကျင်သူများ၏ relay race တစ်ခုသကဲ့သို့။',
        'အဆင့်တစ်ခုစီတွင် residual များကို ပြန်လည် weight ချ (သို့) ပြန် fit လုပ်ခြင်းဖြင့် bias ကို minimize ပြုသည့် ပေါင်းစပ်၊ ဆက်တိုက် ensembling ယေဘုယျ framework။'
      ),
      predict: {
        question: blSame('Compared to bagging, is boosting generally better at fixing bias or at fixing variance?', 'Bagging နှင့် နှိုင်းယှဉ်လျှင် boosting သည် bias ပြင်ရာတွင် ပိုကောင်းသလား variance ပြင်ရာတွင် ပိုကောင်းသလား?'),
        options: [blSame('Bias', 'Bias'), blSame('Variance', 'Variance')],
        correctIndex: 0,
      },
    },
    mechanism: { kind: 'live-link', module: 'micro', label: blSame('Micro Lab — Gradient Boosting, a real instance of Boosting', 'Micro Lab — Gradient Boosting, Boosting ၏ တကယ့် instance') },
    formalism: {
      worked: bl(
        'A weak learner alone gets 60% accuracy. Boosting chains 50 weak learners, each fixing the specific errors of the ensemble so far — the combined ensemble can reach 95%+ accuracy on the same problem, far beyond what any single weak learner could.',
        'Additive model FM(x) = Σₘ αₘhₘ(x); each hₘ is fit to minimize error on a re-weighted (AdaBoost) or residual-targeted (gradient boosting) version of the training set, with αₘ typically reflecting that learner\'s accuracy.',
        'အားနည်းသော learner တစ်ခုတည်းသည် 60% တိကျမှုသာရသည်။ Boosting သည် learner ၅၀ ကို ဆက်တင်ထားပြီး တစ်ခုစီက ensemble ယခုအထိ၏ တိကျသောအမှားများကို ပြင်ဆင်ပေးသည် — ပေါင်းစည်းထားသော ensemble သည် ပြဿနာတစ်ခုတည်းတွင် 95%+ တိကျမှုသို့ ရောက်နိုင်ပြီး learner တစ်ခုတည်းရရှိနိုင်သည်ထက် များစွာသာလွန်သည်။',
        'Additive model FM(x) = Σₘ αₘhₘ(x); hₘ တစ်ခုစီကို re-weighted (AdaBoost) သို့ residual-targeted (gradient boosting) training set ပေါ်တွင် error ကို minimize ပြုရန် fit လုပ်ထားသည်၊ αₘ သည် ပုံမှန်အားဖြင့် learner ၏ တိကျမှုကို ထင်ဟပ်သည်။'
      ),
      faded: bl(
        'If one weak learner in the chain is much more accurate than the others, should AdaBoost give it more or less weight (α) in the final vote? Step 1 — think about what α is meant to reflect. Step 2 — answer: _____.',
        'If one weak learner in the chain is much more accurate than the others, should AdaBoost give it more or less weight (α) in the final vote? Step 1 — think about what α is meant to reflect. Step 2 — answer: _____.',
        'ဆက်တင်ထားသော learner တစ်ခုသည် တခြားများထက် အလွန်ပိုတိကျလျှင် AdaBoost သည် နောက်ဆုံးမဲပေးမှုတွင် ၎င်းအား weight (α) ပိုပေးသင့်သလား ပိုနည်းပေးသင့်သလား? အဆင့် ၁ — α က ဘာကို ထင်ဟပ်ရန် ရည်ရွယ်သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'ဆက်တင်ထားသော learner တစ်ခုသည် တခြားများထက် အလွန်ပိုတိကျလျှင် AdaBoost သည် နောက်ဆုံးမဲပေးမှုတွင် ၎င်းအား weight (α) ပိုပေးသင့်သလား ပိုနည်းပေးသင့်သလား? အဆင့် ၁ — α က ဘာကို ထင်ဟပ်ရန် ရည်ရွယ်သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The relay-race analogy breaks down on visibility: relay runners hand off a baton but don't see each other's mistakes in detail. Each learner in boosting sees exactly, numerically, what the ensemble got wrong so far — the correction is precise and targeted, not a general \"try your best from here.\"",
        'Relay race ဆင်တူပုံရိပ်သည် မြင်နိုင်မှုတွင် ပျက်စီးသည်: relay runner များသည် baton လွှဲပြောင်းသော်လည်း တစ်ဦးနှင့်တစ်ဦး၏ အမှားများကို အသေးစိတ် မမြင်ပါ။ Boosting ရှိ learner တစ်ခုစီသည် ensemble ယခုအထိ ဘာမှားနေသလဲဆိုတာကို အတိအကျ၊ ဂဏန်းအရ မြင်သည် — ပြင်ဆင်မှုသည် တိကျ၊ ပစ်မှတ်ထားခြင်းဖြစ်ပြီး ယေဘုယျ "ဒီကနေ အကောင်းဆုံးကြိုးစား" မဟုတ်ပါ။'
      ),
      caveat: blSame(
        "A real caveat: boosting's bias-reduction focus means it will keep chasing residual error even when that residual is just noise, which is why it's more prone to overfitting than bagging if the number of rounds isn't controlled.",
        'တကယ့် caveat: boosting ၏ bias-လျှော့ချမှု အာရုံစူးစိုက်ချက်သည် residual error က noise သာဖြစ်သည့်တိုင် ဆက်လိုက်ဖမ်းနေမည်ဖြစ်ပြီး၊ round အရေအတွက်ကို မထိန်းချုပ်လျှင် bagging ထက် overfitting ဖြစ်ရန် ပိုလွယ်ကူသည့်အကြောင်းရင်းဖြစ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is boosting typically slower to train than bagging?', 'ပြန်မကြည့်ဘဲ: boosting သည် bagging ထက် ဘာကြောင့် ပုံမှန်အားဖြင့် train လုပ်ရန် နှေးသလဲ?'),
        answer: blSame(
          "Bagging's base models are trained independently, so they can be built in parallel all at once. Boosting's learners are inherently sequential — each one needs to know the previous ones' combined errors before it can be fit, so they must be trained one after another.",
          'Bagging ၏ base model များသည် လွတ်လပ်စွာ train လုပ်ထားသောကြောင့် တစ်ပြိုင်နက်တည်း parallel တည်ဆောက်နိုင်သည်။ Boosting ၏ learner များသည် သဘာဝအားဖြင့် sequential ဖြစ်သည် — တစ်ခုစီသည် fit မလုပ်မီ ယခင်များ၏ ပေါင်းစည်းထားသောအမှားများကို သိရန်လိုအပ်သောကြောင့် တစ်ခုပြီးတစ်ခု train လုပ်ရမည်ဖြစ်သည်။'
        ),
      },
    },
  },

  stacking: {
    spark: {
      analogy: bl(
        'Like a panel of specialist doctors each giving their own diagnosis, then one senior physician who has learned, from experience, exactly how much weight to give each specialist\'s opinion in different situations.',
        'Trains diverse base learners, then fits a meta-learner on their out-of-fold predictions to learn an optimal combination.',
        'ကျွမ်းကျင်ဆရာဝန်အဖွဲ့တစ်ခု တစ်ဦးချင်းစီ ၎င်းတို့ကိုယ်ပိုင် ရောဂါရှာဖွေမှု ပေးပြီး၊ နောက်ဆုံးတွင် အထက်တန်း ဆရာဝန်တစ်ဦးက ကျွမ်းကျင်သူတစ်ဦးစီ၏ ထင်မြင်ချက်ကို အခြေအနေမတူညီရာတွင် ဘယ်လောက် အလေးထားရမလဲဆိုတာ အတွေ့အကြုံမှ သင်ယူထားသကဲ့သို့။',
        'ကွဲပြားသော base learner များကို လေ့ကျင့်ပြီး ၎င်းတို့၏ out-of-fold ခန့်မှန်းချက်များပေါ်တွင် optimal ပေါင်းစပ်မှုကို သင်ယူရန် meta-learner ကို fit လုပ်သည်။'
      ),
      predict: {
        question: blSame('Would stacking ARIMA + XGBoost + LSTM together ever perform WORSE than the single best of the three alone?', 'ARIMA + XGBoost + LSTM ကို stack ချခြင်းသည် သုံးခုအနက် အကောင်းဆုံးတစ်ခုတည်းထက် ပိုညံ့ဖြစ်ဖူးသလား?'),
        options: [blSame('Never — stacking is always at least as good', 'ဘယ်တော့မှမဟုတ် — stacking သည် အနည်းဆုံးအတူတူဖြစ်သည်'), blSame('Yes, if the meta-learner is poorly fit or overfits on limited data', 'ဟုတ်သည်၊ meta-learner သည် ညံ့ဖျင်းစွာ fit ဖြစ်နေလျှင် (သို့) ဒေတာအကန့်အသတ်ပေါ်တွင် overfit ဖြစ်နေလျှင်')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you add more diverse base models to a stack, does the potential accuracy ceiling rise or fall (ignoring overfitting risk)?', 'Stack ထဲသို့ ကွဲပြားသော base model ပိုများများ ထည့်လျှင် (overfitting အန္တရာယ် ချန်ထားပြီး) ဖြစ်နိုင်ချေရှိသော accuracy ceiling တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 0 },
      paramLabel: blSame('Number of diverse base models in the stack', 'Stack ထဲရှိ ကွဲပြားသော base model အရေအတွက်'),
      paramMin: 1, paramMax: 8, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => 60 + 30 * (1 - Math.exp(-0.5 * (v - 1))),
      outputLabel: blSame('Toy accuracy ceiling (%, diminishing returns)', 'ဥပမာ accuracy ceiling (%, လျော့ကျလာသော အကျိုးအမြတ်)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'ARIMA predicts $4,150, XGBoost predicts $4,220, LSTM predicts $4,190 for the same query. The meta-learner, trained on many past instances of these three predictions vs. actual outcomes, might learn weights like 0.2/0.5/0.3 — giving XGBoost the most trust here: 0.2(4150)+0.5(4220)+0.3(4190)=$4,197.',
        'Meta-learner g fit on {(h₁(x),h₂(x),h₃(x)), y} pairs from out-of-fold predictions (never the same data the base learners trained on, to avoid leakage) — final prediction ŷ=g(h₁(x),h₂(x),h₃(x)), often itself a simple linear or logistic model.',
        'ARIMA သည် $4,150, XGBoost သည် $4,220, LSTM သည် $4,190 ကို query တစ်ခုတည်းအတွက် ခန့်မှန်းသည်။ ဒီ ခန့်မှန်းချက်သုံးခုနှင့် တကယ့်ရလဒ်များကို သမိုင်းဝင် ဥပမာများစွာနှင့် train လုပ်ထားသော meta-learner သည် weight 0.2/0.5/0.3 ကို သင်ယူနိုင်သည် — ဒီနေရာတွင် XGBoost ကို အယုံကြည်ဆုံးပေးသည်: 0.2(4150)+0.5(4220)+0.3(4190)=$4,197။',
        'Meta-learner g သည် out-of-fold ခန့်မှန်းချက်များမှ {(h₁(x),h₂(x),h₃(x)), y} pair များပေါ်တွင် fit လုပ်ထားသည် (base learner train လုပ်ခဲ့သော data အတူတူ မဟုတ်ပါ, leakage ရှောင်ရှားရန်) — နောက်ဆုံးခန့်မှန်းချက် ŷ=g(h₁(x),h₂(x),h₃(x)), မကြာခဏ ရိုးရှင်းသော linear သို့ logistic model ကိုယ်တိုင်ဖြစ်သည်။'
      ),
      faded: bl(
        'If the meta-learner were fit on the SAME data the base learners were trained on (not held-out out-of-fold data), what problem would likely result? Step 1 — think about what the base learners already "know" about that data. Step 2 — answer: _____.',
        'If the meta-learner were fit on the SAME data the base learners were trained on (not held-out out-of-fold data), what problem would likely result? Step 1 — think about what the base learners already "know" about that data. Step 2 — answer: _____.',
        'Meta-learner ကို base learner train လုပ်ခဲ့သော data အတူတူပေါ်တွင် fit လုပ်ခဲ့လျှင် (held-out out-of-fold data မဟုတ်ဘဲ) ဘာပြဿနာ ဖြစ်လာနိုင်မလဲ? အဆင့် ၁ — base learner များ ထို data အကြောင်း ဘာတွေ "သိပြီးသား" ဖြစ်နေမလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Meta-learner ကို base learner train လုပ်ခဲ့သော data အတူတူပေါ်တွင် fit လုပ်ခဲ့လျှင် (held-out out-of-fold data မဟုတ်ဘဲ) ဘာပြဿနာ ဖြစ်လာနိုင်မလဲ? အဆင့် ၁ — base learner များ ထို data အကြောင်း ဘာတွေ "သိပြီးသား" ဖြစ်နေမလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The senior-physician analogy breaks down on transparency: an experienced doctor can usually explain WHY they trust one specialist more in a given case. A stacking meta-learner's learned weights are typically just numbers with no accompanying narrative — you can see the weight, not necessarily the reasoning.",
        'အထက်တန်း ဆရာဝန် ဆင်တူပုံရိပ်သည် ပွင့်လင်းမြင်သာမှုတွင် ပျက်စီးသည်: အတွေ့အကြုံရှိသော ဆရာဝန်တစ်ဦးသည် အခြေအနေတစ်ခုတွင် ကျွမ်းကျင်သူတစ်ဦးကို ဘာကြောင့်ပိုယုံကြည်လဲ ရှင်းပြနိုင်လေ့ရှိသည်။ Stacking meta-learner ၏ သင်ယူထားသော weight များသည် ပုံမှန်အားဖြင့် ဂဏန်းသက်သက်သာဖြစ်ပြီး ဆောင်ရွက်လာသော narrative မပါပါ — weight ကို မြင်ရသော်လည်း ယုတ္တိကို မဖြစ်မနေ မမြင်ရပါ။'
      ),
      caveat: blSame(
        'A real caveat: stacking\'s accuracy gains come at real cost — training and maintaining several diverse base models plus a meta-learner is far more compute- and engineering-expensive than any single model, and harder to debug when something goes wrong.',
        'တကယ့် caveat: stacking ၏ တိကျမှု တိုးတက်မှုများသည် တကယ့်ကုန်ကျစရိတ်နှင့်လာသည် — ကွဲပြားသော base model များစွာနှင့် meta-learner ကို train/ထိန်းသိမ်းခြင်းသည် model တစ်ခုတည်းထက် တွက်ချက်မှုနှင့် engineering ကုန်ကျစရိတ် များစွာပိုများပြီး တစ်ခုခု မှားယွင်းသောအခါ debug လုပ်ရန် ပိုခက်ခဲသည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why must the meta-learner be trained on out-of-fold predictions rather than the base learners\' own training predictions?', 'ပြန်မကြည့်ဘဲ: meta-learner ကို base learner များ၏ ကိုယ်ပိုင် training ခန့်မှန်းချက်များအစား ဘာကြောင့် out-of-fold ခန့်မှန်းချက်များပေါ်တွင် train လုပ်ရမည်နည်း?'),
        answer: blSame(
          "A base learner's predictions on its own training data are artificially accurate (it already memorized patterns in that exact data) — feeding those to the meta-learner would teach it to over-trust base models on data they've already seen, which won't hold on genuinely new data.",
          'Base learner တစ်ခု၏ ၎င်းကိုယ်ပိုင် training data ပေါ်ရှိ ခန့်မှန်းချက်များသည် artificial အနေဖြင့် တိကျသည် (ထို data အတိအကျရှိ pattern များကို သိမြင်ပြီးသားဖြစ်သည်) — ၎င်းတို့ကို meta-learner ထဲသို့ ပို့ခြင်းသည် ၎င်းအား တွေ့ဖူးပြီးသား data ပေါ်ရှိ base model များကို လွန်ကဲစွာ ယုံကြည်ရန် သင်ကြားပေးမည်ဖြစ်ပြီး တကယ့်ဒေတာအသစ်တွင် မရှိတော့ပါ။'
        ),
      },
    },
  },

  svm: {
    spark: {
      analogy: bl(
        "Like drawing the widest possible safety lane between two crowds of people, positioning it based only on the people standing closest to the boundary — everyone standing further back doesn't matter to where the lane goes.",
        'Finds the maximum-margin separating boundary; only support vectors (borderline points) determine the solution.',
        'လူအုပ်နှစ်ခုကြား အကျယ်ဆုံး ဘေးကင်းရေးလမ်းကြောင်းကို ဆွဲသကဲ့သို့ — နယ်နိမိတ်အနီးဆုံး ရပ်တည်နေသူများကိုသာ အခြေခံသည်၊ နောက်ကျန် ရပ်နေသူတိုင်းသည် လမ်းကြောင်း ဘယ်နေရာသွားမည်ဆိုသည်နှင့် မသက်ဆိုင်ပါ။',
        'Maximum-margin ခွဲခြားသော boundary ကို ရှာသည်; support vector (နယ်စပ်ရှိ point) များသာ solution ကို ဆုံးဖြတ်သည်။'
      ),
      predict: {
        question: blSame('If you removed a point that\'s far from the SVM decision boundary (not a support vector), would the boundary move?', 'SVM decision boundary မှ ဝေးလံသော point (support vector မဟုတ်) တစ်ခုကို ဖယ်ရှားလိုက်ရင် boundary ရွေ့မည်လား?'),
        options: [blSame('Yes, it would shift', 'ဟုတ်သည်၊ ရွှေ့သွားမည်'), blSame('No, the boundary stays exactly the same', 'မဟုတ်ပါ၊ boundary အတိအကျ တူညီစွာ ဆက်ရှိမည်')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you move a borderline (support vector) point closer to the opposite class, does the margin width grow or shrink?', 'Borderline (support vector) point တစ်ခုကို ဆန့်ကျင်ဘက် class ဆီသို့ ရွှေ့ပါက margin ကျယ်ပြန့်မှု ကြီးလာမလား ကျလာမလား?'), options: [blSame('Grows', 'ကြီးလာသည်'), blSame('Shrinks', 'ကျလာသည်')], correctIndex: 1 },
      paramLabel: blSame('Distance of closest borderline point to the boundary', 'boundary နှင့် အနီးဆုံး borderline point အကွာအဝေး'),
      paramMin: 0.1, paramMax: 5, paramDefault: 2, paramStep: 0.1, paramDecimals: 1,
      compute: (v) => v * 2,
      outputLabel: blSame('Margin width', 'Margin ကျယ်ပြန့်မှု'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'Two crisis/no-crisis regime clusters with a gap between them: SVM doesn\'t just find any separating line, it finds the one maximizing the gap on both sides — if the gap is 4 units wide, SVM centers its boundary exactly in the middle, at 2 units from each nearest point.',
        'Maximize margin 2/‖w‖ subject to yᵢ(w·xᵢ+b)≥1 for all i; only points where equality holds (yᵢ(w·xᵢ+b)=1) — the support vectors — have nonzero Lagrange multipliers and thus influence w.',
        'ကြားက ကွာဟချက်ရှိသော ကပ်ဘေး/ကပ်ဘေးမဟုတ် regime cluster နှစ်ခု: SVM သည် ခွဲခြားသော မျဉ်း မည်သည့်တစ်ခုကိုမဆို ရှာသည် မဟုတ်ဘဲ နှစ်ဖက်စလုံးရှိ ကွာဟချက်ကို maximize ပြုသော တစ်ခုကို ရှာသည် — ကွာဟချက် ယူနစ် ၄ ခု ကျယ်ပါက SVM သည် ၎င်း၏ boundary ကို အလယ်တွင် အတိအကျထားပြီး အနီးဆုံး point တစ်ခုစီမှ ယူနစ် ၂ ခု ဖြစ်စေသည်။',
        'Margin 2/‖w‖ ကို yᵢ(w·xᵢ+b)≥1 (i အားလုံးအတွက်) အောက်တွင် maximize ပြုသည်; equality ရှိသော point များ (yᵢ(w·xᵢ+b)=1) — support vector များ — သာ nonzero Lagrange multiplier ရှိပြီး w ကို သက်ရောက်စေသည်။'
      ),
      faded: bl(
        'If you added a new point far inside one cluster (not near the boundary at all), would it become a support vector? Step 1 — recall what defines a support vector. Step 2 — answer: _____.',
        'If you added a new point far inside one cluster (not near the boundary at all), would it become a support vector? Step 1 — recall what defines a support vector. Step 2 — answer: _____.',
        'Cluster တစ်ခုအတွင်း ဝေးလံစွာ (boundary အနီးလုံးဝမဟုတ်) point အသစ်တစ်ခု ထည့်လိုက်လျှင် ၎င်းသည် support vector ဖြစ်လာမလား? အဆင့် ၁ — support vector ကို ဘာက သတ်မှတ်သလဲ သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Cluster တစ်ခုအတွင်း ဝေးလံစွာ (boundary အနီးလုံးဝမဟုတ်) point အသစ်တစ်ခု ထည့်လိုက်လျှင် ၎င်းသည် support vector ဖြစ်လာမလား? အဆင့် ၁ — support vector ကို ဘာက သတ်မှတ်သလဲ သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The safety-lane analogy breaks down for the "kernel trick" specifically: a real physical lane must stay straight in physical space. SVM can effectively bend its boundary into a curve by working in a transformed, higher-dimensional space — the lane is only straight in that hidden space, not necessarily in the one you\'d actually plot.',
        'ဘေးကင်းရေးလမ်းကြောင်း ဆင်တူပုံရိပ်သည် "kernel trick" အတွက် အထူးသဖြင့် ပျက်စီးသည်: တကယ့် ရုပ်ပိုင်းဆိုင်ရာ လမ်းကြောင်းသည် ရုပ်ပိုင်းဆိုင်ရာ space တွင် ဖြောင့်ဆက်ရှိရမည်ဖြစ်သည်။ SVM သည် ပြောင်းလဲထားသော dimension မြင့် space တွင် အလုပ်လုပ်ခြင်းဖြင့် ၎င်း၏ boundary ကို ကွေးသွားစေနိုင်သည် — လမ်းကြောင်းသည် ထို ဝှက်ထားသော space တွင်သာ ဖြောင့်ပြီး သင်တကယ် ပုံဆွဲမည့် space တွင် မဖြစ်မနေ ဖြောင့်ချင်မှ ဖြောင့်လိမ့်မည်။'
      ),
      caveat: blSame(
        'A real caveat: SVM\'s reliance on pairwise distance/kernel computations between points means training cost grows poorly with dataset size — it\'s genuinely impractical on very large datasets in a way tree-based methods aren\'t.',
        'တကယ့် caveat: SVM ၏ point အချင်းချင်းကြား pairwise distance/kernel တွက်ချက်မှုအပေါ် မှီခိုမှုသည် training ကုန်ကျစရိတ်သည် dataset အရွယ်အစားနှင့်အတူ ညံ့ဖျင်းစွာ ကြီးထွားစေသည် — tree-based method များနှင့်မတူဘဲ dataset အလွန်ကြီးမားလျှင် တကယ်ပင် လက်တွေ့မကျပါ။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is SVM described as "memory-efficient" despite storing potentially many support vectors?', 'ပြန်မကြည့်ဘဲ: SVM သည် support vector များစွာ သိမ်းထားနိုင်သော်လည်း ဘာကြောင့် "memory-efficient" ဟု ဖော်ပြသလဲ?'),
        answer: blSame(
          "Because it only needs to store the support vectors, not the entire training dataset — for a well-separated problem, the support vectors are often a small fraction of all training points, unlike KNN which must retain every single point regardless of how decisive it is.",
          'ဘာကြောင့်ဆိုသော် ၎င်းသည် training dataset တစ်ခုလုံးကို သိမ်းစရာမလိုဘဲ support vector များကိုသာ သိမ်းထားရန်လိုအပ်သောကြောင့်ဖြစ်သည် — ကောင်းစွာ ခွဲခြားထားသော ပြဿနာတစ်ခုအတွက် support vector များသည် training point အားလုံး၏ အစိတ်အပိုင်းငယ်သာ ဖြစ်လေ့ရှိသည်၊ point တစ်ခုစီကို ဘယ်လောက်ပင် အရေးမပါပါစေ သိမ်းထားရမည့် KNN နှင့် မတူပါ။'
        ),
      },
    },
  },

  kmeans: {
    spark: {
      analogy: bl(
        "Like splitting a crowded room into a fixed number of friend-groups by repeatedly having everyone walk to whichever group's current center they're standing closest to, then re-finding each group's center — until nobody wants to switch groups anymore.",
        'Alternates between assigning points to the nearest centroid and recomputing centroids as cluster means, until convergence.',
        'ပြည့်နှက်နေသော အခန်းတစ်ခုကို သတ်မှတ်ထားသော အုပ်စု အရေအတွက်ဖြင့် ခွဲခြားသကဲ့သို့ — လူတိုင်းသည် ၎င်းတို့ အနီးဆုံး ရပ်နေသော အုပ်စု၏ လက်ရှိဗဟိုသို့ လျှောက်သွားပြီး၊ အုပ်စုတစ်ခုစီ၏ ဗဟိုကို ထပ်ရှာသည် — ဘယ်သူမှ အုပ်စုပြောင်းချင်တော့သည့်အထိ ထပ်ခါထပ်ခါ လုပ်ဆောင်သည်။',
        'ပေါင်းစည်းမှုမရောက်မချင်း point များကို အနီးဆုံး centroid သို့ သတ်မှတ်ခြင်းနှင့် centroid များကို cluster mean အဖြစ် ပြန်တွက်ချက်ခြင်းကို အလှည့်လှည့်ပြုလုပ်သည်။'
      ),
      predict: {
        question: blSame('If you run K-Means twice on the same data with different random starting centroids, will you always get the exact same final clusters?', 'K-Means ကို data အတူတူပေါ်တွင် ကျပန်း starting centroid မတူညီစွာ နှစ်ကြိမ်ပြေးလျှင် နောက်ဆုံး cluster များ အမြဲတူညီမည်လား?'),
        options: [blSame('Yes, always identical', 'ဟုတ်သည်၊ အမြဲတူညီသည်'), blSame('Not necessarily — it can converge to different local solutions', 'မဖြစ်မနေမဟုတ်ပါ — local solution မတူညီသို့ ပေါင်းစည်းနိုင်သည်')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase k (the number of clusters requested), does the within-cluster error (how tight each group is) rise or fall?', 'k (တောင်းဆိုထားသော cluster အရေအတွက်) ကို တိုးလျှင် within-cluster error (အုပ်စုတစ်ခုစီ ဘယ်လောက်တင်းကျပ်လဲ) တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 1 },
      paramLabel: blSame('k (number of clusters)', 'k (cluster အရေအတွက်)'),
      paramMin: 1, paramMax: 15, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => 100 / v,
      outputLabel: blSame('Toy within-cluster error (illustrative)', 'ဥပမာ within-cluster error (သရုပ်ဖော်)'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'Segmenting 6 historical market days by two features (volatility, return) into k=2 "regimes": start with 2 random centroids, assign each day to its nearest one, recompute each centroid as the mean of its assigned days, repeat — after a few rounds this settles into a stable "calm" cluster and a "turbulent" cluster.',
        'Minimizes Σₖ Σ_{x∈Cₖ} ‖x-μₖ‖² (within-cluster sum of squares) via alternating assignment (Voronoi partition under current centroids) and update (μₖ = mean of Cₖ) steps — guaranteed to decrease the objective each iteration, but only to a local optimum.',
        'သမိုင်းဝင် စျေးကွက်ရက် ၆ ရက်ကို feature နှစ်ခု (volatility, return) ဖြင့် k=2 "regime" အဖြစ် ခွဲခြားခြင်း: ကျပန်း centroid နှစ်ခုနှင့် စတင်၊ ရက်တစ်ရက်စီကို အနီးဆုံးတစ်ခုသို့ သတ်မှတ်၊ centroid တစ်ခုစီကို ၎င်းသို့သတ်မှတ်ထားသော ရက်များ၏ ပျမ်းမျှအဖြစ် ပြန်တွက်ချက်၊ ထပ်လုပ်ပါ — ဒီလိုအကြိမ်အနည်းငယ်ပြီးနောက် "အေးဆေး" cluster နှင့် "ဒွန်တွန်း" cluster တည်ငြိမ်စွာ ရရှိလာသည်။',
        'Σₖ Σ_{x∈Cₖ} ‖x-μₖ‖² (within-cluster sum of squares) ကို assignment (လက်ရှိ centroid များအောက် Voronoi partition) နှင့် update (μₖ = Cₖ ၏ ပျမ်းမျှ) အဆင့်များ အလှည့်လှည့်ပြုလုပ်ခြင်းဖြင့် minimize ပြုသည် — iteration တစ်ခုစီတွင် objective ကျဆင်းရန် အာမခံသော်လည်း local optimum တစ်ခုသို့သာ ရောက်သည်။'
      ),
      faded: bl(
        'If k equals the total number of data points, what would the within-cluster error become? Step 1 — think about what "cluster" means when each point is its own group. Step 2 — answer: _____.',
        'If k equals the total number of data points, what would the within-cluster error become? Step 1 — think about what "cluster" means when each point is its own group. Step 2 — answer: _____.',
        'k သည် data point စုစုပေါင်း အရေအတွက်နှင့် ညီမျှလျှင် within-cluster error ဘာဖြစ်သွားမလဲ? အဆင့် ၁ — point တစ်ခုစီသည် ၎င်း၏ ကိုယ်ပိုင် အုပ်စုဖြစ်နေလျှင် "cluster" ဆိုသည်မှာ ဘာကို ဆိုလိုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'k သည် data point စုစုပေါင်း အရေအတွက်နှင့် ညီမျှလျှင် within-cluster error ဘာဖြစ်သွားမလဲ? အဆင့် ၁ — point တစ်ခုစီသည် ၎င်း၏ ကိုယ်ပိုင် အုပ်စုဖြစ်နေလျှင် "cluster" ဆိုသည်မှာ ဘာကို ဆိုလိုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The friend-groups analogy breaks down on shape: real friend groups can cluster in any shape (a long line at a buffet, a ring around a stage). K-Means mathematically assumes roughly round, similarly-sized clusters (nearest-centroid assignment naturally carves space into convex regions) — elongated or oddly-shaped true groupings will be sliced up incorrectly.',
        'သူငယ်ချင်းအုပ်စုများ ဆင်တူပုံရိပ်သည် ပုံသဏ္ဍာန်တွင် ပျက်စီးသည်: တကယ့်သူငယ်ချင်းအုပ်စုများသည် ပုံသဏ္ဍာန်မည်သို့မဆို စုစည်းနိုင်သည် (buffet တန်းတန်းရှည်တစ်ခု၊ စင်မြင့်ပတ်လည် ကွင်းတစ်ခု)။ K-Means သည် math အရ ကြမ်းအားဖြင့် ဂုံးပုံ၊ အရွယ်အစားတူသော cluster များဟု ယူဆသည် (nearest-centroid assignment သည် space ကို convex region များအဖြစ် သဘာဝကျစွာ ခုတ်ပေးသည်) — ရှည်လျားသော (သို့) ထူးဆန်းသောပုံသဏ္ဍာန်ရှိသော စစ်မှန်သော အုပ်စုအစုများကို မှားယွင်းစွာ ခွဲခြမ်းလိမ့်မည်။'
      ),
      caveat: blSame(
        'A real caveat: K-Means requires choosing k in advance with no built-in way to determine the "right" number — you typically need a separate method (like the elbow method or silhouette score) run alongside it.',
        'တကယ့် caveat: K-Means သည် "မှန်ကန်သော" အရေအတွက်ကို ဆုံးဖြတ်ရန် built-in နည်းလမ်းမရှိဘဲ k ကို ကြိုတင်ရွေးချယ်ရန် လိုအပ်သည် — ၎င်းနှင့်အတူ run ရမည့် သီးခြားနည်းလမ်း (elbow method သို့ silhouette score ကဲ့သို့) ပုံမှန်အားဖြင့် လိုအပ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does K-Means guarantee its objective (within-cluster sum of squares) never increases, but not guarantee finding the globally best clustering?', 'ပြန်မကြည့်ဘဲ: K-Means သည် ၎င်း၏ objective (within-cluster sum of squares) ဘယ်တော့မှ မတိုးကြောင်း ဘာကြောင့် အာမခံသော်လည်း globally အကောင်းဆုံး clustering ကို ရှာတွေ့ကြောင်း အာမမခံသလဲ?'),
        answer: blSame(
          "Both the assignment and update steps each individually can only decrease or maintain the objective, never increase it — so the algorithm always converges. But it converges to whichever local optimum the random starting centroids happened to lead toward, and a different random start can lead to a different (possibly worse) local optimum.",
          'Assignment နှင့် update အဆင့်နှစ်ခုစလုံးသည် တစ်ခုချင်းစီက objective ကို ကျဆင်း/ဆက်ထားရုံသာ ပြုနိုင်ပြီး ဘယ်တော့မှ မတိုးနိုင်ပါ — ဒါကြောင့် algorithm သည် အမြဲပေါင်းစည်းသည်။ သို့သော် ကျပန်း starting centroid များ ဦးတည်သွားခဲ့သည့် local optimum မည်သည့်တစ်ခုသို့မဆို ပေါင်းစည်းသွားပြီး ကျပန်း start မတူညီလျှင် local optimum မတူညီ (ပိုညံ့ဖျင်းနိုင်သည်) သို့ ဦးတည်နိုင်သည်။'
        ),
      },
    },
  },

  hclust: {
    spark: {
      analogy: bl(
        'Like building a family tree from the bottom up — first pairing the two most similar individuals, then treating that pair as one unit and pairing it with the next most similar, until everyone\'s connected into one tree showing every possible grouping at once.',
        'Agglomerative construction of a dendrogram by repeatedly merging the two closest clusters, with no need to pre-specify a cluster count.',
        'မိသားစုစဉ်ဆက် သစ်ပင်တစ်ပင်ကို အောက်မှတည်ဆောက်သကဲ့သို့ — ဦးစွာ အလားတူဆုံးသူ နှစ်ဦးကို တွဲချိတ်ပြီး၊ ထိုတွဲကို ယူနစ်တစ်ခုအဖြစ်ယူဆကာ နောက်တစ်ခု အလားတူဆုံးနှင့် တွဲချိတ်သည် — လူတိုင်း ဖြစ်နိုင်သမျှ အုပ်စုဖွဲ့မှုအားလုံးကို တစ်ပြိုင်နက်ပြသသော သစ်ပင်တစ်ပင်ထဲသို့ ချိတ်ဆက်သည်အထိ။',
        'အနီးဆုံး cluster နှစ်ခုကို ထပ်ခါထပ်ခါ ပေါင်းစည်းခြင်းဖြင့် dendrogram ကို agglomerative အနေဖြင့် တည်ဆောက်ခြင်း၊ cluster အရေအတွက်ကို ကြိုတင်သတ်မှတ်ရန် မလိုအပ်ပါ။'
      ),
      predict: {
        question: blSame('Does hierarchical clustering require you to decide the number of clusters BEFORE running it, like K-Means does?', 'Hierarchical clustering သည် K-Means လိုပင် run မလုပ်မီ cluster အရေအတွက်ကို ဆုံးဖြတ်ဖို့ လိုအပ်သလား?'),
        options: [blSame('Yes, in advance', 'ဟုတ်သည်၊ ကြိုတင်'), blSame('No — you can choose it after, by where you cut the tree', 'မဟုတ်ပါ — pin ကို ဘယ်နေရာဖြတ်တောက်မလဲဆိုတာဖြင့် နောက်မှ ရွေးချယ်နိုင်သည်')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'modelmap', label: blSame('This very Model Map — built with the same merge-tree idea', 'ဒီ Model Map ကိုယ်တိုင် — တူညီသော merge-tree အယူအဆဖြင့် တည်ဆောက်ထားသည်') },
    formalism: {
      worked: bl(
        'Four models with pairwise similarity scores: (Linear Regression, Ridge) are most similar → merge first into "Linear family." Then that family merges with Logistic Regression next-most-similar → "Linear & Regularized" cluster. The full sequence of merges IS the dendrogram.',
        'Agglomerative clustering repeatedly merges the pair (Cᵢ,Cⱼ) minimizing a linkage criterion d(Cᵢ,Cⱼ) — e.g. single-linkage: min distance between any pair of points across the two clusters; complete-linkage: max distance; the cut height on the resulting dendrogram then determines the final flat clustering.',
        'Model လေးခု pairwise similarity score ဖြင့်: (Linear Regression, Ridge) အလားတူဆုံးဖြစ်ပြီး → "Linear family" အဖြစ် ဦးစွာ ပေါင်းစည်းသည်။ ထို family သည် နောက်ထပ်အလားတူဆုံး Logistic Regression နှင့် ပေါင်းစည်းသည် → "Linear & Regularized" cluster။ ပေါင်းစည်းမှု အစီအစဉ်တစ်ခုလုံးသည် dendrogram ကိုယ်တိုင်ဖြစ်သည်။',
        'Agglomerative clustering သည် linkage criterion d(Cᵢ,Cⱼ) ကို minimize ပြုသော pair (Cᵢ,Cⱼ) ကို ထပ်ခါထပ်ခါ ပေါင်းစည်းသည် — ဥပမာ single-linkage: cluster နှစ်ခုကြား point pair မည်သည့်တစ်ခု၏မဆို အနည်းဆုံး distance; complete-linkage: အများဆုံး distance; ရလဒ် dendrogram ပေါ်ရှိ ဖြတ်တောက်မှု အမြင့်သည် နောက်ဆုံး flat clustering ကို ဆုံးဖြတ်သည်။'
      ),
      faded: bl(
        'If you cut the dendrogram very close to the top (near the single root), would you get many small clusters or few large ones? Step 1 — think about how much merging has happened near the root. Step 2 — answer: _____.',
        'If you cut the dendrogram very close to the top (near the single root), would you get many small clusters or few large ones? Step 1 — think about how much merging has happened near the root. Step 2 — answer: _____.',
        'Dendrogram ကို ထိပ်ဆုံး (root တစ်ခုတည်း) အနီးတွင် ဖြတ်တောက်လျှင် cluster သေးသေးလေးများကို ရမလား ကြီးသော cluster အနည်းငယ်ကို ရမလား? အဆင့် ၁ — root အနီးတွင် ပေါင်းစည်းမှု ဘယ်လောက်ဖြစ်ခဲ့သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Dendrogram ကို ထိပ်ဆုံး (root တစ်ခုတည်း) အနီးတွင် ဖြတ်တောက်လျှင် cluster သေးသေးလေးများကို ရမလား ကြီးသော cluster အနည်းငယ်ကို ရမလား? အဆင့် ၁ — root အနီးတွင် ပေါင်းစည်းမှု ဘယ်လောက်ဖြစ်ခဲ့သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The family-tree analogy is genuinely close, but breaks down on reversibility: a real family tree's early marriages are permanent historical facts. Hierarchical clustering's early merges are also permanent — a bad early merge (two dissimilar clusters accidentally paired) can never be undone later in the process, unlike K-Means which can re-assign points every iteration.",
        'မိသားစုစဉ်ဆက် ဆင်တူပုံရိပ်သည် တကယ်ပင်နီးစပ်သော်လည်း ပြန်လည်ပြင်ဆင်နိုင်မှုတွင် ပျက်စီးသည်: တကယ့်မိသားစုစဉ်ဆက်၏ အစောပိုင်း လက်ထပ်မှုများသည် အမြဲတမ်း သမိုင်းအချက်အလက်များဖြစ်သည်။ Hierarchical clustering ၏ အစောပိုင်း ပေါင်းစည်းမှုများသည်လည်း အမြဲတမ်းဖြစ်သည် — အစောပိုင်း ပေါင်းစည်းမှု ညံ့ဖျင်းလျှင် (အလားတူမှုမရှိသော cluster နှစ်ခု မတော်တဆ တွဲချိတ်) နောက်ပိုင်း လုပ်ငန်းစဉ်တွင် ဘယ်တော့မှ ပြန်ပြင်၍ မရနိုင်ပါ၊ iteration တိုင်း point ပြန်သတ်မှတ်နိုင်သော K-Means နှင့် မတူပါ။'
      ),
      caveat: blSame(
        "A real caveat: computing all pairwise distances between every pair of points scales quadratically (or worse) with dataset size, which is exactly why it's computationally expensive at scale.",
        'တကယ့် caveat: point pair တိုင်းကြား distance အားလုံးကို တွက်ချက်ခြင်းသည် dataset အရွယ်အစားနှင့်အတူ quadratically (သို့ ပိုဆိုးစွာ) ကြီးထွားသည်၊ ဒါသည် scale ကြီးလာလျှင် တွက်ချက်မှု ကုန်ကျစရိတ်များသည့်အကြောင်းရင်း အတိအကျဖြစ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is a dendrogram genuinely more informative than a single flat clustering, even though the final flat clusters are what get used?', 'ပြန်မကြည့်ဘဲ: နောက်ဆုံးတွင် flat cluster များကိုသာ အသုံးချသော်လည်း dendrogram တစ်ခုသည် flat clustering တစ်ခုတည်းထက် ဘာကြောင့် တကယ်ပို၍ အချက်အလက်ပြည့်စုံသလဲ?'),
        answer: blSame(
          "A dendrogram shows every possible number of clusters at once, from 1 (the whole dataset) to n (every point its own cluster) — you can inspect the whole hierarchy of relationships and choose a cut height after seeing the structure, rather than committing to one k blindly beforehand.",
          'Dendrogram သည် ဖြစ်နိုင်သော cluster အရေအတွက် အားလုံးကို 1 (dataset တစ်ခုလုံး) မှ n (point တစ်ခုစီ ၎င်း၏ ကိုယ်ပိုင် cluster) အထိ တစ်ပြိုင်နက် ပြသသည် — structure ကိုမြင်ပြီးမှ ဆက်စပ်မှု အဆင့်ဆင့်တစ်ခုလုံးကို စစ်ဆေးကာ ဖြတ်တောက်မှု အမြင့်ကို ကြိုတင်၍ ကန့်သတ်မထားဘဲ ရွေးချယ်နိုင်သည်။'
        ),
      },
    },
  },

  pca: {
    spark: {
      analogy: bl(
        "Like realizing that a room full of thermometers, all reading roughly the same temperature just with slightly different offsets, can be summarized by just \"one true temperature\" instead of tracking every thermometer separately.",
        'Compresses many correlated variables into a few uncorrelated "factor" directions capturing most of the shared variance.',
        'အနီးစပ်တူ အပူချိန်တူတူ ဖတ်နေသော thermometer အများကြီးပါသော အခန်းတစ်ခုသည် thermometer တစ်ခုချင်းစီကို သီးခြားခြေရာမခံဘဲ "စစ်မှန်သော အပူချိန်တစ်ခု" ဖြင့် အနှစ်ချုပ်နိုင်ကြောင်း သတိရှိလာသကဲ့သို့။',
        'ကွဲပြားသော variable များစွာကို မျှဝေထားသော variance အများစုကို ဖမ်းယူသော correlate မဖြစ်သော "factor" ဦးတည်ချက် အနည်းငယ်အဖြစ် ချုံ့ပေးသည်။'
      ),
      predict: {
        question: blSame('If five economic indicators all move almost perfectly together (highly correlated), can PCA compress them into fewer than five numbers with little information loss?', 'စီးပွားရေးညွှန်းကိန်း ငါးခုသည် အားလုံးနီးပါး ပြီးပြည့်စုံစွာ အတူတကွ ရွေ့လျားလျှင် (correlate မြင့်), PCA သည် ၎င်းတို့ကို အချက်အလက် ဆုံးရှုံးမှုအနည်းငယ်ဖြင့် ငါးခုထက်နည်းသော ဂဏန်းများအဖြစ် ချုံ့နိုင်သလား?'),
        options: [blSame('Yes', 'ဟုတ်သည်'), blSame('No, PCA can never reduce dimensionality without major loss', 'မဟုတ်ပါ၊ PCA သည် ကြီးမားသော ဆုံးရှုံးမှုမရှိဘဲ dimension ကို ဘယ်တော့မှ မလျှော့ချနိုင်ပါ')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As the original variables become more strongly correlated with each other, does the first principal component explain more or less of the total variance?', 'မူရင်း variable များသည် တစ်ခုနှင့်တစ်ခု ပိုပြင်းထန်စွာ ဆက်စပ်လာလျှင် ပထမဆုံး principal component သည် variance စုစုပေါင်း၏ ပိုများများ (သို့) ပိုနည်းနည်းကို ရှင်းပြသလဲ?'), options: [blSame('More', 'ပိုများသည်'), blSame('Less', 'ပိုနည်းသည်')], correctIndex: 0 },
      paramLabel: blSame('Correlation among original variables', 'မူရင်း variable များကြား correlation'),
      paramMin: 0, paramMax: 1, paramDefault: 0, paramStep: 0.05, paramDecimals: 2,
      compute: (v) => 20 + v * 75,
      outputLabel: blSame('% variance explained by 1st component', '1st component က ရှင်းပြသော variance %'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Five macro indicators (yield curve, PMI, labor market, mobility, freight) are all correlated with an underlying "economic momentum" factor. PCA might find that a single first component explains 78% of all five series\' combined variance — a huge compression with modest information loss, feeding a DFM-style single "common macro factor."',
        'PCA solves the eigendecomposition of the covariance matrix Σ = VΛVᵀ; the first principal component is the eigenvector with the largest eigenvalue, and % variance explained by component k is λₖ/Σλᵢ.',
        'စီးပွားရေးညွှန်းကိန်း ငါးခု (yield curve, PMI, labor market, mobility, freight) သည် အားလုံး underlying "economic momentum" factor တစ်ခုနှင့် ဆက်စပ်နေသည်။ PCA သည် ပထမဆုံး component တစ်ခုတည်းက ငါးခု၏ ပေါင်းစည်း variance ၏ 78% ကို ရှင်းပြနိုင်ကြောင်း တွေ့ရှိနိုင်သည် — အချက်အလက် ဆုံးရှုံးမှု အနည်းငယ်ဖြင့် ချုံ့မှုကြီးကြီးမားမား၊ DFM ပုံစံ "ဘုံ macro factor" တစ်ခုတည်းကို ကျွေးသည်။',
        'PCA သည် covariance matrix ၏ eigendecomposition Σ = VΛVᵀ ကို ဖြေရှင်းသည်; ပထမဆုံး principal component သည် eigenvalue အကြီးဆုံးရှိသော eigenvector ဖြစ်ပြီး component k က ရှင်းပြသော variance % သည် λₖ/Σλᵢ ဖြစ်သည်။'
      ),
      faded: bl(
        'If the five original variables were completely uncorrelated (each moving independently), would one PCA component still capture most of the variance? Step 1 — think about whether there\'s any shared structure to compress. Step 2 — answer: _____.',
        'If the five original variables were completely uncorrelated (each moving independently), would one PCA component still capture most of the variance? Step 1 — think about whether there\'s any shared structure to compress. Step 2 — answer: _____.',
        'မူရင်း variable ငါးခုသည် လုံးဝ correlate မဖြစ်ဘဲ (တစ်ခုစီ လွတ်လပ်စွာရွေ့လျား) ဖြစ်ခဲ့လျှင် PCA component တစ်ခုသည် variance အများစုကို ဆက်ဖမ်းယူနိုင်မလား? အဆင့် ၁ — ချုံ့ရန် မျှဝေထားသော structure တစ်ခုခု ရှိမရှိ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'မူရင်း variable ငါးခုသည် လုံးဝ correlate မဖြစ်ဘဲ (တစ်ခုစီ လွတ်လပ်စွာရွေ့လျား) ဖြစ်ခဲ့လျှင် PCA component တစ်ခုသည် variance အများစုကို ဆက်ဖမ်းယူနိုင်မလား? အဆင့် ၁ — ချုံ့ရန် မျှဝေထားသော structure တစ်ခုခု ရှိမရှိ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The thermometer analogy breaks down on interpretability: \"one true temperature\" is still a temperature, easy to understand. A PCA component is a weighted blend of all original variables at once — it might mix yield-curve-slope with mobility-data in a way that has no clean, single real-world name, unlike the analogy's clean single number.",
        'Thermometer ဆင်တူပုံရိပ်သည် နားလည်နိုင်မှုတွင် ပျက်စီးသည်: "စစ်မှန်သော အပူချိန်တစ်ခု" သည် ဆက်လက်၍ အပူချိန်တစ်ခုသာဖြစ်ပြီး နားလည်ရလွယ်ကူသည်။ PCA component တစ်ခုသည် မူရင်း variable အားလုံး၏ weight ချထားသော ရောနှောမှုတစ်ခုဖြစ်ပြီး — ဆင်တူပုံရိပ်၏ ရှင်းလင်းသော ဂဏန်းတစ်ခုတည်းနှင့်မတူဘဲ yield-curve-slope ကို mobility-data နှင့် သန့်ရှင်းသော၊ တစ်ခုတည်းသော လက်တွေ့ကမ္ဘာ့နာမည်မရှိစွာ ရောနှောနိုင်သည်။'
      ),
      caveat: blSame(
        'A real caveat: PCA finds directions of maximum variance, not necessarily directions that are most predictive of any particular target — a component explaining 90% of input variance could still be nearly useless for forecasting a specific outcome.',
        'တကယ့် caveat: PCA သည် variance အများဆုံး ဦးတည်ချက်များကို ရှာသည်၊ ပစ်မှတ်တစ်ခုခုကို အခန့်မှန်းဆုံးသော ဦးတည်ချက်များ မဟုတ်ချေ — input variance ၏ 90% ကို ရှင်းပြသော component တစ်ခုသည် ရလဒ်တစ်ခုတိကျကို ခန့်မှန်းရန် အသုံးမဝင်သလောက်ပင် ဖြစ်နိုင်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does PCA lose "direct interpretability" even though it keeps most of the original information?', 'ပြန်မကြည့်ဘဲ: PCA သည် မူရင်းအချက်အလက်အများစုကို ထိန်းသိမ်းထားသော်လည်း ဘာကြောင့် "တိုက်ရိုက်နားလည်နိုင်မှု" ဆုံးရှုံးသလဲ?'),
        answer: blSame(
          "Each principal component is a linear blend (weighted sum) of ALL the original variables at once, not a single one of them — so a component's value doesn't map onto any one concrete, nameable real-world quantity the way an original raw feature (like \"real yields\") does.",
          'Principal component တစ်ခုစီသည် မူရင်း variable တစ်ခုတည်းမက အားလုံး တစ်ပြိုင်နက် linear ရောနှောမှု (weight ချထားသော ပေါင်းလဒ်) ဖြစ်သည် — ဒါကြောင့် component တစ်ခု၏ တန်ဖိုးသည် မူရင်း raw feature ("real yields" ကဲ့သို့) ကဲ့သို့ ခိုင်မာ၊ နာမည်ပေးနိုင်သော လက်တွေ့ကမ္ဘာ့ပမာဏ တစ်ခုတည်းသို့ မပြောင်းလဲပါ။'
        ),
      },
    },
  },

  arima: {
    spark: {
      analogy: bl(
        "Like predicting tomorrow's temperature mostly from today's and yesterday's, after first removing the overall warming trend — ARIMA predicts the next value from a weighted mix of recent past values and recent past errors.",
        'Combines AutoRegressive, Integrated (differencing), and Moving Average components; SARIMA adds seasonal terms.',
        'အလွန်ကြီးမားသော warming trend ကို ဦးစွာ ဖယ်ရှားပြီးနောက် မနက်ဖြန် အပူချိန်ကို ဒီနေ့နှင့် မနေ့ကတန်ဖိုးများမှ အများစု ခန့်မှန်းသကဲ့သို့ — ARIMA သည် လတ်တလော အတိတ်တန်ဖိုးများနှင့် အတိတ်အမှားများ၏ weight ပေါင်းစပ်မှုမှ နောက်တန်ဖိုးကို ခန့်မှန်းသည်။',
        'AutoRegressive, Integrated (differencing), Moving Average component များကို ပေါင်းစပ်သည်; SARIMA သည် seasonal term များ ထပ်ထည့်သည်။'
      ),
      predict: {
        question: blSame('Would ARIMA handle a sudden, permanent structural break (like a regime shift) well, or poorly, without being explicitly re-fit?', 'ARIMA သည် ရုတ်တရက်ဖြစ်ပေါ်သော၊ အမြဲတမ်း structural break (regime shift ကဲ့သို့) ကို ပြန်မ fit မလုပ်ဘဲ ကောင်းစွာ ကိုင်တွယ်နိုင်သလား၊ ညံ့ဖျင်းစွာလား?'),
        options: [blSame('Well', 'ကောင်းစွာ'), blSame('Poorly — it keeps extrapolating the old pattern', 'ညံ့ဖျင်းစွာ — ရှေးဟောင်း pattern ကို ဆက် extrapolate လုပ်နေသည်')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'gold', label: blSame('Gold Lab — the ARIMA lens', 'Gold Lab — ARIMA lens') },
    formalism: {
      worked: bl(
        'A simple AR(1) model: next_price = 4015 + 0.8×(today_price − 4015). If today is $4,050 (35 above the long-run level), tomorrow\'s forecast is 4015 + 0.8×35 = $4,043 — reverting most, but not all, of the way back.',
        'AR(p): yₜ = c + Σᵢφᵢyₜ₋ᵢ + εₜ; the differencing order d removes trend so the AR/MA structure applies to a stationary series; MA(q) additionally models εₜ as a function of past forecast errors.',
        'ရိုးရှင်းသော AR(1) model: next_price = 4015 + 0.8×(today_price − 4015)။ ဒီနေ့ $4,050 ဆိုပါစို့ (ရေရှည်အဆင့်ထက် 35 ပိုမြင့်), မနက်ဖြန် forecast သည် 4015 + 0.8×35 = $4,043 — အစတန်ဖိုးဆီသို့ အားလုံးမဟုတ်ဘဲ အများစု ပြန်ပြောင်းလဲသည်။',
        'AR(p): yₜ = c + Σᵢφᵢyₜ₋ᵢ + εₜ; differencing order d သည် trend ကို ဖယ်ထုတ်ပြီး AR/MA structure ကို stationary series တွင် အကျုံးဝင်စေသည်; MA(q) သည် εₜ ကို အတိတ် forecast error များ၏ function အဖြစ် ထပ်ပုံသေသည်။'
      ),
      faded: bl(
        'If φ₁ were exactly 0 in an AR(1) model, what would tomorrow\'s forecast reduce to? Step 1 — plug φ₁=0 into c + φ₁yₜ₋₁. Step 2 — answer: _____ (does today\'s value matter at all?)',
        'If φ₁ were exactly 0 in an AR(1) model, what would tomorrow\'s forecast reduce to? Step 1 — plug φ₁=0 into c + φ₁yₜ₋₁. Step 2 — answer: _____ (does today\'s value matter at all?)',
        'AR(1) model တွင် φ₁ သည် 0 အတိအကျဖြစ်ခဲ့လျှင် မနက်ဖြန် forecast သည် ဘာသို့ ကျဉ်းကျသွားမလဲ? အဆင့် ၁ — c + φ₁yₜ₋₁ ထဲ φ₁=0 ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____ (ဒီနေ့တန်ဖိုးက တစ်ခုခု အရေးကြီးသေးသလား?)',
        'AR(1) model တွင် φ₁ သည် 0 အတိအကျဖြစ်ခဲ့လျှင် မနက်ဖြန် forecast သည် ဘာသို့ ကျဉ်းကျသွားမလဲ? အဆင့် ၁ — c + φ₁yₜ₋₁ ထဲ φ₁=0 ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____ (ဒီနေ့တန်ဖိုးက တစ်ခုခု အရေးကြီးသေးသလား?)'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The temperature analogy is fairly close, but breaks down on \"why\" the model works: temperature genuinely has physical inertia. ARIMA's autoregressive structure is a purely statistical pattern-fit — it assumes the past-value relationship will hold going forward with no understanding of WHY gold prices are correlated day to day (unlike temperature's physical causes).",
        'အပူချိန် ဆင်တူပုံရိပ်သည် တော်တော်လေးနီးစပ်သော်လည်း model ဘာကြောင့် အလုပ်လုပ်သလဲဆိုသည့် "အကြောင်းရင်း" တွင် ပျက်စီးသည်: အပူချိန်တွင် ရုပ်ပိုင်းဆိုင်ရာ inertia တကယ်ရှိသည်။ ARIMA ၏ autoregressive structure သည် pure statistical pattern-fit တစ်ခုသာဖြစ်ပြီး — ရွှေဈေးများ နေ့စဉ် ဘာကြောင့် ဆက်စပ်နေသလဲဆိုသည် နားလည်မှုမရှိဘဲ အတိတ်တန်ဖိုး ဆက်နွယ်မှု ဆက်ဆောင်ရွက်လိမ့်မည်ဟု ယူဆထားသည် (အပူချိန်၏ ရုပ်ပိုင်းဆိုင်ရာ အကြောင်းရင်းများနှင့် မတူပါ)။'
      ),
      caveat: blSame(
        'A real caveat: choosing the (p,d,q) orders manually is genuinely time-consuming and somewhat subjective, even with statistical tools (ACF/PACF plots, information criteria) to guide the choice — there\'s no single automatic "correct" answer.',
        'တကယ့် caveat: (p,d,q) order များကို လက်ဖြင့် ရွေးချယ်ခြင်းသည် ရွေးချယ်မှုကို လမ်းညွှန်ရန် statistical tool (ACF/PACF plot, information criteria) ရှိသော်လည်း တကယ်ပင် အချိန်ကုန်ပြီး အနည်းငယ် subjective ဖြစ်သည် — automatic "မှန်ကန်သော" အဖြေတစ်ခုတည်း မရှိပါ။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is the "I" (Integrated/differencing) step necessary before fitting the AR and MA parts?', 'ပြန်မကြည့်ဘဲ: AR နှင့် MA အပိုင်းများကို fit မလုပ်မီ "I" (Integrated/differencing) အဆင့် ဘာကြောင့် လိုအပ်သလဲ?'),
        answer: blSame(
          "AR and MA structure assumes a stationary series (constant mean/variance over time) — a raw price series with a trend violates that assumption. Differencing (subtracting each value from the previous one) removes the trend, leaving a series the AR/MA math can validly be applied to.",
          'AR နှင့် MA structure သည် stationary series (အချိန်တစ်လျှောက် mean/variance ပုံသေ) ကို ယူဆထားသည် — trend ပါသော raw ဈေးနှုန်း series သည် ထိုယူဆချက်ကို ချိုးဖောက်သည်။ Differencing (တန်ဖိုးတစ်ခုစီကို ယခင်တန်ဖိုးမှ နှုတ်ခြင်း) သည် trend ကို ဖယ်ရှားပြီး AR/MA math ကို ခိုင်မာစွာ အကျုံးဝင်နိုင်သော series ကို ကျန်ခဲ့စေသည်။'
        ),
      },
    },
  },

  var: {
    spark: {
      analogy: bl(
        "Like predicting three friends' moods together, where each person's mood tomorrow depends on all three friends' moods today — not just their own — because they influence each other.",
        'Models each of n variables as a linear function of p lags of itself AND all other variables in the system, estimated jointly.',
        'သူငယ်ချင်း သုံးဦး၏ စိတ်ခံစားမှုကို အတူတကွ ခန့်မှန်းသကဲ့သို့၊ တစ်ဦးစီ၏ မနက်ဖြန်စိတ်ခံစားမှုသည် ၎င်းတို့ကိုယ်ပိုင် ဒီနေ့စိတ်ခံစားမှုတစ်ခုတည်းမက သူငယ်ချင်း သုံးဦးလုံး၏ ဒီနေ့စိတ်ခံစားမှုအပေါ်တည်သည် — အချင်းချင်း သက်ရောက်နေသောကြောင့်ဖြစ်သည်။',
        'System ထဲရှိ variable n ခုစီကို ၎င်းကိုယ်တိုင်နှင့် အခြားအားလုံး၏ lag p ခု၏ linear function အဖြစ် ပုံသေပြီး ပူးတွဲ ခန့်မှန်းသည်။'
      ),
      predict: {
        question: blSame('Could VAR capture a feedback loop where gold affects DXY AND DXY affects gold, both at once?', 'VAR သည် ရွှေက DXY ကို သက်ရောက်ပြီး DXY ကလည်း ရွှေကို တစ်ပြိုင်နက် သက်ရောက်သော feedback loop ကို ဖမ်းယူနိုင်သလား?'),
        options: [blSame('Yes, that\'s exactly what it\'s built for', 'ဟုတ်သည်၊ ဒါအတွက်ပင် ဒီဇိုင်းလုပ်ထားခြင်းဖြစ်သည်'), blSame('No, it can only model one-directional influence', 'မဟုတ်ပါ၊ တစ်ဖက်တည်းသော သက်ရောက်မှုကိုသာ ပုံသေနိုင်သည်')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you add more variables to the VAR system, does the number of parameters needing estimation rise linearly or faster?', 'VAR system ထဲသို့ variable ပိုများများ ထည့်လျှင် ခန့်မှန်းရမည့် parameter အရေအတွက် linear အနေဖြင့် တိုးမလား ပိုမြန်စွာ တိုးမလား?'), options: [blSame('Linearly', 'Linear အနေဖြင့်'), blSame('Much faster (quadratically)', 'ပိုမြန်စွာ (quadratic အနေဖြင့်)')], correctIndex: 1 },
      paramLabel: blSame('Number of variables in the VAR system', 'VAR system ထဲရှိ variable အရေအတွက်'),
      paramMin: 1, paramMax: 10, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => v * v * 2,
      outputLabel: blSame('Toy parameter count (per lag)', 'ဥပမာ parameter အရေအတွက် (lag တစ်ခုစီအတွက်)'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'A 2-variable VAR(1) for gold and DXY: gold_t = a₁·gold_{t-1} + a₂·DXY_{t-1}; DXY_t = b₁·gold_{t-1} + b₂·DXY_{t-1}. If a₂ is meaningfully negative, that\'s VAR quantifying "yesterday\'s stronger dollar predicts today\'s lower gold" — a feedback ARIMA (which only sees gold\'s own history) could never capture.',
        'yᵢ,ₜ = cᵢ + Σⱼ Σₗ φᵢⱼₗ yⱼ,ₜ₋ₗ + εᵢ,ₜ for each variable i; the full system has n×n×p coefficients (φ matrices), estimated jointly typically via OLS equation-by-equation.',
        'Gold နှင့် DXY အတွက် variable ၂ ခု VAR(1): gold_t = a₁·gold_{t-1} + a₂·DXY_{t-1}; DXY_t = b₁·gold_{t-1} + b₂·DXY_{t-1}။ a₂ သည် အဓိပ္ပာယ်ရှိစွာ negative ဖြစ်လျှင် ဒါက VAR က "မနေ့က ဒေါ်လာသန်မာမှုက ဒီနေ့ ရွှေနိမ့်ခြင်းကို ခန့်မှန်း" ကို ပမာဏချိန်ခြင်းဖြစ်သည် — ARIMA (ရွှေ၏ ကိုယ်ပိုင် history ကိုသာ မြင်) ဘယ်တော့မှ ဖမ်းယူနိုင်မည်မဟုတ်ပါ။',
        'yᵢ,ₜ = cᵢ + Σⱼ Σₗ φᵢⱼₗ yⱼ,ₜ₋ₗ + εᵢ,ₜ variable i တစ်ခုစီအတွက်; system အပြည့်အစုံသည် n×n×p coefficient (φ matrix) ရှိပြီး ပုံမှန်အားဖြင့် OLS equation-by-equation ဖြင့် ပူးတွဲခန့်မှန်းသည်။'
      ),
      faded: bl(
        'If gold and DXY had NO influence on each other at all (a₂=0 and b₁=0), what would the VAR system effectively reduce to? Step 1 — think about what\'s left in each equation. Step 2 — answer: _____.',
        'If gold and DXY had NO influence on each other at all (a₂=0 and b₁=0), what would the VAR system effectively reduce to? Step 1 — think about what\'s left in each equation. Step 2 — answer: _____.',
        'ရွှေနှင့် DXY သည် တစ်ခုနှင့်တစ်ခု လုံးဝ သက်ရောက်မှု (a₂=0, b₁=0) မရှိခဲ့လျှင် VAR system သည် တကယ်တမ်း ဘာသို့ ကျဉ်းကျသွားမလဲ? အဆင့် ၁ — equation တစ်ခုစီတွင် ဘာကျန်နေမလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'ရွှေနှင့် DXY သည် တစ်ခုနှင့်တစ်ခု လုံးဝ သက်ရောက်မှု (a₂=0, b₁=0) မရှိခဲ့လျှင် VAR system သည် တကယ်တမ်း ဘာသို့ ကျဉ်းကျသွားမလဲ? အဆင့် ၁ — equation တစ်ခုစီတွင် ဘာကျန်နေမလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The three-friends analogy breaks down on causation vs. correlation: VAR quantifies statistical predictive relationships between the mood series, not genuine causal influence — one friend's mood \"predicting\" another's could be both reacting to a shared outside event (the exact confounder trap Module 10 covers), not one causing the other.",
        'သူငယ်ချင်းသုံးဦး ဆင်တူပုံရိပ်သည် causation vs. correlation တွင် ပျက်စီးသည်: VAR သည် mood series များကြား statistical predictive ဆက်နွယ်မှုကို ပမာဏချိန်သည်၊ တကယ့် causal သက်ရောက်မှု မဟုတ်ပါ — သူငယ်ချင်းတစ်ဦး၏ mood က တစ်ဦး၏ "ခန့်မှန်း" နိုင်ခြင်းသည် အပြင်ဘက်ကမျှဝေထားသော event (Module 10 ဖော်ပြသော confounder trap အတိအကျ) ကို နှစ်ဦးစလုံး တုံ့ပြန်နေခြင်းသာ ဖြစ်နိုင်ပြီး တစ်ဦးက တစ်ဦးကို ဖြစ်စေခြင်း မဟုတ်ပါ။'
      ),
      caveat: blSame(
        'A real caveat: VAR\'s parameter count grows with the square of the number of variables (n² per lag) — adding just a few more series to the system can quickly demand more data than is realistically available, the "curse of dimensionality" the doc names directly.',
        'တကယ့် caveat: VAR ၏ parameter အရေအတွက်သည် variable အရေအတွက်၏ square (lag တစ်ခုစီအတွက် n²) နှင့်အတူ ကြီးထွားသည် — system ထဲသို့ series အနည်းငယ်ထပ်ထည့်ရုံဖြင့် လက်တွေ့တွင် ရရှိနိုင်သည်ထက် ဒေတာ ပိုလိုအပ်လာနိုင်သည်၊ doc က တိုက်ရိုက် ဖော်ပြထားသော "curse of dimensionality" ပင်ဖြစ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does VAR need every included series to be stationary, just like ARIMA does?', 'ပြန်မကြည့်ဘဲ: VAR သည် ARIMA ကဲ့သို့ပင် ပါဝင်သော series တိုင်းကို ဘာကြောင့် stationary ဖြစ်ရန် လိုအပ်သလဲ?'),
        answer: blSame(
          "VAR is built from the same linear-regression-on-lags machinery as ARIMA, applied jointly across variables — the statistical guarantees behind OLS estimation (stable coefficients, valid standard errors) rely on the same stationarity assumption regardless of whether one series or several are involved.",
          'VAR သည် ARIMA နှင့် တူညီသော linear-regression-on-lags စက်ကိရိယာကို variable များတစ်လျှောက် ပူးတွဲ အသုံးချထားသည် — OLS ခန့်မှန်းချက်နောက်ကွယ်ရှိ statistical အာမခံချက်များ (တည်ငြိမ်သော coefficient, ခိုင်မာသော standard error) သည် series တစ်ခု (သို့) များစွာပါဝင်သည်ဖြစ်စေ တူညီသော stationarity ယူဆချက်ပေါ် မှီခိုသည်။'
        ),
      },
    },
  },

  garch: {
    spark: {
      analogy: bl(
        'Like knowing that a calm ocean tends to stay calm and a stormy ocean tends to stay stormy — GARCH doesn\'t predict the next wave\'s height directly, it predicts how WILD the waves are likely to be right now.',
        'Models conditional variance itself as time-varying, capturing volatility clustering — calm periods stay calm, turbulent periods stay turbulent.',
        'တည်ငြိမ်သော ပင်လယ်သည် တည်ငြိမ်ဆဲရှိတတ်ပြီး မုန်တိုင်းကြီးသော ပင်လယ်သည် မုန်တိုင်းကြီးဆဲရှိတတ်ကြောင်း သိထားသကဲ့သို့ — GARCH သည် နောက်လှိုင်း၏ အမြင့်ကို တိုက်ရိုက်ခန့်မှန်းသည် မဟုတ်ဘဲ ယခုလှိုင်းများ ဘယ်လောက် ရမ်းကားနိုင်လဲ ဆိုသည်ကို ခန့်မှန်းသည်။',
        'Conditional variance ကိုယ်တိုင်ကို အချိန်နှင့်အမျှ ပြောင်းလဲသည်ဟု ပုံသေသည်၊ volatility clustering ကို ဖမ်းယူသည် — အေးဆေးသောကာလများ အေးဆေးဆဲရှိပြီး ဒွန်တွန်းသောကာလများ ဒွန်တွန်းဆဲရှိသည်။'
      ),
      predict: {
        question: blSame('After an unusually large price swing yesterday, does GARCH predict today\'s volatility to be higher or lower than normal?', 'မနေ့က ဈေးနှုန်း ပုံမှန်မဟုတ်စွာ ကြီးမားစွာ ရွေ့လျားပြီးနောက် GARCH သည် ဒီနေ့ volatility ကို ပုံမှန်ထက် မြင့်မလား နိမ့်မလား ဟု ခန့်မှန်းသလဲ?'),
        options: [blSame('Higher', 'ပိုမြင့်သည်'), blSame('Lower', 'ပိုနိမ့်သည်')],
        correctIndex: 0,
      },
    },
    mechanism: { kind: 'live-link', module: 'gold', label: blSame('Gold Lab — the GARCH volatility overlay', 'Gold Lab — GARCH volatility overlay') },
    formalism: {
      worked: bl(
        'σ²ₜ = 0.02 + 0.15·ε²ₜ₋₁ + 0.8·σ²ₜ₋₁. If yesterday\'s shock ε was unusually large (ε²=4) and yesterday\'s variance σ²ₜ₋₁ was 1, today\'s variance forecast: 0.02+0.15(4)+0.8(1)=1.42 — noticeably higher than yesterday\'s 1, exactly the "shock raises expected turbulence" behavior.',
        'σ²ₜ = ω + α·ε²ₜ₋₁ + β·σ²ₜ₋₁ (GARCH(1,1)); stationarity requires α+β<1, and β close to 1 (as is typical for financial series) means volatility shocks decay slowly, i.e. real persistence.',
        'σ²ₜ = 0.02 + 0.15·ε²ₜ₋₁ + 0.8·σ²ₜ₋₁။ မနေ့ shock ε သည် ပုံမှန်မဟုတ်စွာ ကြီးမားလျှင် (ε²=4) မနေ့ variance σ²ₜ₋₁ သည် 1 ဖြစ်ခဲ့ရင် ဒီနေ့ variance forecast: 0.02+0.15(4)+0.8(1)=1.42 — မနေ့ 1 ထက် သိသိသာသာ ပိုမြင့်ပြီး "shock က မျှော်လင့်ထားသော ဒွန်တွန်းမှုကို မြှင့်တင်" အပြုအမူ အတိအကျဖြစ်သည်။',
        'σ²ₜ = ω + α·ε²ₜ₋₁ + β·σ²ₜ₋₁ (GARCH(1,1)); stationarity အတွက် α+β<1 လိုအပ်ပြီး β သည် 1 အနီး (ဘဏ္ဍာရေး series များအတွက် ပုံမှန်) ဖြစ်လျှင် volatility shock များ ဖြည်းညင်းစွာ decay ဖြစ်သည်၊ တကယ့် persistence ဖြစ်သည်။'
      ),
      faded: bl(
        'If α+β were exactly 1 (borderline non-stationary), would a large shock\'s effect on volatility eventually fade away, or persist forever? Step 1 — think about what α+β<1 vs =1 means for decay. Step 2 — answer: _____.',
        'If α+β were exactly 1 (borderline non-stationary), would a large shock\'s effect on volatility eventually fade away, or persist forever? Step 1 — think about what α+β<1 vs =1 means for decay. Step 2 — answer: _____.',
        'α+β သည် 1 အတိအကျဖြစ်ခဲ့လျှင် (borderline non-stationary), shock ကြီးတစ်ခု၏ volatility အပေါ်သက်ရောက်မှုသည် နောက်ဆုံးတွင် ပျောက်ကွယ်သွားမလား၊ ထာဝရဆက်ရှိမလား? အဆင့် ၁ — α+β<1 vs =1 က decay အတွက် ဘာကို ဆိုလိုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'α+β သည် 1 အတိအကျဖြစ်ခဲ့လျှင် (borderline non-stationary), shock ကြီးတစ်ခု၏ volatility အပေါ်သက်ရောက်မှုသည် နောက်ဆုံးတွင် ပျောက်ကွယ်သွားမလား၊ ထာဝရဆက်ရှိမလား? အဆင့် ၁ — α+β<1 vs =1 က decay အတွက် ဘာကို ဆိုလိုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'exactness',
      analogyBreakdown: blSame(
        "The ocean analogy is close, but understates GARCH's actual output: the sea-calmness analogy suggests a rough qualitative sense of \"calm\" vs \"stormy.\" GARCH gives an exact numeric variance forecast — precise enough to feed directly into a formal, quantitative confidence interval on tomorrow's price, not just a vibe.",
        'ပင်လယ် ဆင်တူပုံရိပ်သည် နီးစပ်သော်လည်း GARCH ၏ တကယ့် output ကို လျှော့တွက်ထားသည်: ပင်လယ်အေးဆေးမှု ဆင်တူပုံရိပ်သည် "အေးဆေး" vs "မုန်တိုင်းကြီး" ၏ ကြမ်းအားဖြင့် အရည်အသွေးအာရုံကို ညွှန်ပြသည်။ GARCH သည် အတိအကျ ဂဏန်း variance forecast ကို ပေးသည် — မနက်ဖြန် ဈေးနှုန်းပေါ်ရှိ formal, quantitative confidence interval ထဲသို့ တိုက်ရိုက် ကျွေးနိုင်လောက်အောင် တိကျပြီး vibe တစ်ခုတည်း မဟုတ်ပါ။'
      ),
      caveat: blSame(
        'A real caveat: choosing the estimation window is genuinely contested — too long dilutes the current regime with stale data, too short makes the variance estimate itself noisy, and there\'s no single agreed-upon "right" window length.',
        'တကယ့် caveat: estimation window ရွေးချယ်ခြင်းသည် တကယ်ပင် အငြင်းပွားဖွယ်ရှိသည် — ရှည်လွန်းလျှင် လက်ရှိ regime ကို ဟောင်းနွမ်းသော data ဖြင့် ပါးလွယ်စေပြီး တိုလွန်းလျှင် variance ခန့်မှန်းချက်ကိုယ်တိုင် noisy ဖြစ်စေသည်၊ သဘောတူညီထားသော "မှန်ကန်သော" window အရှည် တစ်ခုတည်း မရှိပါ။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does GARCH "improve confidence-interval realism" compared to a model that assumes constant volatility?', 'ပြန်မကြည့်ဘဲ: GARCH သည် volatility ပုံသေဟု ယူဆထားသော model နှင့် နှိုင်းယှဉ်လျှင် ဘာကြောင့် "confidence-interval အစစ်ဆန်မှု" ကို တိုးတက်စေသလဲ?'),
        answer: blSame(
          "A constant-volatility model gives the same-width interval every single day regardless of recent turbulence, which is unrealistically overconfident right after a big shock and unrealistically wide during genuinely calm periods. GARCH's interval width breathes with actual recent volatility, narrow when calm, wide right after a shock.",
          'Volatility ပုံသေဖြစ်သော model သည် နောက်ဆုံးဒွန်တွန်းမှုမည်သို့ရှိစေ တစ်နေ့တိုင်း interval အကျယ်တူတူပေးသည်၊ ဒါက shock ကြီးတစ်ခုနောက်ပိုင်း လက်တွေ့မကျအောင် ယုံကြည်လွန်းပြီး တကယ့် အေးဆေးသော ကာလများအတွင်း လက်တွေ့မကျအောင် ကျယ်ပြန့်သည်။ GARCH ၏ interval ကျယ်ပြန့်မှုသည် တကယ့် လတ်တလော volatility နှင့်အတူ အသက်ရှူသည်၊ အေးဆေးလျှင် ကျဉ်း၊ shock တစ်ခုနောက်ပိုင်း ကျယ်ကျယ်ဖြစ်သည်။'
        ),
      },
    },
  },

  expsmooth: {
    spark: {
      analogy: bl(
        "Like a rumor spreading through a crowd, where the most recent thing you heard matters much more than something from a week ago — exponential smoothing weights recent observations more heavily, with weight fading gradually into the past.",
        'Forecasts as a smoothly-weighted average of past values, weights decaying exponentially into the past, extended with trend and seasonal components.',
        'လူအုပ်တစ်ခုတစ်လျှောက် ပျံ့နှံ့နေသော ကောလာဟလတစ်ခုသကဲ့သို့၊ သင်ကြားသိရသော နောက်ဆုံးအရာသည် တစ်ပတ်ကလွန်ခဲ့သောအရာထက် ပိုအရေးကြီးသည် — exponential smoothing သည် လတ်တလော တွေ့ရှိချက်များကို ပိုအလေးထားပြီး weight သည် အတိတ်ဘက်သို့ တဖြည်းဖြည်း ဖျောက်သွားသည်။',
        'Trend နှင့် seasonal component များဖြင့် ချဲ့ထွင်ထားသော၊ weight များသည် အတိတ်ဘက်သို့ exponentially decay ဖြစ်သော အတိတ်တန်ဖိုးများ၏ ချောမွေ့စွာ weight ချထားသော ပျမ်းမျှအဖြစ် ခန့်မှန်းသည်။'
      ),
      predict: {
        question: blSame('If the smoothing parameter α is set close to 1 (almost all weight on the most recent value), does the forecast react to new data quickly or slowly?', 'Smoothing parameter α ကို 1 အနီး (weight အများစု လတ်တလောတန်ဖိုးပေါ်) သတ်မှတ်လျှင် forecast သည် data အသစ်ကို လျင်မြန်စွာ (သို့) နှေးကွေးစွာ တုံ့ပြန်သလဲ?'),
        options: [blSame('Quickly', 'လျင်မြန်စွာ'), blSame('Slowly', 'နှေးကွေးစွာ')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase α toward 1, does the forecast track the most recent observation more closely or less closely?', 'α ကို 1 ဆီသို့ တိုးလျှင် forecast သည် လတ်တလော ဖတ်ချက်ကို ပိုနီးကပ်စွာ (သို့) ပိုမနီးကပ်စွာ ခြေရာခံသလဲ?'), options: [blSame('More closely', 'ပိုနီးကပ်စွာ'), blSame('Less closely', 'ပိုမနီးကပ်စွာ')], correctIndex: 0 },
      paramLabel: blSame('α (smoothing weight on most recent value)', 'α (လတ်တလောတန်ဖိုးပေါ်ရှိ smoothing weight)'),
      paramMin: 0.05, paramMax: 0.95, paramDefault: 0.3, paramStep: 0.05, paramDecimals: 2,
      compute: (v) => v * 100,
      outputLabel: blSame('% weight on most recent observation', 'လတ်တလောဖတ်ချက်ပေါ်ရှိ weight %'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Level update: Lₜ = α·yₜ + (1-α)·Lₜ₋₁. With α=0.3, yesterday\'s level estimate L=100, today\'s observation y=120: new level = 0.3(120)+0.7(100)=106 — moved toward the new observation, but didn\'t jump all the way to it.',
        'Simple exponential smoothing: forecast ŷₜ₊₁=Lₜ=αyₜ+(1-α)Lₜ₋₁=Σᵢα(1-α)ⁱyₜ₋ᵢ — an infinite weighted sum where weights decay geometrically, so it\'s mathematically equivalent to a specific ARIMA(0,1,1).',
        'Level update: Lₜ = α·yₜ + (1-α)·Lₜ₋₁။ α=0.3, မနေ့ level ခန့်မှန်းချက် L=100, ဒီနေ့ ဖတ်ချက် y=120 ဖြင့်: level အသစ် = 0.3(120)+0.7(100)=106 — ဖတ်ချက်အသစ်ဆီသို့ ရွှေ့သွားသော်လည်း တစ်ခါတည်း အလုံးစုံ မရောက်ပါ။',
        'Simple exponential smoothing: forecast ŷₜ₊₁=Lₜ=αyₜ+(1-α)Lₜ₋₁=Σᵢα(1-α)ⁱyₜ₋ᵢ — weight များ geometrically decay ဖြစ်သော အဆုံးမရှိ weight ပေါင်းလဒ်တစ်ခုဖြစ်ပြီး ANOVA(0,1,1) ANOVA(0,1,1) တစ်ခုအတိအကျနှင့် math အရ ညီမျှသည်။'
      ),
      faded: bl(
        'If α=1 exactly, what would the forecast for tomorrow simply equal? Step 1 — plug α=1 into Lₜ=αyₜ+(1-α)Lₜ₋₁. Step 2 — answer: _____.',
        'If α=1 exactly, what would the forecast for tomorrow simply equal? Step 1 — plug α=1 into Lₜ=αyₜ+(1-α)Lₜ₋₁. Step 2 — answer: _____.',
        'α=1 အတိအကျဖြစ်ခဲ့လျှင် မနက်ဖြန် forecast သည် ရိုးရိုး ဘာနှင့် ညီမျှမလဲ? အဆင့် ၁ — Lₜ=αyₜ+(1-α)Lₜ₋₁ ထဲ α=1 ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'α=1 အတိအကျဖြစ်ခဲ့လျှင် မနက်ဖြန် forecast သည် ရိုးရိုး ဘာနှင့် ညီမျှမလဲ? အဆင့် ၁ — Lₜ=αyₜ+(1-α)Lₜ₋₁ ထဲ α=1 ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The rumor-spreading analogy breaks down on memory span: a real rumor eventually gets completely forgotten (old versions truly vanish). Exponential smoothing's weights never technically reach zero — every past observation, no matter how old, still carries a tiny nonzero weight forever, just an extremely small one.",
        'ကောလာဟလ ပျံ့နှံ့ခြင်း ဆင်တူပုံရိပ်သည် မှတ်ဉာဏ် ကာလတွင် ပျက်စီးသည်: စစ်မှန်သော ကောလာဟလသည် နောက်ဆုံးတွင် လုံးဝ မေ့ပျောက်သွားသည် (version ဟောင်းများ တကယ်ပျောက်ကွယ်သွားသည်)။ Exponential smoothing ၏ weight များသည် technically ဘယ်တော့မှ သုညသို့ မရောက်ပါ — မည်မျှဟောင်းနွမ်းပါစေ အတိတ်ဖတ်ချက်တိုင်းသည် ထာဝရ nonzero weight သေးသေးလေးတစ်ခု ဆက်ဆောင်ရွက်နေသည်။'
      ),
      caveat: blSame(
        'A real caveat: exponential smoothing is genuinely weaker with irregular shocks or structural change — its trend/seasonal components assume the underlying pattern is stable enough to keep smoothly extrapolating, which breaks down exactly when a real regime shift happens.',
        'တကယ့် caveat: exponential smoothing သည် ပုံမှန်မဟုတ်သော shock (သို့) structural change များတွင် တကယ်ပင် အားနည်းသည် — ၎င်း၏ trend/seasonal component များသည် underlying pattern သည် ချောမွေ့စွာ ဆက် extrapolate ပြုနိုင်လောက်အောင် တည်ငြိမ်သည်ဟု ယူဆထားပြီး တကယ့် regime shift ဖြစ်သောအခါ ပျက်စီးသည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is exponential smoothing described as "very fast" compared to ARIMA?', 'ပြန်မကြည့်ဘဲ: exponential smoothing သည် ARIMA နှင့်နှိုင်းယှဉ်လျှင် ဘာကြောင့် "အလွန်မြန်ဆန်" ဟု ဖော်ပြသလဲ?'),
        answer: blSame(
          "Its recursive update rule needs only the previous forecast state and the new observation — a handful of simple arithmetic operations per step — with no need for iterative optimization, differencing-order selection, or matrix computations the way fitting an ARIMA model requires.",
          'ARIMA model fit ခြင်းက လိုအပ်သကဲ့သို့ iterative optimization, differencing-order ရွေးချယ်ခြင်း, (သို့) matrix တွက်ချက်မှု မလိုအပ်ဘဲ ၎င်း၏ recursive update rule သည် ယခင် forecast state နှင့် ဖတ်ချက်အသစ်ကိုသာ လိုအပ်ပြီး — အဆင့်တစ်ခုစီအတွက် ရိုးရှင်းသော arithmetic operation အနည်းငယ်သာဖြစ်သည်။'
        ),
      },
    },
  },

  prophet: {
    spark: {
      analogy: bl(
        "Like planning a retail budget by separately estimating \"the overall growth trend,\" \"the usual December spike,\" and \"the Black Friday bump,\" then adding all three together — Prophet decomposes a series into named, separately-fit pieces.",
        'Additive decomposition into trend, seasonality, and holiday effects, each fit somewhat independently, then summed.',
        'လက်လီစီးပွားရေး budget တစ်ခုကို "အလုံးစုံ ဖွံ့ဖြိုးတိုးတက်မှု trend," "ပုံမှန် ဒီဇင်ဘာလ ခုန်တက်မှု," "Black Friday ခုန်တက်မှု" ကို သီးခြားစီ ခန့်မှန်းပြီး သုံးခုလုံးကို ပေါင်းခြင်းသကဲ့သို့ — Prophet သည် series တစ်ခုကို နာမည်ပေးထားသော၊ သီးခြားစီ fit လုပ်ထားသော အပိုင်းများအဖြစ် ခွဲခြမ်းသည်။',
        'Trend, seasonality, holiday effect များအဖြစ် ခွဲခြမ်းထားပြီး တစ်ခုစီကို အနည်းငယ် လွတ်လပ်စွာ fit လုပ်ပြီး ပေါင်းစည်းသည်။'
      ),
      predict: {
        question: blSame('Given that Prophet is optimized for ease of use and handling messy/sparse data gracefully, would you expect it to usually beat XGBoost/LSTM on raw accuracy for gold forecasting?', 'Prophet သည် အသုံးပြုရလွယ်ကူမှုနှင့် ရှုပ်ထွေး/ကွက်လပ်ရှိသော data ကို ချောမွေ့စွာ ကိုင်တွယ်ခြင်းအတွက် optimize ပြုထားသည်ဖြစ်ရာ ရွှေခန့်မှန်းချက်တွင် raw accuracy ပေါ် XGBoost/LSTM ကို ပုံမှန်အနိုင်ယူလိမ့်မည်ဟု မျှော်လင့်ပါသလား?'),
        options: [blSame('Yes, usually', 'ဟုတ်သည်၊ ပုံမှန်'), blSame('No — the research consistently finds it less accurate', 'မဟုတ်ပါ — သုတေသနက ၎င်းကို တိကျမှု နည်းသည်ဟု စဉ်ဆက်မပြတ် တွေ့ရှိသည်')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you add a strong holiday effect to a series, does Prophet\'s forecast around that date spike more sharply or stay smooth?', 'Series တစ်ခုသို့ ခိုင်မာသော ရုံးပိတ်ရက်သက်ရောက်မှု ထည့်လျှင် Prophet ၏ ထို့ ရက်ပတ်ဝန်းကျင် forecast သည် ပိုပြင်းထန်စွာ ခုန်တက်မလား ချောမွေ့ဆဲ ရှိမလား?'), options: [blSame('Spikes more sharply', 'ပိုပြင်းထန်စွာ ခုန်တက်သည်'), blSame('Stays smooth', 'ချောမွေ့ဆဲ ရှိသည်')], correctIndex: 0 },
      paramLabel: blSame('Holiday effect strength', 'ရုံးပိတ်ရက် သက်ရောက်မှုအား'),
      paramMin: 0, paramMax: 10, paramDefault: 0, paramStep: 1, paramDecimals: 0,
      compute: (v) => v * 8,
      outputLabel: blSame('Toy forecast spike on holiday (%)', 'ရုံးပိတ်ရက်ပေါ်ရှိ ဥပမာ forecast ခုန်တက်မှု (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'y(t) = g(t)+s(t)+h(t): a gentle upward trend g(t) contributes +2/day, weekly seasonality s(t) contributes +5 on Fridays, and a holiday indicator h(t) adds +20 on a specific tagged date. On that holiday: total = trend_value + 5 + 20 — each piece\'s contribution is visible and separable.',
        'g(t) is piecewise-linear or logistic; s(t) uses a truncated Fourier series Σₙ(aₙcos(2πnt/P)+bₙsin(2πnt/P)) for period P; the full model is fit via MAP estimation (Bayesian point estimate) in Stan.',
        'y(t) = g(t)+s(t)+h(t): ညင်သာသော အထက်ဘက် trend g(t) သည် တစ်နေ့ +2 contribute ပြု၊ အပတ်စဉ် seasonality s(t) သည် သောကြာနေ့တွင် +5 contribute ပြု၊ ရုံးပိတ်ရက် indicator h(t) သည် tag တပ်ထားသော ရက်တစ်ရက်တွင် +20 ထပ်ထည့်သည်။ ထိုရုံးပိတ်ရက်တွင်: စုစုပေါင်း = trend_value + 5 + 20 — အပိုင်းတစ်ခုစီ၏ contribution ကို မြင်နိုင်ပြီး ခွဲခြားနိုင်သည်။',
        'g(t) သည် piecewise-linear သို့ logistic ဖြစ်ပြီး; s(t) သည် period P အတွက် truncated Fourier series Σₙ(aₙcos(2πnt/P)+bₙsin(2πnt/P)) သုံးသည်; model အပြည့်အစုံကို Stan တွင် MAP estimation (Bayesian point estimate) ဖြင့် fit လုပ်သည်။'
      ),
      faded: bl(
        'On a normal (non-holiday, non-Friday) day, which of the three components (g, s, h) would contribute essentially nothing? Step 1 — think about what triggers each component. Step 2 — answer: _____.',
        'On a normal (non-holiday, non-Friday) day, which of the three components (g, s, h) would contribute essentially nothing? Step 1 — think about what triggers each component. Step 2 — answer: _____.',
        'ပုံမှန်ရက် (ရုံးပိတ်ရက်/သောကြာနေ့ မဟုတ်) တွင် component သုံးခု (g, s, h) အနက် ဘယ်ဟာက ဘာမှမပါဝင်နီးပါးဖြစ်မလဲ? အဆင့် ၁ — component တစ်ခုစီကို ဘာက trigger ပြုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'ပုံမှန်ရက် (ရုံးပိတ်ရက်/သောကြာနေ့ မဟုတ်) တွင် component သုံးခု (g, s, h) အနက် ဘယ်ဟာက ဘာမှမပါဝင်နီးပါးဖြစ်မလဲ? အဆင့် ၁ — component တစ်ခုစီကို ဘာက trigger ပြုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The separate-budget-lines analogy is genuinely accurate for Prophet's structure, but breaks down on flexibility: a human budget planner can spot an entirely new pattern (a surprise trend break) and add a line item for it immediately. Prophet's trend component only bends at pre-specified or automatically-detected \"changepoints\" — it doesn't notice a brand-new kind of pattern the way a person would.",
        'သီးခြား budget line ဆင်တူပုံရိပ်သည် Prophet ၏ structure အတွက် တကယ်တိကျသော်လည်း လိုက်လျောညီထွေမှုတွင် ပျက်စီးသည်: လူသား budget စီစဉ်သူတစ်ဦးသည် လုံးဝ pattern အသစ်တစ်ခု (မမျှော်လင့်ထားသော trend break) ကို တွေ့ရှိပြီး immediately line item ထည့်နိုင်သည်။ Prophet ၏ trend component သည် ကြိုတင်သတ်မှတ်ထားသော (သို့) အလိုအလျောက် တွေ့ရှိထားသော "changepoint" များတွင်သာ ကွေးလိမ်ပြီး လူတစ်ဦးကဲ့သို့ pattern အသစ်တစ်ခုလုံးကို မသတိမပြုမိပါ။'
      ),
      caveat: blSame(
        'A real caveat: Prophet\'s ease-of-use is a real design tradeoff, not a free lunch — the comparative research consistently finds it less accurate than ARIMA/LSTM/XGBoost, particularly struggling with short-term fluctuations its smooth decomposition isn\'t built to capture.',
        'တကယ့် caveat: Prophet ၏ အသုံးပြုရလွယ်ကူမှုသည် တကယ့် ဒီဇိုင်း trade-off တစ်ခုဖြစ်ပြီး အခမဲ့ မဟုတ်ပါ — နှိုင်းယှဉ်သုတေသနက ၎င်းကို ARIMA/LSTM/XGBoost ထက် တိကျမှုနည်းသည်ဟု စဉ်ဆက်မပြတ် တွေ့ရှိသည်၊ အထူးသဖြင့် ၎င်း၏ ချောမွေ့သော decomposition ဖမ်းယူရန် ဒီဇိုင်းမလုပ်ထားသော short-term အတက်အကျများတွင် အခက်တွေ့သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is Prophet described as good for "non-expert users" specifically?', 'ပြန်မကြည့်ဘဲ: Prophet သည် ဘာကြောင့် "ကျွမ်းကျင်သူမဟုတ်သူများ" အတွက် ကောင်းသည်ဟု အထူးဖော်ပြသလဲ?'),
        answer: blSame(
          "Its decomposed structure (trend + seasonality + holidays) maps onto concepts a non-statistician already intuitively understands, and it has sensible automatic defaults for changepoints and seasonality — unlike ARIMA, which requires understanding stationarity and manually selecting (p,d,q) orders to get a good fit.",
          '၎င်း၏ ခွဲခြမ်းထားသော structure (trend + seasonality + holidays) သည် statistician မဟုတ်သူတစ်ဦး ရှေးဦးစွာ instinct ဖြင့် နားလည်ပြီးသား concept များနှင့် ကိုက်ညီပြီး changepoint နှင့် seasonality အတွက် သင့်လျော်သော automatic default များရှိသည် — stationarity နားလည်ရန်နှင့် fit ကောင်းစွာရရန် (p,d,q) order များကို လက်ဖြင့်ရွေးချယ်ရန် လိုအပ်သော ARIMA နှင့် မတူပါ။'
        ),
      },
    },
  },

  hybrid: {
    spark: {
      analogy: bl(
        "Like a senior editor who first fixes the obvious grammar in a draft, then hands it to a specialist to catch the subtle stylistic issues the grammar-fixer missed — ARIMA catches the obvious trend, ML catches what's subtly left over.",
        'Fits a classical model first, then trains an ML model on its residuals, combining linear-trend strength with nonlinear pattern-capture.',
        'အထက်တန်း အယ်ဒီတာတစ်ဦးက draft တစ်ခုရှိ ထင်ရှားသော သဒ္ဒါအမှားများကို ဦးစွာပြင်ပြီး၊ grammar-fixer လွတ်သွားခဲ့သော သိမ်မွေ့သော ပုံစံ ပြဿနာများကို ဖမ်းယူမည့် ကျွမ်းကျင်သူတစ်ဦးထံ လွှဲပေးသကဲ့သို့ — ARIMA က ထင်ရှားသော trend ကို ဖမ်းယူပြီး ML က သိမ်မွေ့စွာ ကျန်ခဲ့သောအရာကို ဖမ်းယူသည်။',
        'Classical model ကို ဦးစွာ fit လုပ်ပြီး ၎င်း၏ residual များပေါ်တွင် ML model ကို train လုပ်သည်၊ linear-trend အားသာချက်ကို nonlinear pattern ဖမ်းယူနိုင်စွမ်းနှင့် ပေါင်းစပ်သည်။'
      ),
      predict: {
        question: blSame('If ARIMA already captured 100% of the pattern in a series (zero residual error), would the ML residual model have anything left to learn?', 'ARIMA သည် series တစ်ခုရှိ pattern ၏ 100% ကို ဖမ်းယူပြီးသား (residual error သုည) ဖြစ်ခဲ့လျှင် ML residual model တွင် သင်ယူစရာ တစ်ခုခု ကျန်နေသေးသလား?'),
        options: [blSame('Yes, always more to find', 'ဟုတ်သည်၊ ရှာစရာ ပိုများတိုင်း ကျန်နေသည်'), blSame('No — nothing meaningful left to fit', 'မဟုတ်ပါ — fit ရန် အဓိပ္ပာယ်ရှိသော အရာ ဘာမှမကျန်')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'gold', label: blSame('Gold Lab — compare the ARIMA and XGBoost lenses side by side', 'Gold Lab — ARIMA နှင့် XGBoost lens များကို ယှဉ်တွဲကြည့်ပါ') },
    formalism: {
      worked: bl(
        'ARIMA forecasts gold at $4,015 for tomorrow. Its historical residuals (actual minus ARIMA-predicted) show a pattern XGBoost detects: residuals tend to be +$25 whenever geopolitical risk spiked recently, something ARIMA structurally can\'t see. Final hybrid forecast: $4,015 + $25 = $4,040.',
        'ŷ_hybrid = ŷ_ARIMA + ŷ_ML(residual features), where ŷ_ML is trained on {features, εₜ=yₜ-ŷ_ARIMA,ₜ} pairs — the ML model\'s entire job is explaining what\'s systematically left over after the linear structure is removed.',
        'ARIMA သည် မနက်ဖြန် ရွှေကို $4,015 ဟု ခန့်မှန်းသည်။ ၎င်း၏ သမိုင်းဝင် residual များ (တကယ့်ရလဒ် အနုတ် ARIMA-ခန့်မှန်းချက်) သည် XGBoost က ရှာတွေ့သော pattern တစ်ခုကို ပြသသည်: geopolitical risk လတ်တလော ခုန်တက်သည့်အခါတိုင်း residual များသည် +$25 ရှိတတ်သည်၊ ARIMA က structurally မမြင်နိုင်သောအရာ။ Hybrid နောက်ဆုံးခန့်မှန်းချက်: $4,015 + $25 = $4,040။',
        'ŷ_hybrid = ŷ_ARIMA + ŷ_ML(residual feature), ŷ_ML သည် {feature, εₜ=yₜ-ŷ_ARIMA,ₜ} pair များပေါ်တွင် train ထားသည် — ML model ၏ အလုပ်တစ်ခုလုံးသည် linear structure ဖယ်ရှားပြီးနောက် systematically ကျန်ရစ်သောအရာကို ရှင်းပြခြင်းဖြစ်သည်။'
      ),
      faded: bl(
        'If ARIMA\'s residuals were pure random noise with no pattern at all, would training an ML model on them improve the final forecast? Step 1 — think about what an ML model can learn from pure noise. Step 2 — answer: _____.',
        'If ARIMA\'s residuals were pure random noise with no pattern at all, would training an ML model on them improve the final forecast? Step 1 — think about what an ML model can learn from pure noise. Step 2 — answer: _____.',
        'ARIMA ၏ residual များသည် pattern လုံးဝမရှိသော pure random noise ဖြစ်ခဲ့လျှင် ၎င်းတို့ပေါ်တွင် ML model train လုပ်ခြင်းက နောက်ဆုံး forecast ကို တိုးတက်စေမလား? အဆင့် ၁ — ML model တစ်ခုသည် pure noise မှ ဘာသင်ယူနိုင်သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'ARIMA ၏ residual များသည် pattern လုံးဝမရှိသော pure random noise ဖြစ်ခဲ့လျှင် ၎င်းတို့ပေါ်တွင် ML model train လုပ်ခြင်းက နောက်ဆုံး forecast ကို တိုးတက်စေမလား? အဆင့် ၁ — ML model တစ်ခုသည် pure noise မှ ဘာသင်ယူနိုင်သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The editor-then-specialist analogy breaks down on independence: a human specialist reviewing a draft can flag that the grammar-fixer actually made a mistake and should be redone. In a hybrid model, the ML stage simply accepts ARIMA's output as fixed and correct-as-given — it has no way to \"push back\" on the first stage, only patch what's left after it.",
        'အယ်ဒီတာ-ပြီးမှ-ကျွမ်းကျင်သူ ဆင်တူပုံရိပ်သည် လွတ်လပ်မှုတွင် ပျက်စီးသည်: draft တစ်ခုကို review လုပ်သော လူသား ကျွမ်းကျင်သူသည် grammar-fixer တကယ်မှားခဲ့ပြီး ပြန်လုပ်သင့်ကြောင်း flag လုပ်နိုင်သည်။ Hybrid model တွင် ML အဆင့်သည် ARIMA ၏ output ကို ပုံသေ၊ ပေးထားသည့်အတိုင်း မှန်ကန်သည်ဟု ရိုးရိုးလက်ခံသည် — ပထမအဆင့်ကို "ပြန်တွန်း" ရန် နည်းလမ်းမရှိပါ၊ ၎င်းနောက်ပိုင်း ကျန်ခဲ့သောအရာကိုသာ ပြင်ဆင်နိုင်သည်။'
      ),
      caveat: blSame(
        'A real caveat: hybrid pipelines have genuinely more moving parts than either component alone — two models to maintain, tune, and debug instead of one, with the added complexity of making sure the residual-fitting stage doesn\'t leak future information back into training.',
        'တကယ့် caveat: hybrid pipeline များသည် component တစ်ခုတည်းထက် တကယ်ပင် ရွေ့လျားနေသော အစိတ်အပိုင်း ပိုများသည် — ထိန်းသိမ်း၊ ချိန်ညှိ၊ debug ရန် model တစ်ခုအစား နှစ်ခု၊ residual-fitting အဆင့်သည် အနာဂတ်အချက်အလက်ကို training ထဲသို့ ပြန်မယိုစိမ့်စေရန် သေချာစေသော ရှုပ်ထွေးမှုထပ်ပါဝင်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does the doc call hybrid stacks an "ideal Stats + ML working together" teaching module?', 'ပြန်မကြည့်ဘဲ: doc သည် hybrid stack များကို ဘာကြောင့် "Stats + ML အတူတကွ လုပ်ဆောင်" သင်ကြားရေး module အကောင်းဆုံးဟု ခေါ်သလဲ?'),
        answer: blSame(
          "Because the two stages genuinely play to each other's documented strengths rather than competing: the econometric stage (Stats territory) handles the interpretable, structural trend cleanly, while the ML stage (ML territory) handles whatever nonlinear pattern is genuinely left over — a real division of labor, not just two models bolted together arbitrarily.",
          'ဘာကြောင့်ဆိုသော် အဆင့်နှစ်ခုသည် အချင်းချင်း ယှဉ်ပြိုင်မည့်အစား မှတ်တမ်းရှိသော အားသာချက်များကို တကယ်ပင် ကစားပေးသောကြောင့်ဖြစ်သည်: econometric အဆင့် (Stats နယ်ပယ်) သည် နားလည်နိုင်သော structural trend ကို သန့်ရှင်းစွာ ကိုင်တွယ်ပြီး ML အဆင့် (ML နယ်ပယ်) သည် တကယ်ကျန်ရစ်နေသော nonlinear pattern ကို ကိုင်တွယ်သည် — ကျပန်း ဆက်ချိတ်ထားသော model နှစ်ခုမဟုတ်ဘဲ တကယ့် အလုပ်ခွဲဝေမှုဖြစ်သည်။'
        ),
      },
    },
  },

  rnn: {
    spark: {
      analogy: bl(
        "Like reading a book one word at a time while keeping a running mental summary of the story so far — an RNN reads a sequence step by step, updating its \"memory\" at each step.",
        'Maintains a hidden state updated recurrently at each timestep, carrying forward context; trained via backpropagation through time.',
        'ဇာတ်လမ်းအလျင်အမြန် အလျင်အမြန် အနှစ်ချုပ် စိတ်ကူးတစ်ခုကို ထိန်းသိမ်းထားရင်း စာအုပ်တစ်အုပ်ကို စကားလုံးတစ်ခုချင်းစီ ဖတ်သကဲ့သို့ — RNN သည် sequence ကို တစ်ဆင့်ချင်းစီ ဖတ်ပြီး "မှတ်ဉာဏ်" ကို တစ်ဆင့်စီတွင် update ပြုသည်။',
        'ဆင့်ကမ်းစီးဆင်း context ကို ရွက်ဆောင်ရင်း hidden state ကို timestep တစ်ခုစီတွင် update ပြုသည်; backpropagation through time ဖြင့် လေ့ကျင့်သည်။'
      ),
      predict: {
        question: blSame('For a very long sequence (say 500 timesteps), does a vanilla RNN typically remember information from step 1 well by the time it reaches step 500?', 'Sequence ရှည်လွန်းသောနေရာတွင် (timestep 500 ဆိုပါစို့), vanilla RNN သည် step 500 ရောက်သည့်အခါ step 1 မှ အချက်အလက်ကို ကောင်းစွာ မှတ်မိသေးသလား?'),
        options: [blSame('Yes, well', 'ဟုတ်သည်၊ ကောင်းစွာ'), blSame('No — it tends to fade or vanish', 'မဟုတ်ပါ — ဖျောက်ပျောက် (သို့) ပျောက်ကွယ်တတ်သည်')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As the sequence gets longer, does a vanilla RNN\'s ability to use very early information rise or fall?', 'Sequence ရှည်လာလေ vanilla RNN ၏ အစောပိုင်းအချက်အလက်ကို သုံးနိုင်စွမ်း တက်လေလား ကျလေလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 1 },
      paramLabel: blSame('Sequence length (timesteps)', 'Sequence အရှည် (timestep)'),
      paramMin: 5, paramMax: 200, paramDefault: 5, paramStep: 5, paramDecimals: 0,
      compute: (v) => Math.max(2, 100 * Math.pow(0.985, v)),
      outputLabel: blSame('Toy retained signal from step 1 (%)', 'Step 1 မှ ဥပမာ ထိန်းသိမ်းထားသော signal (%)'),
      outputDecimals: 1, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'hₜ = tanh(0.5·hₜ₋₁ + input). Starting from h₀=1 with no further input, each step multiplies roughly by 0.5: h₁≈0.46, h₂≈0.21, h₃≈0.10 — the original signal is already less than 10% of its size after just 3 steps, illustrating exactly why "vanishing" is the right word.',
        'hₜ=f(Whₕhₜ₋₁+Wₓₕxₜ+b); gradients backpropagated through time involve a product of Jacobians across all T steps — if the spectral radius of Whₕ is <1, this product shrinks geometrically, vanishing for large T (the reverse, >1, causes exploding gradients).',
        'hₜ = tanh(0.5·hₜ₋₁ + input)။ input ထပ်မထည့်တော့ဘဲ h₀=1 မှစတင်လျှင် အဆင့်တစ်ခုစီသည် ~0.5 နှင့် မြှောက်သည်: h₁≈0.46, h₂≈0.21, h₃≈0.10 — အဆင့် ၃ ခုသာ ပြီးနောက် မူရင်း signal သည် ၎င်း၏ အရွယ်အစား၏ 10% ထက်နည်းနေပြီး "vanishing" ဆိုသော စကားလုံး မှန်ကန်ကြောင်း အတိအကျ ဖော်ပြသည်။',
        'hₜ=f(Whₕhₜ₋₁+Wₓₕxₜ+b); အချိန်တစ်လျှောက် backpropagate ပြုလုပ်သော gradient များသည် T အဆင့်အားလုံးတစ်လျှောက် Jacobian ပေါင်းလဒ်တစ်ခု ပါဝင်သည် — Whₕ ၏ spectral radius <1 ဖြစ်လျှင် ဒီပေါင်းလဒ်သည် geometrically ကျုံ့ပြီး T ကြီးလျှင် ပျောက်ကွယ်သည် (ပြောင်းပြန်, >1, exploding gradient ဖြစ်စေသည်)။'
      ),
      faded: bl(
        'If the recurrent weight were 1.5 instead of 0.5 (>1), would repeated multiplication shrink toward zero or grow without bound over many steps? Step 1 — compute 1.5² and 1.5³. Step 2 — answer: _____ (vanishing or exploding?)',
        'If the recurrent weight were 1.5 instead of 0.5 (>1), would repeated multiplication shrink toward zero or grow without bound over many steps? Step 1 — compute 1.5² and 1.5³. Step 2 — answer: _____ (vanishing or exploding?)',
        'Recurrent weight သည် 0.5 အစား 1.5 (>1) ဖြစ်ခဲ့လျှင် ထပ်ခါထပ်ခါ မြှောက်ခြင်းသည် သုညဘက်သို့ ကျုံ့မလား၊ အဆင့်များစွာတစ်လျှောက် အကန့်အသတ်မရှိ ကြီးထွားမလား? အဆင့် ၁ — 1.5² နှင့် 1.5³ ကို တွက်ပါ။ အဆင့် ၂ — အဖြေ: _____ (vanishing သို့ exploding?)',
        'Recurrent weight သည် 0.5 အစား 1.5 (>1) ဖြစ်ခဲ့လျှင် ထပ်ခါထပ်ခါ မြှောက်ခြင်းသည် သုညဘက်သို့ ကျုံ့မလား၊ အဆင့်များစွာတစ်လျှောက် အကန့်အသတ်မရှိ ကြီးထွားမလား? အဆင့် ၁ — 1.5² နှင့် 1.5³ ကို တွက်ပါ။ အဆင့် ၂ — အဖြေ: _____ (vanishing သို့ exploding?)'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The reading-with-a-summary analogy breaks down on capacity: a person's mental summary can selectively hold onto whatever detail matters most, no matter how long ago they read it. A vanilla RNN's hidden state has no such selective control — it's mathematically forced to fade all old information at roughly the same geometric rate, whether that information turns out to matter or not.",
        'အနှစ်ချုပ်ဖြင့် ဖတ်ရှုခြင်း ဆင်တူပုံရိပ်သည် စွမ်းရည်တွင် ပျက်စီးသည်: လူတစ်ဦး၏ စိတ်ကူး အနှစ်ချုပ်သည် ဘယ်လောက်ကြာကြာ ဖတ်ခဲ့ပါစေ အရေးကြီးဆုံးအသေးစိတ်ကို ရွေးချယ်စွာ ထိန်းသိမ်းနိုင်သည်။ Vanilla RNN ၏ hidden state တွင် ဒီလို ရွေးချယ်ထိန်းချုပ်မှု မရှိပါ — အဟောင်းအချက်အလက်အားလုံးကို ၎င်းက အရေးပါမှုရှိစေ၊ မရှိစေ တူညီသော geometric နှုန်းနှင့် ဖျောက်ရန် math အရ အတင်းလုပ်ဆောင်ရသည်။'
      ),
      caveat: blSame(
        'A real caveat: RNNs process one timestep at a time by construction, so they can\'t be easily parallelized across the time dimension the way CNNs or Transformers can — this is a real training-speed cost, not just an accuracy one.',
        'တကယ့် caveat: RNN များသည် ၎င်းတို့၏ တည်ဆောက်ပုံအရ timestep တစ်ခုချင်းစီ လုပ်ဆောင်ရသောကြောင့် CNN သို့ Transformer များကဲ့သို့ အချိန်ဝင်ရိုးတစ်လျှောက် လွယ်ကူစွာ parallel မလုပ်နိုင်ပါ — ဒါသည် တိကျမှုကုန်ကျစရိတ်တစ်ခုတည်းမက training-speed ကုန်ကျစရိတ် တကယ့်တစ်ခုဖြစ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is a vanilla RNN considered good only for "short-sequence pattern learning"?', 'ပြန်မကြည့်ဘဲ: vanilla RNN ကို ဘာကြောင့် "sequence တိုသော pattern သင်ယူမှု" အတွက်သာ ကောင်းသည်ဟု ယူဆသလဲ?'),
        answer: blSame(
          "Because the vanishing gradient problem means information (and the training signal that would let it learn from that information) genuinely degrades geometrically with distance — on short sequences that decay hasn't gone far enough to matter, but on long ones, information from early steps is essentially lost by the time it would be needed.",
          'ဘာကြောင့်ဆိုသော် vanishing gradient ပြဿနာသည် အချက်အလက် (နှင့် ၎င်းမှ သင်ယူနိုင်စေမည့် training signal) သည် အကွာအဝေးနှင့်အတူ geometrically တကယ် ယိုယွင်းသည်ဟု ဆိုလိုသောကြောင့်ဖြစ်သည် — sequence တိုများတွင် decay သည် အရေးပါလောက်အောင် မဝေးသေးသော်လည်း ရှည်သောများတွင် အစောပိုင်းအဆင့်များမှ အချက်အလက်သည် လိုအပ်ချိန်ရောက်ချိန်တွင် အခြေခံအားဖြင့် ပျောက်ဆုံးသွားသည်။'
        ),
      },
    },
  },

  lstm: {
    spark: {
      analogy: bl(
        "Like an RNN with a personal secretary who explicitly decides, at every step, what to write down, what to cross out, and what to actually say out loud — LSTM's gates solve the vanilla RNN's tendency to forget things too quickly.",
        'Introduces forget/input/output gates controlling information flow through a cell state, mitigating vanishing gradients and enabling long-range dependency learning.',
        'RNN တစ်ခုတွင် တစ်ဆင့်စီတွင် ဘာမှတ်ရမလဲ၊ ဘာဖျက်ရမလဲ၊ ဘာကို တကယ်အသံထွက်ပြောရမလဲ ရှင်းရှင်းလင်းလင်း ဆုံးဖြတ်ပေးသော ကိုယ်ရေးအတွင်းရေးမှူးတစ်ဦး ပါဝင်သကဲ့သို့ — LSTM ၏ gate များသည် vanilla RNN အလွန်မြန်စွာ မေ့တတ်သည့် ဂုဏ်သတ္တိကို ဖြေရှင်းပေးသည်။',
        'Cell state မှတဆင့် အချက်အလက်စီးဆင်းမှုကို ထိန်းချုပ်သည့် forget/input/output gate များ မိတ်ဆက်ပေးပြီး vanishing gradient ကို လျော့ချကာ long-range dependency သင်ယူမှုကို ဖြစ်စေသည်။'
      ),
      predict: {
        question: blSame('Compared to a vanilla RNN, would an LSTM generally remember relevant information from 100 steps ago better or worse?', 'Vanilla RNN နှင့်နှိုင်းယှဉ်လျှင် LSTM သည် အဆင့် ၁၀၀ ကလွန်ခဲ့သော သက်ဆိုင်ရာအချက်အလက်ကို ပိုကောင်းစွာ (သို့) ပိုညံ့ဖျင်းစွာ မှတ်မိသလဲ?'),
        options: [blSame('Better', 'ပိုကောင်းသည်'), blSame('Worse', 'ပိုညံ့ဖျင်းသည်')],
        correctIndex: 0,
      },
    },
    mechanism: { kind: 'live-link', module: 'gold', label: blSame('Gold Lab — the LSTM lens', 'Gold Lab — LSTM lens') },
    formalism: {
      worked: bl(
        'A forget gate outputs fₜ=0.9 (close to 1, "keep most of the old memory") when recent inputs look unremarkable, but drops to fₜ=0.1 ("mostly forget") right after a genuinely surprising data point — this learned, input-dependent gating is exactly what lets important old information survive far longer than a fixed 0.5 decay would allow.',
        'fₜ=σ(Wf·[hₜ₋₁,xₜ]+bf) (forget gate), iₜ=σ(Wi·[hₜ₋₁,xₜ]+bi) (input gate); cell state update Cₜ=fₜ⊙Cₜ₋₁+iₜ⊙C̃ₜ — the forget gate\'s multiplicative but *learned and input-dependent* factor (unlike vanilla RNN\'s fixed weight) is what allows near-lossless information retention when fₜ≈1.',
        'Forget gate သည် လတ်တလော input များ ထူးဆန်းမှုမရှိလျှင် fₜ=0.9 (1 အနီး, "အဟောင်း memory အများစု ဆက်ထားရှိ") ထုတ်ပေးသော်လည်း တကယ်အံ့အားသင့်ဖွယ် data point တစ်ခု ပြီးနောက် fₜ=0.1 ("အများစု မေ့") သို့ ကျဆင်းသွားသည် — ဒီသင်ယူထားသော input-မှီခိုသော gating သည် ပုံသေ 0.5 decay ခွင့်ပြုနိုင်သည်ထက် အဟောင်းအရေးကြီးသော အချက်အလက်ကို ပိုကြာမြင့်စွာ ကျန်ရှိနေစေသည့်အချက်ပင်ဖြစ်သည်။',
        'fₜ=σ(Wf·[hₜ₋₁,xₜ]+bf) (forget gate), iₜ=σ(Wi·[hₜ₋₁,xₜ]+bi) (input gate); cell state update Cₜ=fₜ⊙Cₜ₋₁+iₜ⊙C̃ₜ — forget gate ၏ multiplicative သော်လည်း *သင်ယူထားပြီး input-မှီခိုသော* factor (vanilla RNN ၏ ပုံသေ weight နှင့်မတူ) သည် fₜ≈1 ဖြစ်သောအခါ near-lossless အချက်အလက် ထိန်းသိမ်းမှုကို ခွင့်ပြုသည့်အချက်ဖြစ်သည်။'
      ),
      faded: bl(
        'If the forget gate output fₜ were always exactly 1 for every timestep (never forgetting anything), what would that imply about the cell state\'s memory capacity over very long sequences? Step 1 — think about what fₜ=1 does to Cₜ=fₜ⊙Cₜ₋₁+iₜ⊙C̃ₜ. Step 2 — answer: _____.',
        'If the forget gate output fₜ were always exactly 1 for every timestep (never forgetting anything), what would that imply about the cell state\'s memory capacity over very long sequences? Step 1 — think about what fₜ=1 does to Cₜ=fₜ⊙Cₜ₋₁+iₜ⊙C̃ₜ. Step 2 — answer: _____.',
        'Forget gate output fₜ သည် timestep တိုင်းအတွက် 1 အတိအကျ အမြဲဖြစ်ခဲ့လျှင် (ဘာမှမေ့တတ်ခြင်း), ဒါက ရှည်လျားသော sequence များအတွက် cell state ၏ memory စွမ်းရည်ကို ဘာဆိုလိုမလဲ? အဆင့် ၁ — fₜ=1 သည် Cₜ=fₜ⊙Cₜ₋₁+iₜ⊙C̃ₜ ကို ဘာလုပ်စေမလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Forget gate output fₜ သည် timestep တိုင်းအတွက် 1 အတိအကျ အမြဲဖြစ်ခဲ့လျှင် (ဘာမှမေ့တတ်ခြင်း), ဒါက ရှည်လျားသော sequence များအတွက် cell state ၏ memory စွမ်းရည်ကို ဘာဆိုလိုမလဲ? အဆင့် ၁ — fₜ=1 သည် Cₜ=fₜ⊙Cₜ₋₁+iₜ⊙C̃ₜ ကို ဘာလုပ်စေမလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The secretary analogy breaks down on transparency: a real secretary could explain their filing decisions in plain language. LSTM's gates are learned numeric functions with no inherent human-readable meaning — you can inspect the gate values, but there's no guarantee they correspond to anything a person would recognize as a sensible \"reason\" for keeping or forgetting.",
        'အတွင်းရေးမှူး ဆင်တူပုံရိပ်သည် ပွင့်လင်းမြင်သာမှုတွင် ပျက်စီးသည်: တကယ့်အတွင်းရေးမှူးတစ်ဦးသည် ၎င်း၏ ဖိုင်တွဲဆောင်ရွက်မှု ဆုံးဖြတ်ချက်များကို ရှင်းလင်းသောစကားဖြင့် ရှင်းပြနိုင်သည်။ LSTM ၏ gate များသည် လူသား ဖတ်ရှုနိုင်သော အဓိပ္ပာယ်တစ်ခုမျှ မပါသော သင်ယူထားသော numeric function များဖြစ်သည် — gate တန်ဖိုးများကို စစ်ဆေးနိုင်သော်လည်း ထိန်းထား/မေ့ရန် ကျိုးကြောင်းညီသော "အကြောင်းရင်း" လူတစ်ဦး အသိအမှတ်ပြုမည့် တစ်ခုခုနှင့် ကိုက်ညီကြောင်း အာမမခံနိုင်ပါ။'
      ),
      caveat: blSame(
        'A real caveat: solving vanishing gradients doesn\'t remove LSTM\'s "black box" nature — it\'s genuinely harder to explain why an LSTM made a specific prediction than a linear model or even a decision tree, precisely because of its many gates and nonlinear interactions.',
        'တကယ့် caveat: vanishing gradient ကို ဖြေရှင်းခြင်းသည် LSTM ၏ "black box" သဘောသဘာဝကို ဖယ်ရှားပေးမည်မဟုတ်ပါ — LSTM သည် ခန့်မှန်းချက်တစ်ခုကို ဘာကြောင့်ပြုလုပ်ခဲ့သလဲ ရှင်းပြရန် linear model (သို့) decision tree ထက်တောင် တကယ်ခက်ခဲသည်၊ ၎င်း၏ gate များစွာနှင့် nonlinear interaction များကြောင့် အတိအကျဖြစ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does LSTM need "large data" to perform well, more so than a simpler model like ARIMA?', 'ပြန်မကြည့်ဘဲ: LSTM သည် ARIMA ကဲ့သို့ ပိုရိုးရှင်းသော model ထက် ဘာကြောင့် ကောင်းစွာလုပ်ဆောင်ရန် "ဒေတာကြီးမား" ပိုလိုအပ်သလဲ?'),
        answer: blSame(
          "LSTM has far more learnable parameters (four separate gate networks per layer, each with its own weights) than ARIMA's handful of coefficients — more parameters generally need more examples to estimate reliably without overfitting, the same data-hunger tradeoff seen throughout the compass axis, just at a more extreme point.",
          'LSTM တွင် ARIMA ၏ coefficient အနည်းငယ်ထက် သင်ယူနိုင်သော parameter (layer တစ်ခုစီအတွက် gate network သီးခြားလေးခု၊ တစ်ခုစီ ကိုယ်ပိုင် weight ရှိ) များစွာပိုများသည် — parameter ပိုများလေ overfitting မဖြစ်ဘဲ ယုံကြည်ရလောက်အောင် ခန့်မှန်းရန် ဥပမာ ပိုများလေ ဖြစ်ကာ compass axis တစ်လျှောက် တွေ့ရသော ဒေတာစားနှုန်းတူညီသော trade-off ဖြစ်ပြီး ပိုစွန်းသောအမှတ်တွင်ရှိသည်။'
        ),
      },
    },
  },

  cnn: {
    spark: {
      analogy: bl(
        "Like a security guard scanning security footage with a fixed-size magnifying glass, sliding it across every frame looking for one specific type of suspicious motion — wherever that pattern appears, the glass detects it.",
        'Applies learned 1D convolutional filters sliding across the time axis, detecting translation-invariant local motifs.',
        'Frame တိုင်းကို ဖြတ်ပြီး ရွေ့လျားသော ပုံသေအရွယ်အစားရှိ မှန်ဘီလူးဖြင့် ထူးခြားသော လှုပ်ရှားမှုအမျိုးအစား တစ်ခုကို ရှာဖွေနေသော လုံခြုံရေးထားသူတစ်ဦးသကဲ့သို့ — ထို pattern ဘယ်နေရာမှာပေါ်ပေါ် မှန်ဘီလူးက ဖော်ထုတ်ပေးသည်။',
        'အချိန်ဝင်ရိုးတစ်လျှောက် ရွေ့လျားသော သင်ယူထားသော 1D convolutional filter များကို အသုံးချပြီး translation-invariant local motif များကို ဖော်ထုတ်သည်။'
      ),
      predict: {
        question: blSame('If a CNN filter learns to detect a "sudden price spike" pattern near the start of a sequence, will it also detect the same spike pattern if it occurs near the end?', 'CNN filter တစ်ခုသည် sequence အစပိုင်းအနီး "ရုတ်တရက် ဈေးနှုန်းခုန်တက်ခြင်း" pattern ကို ဖော်ထုတ်ရန် သင်ယူလျှင် အဆုံးအနီးတွင် ထို ခုန်တက်ခြင်း pattern ဖြစ်လျှင် ဖော်ထုတ်ဦးမလား?'),
        options: [blSame('Yes — filters are translation-invariant, they detect the pattern wherever it appears', 'ဟုတ်သည် — filter များသည် translation-invariant ဖြစ်ပြီး pattern ကို ဘယ်နေရာမှာပေါ်ပေါ် ဖော်ထုတ်သည်'), blSame('No, only where it was originally trained', 'မဟုတ်ပါ၊ မူလ train ခဲ့ရာနေရာတွင်သာ')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you widen the CNN filter\'s kernel size, does it detect shorter-range or longer-range local patterns?', 'CNN filter ၏ kernel size ကို ကျယ်ပြန့်စေလျှင် ၎င်းသည် အကွာအဝေးတိုသော (သို့) အကွာအဝေးရှည်သော local pattern ကို ဖော်ထုတ်သလဲ?'), options: [blSame('Shorter-range', 'အကွာအဝေးတိုသည်'), blSame('Longer-range', 'အကွာအဝေးရှည်သည်')], correctIndex: 1 },
      paramLabel: blSame('Kernel size (timesteps covered per filter)', 'Kernel size (filter တစ်ခုစီ ဖုံးလွှမ်းသော timestep)'),
      paramMin: 2, paramMax: 30, paramDefault: 3, paramStep: 1, paramDecimals: 0,
      compute: (v) => v,
      outputLabel: blSame('Local pattern span detected (timesteps)', 'ဖော်ထုတ်သော local pattern အပိုင်းအခြား (timestep)'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'A kernel of size 3 sliding across [10,12,11,25,13,12]: at position 4 (window [11,25,13]) the filter\'s learned weights strongly activate on the 25 — a big local jump — regardless of whether that pattern happens at position 4 or position 40 of a much longer series, the same filter fires.',
        '(x*w)ₜ = Σᵢ₌₀ᵏ⁻¹ wᵢ·xₜ₊ᵢ for kernel size k; the same weight vector w is reused (shared) at every position t, which is exactly the parameter-sharing that gives translation invariance and keeps parameter count independent of sequence length.',
        'Kernel size 3 သည် [10,12,11,25,13,12] တစ်လျှောက် ရွေ့လျားသည်: position 4 (window [11,25,13]) တွင် filter ၏ သင်ယူထားသော weight များသည် 25 ပေါ်တွင် ပြင်းထန်စွာ activate ဖြစ်သည် — local jump ကြီးတစ်ခု — ထို pattern သည် position 4 (သို့) ပိုရှည်သော series ၏ position 40 တွင်ဖြစ်ပါစေ filter အတူတူပင် fire ဖြစ်သည်။',
        '(x*w)ₜ = Σᵢ₌₀ᵏ⁻¹ wᵢ·xₜ₊ᵢ kernel size k အတွက်; weight vector w အတူတူကို position t တိုင်းတွင် ပြန်သုံးသည် (shared), ဒါသည် translation invariance ပေးပြီး parameter အရေအတွက်ကို sequence အရှည်နှင့် သီးခြားထားစေသော parameter-sharing အတိအကျပင်ဖြစ်သည်။'
      ),
      faded: bl(
        'If the same 3-timestep filter is applied to a sequence of length 100, how many different positions can it slide to (roughly)? Step 1 — think about how far it can slide before running off the end. Step 2 — answer: _____ (roughly how many).',
        'If the same 3-timestep filter is applied to a sequence of length 100, how many different positions can it slide to (roughly)? Step 1 — think about how far it can slide before running off the end. Step 2 — answer: _____ (roughly how many).',
        'Timestep 3 ခု filter အတူတူကို အရှည် 100 sequence တစ်ခုတွင် အသုံးချလျှင် ၎င်းသည် ဘယ်နှခု position ကွဲပြားစွာ ရွေ့နိုင်သနည်း (ခန့်မှန်း)? အဆင့် ၁ — အဆုံးမှမလွန်မီ ဘယ်လောက်ဝေးဝေးရွေ့နိုင်သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____ (ခန့်မှန်းအားဖြင့် ဘယ်နှခု)။',
        'Timestep 3 ခု filter အတူတူကို အရှည် 100 sequence တစ်ခုတွင် အသုံးချလျှင် ၎င်းသည် ဘယ်နှခု position ကွဲပြားစွာ ရွေ့နိုင်သနည်း (ခန့်မှန်း)? အဆင့် ၁ — အဆုံးမှမလွန်မီ ဘယ်လောက်ဝေးဝေးရွေ့နိုင်သလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____ (ခန့်မှန်းအားဖြင့် ဘယ်နှခု)။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The security-guard analogy breaks down on range: a guard's magnifying glass only ever sees one small window at a time and genuinely can't relate a suspicious moment at the start of the tape to one at the end. A single CNN layer has that exact limitation too — but stacking layers lets each successive layer see combinations of the previous layer's local detections, gradually building up longer-range awareness the single-glass analogy doesn't capture.",
        'လုံခြုံရေးထားသူ ဆင်တူပုံရိပ်သည် အကွာအဝေးတွင် ပျက်စီးသည်: ထားသူ၏ မှန်ဘီလူးသည် တစ်ကြိမ်လျှင် window သေးသေးလေးတစ်ခုကိုသာ မြင်နိုင်ပြီး tape အစရှိ ထူးဆန်းသောအခိုက်ကို အဆုံးရှိတစ်ခုနှင့် တကယ် ဆက်စပ်၍မရနိုင်ပါ။ CNN layer တစ်ခုတည်းသည်လည်း ဒီကန့်သတ်ချက်အတိအကျ ရှိသည် — သို့သော် layer များစုပုံခြင်းက layer ဆက်တိုက်တစ်ခုစီအား ယခင် layer ၏ local ဖော်ထုတ်မှုများ၏ ပေါင်းစပ်မှုများကို မြင်စေပြီး မှန်ဘီလူးတစ်ခုတည်း ဆင်တူပုံရိပ်က မဖမ်းယူနိုင်သော ပိုရှည်လျားသော အကွာအဝေး သတိပညာကို တဖြည်းဖြည်း တည်ဆောက်ပေးသည်။'
      ),
      caveat: blSame(
        'A real caveat: because a single 1D CNN layer only sees within its fixed kernel window, it\'s not natively suited to genuinely long-range temporal dependency — which is exactly why it\'s typically used as a fast feature-extraction front-end before an LSTM or Transformer, not as a complete forecasting model on its own.',
        'တကယ့် caveat: 1D CNN layer တစ်ခုတည်းသည် ၎င်း၏ ပုံသေ kernel window အတွင်းသာ မြင်နိုင်သောကြောင့် ၎င်းသည် တကယ့် ခရီးရှည် temporal dependency အတွက် သဘာဝအားဖြင့် မသင့်လျော်ပါ — ဒါသည် LSTM (သို့) Transformer မတိုင်မီ မြန်ဆန်သော feature-extraction front-end အဖြစ် ပုံမှန်အားဖြင့် အသုံးပြုရသည့်အကြောင်းရင်း အတိအကျဖြစ်ပြီး ကိုယ်တိုင် forecasting model အပြည့်အစုံ မဟုတ်ပါ။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does a CNN\'s parameter count NOT grow with sequence length, unlike a fully-connected layer would?', 'ပြန်မကြည့်ဘဲ: fully-connected layer တစ်ခုနှင့်မတူဘဲ CNN ၏ parameter အရေအတွက်သည် ဘာကြောင့် sequence အရှည်နှင့်အတူ မကြီးထွားသလဲ?'),
        answer: blSame(
          "Because the same small filter (weight vector) is reused — slid across — every position in the sequence, rather than each position getting its own dedicated set of weights. Ten times the sequence length just means the same filter slides ten times more, not that ten times more parameters need to be learned.",
          'ဘာကြောင့်ဆိုသော် filter သေးသေးလေးအတူတူ (weight vector) ကို sequence ထဲရှိ position တိုင်း ပြန်သုံး — ရွှေ့ — ပြီး position တစ်ခုစီအတွက် ၎င်းကိုယ်ပိုင် weight အစုတစ်ခုစီ မရှိသောကြောင့်ဖြစ်သည်။ Sequence အရှည် ၁၀ ဆ ဆိုသည်မှာ filter အတူတူ ၁၀ ဆ ပိုရွှေ့ရသည်ဟု ဆိုလိုသည်၊ parameter ၁၀ ဆ ပိုသင်ယူရန်လိုသည်ဟု မဆိုလိုပါ။'
        ),
      },
    },
  },

  transformer: {
    spark: {
      analogy: bl(
        "Like reading an entire report at once instead of one line at a time, then highlighting exactly which earlier sentences mattered most for understanding the conclusion — a Transformer looks at the whole sequence simultaneously and learns which past moments matter most.",
        'Self-attention computes weighted combinations of all timesteps simultaneously; the TFT additionally separates static, known-future, and observed inputs.',
        'အစီရင်ခံစာတစ်ခုလုံးကို တစ်ကြောင်းချင်းဖတ်မည့်အစား တစ်ပြိုင်နက်ဖတ်ပြီး ရလဒ်နားလည်ရန် ဘယ်အစောပိုင်း ဝါကျများ အရေးအကြီးဆုံးလဲ ရှင်းရှင်းလင်းလင်း highlight ပြုသကဲ့သို့ — Transformer သည် sequence တစ်ခုလုံးကို တစ်ပြိုင်နက်ကြည့်ပြီး ဘယ်အတိတ်အချိန်များက ယခုအတွက် အရေးကြီးဆုံးလဲ သင်ယူသည်။',
        'Self-attention သည် timestep အားလုံး၏ weight ချထားသော ပေါင်းစပ်မှုကို တစ်ပြိုင်နက် တွက်ချက်သည်; TFT သည် static, known-future, observed input များကို ထပ်မံခွဲခြားသည်။'
      ),
      predict: {
        question: blSame('Because a Transformer looks at all timesteps simultaneously rather than one at a time, can it be trained in parallel (much faster) compared to an RNN?', 'Transformer သည် timestep တစ်ခုစီအစား အားလုံးကို တစ်ပြိုင်နက်ကြည့်ခြင်းကြောင့် RNN နှင့်နှိုင်းယှဉ်လျှင် parallel (ပိုမြန်စွာ) train လုပ်နိုင်သလား?'),
        options: [blSame('Yes, much more parallelizable', 'ဟုတ်သည်၊ ပိုပြီး parallel လုပ်နိုင်သည်'), blSame('No, it\'s equally sequential', 'မဟုတ်ပါ၊ ညီမျှစွာ sequential ဖြစ်သည်')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('If a specific past timestep is highly relevant to the current prediction, does its attention weight tend to be higher or lower than an irrelevant timestep\'s?', 'အတိတ် timestep တိကျတစ်ခုသည် လက်ရှိ ခန့်မှန်းချက်နှင့် အလွန်သက်ဆိုင်လျှင် ၎င်း၏ attention weight သည် မသက်ဆိုင်သော timestep ထက် ပိုမြင့်သလား ပိုနိမ့်သလား?'), options: [blSame('Higher', 'ပိုမြင့်သည်'), blSame('Lower', 'ပိုနိမ့်သည်')], correctIndex: 0 },
      paramLabel: blSame('Relevance of a past timestep to now', 'အတိတ် timestep တစ်ခု၏ ယခုအတွက် သက်ဆိုင်မှု'),
      paramMin: 0, paramMax: 10, paramDefault: 5, paramStep: 1, paramDecimals: 0,
      compute: (v) => (v / 10) * 100,
      outputLabel: blSame('Toy attention weight (%)', 'ဥပမာ attention weight (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'For a 6-month gold forecast, attention weights across the past year might come out as: [0.05, 0.05, 0.05, 0.05, 0.35, 0.45] for months 1-6 — the model learned that the two most recent months matter far more than the oldest four, and this exact number is directly inspectable, unlike a black-box hidden state.',
        'Attention(Q,K,V)=softmax(QKᵀ/√d)V; the softmax over QKᵀ produces a probability distribution (weights summing to 1) over all timesteps, and V is then a weighted combination using those attention weights — the weights themselves are the "which past moments mattered" answer.',
        '၆ လ ရွှေ forecast အတွက် ပြီးခဲ့သော တစ်နှစ်တစ်လျှောက် attention weight များသည်: [0.05, 0.05, 0.05, 0.05, 0.35, 0.45] (လ 1-6) ဟု ထွက်လာနိုင်သည် — model သည် လတ်တလောဆုံးလ နှစ်လသည် အဟောင်းဆုံးလေးလထက် များစွာ အရေးကြီးကြောင်း သင်ယူသည်၊ ဒီဂဏန်း အတိအကျကို black-box hidden state နှင့်မတူဘဲ တိုက်ရိုက်စစ်ဆေးနိုင်သည်။',
        'Attention(Q,K,V)=softmax(QKᵀ/√d)V; QKᵀ ပေါ်ရှိ softmax သည် timestep အားလုံးပေါ် probability distribution (weight ပေါင်း 1) တစ်ခု ထုတ်ပေးပြီး V သည် ထို attention weight များကို သုံးထားသော weight ချထားသော ပေါင်းစပ်မှုတစ်ခုဖြစ်သည် — weight များကိုယ်တိုင်သည် "ဘယ်အတိတ်အချိန်များက အရေးကြီးသလဲ" အဖြေဖြစ်သည်။'
      ),
      faded: bl(
        'If all attention weights across every timestep came out exactly equal (uniform), what would that imply the model learned about which past moments matter more than others? Step 1 — think about what "equal weight everywhere" means. Step 2 — answer: _____.',
        'If all attention weights across every timestep came out exactly equal (uniform), what would that imply the model learned about which past moments matter more than others? Step 1 — think about what "equal weight everywhere" means. Step 2 — answer: _____.',
        'Timestep အားလုံးတစ်လျှောက် attention weight များသည် အတိအကျညီမျှ (uniform) ထွက်လာခဲ့လျှင် ဒါက ဘယ်အတိတ်အချိန်များက တခြားများထက် အရေးကြီးကြောင်း model သင်ယူထားသည်ဆိုသည်ကို ဘာဆိုလိုမလဲ? အဆင့် ၁ — "နေရာတိုင်း weight ညီမျှ" ဆိုသည်မှာ ဘာကို ဆိုလိုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Timestep အားလုံးတစ်လျှောက် attention weight များသည် အတိအကျညီမျှ (uniform) ထွက်လာခဲ့လျှင် ဒါက ဘယ်အတိတ်အချိန်များက တခြားများထက် အရေးကြီးကြောင်း model သင်ယူထားသည်ဆိုသည်ကို ဘာဆိုလိုမလဲ? အဆင့် ၁ — "နေရာတိုင်း weight ညီမျှ" ဆိုသည်မှာ ဘာကို ဆိုလိုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The highlighting-a-report analogy is unusually accurate for what attention weights literally show, but it undersells the scale: a human highlighter marks maybe a handful of key sentences. A Transformer computes and can display a weight for every single pair of timesteps simultaneously — a complete, dense map of relevance, not just a few marked highlights.",
        'အစီရင်ခံစာ highlight ပြုခြင်း ဆင်တူပုံရိပ်သည် attention weight များ ကိုယ်တိုင်ပြသသည့်အရာအတွက် ထူးထူးခြားခြား တိကျသော်လည်း scale ကို လျှော့တွက်ထားသည်: လူသား highlighter သည် အရေးကြီးသော ဝါကျ အနည်းငယ်ကိုသာ အမှတ်ပြုသည်။ Transformer သည် timestep pair တစ်ခုစီအတွက် weight တစ်ခုကို တစ်ပြိုင်နက် တွက်ချက်ပြီး ပြသနိုင်သည် — highlight အနည်းငယ်သာမက relevance ၏ ပြည့်စုံ၊ ထူထပ်သော မြေပုံတစ်ခုဖြစ်သည်။'
      ),
      caveat: blSame(
        "A real caveat: despite its added complexity and interpretability promise, recent research shows Transformers don't consistently beat simpler LSTM/BiLSTM baselines on forecasting tasks — more sophisticated doesn't automatically mean more accurate.",
        'တကယ့် caveat: ၎င်း၏ ထပ်ထည့်ထားသော ရှုပ်ထွေးမှုနှင့် interpretability ကတိပေးချက် ရှိပါလျက် မကြာသေးမီ သုတေသနက Transformer များသည် forecasting task များတွင် ရိုးရှင်းသော LSTM/BiLSTM baseline များကို စဉ်ဆက်မပြတ် အနိုင်မယူကြောင်း ပြသသည် — ပိုရှုပ်ထွေးခြင်းသည် ပိုတိကျခြင်းကို အလိုအလျောက် မဆိုလိုပါ။'
      ),
      retrieval: {
        question: blSame('Without looking back: why can a Transformer be trained faster (more parallelizable) than an RNN despite processing the same sequence?', 'ပြန်မကြည့်ဘဲ: Transformer သည် sequence တူတူ လုပ်ဆောင်ရသော်လည်း ဘာကြောင့် RNN ထက် ပိုမြန်စွာ (ပိုပြီး parallel) train လုပ်နိုင်သလဲ?'),
        answer: blSame(
          "An RNN must compute hₜ before it can compute hₜ₊₁ — a hard sequential dependency. A Transformer's attention computes relationships between ALL pairs of timesteps at once via matrix multiplication, with no step needing to wait for a previous step's output first, so the whole computation can run in parallel on modern hardware.",
          'RNN သည် hₜ₊₁ မတွက်ချက်မီ hₜ ကို တွက်ချက်ရမည် — ခက်ခဲသော sequential dependency ဖြစ်သည်။ Transformer ၏ attention သည် matrix multiplication မှတဆင့် timestep pair အားလုံးကြား ဆက်နွယ်မှုများကို တစ်ပြိုင်နက် တွက်ချက်ပြီး၊ အဆင့်မည်သည်မှ ယခင်အဆင့်၏ output ကို ဦးစွာ စောင့်ရန် မလိုအပ်သောကြောင့် ခေတ်မီ hardware ပေါ်တွင် တွက်ချက်မှုတစ်ခုလုံး parallel run နိုင်သည်။'
        ),
      },
    },
  },

  gp: {
    spark: {
      analogy: bl(
        "Like a cartographer who, instead of drawing one single coastline, sketches a whole bundle of plausible coastlines through every confirmed landmark — tightly bunched near known points, fanning out wide wherever no one has actually surveyed yet.",
        'Places a prior over an entire family of functions; posterior predictive is Gaussian with closed-form mean and variance conditioned on observed points.',
        'ကမ်းရိုးတန်း map ရေးဆွဲသူတစ်ဦးသည် ကမ်းရိုးတန်း တစ်ခုတည်းသာ မဆွဲဘဲ အတည်ပြုပြီးသား landmark တိုင်းကို ဖြတ်သန်းသော ဖြစ်နိုင်သည့် ကမ်းရိုးတန်း အစုတစ်ခုလုံးကို ဆွဲသကဲ့သို့ — သိထားသော အမှတ်များအနီးတွင် တင်းကျပ်စွာ စုစည်းပြီး ဘယ်သူမှ တကယ် စစ်တမ်းမကောက်ရသေးသောနေရာတွင် ကျယ်ပြန့်စွာ ပြန့်ကျဲသည်။',
        'Function မိသားစု တစ်ခုလုံးပေါ် prior တစ်ခု ချထားသည်; posterior predictive သည် တွေ့ရှိထားသော point များပေါ်မူတည်၍ closed-form mean နှင့် variance ရှိသော Gaussian ဖြစ်သည်။'
      ),
      predict: {
        question: blSame('Far away from any observed data point, would a Gaussian Process\'s uncertainty band be narrow or wide?', 'တွေ့ရှိထားသော data point မည်သည့်တစ်ခုမှ ဝေးလံလျှင် Gaussian Process ၏ uncertainty band ကျဉ်းမလား ကျယ်မလား?'),
        options: [blSame('Narrow', 'ကျဉ်းသည်'), blSame('Wide', 'ကျယ်သည်')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As a query point moves farther from all observed data, does the GP\'s predictive uncertainty rise or fall?', 'Query point သည် တွေ့ရှိထားသော data အားလုံးမှ ပိုဝေးဝေးရွှေ့သွားလျှင် GP ၏ predictive uncertainty တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 0 },
      paramLabel: blSame('Distance from nearest observed point', 'အနီးဆုံး တွေ့ရှိထားသော point မှ အကွာအဝေး'),
      paramMin: 0, paramMax: 10, paramDefault: 0, paramStep: 0.5, paramDecimals: 1,
      compute: (v) => 5 + v * v * 3,
      outputLabel: blSame('Toy predictive uncertainty (band width)', 'ဥပမာ predictive uncertainty (band width)'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'With just 4 observed gold-price points, a GP fit to them gives a tight band (±$15) right at those exact 4 points, but a much wider band (±$180) at a query point far from all 4 — the model is honestly saying "I have very little evidence here."',
        'Posterior mean μ*(x) and variance σ²*(x) at a query point x are computed in closed form from the kernel k(x,x\') and observed data: σ²*(x) shrinks toward the kernel\'s inherent noise floor near observed xᵢ and grows toward the prior variance far from any xᵢ.',
        'ရွှေဈေးနှုန်း တွေ့ရှိထားသော point ၄ ခုတည်းဖြင့် ၎င်းတို့ပေါ်တွင် fit လုပ်ထားသော GP သည် ထို point ၄ ခုတွင် ကျဉ်းသော band (±$15) ပေးသော်လည်း ၄ ခုစလုံးမှ ဝေးလံသော query point တစ်ခုတွင် ပိုကျယ်သော band (±$180) ပေးသည် — model သည် "ဒီနေရာမှာ သက်သေအထောက်အထား အနည်းငယ်သာရှိသည်" ဟု ရိုးသားစွာ ပြောနေသည်။',
        'Query point x တွင် posterior mean μ*(x) နှင့် variance σ²*(x) များကို kernel k(x,x\') နှင့် တွေ့ရှိထားသော data မှ closed form ဖြင့် တွက်ချက်သည်: σ²*(x) သည် တွေ့ရှိထားသော xᵢ အနီးတွင် kernel ၏ built-in noise floor ဆီသို့ ကျုံ့ပြီး xᵢ မည်သည့်တစ်ခုမှ ဝေးလျှင် prior variance ဆီသို့ ကြီးထွားသည်။'
      ),
      faded: bl(
        'If you observed a 5th point right in the middle of the widest-uncertainty gap, what would happen to the band width right at that new point? Step 1 — recall how the GP treats observed points. Step 2 — answer: _____.',
        'If you observed a 5th point right in the middle of the widest-uncertainty gap, what would happen to the band width right at that new point? Step 1 — recall how the GP treats observed points. Step 2 — answer: _____.',
        'အကျယ်ဆုံး uncertainty ကွာဟချက်၏ အလယ်တွင် ၅ ခုမြောက် point ကို တွေ့ရှိလျှင် ထို point အသစ်၌ band width ဘာဖြစ်သွားမလဲ? အဆင့် ၁ — GP သည် တွေ့ရှိထားသော point များကို မည်သို့ဆက်ဆံသလဲ သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'အကျယ်ဆုံး uncertainty ကွာဟချက်၏ အလယ်တွင် ၅ ခုမြောက် point ကို တွေ့ရှိလျှင် ထို point အသစ်၌ band width ဘာဖြစ်သွားမလဲ? အဆင့် ၁ — GP သည် တွေ့ရှိထားသော point များကို မည်သို့ဆက်ဆံသလဲ သတိရပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'exactness',
      analogyBreakdown: blSame(
        "The bundle-of-coastlines analogy is genuinely faithful, but understates the precision: a cartographer's \"bundle\" is a rough visual impression. A GP's uncertainty at any point is an exact, closed-form number (a variance you can compute to arbitrary precision) — not a vague sense of \"this area is less mapped,\" but a specific quantified confidence level.",
        'ကမ်းရိုးတန်း အစုအဝေး ဆင်တူပုံရိပ်သည် တကယ်ပင် တိကျသော်လည်း တိကျမှုအတိုင်းအတာကို လျှော့တွက်ထားသည်: cartographer ၏ "အစုအဝေး" သည် ကြမ်းအားဖြင့် မြင်ကွင်း အထင်တစ်ခုသာဖြစ်သည်။ GP ၏ point မည်သည့်တစ်ခုမဆို uncertainty သည် အတိအကျ၊ closed-form ဂဏန်း (တိကျမှု မည်သည်ကိုမဆို တွက်ချက်နိုင်သော variance) ဖြစ်ပြီး — "ဒီဧရိယာက map နည်းနည်းလုပ်ထားတယ်" ဆိုသည့် မှုန်ဝါးသောအာရုံမဟုတ်ဘဲ တိကျ ပမာဏတင်ထားသော ယုံကြည်မှုအဆင့်ဖြစ်သည်။'
      ),
      caveat: blSame(
        'A real caveat: computing that exact uncertainty requires inverting an n×n matrix (n = number of observed points), which is cubic-cost in n — genuinely too expensive to run on large datasets, exactly matching the compass axis\'s "computationally expensive at scale" weakness.',
        'တကယ့် caveat: ထို အတိအကျ uncertainty ကို တွက်ချက်ရန် n×n matrix (n = တွေ့ရှိထားသော point အရေအတွက်) ကို ပြောင်းပြန်လှန်ရန်လိုအပ်ပြီး ၎င်းသည် n ၏ cubic ကုန်ကျစရိတ်ဖြစ်သည် — dataset ကြီးများပေါ်တွင် run ရန် တကယ်ပင် ကုန်ကျစရိတ်များပြီး compass axis ၏ "scale ကြီးလာလျှင် တွက်ချက်မှုကုန်ကျစရိတ်များ" အားနည်းချက်နှင့် အတိအကျ ကိုက်ညီသည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why is a Gaussian Process described as "excellent for small data" specifically?', 'ပြန်မကြည့်ဘဲ: Gaussian Process ကို ဘာကြောင့် "ဒေတာအနည်းငယ်အတွက် ထူးချွန်" ဟု အထူးဖော်ပြသလဲ?'),
        answer: blSame(
          "Because it gives honest, well-calibrated uncertainty even with very few observed points (rather than a false-confidence point estimate a simpler model might produce), and its computational cost — which scales cubically with dataset size — is only manageable when that dataset is genuinely small.",
          'ဘာကြောင့်ဆိုသော် ၎င်းသည် တွေ့ရှိထားသော point အနည်းငယ်ဖြင့်ပင် ရိုးသား၊ calibration ကောင်းသော uncertainty ကို ပေးသောကြောင့်ဖြစ်သည် (ပိုရိုးရှင်းသော model တစ်ခုက ထုတ်ပေးနိုင်သော false-confidence point estimate အစား) ဖြစ်ပြီး ၎င်း၏ တွက်ချက်မှုကုန်ကျစရိတ် — dataset အရွယ်အစားနှင့်အတူ cubic ကြီးထွား — သည် dataset တကယ်သေးငယ်မှသာ ကိုင်တွယ်နိုင်သည်။'
        ),
      },
    },
  },

  bstsbnn: {
    spark: {
      analogy: bl(
        "Like a weather forecaster who never commits to one single confident number, but always reports a full range of plausible outcomes, updated as each new day's data arrives — full posterior uncertainty, not just one best guess.",
        'BSTS decomposes into latent state components via Kalman filtering/Gibbs sampling; Bayesian NNs place priors over weights and approximate the posterior via variational inference or MCMC.',
        'ဂဏန်းယုံကြည်စိတ်ချသော တစ်ခုတည်းကို ဘယ်တော့မှ မသတ်မှတ်ဘဲ နေ့စဉ်ရရှိလာသော data အသစ်နှင့်အတူ update ပြုသော ဖြစ်နိုင်ချေရှိသော ရလဒ်အပိုင်းအခြားတစ်ခုလုံးကို အမြဲ report ပြုသော ရာသီဥတု ခန့်မှန်းသူတစ်ဦးသကဲ့သို့ — posterior မသေချာမှု အပြည့်အစုံ၊ အကောင်းဆုံးခန့်မှန်းချက် တစ်ခုတည်းသာမက။',
        'BSTS သည် Kalman filtering/Gibbs sampling မှတဆင့် latent state component များအဖြစ် ခွဲခြမ်းသည်; Bayesian NN များသည် weight များပေါ် prior များချထားပြီး variational inference သို့ MCMC ဖြင့် posterior ကို ခန့်မှန်းတွက်ချက်သည်။'
      ),
      predict: {
        question: blSame('Compared to a plain point-estimate model, would a Bayesian NN\'s reported uncertainty typically widen or stay flat when it\'s given an input very unlike anything in training?', 'Plain point-estimate model နှင့်နှိုင်းယှဉ်လျှင် Bayesian NN ၏ report ပြုသော uncertainty သည် training ထဲရှိ မည်သည့်အရာနှင့်မျှ မတူသော input တစ်ခု ပေးလျှင် ပုံမှန်အားဖြင့် ကျယ်ပြန့်လာမလား ညီညီနေမလား?'),
        options: [blSame('Widens', 'ကျယ်ပြန့်လာသည်'), blSame('Stays flat', 'ညီညီနေသည်')],
        correctIndex: 0,
      },
    },
    mechanism: { kind: 'live-link', module: 'bridge', label: blSame('Stats ↔ ML Bridge — the frequentist vs. Bayesian estimation comparison', 'Stats ↔ ML Bridge — frequentist vs. Bayesian estimation နှိုင်းယှဉ်ချက်') },
    formalism: {
      worked: bl(
        'A Bayesian NN\'s weight isn\'t one number like w=2.3 — it\'s a full distribution, say Normal(2.3, 0.4²). Sampling that distribution many times and running the network each time produces not one prediction but a spread of predictions, whose range IS the model\'s honest uncertainty.',
        'Weight posterior p(w|data) is approximated (via variational inference: q(w)≈p(w|data), or MCMC sampling); predictive distribution p(y|x,data)=∫p(y|x,w)p(w|data)dw is approximated by averaging over many sampled w — the spread of that sample is the calibrated uncertainty.',
        'Bayesian NN ၏ weight သည် w=2.3 ကဲ့သို့ ဂဏန်းတစ်ခုတည်းမဟုတ်ပါ — ၎င်းသည် Normal(2.3, 0.4²) ဆိုပါစို့ distribution အပြည့်အစုံဖြစ်သည်။ ထို distribution ကို ကြိမ်များစွာ sample ယူပြီး network ကို အကြိမ်တိုင်း run ခြင်းသည် ခန့်မှန်းချက်တစ်ခုတည်းမဟုတ်ဘဲ ခန့်မှန်းချက် ပြန့်ကျဲမှုတစ်ခု ထုတ်ပေးပြီး ၎င်း၏ range သည် model ၏ ရိုးသား uncertainty ဖြစ်သည်။',
        'Weight posterior p(w|data) ကို ခန့်မှန်းတွက်ချက်သည် (variational inference: q(w)≈p(w|data), သို့ MCMC sampling); predictive distribution p(y|x,data)=∫p(y|x,w)p(w|data)dw ကို sample ယူထားသော w များစွာအပေါ် ပျမ်းမျှခြင်းဖြင့် ခန့်မှန်းတွက်ချက်သည် — ထို sample ၏ ပြန့်ကျဲမှုသည် calibration ကောင်းသော uncertainty ဖြစ်သည်။'
      ),
      faded: bl(
        'If every sampled weight from the posterior gave nearly the same prediction for a given input, would the model\'s reported uncertainty for that input be high or low? Step 1 — think about what "all samples agree" means for spread. Step 2 — answer: _____.',
        'If every sampled weight from the posterior gave nearly the same prediction for a given input, would the model\'s reported uncertainty for that input be high or low? Step 1 — think about what "all samples agree" means for spread. Step 2 — answer: _____.',
        'Posterior မှ sample ယူထားသော weight တိုင်းသည် input တစ်ခုအတွက် ခန့်မှန်းချက် အနီးစပ်တူ ပေးခဲ့လျှင် ထို input အတွက် model ၏ report ပြုသော uncertainty မြင့်မလား နိမ့်မလား? အဆင့် ၁ — "sample အားလုံး သဘောတူ" ဆိုသည်မှာ ပြန့်ကျဲမှုအတွက် ဘာဆိုလိုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Posterior မှ sample ယူထားသော weight တိုင်းသည် input တစ်ခုအတွက် ခန့်မှန်းချက် အနီးစပ်တူ ပေးခဲ့လျှင် ထို input အတွက် model ၏ report ပြုသော uncertainty မြင့်မလား နိမ့်မလား? အဆင့် ၁ — "sample အားလုံး သဘောတူ" ဆိုသည်မှာ ပြန့်ကျဲမှုအတွက် ဘာဆိုလိုသလဲ တွေးကြည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The honest-forecaster analogy is genuinely apt, but undersells the mechanism: a human forecaster's stated uncertainty is often a rough gut feeling. A Bayesian NN's uncertainty comes from an actual, mathematically principled procedure (a real posterior distribution over weights, sampled and propagated through the network) — it's earned from the math, not just verbally hedged.",
        'ရိုးသားသော ခန့်မှန်းသူ ဆင်တူပုံရိပ်သည် တကယ်ပင် သင့်လျော်သော်လည်း mechanism ကို လျှော့တွက်ထားသည်: လူသား ခန့်မှန်းသူ၏ ဖော်ပြသော uncertainty သည် မကြာခဏ ကြမ်းအားဖြင့် ခံစားချက်တစ်ခုသာဖြစ်သည်။ Bayesian NN ၏ uncertainty သည် တကယ့်၊ math အရ ခိုင်မာသော လုပ်ငန်းစဉ် (weight ပေါ်ရှိ တကယ့် posterior distribution, sample ယူပြီး network ကို ဖြတ်သန်း propagate ပြု) မှ ရရှိသည် — စကားလုံးဖြင့် ကာကွယ်ထားသည်မဟုတ်ဘဲ math မှ ရရှိထားသည်။'
      ),
      caveat: blSame(
        'A real caveat: this calibrated uncertainty is not free — sampling-based inference (MCMC especially) is genuinely slow to fit compared to a plain point-estimate model trained via ordinary gradient descent, and getting the implementation right is more complex.',
        'တကယ့် caveat: ဒီ calibration ကောင်းသော uncertainty သည် အခမဲ့မဟုတ်ပါ — sampling-based inference (အထူးသဖြင့် MCMC) သည် ordinary gradient descent ဖြင့် train လုပ်ထားသော plain point-estimate model နှင့်နှိုင်းယှဉ်လျှင် fit လုပ်ရန် တကယ်ပင် နှေးကွေးပြီး implementation ကို မှန်ကန်စွာလုပ်ဆောင်ရန် ပိုရှုပ်ထွေးသည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does the doc call this family "the ML-side sibling of frequentist confidence intervals"?', 'ပြန်မကြည့်ဘဲ: doc သည် ဒီ family ကို "frequentist confidence interval ၏ ML-ဘက် ညီအစ်ကို" ဟု ဘာကြောင့် ခေါ်သလဲ?'),
        answer: blSame(
          "Both a frequentist t confidence interval (Stats mode's ci_mean_t) and a Bayesian posterior interval report a range around an estimate — but they mean fundamentally different things: the frequentist interval treats the true parameter as fixed and the interval as random across repeated sampling; the Bayesian interval treats the parameter itself as uncertain and the interval as a direct probability statement about it, which the Stats ↔ ML Bridge makes explicit with matching numbers.",
          'Frequentist t confidence interval (Stats mode ၏ ci_mean_t) နှင့် Bayesian posterior interval နှစ်ခုစလုံးသည် ခန့်မှန်းချက်တစ်ခု ပတ်ဝန်းကျင် အပိုင်းအခြားတစ်ခုကို report ပြုသည် — သို့သော် အခြေခံအားဖြင့် မတူညီသော အရာများကို ဆိုလိုသည်: frequentist interval သည် စစ်မှန်သော parameter ကို ပုံသေထားပြီး interval ကို ထပ်ခါထပ်ခါ sampling တစ်လျှောက် ကျပန်းအဖြစ် ယူဆသည်; Bayesian interval သည် parameter ကိုယ်တိုင်ကို မသေချာဟု ယူဆပြီး interval ကို ၎င်းအကြောင်း တိုက်ရိုက် probability ဖော်ပြချက်တစ်ခုအဖြစ် ယူဆသည်၊ ဒါကို Stats ↔ ML Bridge က ဂဏန်းတူတူဖြင့် ရှင်းလင်းစွာ ပြသသည်။'
        ),
      },
    },
  },

  qlearning: {
    spark: {
      analogy: bl(
        "Like a video game player who, through pure trial and error across many playthroughs, gradually builds up a mental scorecard of \"how good is each move in each situation\" — and eventually just plays the highest-scoring move every time.",
        'Learns an action-value function Q(s,a) via the Bellman update, converging to the optimal policy under sufficient exploration.',
        'ဗီဒီယိုဂိမ်း ကစားသမားတစ်ဦးက Playthrough များစွာတစ်လျှောက် pure trial and error မှတဆင့် "အခြေအနေတစ်ခုစီတွင် လှုပ်ရှားမှုတစ်ခုစီ ဘယ်လောက်ကောင်းသလဲ" ဆိုသည့် ဉာဏ်ပိုင်း အမှတ်ပေးစာရင်းကို တဖြည်းဖြည်း တည်ဆောက်ပြီး နောက်ဆုံး အမှတ်အမြင့်ဆုံးလှုပ်ရှားမှုကို အမြဲကစားသကဲ့သို့။',
        'Bellman update မှတဆင့် action-value function Q(s,a) ကို သင်ယူပြီး လုံလောက်သော exploration အောက်တွင် optimal policy သို့ ပေါင်းစည်းသည်။'
      ),
      predict: {
        question: blSame('If Q-Learning only ever picks the currently-best-known action and never tries anything new, will it always eventually find the truly optimal policy?', 'Q-Learning သည် လက်ရှိသိထားသော အကောင်းဆုံးလှုပ်ရှားမှုကိုသာ အမြဲရွေးချယ်ပြီး တစ်ခုမှ အသစ်မစမ်းသပ်ခဲ့လျှင် ၎င်းသည် တကယ့် optimal policy ကို နောက်ဆုံးတွင် အမြဲရှာတွေ့နိုင်မည်လား?'),
        options: [blSame('Yes, always', 'ဟုတ်သည်၊ အမြဲ'), blSame('No — it can get stuck never discovering a better untried action', 'မဟုတ်ပါ — မစမ်းသေးသော ပိုကောင်းသည့်လှုပ်ရှားမှု တစ်ခုကို ဘယ်တော့မှ ရှာမတွေ့ဘဲ ငြိနေနိုင်သည်')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase the exploration rate (chance of trying a random, non-best-known action), does the risk of getting permanently stuck in a suboptimal policy rise or fall?', 'Exploration rate (ကျပန်း၊ သိသည့်အကောင်းဆုံးမဟုတ်သော လှုပ်ရှားမှု စမ်းသည့် အခွင့်အလန်း) ကို တိုးလျှင် suboptimal policy ထဲတွင် ထာဝရ ငြိနေသော အန္တရာယ် တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 1 },
      paramLabel: blSame('Exploration rate (ε)', 'Exploration rate (ε)'),
      paramMin: 0, paramMax: 1, paramDefault: 0, paramStep: 0.05, paramDecimals: 2,
      compute: (v) => Math.max(2, 100 * (1 - v * 0.9)),
      outputLabel: blSame('Toy risk of a permanently missed better action (%)', 'ပိုကောင်းသောလှုပ်ရှားမှု ထာဝရလွတ်သွားသော ဥပမာ အန္တရာယ် (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Current Q(buy_gold)=5. Try selling instead and observe reward r=2 with the best next-state value maxₐ\'Q(s\',a\')=8: update Q(buy_gold) ← 5 + 0.1[2 + 0.9(8) − 5] = 5 + 0.1(4.2) = 5.42 — the scorecard nudges toward what was actually observed, not overwritten entirely.',
        'Q(s,a) ← Q(s,a) + α[r + γ·maxₐ\'Q(s\',a\') − Q(s,a)]; α is the learning rate (how much to trust the new observation), γ∈[0,1] discounts future reward, and the bracketed term is the "TD error" — the gap between the old estimate and the newly observed evidence.',
        'လက်ရှိ Q(buy_gold)=5။ ရောင်းခြင်းကို အစား စမ်းပြီး reward r=2 ကို maxₐ\'Q(s\',a\')=8 ဖြင့် သတိပြုမိသည်: Q(buy_gold) ← 5 + 0.1[2 + 0.9(8) − 5] = 5 + 0.1(4.2) = 5.42 — အမှတ်ပေးစာရင်း တကယ်တွေ့ရှိထားသောအရာဆီသို့ အနည်းငယ်ရွှေ့ပြီး လုံးဝပြန်ရေးမထားပါ။',
        'Q(s,a) ← Q(s,a) + α[r + γ·maxₐ\'Q(s\',a\') − Q(s,a)]; α သည် learning rate ဖြစ်ပြီး (တွေ့ရှိချက်အသစ်ကို ဘယ်လောက်ယုံကြည်မလဲ), γ∈[0,1] သည် အနာဂတ် reward ကို discount ပြု၍ ဆွစ်ကွင်းထဲရှိ term သည် "TD error" — အဟောင်းခန့်မှန်းချက်နှင့် တွေ့ရှိထားသော သက်သေအသစ်ကြား ကွာဟချက်ဖြစ်သည်။'
      ),
      faded: bl(
        'If the learning rate α were set to 0, would Q(buy_gold) ever update, no matter what reward is observed? Step 1 — plug α=0 into the update rule. Step 2 — answer: _____.',
        'If the learning rate α were set to 0, would Q(buy_gold) ever update, no matter what reward is observed? Step 1 — plug α=0 into the update rule. Step 2 — answer: _____.',
        'Learning rate α ကို 0 သတ်မှတ်ခဲ့လျှင် reward မည်သို့တွေ့ရှိပါစေ Q(buy_gold) ဘယ်တော့မှ update ဖြစ်မည်လား? အဆင့် ၁ — update rule ထဲ α=0 ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Learning rate α ကို 0 သတ်မှတ်ခဲ့လျှင် reward မည်သို့တွေ့ရှိပါစေ Q(buy_gold) ဘယ်တော့မှ update ဖြစ်မည်လား? အဆင့် ၁ — update rule ထဲ α=0 ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The video-game-player analogy breaks down on stakes: a game player can freely retry after a bad move with zero real-world cost. Q-Learning applied to real trading means every \"exploration\" move genuinely risks real money — which is exactly why the doc flags this family as unpredictable/unstable specifically in live deployment, unlike a sandbox game.",
        'ဗီဒီယိုဂိမ်း ကစားသမား ဆင်တူပုံရိပ်သည် အန္တရာယ်တွင် ပျက်စီးသည်: ဂိမ်းကစားသမားသည် လက်တွေ့ကမ္ဘာ့ ကုန်ကျစရိတ် သုညဖြင့် လှုပ်ရှားမှုမကောင်းလျှင် လွတ်လွတ်လပ်လပ် ပြန်စမ်းနိုင်သည်။ Q-Learning ကို တကယ့် trading တွင် အသုံးချခြင်းသည် "exploration" လှုပ်ရှားမှုတိုင်းသည် တကယ့်ငွေကို တကယ် အန္တရာယ်ဖြစ်စေသည် — ဒါသည် doc က ဒီ family ကို sandbox ဂိမ်းနှင့်မတူဘဲ live deployment တွင် အထူးသဖြင့် ခန့်မှန်းရခက်/မတည်ငြိမ်သည်ဟု flag လုပ်ထားသည့်အကြောင်းရင်း အတိအကျဖြစ်သည်။'
      ),
      caveat: blSame(
        'A real caveat: financial markets provide only one historical path that ever actually happened — unlike a video game that can be replayed millions of times, an RL trading agent can\'t genuinely explore "what if" alternate market histories, severely limiting how much real exploration is even possible.',
        'တကယ့် caveat: ငွေကြေးစျေးကွက်များသည် တကယ်ဖြစ်ပျက်ခဲ့သော သမိုင်းလမ်းကြောင်း တစ်ခုတည်းသာ ပေးသည် — သန်းနှင့်ချီ ပြန်ကစားနိုင်သော ဗီဒီယိုဂိမ်းနှင့်မတူဘဲ RL trading agent တစ်ခုသည် "ဒီလိုဖြစ်ခဲ့ရင်ကော" အခြားစျေးကွက် သမိုင်းများကို တကယ်ပင် exploration မပြုနိုင်ဘဲ တကယ့် exploration ဘယ်လောက်ပင် ဖြစ်နိုင်သည်ကို ပြင်းထန်စွာ ကန့်သတ်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: why does the discount factor γ matter for how "far-sighted" the learned policy ends up being?', 'ပြန်မကြည့်ဘဲ: discount factor γ သည် သင်ယူထားသော policy ဘယ်လောက် "အနာဂတ်ကြည့်" ဖြစ်လာမလဲအတွက် ဘာကြောင့် အရေးကြီးသလဲ?'),
        answer: blSame(
          "γ scales how much future reward counts relative to immediate reward in the update rule. A γ near 0 makes the agent almost entirely short-sighted (only immediate reward matters); a γ near 1 makes distant future rewards count almost as much as immediate ones, encouraging genuinely long-term strategic behavior.",
          'γ သည် update rule တွင် ချက်ချင်း reward နှင့် နှိုင်းယှဉ်လျှင် အနာဂတ် reward ဘယ်လောက် ရေတွက်သလဲကို scale ပြုသည်။ γ 0 အနီးဆိုလျှင် agent ကို ချက်ချင်း reward သာအရေးကြီးအောင် အခြေအနေမြင်ကွင်းတို ဖြစ်စေသည်; γ 1 အနီးဆိုလျှင် ဝေးလံသော အနာဂတ် reward များကို ချက်ချင်း reward နှင့် နီးနီးစပ်စပ် ရေတွက်စေသည်၊ တကယ့် ရေရှည် strategic အပြုအမူကို အားပေးသည်။'
        ),
      },
    },
  },

  actorcritic: {
    spark: {
      analogy: bl(
        "Like a young performer (the actor) who directly decides what to do next, paired with a coach (the critic) watching from the side who scores how good that choice turned out — the performer gets better because the coach's feedback is faster and steadier than trial-and-error alone.",
        'Combines a parameterized policy (actor, updated via policy gradient) with a learned value function (critic) that reduces variance in the policy gradient estimate.',
        'နောက်ဘာလုပ်ရမလဲ တိုက်ရိုက်ဆုံးဖြတ်သော အနုပညာရှင်လူငယ် (actor) ကို ဘေးမှ စောင့်ကြည့်ပြီး ထိုရွေးချယ်မှု ဘယ်လောက်ကောင်းသလဲ အမှတ်ပေးသော coach (critic) နှင့် တွဲစဉ်ပါသကဲ့သို့ — coach ၏ feedback သည် trial-and-error တစ်ခုတည်းထက် ပိုမြန်ပြီး ပိုတည်ငြိမ်သောကြောင့် ကလောင်ရှင် ပိုကောင်းလာသည်။',
        'Policy gradient estimate ၏ variance ကို လျှော့ချပေးသော သင်ယူထားသော value function (critic) နှင့် parameterized policy (actor, policy gradient ဖြင့် update ပြု) ကို ပေါင်းစပ်သည်။'
      ),
      predict: {
        question: blSame('Compared to pure Q-Learning (which learns action values directly, one at a time), can Actor-Critic more naturally handle a continuous range of actions (like "how much gold to buy," any real number)?', 'Pure Q-Learning (action value များကို တစ်ခုချင်းစီ တိုက်ရိုက် သင်ယူသည်) နှင့် နှိုင်းယှဉ်လျှင် Actor-Critic သည် ("ရွှေဘယ်လောက်ဝယ်မလဲ" ကဲ့သို့ real number မည်သည့်တစ်ခုမဆို) ဆက်တိုက် action range ကို ပိုသဘာဝကျစွာ ကိုင်တွယ်နိုင်သလား?'),
        options: [blSame('Yes', 'ဟုတ်သည်'), blSame('No, both handle continuous actions equally poorly', 'မဟုတ်ပါ၊ နှစ်ခုစလုံး ဆက်တိုက် action ကို ညံ့ဖျင်းစွာ တူညီစွာ ကိုင်တွယ်သည်')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As the critic\'s value estimates become more accurate, does the variance (noisiness) of the actor\'s policy updates rise or fall?', 'Critic ၏ value ခန့်မှန်းချက်များ ပိုတိကျလာလျှင် actor ၏ policy update များ၏ variance (noisiness) တက်မလား ကျမလား?'), options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')], correctIndex: 1 },
      paramLabel: blSame('Critic accuracy', 'Critic တိကျမှု'),
      paramMin: 0, paramMax: 10, paramDefault: 0, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.max(3, 100 - v * 9),
      outputLabel: blSame('Toy variance of policy updates', 'Policy update များ၏ ဥပမာ variance'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'The actor tries "buy 10 units," receiving raw reward +$50. Without a critic, that noisy +$50 alone drives the update. With a critic estimating this state was "worth" +$35 on average, the actor instead learns from the advantage +$50-$35=+$15 — a much less noisy, more informative signal about whether THIS SPECIFIC action beat expectations.',
        'Advantage A(s,a)=Q(s,a)-V(s)≈r+γV(s\')-V(s) (using the critic\'s V as a baseline); policy gradient ∇θJ(θ)≈𝔼[∇θlogπθ(a|s)·A(s,a)] has provably lower variance using the advantage than using raw reward, without introducing bias.',
        'Actor သည် "unit 10 ဝယ်ပါ" ဟု စမ်းပြီး raw reward +$50 ရသည်။ Critic မရှိလျှင် ထို noisy +$50 တစ်ခုတည်းက update ကို ဆောင်ရွက်သည်။ Critic က ဒီ state သည် ပျမ်းမျှ +$35 "တန်ဖိုးရှိ" ဟု ခန့်မှန်းလျှင် actor သည် advantage +$50-$35=+$15 မှ သင်ယူသည် — ဒီအမှတ်တိကျသော လှုပ်ရှားမှုသည် မျှော်လင့်ချက်ကို ကျော်လွန်ခဲ့သလားဆိုသည့် noise ပိုနည်း၊ အချက်အလက်ပိုပါသော signal ဖြစ်သည်။',
        'Advantage A(s,a)=Q(s,a)-V(s)≈r+γV(s\')-V(s) (critic ၏ V ကို baseline အဖြစ်သုံး); policy gradient ∇θJ(θ)≈𝔼[∇θlogπθ(a|s)·A(s,a)] သည် bias မထည့်ဘဲ raw reward သုံးထားရာထက် advantage သုံးလျှင် variance နည်းကြောင်း သက်သေပြနိုင်သည်။'
      ),
      faded: bl(
        'If the critic\'s value estimate V(s) were always exactly equal to the raw reward r observed (a perfect, noiseless baseline), what would the advantage A=r-V(s) reduce to? Step 1 — plug V(s)=r into the advantage formula. Step 2 — answer: _____.',
        'If the critic\'s value estimate V(s) were always exactly equal to the raw reward r observed (a perfect, noiseless baseline), what would the advantage A=r-V(s) reduce to? Step 1 — plug V(s)=r into the advantage formula. Step 2 — answer: _____.',
        'Critic ၏ value ခန့်မှန်းချက် V(s) သည် တွေ့ရှိထားသော raw reward r နှင့် အမြဲအတိအကျ ညီမျှခဲ့လျှင် (ပြီးပြည့်စုံ၊ noise မရှိသော baseline), advantage A=r-V(s) သည် ဘာသို့ ကျဉ်းကျသွားမလဲ? အဆင့် ၁ — advantage formula ထဲ V(s)=r ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။',
        'Critic ၏ value ခန့်မှန်းချက် V(s) သည် တွေ့ရှိထားသော raw reward r နှင့် အမြဲအတိအကျ ညီမျှခဲ့လျှင် (ပြီးပြည့်စုံ၊ noise မရှိသော baseline), advantage A=r-V(s) သည် ဘာသို့ ကျဉ်းကျသွားမလဲ? အဆင့် ၁ — advantage formula ထဲ V(s)=r ထည့်ပါ။ အဆင့် ၂ — အဖြေ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'userTrainedModel',
      analogyBreakdown: blSame(
        "The performer-and-coach analogy breaks down on independence: a real coach usually already knows the domain before watching the performer. The critic here starts out just as ignorant as the actor and has to learn its own value estimates from scratch, simultaneously — the two are learning together, not one already-expert critic guiding a novice actor.",
        'ကလောင်ရှင်နှင့် coach ဆင်တူပုံရိပ်သည် လွတ်လပ်မှုတွင် ပျက်စီးသည်: တကယ့် coach တစ်ဦးသည် ကလောင်ရှင်ကို မကြည့်ခင်ကတည်းက နယ်ပယ်ကို သိပြီးသားဖြစ်လေ့ရှိသည်။ ဒီနေရာက critic သည် actor အတိုင်းပင် အစပိုင်းတွင် မသိသေးပြီး ၎င်း၏ ကိုယ်ပိုင် value ခန့်မှန်းချက်များကို အစမှ တစ်ပြိုင်နက် သင်ယူရမည်ဖြစ်သည် — နှစ်ခုစလုံး အတူတကွ သင်ယူနေခြင်းဖြစ်ပြီး ကျွမ်းကျင်ပြီးသား critic တစ်ဦးက novice actor တစ်ဦးကို လမ်းညွှန်ခြင်း မဟုတ်ပါ။'
      ),
      caveat: blSame(
        'A real caveat: because both the actor and critic are being learned simultaneously from the same noisy financial data, errors in one can propagate into the other — an early bad critic estimate can misdirect actor updates before the critic has had a chance to improve.',
        'တကယ့် caveat: actor နှင့် critic နှစ်ခုစလုံးကို noisy ငွေကြေး data အတူတူမှ တစ်ပြိုင်နက် သင်ယူနေသောကြောင့် တစ်ခု၏ အမှားများသည် တစ်ခုထဲသို့ ပြန့်နှံ့နိုင်သည် — critic ကောင်းလာရန် အခွင့်အလန်းမရမီ အစောပိုင်း critic ခန့်မှန်းချက်ညံ့ဖျင်းမှုသည် actor update များကို လမ်းလွှဲစေနိုင်သည်။'
      ),
      retrieval: {
        question: blSame('Without looking back: if you spent an afternoon adjusting the sliders in this app\'s Playground while reading about Actor-Critic, would that be training a real Actor-Critic trading agent?', 'ပြန်မကြည့်ဘဲ: Actor-Critic အကြောင်း ဖတ်နေစဉ် ဒီ app ရဲ့ Playground ထဲက slider တွေကို ညနေတစ်ညနေလုံး ချိန်ညှိနေခဲ့လျှင် ဒါက တကယ့် Actor-Critic trading agent တစ်ခုကို train လုပ်နေတာလား?'),
        answer: blSame(
          "No — per this app's own entry banner, the Playground fits a small, local, disposable demo model to a synthetic dataset for that session only. It never trains, updates, or influences any shared Actor-Critic system, real or otherwise — a genuine reinforcement-learning trading agent would need its own dedicated training pipeline running for far longer than an afternoon.",
          'မဟုတ်ပါ — ဒီ app ရဲ့ ကိုယ်ပိုင် entry banner အရ Playground သည် ထို session အတွက်သာ synthetic dataset ပေါ်တွင် သေးငယ်၊ local၊ throwaway demo model တစ်ခုကို fit လုပ်ပေးသည်။ ၎င်းသည် တကယ့် (သို့) အခြား Actor-Critic system မည်သည်ကိုမျှ ဘယ်တော့မှ train/update/သက်ရောက်စေခြင်းမရှိပါ — တကယ့် reinforcement-learning trading agent တစ်ခုသည် ညနေတစ်ညနေထက် များစွာ ပိုကြာသော ကိုယ်ပိုင် training pipeline လိုအပ်လိမ့်မည်။'
        ),
      },
    },
  },
};
