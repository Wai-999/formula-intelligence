// ————— Content schema & validator —————
//
// All content in this app is hand-authored JavaScript, which means a typo
// is a runtime bug rather than a compile error, and the symptom is usually
// silent (a blank section) rather than loud. FIX_LOG.md is largely a record
// of that failure mode: 22 bl() calls with the wrong argument count, an
// edge referencing a renamed id, a detail panel reading a field that was
// never authored, a raw bilingual object rendered as a JSX child.
//
// This module declares what each content type must look like and reports
// violations with a precise path, so the author sees
//   PY_ENTRY[linreg].scenario.problem — required, but missing
// instead of an empty card in the UI three weeks later.
//
// Deliberately dependency-free (no zod/ajv): this runs at author time and
// in CI over plain objects, and the project's static-first philosophy
// treats a new runtime dependency as a cost that needs justifying.

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** A bilingual, two-depth object as produced by bl()/blSame(). */
export function isBlObject(v) {
  return isPlainObject(v) && isPlainObject(v.en) && isPlainObject(v.my);
}

// ————— Field rule constructors —————

export const str = (opts = {}) => ({ kind: 'string', ...opts });
export const num = (opts = {}) => ({ kind: 'number', ...opts });
export const bool = (opts = {}) => ({ kind: 'boolean', ...opts });
export const bl = (opts = {}) => ({ kind: 'bl', ...opts });
export const arr = (of, opts = {}) => ({ kind: 'array', of, ...opts });
export const obj = (shape, opts = {}) => ({ kind: 'object', shape, ...opts });
export const oneOf = (values, opts = {}) => ({ kind: 'enum', values, ...opts });
export const pair = (opts = {}) => ({ kind: 'pair', ...opts });
export const any = (opts = {}) => ({ kind: 'any', ...opts });

// ————— Validator —————

function checkField(rule, value, path, errors) {
  const missing = value === undefined || value === null;

  if (missing) {
    if (rule.optional) return;
    errors.push(`${path} — required, but missing`);
    return;
  }

  switch (rule.kind) {
    case 'string': {
      if (typeof value !== 'string') {
        errors.push(`${path} — expected a string, got ${describe(value)}`);
        return;
      }
      if (rule.min && value.length < rule.min) {
        errors.push(`${path} — string is ${value.length} chars, expected at least ${rule.min}`);
      }
      if (rule.notEmpty !== false && value.trim() === '') {
        errors.push(`${path} — string is empty`);
      }
      if (rule.forbid) {
        for (const [needle, why] of rule.forbid) {
          if (value.includes(needle)) errors.push(`${path} — contains ${JSON.stringify(needle)}: ${why}`);
        }
      }
      break;
    }
    case 'number': {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        errors.push(`${path} — expected a number, got ${describe(value)}`);
        return;
      }
      if (rule.min !== undefined && value < rule.min) errors.push(`${path} — ${value} is below minimum ${rule.min}`);
      if (rule.max !== undefined && value > rule.max) errors.push(`${path} — ${value} is above maximum ${rule.max}`);
      if (rule.integer && !Number.isInteger(value)) errors.push(`${path} — expected an integer, got ${value}`);
      break;
    }
    case 'boolean':
      if (typeof value !== 'boolean') errors.push(`${path} — expected a boolean, got ${describe(value)}`);
      break;
    case 'bl': {
      // The single highest-value check in this file: an incomplete bl()
      // renders as blank UI at whichever depth/language wasn't authored.
      if (!isBlObject(value)) {
        errors.push(`${path} — expected a bl()/blSame() object, got ${describe(value)}`);
        return;
      }
      for (const lang of ['en', 'my']) {
        for (const level of ['beginner', 'researcher']) {
          const v = value[lang]?.[level];
          if (typeof v !== 'string' || v.trim() === '') {
            errors.push(`${path}.${lang}.${level} — missing text (bl() called with too few arguments?)`);
          }
        }
      }
      break;
    }
    case 'array': {
      if (!Array.isArray(value)) {
        errors.push(`${path} — expected an array, got ${describe(value)}`);
        return;
      }
      if (rule.min !== undefined && value.length < rule.min) {
        errors.push(`${path} — has ${value.length} items, expected at least ${rule.min}`);
      }
      value.forEach((item, i) => checkField(rule.of, item, `${path}[${i}]`, errors));
      break;
    }
    case 'object': {
      if (!isPlainObject(value)) {
        errors.push(`${path} — expected an object, got ${describe(value)}`);
        return;
      }
      for (const [key, sub] of Object.entries(rule.shape)) {
        checkField(sub, value[key], `${path}.${key}`, errors);
      }
      break;
    }
    case 'enum':
      if (!rule.values.includes(value)) {
        errors.push(`${path} — ${JSON.stringify(value)} is not one of ${rule.values.join(', ')}`);
      }
      break;
    case 'pair':
      // A [symbol, meaning] tuple, as used by notation glossaries.
      if (!Array.isArray(value) || value.length !== 2
        || typeof value[0] !== 'string' || typeof value[1] !== 'string') {
        errors.push(`${path} — expected a ["symbol", "meaning"] string pair, got ${describe(value)}`);
      }
      break;
    case 'any':
      break;
    default:
      errors.push(`${path} — unknown rule kind "${rule.kind}" (schema bug, not content)`);
  }
}

