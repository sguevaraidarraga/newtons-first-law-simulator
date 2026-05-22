/**
 * Ensure a button with the given id exists in the document; create and append it to `parent` if missing.
 *
 * Args:
 *   parent (Element): DOM parent to append to if the button is created.
 *   id (string): The id attribute for the button.
 *   label (string): Text content to set when creating the button.
 *
 * Returns:
 *   HTMLButtonElement
 */
export function ensureButton(parent, id, label){
  let btn = document.getElementById(id);
  if (btn) return btn;
  btn = document.createElement('button');
  btn.id = id;
  btn.textContent = label;
  parent.appendChild(btn);
  return btn;
}

/**
 * Set button label text if the button exists.
 *
 * Args:
 *   btn (HTMLElement|null): Button element or null.
 *   label (string): Text to set.
 *
 * Returns:
 *   void
 */
export function setButtonLabel(btn, label){ if (btn) btn.textContent = label; }
