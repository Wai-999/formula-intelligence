// Embedded ML lessons — teaching that used to be a top-level tab and now
// lives inside a page of the learning flow (Master Prompt V3.1 §4: "preserve
// essential model evaluation topics ... inside structured ML lessons";
// "repurpose valuable bias–variance visualizations inside relevant lessons;
// no standalone Playground tab").
//
// `host` is the ML page that renders the lesson; `retiredTab` is the old
// top-level tab whose bookmarks and links now open this lesson. The lesson
// components themselves are lazy-loaded by the host (MLLessons.jsx), so this
// file stays plain data that tests and the router can import.
export const ML_LESSONS = [
  {
    id: 'bias-variance',
    host: 'pipeline',
    retiredTab: 'playground',
    title: 'Bias–variance and model complexity',
    summary: 'Fit polynomial and decision-tree models of growing complexity and watch training error keep falling while validation error turns back up.',
    topics: ['bias–variance trade-off', 'underfitting vs overfitting', 'model complexity', 'train vs validation error'],
  },
  {
    id: 'evaluation',
    host: 'pipeline',
    retiredTab: 'evaluation',
    title: 'Evaluating a model',
    summary: 'Metrics reported with their uncertainty, walk-forward validation that never trains on the future, SHAP and LIME explanations, and concept drift.',
    topics: ['regression metrics with margins', 'walk-forward vs random split (leakage)', 'interpretability: SHAP vs LIME', 'concept drift and retraining'],
  },
];

export const mlLessonById = Object.fromEntries(ML_LESSONS.map((l) => [l.id, l]));
