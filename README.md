# VizioLab Challenge — Landing Page

Landing page statique (HTML/CSS/JS vanilla, Tailwind en build) pour le Challenge VizioLab — 3 jours pour construire son projet digital. Objectif : inscriptions qualifiées au challenge, formulaire de segmentation en modale, ouverture naturelle vers le diagnostic/accompagnement.

Documents de cadrage (stratégie, copywriting, wireframe/UX) : [COPYWRITING.md](COPYWRITING.md) et [WIREFRAME-UX.md](WIREFRAME-UX.md).

## Développement local

    npm install
    npm run watch      # recompile css/output.css à chaque changement
    npx serve .         # sert le dossier en local (requis : les modules JS type="module" ne fonctionnent pas en file://)

## Identité visuelle

Palette et typographie calées sur le logo réel (fond noir, barres diagonales rouge/blanche/blanche/jaune) — voir `tailwind.config.js` (`viz-black`, `viz-card`, `viz-red`, `viz-yellow`, `viz-fog`) et `css/input.css` pour le détail des composants (carte à coin coupé, cordon de progression Jour 1-2-3, boutons, modale, FAQ).

- Display (`font-display`, Archivo Black) : hero, chiffres de jour, CTA final — utilisé avec parcimonie.
- Titres/eyebrows (`font-heading`, Space Grotesk) : H2/H3, badges, nav, boutons.
- Corps (`font-body`, Inter) : paragraphes, FAQ, formulaire.

## Formulaire d'inscription

Modale déclenchée par tout élément `[data-open-form]` (`js/form-modal.js`). Champs : prénom, email, WhatsApp, objectif, situation actuelle (choix par cartes), blocage principal (optionnel). La sélection de situation + la présence d'un blocage produisent des tags de segmentation (`EXPLORATION`, `IDEE`, `DEMARRAGE`, `CROISSANCE`, `ACCOMPAGNEMENT`) envoyés avec les événements `Lead` / `CompleteRegistration`.

Le formulaire ne pousse actuellement les données que dans les événements de tracking (aucun backend branché). L'emplacement pour un envoi réel (webhook Zapier, Google Sheets, CRM) est commenté dans `js/form-modal.js`.

## Tracking

`js/tracking.js` expose `trackEvent(name, params)`, défensive (ne plante jamais si aucun pixel n'est installé). Événements déjà posés : `PageView`, `ViewContent`, `CTA_Click` (tous les boutons `[data-open-form]`, avec `label`), `Lead` et `CompleteRegistration` (soumission réussie du formulaire).

Pour activer le tracking réel, décommenter et compléter les blocs GTM / Meta Pixel dans le `<head>` d'`index.html` (identifiants en placeholder : `GTM-XXXXXXX`, `PIXEL_ID_PLACEHOLDER`).

## Déploiement (Netlify)

Même principe que les autres projets de la stack : `netlify.toml` pointe `npm run build` → publish `.`. Premier déploiement : vérifier que `css/output.css` est bien régénéré dans les logs de build.

## À compléter avant mise en ligne

- Coordonnées réelles dans `mentions-legales.html`, `confidentialite.html`, `contact.html` (actuellement `[À COMPLÉTER]`) — raison sociale, RCCM/adresse, email, WhatsApp. Ce sont des informations légales/de contact réelles : je ne les invente pas, il faut me les fournir.
- Témoignages/preuves réels en section 15 (`#preuves`) — aucun contenu fictif n'a été inséré, à remplacer dès que du contenu réel existe.
- Pixels Meta/TikTok/GA et webhook du formulaire (voir sections Tracking et Formulaire ci-dessus) — identifiants réels à fournir.
- URL canonique (`https://viziolab.example/`) à remplacer par le vrai domaine une fois choisi.

Image Open Graph : générée (`/assets/og-image.jpg`, 1200×630, reprend le hero et le mark).

## Tests A/B prioritaires

1. **Headline** — variante retenue ("Arrête de chercher... commence à construire") vs. variante centrée sur le contraste "10 idées → 1 projet" (`COPYWRITING.md`, headline #3). Mesure : taux d'ouverture de la modale depuis le hero.
2. **Libellé du CTA** — "Je rejoins le challenge gratuit" vs. "Je construis mon projet en 3 jours". Mesure : taux de clic (`CTA_Click` par `label`).
3. **Longueur du formulaire** — formulaire actuel (6 champs) vs. version courte (prénom + email + WhatsApp uniquement, situation demandée après coup par WhatsApp). Mesure : taux de complétion (`Lead` / `CTA_Click`), à mettre en regard de la qualité de segmentation obtenue.
4. **Emplacement du formulaire** — modale (actuel) vs. section ancrée juste avant le CTA final. Mesure : taux de complétion et temps jusqu'à conversion.
5. **Densité des CTA** — CTA répétés à chaque section clé (actuel) vs. un unique CTA sticky mobile + hero + final. Mesure : impact sur le scroll depth et le taux de conversion global (un test à mener surtout si le taux de clic sur les CTA intermédiaires s'avère faible en usage réel).
