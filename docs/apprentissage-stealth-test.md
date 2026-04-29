# Prototype d'apprentissage stealth — Workflow photo → Marketplace

## Statut de ce document

**Document opérationnel actif.**

Ce document définit un prototype d'apprentissage **transitoire** qui
se déroule **en parallèle du cadrage et du développement MVP**. Il
n'est pas une phase du projet (MVP/B/C), c'est une activité
d'apprentissage qui informe le cadrage des phases futures.

Le prototype a une **date de mort programmée** (voir section
"Conditions de mort"). Il n'est pas destiné à devenir le MVP ni à
remplacer un module.

## Pourquoi ce document existe

Pendant le cadrage du Paquet 6 (avril 2026), Mika a identifié une
friction opérationnelle critique : la publication d'annonces sur
Facebook Marketplace est chronophage, sujette aux erreurs, et le
goulot d'étranglement principal pour scaler.

Plusieurs voies ont été explorées :

- Outils manuels (presse-papier multi-éléments, scripts simples)
- Application web complète
- Intégration Marketplace (impossible — pas d'API publique)

Aucune n'était satisfaisante en isolation. La conclusion : un
**prototype d'apprentissage minimaliste** qui teste le workflow
complet sur le terrain est plus précieux que des outils ponctuels
ou qu'attendre le développement Phase B.

Ce prototype est aligné avec le **Principe 12** (formulaires d'abord,
IA en enrichissement) et l'**ADR-010** (architecture conversationnelle
hybride) : la reconnaissance IA est une couche optionnelle qui
dépose ses résultats dans des structures simples (Excel + dossiers
Drive), sans remplacer aucune partie du workflow opérationnel.

## Objectif unique

Tester en conditions réelles, sur 3-5 lots et 30-50 kits, le workflow
complet **acquisition → photo → reconnaissance → enrichissement →
publication Marketplace**, dans le but d'informer le cadrage du
**Module 4 (Saisie mobile)** et du **Module 5 (Listing automatique)**
en Phase B.

Tout apprentissage qui ne sert pas ce cadrage est hors scope. Tout
ajout de feature qui n'apprend rien est refusé.

## Périmètre temporel et volumétrique

- **Durée maximale** : 6 mois à partir du démarrage
- **Volume cible** : 3-5 lots, 30-50 kits au total
- **Cadence** : 1-2 lots par mois, selon l'activité commerciale réelle

Si l'un de ces seuils est dépassé sans qu'un bilan d'apprentissage
ait produit de la valeur tangible pour le cadrage Phase B, le
prototype est considéré comme un échec et arrêté.

## Architecture en deux composants

Le prototype stealth se décompose en deux composants indépendants :

- **Côté production** : génération des fichiers texte de description et organisation des photos (à venir, sera développé selon les apprentissages au fil de l'eau)
- **Côté consommation** : script Tampermonkey de remplissage automatique de Marketplace (existant, voir `prototypes/marketplace-helper/`)

Les apprentissages au fil de l'eau de l'expérimentation sont consignés dans `apprentissages-stealth-test.md` (séparé de ce document de cadrage). Ce dernier document maintient la distinction entre faits validés, propositions à tester et vision long terme.

Les **données opérationnelles** (photos brutes des lots, fichiers `_annonce.txt` générés, Excel maître du prototype) iront dans un Google Drive séparé `Pneus-MG19 — Prototype stealth/`, à créer par Mika au moment du premier vrai lot. Le repo Git ne stocke que le cadrage, les ADR, le script Tampermonkey et les apprentissages.

## Les 5 features acceptées (et c'est tout)

### Feature 1 — Capture mobile d'un kit

**Description** : PWA mobile (Progressive Web App) accessible depuis
un navigateur sur téléphone. Pas d'app native, pas de store.

**Workflow utilisateur** :

1. Mika ouvre l'app sur son téléphone (raccourci vers la PWA)
2. Au démarrage de la session, Mika rentre `lieu_achat` (texte libre,
   ex: "Garage Tremblay Ste-Foy")
3. L'app génère automatiquement le `lot_id` au format `T##`
   (T01, T02, T03... selon l'historique)
4. L'app affiche la prochaine numérotation de kit disponible (T01-01
   pour le premier kit du lot T01)
5. Mika colle un sticker physique avec le code complet (ex: `T01-01`)
   sur un pneu du kit
6. Mika clique le gros bouton vert **"Nouveau kit"**
7. Mika prend **6 photos dans l'ordre fixe** (compteur 1/6, 2/6,
   etc.)
