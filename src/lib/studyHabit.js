// Building a study habit (docs/learning-8020/STUDY_HABITS.md). Pure functions
// over records the app already keeps — answers and lesson visits — so the
// habit view adds no tracking of its own and works offline.
//
// Deliberately absent, for evidence and not only taste: a consecutive-day
// streak. A missed day barely affects habit formation (Lally et al. 2010),
// but showing someone a broken streak lowers what they do next (Silverman &
// Barasch 2023). Everything here counts days within a week, never runs of
// days across weeks.

const DAY = 24 * 60 * 60 * 1000;
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** The everyday moments a study session can hang on (Judah et al. 2013: an existing routine is the strongest cue). */
export const CUES = ['After breakfast', 'On my commute', 'At lunch', 'After work', 'After dinner', 'Before bed'];

/** A local calendar date as YYYY-MM-DD — the unit a habit is counted in. */
export function dateKey(t) {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Midnight at the start of the local day containing `t`. */
const startOfDay = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };

/**
 * The days the learner studied: any answer, or any lesson opened, visited or
 * finished. Read from the learning records; nothing extra is stored.
 */
export function studyDays(evidence = [], lessons = {}) {
  const days = new Set();
  for (const e of evidence) if (typeof e?.at === 'number') days.add(dateKey(e.at));
  for (const r of Object.values(lessons)) {
    for (const t of [r?.opened, r?.visited, r?.completed, r?.checkpoint?.at]) if (typeof t === 'number') days.add(dateKey(t));
  }
  return days;
}

/** Monday to Sunday of the week containing `now`, each marked studied, planned, today or still to come. */
export function weekView(studied, plannedDays = [], now = Date.now()) {
  const today = startOfDay(now);
  const back = (new Date(today).getDay() + 6) % 7; // days since Monday
  return Array.from({ length: 7 }, (_, i) => {
    // Noon avoids a daylight-saving change moving a date across midnight.
    const t = today + (i - back) * DAY + DAY / 2;
    const weekday = new Date(t).getDay();
    const key = dateKey(t);
    return {
      key,
      weekday,
      label: WEEKDAYS[weekday],
      name: WEEKDAY_NAMES[weekday],
      planned: plannedDays.includes(weekday),
      studied: studied.has(key),
      today: key === dateKey(now),
      future: startOfDay(t) > today,
    };
  });
}

/** Whole days since the last study day before today (0 if studied today; null if never). */
export function daysAway(studied, now = Date.now()) {
  if (!studied.size) return null;
  const today = startOfDay(now);
  let latest = -Infinity;
  for (const key of studied) {
    const [y, m, d] = key.split('-').map(Number);
    latest = Math.max(latest, new Date(y, m - 1, d).getTime());
  }
  return Math.max(0, Math.round((today - latest) / DAY));
}

/** After this many days away, Home welcomes the learner back instead of carrying on as if nothing happened. */
export const WELCOME_BACK_DAYS = 7;

/** "Mon, Wed and Fri" — the planned days, in week order from Monday. */
export function daysPhrase(days) {
  const order = [1, 2, 3, 4, 5, 6, 0].filter((d) => days.includes(d)).map((d) => WEEKDAYS[d]);
  if (order.length === 7) return 'every day';
  if (order.length <= 1) return order[0] ?? '';
  return `${order.slice(0, -1).join(', ')} and ${order.at(-1)}`;
}

/** The plan as one sentence: the implementation intention, “when X, I will Y”. */
export function planSentence(plan, minutes) {
  if (!plan?.days?.length) return null;
  const when = plan.cue ? `${plan.cue.charAt(0).toLowerCase()}${plan.cue.slice(1)}` : null;
  const at = plan.time ? ` at ${plan.time}` : '';
  return `${daysPhrase(plan.days)}${when ? `, ${when}` : ''}${at}${minutes ? ` — ${minutes} minutes` : ''}`;
}

/** The next planned day from `now` (today counts if not yet studied), as a weekday name, or null. */
export function nextPlannedDay(plan, studied, now = Date.now()) {
  if (!plan?.days?.length) return null;
  // Up to a week ahead: with one planned day already done today, the next is in seven days.
  for (let i = 0; i <= 7; i += 1) {
    const t = startOfDay(now) + i * DAY + DAY / 2;
    if (!plan.days.includes(new Date(t).getDay())) continue;
    if (i === 0 && studied.has(dateKey(t))) continue;
    const name = WEEKDAY_NAMES[new Date(t).getDay()];
    return i === 0 ? 'today' : i === 1 ? 'tomorrow' : i === 7 ? `next ${name}` : name;
  }
  return null;
}

/** Minutes a session of each time box is planned at (the middle of the range). */
export const BOX_MINUTES = { 15: 15, '30-45': 40, '60-90': 75 };

/**
 * How many weeks the remaining written lessons of a course take at the
 * learner's plan — a realistic horizon, not a deadline. Null without a plan.
 */
export function paceWeeks(minutesLeft, plan, timebox) {
  const perSession = BOX_MINUTES[timebox];
  if (!plan?.days?.length || !perSession || minutesLeft <= 0) return null;
  return Math.max(1, Math.ceil(minutesLeft / (perSession * plan.days.length)));
}

const ICS_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const icsEscape = (s) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

/**
 * A calendar file for the plan: one weekly repeating event on the planned
 * days, so reminders come from the learner's own calendar app. Built in the
 * browser; nothing is sent anywhere.
 */
export function icsForPlan(plan, minutes, url, now = Date.now()) {
  if (!plan?.days?.length) return null;
  const [h, m] = (plan.time || '19:00').split(':').map(Number);
  // The first planned day from today, at the planned time (floating local time).
  let start = startOfDay(now);
  while (!plan.days.includes(new Date(start + DAY / 2).getDay())) start += DAY;
  const first = new Date(start);
  first.setHours(h, m, 0, 0);
  const end = new Date(first.getTime() + (minutes || 15) * 60_000);
  const stamp = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
  const utc = new Date(now).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const description = `${plan.cue ? `${plan.cue}: ` : ''}a short study session. Open ${url} and continue where you stopped.`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Formula Intelligence//Study plan//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:study-plan-${utc}@formula-intelligence`,
    `DTSTAMP:${utc}`,
    `DTSTART:${stamp(first)}`,
    `DTEND:${stamp(end)}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${[1, 2, 3, 4, 5, 6, 0].filter((d) => plan.days.includes(d)).map((d) => ICS_DAYS[d]).join(',')}`,
    'SUMMARY:Study session (Formula Intelligence)',
    `DESCRIPTION:${icsEscape(description)}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Study session',
    'TRIGGER:-PT10M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * The sentence under this week's days. `week` is weekView(); `plannedCount`
 * the number of planned days. A plan with N days keeps one spare: N − 1
 * sessions is still "on track" — the emergency reserve of Sharif & Shu
 * (2017), which keeps people going after a slip instead of giving up.
 */
export function rhythmMessage(week, plannedCount) {
  const done = week.filter((d) => d.studied).length;
  // TODO(human): return the sentence for this week, using `done`,
  // `plannedCount` and the days left in `week` (d.future).
  return `${done} of ${plannedCount} planned sessions this week.`;
}
