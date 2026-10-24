import { useState } from 'react';
import { useLearningStore } from '../../store/useLearningStore.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { courseById } from '../../data/curriculum/catalog.js';
import { hashFor } from '../../app/pages.js';
import '../../styles/studio.css';
import '../learn/learn.css';

// Every note written in a lesson’s side panel, in one place (§10 "notebook
// capture"). Edits here and in the lesson are the same record.

function download(notes) {
  const md = Object.entries(notes)
    .sort((a, b) => b[1].updated - a[1].updated)
    .map(([id, n]) => `## ${lessonById[id]?.title ?? id}\n\n_${new Date(n.updated).toLocaleString()}_\n\n${n.text}\n`)
    .join('\n');
  const url = URL.createObjectURL(new Blob([`# Formula Intelligence — lesson notes\n\n${md}`], { type: 'text/markdown' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `lesson-notes-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Note({ id, note }) {
  const saveNote = useLearningStore((s) => s.saveNote);
  const [text, setText] = useState(note.text);
  const [confirm, setConfirm] = useState(false);
  const lesson = lessonById[id];
  return (
    <article className="studio-card" aria-labelledby={`note-${id}`}>
      <div className="studio-row" style={{ justifyContent: 'space-between' }}>
        <h2 id={`note-${id}`} className="studio-h3">
          {lesson ? <a href={hashFor('learn/lesson', { lessonId: id })}>{lesson.title}</a> : id}
        </h2>
        <span className="studio-muted">{lesson ? courseById[lesson.course]?.title : ''} · {new Date(note.updated).toLocaleDateString()}</span>
      </div>
      <label htmlFor={`note-ta-${id}`} className="visually-hidden">Note for {lesson?.title ?? id}</label>
      <textarea id={`note-ta-${id}`} className="studio-textarea" value={text} onChange={(e) => setText(e.target.value)} onBlur={() => text !== note.text && saveNote(id, text || ' ')} />
      {!confirm ? (
        <div className="studio-row"><button type="button" className="studio-btn studio-btn-small" onClick={() => setConfirm(true)}>Delete note…</button></div>
      ) : (
        <div className="studio-row" role="alertdialog" aria-label="Confirm delete">
          <span className="studio-muted">Delete this note? It cannot be undone unless you have a backup.</span>
          <button type="button" className="studio-btn studio-btn-small" onClick={() => saveNote(id, '')}>Delete</button>
          <button type="button" className="studio-btn studio-btn-small" onClick={() => setConfirm(false)}>Keep it</button>
        </div>
      )}
    </article>
  );
}

export default function NotesPage() {
  const notes = useLearningStore((s) => s.notes);
  const entries = Object.entries(notes).sort((a, b) => b[1].updated - a[1].updated);
  return (
    <div className="studio-scroll">
      <div className="studio-page studio-read">
        <p className="studio-lede">Notes you write in a lesson’s side panel collect here. They are stored only on this device — download them, or include them in a backup from Settings.</p>
        {entries.length === 0 ? (
          <p className="studio-muted">No lesson notes yet. Open any lesson from <a href={hashFor('learn/courses')}>Learn</a> and use “Your notes” beside it.</p>
        ) : (
          <>
            <div className="studio-row"><button type="button" className="studio-btn studio-btn-small" onClick={() => download(notes)}><i className="ti ti-download" aria-hidden="true" /> Download as Markdown</button></div>
            {entries.map(([id, n]) => <Note key={id} id={id} note={n} />)}
          </>
        )}
      </div>
    </div>
  );
}