8. Pour le kit suivant : re-clique "Nouveau kit", écrit `T01-02`
   sur le sticker, etc.
9. Quand la session est finie, clique "Terminer la session"

**Convention photo (6 photos par kit, ordre fixe)** :

1. Vue d'ensemble du kit (montrer la quantité)
2. Flanc avec inscriptions visibles (marque, dimensions)
3. Bande de roulement (montrer l'usure et le motif)
4. Code DOT en gros plan (date de fabrication)
5. Jauge de profondeur posée sur la bande de roulement
6. Sticker d'identification en gros plan (pour OCR)

**Upload** : les photos sont uploadées dans Google Drive selon la
structure définie en section "Structure des dossiers Drive".

### Feature 2 — Reconnaissance automatique

**Description** : à la fin de chaque session, un script envoie les
photos à l'API Claude (Anthropic) et extrait des données
structurées.

**Données à extraire** :

- **Depuis la photo de flanc (photo 2)** :
  - `marque_detectee` (texte, ex: "Michelin")
  - `dimensions_detectees` (texte, format standardisé, ex:
    "225/65R17")
  - `saison_detectee` (enum : `hiver` / `4_saisons` / `ete` /
    `inconnu`) — détectée via les marquages 3PMSF (flocon dans la
    montagne) et M+S
  - `nature_detectee` (enum : `pneu_seul` / `sur_jante_acier` /
    `sur_rim_alu` / `inconnu`)
- **Depuis la photo de DOT (photo 4)** :
  - `dot_detecte` (4 chiffres, ex: "2419" pour semaine 24 de 2019)
  - `annee_fabrication` (calculée depuis le DOT, ex: 2019)
- **Depuis la photo de jauge (photo 5)** :
  - `usure_detectee` (numérique en 32e, ou null si illisible)
- **Depuis la photo de sticker (photo 6)** :
  - `kit_id_detecte` (lu via OCR, format `T##-##`)

**Comportement en cas d'échec** :

- Si une donnée n'est pas détectable, le champ correspondant est
  laissé vide dans l'Excel et signalé visuellement "à remplir
  manuellement"
- Si le `kit_id_detecte` ne matche pas la numérotation attendue par
  l'app, signaler un avertissement dans l'Excel

### Feature 3 — Excel maître

**Description** : feuille Google Sheets partagée dans Drive. Chaque
kit devient une ligne. Mise à jour automatique par la reconnaissance,
puis enrichissement manuel par Mika.

**Comportement conditionnel** :

- La colonne `bolt_pattern` apparaît visuellement comme "à remplir"
  (couleur de fond, marqueur visuel) si `nature_detectee` est
  `sur_jante_acier` ou `sur_rim_alu`
- La colonne `usure_32eme` apparaît "à remplir" si `usure_detectee`
  est null
- Les autres colonnes manuelles sont en surbrillance discrète tant
  qu'elles sont vides

**Validation bloquante** : le bouton "Préparer pour Facebook"
(Feature 4) refuse de générer le titre/description si :

- `prix_vente_affiche` est vide
- `marque_detectee` est vide
- `dimensions_detectees` est vide
- `saison_detectee` est `inconnu`

Cette validation est cohérente avec le **Principe 11** (engagement
explicite sur données sensibles).

### Feature 4 — Génération des fichiers texte Marketplace

**Description** : un bouton "Préparer pour Facebook" dans l'Excel.
Pour chaque ligne marquée "prêt" et qui passe la validation
bloquante, le bouton génère deux fichiers texte dans le dossier du
kit, à côté des 5 photos publiables.

**Fichiers générés** :

- `titre.txt` — le titre Marketplace prêt à coller (format optimisé
  selon ADR-011)
- `description.txt` — la description complète prête à coller, avec
  référence interne `T01-01` à la fin

**Pas de suggestion automatique de prix** : `prix_vente_affiche` est
toujours rempli manuellement par Mika, jamais suggéré ou pré-rempli,
même si le coût d'achat alloué est connu. Cohérent avec **ADR-008**
et le **Principe 11**.

**Format du titre** (selon ADR-011) :

```
[DIMENSIONS] [MARQUE] [MODÈLE si connu] - [QUANTITÉ] pneus [SAISON]
```

Exemples :

- `225/65R17 Michelin Defender - 4 pneus été`
- `185/60R15 Goodyear Ultra Grip Winter sur jantes - 4 pneus hiver`

**Format de la description** (template à ajuster pendant le test) :

```
Pneus [SAISON] [MARQUE] [MODÈLE si connu]

Dimensions : [DIMENSIONS]
Profondeur restante : [USURE]/32 ([SAISONS_RESTANTES] saisons)
Année de fabrication : [ANNÉE_DOT]
Nature : [pneus seuls / sur jantes d'acier / sur jantes d'aluminium]
[Si bolt_pattern rempli : Pattern de boulonnage : [BOLT_PATTERN]]
Quantité : 4

Prix : [PRIX] $
[Notes libres si présentes]

Texto/téléphone : [À configurer]
Email : [À configurer]
Disponible aussi par Messenger
Région : [À configurer]

Référence interne : [KIT_ID]
```

### Feature 5 — Tracking minimal du statut

**Description** : une colonne `statut` dans l'Excel avec 5 valeurs
possibles, mise à jour manuellement par Mika au fur et à mesure des
événements.

**Valeurs possibles** (cohérentes avec le modèle de données du MVP) :

- `non_publié` : kit caractérisé mais pas encore mis en ligne
- `publié` : annonce active sur Marketplace
- `vendu` : kit sorti de l'inventaire par vente
- `donné` : kit sorti par cadeau (ami, promotion, usage personnel)
- `rebut` : kit détruit (défaut, dommage, irrécupérable)

**Pas de logique de transition automatique** : Mika met à jour
manuellement. Pas d'événement dans le journal, pas de validation,
pas de workflow.

Pour `donné` et `rebut`, Mika documente la raison dans la colonne
`notes`. Cohérent avec le Paquet 2 qui exige une note libre
obligatoire pour les cadeaux.

## Anti-patterns (interdits, même si "30 minutes de plus")

Toute proposition d'ajout de feature est confrontée à la question :
**"Est-ce que ça sert directement à apprendre quelque chose pour
Module 4 ou Module 5?"** Si la réponse n'est pas un oui évident,
c'est non.

Voici la liste explicite de ce qui est **interdit** dans le
prototype :

- ❌ **Authentification multi-utilisateurs** : seul Mika utilise
  l'outil pendant le test, pas besoin de comptes
- ❌ **Gestion de variantes de kit** (subdivision usure mixte ou
  vente partielle) : on capture des kits simples, point
- ❌ **Calcul de marges, allocations de coûts** : ça appartient au
  Module 3 (Finance)
- ❌ **Workflows post-vente** (retours, indemnisations, échanges) :
  ça appartient au modèle de données complet du MVP (ADR-006)
- ❌ **Codes A247 avec 50 ancres** : on utilise T01-01, T02-03, etc.
  (voir ADR-018 pour la réservation de la lettre T)
- ❌ **Détection automatique d'usure depuis vue de bande seule** :
  impossible fiable, c'est pour ça qu'on a la 5e photo de jauge
- ❌ **Suggestion automatique de prix de vente** : Mika garde son
  expertise (Principe 11)
- ❌ **Publication automatique sur Marketplace** : impossible sans
  API, donc on accepte le manuel
- ❌ **Gestion d'emplacements physiques** : ça appartient au Module 2
  (ADR-012)
- ❌ **Belle interface** : c'est fonctionnel et c'est tout, design
  brut accepté
- ❌ **Mode hors-ligne** : on prend les photos avec connexion, point
- ❌ **Notifications, alertes, dashboards** : aucun
- ❌ **Gestion de rendez-vous** : si un client prend RDV pour un kit
  publié pendant le test, le RDV reste géré comme aujourd'hui
  (Messenger + Google Calendar manuels). Le prototype ne tracke pas
  les RDV. Si la friction devient pénible, c'est un apprentissage à
  documenter pour informer le Module 4 et l'ADR-014.
- ❌ **Gestion clients structurée** : `lieu_achat` est un champ
  texte libre simple, pas une entité Client. Cohérent avec ADR-013.

## Structure complète des données

### Identifiants et conventions

- **`lot_id`** : généré par l'app au format `T##` (T01, T02, T03...)
- **`kit_id`** : composé du `lot_id` + tiret + numéro de kit
  séquentiel dans le lot (T01-01, T01-02, T01-03, T02-01, T02-02...)
- **Le compteur de kit redémarre à 01 à chaque nouveau lot**
- **Sticker physique** : Mika écrit le `kit_id` complet (ex:
  `T01-01`) au marqueur sur un sticker collé sur un pneu du kit
- **Référence Marketplace** : "Référence interne : T01-01" en fin de
  description

### Colonnes de l'Excel maître

#### Colonnes auto-remplies par reconnaissance

- `kit_id` (T01-01)
- `lot_id` (T01)
- `lieu_achat` (saisi par Mika sur mobile, ex: "Garage Tremblay")
- `date_capture` (depuis EXIF des photos)
- `marque_detectee`
- `dimensions_detectees` (format standardisé, ex: 225/65R17)
- `dot_detecte` (4 chiffres)
- `annee_fabrication` (calculée depuis DOT)
- `saison_detectee` (hiver / 4_saisons / ete / inconnu)
- `nature_detectee` (pneu_seul / sur_jante_acier / sur_rim_alu /
  inconnu)
- `usure_detectee` (numérique 32e ou null)
- `nb_photos` (devrait être 6)
- `chemin_dossier` (URL Drive du dossier du kit)

#### Colonnes manuelles (remplies par Mika après reconnaissance)

- `usure_32eme` (numérique 4-11) — à remplir si `usure_detectee`
  est null
- `bolt_pattern` — à remplir si `nature_detectee` ≠ `pneu_seul`
- `fournisseur` — peut différer du `lieu_achat` si pertinent
- `prix_achat_lot_total` — sur la première ligne du lot uniquement
- `prix_achat_alloue_kit` — Mika alloue manuellement (méthode
  cohérente avec ADR-008)
- `prix_vente_affiche` — Mika fixe selon son expertise et les
  comparables Excel
- `notes` — libre, obligatoire pour `donné` et `rebut`
- `statut` (non_publié / publié / vendu / donné / rebut)
- `date_publication` — date où l'annonce a été mise en ligne
- `prix_vente_final` — rempli au moment de la vente

#### Colonnes générées par le bouton "Préparer pour Facebook"

- `titre_genere` (contenu de titre.txt)
- `description_generee` (contenu de description.txt)
- `date_preparation_marketplace`

### Structure des dossiers Google Drive

```
/Pneus_test_stealth/
  /T01_Tremblay_20260428/
    /T01-01/
      photo_1_ensemble.jpg
      photo_2_flanc.jpg
      photo_3_bande.jpg
      photo_4_dot.jpg
      photo_5_jauge.jpg
      titre.txt
      description.txt
      /_identification/
        photo_6_sticker.jpg
    /T01-02/
      [même structure]
    /T01-03/
      [...]
  /T02_Garage_LeBlanc_20260505/
    /T02-01/
      [même structure]
    /T02-02/
      [...]
  /Excel_maitre.xlsx (ou Google Sheets)
```

**Le sous-dossier `_identification/`** contient la photo du sticker
(photo 6). Cette photo n'est pas utilisée pour Marketplace (ne
serait pas pertinente pour un acheteur). Elle est conservée pour
traçabilité et pour permettre l'OCR de relecture si nécessaire.

