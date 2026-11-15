# Building a study habit, a little at a time

The owner (2026-11-14): “Upgrade all the course designs to get more retention of users and build the study habit bit by bit.”

This page records what the research says, what was built from it, and what was deliberately left out. Everything runs in the browser from records the app already keeps (answers and lesson visits). Nothing is sent to a server, no analytics are added, and nothing new is tracked.

## What the evidence says

| Finding | Source | What it means here |
|---|---|---|
| A habit is behaviour repeated in a stable context until the context triggers it. Automaticity rose along a curve, reaching its plateau after a median of 66 days (range 18 to a predicted 254). Missing one opportunity “did not materially affect the habit formation process”. | Lally, van Jaarsveld, Potts & Wardle (2010), *European Journal of Social Psychology* 40(6), doi:10.1002/ejsp.674; Wood & Neal (2007), *Psychological Review* 114(4) | Tie study to the same moment on the same days. Never treat one missed day as failure. |
| Showing people that a streak is *broken* lowers their later engagement, compared with showing an intact one, whatever they actually did. | Silverman & Barasch (2023), “On or Off Track: How (Broken) Streaks Affect Consumer Decisions”, *Journal of Consumer Research* 49(6), doi:10.1093/jcr/ucac029 | **No streak counter.** Count sessions within a week, never runs of consecutive days. |
| “When situation X arises, I will do Y” plans (implementation intentions) raise goal attainment: d = .65 across 94 tests. A later review of 642 tests finds a smaller but positive effect (d ≈ .27–.66 by outcome; lower after bias correction). | Gollwitzer & Sheeran (2006), *Advances in Experimental Social Psychology* 38; Sheeran, Listrom & Gollwitzer (2024), *European Review of Social Psychology*, doi:10.1080/10463283.2024.2334563 | The plan is a when-and-where sentence: “Mon, Wed and Fri, after dinner — 15 minutes”. |
| Attaching a new behaviour to the end of an existing routine (flossing *after* brushing) built a stronger habit than attaching it to the start. | Judah, Gardner & Aunger (2013), *British Journal of Health Psychology* 18(2) | The plan asks “after what everyday moment?”: after dinner, on my commute, and so on. |
| Goals with a small built-in reserve of slack beat all-or-nothing goals, in both preference and persistence after a slip. One replication in a diet context found no effect, so the size is uncertain. | Sharif & Shu (2017), *Journal of Marketing Research* 54(3), doi:10.1509/jmr.15.0231 | A plan of N days a week counts N − 1 as on track: one spare day is built in. |
| Temporal landmarks such as a new week, month or birthday make people more likely to start, because they feel detached from past lapses. | Dai, Milkman & Riis (2014), “The Fresh Start Effect”, *Management Science* 60(10), doi:10.1287/mnsc.2014.1901 | On a Monday before any session, Home says “A new week starts today. Last week does not count against this one.” After a week or more away, it welcomes the learner back. |
| Close, small subgoals built competence, self-efficacy and interest in arithmetic better than a distant goal. | Bandura & Schunk (1981), *Journal of Personality and Social Psychology* 41(3) | Each session has a small, named next step, and the smallest start is one question. |
| Practice testing and distributed practice are the only two study techniques rated high utility. The best gap between sessions grows with how long the learning must last. | Dunlosky et al. (2013), *Psychological Science in the Public Interest* 14(1); Cepeda et al. (2008), *Psychological Science* 19(11) | The smallest start is a **retrieval** question, taken from spaced review when one is due. |
| Tangible, expected rewards undermine intrinsic motivation. | Deci, Koestner & Ryan (1999), *Psychological Bulletin* 125(6) | No points, badges or prizes. The reward is the learning, shown honestly. |
| Plan-making prompts that helped in small trials had effects an order of magnitude smaller across 250 courses, and faded after the first weeks. | Kizilcec et al. (2020), *PNAS* 117(26), doi:10.1073/pnas.1921417117 | **Expect modest effects.** A plan alone is not enough, so the plan is part of every session's end and every course page, and the reminder comes from the learner's own calendar. |

## What was built

| Where | What the learner sees |
|---|---|
| **Home → “Build a study habit, a little at a time”** | Pick the days, an everyday moment to study after, an optional time, and the session length (15, 30–45 or 60–90 minutes). Saved as a preference (kept on a progress reset and included in backups). |
| **Home → “Your study plan”** | The plan as one sentence. This week, Monday to Sunday: a tick for a day with a session, a ring for a planned day still to come, and nothing worse than a plain ring for a planned day that passed. A line on how the week is going, with one spare day. The next planned session. Today's steps, sized to the session length, starting with **“Start small: one review question (about 2 minutes)”**. |
| **Home → Add to my calendar** | A `.ics` file made in the browser: a weekly repeating event on the planned days at the planned time, with a 10-minute reminder. Reminders come from the learner's own calendar app; the site sends no notifications. |
| **Home → welcome back, new week** | After 7 or more days away: “Welcome back. It has been N days — that is fine, and nothing was lost. Start small today.” On a Monday before any session: “A new week starts today.” |
| **End of a study session** | “Next planned session: Friday — Mon, Wed and Fri, after dinner — 15 minutes”, or an invitation to make a plan. |
| **Every course page** | “At your study plan: about 4 weeks for the 5 written lessons left”, or the minutes left with a link to make a plan. A horizon, not a deadline. |

## Left out on purpose

- **Streaks**, consecutive-day counts, “don't break the chain”: they make a single miss look like failure (Silverman & Barasch 2023), which the habit research says it is not (Lally et al. 2010).
- **Points, badges, levels, leaderboards, confetti**: Deci, Koestner & Ryan (1999); this project's rules (DESIGN_SYSTEM.md).
- **Push notifications, e-mail, accounts, analytics**: they would need a server and tracking. The calendar file gives a reminder the learner controls.
- **Red marks for missed days**: a missed planned day looks no worse than a free day.

## Checks

- `src/lib/__tests__/studyHabit.test.js` covers:
  - study days from answers and lesson visits, on local dates;
  - the Monday-to-Sunday week, including on a Sunday;
  - days away;
  - the plan sentence;
  - the next planned day, including “next Wednesday” when today's only session is done;
  - pace in weeks;
  - the calendar file: weekly rule, start time, escaping.
- `src/store/__tests__/studyPlan.test.js` checks that the habit is cleaned on the way in, keeps its start date, needs at least one day, and survives a progress reset.
- `e2e/v5-journeys.spec.js` walks through it in a real browser: make a plan, see this week and today's steps, change the session length, download the calendar file, reload, and check that Home still has one primary action.

## Status and limits

- The effects in the research are modest. Kizilcec et al. (2020) are a warning against expecting much from any single nudge.
- This app cannot measure retention, since it has no analytics by design, so it cannot report whether this worked. The honest test is the owner's own experience, and any learners who choose to share theirs.
