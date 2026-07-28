export const CHAPTERS = [
  {
    "id": 2,
    "name": "Ch 2: Freq. Distributions",
    "color": "#64748b", "textColor": "#94a3b8"
  },
  {
    "id": 3,
    "name": "Ch 3: Data Description",
    "color": "#3b82f6"
  },
  {
    "id": 4,
    "name": "Ch 4: Probability",
    "color": "#10b981"
  },
  {
    "id": 5,
    "name": "Ch 5: Discrete Distributions",
    "color": "#f59e0b"
  },
  {
    "id": 6,
    "name": "Ch 6: Normal Distribution",
    "color": "#ef4444", "textColor": "#f87171"
  },
  {
    "id": 7,
    "name": "Ch 7: Confidence Intervals",
    "color": "#8b5cf6", "textColor": "#a78bfa"
  },
  {
    "id": 8,
    "name": "Ch 8: Hypothesis Testing",
    "color": "#ec4899"
  },
  {
    "id": 9,
    "name": "Ch 9: Two-Sample Tests",
    "color": "#06b6d4"
  },
  {
    "id": 10,
    "name": "Ch 10: Correlation/Regression",
    "color": "#84cc16"
  },
  {
    "id": 11,
    "name": "Ch 11: Chi-Square Tests",
    "color": "#f97316"
  },
  {
    "id": 12,
    "name": "Ch 12: ANOVA",
    "color": "#14b8a6"
  },
  {
    "id": 13,
    "name": "Ch 13: Nonparametric",
    "color": "#a78bfa"
  },
  {
    "id": 14,
    "name": "Ch 14: Monte Carlo",
    "color": "#fb7185"
  }
];

export const chapterColorMap = Object.fromEntries(CHAPTERS.map(c => [c.id, c.color]));

/**
 * The colour to use when a chapter's identity colour is rendered as TEXT.
 *
 * Chapter colours are chosen to be distinguishable as graph fills, where
 * WCAG's text-contrast rule does not apply. Three of the thirteen (slate,
 * red, violet) fall below 4.5:1 when reused for small bold labels, which an
 * axe-core audit flagged on the dashboard. Rather than change the identity
 * colours — they are load-bearing on the map and in the user's mental model
 * — those three carry a lightened same-hue variant used only for text.
 */
export function chapterTextColor(chapter) {
  return chapter?.textColor || chapter?.color || 'inherit';
}
