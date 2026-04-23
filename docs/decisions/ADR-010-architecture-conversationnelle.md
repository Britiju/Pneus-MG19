# ADR-010 — Architecture conversationnelle hybride

## Statut

Vision long terme — capturée pour scalabilité latente. Phase B/C.

## Contexte

Des fonctionnalités de saisie vocale et d'IA conversationnelle sont
identifiées comme à forte valeur (voir backlog). Sans architecture
explicite, le risque est de construire le MVP autour de l'IA et de
créer une dépendance fragile, ou d'ignorer complètement la voix et
de devoir refactorer plus tard.

Ce ADR capture la philosophie architecturale pour guider les décisions
de design dès le MVP, sans implémenter la voix maintenant.

## Décision

### Principe fondamental

L'application est fondamentalement une **app à formulaires
traditionnels**. La couche conversationnelle (voix, IA) s'ajoute
par-dessus sans jamais être la base.

### Hiérarchie des interfaces (couches)

```
Couche 0 : Formulaires HTML de base    (toujours fonctionnels — MVP)
Couche 1 : JavaScript interactif       (UX enrichie — MVP)
Couche 2 : Mobile responsive           (tactile-friendly — MVP)
Couche 3 : Saisie vocale               (accélération — Phase B)
Couche 4 : IA conversationnelle        (intelligence — Phase C)
```

**Règle de cascade** : chaque couche doit tomber en graceful degradation
sur la précédente si elle échoue. Un utilisateur sans microphone ou
sans connexion IA doit pouvoir utiliser l'app normalement.

### Alignement avec Principe 12

Ce ADR formalise le Principe 12 : *"Formulaires d'abord, IA en
enrichissement."* Si une fonctionnalité ne peut pas être décrite comme
un formulaire simple, elle n'est pas mûre pour le MVP.

### Impacts concrets sur le MVP

Ne **pas** construire la voix au MVP.

**Mais** structurer le modèle de données pour accueillir l'enrichissement
progressif futur :

- Statuts intermédiaires de Lot : `en_prospection` / `en_negociation` /
  `achete` (pour capturer le cycle de vie complet avant achat)
- `prix_achat_alloue` nullable (kit peut être créé avant d'avoir un prix)
- Photos rattachables à tout moment (kit ou variante)
- Enrichissement progressif : kit peut exister à l'état `shell` (code
  attribué, attributs à compléter) → `description_partielle` →
  `caracterise` → `en_stock`

Ces choix permettent d'implémenter la saisie vocale en Phase B sans
modifier le modèle de données.

### Exemples d'usages futurs (Phase B/C)

**Saisie terrain** :
- Utilisateur dicte : *"Michelin 225/65r17 hiver 9mm"*
- IA extrait et pré-remplit les champs
- Utilisateur valide ou corrige
- Le formulaire sous-jacent reste toujours fonctionnel

**Consultation mobile** :
- *"Combien j'ai payé en moyenne pour des Michelin hiver?"*
- IA requête la base et répond en langage naturel

**Initiation d'achat** :
- *"J'ai un lot de 15 kits pour 2200$"*
- Crée 15 kits shells avec allocation initiale suggérée
- Mika complète les détails kit par kit

## Justification

- Évite le risque de fragmentation (MVP fonctionnel même sans IA)
- Prépare techniquement la Phase B sans sur-construire
- Alignement avec Principe 6 (la technologie suit le besoin réel) et
  Principe 7 (scalabilité latente)

## Conséquences

### Positives

- MVP robuste et simple, pas dépendant de l'IA
- Migration vers Phase B sans refactor de modèle de données
- Utilisateurs non-techniques peuvent utiliser l'app sans apprentissage

### Négatives

- Design de formulaires qui semblent "trop simples" pour certaines
  fonctionnalités potentiellement vocales
- Résistance à la tentation d'ajouter la voix "juste pour tester"
  au MVP

## Alternatives considérées

1. **Voix dès le MVP** — rejeté car fragilité, dépendance APIs tierces,
   complexité hors-scope
2. **Architecture voix-first** — rejeté car casse la règle "formulaires
   d'abord" et crée une dépendance inversée
3. **Ne rien planifier** — rejeté car risque de refactor coûteux en
   Phase B

## Auteur

Principe émergé des discussions Paquet 1, formalisé pendant Paquet 2.

---
