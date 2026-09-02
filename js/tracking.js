export function trackEvent(name, params = {}, globals = typeof window !== "undefined" ? window : {}) {
  if (Array.isArray(globals.dataLayer)) {
    globals.dataLayer.push({ event: name, ...params });
  }
  if (typeof globals.fbq === "function") {
    globals.fbq("trackCustom", name, params);
  }
  if (globals.ttq && typeof globals.ttq.track === "function") {
    globals.ttq.track(name, params);
  }
}
