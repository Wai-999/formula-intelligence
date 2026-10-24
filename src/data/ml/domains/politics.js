import { bl, blSame } from '../../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §6.4. All numeric weights/
// scales in politicsModel.js are illustrative — the doc describes the
// *mechanisms* (hierarchical Bayesian blending of polls+fundamentals that
// reweights over time; a composite risk index feeding into asset prices)
// without a specific reference election or a numeric risk-index formula to
// cite. The Stats-mode cross-reference below points to real, verified
// content (Chapter 14: Monte Carlo) — checked against src/data/chapters.js
// and src/data/nodes.js rather than assumed.
export const POLITICS_CONTEXT = bl(
  'Two very different forecasting problems live under one roof here: predicting who wins an election, and scoring how risky the world looks right now. Both blend structured data with judgment calls under uncertainty — and the second one feeds directly into the gold price lab you already saw.',
  'Election forecasting and geopolitical risk scoring share a common structure — combining heterogeneous signals into a single probabilistic estimate — but serve different purposes. The geopolitical risk index specifically feeds forward into asset-price models, demonstrated below via a live link to the Gold lab.'
);

export const ELECTION_CONTEXT = bl(
  "The Economist's election model blends national and state polls with \"fundamentals\" — the economy, past voting patterns — updated fresh every day. Move the calendar closer to election day and watch the uncertainty band shrink as real polls outweigh the model's structural assumptions.",
  'A dynamic hierarchical Bayesian framework updated daily via Stan, blending national + state-level polls with fundamentals. This structure is architecturally close to Stats mode\'s own Chapter 14: Monte Carlo content — both are simulation-based approaches to quantifying uncertainty rather than a single closed-form estimate.'
);

export const ELECTION_DRIVERS = [
  {
    key: 'fundamentalsLean', coefficient: 1,
    label: blSame('Economic/fundamentals lean'),
    relation: bl('Positive → favors incumbent; negative → favors challenger. Weighted more heavily far from election day.', 'Structural prior — dominates when polling data is scarce'),
  },
  {
    key: 'pollsLean', coefficient: 1,
    label: blSame('Current polling average'),
    relation: bl('Positive → incumbent leads polls; negative → challenger leads. Weighted more heavily close to election day.', 'Likelihood/data term — dominates as polls accumulate near election day'),
  },
];

export const ELECTION_SCENARIOS = [
  {
    id: 'tossup-6mo', label: blSame('Toss-up race, 6 months out'),
    state: { fundamentalsLean: 0.2, pollsLean: -0.2, daysUntilElection: 180, military: 0, diplomatic: 0, sanctions: 0 },
  },
  {
    id: 'landslide-eve', label: blSame('Landslide, election eve'),
    state: { fundamentalsLean: 1.5, pollsLean: 1.8, daysUntilElection: 1, military: 0, diplomatic: 0, sanctions: 0 },
  },
];

export const ELECTION_TRACE_INTRO = bl(
  'These two inputs are blended by weight, not added straight — how much each one counts depends entirely on how many days remain.',
  'Contribution = lean × current weight (fundamentals weight + polls weight always sum to 1, set by days-until-election).'
);

export const ELECTION_INCUMBENT_LABEL = blSame('Incumbent');
export const ELECTION_CHALLENGER_LABEL = blSame('Challenger');
export const ELECTION_DAYS_LABEL = blSame('Days until election');

export const GEO_CONTEXT = bl(
  'Geopolitical risk indices blend structured country data with AI-read sentiment from news and diplomatic text into one score — used to anticipate conflict, investment shifts, and (as you saw in the Gold lab) asset prices.',
  "Real-world indices (BlackRock's Geopolitical Risk Indicator, Geoquant) blend hundreds of structured and NLP-derived variables into a single score. The three sliders below are an illustrative simplification of that same structure."
);

export const GEO_DRIVERS = [
  {
    key: 'military', coefficient: 1,
    label: blSame('Military/conflict signals'),
    relation: bl('Positive → escalating conflict activity', 'Structured country-level indicator'),
  },
  {
    key: 'diplomatic', coefficient: 1,
    label: blSame('Diplomatic tension (NLP sentiment)'),
    relation: bl('Positive → more hostile rhetoric detected in news/diplomatic text', 'NLP-derived sentiment signal'),
  },
  {
    key: 'sanctions', coefficient: 1,
    label: blSame('Economic sanctions activity'),
    relation: bl('Positive → sanctions regime tightening', 'Structured country-level indicator'),
  },
];

export const GEO_SCENARIOS = [
  {
    id: 'conflict-escalates', label: blSame('Regional conflict escalates'),
    state: { fundamentalsLean: 0, pollsLean: 0, daysUntilElection: 90, military: 1.8, diplomatic: 1.2, sanctions: 0.8 },
  },
  {
    id: 'diplomatic-thaw', label: blSame('Diplomatic thaw'),
    state: { fundamentalsLean: 0, pollsLean: 0, daysUntilElection: 90, military: -1.5, diplomatic: -1.8, sanctions: -1.0 },
  },
];

export const GEO_TO_GOLD_LABEL = bl(
  'See how this moves the gold price →',
  'Apply this risk score to Gold lab\'s geopolitical risk driver →'
);

