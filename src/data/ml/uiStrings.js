import { blSame } from '../../lib/mlContent.js';

// Module 11 audit: every domain lab (Gold/Macro/Micro/Politics) repeats a
// handful of section labels verbatim. Centralized here once discovered
// during the bilingual pass, rather than re-translated identically four
// times — see BUILD_LOG.md Module 11.
export const UI_SCENARIO_PRESETS = blSame('Scenario presets', 'Scenario ခန့်မှန်းစဉ်များ');
export const UI_RESET_TO_BASELINE = blSame('Reset to baseline', 'အခြေခံအဆင့်သို့ ပြန်သတ်မှတ်ရန်');

// MLCitation is mounted on nearly every page in every module — found
// hardcoded during the Module 11 pass while spot-checking Playground.
export const UI_ILLUSTRATIVE_DATA = blSame(
  'Illustrative data, calibrated to real-world patterns',
  'သရုပ်ဖော်ဒေတာ — လက်တွေ့ pattern များနှင့် ကိုက်ညီအောင် ချိန်ညှိထားသည်'
);
export const UI_SOURCE_LBL = blSame('Source', 'ရင်းမြစ်');

// TracePanel's empty state, shown on every domain lab (Gold/Macro/Micro/
// Politics) before any driver is touched — found hardcoded during the same
// verification pass as the two strings above; missed by the file-by-file
// audit because it's over 60 characters and the sweep's regex capped match
// length there.
export const UI_TRACE_EMPTY = blSame(
  'All drivers are at baseline — move one above to see its effect traced here.',
  'Driver အားလုံး baseline တွင်ရှိသည် — ၎င်း၏ သက်ရောက်မှုကို ဤနေရာတွင် ခြေရာခံကြည့်ရန် တစ်ခုခုကို ရွှေ့ပါ။'
);

// PredictGate (Learning Design System, docs/research/ML-Mode-Pedagogy-Research.md
// §4.2) — the Constructive Thought Loop's chrome, shared by every predict
// gate across every module.
export const UI_PREDICT_FIRST_LBL = blSame('Predict first', 'ဦးစွာ ခန့်မှန်းပါ');
// {guess} and {actual} are replaced with the resolved option text by the
// component — a full-sentence template, not concatenated fragments, so
// Burmese word order stays grammatical (same reasoning as EV_WF_SUB_TEMPLATE).
export const UI_PREDICT_COMPARE_TEMPLATE = blSame(
  'You predicted {guess} — actual: {actual}',
  'သင် {guess} ဟု ခန့်မှန်းခဲ့သည် — အမှန်: {actual}'
);

// MisconceptionCallout — shared refutation-text chrome.
export const UI_MISCONCEPTION_LBL = blSame('A common misconception', 'အများသုံးများနေတဲ့ အထင်မှားမှု');
export const UI_ACTUALLY_LBL = blSame("What's actually true", 'တကယ်မှန်တာက');

// DepthLadder — the four layer names stay English loanwords (this app's own
// pedagogical-framework vocabulary, kept stable like a term-of-art rather
// than translated per-word), each paired with a short bilingual subtitle so
// a Burmese-only reader still knows what each tab is for.
export const DEPTH_LADDER_SPARK_SUB = blSame('Intuition & analogy', 'အခြေခံ ဆင်တူပုံရိပ်');
export const DEPTH_LADDER_MECHANISM_SUB = blSame('Try it live', 'တိုက်ရိုက် စမ်းကြည့်ပါ');
export const DEPTH_LADDER_FORMALISM_SUB = blSame('Worked example', 'အဆင့်ဆင့် ဖြေရှင်းချက်');
export const DEPTH_LADDER_FRONTIER_SUB = blSame('Judgment & limits', 'ဆုံးဖြတ်ချက်နှင့် အကန့်အသတ်');
export const UI_JUMPED_TO_ADVANCED = blSame(
  "You've covered the basics elsewhere, so this opened straight to Formalism.",
  'တခြားနေရာတွေမှာ အခြေခံတွေ လေ့လာပြီးသားမို့ ဒါက Formalism ကနေ တိုက်ရိုက် ဖွင့်ပေးလိုက်ပါတယ်။'
);

// RetrievalCheck — the Critical Frontier layer's retrieval-practice question.
export const UI_RETRIEVAL_LBL = blSame('Retrieval check', 'ပြန်လည်သတိရမှု စစ်ဆေးမှု');
export const UI_SHOW_ANSWER_BTN = blSame("I've thought about it — show the answer", 'စဉ်းစားပြီးပါပြီ — အဖြေပြပါ');

// Model Map mechanism layer's "try it live elsewhere" cross-link framing.
export const UI_TRY_LIVE_ELSEWHERE = blSame(
  'This model already has a real, live version elsewhere in ML mode — the fastest way to build intuition for it is to go manipulate the real thing, not a toy stand-in.',
  'ဒီမော်ဒယ်မှာ ML mode ရဲ့ တခြားနေရာတစ်ခုမှာ တကယ့် live version ရှိပြီးသားပါ — ဒါအတွက် intuition အမြန်ဆုံး ဆောက်နိုင်တဲ့ နည်းလမ်းက toy stand-in မဟုတ်ဘဲ တကယ့်အရာကို သွားပြီး စမ်းသပ်တာပါပဲ။'
);

// Understanding Tracker — Dreyfus 5-stage vocabulary (docs/research/
// ML-Mode-Pedagogy-Research.md §4.3), translated (unlike the Beginner/
// Researcher depth-toggle's own control labels) since this is content a
// learner needs to understand, not the toggle mechanism itself.
export const DREYFUS_LABELS = {
  novice: blSame('Novice', 'စတင်သူ'),
  advancedBeginner: blSame('Advanced Beginner', 'စတင်သူ (အဆင့်မြင့်)'),
  competent: blSame('Competent', 'အရည်အချင်းပြည့်'),
  proficient: blSame('Proficient', 'ကျွမ်းကျင်သူ'),
  expert: blSame('Expert', 'ကျွမ်းကျင်ပညာရှင်'),
};
export const UI_UNDERSTANDING_TITLE = blSame('Your ML understanding', 'သင့် ML နားလည်မှု');
export const UI_UNDERSTANDING_STAT_TEMPLATE = blSame(
  '{touched} nodes explored · {frontier} reached Critical Frontier',
  'node {touched} ခု လေ့လာပြီး · Critical Frontier ရောက်ရှိသည် {frontier} ခု'
);

// MixedReviewPanel (D.4 interleaving).
export const UI_MIXED_REVIEW_LBL = blSame('Mixed review', 'ရောနှော ပြန်လည်သုံးသပ်မှု');
export const UI_NEXT_QUESTION_BTN = blSame('Next question', 'နောက်မေးခွန်း');
export const UI_MIXED_REVIEW_COLLAPSE = blSame('Collapse', 'ခေါက်ပါ');
export const UI_MIXED_REVIEW_EXPAND = blSame('Cross-domain question available', 'Domain ဖြတ်ကျော် မေးခွန်း ရနိုင်သည်');

// Module 1: one-time ML-mode entry banner (D.3, "User-Trained Model").
export const UI_ENTRY_BANNER_TITLE = blSame('Before you start clicking around', 'စမ်းသပ်စတင်ခြင်းမတိုင်မီ');
export const UI_ENTRY_BANNER_DISMISS = blSame("Got it — let's go", 'နားလည်ပြီ — စလိုက်ကြရအောင်');
