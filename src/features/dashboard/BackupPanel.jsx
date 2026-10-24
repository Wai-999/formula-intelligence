import { useRef, useState } from 'react';
import { createBackup, validateBackup, restoreBackup, backupFilename } from '../../lib/backup.js';
import { QUARANTINE_KEY } from '../../lib/storage.js';
import { useToastStore } from '../../store/useToastStore.js';

function download(backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backupFilename();
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function quarantinedCount() {
  try {
    return Object.keys(JSON.parse(localStorage.getItem(QUARANTINE_KEY) || '{}')).length;
  } catch {
    return 0;
  }
}

// Learner-controlled backup (spec §11). Restore is a two-step action: pick a
// file, read what it will replace, then confirm — and the confirm step
// offers a download of the current progress first, because a restore is the
// one irreversible thing this panel can do.
export default function BackupPanel() {
  const addToast = useToastStore((s) => s.addToast);
  const fileRef = useRef(null);
  const [pending, setPending] = useState(null); // { backup, count, exportedAt }
  const [error, setError] = useState(null);
  const setAside = quarantinedCount();

  function onExport() {
    download(createBackup());
    addToast('Backup downloaded', 'success');
  }

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    setError(null);
    if (!file) return;
    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      setError('That file could not be read as a backup.');
      return;
    }
    const check = validateBackup(parsed);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setPending({ backup: parsed, count: check.keys.length, exportedAt: parsed.exportedAt });
  }

  function onConfirm() {
    const res = restoreBackup(pending.backup);
    if (!res.ok) {
      setError(res.error);
      setPending(null);
      return;
    }
    // Every store reads storage once, at import; a reload is the only way
    // to make the whole app agree with the restored data.
    window.location.reload();
  }

  const when = pending?.exportedAt ? new Date(pending.exportedAt).toLocaleString() : 'an unknown date';

  return (
    <section className="backup-panel" aria-labelledby="backup-title">
      <h3 id="backup-title">Your data</h3>
      <p className="backup-note">
        Your progress is stored only in this browser. Download a backup to keep it safe or move it to another device.
      </p>
      {setAside > 0 && (
        <p className="backup-note backup-warn" role="status">
          {setAside} saved {setAside === 1 ? 'item' : 'items'} could not be read and {setAside === 1 ? 'was' : 'were'} set
          aside rather than deleted. {setAside === 1 ? 'It is' : 'They are'} included in every backup you download.
        </p>
      )}
      {!pending && (
        <div className="backup-actions">
          <button type="button" className="backup-btn" onClick={onExport}>Download backup</button>
          <button type="button" className="backup-btn" onClick={() => fileRef.current?.click()}>Restore from backup…</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onFile} aria-hidden="true" tabIndex={-1} />
        </div>
      )}
      {pending && (
        <div className="backup-confirm" role="alertdialog" aria-labelledby="backup-confirm-msg">
          <p id="backup-confirm-msg">
            This replaces all of your current progress with the backup from {when} ({pending.count} saved {pending.count === 1 ? 'item' : 'items'}).
            This cannot be undone unless you download your current progress first.
          </p>
          <div className="backup-actions">
            <button type="button" className="backup-btn" onClick={onExport}>Download current progress first</button>
            <button type="button" className="backup-btn backup-danger" onClick={onConfirm}>Replace my progress</button>
            <button type="button" className="backup-btn" onClick={() => setPending(null)}>Cancel</button>
          </div>
        </div>
      )}
      {error && <p className="backup-note backup-error" role="alert">{error}</p>}
    </section>
  );
}
