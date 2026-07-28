# Content Authoring Guide

All learning content in this app is hand-authored JavaScript in `src/data/`.
There is no CMS and no database, which keeps the app static and free to host
— but it also means **a typo is a runtime bug, not a compile error**, and the
usual symptom is a silently blank section rather than a crash.

`src/data/schema.js` exists to close that gap. Run it after any content edit:

```bash
npm run validate:content     # readable report, exits non-zero on problems
npm test                     # the same schemas, enforced in CI
```

A problem is reported with the exact path, e.g.

```
PY_ENTRY[linreg].scenario.problem — string is 5 chars, expected at least 20
ML_MODEL[gbm].howItWorks.my.researcher — missing text (bl() called with too few arguments?)
ML_LINK[e12].t — "ridge_typo" does not exist
```

---

## The one rule that causes most bugs

ML-mode content is **bilingual and two-depth**. `bl()` and `blSame()` build
objects shaped `{ en: {beginner, researcher}, my: {beginner, researcher} }`.

```js
bl(enBeginner, enResearcher, myBeginner, myResearcher)  // all four required
blSame(en, my)                                          // same text at both depths
```

Two failure modes, both of which have shipped here before:

1. **Too few arguments.** `bl('a', 'b')` leaves the Burmese slots undefined.
   Nothing throws; the UI just goes blank in Burmese. (22 of these were found
   and fixed in one pass — see `FIX_LOG.md`.)
2. **Rendering the object directly.** A `bl()` object is *not* a string.
   `<span>{model.howItWorks}</span>` throws *"Objects are not valid as a React
   child"*, which — before error boundaries existed — blanked the entire app.
   Always resolve first: `useT(content)` in a component, `resolveT(content,
   level, lang)` in a callback or loop.

Which fields are strings and which are `bl()` objects is **not** a matter of
taste — it is fixed by what the renderer does. `schema.js` encodes the
contract in both directions:

| Field | Type | Why |
|---|---|---|
| `ML_MODEL.name`, `.short` | plain string | rendered directly as a JSX child |
| `ML_MODEL.howItWorks`, `.advantages`, … | `bl()` | resolved via `useT()` |
| `ML_FAMILY.name` | `bl()` | resolved by the caller — the Fifth Pass crash was forgetting this |

---

## Adding content

### A new stats formula
1. Add the record to `src/data/nodes.js` (`STATS_NODE` schema: `id`, `ch`,
   `name`, `formula`, `desc`, `use`).
2. Add prerequisite edges in the same file so the node isn't an orphan on the map.
3. Add a matching entry in `src/data/python/` **using the same `id`**. Stats
   mode's Researcher depth joins on that id — a formula without a Hub entry
   silently shows no researcher content.
4. `npm run validate:content && npm test`

### A new ML model
1. Add to `ML_MODELS` in `src/data/ml/models.js` (`ML_MODEL` schema — note
   `compass` values are integers 1–5).
2. Add at least one edge in `ML_LINKS` connecting it to the graph.
3. Add a depth ladder in `src/data/ml/modelDepthLadder.js` keyed by the same
   id — the validator requires 1:1 model↔ladder pairing.
4. Add the matching Python Hub entry.
5. `npm run validate:content && npm test`

### A new Python Hub entry
Follow the `PY_ENTRY` schema. The minimum lengths are deliberate: a
20-character `scenario.problem` isn't a scenario, and the renderer will
happily display a stub that reads as broken.

**Code samples must not use triple-quoted strings.** `PyCodeBlock` tokenizes
line by line so no token may span lines; use `#` comments instead. The
validator enforces this.

---

## Where the safety nets are

| Layer | What it catches | When |
|---|---|---|
| `npm run validate:content` | shape, ranges, references, contracts | on demand, while authoring |
| `npm test` (82 tests) | the same, plus store logic and component behavior | pre-commit / CI |
| CI (`.github/workflows/deploy.yml`) | everything above, before deploy | every push to `main` |
| Error boundaries | anything that still slips through, at runtime | in the browser |

The last layer degrades one broken tab instead of the whole app — but it is a
net, not a substitute for the first three.
