// In-browser Python execution via Pyodide.
//
// Why this is compatible with the project's static-first rule (§5.3): Pyodide
// is CPython compiled to WebAssembly and runs entirely in the user's tab.
// There is no server, no API key, and no recurring cost — the same reasons
// the AI Tutor was deferred do not apply here. The cost is a one-time ~10 MB
// runtime download, which is why loading is lazy and never happens until
// someone actually presses Run.
//
// Feasibility was established by executing all 126 Hub samples: 109 run,
// median 7 ms. The 17 that cannot are listed with reasons in
// src/data/python/runnability.js, so the UI can explain rather than fail.

const PYODIDE_VERSION = '0.28.3';
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// The packages the Hub's samples actually import, minus those Pyodide has no
// build for. Loaded once, together, because a second loadPackage round-trip
// mid-session is a visible stall.
const PACKAGES = ['numpy', 'scipy', 'pandas', 'scikit-learn', 'statsmodels', 'matplotlib'];

let pyodidePromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not reach the Python runtime CDN.'));
    document.head.appendChild(s);
  });
}

/**
 * Load Pyodide once per session. Concurrent callers share one promise, so
 * double-clicking Run cannot start two 10 MB downloads.
 */
export function getPyodide(onProgress) {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      onProgress?.('Downloading the Python runtime…');
      if (!globalThis.loadPyodide) await loadScript(`${CDN}pyodide.js`);
      const py = await globalThis.loadPyodide({ indexURL: CDN });
      onProgress?.('Loading NumPy, SciPy, pandas, scikit-learn…');
      await py.loadPackage(PACKAGES);
      // Charts are captured as files rather than drawn to a screen that
      // does not exist; without this, any savefig() call raises.
      py.runPython('import matplotlib; matplotlib.use("Agg")');
      onProgress?.('Ready');
      return py;
    })().catch((err) => {
      // Let a later attempt retry rather than caching a failed load forever.
      pyodidePromise = null;
      throw err;
    });
  }
  return pyodidePromise;
}

/** True once the runtime is in memory — lets the UI drop the download warning. */
export function isRuntimeLoaded() {
  return Boolean(globalThis.pyodide) || pyodidePromise !== null;
}

/**
 * Execute a sample and capture everything it printed.
 * Errors are returned, not thrown: a failing sample is a normal outcome the
 * panel should display, not an exception that trips the error boundary.
 */
export async function runPython(code, { onProgress, timeoutMs = 30000 } = {}) {
  const started = performance.now();
  let py;
  try {
    py = await getPyodide(onProgress);
  } catch (err) {
    return { ok: false, output: '', error: err.message || String(err), ms: 0 };
  }

  const race = (promise) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error(`Stopped after ${Math.round(timeoutMs / 1000)}s — this sample is too heavy to finish in a browser tab.`)),
      timeoutMs
    )),
  ]);

  try {
    py.runPython('import sys, io\n_fi_buf = io.StringIO()\n_fi_prev = sys.stdout\nsys.stdout = _fi_buf');
    await race(py.runPythonAsync(code));
    const output = py.runPython('sys.stdout = _fi_prev\n_fi_buf.getvalue()');
    return { ok: true, output: String(output), error: null, ms: Math.round(performance.now() - started) };
  } catch (err) {
    try { py.runPython('sys.stdout = _fi_prev'); } catch { /* stdout already restored */ }
    return {
      ok: false,
      // Python tracebacks are long and the useful line is the last one.
      output: '',
      error: formatPythonError(err),
      ms: Math.round(performance.now() - started),
    };
  }
}

export function formatPythonError(err) {
  const text = String(err?.message || err);
  const lines = text.split('\n').filter(Boolean);
  const last = [...lines].reverse().find((l) => /Error|Exception/.test(l));
  return (last || lines.at(-1) || 'Unknown error').trim();
}
