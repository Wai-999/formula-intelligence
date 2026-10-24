import { blSame } from '../../lib/mlContent.js';

// Module 11 audit: every domain lab (Gold/Macro/Micro/Politics) repeats a
// handful of section labels verbatim. Centralized here once discovered
// during the bilingual pass, rather than re-translated identically four
// times — see BUILD_LOG.md Module 11.
export const UI_SCENARIO_PRESETS = blSame('Scenario presets');
export const UI_RESET_TO_BASELINE = blSame('Reset to baseline');

// MLCitation is mounted on nearly every page in every module — found
// hardcoded during the Module 11 pass while spot-checking Playground.
export const UI_ILLUSTRATIVE_DATA = blSame(
  'Illustrative data, calibrated to real-world patterns'
);
export const UI_SOURCE_LBL = blSame('Source');

// TracePanel's empty state, shown on every domain lab (Gold/Macro/Micro/
// Politics) before any driver is touched — found hardcoded during the same
// verification pass as the two strings above; missed by the file-by-file
// audit because it's over 60 characters and the sweep's regex capped match
// length there.
export const UI_TRACE_EMPTY = blSame(
  'All drivers are at baseline — move one above to see its effect traced here.'
);

// PredictGate (Learning Design System, docs/research/ML-Mode-Pedagogy-Research.md
// §4.2) — the Constructive Thought Loop's chrome, shared by every predict
// gate across every module.
export const UI_PREDICT_FIRST_LBL = blSame('Predict first');
// {guess} and {actual} are replaced with the resolved option text by the
// component — a full-sentence template, not concatenated fragments, so
// Burmese word order stays grammatical (same reasoning as EV_WF_SUB_TEMPLATE).
export const UI_PREDICT_COMPARE_TEMPLATE = blSame(
  'You predicted {guess} — actual: {actual}'
);
// Used instead of the template above when guess === actual: showing
// "You predicted X — actual: X" twice reads as a rendering glitch even
// though it's accurate, since both sides display byte-identical text
// (found during the post-mission QA sweep — Gold Lab's driver predict-gate,
// answered correctly). One confirmatory sentence instead of a redundant
// comparison.
export const UI_PREDICT_CORRECT_TEMPLATE = blSame(
  'You predicted correctly — {actual}'
);

// MisconceptionCallout — shared refutation-text chrome.
export const UI_MISCONCEPTION_LBL = blSame('A common misconception');
export const UI_ACTUALLY_LBL = blSame("What's actually true");

// DepthLadder — the four layer names stay English loanwords (this app's own
// pedagogical-framework vocabulary, kept stable like a term-of-art rather
// than translated per-word), each paired with a short bilingual subtitle so
// a Burmese-only reader still knows what each tab is for.
export const DEPTH_LADDER_SPARK_SUB = blSame('Intuition & analogy');
export const DEPTH_LADDER_MECHANISM_SUB = blSame('Try it live');
export const DEPTH_LADDER_FORMALISM_SUB = blSame('Worked example');
export const DEPTH_LADDER_FRONTIER_SUB = blSame('Judgment & limits');
export const UI_JUMPED_TO_ADVANCED = blSame(
  "You've covered the basics elsewhere, so this opened straight to Formalism."
);

// RetrievalCheck — the Critical Frontier layer's retrieval-practice question.
export const UI_RETRIEVAL_LBL = blSame('Retrieval check');
export const UI_SHOW_ANSWER_BTN = blSame("I've thought about it — show the answer");

// Model Map mechanism layer's "try it live elsewhere" cross-link framing.
export const UI_TRY_LIVE_ELSEWHERE = blSame(
  'This model already has a real, live version elsewhere in ML mode — the fastest way to build intuition for it is to go manipulate the real thing, not a toy stand-in.'
);

// Understanding Tracker — Dreyfus 5-stage vocabulary (docs/research/
// ML-Mode-Pedagogy-Research.md §4.3), translated (unlike the Beginner/
// Researcher depth-toggle's own control labels) since this is content a
// learner needs to understand, not the toggle mechanism itself.
export const DREYFUS_LABELS = {
  novice: blSame('Novice'),
  advancedBeginner: blSame('Advanced Beginner'),
  competent: blSame('Competent'),
  proficient: blSame('Proficient'),
  expert: blSame('Expert'),
};
export const UI_UNDERSTANDING_TITLE = blSame('Your ML understanding');
export const UI_UNDERSTANDING_STAT_TEMPLATE = blSame(
  '{touched} nodes explored · {frontier} reached Critical Frontier'
);

// MixedReviewPanel (D.4 interleaving).
export const UI_MIXED_REVIEW_LBL = blSame('Mixed review');
export const UI_NEXT_QUESTION_BTN = blSame('Next question');
export const UI_MIXED_REVIEW_COLLAPSE = blSame('Collapse');
export const UI_MIXED_REVIEW_EXPAND = blSame('Cross-domain question available');

// Module 1: one-time ML-mode entry banner (D.3, "User-Trained Model").
export const UI_ENTRY_BANNER_TITLE = blSame('Before you start clicking around');
export const UI_ENTRY_BANNER_DISMISS = blSame("Got it — let's go");

// Depth Ladder content-layer chrome, reused across every module.
export const UI_WORKED_EXAMPLE_LBL = blSame('Worked example');
export const UI_NOW_YOU_TRY_LBL = blSame('Now you try');
export const UI_ANALOGY_BREAKS_LBL = blSame('Where the analogy breaks down');
export const UI_REAL_CAVEAT_LBL = blSame('A real caveat');
