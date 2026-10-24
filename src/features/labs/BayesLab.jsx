import { useState } from 'react';
import { LabFrame, Slider } from './LabKit.jsx';
import { fmt } from './plot.js';
import { posterior } from './prob.js';

// Bayes updating (required lab): a screening test as natural frequencies on
// 1,000 people, and repeated positive results updating the probability one
// test at a time (each posterior becomes the next prior).

const PRESETS = [
  { id: 'rare', label: 'Rare condition (1%)', prior: 0.01, sens: 0.9, fpr: 0.09 },
  { id: 'common', label: 'Common (10%)', prior: 0.1, sens: 0.9, fpr: 0.09 },
  { id: 'spam', label: 'Spam word “prize”', prior: 0.2, sens: 0.3, fpr: 0.01 },
];

export default function BayesLab() {
  const [s, setS] = useState(PRESETS[0]);
  const [preset, setPreset] = useState('rare');
  const [tests, setTests] = useState(1);
  const set = (patch) => { setPreset(null); setS((o) => ({ ...o, ...patch })); };
  const N = 1000;
  const sick = s.prior * N;
  const tp = s.sens * sick;
  const fp = s.fpr * (N - sick);
  const chain = [s.prior];
  for (let i = 0; i < tests; i++) chain.push(posterior(chain[i], s.sens, s.fpr));
  const post = chain[chain.length - 1];

  // 1,000 people as a 40 × 25 grid of dots, ordered: true positives,
  // false negatives, false positives, true negatives.
  const tpN = Math.round(tp);
  const fnN = Math.round(sick) - tpN;
  const fpN = Math.round(fp);
  const kinds = [];
  for (let i = 0; i < N; i++) kinds.push(i < tpN ? 'tp' : i < tpN + fnN ? 'fn' : i < tpN + fnN + fpN ? 'fp' : 'tn');

  const readout = `Of ${N} people, ${fmt(sick, 1)} have it; the test catches ${fmt(tp, 1)} of them and also flags ${fmt(fp, 1)} of the ${fmt(N - sick, 1)} who do not. `
    + `So of everyone who tests positive, ${fmt(tp, 1)} ÷ ${fmt(tp + fp, 1)} = ${fmt(chain[1] * 100, 1)}% actually have it. `
    + (tests > 1 ? `After ${tests} independent positive results: ${fmt(post * 100, 1)}%.` : '');

  return (
    <LabFrame
      title="Updating with Bayes’ theorem"
      intro="Every dot is a person. Filled dots tested positive. The question is not “how accurate is the test?” but “of the filled dots, how many are really sick?”"
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setS(PRESETS.find((p) => p.id === id)); setTests(1); }}
      onReset={() => { setPreset('rare'); setS(PRESETS[0]); setTests(1); }}
      figure={(
        <svg viewBox="0 0 420 300" className="lab-svg">
          {kinds.map((k, i) => {
            const x = 14 + (i % 40) * 10;
            const y = 14 + Math.floor(i / 40) * 10;
            const fill = k === 'tp' ? 'var(--danger)' : k === 'fp' ? 'var(--warning)' : 'none';
            const stroke = k === 'tp' || k === 'fn' ? 'var(--danger)' : 'rgba(var(--overlay-rgb), 0.35)';
            return k === 'fp' || k === 'tp'
              ? <rect key={i} x={x - 3.5} y={y - 3.5} width={7} height={7} fill={fill} stroke={stroke} />
              : <circle key={i} cx={x} cy={y} r={3} fill={fill} stroke={stroke} strokeWidth="1" />;
          })}
          <text className="lab-label-muted" x={14} y={286}>■ red: sick, positive · ■ amber: healthy, positive · ○ red outline: sick, missed</text>
        </svg>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="Prior: how common it is" value={s.prior} min={0.001} max={0.5} step={0.001} format={(v) => `${fmt(v * 100, 1)}%`} onChange={(v) => set({ prior: v })} />
          <Slider label="Sensitivity P(+ | sick)" value={s.sens} min={0.5} max={1} step={0.01} format={(v) => `${fmt(v * 100, 0)}%`} onChange={(v) => set({ sens: v })} />
          <Slider label="False-positive rate P(+ | healthy)" value={s.fpr} min={0.001} max={0.3} step={0.001} format={(v) => `${fmt(v * 100, 1)}%`} onChange={(v) => set({ fpr: v })} />
          <Slider label="Positive tests in a row" value={tests} min={1} max={4} step={1} format={(v) => fmt(v, 0)} onChange={setTests} hint="Assumes the tests err independently, given the true status." />
          <dl className="lab-stat">
            <dt>Posterior after 1 test</dt><dd>{fmt(chain[1] * 100, 2)}%</dd>
            {tests > 1 && <><dt>After {tests} tests</dt><dd>{fmt(post * 100, 2)}%</dd></>}
            <dt>Likelihood ratio</dt><dd>{fmt(s.sens / s.fpr, 2)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: 'Probability of the condition after each positive test',
        columns: ['After test', 'Probability'],
        rows: chain.map((p, i) => [i === 0 ? 'before (prior)' : i, `${fmt(p * 100, 3)}%`]),
      }}
      annotations={['Posterior odds = prior odds × likelihood ratio (sensitivity ÷ false-positive rate).', 'With a rare condition, most positives are false positives even for a good test — the base rate dominates.']}
      constraints={['The dot picture rounds to whole people; the numbers use exact values.', 'Repeated tests are assumed conditionally independent, which real repeat tests often are not.']}
    />
  );
}
