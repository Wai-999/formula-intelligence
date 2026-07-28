export const CHAPTERS = [
  {
    "id": 2,
    "name": "Ch 2: Freq. Distributions",
    "color": "#64748b", "textColorLight": "#5e6d83", "textColor": "#94a3b8"
  },
  {
    "id": 3,
    "name": "Ch 3: Data Description",
    "color": "#3b82f6", "textColorLight": "#2f67c2"
  },
  {
    "id": 4,
    "name": "Ch 4: Probability",
    "color": "#10b981", "textColorLight": "#0b7c56"
  },
  {
    "id": 5,
    "name": "Ch 5: Discrete Distributions",
    "color": "#f59e0b", "textColorLight": "#956007"
  },
  {
    "id": 6,
    "name": "Ch 6: Normal Distribution",
    "color": "#ef4444", "textColorLight": "#c43838", "textColor": "#f87171"
  },
  {
    "id": 7,
    "name": "Ch 7: Confidence Intervals",
    "color": "#8b5cf6", "textColorLight": "#7a51d8", "textColor": "#a78bfa"
  },
  {
    "id": 8,
    "name": "Ch 8: Hypothesis Testing",
    "color": "#ec4899", "textColorLight": "#ba3979"
  },
  {
    "id": 9,
    "name": "Ch 9: Two-Sample Tests",
    "color": "#06b6d4", "textColorLight": "#047488"
  },
  {
    "id": 10,
    "name": "Ch 10: Correlation/Regression",
    "color": "#84cc16", "textColorLight": "#4d760d"
  },
  {
    "id": 11,
    "name": "Ch 11: Chi-Square Tests",
    "color": "#f97316", "textColorLight": "#ae500f"
  },
  {
    "id": 12,
    "name": "Ch 12: ANOVA",
    "color": "#14b8a6", "textColorLight": "#0d766a"
  },
  {
    "id": 13,
    "name": "Ch 13: Nonparametric",
    "color": "#a78bfa", "textColorLight": "#705da7"
  },
  {
    "id": 14,
    "name": "Ch 14: Monte Carlo",
    "color": "#fb7185", "textColorLight": "#a84c59"
  }
];

export const chapterColorMap = Object.fromEntries(CHAPTERS.map(c => [c.id, c.color]));

/**
 * The colour to use when a chapter's identity colour is rendered as TEXT,
 * for the given theme.
 *
 * Chapter colours are chosen to be distinguishable as graph FILLS, where
 * WCAG's text-contrast rule does not apply. As small bold text they fail in
 * both themes, in opposite directions: three are too dark on the dark
 * surface, and all thirteen are too light on the light one. So each carries
 * two same-hue variants — a lightened one for dark mode, a darkened one for
 * light — while `color` itself stays untouched, because it is load-bearing
 * on the map and in the user's mental model of the chapters.
 */
export function chapterTextColor(chapter, theme = 'dark') {
  if (!chapter) return 'inherit';
  if (theme === 'light') return chapter.textColorLight || chapter.color;
  return chapter.textColor || chapter.color;
}
