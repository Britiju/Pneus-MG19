# Module 1 — Dashboard central

## Vue d'ensemble

Le Module 1 est le **cœur de l'application**. C'est la page d'accueil
quand Mika ou un partenaire ouvre l'app, et c'est le point d'entrée
vers toutes les autres sections.

Il est structuré selon la **pyramide BI de Gartner**, un framework
standard qui distingue les niveaux de maturité analytique :

1. **Descriptif** — « Que s'est-il passé? »
2. **Diagnostique** — « Pourquoi? »
3. **Prédictif** — « Que va-t-il se passer? »
4. **Prescriptif** — « Que dois-je faire? »

Le MVP couvre les niveaux 1 et 2. Le niveau 3 arrive en Phase B. Le
niveau 4 est une vision long terme (Phase C, Module 7).

## Organisation en 3 sous-dashboards

Le Module 1 se divise en trois vues complémentaires, accessibles depuis
la page d'accueil via des cartes de drill-down.

### Dashboard A — « Mon business »

**Niveau BI** : descriptif + diagnostique.

**Question répondue** : « Qu'est-ce qui s'est passé et pourquoi? »

**Contenu** :
- KPIs sur une période sélectionnable (ce mois, trimestre, année)
- Ventes totales, marge brute, nombre d'items vendus
- Décomposition par saison (hiver vs été)
- Décomposition par marque
- Décomposition par fournisseur
- Décomposition par canal de vente
- Comparaisons période vs période précédente
- Alertes sur variations anormales

**Fréquence d'utilisation** : hebdomadaire à mensuelle.

**Utilisateur principal** : Mika, pour prendre du recul sur le business.

### Dashboard B — « Aujourd'hui »

**Niveau BI** : descriptif temps réel + diagnostique opérationnel.

**Question répondue** : « Que se passe-t-il maintenant et que dois-je
faire? »

**Contenu** :
- Inventaire actuel par catégorie (en stock, en préparation, en vente)
- Items récemment entrés à caractériser
- Items qui stagnent anormalement (contextualisé par saison)
- Dernières ventes des 7 derniers jours
- Alertes opérationnelles
- Actions à traiter (items sans photos, sans prix, etc.)

**Fréquence d'utilisation** : quotidienne à plusieurs fois par jour.

**Utilisateur principal** : Mika et partenaires, pour piloter au jour
le jour. **C'est la page d'accueil par défaut de l'app.**

### Dashboard C — « Tendances » (Phase B, désactivé au MVP)

**Niveau BI** : prédictif.

**Question répondue** : « Que va-t-il se passer? »

**Contenu prévu** :
- Projections de ventes (saisonnalité apprise)
- Time-to-sell estimé pour un nouvel item
- Détection de patterns fournisseurs
- Signaux précoces de ralentissement

**Prérequis d'activation** : minimum 12 mois de données propres.

**Statut au MVP** : la carte est visible sur la page d'accueil avec un
badge « Phase B », non-cliquable. Cela gère les attentes utilisateur
en indiquant visuellement la roadmap.

## Pattern UX retenu

Voir `docs/10-ux-design-system.md` pour le détail. En synthèse :

- **Menu latéral gauche** avec les 7 modules (même ceux non-actifs,
  visuellement dégradés)
- **Page d'accueil** = Dashboard B par défaut, avec cartes de drill-down
  vers A, B, C
- **Responsive** : le menu latéral se transforme en hamburger sur mobile

## Critères de succès du Module 1

Le Module 1 est jugé réussi si :

1. Mika ouvre l'app le matin et comprend l'état de son business en
   moins de 30 secondes.
2. Un partenaire peut répondre à « as-tu du 225/65r17 hiver? » depuis
   son téléphone en moins de 10 secondes.
3. Les décisions de pricing et de priorisation sont prises en
   consultant l'app, non plus la mémoire.

## Données requises

Le Module 1 ne saisit pas de données — il les consomme. Il dépend de :

- Module 2 (Inventaire) pour la liste des items, lots, emplacements
- Module 3 (Finance) pour les marges et les rapports agrégés

Il faut donc que les Modules 2 et 3 soient fonctionnels **avant** que
le Module 1 puisse afficher quoi que ce soit d'utile. L'ordre de
construction suggéré est : 2 → 3 → 1.

---
