const SESSION_KEY = "viz_exit_intent_shown";
const SIGNED_UP_KEY = "viz_signed_up";
const MIN_DELAY_MS = 8000;

function safeGet(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    /* stockage indisponible (navigation privee, quota...) : on ignore silencieusement */
  }
}

export function initExitIntent() {
  const overlay = document.querySelector("[data-form-overlay]");
  if (!overlay) return;

  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return; // pas de souris = pas d'exit-intent
  if (safeGet(sessionStorage, SESSION_KEY)) return;
  if (safeGet(localStorage, SIGNED_UP_KEY)) return;

  const pageLoadedAt = Date.now();

  function isModalOpen() {
    return !overlay.classList.contains("hidden");
  }

  function handleMouseLeave(e) {
    if (e.clientY > 0) return; // ne se declenche que quand la souris part vers le haut (fermeture/onglet)
    if (Date.now() - pageLoadedAt < MIN_DELAY_MS) return;
    if (isModalOpen()) return;

    safeSet(sessionStorage, SESSION_KEY, "1");
    document.removeEventListener("mouseleave", handleMouseLeave);

    const trigger = document.querySelector("[data-open-form]");
    trigger?.click();
  }

  document.addEventListener("mouseleave", handleMouseLeave);
}

export function markSignedUp() {
  safeSet(localStorage, SIGNED_UP_KEY, "1");
}
