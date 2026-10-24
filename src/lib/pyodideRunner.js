// In-browser Python, run in a Web Worker (src/lib/python/pyWorker.js;
// docs/PYTHON_RUNTIME_SECURITY.md).
//
// Before V3.1 Pyodide ran on the main thread, and its "timeout" could not
// interrupt synchronous code: `while True: pass` froze the tab for good
// (baseline audit F-01). Now the page never blocks, and a run that exceeds
// its time limit is stopped by terminating the worker — the only reliable
// way to stop WebAssembly without cross-origin isolation, which GitHub Pages
// cannot provide. The cost: Python restarts, so variables from earlier runs
// are gone. The result says so.
//
// The runtime is still downloaded only when someone presses Run, and it is
// never part of the landing bundle (the worker is its own chunk).

const DEFAULT_TIMEOUT_MS = 30_000;

let worker = null;
let nextId = 1;
const pending = new Map(); // id → { resolve, onProgress, timer }
let everBooted = false;

function themeColors() {
  try {
    const s = getComputedStyle(document.documentElement);
    const read = (name, fallback) => {
      const v = s.getPropertyValue(name).trim();
      return /^#[0-9a-f]{3,8}$/i.test(v) ? v : fallback;
    };
    return { face: read('--surface-deep', '#0b0c18'), fg: read('--text-primary', '#f4f7fb'), grid: read('--text-faint', '#7c8798') };
  } catch {
    return {};
  }
}

function settleAll(result) {
  for (const [id, p] of pending) {
    clearTimeout(p.timer);
    p.resolve(result);
    pending.delete(id);
  }
}

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./python/pyWorker.js', import.meta.url));
  worker.onmessage = ({ data }) => {
    const p = pending.get(data.id);
    if (!p) return;
    if (data.type === 'progress') { p.onProgress?.(data.text); return; }
    clearTimeout(p.timer);
    pending.delete(data.id);
    everBooted = true;
    p.resolve(data);
  };
  // A crash (e.g. memory exhausted) kills the worker; report it and start a
  // fresh one on the next run rather than leaving the page with a dead one.
  worker.onerror = (e) => {
    e.preventDefault?.();
    restart();
    settleAll({ output: '', figures: [], error: 'Python stopped unexpectedly (possibly out of memory). It has been restarted — run again.', restarted: true });
  };
  return worker;
}

/** Stop whatever is running and discard the runtime; the next run starts fresh. */
export function restart() {
  if (worker) worker.terminate();
  worker = null;
}

/** Stop a run in progress (the Stop button). */
export function stopPython() {
  if (!pending.size) return;
  restart();
  settleAll({ output: '', figures: [], error: 'Stopped. Python was restarted, so anything defined in earlier runs is gone.', stopped: true, restarted: true });
}

function send(message, { onProgress, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  return new Promise((resolve) => {
    const id = nextId++;
    const timer = setTimeout(() => {
      if (!pending.has(id)) return;
      restart();
      settleAll({
        output: '',
        figures: [],
        error: `Stopped after ${Math.round(timeoutMs / 1000)} s — the code was still running (an endless loop, or too heavy for a browser). Python was restarted; anything defined in earlier runs is gone.`,
        timedOut: true,
        restarted: true,
      });
    }, timeoutMs + (everBooted ? 0 : 120_000)); // the first run also downloads the runtime
    pending.set(id, { resolve, onProgress, timer });
    try {
      getWorker().postMessage({ id, colors: themeColors(), ...message });
    } catch (err) {
      clearTimeout(timer);
      pending.delete(id);
      resolve({ output: '', figures: [], error: `Could not start Python: ${err.message}` });
    }
  });
}

/**
 * Execute code and capture what it printed, plus any plots. Never throws:
 * a failing run is a normal outcome the UI displays.
 * Returns { ok, output, figures, error, ms, timedOut?, restarted? }.
 */
export async function runPython(code, opts = {}) {
  const r = await send({ type: 'run', code }, opts);
  return {
    ok: !r.error,
    output: r.output ?? '',
    figures: (r.figures ?? []).map((b64) => `data:image/png;base64,${b64}`),
    error: r.error ?? null,
    ms: r.ms ?? 0,
    timedOut: !!r.timedOut,
    restarted: !!r.restarted,
  };
}

/**
 * Grade learner code against an exercise’s tests in a fresh namespace.
 * Returns { error, tests: [{ name, passed, message }], output, figures, timedOut? }.
 */
export async function gradePython(exercise, code, opts = {}) {
  const r = await send({ type: 'grade', code, setup: exercise.setup ?? '', tests: exercise.tests }, { timeoutMs: 20_000, ...opts });
  return {
    error: r.error ?? null,
    tests: (r.results ?? []).map(([name, passed, message]) => ({ name, passed, message })),
    output: r.output ?? '',
    figures: (r.figures ?? []).map((b64) => `data:image/png;base64,${b64}`),
    timedOut: !!r.timedOut,
  };
}

/** True once the runtime has started at least once this visit. */
export function isRuntimeLoaded() {
  return everBooted;
}

export function formatPythonError(err) {
  const text = String(err?.message || err);
  const lines = text.split('\n').filter(Boolean);
  const last = [...lines].reverse().find((l) => /Error|Exception/.test(l));
  return (last || lines.at(-1) || 'Unknown error').trim();
}
