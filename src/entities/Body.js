/**
 * Body: represents a simple physical body with mass, position, velocity and accumulated forces.
 *
 * Methods:
 *   - applyForce(fx, fy): add a force to the body's accumulator.
 *   - clearForces(): reset accumulated forces.
 *   - integrate(dt): integrate position and velocity using semi-implicit Euler.
 */
export class Body {
  constructor({ mass = 1, x = 0, y = 0, vx = 0, vy = 0 } = {}) {
    this.mass = mass;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.fx = 0;
    this.fy = 0;
    this.ax = 0;
    this.ay = 0;
  }

  applyForce(fx = 0, fy = 0) {
    this.fx += fx;
    this.fy += fy;
  }

  clearForces() {
    this.fx = 0;
    this.fy = 0;
  }

  integrate(dt) {
    this.ax = this.fx / this.mass;
    this.ay = this.fy / this.mass;
    this.vx += this.ax * dt;
    this.vy += this.ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.clearForces();
  }
}
