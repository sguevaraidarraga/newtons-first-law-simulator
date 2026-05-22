import { createInclinedPlaneScene } from '../../src/scenes/inclinedPlane/scene.js';

/**
 * Initialize the inclined plane simulator UI and scene bindings.
 *
 * Sets up DOM references, scene creation, controls event handlers, and the animation loop.
 */
export default function initInclinedSimulator(){
  console.log('initInclinedSimulator: initializer running');
  const canvas = document.getElementById('sim');
  if (!canvas) { console.error('initInclinedSimulator: canvas #sim not found'); return; }
  const ctx = canvas.getContext('2d');
  canvas.style.display = 'block';
  canvas.width = parseInt(canvas.getAttribute('width')) || canvas.clientWidth || 800;
  canvas.height = parseInt(canvas.getAttribute('height')) || canvas.clientHeight || 300;

  const angleEl = document.getElementById('angle');
  const massEl = document.getElementById('mass');
  const fricEl = document.getElementById('fric');
  const muEl = document.getElementById('mu');
  const initSEl = document.getElementById('initS');
  const initVEl = document.getElementById('initV');
  const startBtn = document.getElementById('start');
  const resetBtn = document.getElementById('reset');

  console.log('initInclinedSimulator: elements', { angleEl, massEl, fricEl, muEl, initSEl, initVEl, startBtn, resetBtn });
  if (!startBtn) { console.error('initInclinedSimulator: start button not found'); }

  const sDisp = document.getElementById('sDisp');
  const vDisp = document.getElementById('vDisp');
  const aDisp = document.getElementById('aDisp');
  const FnetDisp = document.getElementById('Fnet');
  const angleVal = document.getElementById('angleVal');
  const massVal = document.getElementById('massVal');
  const muVal = document.getElementById('muVal');
  const sVal = document.getElementById('sVal');
  const vVal = document.getElementById('vVal');

  const drawOpts = { originX: 40, originY: 40, scale: 60 };
  const maxS = Math.max(0, (canvas.width - drawOpts.originX - 40) / drawOpts.scale);
  let scene = createInclinedPlaneScene({ angleDeg: parseFloat(angleEl.value||30), mass: parseFloat(massEl.value||1), mu: parseFloat(muEl.value||0.1), initS: parseFloat(initSEl.value||0), initV: parseFloat(initVEl.value||0), maxS });
  if (fricEl) scene.setFrictionEnabled(!!fricEl.checked);
  if (muEl) scene.setMu(parseFloat(muEl.value||0.1));
  let running = false; let last = null;

  /**
   * Update numeric displays in the UI from scene state.
   */
  function updateDisplays(){
    const st = scene.getState();
    sDisp.textContent = st.s.toFixed(2);
    vDisp.textContent = st.v.toFixed(2);
    aDisp.textContent = st.a.toFixed(2);
    FnetDisp.textContent = ((st.a||0) * st.mass).toFixed(2);
  }

  /**
   * Reset the scene to current control values and stop the simulation.
   */
  function reset(){
    running = false; startBtn.textContent = 'Iniciar';
    const newMaxS = Math.max(0, (canvas.width - drawOpts.originX - 40) / drawOpts.scale);
    scene = createInclinedPlaneScene({ angleDeg: parseFloat(angleEl.value||30), mass: parseFloat(massEl.value||1), mu: parseFloat(muEl.value||0.1), initS: parseFloat(initSEl.value||0), initV: parseFloat(initVEl.value||0), maxS: newMaxS });
    updateDisplays(); draw();
  }

  if (angleEl) angleEl.addEventListener('input', ()=>{ angleVal.textContent = angleEl.value; reset(); });
  if (massEl) massEl.addEventListener('input', ()=>{ massVal.textContent = parseFloat(massEl.value).toFixed(1); reset(); });
  if (muEl) muEl.addEventListener('input', ()=>{ muVal.textContent = parseFloat(muEl.value).toFixed(2); reset(); });
  if (initSEl) initSEl.addEventListener('input', ()=>{ sVal.textContent = parseFloat(initSEl.value).toFixed(1); reset(); });
  if (initVEl) initVEl.addEventListener('input', ()=>{ vVal.textContent = parseFloat(initVEl.value).toFixed(1); reset(); });
  if (fricEl) fricEl.addEventListener('change', ()=>{ scene.setFrictionEnabled(!!fricEl.checked); });
  if (muEl) muEl.addEventListener('input', ()=>{ scene.setMu(parseFloat(muEl.value||0)); });

  /**
   * Draw the scene on the canvas using current scene.draw().
   */
  function draw(){
    scene.draw(ctx, { width: canvas.width, height: canvas.height, originX: drawOpts.originX, originY: drawOpts.originY, scale: drawOpts.scale });
  }

  /**
   * Advance the scene by dt seconds and update displays.
   */
  function step(dt){
    scene.body.mass = parseFloat(massEl.value||1);
    scene.body.mass = Math.max(0.0001, scene.body.mass);
    scene.step(dt);
    updateDisplays();
  }

  /**
   * Animation loop callback driven by requestAnimationFrame.
   */
  function loop(ts){
    if (!running) return;
    if (!last) {
      last = ts;
      requestAnimationFrame(loop);
      return;
    }
    const dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    console.log('initInclinedSimulator: loop tick dt=', dt, 'state before step=', scene.getState());
    step(dt);
    draw();
    console.log('initInclinedSimulator: state after step=', scene.getState());
    if (scene.isAtLimit()) {
      console.log('initInclinedSimulator: reached limit, state=', scene.getState());
      running = false; startBtn.textContent = 'Iniciar';
      return;
    }
    requestAnimationFrame(loop);
  }

  if (startBtn) startBtn.addEventListener('click', ()=>{ running = !running; console.log('initInclinedSimulator: start clicked, running=', running); startBtn.textContent = running? 'Pausar' : 'Iniciar'; if (running){ last=null; requestAnimationFrame(loop); } });
  if (resetBtn) resetBtn.addEventListener('click', reset);
  

  try { draw(); updateDisplays(); } catch(err){ console.error('initInclinedSimulator: draw/update failed', err); }
}
if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initInclinedSimulator);
} else {
  initInclinedSimulator();
}