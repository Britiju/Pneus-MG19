# Cycle de vie d'un lot de pneus

## Vue d'ensemble

Ce document décrit les 16 étapes qu'un lot de pneus traverse, de
l'identification d'une opportunité d'achat jusqu'à la clôture comptable.

Ces étapes ont été identifiées à partir de l'analyse du processus actuel
de Mika et serviront de référence pour toutes les décisions de scope et
de priorisation.

## Les 4 phases principales

Le cycle de vie se décompose en 4 phases, chacune regroupant plusieurs
étapes opérationnelles.

### Phase A — Sourcing (avant l'achat)

Cette phase n'existe pas dans le système Excel actuel mais génère de la
valeur implicite. L'objectif du projet n'est pas de la gérer activement
au MVP, mais de capturer suffisamment de traces pour permettre son
exploitation future via un CRM dédié.

**Étape 1 — Prospection**
Mika identifie des fournisseurs potentiels (contacts existants, annonces,
bouche-à-oreille).

**Étape 2 — Évaluation**
Visite sur place, inspection rapide du lot, estimation de la valeur
marchande.

**Étape 3 — Négociation**
Discussion du prix avec le fournisseur, offres et contre-offres.

**Étape 4 — Décision**
Achat confirmé ou opportunité abandonnée. Dans les deux cas, l'information
devrait être tracée pour analyse future (combien de lots évalués vs
achetés, quels fournisseurs reviennent, etc.).

### Phase B — Acquisition et préparation

Une fois le lot acheté, il rentre physiquement dans l'inventaire et doit
être caractérisé.

**Étape 5 — Transport**
Logistique du déplacement du lot depuis le fournisseur vers l'entrepôt
de stockage.

**Étape 6 — Entreposage**
Localisation assignée dans l'un des 2-3 entrepôts utilisés. La position
exacte devient importante à l'échelle.

**Étape 7 — Caractérisation**
Inspection détaillée de chaque item : marque, taille, usure (mesure en
32e), saison, véhicule compatible, présence de jantes. Prise de photos.

**Étape 8 — Déjantage (conditionnel)**
Certains lots arrivent sur jantes et doivent être déjantés avant la mise
en vente (ou inversement, remontés sur d'autres jantes).

### Phase C — Mise en vente

L'item est maintenant caractérisé et doit être transformé en annonce.

**Étape 9 — Photos**
Shooting produit propre (distinct des photos d'inspection terrain).

**Étape 10 — Description**
Rédaction d'une annonce structurée : marque, taille, usure, véhicule
compatible, état, prix.

**Étape 11 — Pricing**
Détermination du prix affiché en fonction de la marque, de l'usure, de
la saison et des comparables historiques.

**Étape 12 — Listing**
Publication sur les canaux de vente (principalement Facebook Marketplace,
réseau personnel, clients récurrents).

### Phase D — Transaction et clôture

**Étape 13 — Leads**
Gestion des messages entrants des acheteurs potentiels.

**Étape 14 — Négociation de vente**
Discussion du prix, prise de rendez-vous pour essai ou livraison.

**Étape 15 — Vente**
Transaction finalisée, paiement reçu.

**Étape 16 — Livraison**
Remise physique des pneus au client, clôture de l'item dans l'inventaire.

### Phase E — Clôture comptable (Phase C du projet)

Non traitée au MVP ni en Phase B — réservée pour une intégration future
avec QuickBooks ou équivalent.

## Données transversales

À chaque étape, des données transversales peuvent être capturées :

- **Coûts** (directs et indirects)
- **Temps passé** par étape et par utilisateur
- **Photos et documents**
- **Historique des statuts et transitions**
- **Notes et commentaires de l'équipe**

Au MVP, toutes ces données ne sont pas nécessairement capturées
activement — mais le modèle de données est conçu pour les accueillir
quand leur capture deviendra automatique (ex: lorsque Module 5 connecte
à Marketplace, la capture des leads devient gratuite).

## Priorisation MVP

Le MVP se concentre sur la **capture structurée** des étapes 5 à 16
(Phases B, C, D). La Phase A (sourcing) est seulement capturée
minimalement (nom du fournisseur, date d'acquisition) pour alimenter un
CRM futur.

## Importance stratégique de ce document

Ce document sert de base à toutes les 8 sessions de déconstruction à
venir. Chaque session prend une ou plusieurs étapes et les analyse en
profondeur pour définir :

- Les données à capturer
- Les écrans nécessaires
- Les automatisations possibles
- Les indicateurs de performance associés

---
