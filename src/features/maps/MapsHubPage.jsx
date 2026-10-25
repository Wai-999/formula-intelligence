import { hashFor } from '../../app/pages.js';
import '../../styles/studio.css';

// Learn → Maps (V4 §3: "Formula Map is NOT a sixth main tab … a searchable
// optional full map in Learn"). Every map is optional exploration; lessons
// link to the right spot in them through "See connections".
const MAPS = [
  { page: 'learn/concepts', icon: 'ti-share', title: 'Concept map', text: 'Every idea in the courses and what it builds on. Pick one to see its prerequisites, where it leads and the lesson that teaches it.' },
  { page: 'learn/formulas', icon: 'ti-topology-star-3', title: 'Formula map', text: 'The 94 formulas of introductory statistics (Bluman) and how each one depends on the others.' },
  { page: 'learn/paths', icon: 'ti-route', title: 'Formula paths', text: 'Choose a statistics formula and get the shortest chain of formulas to learn first.' },
  { page: 'learn/models', icon: 'ti-brain', title: 'Model map', text: '32 machine-learning models by family, each with a short ladder from intuition to its limits.' },
  { page: 'learn/careers', icon: 'ti-briefcase', title: 'Careers & applications', text: 'Where the mathematics is used: applications and the jobs that rely on them.' },
];

export default function MapsHubPage() {
  return (
    <div className="studio-scroll">
      <div className="studio-page">
        <p className="studio-lede studio-read">
          Maps show how ideas connect. You never need them to follow a course — every lesson has a <strong>See connections</strong> button
          that opens the right place — but they are here when you want the big picture or are looking for something specific.
        </p>
        <ul className="studio-grid studio-list-plain">
          {MAPS.map((m) => (
            <li key={m.page}>
              <a className="studio-card studio-card-link" href={hashFor(m.page)}>
                <span className="studio-h3"><i className={`ti ${m.icon}`} aria-hidden="true" /> {m.title}</span>
                <span className="studio-muted">{m.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
