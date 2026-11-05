# Learning flow specification

What the app recommends next, what it says after a wrong answer, and what “done” means. Code: `src/lib/nextAction.js`, `src/lib/feedback.js`; tests: `src/lib/__tests__/nextAction.test.js` (the brief’s hard cases), `src/data/curriculum/__tests__/professorContract.test.js`, `e2e/learning-8020.spec.js`.

## 1. One function, every page

```
getNextLearningAction(curriculum, {
  state,       // usePathState(): lessons, placement, pathId, weak, status (mastery levels)
  from,        // {} on Home and My Progress · { lessonId } at a lesson's end · { courseId } on a course page
  resume,      // primaryTarget(...) — the saved place, the last automatic step, or the last lesson opened
  due,         // competency ids due for review
  evidence,    // answer records (fi_learning_v1)
  problemsFor, // applied problems of a lesson
}) → {
  kind,        // resume | lesson | bridge | practice | review | transfer | project |
               // course-transition | content-gap | path-finished
  headline,    // said before the button for a gap, a bridge or the end
  label, target: { page, params, lessonId?, sectionId?, loc? },
  reason, reasons[], warnings[], estimatedMinutes,
  alternatives[],                        // at most two
  evidence: { ruleId, prerequisiteIds?, gapIds?, courseId?, lessonId? },
  rec,                                   // the learning-path engine's answer underneath
}
```

It wraps the existing learning-path engine (`src/lib/learningPath.js`, `recommend`), which still decides the order of lessons and courses. No second progress engine: levels come from `src/lib/mastery.js`, reviews from `src/lib/reviewSchedule.js`, places from `src/lib/studyResume.js`. Pages call it through `useNextAction()` and render it with `NextActionCard` (or, for a saved place on Home, the existing resume hero).

## 2. Rules, in priority order

| Rule (`evidence.ruleId`) | When | Primary action | Others offered |
|---|---|---|---|
| `resume-saved-place` | Home/Progress; the learner saved a place in a lesson whose checkpoint is not answered | Resume at that step (exact scroll position) | a bridge, if one is called for; reviews due |
| `bridge-after-errors` | the most recent miss is in lesson L, L’s recent answers are “struggling” (below), L offers a bridge, and the bridge has not been opened since | The bridge: a named step of an earlier lesson, ~5 min | back to L; reviews due |
| `resume-recent` | Home/Progress; the last automatically saved step is in an unfinished lesson | Continue where I was | the path’s next lesson; reviews due |
| `next-authored-lesson` | the path’s next step is a written lesson in the same course | That lesson | the engine’s skip/bridge choices; at a lesson end, “Apply it first” (its applied problem); reviews due |
| `prerequisite-bridge` | the next course builds on a written course left unfinished (the engine’s course-level bridge) | The bridge lesson | skip ahead |
| `content-gap` | every written lesson of the course is done (or about to be) **and** the course has planned lessons | If any of the course’s written-lesson skills is not yet proficient: **practise** them (“Use it” of the first lesson that teaches one). Otherwise: the next written step on the path. Headline either way: **“Next lesson not written yet: ‹first planned title›”** | the other of the two; the course outline |
| `outline-course` | the course has no written lesson | the engine’s alternative, or the next written course | — |
| `next-authored-course` | the course is fully written (no planned lessons) and done | first lesson of the next written course | — |
| `path-finished` | nothing written is left on the path | due reviews, else an earlier skipped lesson, else Practice; headline **“You’ve completed the available lessons”**, with what is unwritten and how many skills are mastered | a project; the whole path |

**Struggling** (`lessonErrors`): among the lesson’s latest 8 recorded answers (any step, readiness checks included), at least 2 wrong and no more right than wrong — or a checkpoint under half right — unless the last two answers were both right. Answers recorded before this release carry no lesson id and are not counted.

**Bridge** (`bridgeFor`): the lesson’s own `bridge` in its catalog entry (the chain rule names composite functions’ worked examples: its common mistakes come from reading the composite), else the lesson that teaches the last idea it builds on. Always another lesson, always ≤ 5 minutes, shown as a step link that opens that step without moving the saved place.

**Reviews never block.** A due review is always an alternative, never the primary action while a lesson or bridge is waiting (hard case 8).

**Loops are impossible by construction:** a bridge clears once its lesson is opened after the last miss, or the learner gets two right in a row; practising a gap clears once the skills reach proficient; and the walk test follows the primary action from an empty record to `path-finished`, visiting every written lesson once and never repeating an action back to back.

## 3. Feedback after a wrong answer

`explainWrong(item, result, { attempts, hintsShown })` → `{ what, look, showSolution }`:

1. **What went wrong** — the question’s own feedback for the chosen option or `feedbackIncorrect`, if authored. Otherwise, for a number, one of four checks that follow from the numbers alone: the sign; a power of ten; a factor of two; within 5% (“check your rounding”). Otherwise a plain “That is not the expected value.” Nothing guesses at a misconception it cannot see.
2. **Where to look** — the first hint, if the learner has not opened it.
3. **The reasoning** — offered at once (“open the solution”), shown automatically after a second miss.
4. **Next useful practice** — the question’s `remedy` lesson if it has one, else the lesson’s bridge.

The first attempt is still the only one recorded as evidence; hints opened before it still make it count as easier.

## 4. What “done” means for a course

`courseCompletion(curriculum, state, courseId)` returns four statuses that are never added into one number:

| Status | True when |
|---|---|
| `availableContentComplete` | every written lesson’s checkpoint is answered |
| `courseCurriculumComplete` | the course has no planned lessons left: everything in its outline is written |
| `courseReady` | every exit skill of the course is proficient or mastered |
| `mastered` | every exit skill is mastered (the existing evidence rules) |

The course page shows all four under “What ‘done’ means for this course”, and says none is college credit. My Progress lists the exit skills not yet shown for the course of the next action, each with the mastery engine’s plain next step.

## 5. Session closure

“Finish study session” (unchanged: saves the place, completes nothing) now lands on a summary with what was practised this session (answers in that lesson since the session began, and how many were right first time), which skills need review, and the next action from §2.

## 6. The brief’s hard cases → tests

| Hard case | Test |
|---|---|
| 1 First-time learner | `nextAction.test.js` “hard case 1” |
| 2 Last authored lesson done, course has planned lessons | “hard case 2” (5 tests), `e2e/learning-8020.spec.js`, `continuous-learning.spec.js` A, B, D, E |
| 3 Knows algebra, passes readiness | “hard case 3” |
| 4 Fails the chain rule → composition bridge | “hard case 4” (6 tests), e2e “after two misses…” |
| 5 Resume a pinned step after an upgrade | “hard case 5 and 7” |
| 6 Track changes | “hard case 6” (also: no action ever claims credit or equivalence). The SJSU/CSUEB/UC target in the study plan changes nothing here by design. |
| 7 Renamed or removed lesson | “hard case 5 and 7” |
| 8 Review due on the same day as a new lesson | “hard case 8” |
| 9 Circular prerequisites | “hard case 9”; `learningPath.test.js` validator suite |
| 10 Refresh, offline, corrupted storage, backup/restore, two tabs | “hard case 10” (damaged records); e2e `data-safety`, `offline`, `study-continuity` |
