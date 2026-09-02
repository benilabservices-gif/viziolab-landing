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

Modale déclenchée par tout élément `[data-open-form]` (`js/form-modal.js`). Champs : prénom, email, WhatsApp, objectif, situation actuelle (choix par cartes), blocage principal (optionnel). La sélection de situation + la présence d'un blocage produisent des tags de segmentation (`EXPLORATION`, `IDEE`, `DEMARRAGE`, `CROISSANCE`, `ACCOMPAGNEMENT`).

À la soumission, le formulaire envoie ces données à `/.netlify/functions/subscribe`, qui synchronise le contact et ses tags dans **Systeme.io** (voir section suivante), en plus des événements de tracking `Lead` / `CompleteRegistration`. Si la synchronisation échoue (clé API manquante, API Systeme.io indisponible), l'inscription est quand même confirmée à l'utilisateur — l'échec est seulement loggé côté fonction (`console.error`, visible dans Netlify → Functions → subscribe → Logs) pour ne jamais faire porter un problème technique à la personne qui s'inscrit. Surveiller ces logs de temps en temps tant que l'intégration est récente.

## Synchronisation Systeme.io

La fonction `netlify/functions/subscribe.js` crée ou retrouve le contact par email (`GET /api/contacts?email=`), puis crée ou retrouve chacun de ses tags par nom (`GET /api/tags?query=`) avant de les lui assigner (`POST /api/contacts/{id}/tags`). Aucune donnée n'est dupliquée si le contact ou le tag existe déjà.

**Mise en place (à faire une seule fois, dans Systeme.io puis dans Netlify — jamais dans ce repo) :**

1. Dans Systeme.io : icône de profil → **Settings** → section **MCP & API keys** → **Create** une clé API publique.
2. Dans Netlify : Site settings → **Environment variables** → ajouter `SYSTEME_API_KEY` avec cette clé. Ne jamais la commiter ni me la communiquer dans la conversation — elle reste uniquement dans Netlify et dans Systeme.io.
3. Redéployer le site (ou déclencher un nouveau build) pour que la fonction reçoive la variable.

**Déclencher la campagne mail (à faire dans Systeme.io, l'API publique ne le permet pas à distance) :**

Dans Systeme.io → **Automations** (ou **Rules**) → créer une règle *"Quand un tag est ajouté"* = `IDEE` (ou `EXPLORATION` / `DEMARRAGE` / `CROISSANCE` / `ACCOMPAGNEMENT` selon le scénario voulu) → action *"Démarrer une campagne"* / *"Inscrire dans un tunnel"*. Une règle par tag si les emails doivent différer selon la situation du participant ; une seule règle sur plusieurs tags si le message est le même pour tous.

**Test en local :** `netlify dev` (nécessite `netlify-cli` : `npm install -g netlify-cli` ou `npx netlify-cli dev`) avec un fichier `.env` à la racine contenant `SYSTEME_API_KEY=...` (fichier ignoré par git). Sans `netlify dev`, `npx serve .` seul ne sert pas les fonctions — la soumission du formulaire échouera silencieusement côté sync (l'inscription reste confirmée, mais rien n'est envoyé à Systeme.io).

**Tests unitaires** (mock du `fetch` externe, sans appeler la vraie API) : `npm test` — couvre la création/réutilisation de contact et de tag, la déduplication des tags, et les codes de retour de la fonction.

## Tracking

`js/tracking.js` expose `trackEvent(name, params)`, défensive (ne plante jamais si aucun pixel n'est installé). Événements déjà posés : `PageView`, `ViewContent`, `CTA_Click` (tous les boutons `[data-open-form]`, avec `label`), `Lead` et `CompleteRegistration` (soumission réussie du formulaire).

Pour activer le tracking réel, décommenter et compléter les blocs GTM / Meta Pixel dans le `<head>` d'`index.html` (identifiants en placeholder : `GTM-XXXXXXX`, `PIXEL_ID_PLACEHOLDER`).

## Déploiement (Netlify)

Même principe que les autres projets de la stack : `netlify.toml` pointe `npm run build` → publish `.`. Premier déploiement : vérifier que `css/output.css` est bien régénéré dans les logs de build.

## À compléter avant mise en ligne

- Coordonnées réelles dans `mentions-legales.html`, `confidentialite.html`, `contact.html` (actuellement `[À COMPLÉTER]`) — raison sociale, RCCM/adresse, email, WhatsApp. Ce sont des informations légales/de contact réelles : je ne les invente pas, il faut me les fournir.
- Section 15 (`#preuves`) assume honnêtement l'absence de témoignages ("pas encore de témoignages ici") plutôt que d'en inventer — à remplacer par une vraie grille de témoignages dès qu'il y en a (captures, citations, vidéos réelles).
- Pixels Meta/TikTok/GA (voir section Tracking ci-dessus) — identifiants réels à fournir.
- Variable d'environnement Netlify `SYSTEME_API_KEY` + règle d'automatisation Systeme.io sur les tags (voir section Synchronisation Systeme.io ci-dessus) — à faire une fois, côté Systeme.io/Netlify.
- URL canonique (`https://viziolab.example/`) à remplacer par le vrai domaine une fois choisi.

Image Open Graph : générée (`/assets/og-image.jpg`, 1200×630, reprend le hero et le mark).

## Tests A/B prioritaires

1. **Headline** — variante retenue ("Arrête de chercher... commence à construire") vs. variante centrée sur le contraste "10 idées → 1 projet" (`COPYWRITING.md`, headline #3). Mesure : taux d'ouverture de la modale depuis le hero.
2. **Libellé du CTA** — "Je rejoins le challenge gratuit" vs. "Je construis mon projet en 3 jours". Mesure : taux de clic (`CTA_Click` par `label`).
3. **Longueur du formulaire** — formulaire actuel (6 champs) vs. version courte (prénom + email + WhatsApp uniquement, situation demandée après coup par WhatsApp). Mesure : taux de complétion (`Lead` / `CTA_Click`), à mettre en regard de la qualité de segmentation obtenue.
4. **Emplacement du formulaire** — modale (actuel) vs. section ancrée juste avant le CTA final. Mesure : taux de complétion et temps jusqu'à conversion.
5. **Densité des CTA** — CTA répétés à chaque section clé (actuel) vs. un unique CTA sticky mobile + hero + final. Mesure : impact sur le scroll depth et le taux de conversion global (un test à mener surtout si le taux de clic sur les CTA intermédiaires s'avère faible en usage réel).
