/* global importScripts, loadPyodide */
// The Python runtime, in a dedicated Web Worker (docs/PYTHON_RUNTIME_SECURITY.md).
//
// Why a worker: Pyodide on the main thread froze the whole tab on any
// non-yielding loop (baseline audit F-01) — a timeout cannot preempt
// synchronous WebAssembly. In a worker the page stays responsive, and the
// client can terminate() the worker, which always stops the code.
//
// What a worker is NOT: a security sandbox for secrets. It shares the page’s
// origin, so code here can make network requests (fetch) and open the
// origin’s IndexedDB. It cannot touch the DOM or localStorage, where this app
// keeps learner data. Nothing secret is ever passed in.

const PYODIDE_VERSION = '0.28.3';
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// Import name → Pyodide package. Only these are ever downloaded; importing
// anything else that is not in the standard library fails with a clear
// message instead of fetching code from the network.
const ALLOW = {
  numpy: 'numpy',
  scipy: 'scipy',
  pandas: 'pandas',
  sklearn: 'scikit-learn',
  statsmodels: 'statsmodels',
  matplotlib: 'matplotlib',
};

let py = null;
const loaded = new Set();

const post = (msg) => self.postMessage(msg);

async function boot(id) {
  if (py) return py;
  post({ id, type: 'progress', text: 'Downloading the Python runtime (about 10 MB, once)…' });
  try {
    importScripts(`${CDN}pyodide.js`);
    py = await loadPyodide({ indexURL: CDN });
  } catch {
    throw new Error('Could not download the Python runtime — you may be offline. Python needs a network connection the first time it runs (and whenever the browser has not kept its copy); the rest of the app works offline.');
  }
  py.runPython(HELPERS);
  return py;
}

async function ensurePackages(id, code) {
  const findImports = py.pyimport('pyodide.code').find_imports;
  const names = findImports(code).toJs();
  const want = [...new Set(names.map((n) => ALLOW[n.split('.')[0]]).filter(Boolean))].filter((p) => !loaded.has(p));
  if (!want.length) return;
  post({ id, type: 'progress', text: `Loading ${want.join(', ')}…` });
  await py.loadPackage(want);
  for (const p of want) loaded.add(p);
  if (want.includes('matplotlib')) py.runPython('import matplotlib\nmatplotlib.use("Agg")');
}

const HELPERS = `
import sys, io, json, traceback, base64

_FI_ALLOWED = ${JSON.stringify(Object.keys(ALLOW))}

def _fi_explain(e, filename):
    tb = traceback.extract_tb(e.__traceback__)
    line = next((f.lineno for f in reversed(tb) if f.filename == filename), None)
    msg = f"{type(e).__name__}: {e}"
    if isinstance(e, ModuleNotFoundError):
        msg += " — in the browser only the standard library and " + ", ".join(_FI_ALLOWED) + " are available."
    return (f"line {line}: " if line else "") + msg

def _fi_figures(face, fg, grid):
    imgs = []
    if "matplotlib.pyplot" not in sys.modules:
        return imgs
    import matplotlib.pyplot as plt
    for num in plt.get_fignums():
        fig = plt.figure(num)
        for ax in fig.axes:
            ax.tick_params(colors=grid)
            for s in ax.spines.values():
                s.set_color(grid)
            ax.xaxis.label.set_color(fg)
            ax.yaxis.label.set_color(fg)
            ax.title.set_color(fg)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=110, bbox_inches="tight", facecolor=face, edgecolor="none")
        imgs.append(base64.b64encode(buf.getvalue()).decode())
    plt.close("all")
    return imgs

_fi_globals = {"__name__": "__main__"}

def _fi_run(code, face, fg, grid):
    out = io.StringIO()
    prev = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = out
    error = None
    try:
        exec(compile(code, "<your code>", "exec"), _fi_globals)
    except BaseException as e:
        error = _fi_explain(e, "<your code>")
    finally:
        sys.stdout, sys.stderr = prev
    try:
        figs = _fi_figures(face, fg, grid)
    except Exception:
        figs = []
    return json.dumps({"output": out.getvalue(), "error": error, "figures": figs})

def _fi_grade(setup, user, tests, face, fg, grid):
    ns = {"__name__": "__main__"}
    out = io.StringIO()
    prev = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = out
    results, error = [], None
    try:
        if setup:
            exec(compile(setup, "<setup>", "exec"), ns)
        try:
            exec(compile(user, "<your code>", "exec"), ns)
        except BaseException as e:
            error = _fi_explain(e, "<your code>")
        if error is None:
            for name, code in tests:
                try:
                    exec(compile(code, "<test>", "exec"), ns)
                    results.append([name, True, ""])
                except AssertionError as e:
                    results.append([name, False, str(e) or "this check failed"])
                except BaseException as e:
                    results.append([name, False, f"{type(e).__name__}: {e}"])
    finally:
        sys.stdout, sys.stderr = prev
    try:
        figs = _fi_figures(face, fg, grid)
    except Exception:
        figs = []
    return json.dumps({"results": results, "error": error, "output": out.getvalue(), "figures": figs})
`;

self.onmessage = async ({ data }) => {
  const { id, type, code, setup = '', tests = [], colors = {} } = data;
  const started = performance.now();
  try {
    await boot(id);
    await ensurePackages(id, `${setup}\n${code}\n${tests.map((t) => t.code).join('\n')}`);
    const face = colors.face ?? '#0b0c18';
    const fg = colors.fg ?? '#f4f7fb';
    const grid = colors.grid ?? '#7c8798';
    let res;
    if (type === 'grade') {
      const fn = py.globals.get('_fi_grade');
      res = JSON.parse(fn(setup, code, py.toPy(tests.map((t) => [t.name, t.code])), face, fg, grid));
      fn.destroy();
    } else {
      const fn = py.globals.get('_fi_run');
      res = JSON.parse(fn(code, face, fg, grid));
      fn.destroy();
    }
    post({ id, type: 'result', ...res, ms: Math.round(performance.now() - started) });
  } catch (err) {
    post({ id, type: 'result', output: '', figures: [], error: String(err?.message || err).split('\n').filter(Boolean).pop(), fatal: true, ms: Math.round(performance.now() - started) });
  }
};
