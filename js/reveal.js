const SAFETY_TIMEOUT_MS = 4000;

export function initReveal() {
  const targets = document.querySelectorAll(".reveal, .rail-segment");
  if (targets.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Le CSS ne cache .reveal que si cette classe est presente : evite qu'un JS
  // qui echoue avant ce point ne laisse du contenu invisible en permanence.
  document.documentElement.classList.add("js-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => observer.observe(el));

  // Filet de securite : si un element n'a jamais declenche l'observer
  // (jank, appareil lent, cas limite), on l'affiche quand meme.
  setTimeout(() => {
    targets.forEach((el) => el.classList.add("is-visible"));
  }, SAFETY_TIMEOUT_MS);
}
