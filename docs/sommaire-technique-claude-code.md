# Sommaire technique — Mises à jour post-cadrage Paquet 1

> **Ce document est destiné à Claude Code.** Il liste les actions
> concrètes à effectuer sur le repo pour refléter les décisions prises
> pendant le cadrage du Paquet 1 et le début du Paquet 2.
>
> Chaque section est **auto-suffisante** : elle indique quel fichier
> toucher, quoi modifier, pourquoi, et comment vérifier que c'est bien
> fait.

## Comment lire ce document

Chaque action suit cette structure :

- **Fichier** : chemin exact dans le repo
- **Type d'action** : CREATE / UPDATE / DELETE
- **Raison** : pourquoi cette action est nécessaire
- **Détail** : ce qu'il faut concrètement écrire ou modifier
- **Vérification** : comment confirmer que l'action est bien faite

## Ordre d'exécution recommandé

Les actions sont numérotées dans l'ordre conseillé. Tu peux grouper
plusieurs actions en un seul commit logique.

**Commit 1** — Corrections d'incohérences (Actions 1-2)
**Commit 2** — Nouveaux principes directeurs (Action 3)
**Commit 3** — Nouveaux ADR (Actions 4-6)
**Commit 4** — Nouveau doc stack technique (Action 7)
**Commit 5** — Document questions ouvertes (Action 8)
**Commit 6** — Enrichissement backlog (Action 9)
**Commit 7** — Ajout du raisonnement préservé (Action 10)

Pour chaque commit : message clair expliquant le **pourquoi**, pas
juste le **quoi** (convention du projet, voir `CLAUDE.md`).

---

## Action 1 — Corriger les incohérences dans `docs/02-personae-utilisateurs.md`

**Fichier** : `docs/02-personae-utilisateurs.md`

**Type d'action** : UPDATE

**Raison** : Ce fichier contient deux affirmations périmées qui
contredisent les ADR-004 et ADR-007 adoptés pendant le Paquet 1.

### Détail des modifications

**Modification 1.1** — Corriger la mention des "IDs opaques K4M, M7P"

Dans la section **Persona 2 — Les partenaires occasionnels**, la
sous-section "Considération de design importante" contient actuellement :

```
- **IDs opaques** : les codes d'étiquettes sont aléatoires (ex: `H3K`,
  `M7P`), non séquentiels, pour empêcher la déduction du volume total
```

**Remplacer par** :

```
- **Numérotation à 50 ancres** : les codes d'étiquettes suivent un
  format `A247` (1 lettre + 3 chiffres) avec 50 ancres réparties dans
  l'espace des codes possibles. L'incrémentation mentale est préservée
  intra-session (codes consécutifs quand Mika étiquette une série),
  mais les positions entre sessions sont aléatoires, empêchant la
  déduction du volume total par un observateur externe. Voir
  `docs/decisions/ADR-004-numerotation.md` pour le détail.
```

**Modification 1.2** — Corriger la mention des "Rôles utilisateurs dès le MVP"

Juste après la modification 1.1, la ligne suivante dit actuellement :

```
- **Rôles utilisateurs dès le MVP** : même simple, une séparation
  "propriétaire" vs "partenaire" existe, avec masquage des données
  financières pour les partenaires
```

**Remplacer par** :

```
- **Accès ouvert au MVP avec traçabilité** : tous les utilisateurs
  authentifiés ont accès à toutes les fonctionnalités. La protection
  repose sur le journal d'événements (chaque action est tracée et
  attribuée) plutôt que sur des permissions restrictives. Les
  permissions granulaires sont inscrites au backlog pour activation
  conditionnelle en Phase B ou C. Voir
  `docs/decisions/ADR-007-acces-mvp.md` pour le détail.
```

**Modification 1.3** — Mettre à jour le tableau de synthèse

À la fin du document, le tableau "Synthèse des implications" contient
actuellement une ligne pour les partenaires :

```
| Partenaires | Système de rôles simple + IDs opaques obligatoires |
```

**Remplacer par** :

```
| Partenaires | Accès ouvert + journal d'événements + numérotation à 50 ancres (protection des volumes) |
```

### Vérification

Après modification, rechercher les chaînes suivantes dans
`docs/02-personae-utilisateurs.md` — elles ne doivent **plus exister** :

- `K4M` ou `H3K` ou `M7P`
- `IDs opaques`
- `Rôles utilisateurs dès le MVP`
- `masquage des données financières pour les partenaires`

Les références ajoutées à ADR-004 et ADR-007 doivent être valides
(les fichiers existent).

---

## Action 2 — Nettoyer la référence manquante à `docs/09-stack-technique.md`

**Fichier** : `CLAUDE.md`

**Type d'action** : UPDATE (temporaire, à reprendre en Action 7)

**Raison** : `CLAUDE.md` référence actuellement `docs/09-stack-technique.md`
dans la section "Navigation dans la documentation", mais ce fichier
n'existe pas dans le repo. Pour éviter la référence cassée pendant que
le fichier est en cours de création, cette ligne doit être
temporairement marquée comme "à créer".

### Détail

Dans `CLAUDE.md`, trouver la ligne :

```
- docs/09-stack-technique.md : choix techniques détaillés
```

**Remplacer par** :

```
- docs/09-stack-technique.md : choix techniques détaillés (à compléter avant développement MVP)
```

**Note** : ne pas supprimer la ligne. Le fichier sera créé en Action 7.
La mention "à compléter avant développement MVP" rend explicite le
fait que ce n'est pas un oubli.

### Vérification

`grep -n "09-stack-technique" CLAUDE.md` doit retourner la nouvelle
version de la ligne, une seule occurrence.

---

## Action 3 — Ajouter les principes 10-13 à `docs/01-vision-produit.md`

**Fichier** : `docs/01-vision-produit.md`

**Type d'action** : UPDATE (addition)

**Raison** : Quatre nouveaux principes directeurs ont émergé pendant
le cadrage du Paquet 1 et début Paquet 2. Ils doivent être ajoutés à
la liste officielle pour être opposables comme règles de décision.

### Détail

Dans la section "### Les 9 principes directeurs", après le Principe 9
(Immutabilité des faits engagés), **ajouter** ces quatre principes à
la suite.

**Attention** : la section s'appelle actuellement "Les 9 principes
directeurs". Elle devient "Les 13 principes directeurs". Mettre à jour
le titre en conséquence.

**Texte à ajouter** (après le bloc du Principe 9, avant la section
"## Objectif long terme") :

