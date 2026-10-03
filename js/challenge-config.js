// Seul endroit a modifier pour changer le lien de paiement du challenge.
// TODO: remplacer par le vrai lien de paiement Chariow du challenge (3 000 FCFA).
export const CHARIOW_URL = "URL_CHARIOW_A_REMPLACER";

export function isCheckoutConfigured(url = CHARIOW_URL) {
  return /^https:\/\//.test(url);
}
