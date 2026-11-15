import { describe, it, expect } from 'vitest';
import {
  dateKey, studyDays, weekView, daysAway, daysPhrase, planSentence, nextPlannedDay, paceWeeks, icsForPlan,
} from '../studyHabit.js';

// The study-habit rules (docs/learning-8020/STUDY_HABITS.md), on fixed local
// dates. Wednesday 12 November 2025, 10:00 local time is "now" throughout.

const at = (y, m, d, h = 10) => new Date(y, m - 1, d, h).getTime();
const NOW = at(2025, 11, 12); // a Wednesday

describe('study days come from the records the app already keeps', () => {
  it('counts a day with any answer or any lesson visit, once', () => {
    const evidence = [{ at: at(2025, 11, 10, 9) }, { at: at(2025, 11, 10, 21) }, { at: 'bad' }];
    const lessons = { a: { opened: at(2025, 11, 3), visited: at(2025, 11, 11) }, b: { checkpoint: { at: at(2025, 11, 12) } }, c: null };
    expect([...studyDays(evidence, lessons)].sort()).toEqual(['2025-11-03', '2025-11-10', '2025-11-11', '2025-11-12']);
  });

  it('uses local dates, not UTC', () => {
    expect(dateKey(new Date(2025, 0, 1, 23, 59).getTime())).toBe('2025-01-01');
  });
});

describe('this week, Monday to Sunday', () => {
  const studied = new Set(['2025-11-10', '2025-11-12']);
  const week = weekView(studied, [1, 3, 5], NOW);

  it('runs from Monday to Sunday around today', () => {
    expect(week.map((d) => d.key)).toEqual(['2025-11-10', '2025-11-11', '2025-11-12', '2025-11-13', '2025-11-14', '2025-11-15', '2025-11-16']);
    expect(week.map((d) => d.label)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('marks studied, planned, today and the days still to come', () => {
    expect(week.filter((d) => d.studied).map((d) => d.label)).toEqual(['Mon', 'Wed']);
    expect(week.filter((d) => d.planned).map((d) => d.label)).toEqual(['Mon', 'Wed', 'Fri']);
    expect(week.find((d) => d.today).label).toBe('Wed');
    expect(week.filter((d) => d.future).map((d) => d.label)).toEqual(['Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('works on a Sunday, the last day of the week', () => {
    expect(weekView(new Set(), [], at(2025, 11, 16))[0].key).toBe('2025-11-10');
  });
});

describe('time away, and the plan in words', () => {
  it('counts whole days since the last study day', () => {
    expect(daysAway(new Set(), NOW)).toBeNull();
    expect(daysAway(new Set(['2025-11-12']), NOW)).toBe(0);
    expect(daysAway(new Set(['2025-11-01', '2025-11-03']), NOW)).toBe(9);
  });

  it('says the plan as one sentence', () => {
    expect(daysPhrase([5, 1, 3])).toBe('Mon, Wed and Fri');
    expect(daysPhrase([0, 1, 2, 3, 4, 5, 6])).toBe('every day');
    expect(planSentence({ days: [1, 3, 5], cue: 'After dinner', time: '19:30' }, 15)).toBe('Mon, Wed and Fri, after dinner at 19:30 — 15 minutes');
    expect(planSentence({ days: [2], cue: '', time: '' }, null)).toBe('Tue');
    expect(planSentence(null, 15)).toBeNull();
  });

  it('finds the next planned day, skipping today once it is done', () => {
    const plan = { days: [1, 3, 5] };
    expect(nextPlannedDay(plan, new Set(), NOW)).toBe('today');
    expect(nextPlannedDay(plan, new Set(['2025-11-12']), NOW)).toBe('Friday');
    expect(nextPlannedDay({ days: [4] }, new Set(), NOW)).toBe('tomorrow');
    expect(nextPlannedDay({ days: [3] }, new Set(['2025-11-12']), NOW)).toBe('next Wednesday');
  });
});

describe('pace at the plan', () => {
  it('turns minutes left into weeks at the planned sessions', () => {
    expect(paceWeeks(180, { days: [1, 3, 5] }, '15')).toBe(4); // 45 minutes a week
    expect(paceWeeks(30, { days: [1, 3, 5] }, '60-90')).toBe(1);
    expect(paceWeeks(180, null, '15')).toBeNull();
    expect(paceWeeks(0, { days: [1] }, '15')).toBeNull();
  });
});

describe('the calendar file', () => {
  const ics = icsForPlan({ days: [1, 3, 5], cue: 'After dinner, at home', time: '19:30' }, 15, 'https://example.org/app/#home', NOW);

  it('is one weekly event on the planned days, starting on the next one, at the planned time', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR');
    expect(ics).toContain('DTSTART:20251112T193000');
    expect(ics).toContain('DTEND:20251112T194500');
    expect(ics).toContain('TRIGGER:-PT10M');
  });

  it('escapes text the calendar format reserves', () => {
    expect(ics).toContain('DESCRIPTION:After dinner\\, at home: a short study session.');
  });

  it('is not made without days', () => {
    expect(icsForPlan({ days: [] }, 15, 'x', NOW)).toBeNull();
  });
});
