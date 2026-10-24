// Every persisted learner record goes through here.
//
// Shape guard (docs/audits/BASELINE_AUDIT.md §4): this used to catch JSON
// *parse* errors only, so valid JSON of the wrong shape — `null`, a string
// where a list belongs, a record written by a newer schema — flowed straight
// into stores that assume structure. 13 of 44 malformed fixtures crashed a
// page; two of them blanked all of ML mode at module-import time, before any
// error boundary existed to catch them.
//
// The fallback each caller already passes is the shape contract: an array
// fallback means "must be an array", a plain-object fallback means "must be
// a plain object, and each of these fields must have this kind of value".
//
// Quarantine: a value that fails the check is copied, raw and untouched, into
// QUARANTINE_KEY before the fallback is used. The store will save its
// repaired state on the next action, so without this the original would be
// overwritten — and "malformed" includes data written by a newer version of
// the app, which a rollback must not destroy. The quarantine is included in
// backups (src/lib/backup.js), so nothing is ever silently lost.
export const QUARANTINE_KEY = 'fi_quarantine_v1';

const kind = (v) => {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
};

export function quarantine(key, raw) {
  try {
    const existing = JSON.parse(localStorage.getItem(QUARANTINE_KEY) || '{}');
    const store = existing && kind(existing) === 'object' ? existing : {};
    // Keep the FIRST bad original per key: once a repaired value has been
    // saved over it, a later failure can only be something newer and less
    // likely to be the learner's real data.
    if (!(key in store)) {
      store[key] = { raw, at: new Date().toISOString() };
      localStorage.setItem(QUARANTINE_KEY, JSON.stringify(store));
    }
  } catch {
    /* storage full or unavailable — the read itself still degrades safely */
  }
}

/**
 * Coerce a parsed value to the fallback's shape. Returns { value, repaired }.
 * A `null`/`undefined` fallback means the caller validates its own shape.
 */
export function conformToShape(parsed, fallback) {
  if (fallback === null || fallback === undefined) return { value: parsed, repaired: false };
  const want = kind(fallback);
  if (kind(parsed) !== want) return { value: fallback, repaired: true };
  if (want !== 'object') return { value: parsed, repaired: false };
  // Plain object: fill missing fields and replace fields of the wrong kind
  // from the defaults; keep every field the defaults don't mention.
  let repaired = false;
  const value = { ...parsed };
  for (const [field, def] of Object.entries(fallback)) {
    if (!(field in value) || (def !== null && kind(value[field]) !== kind(def))) {
      value[field] = def;
      repaired = true;
    }
  }
  return { value, repaired };
}

export function loadJSON(key, fallback) {
  let raw;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return fallback;
  }
  if (raw === null) return fallback;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    quarantine(key, raw);
    return fallback;
  }
  const { value, repaired } = conformToShape(parsed, fallback);
  if (repaired) quarantine(key, raw);
  return value;
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* localStorage unavailable — state stays session-only */
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* localStorage unavailable */
  }
}
