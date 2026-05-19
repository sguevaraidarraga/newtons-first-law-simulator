import { integrate2D } from '../../src/physics.js';
import { drawArrow, drawBall } from '../../src/draw.js';

export default function init2D(){
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
  canvas.style.display = 'block';
  canvas.style.maxWidth = '100%';
  const attrW = parseInt(canvas.getAttribute('width')) || canvas.width;
  const attrH = parseInt(canvas.getAttribute('height')) || canvas.height;
  canvas.width = attrW;
  canvas.height = attrH;
  console.log('init2D: canvas', canvas.width, canvas.height);
  const massEl = document.getElementById('mass');
  const fxEl = document.getElementById('fx');
  const fyEl = document.getElementById('fy');
  const velxInitEl = document.getElementById('velxInit');
  const velyInitEl = document.getElementById('velyInit');
  const contEl = document.getElementById('continuous');
  const fricEl = document.getElementById('fric');
  const muEl = document.getElementById('mu');
  const impulseBtn = document.getElementById('impulse');
  const startBtn = document.getElementById('start');
  const posx = document.getElementById('posx');
  const posy = document.getElementById('posy');
  const velx = document.getElementById('velx');
  const vely = document.getElementById('vely');
  const fxVal = document.getElementById('fxVal');
  const fyVal = document.getElementById('fyVal');
  const massVal = document.getElementById('massVal');
  const muVal = document.getElementById('muVal');
  const velxInitVal = document.getElementById('velxInitVal');
  const velyInitVal = document.getElementById('velyInitVal');

  let state = { x: canvas.width/120, y: canvas.height/120, vx:0, vy:0, ax:0, ay:0, mass:parseFloat(massEl.value||1) };
  let running=false, last=null, impulseMode=false;

  // initialize displayed values
  if (fxVal) fxVal.textContent = fxEl.value;
  if (fyVal) fyVal.textContent = fyEl.value;
  if (massVal) massVal.textContent = parseFloat(massEl.value).toFixed(1);
  if (muVal) muVal.textContent = parseFloat(muEl.value||0).toFixed(2);
  if (velxInitVal) velxInitVal.textContent = parseFloat(velxInitEl?.value||0).toFixed(1);
  if (velyInitVal) velyInitVal.textContent = parseFloat(velyInitEl?.value||0).toFixed(1);

  // inputs
  fxEl.addEventListener('input', ()=>{ if (fxVal) fxVal.textContent = fxEl.value; });
  fyEl.addEventListener('input', ()=>{ if (fyVal) fyVal.textContent = fyEl.value; });
  massEl.addEventListener('input', ()=>{ state.mass = parseFloat(massEl.value); if (massVal) massVal.textContent = parseFloat(massEl.value).toFixed(1); });
  muEl.addEventListener('input', ()=>{ if (muVal) muVal.textContent = parseFloat(muEl.value).toFixed(2); });
  velxInitEl?.addEventListener('input', ()=>{ state.vx = parseFloat(velxInitEl.value); if (velxInitVal) velxInitVal.textContent = parseFloat(velxInitEl.value).toFixed(1); });
  velyInitEl?.addEventListener('input', ()=>{ state.vy = parseFloat(velyInitEl.value); if (velyInitVal) velyInitVal.textContent = parseFloat(velyInitEl.value).toFixed(1); });

  canvas.addEventListener('click', (e)=>{
    if (!impulseMode) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left; const cy = e.clientY - rect.top;
    const objPx = state.x * 60 + 40; const objPy = state.y * 60 + 40;
    const Jx = (cx - objPx) * 0.05; const Jy = (cy - objPy) * 0.05;
    state.vx += Jx / state.mass; state.vy += Jy / state.mass;
  });

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.0)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    const px = state.x * 60 + 40; const py = state.y * 60 + 40;
    drawBall(ctx, px, py, 10);
    drawArrow(ctx, px, py, px + state.vx*12, py + state.vy*12, '#2a9d8f');
    if (contEl.checked && (Math.abs(parseFloat(fxEl.value))>0 || Math.abs(parseFloat(fyEl.value))>0)){
      drawArrow(ctx, px, py, px + parseFloat(fxEl.value)*0.6, py + parseFloat(fyEl.value)*0.6, '#e76f51');
    }
  }

  function step(dt){
    const Fx = contEl.checked ? parseFloat(fxEl.value) : 0;
    const Fy = contEl.checked ? parseFloat(fyEl.value) : 0;
    let FfricX = 0, FfricY = 0;
    if (fricEl.checked){
      const magV = Math.hypot(state.vx, state.vy);
      if (magV > 1e-3){
        const fmag = -parseFloat(muEl.value||0) * state.mass * 9.81;
        FfricX = fmag * (state.vx / magV);
        FfricY = fmag * (state.vy / magV);
      }
    }
    const FxNet = Fx + FfricX; const FyNet = Fy + FfricY;
    integrate2D(state, FxNet, FyNet, dt);
    const maxX = (canvas.width - 80)/60; const maxY = (canvas.height - 80)/60;
    if (state.x < 0){ state.x = 0; state.vx = 0; }
    if (state.y < 0){ state.y = 0; state.vy = 0; }
    if (state.x > maxX){ state.x = maxX; state.vx = 0; }
    if (state.y > maxY){ state.y = maxY; state.vy = 0; }
    posx.textContent = state.x.toFixed(2); posy.textContent = state.y.toFixed(2);
    velx.textContent = state.vx.toFixed(2); vely.textContent = state.vy.toFixed(2);
  }

  function loop(ts){ if (!running) return; if (!last) last = ts; const dt = Math.min(0.05, (ts-last)/1000); last = ts; step(dt); draw(); requestAnimationFrame(loop); }

  startBtn.addEventListener('click', ()=>{ running = !running; startBtn.textContent = running? 'Pausar' : 'Iniciar'; if (running){ last=null; requestAnimationFrame(loop); } });
  impulseBtn.addEventListener('click', ()=>{ impulseMode = !impulseMode; impulseBtn.textContent = impulseMode? 'Impulso: clic para aplicar' : 'Impulso (clic en lienzo)'; });
  massEl.addEventListener('input', ()=> state.mass = parseFloat(massEl.value));
  draw();
}