## Critères de succès du prototype

Le prototype d'apprentissage stealth est jugé **réussi** si, à sa
mort, il a produit au minimum les livrables suivants. Sans ces
livrables, le prototype a été utilisé comme outil opérationnel sans
capturer la valeur d'apprentissage qui justifiait son existence.

### Livrable 1 — Apprentissages pour le Module 4 (Saisie mobile)

Au minimum **3 apprentissages concrets et actionnables** documentés
dans `docs/apprentissages-stealth-test.md`, qui modifient ou
enrichissent le cadrage du Module 4 (Saisie mobile).

Exemples du type d'apprentissages attendus (illustratifs, non
prescriptifs) :

- "La saisie mobile en extérieur nécessite des boutons de minimum
  X mm pour être utilisable avec des mains sales/froides"
- "L'ordre des photos doit/ne doit pas être strict"
- "Le compteur visuel 1/6 → 6/6 est essentiel/inutile"
- "L'app doit/ne doit pas demander confirmation avant de passer au
  kit suivant"

### Livrable 2 — Apprentissages pour le Module 5 (Listing automatique)

Au minimum **3 apprentissages concrets et actionnables** documentés,
qui modifient ou enrichissent le cadrage du Module 5 (Listing
automatique).

Exemples du type d'apprentissages attendus :

