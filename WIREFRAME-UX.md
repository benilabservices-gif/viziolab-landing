# VizioLab Challenge — Wireframe + UX/UI (ÉTAPE 3)

Identité recalée sur le logo réel (fond noir, barres diagonales rouge / blanc / blanc / jaune) — remplace la charte "bleu VizioLab" prévue par défaut dans le brief initial, qui ne correspond pas au logo fourni. Structure de page (long-scroll unique, CTA répétés, section récap façon "offre") inspirée de la capture de référence.

---

## A. IDENTITÉ VISUELLE

### Palette

| Rôle | Couleur | Usage |
|---|---|---|
| Fond principal | `#0B0B0C` (noir quasi pur) | Fond de toutes les sections |
| Fond carte | `#151517` | Cards, formulaire, accordéon FAQ |
| Rouge signature | `#E8332A` | Tension / "avant" / listes problème / accents secondaires |
| Jaune signature | `#F4E409` | Résultat / "après" / CTA principal / highlights |
| Blanc | `#FFFFFF` | Texte principal, structure, icônes par défaut |
| Gris texte | `#A0A0A6` | Texte secondaire, sous-copy |
| Bordures | `rgba(255,255,255,.08)` | Contours de cartes (style "glass" sombre) |

**Règle d'usage** : rouge et jaune restent des accents ponctuels (CTA, badges, puces, connecteurs), jamais des aplats larges — le noir et le blanc portent la structure, comme dans le logo.

### Typographie

- **Titres / headlines** : `Space Grotesk` (700/800), majuscules pour les gros titres — géométrique, bold, proche de l'esprit du wordmark VIZIOLAB.
- **Corps de texte** : `Inter` (400/500) — lisibilité mobile maximale.
- Empilement Google Fonts, chargées en `font-display: swap`.

### Motif graphique original — "la trace VizioLab"

Le mark du logo (4 barres diagonales à 135°, rouge → blanc → blanc → jaune, ascendantes) devient un **motif récurrent** plutôt qu'un logo isolé :

1. **Hero** — le motif est agrandi, flouté, en fond semi-transparent derrière le headline (glow animé lent, comme le fond du hero déjà réalisé sur le projet DigitalStartGo) → donne immédiatement une identité de marque forte dès le premier écran.
2. **Séparateurs de section** — au lieu d'un simple `<hr>`, un fin trait diagonal dégradé rouge→jaune de 3px marque chaque transition de section majeure.
3. **Connecteur Jour 1 → Jour 2 → Jour 3** — la ligne de progression entre les 3 étapes reprend le dégradé rouge (tension) → blanc (transition) → jaune (résultat), rendant la transformation *visible*, pas seulement écrite.
4. **Badges de carte** — les cartes "problème" ont un coin biseauté rouge à 135° (écho des barres), les cartes "livrable/résultat" un coin biseauté jaune.
5. **CTA principal** — fond jaune plein, texte noir bold, angle de coin légèrement coupé (4px à 135°) plutôt que purement arrondi → seul élément anguleux qui rappelle le logo au milieu d'une UI très arrondie.

Ce motif est ce qui rend la page "originale" plutôt qu'un template sombre générique : le rouge/jaune/noir n'est pas une simple palette, il raconte la transformation avant/après (rouge = confusion, jaune = clarté) à chaque endroit où il apparaît.

### Composants

- **Cards** : `#151517`, radius 20px (sauf coin biseauté signature), bordure 1px translucide, ombre douce ; au hover/tap, léger glow rouge ou jaune selon le type de carte.
- **Badges** (ex. "🔥 CHALLENGE GRATUIT") : pilule noire, bordure jaune 1px, texte jaune uppercase, petit point rouge clignotant lent (indicateur "live/gratuit").
- **Icônes** : line-icons blancs sur anneau circulaire — anneau rouge pour les items "problème", anneau jaune pour les items "résultat/livrable/reçu".
- **Étapes numérotées** (Jour 1/2/3) : gros chiffre outline (contour blanc, intérieur transparent) avec le connecteur dégradé décrit plus haut.
- **CTA** : primaire = jaune plein/texte noir bold ; secondaire (nav, liens) = contour blanc.
- **Accordéon FAQ** : carte `#151517`, chevron qui devient jaune à l'ouverture.
- **Barre de marque en pied de page** (inspirée de la capture de référence) : bande noire fine avec le mark VizioLab + baseline courte, façon signature de fin de tunnel — pas d'attribution tierce fictive, uniquement la marque VizioLab.
- **CTA sticky mobile** : bouton jaune fixé en bas de l'écran dès que le hero est scrollé, disparaît sur le formulaire/CTA final pour ne pas doublonner.

---

## B. WIREFRAME TEXTUEL (mobile-first, ordre d'empilement)

