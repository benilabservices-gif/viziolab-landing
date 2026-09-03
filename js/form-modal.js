import { trackEvent } from "./tracking.js";
import { markSignedUp } from "./exit-intent.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initFormModal() {
  const overlay = document.querySelector("[data-form-overlay]");
  const panel = overlay?.querySelector(".modal-panel");
  const form = overlay?.querySelector("[data-signup-form]");
  const errorEl = overlay?.querySelector("[data-form-error]");
  const situationGroup = overlay?.querySelector("[data-situation-group]");
  const situationInput = overlay?.querySelector("[data-situation-value]");

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

  situationGroup?.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => {
      situationGroup.querySelectorAll(".choice-card").forEach((c) => c.setAttribute("aria-pressed", "false"));
      card.setAttribute("aria-pressed", "true");
      if (situationInput) situationInput.value = card.dataset.situation;
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorEl) errorEl.classList.add("hidden");

    const data = new FormData(form);
    const prenom = String(data.get("prenom") || "").trim();
    const email = String(data.get("email") || "").trim();
    const whatsapp = String(data.get("whatsapp") || "").trim();
    const situation = String(data.get("situation") || "").trim();
    const blocage = String(data.get("blocage") || "").trim();

    if (!prenom || !email || !whatsapp || !situation) {
      if (errorEl) {
        errorEl.textContent = "Merci de remplir ton prénom, ton email, ton WhatsApp et de choisir où tu en es.";
        errorEl.classList.remove("hidden");
      }
      return;
    }
    if (!EMAIL_RE.test(email)) {
      if (errorEl) {
        errorEl.textContent = "Cet email ne semble pas valide.";
        errorEl.classList.remove("hidden");
      }
      return;
    }

    const tags = [situation];
    if (blocage) tags.push("ACCOMPAGNEMENT");

    const payload = {
      prenom,
      email,
      whatsapp,
      objectif: String(data.get("objectif") || "").trim(),
      situation,
      blocage,
      tags,
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn?.setAttribute("disabled", "true");

    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("Synchronisation Systeme.io echouee (cote client)", res.status);
      }
    } catch (err) {
      console.error("Impossible de joindre la fonction d'inscription", err);
    }

    trackEvent("Lead", payload);
    trackEvent("CompleteRegistration", payload);
    markSignedUp();

    window.location.href = "/merci.html";
  });
}
