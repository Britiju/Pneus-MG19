# Pratiques à adopter avant le MVP

## Pourquoi ce document existe

Pendant le cadrage, plusieurs décisions ont été prises qui ne
dépendent pas de l'app pour commencer à être appliquées. Les adopter
**dès maintenant** dans les outils actuels (Excel) apporte deux
bénéfices :

**1. Debug du concept dans la vraie vie**
Tester les conventions avant l'app révèle les problèmes
d'ergonomie, de vocabulaire, de cas particuliers. Bien mieux que de
les découvrir après 2 mois de développement.

**2. Migration plus facile**
Le jour où l'app est prête, les données sont déjà au bon format. Pas
de chantier massif d'inventaire ou de reformatage au moment critique
de la bascule.

## Comment utiliser ce document

Chaque pratique est :

- **Immédiatement applicable** dans les Excel actuels
- **Cohérente** avec une décision de cadrage déjà prise
- **Simple** à mettre en œuvre (pas de nouvel outil requis)

Si une pratique s'avère trop lourde ou pose un problème non prévu,
c'est un signal utile pour le cadrage. Rapporter le problème pour
ajuster.

---

## Pratique 1 — Capturer l'emplacement de chaque kit

**Décision liée** : ADR-012 (Gestion des emplacements physiques)

### Action immédiate

Ajouter une colonne **"Emplacement"** dans les Excel actuels
(`Database_Pneus_Unifiee.xlsx` et tout autre fichier d'inventaire).

Remplir cette colonne pour **chaque kit existant** (~130 kits
actuellement). Ne pas paniquer : c'est une demi-journée de travail
max.

### Convention de nommage des emplacements

**Noms courts, clairs, stables dans le temps.**

Exemples suggérés :

- `Entrepôt A` ou un nom distinctif (rue, localisation)
- `Entrepôt B`
- `Conteneurs`
- `Entrepôt C` (quand il arrivera)

**À éviter** :

- Noms trop longs ("Entrepôt principal rue Principale à L'Ange-Gardien")
- Noms qui changent (genre "Chez Jean" qui ne marchera plus quand
  Jean partira)
- Noms ambigus ("L'autre entrepôt")

### Mise à jour au fil des mouvements

À chaque déplacement physique d'un kit d'un emplacement à un autre :

1. Mettre à jour la colonne Emplacement dans l'Excel
2. **Optionnellement**, noter la date du mouvement dans une colonne
   "Dernier mouvement" (pas obligatoire, mais utile)

### Bénéfice immédiat

- Fin du problème "deux Excel pour gérer les emplacements"
- Préparation parfaite pour l'import initial dans l'app
- Test réel de la convention de nommage

---

## Pratique 2 — Capturer le prix affiché en plus du prix vendu

**Décision liée** : ADR-011 (Pricing au MVP)

### Action immédiate

Ajouter une colonne **"Prix affiché"** (ou "Prix publié") dans les
Excel actuels.

Saisir le prix **au moment de publier l'annonce** sur Marketplace,
pas seulement au moment de la vente.

Le prix de vente final (déjà capturé aujourd'hui) reste dans sa
colonne actuelle.

### Convention

- **Prix affiché** : le prix écrit dans l'annonce Marketplace au
  moment de la publication. Tout inclus (taxes comprises pour les
  particuliers).
- **Prix vendu** : le prix final payé par le client (après
  négociation).

### Attention

Ne pas mettre à jour le "Prix affiché" si tu baisses le prix dans
Facebook plus tard. Le champ capture le **prix initial** de
publication. Les baisses intermédiaires ne sont pas trackées (c'est
une feature Phase B, voir ADR-011).

### Bénéfice immédiat

- Mesure du rabais moyen par catégorie
- Debug de la convention avant l'app
- 12+ mois de données propres quand l'app démarrera

---

## Pratique 3 — Standardiser le vocabulaire "saisons restantes"

**Décision liée** : ADR-011 (Pricing au MVP, catégorisation usure)

### Action immédiate

Quand tu rédiges tes annonces Marketplace, utilise le vocabulaire
standardisé :

| Usure (32e) | Formulation standardisée   |
|-------------|----------------------------|
| 10-11       | "4-5 saisons restantes"    |
| 8-9         | "3-4 saisons restantes"    |
| 7           | "2-3 saisons restantes"    |
| 6           | "2 saisons restantes"      |
| 5           | "1-2 saisons restantes"    |
| 4 et moins  | "1 saison restante max"    |

### Pourquoi standardiser

- Les acheteurs s'habituent à un vocabulaire cohérent
- Facilite la génération automatique de descriptions dans l'app
- Débug du vocabulaire avant l'app

### Attention

Toujours annoncer en **fourchette**, pas en chiffre unique. C'est
plus honnête avec la variabilité d'usage réel.

---

## Pratique 4 — Démarrer la numérotation A247 pour les nouveaux kits

**Décision liée** : ADR-004 (Système de numérotation)

### Action immédiate

Pour les **nouveaux lots achetés** à partir de maintenant, commencer
à utiliser le format `A247` (1 lettre + 3 chiffres).

**Les kits existants** gardent leur numérotation actuelle (1A, V01,
etc.) conformément à la cohabitation des 3 conventions (voir
ADR-004).

### Mécanisme simple pour commencer

Sans l'app, tu ne peux pas avoir le système des 50 ancres avec
réservation de plage. Mais tu peux commencer **plus simplement** :

1. Ouvrir un petit fichier de suivi (Excel ou texte)
2. Noter : "Prochain code disponible : A001"
3. À chaque lot acheté, réserver une plage (ex: A001 à A015 pour un
   lot de 15 kits), marquer "Prochain code : A016"
4. Étiqueter les pneus avec les codes réservés

**Ce que tu perds** par rapport à la version app :

- Pas d'aléatoire entre les plages (tes codes seront séquentiels
  prévisibles jusqu'à la bascule)
- Pas de bouton "Annuler la réservation"
- Pas de journal d'événements

**Ce que tu gagnes** :

- Vocabulaire standardisé dès maintenant
- Habitude de réserver des plages
- Cohérence visuelle des étiquettes au marqueur

### Attention

Le jour de la bascule dans l'app, il faudra que le système "sache"
que les codes A001 à AXXX (ce que tu auras utilisé) sont déjà pris.
L'app devra commencer ses ancres à partir de cet état, pas de zéro.

---

## Pratiques à venir (à ajouter au fil des décisions)

Ce document grandit avec le cadrage. Chaque fois qu'une décision peut
être pratiquée avant l'app, elle vient s'ajouter ici.

**Anticipation pour le Paquet 2 (en cours)** :

- Capture du type de client (particulier vs commerce) sur chaque
  vente
- Capture des termes de paiement pour les commerces
- Capture des coordonnées complètes pour les commerces

**Anticipation pour le Paquet 4 (mécaniques de vente)** :

- Potentiellement des conventions sur les canaux de vente
- Potentiellement des conventions sur les rendez-vous

**Anticipation pour le Paquet 8 (stratégie de bascule)** :

- Possiblement un sous-ensemble d'exercices à faire pour tester la
  migration

---

## Ce document n'est PAS

- Une liste exhaustive de ce que fait l'app future (voir ADR et docs
  modules pour ça)
- Un plan de projet (voir roadmap)
- Une spec technique (voir modèle de données)

C'est un **plan d'action immédiat** pour Mika. Court, pratique,
actionnable cette semaine.

---

## Historique des mises à jour

- **Paquet 2** : création du document, 4 pratiques initiales
  (emplacements, prix affiché, vocabulaire saisons, numérotation
  A247).

**À compléter** au fil des décisions futures.

---
