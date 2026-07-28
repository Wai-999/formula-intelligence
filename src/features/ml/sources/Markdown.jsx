import { parseInline, slugify } from '../../../lib/miniMarkdown.js';
import './Markdown.css';

function Inline({ text }) {
  return parseInline(text).map((t, i) => {
    switch (t.type) {
      // eslint-disable-next-line react/no-array-index-key
      case 'code': return <code key={i} className="md-code">{t.value}</code>;
      case 'strong': return <strong key={i}>{t.value}</strong>;
      case 'em': return <em key={i}>{t.value}</em>;
      case 'link': return (
        // Docs link out to papers and sources; rel is mandatory with _blank.
        <a key={i} href={t.href} target="_blank" rel="noreferrer noopener" className="md-link">{t.value}</a>
      );
      default: return <span key={i}>{t.value}</span>;
    }
  });
}

// Renders the token tree from miniMarkdown as React elements. Nothing here
// touches dangerouslySetInnerHTML, so no document — however it's edited
// later — can inject markup into the app.
export default function Markdown({ blocks }) {
  return (
    <div className="md">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'heading': {
            const Tag = `h${Math.min(b.level + 1, 6)}`;
            const id = slugify(b.value);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Tag key={i} id={id} className={`md-h md-h${b.level}`}>{b.value}</Tag>
            );
          }
          case 'paragraph':
            // eslint-disable-next-line react/no-array-index-key
            return <p key={i} className="md-p"><Inline text={b.value} /></p>;
          case 'quote':
            // eslint-disable-next-line react/no-array-index-key
            return <blockquote key={i} className="md-quote"><Inline text={b.value} /></blockquote>;
          case 'rule':
            // eslint-disable-next-line react/no-array-index-key
            return <hr key={i} className="md-rule" />;
          case 'code':
            // eslint-disable-next-line react/no-array-index-key
            return <pre key={i} className="md-pre"><code>{b.value}</code></pre>;
          case 'list': {
            const Tag = b.ordered ? 'ol' : 'ul';
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Tag key={i} className="md-list">
                {b.items.map((it, j) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={j} className={it.depth ? 'md-li-nested' : undefined}>
                    <Inline text={it.value} />
                  </li>
                ))}
              </Tag>
            );
          }
          case 'table':
            return (
              // eslint-disable-next-line react/no-array-index-key
              // A wide table scrolls horizontally; it must be focusable or
              // its right-hand columns are unreachable by keyboard.
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className="md-table-wrap" tabIndex={0} role="region" aria-label="Table">
                <table className="md-table">
                  <thead>
                    <tr>{b.header.map((h, j) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <th key={j}><Inline text={h} /></th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <tr key={j}>{row.map((c, k) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <td key={k}><Inline text={c} /></td>
                      ))}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