// Module 11 audit (see gold.js's identical note).
export const POLITICS_PAGE_TITLE = blSame('Political & Geopolitical Forecasting');
export const ELECTION_SECTION_TITLE = blSame('Election forecasting');
export const GEO_SECTION_TITLE = blSame('Geopolitical risk index');
export const GEO_RISK_METER_LABEL = blSame('Composite risk score');
export const ELECTION_DAYS_RELATION = blSame(
  'Closer to election day → real polls outweigh the structural prior, and the credible interval narrows.'
);
export const ELECTION_TRACE_LABEL = blSame('Why this estimate?');

// Learning Design System retrofit (Module 9): two Constructive Thought
// Loops (election reweighting; geo-risk "objectivity") feeding one
// consolidated Depth Ladder. Critical Frontier carries "less biased than
// humans" (docs/research/ML-Mode-Pedagogy-Research.md §3's unlabeled
// seventh entry, assigned here specifically) with a concrete example, per
// the mission. The Formalism worked example is computed from the real
// computeElection() formula at fundamentalsLean=+0.2/pollsLean=-0.2 (the
// page's own "Toss-up race" preset's lean values) at two different days-
// out, independently re-derivable by applying that preset and scrubbing
// the days slider.
export const ELECTION_PREDICT_Q = blSame(
  'As election day gets closer, which input gains more influence over the model\'s final call — the fundamentals (economy, past patterns), or the current polls?'
);
export const ELECTION_PREDICT_FUNDAMENTALS = blSame(
  'Fundamentals — economic structure is the more reliable long-term signal'
);
export const ELECTION_PREDICT_POLLS = blSame(
  'Polls — real, current voter opinion eventually outweighs structural assumptions'
);
export const ELECTION_PREDICT_EXPLAIN = blSame(
  'Set fundamentals to +0.2 and polls to −0.2 — they disagree — then scrub the days slider from 180 down to 1 and watch which one the win-probability gauge ends up following.'
);

export const GEO_PREDICT_Q = blSame(
  'This risk score blends structured country data with AI-read news sentiment. Does combining sources this way make it more objective than a human analyst\'s own judgment?'
);
export const GEO_PREDICT_YES = blSame(
  'Yes — combining automated sources removes human bias from the process'
);
export const GEO_PREDICT_NO = blSame(
  "No — the score is still built entirely from human choices about data, sources, and labels"
);
export const GEO_PREDICT_EXPLAIN = blSame(
  'The Critical Frontier tab below works through exactly why, with a concrete example.'
);

export const POLITICS_SPARK_ANALOGY = blSame(
  "A judge and a spreadsheet both have to make a call under uncertainty — the spreadsheet just hides the judgment calls inside formulas instead of stating them out loud. Every weight in these two models (how much polls count, how much a military signal counts) is a human decision wearing a number's clothing."
);

export const POLITICS_MECHANISM_NOTE = blSame(
  "You already ran both mechanisms above — the election model reweights fundamentals vs. polls as you move the days slider, and the geo-risk model recombines its three sliders into one score live. Both react instantly; neither one is thinking about it."
);

export const POLITICS_FORMALISM_WORKED = bl(
  'Worked example: set fundamentals to +0.2, polls to −0.2 (they disagree). At 180 days out, polls\' weight is exactly 0% — the model relies entirely on fundamentals, giving the incumbent a ≈54.7% win probability. Scrub to 1 day out with the SAME two numbers: polls now carry ≈99% of the weight, and the probability flips to ≈45.3% — now favoring the challenger. Neither input value changed; only how much each one was allowed to count did.',
  'Worked example: set fundamentals to +0.2, polls to −0.2 (they disagree). At 180 days out, polls\' weight is exactly 0% — the model relies entirely on fundamentals, giving the incumbent a ≈54.7% win probability. Scrub to 1 day out with the SAME two numbers: polls now carry ≈99% of the weight, and the probability flips to ≈45.3% — now favoring the challenger. Neither input value changed; only how much each one was allowed to count did.'
);
export const POLITICS_FORMALISM_FADED = blSame(
  'Now you try: keep fundamentals at +0.2 and polls at −0.2, and set days-until-election to 45. Step 1 — roughly what fraction of the weight do polls carry at 45 of 180 days (hint: it\'s not linear — check pollsWeight\'s formula shape)? Step 2 — will the win probability at 45 days sit closer to the 180-day answer (≈54.7%) or the 1-day answer (≈45.3%), and why: _____.'
);

export const POLITICS_CF_CONCRETE_EXAMPLE = blSame(
  "A concrete example: suppose the diplomatic-tension signal is built mostly from English-language wire-service coverage. A conflict where one side's state media dominates local reporting but is rarely translated or cited by those same wire services could have its tension systematically under-read — not because the model is deliberately unfair, but because it only ever sees one side's framing of events. The score would still look like a clean, objective number; the bias would just be harder to spot than it would be in a human analyst's written opinion."
);
export const POLITICS_CF_RETRIEVAL_Q = blSame(
  'A newsroom says "we switched from a human risk analyst to an AI risk score, so our coverage is now unbiased." What is the one-sentence problem with this claim?'
);
export const POLITICS_CF_RETRIEVAL_A = blSame(
  "The AI score is only as unbiased as the data, sources, and labels it was trained on — all of which were chosen by people — so switching from a human analyst to a score doesn't remove human judgment, it just moves that judgment earlier in the pipeline and makes it harder to see or question."
);
