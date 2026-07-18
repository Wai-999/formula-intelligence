import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, { suffix = '' } = {}) {
  const [display, setDisplay] = useState(`0${suffix}`);
  const prevRef = useRef(0);

  useEffect(() => {
    const end = Number(target) || 0;
    const start = prevRef.current;
    prevRef.current = end;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplay(`${end}${suffix}`);
      return;
    }

    const t0 = performance.now();
    let raf;
    function frame(now) {
      const p = Math.min(1, (now - t0) / 650);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(`${Math.round(start + (end - start) * eased)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [target, suffix]);

  return display;
}
