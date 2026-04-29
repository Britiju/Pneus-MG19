# Journal d'avancement — Projet pneus-MG19

> **Ce document est le cerveau externe du projet.**
>
> Claude doit le lire au début de chaque session pour savoir où on
> en est et proposer la prochaine étape.
>
> Mika met à jour ce document à la fin de chaque session (ou Claude
> le prépare dans un sommaire de fermeture).

## État actuel

**Date de dernière mise à jour** : Avril 2026 (mise à jour pendant
la session Paquet 6 — prototype stealth)

**Phase du projet** : Cadrage actif (pas encore en développement)

**Paquets critiques complétés** : 1, 2, 4, 5 + Paquet 3A (question
tiering opérationnel) + Paquet 6 (prototype stealth)

**Paquet en cours** : aucun

**Activité parallèle en démarrage** : prototype d'apprentissage
stealth (Patrick code en weekend project, voir
`docs/apprentissage-stealth-test.md`)

## Prochaine étape prévue

**Note** : avec le démarrage du prototype stealth (Paquet 6, avril
2026), la prochaine étape de cadrage reste le Paquet 3, mais Patrick
peut développer le prototype en parallèle sans dépendance.

**Paquet 3 complet — Données historiques et migration Excel**

La question Paquet 3A (portée opérationnelle du tiering) a été fermée via
ADR-017. Le Paquet 3 complet peut maintenant reprendre, mais il reste
bloqué sur son prérequis d'origine :

**Prérequis** : Patrick rassemble les fichiers historiques complets
préparés. L'Excel actuel (`Database_Pneus_Unifiee.xlsx`) ne contient
qu'une partie du legacy ; il manque notamment les codes V01/V02
mentionnés dans la question Q5.

**Objectifs du paquet à la reprise** :
- Import du legacy Excel complet
- Résoudre Q5 (migration des codes legacy vers le système A247 — ou plus
  précisément : confirmer la cohabitation et acter si une uniformisation
  future est souhaitée)
- Résoudre Q1 (Work Order / initiation d'achat — toute la phase
  pré-acquisition)
- Valider que le modèle de données supporte tous les cas historiques
- Tester la robustesse du tiering ADR-002 + ADR-017 sur les données
  réelles complètes

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

### Paquet 5 — Utilisateurs et permissions (complété)

Modèle à 2 rôles hardcodés au MVP (admin + power_user), stratégie en 4
paliers, matrice rôle × action complète, pattern "notification admin
asynchrone", inscription par invitation, script de setup du premier admin,
clarification terminologique propriétaires/admin/power_user. ADR-016 créé,
ADR-007 révisé, CLAUDE.md mis à jour. Raisonnement complet dans le
sommaire de fermeture.

### Paquet 3A — Portée opérationnelle du tiering (complété)

Extension du Paquet 5 portant sur la portée opérationnelle de
`data_quality_tier`. 9 décisions actées : tier unique conservé à vie,
indicateur discret sur la fiche, workflows identiques legacy/app-native,
modification libre des champs descriptifs sur kit/lot non-finalisés,
`display_code` toujours via workflow explicite, validation des champs
critiques à la finalisation de vente, pas de distinction dans les
rapports au MVP, cas "app-native devient historique" non modélisé, même
logique pour les lots. ADR-017 créé. ADR-016 révisé (suppression de la
ligne "admin seul pour legacy"). 2 entrées backlog.

### Paquet 6 — Prototype d'apprentissage stealth (complété)

Définition du prototype d'apprentissage transitoire pour tester en
conditions réelles le workflow photo → reconnaissance → publication
Marketplace. Format de codes T##-## (voir ADR-018), 5 features,
anti-patterns explicites, conditions de mort programmées.
ADR-018 créé (réservation lettre T). 5 documents amendés
(06-modele-donnees, pratiques-pre-mvp, questions-ouvertes,
08-roadmap, CLAUDE). Patrick prend le relais pour développer en
weekend project. Raisonnement complet dans le sommaire de fermeture.

## Paquets restants à traiter

