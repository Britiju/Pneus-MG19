# ADR-006 — Gestion des événements post-vente

## Statut

Acceptée — Phase 1 de cadrage, Paquet 1.

## Contexte

Dans la vente de pneus usagés, les événements post-vente (retours,
indemnisations, échanges) sont **fréquents** — estimés à 5-15% des
transactions. Sans une gestion structurée, ces événements deviennent
des sources de dérive comptable et analytique.

Le système doit gérer plusieurs types d'événements post-vente, chacun
ayant des impacts différents sur l'inventaire, les finances, et
l'historique.

## Décision

**Cinq types d'événements post-vente** sont supportés au MVP :

### 1. Annulation de vente (erreur de saisie)

**Cas d'usage** : utilisateur a marqué par erreur une vente (mauvais
client, mauvais kit, mauvaise date). Les pneus n'ont jamais
physiquement bougé.

**Effet** :
- Vente originale → statut `annulée`
- Kit revient au statut `en_stock`
- **Pas d'impact financier** (pas de vraie transaction)
- Événement journalisé avec raison

**Restrictions** : normalement exécutée rapidement après l'erreur. Si
plusieurs jours écoulés, considérer si ce n'est pas plutôt un retour.

### 2. Retour complet

**Cas d'usage** : client ramène tous les pneus d'un kit vendu, tu
rembourses le montant total.

**Effet** :
- Vente → statut `retournée`
- Kit (ou variante) → retour à `en_stock`
- Remboursement enregistré (impact caisse : -montant)
- Événement journalisé avec raison du retour

**Comportement par défaut** (MVP) : les pneus reviennent sous leur
code original, caractéristiques inchangées (principe 99% des cas,
validé par Mika).

**Ajustements manuels possibles** après retour si dégradation :
- Rebut partiel (voir modèle données)
- Note ajoutée au kit
- Prix de vente ajusté (si remis en vente)

### 3. Retour partiel

**Cas d'usage** : client ramène une partie des pneus (ex: 2 sur 4) et
tu rembourses proportionnellement.

**Effet** :
- Création de variantes sur le kit si pas déjà existantes
- La variante retournée revient à `en_stock`
- La variante gardée reste `vendue`
- Remboursement partiel enregistré
- Événement journalisé

### 4. Indemnisation / rabais post-vente

**Cas d'usage** : client garde tous les pneus mais signale un défaut
(usure sous-estimée, micro-craquelure découverte). Tu lui accordes un
rabais a posteriori.

**Effet** :
- Kit reste `vendu` (pas de retour physique)
- Prix de vente effectif ajusté (= prix original - indemnisation)
- Impact caisse : -montant indemnisé
- Marge sur ce kit diminue
- Événement journalisé avec raison

**Impact analytique** : la marge nette affichée reflète
l'indemnisation, pas la marge brute théorique.

### 5. Échange

**Cas d'usage** : client ramène un kit qui ne convient pas, repart
avec un autre kit à la place. Possiblement avec delta financier.

**Effet** : combinaison technique de deux événements liés :
- Retour (complet ou partiel) du kit #1
- Nouvelle vente du kit #2
- Delta financier : +, -, ou 0 selon le delta de prix
- Référence croisée dans le journal pour audit

## Workflow utilisateur

Sur une vente existante, bouton **"Post-vente"** toujours accessible
(si la vente n'est pas elle-même annulée).

Clic → modal proposant les 4 options principales :
- Annuler cette vente (erreur de saisie)
- Retour de marchandise
- Indemniser le client (aucun retour)
- Échanger contre un autre kit

Chaque option ouvre un sous-workflow qui :
- Demande les détails (quantité, montant, raison)
- Confirme l'action
- Journalise l'événement
- Met à jour les entités impactées

## Principe d'immutabilité appliqué

La vente originale **n'est jamais modifiée** (principe ADR-005). Les
événements post-vente **ajoutent** des événements correctifs qui
complètent l'histoire.

Exemple : une vente de 400$ avec indemnisation de 80$ donnera :
- Événement 1 : "Vente de Kit A247 pour 400$"
- Événement 2 : "Indemnisation de 80$ sur Kit A247, raison: usure
  sous-estimée"
- **Prix effectif** calculé par l'app : 320$

## KPI dérivés (Phase B, pas MVP)

Les événements post-vente alimenteront éventuellement des KPI :

- Taux de retour par période
- Taux d'indemnisation
- Marge brute vs marge nette (après ajustements)
- Raisons principales de retour/indemnisation
- Montant moyen d'indemnisation par fournisseur (signal amélioration
  caractérisation)

**Au MVP** : les événements sont capturés mais pas analysés en
dashboard (voir backlog).

## Conséquences

### Positives

- Gestion réaliste du business (les retours sont fréquents)
- Intégrité comptable préservée
- Base solide pour KPI avancés plus tard
- Alignement avec principe d'immutabilité

### Négatives

- Plus de workflows à coder au MVP
- Formation utilisateur nécessaire sur "quel type d'événement choisir"

## Décisions connexes différées au backlog

- Workflow intégré de qualification d'état au retour (dégradé /
  inutilisable)
- KPI détaillés des retours dans le Dashboard

## Auteur

Cas identifiés et priorisés par Mika pendant la session d'audit du
Paquet 1.

---
