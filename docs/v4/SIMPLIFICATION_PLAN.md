# Simplification plan — keep, merge, move, remove

Rule applied to every item (V4 §13): which learner problem does it solve, and can an existing destination do the job? Nothing is deleted that holds learner data or unique teaching; pages are merged or moved, never dropped silently. Every old address keeps working.

## Five destinations

| V4 destination | Sub-navigation | Pages behind it |
|---|---|---|
| **Home** | — | Resume with one action; first-run choice; small progress summary |
| **Learn** | Courses · Placement · ML pipeline · Maps | Course, lesson (from Courses); Maps hub → Concept map, Formula map, Model map, Careers & applications, Formula paths |
| **Practice** | Review · Formula drills | Review = skills due **and** mixed practice on one page; Formula drills = flashcards · quiz · problems behind one switch |
| **Apply** | Projects · Case studies · Code exercises · Python lab | Python library is reached from the Python lab and code exercises, not from global navigation |
| **My Progress** | Overview · Notebook · Error log · Settings | Notebook = lesson notes · journal behind one switch; Settings holds appearance, explanation depth, privacy/backup, offline, shortcuts |

Sources & data provenance stays outside the navigation (linked from Settings, lessons and projects).

## Decisions

| Item (baseline) | Decision | Why |
|---|---|---|
| Knowledge Maps section (4 maps) | **Move** under Learn → Maps (a hub page); add **"See connections"** at the top of every lesson | Maps are optional exploration, not a starting point (§3) |
| Learning paths (formula prerequisite paths) | **Move** into the Maps hub as "Formula paths" | It is a view of the formula map |
| Case studies (Story Walk) | **Move** Learn → Apply | They are applied investigations |
| Diagnostic | **Move** Progress → Learn as "Placement"; result offers **Start earlier / Start here / Skip ahead** | Placement is how you choose where to learn (§6) |
| Practice → Review (formula flashcards), Quiz, Problems | **Merge** into Practice → Formula drills (one page, three modes) | Three tabs over the same 94 formulas |
| Home's review session + Practice → Mixed practice | **Merge** into Practice → Review | One place for "what should I practise now?" |
| Practice → Code exercises, Python library; Projects → Python lab | **Move** to Apply (library un-listed, linked from the lab and exercises) | Python is for applying ideas (§8); it was in two sections |
| Projects section | **Rename** Apply; add the six V4 projects (§7) | Application is a first-class outcome |
| Notebook section (Journal, Lesson notes) | **Merge** into My Progress → Notebook | Saved notes belong with progress (§3) |
| Settings (header-only) | **Move** into My Progress (the header gear still opens it) | §3 lists settings under My Progress |
| Header depth toggle | **Remove** from the header; keep the choice in Settings → Learning; lessons put derivations behind **"Go deeper"** | One beginner-friendly default, depth on request (§3) |
| Home's five cards | **Reduce** to the resume hero + one small summary (skills due, lessons done, weak areas, project) | One clear next action (§2) |
| Lesson: ten sections | **Regroup** into six steps (Why it matters · Understand · See it · Try it · Use it · Check understanding); derivation and assumptions behind disclosures | §4 |
| Code exercises | **Add** a no-code interpretation path to each (the `.py` download already existed) | §8 |
| Progress | **Add** "Your learning signals" — the four §7 rates for this learner, with sample sizes | §7, personal trends only |
| Labs, lessons, Bluman content, ML lessons, Model Map ladders | **Keep** | Unique teaching |
| Focus mode, search, theme in the header | **Keep** | Requested, not intrusive |

## Address and state migration

V3.1 ids → V4 ids (old links redirect; tested in `e2e/legacy-routes.spec.js`):

| V3.1 address | V4 address |
|---|---|
| `#maps/concepts[/id]` | `#learn/concepts[/id]` |
| `#maps/formulas` | `#learn/formulas` |
| `#maps/models` | `#learn/models` |
| `#maps/knowledge` | `#learn/careers` |
| `#learn/paths` | `#learn/paths` (now under Maps) |
| `#learn/stories` | `#apply/cases` |
| `#practice/review` (formula flashcards) | `#practice/formulas/flashcards`* |
| `#practice/mixed` | `#practice/review` |
| `#practice/quiz` | `#practice/formulas/quiz` |
| `#practice/problems` | `#practice/formulas/problems` |
| `#practice/code` | `#apply/exercises` |
| `#practice/python` | `#apply/library` |
| `#projects/list`, `#projects/lab` | `#apply/projects`, `#apply/lab` |
| `#progress/diagnostic` | `#learn/placement` |
| `#notebook/notes`, `#notebook/journal` | `#progress/notebook/notes`, `#progress/notebook/journal` |
| `#settings` | `#progress/settings` |
| `#stats/<tab>`, `#ml/<tab>` (pre-V3.1) | unchanged behaviour, new targets |

\* `#practice/review` is reused for the new Review page, whose title was already "Review"; a V3.1 bookmark to the flashcards therefore opens Review, which links to Formula drills one click away. Accepted: the alternative is an id that means two things.

**Learner data: no key, shape or meaning changes.** All stores keep their keys. One additive field is written from now on in new evidence records (`h: true` when a hint was opened before the first answer, `x: true` when the item is a transfer item), so "solved a transfer problem without hints" can be measured; older records simply lack them, and every reader treats absence as "unknown", not "no".

## Not done, deliberately

- No AI tutor (§10 Phase 5).
- No new map types, no 3D, no gamification.
- Unfinished courses stay labelled as outlines.
