import DueReview from './DueReview.jsx';
import MixedPractice from './MixedPractice.jsx';
import { hashFor } from '../../app/pages.js';
import '../../styles/studio.css';
import '../learn/learn.css';
import './review.css';

// Practice → Review (V4 §3: "exercises, targeted review and simple quizzes in
// one place"). Two kinds of practice that used to live apart — the due-skill
// review on Home and the separate Mixed practice tab — on one page, in the
// order to do them: what is due first, then a mixed set.
export default function ReviewPage() {
  return (
    <div className="studio-scroll">
      <div className="studio-page">
        <section className="studio-section" aria-labelledby="review-due">
          <h2 id="review-due" className="studio-h2">Due for review</h2>
          <DueReview />
        </section>

        <section className="studio-section" aria-labelledby="review-mixed">
          <h2 id="review-mixed" className="studio-h2">Mixed practice</h2>
          <MixedPractice />
        </section>

        <p className="studio-muted">
          Drilling the statistics formulas instead? <a href={hashFor('practice/formulas')}>Formula drills</a> has flashcards, a quiz and step-by-step problems.
        </p>
      </div>
    </div>
  );
}
