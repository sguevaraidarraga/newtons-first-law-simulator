import { computeFriction, computeNetForce, integrate1D } from '../../src/physics.js';
import { drawArrow, drawBall } from '../../src/draw.js';

export default function init1D(){
  const canvas = document.getElementById('sim');
  if (!canvas) return;
  // Arrange layout: support optional slots via data-slot attributes
  (function arrangeLayout(){
    const controls = canvas.nextElementSibling; // expected controls div
    const info = controls ? controls.nextElementSibling : null;
    const slotVisual = document.querySelector('[data-slot="visual"]');
    const slotControls = document.querySelector('[data-slot="controls"]');
    const slotInfo = document.querySelector('[data-slot="info"]');
    if (slotVisual || slotControls || slotInfo) {
      if (slotVisual) slotVisual.appendChild(canvas);
      if (slotControls && controls) slotControls.appendChild(controls);
      if (slotInfo && info) slotInfo.appendChild(info);
      return;
    }
    // fallback: create a simple flex wrapper next to current elements
    const parent = canvas.parentElement;
    if (!parent.classList.contains('sim-wrapper')){
      const wrapper = document.createElement('div');
      wrapper.className = 'sim-wrapper';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'flex-start';
      wrapper.style.gap = '12px';
      parent.insertBefore(wrapper, canvas);
      wrapper.appendChild(canvas);
      if (controls) { controls.style.minWidth = '260px'; wrapper.appendChild(controls); }
      if (info) wrapper.appendChild(info);
    }
  })();
  const ctx = canvas.getContext('2d');
  // ensure canvas visible and sized
  canvas.style.display = 'block';
  canvas.style.maxWidth = '100%';
  // enforce width/height from attributes if present
  const attrW = parseInt(canvas.getAttribute('width')) || canvas.width;
  const attrH = parseInt(canvas.getAttribute('height')) || canvas.height;
  canvas.width = attrW;
  canvas.height = attrH;
  console.log('init1D: canvas', canvas.width, canvas.height);
  const massEl = document.getElementById('mass');
  const velEl = document.getElementById('vel');
  const forceEl = document.getElementById('force');
  const contEl = document.getElementById('continuous');
  const fricEl = document.getElementById('fric');
  const muEl = document.getElementById('mu');
  const impulseBtn = document.getElementById('impulse');
  const startBtn = document.getElementById('start');
  const posSpan = document.getElementById('pos');
  const velSpan = document.getElementById('velDisp');
  const accSpan = document.getElementById('acc');
  const massValEl = document.getElementById('massVal');
  const velValEl = document.getElementById('velVal');
  const forceValEl = document.getElementById('forceVal');
  const muValEl = document.getElementById('muVal');

  let state = { x:2, vx:parseFloat(velEl.value||0), ax:0, mass:parseFloat(massEl.value||1) };
  let running = false; let last = null;

  // initialize displayed values
  if (massValEl) massValEl.textContent = parseFloat(massEl.value).toFixed(1);
  if (velValEl) velValEl.textContent = parseFloat(velEl.value).toFixed(1);
  if (forceValEl) forceValEl.textContent = parseFloat(forceEl.value || 0).toString();
  if (muValEl) muValEl.textContent = parseFloat(muEl.value || 0).toFixed(2);

  // update on input
  massEl.addEventListener('input', ()=>{ state.mass = parseFloat(massEl.value); if (massValEl) massValEl.textContent = parseFloat(massEl.value).toFixed(1); });
  velEl.addEventListener('input', ()=>{ state.vx = parseFloat(velEl.value); if (velValEl) velValEl.textContent = parseFloat(velEl.value).toFixed(1); });
  forceEl.addEventListener('input', ()=>{ if (forceValEl) forceValEl.textContent = parseFloat(forceEl.value).toString(); });
  muEl.addEventListener('input', ()=>{ if (muValEl) muValEl.textContent = parseFloat(muEl.value).toFixed(2); });

  function draw(){
    // debug fill to ensure drawing region
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.0)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    const px = 40 + state.x * 60;
    const py = canvas.height/2;
    drawBall(ctx, px, py, 12);
    drawArrow(ctx, px, py-20, px + state.vx*15, py-20, '#2a9d8f');
    if (contEl.checked && Math.abs(parseFloat(forceEl.value))>0){
      drawArrow(ctx, px, py+20, px + parseFloat(forceEl.value)*0.6, py+20, '#e76f51');
    }
  }

  function step(dt){
    const Fapp = contEl.checked ? parseFloat(forceEl.value) : 0;
    const Ffric = computeFriction(state.mass, state.vx, parseFloat(muEl.value||0), fricEl.checked);
    const Fnet = computeNetForce(Fapp, Ffric);
    integrate1D(state, Fnet, dt);
    const maxX = (canvas.width - 80)/60;
    if (state.x < 0){ state.x = 0; state.vx = 0; }
    if (state.x > maxX){ state.x = maxX; state.vx = 0; }
    posSpan.textContent = state.x.toFixed(2);
    velSpan.textContent = state.vx.toFixed(2);
    accSpan.textContent = state.ax.toFixed(2);
  }

  function loop(ts){ if (!running) return; if (!last) last = ts; const dt = Math.min(0.05, (ts-last)/1000); last = ts; step(dt); draw(); requestAnimationFrame(loop); }

  startBtn.addEventListener('click', ()=>{ running = !running; startBtn.textContent = running? 'Pausar' : 'Iniciar'; if (running){ last=null; requestAnimationFrame(loop); } });
  impulseBtn.addEventListener('click', ()=>{ const J = parseFloat(forceEl.value||0); state.vx += J / state.mass; });
  // already wired above
  draw();
}
