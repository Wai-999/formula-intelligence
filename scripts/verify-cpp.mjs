#!/usr/bin/env node
// Compiles and runs every C++ program the site shows, and checks what it
// prints (V5.1 §6, §10.6: "reference C++ programs compile and pass
// reproducible tests under documented standard; starter solutions fail
// intended tests until fixed"). Run: npm run verify:cpp
//
//   lessons      each lesson's C++ block prints exactly its stated output
//   traces       each trace-lab program prints its output, and its
//                instrumented twin prints exactly the steps the lab shows
//   exercises    each reference solution passes its tests; each starter
//                compiles and fails them
//
// Standard: C++17, with -Wall -Wextra -pedantic -Werror, and the address
// and undefined-behaviour sanitizers where the compiler supports them.
// No compiler on PATH → BLOCKED (exit 2), never a pass. CXX picks one.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';
import { LESSONS } from '../src/data/curriculum/lessons/index.js';
import { TRACES } from '../src/data/cpp/traces.js';
import { CPP_EXERCISES, exerciseSource } from '../src/data/cpp/exercises.js';

const CXX = process.env.CXX || 'g++';
const probe = spawnSync(CXX, ['--version'], { encoding: 'utf8' });
if (probe.status !== 0) {
  console.error(`BLOCKED: no C++ compiler (${CXX}) on PATH (${(probe.error?.message || probe.stderr || '').trim()}).`);
  process.exit(2);
}
console.log(probe.stdout.split('\n')[0]);

const dir = mkdtempSync(join(tmpdir(), 'fi-verify-cpp-'));
const BASE = ['-std=c++17', '-Wall', '-Wextra', '-pedantic', '-Werror', '-O1', '-g'];
const SAN = ['-fsanitize=address,undefined', '-fno-omit-frame-pointer'];
let flags = BASE;
{
  const f = join(dir, 'probe.cpp');
  writeFileSync(f, 'int main() { return 0; }\n');
  const r = spawnSync(CXX, [...BASE, ...SAN, f, '-o', join(dir, 'probe')], { encoding: 'utf8' });
  // A sanitizer runtime that cannot start (some sandboxes) hangs or crashes: give it 5 s.
  if (r.status === 0 && spawnSync(join(dir, 'probe'), [], { timeout: 5_000 }).status === 0) flags = [...BASE, ...SAN];
}
console.log(`Flags: ${flags.join(' ')}`);
// macOS's sanitizer runtime cannot detect leaks; Linux (CI) keeps leak detection on.
const env = platform() === 'darwin' ? { ...process.env, ASAN_OPTIONS: 'detect_leaks=0' } : process.env;

let checks = 0;
let failed = 0;
let seq = 0;

function build(src) {
  seq += 1;
  const file = join(dir, `p${seq}.cpp`);
  const exe = join(dir, `p${seq}`);
  writeFileSync(file, src);
  const r = spawnSync(CXX, [...flags, file, '-o', exe], { encoding: 'utf8', timeout: 180_000 });
  return r.status === 0 ? { exe } : { error: (r.stderr || r.error?.message || '').trim().split('\n').slice(0, 12).join('\n    ') };
}

function exec(exe, stdin = '') {
  const r = spawnSync(exe, [], { input: stdin, encoding: 'utf8', timeout: 10_000, env });
  return { status: r.status, out: (r.stdout ?? '').replace(/\s+$/, ''), err: (r.stderr ?? '').trim() };
}

function report(label, ok, detail = '') {
  checks += 1;
  if (ok) console.log(`✓ ${label}`);
  else {
    failed += 1;
    console.log(`\n✗ ${label}\n    ${detail}\n`);
  }
}

const show = (s) => s.split('\n').join('\n      ');

/** Build, run and compare stdout with `expected`. */
function expectOutput(label, src, expected, stdin = '') {
  const b = build(src);
  if (b.error) return report(label, false, `does not compile:\n    ${b.error}`);
  const r = exec(b.exe, stdin);
  const want = expected.replace(/\s+$/, '');
  report(label, r.status === 0 && r.out === want, `exit ${r.status}${r.err ? `, stderr: ${r.err.slice(0, 400)}` : ''}\n    expected:\n      ${show(want)}\n    got:\n      ${show(r.out)}`);
}

// 1. Lesson C++ blocks.
for (const l of LESSONS) {
  const body = (await l.load()).default;
  if (body.cpp) expectOutput(`lesson ${l.id}`, body.cpp.code, body.cpp.output, body.cpp.stdin ?? '');
}

// 2. Trace-lab programs: the program itself, then its instrumented twin.
for (const [id, t] of Object.entries(TRACES)) {
  expectOutput(`trace ${id} (program output)`, t.code, t.output);
  const b = build(t.instrumented);
  if (b.error) {
    report(`trace ${id} (steps)`, false, `instrumented program does not compile:\n    ${b.error}`);
    continue;
  }
  const r = exec(b.exe);
  const steps = [];
  const plain = [];
  let pending = [];
  for (const line of r.out.split('\n')) {
    if (line.startsWith('@')) {
      steps.push(pending.length ? `${line.slice(1)} | ${pending.join('⏎')}` : line.slice(1));
      pending = [];
    } else {
      plain.push(line);
      pending.push(line);
    }
  }
  const same = steps.length === t.trace.length && steps.every((s, i) => s === t.trace[i]);
  const firstDiff = steps.findIndex((s, i) => s !== t.trace[i]);
  report(`trace ${id} (${t.trace.length} steps)`, r.status === 0 && same && plain.join('\n') === t.output,
    `exit ${r.status}; ${steps.length} steps printed, ${t.trace.length} expected; first difference at step ${firstDiff + 1}:\n      expected ${t.trace[firstDiff]}\n      printed  ${steps[firstDiff]}`);
}

// 3. Exercises: the reference passes its tests; the starter compiles and fails them.
for (const ex of CPP_EXERCISES) {
  const sol = build(exerciseSource(ex, 'solution'));
  if (sol.error) report(`exercise ${ex.id} (reference solution)`, false, `does not compile:\n    ${sol.error}`);
  else {
    const r = exec(sol.exe);
    report(`exercise ${ex.id} (reference solution passes ${ex.tests.length} tests)`, r.status === 0 && r.out.endsWith('all tests passed'), `exit ${r.status}\n      ${show(r.out)}\n      ${r.err.slice(0, 400)}`);
  }
  const st = build(exerciseSource(ex, 'starter'));
  if (st.error) report(`exercise ${ex.id} (starter compiles)`, false, `does not compile:\n    ${st.error}`);
  else {
    const r = exec(st.exe);
    report(`exercise ${ex.id} (starter fails its tests)`, r.status !== 0 && !r.out.endsWith('all tests passed'), `the starter passed its own tests (exit ${r.status}); it must fail until the learner fixes it`);
  }
}

rmSync(dir, { recursive: true, force: true });
console.log(`\n${checks - failed}/${checks} C++ checks pass.`);
process.exit(failed ? 1 : 0);
