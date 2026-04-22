# Documentation Phase 1 — pneus-MG19

> **Note pour Claude Code** : Ce fichier est un document consolidé contenant
> l'ensemble de la documentation produite en Phase 1 (cadrage). Chaque section
> est destinée à devenir un fichier Markdown indépendant dans l'arborescence
> `docs/` du projet.
>
> **Action attendue de Claude Code lors de la première session** :
> 1. Lire l'intégralité de ce document
> 2. Créer les fichiers séparés selon les séparateurs `=== FICHIER: ... ===`
> 3. Supprimer ce fichier consolidé une fois le découpage validé
> 4. Proposer des corrections ou améliorations si des incohérences sont détectées
>
> Les fichiers à créer sont listés dans l'index ci-dessous.

---

## Index des fichiers à découper

| Destination | Contenu |
|-------------|---------|
| `docs/01-vision-produit.md` | Vision, principes, non-objectifs, critères de succès |
| `docs/02-personae-utilisateurs.md` | Profils des utilisateurs actuels et futurs |
| `docs/03-cycle-de-vie.md` | Les 16 étapes du cycle de vie d'un lot |
| `docs/04-modules.md` | Architecture modulaire, 7 modules définis |
| `docs/05-dashboard.md` | Spécification du Module 1 (3 sous-dashboards) |
| `docs/07-data-quality-tiers.md` | Stratégie legacy vs nouvelles données |
| `docs/08-roadmap.md` | Séquencement MVP / Phase B / Phase C |
| `docs/10-ux-design-system.md` | Patterns UI retenus, philosophie design |
| `docs/backlog.md` | Idées hors-scope à garder en mémoire |
| `docs/decisions/ADR-001-scope-mvp-sans-crm.md` | Décision : pas de CRM au MVP |
| `docs/decisions/ADR-002-tiering-qualite-donnees.md` | Décision : séparer legacy et nouveau |
| `docs/decisions/ADR-003-pattern-menu-lateral-drill-down.md` | Décision : UX menu latéral + cartes |

Les fichiers `06-data-model.md` et `09-stack-technique.md` seront produits lors
des phases ultérieures (Data Architect et Solutions Architect).

Les fiches de `docs/sessions/` seront produites au fil des 8 sessions de
déconstruction à venir.

---

=== FICHIER: docs/01-vision-produit.md ===

# Vision produit

## Problème à résoudre

Mika opère aujourd'hui son business de revente de pneus usagés via un
fichier Excel et une méthode artisanale basée sur sa mémoire personnelle.
Cette approche fonctionne à petite échelle mais présente trois limitations
structurelles :

1. **Dépendance au propriétaire** — Toute la connaissance du stock, des
   clients, des fournisseurs et des décisions de pricing réside dans la
   tête de Mika. Aucune délégation n'est possible sans formation intensive.

