# ADR-009 — Retours au fournisseur (pré-mise-en-stock)

## Statut

Acceptée — Paquet 2.

## Contexte

Distinct des retours post-vente (ADR-006), ce type d'événement concerne
les pneus retournés au fournisseur **avant** d'entrer en inventaire
actif — typiquement lors de l'inspection initiale d'un lot, quand des
défauts sont découverts qui rendent certains kits invendables.

Sans modélisation explicite, ces retours seraient soit ignorés (perte
de traçabilité) soit traités comme des rebuts (impact incorrect sur les
marges).

## Décision

### Nouveau type d'événement : `retour_fournisseur`

**Cas d'usage** : à l'inspection d'un lot, Mika découvre qu'un ou
plusieurs kits sont défectueux. Il les retourne au fournisseur
(parfois avec remboursement partiel).

**Règle de granularité** :

Tous les pneus d'un kit sont retournés ensemble, même si un seul est
défectueux. L'unité de retour est le kit, pas le pneu individuel.

**Comportement dans le système** :

- Le kit existe dans le système avec statut `retourne_fournisseur`
- Le kit n'entre jamais dans l'inventaire actif
- Ses attributs (marque, taille, usure) restent traçables pour analyse
- Le lot d'origine reste immuable (Principe 9, ADR-005)

**Remboursement fournisseur** :

- Enregistré comme événement séparé `remboursement_fournisseur`
- Montant optionnel (parfois le fournisseur ne rembourse pas)
- Le `prix_total` du lot **ne change pas** (immutabilité)
- Le **coût effectif du lot** est calculé dynamiquement :
  `coût_effectif = prix_total - somme(remboursements_fournisseur)`
- Ce coût effectif est utilisé dans les rapports financiers (Module 3)

### Attributs de l'événement `retour_fournisseur`

- `lot_id` — lot concerné
- `kit_id` — kit retourné
- `quantite_pneus_retournes` — nombre de pneus dans le kit
- `raison` — texte libre (ex: "sidewall craquelé", "mauvaise taille")
- `remboursement_montant` — montant remboursé (optionnel, peut être 0)
- `destination` — `retour_fournisseur` / `ferraille_directe`
- `date_evenement` — horodatage
- `utilisateur` — qui a enregistré l'événement

### Différence avec le rebut

| | Retour fournisseur | Rebut |
|--|--|--|
| Timing | Avant mise en stock | Après mise en stock |
| Responsabilité | Fournisseur | Usure / accident |
| Impact financier | Possible remboursement | Perte nette |
| Statut kit | `retourne_fournisseur` | `rebute_total` |

## Justification

- Traçabilité complète du cycle de vie, même pour les kits non vendus
- Impact financier correct : le coût effectif reflète les remboursements
- Séparation claire des responsabilités (fournisseur vs inventaire)
- Données pour future analyse qualité fournisseur (Phase B/C)

## Conséquences

### Positives

- Marges calculées sur le coût effectif, pas le prix brut
- Historique des fournisseurs enrichi (taux de retour par fournisseur)
- Traçabilité complète même pour les kits qui "disparaissent" avant
  d'entrer en stock

### Négatives

- Événement supplémentaire à coder au MVP
- Workflow à expliquer aux utilisateurs

## Auteur

Cas identifié pendant l'audit Paquet 2, lors de la modélisation de
l'allocation des coûts.

---
