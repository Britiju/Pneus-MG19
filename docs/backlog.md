# Backlog — idées hors-scope

## Objectif de ce document

Ce fichier capture toutes les idées qui émergent pendant le
développement mais qui ne sont pas prioritaires pour la phase en cours.

Règle : **aucune idée n'est perdue, mais aucune n'est développée sans
évaluation**.

## Comment utiliser ce fichier

Lorsqu'une idée nouvelle apparaît :

1. Vérifier si elle correspond à une phase planifiée (MVP/B/C)
2. Si oui → aller dans le document du module concerné
3. Si non ou incertain → ajouter une entrée ici

À chaque démarrage de phase, le backlog est revu pour éventuellement
promouvoir des idées vers le scope actif.

## Idées capturées

### Impression d'étiquettes depuis l'app

**Date** : capturé en Phase 1
**Description** : générer et imprimer des étiquettes pour coller
physiquement sur les pneus, avec code-barres scannable.
**Valeur** : haute (scalabilité opérationnelle)
**Complexité** : moyenne
**Phase potentielle** : Phase B ou début Phase C

### Scan de code lors de la vente

**Description** : scanner l'étiquette d'un pneu au moment de la vente
pour mettre à jour automatiquement le statut.
**Valeur** : haute (réduit erreurs de saisie)
**Phase potentielle** : Phase B
**Dépendance** : impression d'étiquettes

### Reconnaissance automatique par photo

**Description** : prendre une photo d'un pneu et que l'app identifie
automatiquement marque, taille, DOT, indice de charge.
**Valeur** : très haute (élimine la saisie manuelle)
**Phase potentielle** : Phase C

### Assistant IA pour compatibilité véhicule

**Description** : chatbot qui répond aux acheteurs Marketplace sur les
questions de compatibilité.
**Phase potentielle** : Phase C, Module 7

### Rendez-vous clients intégrés au calendrier

**Description** : lier les rendez-vous avec des clients au système
d'inventaire pour créer un pipeline de ventes visible.
**Phase potentielle** : Phase B, lié au Module 6 (CRM)

### Recommandations de prix automatiques

**Description** : suggérer un prix de vente optimal basé sur
l'historique de ventes similaires.
**Phase potentielle** : Phase B, Dashboard C

### Alerte stock anormalement stagnant

**Description** : notifier quand un item dépasse un seuil contextualisé
par saison (ex: pneu d'hiver > 200 jours en stock).
**Valeur** : haute
**Complexité** : basse
**Phase potentielle** : MVP possible → à évaluer

### Détection d'opportunités de rachat

**Description** : identifier les demandes fréquentes de tailles/marques
non en stock.
**Phase potentielle** : Phase C (dépend du Module 6)

### Intégration comptable QuickBooks

**Description** : synchroniser les ventes avec QuickBooks pour la
comptabilité.
**Phase potentielle** : Phase C

### Coûts indirects (transport, storage, listing)

**Description** : tracking pour marge nette plus précise.
**Phase potentielle** : Phase B ou Phase C

### [NOUVEAU] Workflow d'approbation partenaire → Mika

**Description** : les partenaires peuvent demander des corrections sur
des données sensibles (codes, prix), les demandes sont envoyées à Mika
pour approbation avec vérification photo de l'étiquette physique.
**Phase potentielle** : Phase B ou C, selon évolution
**Condition de démarrage** : ajout de nouveaux partenaires moins
proches, ou volume qui empêche Mika de tout surveiller manuellement,
ou demande légale/comptable de contrôles stricts

### [NOUVEAU] Permissions granulaires par rôle

**Description** : différencier les actions possibles par rôle
(propriétaire, partenaire, employé).
**Phase potentielle** : Phase B ou C
**Au MVP** : tout le monde a accès à tout (voir ADR-007)

### [NOUVEAU] Workflow intégré de retour avec qualification d'état

**Description** : lors d'un retour, proposer de qualifier l'état
physique (identique / dégradé / inutilisable) avec suggestion
automatique d'ajustement (prix, usure, rebut).
**Phase potentielle** : Phase B ou C
**Au MVP** : retour = remise en stock simple (99% des cas), ajustements
manuels si nécessaire via actions séparées (rebut partiel, note)

### [NOUVEAU] KPI détaillés des retours et indemnisations

**Description** : taux de retour, taux d'indemnisation, marge nette
ajustée, raisons principales, montant moyen.
**Phase potentielle** : Phase B, après collecte de données

### [NOUVEAU] Démonte-pneus pour jantes acier

**Description** : acquisition d'équipement permettant de détacher les
pneus des jantes en acier. Ouvrirait la possibilité de vendre pneus et
jantes séparément (comme pour les jantes cosmétiques).
**Nature** : investissement physique, pas fonction logicielle
**Valeur** : potentiellement élevée (diversification ventes)

### [NOUVEAU] Dashboard admin — état des ancres

**Description** : écran admin pour visualiser l'état des 50 ancres de
numérotation (pointeur actuel, zone, codes consommés, ancres actives
vs verrouillées). Alerte automatique si < 10 ancres actives.
**Phase potentielle** : MVP si simple, Phase B sinon
**Lié à** : ADR-004 numérotation

---
