import { bl, blSame } from '../../lib/mlContent.js';

// Module 2 Learning Design System retrofit (docs/research/ML-Mode-Pedagogy-Research.md
// §4.1) — one Depth Ladder per stage, appended to PIPELINE_STAGES below.
// `stageName` translates the stage label itself (found still hardcoded
// English during this retrofit — a pre-existing Module-11-style gap, fixed
// here rather than left for a future sweep). Mechanism widgets use a small,
// stage-specific compute() rather than a generic filler animation.

// Module 11 audit (see gold.js's identical note in domains/).
export const PIPELINE_TITLE = blSame('The ML Pipeline: From Data to Decision', 'ML Pipeline: ဒေတာမှ ဆုံးဖြတ်ချက်သို့');
export const PIPELINE_INTRO = blSame(
  'Every ML system moves through the same seven stages — click any stage to see what happens there, worked through with gold price forecasting as a running example (previewing Module 6).',
  'ML စနစ်တိုင်းသည် အဆင့်ခုနစ်ဆင့်တူတူကို ဖြတ်သန်းသည် — အဆင့်တစ်ခုခုကို နှိပ်ပြီး ဘာဖြစ်လဲကြည့်ပါ၊ ရွှေဈေးနှုန်း ခန့်မှန်းခြင်းကို ဥပမာအဖြစ် ထားသည် (Module 6 ကို ကြိုတင်ပြသခြင်း)။'
);
export const PIPELINE_WHAT_LBL = blSame('What happens', 'ဘာဖြစ်လဲ');
export const PIPELINE_GOLD_LBL = blSame('Gold worked example', 'ရွှေ ဥပမာ');

