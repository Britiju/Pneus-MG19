# ADR-011 — Pricing au MVP : capture du prix affiché et comparables

## Statut

Acceptée — Paquet 2 (finances), question C.

## Contexte

Le pricing des kits est un sujet à double dimension :

1. **Aujourd'hui** : Mika fixe les prix à l'instinct (expérience) et
   consulte son Excel en cas de doute. Il ne capture que le prix de
   vente final, pas le prix affiché initial.
2. **Vision long terme** : un assistant prédictif qui suggère des
   scénarios de pricing basés sur l'historique (Phase C, Module 7).

La question centrale était : qu'est-ce qu'on capture au MVP pour
servir aujourd'hui tout en préparant la vision future?

## Décision

### Capture de deux prix par kit

- **Prix affiché** : saisi à la publication de l'annonce. C'est le
  prix que Mika publie sur Marketplace ou autre canal.
- **Prix de vente final** : saisi au moment de la transaction. C'est
  ce que le client a réellement payé.

La différence entre les deux = **rabais de négociation**, calculé
automatiquement par l'app.

### Changements de prix en cours de route (hors MVP)

Au MVP, si Mika baisse son prix sur Marketplace pendant la période
d'annonce, l'app ne capture **pas** l'historique des baisses
intermédiaires. Seul le prix affiché initial et le prix de vente
final sont stockés.

**Raison** : modifier le prix dans l'app sans que ça se répercute
automatiquement sur Marketplace créerait du travail en double
(violation Principe 1). L'intégration Marketplace n'étant pas
disponible au MVP, cette feature est reportée en Phase B.

### Panneau "Ventes comparables" au MVP

Quand Mika remplit le prix affiché d'un nouveau kit, l'app affiche
**sur le côté** les ventes passées similaires.

**Critères de matching** (hiérarchie) :

1. **Marque** — surtout critique pour les grandes marques (Michelin,
   Continental, Bridgestone, Pirelli, Goodyear, etc.)
2. **Taille** — correspondance exacte ou très proche
3. **Usure similaire** — catégorisation par plages (voir ci-dessous)
4. **Saison** — indicatif, pas critique

**Tri des résultats** : du plus récent au plus ancien. Pas de
masquage des anciennes ventes (Option B retenue parmi les trois
options discutées).

**Information affichée par comparable** :
- Code du kit
- Prix affiché et prix de vente
- Nombre de jours entre publication et vente
- **Date de la vente** (pour contextualiser — une vente de 2024 n'a
  pas la même pertinence qu'une vente de 2026)

### Catégorisation automatique de l'usure en saisons restantes

L'app déduit automatiquement une **fourchette de saisons restantes**
à partir de la mesure d'usure en 32e de pouce :

| Usure (32e) | Saisons restantes | Catégorie |
|-------------|-------------------|-----------|
| 10-11       | 4-5 saisons       | Neuf      |
| 8-9         | 3-4 saisons       | Très bon  |
| 7           | 2-3 saisons       | Bon       |
| 6           | 2 saisons         | Moyen     |
| 5           | 1-2 saisons       | Limite    |
| 4 et moins  | 1 saison max      | Fin de vie|

**Règle de calcul** : `(usure_actuelle - 2) / 2 = saisons_restantes`,
arrondi en fourchette pour rester honnête avec la variabilité
d'usage.

**Format de présentation** : fourchette (ex: "3-4 saisons"), pas un
chiffre unique. Cohérent avec la volonté de rester honnête avec
l'acheteur : "ça dépend" de son usage, sa conduite, ses conditions.

Cette catégorisation sert à deux endroits :

1. **Matching des comparables** : regroupement par catégorie d'usure
   plutôt que par valeur exacte
2. **Génération automatique de la description** (bouton "Copier la
   description", voir ci-dessous)

### Génération automatique de la description Marketplace

**Bouton "Copier la description"** disponible sur la fiche d'un kit
au MVP. Clic → copie dans le presse-papier un texte formaté
automatiquement à partir des infos du kit :

- Marque
- Taille
- Saison
- Usure et saisons restantes
- Prix affiché
- Nature (pneus seuls / avec jantes / jantes seules)

**Format** : simple paragraphe prêt à coller dans Facebook
Marketplace, LesPAC, Kijiji.

**Évolution future** (backlog) :
- Templates personnalisables (Phase B)
- Génération par IA pour varier les tournures (Phase C)
- Publication directe Marketplace (Phase C, dépendante de l'API)

## Justification

### Pourquoi capturer les deux prix et pas seulement le prix de vente?

Deux raisons :

**1. Mesure du rabais moyen** : savoir que tu donnes 12% de rabais en
moyenne sur les pneus d'hiver permet d'ajuster les prix affichés
futurs. Sans cette mesure, c'est du tâtonnement permanent.

**2. Préparation de l'assistant prédictif (Phase C)** : le modèle
aura besoin de connaître prix initial → prix final → temps de vente
pour faire des prédictions fiables. Capturer dès le MVP = 12+ mois
d'historique propre quand la Phase C démarrera.

### Pourquoi pas de suggestions prédictives au MVP?

Ce serait prématuré :

- Pas assez de données propres (app_native) pour être fiable
- Complexité de modélisation (corrélations multi-variables)
- Risque d'influencer négativement les décisions de Mika avec des
  prédictions basées sur peu de données

Le panneau "ventes comparables" (visible, pas normatif) est un bon
compromis : aide à la décision sans prétendre prédire.

### Pourquoi des fourchettes de saisons plutôt qu'un chiffre unique?

Parce que "ça dépend". Un kit 8/32e peut durer 3 ou 4 saisons selon
le conducteur. Annoncer "3-4 saisons" plutôt que "3 saisons max" :

- Reste honnête avec la variabilité réelle
- Évite les frustrations clients ("tu avais dit 3 saisons, ça a
  duré 2")
- Attire un acheteur qui comprend la nuance

## Conséquences

### Positives

- Mesure précise de la pratique de négociation (rabais par kit, par
  saison, par marque)
- Base solide pour l'assistant prédictif futur
- Réduction du temps de rédaction des annonces (bouton "Copier la
  description")
- Élimination des consultations Excel en cours de pricing
- Vocabulaire standardisé "saisons restantes" sur toutes les annonces

### Négatives

- Un champ supplémentaire à saisir au moment de publier (prix
  affiché)
- Panneau comparables occupe de l'espace écran
- Catégorisation usure peut paraître simpliste pour des cas limites

### Atténuation

- Le prix affiché est **déjà implicitement** ce que Mika met dans
  Facebook, donc pas vraiment une saisie "en plus", juste une
  structuration
- Panneau comparables peut être replié/déplié selon besoin
- Les fourchettes d'usure sont ajustables par configuration si besoin

## Alternatives considérées

1. **Capturer seulement le prix de vente final** (comme aujourd'hui)
   → rejeté, prive les analyses futures de la dimension rabais

2. **Capturer l'historique complet des baisses de prix intermédiaires**
   → rejeté au MVP, nécessite intégration Marketplace ou saisie
   redondante

3. **Suggestions prédictives dès le MVP** (vente rapide / équilibré /
   maximiser) → rejeté, prématuré sans données historiques propres

4. **Chiffre unique de saisons restantes** (pas de fourchette) →
   rejeté, faussement précis

## Auteur

Décision prise pendant le Paquet 2 (finances), question C. Co-construite
avec Mika. Le format "fourchette de saisons" vient directement de la
pratique de Mika qui présente ses kits "comme pour 3 saisons" ou
"2 saisons" selon l'usage attendu.

---
