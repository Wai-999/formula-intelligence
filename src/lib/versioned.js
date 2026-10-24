import { quarantine } from './storage.js';

// Versioned learner records (§11: "explicit schema versions", "reversible
// schema changes", "never silently overwrite prior learning records").
//
// Every record written by the V3.1 learning features is an envelope
// { schemaVersion, ...data }. Reading one:
//   - missing                → a fresh empty record
//   - unreadable / not an object → original quarantined, fresh record
//   - written by a NEWER app → original quarantined (so a rollback of the
//     app, or this one being rolled forward again, can never destroy it),
//     fresh record for this session
//   - older                  → migrated step by step: migrations[n] turns a
//     version-n record into version n+1. A migration that throws is treated
//     like unreadable data: quarantined, never half-applied.
// The quarantine is part of every backup (src/lib/backup.js).

export function readVersioned(key, { version, empty, migrations = {}, validate = () => true }) {
  let raw;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return empty();
  }
  if (raw === null) return empty();
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    quarantine(key, raw);
    return empty();
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || !Number.isInteger(parsed.schemaVersion)) {
    quarantine(key, raw);
    return empty();
  }
  if (parsed.schemaVersion > version) {
    quarantine(key, raw);
    return empty();
  }
  let record = parsed;
  try {
    while (record.schemaVersion < version) {
      const step = migrations[record.schemaVersion];
      if (!step) throw new Error(`no migration from v${record.schemaVersion}`);
      record = { ...step(record), schemaVersion: record.schemaVersion + 1 };
    }
  } catch {
    quarantine(key, raw);
    return empty();
  }
  if (!validate(record)) {
    quarantine(key, raw);
    return empty();
  }
  return record;
}

export function writeVersioned(key, record) {
  try {
    localStorage.setItem(key, JSON.stringify(record));
    return true;
  } catch {
    return false; // storage full or unavailable: state stays in memory for this visit
  }
}
