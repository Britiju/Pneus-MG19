# ADR-017 — Portée opérationnelle du tiering

## Statut

Acceptée — Phase 1 de cadrage, extension du Paquet 5 (question soulevée
après fermeture du Paquet 5, appartenant conceptuellement au Paquet 3 mais
traitable indépendamment des données historiques manquantes).

## Contexte

ADR-002 (`docs/decisions/ADR-002-tiering-qualite-donnees.md`) a établi
l'existence du `data_quality_tier` sur les entités Lot et Kit, avec les
valeurs `legacy_migrated` (importées de l'Excel historique) et
`app_native` (créées dans l'app).

Cet ADR établissait l'existence du tier mais ne précisait pas **ce que le
tier implique concrètement** au quotidien : comment il se propage, comment
il s'affiche, quelles règles d'édition il impose, comment il se comporte
dans les workflows et les analyses.

Patrick a soulevé ces questions immédiatement après la fermeture du
Paquet 5, en réalisant que les règles d'édition envisagées dans ADR-016
n'étaient pas cohérentes avec une réflexion sérieuse sur ce que signifie
vraiment "legacy" dans la vie de l'application.

## Décisions

### Décision 1 — Le tier est unique et conservé à vie

Chaque kit et chaque lot porte un seul `data_quality_tier` qui ne change
**jamais** après l'import initial ou la création.

**Implications** :
- Un kit importé de l'Excel garde `legacy_migrated` même après avoir été
  vendu, modifié, ou enrichi dans l'app.
- Un kit créé dans l'app reste `app_native` toute sa vie.
- Le tier n'évolue jamais en fonction des actions ultérieures.

**Alternative rejetée** : un tier granulaire distinguant l'origine de
l'acquisition, de la caractérisation, et de la vente
(`tier_acquisition`, `tier_caracterisation`, `tier_vente` séparés). Jugé
trop complexe pour le MVP. À réévaluer en Phase B si les analyses en
tirent un bénéfice suffisant.

### Décision 2 — Indicateur discret visible sur la fiche

**Sur la fiche individuelle** d'un kit ou d'un lot : afficher un indicateur
discret (badge, pictogramme ou petite mention texte) signalant "fiche
historique" pour les entités `legacy_migrated`.

**Dans les listes** (inventaire, dashboard, recherche) : **pas de marquage**
par élément. Le bruit visuel serait trop important pour un bénéfice
opérationnel marginal.

**Dans les rapports** : pas de distinction au MVP (voir décision 7).

**Justification** : l'utilisateur a besoin de comprendre pourquoi certains
champs d'une fiche peuvent être vides ou suspects (l'indicateur le lui
explique silencieusement), mais n'a pas besoin de voir cette information
dans son flux quotidien de consultation.

### Décision 3 — Workflows identiques legacy et app-native

Les workflows de vente, de mise en vente, de modification, de donation, de
rebut, et tous les autres workflows de l'application fonctionnent de
manière **strictement identique** pour les kits legacy et app-native.

L'utilisateur (Mika ou admin) ne doit **pas avoir à savoir** quel est le
tier d'un kit pour opérer dessus. La distinction technique n'impacte pas
l'ergonomie ni le parcours utilisateur.

### Décision 4 — Modification des champs descriptifs

**Champs descriptifs** : marque, taille, saison, usure, quantité, véhicule
compatible, notes, fournisseur sur le lot, et tout autre champ qui décrit
l'entité sans être un identifiant ou une donnée calculée à partir d'autres
champs.

**Règle** :
- Si le kit/lot est dans un statut **non-final**, tout utilisateur (power
  user ou admin) peut modifier librement les champs descriptifs, peu
  importe le tier.
- Si le kit/lot est dans un statut **final**, personne ne peut modifier
  directement. Les corrections nécessaires passent par les workflows
  correctifs de ADR-006 (annulation de vente, retour, indemnisation).

**Statuts finaux pour un kit** : `vendu`, `donne`, `rebute_total`.

**Statuts finaux pour un lot** : figé quand au moins un de ses kits atteint
un statut final (règle d'immutabilité ADR-005).

**Justification** : un champ descriptif sur un kit non-finalisé n'est lié
à aucune action externe ayant des conséquences (facture émise, revenu
comptabilisé, preuve d'achat remise). Le corriger, c'est améliorer la
qualité de la donnée sans aucun risque. Empêcher cette correction sous
prétexte de "protéger la mémoire historique" sacralise des erreurs de
saisie passées sans bénéfice.

Cette décision **révise explicitement** la ligne "Modifier des données
`legacy_migrated` | admin" de ADR-016, qui est supprimée de la matrice au
profit des règles ci-dessus.

### Décision 5 — Modification du `display_code`

Le `display_code` (identifiant visible écrit physiquement sur le pneu ou
son étiquette : `A247`, `4S`, `1B`, etc.) est un cas spécial.

**Règle** : le `display_code` n'est **jamais modifiable en saisie libre**.
Toute modification passe obligatoirement par le **workflow explicite
"correction de code"** décrit dans ADR-016.

Ce workflow impose :
- Confirmation explicite de l'utilisateur
- Raison obligatoire
- Journalisation complète (ancien code → nouveau code conservés dans le
  journal d'événements)
- **Notification admin immédiate** par email

**S'applique à** : tous les kits, peu importe le tier (legacy ou
app-native), peu importe le statut (y compris vendu, donné, rebuté).

**Justification** : le `display_code` n'est pas un simple champ
descriptif. C'est un identifiant avec des conséquences externes :
- Il est écrit physiquement sur le pneu dans l'entrepôt
- Il est référencé dans des éléments hors-app (RDV, SMS envoyés, annonces
  en ligne, factures éventuelles, photos liées)
- Il doit rester unique au niveau de la base de données

Le changer sans cadre serait une source de désynchronisation
physique/digital et de rupture de cohérence externe. Le workflow contrôlé
existant suffit à maîtriser le risque tout en préservant la possibilité
de corriger les vraies erreurs.

### Décision 6 — Champs vides critiques bloquent la finalisation de vente

**Contexte** : les kits legacy importés de l'Excel peuvent avoir des
champs vides (exemple : pas d'année d'usinage, `Bolt_pattern` absent sur
un kit sans jantes, etc.).

**Règle** : au moment de **finaliser une vente**, l'application détecte les
champs dits **critiques** qui seraient vides et **bloque la finalisation**
jusqu'à complétion.

**Champs critiques au MVP** (essentiels à la vente et/ou à la facture) :
- Marque
- Taille
- Saison
- Usure moyenne (si applicable selon la nature du kit)
- Quantité

**Champs accessoires** (peuvent rester vides sans bloquer) :
- Année d'usinage
- `Bolt_pattern` sur un kit sans jantes
- Véhicule compatible
- Notes et notes de prospection
- Tout autre champ non listé comme critique

**UX attendue** : au clic sur "Finaliser la vente", si un champ critique
est vide, affichage d'un message clair de type "Avant de finaliser la
vente, complète ces champs : [liste]." Avec lien direct pour compléter,
puis retour au workflow de vente.

**Note importante** : cette validation est **générique** — elle s'applique
à tout kit en cours de vente, legacy ou app-native. Elle n'est pas un
workflow spécial pour les kits legacy. En pratique, les kits app-native
auront leurs champs critiques remplis dès la création, donc la validation
ne déclenchera de blocage que sur les kits legacy ou sur les quelques
cas où un kit app-native aurait été créé en mode `draft` avec des champs
manquants.

### Décision 7 — Pas de distinction dans les rapports au MVP

Au MVP, les rapports et statistiques du dashboard traitent **uniformément**
les ventes legacy et app-native.

**Pas de distinction** dans :
- Le chiffre d'affaires affiché
- Le nombre de kits vendus par période
- Les marges globales
- Les temps de vente moyens
- Tout autre indicateur du dashboard MVP

**Justification** : au MVP, les analyses sont simples. Introduire la
distinction ajouterait de la complexité sans bénéfice proportionnel.

**Évolution prévue (backlog)** : en Phase B, quand les analyses
deviendront plus sophistiquées, ajouter des vues qui séparent ou filtrent
les ventes legacy vs app-native. Certaines données d'origine (prix
d'achat, date d'acquisition) viennent de l'Excel et sont moins fiables —
les analyses de marge ou de saisonnalité en bénéficieraient.

### Décision 8 — Cas "app-native devient historique" non modélisé

**Scénario théorique** : Patrick importe plus tard des données d'un autre
système (vieux logiciel, Excel oublié, autre source) qui se rapportent à
un kit déjà créé en app-native.

**Décision** : ce cas n'est **pas modélisé au MVP**. Aucun mécanisme pour
"rétrograder" un kit d'app-native vers legacy n'est prévu.

**Justification** : le scénario est hautement improbable. Si un jour il se
produit, la décision sera prise à ce moment-là, avec les informations
concrètes disponibles.

### Décision 9 — Les lots suivent la même logique que les kits

Toutes les décisions 1 à 8 ci-dessus s'appliquent également aux **lots**
(acquisitions groupées) :
- Tier unique conservé à vie
- Indicateur discret sur la fiche du lot (pas dans les listes)
- Workflows identiques legacy et app-native
- Champs descriptifs (fournisseur, notes sur le lot, etc.) modifiables
  librement tant que le lot n'est pas figé par la vente d'un de ses kits
- Une fois figé : plus de modifications directes (ADR-005)

## Conséquences

### Positives

- Cohérence opérationnelle : Mika opère identiquement sur tous les kits
- Correction fluide des erreurs historiques non-vendues
- Protection forte des identifiants (`display_code`) et des ventes
  finalisées
- UX claire : un indicateur sur la fiche suffit à expliquer les données
  manquantes sans polluer les listes
- Règle de validation générique (champs critiques) qui profite à tous les
  cas, pas seulement legacy

### Négatives

- Légère complexité d'implémentation sur la validation des champs
  critiques au moment de la vente
- Obligation de définir rigoureusement la liste des "champs descriptifs"
  vs identifiants au niveau du code
- Perte de la protection "admin seul pour legacy" de la version
  intermédiaire de ADR-016 — à compenser par une surveillance du journal
  si nécessaire

### Atténuations

- Le journal d'événements (ADR-005) trace toutes les modifications avec
  utilisateur et timestamp
- Les modifications sur kits finalisés restent impossibles (soft-locked
  par le statut final)
- Le workflow "correction de code" avec notification admin couvre le cas
  le plus risqué (changement d'identifiant)

## Alternatives considérées

1. **Maintenir "admin seul pour legacy"** (position intermédiaire de
   ADR-016) — rejeté par Patrick après réflexion comme sacralisant des
   erreurs sans bénéfice réel.
2. **Tier granulaire** (acquisition, caractérisation, vente distincts) —
   rejeté comme trop complexe au MVP. Reporté en Phase B potentielle.
3. **Interdiction absolue de modifier un kit vendu** (y compris son
   display_code) — rejeté. Le workflow "correction de code" avec
   notification admin est jugé suffisant pour les rares cas légitimes
   (erreur de saisie découverte tardivement).
4. **Marquage "historique" dans les listes** — rejeté par Patrick comme
   trop intrusif visuellement.
5. **Validation des champs critiques à la création du kit, pas à la
   vente** — rejeté implicitement car les kits legacy importés arrivent
   avec des champs déjà vides ; valider à la vente est plus pragmatique.

## Décisions connexes et dépendances

- **ADR-002** (tiering) : cet ADR est étendu par ADR-017 pour couvrir la
  portée opérationnelle. L'existence du tier reste définie par ADR-002.
- **ADR-005** (immutabilité) : les statuts finaux sont verrouillés par
  ADR-005 ; ADR-017 s'appuie sur cette immutabilité pour ses règles
  d'édition.
- **ADR-006** (événements post-vente) : les corrections nécessaires sur
  des kits finalisés passent par les workflows définis dans ADR-006
  (annulation, retour, indemnisation).
- **ADR-016** (rôles utilisateurs) : la ligne "Modifier des données
  legacy_migrated | admin" de la matrice est supprimée et remplacée par
  les règles basées sur le statut et le type de champ définies ici.

## Questions laissées ouvertes par cet ADR

Aucune nouvelle question ouverte n'est créée. Les points non traités ont
été identifiés comme hors-scope du MVP et gérés dans le backlog ou
reportés à la phase où ils deviendront pertinents.

## Auteur

Décision prise par Patrick dans la continuité du Paquet 5. L'assistant a
aidé à formaliser les 9 décisions et à structurer le document. Patrick a
initié la remise en cause de la règle "admin seul pour legacy" et guidé
le cadrage par une question pragmatique : "qu'est-ce que ça cause
vraiment comme problème?"
