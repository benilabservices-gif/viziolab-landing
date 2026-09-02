import { trackEvent } from "./tracking.js";
import { initReveal } from "./reveal.js";
import { initNav } from "./nav.js";
import { initFaq } from "./faq.js";
import { initFormModal } from "./form-modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initNav();
  initReveal();
  initFaq();
  initFormModal();

  trackEvent("PageView");
  trackEvent("ViewContent", { page: "viziolab_challenge_landing" });
});
