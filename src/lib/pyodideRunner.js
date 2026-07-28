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
      // Axes, ticks and labels default to black, which is invisible on the
      // dark surface these figures are drawn onto. Set them from the live
      // theme so a chart is legible in both.
      applyMatplotlibTheme(py);
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

// Any figures a run left open, as base64 PNGs. Matplotlib is on the Agg
// backend (there is no screen to draw to), so a plot exists only as an
// in-memory figure until something writes it out — without this it would be
// computed and silently discarded, which is worse than not supporting plots.
const captureFigures = (face) => `
import io as _fi_io, base64 as _fi_b64
_fi_imgs = []
try:
    import matplotlib.pyplot as _fi_plt
    for _fi_num in _fi_plt.get_fignums():
        _fi_fig = _fi_plt.figure(_fi_num)
        _fi_buf = _fi_io.BytesIO()
        _fi_fig.savefig(_fi_buf, format="png", dpi=110, bbox_inches="tight",
                        facecolor="${face}", edgecolor="none")
        _fi_imgs.append(_fi_b64.b64encode(_fi_buf.getvalue()).decode())
    _fi_plt.close("all")
except Exception:
    pass
_fi_imgs
`;

/** Push the app's text colour into matplotlib's defaults. */
function applyMatplotlibTheme(py) {
  try {
    const style = getComputedStyle(document.documentElement);
    const read = (name, fallback) => {
      const v = style.getPropertyValue(name).trim();
      return /^#[0-9a-f]{3,8}$/i.test(v) ? v : fallback;
    };
    const fg = read('--text-primary', '#f4f7fb');
    const grid = read('--text-faint', '#7c8798');
    py.runPython(`
import matplotlib as _fi_mpl
_fi_mpl.rcParams.update({
    "text.color": "${fg}",
    "axes.labelcolor": "${fg}",
    "axes.edgecolor": "${grid}",
    "axes.titlecolor": "${fg}",
    "xtick.color": "${grid}",
    "ytick.color": "${grid}",
    "grid.color": "${grid}",
    "axes.facecolor": "none",
    "figure.facecolor": "none",
})
`);
  } catch {
    /* styling is cosmetic; a failure here must not break execution */
  }
}

// A chart is an image, so it cannot inherit the page's theme the way the
// rest of the UI does — it has to be RENDERED with the right background, or
// a dark plot lands on a white page looking like a rendering fault.
function figureBackground() {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--surface-deep').trim();
    return /^#[0-9a-f]{3,8}$/i.test(v) ? v : '#0b0c18';
  } catch {
    return '#0b0c18';
  }
}

function collectFigures(py) {
  try {
    const res = py.runPython(captureFigures(figureBackground()));
    const arr = res?.toJs ? res.toJs() : Array.from(res || []);
    return arr.map((b64) => `data:image/png;base64,${b64}`);
  } catch {
    return [];
  }
}

/**
 * Execute a sample and capture everything it printed, plus any plots.
 * Errors are returned, not thrown: a failing sample is a normal outcome the
 * panel should display, not an exception that trips the error boundary.
 */
export async function runPython(code, { onProgress, timeoutMs = 30000 } = {}) {
  const started = performance.now();
  let py;
  try {
    py = await getPyodide(onProgress);
  } catch (err) {
    return { ok: false, output: '', figures: [], error: err.message || String(err), ms: 0 };
  }

  const race = (promise) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error(`Stopped after ${Math.round(timeoutMs / 1000)}s — this sample is too heavy to finish in a browser tab.`)),
      timeoutMs
    )),
  ]);

  try {
    py.runPython('import sys, io\n_fi_out = io.StringIO()\n_fi_prev = sys.stdout\nsys.stdout = _fi_out');
    await race(py.runPythonAsync(code));
    const output = py.runPython('sys.stdout = _fi_prev\n_fi_out.getvalue()');
    return {
      ok: true,
      output: String(output),
      figures: collectFigures(py),
      error: null,
      ms: Math.round(performance.now() - started),
    };
  } catch (err) {
    try { py.runPython('sys.stdout = _fi_prev'); } catch { /* stdout already restored */ }
    return {
      ok: false,
      // Python tracebacks are long and the useful line is the last one.
      output: '',
      // A run can print and plot before it fails; showing that is more
      // useful than discarding it because the last statement raised.
      figures: collectFigures(py),
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
