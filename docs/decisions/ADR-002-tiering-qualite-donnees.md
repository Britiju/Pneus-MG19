# ADR-002 — Tiering de qualité des données

## Statut

Acceptée — Phase 1 de cadrage.

## Contexte

Le projet doit importer 607 enregistrements historiques issus d'un
fichier Excel. Ces données présentent des problèmes de qualité
structurels qui, s'ils sont mélangés avec les nouvelles données propres,
vont polluer toutes les analyses futures.

Les deux approches naïves sont insatisfaisantes :

1. **Ignorer l'historique** — prive Mika de 18 mois de benchmarks
2. **Mélanger historique et nouveau** — pollue toutes les analyses

## Décision

Un **système de tiering** est implémenté sur chaque enregistrement :

- Champ `data_quality_tier` obligatoire (`legacy_migrated` ou
  `app_native`)
- Champ `trust_score` optionnel par champ critique
- Les dashboards affichent par défaut la **vue propre** (données
  app_native uniquement)
- Une **vue complète** est disponible avec bandeau d'avertissement
  explicite

## Justification

Cette approche permet de bénéficier de l'historique (pour du
benchmarking grossier) sans polluer les analyses fines. Elle offre
également une **transparence totale** : l'utilisateur sait toujours
sur quelles données se basent les chiffres affichés.

Le coût de développement est modéré : un champ supplémentaire sur
chaque table, un filtre par défaut dans les queries, un toggle dans
l'UI des dashboards.

## Conséquences

### Positives

- Analyses fiables dès le jour 1 de l'app en production
- Préservation de la mémoire business historique
- Transparence totale sur la provenance des chiffres
- Possibilité de « promouvoir » une donnée legacy en app_native via
  vérification manuelle

### Négatives

- Complexité accrue du modèle de données
- Tous les écrans de listing doivent gérer le dual-mode
- Possible confusion utilisateur au début (« pourquoi ces chiffres
  différents? »)

## Atténuation des négatifs

- Documentation claire du tiering dans l'UI (bandeau explicatif)
- Onboarding qui explique le concept en 30 secondes
- Promotion progressive des données legacy → app_native à mesure
  qu'elles sont vérifiées

## Alternatives considérées

1. **Tout importer en app_native** — rejeté car pollue les analyses
2. **Tout ignorer l'historique** — rejeté car perte d'information
3. **Deux bases de données séparées** — rejeté car complexité de
   jointure trop élevée

## Implémentation technique

Détails dans `docs/07-data-quality-tiers.md`.

## Auteur

Décision proposée par Mika lors de la Phase 1 de cadrage, après
observation directe des problèmes de qualité dans le fichier Excel
source.

---
