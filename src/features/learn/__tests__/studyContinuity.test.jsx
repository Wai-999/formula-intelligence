import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import HomePage from '../../home/HomePage.jsx';
import LessonPage from '../LessonPage.jsx';
import CoursePage from '../CoursePage.jsx';
import StudySessionPage from '../StudySessionPage.jsx';
import StudyJourney from '../../progress/StudyJourney.jsx';
import { useStudyResumeStore } from '../../../store/useStudyResumeStore.js';
import { useLearningStore } from '../../../store/useLearningStore.js';
import { useDiagnosticStore } from '../../../store/useDiagnosticStore.js';
import { useUIStore } from '../../../store/useUIStore.js';
import { STORAGE_KEYS } from '../../../data/storageKeys.js';
import { courseById } from '../../../data/curriculum/catalog.js';

// The study-continuity surfaces (docs/study-continuity/TEST_REPORT.md):
// one Resume action on Home, a truthful save in the lesson, a course page
// that resumes into itself, and nothing here ever completing a lesson.

// Labs are their own feature with their own tests; here they would only add
// D3 and lazy chunks to a test about saving places.
vi.mock('../../labs/LabHost.jsx', () => ({ default: () => null }));

const NOW = Date.now();
const place = (lessonId, courseId, sectionId, extra = {}) => ({ courseId, lessonId, sectionId, fraction: 0, at: NOW - 60_000, source: 'auto', ...extra });

function reset() {
  useStudyResumeStore.setState({ pinned: null, current: null, recent: [], saveState: null, pinDirty: false, pendingResume: null, lastSession: null });
  useLearningStore.setState({ evidence: [], cards: {}, lessons: {}, lastLesson: null, notes: {} });
  useDiagnosticStore.setState({ firstRun: null, attempts: [], placement: null });
  useUIStore.getState().goTo('home');
}

beforeEach(() => {
  reset();
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn();
});
afterEach(() => vi.restoreAllMocks());