```
**Principe 10 — Saisie d'abord, exceptions ensuite**

Le workflow standard traite le cas majoritaire de façon uniforme. Les
exceptions ne sont pas gérées en complexifiant le workflow principal,
mais via des actions séparées qui traitent spécifiquement le cas
particulier. Exemple : un retour de marchandise normal (remise en
stock) suit le workflow standard. Un retour avec pneus dégradés passe
par l'action séparée "Rebut partiel" après le retour normal, pas par
un formulaire de retour qui gère toutes les variantes.

**Principe 11 — Engagement explicite sur données sensibles**

Les champs à impact business ou comptable (prix, allocations, codes
d'identifiants) ne sont jamais pré-remplis automatiquement.
L'utilisateur doit faire un acte conscient en saisissant ou en
sélectionnant explicitement la valeur. Des boutons raccourcis sont
proposés pour accélérer les cas standards, mais chaque raccourci
nécessite un clic explicite — pas de validation passive. Ce principe
prévient les erreurs de validation distraite sur des données à
conséquences.

**Principe 12 — Formulaires d'abord, IA en enrichissement**

Les interfaces principales de l'application sont des formulaires
explicites avec une structure prévisible. Les technologies avancées
(saisie vocale, extraction IA depuis photos, suggestions
prédictives) sont des **couches optionnelles** qui se déposent
par-dessus les formulaires, sans les remplacer. Les formulaires
restent le fallback universel disponible en permanence. Un utilisateur
qui ne veut pas ou ne peut pas utiliser les couches IA doit pouvoir
opérer l'app à 100% via les formulaires classiques.

**Principe 13 — Cas standard d'abord (règle 80/20)**

Le design est optimisé pour le cas majoritaire (80% des situations).
Les cas rares (20%) sont supportés mais ne dictent pas l'architecture
principale. Exemple : 98% des kits n'ont pas de variantes, donc le
modèle de données traite le kit comme entité principale et les
variantes comme extension optionnelle, plutôt que d'imposer
systématiquement la granularité maximale.
```

### Vérification

- Le titre de la section doit maintenant être "### Les 13 principes
  directeurs"
- `grep -c "Principe " docs/01-vision-produit.md` doit retourner 13
  (une occurrence par principe, dans les en-têtes en gras)
- La section "## Objectif long terme" doit toujours être présente
  juste après les principes

---

## Action 4 — Créer `docs/decisions/ADR-008-allocation-couts-lot.md`

**Fichier** : `docs/decisions/ADR-008-allocation-couts-lot.md`

**Type d'action** : CREATE

**Raison** : Pendant le début du Paquet 2 (finances), la stratégie
d'allocation des coûts d'un lot sur ses kits a été tranchée. Cette
décision structurante mérite un ADR formel.

### Contenu complet du fichier

```markdown
# ADR-008 — Allocation des coûts d'un lot sur les kits

## Statut

Acceptée — début du Paquet 2 (finances).

## Contexte

Quand Mika achète un lot (ex: 1200$ pour 8 kits), ce prix total doit
être réparti sur les kits individuels pour permettre le calcul de la
marge par kit. Sans allocation, les analyses financières fines
(marge par fournisseur, ROI par kit, rapports par marque) sont
impossibles.

Plusieurs stratégies étaient envisageables :

1. **Division égale** entre kits
2. **Proportionnelle au nombre de pneus** de chaque kit
3. **Proportionnelle à la valeur de revente estimée**
4. **Saisie manuelle** intégrale par Mika
5. **Hybride** : champs vides + boutons raccourcis + saisie manuelle

## Décision

**Stratégie 5 (hybride) retenue** :

### Comportement à la saisie d'un lot

- Les champs d'allocation par kit sont **vides par défaut**
- Aucun pré-remplissage automatique — l'utilisateur doit faire un
  choix explicite (Principe 11)
- Trois **boutons raccourcis** sont proposés :
  - "Diviser également entre kits" — divise le prix total par le
    nombre de kits, applique la valeur uniforme
  - "Diviser proportionnellement aux pneus" — répartit selon le
    nombre de pneus de chaque kit
  - "Tout remettre à 0" — réinitialise les allocations
- L'utilisateur peut **toujours saisir manuellement** les montants
  individuels, même après utilisation d'un raccourci
- **Validation bloquante** : l'application refuse la sauvegarde si la
  somme des allocations ≠ prix total du lot (comparaison exacte, pas
  approximative)

### Choix du raccourci par défaut

Quand l'utilisateur hésite, le bouton le plus saillant visuellement
est "Diviser également entre kits". Ce choix est justifié par :

- Un kit est l'unité économique du business (pas le pneu individuel)
- Un kit de 4 pneus n'est pas "2× plus valuable" qu'un kit de 2 pneus
  (le marché n'est pas strictement linéaire au nombre de pneus)
- Simplicité : pas de calcul proportionnel à faire mentalement

L'utilisateur qui préfère la répartition proportionnelle dispose du
bouton dédié.

### Stockage en base

Chaque kit porte un champ `prix_achat_alloue` (montant décimal). Ce
champ est :

- Obligatoire à la création du kit (non nullable)
- Immuable après que le lot parent devient `committed` (voir ADR-005)
- Modifiable seulement via un événement correctif explicite

## Justification

### Pourquoi pas d'auto-fill automatique?

L'auto-fill (champs pré-remplis selon une règle standard) aurait été
plus rapide pour l'utilisateur. Il a été rejeté pour trois raisons :

**1. Validation distraite** — Un utilisateur pressé clique "OK" sans
vérifier les valeurs pré-remplies. Sur des champs financiers, cette
validation passive peut introduire des erreurs permanentes dans la
base (les allocations ne seront modifiables qu'après le commit du
lot, via actions correctives lourdes).

**2. Opacité du calcul** — L'auto-fill cache la logique de
répartition. L'utilisateur ne sait pas toujours pourquoi le kit A247
a 150$ alloué et le kit B088 a 180$. Cette opacité devient
problématique lors des audits ou corrections.

**3. Violation du Principe 11** — Les champs à impact business doivent
être saisis avec engagement explicite. L'auto-fill est l'anti-pattern
du Principe 11.

### Pourquoi accepter la Stratégie 5 plutôt que la saisie manuelle pure?

La saisie manuelle pure imposerait de taper 8 valeurs distinctes pour
un lot de 8 kits, même si toutes les valeurs sont identiques. C'est
une friction inutile pour un cas standard.

Les boutons raccourcis accélèrent le cas standard (un clic au lieu de
8 saisies) tout en préservant l'engagement explicite (le clic est
intentionnel, pas passif).

## Conséquences

### Positives

- Intégrité des données d'allocation (pas d'erreurs de validation
  passive)
- Traçabilité des choix (les raccourcis utilisés peuvent être
  journalisés)
- Flexibilité totale (saisie manuelle reste disponible)
- Alignement avec Principe 11 (engagement explicite)
- Alignement avec Principe 13 (les raccourcis optimisent le cas
  standard)

### Négatives

- Marginalement plus de friction qu'un auto-fill pur (un clic
  supplémentaire)
- Interface nécessite 3 boutons visibles (espace écran)
- Validation bloquante impose à l'utilisateur de corriger avant
  sauvegarde (pas de brouillon avec allocations incomplètes)

### Atténuation des négatifs

- Les boutons raccourcis sont gros et bien placés (1 clic ≈ 1 seconde)
- Le mode `draft` du lot permet de sauvegarder avec allocations
  incomplètes ; la validation ne bloque que la transition vers
  `active`

## Alternatives considérées

1. **Auto-fill égal par défaut** — rejeté (Principe 11)
2. **Auto-fill proportionnel aux pneus** — rejeté (Principe 11 +
   opacité)
3. **Saisie manuelle pure sans raccourcis** — rejeté (friction inutile
   sur cas standard)
4. **Tolérance sur la somme (arrondi automatique)** — rejeté
   (intégrité comptable exige une somme exacte)

## Implémentation technique

- Formulaire d'allocation affiché à la création ou édition d'un lot
  `draft`
- Validation côté client (feedback immédiat) et côté serveur (source
  de vérité)
- Contrainte SQL `CHECK (SUM(prix_achat_alloue) = prix_total)` sur la
  transition `draft → active`
- Journal d'événements enregistre les changements d'allocation
  pendant l'état `active`

## Auteur

Décision co-construite pendant le début du Paquet 2. L'assistant avait
initialement proposé un auto-fill automatique, rejeté par Mika en
faveur de la Stratégie 5 hybride. Cette discussion a donné naissance
au Principe 11 (Engagement explicite sur données sensibles).

---
```