- "La génération automatique de description doit/ne doit pas inclure
  X élément"
- "Les acheteurs Marketplace réagissent mieux à tel format de titre"
- "La validation manuelle du prix est/n'est pas suffisante"
- "Le drag-and-drop des photos depuis Drive est viable/non viable
  pour la publication"

### Livrable 3 — Mesure d'accuracy de la reconnaissance IA

Une mesure quantifiée de l'accuracy de la reconnaissance automatique
sur des flancs de pneus en conditions réelles (lumière variable,
saleté, angle imparfait), pour chacun des champs détectés :

- `marque_detectee` : taux de détection correcte (%)
- `dimensions_detectees` : taux de détection correcte (%)
- `dot_detecte` : taux de détection correcte (%)
- `saison_detectee` : taux de détection correcte (%)
- `nature_detectee` : taux de détection correcte (%)
- `usure_detectee` : taux de détection correcte (%)
- `kit_id_detecte` (OCR sticker) : taux de détection correcte (%)

Cette mesure informe directement la décision Phase B sur
l'investissement à faire dans la reconnaissance IA pour le Module 4.

### Livrable 4 — Mesure de temps réel par lot

Une mesure quantifiée du temps réel pris par lot, décomposé en :

- Temps de capture mobile sur le terrain
- Temps de traitement par la reconnaissance IA
- Temps de complétion manuelle de l'Excel
- Temps de publication sur Marketplace

