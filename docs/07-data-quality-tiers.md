# Stratégie de qualité des données — Tiering

## Contexte

Le projet importe en Phase 1 un historique de 607 enregistrements issus
d'un fichier Excel (`Database_Pneus_Unifiee.xlsx`). Ces données
présentent plusieurs problèmes de qualité structurels :

- Dates stockées en format numérique Excel (46133) au lieu de format date
- Marques non standardisées (ex: « 2 Toyo 1 Sailun 1 Continental »,
  « Gt Radial » vs « GT Radial »)
- Tailles avec casse incohérente (« 265/70r17 » vs « 265/70R17 »)
- Champ `Profit_calcule` systématiquement vide (100% des lignes)
- Champ `Annee_usinage` systématiquement vide (100% des lignes)
- Prix d'achat parfois fixé à 0 pour les items « bonus » d'un lot,
  sans méthode claire d'allocation du coût global

## Enjeu

Si les données historiques sont mélangées naïvement avec les nouvelles
données saisies proprement, tous les calculs analytiques (marges,
tendances, prévisions) seront pollués par les approximations héritées.

À l'inverse, ignorer complètement les données historiques priverait
Mika de 18+ mois de références business utiles pour du benchmarking.

## Solution — Système de tiering

Chaque enregistrement du système porte un champ `data_quality_tier`
avec deux valeurs possibles :

- `legacy_migrated` — donnée importée depuis l'Excel historique
- `app_native` — donnée saisie directement dans la nouvelle application

Ce champ est **immuable** après création. Une donnée legacy ne peut pas
devenir native, même après correction.

## Champs de confiance granulaires

Certains champs sont fiables même dans le legacy (ex: `Marque`, `Taille`,
`Saison`), d'autres ne le sont pas (ex: `Prix_achat_par_kit`).

Pour gérer cela, chaque champ critique peut porter un flag
`trust_score` indiquant son niveau de fiabilité :

- `high` — valeur vérifiée ou saisie dans l'app
- `medium` — valeur legacy probable mais non vérifiée
- `low` — valeur legacy connue pour être approximative (ex: prix
  d'achat approximé, allocation bonus)
- `unknown_legacy` — valeur manquante remplacée par une valeur par
  défaut explicite

## Comportement dans les dashboards

Chaque dashboard analytique propose par défaut **deux vues** :

1. **Vue propre** (par défaut) — n'inclut que les enregistrements
   `app_native` et les champs `trust_score = high`
2. **Vue complète** — inclut tout l'historique, avec un bandeau
   d'avertissement explicite (« Cette vue inclut 44 items avec prix
   d'achat approximé »)

Les utilisateurs peuvent basculer entre les deux vues, mais jamais les
mélanger silencieusement.

## Comportement à la saisie

Une donnée legacy peut être **« promue »** en app_native si Mika prend
le temps de vérifier et corriger chaque champ. Cette promotion est une
action explicite, journalisée, et ne se fait jamais automatiquement.

## Migration initiale

Lors du premier import de l'Excel :

1. Tous les enregistrements reçoivent `data_quality_tier = legacy_migrated`
2. Les champs vides ou clairement incohérents reçoivent
   `trust_score = unknown_legacy`
3. Les champs avec valeurs probables reçoivent `trust_score = medium`
4. Aucun champ n'est automatiquement marqué `high` pour des données
   legacy — la confiance se mérite par vérification

## Bénéfice stratégique

Cette approche permet :

- **Zéro pollution** des analyses sur données propres
- **Préservation** de la mémoire business pour benchmarking
- **Transparence** sur la qualité des chiffres affichés
- **Confiance croissante** à mesure que les données legacy sont
  vérifiées et promues

Cette décision architecturale est capturée dans
`docs/decisions/ADR-002-tiering-qualite-donnees.md`.

---