// Source: docs/research/ML-Research-Reference.md §1. The Gold worked example
// threads through every stage so this module previews Module 6 (research
// doc's own design note §7.3: "Gold is the strongest flagship domain").
export const PIPELINE_STAGES = [
  {
    id: 'framing',
    n: 1,
    stage: 'Problem framing',
    stageName: blSame('Problem framing', 'ပြဿနာ ဘောင်ကျယ်ခြင်း'),
    spark: {
      analogy: bl(
        'Before a doctor orders a single test, they first decide what kind of question they\'re even answering — "is this a number to track" (blood pressure) or "is this a category to diagnose" (infected / not infected)? Get that wrong and every test afterward is aimed at the wrong target.',
        'Problem framing is choosing the output type before choosing anything else: a continuous number (regression), a category (classification), or a sequence over time (forecasting) — this single choice constrains every model in Module 3 to a compatible subset.',
        'ဆရာဝန်တစ်ယောက် စမ်းသပ်မှုတစ်ခုမှ မမှာမီ ဘယ်လိုမေးခွန်းကို ဖြေဆိုနေတာလဲဆိုတာ ဦးစွာ ဆုံးဖြတ်ရသည် — "ဒါက ခြေရာခံစရာ ဂဏန်းလား" (သွေးပေါင်ချိန်) ဒါမှမဟုတ် "ဒါက ရောဂါရှာဖွေစရာ အမျိုးအစားလား" (ရောဂါပါ/မပါ)? မှားယွင်းစွာ ရွေးလိုက်ရင် နောက်ပိုင်း စမ်းသပ်မှုတိုင်းက မှားယွင်းသောပစ်မှတ်ကို ရည်ရွယ်နေပါတော့မည်။',
        'ပြဿနာဘောင်ကျယ်ခြင်းဆိုသည်မှာ ကျန်တာအားလုံးမတိုင်မီ output type ကို ဦးစွာရွေးချယ်ခြင်းဖြစ်သည်: ဆက်တိုက်ဂဏန်း (regression)၊ အမျိုးအစား (classification)၊ သို့မဟုတ် အချိန်အလိုက် အစီအစဉ် (forecasting) — ဤရွေးချယ်မှုတစ်ခုတည်းသည် Module 3 ရှိ model များအားလုံးကို ကိုက်ညီသောအစုတစ်ခုသို့ ကန့်သတ်လိုက်သည်။'
      ),
      predict: {
        question: bl(
          'A learner wants to predict "will tomorrow\'s gold price be higher or lower than today\'s?" — a yes/no answer, not a dollar figure. What kind of ML problem is this?',
          'A learner wants to predict "will tomorrow\'s gold price be higher or lower than today\'s?" — a yes/no answer, not a dollar figure. What kind of ML problem is this?',
          'သင်ယူသူတစ်ဦးက "မနက်ဖြန် ရွှေဈေးက ဒီနေ့ထက် မြင့်မလား နိမ့်မလား" ကို ခန့်မှန်းချင်သည် — ဒေါ်လာဂဏန်းမဟုတ်ဘဲ ဟုတ်/မဟုတ် အဖြေ။ ဒါက ML ပြဿနာ ဘယ်အမျိုးအစားလဲ?',
          'သင်ယူသူတစ်ဦးက "မနက်ဖြန် ရွှေဈေးက ဒီနေ့ထက် မြင့်မလား နိမ့်မလား" ကို ခန့်မှန်းချင်သည် — ဒေါ်လာဂဏန်းမဟုတ်ဘဲ ဟုတ်/မဟုတ် အဖြေ။ ဒါက ML ပြဿနာ ဘယ်အမျိုးအစားလဲ?'
        ),
        options: [
          bl('Regression', 'Regression', 'Regression', 'Regression'),
          bl('Classification', 'Classification', 'Classification', 'Classification'),
          bl('Forecasting', 'Forecasting', 'Forecasting', 'Forecasting'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag toward "changes constantly," will the best framing move toward forecasting or toward a rare-event classifier?', '"အမြဲပြောင်းလဲသည်" ဘက်သို့ ဆွဲသွားလျှင် အသင့်တော်ဆုံး framing သည် forecasting ဘက်သို့ ရွှေ့မလား ရှားပါးအဖြစ်အပျက် classifier ဘက်သို့ ရွှေ့မလား?'),
        options: [blSame('Toward forecasting', 'Forecasting ဘက်သို့'), blSame('Toward rare-event classification', 'ရှားပါးအဖြစ်အပျက် classification ဘက်သို့')],
        correctIndex: 0,
      },
      paramLabel: blSame('How often does the target value change?', 'Target တန်ဖိုး ဘယ်လောက်ကြာကြာ ပြောင်းလဲသလဲ'),
      paramMin: 0, paramMax: 10, paramDefault: 5, paramStep: 1, paramDecimals: 0,
      compute: (v) => (v <= 2 ? 0 : v <= 7 ? 1 : 2),
      outputLabel: blSame('Best framing (0=rare event, 5=daily, 10=continuous tick)', 'အသင့်တော်ဆုံး framing (0=ရှားပါးအဖြစ်အပျက်၊ 5=နေ့စဉ်၊ 10=ဆက်တိုက်)'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'Worked example: is "gold spot price" regression, classification, or forecasting? Step 1 — what does the output look like? A number like $4,015.20, not a label. Step 2 — is it time-indexed (does yesterday\'s value help predict today\'s)? Yes, prices are serially correlated. Step 3 — conclusion: it\'s framed as time-series regression (forecasting), which is why Module 6 uses ARIMA/LSTM/XGBoost/GARCH — all regression-capable, time-aware models — and not a plain classifier.',
        'Formally: target y_t ∈ ℝ (continuous), indexed by t (time), with autocorrelation Cov(y_t, y_{t-1}) ≠ 0. This rules out unordered classification (no meaningful "categories" for a continuous price) and argues for models that either explicitly model time (ARIMA, LSTM) or at minimum respect chronological train/test splits (Module 5\'s walk-forward validation).',
        'ဖြေရှင်းချက်ဥပမာ: "ရွှေ spot ဈေးနှုန်း" သည် regression, classification, ဒါမှမဟုတ် forecasting လား? အဆင့် ၁ — output က ဘယ်လိုပုံစံလဲ? $4,015.20 ကဲ့သို့ ဂဏန်းတစ်ခု၊ label မဟုတ်။ အဆင့် ၂ — အချိန်အညွှန်း ရှိသလား (မနေ့ကတန်ဖိုးက ဒီနေ့ကို ခန့်မှန်းရာမှာ အထောက်အကူဖြစ်သလား)? ဟုတ်သည်၊ ဈေးနှုန်းများသည် ဆက်စပ်နေသည်။ အဆင့် ၃ — နိဂုံး: ၎င်းကို time-series regression (forecasting) အဖြစ် ဘောင်ကျယ်သည်၊ ဒါကြောင့် Module 6 က ARIMA/LSTM/XGBoost/GARCH — regression လုပ်နိုင်၊ အချိန်သိသော model များ — ကို သုံးပြီး plain classifier မသုံးခြင်းဖြစ်သည်။',
        'တရားဝင်: target y_t ∈ ℝ (ဆက်တိုက်)၊ t (အချိန်) ဖြင့် ညွှန်းထားပြီး၊ autocorrelation Cov(y_t, y_{t-1}) ≠ 0။ ဒါက အစီအစဉ်မဲ့ classification (ဆက်တိုက်ဈေးနှုန်းအတွက် "အမျိုးအစား" အဓိပ္ပာယ်မရှိ) ကို ဖယ်ထုတ်ပြီး အချိန်ကို တိုက်ရိုက်ပုံဖော်သော model များ (ARIMA, LSTM) သို့မဟုတ် အနည်းဆုံး အချိန်အစီအစဉ်အတိုင်း train/test split လုပ်ရန် (Module 5 ၏ walk-forward validation) လိုအပ်ကြောင်း ထောက်ပြသည်။'
      ),
      faded: bl(
        'Now you try: is "will the Fed cut rates at the next meeting — yes or no?" regression, classification, or forecasting? Step 1 — the output is one of two labels. Step 2 — _____. Step 3 — conclusion: _____.',
        'Now you try: is "will the Fed cut rates at the next meeting — yes or no?" regression, classification, or forecasting? Output is binary. Fill in: is there a meaningful "amount" being predicted, or just a category? Conclusion: _____.',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: "Fed က နောက်အစည်းအဝေးမှာ အတိုးနှုန်းလျှော့ချမလား — ဟုတ်/မဟုတ်" ဆိုတာ regression, classification, ဒါမှမဟုတ် forecasting လား? အဆင့် ၁ — output သည် label နှစ်ခုအနက် တစ်ခုဖြစ်သည်။ အဆင့် ၂ — _____။ အဆင့် ၃ — နိဂုံး: _____။',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: output က binary ဖြစ်သည်။ ဖြည့်ပါ: ဂဏန်းပမာဏ ခန့်မှန်းနေတာလား၊ အမျိုးအစားသာလား? နိဂုံး: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The doctor analogy breaks down here: a doctor can sometimes order both a number-test and a category-test for the same patient. In ML, one target usually gets one framing — you don't half-frame a problem, because the model families available downstream genuinely differ by framing.",
        'ဆရာဝန် ဆင်တူပုံရိပ်သည် ဒီနေရာမှာ ပျက်စီးသည်: ဆရာဝန်တစ်ဦးသည် လူနာတစ်ဦးတည်းအတွက် ဂဏန်းစစ်ဆေးမှုနှင့် အမျိုးအစားစစ်ဆေးမှု နှစ်ခုလုံး တစ်ခါတစ်ရံ မှာနိုင်သည်။ ML တွင် target တစ်ခုသည် ပုံမှန်အားဖြင့် framing တစ်ခုသာ ရသည် — ပြဿနာတစ်ခုကို ထက်ဝက် framing မလုပ်နိုင်ပါ၊ ဘာကြောင့်ဆိုသော် framing အလိုက် ရရှိနိုင်သော model family များ တကယ်ကွာခြားသောကြောင့်ဖြစ်သည်။'
      ),
      caveat: blSame(
        'A real caveat: some problems are legitimately reframable — "will gold rise more than 2%" can be built as either a regression (predict the % change, then threshold it) or a classification (predict yes/no directly). Which is better is itself a design decision, not a fixed fact about the problem.',
        'တကယ့် caveat: ပြဿနာအချို့ကို reframe လုပ်ခွင့်ရှိသည် — "ရွှေဈေး ၂% ထက်ပိုတက်မလား" ကို regression (% ပြောင်းလဲမှုကို ခန့်မှန်းပြီး threshold ချမှတ်ခြင်း) ဒါမှမဟုတ် classification (ဟုတ်/မဟုတ် တိုက်ရိုက်ခန့်မှန်းခြင်း) နှစ်မျိုးလုံးဖြင့် တည်ဆောက်နိုင်သည်။ ဘယ်ဟာက ပိုကောင်းလဲဆိုတာ ကိုယ်တိုင်ကလည်း ဒီဇိုင်းဆုံးဖြတ်ချက်တစ်ခုဖြစ်ပြီး ပြဿနာအကြောင်း ပုံသေအချက်အလက်တစ်ခု မဟုတ်ပါ။'
      ),
      retrieval: {
        question: blSame(
          'Without looking back: why does "gold price is a number that changes daily" rule out treating it as a classification problem?',
          'ပြန်မကြည့်ဘဲ: "ရွှေဈေးနှုန်းသည် နေ့စဉ်ပြောင်းလဲသော ဂဏန်းတစ်ခုဖြစ်သည်" ဆိုတာက classification ပြဿနာအဖြစ် ကိုင်တွယ်ခြင်းကို ဘာကြောင့် ဖယ်ထုတ်ရသလဲ?'
        ),
        answer: blSame(
          "Classification needs discrete, unordered (or at least finite) categories to sort into. A continuous, ever-changing price has no natural finite category set — you'd have to artificially bucket it, throwing away precision the regression framing keeps.",
          'Classification သည် ခွဲထားနိုင်သော finite category များ လိုအပ်သည်။ ဆက်တိုက်၊ အမြဲပြောင်းလဲနေသော ဈေးနှုန်းတွင် သဘာဝ finite category set မရှိပါ — ၎င်းကို artificial ဖြစ်အောင် bucket ခွဲရမည်ဖြစ်ပြီး၊ regression framing က ထိန်းသိမ်းထားသည့် တိကျမှုကို စွန့်ပစ်ရမည်ဖြစ်သည်။'
        ),
      },
    },
    question: bl(
      'What kind of answer am I even trying to produce?',
      'What kind of answer am I trying to produce — regression, classification, or forecasting?',
      'ငါဖြေချင်တဲ့ အဖြေက ဘယ်လိုအမျိုးအစားလဲ။',
      'ဖြေရှင်းလိုသည့် ပြဿနာသည် regression (ဆက်တိုက်ကိန်း)၊ classification (အမျိုးအစားခွဲခြင်း) သို့မဟုတ် forecasting (အချိန်ကာလအလိုက် ခန့်မှန်းခြင်း) တို့အနက် မည်သည့်အမျိုးအစားလဲ။'
    ),
    what: bl(
      'Decide up front what shape the output needs: a number (regression), a category (classification), or a sequence of future values (forecasting).',
      'Decide regression (continuous number), classification (category), or forecasting (sequential, time-indexed) before touching data — this choice determines every downstream step, including which models in Module 3 are even candidates.',
      'အဖြေက ဂဏန်းတစ်ခုလား (regression)၊ အမျိုးအစားတစ်ခုလား (classification)၊ ဒါမှမဟုတ် အနာဂတ်တန်ဖိုးများ တစ်ဆက်တည်း (forecasting) လား ဆိုတာကို အချက်အလက်မထိခင် ဦးစွာဆုံးဖြတ်ရမည်။',
      'Regression (ဆက်တိုက်ဂဏန်း)၊ classification (အမျိုးအစား) သို့မဟုတ် forecasting (အချိန်-အညွှန်း အစီအစဉ်) ဟူ၍ ဦးစွာဆုံးဖြတ်ရသည် — ဤရွေးချယ်မှုသည် Module 3 ရှိ မည်သည့်ပုံစံများ အသုံးပြုနိုင်သည်ကိုပါ ဆုံးဖြတ်ပေးသည်။'
    ),
    goldExample: bl(
      'Gold price is a number that changes every day → this is a regression/forecasting problem, not classification.',
      'Gold spot price is a continuous, time-indexed target → framed as a time-series regression (forecasting) problem, ruling out classification-only models like plain Naive Bayes.',
      'ရွှေစျေးနှုန်းသည် နေ့စဉ်ပြောင်းလဲနေသော ဂဏန်းတစ်ခုဖြစ်သည် → ၎င်းသည် classification မဟုတ်ဘဲ regression/forecasting ပြဿနာဖြစ်သည်။',
      'ရွှေစျေးနှုန်းသည် အချိန်နှင့်တပြေးညီ ပြောင်းလဲနေသော ဆက်တိုက်တန်ဖိုးဖြစ်သဖြင့် time-series regression (forecasting) ပြဿနာအဖြစ် သတ်မှတ်သည် — Naive Bayes ကဲ့သို့ classification-only ပုံစံများကို ဖယ်ထုတ်ထားသည်။'
    ),
  },
  {
    id: 'collection',
    n: 2,
    stage: 'Data collection',
    stageName: blSame('Data collection', 'ဒေတာ စုဆောင်းခြင်း'),
    spark: {
      analogy: bl(
        'A restaurant\'s menu is only as good as its supply chain — someone has to decide which farms to buy from, negotiate contracts, and physically get ingredients to the kitchen before any cooking can start. A model is the same: someone has to decide which data sources to trust and build the pipeline that pulls them in, before any "learning" can happen.',
        'Data collection is the engineering step that determines the evidence ceiling for every stage after it — an engineer designs and builds the specific pipeline (API calls, database queries, scraped sources) that will feed the model, source by source.',
        'စားသောက်ဆိုင်တစ်ဆိုင်ရဲ့ menu ဟာ ၎င်းရဲ့ ပစ္စည်းထောက်ပံ့ရေးကွင်းဆက်လောက်ပဲ ကောင်းနိုင်သည် — ဘယ်လယ်ယာစိုက်ခင်းတွေဆီက ဝယ်မလဲ၊ contract ဘယ်လိုညှိနှိုင်းမလဲ၊ ချက်ပြုတ်မှု မစတင်မီ ပစ္စည်းတွေကို မီးဖိုချောင်ထဲ ဘယ်လိုတကယ်ရောက်အောင်ယူလာမလဲဆိုတာ လူတစ်ယောက်က ဆုံးဖြတ်ရသည်။ Model တစ်ခုလည်း အလားတူပါပဲ — "သင်ယူခြင်း" မစတင်မီ ဘယ် data source ကို ယုံကြည်မလဲဆိုတာ လူတစ်ယောက်က ဆုံးဖြတ်ပြီး ၎င်းတို့ကို ဆွဲယူမည့် pipeline ကို တည်ဆောက်ရသည်။',
        'Data collection ဆိုသည်မှာ နောက်ပိုင်းအဆင့်တိုင်းအတွက် သက်သေခံအထောက်အထား၏ အမြင့်ဆုံးအကန့်အသတ်ကို ဆုံးဖြတ်ပေးသော engineering အဆင့်ဖြစ်သည် — engineer တစ်ဦးက model ကို ကျွေးမည့် pipeline အတိအကျ (API calls, database query, scrape လုပ်သော source) ကို source တစ်ခုချင်းစီအလိုက် ဒီဇိုင်းလုပ်ပြီး တည်ဆောက်သည်။'
      ),
      predict: {
        question: bl(
          'A gold-forecasting model needs central-bank gold-purchase data. Where does that data come from?',
          'A gold-forecasting model needs central-bank gold-purchase data. Where does that data come from?',
          'ရွှေဈေး ခန့်မှန်းသည့် model တစ်ခုသည် ဗဟိုဘဏ်ရွှေဝယ်ယူမှု data လိုအပ်သည်။ ဒီ data က ဘယ်ကလာသလဲ?',
          'ရွှေဈေး ခန့်မှန်းသည့် model တစ်ခုသည် ဗဟိုဘဏ်ရွှေဝယ်ယူမှု data လိုအပ်သည်။ ဒီ data က ဘယ်ကလာသလဲ?'
        ),
        options: [
          bl('The model detects it needs this data and fetches it itself', 'Model က ဒီ data လိုအပ်ကြောင်း သတိထားမိပြီး သူ့ဘာသာ ရယူသည်', 'Model က ဒီ data လိုအပ်ကြောင်း သတိထားမိပြီး သူ့ဘာသာ ရယူသည်', 'Model က ဒီ data လိုအပ်ကြောင်း သတိထားမိပြီး သူ့ဘာသာ ရယူသည်'),
          bl('An engineer specifically chose the World Gold Council as a source and built a pipeline to pull its reports', 'Engineer တစ်ဦးက World Gold Council ကို source အဖြစ် အထူးရွေးချယ်ပြီး ၎င်း၏ report များကို ဆွဲယူမည့် pipeline တည်ဆောက်ခဲ့သည်', 'Engineer တစ်ဦးက World Gold Council ကို source အဖြစ် အထူးရွေးချယ်ပြီး ၎င်း၏ report များကို ဆွဲယူမည့် pipeline တည်ဆောက်ခဲ့သည်', 'Engineer တစ်ဦးက World Gold Council ကို source အဖြစ် အထူးရွေးချယ်ပြီး ၎င်း၏ report များကို ဆွဲယူမည့် pipeline တည်ဆောက်ခဲ့သည်'),
          bl('It comes bundled automatically with any ML library', 'ML library မည်သည်နှင့်မဆို အလိုအလျောက် ပါလာသည်', 'ML library မည်သည်နှင့်မဆို အလိုအလျောက် ပါလာသည်', 'ML library မည်သည်နှင့်မဆို အလိုအလျောက် ပါလာသည်'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag missing/messy data upward, does the quality ceiling on every later stage go up or down?', 'ကွက်လပ်/မှားနေသော data ကို အထက်သို့ ဆွဲလျှင် နောက်ပိုင်းအဆင့်တိုင်း၏ အရည်အသွေးအမြင့်ဆုံးအကန့်အသတ် မြင့်တက်မလား ကျဆင်းမလား?'),
        options: [blSame('Goes up', 'မြင့်တက်သည်'), blSame('Goes down', 'ကျဆင်းသည်')],
        correctIndex: 1,
      },
      paramLabel: blSame('% of raw data with missing/messy values', '% raw data ကွက်လပ်/မှားနေသော တန်ဖိုးများ'),
      paramMin: 0, paramMax: 60, paramDefault: 10, paramStep: 5, paramDecimals: 0,
      compute: (v) => Math.max(20, 100 - v * 1.3),
      outputLabel: blSame('Ceiling on every later stage\'s quality (%)', 'နောက်ပိုင်းအဆင့်တိုင်း၏ အရည်အသွေး အမြင့်ဆုံးအကန့်အသတ် (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Worked example: Module 6\'s five Gold drivers each needed their own source decided by hand. Step 1 — real yields: TIPS market data (a specific bond-market feed). Step 2 — DXY: a currency-index provider. Step 3 — central-bank demand: the World Gold Council\'s quarterly reports specifically, not a generic "gold data" API. Step 4 — geopolitical risk: news/event feeds. Every one of these was a deliberate choice, not something the model discovered on its own.',
        'Five source types for five drivers, each chosen for a documented reason: real yields (TIPS) for the single most-cited driver, DXY for dollar-pricing exposure, Fed statements for policy path, WGC reports specifically because they\'re the authoritative central-bank purchase source, geopolitical/news feeds for the risk index. None of this routing exists without a human decision behind it.',
        'ဖြေရှင်းချက်ဥပမာ: Module 6 ၏ Gold driver ငါးခုတစ်ခုစီအတွက် သီးခြား source ကို လက်ဖြင့် ဆုံးဖြတ်ရသည်။ အဆင့် ၁ — real yields: TIPS market data (bond-market feed တစ်ခုအတိအကျ)။ အဆင့် ၂ — DXY: currency-index ပေးသူ။ အဆင့် ၃ — ဗဟိုဘဏ်ဝယ်လိုအား: generic "gold data" API မဟုတ်ဘဲ World Gold Council ၏ သုံးလပတ် report အတိအကျ။ အဆင့် ၄ — ပထဝီရေးအန္တရာယ်: သတင်း/event feed။ ဒါတွေအားလုံးဟာ model က သူ့ဘာသာတွေ့ရှိလိုက်တာ မဟုတ်ဘဲ ရည်ရွယ်ချက်ရှိရှိ ရွေးချယ်မှုတွေချည်းဖြစ်သည်။',
        'Driver ငါးခုအတွက် source အမျိုးအစားငါးမျိုး၊ တစ်ခုစီကို မှတ်တမ်းရှိသော အကြောင်းရင်းနှင့်တကွ ရွေးချယ်ထားသည်: အများဆုံးကိုးကားခံရသော driver အတွက် real yields (TIPS)၊ ဒေါ်လာစျေးနှုန်းသတ်မှတ်မှုအတွက် DXY၊ မူဝါဒလမ်းကြောင်းအတွက် Fed ထုတ်ပြန်ချက်များ၊ authoritative ဗဟိုဘဏ်ဝယ်ယူမှုရင်းမြစ်ဖြစ်သောကြောင့် WGC report အတိအကျ၊ risk index အတွက် ပထဝီရေး/သတင်း feed။ ဒါအားလုံးနောက်ကွယ်မှာ လူ့ဆုံးဖြတ်ချက် မရှိပဲ ဘာမှ routing မဖြစ်ပေါ်ပါ။'
      ),
      faded: bl(
        'Now you try: Module 9\'s Politics lab needs polling data and news sentiment. Step 1 — polls: which kind of organization would you specifically choose as a source, and why that one over a random blog? Step 2 — news sentiment: _____. Step 3 — conclusion about who decided this routing: _____.',
        'Now you try: name a specific, credible source type for election polling data and one for news sentiment, then state explicitly who made that choice (hint: it wasn\'t the model).',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: Module 9 ၏ Politics lab က poll data နှင့် news sentiment လိုအပ်သည်။ အဆင့် ၁ — poll: ဘယ်လို organization အမျိုးအစားကို source အဖြစ် အထူးရွေးချယ်မလဲ၊ blog ကျပန်းတစ်ခုထက် ဘာကြောင့် ဒီတစ်ခုကို ရွေးချယ်ရသလဲ? အဆင့် ၂ — news sentiment: _____။ အဆင့် ၃ — ဒီ routing ကို ဘယ်သူ ဆုံးဖြတ်ခဲ့လဲဆိုတဲ့ နိဂုံး: _____။',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: ရွေးကောက်ပွဲ poll data အတွက် တိကျယုံကြည်ရသော source အမျိုးအစားတစ်ခုနှင့် news sentiment အတွက် တစ်ခုကို ပြောပြီး ဘယ်သူက ဒီရွေးချယ်မှုလုပ်ခဲ့လဲ တိတိကျကျ ဖော်ပြပါ (hint: model မဟုတ်ပါ)။'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'autonomousDataAcquisition',
      analogyBreakdown: blSame(
        "The supply-chain analogy breaks down in one place: a restaurant's supply chain can adapt week to week as a chef notices a new need. An ML data pipeline is far more rigid — adding a new source means an engineer has to go build a new connector, not just \"decide\" to use it.",
        'ပစ္စည်းထောက်ပံ့ရေးကွင်းဆက် ဆင်တူပုံရိပ်သည် နေရာတစ်ခုမှာ ပျက်စီးသည်: စားသောက်ဆိုင်ရဲ့ ပစ္စည်းထောက်ပံ့ရေးကွင်းဆက်သည် chef တစ်ဦးက လိုအပ်ချက်အသစ်တွေ့လျှင် အပတ်စဉ် လိုက်လျောညီထွေဖြစ်နိုင်သည်။ ML data pipeline သည် ပိုမို တင်းကျပ်သည် — source အသစ်တစ်ခု ထည့်ခြင်းဆိုသည်မှာ engineer တစ်ဦးက connector အသစ် သွားတည်ဆောက်ရမည်ဖြစ်ပြီး "ဆုံးဖြတ်လိုက်ရုံ" မဟုတ်ပါ။'
      ),
      caveat: blSame(
        "A real caveat: some modern systems do include automated data-refresh schedulers that re-pull from already-configured sources on a timer. That's still not the model \"deciding\" anything — it's a human-built cron job hitting human-chosen endpoints, indistinguishable in kind from a person manually re-running the same pull.",
        'တကယ့် caveat: modern system အချို့တွင် ပြင်ဆင်ပြီးသား source များမှ timer အလိုက် ပြန်လည်ဆွဲယူသော automated data-refresh scheduler ပါဝင်နိုင်သည်။ ဒါဟာ model က "ဆုံးဖြတ်" နေတာ မဟုတ်သေးပါ — လူတည်ဆောက်ထားသော cron job တစ်ခုက လူရွေးချယ်ထားသော endpoint ကို ထိသွားတာဖြစ်ပြီး၊ လူက ကိုယ်တိုင် ပြန်လည်လုပ်ဆောင်တာနှင့် သဘောသဘာဝချင်း ခွဲခြား၍မရပါ။'
      ),
      retrieval: {
        question: blSame(
          'Without looking back: if a model "notices" its accuracy is dropping because a new economic indicator became available, what actually has to happen for that indicator to be added to the pipeline?',
          'ပြန်မကြည့်ဘဲ: model တစ်ခုက စီးပွားရေးညွှန်းကိန်းအသစ်တစ်ခု ရရှိလာတာကြောင့် သူ့တိကျမှု ကျဆင်းနေတယ်ဆိုတာ "သတိထားမိ" လိုက်ရင် အဲ့ဒီ indicator ကို pipeline ထဲ ထည့်ဖို့ တကယ်ဘာဖြစ်ရမလဲ?'
        ),
        answer: blSame(
          "A human has to notice the accuracy drop (probably via Module 5's monitoring stage), investigate why, decide the new indicator is worth adding, and then engineer a new data connector for it. The model itself has no mechanism to request, discover, or pull in new sources on its own.",
          'လူတစ်ယောက်က တိကျမှုကျဆင်းနေတာကို သတိထားမိရမည် (Module 5 ၏ monitoring အဆင့်မှတစ်ဆင့် ဖြစ်နိုင်သည်)၊ ဘာကြောင့်လဲ စုံစမ်းရမည်၊ indicator အသစ်ကို ထည့်ရန် တန်ဖိုးရှိကြောင်း ဆုံးဖြတ်ရမည်၊ ပြီးရင် ၎င်းအတွက် data connector အသစ်ကို engineer လုပ်ရမည်။ Model ကိုယ်တိုင်မှာ source အသစ်တောင်းဆို၊ ရှာဖွေ၊ သို့မဟုတ် ဆွဲယူနိုင်သော mechanism လုံးဝမရှိပါ။'
        ),
      },
    },
    question: bl(
      'What evidence do I actually have?',
      'What evidence do I have, and from which sources?',
      'ငါ့မှာ ဘယ်လို အထောက်အထားရှိသလဲ။',
      'မည်သည့် အချက်အလက်ရင်းမြစ်များမှ အထောက်အထားများ ရရှိထားသနည်း။'
    ),
    what: bl(
      'Pull raw numbers from wherever they live: government statistics agencies, market data feeds, polling aggregators, news archives.',
      'Pull from APIs, databases, scraped sources, statistical agencies (FRED, IMF, World Gold Council, polling aggregators) — the quality ceiling of every later stage is set here.',
      'အစိုးရစာရင်းအင်းဌာနများ၊ စျေးကွက်အချက်အလက်များ၊ စစ်တမ်းစုစည်းရေးဌာနများ၊ သတင်းမော်ကွန်းများကဲ့သို့ ရင်းမြစ်များမှ ကြမ်းအချက်အလက်များကို ရယူသည်။',
      'API များ၊ ဒေတာဘေ့စ်များ၊ statistical agencies (FRED, IMF, World Gold Council, စစ်တမ်းစုစည်းရေးများ) မှ ရယူသည် — နောက်ပိုင်းအဆင့်အားလုံး၏ အရည်အသွေးအမြင့်ဆုံးအကန့်အသတ်ကို ဤနေရာတွင် သတ်မှတ်လိုက်သည်။'
    ),
    goldExample: bl(
      'Pull real yields and DXY from market data, central-bank gold purchase reports from the World Gold Council, and geopolitical event feeds.',
      'Real yields (TIPS), DXY, Fed policy statements, World Gold Council central-bank purchase reports, geopolitical event/news feeds — five distinct source types for five drivers (Module 6).',
      'အမှန်တကယ် အတိုးနှုန်းနှင့် DXY ကို စျေးကွက်အချက်အလက်မှ၊ ဗဟိုဘဏ်ရွှေဝယ်ယူမှု အစီရင်ခံစာများကို World Gold Council မှ၊ နိုင်ငံရေးအခြေအနေ သတင်းများကို ရယူသည်။',
      'Real yields (TIPS)၊ DXY၊ Fed မူဝါဒထုတ်ပြန်ချက်များ၊ World Gold Council ၏ ဗဟိုဘဏ်ဝယ်ယူမှုအစီရင်ခံစာများ၊ နိုင်ငံရေးအဖြစ်အပျက်/သတင်းရင်းမြစ်များ — Module 6 ၏ drivers ငါးခုအတွက် ရင်းမြစ်ငါးမျိုး။'
    ),
  },
  {
    id: 'preparation',
    n: 3,
    stage: 'Data preparation',
    stageName: blSame('Data preparation', 'ဒေတာ ပြင်ဆင်ခြင်း'),
    spark: {
      analogy: bl(
        'Imagine trying to compare two runners\' speeds when one\'s time was recorded in minutes and the other\'s in seconds — you\'d get a nonsense answer unless you converted both to the same unit first. Raw data from different sources is exactly this messy before preparation: different frequencies, different scales, gaps where a reading was missed.',
        'Data preparation aligns frequencies, fills or flags gaps, and rescales inputs so a model sees comparable numbers, not artifacts of how each source happened to record its data.',
        'ပြေးသူနှစ်ဦးရဲ့ အမြန်နှုန်းကို နှိုင်းယှဉ်ကြည့်တဲ့အခါ တစ်ဦးရဲ့အချိန်ကို မိနစ်နဲ့မှတ်ထားပြီး တစ်ဦးကို စက္ကန့်နဲ့မှတ်ထားရင် ကိုက်ညီအောင် ပြောင်းမထားမချင်း အဓိပ္ပာယ်မရှိတဲ့ အဖြေရလိမ့်မည်။ ပြင်ဆင်မှုမလုပ်ခင် ကွဲပြားသော source များမှ raw data များသည် ဒီလိုပင် ရှုပ်ထွေးသည်: ကွဲပြားသော ကြိမ်နှုန်း၊ ကွဲပြားသော scale၊ ဖတ်ခြင်းလွတ်သွားသော ကွက်လပ်များ။',
        'Data preparation သည် ကြိမ်နှုန်းများကို ချိန်ညှိပြီး၊ ကွက်လပ်များကို ဖြည့်/အမှတ်အသားပြု၍၊ input များကို rescale ပြုလုပ်ပေးသဖြင့် model သည် source တစ်ခုစီ မှတ်တမ်းတင်ပုံ၏ artifact များမဟုတ်ဘဲ နှိုင်းယှဉ်နိုင်သောဂဏန်းများကို မြင်ရသည်။'
      ),
      predict: {
        question: bl(
          "Gold trades every business day; central-bank purchase data arrives once a quarter. Feeding both into a model unaligned — what happens?",
          "Gold trades every business day; central-bank purchase data arrives once a quarter. Feeding both into a model unaligned — what happens?",
          'ရွှေကို ကုန်သွယ်ရေးနေ့တိုင်း ရောင်းဝယ်နေသော်လည်း ဗဟိုဘဏ်ဝယ်ယူမှု data က သုံးလတစ်ကြိမ်သာ ထွက်သည်။ ချိန်မညှိဘဲ model ထဲ ထည့်လိုက်ရင် ဘာဖြစ်မလဲ?',
          'ရွှေကို ကုန်သွယ်ရေးနေ့တိုင်း ရောင်းဝယ်နေသော်လည်း ဗဟိုဘဏ်ဝယ်ယူမှု data က သုံးလတစ်ကြိမ်သာ ထွက်သည်။ ချိန်မညှိဘဲ model ထဲ ထည့်လိုက်ရင် ဘာဖြစ်မလဲ?'
        ),
        options: [
          bl('Nothing — models automatically handle any mismatched frequency', 'ဘာမှမဖြစ်ပါ — model များသည် ကြိမ်နှုန်းမတူညီမှုမည်သို့ကိုမဆို အလိုအလျောက် ကိုင်တွယ်သည်'),
          bl('The model breaks, or silently learns a distorted, mostly-missing-data version of the quarterly driver', 'Model ပျက်စီးသည် သို့မဟုတ် သုံးလပတ် driver ၏ ကွက်လပ်များစွာပါသော ပုံပျက်ပြောင်းသွားသော version ကို အသိမသိ သင်ယူသည်'),
          bl('The quarterly data automatically becomes daily on its own', 'သုံးလပတ် data သည် နေ့စဉ်ဖြစ်အောင် သူ့ဘာသာ အလိုအလျောက် ပြောင်းသွားသည်'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag the frequency mismatch wider, does the % of usable joined rows rise or fall?', 'ကြိမ်နှုန်းကွာဟမှုကို ပိုကျယ်စေအောင် ဆွဲလျှင် သုံးလို့ရသော joined row % တက်မလား ကျမလား?'),
        options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')],
        correctIndex: 1,
      },
      paramLabel: blSame('Frequency mismatch left unaligned (days between readings)', 'ချိန်မညှိထားသော ကြိမ်နှုန်းကွာဟမှု (ဖတ်ချက်ကြားရက်)'),
      paramMin: 1, paramMax: 90, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.max(5, 100 - v * 1.1),
      outputLabel: blSame('% of rows a naive join keeps usable', 'naive join က သုံးလို့ရအောင် ထိန်းထားနိုင်သော row %'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Worked example: aligning daily gold price with quarterly central-bank demand. Step 1 — pick an alignment rule: forward-fill (repeat the last known quarterly value for every day until the next report). Step 2 — apply it: Q1\'s reported 16-ton figure gets attached to every daily gold-price row from Jan through March. Step 3 — result: one row per trading day, every row now has both a price and a (repeated but legitimate) demand figure — ready for a model.',
        'Forward-fill is one valid alignment strategy among several (interpolation, aggregation-to-lower-frequency are others); the choice matters because forward-filling assumes the quarterly value stays informative for the whole quarter, which is reasonable for a slow-moving structural driver like central-bank demand but would be a poor choice for a fast-moving one.',
        'ဖြေရှင်းချက်ဥပမာ: နေ့စဉ်ရွှေဈေးနှုန်းကို သုံးလပတ် ဗဟိုဘဏ်ဝယ်လိုအားနှင့် ချိန်ညှိခြင်း။ အဆင့် ၁ — ချိန်ညှိမှု rule ရွေးချယ်ပါ: forward-fill (နောက်ဆုံးသိရသော သုံးလပတ်တန်ဖိုးကို report အသစ်မရောက်မီ နေ့တိုင်းအတွက် ထပ်ခါထပ်ခါသုံးခြင်း)။ အဆင့် ၂ — အသုံးချပါ: Q1 ၏ report ၁၆ တန်ကိန်းသည် ဇန်နဝါရီမှ မတ်လအထိ နေ့စဉ်ရွှေဈေးနှုန်း row တိုင်းနှင့် ချိတ်ဆက်သွားသည်။ အဆင့် ၃ — ရလဒ်: ရောင်းဝယ်သောနေ့တစ်နေ့ကို row တစ်ခု၊ row တိုင်းတွင် ဈေးနှုန်းနှင့် (ထပ်ခါထပ်ခါသော်လည်း တရားဝင်သော) ဝယ်လိုအားကိန်း နှစ်ခုစလုံးရှိပြီ — model အတွက် အသင့်ဖြစ်သည်။',
        'Forward-fill သည် တရားဝင် ချိန်ညှိမှုနည်းလမ်းများစွာအနက် တစ်ခုဖြစ်သည် (interpolation, lower-frequency သို့ aggregation တွေလည်းရှိသည်); ဒီရွေးချယ်မှုက အရေးကြီးသည် ဘာကြောင့်ဆိုသော် forward-fill က သုံးလပတ်တန်ဖိုးသည် သုံးလပတ်တစ်ခုလုံးအတွက် အချက်အလက်ရှိနေဆဲဟု ယူဆထားသောကြောင့်ဖြစ်ပြီး၊ ဗဟိုဘဏ်ဝယ်လိုအားကဲ့သို့ နှေးနှေးပြောင်းလဲသော structural driver အတွက် သင့်လျော်သော်လည်း မြန်မြန်ပြောင်းလဲသော driver အတွက် ရွေးချယ်မှုမကောင်းပါ။'
      ),
      faded: bl(
        'Now you try: Module 7\'s Macro lab aligns daily market signals with quarterly GDP. Step 1 — which alignment direction makes more sense here — forward-filling the slow quarterly GDP across days, or aggregating the fast daily signals down to quarterly? Step 2 — why: _____. Step 3 — what\'s lost either way: _____.',
        'Now you try: for nowcasting specifically (estimating the current quarter before it\'s reported), which alignment direction better serves the actual goal, and why?',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: Module 7 ၏ Macro lab သည် နေ့စဉ်စျေးကွက် signal များကို သုံးလပတ် GDP နှင့် ချိန်ညှိသည်။ အဆင့် ၁ — ဒီနေရာမှာ ဘယ်ချိန်ညှိမှု ဦးတည်ချက်က ပိုအဓိပ္ပာယ်ရှိသလဲ — နှေးသော သုံးလပတ် GDP ကို ရက်အလိုက် forward-fill လုပ်ခြင်း၊ ဒါမှမဟုတ် မြန်သော daily signal များကို သုံးလပတ်သို့ aggregate ချုံ့ခြင်းလား? အဆင့် ၂ — ဘာကြောင့်: _____။ အဆင့် ၃ — ဘယ်လိုနည်းလမ်းနှစ်ခုစလုံးမှာ ဘာဆုံးရှုံးမလဲ: _____။',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: nowcasting အတွက် အထူးသဖြင့် (လက်ရှိသုံးလပတ်ကို မထုတ်ပြန်မီ ခန့်မှန်းခြင်း)၊ ဘယ်ချိန်ညှိမှု ဦးတည်ချက်က တကယ့်ပန်းတိုင်ကို ပိုကောင်းစွာ ဆောင်ရွက်ပေးနိုင်ပြီး ဘာကြောင့်လဲ?'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The unit-conversion analogy is almost too clean: converting minutes to seconds is lossless and has one obviously correct answer. Aligning mismatched-frequency data is lossy — forward-filling genuinely discards information (you don't actually know demand changed smoothly through the quarter), it's just the least-bad option available.",
        'Unit-ပြောင်းလဲမှု ဆင်တူပုံရိပ်သည် သိပ်ပြီး သန့်ရှင်းလွန်းသည်: မိနစ်ကနေ စက္ကန့်ပြောင်းခြင်းသည် ဆုံးရှုံးမှုမရှိပဲ ရှင်းလင်းသော အဖြေတစ်ခုတည်း ရှိသည်။ ကြိမ်နှုန်းမတူညီသော data ကို ချိန်ညှိခြင်းသည် ဆုံးရှုံးမှုရှိသည် — forward-fill သည် အချက်အလက်ကို တကယ်စွန့်ပစ်နေသည် (ဝယ်လိုအားက သုံးလပတ်တစ်လျှောက် ချောမွေ့စွာ ပြောင်းလဲသည်ဆိုတာ တကယ်မသိပါ)၊ ရနိုင်သည့် ရွေးချယ်မှုများအနက် အနည်းဆုံးမကောင်းသော option သာဖြစ်သည်။'
      ),
      caveat: blSame(
        "A real caveat: there's no universally correct alignment choice — it depends on which driver moves faster and which questions the model needs to answer. Getting this wrong is a common, silent source of leaked-future-information bugs that are much harder to spot than an outright crash.",
        'တကယ့် caveat: universal အားဖြင့် မှန်ကန်သော ချိန်ညှိမှုရွေးချယ်မှု မရှိပါ — ဘယ် driver က ပိုမြန်စွာ ရွေ့လျားလဲ၊ model က ဘယ်မေးခွန်းများကို ဖြေဆိုရန် လိုအပ်သလဲအပေါ် မူတည်သည်။ ဒါကို မှားယွင်းစွာလုပ်ခြင်းသည် crash တိုက်ရိုက်ထက် သတိထားမိရန် ပိုခက်ခဲသော leaked-future-information bug ၏ တွေ့ရလေ့ရှိသော အသိမသိ ရင်းမြစ်တစ်ခုဖြစ်သည်။'
      ),
      retrieval: {
        question: blSame(
          "Without looking back: why is forward-filling a slow quarterly figure across many days a reasonable choice, but forward-filling a fast-moving daily figure across a whole quarter wouldn't be?",
          'ပြန်မကြည့်ဘဲ: နှေးသော သုံးလပတ်ကိန်းကို ရက်များစွာအတွက် forward-fill လုပ်ခြင်းက ဘာကြောင့် ကျိုးကြောင်းညီသော ရွေးချယ်မှုဖြစ်ပြီး၊ မြန်သော နေ့စဉ်ကိန်းကို သုံးလပတ်တစ်ခုလုံးအတွက် forward-fill လုပ်ခြင်းက ဘာကြောင့် မဟုတ်သလဲ?'
        ),
        answer: blSame(
          "Forward-filling assumes the value stays roughly informative for the whole gap. That's a reasonable assumption for a driver that genuinely moves slowly (central-bank demand doesn't swing day to day). It's a bad assumption for a fast-moving driver — you'd be pretending a stale snapshot is still accurate long after it's gone out of date.",
          'Forward-fill သည် တန်ဖိုးသည် ကွက်လပ်တစ်ခုလုံးအတွက် အချက်အလက်ရှိနေဆဲဟု ယူဆသည်။ ဒါက တကယ်နှေးနှေးရွေ့လျားသော driver အတွက် ကျိုးကြောင်းညီသောယူဆချက်ဖြစ်သည် (ဗဟိုဘဏ်ဝယ်လိုအားက နေ့စဉ် လှုပ်ရှားမှု မရှိပါ)။ မြန်မြန်ရွေ့လျားသော driver အတွက်မူ ယူဆချက်မကောင်းပါ — သက်တမ်းကုန်သွားပြီးနောက် ကြာကြာကြာနေတဲ့ snapshot ဟောင်းတစ်ခုကို ဆက်တိကျနေသေးသည်ဟု ဟန်ဆောင်နေရာရောက်သည်။'
        ),
      },
    },
    question: bl(
      'Is the evidence actually usable yet?',
      'Is the evidence usable — cleaned, aligned, and scaled?',
      'အထောက်အထားက တကယ် သုံးလို့ရပြီလား။',
      'အထောက်အထားသည် သန့်ရှင်းပြီး၊ ကြိမ်နှုန်းညီညွတ်ပြီး၊ scale ချိန်ညှိပြီး သုံးနိုင်ပြီလား။'
    ),
    what: bl(
      'Clean up gaps and weird outliers, and line up data that arrives on different schedules — daily prices next to quarterly GDP, for example.',
      'Clean missing values/outliers, align frequencies (daily price vs. quarterly GDP), normalize/scale — mismatched frequency is the single most common silent bug in a nowcasting pipeline (Module 7).',
      'ကွက်လပ်များနှင့် ထူးခြားသော outlier များကို သန့်ရှင်းပြီး၊ ကွဲပြားသောကြိမ်နှုန်းဖြင့် ရောက်ရှိလာသော အချက်အလက်များကို ချိန်ညှိသည် — ဥပမာ နေ့စဉ်စျေးနှုန်းနှင့် သုံးလပတ် GDP။',
      'ကွက်လပ်များ/outlier များကို သန့်ရှင်းပြီး၊ ကြိမ်နှုန်းများကို ချိန်ညှိပြီး (နေ့စဉ်စျေးနှုန်း vs. သုံးလပတ် GDP)၊ normalize/scale ပြုလုပ်သည် — ကြိမ်နှုန်းမတူညီမှုသည် nowcasting pipeline (Module 7) ရှိ အသိမသိ bug အများဆုံးဖြစ်သည်။'
    ),
    goldExample: bl(
      'Gold trades daily but central-bank purchase data only arrives quarterly — these need to be aligned before they can sit in the same model.',
      'Daily gold price vs. quarterly WGC central-bank demand figures — a frequency mismatch resolved by forward-filling or aggregating, exactly the kind of alignment problem Module 7\'s nowcasting "information gap" generalizes.',
      'ရွှေကို နေ့စဉ်ရောင်းဝယ်နေသော်လည်း ဗဟိုဘဏ်ဝယ်ယူမှုအချက်အလက်က သုံးလတစ်ကြိမ်သာ ထွက်သည် — မော်ဒယ်တစ်ခုတည်းထဲ မတွဲမီ ချိန်ညှိရန်လိုသည်။',
      'ရွှေစျေးနှုန်းကို နေ့စဉ် vs. WGC ဗဟိုဘဏ်ဝယ်ယူမှုကို သုံးလတစ်ကြိမ် — ကြိမ်နှုန်းမတူညီမှုကို forward-fill သို့မဟုတ် aggregate ဖြင့် ဖြေရှင်းသည်၊ Module 7 ၏ nowcasting "information gap" ကွန်ဆက်ဖြစ်သည့် ပြဿနာအမျိုးအစားတူညီသည်။'
    ),
  },
  {
    id: 'features',
    n: 4,
    stage: 'Feature engineering',
    stageName: blSame('Feature engineering', 'Feature ကွန်ဆက်ပညာ'),
    spark: {
      analogy: bl(
        "A weather forecaster doesn't just look at today's temperature — they look at how fast it's been dropping, the pressure trend, the gap between coastal and inland readings. Those derived signals, not the raw thermometer reading alone, are what actually predicts tomorrow. Feature engineering is building those derived signals for a model.",
        'Feature engineering builds new columns — lags, rolling averages, spreads, sentiment scores — that make an existing pattern easier for a model to detect than the raw data alone would.',
        'ရာသီဥတု ခန့်မှန်းသူတစ်ဦးသည် ဒီနေ့အပူချိန်ကိုသာ ကြည့်တာမဟုတ်ပါ — ဘယ်လောက်မြန်မြန် ကျဆင်းနေလဲ၊ ဖိအား လမ်းကြောင်း၊ ကမ်းရိုးတန်းနှင့် ကုန်းတွင်းဖတ်ချက်ကြား ကွာဟမှုကို ကြည့်သည်။ raw thermometer ဖတ်ချက်တစ်ခုတည်းမဟုတ်ဘဲ ဒီရရှိလာသော signal များက မနက်ဖြန်ကို တကယ်ခန့်မှန်းပေးသည်။ Feature engineering သည် model အတွက် ဒီရရှိလာသော signal များ တည်ဆောက်ပေးခြင်းဖြစ်သည်။',
        'Feature engineering သည် raw data တစ်ခုတည်းထက် model က ရှိပြီးသား pattern ကို ပိုမြင်သာစေမည့် ကော်လံအသစ်များ — lag များ၊ rolling average များ၊ spread များ၊ sentiment score များ — တည်ဆောက်ပေးသည်။'
      ),
      predict: {
        question: bl(
          "You add a \"real-yield 30-day moving average\" feature to a model that already has raw daily real yields. Does this always improve the model?",
          "You add a \"real-yield 30-day moving average\" feature to a model that already has raw daily real yields. Does this always improve the model?",
          '"real-yield 30-ရက် ရွေ့လျားပျမ်းမျှ" feature ကို raw နေ့စဉ် real yields ရှိပြီးသား model ထဲ ထည့်လိုက်သည်။ ဒါက model ကို အမြဲတမ်း တိုးတက်စေသလား?',
          '"real-yield 30-ရက် ရွေ့လျားပျမ်းမျှ" feature ကို raw နေ့စဉ် real yields ရှိပြီးသား model ထဲ ထည့်လိုက်သည်။ ဒါက model ကို အမြဲတမ်း တိုးတက်စေသလား?'
        ),
        options: [
          bl('Yes, always — more features are always better', 'ဟုတ်သည်၊ အမြဲတမ်း — feature ပိုများလေ ပိုကောင်းလေ'),
          bl('Not necessarily — it can help if the trend matters more than the daily noise, but can also add redundant noise if the model already captures that trend another way', 'မဖြစ်မနေမဟုတ်ပါ — daily noise ထက် လမ်းကြောင်းက ပိုအရေးကြီးလျှင် အထောက်အကူဖြစ်နိုင်သော်လည်း model က ထိုလမ်းကြောင်းကို တခြားနည်းဖြင့် ဖမ်းယူပြီးသားလျှင် redundant noise ထပ်ဖြစ်စေနိုင်သည်'),
          bl('No, adding any feature always hurts accuracy', 'မဟုတ်ပါ၊ feature မည်သည့်အရာထည့်သည်ဖြစ်စေ တိကျမှုကို ထိခိုက်စေသည်'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('Starting from a 1-day window and dragging toward 30 days, does the toy correlation shown rise or fall at first?', '၁ ရက် window မှစပြီး ၃၀ ရက်ဆီသို့ ဆွဲသွားလျှင် ပြထားသော ဥပမာ correlation သည် အစပိုင်းတွင် တက်မလား ကျမလား?'),
        options: [blSame('Rises toward 30 days, then falls past it', '၃၀ ရက်ဆီသို့ တက်ပြီး နောက်ပိုင်း ကျသွားသည်'), blSame('Only ever falls', 'အမြဲ ကျသာကျသည်')],
        correctIndex: 0,
      },
      paramLabel: blSame('Rolling-average window (days)', 'Rolling-average window (ရက်)'),
      paramMin: 1, paramMax: 90, paramDefault: 30, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.max(0.1, 0.85 - Math.abs(v - 30) * 0.012),
      outputLabel: blSame('Toy correlation with the target (illustrative)', 'Target နှင့် ဥပမာ correlation (သရုပ်ဖော်)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Worked example: turning raw daily real-yield readings into a usable feature. Step 1 — raw signal: real_yield_t (noisy day to day). Step 2 — engineer: real_yield_MA30_t = average of real_yield over the last 30 days, smoothing out day-to-day noise while keeping the trend. Step 3 — result: the model sees a feature that tracks the same underlying driver more cleanly, which is exactly the smoothed slider input this stage\'s Mechanism widget lets you feel directly.',
        'The general pattern: raw_t → f(raw_{t-k}, ..., raw_t) for some window k and function f (mean, sum, delta, z-score). Choosing k is itself a hyperparameter — too short and you keep the noise you were trying to smooth away, too long and you blur real regime changes into invisibility.',
        'ဖြေရှင်းချက်ဥပမာ: raw နေ့စဉ် real-yield ဖတ်ချက်များကို အသုံးဝင်သော feature အဖြစ် ပြောင်းလဲခြင်း။ အဆင့် ၁ — raw signal: real_yield_t (နေ့စဉ် noisy)။ အဆင့် ၂ — engineer: real_yield_MA30_t = နောက်ဆုံး ရက် ၃၀ ၏ real_yield ပျမ်းမျှ၊ လမ်းကြောင်းကို ထိန်းထားစဉ် နေ့စဉ် noise ကို ချောမွေ့စေသည်။ အဆင့် ၃ — ရလဒ်: model သည် underlying driver အတူတူကို ပိုသန့်ရှင်းစွာ ခြေရာခံသော feature တစ်ခုကို မြင်ရပြီး၊ ဒါဟာ ဒီအဆင့်၏ Mechanism widget က တိုက်ရိုက်ခံစားနိုင်စေသော ချောမွေ့သော slider input တစ်ခုအတိအကျပင်ဖြစ်သည်။',
        'အထွေထွေ pattern: raw_t → f(raw_{t-k}, ..., raw_t) window k နှင့် function f (mean, sum, delta, z-score) တစ်ခုအတွက်။ k ရွေးချယ်ခြင်းသည် ကိုယ်တိုင်ကလည်း hyperparameter တစ်ခုဖြစ်သည် — တိုလွန်းလျှင် ချောမွေ့ရန် ကြိုးစားနေသော noise ကို ဆက်ထားရှိသည်၊ ရှည်လွန်းလျှင် တကယ့် regime ပြောင်းလဲမှုများကို မမြင်နိုင်အောင် မှုန်ဝါးသွားသည်။'
      ),
      faded: bl(
        'Now you try: Module 8\'s Micro lab could add a "price 7-day change" feature to help predict demand. Step 1 — raw signal: price_t. Step 2 — engineer: price_delta7_t = _____. Step 3 — why this specific feature might help capture demand: _____.',
        'Now you try: define a "7-day price change" feature formally, then explain why a demand model might specifically benefit from a *change* feature rather than just the raw price level.',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: Module 8 ၏ Micro lab သည် demand ခန့်မှန်းရန် "ဈေးနှုန်း ၇-ရက် ပြောင်းလဲမှု" feature ထည့်နိုင်သည်။ အဆင့် ၁ — raw signal: price_t။ အဆင့် ၂ — engineer: price_delta7_t = _____။ အဆင့် ၃ — ဒီ feature အတိအကျက demand ကို ဖမ်းယူရန် ဘာကြောင့်အထောက်အကူဖြစ်နိုင်သလဲ: _____။',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: "၇-ရက် ဈေးနှုန်းပြောင်းလဲမှု" feature ကို formally သတ်မှတ်ပြီး demand model တစ်ခုသည် raw ဈေးနှုန်းအဆင့်ထက် *ပြောင်းလဲမှု* feature မှ အထူးအကျိုးရှိနိုင်သည့်အကြောင်းရင်း ရှင်းပြပါ။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The forecaster analogy breaks down on scale: a human forecaster can invent a clever new derived signal on the spot, mid-thought. A model can only ever see the features an engineer explicitly built beforehand — it can't reach back and engineer a new one for itself, no matter how useful one would be.",
        'ရာသီဥတု ခန့်မှန်းသူ ဆင်တူပုံရိပ်သည် scale ပေါ်မှာ ပျက်စီးသည်: လူ ခန့်မှန်းသူတစ်ဦးသည် ချက်ချင်း၊ တွေးတောနေစဉ်ပင် ထူးခြားသော signal အသစ်တစ်ခု တီထွင်နိုင်သည်။ Model တစ်ခုသည် engineer တစ်ဦးက ကြိုတင် တိကျစွာ တည်ဆောက်ထားသော feature များကိုသာ မြင်နိုင်ပြီး — မည်မျှအသုံးဝင်ပါစေ ကိုယ်တိုင်အတွက် feature အသစ်တစ်ခု ပြန်လှမ်းပြီး engineer မလုပ်နိုင်ပါ။'
      ),
      caveat: blSame(
        "A real caveat: some modern deep-learning models (like the LSTM/Transformer family in Module 3) do automatically learn internal representations that function somewhat like engineered features — but this happens inside the model during estimation, from data an engineer still had to collect and prepare first. It's not the same as autonomous feature invention from nothing.",
        'တကယ့် caveat: modern deep-learning model အချို့ (Module 3 ၏ LSTM/Transformer family ကဲ့သို့) သည် engineered feature များနှင့် အနည်းငယ် တူညီစွာ လုပ်ဆောင်သော internal representation များကို အလိုအလျောက် သင်ယူသည် — ဒါပေမဲ့ ဒါဟာ engineer တစ်ဦးက ရှေးဦးစွာ စုဆောင်း/ပြင်ဆင်ပေးထားသော data ကနေ estimation အတွင်း model ထဲမှာ ဖြစ်ပျက်တာဖြစ်သည်။ ဘာမှမရှိရာမှ autonomous feature တီထွင်ခြင်းနှင့် မတူပါ။'
      ),
      retrieval: {
        question: blSame(
          "Without looking back: why can a longer smoothing window blur away a real regime change, and not just noise?",
          'ပြန်မကြည့်ဘဲ: window ရှည်လျှင် ဘာကြောင့် noise တစ်ခုတည်းမက တကယ့် regime ပြောင်းလဲမှုကိုပါ မှုန်ဝါးသွားစေနိုင်သလဲ?'
        ),
        answer: blSame(
          "A moving average can't distinguish 'temporary noisy blip' from 'the value genuinely and permanently shifted' — it treats every point in its window equally. A long window keeps averaging in pre-shift values long after a real regime change, delaying and understating how much things actually moved.",
          "Moving average သည် 'ယာယီ noisy blip' နှင့် 'တန်ဖိုးသည် တကယ်၊ အမြဲတမ်း ပြောင်းလဲသွားခြင်း' ကို ခွဲခြားမသိနိုင်ပါ — window ထဲရှိ အမှတ်တိုင်းကို တန်းတူယူဆသည်။ Window ရှည်လျှင် တကယ့် regime ပြောင်းလဲမှုနောက်ပိုင်း ကြာကြာကြာအောင် ပြောင်းလဲမီတန်ဖိုးများကို ဆက်ပျမ်းမျှနေသဖြင့် တကယ်ဘယ်လောက်ပြောင်းသွားလဲဆိုတာကို နှောင့်နှေးစေပြီး လျှော့တွက်စေသည်။"
        ),
      },
    },
    question: bl(
      'What signals might actually explain the target?',
      'What signals might explain the target — lags, rolling averages, spreads, sentiment?',
      'ဘယ် signal တွေက ရလဒ်ကို ရှင်းပြနိုင်မလဲ။',
      'Target ကို ရှင်းပြနိုင်မည့် signal များမှာ lag များ၊ rolling average များ၊ spread များ၊ sentiment score များ ဖြစ်နိုင်သလား။'
    ),
    what: bl(
      'Build new columns from the raw data that make patterns easier for a model to see: yesterday\'s value, a 30-day average, the gap between two related rates.',
      'Build lags, rolling averages, technical indicators, macro spreads, sentiment scores. For time series specifically, this stage also requires no shuffling — splits must respect chronological order (walk-forward backtesting, Module 5).',
      'မော်ဒယ်တစ်ခုအတွက် ပုံစံများကို ပိုမြင်သာစေမည့် ကော်လံအသစ်များ တည်ဆောက်သည် — မနေ့ကတန်ဖိုး၊ ရက် ၃၀ ပျမ်းမျှ၊ ဆက်စပ်နှုန်းနှစ်ခုကြား ကွာဟချက်။',
      'Lag များ၊ rolling average များ၊ technical indicator များ၊ macro spread များ၊ sentiment score များ တည်ဆောက်သည်။ Time series အတွက် ဤအဆင့်တွင် shuffle မလုပ်ရ — အစီအစဉ်များသည် အချိန်ကြောင်းအတိုင်း လိုက်နာရမည် (walk-forward backtesting, Module 5)။'
    ),
    goldExample: bl(
      'Build the real-yield 30-day moving average, the month-over-month change in DXY, and a rolling geopolitical-risk score.',
      'Real-yield MA(30), DXY month-over-month delta, lagged central-bank purchase volume, rolling geopolitical-risk index — the geopolitical-risk feature alone contributed a measured ~19% accuracy improvement in one cited study.',
      'အမှန်တကယ် အတိုးနှုန်း ရက် ၃၀ ရွေ့လျားပျမ်းမျှ၊ DXY လစဉ်ပြောင်းလဲမှု၊ ရွေ့လျား နိုင်ငံရေးအန္တရာယ်ရမှတ်တို့ကို တည်ဆောက်သည်။',
      'Real-yield MA(30)၊ DXY လစဉ်ပြောင်းလဲမှု၊ lag ထားသော ဗဟိုဘဏ်ဝယ်ယူမှုပမာဏ၊ ရွေ့လျား geopolitical-risk index — geopolitical-risk feature တစ်ခုတည်းကပင် ကိုးကားထားသော လေ့လာမှုတစ်ခုတွင် တိကျမှု ~၁၉% တိုးတက်စေခဲ့သည်။'
    ),
  },
  {
    id: 'estimation',
    n: 5,
    stage: 'Estimation (training/fitting)',
    stageName: blSame('Estimation (training/fitting)', 'Estimation (train/fit လုပ်ခြင်း)'),
    spark: {
      analogy: bl(
        "A tailor doesn't cut a suit from a fixed formula — they take your specific measurements and adjust the pattern until it fits you. Estimation is that fitting process for a model: the model's shape (linear? tree-based?) is chosen ahead of time, but its exact numbers get tailored to the specific historical data it's shown.",
        "Estimation is the process by which a model's internal parameters get set from historical data — via OLS, maximum likelihood, gradient descent, or Bayesian posterior sampling depending on the model family.",
        'Tailor တစ်ဦးသည် သေးထားပြီးသား ပုံသေ formula မှ suit တစ်ထည်ကို ဖြတ်ရိတ်လေ့မရှိပါ — သင့်ရဲ့ တိကျသော အတိုင်းအတာများကို ယူပြီး သင့်ကိုက်ညီသည်အထိ pattern ကို ချိန်ညှိသည်။ Estimation သည် model အတွက် ဒီကိုက်ညီအောင် ချိန်ညှိမှု လုပ်ငန်းစဉ်ဖြစ်သည်: model ၏ ပုံသဏ္ဍာန် (linear လား? tree-based လား?) ကို ကြိုတင်ရွေးချယ်ထားသော်လည်း ၎င်း၏ တိကျသော ဂဏန်းများသည် ပြသထားသော သမိုင်း data အတိအကျနှင့် တွဲညီအောင် ချိန်ညှိသည်။',
        'Estimation သည် model ၏ အတွင်းပါရာမီတာများကို သမိုင်း data မှ သတ်မှတ်ပေးသော လုပ်ငန်းစဉ်ဖြစ်သည် — OLS, maximum likelihood, gradient descent, သို့မဟုတ် Bayesian posterior sampling ကို model family ပေါ်မူတည်၍ သုံးသည်။'
      ),
      predict: {
        question: bl(
          "Someone claims: \"a data scientist writes out the exact rule the gold-price model will use, line by line, before it ever sees data.\" Is this how estimation actually works?",
          "Someone claims: \"a data scientist writes out the exact rule the gold-price model will use, line by line, before it ever sees data.\" Is this how estimation actually works?",
          '"data scientist တစ်ဦးက ရွှေဈေးနှုန်း model သုံးမည့် rule အတိအကျကို data မမြင်ဖူးမီ တစ်ကြောင်းချင်း ရေးထားသည်" ဆိုတာ ကို စောဒကတက်သူတစ်ဦးရှိသည်။ Estimation က တကယ်ဒီလို အလုပ်လုပ်သလား?',
          '"data scientist တစ်ဦးက ရွှေဈေးနှုန်း model သုံးမည့် rule အတိအကျကို data မမြင်ဖူးမီ တစ်ကြောင်းချင်း ရေးထားသည်" ဆိုတာ ကို စောဒကတက်သူတစ်ဦးရှိသည်။ Estimation က တကယ်ဒီလို အလုပ်လုပ်သလား?'
        ),
        options: [
          bl('Yes — every coefficient is hand-typed by a person', 'ဟုတ်သည် — coefficient တိုင်းကို လူတစ်ဦးက လက်ဖြင့် ရိုက်ထည့်သည်'),
          bl('No — a person chooses the model shape, but the algorithm searches for the specific numbers from data', 'မဟုတ်ပါ — လူတစ်ဦးက model ပုံသဏ္ဍာန်ကို ရွေးချယ်သော်လည်း algorithm က data မှ တိကျသောဂဏန်းများကို ရှာဖွေသည်'),
          bl('No model ever has any fixed structure at all', 'Model မည်သည်မှာမဆို ပုံသေ structure လုံးဝမရှိပါ'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag more years of training data in, does parameter stability rise or fall?', 'training data နှစ်ပိုများများ ဆွဲထည့်လျှင် parameter တည်ငြိမ်မှု တက်မလား ကျမလား?'),
        options: [blSame('Rises', 'တက်သည်'), blSame('Falls', 'ကျသည်')],
        correctIndex: 0,
      },
      paramLabel: blSame('Years of historical training data', 'သမိုင်း training data နှစ်'),
      paramMin: 1, paramMax: 15, paramDefault: 3, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.min(0.97, 1 - 1.4 / (v + 1.5)),
      outputLabel: blSame('Toy parameter stability (1.0 = fully settled)', 'ဥပမာ parameter တည်ငြိမ်မှု (1.0 = လုံးဝတည်ငြိမ်)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Worked example: fitting a simple linear relationship between real yields and gold price on 3 illustrative data points: (yield=-1, price=4100), (yield=0, price=4015), (yield=1, price=3920). Step 1 — OLS finds the line minimizing squared error: price ≈ 4015 − 90×yield. Step 2 — that "−90" is the estimated coefficient — nobody typed −90, the algorithm found it by minimizing prediction error across exactly these three points. Step 3 — this is the literal number Module 6\'s trace panel would show as this driver\'s contribution.',
        'OLS minimizes Σ(y_i − ŷ_i)² over choices of β₀, β₁ in ŷ = β₀ + β₁x. For the three points above, the closed-form solution gives β₁ = Σ(x_i−x̄)(y_i−ȳ)/Σ(x_i−x̄)² = −90 exactly — a deterministic, derivable number, not a guess or a human-set constant.',
        'ဖြေရှင်းချက်ဥပမာ: real yields နှင့် ရွှေဈေးနှုန်းကြား linear ဆက်နွယ်မှုကို ဥပမာ data အမှတ် ၃ ခုပေါ် fit လုပ်ခြင်း: (yield=-1, price=4100), (yield=0, price=4015), (yield=1, price=3920)။ အဆင့် ၁ — OLS သည် squared error အနည်းဆုံးဖြစ်စေသော မျဉ်းကို ရှာသည်: price ≈ 4015 − 90×yield။ အဆင့် ၂ — အဲ့ဒီ "−90" သည် ခန့်မှန်းထားသော coefficient ဖြစ်သည် — ဘယ်သူမှ −90 ရိုက်ထည့်ခဲ့တာ မဟုတ်ပါ၊ algorithm က ဒီအမှတ်သုံးခုတစ်လျှောက် ခန့်မှန်းအမှား အနည်းဆုံးဖြစ်အောင် ရှာဖွေထားခြင်းဖြစ်သည်။ အဆင့် ၃ — ဒါက Module 6 ၏ trace panel က ဒီ driver ၏ contribution အဖြစ် ပြသမည့် ဂဏန်းအမှန်ပင်ဖြစ်သည်။',
        'OLS သည် ŷ = β₀ + β₁x ရှိ β₀, β₁ ရွေးချယ်မှုများပေါ် Σ(y_i − ŷ_i)² ကို minimize လုပ်သည်။ အထက်ပါအမှတ်သုံးခုအတွက် closed-form solution က β₁ = Σ(x_i−x̄)(y_i−ȳ)/Σ(x_i−x̄)² = −90 အတိအကျ ပေးသည် — ဒါက deterministic, derivable ဂဏန်းတစ်ခုဖြစ်ပြီး ခန့်မှန်းချက် သို့မဟုတ် လူသတ်မှတ်ထားသော constant မဟုတ်ပါ။'
      ),
      faded: bl(
        'Now you try: with data points (x=0, y=10) and (x=2, y=18), what slope β₁ does OLS find for y = β₀ + β₁x? Step 1 — the change in y is _____. Step 2 — the change in x is _____. Step 3 — β₁ = change in y ÷ change in x = _____.',
        'Now you try: with just two points, OLS reduces to the simple slope formula. Compute β₁ for (0,10) and (2,18), and state what β₀ must be for the line to pass through both points exactly.',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: data အမှတ် (x=0, y=10) နှင့် (x=2, y=18) ဖြင့် y = β₀ + β₁x အတွက် OLS က ဘယ် slope β₁ ကို ရှာတွေ့သလဲ? အဆင့် ၁ — y ၏ ပြောင်းလဲမှုက _____။ အဆင့် ၂ — x ၏ ပြောင်းလဲမှုက _____။ အဆင့် ၃ — β₁ = y ပြောင်းလဲမှု ÷ x ပြောင်းလဲမှု = _____။',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: အမှတ်နှစ်ခုတည်းဖြင့် OLS သည် ရိုးရှင်းသော slope formula သို့ ကျဉ်းသွားသည်။ (0,10) နှင့် (2,18) အတွက် β₁ ကို တွက်ချက်ပြီး အမှတ်နှစ်ခုလုံးကို အတိအကျဖြတ်သွားရန် β₀ ဘာဖြစ်ရမည်ကို ဖော်ပြပါ။'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'programmedBehavior',
      analogyBreakdown: blSame(
        "The tailor analogy breaks down at scale and speed: a human tailor adjusts maybe a dozen measurements by hand. Estimation for a model like XGBoost is searching over thousands of possible split-points across hundreds of trees — a scale of \"fitting\" no human could do by hand, which is precisely why an algorithm does it instead of a person.",
        'Tailor ဆင်တူပုံရိပ်သည် scale နှင့် အမြန်နှုန်းအရ ပျက်စီးသည်: လူ tailor တစ်ဦးသည် အတိုင်းအတာ ဆယ်ခန့်ကို လက်ဖြင့် ချိန်ညှိသည်။ XGBoost ကဲ့သို့ model အတွက် estimation သည် tree ရာနှင့်ချီပေါ်ရှိ split-point ထောင်ပေါင်းများစွာကို ရှာဖွေနေခြင်းဖြစ်သည် — လူတစ်ဦးမှ လက်ဖြင့် မလုပ်နိုင်သော "fitting" scale တစ်ခုဖြစ်ပြီး၊ ဒါကြောင့်ပင် လူအစား algorithm က လုပ်ဆောင်ခြင်းဖြစ်သည်။'
      ),
      caveat: blSame(
        'A real caveat: a person still makes important structural choices before estimation begins (model family, regularization strength, how many trees) — these are genuine human decisions. The point isn\'t "no human judgment anywhere," it\'s "the specific numbers inside the chosen shape are found, not typed."',
        'တကယ့် caveat: estimation မစတင်မီ လူတစ်ဦးသည် အရေးကြီးသော structural ရွေးချယ်မှုများ (model family, regularization strength, tree အရေအတွက်) ကို ဆက်လက်လုပ်ဆောင်သည် — ဒါတွေက တကယ့် လူ့ဆုံးဖြတ်ချက်များဖြစ်သည်။ အချက်က "လူ့ဆုံးဖြတ်ချက် ဘယ်နေရာမှမရှိ" မဟုတ်ပါ၊ "ရွေးချယ်ထားသော ပုံသဏ္ဍာန်အတွင်းရှိ တိကျသော ဂဏန်းများကို ရှာတွေ့ခြင်းဖြစ်ပြီး ရိုက်ထည့်ခြင်း မဟုတ်ပါ" ဆိုတာဖြစ်သည်။'
      ),
      retrieval: {
        question: blSame(
          'Without looking back: if you gave the exact same model code to two data scientists but different historical data, would they end up with the same fitted parameters?',
          'ပြန်မကြည့်ဘဲ: model code အတူတူကို data scientist နှစ်ဦးအား ပေးပြီး data မတူညီစေရင် ၎င်းတို့ fit လုပ်ရလာမည့် parameter များ တူညီမလား?'
        ),
        answer: blSame(
          "No — different data produces different estimated parameters even with identical code, because the parameters are found from the data, not written into the code. This is the clearest possible demonstration that the numbers come from the data, not a programmer's fingers.",
          'မတူပါ — code အတူတူပင်ဖြစ်စေ data ကွဲပြားလျှင် ခန့်မှန်းရရှိသော parameter များ ကွဲပြားသည်၊ ဘာကြောင့်ဆိုသော် parameter များသည် data ထဲမှ ရှာတွေ့ခြင်းဖြစ်ပြီး code ထဲသို့ ရေးထည့်ထားခြင်း မဟုတ်သောကြောင့်ဖြစ်သည်။ ဒါဟာ ဂဏန်းများသည် programmer ရဲ့ လက်ချောင်းများမှ မဟုတ်ဘဲ data မှ လာကြောင်း အရှင်းလင်းဆုံး သရုပ်ပြခြင်းဖြစ်သည်။'
        ),
      },
    },
    question: bl(
      'What did the data actually teach the model?',
      'What did the data teach the model\'s internal parameters?',
      'အချက်အလက်က မော်ဒယ်ကို ဘာသင်ပေးခဲ့သလဲ။',
      'အချက်အလက်များက မော်ဒယ်၏ အတွင်းပါရာမီတာများကို ဘာများ သင်ကြားပေးခဲ့သနည်း။'
    ),
    what: bl(
      'The model\'s internal numbers get tuned against historical data — this is the "learning" part, and it\'s exactly what Stats mode calls estimation.',
      'The model\'s internal parameters are estimated from historical data — OLS, MLE, gradient descent, or Bayesian posterior sampling, depending on the model family. This is the literal hinge to Stats mode (Module 10) and Module 2\'s own headline concept below.',
      'မော်ဒယ်၏ အတွင်းပါရာမီတာများကို သမိုင်းအချက်အလက်များနှင့် ချိန်ညှိသည် — ၎င်းသည် "သင်ယူခြင်း" အပိုင်းဖြစ်ပြီး Stats mode က estimation ဟုခေါ်သည့်အရာပင်ဖြစ်သည်။',
      'မော်ဒယ်၏ အတွင်းပါရာမီတာများကို သမိုင်းအချက်အလက်များမှ ခန့်မှန်းသည် — OLS, MLE, gradient descent, သို့မဟုတ် Bayesian posterior sampling ကို မော်ဒယ်မိသားစုပေါ်မူတည်၍ သုံးသည်။ ၎င်းသည် Stats mode (Module 10) နှင့် ချိတ်ဆက်ချက်အမှန်ဖြစ်သည်။'
    ),
    goldExample: bl(
      'Feed 10 years of gold price + the 5 driver features into an XGBoost model; the training process finds the internal split-points that best fit the historical relationship.',
      'Fit XGBoost/LSTM/ARIMA on 2015–2025 gold + drivers; each family estimates differently (gradient-boosted splits, backprop through time, MLE on ARMA coefficients) but all are "estimation" in the pipeline sense.',
      'ရွှေစျေးနှုန်းနှင့် driver features ငါးခုကို ဆယ်နှစ်စာ XGBoost မော်ဒယ်ထဲသို့ ထည့်သွင်းသည်; လေ့ကျင့်မှုလုပ်ငန်းစဉ်က သမိုင်းဆက်စပ်မှုနှင့် အကိုက်ညီဆုံးသော split-point များကို ရှာဖွေသည်။',
      '2015-2025 ရွှေစျေးနှုန်းနှင့် driver များကို XGBoost/LSTM/ARIMA ဖြင့် fit လုပ်သည်; မော်ဒယ်မိသားစုတစ်ခုစီက မတူညီစွာ ခန့်မှန်းသော်လည်း (gradient-boosted splits, backprop through time, MLE) pipeline အဓိပ္ပာယ်အရ "estimation" ဟုသာ ခေါ်သည်။'
    ),
  },
  {
    id: 'prediction',
    n: 6,
    stage: 'Prediction (inference)',
    stageName: blSame('Prediction (inference)', 'Prediction (ကောက်ချက်ချခြင်း)'),
    spark: {
      analogy: bl(
        "A tailor's fitted pattern works great for people whose measurements resemble the ones it was tailored around — but hand it to someone twice as tall, and the fit gets shaky fast. Prediction is running a fitted model on new inputs, and it's most trustworthy near the range of data it actually learned from.",
        'Prediction (inference) applies an already-fitted model to new, unseen inputs to generate an output — a point forecast plus, ideally, an uncertainty interval — without re-estimating any parameters.',
        'Tailor တစ်ဦးရဲ့ fit လုပ်ထားပြီးသား pattern သည် ၎င်း fit လုပ်ခဲ့ရာ ပုံစံနှင့် ဆင်တူသော အတိုင်းအတာရှိသူများအတွက် ကောင်းစွာ အလုပ်လုပ်သည် — သို့သော် နှစ်ဆမြင့်သူ တစ်ဦးကို ပေးလိုက်ရင် ကိုက်ညီမှု မြန်မြန်ပျက်သွားသည်။ Prediction သည် fit လုပ်ပြီးသား model ကို input အသစ်များအပေါ် ဆောင်ရွက်ခြင်းဖြစ်ပြီး၊ ၎င်း train လုပ်ခဲ့ရာ data range အနီးတွင် အယုံကြည်ရဆုံးဖြစ်သည်။',
        'Prediction (inference) သည် fit လုပ်ပြီးသား model ကို parameter မည်သည်ကိုမျှ ပြန်လည်ခန့်မှန်းခြင်းမပြုဘဲ input အသစ်များအပေါ် အသုံးချ၍ output — point forecast နှင့် (အကောင်းဆုံးဆိုရင်) uncertainty interval — ထုတ်ပေးခြင်းဖြစ်သည်။'
      ),
      predict: {
        question: bl(
          'A gold model trained on real-yield values between -2 and +2 is asked to predict at real-yield = +8 (far outside anything it ever saw). What happens to its confidence?',
          'A gold model trained on real-yield values between -2 and +2 is asked to predict at real-yield = +8 (far outside anything it ever saw). What happens to its confidence?',
          'Real-yield တန်ဖိုး -2 မှ +2 ကြားတွင်သာ train လုပ်ထားသော ရွှေ model ကို real-yield = +8 (ဘယ်တော့မှ မမြင်ဖူးသော range) တွင် ခန့်မှန်းခိုင်းလိုက်သည်။ ၎င်း၏ ယုံကြည်စိတ်ချမှု ဘာဖြစ်သွားမလဲ?',
          'Real-yield တန်ဖိုး -2 မှ +2 ကြားတွင်သာ train လုပ်ထားသော ရွှေ model ကို real-yield = +8 (ဘယ်တော့မှ မမြင်ဖူးသော range) တွင် ခန့်မှန်းခိုင်းလိုက်သည်။ ၎င်း၏ ယုံကြည်စိတ်ချမှု ဘာဖြစ်သွားမလဲ?'
        ),
        options: [
          bl('It should get less confident — this is extrapolation far outside the training range', 'ယုံကြည်စိတ်ချမှု နည်းသင့်သည် — ဒါက train range ထက် အလွန်ကျယ်ပြန့်စွာ ကျော်ခန့်မှန်းခြင်း (extrapolation) ဖြစ်သည်'),
          bl('It stays exactly as confident as it is near the training range', 'Train range အနီးတွင် ယုံကြည်စိတ်ချမှုအတိုင်း အတိအကျ ဆက်ရှိနေသည်'),
          bl('It becomes more confident, since 8 is a bigger, more decisive number', '8 သည် ပိုကြီး၊ ပိုဆုံးဖြတ်ချက်ရှိသော ဂဏန်းဖြစ်သောကြောင့် ပိုယုံကြည်စိတ်ချလာသည်'),
        ],
        correctIndex: 0,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag the input further outside the training range, does the interval width shown grow or shrink?', 'Input ကို training range အပြင်ဘက် ပိုဝေးအောင် ဆွဲလျှင် ပြထားသော interval ကျယ်ပြန့်မှု ကြီးလာမလား ကျဉ်းလာမလား?'),
        options: [blSame('Grows', 'ကြီးလာသည်'), blSame('Shrinks', 'ကျဉ်းလာသည်')],
        correctIndex: 0,
      },
      paramLabel: blSame('Input distance beyond the training range (SDs)', 'Training range ကျော်လွန်သော input အကွာအဝေး (SD)'),
      paramMin: 0, paramMax: 6, paramDefault: 0, paramStep: 0.5, paramDecimals: 1,
      compute: (v) => 90 + v * v * 12,
      outputLabel: blSame('Toy prediction interval width ($)', 'ဥပမာ prediction interval ကျယ်ပြန့်မှု ($)'),
      outputDecimals: 0, outputSuffix: '',
    },
    formalism: {
      worked: bl(
        'Worked example: the fitted line from the Estimation stage was price ≈ 4015 − 90×yield. Step 1 — plug in a new, in-range input: yield = 0.5 → price ≈ 4015 − 45 = 3970. Step 2 — this is inference: no re-fitting happened, we just evaluated the existing formula at a new point. Step 3 — attach an interval reflecting historical residual spread, e.g. ±90 → "gold: ~$3,970 ± $90" — a prediction, not a re-estimated coefficient.',
        'ŷ_new = β̂₀ + β̂₁x_new is a pure function evaluation using already-estimated β̂s. The interval width should widen with distance from x̄ (the training mean) — this is the formal version of what the Mechanism widget\'s slider demonstrates directly: leverage/extrapolation increases variance.',
        'ဖြေရှင်းချက်ဥပမာ: Estimation အဆင့်မှ fit လုပ်ထားသော မျဉ်းက price ≈ 4015 − 90×yield ဖြစ်သည်။ အဆင့် ၁ — range အတွင်းရှိ input အသစ်တစ်ခု ထည့်ပါ: yield = 0.5 → price ≈ 4015 − 45 = 3970။ အဆင့် ၂ — ဒါက inference ဖြစ်သည်: refit ပြန်မလုပ်ပါ၊ ရှိပြီးသား formula ကို အမှတ်အသစ်တွင် တွက်ချက်ရုံသာဖြစ်သည်။ အဆင့် ၃ — သမိုင်း residual ကွဲပြားမှုကို ထင်ဟပ်သော interval တွဲပါ၊ ဥပမာ ±90 → "ရွှေ: ~$3,970 ± $90" — ဒါက prediction ဖြစ်ပြီး ပြန်ခန့်မှန်းထားသော coefficient မဟုတ်ပါ။',
        'ŷ_new = β̂₀ + β̂₁x_new သည် ခန့်မှန်းပြီးသား β̂ များကို သုံးသည့် ရိုးရှင်းသော function evaluation တစ်ခုဖြစ်သည်။ interval ကျယ်ပြန့်မှုသည် x̄ (training mean) မှ အကွာအဝေးနှင့်အမျှ ကျယ်ပြန့်သင့်သည် — ဒါက Mechanism widget ၏ slider က တိုက်ရိုက် သရုပ်ပြနေသည့်အရာ၏ တရားဝင် version ဖြစ်သည်: leverage/extrapolation က variance ကို တိုးစေသည်။'
      ),
      faded: bl(
        'Now you try: using the same fitted line price ≈ 4015 − 90×yield, what point prediction does it give for yield = -1? Step 1 — plug in: price ≈ 4015 − 90×(_____) = _____. Step 2 — is yield = -1 inside or outside the original training range (-2 to +2)? _____. Step 3 — should the interval here be wide or narrow relative to yield=0.5\'s? _____.',
        'Now you try: compute the point prediction at yield=-1, then argue whether its interval should be wider or narrower than the yield=0.5 prediction\'s, using distance-from-training-center reasoning.',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: fit လုပ်ထားသော မျဉ်း price ≈ 4015 − 90×yield ကို သုံးပြီး yield = -1 အတွက် point prediction ဘာပေးမလဲ? အဆင့် ၁ — ထည့်ပါ: price ≈ 4015 − 90×(_____) = _____။ အဆင့် ၂ — yield = -1 သည် မူလ training range (-2 မှ +2) အတွင်းလား အပြင်လား? _____။ အဆင့် ၃ — ဒီနေရာမှာ interval သည် yield=0.5 ထက် ကျယ်သင့်သလား ကျဉ်းသင့်သလား? _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The tailor analogy is fairly faithful here, but has one gap: a tailor can visually tell a garment doesn't fit and say so. A model doesn't automatically know it's extrapolating unless someone explicitly builds that check in — left alone, it will confidently output a number even far outside anything it ever learned from, with no built-in warning.",
        'Tailor ဆင်တူပုံရိပ်သည် ဒီနေရာတွင် တော်တော်လေးတိကျသော်လည်း ကွာဟချက်တစ်ခု ရှိသည်: tailor တစ်ဦးသည် ဝတ်စုံ မကိုက်ညီကြောင်း မျက်စိဖြင့်တွေ့ပြီး ပြောနိုင်သည်။ Model တစ်ခုမူ တစ်စုံတစ်ဦးက ရှင်းရှင်းလင်းလင်း ထည့်သွင်းမတည်ဆောက်ပေးလျှင် extrapolate လုပ်နေကြောင်း အလိုအလျောက် သိနိုင်မည် မဟုတ်ပါ — ချန်ထားလျှင် ၎င်းက ဘယ်တော့မှ မသင်ယူဖူးသောနေရာတွင်တောင် ယုံကြည်စိတ်ချစွာ ဂဏန်းတစ်ခု ထုတ်ပေးမည်ဖြစ်ပြီး built-in သတိပေးချက် မရှိပါ။'
      ),
      caveat: blSame(
        "A real caveat: not every model widens its interval with extrapolation automatically — this behavior depends on the model family (Bayesian/GP models do this natively; a plain point-estimate tree model needs an explicit add-on like conformal prediction to get any interval at all).",
        'တကယ့် caveat: model တိုင်းသည် extrapolation ဖြင့် interval ကို အလိုအလျောက် ကျယ်ပြန့်စေတာ မဟုတ်ပါ — ဒီအပြုအမူသည် model family ပေါ်မူတည်သည် (Bayesian/GP model များသည် ဒါကို native လုပ်သည်; plain point-estimate tree model တစ်ခုသည် interval တစ်ခုမျှ ရရှိရန် conformal prediction ကဲ့သို့ ရှင်းရှင်းလင်းလင်း add-on လိုအပ်သည်)။'
      ),
      retrieval: {
        question: blSame(
          'Without looking back: why does a prediction far outside the training range deserve less confidence than one near the center of the training data?',
          'ပြန်မကြည့်ဘဲ: training range ထက် အလွန်ကျယ်ပြန့်သော prediction တစ်ခုသည် training data ၏ အလယ်အနီးရှိ prediction တစ်ခုထက် ဘာကြောင့် ယုံကြည်စိတ်ချမှု နည်းသင့်သလဲ?'
        ),
        answer: blSame(
          "The model has never actually observed what happens out there — it's extrapolating the same shape it fit near the data it saw, with no evidence that shape still holds. Near the training center, the fitted relationship was directly tested against real examples; far outside it, that's an assumption, not a checked fact.",
          'Model သည် အဲ့ဒီနေရာမှာ ဘာဖြစ်နေမလဲဆိုတာ တကယ် ဘယ်တော့မှ မတွေ့ဖူးပါ — ၎င်း မြင်ခဲ့ဖူးသော data အနီး fit လုပ်ခဲ့သော ပုံသဏ္ဍာန်တူတူကို extrapolate လုပ်နေခြင်းဖြစ်ပြီး ဒီပုံသဏ္ဍာန် ဆက်တည်နေသေးကြောင်း သက်သေမရှိပါ။ Training အလယ်ချက်အနီးတွင် fit လုပ်ထားသော ဆက်နွယ်မှုသည် တကယ့်ဥပမာများနှင့် တိုက်ရိုက် စစ်ဆေးထားခဲ့သည်; ဝေးလံစွာအပြင်တွင်မူ ၎င်းသည် စစ်ဆေးထားသော အချက်မဟုတ်ဘဲ ယူဆချက်တစ်ခုသာဖြစ်သည်။'
        ),
      },
    },
    question: bl(
      'What does the trained model say will happen next?',
      'What does the fitted model say will happen for new, unseen inputs?',
      'လေ့ကျင့်ပြီးသား မော်ဒယ်က ဘာဖြစ်လာမယ်လို့ ပြောသလဲ။',
      'Fit လုပ်ပြီးသား မော်ဒယ်က မမြင်ဖူးသေးသည့် input အသစ်များအတွက် မည်သို့ ခန့်မှန်းသနည်း။'
    ),
    what: bl(
      'The trained model is pointed at fresh inputs it has never seen and produces a guess — a point forecast plus (ideally) a range of uncertainty around it.',
      'The fitted model is applied to new/unseen inputs to generate an output: a point forecast + prediction interval. This is the pipeline\'s other hinge to Stats mode — Module 2\'s Estimation vs. Prediction panel below makes the contrast explicit.',
      'လေ့ကျင့်ပြီးသား မော်ဒယ်ကို မမြင်ဖူးသေးသော input အသစ်များနှင့် စမ်းသပ်ပြီး ခန့်မှန်းချက်တစ်ခု ထုတ်ပေးသည် — point forecast နှင့် (အကောင်းဆုံးဆိုရင်) မသေချာမှု အပိုင်းအခြားတစ်ခုပါ။',
      'Fit လုပ်ပြီးသား မော်ဒယ်ကို input အသစ်များတွင် အသုံးချပြီး output ထုတ်ပေးသည်: point forecast + prediction interval။ ဤသည်မှာ Stats mode သို့ ချိတ်ဆက်ချက်တစ်ခုဖြစ်ပြီး၊ အောက်ပါ Estimation vs. Prediction panel က ကွာခြားချက်ကို ရှင်းလင်းစွာ ပြသသည်။'
    ),
    goldExample: bl(
      'Feed next month\'s expected real-yield/DXY/inflation values into the fitted model → it outputs "gold: $4,180 ± $150".',
      'Feed next-period driver forecasts into the fitted ensemble → point forecast + interval, e.g. "$4,180 ± $150 (95%)" — an inference step, not a re-estimation of parameters.',
      'လာမည့်လအတွက် မျှော်မှန်းထားသော real-yield/DXY/inflation တန်ဖိုးများကို fit လုပ်ပြီးသား မော်ဒယ်ထဲထည့်သွင်းလိုက်သောအခါ → "ရွှေ: $4,180 ± $150" ဟု ထုတ်ပေးသည်။',
      'နောက်ကာလ driver ခန့်မှန်းချက်များကို fit လုပ်ပြီးသား ensemble ထဲထည့်လိုက်သောအခါ → point forecast + interval, ဥပမာ "$4,180 ± $150 (95%)" — ၎င်းသည် inference အဆင့်ဖြစ်ပြီး ပါရာမီတာ ပြန်လည်ခန့်မှန်းခြင်း မဟုတ်ပါ။'
    ),
  },
  {
    id: 'evaluation',
    n: 7,
    stage: 'Evaluation → Deployment → Monitoring',
    stageName: blSame('Evaluation → Deployment → Monitoring', 'Evaluation → Deployment → Monitoring'),
    spark: {
      analogy: bl(
        "A ship's compass can drift out of true calibration over months at sea without ever breaking outright — it just quietly starts pointing a few degrees wrong, and the crew only finds out by comparing it against the stars. A deployed model is the same: nothing crashes, it just quietly gets less right, and only monitoring catches it.",
        'Evaluation scores accuracy honestly (Module 5\'s metrics), deployment ships the model, and monitoring watches for concept drift over time — because a model frozen at training time doesn\'t know the world kept moving.',
        'သင်္ဘောတစ်စင်းရဲ့ အရပ်မျက်နှာညွှန်သည် လအတန်ကြာ ပင်လယ်ထဲမှာ လုံးဝမပျက်စီးဘဲ calibration လွဲသွားနိုင်သည် — ၎င်းက ဒီဂရီအနည်းငယ် မှားယွင်းစွာ ညွှန်းစတင်ပြီး ကြယ်များနှင့် နှိုင်းယှဉ်ကြည့်မှသာ crew က သိရသည်။ Deploy လုပ်ပြီးသား model လည်း အလားတူပါပဲ — ဘာမှ crash မဖြစ်ပါ၊ တိတ်တဆိတ် မှန်ကန်မှု လျော့နည်းလာရုံသာဖြစ်ပြီး monitoring ကသာ ဖမ်းယူနိုင်သည်။',
        'Evaluation က တိကျမှုကို ရိုးသားစွာ အမှတ်ပေးသည် (Module 5 ၏ metrics)၊ deployment က model ကို ဖြန့်ချိသည်၊ monitoring က အချိန်ကြာလာသည်နှင့်အမျှ concept drift ကို စောင့်ကြည့်သည် — ဘာကြောင့်ဆိုသော် train လုပ်ချိန်တွင် ရပ်တန့်နေသော model သည် ကမ္ဘာကြီးက ဆက်ရွေ့လျားနေသေးကြောင်း မသိသောကြောင့်ဖြစ်သည်။'
      ),
      predict: {
        question: bl(
          "A gold model has been running unchanged since 2023. In 2026, central-bank buying patterns shift sharply. Without retraining, what happens to the model's accuracy?",
          "A gold model has been running unchanged since 2023. In 2026, central-bank buying patterns shift sharply. Without retraining, what happens to the model's accuracy?",
          'ရွှေ model တစ်ခုသည် ၂၀၂၃ ကတည်းက မပြောင်းလဲဘဲ လည်ပတ်နေသည်။ ၂၀၂၆ တွင် ဗဟိုဘဏ်ဝယ်ယူမှုပုံစံ ပြင်းထန်စွာ ပြောင်းလဲသွားသည်။ ပြန်လေ့ကျင့်ခြင်းမလုပ်ဘဲ model ၏ တိကျမှု ဘာဖြစ်သွားမလဲ?',
          'ရွှေ model တစ်ခုသည် ၂၀၂၃ ကတည်းက မပြောင်းလဲဘဲ လည်ပတ်နေသည်။ ၂၀၂၆ တွင် ဗဟိုဘဏ်ဝယ်ယူမှုပုံစံ ပြင်းထန်စွာ ပြောင်းလဲသွားသည်။ ပြန်လေ့ကျင့်ခြင်းမလုပ်ဘဲ model ၏ တိကျမှု ဘာဖြစ်သွားမလဲ?'
        ),
        options: [
          bl('It stays exactly as accurate — models don\'t degrade if the code doesn\'t change', 'တိကျမှုအတိုင်း အတိအကျ ဆက်ရှိနေသည် — code မပြောင်းလဲလျှင် model ကျဆင်းမှု မရှိပါ'),
          bl("It quietly degrades — the model keeps applying the old (now-stale) pattern to a changed world", 'တိတ်တဆိတ် ကျဆင်းသည် — model သည် ပြောင်းလဲသွားပြီးသော ကမ္ဘာပေါ်တွင် ဟောင်းနွမ်းနေသော pattern ဟောင်းကို ဆက်လက်အသုံးချနေသည်'),
          bl('It automatically retrains itself the moment it detects the shift', 'ပြောင်းလဲမှုကို တွေ့ရှိလိုက်သည့်အခိုက် သူ့ဘာသာ အလိုအလျောက် ပြန်လေ့ကျင့်သည်'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag past month 14 (the illustrative regime shift), does the error rate stay flat or jump?', 'လ ၁၄ (ဥပမာ regime ပြောင်းလဲမှု) ကို ကျော်ဆွဲလျှင် error နှုန်း ညီညီနေမလား ခုန်တက်မလား?'),
        options: [blSame('Stays flat', 'ညီညီနေသည်'), blSame('Jumps up', 'ခုန်တက်သည်')],
        correctIndex: 1,
      },
      paramLabel: blSame('Months since deployment (no retraining)', 'Deploy လုပ်ပြီးနောက် လအရေအတွက် (ပြန်မလေ့ကျင့်ရသေး)'),
      paramMin: 0, paramMax: 36, paramDefault: 0, paramStep: 1, paramDecimals: 0,
      compute: (v) => (v < 14 ? 1.2 : 1.2 + (v - 14) * 0.35),
      outputLabel: blSame('Toy error rate (illustrative, regime shift ~month 14)', 'ဥပမာ error နှုန်း (သရုပ်ဖော်၊ regime ပြောင်းမှု ~လ 14)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Worked example: monitoring a deployed model\'s RMSE month by month. Step 1 — establish a training-time baseline RMSE, say 90 (this is the "normal" error to compare against). Step 2 — track live RMSE each month; through most of 2025 it hovers near 90-100, consistent with baseline. Step 3 — in Q1 2026, live RMSE jumps to 180+ as central-bank buying patterns shift sharply (net purchases fell to 16 tons after averaging ~225/quarter) — this crossing a threshold is exactly the "drift detected — retrain?" flag Module 5 builds live.',
        'Formally: track RMSE_t vs. RMSE_baseline over time; flag drift when RMSE_t > k × RMSE_baseline for some threshold k (Module 5 uses a concrete numeric threshold you can inspect directly). The statistical logic is identical to a control chart in manufacturing quality monitoring — a well-established idea borrowed wholesale, not invented for ML.',
        'ဖြေရှင်းချက်ဥပမာ: deploy လုပ်ပြီးသား model ၏ RMSE ကို လစဉ် စောင့်ကြည့်ခြင်း။ အဆင့် ၁ — training-time baseline RMSE ကို 90 ဟု သတ်မှတ်ပါ (နှိုင်းယှဉ်ရမည့် "ပုံမှန်" error ဖြစ်သည်)။ အဆင့် ၂ — live RMSE ကို လစဉ်ခြေရာခံပါ; ၂၀၂၅ အများစုတွင် 90-100 ခန့် baseline နှင့်ကိုက်ညီစွာ ရှိနေသည်။ အဆင့် ၃ — ၂၀၂၆ Q1 တွင် ဗဟိုဘဏ်ဝယ်ယူမှုပုံစံ ပြင်းထန်စွာ ပြောင်းလဲသွားသောကြောင့် (တစ်လျှပတ် ~225 တန် ပျမ်းမျှမှ 16 တန်သို့ကျဆင်း) live RMSE သည် 180+ သို့ ခုန်တက်သွားသည် — threshold ဖြတ်ကျော်သွားခြင်းသည် Module 5 က live တည်ဆောက်ထားသော "drift detected — retrain?" flag အတိအကျပင်ဖြစ်သည်။',
        'တရားဝင်: RMSE_t ကို RMSE_baseline နှင့် အချိန်တစ်လျှောက် နှိုင်းယှဉ်ခြေရာခံပါ; RMSE_t > k × RMSE_baseline ဖြစ်လျှင် drift အဖြစ် flag လုပ်ပါ (Module 5 က တိုက်ရိုက်စစ်ဆေးနိုင်သော တိကျသောဂဏန်း threshold k သုံးသည်)။ Statistical logic သည် ကုန်ထုတ်လုပ်ငန်း အရည်အသွေးစောင့်ကြည့်ရေးရှိ control chart နှင့် တူညီသည် — ML အတွက် တီထွင်ထားခြင်းမဟုတ်ဘဲ ကောင်းစွာတည်ငြိမ်ထားပြီးသား idea တစ်ခု တစ်ခုလုံးငှားယူထားခြင်းဖြစ်သည်။'
      ),
      faded: bl(
        'Now you try: a politics-forecasting model has baseline RMSE (or error) of 5 points. Its live error this month is 11 points. Step 1 — compute the ratio: 11 ÷ 5 = _____. Step 2 — if the drift threshold is "ratio > 1.5", has drift been detected? _____. Step 3 — what should happen next: _____.',
        'Now you try: apply the same ratio-to-threshold logic to a hypothetical politics-model drift scenario, and state the correct action once drift crosses the threshold.',
        'အခု သင်ကိုယ်တိုင် စမ်းကြည့်ပါ: နိုင်ငံရေးခန့်မှန်းသော model တစ်ခု၏ baseline RMSE (သို့မဟုတ် error) သည် ၅ မှတ်ဖြစ်သည်။ ဒီလ live error သည် ၁၁ မှတ်ဖြစ်သည်။ အဆင့် ၁ — ratio ကို တွက်ပါ: 11 ÷ 5 = _____။ အဆင့် ၂ — drift threshold သည် "ratio > 1.5" ဖြစ်ပါက drift တွေ့ရှိသလား? _____။ အဆင့် ၃ — နောက်ဘာဖြစ်သင့်လဲ: _____။'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'continuousLearning',
      analogyBreakdown: blSame(
        "The compass analogy is fairly accurate, but has one difference: a physical compass drifts because of gradual mechanical wear — a genuinely continuous, internal process. A model's \"drift\" isn't the model itself changing at all; it's the world outside changing while the frozen model stays exactly the same. The drift is entirely external.",
        'သံပြားအရပ်မျက်နှာညွှန် ဆင်တူပုံရိပ်သည် တော်တော်တိကျသော်လည်း ကွာဟချက်တစ်ခု ရှိသည်: ရုပ်ပိုင်းဆိုင်ရာ compass သည် ဖြည်းညင်းစွာ mechanical ယိုယွင်းမှုကြောင့် drift ဖြစ်သည် — genuinely ဆက်တိုက်၊ internal process တစ်ခုဖြစ်သည်။ Model ၏ "drift" ဆိုသည်မှာ model ကိုယ်တိုင် ပြောင်းလဲနေခြင်း လုံးဝမဟုတ်ပါ; ရပ်တန့်နေသော model အတိအကျ ဆက်ရှိနေစဉ် ပြင်ပကမ္ဘာက ပြောင်းလဲနေခြင်းသာဖြစ်သည်။ Drift သည် လုံးဝ ပြင်ပမှဖြစ်ပေါ်ခြင်းဖြစ်သည်။'
      ),
      caveat: blSame(
        "A real caveat: some production systems do automate the *retraining* trigger (a scheduled or drift-triggered pipeline that re-runs estimation on fresh data) — but this is still a human-designed system executing a human-set policy, not the model itself deciding to learn more.",
        'တကယ့် caveat: production system အချို့သည် *retraining* trigger ကို automate လုပ်သည် (schedule သို့မဟုတ် drift-trigger ဖြင့် fresh data ပေါ် estimation ကို ပြန်ဆောင်ရွက်ပေးသော pipeline) — ဒါပေမဲ့ ဒါဟာ လူသတ်မှတ်ထားသော policy တစ်ခုကို လုပ်ဆောင်ပေးသော လူဒီဇိုင်းလုပ်ထားသော system ဖြစ်ဆဲဖြစ်ပြီး model ကိုယ်တိုင် ပိုသင်ယူဖို့ ဆုံးဖြတ်နေခြင်း မဟုတ်ပါ။'
      ),
      retrieval: {
        question: blSame(
          'Without looking back: why does a model getting steadily less accurate over time NOT mean the model is "unlearning" or getting worse at what it originally learned?',
          'ပြန်မကြည့်ဘဲ: model တစ်ခု အချိန်ကြာလာသည်နှင့်အမျှ တိကျမှုတဖြည်းဖြည်း လျော့နည်းလာခြင်းသည် model က "မှတ်ဉာဏ်ပျောက်" နေခြင်း သို့မဟုတ် မူလသင်ယူထားသည့်အရာတွင် ပိုမိုညံ့ဖျင်းလာခြင်းကို ဘာကြောင့် မဆိုလိုသလဲ?'
        ),
        answer: blSame(
          "The model's parameters haven't changed at all since training — it's applying the exact same fitted relationship it always did. What changed is the real-world relationship it's being asked to describe. It's not getting worse at yesterday's world; yesterday's world stopped existing.",
          'Model ၏ parameter များသည် train လုပ်ချိန်ကတည်းက လုံးဝ မပြောင်းလဲပါ — ၎င်းက ရှိပြီးသား fit လုပ်ထားသော ဆက်နွယ်မှုအတိအကျကိုသာ ဆက်လက်အသုံးချနေသည်။ ပြောင်းလဲသွားသည်မှာ ၎င်းအား ဖော်ပြခိုင်းထားသော လက်တွေ့ကမ္ဘာ့ ဆက်နွယ်မှုသာဖြစ်သည်။ မနေ့ကကမ္ဘာအတွက် ပိုညံ့ဖျင်းလာတာ မဟုတ်ပါ; မနေ့ကကမ္ဘာ ရပ်တည်မှုမရှိတော့ခြင်းသာဖြစ်သည်။'
        ),
      },
    },
    question: bl(
      'Is it still right, and for how much longer?',
      'Is it still right, and for how long — how do we know when to retrain?',
      'ဒါက ဆက်မှန်နေသေးလား၊ ဘယ်လောက်ကြာအောင်လဲ။',
      '၎င်းသည် ဆက်မှန်နေသေးသလား၊ ဘယ်လောက်ကြာအောင်လဲ — ဘယ်အချိန်မှာ ပြန်လေ့ကျင့်ရမလဲ ဘယ်လိုသိနိုင်သလဲ။'
    ),
    what: bl(
      'Score the model\'s accuracy honestly, ship it, then keep watching — because the real world keeps changing underneath it, and a model that was right last year can quietly go wrong.',
      'Score accuracy (MAE/RMSE/MAPE/R²/AIC/BIC), ship the model, watch for concept drift, retrain on a schedule or trigger. See Module 5 for the full evaluation/explainability/drift toolkit this stage uses.',
      'မော်ဒယ်၏ တိကျမှုကို ရိုးသားစွာ အမှတ်ပေးပြီး ဖြန့်ချိပြီးနောက် ဆက်ကြည့်နေရမည် — ကမ္ဘာကြီးက အောက်ခြေမှာ ပြောင်းလဲနေဆဲဖြစ်ပြီး၊ မနှစ်ကမှန်ခဲ့သော မော်ဒယ်တစ်ခုသည် တိတ်တဆိတ် မှားလာနိုင်သည်။',
      'တိကျမှုကို အမှတ်ပေးပြီး (MAE/RMSE/MAPE/R²/AIC/BIC)၊ မော်ဒယ်ကို ဖြန့်ချိပြီး၊ concept drift ကို စောင့်ကြည့်ပြီး၊ အချိန်ဇယားအလိုက် သို့မဟုတ် trigger အလိုက် ပြန်လေ့ကျင့်သည်။ ဤအဆင့်က အသုံးပြုသော evaluation/explainability/drift toolkit အပြည့်အစုံအတွက် Module 5 ကို ကြည့်ပါ။'
    ),
    goldExample: bl(
      'Track the model\'s error month by month; when central banks suddenly changed their buying pattern in 2026, the old model\'s errors grew — a sign it needs retraining.',
      'RMSE tracked monthly against a training-time baseline; the 2021–2025 central-bank buying regime shift (net purchases fell to 16 tons in Q1 2026 after averaging ~225 tons/quarter) is exactly the kind of regime change that trips a drift alarm (Module 5).',
      'မော်ဒယ်၏ အမှားကို လစဉ် စောင့်ကြည့်သည်; ၂၀၂၆ ခုနှစ်တွင် ဗဟိုဘဏ်များ၏ ဝယ်ယူမှုပုံစံ ရုတ်တရက်ပြောင်းလဲသွားသောအခါ မော်ဒယ်ဟောင်း၏ အမှားများ ကြီးထွားလာသည် — ပြန်လေ့ကျင့်ရန် လိုအပ်ကြောင်း လက္ခဏာတစ်ခုဖြစ်သည်။',
      'RMSE ကို လစဉ် training-time baseline နှင့် နှိုင်းယှဉ်စောင့်ကြည့်သည်; 2021-2025 ဗဟိုဘဏ် ဝယ်ယူမှုပုံစံပြောင်းလဲမှု (တစ်လျှပတ် ~225 တန် ပျမ်းမျှမှ 2026 Q1 တွင် 16 တန်သို့ကျဆင်း) သည် drift alarm ကို လှုံ့ဆော်စေမည့် regime change အမျိုးအစားပင်ဖြစ်သည် (Module 5)။'
    ),
  },
];
