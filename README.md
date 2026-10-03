# VizioLab Challenge — Landing Page

Landing page statique (HTML/CSS/JS vanilla, Tailwind en build) du Viziolab Challenge — 3 jours pour apprendre à créer des vidéos avec l'IA (édition des 13, 14 et 15 octobre, participation 3 000 FCFA payée sur Chariow).

Documents de cadrage (stratégie, copywriting, wireframe/UX) : [COPYWRITING.md](COPYWRITING.md) et [WIREFRAME-UX.md](WIREFRAME-UX.md).

## Page de vente VIZIO LAB 360

`vizio-lab-360.html` est la page de vente de l'offre payante présentée à l'issue du Challenge (3 mois, 150 000 FCFA ou 3×50 000 FCFA). Cadrage complet : [VIZIOLAB360-STRATEGIE.md](VIZIOLAB360-STRATEGIE.md), [VIZIOLAB360-COPYWRITING.md](VIZIOLAB360-COPYWRITING.md), [VIZIOLAB360-WIREFRAME-UX.md](VIZIOLAB360-WIREFRAME-UX.md).

Tous les CTA (`[data-chariow-link]`) pointent vers un placeholder défini dans `js/vizio360-main.js` (constante `CHARIOW_URL`) — à remplacer par le vrai lien de paiement Chariow dès qu'il est communiqué. Un seul endroit à modifier pour que tous les boutons de la page se mettent à jour.

## Développement local

    npm install
    npm run watch      # recompile css/output.css à chaque changement
    npx serve .         # sert le dossier en local (requis : les modules JS type="module" ne fonctionnent pas en file://)

## Identité visuelle

Palette et typographie calées sur le logo réel (fond noir, barres diagonales rouge/blanche/blanche/jaune) — voir `tailwind.config.js` (`viz-black`, `viz-card`, `viz-red`, `viz-yellow`, `viz-fog`) et `css/input.css` pour le détail des composants (carte à coin coupé, cordon de progression Jour 1-2-3, boutons, modale, FAQ).

- Display (`font-display`, Archivo Black) : hero, chiffres de jour, CTA final — utilisé avec parcimonie.
- Titres/eyebrows (`font-heading`, Space Grotesk) : H2/H3, badges, nav, boutons.
- Corps (`font-body`, Inter) : paragraphes, FAQ, formulaire.

## Inscription et paiement (challenge payant, 3 000 FCFA)

Tout bouton `[data-open-form]` ouvre une modale (`js/form-modal.js`) qui demande prénom, email et WhatsApp. À la soumission :

1. le contact est envoyé à `/.netlify/functions/subscribe`, qui le crée ou le retrouve dans **Systeme.io** et lui attache le tag fixe (voir section suivante) ;
2. le visiteur est redirigé vers la **page de paiement Chariow** du challenge.

Le lien Chariow est défini à un seul endroit : la constante `CHARIOW_URL` dans `js/challenge-config.js`. Tant qu'elle contient le placeholder `URL_CHARIOW_A_REMPLACER`, le formulaire affiche un message « paiement pas encore ouvert » au lieu de rediriger.

Un échec de synchronisation Systeme.io ne bloque jamais le paiement (Chariow recueille de toute façon les coordonnées de l'acheteur) : il est seulement loggé (Netlify → Functions → subscribe → Logs).

L'accès au **groupe WhatsApp privé** est remis par Chariow après paiement. Son lien ne doit jamais apparaître dans une page publique du site. `merci.html` peut servir de page de retour après paiement (URL de redirection à configurer dans Chariow) : rappel des dates, des bons réflexes email et de l'accès au groupe via la confirmation Chariow.

Tracking : `CTA_Click` (avec `label`), `Lead` puis `InitiateCheckout` (3 000 XOF) à la soumission. Aucune donnée personnelle (email, WhatsApp) n'est transmise aux pixels.

**Tag unique (contrainte du plan gratuit Systeme.io)** : le compte n'autorise qu'un seul tag personnalisé. Chaque contact reçoit le tag existant `IDEE` (id `2159157`, constante `CHALLENGE_TAG_ID` dans `netlify/functions/subscribe.js`). C'est ce tag que cible la règle d'automatisation qui déclenche la campagne email : son contenu doit correspondre à l'édition en cours.

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

Image Open Graph : générée (`/assets/og-image.jpg`, 1200×630, reprend le hero et le mark).

## Domaine personnalisé

Domaine cible : **vizio-lab.online**. Le code référence déjà ce domaine (URL canonique, Open Graph). Côté Netlify :

1. Site → **Domain management** → **Add a domain** → saisir `vizio-lab.online`
2. Netlify indique alors si le domaine est déjà géré par lui (achat via Netlify) ou externe :
   - **Domaine acheté ailleurs** (Namecheap, OVH, GoDaddy, etc.) : Netlify donne soit un enregistrement `A`/`ALIAS` (pour la racine `vizio-lab.online`) et un `CNAME` (pour `www`) à ajouter chez le registrar, soit propose de déléguer la gestion DNS complète à Netlify (plus simple si tu n'as pas déjà d'autres services sur ce domaine).
   - Le certificat HTTPS (Let's Encrypt) se met en place automatiquement une fois le DNS propagé (quelques minutes à quelques heures).
3. Une fois actif, définir `vizio-lab.online` comme **domaine principal** dans Netlify pour que `viziolab.netlify.app` redirige automatiquement dessus.

## Tests A/B prioritaires

1. **Headline** — variante retenue ("Arrête de chercher... commence à construire") vs. variante centrée sur le contraste "10 idées → 1 projet" (`COPYWRITING.md`, headline #3). Mesure : taux d'ouverture de la modale depuis le hero.
2. **Libellé du CTA** — "Je rejoins le challenge gratuit" vs. "Je construis mon projet en 3 jours". Mesure : taux de clic (`CTA_Click` par `label`).
3. **Longueur du formulaire** — formulaire actuel (6 champs) vs. version courte (prénom + email + WhatsApp uniquement, situation demandée après coup par WhatsApp). Mesure : taux de complétion (`Lead` / `CTA_Click`), à mettre en regard de la qualité de segmentation obtenue.
4. **Emplacement du formulaire** — modale (actuel) vs. section ancrée juste avant le CTA final. Mesure : taux de complétion et temps jusqu'à conversion.
5. **Densité des CTA** — CTA répétés à chaque section clé (actuel) vs. un unique CTA sticky mobile + hero + final. Mesure : impact sur le scroll depth et le taux de conversion global (un test à mener surtout si le taux de clic sur les CTA intermédiaires s'avère faible en usage réel).
