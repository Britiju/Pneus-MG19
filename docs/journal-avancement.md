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

**Paquets critiques complétés** : 1, 2, 4, 5

**Paquet en cours** : aucun (session de cadrage Paquet 5 terminée)

## Prochaine étape prévue

**Question sur la portée opérationnelle du tiering (Paquet 3A ou Q10)**

Patrick a soulevé en fin de Paquet 5 une question qui appartient au Paquet 3
mais qui peut être traitée sans les données historiques manquantes :

> Quand un kit legacy (importé d'Excel) est vendu dans l'app, comment se
> comporte-t-il par rapport aux workflows app-native ? Apparaît-il comme
> un kit app-native vendu, ou reste-t-il visuellement/analytiquement
> "legacy" ? Quand une vente app-native porte sur un kit legacy, quelles
> données deviennent fiables et lesquelles restent suspectes ?

Cette question éclaire comment `data_quality_tier` (ADR-002) se propage,
s'affiche, et influence les analyses. Elle est orthogonale à Q5 (migration
des codes) et Q1 (work order) — elle peut donc être traitée indépendamment.

**Durée estimée** : 1 session dédiée.

**Prérequis** : aucun (les données manquantes ne sont pas nécessaires pour
cette discussion, qui porte sur le comportement du modèle).

**Le reste du Paquet 3 (Q1 + Q5)** reste bloqué en attente des fichiers
historiques complets que Patrick doit rassembler.

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

### Paquet 5 — Utilisateurs et permissions (complété)

Modèle à 2 rôles hardcodés au MVP (admin + power_user), stratégie en 4
paliers, matrice rôle × action complète, pattern "notification admin
asynchrone", inscription par invitation, script de setup du premier admin,
clarification terminologique propriétaires/admin/power_user. ADR-016 créé,
ADR-007 révisé, CLAUDE.md mis à jour. Raisonnement complet dans le
sommaire de fermeture.

## Paquets restants à traiter

**Priorité haute (avant développement)** :
- **Question Paquet 3A** — portée opérationnelle du tiering (prochaine
  session, ne nécessite pas les données historiques manquantes)
- **Paquet 3 complet** — données historiques (bloqué : Patrick rassemble
  les fichiers manquants)

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

**Durée** : longue (plusieurs heures)
**Accomplissements** :
- Tentative d'ouverture Paquet 3 : bloquée faute de données historiques
  complètes
- Bascule sur Paquet 5 (Utilisateurs et permissions), complété
- Révision majeure d'ADR-007 via ADR-016
- Invention du pattern "Notification admin asynchrone"
- Clarification terminologique Patrick/Mika (propriétaires/admin/power user)
- Question soulevée par Patrick en fin de paquet : portée opérationnelle
  du tiering → devient prochaine étape

**Prochaine étape décidée** : question Paquet 3A (tiering opérationnel),
puis reprise Paquet 3 complet quand les données manquantes seront
disponibles.

### Sessions précédentes

Pour l'historique complet, voir :
- `docs/sessions/sommaire-paquet-1.md`
- `docs/sessions/sommaire-paquet-2-intermediaire.md`
- `docs/sessions/sommaire-paquet-2-fermeture.md`
- `docs/sessions/sommaire-paquet-4-fermeture.md`
- `docs/sessions/sommaire-paquet-5-fermeture.md`

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
