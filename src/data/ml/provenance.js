// Data provenance index — the honest form of a "dataset library" for an app
// that deliberately ships no live data.
//
// Every interactive control in the four domain labs is driven by a numeric
// parameter, and each parameter is one of exactly two things: a figure
// traceable to docs/research/ML-Research-Reference.md, or an illustrative
// value chosen to demonstrate a mechanism. docs/DATA_SOURCES.md states that
// split in prose; this file states it as data so the app can SHOW it,
// sorted and filterable, instead of asking the reader to trust a paragraph.
//
// Deliberately NOT a catalog of downloadable datasets (Titanic, house
// prices, and similar). Inventing tabular data to fill such a page would
// contradict the one rule this project has held since Module 6: every
// number a user sees is either real-and-cited or labeled illustrative.
import { GOLD_DRIVERS, GOLD_BASE_PRICE, GOLD_BASE_BAND } from './domains/gold.js';
import { MACRO_DRIVERS, MACRO_BASE_VALUE, MACRO_BASE_BAND } from './domains/macro.js';
import { ELECTION_DRIVERS, GEO_DRIVERS } from './domains/politics.js';

export const PROVENANCE_DOMAINS = [
  {
    id: 'gold',
    tab: 'gold',
    label: 'Gold Price Forecasting',
    section: '6.1',
    baseline: [
      { name: 'Base price', value: `$${GOLD_BASE_PRICE}/oz`, kind: 'derived',
        note: 'Midpoint of the cited $4,000–$4,030 spot range; the range is real, this single point is a chosen simulation baseline.' },
      { name: 'Base uncertainty band', value: `±$${GOLD_BASE_BAND}`, kind: 'illustrative',
        note: 'Chosen to make the band visible at typical driver settings.' },
    ],
    drivers: GOLD_DRIVERS.map((d) => ({
      key: d.key,
      coefficient: d.coefficient,
      kind: 'illustrative',
      note: 'Direction matches the research doc; magnitude is illustrative, not a fitted coefficient.',
    })),
    realParts: [
      'The five-driver feature set itself (real yields, DXY, inflation/Fed path, geopolitical risk, central-bank demand)',
      'Named 2026 bank targets (Goldman ≈$5,800, JPMorgan ≈$5,500, UBS $6,000+)',
      'Qualitative behavior of ARIMA / LSTM / XGBoost / GARCH as described in the literature',
    ],
  },
  {
    id: 'macro',
    tab: 'macro',
    label: 'Macro Nowcasting',
    section: '6.2',
    baseline: [
      { name: 'Base GDP nowcast', value: `${MACRO_BASE_VALUE}% annualized`, kind: 'illustrative',
        note: 'A plausible current-quarter figure used as the simulation origin, not a published nowcast.' },
      { name: 'Base uncertainty band', value: `±${MACRO_BASE_BAND} pp`, kind: 'illustrative' },
    ],
    drivers: MACRO_DRIVERS.map((d) => ({
      key: d.key,
      coefficient: d.coefficient,
      kind: 'illustrative',
      note: 'Sign follows the documented relationship; magnitude illustrative.',
    })),
    realParts: [
      'The nowcasting problem statement and the data-release-lag argument',
      'The model families used in practice for mixed-frequency macro data',
    ],
  },
  {
    id: 'politics',
    tab: 'politics',
    label: 'Political & Geopolitical Risk',
    section: '6.4',
    baseline: [],
    drivers: [
      ...ELECTION_DRIVERS.map((d) => ({ key: `election · ${d.key}`, coefficient: d.coefficient, kind: 'illustrative' })),
      ...GEO_DRIVERS.map((d) => ({ key: `geo · ${d.key}`, coefficient: d.coefficient, kind: 'illustrative' })),
    ],
    realParts: [
      'The documented ~19% prediction-accuracy improvement from a geopolitical-risk feature',
      'The cross-domain link into the Gold lab (geopolitical risk as a shared driver)',
    ],
  },
  {
    id: 'micro',
    tab: 'micro',
    label: 'Micro / Pricing',
    section: '6.3',
    baseline: [],
    drivers: [],
    realParts: [
      'The elasticity framing and the two model lenses applied to a single price axis',
    ],
    note: 'This lab is parameterized inside its own components rather than a shared driver list; every figure it shows is labeled illustrative in-page.',
  },
];

export const PROVENANCE_KINDS = {
  real: { label: 'Research-sourced', icon: 'ti-file-text', tone: 'real' },
  derived: { label: 'Derived from a cited range', icon: 'ti-arrow-narrow-right', tone: 'derived' },
  illustrative: { label: 'Illustrative', icon: 'ti-flask', tone: 'illustrative' },
};

/** Totals for the summary strip at the top of the provenance view. */
export function provenanceTotals() {
  let real = 0, derived = 0, illustrative = 0;
  for (const d of PROVENANCE_DOMAINS) {
    real += d.realParts.length;
    for (const b of d.baseline) (b.kind === 'derived' ? derived++ : illustrative++);
    for (const dr of d.drivers) (dr.kind === 'illustrative' ? illustrative++ : real++);
  }
  return { real, derived, illustrative };
}
