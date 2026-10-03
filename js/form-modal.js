import { trackEvent } from "./tracking.js";
import { CHARIOW_URL, isCheckoutConfigured } from "./challenge-config.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initFormModal() {
  const overlay = document.querySelector("[data-form-overlay]");
  const panel = overlay?.querySelector(".modal-panel");
  const form = overlay?.querySelector("[data-signup-form]");
  const errorEl = overlay?.querySelector("[data-form-error]");

  if (!overlay || !panel || !form) return;

  let lastFocusedEl = null;

  function getFocusableElements() {
    return Array.from(
      panel.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);
  }

  function openModal() {
    lastFocusedEl = document.activeElement;
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);
    const firstField = form.querySelector("#prenom");
    firstField?.focus();
  }

  function closeModal() {
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeydown);
    if (lastFocusedEl instanceof HTMLElement) lastFocusedEl.focus();
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key === "Tab") {
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  document.querySelectorAll("[data-open-form]").forEach((btn) => {
    btn.addEventListener("click", () => {
      trackEvent("CTA_Click", { label: btn.dataset.trackLabel || "unknown" });
      openModal();
    });
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  overlay.querySelector("[data-close-form]")?.addEventListener("click", closeModal);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorEl) errorEl.classList.add("hidden");

    const data = new FormData(form);
    const prenom = String(data.get("prenom") || "").trim();
    const email = String(data.get("email") || "").trim();
    const whatsapp = String(data.get("whatsapp") || "").trim();

    if (!prenom || !email || !whatsapp) {
      showError("Merci de renseigner votre prénom, votre email et votre WhatsApp.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      showError("Cet email ne semble pas valide.");
      return;
    }
    if (!isCheckoutConfigured()) {
      console.error("Lien de paiement Chariow non configure (js/challenge-config.js).");
      showError("Le paiement n'est pas encore ouvert. Réessayez un peu plus tard ou écrivez-nous à labs@benilab.co.");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn?.setAttribute("disabled", "true");

    // Un echec de synchronisation Systeme.io ne doit jamais bloquer le paiement :
    // Chariow recueille de toute facon les coordonnees de l'acheteur.
    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, email, whatsapp }),
      });
      if (!res.ok) {
        console.error("Synchronisation Systeme.io echouee (cote client)", res.status);
      }
    } catch (err) {
      console.error("Impossible de joindre la fonction d'inscription", err);
    }

    // Aucune donnee personnelle (email, WhatsApp) n'est transmise aux outils de tracking.
    trackEvent("Lead", { page: "viziolab_challenge_landing" });
    trackEvent("InitiateCheckout", { value: 3000, currency: "XOF" });

    window.location.href = CHARIOW_URL;
  });
}
