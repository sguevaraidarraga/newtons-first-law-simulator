import { createInclinedPlaneScene } from '../scenes/inclinedPlane/scene.js';

export default function initInclinedDemo(){
  const canvas = document.getElementById('inclinedSim');
  if (!canvas) return console.warn('No canvas with id "inclinedSim" found.');
  const ctx = canvas.getContext('2d');
  canvas.style.display = 'block';
  canvas.width = parseInt(canvas.getAttribute('width')) || canvas.clientWidth || 600;
  canvas.height = parseInt(canvas.getAttribute('height')) || canvas.clientHeight || 300;

  const scene = createInclinedPlaneScene({ angleDeg: 30, mass: 1, mu: 0.2, initS: 0, initV: 0 });

  let last = null;
  function loop(ts){
    if (!last) last = ts;
    const dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    scene.step(dt);
    scene.draw(ctx, { width: canvas.width, height: canvas.height, originX: 40, originY: 40, scale: 60 });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
