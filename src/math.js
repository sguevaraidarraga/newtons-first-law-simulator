/**
 * Minimal math utilities used across the project.
 */
/**
 * Convert degrees to radians.
 *
 * Args:
 *   deg (number): Angle in degrees.
 *
 * Returns:
 *   number: Angle in radians.
 */
export function degToRad(deg){ return (deg * Math.PI) / 180; }

/**
 * Convert radians to degrees.
 *
 * Args:
 *   rad (number): Angle in radians.
 *
 * Returns:
 *   number: Angle in degrees.
 */
export function radToDeg(rad){ return (rad * 180) / Math.PI; }

/**
 * Clamp a value to the inclusive range [a, b].
 *
 * Args:
 *   v (number): Value to clamp.
 *   a (number): Minimum allowed value.
 *   b (number): Maximum allowed value.
 *
 * Returns:
 *   number: Clamped value.
 */
export function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

/**
 * Check whether a value is near zero within a tolerance.
 *
 * Args:
 *   v (number): Value to check.
 *   eps (number): Tolerance (default 1e-6).
 *
 * Returns:
 *   boolean
 */
export function isNearZero(v, eps = 1e-6){ return Math.abs(v) <= eps; }

/**
 * Return the sign of a number: 1 (positive), -1 (negative), or 0.
 *
 * Args:
 *   v (number)
 *
 * Returns:
 *   number
 */
export function sign(v){ return (v>0) - (v<0); }

export default { degToRad, radToDeg, clamp, isNearZero, sign };
