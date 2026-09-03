const API_BASE = "https://api.systeme.io/api";

// Compte Systeme.io en plan gratuit : un seul tag personnalise autorise.
// Toute tentative de creer un tag distinct par situation (EXPLORATION,
// DEMARRAGE...) echoue une fois ce quota atteint, ce qui interrompait la
// synchronisation avant meme d'atteindre le tag suivant - certains contacts se
// retrouvaient donc sans aucun tag. On attache desormais ce tag existant a
// tout le monde, inconditionnellement, quelle que soit la situation choisie.
const CHALLENGE_TAG_ID = 2159157;

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

async function systemeFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.SYSTEME_API_KEY,
      ...options.headers,
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(`Systeme.io API ${res.status} on ${path}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function findOrCreateContact({ email, prenom, whatsapp }) {
  const existing = await systemeFetch(`/contacts?email=${encodeURIComponent(email)}`);
  if (existing?.items?.length > 0) {
    return existing.items[0].id;
  }
  const fields = [];
  if (prenom) fields.push({ slug: "first_name", value: prenom });
  if (whatsapp) fields.push({ slug: "phone_number", value: whatsapp });
  const created = await systemeFetch("/contacts", {
    method: "POST",
    body: JSON.stringify({ email, locale: "fr", fields }),
  });
  return created.id;
}

async function assignTag(contactId, tagId) {
  await systemeFetch(`/contacts/${contactId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tagId }),
  });
}

export async function syncToSysteme({ prenom, email, whatsapp, situation }) {
  const contactId = await findOrCreateContact({ email, prenom, whatsapp });
  await assignTag(contactId, CHALLENGE_TAG_ID);
  return { contactId, tagId: CHALLENGE_TAG_ID, situation };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }
  if (!process.env.SYSTEME_API_KEY) {
    console.error("SYSTEME_API_KEY manquante : variable d'environnement Netlify non configuree.");
    return json(500, { error: "systeme_not_configured" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const { prenom, email, whatsapp, situation } = payload;
  if (!email || !situation) {
    return json(400, { error: "missing_fields" });
  }

  try {
    const result = await syncToSysteme({ prenom, email, whatsapp, situation });
    return json(200, { ok: true, ...result });
  } catch (err) {
    console.error("Synchronisation Systeme.io echouee", err.status, err.data || err.message);
    return json(502, { error: "systeme_sync_failed" });
  }
}