### Vérification

- Le fichier existe : `ls docs/decisions/ADR-008-allocation-couts-lot.md`
- Le fichier est valide Markdown (pas d'erreur de syntaxe)
- Le nom de fichier respecte le pattern des ADR existants (numéro +
  slug kebab-case)

---

## Action 5 — Créer `docs/decisions/ADR-009-retours-fournisseur.md`

**Fichier** : `docs/decisions/ADR-009-retours-fournisseur.md`

**Type d'action** : CREATE

**Raison** : Le cas des retours au fournisseur (pré-mise-en-stock) a
été identifié pendant le Paquet 1 mais pas formalisé en ADR. Ce cas
distinct des retours post-vente mérite un ADR propre.

### Contenu complet du fichier

```markdown
# ADR-009 — Gestion des retours au fournisseur (pré-mise-en-stock)

## Statut

Acceptée — Phase 1 de cadrage, Paquet 1.

## Contexte

Quand Mika achète un lot, il peut découvrir **après l'acquisition mais
avant la mise en vente** qu'un ou plusieurs kits ont un problème
majeur :

- Pneu fissuré non visible à l'inspection initiale
- Taille réelle différente de celle annoncée par le fournisseur
- Usure supérieure à ce qui était convenu
- Défaut structurel (déchirure, bulle)

Dans ces cas, Mika retourne le(s) kit(s) au fournisseur, qui le(s)
rembourse partiellement.

Ce cas est **distinct des retours post-vente** (ADR-006) : ici, les
pneus n'ont jamais été vendus, c'est une correction en amont de
l'inventaire actif.

Le modèle initial ne gérait pas ce cas. Identifié par Mika pendant
l'audit du Paquet 1.

## Décision

### Nouveau type d'événement : `retour_fournisseur`

Ajout d'un nouveau type d'événement dans le journal, déclenché par
une action utilisateur explicite "Retourner au fournisseur".

**Effet sur le kit retourné** :

- Statut → `retourne_fournisseur`
- Disparition de l'inventaire visible (soft delete, traçabilité
  conservée)
- Le code `display_code` reste réservé au kit (pas de réutilisation)

**Effet sur le lot parent** :

- Le lot **conserve son prix d'achat total immuable** (ADR-005)
- Un événement enregistre le remboursement reçu du fournisseur
- Le "coût effectif" du lot est calculé dynamiquement :
  `cout_effectif = prix_achat_total - somme(remboursements)`
- Les allocations `prix_achat_alloue` des autres kits du lot ne sont
  pas automatiquement recalculées

### Granularité : tout le kit, pas par pneu

**Règle** : tous les pneus d'un kit retourné sont retournés ensemble,
même si un seul est défectueux.

**Justification** : en pratique terrain, les fournisseurs reprennent
par kit (ensemble économique), pas par pneu individuel. Gérer le
retour par pneu introduirait une complexité modélisant un cas qui ne
se produit pas.

**Conséquence** : si 1 pneu sur 4 est défectueux et que le
fournisseur ne veut reprendre que ce pneu (cas extrêmement rare), le
workflow à suivre est :

1. Ne pas utiliser "Retour fournisseur"
2. Utiliser "Rebut partiel" pour le pneu défectueux
3. Conserver le kit avec 3 pneus
4. Créer une variante si nécessaire pour la vente

Ce contournement est accepté pour un cas rare.

### Impact sur les allocations des kits restants

**Décision** : les allocations des autres kits du lot ne sont **pas**
recalculées automatiquement après un retour fournisseur.

**Raison** : ces allocations sont déjà immuables (lot committed ou
kit individuellement vendu). Recalculer rétroactivement violerait
ADR-005.

**Conséquence pratique** : le "coût effectif" affiché dans les
dashboards reflète le vrai coût après remboursements, mais les
allocations individuelles restent celles fixées à l'origine.

### Workflow utilisateur

Sur la fiche d'un kit en statut `draft`, `en_stock` ou `en_vente` (pas
encore vendu), bouton **"Retourner au fournisseur"** accessible.

Clic → modal demandant :

- Raison du retour (liste déroulante + champ libre)
- Montant remboursé par le fournisseur
- Date du retour
- Notes optionnelles

Confirmation → événement journalisé, kit passe en
`retourne_fournisseur`, remboursement enregistré sur le lot parent.

### Restrictions

- Un kit **déjà vendu** (`vendu`, `committed`) ne peut pas utiliser ce
  workflow. Les retours post-vente passent par ADR-006.
- Un kit **rebuté totalement** (`rebute_total`) ne peut pas être
  retourné au fournisseur. L'événement de rebut est final.

## Justification

### Pourquoi un événement distinct des autres ?

Le `retour_fournisseur` a des caractéristiques uniques :

- Flux financier inverse (fournisseur rembourse, pas client)
- Impact sur le lot d'acquisition (pas sur une vente)
- Temporalité (avant vente, pas après)
- Statut final différent (`retourne_fournisseur`, pas `retournée`)

Le regrouper avec les retours post-vente créerait de la confusion
conceptuelle et compliquerait les rapports analytiques.

### Pourquoi l'immutabilité du prix du lot ?

Deux options étaient envisageables :

**Option A** — Modifier le prix total du lot après retour fournisseur
**Option B** — Garder le prix immuable + calcul dynamique du coût effectif

L'Option A viole ADR-005 (immutabilité des faits engagés dès le
premier kit vendu). L'Option B préserve l'intégrité tout en
permettant des calculs précis.

## Conséquences

### Positives

- Gestion réaliste du business (les retours fournisseur se produisent)
- Alignement avec ADR-005 (immutabilité)
- Base pour KPI futurs : taux de défauts par fournisseur, montant
  moyen des retours par fournisseur
- Traçabilité complète de la qualité des lots

### Négatives

- Un type d'événement supplémentaire à implémenter
- UI supplémentaire (modal de retour)
- Formation utilisateur : expliquer la distinction
  "retour fournisseur" vs "retour client"

## KPI dérivés (Phase B ou C)

Les événements `retour_fournisseur` alimenteront éventuellement :

- Taux de retour fournisseur par source
- Montant total des remboursements par fournisseur et période
- Signal de fiabilité des fournisseurs (critère de sélection)
- Comparaison coût théorique vs coût effectif des lots

## Alternatives considérées

1. **Traiter comme un rebut total** — rejeté car perd l'information
   financière du remboursement
2. **Modifier le prix du lot** — rejeté (viole ADR-005)
3. **Gérer pneu par pneu** — rejeté (sur-ingénierie pour un cas rare)
4. **Ne pas gérer au MVP** — rejeté car identifié comme cas fréquent
   par Mika

## Auteur

Cas identifié par Mika pendant l'audit du Paquet 1. L'assistant
n'avait pas prévu ce cas dans le modèle initial — exemple typique du
pattern "vérification par cas terrain" qui ajoute des éléments
nécessaires au scope.

---
```

### Vérification

- Fichier présent : `ls docs/decisions/ADR-009-retours-fournisseur.md`
- Respecte le format des ADR existants (statut, contexte, décision,
  etc.)

---

## Action 6 — Créer `docs/decisions/ADR-010-architecture-conversationnelle.md`

**Fichier** : `docs/decisions/ADR-010-architecture-conversationnelle.md`

**Type d'action** : CREATE

**Raison** : Le Principe 12 (Formulaires d'abord, IA en enrichissement)
formalise une position architecturale importante sur le rôle de la
voix et de l'IA. Cette position mérite un ADR dédié pour éviter les
dérives futures.

### Contenu complet du fichier

```markdown
# ADR-010 — Architecture conversationnelle hybride

## Statut

Acceptée — Phase 1 de cadrage, Paquet 1.

## Contexte

Pendant le cadrage, l'idée d'une interface **conversationnelle** (chat
vocal ou textuel) comme interface principale de l'application a été
évoquée. Le terrain de Mika (extérieur, mains sales, mobilité) semble
favoriser la voix sur le clavier.

Deux philosophies architecturales étaient possibles :

**Philosophie A — Conversationnelle d'abord**
L'interface principale est un chat. L'utilisateur parle à l'app qui
extrait les données et met à jour la base. Les formulaires
n'apparaissent qu'en cas de clarification nécessaire.

**Philosophie B — Formulaires d'abord, IA en enrichissement**
Les interfaces principales sont des formulaires classiques. Les
technologies avancées (voix, extraction IA depuis photos,
suggestions) sont des **couches optionnelles** qui se déposent
par-dessus, sans remplacer les formulaires.

## Décision

**Philosophie B retenue** (Principe 12).

Les formulaires sont la **colonne vertébrale** de l'app. La voix et
l'IA sont des accélérateurs ajoutés à plusieurs points du workflow,
mais jamais des remplacements.

### Architecture en couches

```
Couche 1 (base) — Formulaires classiques
  ↑
Couche 2 (optionnelle) — Saisie vocale (Whisper)
  ↑
Couche 3 (optionnelle) — Extraction IA depuis photos (Claude API)
  ↑
Couche 4 (optionnelle) — Suggestions prédictives (modèle entraîné)
```

Chaque couche supérieure **dépose ses résultats** dans les champs des
formulaires de la couche 1. L'utilisateur voit toujours les valeurs
dans les formulaires et peut les modifier.

**Règle d'or** : un utilisateur qui ne veut ou ne peut pas utiliser
les couches 2-4 doit pouvoir opérer l'app à 100% via la seule couche
1.

### Points d'intégration de la voix au workflow

Au MVP, **aucune intégration vocale**. Les formulaires classiques
suffisent.

En Phase B, la saisie vocale est activée à plusieurs points :

- Caractérisation d'un kit (parler en inspectant)
- Ajout de notes sur un kit
- Saisie rapide d'un lot (description vocale du lot)
- Mise à jour de statut (dicter un changement)

Chaque point d'intégration :

- Bouton "Parler" visible à côté du formulaire
- Transcription et extraction en temps réel
- Affichage des valeurs extraites dans les champs du formulaire
- Validation utilisateur avant enregistrement (pas d'enregistrement
  silencieux)

### Pourquoi pas de validation vocale automatique

Même avec la voix, la validation finale passe par **confirmation
explicite** dans le formulaire. Cette contrainte évite :

- Les erreurs de transcription non détectées
- Les ambiguïtés d'interprétation de l'IA
- Les validations passives (Principe 11)

## Justification

### Pourquoi pas "conversationnel d'abord" ?

L'approche conversationnelle est séduisante mais présente plusieurs
risques :

**Risque 1 — Opacité des actions**
Dans un chat, l'utilisateur ne voit pas immédiatement quels champs
sont remplis par ses paroles. Des erreurs peuvent être commises sans
détection. Avec un formulaire, les champs sont visibles et
vérifiables.

**Risque 2 — Dépendance aux modèles IA**
Si l'extraction IA échoue (modèle en panne, prompt mal interprété),
l'utilisateur est bloqué. Avec les formulaires, il a toujours la
sortie de secours du clavier.

**Risque 3 — Courbe d'apprentissage inverse**
Les interfaces conversationnelles paraissent simples mais demandent
d'apprendre à parler "comme il faut" pour que l'IA comprenne. Les
formulaires explicites sont plus prévisibles.

**Risque 4 — Violation du Principe 12 si exclusive**
Faire du conversationnel l'interface unique viole par construction le
Principe 12. L'IA devient un point de défaillance unique.

### Pourquoi la voix mérite quand même d'être intégrée ?

Parce que le workflow terrain de Mika le justifie : extérieur, mains
sales, mobilité. Dans ces contextes, la voix est une accélération
réelle. Elle mérite d'être disponible **comme option**.

### Pourquoi pas au MVP ?

Deux raisons :

**1. Scope MVP** — La voix ajoute une couche technique (Whisper +
parsing IA) qui nécessite développement, tests, et gestion des
erreurs. Hors du périmètre des modules 1-3 du MVP.

**2. Apprentissage progressif** — Le MVP avec formulaires permettra
de valider les bons champs à capturer, les bonnes structures de
données, les bons workflows. La voix sera ajoutée sur des bases
solides, pas en même temps que la construction des fondations.

## Conséquences

### Positives

- Robustesse : les formulaires sont toujours disponibles comme
  fallback
- Auditabilité : les valeurs dans les champs sont visibles et
  modifiables
- Intégrité des données : validation explicite requise
- Alignement avec Principes 6 (tech suit le besoin), 11 (engagement
  explicite), 12 (formulaires d'abord)

### Négatives

- Friction perçue en Phase B : la voix n'est pas "tout-puissant",
  l'utilisateur doit encore valider
- Courbe de découverte : les utilisateurs peuvent ne pas utiliser la
  voix si les boutons ne sont pas visibles

### Atténuation des négatifs

- Onboarding Phase B mettant en avant la voix comme accélérateur
- Boutons "Parler" visibles sur tous les formulaires concernés
- Analytics sur l'usage de la voix pour optimiser les points
  d'intégration

## Alternatives considérées

1. **Conversationnel d'abord avec formulaires de fallback** — rejeté
   (inverse la philosophie souhaitée)
2. **Formulaires exclusifs sans plan voix** — rejeté (manque une
   opportunité d'accélération terrain)
3. **Voix intégrée dès le MVP** — rejeté (hors scope, prématuré)

## Implémentation technique (Phase B)

- **Whisper API** pour la transcription vocale
- **Claude API** pour l'extraction structurée depuis le texte
  transcrit
- **Formulaires Supabase/React** comme couche de validation
- **Pas de stockage audio permanent** (transcription seulement)

Détails à formaliser au démarrage de la Phase B.

## Auteur

Principe formulé par Mika pendant les discussions sur le workflow
terrain. L'assistant avait initialement suggéré une interface
conversationnelle comme option principale, rejetée en faveur de
l'approche en couches.

---
```

### Vérification

- Fichier présent : `ls docs/decisions/ADR-010-architecture-conversationnelle.md`
- Cohérent avec le Principe 12 (ajouté en Action 3)

---

## Action 7 — Créer `docs/09-stack-technique.md`

**Fichier** : `docs/09-stack-technique.md`

**Type d'action** : CREATE

**Raison** : Le fichier est référencé dans `CLAUDE.md` mais manquant.
Le créer avec le contenu connu à ce stade, en marquant explicitement
les sections qui seront complétées en Phase 4 (design technique).

### Contenu complet du fichier

```markdown
# Stack technique

## Statut de ce document

**En cours de formalisation.** Les choix principaux sont connus, les
détails d'implémentation seront précisés en Phase 4 (design technique)
avant le début du développement MVP.

## Choix principaux validés

### Hébergement et déploiement

**Vercel** — plateforme d'hébergement pour l'application web.

Choix justifié par :

- Intégration native avec GitHub (déploiement automatique sur push)
- Support de Next.js (framework probable — à confirmer Phase 4)
- Tier gratuit suffisant pour la phase MVP
- Fonctions serverless incluses (pour les endpoints API)
- URLs de preview par branche (utiles pour tests partenaires)

### Base de données et authentification

**Supabase** — Postgres géré + authentification + API auto-générée.

Choix justifié par :

- Postgres solide (standard ouvert, pas de lock-in propriétaire)
- Row-Level Security (RLS) pour les permissions futures
- Authentification intégrée (email, OAuth, magic links)
- Tier gratuit généreux pour la phase MVP
- API REST et GraphQL auto-générées
- Support natif de la réplication et des backups
- Path de migration clair vers Postgres self-hosted si nécessaire

### Source de code et collaboration

**GitHub** — repo privé `Britiju/Pneus-MG19`.

- Gestion des issues et du backlog si besoin
- Pull Requests pour la revue de code (Phase 4+)
- GitHub Actions possibles pour CI/CD (à définir)

### Outils de développement assistés

**Claude Code** — assistant de développement intégré.

- Lecture automatique de `CLAUDE.md` au démarrage
- Utilisé pour les mises à jour de documentation et le développement
  du code
- Accès direct au repo GitHub via intégration Git

## Choix à formaliser en Phase 4

### Framework frontend

Candidat principal : **Next.js** (React, SSR, intégration Vercel).

Alternatives considérées :
- Remix (bon, mais moins d'intégration Vercel native)
- SvelteKit (plus léger, mais écosystème plus petit)

Décision finale en Phase 4.

### Bibliothèque de composants UI

Candidats :
- **shadcn/ui** + Tailwind CSS (recommandé, voir ADR-003)
- Radix UI + Tailwind
- Mantine

Décision finale en Phase 4.

### Gestion d'état

Candidats :
- React Query / TanStack Query (serveur state)
- Zustand (client state léger)
- Contexte React natif (suffisant pour MVP?)

Décision finale en Phase 4 selon la complexité estimée.

### Testing

Outils probables :
- Vitest ou Jest (tests unitaires)
- Playwright (tests end-to-end)
- Testing Library (tests de composants)

Décision finale en Phase 4.

### Monitoring et observabilité

À définir en Phase 4. Options :
- Vercel Analytics (basique, inclus)
- Sentry (erreurs runtime)
- LogRocket (replay de sessions — potentiellement intrusif)

## Architecture technique macro

### Structure du projet (prévue)

```
pneus-mg19/
├── app/                  # Routes Next.js (App Router)
│   ├── (auth)/           # Pages authentification
│   ├── dashboard/        # Module 1
│   ├── inventaire/       # Module 2
│   └── finance/          # Module 3
├── components/           # Composants React réutilisables
├── lib/                  # Utilitaires, clients Supabase, helpers
├── supabase/             # Migrations SQL, types générés
├── docs/                 # Documentation (ce dossier)
└── tests/                # Tests
```

**Note** : structure à valider en Phase 4.

### Modèle de données

Détails dans `docs/06-modele-donnees.md`.

Résumé : Lot → Kit → Variante, avec journal d'événements parallèle.
Trois identifiants par entité (uuid, internal_id, display_code) pour
la scalabilité latente.

### Authentification

**MVP** : email + mot de passe via Supabase Auth.

Tous les utilisateurs authentifiés ont accès complet (ADR-007).

**Évolution future** : permissions granulaires via Row-Level Security
de Supabase quand le contexte le justifiera (voir backlog).

### APIs externes envisagées (Phases B et C)

Aucune au MVP. Pour référence future :

- **Whisper** (OpenAI) — transcription vocale (Phase B)
- **Claude API** (Anthropic) — extraction structurée (Phase B)
- **Facebook Marketplace API** — listing automatique (Phase B,
  conditionnel)
- **QuickBooks API** — intégration comptable (Phase C)

## Environnements

### Développement local

- Base Supabase locale (via CLI) ou cloud (dev tier)
- Next.js dev server
- Variables d'environnement dans `.env.local` (non versionné)

### Staging

À définir en Phase 4. Probablement : branche `develop` déployée
automatiquement sur un sous-domaine Vercel (`staging.pneus-mg19.com`
ou équivalent).

### Production

- Branche `main` déployée automatiquement par Vercel
- Base Supabase production distincte
- Domaine final à définir

## Conventions de code

À formaliser en Phase 4. Base :

- TypeScript strict
- ESLint + Prettier (configuration à définir)
- Commits atomiques décrivant le **pourquoi** (voir `CLAUDE.md`)
- Branches par feature (`feature/`, `fix/`, `refactor/`)
- Pull Requests revues avant merge (quand l'équipe s'élargit)

## Considérations de sécurité

### Au MVP

- HTTPS partout (géré par Vercel)
- Authentification obligatoire (pas d'accès anonyme)
- Variables d'environnement pour les secrets (pas dans le repo)
- RLS Supabase activé même si permissions ouvertes (future-proofing)

### À prévoir en Phase B/C

- Permissions granulaires via RLS
- Audit logging centralisé
- Rotation des secrets
- Pentesting avant ouverture à plus d'utilisateurs

## Performances

### Cibles au MVP

- Page d'accueil chargée en < 2s sur mobile 4G
- Recherche inventaire avec résultats en < 1s
- Saisie d'un kit complet en < 15s (lot de 8 kits ≈ 2 minutes)

### Optimisations prévues

- Index Postgres sur les colonnes de recherche fréquente
  (`display_code`, `marque`, `taille`, `saison`)
- Pagination systématique (pas de liste infinie)
- Caching côté serveur pour les dashboards (données peu changeantes)

## Coûts estimés

### Au MVP (ordre de grandeur mensuel)

- Vercel : 0 $ (tier gratuit suffisant)
- Supabase : 0 $ (tier gratuit suffisant)
- Domaine : ~15 $ / an (si domaine dédié)
- Total MVP : < 5 $ / mois

### Phase B/C (ordre de grandeur)

- Vercel Pro : 20 $ / mois
- Supabase Pro : 25 $ / mois
- APIs externes (Whisper, Claude) : variable, estimé 20-100 $ / mois
- Total estimé : 70-150 $ / mois

## Auteur et évolution

Document créé pendant le cadrage Paquet 1 pour combler une référence
manquante dans `CLAUDE.md`. Sera enrichi progressivement en Phase 4
(design technique) puis maintenu tout au long du projet.

**Dernière mise à jour** : Phase 1 de cadrage, Paquet 1.

---
```

### Vérification

- Fichier présent : `ls docs/09-stack-technique.md`
- La référence dans `CLAUDE.md` (Action 2) peut maintenant être
  simplifiée en retirant "(à compléter avant développement MVP)".
  **À faire après cette Action 7.**

---

## Action 8 — Créer `docs/questions-ouvertes.md`

**Fichier** : `docs/questions-ouvertes.md`

**Type d'action** : CREATE

**Raison** : Plusieurs sujets ont été soulevés pendant le Paquet 1 et
début Paquet 2 sans être tranchés. Ils doivent être capturés dans un
document dédié pour ne pas être oubliés. Ce document devient la
**mémoire persistante** des sujets non tranchés, à mettre à jour à
chaque paquet.

### Contenu complet du fichier

```markdown
# Questions ouvertes

## Pourquoi ce document existe

Pendant le cadrage du projet, plusieurs sujets ont été **soulevés mais
pas tranchés**. Ils ne relèvent pas du backlog (qui contient des
idées d'évolution) ni des ADR (qui contiennent des décisions
formelles). Ce sont des **questions** qui attendent soit plus
d'information, soit un moment opportun pour être discutées.

Ce document est la **mémoire persistante** des sujets non tranchés.
Il évite qu'une question importante ne soit oubliée parce qu'elle
n'avait pas sa place dans un autre document.

## Comment utiliser ce document

- **Ajouter** une entrée chaque fois qu'une question est soulevée sans
  être tranchée
- **Mettre à jour** une entrée quand de nouveaux éléments éclairent la
  question
- **Archiver** une entrée quand la question est tranchée (déplacer
  vers le backlog si c'est une idée, vers un ADR si c'est une
  décision)

Chaque entrée suit cette structure :
- **Question** : la question posée
- **Contexte** : ce qui a mené à la question
- **Dimensions à considérer** : les facteurs à évaluer
- **Quand la trancher** : à quel paquet ou à quelle phase
- **Dernière discussion** : date de la dernière réflexion

---

## Questions ouvertes actuelles

### Q1 — Initiation d'achat / Work Order

**Question** : Comment modéliser la phase pré-acquisition d'un lot
(prospection, négociation) dans le système?

**Contexte**

Quand Mika identifie un lot potentiel chez un fournisseur, il y a une
phase de négociation qui peut durer de quelques heures à plusieurs
jours. Pendant cette phase :

- Le lot n'est pas encore physiquement possédé
- Des codes peuvent être réservés en avance (pour étiquetage anticipé
  lors d'une visite)
- Des engagements financiers peuvent exister (acompte versé)
- La localisation physique est chez le fournisseur, pas encore chez
  Mika
- Des rôles multiples peuvent être impliqués (qui négocie, qui va
  ramasser)

Le modèle actuel traite un lot comme existant dès son acquisition. Il
ne capture pas la phase amont.

**Dimensions à considérer**

- **Financière** : engagements, acomptes, prix négocié (différent du
  prix final payé?)
- **Physique** : localisation des pneus (chez fournisseur, en transit,
  chez Mika)
- **Statuts** : "en prospection", "en négociation", "accord en cours",
  "confirmé"
- **Rôles** : qui a trouvé, qui négocie, qui ramasse, qui paie
- **Temporel** : délais typiques, deadlines

**Questions secondaires**

- Les codes réservés pendant la négociation sont-ils "voided" si
  l'achat tombe à l'eau?
- Comment calculer les KPI de conversion (lots évalués vs achetés)?
- Faut-il un module dédié "Prospection" ou intégrer au Module 2
  (Inventaire)?

**Quand la trancher** : Paquet 3 (données historiques) ou Paquet 4
(mécaniques de vente), selon la pression business.

**Dernière discussion** : Paquet 1, identifié comme hors-scope du
paquet en cours.

---

### Q2 — Liste exhaustive des champs sensibles (Principe 8)

**Question** : Quels sont exactement les champs considérés "sensibles"
au sens du Principe 8 (Protection des données sensibles)?

**Contexte**

Le Principe 8 stipule : "Les champs identifiant unique et à impact
business ne sont jamais éditables en mode saisie normale."

Cette définition reste large. Pour l'implémentation, il faut une
liste précise.

**Dimensions à considérer**

- Champs **identifiants** : `display_code`, `lot_id`, `kit_id`,
  `uuid`, `internal_id`
- Champs **financiers** : `prix_achat_total`, `prix_achat_alloue`,
  `prix_vente_affiche`, `prix_vente_effectif`, montants des
  remboursements et indemnisations
- Champs **temporels** : `date_acquisition`, `date_vente` (une fois
  la vente committed)
- Champs **relations** : `lot_id` sur un kit, `kit_id` sur une
  variante (liens vers le parent)
- Champs **statut** : `statut` des entités (modifiables via workflows
  de transition, mais pas directement)

**Quand la trancher** : avant le début du développement MVP (Phase 4
design technique).

**Dernière discussion** : Paquet 1, principe énoncé sans liste
formelle.

---

### Q3 — Rendez-vous clients liés aux items

**Question** : Comment gérer les rendez-vous avec les clients (essais,
livraisons) en lien avec les items de l'inventaire?

**Contexte**

Quand un client demande à essayer des pneus ou à venir les chercher,
il y a un rendez-vous qui pourrait être structuré dans l'app. Cela
ouvrirait des possibilités :

- Pipeline de ventes visible
- Réservation automatique de l'item (statut "réservé" pendant le
  rendez-vous)
- Suivi des rendez-vous non honorés
- Relation avec le futur Module 6 (CRM)

**Dimensions à considérer**

- Capture minimale au MVP (champ texte libre?) ou structure complète?
- Lien avec le CRM (Q1 relié à la notion plus large de CRM)
- Statut "réservé" vs "en vente" sur un kit
- Impact sur le dashboard B (alertes rendez-vous à venir)

**Quand la trancher** : Paquet 4 (mécaniques de vente).

**Dernière discussion** : Paquet 1, différé.

---

### Q4 — Seuils d'alerte de stagnation par saison

**Question** : Quels sont les seuils précis qui déclenchent une alerte
"item stagnant anormalement" dans le Dashboard B?

**Contexte**

L'analyse des 607 données historiques montre des temps de vente
moyens très différents par saison :

- Pneus d'hiver : ~161 jours
- Pneus d'été : ~98 jours

Un seuil uniforme (ex: "alerte après 180 jours") est inadapté : il
alerterait sur des pneus d'hiver normaux et raterait des pneus d'été
vraiment stagnants.

**Dimensions à considérer**

- Saisonnalité des seuils
- Effet marque / taille sur les temps de vente
- Définition de "stagnant anormalement" : percentile 75? 90?
- Alertes trop fréquentes = ignorées (fatigue d'alerte)

**Quand la trancher** : Paquet 6 (dashboard).

**Dernière discussion** : Paquet 1, mentionné pendant l'analyse de la
saisonnalité.

---

### Q5 — Migration des codes legacy au nouveau système

**Question** : Les codes legacy (1A, V01, etc.) sont-ils migrés vers
le nouveau format (A001, A002, etc.) ou conservés tels quels?

**Contexte**

ADR-004 stipule que les 3 conventions cohabitent (legacy 2025, legacy
2026, nouveau système). La distinction de format lève les ambiguïtés
à la recherche.

Cependant, la question "faut-il quand même migrer pour uniformiser?"
reste ouverte.

**Arguments pour conservation** :
- Traçabilité historique (le code original reste celui écrit sur les
  pneus)
- Aucun coût de migration
- Pas de risque de confusion avec les identifiants physiques

**Arguments pour migration** :
- Uniformité visuelle dans les rapports
- Simplicité des exports et intégrations futures

**Quand la trancher** : Paquet 3 (données historiques).

**Dernière discussion** : Paquet 1, ADR-004 laisse la cohabitation
comme décision officielle, mais la question de "forcer la migration
plus tard" reste ouverte.

---

### Q6 — Gestion de la date de vente après retour

**Question** : Quand un kit est retourné et remis en stock, puis
revendu, quelle est sa "date de vente" dans les rapports?

**Contexte**

Si un kit est vendu le 10 mars, retourné le 15 mars, et revendu le
20 avril, quelle date utiliser pour :

- La comptabilité du mois de mars vs avril?
- Le calcul du "time-to-sell"?
- Les rapports par période?

**Deux approches possibles**

- **Dernière vente** : la date effective est le 20 avril
- **Première vente** : la date initiale est le 10 mars, les
  événements correctifs sont ajustements

**Impacts**

- Les rapports mensuels vont être différents selon l'approche
- L'analyse de saisonnalité peut être biaisée
- La cohérence avec QuickBooks (Phase C) doit être vérifiée

**Quand la trancher** : Paquet 2 (finances), avant fin de cadrage.

**Dernière discussion** : non encore soulevée explicitement —
identifiée comme conséquence du cadrage des événements post-vente
(ADR-006).

---

## Questions archivées

*Cette section accueillera les questions tranchées au fil du temps,
avec référence à l'ADR ou au document qui les a tranchées.*

(Aucune question archivée pour l'instant.)

---

## Historique des mises à jour

- **Paquet 1 (cadrage initial)** : création du document, ajout de Q1
  à Q6.
```

### Vérification

- Fichier présent : `ls docs/questions-ouvertes.md`
- Structure claire avec numérotation Q1, Q2, etc.
- Historique des mises à jour renseigné

---

## Action 9 — Enrichir `docs/backlog.md` avec les nouvelles features

**Fichier** : `docs/backlog.md`

**Type d'action** : UPDATE

**Raison** : Plusieurs features long-terme ont émergé pendant le
cadrage mais ne sont pas encore dans le backlog. Les ajouter pour
préserver la vision.

### Détail

À la fin du fichier `docs/backlog.md`, **avant la ligne `---` de
fermeture**, ajouter les entrées suivantes :

```markdown
### [NOUVEAU] Assistant de pricing intelligent pour acheteurs

**Description** : modèle prédictif qui suggère un prix d'achat
raisonnable quand un acheteur (Mika ou un employé/partenaire moins
expert) évalue un lot. Basé sur l'historique de ventes de
tailles/marques similaires, saisonnalité, usure estimée, temps de
vente prévisionnel. Permet de scaler l'expertise de Mika vers d'autres
acheteurs.

**Valeur** : très haute (permet de déléguer l'achat)
**Complexité** : haute (modèle prédictif + données suffisantes)
**Phase potentielle** : Phase C, Module 7
**Prérequis** : minimum 12 mois de données app_native

---

### [NOUVEAU] Portail d'estimation à distance pour vendeurs externes

**Description** : portail web où des vendeurs externes (gens voulant
vendre leurs pneus) soumettent photos et mesures. Le système renvoie
une estimation automatique. Si acceptée, rendez-vous de ramassage.
Inverse le flux commercial : au lieu de chercher des lots, ils
viennent à Mika.

**Valeur** : très haute (nouvelle source de volume)
**Complexité** : très haute (UI publique, modération, logistique)
**Phase potentielle** : Phase C ou D
**Prérequis** : assistant de pricing opérationnel + reconnaissance
photo (backlog existant)

---

### [NOUVEAU] Saisie conversationnelle voice-to-data

**Description** : à plusieurs endroits du workflow (caractérisation
d'un kit, notes, mise à jour de statut), possibilité de parler au
lieu de taper. Transcription via Whisper, extraction structurée via
Claude API. Les résultats sont déposés dans les formulaires classiques
(approche en couches, voir ADR-010).

**Valeur** : haute (accélération terrain, mains sales, mobilité)
**Complexité** : moyenne (APIs matures disponibles)
**Phase potentielle** : Phase B
**Principe respecté** : ADR-010 — la voix est une couche optionnelle,
pas un remplacement des formulaires

---

### [NOUVEAU] Enrichissement progressif des kits

**Description** : permettre des "kits shell" (très incomplets au
départ) qui s'enrichissent progressivement. Statuts :
`description_partielle` → `caracterise` → `en_stock`. Utile pour des
lots achetés en urgence où la caractérisation complète prendra des
jours.

**Valeur** : moyenne (confort workflow)
**Complexité** : moyenne (impact sur les validations actuelles)
**Phase potentielle** : MVP+ ou Phase B
**Dépendance** : clarification des champs obligatoires par statut

---

### [NOUVEAU] Initiation d'achat / Work Order

**Description** : gestion de la phase de prospection et négociation
avant acquisition d'un lot. Statuts "en prospection", "en
négociation", "accord en cours". Codes réservables pendant la
négociation pour étiquetage anticipé. Tracking multi-dimensionnel
(financier, physique, rôles).

**Valeur** : haute (visibilité pipeline d'achat)
**Complexité** : haute (nouveau modèle d'entité)
**Phase potentielle** : Phase B
**Questions ouvertes** : voir `docs/questions-ouvertes.md` Q1
```

### Vérification

- `grep -c "\[NOUVEAU\]" docs/backlog.md` doit retourner le bon
  nombre (les "NOUVEAU" existants + 5 nouveaux)
- Les nouvelles entrées respectent le format des entrées précédentes
- La ligne `---` finale est toujours présente à la fin du fichier

---

## Action 10 — Ajouter le document de raisonnement préservé

**Fichier** : `docs/decisions/raisonnement-paquet-1.md`

**Type d'action** : CREATE

**Raison** : Ce document (produit séparément pendant le cadrage) est
la **mémoire narrative** du Paquet 1. Il doit être placé dans le repo
à côté des ADR formels.

### Détail

Le contenu du fichier est produit séparément (voir
`raisonnement-paquet-1.md` fourni par l'utilisateur). Le placer dans
`docs/decisions/raisonnement-paquet-1.md`.

**Note pour Claude Code** : ce fichier est volumineux (~1600 lignes,
~9000 mots). Le contenu vient d'un fichier externe. Ne pas le
régénérer, simplement l'intégrer au repo.

### Vérification

- Fichier présent : `ls docs/decisions/raisonnement-paquet-1.md`
- Taille cohérente (> 50 ko)
- Les sections principales sont présentes : introduction, 11
  sections numérotées, épilogue

---

## Commit 1 — Finalisation : simplification de la référence à stack-technique

**Fichier** : `CLAUDE.md`

**Type d'action** : UPDATE

**Raison** : Après la création du fichier en Action 7, la mention
temporaire "(à compléter avant développement MVP)" peut être retirée
— le fichier existe maintenant.

### Détail

Dans `CLAUDE.md`, trouver la ligne :

```
- docs/09-stack-technique.md : choix techniques détaillés (à compléter avant développement MVP)
```

**Remplacer par** :

```
- docs/09-stack-technique.md : choix techniques détaillés
```

### Vérification

`grep "09-stack-technique" CLAUDE.md` doit retourner la ligne sans la
mention entre parenthèses.

---

## Récapitulatif final

### Fichiers créés (6)

1. `docs/decisions/ADR-008-allocation-couts-lot.md`
2. `docs/decisions/ADR-009-retours-fournisseur.md`
3. `docs/decisions/ADR-010-architecture-conversationnelle.md`
4. `docs/09-stack-technique.md`
5. `docs/questions-ouvertes.md`
6. `docs/decisions/raisonnement-paquet-1.md`

### Fichiers modifiés (4)

1. `docs/02-personae-utilisateurs.md` — corrections d'incohérences
2. `docs/01-vision-produit.md` — ajout des Principes 10 à 13
3. `docs/backlog.md` — ajout de 5 nouvelles entrées
4. `CLAUDE.md` — mise à jour de la référence à stack-technique

### Fichiers non modifiés (contrôle)

Tous les autres fichiers du repo restent inchangés :

- `README.md`
- `docs/03-cycle-de-vie.md`
- `docs/04-modules.md`
- `docs/05-dashboard.md`
- `docs/06-modele-donnees.md`
- `docs/07-data-quality-tiers.md`
- `docs/08-roadmap.md`
- `docs/10-ux-design-system.md`
- `docs/decisions/ADR-001-scope-mvp-sans-crm.md`
- `docs/decisions/ADR-002-tiering-qualite-donnees.md`
- `docs/decisions/ADR-003-pattern-menu-lateral-drill-down.md`
- `docs/decisions/ADR-004-numerotation.md`
- `docs/decisions/ADR-005-immutabilite.md`
- `docs/decisions/ADR-006-evenements-post-vente.md`
- `docs/decisions/ADR-007-acces-mvp.md`

Si l'un de ces fichiers doit être touché par effet de bord, **ne pas
le modifier** sans vérifier avec Mika — l'intention est de préserver
leur contenu actuel.

### Suggestion de messages de commit

Pour chaque groupe d'actions (voir "Ordre d'exécution recommandé" en
haut), un message de commit clair qui décrit le **pourquoi** :

**Commit 1** (Actions 1-2) :
```
docs: corriger incohérences avec ADR-004 et ADR-007

Le fichier 02-personae-utilisateurs.md référençait des décisions
antérieures au cadrage Paquet 1. Mise à jour pour refléter la
numérotation à 50 ancres (ADR-004) et l'accès ouvert au MVP (ADR-007).

Neutralisation temporaire de la référence à 09-stack-technique (créé
en commit 4).
```

**Commit 2** (Action 3) :
```
docs: ajouter les Principes 10 à 13 à la vision produit

Quatre nouveaux principes directeurs ont émergé pendant le cadrage
du Paquet 1 :

- Principe 10 : Saisie d'abord, exceptions ensuite
- Principe 11 : Engagement explicite sur données sensibles
- Principe 12 : Formulaires d'abord, IA en enrichissement
- Principe 13 : Cas standard d'abord (80/20)

Ces principes formalisent les valeurs spécifiques du projet
identifiées pendant les discussions avec Mika.
```

**Commit 3** (Actions 4-6) :
```
docs: ajouter ADR-008, ADR-009, ADR-010

Trois décisions architecturales prises pendant le cadrage sont
maintenant formalisées :

- ADR-008 : Allocation des coûts d'un lot (Stratégie 4 hybride avec
  champs vides + boutons raccourcis)
- ADR-009 : Retours au fournisseur pré-mise-en-stock
- ADR-010 : Architecture conversationnelle hybride (voix/IA en
  couches optionnelles par-dessus les formulaires)
```

**Commit 4** (Action 7 + finalisation CLAUDE.md) :
```
docs: créer docs/09-stack-technique.md

Document initial de la stack technique du projet. Contient les choix
validés (Vercel, Supabase, GitHub, Claude Code) et les choix à
formaliser en Phase 4 (framework frontend, UI library, testing).

Corrige aussi la référence dans CLAUDE.md.
```

**Commit 5** (Action 8) :
```
docs: créer docs/questions-ouvertes.md

Nouveau document qui capture les sujets soulevés mais pas tranchés
pendant le cadrage. Contient 6 questions initiales (Q1 à Q6) avec
contexte, dimensions à considérer et moment de tranchage prévu.

Ce document devient la mémoire persistante des sujets non tranchés,
à mettre à jour à chaque paquet.
```

**Commit 6** (Action 9) :
```
docs: enrichir le backlog avec les features long terme

Cinq nouvelles features identifiées pendant le cadrage :

- Assistant de pricing intelligent pour acheteurs (Phase C)
- Portail d'estimation à distance pour vendeurs (Phase C/D)
- Saisie conversationnelle voice-to-data (Phase B)
- Enrichissement progressif des kits (MVP+ ou Phase B)
- Initiation d'achat / Work Order (Phase B)

Ces features alignent le backlog avec la vision long terme (Amazon
du pneu usagé) sans les promouvoir au scope MVP.
```

**Commit 7** (Action 10) :
```
docs: ajouter le raisonnement préservé du Paquet 1

Document narratif qui capture le POURQUOI derrière chaque grande
décision du Paquet 1 : itérations, alternatives écartées, cas
terrain qui ont fait la différence, patterns de collaboration.

Ce document complète les ADR (qui capturent le QUOI) en préservant
l'intelligence construite pendant les discussions.

À mettre à jour à la fin de chaque paquet suivant.
```

---

## Instructions finales pour Claude Code

1. **Lis ce document en entier avant de commencer.** Les actions sont
   interdépendantes (notamment Action 2 et Action 7).

2. **Commit par commit**, pas en un seul gros commit. Chaque commit
   doit être un ensemble cohérent.

3. **Vérifie après chaque action** que le résultat correspond à ce qui
   est attendu (section "Vérification").

4. **Ne modifie pas les fichiers listés comme "non modifiés"** sauf si
   une action l'indique explicitement.

5. **Pose une question à Mika** si quelque chose est ambigu dans ce
   document. Ne devine pas — la convention du projet est claire
   là-dessus (voir `CLAUDE.md`).

6. **Push chaque commit** après validation. Ne pas accumuler plusieurs
   commits locaux sans push — la visibilité côté GitHub est
   importante pour Mika.

---

**Fin du sommaire technique.**
