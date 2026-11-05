// The order a choice question shows its options in: a fixed shuffle per
// question, seeded by its id. Authored banks tend to put the right answer
// first (all 40 reasoning steps of the applied problems did), which a learner
// can learn to exploit; a seeded shuffle moves it while every learner, every
// visit and every test sees the same order. Options keep their authored index
// for checking and feedback, so no data changes.

/** A permutation of 0..n-1, the same for the same seed. */
export function choiceOrder(n, seed) {
  let h = 2166136261;
  for (const ch of String(seed)) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  // mulberry32, seeded by the FNV-1a hash of the id.
  const rand = () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
