// Pequeñas utilidades de UI compartidas por los simuladores
export function ensureButton(parent, id, label){
  let btn = document.getElementById(id);
  if (btn) return btn;
  btn = document.createElement('button');
  btn.id = id;
  btn.textContent = label;
  parent.appendChild(btn);
  return btn;
}

export function setButtonLabel(btn, label){ if (btn) btn.textContent = label; }
