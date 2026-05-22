import { computeFrictionForce } from './physicsUtils.js';
import { G } from './constants.js';

/**
 * Compute friction force for a 1D body.
 *
 * Args:
 *   mass (number): body mass in kg.
 *   v (number): current velocity along the axis (m/s).
 *   mu (number): friction coefficient.
 *   enabled (boolean): whether friction is enabled.
 *
 * Returns:
 *   number: Signed friction force (N). Returns 0 for near-zero velocity or when disabled.
 */
export function computeFriction(mass, v, mu, enabled) {
  if (!enabled) return 0;
  const fr = computeFrictionForce(mass, v, mu, enabled);
  if (fr === null) {
    return 0;
  }
  return fr;
}

/**
 * Compute net force as the algebraic sum of applied and friction forces.
 *
 * Args:
 *   applied (number): Applied force (N).
 *   friction (number): Friction force (N).
 *
 * Returns:
 *   number: Net force (N).
 */
export function computeNetForce(applied, friction) {
  return applied + friction;
}

/**
 * Semi-implicit Euler integrator for 1D state.
 *
 * Args:
 *   state (object): { x, vx, ax, mass } updated in-place.
 *   Fnet (number): Net force along axis (N).
 *   dt (number): Time step in seconds.
 *
 * Returns:
 *   object: The updated state.
 */
export function integrate1D(state, Fnet, dt) {
  state.ax = Fnet / state.mass;
  state.vx += state.ax * dt;
  state.x += state.vx * dt;
  return state;
}

/**
 * Semi-implicit Euler integrator for 2D state.
 *
 * Args:
 *   state (object): { x, y, vx, vy, ax, ay, mass } updated in-place.
 *   Fx (number), Fy (number): Net forces in X and Y (N).
 *   dt (number): Time step in seconds.
 *
 * Returns:
 *   object: The updated state.
 */
export function integrate2D(state, Fx, Fy, dt) {
  state.ax = Fx / state.mass;
  state.ay = Fy / state.mass;
  state.vx += state.ax * dt;
  state.vy += state.ay * dt;
  state.x += state.vx * dt;
  state.y += state.vy * dt;
  return state;
}