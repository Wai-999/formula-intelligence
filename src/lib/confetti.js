const COLORS = ['#8b5cf6', '#22d3ee', '#34d399', '#fbbf24', '#fb7185'];

export function fireConfetti() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const layer = document.createElement('div');
  layer.style.cssText = 'position:fixed;inset:0;z-index:11000;pointer-events:none;overflow:hidden';
  document.body.appendChild(layer);

  for (let i = 0; i < 90; i++) {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;width:8px;height:14px;border-radius:2px;left:${Math.random() * 100}vw;top:-20px;background:${COLORS[i % COLORS.length]};transform:rotate(${Math.random() * 180}deg);animation:fc-confetti-fall 1.4s ease-out forwards;animation-delay:${Math.random() * 0.25}s`;
    layer.appendChild(p);
    setTimeout(() => p.remove(), 1700);
  }
  setTimeout(() => layer.remove(), 2000);
}

if (typeof document !== 'undefined' && !document.getElementById('fc-confetti-keyframes')) {
  const style = document.createElement('style');
  style.id = 'fc-confetti-keyframes';
  style.textContent = '@keyframes fc-confetti-fall{to{transform:translateY(105vh) rotate(720deg);opacity:0}}';
  document.head.appendChild(style);
}
