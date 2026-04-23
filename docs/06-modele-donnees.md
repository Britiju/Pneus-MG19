# Modèle de données — Inventaire

## Vue d'ensemble

Le modèle de données de l'inventaire suit une **hiérarchie à 4 niveaux**
qui reflète la réalité terrain du business de Mika :

```
Lot (acquisition)
 └── Kit (unité vendable)
      └── Variante (optionnelle, quand usure mixte ou vente partielle)
           └── Notes (champ texte libre pour détails)
```

Ce modèle est le résultat d'une analyse approfondie des données
historiques (607 enregistrements dans l'Excel de référence) et d'une
évaluation de 4 modèles alternatifs. Il est appelé "Modèle 3.5" dans
les discussions de conception.

## Niveau 1 — Lot

Un **Lot** représente une acquisition groupée (un achat chez un
fournisseur, à une date donnée).

**Attributs principaux** :

- `lot_id` — identifiant technique (UUID + internal_id)
- `lot_code` — code lisible (ex: "Mars 2026", généré ou saisi)
- `date_acquisition` — date de l'achat
- `fournisseur` — nom ou référence (champ texte libre au MVP)
- `prix_total` — montant payé pour le lot complet
- `notes` — observations générales sur le lot
- `data_quality_tier` — `legacy_migrated` ou `app_native`
- `statut` — `draft` / `active` / `archived`

**Règles** :

- Un Lot devient immuable quand au moins un kit issu de ce lot est
  vendu (principe d'immutabilité, voir ADR-005)
- Un Lot peut contenir 1 à N Kits
- Le prix d'achat est alloué aux kits selon une règle explicite (voir
  Module 3 — Finance)

## Niveau 2 — Kit

Un **Kit** représente l'unité commerciale vendable. C'est le cœur du
modèle — ce que Mika étiquette, décrit, vend, tracque.

**Attributs principaux** :

- `kit_id` — identifiant technique (UUID + internal_id)
- `display_code` — code visible écrit sur le pneu (ex: `A247`)
- `lot_id` — lot d'origine
- `nature` — `A` (pneus purs) / `B` (pneus + jantes attachés) /
  `C` (jantes seules)
- `marque` — marque des pneus (obligatoire)
- `taille` — taille des pneus (obligatoire)
- `saison` — `hiver` / `ete` / `4_saisons` (obligatoire)
- `usure_moyenne` — usure moyenne en 32e (obligatoire si applicable)
- `quantite_pneus` — nombre de pneus (par défaut 4)
- `vehicule_compatible` — texte libre (optionnel)
- `prix_achat_alloue` — part du prix d'achat du lot attribuée à ce kit
  (nullable en état `draft`, obligatoire à partir de l'état `active`,
  voir ADR-008)
- `prix_vente_affiche` — prix courant affiché à la vente
- `notes` — texte libre
- `data_quality_tier` — hérité du Lot
- `statut` — `draft` / `en_stock` / `en_vente` / `vendu` /
  `rebute_total` / `detache` / `archive`

**Les 3 natures expliquées** :

**Nature A — Pneus purs**
Kit sans jantes, ou avec jantes indissociables (rim en acier que
Mika ne démonte pas). C'est le cas majoritaire (~95%).

**Nature B — Pneus + jantes cosmétiques attachés**
Kit arrivant avec des jantes cosmétiques (alu, aftermarket). Les
jantes sont **détachables** via une action explicite dans l'app,
créant un kit-pneus + un kit-jantes distincts.

**Nature C — Jantes seules**
Créé soit par détachement d'un kit Nature B, soit saisi directement
(cas rare).

## Niveau 3 — Variante (optionnelle)

Une **Variante** existe uniquement quand un Kit doit être subdivisé
pour une raison légitime. Les variantes sont **par paire** le plus
souvent, car les pneus s'usent par essieu.

**Cas d'usage d'une variante** :

- Usure mixte : ex. kit A247 avec 2 pneus à 9mm et 2 à 6mm, créés
  comme variantes A247-a et A247-b
- Vente partielle : client achète 2 pneus sur 4, les 2 restants et
  les 2 vendus deviennent des variantes distinctes

**Attributs principaux** :

- `variante_id` — identifiant technique
- `kit_id` — kit parent
- `suffixe` — lettre de variante (`a`, `b`, `c`...)
- `display_code_complet` — ex: `A247-a`
- `quantite_pneus` — nombre de pneus dans cette variante
- `usure_specifique` — usure spécifique à cette variante (si mixte)
- `prix_vente_affiche` — possible prix distinct
- `statut` — propre à la variante

**Règle** : dans 98% des cas, un kit n'a pas de variantes. Les
variantes sont créées uniquement quand nécessaire.

## Niveau 4 — Notes

Champ texte libre sur le Kit et/ou la Variante, pour capturer tout
élément non structuré (défaut individuel d'un pneu, observation
particulière, consigne pour la vente, etc.).

Pas de structure imposée. Pas d'obligation de remplir.

## Journal d'événements

Parallèlement aux entités ci-dessus, un **journal d'événements**
capture tous les changements d'état significatifs au cours de la vie
d'un kit.

**Types d'événements** :

- `acquisition` — arrivée dans l'inventaire
- `caracterisation` — première inspection/saisie détaillée
- `mise_en_vente` — passage au statut "en vente"
- `modification_attribut` — correction d'un champ (marque, usure, etc.)
- `correction_code` — correction du display_code via workflow explicite
- `rebut_partiel` — mise au rebut d'une partie des pneus
- `rebut_total` — mise au rebut de l'ensemble
- `detachement` — séparation pneus/jantes (Nature B → A + C)
- `rebut_jantes` — mise au rebut de jantes détachées
- `variante_creee` — création d'une subdivision
- `vente` — transaction finalisée
- `annulation_vente` — correction d'une vente (erreur de saisie)
- `retour_complet` — retour total post-vente
- `retour_partiel` — retour partiel post-vente
- `indemnisation` — rabais post-vente
- `echange` — combinaison retour + nouvelle vente

**Structure d'un événement** :

- `event_id` — identifiant unique
- `kit_id` / `variante_id` / `lot_id` — entité concernée
- `type_evenement` — un des types ci-dessus
- `timestamp` — date et heure précises
- `utilisateur` — qui a déclenché l'action
- `donnees_avant` — snapshot avant l'événement
- `donnees_apres` — snapshot après
- `raison` — texte optionnel expliquant l'événement
- `evenements_lies` — références à d'autres événements (ex: échange =
  retour + vente liés)

