import { bl } from '../../lib/mlContent.js';

// Interleaved cross-domain check questions (docs/research/ML-Mode-Pedagogy-Research.md
// §1 "Desirable Difficulties — Interleaving"), surfaced once a learner has
// visited 2+ of Gold/Macro/Micro/Politics (D.4). Each question genuinely
// requires reasoning across two domains' actual mechanics — not two
// unrelated facts glued together — grounded in each lab's real driver
// coefficients and model comparisons.
export const MIXED_REVIEW_QUESTIONS = [
  {
    id: 'gold-politics-1',
    domains: ['gold', 'politics'],
    question: bl(
      'Real yields just rose 0.5 points AND a geopolitical shock just hit (+1.5 on the risk driver). Which effect dominates gold\'s move?',
      'Real yields ၀.၅ point တက်လာသည် နှင့် တစ်ချိန်တည်းမှာပင် ပထဝီရေး shock တစ်ခု (geoRisk driver +၁.၅) ဆိုက်ရောက်လာသည်။ ရွှေဈေးရဲ့ ရွေ့လျားမှုကို ဘယ်အချက်က ဒါဏ်လွှမ်းမိုးမလဲ?'
    ),
    options: [
      bl('Real yields — the price falls overall', 'Real yields — ဈေးနှုန်း ကျဆင်းသွားမည်'),
      bl('The geopolitical shock — the price rises overall', 'ပထဝီရေး shock — ဈေးနှုန်း တက်လာမည်'),
      bl('They cancel out exactly, no net move', 'အပြန်အလှန် ပယ်ဖျက်ပြီး ဘာမှမပြောင်း'),
    ],
    correctIndex: 1,
    explanation: bl(
      "Gold's real yields coefficient is -180/unit and geoRisk is +110/unit: 0.5×(-180) = -90 from yields, but 1.5×110 = +165 from the shock. The shock wins, net roughly +75. Two real, opposite-signed drivers moving at once is exactly what the trace panel in Module 6 is built to untangle.",
      "ရွှေရဲ့ real yields coefficient က -180/unit ဖြစ်ပြီး geoRisk က +110/unit ဖြစ်သည်: 0.5×(-180) = -90 (yields ကနေ)၊ ဒါပေမဲ့ 1.5×110 = +165 (shock ကနေ)။ Shock က အနိုင်ရသည်၊ net အားဖြင့် ~+75 ခန့်။ ဆန့်ကျင်ဘက် sign နှစ်ခု တစ်ပြိုင်နက်တည်း ရွေ့လျားနေတာကို ခွဲခြမ်းစိတ်ဖြာဖို့အတွက် Module 6 ရဲ့ trace panel ကို တည်ဆောက်ထားတာဖြစ်သည်။"
    ),
  },
  {
    id: 'macro-micro-1',
    domains: ['macro', 'micro'],
    question: bl(
      "Random Forest is the most accurate choice for GDP nowcasting in Module 7. Is it also the right default for Micro's price-elasticity problem in Module 8?",
      'Random Forest သည် Module 7 ရဲ့ GDP nowcasting အတွက် တိကျဆုံးရွေးချယ်မှုဖြစ်သည်။ ၎င်းသည် Module 8 ရဲ့ ဈေးနှုန်း-elasticity ပြဿနာအတွက်လည်း default ကောင်းတစ်ခုဖြစ်ပါသလား?'
    ),
    options: [
      bl('Yes — Random Forest wins at every forecasting task', 'ဟုတ်သည် — Random Forest သည် forecasting task တိုင်းတွင် အနိုင်ရသည်'),
      bl('Not necessarily — Module 8 highlights Gradient Boosting specifically, for a different reason (capturing promotions/thresholds, not averaging noisy signals)', 'မလိုအပ်ပါ — Module 8 က Gradient Boosting ကို အထူးပြထားသည်၊ အကြောင်းရင်း မတူညီပါ (promotion/threshold ဖမ်းယူခြင်း၊ noisy signal ပျမ်းမျှခြင်း မဟုတ်ပါ)'),
      bl('No — no model comparison applies to price elasticity at all', 'မဟုတ်ပါ — ဈေးနှုန်း elasticity အတွက် model နှိုင်းယှဉ်မှု မသက်ဆိုင်ပါ'),
    ],
    correctIndex: 1,
    explanation: bl(
      "\"Best model\" is task-dependent, not universal. Random Forest's strength in Module 7 is averaging many noisy macro signals into a stable nowcast. Micro's gradient boosting instead earns its place by capturing a specific structural feature — a genuine price-point discontinuity — that a smooth model would blur. Same family of tools, different jobs.",
      '"အကောင်းဆုံး model" ဆိုတာ task ပေါ်မူတည်သည်၊ universal မဟုတ်ပါ။ Module 7 ရှိ Random Forest ရဲ့ အားသာချက်က noisy macro signal များစွာကို တည်ငြိမ်သော nowcast တစ်ခုအဖြစ် ပျမ်းမျှခြင်းဖြစ်သည်။ Micro ရဲ့ gradient boosting ကမူ တိကျသော structural feature တစ်ခု — တကယ့် ဈေးနှုန်း-အမှတ် discontinuity — ကို ဖမ်းယူခြင်းဖြင့် သူ့နေရာကို ရရှိသည်၊ ချောမွေ့သော model တစ်ခုက မှုန်ဝါးသွားစေမည့်အရာ။ tool family တူသော်လည်း အလုပ်ကွဲသည်။'
    ),
  },
  {
    id: 'gold-macro-1',
    domains: ['gold', 'macro'],
    question: bl(
      "Both Gold and Macro have a \"simplicity can win\" teaching moment — Macro's LASSO beating fancier models. Does Gold's lineup have an equally simple model that's ever the single best performer?",
      'Gold နှင့် Macro နှစ်ခုစလုံးမှာ "ရိုးရှင်းမှုက အနိုင်ရနိုင်သည်" သင်ခန်းစာတစ်ခု ပါသည် — Macro ရဲ့ LASSO က ပိုခေတ်မီသော model များကို အနိုင်ရသည်။ Gold ရဲ့ model list မှာလည်း တစ်ခါတစ်ရံ တစ်ခုတည်းသော အကောင်းဆုံး performer ဖြစ်နိုင်တဲ့ ရိုးရှင်းသော model ရှိပါသလား?'
    ),
    options: [
      bl('Yes — ARIMA can outperform LSTM/XGBoost when the relationship is stable and roughly linear', 'ဟုတ်သည် — ဆက်နွယ်မှု တည်ငြိမ်ပြီး linear နီးပါးလျှင် ARIMA သည် LSTM/XGBoost ကို အနိုင်ရနိုင်သည်'),
      bl('No — the research doc always favors the most complex model for Gold', 'မဟုတ်ပါ — သုတေသနစာတမ်းက Gold အတွက် အရှုပ်ထွေးဆုံး model ကို အမြဲနှစ်သက်သည်'),
      bl('No — model complexity has no bearing on Gold forecasts', 'မဟုတ်ပါ — model ရှုပ်ထွေးမှုသည် Gold forecast အပေါ် ဘာမှသက်ရောက်မှုမရှိပါ'),
    ],
    correctIndex: 0,
    explanation: bl(
      'ML-Research-Reference.md §3.6 states ARIMA/SARIMA is "often lowest error on stable/linear series." The lesson generalizes across every domain in this app, not just Macro: match model complexity to how nonlinear the real relationship actually is, don\'t default to the fanciest available option.',
      'ML-Research-Reference.md §3.6 က ARIMA/SARIMA သည် "stable/linear series တွင် error အနည်းဆုံး ဖြစ်လေ့ရှိသည်" ဟု ဖော်ပြသည်။ ဒီသင်ခန်းစာသည် Macro တစ်ခုတည်းမက app ထဲက domain တိုင်းအတွက် အကျုံးဝင်သည်: model ရှုပ်ထွေးမှုကို တကယ့်ဆက်နွယ်မှု ဘယ်လောက် nonlinear ဖြစ်သလဲဆိုတာနှင့် ကိုက်ညီအောင်ချိန်ညှိပါ၊ ရနိုင်သမျှ အရှုပ်ထွေးဆုံး ရွေးချယ်မှုကို default မလုပ်ပါနှင့်။'
    ),
  },
  {
    id: 'politics-gold-2',
    domains: ['politics', 'gold'],
    question: bl(
      "Politics' geo-risk score is built partly from NLP sentiment on news text. If that news coverage over-reports conflict in one region, what happens when that skewed score feeds Gold's geoRisk driver?",
      'Politics ရဲ့ geo-risk score သည် သတင်းစာသားများပေါ်ရှိ NLP sentiment မှ တစ်စိတ်တစ်ပိုင်း တည်ဆောက်ထားသည်။ ဒီသတင်းလွှမ်းခြုံမှုက ဒေသတစ်ခုတွင် ပဋိပက္ခကို over-report လုပ်ထားလျှင်၊ ဒီ score skew ဖြစ်ပြီး Gold ရဲ့ geoRisk driver ထဲသို့ ဝင်လာရင် ဘာဖြစ်မလဲ?'
    ),
    options: [
      bl("Nothing — Gold's math is independent of how the score was built", 'ဘာမှမဖြစ်ပါ — Gold ရဲ့ တွက်ချက်မှုသည် score ကို ဘယ်လိုတည်ဆောက်ခဲ့လဲဆိုတာနှင့် သီးခြားဖြစ်သည်'),
      bl("The bias flows straight through — Gold's model can't tell a skewed score from an accurate one, it just reacts to the number it's given", 'Bias တိုက်ရိုက် စီးဆင်းလာသည် — Gold ၏ model သည် skew ဖြစ်နေသော score ကို တိကျသော score နှင့် ခွဲခြားမသိနိုင်ပါ၊ ပေးထားသော ဂဏန်းကို တုံ့ပြန်ရုံသာ'),
      bl('Gold automatically corrects for any known bias upstream', 'Gold သည် upstream ရှိ သိထားသော bias ကို အလိုအလျောက် ပြင်ဆင်ပေးသည်'),
    ],
    correctIndex: 1,
    explanation: bl(
      "This is the \"less biased than humans\" misconception (Module 9) made concrete across two domains at once: a number doesn't stop carrying a human choice just because it's now an input to a second model's arithmetic. Whatever skew went into the score arrives, unflagged, in Gold's forecast.",
      'ဒါက Module 9 ရဲ့ "လူထက် bias နည်းသည်" ဆိုတဲ့ အထင်မှားမှုကို domain နှစ်ခုတစ်ပြိုင်နက်တည်း ကွန်ကရစ်ဖြစ်အောင် ပြသထားခြင်းဖြစ်သည်: ဂဏန်းတစ်ခုသည် model ဒုတိယခု၏ တွက်ချက်မှုအတွက် input ဖြစ်လာသည့်တိုင် လူ့ဆုံးဖြတ်ချက်ကို ဆက်မသယ်ဆောင်တော့ဘူးလို့ မဆိုလိုပါ။ score ထဲဝင်သွားတဲ့ skew ဟာ Gold ရဲ့ forecast ထဲကို အမှတ်အသားမရှိပဲ ရောက်လာမည်။'
    ),
  },
  {
    id: 'micro-macro-1',
    domains: ['micro', 'macro'],
    question: bl(
      "Micro's log-log regression assumes one constant % elasticity everywhere. Macro's LASSO is also a linear model. Does LASSO have the exact same blind spot as Micro's log-log baseline?",
      'Micro ရဲ့ log-log regression သည် နေရာတိုင်းတွင် constant % elasticity တစ်ခုတည်းရှိသည်ဟု ယူဆသည်။ Macro ရဲ့ LASSO သည်လည်း linear model တစ်ခုဖြစ်သည်။ LASSO တွင် Micro ရဲ့ log-log baseline နှင့် အတိအကျတူညီသော အားနည်းချက် ရှိပါသလား?'
    ),
    options: [
      bl('Yes — any linear model shares that exact weakness', 'ဟုတ်သည် — linear model မည်သည်ကမဆို အဲ့ဒီအားနည်းချက်တူညီစွာရှိသည်'),
      bl("Not necessarily — LASSO's inputs can already be engineered nonlinear features (lags, thresholds), so \"linear in the coefficients\" isn't the same as \"linear in the original signal\", unlike log-log's single smooth curve by construction", 'မလိုအပ်ပါ — LASSO ၏ input များသည် engineered nonlinear feature (lag၊ threshold) ဖြစ်ပြီးသားဖြစ်နိုင်သည်၊ ဒါကြောင့် "coefficient ထဲမှာ linear ဖြစ်ခြင်း" သည် "မူရင်း signal ထဲမှာ linear ဖြစ်ခြင်း" နှင့် မတူပါ၊ log-log ၏ တည်ဆောက်ပုံအရ ချောမွေ့သော curve တစ်ခုတည်းနှင့် မတူပါ'),
      bl('No — LASSO has no structural weaknesses at all', 'မဟုတ်ပါ — LASSO တွင် structural weakness လုံးဝမရှိပါ'),
    ],
    correctIndex: 1,
    explanation: bl(
      "This is a genuinely researcher-level distinction: a model can be \"linear\" in how it combines its inputs while still capturing nonlinear real-world behavior, if those inputs were themselves engineered to encode the nonlinearity. Log-log's constraint is structural (baked into its one continuous power-law curve); LASSO's isn't, if its feature set is rich enough.",
      'ဒါက တကယ့် researcher-level ခွဲခြားမှုတစ်ခုဖြစ်သည်: model တစ်ခုသည် သူ့ input များကို ပေါင်းစည်းပုံအရ "linear" ဖြစ်နိုင်သော်လည်း၊ ထို input များကိုယ်တိုင် nonlinearity ကို encode လုပ်ရန် engineered ဖြစ်ခဲ့လျှင် nonlinear လက်တွေ့အပြုအမူကို ဆက်လက်ဖမ်းယူနိုင်သည်။ Log-log ၏ ကန့်သတ်ချက်သည် structural ဖြစ်သည် (၎င်း၏ continuous power-law curve တစ်ခုတည်းထဲတွင် ထည့်သွင်းထားသည်); LASSO ၏ feature set ကြွယ်ဝလျှင် LASSO တွင် ဒီကန့်သတ်ချက် မရှိပါ။'
    ),
  },
  {
    id: 'politics-micro-1',
    domains: ['politics', 'micro'],
    question: bl(
      "Politics' election model narrows its credible interval as days-until-election shrinks — more data, less uncertainty. Micro's demand curve doesn't narrow anything as you adjust price. Why not?",
      'Politics ရဲ့ ရွေးကောက်ပွဲ model သည် ရွေးကောက်ပွဲအထိ ကျန်ရှိသောရက် လျော့နည်းလာသည်နှင့်အမျှ credible interval ကို ကျဉ်းသွားစေသည် — data ပိုများ၊ uncertainty ပိုနည်း။ Micro ရဲ့ demand curve သည် ဈေးနှုန်းချိန်ညှိသည့်အခါ ဘာကိုမှ မကျဉ်းစေပါ။ ဘာကြောင့်လဲ?'
    ),
    options: [
      bl("Micro's models are simply better and don't need uncertainty bands", 'Micro ၏ model များသည် ပိုကောင်းသောကြောင့် uncertainty band မလိုအပ်ပါ'),
      bl('Different mechanism entirely: election uncertainty shrinks because more real polling data literally arrives over time; moving Micro\'s price slider explores a fixed, already-fitted curve — it doesn\'t generate any new data', 'လုံးဝကွဲပြားသော mechanism ဖြစ်သည်: ရွေးကောက်ပွဲ uncertainty သည် အချိန်ကြာလာသည်နှင့်အမျှ တကယ့် poll data ပိုများလာသောကြောင့် ကျဉ်းသွားခြင်းဖြစ်သည်; Micro ၏ ဈေးနှုန်း slider ကို ရွှေ့ခြင်းသည် fit လုပ်ပြီးသား curve တစ်ခုကို ရှာဖွေခြင်းသာဖြစ်ပြီး data အသစ်ဘာမှ မထုတ်ပေးပါ'),
      bl('Micro should also narrow an interval and this is a gap in the lab', 'Micro သည်လည်း interval ကျဉ်းသင့်ပြီး ဒါက lab ရဲ့ လိုအပ်ချက်တစ်ခုဖြစ်သည်'),
    ],
    correctIndex: 1,
    explanation: bl(
      "Confusing these two is exactly the kind of gap interleaving is meant to surface: \"the model updates as new information arrives\" (Politics, genuinely true) versus \"exploring an already-fitted model's predictions across its input range\" (Micro's slider, and most of this app's sliders) are different activities that happen to both involve a control moving.",
      'ဒီနှစ်ခုကို ရောထွေးမိခြင်းဟာ interleaving က ပေါ်လွင်စေချင်တဲ့ ကွာဟချက်အမျိုးအစားအတိအကျပါပဲ: "model သည် အချက်အလက်အသစ် ရောက်ရှိလာသည်နှင့်အမျှ update ဖြစ်သည်" (Politics, တကယ်မှန်ကန်သည်) နှင့် "fit လုပ်ပြီးသား model ၏ ခန့်မှန်းချက်များကို ၎င်း၏ input range တစ်လျှောက် စူးစမ်းခြင်း" (Micro ၏ slider နှင့် app ထဲက slider အများစု) တို့ကား control တစ်ခု ရွေ့လျားနေသည့်အချက်တူသော်လည်း လှုပ်ရှားမှုကွဲပြားသည်။'
    ),
  },
];
