# Contexte du projet pour Claude Code

## Qui lit ce fichier
Claude Code lit automatiquement ce fichier au démarrage de chaque session.
Ce fichier est la source de vérité du contexte projet.

## Le projet en une phrase
Plateforme web pour gérer le cycle de vie complet d'un inventaire de pneus
usagés — de l'acquisition à la vente, avec dashboards analytiques.

## Les propriétaires du projet

- **Patrick** — père de Mika, VP opérations dans une entreprise de
  consultation en design industriel. Porte la responsabilité architecturale,
  financière, et système du projet. Rôle applicatif : **admin**.
- **Mika** — fils de Patrick, entrepreneur talentueux. Porte la
  responsabilité opérationnelle quotidienne (vente, inventaire, relation
  client). Rôle applicatif : **power_user**.

Le projet vise à libérer Mika des tâches opérationnelles répétitives via un
système fool-proof opérable par un employé non-spécialiste. Patrick conduit
le cadrage structurel et l'architecture ; Mika est l'utilisateur principal
quotidien.

**Note terminologique importante** :
- "Propriétaires du projet" = Patrick + Mika ensemble (sens business)
- "Admin système" = Patrick seul (rôle applicatif avec accès étendus)
- "Power user" = Mika + partenaires occasionnels (rôle applicatif pour
  les opérations quotidiennes)

Voir ADR-016 pour le détail du modèle de rôles.

## Les utilisateurs actuels

- Patrick (admin)
- Mika (power_user)
- 1-2 partenaires occasionnels (power_user au MVP — voir ADR-007 et ADR-016)
- À terme : employés opérationnels (le système doit être exploitable
  sans tribal knowledge, probablement avec un rôle `partenaire` distinct —
  voir ADR-016 palier 1.5 et backlog)

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
6. Saisie d'abord, exceptions ensuite — workflow principal uniforme,
   corrections via actions explicites séparées dans le temps
7. Formulaires d'abord, IA en enrichissement — la voix et l'IA sont des
   couches optionnelles Phase B/C (voir ADR-010)
8. Cas standard d'abord — implémenter le cas 80%, les 20% restants via
   workflows séparés optionnels
9. Engagement explicite — pas de pré-remplissage automatique sur les
   données à impact business ou comptable (voir ADR-008)

## Gestion du scope creep

Avant d'implémenter une idée, poser ces 3 questions dans l'ordre :

1. **À quel module appartient cette fonctionnalité?**
2. **Ce module est-il dans le MVP?** Si non → `docs/backlog.md`, stop.
3. **Est-ce le cas standard (80%)?** Si non → workflow séparé optionnel.

Règles supplémentaires :
- Si une fonctionnalité ne peut pas être décrite comme un formulaire
  simple → elle n'est pas mûre pour le MVP (Principe 12)
- Si on ne peut pas identifier un écran unique avec un titre clair →
  l'idée est trop vague pour être codée maintenant
- En cas de doute → `docs/backlog.md` + discussion explicite avec Mika

## Mémoire persistante

Claude n'a pas de mémoire entre sessions. Au début de chaque session :

1. **Lire ce fichier** (fait automatiquement)
2. **Consulter `docs/questions-ouvertes.md`** — sujets en cours non
   tranchés et contexte des discussions précédentes
3. **Consulter les ADR concernés** — toutes les décisions passées sont
   formalisées dans `docs/decisions/`
4. **Ne jamais présumer d'un contexte non documenté** — si une décision
   n'est pas dans un ADR, considérer qu'elle n'est pas encore prise

## Pour démarrer une session de cadrage

**Lis ces deux documents en priorité** :

1. **`docs/journal-avancement.md`** — état actuel du projet,
   prochaine étape prévue, questions ouvertes actives
2. **`docs/protocole-sessions.md`** — comment conduire une session
   avec Mika, patterns à respecter, checklist de fermeture

Ces deux documents te donneront tout le contexte nécessaire pour
proposer une suite productive à Mika.

## Navigation dans la documentation
- docs/journal-avancement.md : cerveau externe du projet — état actuel et prochaine étape (LIRE EN PRIORITÉ)
- docs/protocole-sessions.md : protocole de conduite des sessions avec Mika (LIRE EN PRIORITÉ)
- docs/01-vision-produit.md : le pourquoi du projet (13 principes)
- docs/02-personae-utilisateurs.md : qui utilise l'app
- docs/03-cycle-de-vie.md : les étapes métier
- docs/04-modules.md : découpage architectural
- docs/05-dashboard.md : spécification du Module 1
- docs/06-modele-donnees.md : modèle de données (Lot → Kit → Variantes)
- docs/07-data-quality-tiers.md : gestion legacy vs nouveau
- docs/08-roadmap.md : séquencement des livraisons
- docs/09-stack-technique.md : choix techniques détaillés
- docs/10-ux-design-system.md : patterns UI
- docs/11-integration-quickbooks.md : vision stratégique intégration comptable (Phase C)
- docs/12-integration-physique-reseau.md : appareils physiques (imprimantes, scanners, terminaux) et topologie réseau
- docs/13-integration-canaux-vente.md : vision stratégique des canaux de vente (Google Calendar, site web, commerce comptoir, CRM, Messenger)
- docs/apprentissage-stealth-test.md : prototype d'apprentissage parallèle au cadrage (workflow photo → reconnaissance → Marketplace), avec date de mort programmée
- docs/questions-ouvertes.md : sujets en cours non tranchés
- docs/backlog.md : idées hors-scope capturées pour évaluation future
- docs/pratiques-pre-mvp.md : pratiques à adopter dans les Excel actuels avant la bascule MVP
- docs/sessions/ : archives des sommaires de cadrage exécutés (voir docs/sessions/README.md — documents historiques, ne pas ré-exécuter)
- docs/decisions/ : ADR (Architecture Decision Records)

## Conventions de code (à compléter en Phase 4)
À définir quand la stack technique sera validée.

## Instructions pour Claude Code
- Lis TOUJOURS ce fichier d'abord
- Consulte `docs/questions-ouvertes.md` si le sujet est complexe
- Pour chaque tâche, identifie le(s) document(s) pertinent(s) dans docs/
- Ne dévie jamais du scope MVP sans validation explicite
- Respecte l'architecture modulaire — un module ne dépend pas d'un autre
- Les commits doivent être atomiques et décrire le "pourquoi", pas le "quoi"
- Pose des questions si le contexte est ambigu — ne devine pas
