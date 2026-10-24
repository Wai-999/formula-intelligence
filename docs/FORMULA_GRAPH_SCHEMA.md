# Formula and knowledge graph schema

Graph version **1.0.0** (`GRAPH_VERSION` in `src/lib/knowledgeGraph.js`). One typed graph connects the new curriculum to the content that already existed (the 94 Bluman formulas of the Formula map and the 32 models of the Model map). It is assembled at runtime by `buildKnowledgeGraph()` in `src/data/curriculum/graph.js` and validated on every test run.

Current size: **292 nodes, 421 edges** — requires 165 · used_in 132 · derived_from 59 · applies_to 54 · contrasts_with 8 · generalizes 3. Validation errors: **0**.

## Nodes

`{ id, kind, title, ...kind-specific fields }`. Ids are namespaced by prefix so spaces never collide:

| Kind | Id pattern | Source | Notable fields |
|---|---|---|---|
| concept | `c.*` | `curriculum/concepts.js` (86) | `subject`, `unit`, `requires[]`, `summary` |
| formula (curriculum) | `f.*` | `curriculum/formulas.js` (39) | `latex`, `variables[{symbol, meaning, units}]`, `assumptions[]`, `domain[]`, `interpretation`, `pitfalls[]`, `application`, `python`, `concept`, `lesson`, **`claim`**, `references[]` |
| formula (Formula map) | `bluman:<id>` | `data/nodes.js` (94) | `text`, `chapter`, `source: 'Bluman'` |
| lesson | `lesson:<id>` | `curriculum/lessons/index.js` (20) | `course` |
| model | `model:<id>` | `data/ml/models.js` (32) | — |
| project | `proj.*` | `data/projects/index.js` (3) | — |
| dataset | `ds.*` | `data/projects/index.js` (4) | `synthetic` |
| application | `app.*` | `curriculum/applications.js` (10) | `summary` |
| career | `career.*` | `curriculum/applications.js` (4) | `summary` |
| exercise | `ex:<item id>` | lesson bodies (tests only, not built at runtime) | — |

`claim` is one of **definition, identity, theorem, approximation, heuristic, empirical** (§12), so an approximation is never presented as an identity.

## Edges

`{ source, target, type }`, read "source *type* target".

| Type | Meaning | Example | Acyclic? |
|---|---|---|---|
| `requires` | source cannot be learned (as taught here) without target | `c.slope requires c.ratios`; `lesson:a1-slope requires c.ratios` | **Yes — enforced** |
| `derived_from` | source is obtained from target | `f.projection derived_from f.dot` | not enforced |
| `generalizes` | source contains target as a special case | `c.gradient generalizes c.derivative` | not enforced |
| `applies_to` | source is used to solve target | `c.dot-product applies_to app.recommenders` | not enforced |
| `contrasts_with` | commonly confused; compare them | `c.calibration contrasts_with c.roc-pr` | symmetric in meaning |
| `used_in` | source appears inside target | `c.dot-product used_in c.matrices`; `bluman:reg used_in lesson:a1-line-fit` | not enforced |

Only `requires` must be a DAG: a prerequisite cycle would make "what should I learn first?" unanswerable. Other relations can legitimately loop (two ideas applied to each other).

## Validation — `validateGraph()`

Returns human-readable problems; empty means valid. Rules:

1. Every node has an id; ids are unique; `kind` is one of the ten kinds.
2. Every edge type is one of the six types; both ends exist (**no dangling edges**); no self-loops.
3. `requires` edges form a DAG (`findCycle` — depth-first search with grey/black marking).

`src/data/curriculum/__tests__/curriculum.test.js` additionally checks: every formula links to an existing concept and lesson and states its claim type; every `latex` and every inline/display formula in every lesson parses with KaTeX; no orphan concepts (every concept is reachable from a lesson or the course outline); all required labs exist and are hosted in a lesson.

## Uses

- **Concept map** (Knowledge Maps → Concept map): `prerequisiteLayers()` lays concepts out left to right by prerequisite depth; `reach()` lists everything a concept needs (in) and unlocks (out). Keyboard: roving tab index over nodes — ← to a prerequisite, → to a concept that builds on it, ↑/↓ within a column, Home to the first, Enter/Space for details; the Outline view lists the same graph as text (default below 768 px). Deep link `#maps/concepts/<conceptId>`.
- **Careers & applications** follows `applies_to` and `used_in` from concepts to applications and careers.
- **Lessons** show "Builds on" from their `requires` edges, and link Formula-map and Model-map nodes through `used_in` / `applies_to`.

## Review status

Every `requires` edge was chosen by asking "can this be learned, as taught in this curriculum, without that?". The edges are **AI-proposed and awaiting independent human review** (`docs/CONTENT_QA.md`). Machine checks prove they are consistent and acyclic, not that they are pedagogically right.

## Changing the schema

Add a node kind or edge type to `NODE_KINDS` / `EDGE_TYPES`, bump `GRAPH_VERSION` (minor for additions, major for a change of meaning), and add a test. The graph is computed, never stored, so no learner data migrates.
