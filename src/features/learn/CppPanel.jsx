import { useState } from 'react';
import MathText from '../../components/math/MathText.jsx';
import { cppExercisesFor, exerciseSource } from '../../data/cpp/exercises.js';

// A lesson's C++ (V5.1 §6 baseline). The browser cannot compile C++ safely,
// so the page shows the code and its real output (checked by
// scripts/verify-cpp.mjs), offers the file as a download, and explains how
// to compile it locally. No code is ever sent anywhere.

/** Offer text as a file download, created in the browser — nothing is fetched. */
function download(name, text) {
  const url = URL.createObjectURL(new Blob([text.endsWith('\n') ? text : `${text}\n`], { type: 'text/x-c++src' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function CompileHelp({ file }) {
  const exe = file.replace(/\.cpp$/, '');
  return (
    <details className="lesson-disclosure">
      <summary>How to compile and run it on your computer</summary>
      <p className="lesson-p">The site uses standard C++17. One compiler is enough; all are free.</p>
      <ul className="lesson-ul">
        <li><strong>macOS:</strong> install the command-line tools once with <code>xcode-select --install</code>, then <code>clang++ -std=c++17 -Wall -Wextra -o {exe} {file}</code> and <code>./{exe}</code>.</li>
        <li><strong>Linux:</strong> install g++ from your distribution (for example <code>sudo apt install g++</code>), then <code>g++ -std=c++17 -Wall -Wextra -o {exe} {file}</code> and <code>./{exe}</code>.</li>
        <li><strong>Windows:</strong> use g++ from MSYS2 or WSL with the same commands, or Visual Studio’s Developer Command Prompt: <code>cl /std:c++17 /EHsc /W4 {file}</code> then <code>{exe}.exe</code>.</li>
      </ul>
      <p className="studio-muted">Keep <code>-Wall -Wextra</code> on: warnings catch many bugs before you run anything. Online compilers exist, but pasting code into one sends it to a third party; this site never does.</p>
    </details>
  );
}

function Exercise({ ex }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="cpp-exercise">
      <h4 className="studio-h3">Write it yourself: {ex.title}</h4>
      <MathText as="p" className="lesson-p" text={ex.prompt} />
      <p className="studio-muted">The download is a complete program: your function at the top, {ex.tests.length} tests at the bottom. It compiles as it is and the tests fail until the function is right.</p>
      <div className="studio-row">
        <button type="button" className="studio-btn studio-btn-small" onClick={() => download(ex.file, exerciseSource(ex, 'starter'))}>
          <i className="ti ti-download" aria-hidden="true" /> Download {ex.file}
        </button>
        <button type="button" className="studio-btn studio-btn-small" aria-expanded={shown} onClick={() => setShown((v) => !v)}>
          {shown ? 'Hide' : 'Show'} a reference solution
        </button>
      </div>
      <ul className="lesson-ul cpp-tests">
        {ex.tests.map((t) => <li key={t.name}><code>{t.call}</code> should be <code>{t.expect}</code> — {t.name}</li>)}
      </ul>
      {shown && (
        <>
          <p className="studio-muted">Try it first: reading a solution before attempting teaches far less than a failed attempt does.</p>
          <pre className="lesson-code" tabIndex={0} aria-label={`Reference solution for ${ex.title}`}><code>{ex.solution}</code></pre>
        </>
      )}
    </div>
  );
}

export default function CppPanel({ lessonId, cpp, open }) {
  const exercises = cppExercisesFor(lessonId);
  return (
    <details className="lesson-disclosure" open={open}>
      <summary>Optional: the program in C++</summary>
      <MathText as="p" className="lesson-p" text={cpp.intro} />
      <pre className="lesson-code" tabIndex={0} aria-label={`C++ program ${cpp.file}`}><code>{cpp.code}</code></pre>
      {cpp.stdin && (
        <>
          <p className="studio-eyebrow">Input typed in</p>
          <pre className="lesson-code lesson-output" tabIndex={0} aria-label="Input"><code>{cpp.stdin}</code></pre>
        </>
      )}
      <p className="studio-eyebrow">Output (from compiling and running it)</p>
      <pre className="lesson-code lesson-output" tabIndex={0} aria-label="Output"><code>{cpp.output}</code></pre>
      <MathText as="p" className="studio-muted" text={cpp.explain} />
      <div className="studio-row">
        <button type="button" className="studio-btn studio-btn-small" onClick={() => download(cpp.file, cpp.code)}>
          <i className="ti ti-download" aria-hidden="true" /> Download {cpp.file}
        </button>
        <span className="studio-muted">Not coding yet? The questions above are the whole lesson.</span>
      </div>
      <CompileHelp file={cpp.file} />
      {exercises.map((ex) => <Exercise key={ex.id} ex={ex} />)}
    </details>
  );
}
