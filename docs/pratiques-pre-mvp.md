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

## Critère pour qu'une pratique mérite d'être ici

Une pratique pré-MVP doit cocher **les trois cases** :

1. **C'est une donnée dont l'absence aujourd'hui = perte définitive
   demain.** Pas un comportement, pas une validation, pas une
   automatisation. Une donnée qu'on ne pourra pas reconstituer
   rétrospectivement quand l'app existera.

2. **La saisie manuelle est réaliste.** Pas trop de friction au
   quotidien, faisable sans nouvel outil, sans script, sans formation
   spéciale.

3. **Le format de saisie est directement compatible avec le modèle de
   l'app future.** Pas de conversion bidouillée à prévoir lors de la
   migration.

Si une idée échoue à un seul de ces tests, elle attend l'app.

### Anti-pattern : ce qu'on n'ajoute PAS comme pratique pré-MVP

Le piège classique est de vouloir transformer Excel en mini-app. À
éviter explicitement :

- **Validations et listes déroulantes** sur les champs → l'app les
  fera mieux. Saisir en texte propre suffit.
- **Auto-incrémentation, scripts Apps Script, triggers onEdit** →
  l'app les fera mieux.
- **Dashboards, calculs analytiques sophistiqués, mises en forme
  conditionnelles** → l'app les fera mieux.
- **Workflows simulés** (statuts complexes, transitions, événements
  post-vente) → l'app les fera mieux et l'imitation grossière dans
  Excel sera à défaire au moment de la migration.

**Le principe directeur** : capturer les données, pas reproduire les
comportements. Excel reste un fichier de saisie, pas une application.

Cette discipline rejoint le Principe 1 du projet (aucune feature ne
ralentit le workflow actuel) et le Principe 12 (formulaires d'abord,
exceptions ensuite).

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

### Statut actuel de la pratique (constat de la consolidation historique)

Pendant la consolidation des fichiers Excel historiques (mars-avril
2026), Patrick a constaté que **cette pratique n'a pas été adoptée**
dans les fichiers créés après la rédaction du document. MG19 mars
2026 (créé en mars 2026) utilise toujours le format `DD3, EE3, FF3...`,
qui n'est ni le legacy 2025, ni le legacy 2026, ni le format A247.

Ce statu quo crée une **quatrième convention de codes** non prévue,
qui devra être traitée comme du legacy à la migration.

**Décision** : pour tout **nouveau lot acquis à partir de maintenant**,
appliquer effectivement le format A247 selon le mécanisme simple décrit
ci-dessus. Les fichiers en cours (MG19 mars 2026 et autres) gardent
leur convention actuelle pour ne pas introduire de désynchronisation
physique/digital sur les pneus déjà étiquetés.

**Conséquence pratique** : ouvrir un fichier de suivi "Codes A247
réservés" (Excel ou texte) qui note le prochain code disponible. À
chaque acquisition, réserver la plage et étiqueter les pneus avec ces
codes. Plus la transition tarde, plus la base de codes legacy
hétérogènes grossit.

---

## Pratique 5 — Capturer le type de client et les coordonnées de facturation à chaque vente

**Décision liée** : ADR-013 (Clients et facturation au MVP)

### Action immédiate

Pour **chaque vente** enregistrée à partir de maintenant, ajouter dans
l'Excel les colonnes suivantes :

- **Type_client** : `particulier` ou `commerce`
- **Mode_facturation** : `email`, `sms`, `papier`, ou `refuse_par_client`
- **Coordonnée_facturation** : email ou numéro de téléphone selon le
  mode (texte libre, vide si refuse_par_client)
- **Facture_envoyée** : `oui` ou `non` (à mettre à jour quand la
  facture est effectivement envoyée)

### Pour les ventes à des commerces, ajouter aussi

- **Commerce_nom** : nom de l'entreprise
- **Commerce_personne_ressource** : nom de la personne contactée
  (optionnel)
- **Commerce_termes_paiement** : `comptant`, `net_15`, `net_30`,
  `net_60`, ou `autre`

### Pourquoi maintenant

Une vente faite aujourd'hui sans ces informations ne pourra **jamais**
être recatégorisée plus tard. Tu ne te souviendras pas dans 12 mois si
tel kit a été vendu à un commerce ou à un particulier, ni si la facture
a été envoyée.

Le tableau "Factures à envoyer" prévu dans le MVP repose entièrement
sur ces champs. Sans eux, les ventes 2026 seront aveugles à cette
analyse.

### Cohérence avec ADR-013

Les valeurs ci-dessus correspondent **exactement** aux enums prévus
dans le modèle de données. Pas de conversion bidouillée à la migration.

### Attention — données potentiellement sensibles

Saisir les coordonnées clients implique de ne pas les partager
inutilement. Garder le fichier privé. La migration vers l'app intègrera
les considérations Loi 25 (voir ADR-015).

---

## Pratique 6 — Capturer la date d'achat de chaque nouveau lot

**Décision liée** : qualité des analyses de délai de vente (cadrage
Paquet 3, ADR-017 sur le tiering opérationnel)

### Action immédiate

Pour **chaque nouveau lot acquis à partir de maintenant**, ajouter une
colonne **"Date d'achat"** dans les Excel en cours et la remplir
immédiatement avec la date du jour de l'acquisition physique.

Astuce de saisie : `Ctrl + ;` insère la date du jour automatiquement
dans Excel et Google Sheets.

### Portée

Cette pratique s'applique aux **nouveaux lots à partir de maintenant**.
Les lots déjà saisis dans les Excel actuels (notamment MG19 mars 2026
en cours) **restent sans date d'achat saisie**. Pour ceux-là, le
calcul rétrospectif d'une date estimée se fera au moment de la
migration (méthode "première vente du groupe d'achat − 3 jours",
documentée dans la consolidation des fichiers historiques).

### Pourquoi maintenant

Sans la date d'achat saisie, la durée réelle de stockage avant vente
n'est pas calculable précisément. La méthode d'estimation rétrospective
est une rustine acceptable pour le legacy, mais elle introduit un biais
systématique de sous-estimation des délais et n'est pas applicable aux
lots qui ne sont jamais vendus.

Une date saisie au moment de l'achat élimine entièrement ce problème
pour les données futures.

### Friction

Quasi nulle : `Ctrl + ;` sur la colonne au moment où tu créerais la
ligne de toute façon. Quelques secondes par lot.

### Cas observé pendant la consolidation historique

Mika a spontanément ajouté une colonne "Date d'achat" dans le fichier
"MG19 Début 7 juillet 2025" mais pas dans les autres. C'est exactement
le bon réflexe — il s'agit simplement de le formaliser comme pratique
systématique pour tous les nouveaux fichiers.

---

## Pratiques à venir (à ajouter au fil des décisions)

Ce document grandit avec le cadrage. Chaque fois qu'une décision peut
être pratiquée avant l'app, elle vient s'ajouter ici.

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
- **Bonification post-Paquet 5 / 3A** : ajout du critère explicite
  "données vs comportements" et de l'anti-pattern (issu d'un travail
  de consolidation des fichiers historiques où le piège a été évité de
  justesse). Promotion des anticipations Paquet 2 en pratiques actives
  (Pratique 5 — type client et facturation, basée sur ADR-013).
  Ajout de la Pratique 6 (date d'achat des nouveaux lots, basée sur
  l'observation que Mika l'avait spontanément adoptée dans certains
  fichiers). Renforcement de la Pratique 4 (A247) avec un constat de
  non-adoption et un appel à l'action explicite.

**À compléter** au fil des décisions futures.

---