describe('Home', () => {
  it('a first-time learner still gets the three ways to start, and no Resume', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: 'Where would you like to start?' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Resume where I stopped' })).toBeNull();
  });

  it('a returning learner with a saved place gets exactly one prominent action: Resume, with the saved step', () => {
    useLearningStore.setState({ lastLesson: 'la-dot-product', lessons: { 'la-dot-product': { opened: NOW }, 'a1-slope': { opened: NOW } } });
    useStudyResumeStore.setState({
      pinned: place('a1-slope', 'algebra-1', 'try', { source: 'manual' }),
      current: place('la-dot-product', 'linear-algebra', 'understand', { at: NOW }), // opened since, not saved
    });
    const { container } = render(<HomePage />);
    const primary = container.querySelectorAll('.studio-btn-primary');
    expect(primary).toHaveLength(1);
    expect(primary[0]).toHaveTextContent('Resume where I stopped');
    expect(screen.getByRole('heading', { name: 'Slope as rate of change' })).toBeInTheDocument();
    expect(screen.getByText('Step 4 of 6 — Try it')).toBeInTheDocument();
    expect(screen.getByText(/Saved in this browser only/)).toBeInTheDocument();
    fireEvent.click(primary[0]);
    expect(useUIStore.getState()).toMatchObject({ page: 'learn/lesson', pageParams: { lessonId: 'a1-slope' } });
    expect(useStudyResumeStore.getState().pendingResume).toMatchObject({ lessonId: 'a1-slope', sectionId: 'try' });
  });

  it('without a saved place, offers the recent lesson — and never claims a step that was not saved', () => {
    useLearningStore.setState({ lastLesson: 'c1-derivative', lessons: { 'c1-derivative': { opened: NOW } } });
    render(<HomePage />);
    expect(screen.getByRole('button', { name: 'Continue recent lesson' })).toBeInTheDocument();
    expect(screen.getByText('You opened this lesson; no step has been saved yet')).toBeInTheDocument();
  });

  it('explains a saved place whose lesson no longer exists, instead of a blank page or a wrong lesson', () => {
    useLearningStore.setState({ lessons: { 'a1-slope': { opened: NOW } } });
    useStudyResumeStore.setState({ pinned: place('a1-old-name', 'algebra-1', 'see', { source: 'manual' }) });
    render(<HomePage />);
    expect(screen.getByText(/no longer in the course list \(“a1-old-name”\)/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Algebra I/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Forget that saved place' }));
    expect(useStudyResumeStore.getState().pinned).toBeNull();
  });
});

describe('Lesson', () => {
  // jsdom lays nothing out (every box is at 0), which would put every step
  // above the reading line. Steps 1–6 start below the fold, as on a fresh load.
  beforeEach(() => {
    const real = Element.prototype.getBoundingClientRect;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect() {
      return this.classList?.contains('lesson-section') ? { top: 1000, bottom: 1400, left: 0, right: 0, width: 0, height: 400 } : real.call(this);
    });
  });

  const openLesson = async (lessonId = 'a1-slope') => {
    useUIStore.getState().goTo('learn/lesson', { lessonId });
    render(<LessonPage lessonId={lessonId} />);
    await screen.findByRole('heading', { name: /Why it matters/ });
  };

  it('"Save my place" says saved only once it is stored', async () => {
    await openLesson();
    fireEvent.click(screen.getByRole('button', { name: 'Save my place' }));
    expect(document.querySelector('.lesson-save-note[role="status"]')).toHaveTextContent(/^Saved on this device: Step 1 of 6 — Why it matters, today, /);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.resume)).pinned).toMatchObject({ lessonId: 'a1-slope', courseId: 'algebra-1', sectionId: 'matters', source: 'manual' });
  });

  it('a save the browser refuses is reported as an error, never as saved', async () => {
    await openLesson();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    fireEvent.click(screen.getByRole('button', { name: 'Save my place' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Couldn’t save to this browser');
    for (const s of screen.getAllByRole('status')) expect(s).not.toHaveTextContent(/Saved on this device/);
  });

  it('shows where the learner is among the six steps, in words', async () => {
    useLearningStore.setState({ lessons: { 'a1-slope': { opened: NOW, sections: ['matters', 'understand'] } } });
    useStudyResumeStore.setState({ pinned: place('a1-slope', 'algebra-1', 'see', { source: 'manual' }) });
    await openLesson();
    fireEvent.click(screen.getByRole('button', { name: /Step 1 of 6/ }));
    const trail = screen.getByRole('list', { name: 'Steps in this lesson' });
    const items = within(trail).getAllByRole('button');
    expect(items[0]).toHaveTextContent('You are here');
    expect(items[0]).toHaveAttribute('aria-current', 'step');
    expect(items[1]).toHaveTextContent('Visited');
    expect(items[2]).toHaveTextContent('Not reached · saved place');
    expect(screen.getByRole('button', { name: 'Back to your saved place: Step 3' })).toBeInTheDocument();
  });

  it('offers to resume a deeper place in this lesson when it opens at the top', async () => {
    useStudyResumeStore.setState({ recent: [place('a1-slope', 'algebra-1', 'use')] });
    await openLesson();
    fireEvent.click(screen.getByRole('button', { name: 'Resume from Step 5' }));
    // The lesson is already on screen, so it takes the request at once.
    expect(Element.prototype.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' }));
    expect(screen.getByRole('button', { name: /Step 5 of 6/ })).toBeInTheDocument();
    expect(useStudyResumeStore.getState().pendingResume).toBeNull();
  });

  it('"Finish study session" saves and leaves — it does not complete the lesson', async () => {
    await openLesson();
    fireEvent.click(screen.getByRole('button', { name: 'Finish study session' }));
    expect(useUIStore.getState().page).toBe('learn/session');
    expect(useStudyResumeStore.getState().lastSession).toMatchObject({ ok: true, loc: { lessonId: 'a1-slope', sectionId: 'matters' } });
    expect(useLearningStore.getState().lessons['a1-slope'].completed).toBeUndefined();
  });

  it('a resume request restores the saved step once the lesson has loaded, then is used up', async () => {
    useStudyResumeStore.getState().requestResume(place('a1-slope', 'algebra-1', 'try'));
    render(<LessonPage lessonId="a1-slope" />);
    await screen.findByRole('heading', { name: /Why it matters/ });
    expect(Element.prototype.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' }));
    expect(screen.getByRole('button', { name: /Step 4 of 6/ })).toBeInTheDocument();
    expect(useStudyResumeStore.getState().pendingResume).toBeNull();
  });
});

describe('Course page', () => {
  it('resumes into its own course; a saved place in another course does not take over', () => {
    useLearningStore.setState({ lessons: { 'a1-slope': { opened: NOW } } });
    useStudyResumeStore.setState({
      pinned: place('la-dot-product', 'linear-algebra', 'see', { source: 'manual' }),
      recent: [place('a1-slope', 'algebra-1', 'try')],
    });
    render(<CoursePage courseId="algebra-1" />);
    fireEvent.click(screen.getByRole('button', { name: 'Continue where you were: Step 4' }));
    expect(useStudyResumeStore.getState().pendingResume).toMatchObject({ lessonId: 'a1-slope', sectionId: 'try' });
    expect(screen.getByText('You stopped at Step 4: Try it')).toBeInTheDocument();
  });

  it('with no place in the course, keeps the first-unfinished-lesson start', () => {
    render(<CoursePage courseId="algebra-1" />);
    expect(screen.getByRole('link', { name: /^Start: Break-even/ })).toBeInTheDocument();
    expect(screen.getByText('0 of 4 checked (checkpoint answered)')).toBeInTheDocument();
  });

  it('after the last written lesson: an honest end, the planned lessons still listed as not written', () => {
    const course = courseById.prealgebra;
    const ids = course.units.flatMap((u) => u.lessons);
    useLearningStore.setState({ lessons: Object.fromEntries(ids.map((id) => [id, { opened: NOW, completed: NOW, checkpoint: { correct: 3, total: 3 } }])) });
    render(<CoursePage courseId="prealgebra" />);
    expect(screen.getByRole('heading', { name: 'You finished the available lessons in this course' })).toBeInTheDocument();
    expect(screen.getByText(/the full course is not yet complete/)).toBeInTheDocument();
    expect(screen.getByText(/not a grade, transcript or credential/)).toBeInTheDocument();
    expect(screen.getAllByText('Not written yet').length).toBeGreaterThan(0);
    expect(screen.queryByText(/100%|Course complete|Mastered/i)).toBeNull();
    // One concrete next course, with the reason — never just the whole catalog.
    expect(screen.getByRole('link', { name: /^Continue to Algebra I: / })).toHaveAttribute('href', '#learn/lesson/a1-break-even');
    expect(screen.getByText(/Algebra I comes next on/)).toBeInTheDocument();
  });
});

describe('My Progress and the session summary', () => {
  it('shows the saved place; removing it removes only the bookmark', () => {
    useLearningStore.setState({ lessons: { 'a1-slope': { opened: NOW, completed: NOW, checkpoint: { correct: 2, total: 3 } } }, notes: { 'a1-slope': { text: 'kept', updated: NOW } } });
    useStudyResumeStore.setState({ pinned: place('a1-slope', 'algebra-1', 'use', { source: 'manual' }), recent: [place('a1-slope', 'algebra-1', 'use')] });
    render(<StudyJourney />);
    expect(screen.getAllByText(/Step 5 of 6 — Use it/).length).toBe(2); // the saved place, and the course's line
    expect(screen.getByText('1 of 4 written lessons checked')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove saved place' }));
    expect(screen.getByText(/Saved place removed\. Your answers, checkpoints and notes are unchanged\./)).toBeInTheDocument();
    expect(useStudyResumeStore.getState().pinned).toBeNull();
    expect(useLearningStore.getState().lessons['a1-slope'].completed).toBe(NOW);
    expect(useLearningStore.getState().notes['a1-slope'].text).toBe('kept');
  });

  it('a session whose place could not be stored says so, and gives the way out', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    useStudyResumeStore.getState().finishSession({ loc: place('a1-slope', 'algebra-1', 'see'), startedAt: NOW - 300_000, answered: 2 });
    render(<StudySessionPage />);
    expect(screen.getByRole('alert')).toHaveTextContent('Your place could not be saved in this browser.');
    expect(screen.queryByText(/Your place is saved/)).toBeNull();
    expect(screen.getByText(/2 questions answered in this lesson/)).toBeInTheDocument();
  });
});
