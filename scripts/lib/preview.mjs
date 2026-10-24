// Start `vite preview` on 127.0.0.1 for an evidence script, and stop it.
// Same approach as scripts/a11y-audit.mjs (see the comments there for why
// the address is a literal and why the server's output is kept).
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

export async function startPreview(port) {
  const base = `http://127.0.0.1:${port}/formula-intelligence/`;
  const server = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort', '--host', '127.0.0.1'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const log = [];
  const capture = (buf) => { log.push(buf.toString()); if (log.length > 40) log.shift(); };
  server.stdout.on('data', capture);
  server.stderr.on('data', capture);
  let exited = null;
  server.on('exit', (code, signal) => { exited = { code, signal }; });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (exited) throw new Error(`preview server exited early (code ${exited.code})\n${log.join('')}`);
    try {
      if ((await fetch(base)).ok) return { base, stop: () => server.kill() };
    } catch { /* not listening yet */ }
    await sleep(500);
  }
  server.kill();
  throw new Error(`preview server did not answer ${base} within 60s\n${log.join('')}`);
}
