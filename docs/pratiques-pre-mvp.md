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

## Pratique 4 — Numérotation transitoire pendant le prototype stealth

**Décision liée** : ADR-004 (système A247), ADR-018 (réservation
lettre T), `docs/apprentissage-stealth-test.md` (prototype stealth)

### Action immédiate (pendant le prototype stealth)

Pendant la durée du prototype d'apprentissage stealth (avril 2026
→ max 6 mois), tous les nouveaux kits sont numérotés selon le
format **`T##-##`** :

- T01-01, T01-02, T01-03... pour les kits du premier lot
- T02-01, T02-02... pour le deuxième lot
- etc.

Le format est documenté en détail dans
`docs/apprentissage-stealth-test.md`.

**Mécanisme** :

L'app PWA mobile du prototype génère automatiquement le prochain
numéro disponible. Mika écrit le code complet (ex: `T01-01`) au
marqueur sur un sticker collé sur un pneu du kit.

**Cohérence avec le système A247 final** :

La lettre `T` est explicitement réservée aux codes du prototype
(ADR-018). Le système A247 ne la générera jamais. Les codes T##-##
sont distinguables visuellement des codes A247 par leur format (6
caractères avec tiret vs 4 caractères sans tiret).

### Bascule vers A247 (avec l'app finale)

Quand l'app finale (Module 4 - Saisie mobile) entre en
développement Phase B :

1. Les kits du prototype stealth (codes T##-##) sont migrés en
   `legacy_migrated` avec `legacy_source = stealth_test`. Leurs
   codes sont préservés.
2. Le système A247 prend le relais avec ses 50 ancres distribuées
   dans les 25 lettres autres que T (voir ADR-004 et ADR-018).
3. Tous les nouveaux kits créés après la bascule reçoivent un code
   au format A247 (ex: A001, B247, M508...).
4. Les 4 conventions cohabitent dans la base : legacy 2025, legacy
   2026, stealth, app-native.

### Bénéfice immédiat

- Format simple à écrire sur le terrain (6 caractères au marqueur)
- Identification physique-numérique solide pendant le test
- Migration future préservant l'historique
- Test en conditions réelles du concept de codes courts (informe le
  cadrage du système A247 final)

### Attention

- **Ne pas mélanger** les formats pendant le test : tous les
  nouveaux kits sont en T##-##, pas en A247
- **Ne pas réutiliser** un code T##-## après la migration : la
  lettre T est définitivement réservée au legacy stealth (ADR-018)
- **Conserver les stickers** physiques sur les pneus jusqu'à la
  vente, même après migration dans l'app finale

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
