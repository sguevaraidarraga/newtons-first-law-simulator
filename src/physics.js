// Utilidades físicas reutilizables
export function computeFriction(mass, v, mu, enabled) {
  if (!enabled || Math.abs(v) < 1e-6) return 0;
  const g = 9.81;
  return -mu * mass * g * Math.sign(v);
}

export function computeNetForce(applied, friction) {
  return applied + friction;
}

// state: { x, y, vx, vy, ax, ay, mass }
export function integrate1D(state, Fnet, dt) {
  state.ax = Fnet / state.mass;
  state.vx += state.ax * dt;
  state.x += state.vx * dt;
  return state;
}

export function integrate2D(state, Fx, Fy, dt) {
  state.ax = Fx / state.mass;
  state.ay = Fy / state.mass;
  state.vx += state.ax * dt;
  state.vy += state.ay * dt;
  state.x += state.vx * dt;
  state.y += state.vy * dt;
  return state;
}