## Architecture technique — scalabilité latente

**Chaque entité porte trois identifiants** :

- `uuid` — identifiant global unique (invisible utilisateur, pour
  intégrations futures avec APIs externes, multi-systèmes)
- `internal_id` — nombre séquentiel auto-incrémenté (invisible,
  optimisation performance)
- `display_code` — code affiché à l'utilisateur (A247 pour un kit,
  lot_code pour un lot, etc.)

Cette séparation permet d'évoluer le format des codes affichés sans
casser les références internes (Palier 2 et 3 de la roadmap de
numérotation).

## Règles d'intégrité

**Unicité** :

- `display_code` UNIQUE par table
- `uuid` UNIQUE globalement
- Contrainte enforcée au niveau base de données (pas juste application)

**Cohérence** :

- Une variante ne peut pas avoir plus de pneus que son kit parent
- Un kit détaché (Nature B → A + C) conserve la trace du lien
- Un kit rebut total garde tous ses attributs pour traçabilité

**Soft delete systématique** :

- Aucune entité n'est jamais effacée physiquement
- Une "suppression" est un changement de statut (`archive` ou autre)
- Le journal d'événements reste intact

## Migration depuis le legacy

Les 607 enregistrements historiques sont importés avec :

- `data_quality_tier = legacy_migrated` sur chaque entité
- Les anciens codes (`1A`, `2B`, `V01`...) préservés dans `display_code`
- Les cas `Sous_lot` de l'Excel deviennent naturellement des variantes
  (Kit + Variante-a + Variante-b)
- Les champs manquants (Profit_calcule, Annee_usinage, etc.) restent
  null avec `trust_score = unknown_legacy`

Le moteur de recherche gère **trois conventions** cohabitantes :
- Legacy 2025 : `1A`, `2B`, `5M-a`
- Legacy 2026 : `V01`, `V02`
- Nouveau système : `A247`, `B088`

La distinction de format (longueur, structure) lève les ambiguïtés à
la recherche.

---