Cette mesure permet de valider ou invalider le **ROI estimé** du
Module 4 et du Module 5 avant leur développement, sur des données
réelles plutôt que sur des hypothèses.

### Comment juger le succès

À la mort du prototype, Mika et Patrick font ensemble un bilan
court (1-2 heures) où ils valident que les 4 livrables sont produits.

Si **les 4 livrables sont produits** : le prototype est un succès.
Ses apprentissages alimentent le cadrage Phase B et le développement
des Modules 4 et 5 commence avec une base empirique solide.

Si **moins de 4 livrables sont produits** : le prototype a été
utilisé comme outil opérationnel pur. C'est en soi un apprentissage
(la discipline de capture est plus difficile qu'anticipé), mais le
projet n'a pas tiré la valeur attendue.

Dans les deux cas, le bilan est documenté dans
`docs/apprentissages-stealth-test.md` (section finale) pour
informer les futurs prototypes éventuels.

## Conditions de mort du prototype

L'outil est explicitement temporaire. Il meurt quand l'une des
conditions suivantes est remplie :

1. **Le Module 4 (Saisie mobile) entre en développement Phase B**
2. **6 mois se sont écoulés** sans bilan d'apprentissage utile
3. **L'outil bloque ou ralentit le workflow réel** (signal d'échec)

À sa mort :

- Les **données** des kits non-vendus sont migrées dans le futur
  Module 2 en `data_quality_tier = legacy_migrated` avec
  `legacy_source = stealth_test` (cohérent avec ADR-002 et ADR-017)
- Les **codes** sont préservés (T01-01 reste T01-01 pour la
  traçabilité, voir ADR-018 pour la réservation de la lettre T)
- Le **code source** du prototype est archivé (pas supprimé, mais
  explicitement abandonné — pas de maintenance après cette date)
- Les **apprentissages** sont consolidés dans un document dédié
  `docs/apprentissages-stealth-test.md` (voir section suivante)

## Documentation continue des apprentissages

**Fichier** : `docs/apprentissages-stealth-test.md` (à créer
progressivement par Mika au fil du test, pas dans ce sommaire)

**Mise à jour** : après chaque lot photographié.

**Contenu type d'une entrée** :

- Date du lot
- Identifiant du lot (T01, T02, etc.)
- Lieu d'achat
- Nombre de kits
- **Temps réel pris** (capture mobile, traitement reconnaissance,
  complétion Excel, publication Marketplace)
- **Accuracy de la reconnaissance** (combien de marques détectées
  correctement, combien de dimensions, etc.)
- **Frictions rencontrées** (cas non prévus, bugs, ergonomie)
- **Idées qui émergent** (features à ajouter au backlog Phase B,
  cas particuliers à anticiper dans le Module 4 et 5)
- **Qu'est-ce qui devra être différent dans l'app finale**

Sans cette discipline de documentation, le prototype perd 80% de sa
valeur. C'est ce qui transforme un outil bricolé en un véritable
exercice de cadrage informé par le terrain.

## Contraintes techniques minimales

Ces contraintes sont fixées pour garantir que le prototype reste
**léger** et que sa mort soit indolore.

### Stack technique

- **Frontend** : PWA (HTML/CSS/JS minimaliste, ou framework léger
  selon préférence Patrick). **Pas de framework lourd** type
  Next.js, qui appartient au MVP.
- **Stockage** : Google Drive (entreprise, déjà disponible). Excel
  maître = Google Sheets dans le même Drive.
