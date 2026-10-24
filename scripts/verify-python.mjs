#!/usr/bin/env node
// Runs every lesson's Python block with a real CPython + NumPy and compares
// its output, exactly, with the "Expected output" the lesson shows (§6.9:
// "Python connection ... with deterministic expected outputs"; §16: never
// fabricate results). Run: npm run verify:python
//
// The outputs on the page were captured by running this code, not written by
// hand; this script is what keeps them true when a lesson is edited.
//
// Needs python3 with numpy on PATH. If they are missing the script says so
// and exits 2 — a missing interpreter is BLOCKED, never a pass.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LESSONS } from '../src/data/curriculum/lessons/index.js';
import { PY_EXERCISES } from '../src/data/python/exercises.js';

const PY = process.env.PYTHON || 'python3';

const probe = spawnSync(PY, ['-I', '-c', 'import numpy, sys; print(sys.version.split()[0], numpy.__version__)'], { encoding: 'utf8' });
if (probe.status !== 0) {
  console.error(`BLOCKED: ${PY} with NumPy is not available (${(probe.stderr || probe.error?.message || '').trim()}).`);
  process.exit(2);
}
console.log(`Python ${probe.stdout.trim().replace(' ', ', NumPy ')}`);

const dir = mkdtempSync(join(tmpdir(), 'fi-verify-py-'));
let failed = 0;
let ran = 0;

function run(label, code, expected) {
  const file = join(dir, 'snippet.py');
  writeFileSync(file, code);
  // -I: isolated mode, so nothing in the working directory shadows a module.
  const r = spawnSync(PY, ['-I', file], { cwd: dir, encoding: 'utf8', timeout: 60_000 });
  ran += 1;
  const got = (r.stdout ?? '').replace(/\s+$/, '');
  const want = expected.replace(/\s+$/, '');
  if (r.status !== 0 || got !== want) {
    failed += 1;
    console.log(`\n✗ ${label}`);
    if (r.status !== 0) console.log(`  exit ${r.status}: ${(r.stderr ?? '').trim().split('\n').slice(-3).join('\n  ')}`);
    console.log('  expected:\n    ' + want.split('\n').join('\n    '));
    console.log('  got:\n    ' + got.split('\n').join('\n    '));
  } else {
    console.log(`✓ ${label}`);
  }
}

for (const l of LESSONS) {
  const body = (await l.load()).default;
  run(`lesson ${l.id}`, body.python.code, body.python.output);
}

// Graded exercises: the reference solution must pass its own tests.
for (const ex of PY_EXERCISES) {
  if (ex.type === 'predict-output' || ex.type === 'interpret') {
    run(`exercise ${ex.id} (${ex.type})`, ex.code, ex.expectedOutput);
    if (ex.choices && ex.type === 'predict-output' && ex.choices[ex.correct] !== ex.expectedOutput) {
      failed += 1;
      console.log(`✗ exercise ${ex.id}: the correct choice does not match the expected output`);
    }
    continue;
  }
  const harness = `${ex.setup ?? ''}\n${ex.solution}\n\n# ---- tests ----\n${ex.tests.map((t) => t.code).join('\n')}\nprint("ALL TESTS PASSED")`;
  run(`exercise ${ex.id} (reference solution)`, harness, 'ALL TESTS PASSED');
  // And the untouched starter must NOT pass: tests that accept the starter
  // would grade nothing.
  const file = join(dir, 'starter.py');
  writeFileSync(file, `${ex.setup ?? ''}\n${ex.starter}\n${ex.tests.map((t) => t.code).join('\n')}\nprint("ALL TESTS PASSED")`);
  const r = spawnSync(PY, ['-I', file], { cwd: dir, encoding: 'utf8', timeout: 60_000 });
  if ((r.stdout ?? '').includes('ALL TESTS PASSED')) {
    failed += 1;
    console.log(`✗ exercise ${ex.id}: the unedited starter passes its tests`);
  }
}

rmSync(dir, { recursive: true, force: true });
console.log(`\n${ran - failed}/${ran} Python blocks produce exactly their stated output.`);
process.exit(failed ? 1 : 0);
