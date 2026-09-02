export function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("flex");
      menu.classList.toggle("hidden");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.add("hidden");
        menu.classList.remove("flex");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  initStickyCta();
}

function initStickyCta() {
  const stickyCta = document.querySelector("[data-sticky-cta]");
  const hero = document.getElementById("hero");
  if (!stickyCta || !hero) return;

  if (!("IntersectionObserver" in window)) {
    stickyCta.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      stickyCta.classList.toggle("is-visible", !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  observer.observe(hero);
}