- **Cerveau IA** : API Anthropic (Claude). Patrick gère la clé API
  et les coûts pendant le test.
- **Hébergement** : pas d'hébergement séparé. La PWA peut être
  servie depuis Vercel free, GitHub Pages, ou même Drive selon ce
  qui est le plus simple pour Patrick.

### Ce qu'il faut résister à ajouter

Patrick connaît le projet final par cœur, ce qui est un avantage
mais aussi un risque. Pendant le développement du prototype, il
sera tenté de "bien faire" — viser propre, anticiper le futur,
préparer l'extensibilité.

**Il faut résister.** Le prototype est conçu pour mourir. Toute
heure investie au-delà du strict nécessaire est une heure perdue.

Règle simple : **si une feature n'est pas dans la liste des 5
features acceptées, elle est REFUSÉE**, même si "ça prendrait juste
30 minutes".

## Cohérence avec le projet existant

Cette section liste explicitement les liens entre le prototype et
les décisions déjà prises, pour faciliter les futures relectures.

### Principes respectés

- **Principe 1** (aucune feature ne ralentit le workflow actuel) :
  le prototype accélère significativement le workflow Marketplace
- **Principe 2** (scope MVP figé) : le prototype est explicitement
  hors scope MVP, pas une exception
- **Principe 6** (la technologie suit le besoin réel) : besoin réel
  identifié (publication Marketplace), pas de tech décorative
- **Principe 7** (scalabilité latente) : les données du prototype
  sont migrables au format du modèle final
- **Principe 11** (engagement explicite sur données sensibles) : le
  prix de vente est toujours saisi manuellement, jamais suggéré
- **Principe 12** (formulaires d'abord, IA en enrichissement) : la
  reconnaissance IA est une couche par-dessus l'Excel, pas un
  remplacement
- **Principe 13** (cas standard d'abord) : le prototype gère
  exclusivement le cas standard, aucun cas exceptionnel

### ADR liés

- **ADR-002** (tiering qualité données) : à la migration, les kits
  stealth seront en `legacy_migrated` avec `legacy_source =
  stealth_test`
- **ADR-004** (numérotation A247) : amendé par ADR-018 pour réserver
  la lettre T au prototype stealth
- **ADR-005** (immutabilité) : à la migration, les kits stealth
  deviennent immuables comme tout legacy
- **ADR-008** (allocation des coûts) : `prix_achat_alloue_kit` reste
  manuel, cohérent avec l'auto-fill interdit
- **ADR-010** (architecture conversationnelle hybride) : la
  reconnaissance IA est exactement la couche optionnelle prévue
- **ADR-011** (pricing) : prix affiché et prix vendu capturés
  séparément, comme dans le modèle final
- **ADR-013** (clients) : `lieu_achat` reste champ texte libre, pas
  une entité Client
- **ADR-014** (rendez-vous) : pas de gestion RDV dans le prototype,
  géré comme aujourd'hui hors de l'outil
- **ADR-017** (tiering opérationnel) : sous-marqueur
  `legacy_source` cohérent avec la décision 1 (tier unique conservé
  à vie)
- **ADR-018** (réservation lettre T) : créé en même temps que ce
  document

### Documents complémentaires

- `docs/pratiques-pre-mvp.md` : Pratique 4 amendée pour préciser que
  T01-01 est utilisé pendant le test, A247 prend le relais avec
  l'app finale
- `docs/questions-ouvertes.md` : Q5 mise à jour pour mentionner la
  4e convention de codes (stealth)
- `docs/06-modele-donnees.md` : section migration enrichie pour
  mentionner la 4e convention et le sous-marqueur `legacy_source`
- `docs/08-roadmap.md` : section "Activités parallèles au cadrage"
  qui référence ce document

## Auteur et historique

Document créé pendant la session de cadrage du Paquet 6 (avril 2026).
Co-construit par Mika et l'assistant après audit de cohérence des
10 points d'incohérence potentiels avec le projet existant. Les 10
points ont été tranchés explicitement avant production.

Le développement de l'outil sera fait par Patrick en weekend project.
Patrick est admin système et VP design industriel — il connaît le
projet par cœur, ce qui constitue à la fois un avantage (pas
d'onboarding) et un risque (tentation de "bien faire" et scope
creep). La discipline de respect des 5 features et des
anti-patterns est de la responsabilité conjointe Mika-Patrick.

**Dernière mise à jour** : avril 2026, création initiale.
**À mettre à jour** : à chaque évolution majeure du prototype, ou à
sa mort programmée.

---
