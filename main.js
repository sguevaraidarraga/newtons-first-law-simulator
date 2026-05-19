// main.js now loads a per-simulator app module dynamically based on DOM
function showError(message, err){
  console.error(message, err);
  const el = document.createElement('div');
  el.style.position = 'fixed'; el.style.left = '8px'; el.style.bottom = '8px'; el.style.padding = '8px 12px';
  el.style.background = 'rgba(220,50,50,0.95)'; el.style.color = '#fff'; el.style.zIndex = 9999; el.style.fontFamily='monospace';
  el.textContent = message + (err? (': ' + (err.message||err)) : '');
  document.body.appendChild(el);
}

async function loadApp(){
  try{
    if (location.protocol === 'file:'){
      showError('Abre las páginas mediante un servidor local (ej. python -m http.server)');
      return;
    }
    // Decide by presence of known controls
    if (document.getElementById('vel')){
      const mod = await import('./simulators/1d/app.js');
      mod.default();
    } else if (document.getElementById('fx')){
      const mod = await import('./simulators/2d/app.js');
      mod.default();
    } else {
      // no sim controls on page
    }
  } catch(err){ showError('Error cargando el simulador', err); }
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', loadApp);
} else {
  loadApp();
}

export { loadApp };
