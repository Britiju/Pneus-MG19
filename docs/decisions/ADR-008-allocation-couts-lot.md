# ADR-008 — Allocation des coûts d'un lot sur les kits

## Statut

Acceptée — début du Paquet 2 (finances).
Mise à jour : nullabilité conditionnelle de `prix_achat_alloue` (voir section
"Stockage en base").

## Contexte

Quand Mika achète un lot (ex: 1200$ pour 8 kits), ce prix total doit
être réparti sur les kits individuels pour permettre le calcul de la
marge par kit. Sans allocation, les analyses financières fines
(marge par fournisseur, ROI par kit, rapports par marque) sont
impossibles.

Plusieurs stratégies étaient envisageables :

1. **Division égale** entre kits
2. **Proportionnelle au nombre de pneus** de chaque kit
3. **Proportionnelle à la valeur de revente estimée**
4. **Saisie manuelle** intégrale par Mika
5. **Hybride** : champs vides + boutons raccourcis + saisie manuelle

## Décision

**Stratégie 5 (hybride) retenue** :

### Comportement à la saisie d'un lot

- Les champs d'allocation par kit sont **vides par défaut**
- Aucun pré-remplissage automatique — l'utilisateur doit faire un
  choix explicite (Principe 11)
- Trois **boutons raccourcis** sont proposés :
  - "Diviser également entre kits" — divise le prix total par le
    nombre de kits, applique la valeur uniforme
  - "Diviser proportionnellement aux pneus" — répartit selon le
    nombre de pneus de chaque kit
  - "Tout remettre à 0" — réinitialise les allocations
- L'utilisateur peut **toujours saisir manuellement** les montants
  individuels, même après utilisation d'un raccourci
- **Validation bloquante** : l'application refuse la sauvegarde si la
  somme des allocations ≠ prix total du lot (comparaison exacte, pas
  approximative)

### Choix du raccourci par défaut

Quand l'utilisateur hésite, le bouton le plus saillant visuellement
est "Diviser également entre kits". Ce choix est justifié par :

- Un kit est l'unité économique du business (pas le pneu individuel)
- Un kit de 4 pneus n'est pas "2× plus valuable" qu'un kit de 2 pneus
  (le marché n'est pas strictement linéaire au nombre de pneus)
- Simplicité : pas de calcul proportionnel à faire mentalement

L'utilisateur qui préfère la répartition proportionnelle dispose du
bouton dédié.

### Stockage en base

Chaque kit porte un champ `prix_achat_alloue` (montant décimal). Ce
champ est :

- Nullable en base (le champ peut rester vide en état `draft`)
- Validation applicative : le champ devient obligatoire pour la
  transition `draft → active`. Un kit ne peut pas être mis en stock
  ni en vente sans allocation valide
- Immuable après que le lot parent devient `committed` (voir ADR-005)
- Modifiable seulement via un événement correctif explicite

## Justification

### Pourquoi pas d'auto-fill automatique?

L'auto-fill (champs pré-remplis selon une règle standard) aurait été
plus rapide pour l'utilisateur. Il a été rejeté pour trois raisons :

**1. Validation distraite** — Un utilisateur pressé clique "OK" sans
vérifier les valeurs pré-remplies. Sur des champs financiers, cette
validation passive peut introduire des erreurs permanentes dans la
base (les allocations ne seront modifiables qu'après le commit du
lot, via actions correctives lourdes).

**2. Opacité du calcul** — L'auto-fill cache la logique de
répartition. L'utilisateur ne sait pas toujours pourquoi le kit A247
a 150$ alloué et le kit B088 a 180$. Cette opacité devient
problématique lors des audits ou corrections.

**3. Violation du Principe 11** — Les champs à impact business doivent
être saisis avec engagement explicite. L'auto-fill est l'anti-pattern
du Principe 11.

### Pourquoi accepter la Stratégie 5 plutôt que la saisie manuelle pure?

La saisie manuelle pure imposerait de taper 8 valeurs distinctes pour
un lot de 8 kits, même si toutes les valeurs sont identiques. C'est
une friction inutile pour un cas standard.

Les boutons raccourcis accélèrent le cas standard (un clic au lieu de
8 saisies) tout en préservant l'engagement explicite (le clic est
intentionnel, pas passif).

### Pourquoi nullable en état `draft`?

La version initiale stipulait le champ "obligatoire à la création du
kit". Cette règle créait une incohérence avec le backlog (kits
"shell" créés en urgence, à enrichir progressivement).

La règle révisée aligne ADR-008 avec :

- **ADR-005** (les 3 états `draft` / `active` / `committed` justifient
  des règles de validation différentes par état)
- **Principe 11** (pas d'auto-fill — donc pas de valeur provisoire
  imposée à la création)
- **L'enrichissement progressif** prévu au backlog (kits créés
  rapidement lors d'un achat urgent, alloués plus tard)

La validation bloquante (`draft → active`) préserve l'intégrité :
aucun kit sans allocation ne peut être mis en stock ou en vente.

## Conséquences

### Positives

- Intégrité des données d'allocation (pas d'erreurs de validation
  passive)
- Traçabilité des choix (les raccourcis utilisés peuvent être
  journalisés)
- Flexibilité totale (saisie manuelle reste disponible)
- Alignement avec Principe 11 (engagement explicite)
- Alignement avec Principe 13 (les raccourcis optimisent le cas
  standard)
- Supporte les kits créés en urgence sans friction inutile

### Négatives

- Marginalement plus de friction qu'un auto-fill pur (un clic
  supplémentaire)
- Interface nécessite 3 boutons visibles (espace écran)
- Validation bloquante impose à l'utilisateur de corriger avant
  passage à `active` (pas de mise en stock avec allocations
  incomplètes)

### Atténuation des négatifs

- Les boutons raccourcis sont gros et bien placés (1 clic ≈ 1 seconde)
- Le mode `draft` du lot permet de sauvegarder avec allocations
  incomplètes ; la validation ne bloque que la transition vers
  `active`

## Alternatives considérées

1. **Auto-fill égal par défaut** — rejeté (Principe 11)
2. **Auto-fill proportionnel aux pneus** — rejeté (Principe 11 +
   opacité)
3. **Saisie manuelle pure sans raccourcis** — rejeté (friction inutile
   sur cas standard)
4. **Tolérance sur la somme (arrondi automatique)** — rejeté
   (intégrité comptable exige une somme exacte)
5. **Champ obligatoire à la création** — rejeté (incohérence avec
   enrichissement progressif, contredit ADR-005 sur les états)

## Implémentation technique

- Formulaire d'allocation affiché à la création ou édition d'un lot
  `draft`
- Validation côté client (feedback immédiat) et côté serveur (source
  de vérité)
- Contrainte SQL : `prix_achat_alloue` nullable, contrainte de somme
  enforced uniquement à la transition `draft → active`
- Journal d'événements enregistre les changements d'allocation
  pendant l'état `active`

## Auteur

Décision co-construite pendant le début du Paquet 2. L'assistant avait
initialement proposé un auto-fill automatique, rejeté par Mika en
faveur de la Stratégie 5 hybride. Cette discussion a donné naissance
au Principe 11 (Engagement explicite sur données sensibles).

Mise à jour sur la nullabilité : incohérence identifiée entre la règle
"obligatoire à la création" et le backlog (enrichissement progressif).
Résolue en adoptant la validation par état (nullable en `draft`,
obligatoire pour `draft → active`).

---
