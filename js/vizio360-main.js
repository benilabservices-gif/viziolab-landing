import { trackEvent } from "./tracking.js";
import { initReveal } from "./reveal.js";
import { initNav } from "./nav.js";
import { initFaq } from "./faq.js";

// TODO: remplacer par le vrai lien de paiement Chariow une fois communique.
const CHARIOW_URL = "URL_CHARIOW_A_REMPLACER";

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initNav();
  initReveal();
  initFaq();

  document.querySelectorAll("[data-chariow-link]").forEach((el) => {
    el.href = CHARIOW_URL;
    el.addEventListener("click", () => {
      const label = el.dataset.trackLabel || "unknown";
      trackEvent("CTA_Click", { label });
      trackEvent("checkout_start", { label });
    });
  });

  trackEvent("PageView");
  trackEvent("ViewContent", { page: "viziolab360_sales" });
});
