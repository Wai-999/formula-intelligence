import './MLPlaceholder.css';

// Temporary stand-in used only while a given ML tab's module hasn't been
// built yet in the module-by-module build order (BUILD_LOG.md). Each usage
// is replaced with the real feature page in its own module.
export default function MLPlaceholder({ icon, title, module }) {
  return (
    <div className="ml-placeholder">
      <i className={`ti ${icon}`} aria-hidden="true" />
      <p className="ml-placeholder-title">{title}</p>
      <p className="ml-placeholder-sub">Module {module} — build in progress.</p>
    </div>
  );
}
