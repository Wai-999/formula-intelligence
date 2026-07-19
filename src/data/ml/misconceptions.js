import { blSame } from '../../lib/mlContent.js';

// Source: docs/research/ML-Mode-Pedagogy-Research.md §3. One entry per named
// misconception, authored once and referenced by id from wherever a module
// needs to refute it (MisconceptionCallout component), so the six+one
// refutations read as one consistent voice rather than being independently
// drafted per module. Tone is collegial per the mission's own guardrail
// (Section I) — a genuine correction, not a "gotcha."
export const MISCONCEPTIONS = {
  programmedBehavior: {
    id: 'programmedBehavior',
    belief: blSame(
      'A machine learning model is really just a big set of hand-written if/else rules — like ordinary software, someone typed in every case.',
      'Machine learning မော်ဒယ်တစ်ခုဆိုတာ လူတစ်ယောက်က case တိုင်းကို ကိုယ်တိုင်ရေးထည့်ထားတဲ့ if/else rule အစုအဝေးကြီးတစ်ခုပါပဲ — သာမန် software လိုပါပဲ။'
    ),
    truth: blSame(
      'Nobody writes the individual rule. What a person designs is the *shape* — a straight line, a tree of yes/no splits, a network of weighted connections — and then an algorithm searches for the specific numbers (coefficients, split thresholds, weights) that shape should have, using the training data as evidence. Change the data, and the same code produces a completely different model, with no line of code touched.',
      'ဘယ်သူမှ တစ်ခုချင်းစီရဲ့ rule ကို ရေးမထားပါ။ လူတစ်ယောက် ဒီဇိုင်းလုပ်တာက "ပုံသဏ္ဍာန်" ပါပဲ — မျဉ်းဖြောင့်တစ်ခု၊ ဟုတ်/မဟုတ် split များပါသော tree တစ်ခု၊ weight ချိတ်ဆက်မှုများပါသော network တစ်ခု — ပြီးရင် algorithm တစ်ခုက ဒီပုံသဏ္ဍာန်ရှိသင့်တဲ့ တိကျတဲ့ ဂဏန်းများ (coefficient၊ split threshold၊ weight) ကို training data ကို သက်သေအဖြစ်သုံးပြီး ရှာဖွေသည်။ data ကို ပြောင်းလိုက်ရင် code တစ်ကြောင်းမှ မထိပဲ လုံးဝကွဲပြားတဲ့ မော်ဒယ်တစ်ခု ထွက်လာနိုင်တယ်။'
    ),
  },
  exactness: {
    id: 'exactness',
    belief: blSame(
      "A model's output is a precise, certain fact — if it says gold will be $4,180, that's the answer.",
      'မော်ဒယ်ရဲ့ output ဆိုတာ တိကျပြီး သေချာတဲ့ အချက်အလက်တစ်ခုပါ — ရွှေက $4,180 ဖြစ်မယ်လို့ ပြောရင် ဒါက အဖြေပါပဲ။'
    ),
    truth: blSame(
      "Every model output is an estimate built from limited, noisy historical data, and estimates always carry uncertainty. A responsible forecast is a range (a prediction interval or a probability), not a single number — the single number is just the range's midpoint, and treating it as certain throws away the most important part of what the model is telling you: how confident it is.",
      'မော်ဒယ် output တိုင်းဟာ အကန့်အသတ်ရှိပြီး noise ပါတဲ့ historical data ကနေ တည်ဆောက်ထားတဲ့ ခန့်မှန်းချက်တစ်ခုပါပဲ၊ ခန့်မှန်းချက်တိုင်းမှာ uncertainty ပါဝင်နေတယ်။ တာဝန်သိတဲ့ forecast တစ်ခုဆိုတာ "အပိုင်းအခြား" တစ်ခု (prediction interval သို့မဟုတ် probability) ဖြစ်သင့်တယ်၊ ဂဏန်းတစ်ခုတည်း မဟုတ်ဘူး — ဂဏန်းတစ်ခုတည်းဆိုတာ အပိုင်းအခြားရဲ့ အလယ်ချက်ပဲ ဖြစ်ပြီး၊ ဒါကို သေချာတယ်လို့ ယူဆလိုက်ရင် မော်ဒယ်က တကယ်ပြောနေတဲ့ အရေးအကြီးဆုံးအပိုင်း — သူဘယ်လောက် ယုံကြည်စိတ်ချမှုရှိလဲဆိုတာ — ကို စွန့်ပစ်လိုက်တာပါပဲ။'
    ),
  },
  dataStorage: {
    id: 'dataStorage',
    belief: blSame(
      'The model remembers every example it was trained on and looks them up later, like a lookup table or a search engine.',
      'မော်ဒယ်က train လုပ်ခဲ့တဲ့ ဥပမာတိုင်းကို မှတ်မိပြီး နောက်မှာ lookup table ဒါမှမဟုတ် search engine လိုမျိုး ပြန်ရှာသည်။'
    ),
    truth: blSame(
      "Most models never keep the training data around after fitting — they compress whatever pattern was in the data into a small number of parameters (a handful of coefficients, a tree's split thresholds) and discard the original examples entirely. A fitted linear regression can't tell you what its 500th training row was; it only remembers the slope and intercept it learned from all of them combined. K-Nearest Neighbors is the genuine exception on this map — it really does keep every training point and looks up the closest ones at prediction time, which is exactly why it's slow on large datasets and every other model here isn't.",
      'မော်ဒယ်အများစုက fit လုပ်ပြီးရင် training data ကို လုံးဝမသိမ်းထားတော့ပါ — data ထဲမှာရှိတဲ့ pattern ကို parameter အနည်းငယ်ထဲ (coefficient အနည်းငယ်၊ tree ရဲ့ split threshold များ) ကို ချုံ့ထည့်ပြီး မူရင်း ဥပမာများကို လုံးဝစွန့်ပစ်လိုက်သည်။ fit လုပ်ပြီးသား linear regression တစ်ခုက သူ့ရဲ့ training row အမှတ် ၅၀၀ က ဘာလဲဆိုတာ ပြောမပေးနိုင်ပါ — အားလုံးပေါင်းပြီး သင်ယူခဲ့တဲ့ slope နဲ့ intercept ကိုသာ မှတ်ထားသည်။ K-Nearest Neighbors ကတော့ ဒီမြေပုံပေါ်က တကယ့် ခြွင်းချက်ဖြစ်သည် — training point တိုင်းကို တကယ်သိမ်းထားပြီး prediction လုပ်ချိန်တွင် အနီးဆုံးအမှတ်များကို ပြန်ရှာသည် — ဒါကြောင့်ပဲ ဒေတာများသောအခါ နှေးပြီး၊ ဒီမြေပုံပေါ်က တခြားမော်ဒယ်တိုင်း မဟုတ်တာပါ။'
    ),
  },
  continuousLearning: {
    id: 'continuousLearning',
    belief: blSame(
      'Once a model is deployed, it keeps learning and improving automatically as it is used, like a person gaining experience.',
      'မော်ဒယ်ကို deploy လုပ်ပြီးသွားရင် လူတစ်ယောက် အတွေ့အကြုံရလာသလိုမျိုး အလိုအလျောက် ဆက်သင်ယူပြီး တိုးတက်နေတယ်။'
    ),
    truth: blSame(
      "A deployed model is frozen. Its parameters stop changing the moment training ends, and using it — even thousands of times a day — doesn't teach it anything new. If the world it was trained on changes (a market regime shifts, a relationship breaks down), the model doesn't notice and doesn't adapt; it just keeps confidently applying the old pattern to a world that's moved on. That's concept drift, and it's why production systems need someone to deliberately retrain the model on fresh data — the model will never do this for itself.",
      'Deploy လုပ်ပြီးသား မော်ဒယ်ဟာ ရပ်တန့်နေသည်။ Training ပြီးတဲ့ချိန်မှာ parameter တွေက ပြောင်းလဲမှုမရှိတော့ပါ၊ တစ်နေ့ကို အကြိမ်ထောင်ပေါင်းများစွာ သုံးနေရင်တောင် ဘာအသစ်မှ မသင်ယူပါ။ Train လုပ်ခဲ့တဲ့ ကမ္ဘာက ပြောင်းသွားရင် (market regime ပြောင်းသွားတာ၊ ဆက်နွယ်မှု ပျက်သွားတာ) မော်ဒယ်က မသတိထားမိပါ၊ လိုက်လျောညီထွေမဖြစ်ပါ — ရှေးဟောင်း pattern ကို ပြောင်းသွားပြီးသား ကမ္ဘာပေါ်မှာ ယုံကြည်စိတ်ချစွာ ဆက်အသုံးချနေမည်ဖြစ်သည်။ ဒါကို concept drift ဟုခေါ်ပြီး၊ ဒါကြောင့် production system များက လူတစ်ယောက်က deliberately အသစ်တဖန် retrain လုပ်ဖို့ လိုအပ်တာဖြစ်သည် — မော်ဒယ်က ဒါကို ကိုယ်တိုင် ဘယ်တော့မှ မလုပ်ပါ။'
    ),
  },
  userTrainedModel: {
    id: 'userTrainedModel',
    belief: blSame(
      "Moving the sliders in this app's Playground is training 'the' AI model — like teaching a real system.",
      "ဒီ app ရဲ့ Playground ထဲမှာ slider တွေကို ရွှေ့တာက 'တကယ့်' AI မော်ဒယ်ကို train လုပ်နေတာပါ — တကယ့် system တစ်ခုကို သင်ကြားပေးနေသလိုမျိုး။"
    ),
    truth: blSame(
      "The Playground fits a small, local, disposable demo model live in your browser, to a synthetic dataset generated just for this session. Nothing here is training or updating any shared, persistent, or production model — closing this tab discards everything it just fit. It's a sandbox for building intuition about how fitting works, not a control panel for a real system.",
      'Playground က သင့် browser ထဲမှာပဲ live ဖြစ်တဲ့ သေးငယ်ပြီး local ဖြစ်တဲ့၊ throwaway demo မော်ဒယ်တစ်ခုကို ဒီ session အတွက်ပဲ ဖန်တီးထားတဲ့ synthetic dataset တစ်ခုအပေါ် fit လုပ်ပေးနေတာပါ။ ဒီနေရာမှာ ဘုံသုံး၊ ကာလရှည်ရှိတဲ့၊ ဒါမှမဟုတ် production မော်ဒယ်ကို train လုပ်နေတာ သို့မဟုတ် update လုပ်နေတာ လုံးဝမဟုတ်ပါ — ဒီ tab ကို ပိတ်လိုက်ရင် fit လုပ်ခဲ့တဲ့အရာအားလုံး ပျောက်သွားမည်။ Fit လုပ်ခြင်း ဘယ်လိုအလုပ်လုပ်လဲဆိုတာ intuition တည်ဆောက်ဖို့ sandbox တစ်ခုသာဖြစ်ပြီး၊ တကယ့် system အတွက် control panel မဟုတ်ပါ။'
    ),
  },
  autonomousDataAcquisition: {
    id: 'autonomousDataAcquisition',
    belief: blSame(
      'The model automatically goes out and finds or fetches whatever new data it needs on its own.',
      'မော်ဒယ်က လိုအပ်တဲ့ data အသစ်ကို သူ့ဘာသာ အလိုအလျောက် သွားရှာ ဒါမှမဟုတ် ယူလာသည်။'
    ),
    truth: blSame(
      "Data collection is a deliberate, human-designed engineering step that happens before a model exists at all — someone decides which APIs to call, which databases to query, which sources to trust, and builds the pipeline that pulls it all together. A model has no agency to go looking for anything; it only ever sees the data someone specifically routed to it.",
      'Data collection ဆိုတာ မော်ဒယ်တစ်ခု ရှိလာမီ ဖြစ်ပျက်ရသော deliberate ဖြစ်ပြီး လူ ဒီဇိုင်းလုပ်ထားတဲ့ engineering အဆင့်တစ်ခုဖြစ်သည် — ဘယ် API ကို ခေါ်ရမလဲ၊ ဘယ် database ကို query လုပ်ရမလဲ၊ ဘယ် source ကို ယုံကြည်ရမလဲဆိုတာ လူတစ်ယောက်က ဆုံးဖြတ်ပြီး ဒီအားလုံးကို စုစည်းပေးမည့် pipeline ကို တည်ဆောက်ပေးသည်။ မော်ဒယ်မှာ ဘာမှ သွားရှာရန် agency မရှိပါ — လူတစ်ယောက်က တိကျစွာ ပို့ပေးလိုက်တဲ့ data ကိုသာ တွေ့မြင်ရသည်။'
    ),
  },
  lessBiasedThanHumans: {
    id: 'lessBiasedThanHumans',
    belief: blSame(
      'A model trained on data is more objective and less biased than a human judgment would be.',
      'Data ပေါ်မှာ train လုပ်ထားတဲ့ မော်ဒယ်တစ်ခုက လူတစ်ယောက်ရဲ့ ဆုံးဖြတ်ချက်ထက် ပိုပြီး objective ဖြစ်ပြီး bias နည်းသည်။'
    ),
    truth: blSame(
      "A model can only be as unbiased as the data and labels it was trained on — and that data was collected, selected, and labeled by people, with all of the same human choices about what counts, whose voices are represented, and what the 'right answer' looked like historically baked in. A geopolitical risk score built from whichever news sources and historical conflict records were chosen to train it doesn't remove human judgment from the process — it just makes that judgment harder to see, because it's now embedded in numbers instead of stated as an opinion.",
      'မော်ဒယ်တစ်ခုဟာ သူ train လုပ်ခဲ့ရတဲ့ data နဲ့ label အတိုင်းသာ unbiased ဖြစ်နိုင်တယ် — ပြီးတော့ ဒီ data ကို လူတွေက စုဆောင်း၊ ရွေးချယ်၊ label တပ်ခဲ့ကြတာဖြစ်ပြီး ဘာတွေ အရေးကြီးလဲ၊ ဘယ်သူတွေရဲ့ အသံပါဝင်လဲ၊ historically "အဖြေမှန်" က ဘယ်လိုပုံစံလဲဆိုတဲ့ လူ့ဆုံးဖြတ်ချက်တွေ အားလုံးက ပါဝင်နေတယ်။ ဘယ်သတင်းရင်းမြစ်၊ ဘယ် historical conflict record တွေကို ရွေးချယ်ပြီး train လုပ်ခဲ့လဲဆိုတာအပေါ် တည်ဆောက်ထားတဲ့ ပထဝီရေးအန္တရာယ် score တစ်ခုဟာ လုပ်ငန်းစဉ်ထဲက လူ့ဆုံးဖြတ်ချက်ကို ဖယ်ရှားလိုက်တာ မဟုတ်ဘူး — အဲ့ဒီဆုံးဖြတ်ချက်ကို ဂဏန်းတွေထဲမှာ ဝှက်ထားလိုက်ခြင်းသာဖြစ်လို့ မြင်ရခက်အောင် လုပ်လိုက်တာပါ။'
    ),
  },
};
