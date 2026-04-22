# Contexte du projet pour Claude Code

## Qui lit ce fichier
Claude Code lit automatiquement ce fichier au démarrage de chaque session.
Ce fichier est la source de vérité du contexte projet.

## Le projet en une phrase
Plateforme web pour gérer le cycle de vie complet d'un inventaire de pneus
usagés — de l'acquisition à la vente, avec dashboards analytiques.

## Le propriétaire
Mika est le propriétaire. Le projet vise à libérer Mika des tâches
opérationnelles répétitives via un système fool-proof opérable par
un employé non-spécialiste.

## Les utilisateurs actuels
- Mika (propriétaire)
- 1-2 partenaires occasionnels
- À terme : employés opérationnels (le système doit être exploitable
  sans tribal knowledge)

## Stack technique prévue
- GitHub pour le code source et la documentation
- Vercel pour l'hébergement web
- Supabase pour la base de données et l'authentification

## Phases du projet
- MVP : Modules 1 (Dashboard), 2 (Inventaire), 3 (Finance)
- Phase B : Modules 4 (Saisie mobile), 5 (Listing automatique)
- Phase C : Modules 6 (CRM), 7 (AI assistant)

## Règles absolues du projet
1. Aucune feature ne doit augmenter le temps de traitement actuel
2. Le scope MVP est figé — les idées hors-scope vont dans docs/backlog.md
3. Les données historiques (legacy) et nouvelles sont séparées par tiering
4. Architecture modulaire — chaque module est isolé et remplaçable
5. Mobile-first responsive web — pas d'app native au MVP

## Navigation dans la documentation
- docs/01-vision-produit.md : le pourquoi du projet
- docs/02-personae-utilisateurs.md : qui utilise l'app
- docs/03-cycle-de-vie.md : les étapes métier
- docs/04-modules.md : découpage architectural
- docs/05-dashboard.md : spécification du Module 1
- docs/06-data-model.md : modèle de données
- docs/07-data-quality-tiers.md : gestion legacy vs nouveau
- docs/08-roadmap.md : séquencement des livraisons
- docs/09-stack-technique.md : choix techniques détaillés
- docs/10-ux-design-system.md : patterns UI
- docs/sessions/ : fiches de déconstruction des 8 étapes
- docs/decisions/ : ADR (Architecture Decision Records)

## Conventions de code (à compléter en Phase 4)
À définir quand la stack technique sera validée.

## Instructions pour Claude Code
- Lis TOUJOURS ce fichier d'abord
- Pour chaque tâche, identifie le(s) document(s) pertinent(s) dans docs/
- Ne dévie jamais du scope MVP sans validation explicite
- Respecte l'architecture modulaire — un module ne dépend pas d'un autre
- Les commits doivent être atomiques et décrire le "pourquoi", pas le "quoi"
- Pose des questions si le contexte est ambigu — ne devine pas
