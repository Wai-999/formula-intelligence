/** Fixed-step gradient descent; returns every iterate, start included. */
export function descend(grad, start, eta, steps) {
  const path = [start];
  let [x, y] = start;
  for (let i = 0; i < steps; i++) {
    const [gx, gy] = grad(x, y);
    x -= eta * gx;
    y -= eta * gy;
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 1e6 || Math.abs(y) > 1e6) break;
    path.push([x, y]);
  }
  return path;
}
