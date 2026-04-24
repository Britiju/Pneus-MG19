# Journal d'avancement — Projet pneus-MG19

> **Ce document est le cerveau externe du projet.**
>
> Claude doit le lire au début de chaque session pour savoir où on
> en est et proposer la prochaine étape.
>
> Mika met à jour ce document à la fin de chaque session (ou Claude
> le prépare dans un sommaire de fermeture).

## État actuel

**Date de dernière mise à jour** : Avril 2026

**Phase du projet** : Cadrage actif (pas encore en développement)

**Paquets critiques complétés** : 1, 2, 4

**Paquet en cours** : aucun (session de cadrage terminée)

## Prochaine étape prévue

**Paquet 3 — Données historiques et migration Excel**

Objectifs de ce paquet :
- Traiter l'import du legacy Excel complet (les fichiers sont
  en cours de préparation par Mika)
- Résoudre Q5 (migration des codes legacy 1A, 2B, V01, V02 vers le
  nouveau système A247)
- Résoudre Q1 (Work Order / initiation d'achat — toute la phase
  avant qu'un lot soit physiquement acquis)
- Valider que le modèle de données supporte tous les cas historiques
- Tester la robustesse du tiering ADR-002 (data_quality_tier)

**Prérequis** : Mika apporte les fichiers historiques complets
préparés.

**Durée estimée** : 2-3 sessions.

## Paquets terminés

### Paquet 1 — Fondations (complété)
Modèle de données (Lot → Kit → Variantes), identifiants A247,
immutabilité, événements post-vente, 13 principes directeurs.
Raisonnement narratif disponible dans
`docs/decisions/raisonnement-paquet-1.md`.

### Paquet 2 — Finances (complété)
Séparation app/QuickBooks majeure, allocation hybride des coûts,
pricing MVP (prix affiché + comparables), emplacements physiques,
action "Donner" pour cadeaux, pratiques pré-MVP.
Raisonnement narratif disponible dans
`docs/decisions/raisonnement-paquet-2.md`.

### Paquet 4 — Mécaniques de vente (complété)
Clients minimalistes (Particulier vs Commerce), modes de facturation
avec refus explicite, tableau de bord "Factures à envoyer", entité
RendezVous (plusieurs RDV parallèles par kit), iframe Google
Calendar, approche Loi 25 minimaliste, vision canaux de vente.
Raisonnement narratif à produire dans une session dédiée.

## Paquets restants à traiter

**Priorité haute (avant développement)** :
- Paquet 3 — Données historiques (prochaine session)
- Paquet 5 — Utilisateurs et permissions (court, déjà largement
  tranché par ADR-007)

**Priorité moyenne (peut se faire en parallèle du développement)** :
- Paquet 6 — Dashboard
- Paquet 8 — Stratégie de bascule (migration, tests, formation)

**Priorité à la fin (nécessite le MVP fonctionnel)** :
- Paquet 7 — Validation finale MVP

## Tâches transversales en attente

### Documents narratifs à produire

- `docs/decisions/raisonnement-paquet-4.md` — narratif complet du
  Paquet 4, à produire dans une session dédiée (session peu
  demandante pour Mika : Claude produit, Mika valide)

### Sessions spéciales à prévoir

- **Cartographie architecturale** (après Paquet 3 et 5) — session
  de sélection préliminaire des solutions techniques avec flexibilité
  explicite. Livrable : `docs/14-cartographie-architecturale.md`.
  **Note** : tu as proposé un Principe 14 (décisions architecturales
  révisables) à formaliser à ce moment-là.

- **Review externe multi-perspectives** (après cartographie
  architecturale) — soumettre le cadrage à différentes IA avec des
  persona variés (architecte, e-commerce, comptable, avocat, UX,
  data migration, opérations) pour identifier les angles morts.

## Questions ouvertes actives

Référence complète dans `docs/questions-ouvertes.md`. Questions
pertinentes pour les prochaines sessions :

- **Q1** — Work Order / initiation d'achat → Paquet 3 (prochaine
  session)
- **Q5** — Migration des codes legacy → Paquet 3 (prochaine
  session)
- **Q4** — Seuils d'alerte de stagnation par saison → Paquet 6
- **Q7** — Stratégie de backup et continuité → après Paquet 4
- **Q8** — Stratégie de bascule → Paquet 8 dédié
- **Q9** — Notes de crédit fournisseur rétroactives → avant Phase C

## Conventions en place

- **ADR** dans `docs/decisions/` (ADR-001 à ADR-015)
- **Raisonnements narratifs** dans `docs/decisions/raisonnement-paquet-N.md`
- **Sommaires de session** archivés dans `docs/sessions/` avec
  en-tête "STATUT : EXÉCUTÉ"
- **Commits** : un commit unique par fermeture de paquet quand
  possible

## Historique des sessions récentes

### Session avril 2026 (session actuelle)

**Durée** : longue (6+ heures)
**Accomplissements** :
- Fermeture complète du Paquet 2 (sommaire intermédiaire +
  sommaire de fermeture, convention `docs/sessions/` formalisée)
- Production du raisonnement narratif Paquet 2 (1740 lignes,
  incluant auto-critique honnête de l'assistant)
- Cadrage complet du Paquet 4 (3 ADR + document de vision
  `13-integration-canaux-vente.md` + enrichissements modèle de
  données)
- Archivage du sommaire Paquet 4
- Création du protocole de sessions (ce document)

**Prochaine étape décidée** : Paquet 3 (données historiques)

### Sessions précédentes

Pour l'historique complet, voir :
- `docs/sessions/sommaire-paquet-1.md`
- `docs/sessions/sommaire-paquet-2-intermediaire.md`
- `docs/sessions/sommaire-paquet-2-fermeture.md`
- `docs/sessions/sommaire-paquet-4-fermeture.md`

Et les raisonnements narratifs :
- `docs/decisions/raisonnement-paquet-1.md`
- `docs/decisions/raisonnement-paquet-2.md`

---

**Protocole de mise à jour** : ce document est mis à jour à la fin
de chaque session. Claude produit le sommaire de mise à jour, Mika
pousse le commit.

**Format stable** : les sections "État actuel" et "Prochaine étape
prévue" sont les plus lues — elles doivent rester claires et à
jour. Le reste est contextuel.
