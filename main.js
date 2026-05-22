/**
 * Show an error overlay with a message and optional error details.
 *
 * Args:
 *   message (string): Message to display.
 *   err (Error|any): Optional error object for logging.
 */
function showError(message, err){
  console.error(message, err);
  const el = document.createElement('div');
  el.style.position = 'fixed'; el.style.left = '8px'; el.style.bottom = '8px'; el.style.padding = '8px 12px';
  el.style.background = 'rgba(220,50,50,0.95)'; el.style.color = '#fff'; el.style.zIndex = 9999; el.style.fontFamily='monospace';
  el.textContent = message + (err? (': ' + (err.message||err)) : '');
  document.body.appendChild(el);
}

/**
 * Load the appropriate simulator app module depending on DOM controls present.
 *
 * Behavior: imports and runs the default export of the detected simulator module.
 */
async function loadApp(){
  try{
    if (location.protocol === 'file:'){
      showError('Abre las páginas mediante un servidor local (ej. python -m http.server)');
      return;
    }
    if (document.getElementById('vel')){
      const mod = await import('./simulators/first-law/1d/app.js');
      mod.default();
    } else if (document.getElementById('fx')){
      const mod = await import('./simulators/first-law/2d/app.js');
      mod.default();
    } else if (document.getElementById('angle')){
      const mod = await import('./simulators/second-law/app.js');
      mod.default();
    } else {
    }
  } catch(err){ showError('Error cargando el simulador', err); }
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', loadApp);
} else {
  loadApp();
}

export { loadApp };