```
[NAV] logo mark (barres) + wordmark — burger menu mobile
      lien ancré "Rejoindre" toujours visible

[HERO]
  badge "🔥 CHALLENGE GRATUIT — 3 JOURS"
  H1 (Space Grotesk 800, uppercase, 2 lignes mobile)
  sous-headline (Inter 400, gris clair)
  CTA jaune plein "JE REJOINS LE CHALLENGE GRATUIT"
  micro-copy "100% en ligne • 3 jours • 90 min/jour"
  → fond : motif barres diagonales flouté animé

[PROBLÈME]
  séparateur diagonal rouge→jaune
  titre H2
  liste de 7 symptômes — carte compacte, icône ronde anneau rouge
  transition en italique centrée

[PROMESSE — AVANT/APRÈS]
  titre H2 centré
  2 colonnes mobile → empilées (AVANT en haut, flèche animée, APRÈS en bas)
  colonne AVANT : fond légèrement teinté rouge (5% opacité)
  colonne APRÈS : fond légèrement teinté jaune (5% opacité)

[COMMENT ÇA MARCHE — 3 JOURS]
  titre H2
  3 cartes empilées, connecteur vertical dégradé rouge→blanc→jaune
  chaque carte : gros chiffre outline, titre jour, sous-titre, liste à puces, bloc "Livrable" mis en évidence (fond jaune 10%, bordure jaune)

[CE QUE TU VAS CONSTRUIRE]
  3 mini-cards horizontales scrollables (mobile snap-scroll) Jour1→2→3 avec icône
  message centré en accroche

[L'IA AU CŒUR DU CHALLENGE]
  titre H2 + paragraphe
  grille 2×4 mobile (icônes + mini-labels : angles, structure, contenu, visuels, offres, temps, automatisation)
  encart "message" sur fond carte, bordure jaune fine

[POUR QUI]
  2 blocs empilés mobile : "C'est pour toi" (check jaune) / "Pas pour toi" (croix rouge)

[CE QUE TU VAS RECEVOIR]
  carte unique façon "récap offre" (écho du bloc pricing de la référence, mais sans prix)
  liste à puces avec icônes jaunes, gros badge "GRATUIT" en haut à droite de la carte
  CTA jaune en bas de carte

[MÉTHODE VIZIOLAB]
  frise horizontale scrollable mobile : APPRENDRE → CONSTRUIRE → TESTER → MESURER → AMÉLIORER
  paragraphe sous la frise

[POURQUOI VIZIOLAB]
  liste à puces + emplacement preuve concrète (optionnel, [À COMPLÉTER])

[ENGAGEMENT]
  5 points numérotés, cartes fines alignées verticalement
  message de clôture en évidence

[CTA INTERMÉDIAIRE]
  bloc pleine largeur fond carte + motif barres en fond très discret
  CTA jaune + micro-copy

[LA SUITE APRÈS LE CHALLENGE — ACCELERATOR]
  paragraphe de transition
  3 cartes MOIS 1/2/3 empilées mobile, connecteur fin
  mention "non obligatoire" en note discrète sous le bloc

[DIAGNOSTIC PERSONNALISÉ]
  bloc question + réponse, ton rassurant, fond carte clair contraste
  pas de CTA agressif ici — texte de réassurance uniquement

[PREUVE SOCIALE]
  grille de placeholders (cadres pointillés "[À COMPLÉTER]") — prête à recevoir témoignages réels

[FAQ]
  accordéon, 10 questions, chevron jaune à l'ouverture

[CTA FINAL]
  plein écran, fond motif barres plus visible qu'ailleurs (climax visuel)
  titre H2 majuscule, sous-titre, CTA jaune large, micro-copy

[FOOTER]
  bande noire fine, mark + wordmark, liens légaux (mentions, confidentialité), pas de fausse attribution

[STICKY MOBILE CTA]
  apparaît après le hero, disparaît sur formulaire/CTA final
```

---

## C. FORMULAIRE — UI

- Ouvert en **modale** (comme le diagnostic du projet DigitalStartGo — cohérence d'UX si l'utilisateur connaît déjà ce pattern) déclenchée par tous les CTA de la page, ou en **section dédiée ancrée** juste avant le CTA final — à trancher selon préférence (les deux sont compatibles avec le copy déjà écrit).
- Champs sur fond `#151517`, bordure blanche translucide, focus → bordure jaune.
- Question "Où en es-tu actuellement ?" en boutons-cartes sélectionnables (pas un `<select>` natif) pour rester cohérent avec le style "cartes" du reste de la page et faciliter le tap mobile.
- Bouton de soumission jaune plein, coin biseauté (cf. motif CTA).

---

## D. RESPONSIVE

- Breakpoints : mobile (< 640px, prioritaire), tablette (640–1024px), desktop (> 1024px).
- Grilles qui passent de 1 colonne (mobile) → 2 (tablette) → 3 (desktop) pour les cartes Jour 1/2/3, POUR QUI, etc.
- Hero : motif de fond redimensionné et repositionné en desktop (barres visibles à droite du texte plutôt qu'en fond plein).
- CTA sticky mobile masqué en desktop (les CTA de section suffisent, plus d'espace visible).

---

Prochaine étape (ÉTAPE 4) : code HTML/CSS/JS + tracking + SEO, sur cette base. Une question avant de coder : **formulaire en modale (comme DigitalStartGo) ou section ancrée dans le scroll ?**
