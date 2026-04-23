# ADR-005 — Principe d'immutabilité des faits engagés

## Statut

Acceptée — Phase 1 de cadrage, Paquet 1.

## Contexte

Le système manipule des données à impact business et comptable
(ventes, rebuts, prix d'achat, marges). Sans règles explicites
d'intégrité, il existe un risque qu'un utilisateur (même
bien-intentionné) modifie rétroactivement des données engagées,
faussant les analyses et créant des dérives.

Le principe d'immutabilité est un standard :

- Comptable (principe de conservation des écritures)
- Légal (grand livre, contrats signés)
- Financier (transactions bancaires irrévocables)
- Technique (event sourcing, blockchain)

## Décision

Toute entité du système porte un **statut** qui définit ce qui est
modifiable ou non :

### États possibles

**`draft`** — En cours de création, non encore engagé
- Tous les attributs modifiables librement
- Pas d'impact sur les analyses
- Peut être supprimé (soft delete)

**`active`** — En service, partiellement engagé
- Modifications autorisées mais journalisées
- Chaque changement crée un événement dans le journal
- Peut transitionner vers `committed` ou retourner vers `draft`
  (rarement)

**`committed`** — Fait historique engagé, immuable
- **Aucune modification directe possible**
- Corrections uniquement via actions correctives explicites
  (annulation, contre-passation)
- Les nouvelles corrections créent de **nouveaux événements** dans le
  journal, ne modifient jamais l'original
- Visible perpétuellement dans l'historique

### Entités et règles associées

**Lot d'acquisition** :
- Devient `committed` quand au moins un kit issu de ce lot a été
  vendu
- Modifier le prix d'achat total d'un lot committed est impossible
- Corrections possibles via "ajustement de lot" (événement séparé)

**Kit** :
- `committed` quand marqué `vendu` ou `rebute_total`
- Notes peuvent toujours être ajoutées (enrichissement historique)
- Attributs (marque, usure, prix) immuables après commit
- Exception : workflow d'annulation de vente (voir ADR-006) fait
  repasser le kit à `en_stock`, avec trace complète

**Vente** :
- `committed` à la fin de la journée (ou délai configurable)
- Avant : modifications libres (annulation simple)
- Après : seulement via événements correctifs (retour, indemnisation,
  annulation post-commit)

**Code d'étiquette (display_code)** :
- Modifiable uniquement via le workflow "Code différent" (voir ADR-004)
- Ne peut jamais être effacé
- Un code voided reste voided pour toujours

### Garde-fous techniques

Le principe est enforcé à **trois niveaux** de défense :

**1. Validation applicative**
Le code de l'app refuse les modifications interdites. Messages d'erreur
clairs : *"Ce kit est vendu, modification interdite. Utilise
'Annulation de vente' si nécessaire."*

**2. Contraintes base de données**
Des triggers SQL bloquent les modifications directes en base, même via
accès admin. Défense en profondeur.

**3. Soft delete systématique**
Aucune donnée n'est jamais effacée physiquement. Toute "suppression"
est un changement de statut (`archive` ou autre flag).

### Actions correctives disponibles

Pour chaque entité, des actions correctives explicites existent :

- **Vente** : annulation de vente (ADR-006)
- **Kit vendu à corriger** : passer par annulation → modification →
  revente
- **Lot avec prix erroné après ventes** : créer un lot ajusteur
  (événement séparé)
- **Code mal attribué** : workflow "Code différent" (ADR-004)

## Justification

- Intégrité des analyses : les chiffres du Dashboard reflètent la
  réalité historique, pas une "version actuelle réécrite"
- Conformité comptable préparée : alignement avec QuickBooks (Phase C)
- Traçabilité parfaite : chaque décision passée est auditable
- Sécurité : un partenaire ne peut pas "effacer ses traces"
- Alignement avec les principes 8 et 9 des règles du projet

## Conséquences

### Positives

- Système robuste contre les erreurs humaines
- Audit trail complet pour comptabilité future
- Conformité prête pour intégrations (QuickBooks, APIs externes)
- Fiabilité des analyses et KPIs
- Principe standard de l'industrie respecté

### Négatives

- Plus de lignes de code que pour un système "laxiste"
- Workflows correctifs nécessaires (complexité légèrement accrue)
- Onboarding utilisateur : expliquer "pourquoi je ne peux pas juste
  modifier"

### Atténuation des négatifs

- Messages d'erreur pédagogiques (expliquent l'action alternative)
- Aide contextuelle dans l'app
- Les actions correctives sont simples (bouton, confirmation, fait)

## Alternatives considérées

1. **Édition libre partout** — rejeté car casse l'intégrité et
   l'audit trail
2. **Immutabilité absolue sans actions correctives** — rejeté car
   empêche de corriger les erreurs réelles
3. **Permissions admin pour tout modifier** — rejeté car viole le
   principe même d'immutabilité

## Auteur

Principe énoncé par Mika pendant la session d'audit, formalisé avec
l'assistant Claude.

---
