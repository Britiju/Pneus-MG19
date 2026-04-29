# Roadmap du projet

## Vue d'ensemble

Le projet est structuré en 3 phases majeures, chacune avec des
objectifs, un scope et des critères de complétion explicites.

## Phase MVP — Fondations

**Durée estimée** : 6 à 10 semaines de développement après cadrage.

**Objectif** : remplacer l'usage d'Excel par un système structuré qui
apporte de la valeur immédiate sans ajouter de friction.

**Modules livrés** :
- Module 1 — Dashboard (avec sous-dashboards A et B, carte C en
  « Phase B »)
- Module 2 — Inventaire (saisie desktop, import legacy)
- Module 3 — Finance (marges par item et par lot, rapports de base)

**Critères de complétion** :
- Import complet des 607 enregistrements historiques avec tiering
- Saisie d'un nouveau lot depuis desktop en moins de 15 minutes
- Dashboard A affiche 5 rapports (ventes, marque, saison, fournisseur,
  canal)
- Dashboard B affiche au minimum 4 widgets opérationnels
- Authentification avec rôles (propriétaire vs partenaire)
- Déploiement fonctionnel sur Vercel avec base Supabase

**Ce qui n'est pas dans le MVP** :
- Saisie mobile optimisée (Phase B)
- Génération automatique d'annonces (Phase B)
- Intégration Marketplace (Phase B)
- CRM et pipeline leads (Phase C)
- Prédictions (Phase B)
- Intégration QuickBooks (Phase C)

## Phase B — Automatisation

**Durée estimée** : 4 à 8 semaines après MVP stabilisé.

**Condition de démarrage** : le MVP est en production depuis au moins 4
semaines, utilisé activement, et aucun bug bloquant n'est ouvert.

**Objectif** : réduire drastiquement le temps manuel entre l'acquisition
d'un lot et sa mise en vente.

**Modules livrés** :
- Module 4 — Saisie mobile optimisée avec photos
- Module 5 — Listing automatisé avec templates
- Activation du Dashboard C (Tendances)

**Critères de complétion** :
- Saisie d'un item depuis mobile en moins de 60 secondes
- Génération d'une description d'annonce en 1 clic
- Publication sur Marketplace en moins de 3 clics (si API disponible)
- Au moins 3 mois de données propres permettant des prévisions basiques

**Changement conditionnel** : si l'intégration Marketplace native est
bloquée (API restreinte), le Module 5 pivote vers la génération de
contenu pré-rempli avec copier-coller manuel.

## Phase C — Intelligence et intégration

**Durée estimée** : variable selon la maturité du business.

**Condition de démarrage** : Phase B stabilisée et volume de données
suffisant (minimum 12 mois d'app_native).

**Objectif** : automatiser les décisions récurrentes et intégrer le
système à l'écosystème comptable.

**Modules livrés** :
- Module 6 — CRM (conditionnel à la capture automatique des clients)
- Module 7 — Assistant IA (suggestions, détection, automatisation)
- Intégration QuickBooks

**Critères de complétion** : à définir lors du démarrage de Phase C,
en fonction de l'évolution du business.

## Jalons clés du projet

```
Semaine 0    Fin Phase 1 (cadrage)       ← ACTUEL
Semaine 2    Début du développement MVP
Semaine 8    MVP déployé en production
Semaine 12   MVP stabilisé, Phase B kick-off
Semaine 20   Phase B déployée
Mois 12+     Phase C à évaluer
```

## Méthodologie de livraison

Chaque module est livré **en version fonctionnelle minimale** puis
itéré. Pas de « big bang » ni de livraison massive.

L'ordre de construction recommandé à l'intérieur du MVP est :

1. Module 2 (Inventaire) — fondation
2. Module 3 (Finance) — dépend du 2
3. Module 1 (Dashboard) — consomme les données des 2 et 3

## Gouvernance du scope

Toute idée nouvelle passe par :

1. Évaluation du module concerné
2. Vérification de la phase correspondante
3. Si phase ultérieure → `docs/backlog.md`
4. Si phase en cours → validation explicite du propriétaire requise

Aucune exception. C'est le mécanisme anti-scope-creep principal du
projet.

## Activités parallèles au cadrage

Indépendamment de la séquence MVP → Phase B → Phase C, certaines
activités d'apprentissage se déroulent en parallèle pour informer
le cadrage des phases futures. Ces activités ne sont pas des phases
du projet, ce sont des **expériences ciblées** qui produisent des
apprentissages exploitables.

### Prototype d'apprentissage stealth

**Démarrage** : avril 2026
**Durée maximale** : 6 mois
**Objectif** : tester en conditions réelles le workflow acquisition
→ photo → reconnaissance → enrichissement → publication Marketplace,
pour informer le cadrage du Module 4 (Saisie mobile) et du Module 5
(Listing automatique) en Phase B.

**Périmètre** : 3-5 lots, 30-50 kits, codes T##-## (voir ADR-018).

**Caractéristiques** :

- **Hors scope MVP, hors scope Phase B, hors scope Phase C**
- Outil **transitoire** avec date de mort programmée (Module 4
  prend le relais)
- Données migrables en `legacy_migrated` avec sous-marqueur
  `legacy_source = stealth_test`
- Apprentissages documentés progressivement dans
  `docs/apprentissages-stealth-test.md`

**Documentation détaillée** :
`docs/apprentissage-stealth-test.md`

### Étiquetage physique avec imprimante Zebra

**Statut** : exploration parallèle envisagée (non démarrée)
**Référence** : `docs/12-integration-physique-reseau.md` section
"Apprentissage parallèle (hors MVP)"

Mika peut commencer à tester l'étiquetage imprimé sur des pneus
réels avec un kit Zebra (imprimante + étiquettes test + ruban) sans
toucher au code de l'app. Cette exploration informe le cadrage de
l'intégration physique pour Phase B/C.

---