2. **Processus chronophage et fragmenté** — Chaque étape (inspection,
   transcription, création d'annonces, suivi des leads) est manuelle
   et nécessite de jongler entre plusieurs outils (cahier papier, photos
   cellulaire, Excel, Messenger).

3. **Absence d'insights analytiques** — Les données existent mais ne
   permettent pas de répondre facilement à des questions stratégiques
   comme "quelles marques sont les plus rentables?", "quel lot a le
   meilleur ROI?", "quels items stagnent anormalement?".

## Solution proposée

Une plateforme web qui structure l'ensemble du cycle de vie d'un lot
de pneus, de l'acquisition à la vente, tout en produisant des tableaux
de bord analytiques en temps réel.

La plateforme est conçue selon trois principes directeurs :

### Principe 1 — Aucune feature ne ralentit le workflow actuel

Toute fonctionnalité ajoutée doit soit réduire, soit conserver le temps
de traitement actuel. Une feature qui allonge le processus, même pour
un bénéfice analytique futur, est rejetée.

### Principe 2 — Architecture modulaire

Chaque module est indépendant et remplaçable. Le MVP se concentre sur
les modules essentiels (Dashboard, Inventaire, Finance) et les modules
futurs (Saisie mobile, Listing automatique, CRM, IA) s'ajoutent sans
nécessiter de refactor.

### Principe 3 — Fool-proof par design

Le système doit être utilisable par un employé sans tribal knowledge,
sans formation extensive, sans dépendance à la mémoire de Mika. Chaque
écran répond sans ambiguïté à la question "que fait-on ici?".

## Objectif long terme

Libérer Mika de l'ensemble des activités opérationnelles répétitives
pour lui permettre de se concentrer sur les décisions stratégiques
(achat de lots, pricing, expansion) pendant qu'un système bien bâti
fait tourner les opérations du quotidien.

## Non-objectifs

Ce que ce projet n'est **pas** :

- Un ERP complet concurrent à QuickBooks ou SAP
- Une marketplace publique ouverte aux clients finaux
- Un outil de e-commerce (pas de panier, pas de paiement en ligne au MVP)
- Un clone de Marketplace Facebook
- Un outil généraliste pour d'autres commerces de pièces automobiles

Garder ces non-objectifs clairs protège contre le scope creep et permet
de rester focalisé sur le besoin réel.

## Critères de succès du projet global

Le projet est considéré comme un succès si, après 12 mois d'utilisation :

- Mika peut déléguer l'ensemble de la saisie et du suivi à un partenaire
  ou employé sans perte de qualité
- Les décisions de pricing et de rachat sont prises à partir de données
  structurées, non plus d'intuitions
- Le temps moyen entre l'acquisition d'un lot et sa première mise en
  vente est réduit d'au moins 50%
- Les ventes par canal, par saison, par marque sont mesurées en
  continu et disponibles sans effort

## Audience de ce document

Ce document est lu par :

- Le propriétaire (source de vérité pour les décisions scope)
- Les partenaires collaborant au projet
- Claude Code, qui s'appuie dessus pour comprendre l'intention derrière
  chaque feature demandée
- Tout futur contributeur au projet

---

=== FICHIER: docs/02-personae-utilisateurs.md ===

# Personae utilisateurs

## Vue d'ensemble

Le projet est conçu pour trois types d'utilisateurs, avec des niveaux
d'accès et des besoins distincts. Au MVP, seul le premier persona est
activement servi — les deux autres sont pris en compte dans l'architecture
pour éviter les refactors futurs.

## Persona 1 — Mika, le propriétaire opérationnel (MVP)

**Rôle** : propriétaire et décideur unique du scope du projet.

**Niveau technique** : non-développeur, à l'aise avec Excel et les outils
web modernes (Marketplace, Messenger, email). Apprend rapidement les
nouveaux outils.

**Contextes d'utilisation** :

- Sur le terrain (chez un fournisseur) — depuis son téléphone, pour
  saisir l'inspection d'un lot. Mobile-first.
- À la maison ou au bureau — depuis un ordinateur, pour consulter les
  dashboards et mettre à jour les statuts.
- En déplacement — depuis son téléphone, pour répondre à un client qui
  demande "as-tu du 225/65r17 hiver?".

**Besoins principaux** :

- Vision synthétique de l'état du business à tout moment
- Recherche rapide dans l'inventaire depuis mobile
- Suivi automatique des marges par item et par lot
- Alertes sur les items qui stagnent anormalement
- Historique consultable des ventes et des fournisseurs

**Frustrations actuelles** :

- Transcription manuelle des notes terrain dans Excel
- Rédaction répétitive d'annonces Marketplace à la main
- Tri manuel des photos entre les lots
- Calcul de marge à la calculatrice mentale
- Mémoire humaine comme seul système de suivi

**Métrique de succès individuelle** :

Mika peut s'absenter une semaine du business et, à son retour, reprendre
le pilotage sans avoir perdu d'informations critiques.

## Persona 2 — Les partenaires occasionnels (MVP, accès limité)

**Rôle** : amis et collaborateurs qui aident Mika ponctuellement sur des
tâches spécifiques (inspection d'un lot, livraison à un client, prise
de photos).

**Niveau technique** : variable, certains sont très à l'aise avec les
outils numériques, d'autres moins.

**Contextes d'utilisation** :

- Aide ponctuelle lors de visites de lots importants
- Remplacement occasionnel de Mika pour une vente
- Support sur la préparation physique des pneus

**Besoins principaux** :

- Interface simple et guidée — pas de tableau Excel à décrypter
- Pouvoir saisir des items sans voir les données sensibles (marges,
  prix d'achat, volumes totaux)
- Accès limité aux actions qui leur sont confiées

**Considération de design importante** :

Mika a exprimé une préoccupation légitime sur la **visibilité des volumes
business** aux partenaires occasionnels. Le système doit permettre à un
partenaire d'utiliser l'app sans pouvoir déduire le chiffre d'affaires
mensuel de Mika. Cela influence deux choix architecturaux :

- **IDs opaques** : les codes d'étiquettes sont aléatoires (ex: `H3K`,
  `M7P`), non séquentiels, pour empêcher la déduction du volume total
- **Rôles utilisateurs dès le MVP** : même simple, une séparation
  "propriétaire" vs "partenaire" existe, avec masquage des données
  financières pour les partenaires

## Persona 3 — Les employés futurs (Phase C)

**Rôle** : hypothétiques employés à venir si le business scale, chargés
de l'exécution opérationnelle pendant que Mika se concentre sur la
stratégie.

**Niveau technique** : à définir au recrutement, mais potentiellement
minimal — le système doit être apprenable en quelques heures.

**Contextes d'utilisation** : essentiellement la saisie terrain, la
gestion des listings, la réponse aux leads.

**Besoins principaux** :

- Workflows guidés étape par étape (pas de tableaux de bord ouverts)
- Documentation intégrée à l'interface (tooltips, aide contextuelle)
- Validation automatique des données saisies pour éviter les erreurs
- Journal d'audit pour permettre à Mika de vérifier le travail

**Ce persona conditionne l'objectif "fool-proof"**

Même si aucun employé n'existe au MVP, chaque écran doit être conçu
comme si un nouvel employé allait l'utiliser demain matin sans
formation. C'est la métrique ultime de qualité du produit.

## Synthèse des implications

| Persona | Impact sur le MVP |
|---------|-------------------|
| Mika | Toutes les features du MVP sont pour lui |
| Partenaires | Système de rôles simple + IDs opaques obligatoires |
| Employés futurs | Pas de feature dédiée, mais chaque écran doit passer le test "apprenable en 15 minutes" |

---

=== FICHIER: docs/03-cycle-de-vie.md ===

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

=== FICHIER: docs/04-modules.md ===

# Architecture modulaire

## Principe directeur

Le système est conçu comme un **ensemble de modules indépendants** plutôt
qu'une application monolithique. Chaque module a une responsabilité
unique, peut être développé, testé et remplacé sans impacter les autres.

Cette approche permet :

- Un **MVP resserré** (3 modules seulement)
- Une **évolution progressive** (ajout de modules sans refactor)
- Une **maintenance simplifiée** (bug dans un module = fix isolé)
- Une **compatibilité native avec Claude Code**, qui travaille mieux
  sur un module à la fois que sur une app entière

## Les 7 modules identifiés

### Module 1 — Dashboard central (MVP)

**Responsabilité** : vision synthétique et analytique du business.

**Sous-modules** :
- Dashboard A — « Mon business » (historique et diagnostique)
- Dashboard B — « Aujourd'hui » (opérationnel temps réel)
- Dashboard C — « Tendances » (prédictif, Phase B)

**Contenu détaillé dans** `docs/05-dashboard.md`.

### Module 2 — Inventaire (MVP)

**Responsabilité** : gestion structurée des lots et des items.

**Fonctionnalités MVP** :
- Liste des lots avec filtres
- Fiche détaillée d'un item
- Recherche rapide (marque, taille, saison, véhicule compatible)
- Import des données historiques (legacy tier)
- Saisie manuelle d'un nouveau lot depuis ordinateur
- Gestion des emplacements (entrepôts)
- Codes d'étiquettes opaques générés automatiquement

### Module 3 — Finance (MVP)

**Responsabilité** : suivi des marges et rapports financiers.

**Fonctionnalités MVP** :
- Marge par item (prix vente - prix achat)
- ROI par lot (vue agrégée)
- Rapports par saison, marque, fournisseur
- Vues mensuelle, trimestrielle, annuelle
- Segmentation legacy vs nouveau (voir
  `docs/07-data-quality-tiers.md`)

**Structure préparée pour Phase B/C** :
- Table `expenses` prévue mais vide au MVP
- Champs pour coûts indirects (transport, storage) désactivés au MVP

### Module 4 — Saisie mobile (Phase B)

**Responsabilité** : alimentation de l'inventaire depuis le terrain.

**Fonctionnalités prévues** :
- Formulaire mobile optimisé pour saisie sur téléphone
- Capture photo intégrée
- Auto-complete des marques, tailles, véhicules
- Mode hors-ligne avec synchronisation différée
- Génération d'étiquettes imprimables

### Module 5 — Listing automatique (Phase B)

**Responsabilité** : création et publication d'annonces sur les canaux
de vente.

**Fonctionnalités prévues** :
- Templates de descriptions paramétrés
- Génération automatique à partir des données item
- Publication via API Facebook Marketplace (si disponible)
- Suivi des statuts de publication

**Dépendance critique** : ce module est celui qui débloque le Module 6
(CRM) en capturant automatiquement les données clients.

### Module 6 — CRM (Phase C, conditionnel)

**Responsabilité** : gestion des relations clients et historique.

**Condition d'activation** : ce module est construit **uniquement** si
le Module 5 permet la capture automatique des contacts clients sans
ralentir le workflow. Tant que la capture nécessite une saisie manuelle,
ce module reste inactif.

**Fonctionnalités prévues** :
- Fiche client avec historique des achats
- Pipeline de leads actifs
- Relances automatiques saisonnières
- Segmentation clients récurrents vs ponctuels

### Module 7 — Assistant IA (Phase C)

**Responsabilité** : intelligence décisionnelle et automatisation.

**Fonctionnalités prévues** :
- Suggestions de prix basées sur l'historique
- Détection d'opportunités (demandes récurrentes non satisfaites)
- Réponses automatiques aux questions compatibilité des acheteurs
- Prévisions de ventes saisonnières

## Schéma de dépendances

```
            Module 1 (Dashboard)
                    |
         +----------+----------+
         |                     |
    Module 2                Module 3
    (Inventaire)            (Finance)
         |
    +----+----+
    |         |
Module 4   Module 5
(Mobile)   (Listing)
              |
         +----+----+
         |         |
    Module 6   Module 7
    (CRM)      (IA)
```

Le Module 1 s'appuie sur les données des Modules 2 et 3. Les Modules 6
et 7 ne peuvent être activés qu'après le Module 5.

## Règle de décision

Quand une nouvelle idée de feature émerge, la question à se poser est :

1. **À quel module appartient-elle?**
2. **Ce module est-il en MVP ou en phase ultérieure?**
3. **Si phase ultérieure, l'idée va dans `docs/backlog.md`**

Pas de débat, pas d'exception. Le scope creep est l'ennemi principal du
projet.

---

=== FICHIER: docs/05-dashboard.md ===

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

=== FICHIER: docs/07-data-quality-tiers.md ===

# Stratégie de qualité des données — Tiering

## Contexte

Le projet importe en Phase 1 un historique de 607 enregistrements issus
d'un fichier Excel (`Database_Pneus_Unifiee.xlsx`). Ces données
présentent plusieurs problèmes de qualité structurels :

- Dates stockées en format numérique Excel (46133) au lieu de format date
- Marques non standardisées (ex: « 2 Toyo 1 Sailun 1 Continental »,
  « Gt Radial » vs « GT Radial »)
- Tailles avec casse incohérente (« 265/70r17 » vs « 265/70R17 »)
- Champ `Profit_calcule` systématiquement vide (100% des lignes)
- Champ `Annee_usinage` systématiquement vide (100% des lignes)
- Prix d'achat parfois fixé à 0 pour les items « bonus » d'un lot,
  sans méthode claire d'allocation du coût global

## Enjeu

Si les données historiques sont mélangées naïvement avec les nouvelles
données saisies proprement, tous les calculs analytiques (marges,
tendances, prévisions) seront pollués par les approximations héritées.

À l'inverse, ignorer complètement les données historiques priverait
Mika de 18+ mois de références business utiles pour du benchmarking.

## Solution — Système de tiering

Chaque enregistrement du système porte un champ `data_quality_tier`
avec deux valeurs possibles :

- `legacy_migrated` — donnée importée depuis l'Excel historique
- `app_native` — donnée saisie directement dans la nouvelle application

Ce champ est **immuable** après création. Une donnée legacy ne peut pas
devenir native, même après correction.

## Champs de confiance granulaires

Certains champs sont fiables même dans le legacy (ex: `Marque`, `Taille`,
`Saison`), d'autres ne le sont pas (ex: `Prix_achat_par_kit`).

Pour gérer cela, chaque champ critique peut porter un flag
`trust_score` indiquant son niveau de fiabilité :

- `high` — valeur vérifiée ou saisie dans l'app
- `medium` — valeur legacy probable mais non vérifiée
- `low` — valeur legacy connue pour être approximative (ex: prix
  d'achat approximé, allocation bonus)
- `unknown_legacy` — valeur manquante remplacée par une valeur par
  défaut explicite

## Comportement dans les dashboards

Chaque dashboard analytique propose par défaut **deux vues** :

1. **Vue propre** (par défaut) — n'inclut que les enregistrements
   `app_native` et les champs `trust_score = high`
2. **Vue complète** — inclut tout l'historique, avec un bandeau
   d'avertissement explicite (« Cette vue inclut 44 items avec prix
   d'achat approximé »)

Les utilisateurs peuvent basculer entre les deux vues, mais jamais les
mélanger silencieusement.

## Comportement à la saisie

Une donnée legacy peut être **« promue »** en app_native si Mika prend
le temps de vérifier et corriger chaque champ. Cette promotion est une
action explicite, journalisée, et ne se fait jamais automatiquement.

## Migration initiale

Lors du premier import de l'Excel :

1. Tous les enregistrements reçoivent `data_quality_tier = legacy_migrated`
2. Les champs vides ou clairement incohérents reçoivent
   `trust_score = unknown_legacy`
3. Les champs avec valeurs probables reçoivent `trust_score = medium`
4. Aucun champ n'est automatiquement marqué `high` pour des données
   legacy — la confiance se mérite par vérification

## Bénéfice stratégique

Cette approche permet :

- **Zéro pollution** des analyses sur données propres
- **Préservation** de la mémoire business pour benchmarking
- **Transparence** sur la qualité des chiffres affichés
- **Confiance croissante** à mesure que les données legacy sont
  vérifiées et promues

Cette décision architecturale est capturée dans
`docs/decisions/ADR-002-tiering-qualite-donnees.md`.

---

=== FICHIER: docs/08-roadmap.md ===

# Roadmap du projet

## Vue d'ensemble

Le projet est structuré en 3 phases majeures, chacune avec des
objectifs, un scope et des critères de complétion explicites.

## Phase MVP — Fondations

**Durée estimée** : 6 à 10 semaines de développement après cadrage.

**Objectif** : remplacer l'usage d'Excel par un système structuré qui
apporte de la valeur immédiate sans ajouter de friction.

**Modules livrés** :
- Module 1 — Dashboard (avec sous-dashboards A et B, carte C en
  « Phase B »)
- Module 2 — Inventaire (saisie desktop, import legacy)
- Module 3 — Finance (marges par item et par lot, rapports de base)

**Critères de complétion** :
- Import complet des 607 enregistrements historiques avec tiering
- Saisie d'un nouveau lot depuis desktop en moins de 15 minutes
- Dashboard A affiche 5 rapports (ventes, marque, saison, fournisseur,
  canal)
- Dashboard B affiche au minimum 4 widgets opérationnels
- Authentification avec rôles (propriétaire vs partenaire)
- Déploiement fonctionnel sur Vercel avec base Supabase

**Ce qui n'est pas dans le MVP** :
- Saisie mobile optimisée (Phase B)
- Génération automatique d'annonces (Phase B)
- Intégration Marketplace (Phase B)
- CRM et pipeline leads (Phase C)
- Prédictions (Phase B)
- Intégration QuickBooks (Phase C)

## Phase B — Automatisation

**Durée estimée** : 4 à 8 semaines après MVP stabilisé.

**Condition de démarrage** : le MVP est en production depuis au moins 4
semaines, utilisé activement, et aucun bug bloquant n'est ouvert.

**Objectif** : réduire drastiquement le temps manuel entre l'acquisition
d'un lot et sa mise en vente.

**Modules livrés** :
- Module 4 — Saisie mobile optimisée avec photos
- Module 5 — Listing automatisé avec templates
- Activation du Dashboard C (Tendances)

**Critères de complétion** :
- Saisie d'un item depuis mobile en moins de 60 secondes
- Génération d'une description d'annonce en 1 clic
- Publication sur Marketplace en moins de 3 clics (si API disponible)
- Au moins 3 mois de données propres permettant des prévisions basiques

**Changement conditionnel** : si l'intégration Marketplace native est
bloquée (API restreinte), le Module 5 pivote vers la génération de
contenu pré-rempli avec copier-coller manuel.

## Phase C — Intelligence et intégration

**Durée estimée** : variable selon la maturité du business.

**Condition de démarrage** : Phase B stabilisée et volume de données
suffisant (minimum 12 mois d'app_native).

**Objectif** : automatiser les décisions récurrentes et intégrer le
système à l'écosystème comptable.

**Modules livrés** :
- Module 6 — CRM (conditionnel à la capture automatique des clients)
- Module 7 — Assistant IA (suggestions, détection, automatisation)
- Intégration QuickBooks

**Critères de complétion** : à définir lors du démarrage de Phase C,
en fonction de l'évolution du business.

## Jalons clés du projet

```
Semaine 0    Fin Phase 1 (cadrage)       ← ACTUEL
Semaine 2    Début du développement MVP
Semaine 8    MVP déployé en production
Semaine 12   MVP stabilisé, Phase B kick-off
Semaine 20   Phase B déployée
Mois 12+     Phase C à évaluer
```

## Méthodologie de livraison

Chaque module est livré **en version fonctionnelle minimale** puis
itéré. Pas de « big bang » ni de livraison massive.

L'ordre de construction recommandé à l'intérieur du MVP est :

1. Module 2 (Inventaire) — fondation
2. Module 3 (Finance) — dépend du 2
3. Module 1 (Dashboard) — consomme les données des 2 et 3

## Gouvernance du scope

Toute idée nouvelle passe par :

1. Évaluation du module concerné
2. Vérification de la phase correspondante
3. Si phase ultérieure → `docs/backlog.md`
4. Si phase en cours → validation explicite du propriétaire requise

Aucune exception. C'est le mécanisme anti-scope-creep principal du
projet.

---

=== FICHIER: docs/10-ux-design-system.md ===

# UX et design system

## Philosophie de design

Le projet suit trois principes UX directeurs :

### 1. Mobile-first responsive web

L'application est **une webapp responsive**, pas une app native. Elle
fonctionne dans un navigateur mobile, tablette ou desktop. Le design
est d'abord pensé pour mobile (iPhone/Android), puis adapté à des
écrans plus larges.

Ce choix évite la complexité d'une app native (stores, permissions,
updates) tout en offrant une expérience mobile optimale — suffisante
pour les besoins du projet.

### 2. Flat et fonctionnel

Esthétique moderne flat design, pas de gradients ni d'effets
décoratifs. Priorité à la lisibilité, la hiérarchie claire, les
espaces blancs généreux. L'interface doit ressembler aux SaaS modernes
(Linear, Notion, Vercel) plutôt qu'aux ERP traditionnels.

### 3. Workflow guidé plutôt que tableaux ouverts

Pour chaque tâche, l'utilisateur doit savoir **quoi faire maintenant**.
Les tableaux de bord ouverts (qui nécessitent de savoir quoi chercher)
sont réservés aux utilisateurs expérimentés. Pour les actions
quotidiennes, un flux étape par étape est préféré.

## Pattern retenu pour la navigation

**Menu latéral + Home avec drill-down**.

Référence : Linear, Notion, Vercel, Stripe Dashboard.

### Structure de navigation

- **Menu latéral gauche** avec les 7 modules (certains dégradés si
  non-actifs)
- **Zone de contenu principal** à droite qui affiche le module
  sélectionné
- **Page d'accueil** (sélection « Dashboard » dans le menu) affiche
  Dashboard B par défaut avec cartes de drill-down vers A, B, C

### Comportement responsive

- **Desktop** (> 1024px) : menu latéral toujours visible
- **Tablette** (768-1024px) : menu latéral rétractable
- **Mobile** (< 768px) : menu en hamburger, page d'accueil optimisée
  pour scrolling vertical

## Choix de couleurs

À définir en Phase 4 (UX Designer dédié). Principes directeurs :

- Palette limitée (3-4 couleurs principales)
- Couleurs sémantiques réservées aux alertes (vert = ok, jaune =
  attention, rouge = problème)
- Mode clair au MVP, mode sombre envisageable en Phase B

## Choix typographiques

À définir en Phase 4. Principes directeurs :

- Police sans-serif moderne (ex: Inter, IBM Plex Sans, Geist)
- Hiérarchie à 3 niveaux maximum (H1, H2, corps)
- Tailles généreuses pour la lisibilité mobile

## Composants UI réutilisables

Le projet utilisera un design system existant plutôt que de créer ses
composants from scratch. Candidats :

- **shadcn/ui** — collection de composants React copiables, très
  moderne
- **Radix UI** — primitives accessibles
- **Tailwind CSS** — utilitaires pour le styling

Décision finale en Phase 4.

## Règles de hiérarchie visuelle

Toute page suit cette structure :

1. **Titre** de la page (contexte)
2. **KPIs ou actions principales** (valeur immédiate)
3. **Contenu principal** (données, formulaires, listes)
4. **Actions secondaires** (exports, paramètres)

Cette structure aide les nouveaux utilisateurs à comprendre chaque
écran sans formation.

## Critères d'accessibilité MVP

- Contraste minimum AA (WCAG 2.1)
- Navigation clavier fonctionnelle
- Textes alt sur les images
- Tailles de police ajustables par le navigateur

## Prototypes et mockups

Les mockups détaillés de chaque écran sont produits en Phase 3 (UX
Designer dédié) avant implémentation. Le MVP ne commence pas sans
mockups validés pour :

- Page d'accueil (Dashboard B + cartes drill-down)
- Liste inventaire
- Fiche item détaillée
- Formulaire de saisie nouveau lot
- Page Dashboard A
- Page Finance

---

=== FICHIER: docs/backlog.md ===

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
3. Si non ou incertain → ajouter une entrée ici avec :
   - Date de capture
   - Description brève
   - Valeur business estimée (haute / moyenne / basse)
   - Complexité estimée (haute / moyenne / basse)
   - Proposé par (qui a eu l'idée)

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
**Proposé par** : Mika

### Scan de code lors de la vente

**Date** : capturé en Phase 1
**Description** : scanner l'étiquette d'un pneu au moment de la vente
pour mettre à jour automatiquement le statut.
**Valeur** : haute (réduit erreurs de saisie)
**Complexité** : moyenne (dépend des étiquettes)
**Phase potentielle** : Phase B
**Dépendance** : impression d'étiquettes

### Reconnaissance automatique par photo

**Date** : capturé en Phase 1
**Description** : prendre une photo d'un pneu et que l'app identifie
automatiquement marque, taille, DOT, indice de charge.
**Valeur** : très haute (élimine la saisie manuelle)
**Complexité** : haute (ML vision custom ou API tierce)
**Phase potentielle** : Phase C
**Proposé par** : Mika

### Assistant IA pour compatibilité véhicule

**Date** : capturé en Phase 1
**Description** : un chatbot qui répond aux acheteurs Marketplace sur
les questions de compatibilité (rim, bolt pattern, etc.).
**Valeur** : haute (libère Mika des échanges répétitifs)
**Complexité** : haute
**Phase potentielle** : Phase C, Module 7
**Proposé par** : Mika

### Rendez-vous clients intégrés au calendrier

**Date** : capturé en Phase 1
**Description** : lier les rendez-vous pris avec des clients au système
d'inventaire pour créer un pipeline de ventes visible.
**Valeur** : moyenne à haute
**Complexité** : moyenne
**Phase potentielle** : Phase B, idéalement lié au Module 6 (CRM)
**Proposé par** : Mika

### Recommandations de prix automatiques

**Date** : capturé en Phase 1
**Description** : suggérer un prix de vente optimal pour un nouvel
item basé sur l'historique des ventes similaires.
**Valeur** : haute
**Complexité** : moyenne
**Phase potentielle** : Phase B, Dashboard C
**Proposé par** : Mika

### Alerte stock anormalement stagnant

**Date** : capturé en Phase 1
**Description** : notifier Mika quand un item dépasse un seuil
contextualisé par saison (ex: pneu d'hiver > 200 jours en stock).
**Valeur** : haute
**Complexité** : basse
**Phase potentielle** : MVP possible → à évaluer pour intégration
directement au Dashboard B

### Détection d'opportunités de rachat

**Date** : capturé en Phase 1
**Description** : identifier les demandes fréquentes de tailles/marques
que Mika n'a pas en stock pour orienter ses prochains achats.
**Valeur** : très haute
**Complexité** : haute (nécessite capture des demandes entrantes)
**Phase potentielle** : Phase C (dépend du Module 6)

### Intégration comptable QuickBooks

**Date** : capturé en Phase 1
**Description** : synchroniser les ventes avec QuickBooks pour la
comptabilité.
**Valeur** : haute (élimine double saisie comptable)
**Complexité** : haute
**Phase potentielle** : Phase C

### Coûts indirects (transport, storage, listing)

**Date** : capturé en Phase 1
**Description** : tracking des coûts indirects pour un calcul de marge
nette plus précis.
**Valeur** : moyenne
**Complexité** : basse structurellement, mais demande discipline de
saisie
**Phase potentielle** : Phase B ou Phase C selon volume

---

=== FICHIER: docs/decisions/ADR-001-scope-mvp-sans-crm.md ===

# ADR-001 — Le MVP ne contient pas de CRM

## Statut

Acceptée — Phase 1 de cadrage.

## Contexte

Lors du cadrage initial, plusieurs features CRM ont été discutées :
capture systématique du nom du client lors d'une vente, pipeline de
leads actifs, historique client, relances saisonnières automatiques.

Ces features sont à forte valeur business à terme, notamment pour :
- Maximiser les ventes récurrentes
- Détecter les demandes non satisfaites
- Construire la fidélité client

## Décision

**Aucune fonctionnalité CRM n'est incluse dans le MVP.**

Le champ « nom du client » et « canal de vente » ne sont pas ajoutés
au formulaire de vente, même s'ils prennent peu de place techniquement.

## Justification

Le propriétaire a identifié un risque clé : **toute feature qui ajoute
du temps à un workflow déjà long est rejetée**, même si le bénéfice
semble évident.

Capturer manuellement « nom du client » ajouterait une étape de saisie
à chaque vente, sans automatisation possible dans les conditions
actuelles (vente via Messenger sans API).

La logique retenue : **le CRM ne sera construit que si la capture des
données clients devient automatique**, ce qui ne sera possible qu'avec
le Module 5 (Listing automatique) en Phase B, via intégration
Marketplace.

## Conséquences

### Positives

- Le MVP reste focalisé sur les modules essentiels
- Aucune friction ajoutée au workflow de vente existant
- Le risque de scope creep est contenu

### Négatives

- Aucune capture des données clients pendant la Phase MVP
- Quand le CRM sera construit (Phase C), il n'aura pas de données
  historiques clients pour démarrer
- Les ventes récurrentes ne peuvent pas être analysées pendant la
  période MVP

## Compensation

Un champ `notes` libre est prévu sur chaque vente dans le Module 2
(Inventaire). Mika peut y écrire ce qu'il veut (nom informel, canal,
observation). Ce champ n'est **pas structuré** mais capture de
l'information opportuniste sans imposer de workflow.

Si Mika souhaite capturer quelque chose ponctuellement, il peut le
faire. Mais **rien n'est obligatoire**.

## Condition de réévaluation

Cette décision sera réévaluée au démarrage de la Phase B. Si à ce
moment-là le Module 5 permet la capture automatique des contacts
clients, alors le Module 6 (CRM) pourra être planifié.

## Alternatives considérées

1. **Capturer manuellement au MVP** — rejeté car ajoute du temps au
   workflow
2. **Capturer uniquement les clients récurrents** — rejeté car
   nécessite de définir « récurrent », donc du CRM déguisé
3. **Capturer via une intégration Messenger au MVP** — rejeté car
   complexité technique trop élevée pour un MVP

## Auteur

Décision prise par Mika lors de la Phase 1 de cadrage, avec analyse
collaborative.

---

=== FICHIER: docs/decisions/ADR-002-tiering-qualite-donnees.md ===

# ADR-002 — Tiering de qualité des données

## Statut

Acceptée — Phase 1 de cadrage.

## Contexte

Le projet doit importer 607 enregistrements historiques issus d'un
fichier Excel. Ces données présentent des problèmes de qualité
structurels qui, s'ils sont mélangés avec les nouvelles données propres,
vont polluer toutes les analyses futures.

Les deux approches naïves sont insatisfaisantes :

1. **Ignorer l'historique** — prive Mika de 18 mois de benchmarks
2. **Mélanger historique et nouveau** — pollue toutes les analyses

## Décision

Un **système de tiering** est implémenté sur chaque enregistrement :

- Champ `data_quality_tier` obligatoire (`legacy_migrated` ou
  `app_native`)
- Champ `trust_score` optionnel par champ critique
- Les dashboards affichent par défaut la **vue propre** (données
  app_native uniquement)
- Une **vue complète** est disponible avec bandeau d'avertissement
  explicite

## Justification

Cette approche permet de bénéficier de l'historique (pour du
benchmarking grossier) sans polluer les analyses fines. Elle offre
également une **transparence totale** : l'utilisateur sait toujours
sur quelles données se basent les chiffres affichés.

Le coût de développement est modéré : un champ supplémentaire sur
chaque table, un filtre par défaut dans les queries, un toggle dans
l'UI des dashboards.

## Conséquences

### Positives

- Analyses fiables dès le jour 1 de l'app en production
- Préservation de la mémoire business historique
- Transparence totale sur la provenance des chiffres
- Possibilité de « promouvoir » une donnée legacy en app_native via
  vérification manuelle

### Négatives

- Complexité accrue du modèle de données
- Tous les écrans de listing doivent gérer le dual-mode
- Possible confusion utilisateur au début (« pourquoi ces chiffres
  différents? »)

## Atténuation des négatifs

- Documentation claire du tiering dans l'UI (bandeau explicatif)
- Onboarding qui explique le concept en 30 secondes
- Promotion progressive des données legacy → app_native à mesure
  qu'elles sont vérifiées

## Alternatives considérées

1. **Tout importer en app_native** — rejeté car pollue les analyses
2. **Tout ignorer l'historique** — rejeté car perte d'information
3. **Deux bases de données séparées** — rejeté car complexité de
   jointure trop élevée

## Implémentation technique

Détails dans `docs/07-data-quality-tiers.md`.

## Auteur

Décision proposée par Mika lors de la Phase 1 de cadrage, après
observation directe des problèmes de qualité dans le fichier Excel
source.

---

=== FICHIER: docs/decisions/ADR-003-pattern-menu-lateral-drill-down.md ===

# ADR-003 — Pattern UX : Menu latéral + Home avec drill-down

## Statut

Acceptée — Phase 1 de cadrage. À valider en Phase 3 (UX Designer) avec
des mockups concrets.

## Contexte

Quatre patterns UX modernes ont été considérés pour organiser la
navigation de l'application :

1. **Onglets** (ex: Google Analytics ancien)
2. **Menu latéral** (ex: Linear, Notion, Stripe)
3. **Home + drill-down** (ex: Apple Health, Mint)
4. **Dashboard unifié scrollable** (ex: Vercel)

Le projet doit accueillir potentiellement 7 modules (3 au MVP, 4 en
phases ultérieures), ce qui impose une navigation scalable.

## Décision

Le pattern retenu est une **combinaison** :

- **Menu latéral gauche** pour la navigation principale entre les 7
  modules
- **Page d'accueil** utilisant le pattern **cartes de drill-down** pour
  accéder aux 3 sous-dashboards (A, B, C) depuis le Module 1

## Justification

### Menu latéral

- Standard absolu des apps SaaS modernes depuis 2020
- Scale naturellement à 10+ modules
- État permanent visible (l'utilisateur sait où il est)
- Se transforme en hamburger sur mobile (bien accepté)

### Drill-down sur la home

- Vision synthétique à l'ouverture de l'app (KPIs visibles
  immédiatement)
- Cartes cliquables pour zoomer sur chaque sous-dashboard
- Hyper moderne, style apps finance 2024-2026
- Permet de visualiser la roadmap (cartes Phase B en grisé)

### Rejet des alternatives

- **Onglets** — limité à ~5 sections, ne scale pas à 7+
- **Dashboard unifié scrollable** — devient trop long avec le volume
  de données, pas adapté aux 3 sous-dashboards distincts
- **Home + drill-down seul sans menu** — pas scalable au-delà de la
  page d'accueil

## Conséquences

### Positives

- Architecture de navigation pérenne pour toute la durée du projet
- Ajout de nouveaux modules = nouvelle entrée dans le menu, zéro
  refonte
- Cohérence avec les attentes des utilisateurs modernes

### Négatives

- Le menu latéral consomme de l'espace sur mobile (mitigé par le
  hamburger)
- Deux niveaux de navigation à apprendre (menu + cartes drill-down)

## Validation attendue

Cette décision sera **validée ou ajustée en Phase 3** (UX Designer)
avec des mockups concrets et éventuellement un test utilisateur.

## Références d'inspiration

Apps dont l'UX a été étudiée :

- **Linear** — menu latéral, palette de commandes, KPIs en home
- **Notion** — navigation hiérarchique dans le menu latéral
- **Stripe Dashboard** — cartes de drill-down, KPIs en haut
- **Vercel** — home avec cartes par projet, drill-down
- **Mint** (archivé) — dashboard finance avec drill-down

## Auteur

Recommandation proposée lors de la Phase 1, à valider formellement en
Phase 3 UX.

---

## Fin du document consolidé

**Résumé de ce qui a été livré** :

- 8 fichiers principaux de documentation
- 3 décisions d'architecture (ADR)
- 1 fichier backlog pour les idées hors-scope

**Prochaines étapes prévues** :

1. Uploader ce fichier consolidé sur GitHub
2. Attendre l'accès à Claude Code
3. Demander à Claude Code de découper ce fichier en fichiers séparés
4. Démarrer les 8 sessions de déconstruction du cycle de vie
5. Passer à la Phase 2 (Data Architect) une fois les sessions
   complétées
