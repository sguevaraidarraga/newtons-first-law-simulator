import { Body } from '../../entities/Body.js';
import { Engine } from '../../core/physics/engine.js';
import { drawArrow } from '../../draw.js';
import { G, DEFAULT_SCALE, FORCE_DRAW_SCALE, COLOR_VELOCITY, COLOR_GRAVITY, COLOR_FRICTION, COLOR_NET, COLOR_NORMAL } from '../../constants.js';
import { degToRad } from '../../math.js';
import { computeInclinedForces } from '../../physicsUtils.js';

/**
 * Create an inclined plane scene representing a body constrained to move along a slope.
 *
 * Args:
 *   options (object): Optional configuration with keys:
 *     - angleDeg (number): slope angle in degrees (default 30).
 *     - mass (number): body mass in kg (default 1).
 *     - mu (number): friction coefficient (default 0.1).
 *     - initS (number): initial position along slope in meters (default 0).
 *     - initV (number): initial velocity along slope in m/s (default 0).
 *     - maxS (number): maximum allowed position along slope in meters (default 5).
 *
 * Returns:
 *   object: Scene API exposing `body`, `engine`, `step(dt)`, `draw(ctx, opts)`, `getState()`, `isAtLimit()`, and setters.
 */
export function createInclinedPlaneScene({ angleDeg = 30, mass = 1, mu = 0.1, initS = 0, initV = 0, maxS = 5 } = {}) {
  let angle = degToRad(angleDeg);
  let maxDistance = maxS;
  let frictionMu = mu;
  let frictionEnabled = true;

  
  const body = new Body({ mass, x: initS, vx: initV });
  const engine = new Engine({ timestep: 1 / 60 });
  engine.addBody(body);

  function applyForces() {
    const forces = computeInclinedForces({ mass: body.mass, angle, mu: frictionMu, vx: body.vx, frictionEnabled });
    console.log('inclinedPlane: applyForces', { angleDeg: (angle*180/Math.PI).toFixed(3), mass: body.mass, mu: frictionMu, frictionEnabled, Fg_parallel: forces.Fg_parallel.toFixed(4), normal: forces.normal.toFixed(4), vx: body.vx });
    body.applyForce(forces.Fnet, 0);
  }

  function step(dt) {
    applyForces();
    engine.step(dt);
    
    if (typeof maxDistance === 'number') {
      if (body.x < 0) { body.x = 0; body.vx = 0; }
      if (body.x > maxDistance) { body.x = maxDistance; body.vx = 0; }
    }
  }

  function getState() {
    return {
      s: body.x,
      v: body.vx,
      a: body.ax,
      mass: body.mass,
    };
  }

  function draw(ctx, opts = {}) {
    const { width = ctx.canvas.width, height = ctx.canvas.height, originX = DEFAULT_ORIGIN_X, originY = DEFAULT_ORIGIN_Y, scale = DEFAULT_SCALE } = opts;
    
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(originX, originY);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const availableX = Math.max(0, width - originX - 4);
    const availableY = Math.max(0, height - originY - 4);
    
    let maxLenPx = Infinity;
    if (cosA > 1e-6) maxLenPx = Math.min(maxLenPx, availableX / cosA);
    if (sinA > 1e-6) maxLenPx = Math.min(maxLenPx, availableY / sinA);
    if (!isFinite(maxLenPx)) maxLenPx = Math.max(width, height);

    
    const pixelMaxFromScene = (typeof maxDistance === 'number') ? maxDistance * scale : maxLenPx;
    const linePix = Math.min(maxLenPx, pixelMaxFromScene);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(linePix * cosA, linePix * sinA);
    ctx.stroke();

    
    ctx.fillStyle = '#333';
    const endX = linePix * cosA; const endY = linePix * sinA;
    ctx.fillRect(endX - 6, endY - 6, 12, 12);

    
    const g = G;
    const Fg_parallel = body.mass * g * Math.sin(angle);
    const normal = body.mass * g * Math.cos(angle);
    let Ffric = 0;
    if (frictionEnabled && Math.abs(body.vx) > 1e-4) {
      Ffric = -frictionMu * normal * Math.sign(body.vx);
    } else if (frictionEnabled) {
      const maxStatic = frictionMu * normal;
      if (Math.abs(Fg_parallel) <= maxStatic) {
        Ffric = -Fg_parallel;
      } else {
        Ffric = -maxStatic * Math.sign(Fg_parallel);
      }
    }
    const Fnet = Fg_parallel + Ffric;

    
    const bodyDistPx = Math.min(body.x * scale, linePix);
    const px = bodyDistPx * cosA;
    const py = bodyDistPx * sinA;
    ctx.fillStyle = COLOR_VELOCITY;
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fill();

    
    const velLen = body.vx * 20;
    const vxpx = cosA * velLen;
    const vypy = sinA * velLen;
    drawArrow(ctx, px, py, px + vxpx, py + vypy, COLOR_VELOCITY);

    const forceScale = FORCE_DRAW_SCALE;
    
    const fgEndX = px + (Fg_parallel * forceScale) * cosA;
    const fgEndY = py + (Fg_parallel * forceScale) * sinA;
    drawArrow(ctx, px, py, fgEndX, fgEndY, COLOR_GRAVITY);
    
    const nx = -sinA; const ny = cosA;
    const nEndX = px + (normal * forceScale) * nx;
    const nEndY = py + (normal * forceScale) * ny;
    drawArrow(ctx, px, py, nEndX, nEndY, COLOR_NORMAL);
    
    if (Math.abs(Ffric) > 1e-6) {
      const fEndX = px + (Ffric * forceScale) * cosA;
      const fEndY = py + (Ffric * forceScale) * sinA;
      drawArrow(ctx, px, py, fEndX, fEndY, COLOR_FRICTION);
    }
    
    const netEndX = px + (Fnet * forceScale) * cosA;
    const netEndY = py + (Fnet * forceScale) * sinA;
    drawArrow(ctx, px, py, netEndX, netEndY, COLOR_NET);

    ctx.restore();
  }

  return {
    body,
    engine,
    step,
    getState,
    draw,
    isAtLimit() { 
      if (typeof maxDistance !== 'number') return false; 
      const eps = 1e-6; const velEps = 1e-3; const accEps = 1e-2;
      
      if (body.x <= eps && Math.abs(body.vx) < velEps && Math.abs(body.ax) < accEps) return true;
      if (body.x >= (maxDistance - eps) && Math.abs(body.vx) < velEps && Math.abs(body.ax) < accEps) return true;
      return false;
    },
    setAngle(deg) { angle = (deg * Math.PI) / 180; },
    setMu(value) { frictionMu = value; },
    setFrictionEnabled(enabled) { frictionEnabled = !!enabled; },
    setPosition(s) { body.x = s; },
    setVelocity(v) { body.vx = v; }
  };
}
