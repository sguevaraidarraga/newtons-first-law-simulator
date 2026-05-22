/**
 * Engine: simulation engine that runs fixed-timestep internal ticks.
 *
 * Methods:
 *   - addBody(body): register a body to be integrated each tick.
 *   - removeBody(body): unregister a body.
 *   - on(event, fn): subscribe to engine events (e.g. 'tick').
 *   - step(dt): advance the engine by dt seconds (may perform multiple internal ticks).
 */
export class Engine {
  constructor({timestep = 1/60} = {}) {
    this.timestep = timestep;
    this.bodies = [];
    this.accumulator = 0;
    this.listeners = {};
  }

  addBody(body) {
    this.bodies.push(body);
  }

  removeBody(body) {
    this.bodies = this.bodies.filter(b => b !== body);
  }

  on(event, fn) {
    (this.listeners[event] || (this.listeners[event] = [])).push(fn);
  }

  emit(event, data) {
    (this.listeners[event] || []).forEach(fn => fn(data));
  }

  step(dt) {
    this.accumulator += dt;
    
    while (this.accumulator >= this.timestep) {
      this._tick(this.timestep);
      this.accumulator -= this.timestep;
    }
  }

  _tick(dt) {
    for (const b of this.bodies) {
      b.integrate(dt);
    }
    this.emit('tick', { dt });
  }
}
