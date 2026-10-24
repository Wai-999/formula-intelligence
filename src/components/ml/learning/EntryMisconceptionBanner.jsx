import { useState } from 'react';
import { loadJSON, saveJSON } from '../../../lib/storage.js';
import { STORAGE_KEYS } from '../../../data/storageKeys.js';
import { MISCONCEPTIONS } from '../../../data/ml/misconceptions.js';
import { UI_ENTRY_BANNER_TITLE, UI_ENTRY_BANNER_DISMISS, UI_MISCONCEPTION_LBL, UI_ACTUALLY_LBL } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import './MisconceptionCallout.css';
import './EntryMisconceptionBanner.css';

// Module 1's one-time misconception banner (D.3, "User-Trained Model") shown
// the first time a learner opens an ML page. It used to be a modal gate; it
// is now an inline panel above the page (Master Prompt V3.1 §10: "no
// obstructive overlays") — still prominent, still dismissed once and
// remembered, but it never blocks the page beneath it.
export default function EntryMisconceptionBanner() {
  const [dismissed, setDismissed] = useState(() => loadJSON(STORAGE_KEYS.mlEntryBannerSeen, false));
  const entry = MISCONCEPTIONS.userTrainedModel;
  const title = useT(UI_ENTRY_BANNER_TITLE);
  const dismissBtn = useT(UI_ENTRY_BANNER_DISMISS);
  const misconceptionLbl = useT(UI_MISCONCEPTION_LBL);
  const actuallyLbl = useT(UI_ACTUALLY_LBL);
  const belief = useT(entry.belief);
  const truth = useT(entry.truth);

  if (dismissed) return null;

  function dismiss() {
    saveJSON(STORAGE_KEYS.mlEntryBannerSeen, true);
    setDismissed(true);
  }

  return (
    <div className="entry-banner">
      <section className="entry-banner-card" aria-labelledby="entry-banner-title">
        <h2 className="entry-banner-title" id="entry-banner-title"><i className="ti ti-flag-3" aria-hidden="true" /> {title}</h2>
        <p className="misconception-lbl"><i className="ti ti-message-question" aria-hidden="true" /> {misconceptionLbl}</p>
        <p className="misconception-belief">{belief}</p>
        <p className="misconception-actually-lbl"><i className="ti ti-arrow-right" aria-hidden="true" /> {actuallyLbl}</p>
        <p className="misconception-truth">{truth}</p>
        <button type="button" className="entry-banner-dismiss" onClick={dismiss}>{dismissBtn}</button>
      </section>
    </div>
  );
}
