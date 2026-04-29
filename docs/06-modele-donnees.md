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
- `legacy_source` — texte/enum, optionnel, présent uniquement si
  `data_quality_tier = legacy_migrated`. Valeurs : `excel_historique`
  ou `stealth_test`. Permet de distinguer l'origine de l'import legacy.
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
- `notes_prospection` — texte libre (optionnel). Champ pour capture
  opportuniste d'infos de prospection (noms, téléphones, prix
  négociés informels, etc.) hors du cadre structuré des rendez-vous.
- `data_quality_tier` — hérité du Lot
- `legacy_source` — hérité du Lot, présent uniquement si legacy
- `statut` — `draft` / `en_stock` / `en_vente` / `vendu` / `donne` /
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

## Niveau — Vente

Une **Vente** représente une transaction finalisée sur un kit (ou
une variante). La table `ventes` est enrichie au Paquet 4 pour
distinguer particuliers et commerces, capturer le mode de
facturation et suivre l'envoi effectif de la facture.

**Champs communs sur toute vente** :

- `type_client` — enum `particulier` / `commerce` (obligatoire)
- `mode_paiement` — enum `cash` / `interac` / `autre`
- `statut_paiement` — enum `paye` / `a_recevoir` (défaut `paye`)
- `mode_facturation` — enum `email` / `sms` / `papier` /
  `refuse_par_client`
- `coordonnee_facturation` — texte (conditionnel selon
  `mode_facturation`)
- `facture_envoyee` — booléen (défaut `false`)
- `date_envoi_facture` — timestamp (rempli automatiquement quand
  `facture_envoyee` passe à `true`)

**Champs pour Particulier** (tous optionnels) :

- `particulier_prenom` — texte
- `particulier_telephone` — texte
- `particulier_email` — texte

**Champs pour Commerce** :

- `commerce_nom` — texte (obligatoire si `type_client = commerce`)
- `commerce_personne_ressource` — texte (optionnel)
- `commerce_email` — texte (optionnel)
- `commerce_telephone` — texte (optionnel)
- `commerce_termes_paiement` — enum `comptant` / `net_15` /
  `net_30` / `net_60` / `autre` (obligatoire si
  `type_client = commerce`)

**Validation conditionnelle** :

- Si `mode_facturation = email` → `coordonnee_facturation` doit être
  un email valide et non vide
- Si `mode_facturation = sms` → `coordonnee_facturation` doit être
  un numéro de téléphone valide et non vide

**Champs de consentement (infrastructure latente Loi 25)** :

Ces champs sont présents dès le MVP mais **inactifs** (vides/false).
Ils permettent d'éviter un refactor lors de l'activation des
features marketing en Phase B/C.

- `consentement_facturation` — booléen (implicite si email fourni
  pour facture)
- `consentement_newsletter` — booléen (opt-in explicite requis en
  Phase B+)
- `consentement_relances` — booléen (opt-in explicite requis en
  Phase B+)
- `date_consentement_newsletter` — timestamp (optionnel)
- `date_consentement_relances` — timestamp (optionnel)

**Voir** : `docs/decisions/ADR-013-clients-facturation-mvp.md` et
`docs/decisions/ADR-015-loi25-mvp.md`.

## Niveau — Rendez-vous

Un **RendezVous** représente un engagement pris avec un prospect
pour un kit précis. Plusieurs rendez-vous peuvent être actifs en
parallèle sur un même kit.

**Attributs** :

- `rendez_vous_id` — identifiant technique (UUID + internal_id)
- `kit_id` — référence vers le kit (obligatoire)
- `prenom` — texte libre (optionnel)
- `telephone` — texte (obligatoire — seuil d'entrée dans le système)
- `date_heure` — timestamp
- `prix_negocie_attendu` — décimal (optionnel, **non-éditable après
  saisie**)
- `statut` — enum `planifie` / `honore_vendu` / `honore_pas_vendu` /
  `no_show` / `annule`
- `notes` — texte libre
- `lien_google` — URL optionnelle
- `data_quality_tier` — hérité
- Timestamps standards

**Règles** :

- Le téléphone est obligatoire (règle d'entrée)
- Un kit peut avoir plusieurs RDV actifs (statut `planifie`) en
  parallèle
- Le kit **ne passe pas** à un statut `reserve` — il reste
  `en_vente`
- Le prix négocié attendu, une fois saisi, n'est plus éditable
  (engagement historique, voir Principe 11)

**Transitions** :

- `planifie` → `honore_vendu` (déclenche workflow de vente du kit)
- `planifie` → `honore_pas_vendu`
- `planifie` → `no_show`
- `planifie` → `annule`

**Voir** : `docs/decisions/ADR-014-rendez-vous-mvp.md`

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
- `cadeau` — sortie d'un kit sans transaction commerciale (cadeau,
  usage personnel, promotion). Le kit passe au statut `donne`. Pas
  d'impact financier dans l'app. Pas de transmission à QuickBooks.
  Note libre obligatoire pour indiquer destinataire et/ou raison.

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
- Un kit ne peut avoir qu'un seul statut final (`vendu`, `donne`,
  `rebute_total`). Ces trois statuts sont mutuellement exclusifs et
  immuables une fois atteints (voir ADR-005 sur l'immutabilité).

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

Le moteur de recherche gère **quatre conventions** cohabitantes :
- Legacy 2025 : `1A`, `2B`, `5M-a` (chiffre + lettre)
- Legacy 2026 : `V01`, `V02` (V + chiffres)
- Stealth test : `T01-01`, `T02-03` (T + chiffres + tiret + chiffres)
- Nouveau système : `A247`, `B088` (lettre + 3 chiffres, sauf T —
  voir ADR-018)

La distinction de format (longueur, structure, présence du tiret)
lève les ambiguïtés à la recherche.

Les codes **stealth test** proviennent du prototype d'apprentissage
défini dans `docs/apprentissage-stealth-test.md`. Ils sont importés
au moment de la migration en `data_quality_tier = legacy_migrated`
avec un sous-marqueur supplémentaire `legacy_source = stealth_test`
qui les distingue du legacy Excel historique
(`legacy_source = excel_historique`).

---
