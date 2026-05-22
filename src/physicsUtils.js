import { G } from './constants.js';
import { sign } from './math.js';

/**
 * Compute friction force using a simple Coulomb model.
 *
 * Args:
 *   mass (number): body mass in kg.
 *   vx (number): velocity along the contact surface in m/s.
 *   mu (number): friction coefficient.
 *   frictionEnabled (boolean): whether friction is enabled.
 *
 * Returns:
 *   number|null: Signed friction force (N). Returns null when static friction case is undecided.
 */
export function computeFrictionForce(mass, vx, mu, frictionEnabled = true){
  if (!frictionEnabled) return 0;
  const normal = mass * G;
  if (Math.abs(vx) > 1e-4) {
    return -mu * normal * sign(vx);
  }
  return null;
}

/**
 * Compute the maximum static friction magnitude for a given mass and mu.
 *
 * Args:
 *   mass (number): body mass in kg.
 *   mu (number): friction coefficient.
 *
 * Returns:
 *   number: Maximum static friction force magnitude (N).
 */
export function computeMaxStaticFriction(mass, mu){ return mu * mass * G; }

/**
 * Compute forces for a body on an inclined plane along the slope direction.
 *
 * Args:
 *   opts (object): { mass, angle, mu, vx, frictionEnabled }
 *
 * Returns:
 *   object: { Fg_parallel, normal, Ffric, Fnet }
 */
export function computeInclinedForces({ mass, angle, mu = 0, vx = 0, frictionEnabled = true }){
  const Fg_parallel = mass * G * Math.sin(angle);
  const normal = mass * G * Math.cos(angle);
  let Ffric = 0;
  if (!frictionEnabled) {
    Ffric = 0;
  } else if (Math.abs(vx) > 1e-4) {
    Ffric = -mu * normal * sign(vx);
  } else {
    const maxStatic = mu * normal;
    if (Math.abs(Fg_parallel) <= maxStatic) {
      Ffric = -Fg_parallel;
    } else {
      Ffric = -maxStatic * sign(Fg_parallel);
    }
  }
  const Fnet = Fg_parallel + Ffric;
  return { Fg_parallel, normal, Ffric, Fnet };
}

/**
 * Default export for backward compatibility with code that imported physics utilities.
 */
export default { computeFrictionForce, computeMaxStaticFriction };
