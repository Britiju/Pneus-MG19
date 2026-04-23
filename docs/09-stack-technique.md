# Stack technique

## Statut de ce document

**En cours de formalisation.** Les choix principaux sont connus, les
détails d'implémentation seront précisés en Phase 4 (design technique)
avant le début du développement MVP.

## Choix principaux validés

### Hébergement et déploiement

**Vercel** — plateforme d'hébergement pour l'application web.

Choix justifié par :

- Intégration native avec GitHub (déploiement automatique sur push)
- Support de Next.js (framework probable — à confirmer Phase 4)
- Tier gratuit suffisant pour la phase MVP
- Fonctions serverless incluses (pour les endpoints API)
- URLs de preview par branche (utiles pour tests partenaires)

### Base de données et authentification

**Supabase** — Postgres géré + authentification + API auto-générée.

Choix justifié par :

- Postgres solide (standard ouvert, pas de lock-in propriétaire)
- Row-Level Security (RLS) pour les permissions futures
- Authentification intégrée (email, OAuth, magic links)
- Tier gratuit généreux pour la phase MVP
- API REST et GraphQL auto-générées
- Support natif de la réplication et des backups
- Path de migration clair vers Postgres self-hosted si nécessaire

### Source de code et collaboration

**GitHub** — repo privé `Britiju/Pneus-MG19`.

- Gestion des issues et du backlog si besoin
- Pull Requests pour la revue de code (Phase 4+)
- GitHub Actions possibles pour CI/CD (à définir)

### Outils de développement assistés

**Claude Code** — assistant de développement intégré.

- Lecture automatique de `CLAUDE.md` au démarrage
- Utilisé pour les mises à jour de documentation et le développement
  du code
- Accès direct au repo GitHub via intégration Git

## Choix à formaliser en Phase 4

### Framework frontend

Candidat principal : **Next.js** (React, SSR, intégration Vercel).

Alternatives considérées :
- Remix (bon, mais moins d'intégration Vercel native)
- SvelteKit (plus léger, mais écosystème plus petit)

Décision finale en Phase 4.

### Bibliothèque de composants UI

Candidats :
- **shadcn/ui** + Tailwind CSS (recommandé, voir ADR-003)
- Radix UI + Tailwind
- Mantine

Décision finale en Phase 4.

### Gestion d'état

Candidats :
- React Query / TanStack Query (serveur state)
- Zustand (client state léger)
- Contexte React natif (suffisant pour MVP?)

Décision finale en Phase 4 selon la complexité estimée.

### Testing

Outils probables :
- Vitest ou Jest (tests unitaires)
- Playwright (tests end-to-end)
- Testing Library (tests de composants)

Décision finale en Phase 4.

### Monitoring et observabilité

À définir en Phase 4. Options :
- Vercel Analytics (basique, inclus)
- Sentry (erreurs runtime)
- LogRocket (replay de sessions — potentiellement intrusif)

## Architecture technique macro

### Structure du projet (prévue)

```
pneus-mg19/
├── app/                  # Routes Next.js (App Router)
│   ├── (auth)/           # Pages authentification
│   ├── dashboard/        # Module 1
│   ├── inventaire/       # Module 2
│   └── finance/          # Module 3
├── components/           # Composants React réutilisables
├── lib/                  # Utilitaires, clients Supabase, helpers
├── supabase/             # Migrations SQL, types générés
├── docs/                 # Documentation (ce dossier)
└── tests/                # Tests
```

**Note** : structure à valider en Phase 4.

### Modèle de données

Détails dans `docs/06-modele-donnees.md`.

Résumé : Lot → Kit → Variante, avec journal d'événements parallèle.
Trois identifiants par entité (uuid, internal_id, display_code) pour
la scalabilité latente.

### Authentification

**MVP** : email + mot de passe via Supabase Auth.

Tous les utilisateurs authentifiés ont accès complet (ADR-007).

**Évolution future** : permissions granulaires via Row-Level Security
de Supabase quand le contexte le justifiera (voir backlog).

### APIs externes envisagées (Phases B et C)

Aucune au MVP. Pour référence future :

- **Whisper** (OpenAI) — transcription vocale (Phase B)
- **Claude API** (Anthropic) — extraction structurée (Phase B)
- **Facebook Marketplace API** — listing automatique (Phase B,
  conditionnel)
- **QuickBooks API** — intégration comptable (Phase C)

## Environnements

### Développement local

- Base Supabase locale (via CLI) ou cloud (dev tier)
- Next.js dev server
- Variables d'environnement dans `.env.local` (non versionné)

### Staging

À définir en Phase 4. Probablement : branche `develop` déployée
automatiquement sur un sous-domaine Vercel (`staging.pneus-mg19.com`
ou équivalent).

### Production

- Branche `main` déployée automatiquement par Vercel
- Base Supabase production distincte
- Domaine final à définir

## Conventions de code

À formaliser en Phase 4. Base :

- TypeScript strict
- ESLint + Prettier (configuration à définir)
- Commits atomiques décrivant le **pourquoi** (voir `CLAUDE.md`)
- Branches par feature (`feature/`, `fix/`, `refactor/`)
- Pull Requests revues avant merge (quand l'équipe s'élargit)

## Considérations de sécurité

### Au MVP

- HTTPS partout (géré par Vercel)
- Authentification obligatoire (pas d'accès anonyme)
- Variables d'environnement pour les secrets (pas dans le repo)
- RLS Supabase activé même si permissions ouvertes (future-proofing)

### À prévoir en Phase B/C

- Permissions granulaires via RLS
- Audit logging centralisé
- Rotation des secrets
- Pentesting avant ouverture à plus d'utilisateurs

## Performances

### Cibles au MVP

- Page d'accueil chargée en < 2s sur mobile 4G
- Recherche inventaire avec résultats en < 1s
- Saisie d'un kit complet en < 15s (lot de 8 kits ≈ 2 minutes)

### Optimisations prévues

- Index Postgres sur les colonnes de recherche fréquente
  (`display_code`, `marque`, `taille`, `saison`)
- Pagination systématique (pas de liste infinie)
- Caching côté serveur pour les dashboards (données peu changeantes)

## Coûts estimés

### Au MVP (ordre de grandeur mensuel)

- Vercel : 0 $ (tier gratuit suffisant)
- Supabase : 0 $ (tier gratuit suffisant)
- Domaine : ~15 $ / an (si domaine dédié)
- Total MVP : < 5 $ / mois

### Phase B/C (ordre de grandeur)

- Vercel Pro : 20 $ / mois
- Supabase Pro : 25 $ / mois
- APIs externes (Whisper, Claude) : variable, estimé 20-100 $ / mois
- Total estimé : 70-150 $ / mois

## Auteur et évolution

Document créé pendant le cadrage Paquet 1 pour combler une référence
manquante dans `CLAUDE.md`. Sera enrichi progressivement en Phase 4
(design technique) puis maintenu tout au long du projet.

**Dernière mise à jour** : Phase 1 de cadrage, Paquet 1.

---
