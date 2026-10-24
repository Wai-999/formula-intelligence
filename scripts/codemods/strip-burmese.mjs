// English-only codemod, step B (docs/audits/MIGRATION_RISKS.md R-04).
//   bl(enB, enR, myB, myR) -> bl(enB, enR)
//   blSame(en, my)         -> blSame(en)
// Only calls whose callee is bound to src/lib/mlContent.js's export are
// touched — src/data/schema.js has an unrelated local `bl()` (a schema field
// descriptor) that a name-based rewrite would corrupt. Parser-driven (Vite's
// parseAst), never regex: arguments contain commas, template literals,
// nested calls and Myanmar text. Run english-snapshot.mjs before and after.
import { parseAst } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const KEEP = { bl: 2, blSame: 1 };
const EXPECT = { bl: 4, blSame: 2 };
const files = execSync("grep -rlE '\\b(bl|blSame)\\(' src --include='*.js' --include='*.jsx'", { encoding: 'utf8' })
  .trim().split('\n')
  // The definition and its own tests are rewritten by hand.
  .filter((f) => !['src/lib/mlContent.js', 'src/lib/__tests__/mlContent.test.js', 'src/data/schema.js', 'src/data/__tests__/schema.test.js'].includes(f));

let total = 0;
const problems = [];
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const ast = parseAst(src, { lang: f.endsWith('.jsx') ? 'jsx' : 'js' });
  // Local names bound to mlContent's bl/blSame in this file.
  const bound = {};
  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration' && /\/mlContent\.js$/.test(node.source.value)) {
      for (const s of node.specifiers) if (s.imported && KEEP[s.imported.name]) bound[s.local.name] = s.imported.name;
    }
  }
  if (!Object.keys(bound).length) continue;
  const edits = [];
  (function walk(n) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (n.type === 'CallExpression' && n.callee?.type === 'Identifier' && bound[n.callee.name]) {
      const fn = bound[n.callee.name];
      const args = n.arguments;
      if (args.length !== EXPECT[fn]) {
        problems.push(`${f}:${src.slice(0, n.start).split('\n').length} ${fn} has ${args.length} args`);
      } else {
        // Remove from the end of the last kept argument to the end of the last argument.
        edits.push([args[KEEP[fn] - 1].end, args[args.length - 1].end]);
      }
    }
    for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v);
  })(ast);
  if (problems.length) continue;
  // Apply back to front so earlier offsets stay valid. That is only correct
  // if no two spans overlap (a nested call inside a removed argument would
  // shift the outer span's end), so check rather than assume.
  edits.sort((a, b) => b[0] - a[0]);
  for (let i = 1; i < edits.length; i++) {
    if (edits[i][1] > edits[i - 1][0]) problems.push(`${f}: overlapping edits at ${edits[i][0]}–${edits[i][1]}`);
  }
  if (problems.length) continue;
  let out = src;
  for (const [s, e] of edits) out = out.slice(0, s) + out.slice(e);
  writeFileSync(f, out);
  total += edits.length;
  console.log(`${String(edits.length).padStart(4)}  ${f}`);
}
if (problems.length) {
  console.error('Stopped — unexpected argument counts:\n' + problems.join('\n'));
  process.exit(1);
}
console.log(`rewrote ${total} calls`);
