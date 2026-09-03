# VIZIO LAB 360 — Wireframe + UX/UI (ÉTAPE 3)

## A. IDENTITÉ VISUELLE — héritée de la page Challenge, assumée

Même marque, même parcours pour le visiteur (Challenge → cette page) : la continuité visuelle est un argument de confiance en soi, pas une contrainte. On reprend donc à l'identique :

- **Palette** : `viz-black` #0B0B0C, `viz-card` #16161A, `viz-red` #E8332A (tension/urgence), `viz-yellow` #F4E409 (résultat/CTA), `viz-fog` #8C8C94, blanc.
- **Typographie** : Archivo Black (display, restreint), Space Grotesk (titres/eyebrows), Inter (corps).
- **Motif signature** : barres diagonales du mark en filigrane, cartes à coin coupé avec languette de couleur, cordon de progression (déjà vu sur Jour 1-2-3 du Challenge, réutilisé ici pour Mois 1-2-3 — le visiteur reconnaît le langage visuel).

**Ce qui change pour signaler "offre premium" sans rompre la marque :**
- Espacements verticaux plus généreux entre sections (une page d'offre payante respire plus qu'une page de challenge gratuit).
- Le rouge est utilisé un peu plus qu'sur la page Challenge — cette page a une vraie urgence (date, places), le rouge peut donc porter cette tension réelle sans être un pattern manipulateur.
- Une carte prix plus imposante et plus contrastée (noir/jaune) qu'aucun élément de la page Challenge — c'est le point de conversion unique de cette page, il doit dominer visuellement à son moment.

## B. WIREFRAME TEXTUEL (mobile-first)

```
[NAV] identique à la page Challenge (mark + wordmark, liens "Programme / Monétisation / FAQ", CTA "Rejoindre")

[HERO]
  amorce courte (gris, au-dessus du H1)
  H1 deux tons : "MAÎTRISE LA VIDÉO IA." (blanc) / "TRANSFORME CETTE COMPÉTENCE EN REVENUS." (jaune)
  sous-titre (texte court du brief)
  CTA jaune "JE VEUX MAÎTRISER LA VIDÉO IA" + lien texte secondaire "Découvrir le programme" (scroll vers section 5)
  → fond : motif barres, plus discret que sur le Challenge (page plus "sérieuse")

[LE MOMENT EST MAINTENANT]
  frise horizontale scrollable mobile : Vidéo traditionnelle → ... → Nouveaux métiers (5 étapes, connecteur fin)
  message de clôture en encart

[PROBLÈME DU SELF-LEARNING]
  titre + liste compacte (50 outils / 100 tutoriels / aucune méthode / ...) — cartes fines, pas de gros blocs
  transition centrée jaune : "VizioLab transforme ce chaos en parcours."

["TU N'ACHÈTES PAS UNE FORMATION"]
  titre fort
  chaîne verticale à 7 maillons (APPRENDRE → ... → DÉVELOPPER), connecteur dégradé rouge→blanc→jaune (écho du rail Jour1-2-3)

[CE QUE TU VAS APPRENDRE — 9 BLOCS]
  accordéon ou grille de 9 cartes compactes (titre + 3-4 mots-clés), pas le détail complet en direct — évite une page interminable ; un clic déplie le détail
  (alternative desktop : grille 3×3)

[CE QUE TU VAS CONSTRUIRE]
  liste à checkmarks jaunes, 2 colonnes desktop / 1 mobile
  message : "De la première vidéo à la première opportunité commerciale."

[7 VOIES DE MONÉTISATION]
  grille de 7 cartes à coin coupé, icône + nom + une phrase, snap-scroll horizontal sur mobile
  message centré : "Une compétence. Plusieurs modèles de revenus."

[POURQUOI L'ACCOMPAGNEMENT]
  question en titre + liste des points de friction du self-learning
  encart de clôture (bordure jaune)

[POURQUOI VIZIO LAB 360]
  6 items (Focus/Pratique/Accompagnement/Business/Workflow/Évolution) — grille 2×3 desktop, empilé mobile

[PARCOURS DES 3 MOIS]
  réutilise exactement le pattern visuel Jour1/2/3 du Challenge (chiffre outline + rail coloré + carte), pour Mois 1/2/3
  chaque carte : objectif + liste de résultats

[L'ACCOMPAGNEMENT]
  carte unique, liste des 5 inclusions (sessions live, communauté, feedback, ressources, suivi)

[POUR QUI / PAS POUR QUI]
  2 colonnes, identique au pattern de la page Challenge (cohérence de lecture)

[CALCUL DE VALEUR]
  bloc texte centré, pas de tableau de "fausses économies" chiffrées — rester qualitatif comme prévu dans le copy

[PRIX] — point de conversion principal
  carte pleine largeur, fond noir/jaune fort, coin coupé
  150 000 FCFA barré-non, présenté clairement : "150 000 FCFA en 1 fois — ou 3 × 50 000 FCFA"
  badge garantie "Satisfaction 14 jours" juste sous le prix
  CTA jaune large "JE REJOINS VIZIO LAB 360"
  bandeau urgence juste en dessous (rouge, texte blanc) : "15-20 places • Inscriptions jusqu'au 20 septembre"

[PREUVES SOCIALES]
  même traitement honnête que la page Challenge : pas de fausses preuves, structure prête à recevoir du contenu réel

[FAQ]
  accordéon identique au composant existant

[OBJECTIONS]
  "Mais j'ai encore des doutes..." — accordéon ou liste de cartes question/réponse courtes

[CTA FINAL]
  plein écran, motif barres plus visible (climax visuel, comme sur le Challenge)
  texte de clôture émotionnel du brief
  CTA "JE VEUX REJOINDRE VIZIO LAB 360"
  rappel urgence en micro-copy

[FOOTER]
  identique au reste du site (mark, liens légaux, copyright)

[STICKY CTA MOBILE]
  apparaît après le hero, texte "Rejoindre VIZIO LAB 360" + prix en petit, disparaît sur la section Prix et le CTA final
```

## C. COMPOSANTS RÉUTILISÉS TELS QUELS (pas de nouveau système à construire)

- `.viz-card`, `.viz-card--red`, `.viz-card--yellow` (coin coupé + languette)
- `.btn-primary` / `.btn-secondary`
- `.eyebrow`, `.badge-live`
- `.faq-trigger` / `.faq-panel` (accordéon)
- `.rail-segment` (cordon de progression) — réutilisé pour Mois 1/2/3
- `.reveal` (animation au scroll)
- `.sticky-cta`
- La modale de formulaire n'est **pas** réutilisée telle quelle ici : cette page vend un achat, pas une inscription gratuite. Le CTA principal doit soit ouvrir un lien de paiement direct (Stripe/CinetPay/Wave selon le prestataire retenu — `[À CONFIRMER]`), soit une modale de pré-qualification suivie d'un lien de paiement. À trancher avant l'étape 4.

## D. NOUVEAU COMPOSANT À CRÉER

**Bandeau d'urgence** (rouge, texte blanc, sous la carte prix et éventuellement sticky en haut de page après un certain scroll) : seul élément visuellement nouveau, car aucune page existante n'avait de vraie urgence chiffrée jusqu'ici.

---

Une décision à prendre avant l'étape 4 (code) : **comment se fait le paiement concrètement ?** Lien vers un prestataire (Stripe/CinetPay/Wave/PayPal), ou formulaire de contact WhatsApp qui débouche sur un paiement géré manuellement ? Ça change directement ce que fait le bouton "JE REJOINS VIZIO LAB 360".
