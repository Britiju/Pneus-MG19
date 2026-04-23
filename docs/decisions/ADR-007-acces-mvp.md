# ADR-007 — Modèle d'accès au MVP : ouvert + traçabilité

## Statut

Acceptée — Phase 1 de cadrage, Paquet 1.

## Contexte

Le système doit gérer plusieurs utilisateurs (Mika + partenaires
occasionnels). Deux philosophies s'opposent :

**Philosophie restrictive** : chaque rôle a des permissions granulaires.
Les partenaires ne peuvent pas modifier les données sensibles.
Workflow d'approbation pour certaines actions.

**Philosophie ouverte** : tout le monde a accès à tout. La protection
repose sur la traçabilité complète et la confiance mutuelle.

## Décision

**Au MVP, l'approche ouverte est choisie** :

### Principe d'accès ouvert au MVP

- **Tous les utilisateurs authentifiés ont accès à toutes les
  fonctionnalités**
- Pas de restrictions basées sur le rôle
- Les partenaires peuvent saisir, modifier, vendre, annuler, rembourser
- Les décisions sont prises par la **confiance mutuelle** (cercle
  restreint)

### Protection par traçabilité

La protection des données ne repose **pas** sur les permissions, mais
sur :

- **Journal d'événements complet** : chaque action est horodatée et
  attribuée à un utilisateur
- **Workflows explicites** pour les actions sensibles (voir ADR-004,
  005, 006)
- **Principe d'immutabilité** : aucune action ne peut être "effacée"
- **Messages pédagogiques** : l'app explique ce qui est fait et les
  conséquences

### Authentification

Chaque utilisateur a son propre compte. Pas de compte partagé. Pas
d'anonymat dans le journal.

## Justification

### Pourquoi pas de permissions granulaires au MVP?

**Argument #1 — Les utilisateurs actuels sont des amis de confiance**
Mika travaille avec des partenaires qui sont des proches. Mettre des
barrières serait insultant et ralentirait inutilement.

**Argument #2 — Volume faible permet la surveillance manuelle**
Au volume actuel (~500 items/an), Mika peut superviser toutes les
actions importantes en consultant le journal le soir.

**Argument #3 — Permissions granulaires sont du MVP killer**
Implémenter proprement un système de rôles ajoute des semaines de
travail MVP sans valeur tangible pour le volume actuel.

**Argument #4 — Scalabilité latente**
L'architecture d'authentification et le journal d'événements
permettent d'ajouter les permissions plus tard sans refactor majeur.

### Pourquoi la traçabilité suffit?

- Si un partenaire fait une erreur → Mika le voit dans le journal le
  soir → ils en discutent → pas besoin de workflow automatisé
- Si un partenaire fait une action malveillante → l'acte est
  irréversible dans le système (immutabilité), mais visible
- La relation de confiance gère le reste

## Évolution future (Phase B / C)

Les éléments suivants sont **officiellement dans le backlog** et
seront activés si/quand nécessaire :

1. **Permissions granulaires par rôle**
   - Rôle "propriétaire" : accès complet
   - Rôle "partenaire" : accès limité (pas de données financières)
   - Rôle "employé" : workflows guidés seulement

2. **Workflow d'approbation partenaire → Mika**
   - Les partenaires peuvent demander des corrections
   - Mika approuve ou rejette
   - Vérification photo de l'étiquette physique

3. **Dashboard admin d'audit**
   - Vue synthétique de toutes les actions par utilisateur
   - Alertes automatiques sur patterns suspects

**Conditions d'activation** :
- Ajout d'utilisateurs moins proches (employés recrutés, partenaires
  externes)
- Volume qui empêche la surveillance manuelle par Mika
- Demande légale/comptable de contrôles stricts
- Intégration avec systèmes tiers exigeant une séparation des rôles

## Conséquences

### Positives

- MVP livrable rapidement (pas de complexité de permissions)
- UX simple (pas de "tu n'as pas accès à...")
- Partenaires non-frustrés (pas de barrières)
- Mika garde le contrôle via surveillance du journal

### Négatives

- Confiance nécessaire dans tous les utilisateurs
- Erreurs coûteuses possibles (mais immutabilité les trace)
- Si le cercle de confiance s'élargit, migration nécessaire vers
  permissions granulaires

### Atténuation

- Principe d'immutabilité garantit qu'aucune action ne peut être
  cachée
- Journal d'événements consultable à tout moment
- Messages pédagogiques expliquent l'impact de chaque action
- Authentification individuelle empêche le partage de compte

## Alternatives considérées

1. **Permissions granulaires dès le MVP** — rejeté car scope trop
   large pour un MVP, pas de valeur au volume actuel
2. **Mode "lecture seule" pour partenaires** — rejeté car contredit
   la philosophie "les partenaires aident vraiment"
3. **Approbation obligatoire de Mika pour toute action partenaire** —
   rejeté car crée un goulot d'étranglement

## Auteur

Décision prise par Mika pendant l'audit du Paquet 1. L'assistant avait
initialement proposé de restreindre les partenaires, Mika a challengé
cette recommandation en faveur d'une approche plus ouverte adaptée à
son contexte réel.

---
