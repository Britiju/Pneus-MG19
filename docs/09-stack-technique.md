# Stack technique

## Statut

Stack retenue au MVP. Les détails d'implémentation (versions,
configurations, conventions) seront documentés en Phase 4
(Solutions Architect).

## Composants retenus

### GitHub — Gestion du code source et de la documentation

**Rôle** : hébergement du code source, de la documentation et de
l'historique des décisions.

**Usage au MVP** :
- Code source de l'application
- Documentation (`docs/`, `CLAUDE.md`, ADR)
- Revue de code et collaboration

### Vercel — Hébergement web

**Rôle** : déploiement et hébergement de l'application frontend et
des fonctions serverless.

**Usage au MVP** :
- Déploiement continu depuis GitHub (main → production)
- Preview deployments par branche/PR
- Fonctions serverless pour la logique backend légère

**Avantages retenus** :
- Intégration native GitHub
- Zéro configuration pour les frameworks modernes (Next.js)
- Plan gratuit suffisant au volume MVP

### Supabase — Base de données et authentification

**Rôle** : base de données PostgreSQL managée + authentification
utilisateurs + storage fichiers.

**Usage au MVP** :
- Base de données PostgreSQL (Lots, Kits, Variantes, Événements)
- Authentification (comptes utilisateurs, sessions)
- Storage (photos des kits)
- Row Level Security pour les règles d'accès futures

**Avantages retenus** :
- PostgreSQL natif (contraintes UNIQUE, triggers pour immutabilité —
  voir ADR-005)
- SDK JavaScript/TypeScript disponible
- Plan gratuit suffisant pour le volume MVP
- Scalabilité vers paid tier sans refactor

## Décisions techniques non tranchées (Phase 4)

Les éléments suivants seront documentés par le Solutions Architect :

- Framework frontend (Next.js pressenti)
- Librairie de composants UI (shadcn/ui pressenti — voir
  `docs/10-ux-design-system.md`)
- Stratégie de migrations de base de données
- Conventions de nommage (tables, colonnes, API)
- Stratégie de tests

## Référence

Voir `docs/08-roadmap.md` pour le séquencement des phases.
Voir `docs/10-ux-design-system.md` pour les choix UI/design.

---
