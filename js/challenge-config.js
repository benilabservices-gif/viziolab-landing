// Seul endroit a modifier pour changer le lien de paiement du challenge.
export const CHARIOW_URL = "https://geekcoding4kids.mychariow.shop/challenge/checkout";

export function isCheckoutConfigured(url = CHARIOW_URL) {
  return /^https:\/\//.test(url);
}
