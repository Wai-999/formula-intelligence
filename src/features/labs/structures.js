// The behaviour behind the stack/queue lab, kept apart from the drawing so it
// can be tested (__tests__/labMath.test.js).

/**
 * Apply the same operations to a stack and a queue. Each op is
 * { op: 'add', value } or { op: 'remove' }. Returns one state per op:
 * { stack, queue, fromStack, fromQueue } — the containers after the op
 * (stack bottom → top, queue front → back) and what each removal returned
 * (null when nothing was removed, 'empty' when the container was empty).
 */
export function runOps(ops) {
  const stack = [];
  const queue = [];
  return ops.map(({ op, value }) => {
    let fromStack = null;
    let fromQueue = null;
    if (op === 'add') {
      stack.push(value);
      queue.push(value);
    } else {
      fromStack = stack.length ? stack.pop() : 'empty';
      fromQueue = queue.length ? queue.shift() : 'empty';
    }
    return { stack: [...stack], queue: [...queue], fromStack, fromQueue };
  });
}

/** Bracket check with a stack: { ok, maxDepth, failAt } (failAt: index of the first bad character, or -1). */
export function checkBrackets(s) {
  const pair = { ')': '(', ']': '[', '}': '{' };
  const open = [];
  let maxDepth = 0;
  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];
    if ('([{'.includes(c)) {
      open.push(c);
      maxDepth = Math.max(maxDepth, open.length);
    } else if (c in pair) {
      if (open.pop() !== pair[c]) return { ok: false, maxDepth, failAt: i };
    }
  }
  return { ok: open.length === 0, maxDepth, failAt: open.length ? s.length : -1 };
}

/** Longest wait in a first-come, first-served line with one server. */
export function longestWait(arrivals, serviceMinutes) {
  let nextFree = 0;
  let worst = 0;
  for (const a of arrivals) {
    const start = Math.max(a, nextFree);
    worst = Math.max(worst, start - a);
    nextFree = start + serviceMinutes;
  }
  return worst;
}