**Priorité haute (avant développement)** :
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
- `docs/decisions/raisonnement-paquet-6.md` — narratif complet du
  Paquet 6 (prototype d'apprentissage stealth), à produire dans une
  session dédiée. Devrait capturer notamment : le glissement
  Tampermonkey → app web → prototype d'apprentissage, les 5
  itérations sur le format des codes (T001 → T01-K1 → T01-01),
  l'audit de cohérence demandé proactivement par Mika et ses 10
  points résolus, l'auto-critique de l'assistant sur la
  sous-estimation initiale des conflits de cohérence.

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
  (ADR-016, révision ADR-007)
- Invention du pattern "Notification admin asynchrone"
- Clarification terminologique Patrick/Mika (propriétaires/admin/power user)
- Question Paquet 3A soulevée en fermeture Paquet 5 sur la portée
  opérationnelle du tiering
- Remise en cause par Patrick de la règle "admin seul pour legacy" de
  ADR-016
- Paquet 3A complété dans la foulée (ADR-017, révision ADR-016)

**Prochaine étape décidée** : Paquet 3 complet (données historiques),
reprise quand Patrick aura rassemblé les fichiers historiques manquants.

### Session avril 2026 — Paquet 6 (session actuelle)

**Durée** : longue (plusieurs heures)
**Accomplissements** :
- Définition du prototype d'apprentissage stealth
- Audit de cohérence : 10 points d'incohérence identifiés et
  tranchés
- Création d'ADR-018 (réservation lettre T)
- Amendements de 5 documents existants pour intégrer le prototype
- Format de codes T##-## défini avec hiérarchie lot/kit visible

**Patterns observés** :
- L'assistant a initialement sous-estimé les conflits de cohérence
  potentiels avec le projet existant. Mika a explicitement demandé
  un audit, qui a révélé 10 points à régler.
- Mika a poussé pour intégrer le numéro de lot dans le code
  physique du sticker, contre la première proposition de
  l'assistant qui les séparait artificiellement.
- Discipline rigoureuse sur les anti-patterns : "tout ce qui n'est
  pas dans la liste des 5 features est REFUSÉ".

**Prochaine étape décidée** : Patrick développe le prototype en
weekend project. Le cadrage Paquet 3 reste la prochaine étape
quand les fichiers historiques seront rassemblés. Aucune dépendance
entre les deux activités.

### Avril 2026 — Session de design technique du composant côté consommation du prototype stealth

Session de design avec Claude. Trois activités :

1. **Archivage du script Tampermonkey v0.7** développé en session parallèle (avec une autre instance d'IA dans un projet tiers "Stealth ID pneus"). Le script automatise le remplissage des champs textes du formulaire Marketplace via drag-and-drop d'un fichier `.txt` clé-valeur.

2. **Calibration de la vision IA** sur 3 kits de pneus de calibration (Yokohama Avid Ascend GT 225/60R18, Bridgestone Turanza LS100 235/40R19, Sailun Inspire 235/65R18). Validation empirique d'un protocole photo : pas de flash, coup de wipe sur le flanc, photo flanc large + photo DOT rapprochée dédiée.

3. **Design du flow d'étiquetage et du Test V1** du pipeline manuel-assisté (photos cell → analyse IA → renommage → génération `.txt` → drag-drop Marketplace en mode calibration sans publication).

Livrables : script Tampermonkey archivé dans `prototypes/marketplace-helper/`, document `apprentissages-stealth-test.md` créé avec distinction explicite faits/propositions/vision, note dans le cadrage du prototype.

Aucune convention validée du Paquet 6 n'a été modifiée. Les propositions de révision (nombre de photos variable, étiquette comme délimiteur, étiquetage à la demande, convention dossier plat, format `.txt` unique) sont consignées comme propositions à valider par usage.

**Sessions futures anticipées** : voir `apprentissages-stealth-test.md` Index des sessions futures (7 sessions identifiées avec leurs déclencheurs respectifs). Les deux plus immédiates :
- Session d'ajustement de flow après 2-3 vrais lots testés
- Session de design Test V2 (intégration cell-Drive avec lot+vendeur attribués à la prise) après validation du Test V1

### Sessions précédentes

Pour l'historique complet, voir :
- `docs/sessions/sommaire-paquet-1.md`
- `docs/sessions/sommaire-paquet-2-intermediaire.md`
- `docs/sessions/sommaire-paquet-2-fermeture.md`
- `docs/sessions/sommaire-paquet-4-fermeture.md`
- `docs/sessions/sommaire-paquet-5-fermeture.md`
- `docs/sessions/sommaire-paquet-3A-fermeture.md`
- `docs/sessions/sommaire-paquet-6-prototype-stealth.md`

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