function describe(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return `an array(${v.length})`;
  if (isBlObject(v)) return 'a bl() object (needs useT()/resolveT() to render)';
  if (typeof v === 'object') return `an object{${Object.keys(v).slice(0, 3).join(',')}}`;
  return `${typeof v} ${JSON.stringify(v)}`;
}

/**
 * Validate one record against a schema shape.
 * @returns {string[]} human-readable errors, empty when valid.
 */
export function validateRecord(shape, record, path) {
  const errors = [];
  checkField(obj(shape), record, path, errors);
  return errors;
}

/**
 * Validate a collection, labelling each record by its id (or index).
 * @returns {string[]}
 */
export function validateCollection(shape, records, label, idKey = 'id') {
  const errors = [];
  records.forEach((rec, i) => {
    const id = rec?.[idKey] ?? i;
    errors.push(...validateRecord(shape, rec, `${label}[${id}]`));
  });
  return errors;
}

/** Every id in a collection must be unique — duplicates silently shadow. */
export function checkUniqueIds(records, label, idKey = 'id') {
  const seen = new Map();
  const errors = [];
  records.forEach((r, i) => {
    const id = r?.[idKey];
    if (id === undefined) { errors.push(`${label}[${i}] — missing ${idKey}`); return; }
    if (seen.has(id)) errors.push(`${label}[${id}] — duplicate ${idKey} (also at index ${seen.get(id)})`);
    else seen.set(id, i);
  });
  return errors;
}

/** Referential integrity: every value of `field` must exist in `validIds`. */
export function checkReferences(records, field, validIds, label) {
  const errors = [];
  const valid = validIds instanceof Set ? validIds : new Set(validIds);
  records.forEach((r, i) => {
    const v = r?.[field];
    if (v !== undefined && !valid.has(v)) {
      errors.push(`${label}[${r?.id ?? i}].${field} — "${v}" does not exist`);
    }
  });
  return errors;
}

// ————— Schemas for each content type —————

/** A Stats formula node (src/data/nodes.js). */
export const STATS_NODE = {
  id: str(),
  ch: num({ integer: true, min: 1 }),
  name: str(),
  short: str({ optional: true }),
  formula: str(),
  desc: str(),
  use: str(),
  tags: arr(str(), { optional: true }),
};

/** An ML model card (src/data/ml/models.js). */
export const ML_MODEL = {
  id: str(),
  ch: num({ integer: true, min: 1 }),
  // name/short are rendered directly as JSX children with no useT(), so
  // they must be plain strings — the Fifth Pass crash in reverse.
  name: str(),
  short: str(),
  howItWorks: bl(),
  advantages: bl(),
  weaknesses: bl(),
  usageAreas: bl(),
  compass: obj({
    interpretability: num({ integer: true, min: 1, max: 5 }),
    dataHunger: num({ integer: true, min: 1, max: 5 }),
    nonlinearity: num({ integer: true, min: 1, max: 5 }),
  }),
};

/** An ML family (src/data/ml/models.js). */
export const ML_FAMILY = {
  id: num({ integer: true, min: 1 }),
  // family.name IS bilingual and must be resolved by the caller — the
  // exact contract whose violation blanked the app in the Fifth Pass.
  name: bl(),
  color: str(),
};

/** An edge in the model graph. */
export const ML_LINK = {
  s: str(),
  t: str(),
  type: str(),
};

/** A Python Hub entry (src/data/python/*.js). */
export const PY_ENTRY = {
  id: str(),
  group: str(),
  name: str(),
  formula: str(),
  tags: arr(str(), { min: 1 }),
  overview: str({ min: 40 }),
  variables: arr(pair(), { min: 1 }),
  thinking: obj({
    workflow: arr(str(), { min: 2 }),
    when: arr(str(), { min: 1 }),
    notWhen: arr(str(), { min: 1 }),
    assumptions: arr(str(), { min: 1 }),
  }),
  code: str({
    min: 80,
    // PyCodeBlock tokenizes line by line, so a token may never span lines.
    forbid: [
      ['"""', 'triple-quoted strings break the line-based syntax highlighter — use # comments'],
      ["'''", 'triple-quoted strings break the line-based syntax highlighter — use # comments'],
    ],
  }),
  scenario: obj({
    title: str(),
    problem: str({ min: 20 }),
    dataset: str({ min: 10 }),
    why: str({ min: 20 }),
    output: str({ min: 10 }),
    interpretation: str({ min: 20 }),
    pitfalls: str({ optional: true }),
  }),
  mistakes: arr(str(), { min: 2 }),
  tips: arr(str(), { min: 2 }),
  groupLabel: str({ optional: true }),
};
