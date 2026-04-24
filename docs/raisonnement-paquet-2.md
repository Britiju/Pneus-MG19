# Raisonnement préservé — Paquet 2

> Ce document n'est pas une spec technique. C'est la mémoire narrative
> du Paquet 2 (finances). Il capture **comment** on est arrivés aux
> décisions, pas seulement ce qu'on a décidé.

---

## Pourquoi ce document existe

Les ADR capturent les **décisions finales** du Paquet 2. Ce
document-ci capture le **chemin qui a mené à ces décisions** : les
alternatives considérées, les arguments échangés, les cas terrain
qui ont tout changé, les patterns de collaboration, les erreurs de
raisonnement évitées (et celles qu'on a faites quand même).

Il sert à :

- **Justifier une décision** quand elle est remise en cause dans 6
  mois ou 3 ans
- **Comprendre pourquoi certaines options ont été écartées** (et ne
  pas les reproposer naïvement)
- **Préserver les patterns de pensée de Mika** qui ont émergé
  pendant le cadrage
- **Documenter honnêtement les erreurs de l'assistant** pour que les
  futures sessions bénéficient de ces apprentissages
- **Éviter de refaire les mêmes débats** quand de nouveaux
  contributeurs rejoignent le projet

Ce document suit le même format que `raisonnement-paquet-1.md` —
c'est intentionnel, on établit un pattern durable de documentation
narrative par paquet.

## Comment lire ce document

Chaque grande décision suit une structure narrative :

1. **Le problème posé** — ce qu'on cherchait à résoudre
2. **Les itérations** — les propositions successives, avec qui
   proposait quoi
3. **Les challenges** — les cas terrain qui ont fait échouer
   certaines options
4. **La décision finale** — ce qui a été retenu et pourquoi
5. **Ce qui aurait été perdu** — les risques évités par le chemin
   emprunté

Les sections sont indépendantes. Tu peux lire celle qui t'intéresse
sans lire les autres.

## Conventions d'attribution

- **« Mika »** désigne le propriétaire du projet (utilisateur humain)
- **« L'assistant »** désigne l'IA de cadrage (Claude) qui a
  participé aux discussions

Dans le Paquet 2 plus encore que dans le Paquet 1, la dynamique
"assistant propose, Mika corrige" a été constante. Préserver cette
attribution honore le vrai processus plutôt que d'idéaliser
rétrospectivement.

---

## Vue d'ensemble du Paquet 2

### Ce qui était prévu au départ

Le Paquet 2 devait traiter "les finances" :

- Question A — Allocation des coûts d'un lot
- Question B — Les marges
- Question C — Le pricing de vente
- Question D — Les cas particuliers

On s'attendait à un paquet relativement technique et circonscrit.

### Ce qui s'est réellement passé

Le Paquet 2 a explosé son cadre initial. Au cours des discussions,
plusieurs sujets structurants ont émergé qui n'étaient pas dans le
plan :

- **Émergence spontanée de la séparation app/QuickBooks** — Mika a
  lui-même recadré "les marges nettes c'est la job de QuickBooks",
  changeant toute l'approche comptable du projet
- **Ajout des emplacements physiques au scope MVP** — initialement
  hors-scope, mais Mika a identifié le besoin avec 3 entrepôts en vue
- **Création d'un document d'intégration QuickBooks** — vision
  stratégique dédiée, pas prévue initialement
- **Fusion avec une autre conversation Claude** — Mika partage une
  conversation parallèle qui apporte l'étiquetage physique, Helcim,
  le scanner, etc.
- **Création d'un document d'intégration physique/réseau** — encore
  un nouveau document stratégique
- **Émergence de la notion de "pratiques pré-MVP"** — Mika identifie
  qu'on peut commencer à appliquer certaines décisions immédiatement
  dans les Excel

Le Paquet 2 a produit au total :

- **2 nouveaux ADR** (ADR-011 pricing, ADR-012 emplacements)
- **2 nouveaux documents stratégiques** (11-integration-quickbooks,
  12-integration-physique-reseau)
- **1 nouveau document opérationnel** (pratiques-pre-mvp)
- **3 nouvelles questions ouvertes** (Q7 backup, Q8 bascule, Q9
  notes de crédit)
- **Plusieurs features ajoutées au backlog**
- **Enrichissement des Modules 2 et 3**
- **Nouvelle convention `docs/sessions/`** pour les sommaires

C'est **plus substantiel** que le Paquet 1, malgré une attente
initiale plus technique.

### Leçon méta

Le Paquet 2 démontre que **les paquets de cadrage ne sont pas
étanches**. Des sujets émergent, se chevauchent, se croisent. Le
cadrage n'est pas un plan d'exécution — c'est une **conversation
structurée** qui suit ses propres ramifications.

Cette leçon vaut pour les paquets futurs. Ne pas paniquer si un
paquet "déborde". C'est souvent là où réside la vraie valeur.

---

## Section 1 — La séparation app/QuickBooks (recadrage initial)

> **Document de référence** : `docs/11-integration-quickbooks.md`
>
> **Une décision architecturale majeure qui est venue de Mika, pas de
> l'assistant. En deux phrases, il a changé toute l'approche
> comptable du projet.**

### Le problème initial (mal posé)

L'assistant avait commencé le Paquet 2 en posant des questions
détaillées sur les marges : marge brute, marge nette, comment
calculer, comment afficher, gestion des coûts indirects, etc.

L'hypothèse implicite était : **l'app doit faire de la vraie
comptabilité**. Calculer les taxes, produire les rapports, suivre
les coûts indirects, tout ça.

### Le recadrage de Mika

Mika a dit quelque chose d'apparemment simple :

> « Les marges net, c'est la job de QuickBook. Ce sont des biens
> vendus (Cost of Goods). Je n'ai aucune intention de tracker la
> rentabilités net des pneus dans le systeme. Juste la rentabilité
> kit par kit. Ce que j'assume c'est que notre système pourra se
> connecter directement a Quickbook pour populer client, transaction,
> achats, cost of goods etc, mais que toutes les données auront tous
> comme provenance notre logiciel et que Quickbooks se contemptera de
> faire les comptes compatbles. »

Et il a ajouté, presque comme une question timide :

> « C'est peut-être un peu ambitieu; qu'est-ce qui est la meilleur
> manière de voir ça? »

### Pourquoi c'est un recadrage majeur

En deux phrases, Mika vient de :

1. **Exclure** la comptabilité fiscale du scope de l'app
2. **Préserver** l'analyse opérationnelle (marge par kit)
3. **Proposer** une architecture : app = source de vérité
   opérationnelle, QuickBooks = source de vérité comptable
4. **Anticiper** une intégration bidirectionnelle

L'assistant allait passer des heures à cadrer comment l'app ferait
de la comptabilité. Mika a coupé court : **ce n'est pas son job**.

### La réaction de l'assistant

Validation immédiate : oui, c'est la bonne approche. Mieux, c'est la
**meilleure** approche pour un petit business qui a déjà QuickBooks.

Pourquoi réinventer ce qui existe déjà et qui est bien fait?
QuickBooks gère :

- La fiscalité québécoise (TPS 5%, TVQ 9,975%)
- Les rapports fiscaux obligatoires
- Les déclarations de taxes
- L'intégration avec Revenu Québec
- La conformité comptable

L'app, elle, peut se concentrer sur ce qu'elle sait faire : gérer
l'inventaire, les ventes, les marges opérationnelles par kit.

### Les 4 principes qui en ont découlé

À partir de ce recadrage, 4 principes d'intégration ont été
formalisés dans le document `11-integration-quickbooks.md` :

**Principe A — Flux unidirectionnel pour les données opérationnelles**
Les données créées dans l'app descendent vers QuickBooks. Jamais
l'inverse pour ces types de données.

**Principe B — Flux retour pour les données comptables**
QuickBooks renvoie à l'app les données qu'il maîtrise (numéros de
facture, décomposition fiscale, statuts de paiement).

**Principe C — Pas de doublons, pas de recalcul**
L'app n'a pas sa propre numérotation de factures. L'app ne
recalcule pas les taxes. Une donnée, une source, un calcul.

**Principe D — Dégradation propre**
Si l'intégration QuickBooks est temporairement indisponible, l'app
continue en mode autonome.

### Les recherches web faites à ce moment

L'assistant a vérifié plusieurs points via web_search :

- Les best practices d'intégration QuickBooks API (pour confirmer
  que l'architecture tenait)
- Les webhooks QuickBooks (pour confirmer le flux retour possible)
- Les règles fiscales québécoises sur les cadeaux et promotions
  (plus tard, pour la question D)

Ces recherches ont confirmé que l'intuition de Mika était **non
seulement bonne, mais alignée avec les pratiques standard du
marché**.

### Ce qui aurait été perdu sans ce recadrage

Sans l'intervention de Mika au bon moment :

- L'app aurait tenté de faire de la comptabilité → **complexité
  énorme**, duplication avec QuickBooks
- Les taxes auraient été calculées côté app → **risque d'erreur
  fiscale** si les taux changent
- La numérotation des factures aurait créé un conflit avec
  QuickBooks → **cauchemar de traçabilité**
- Le MVP aurait été retardé de plusieurs semaines pour développer
  des features qui existent déjà ailleurs

Mika a épargné au projet des dizaines d'heures de sur-ingénierie en
coupant court au bon moment.

### Pattern identifié

**Pattern — Mika recadre les scopes mal posés**

L'assistant a tendance à accepter la question posée. Si on lui
demande "comment faire la comptabilité", il va cadrer la comptabilité.

Mika, lui, remonte d'un cran : "est-ce qu'on veut vraiment faire la
comptabilité dans l'app?" Cette question remet en cause la question
elle-même.

Ce pattern a déjà été vu au Paquet 1 (sur les permissions, sur la
numérotation). Au Paquet 2, il s'est reproduit de façon spectaculaire
sur le sujet comptable.

**Leçon pour les futures sessions** : avant de cadrer en profondeur
une question, l'assistant doit demander : **"Est-ce que cette
question mérite d'être posée, ou est-ce qu'on résout un faux
problème?"**

---

## Section 2 — Pricing au MVP (5 itérations)

> **ADR de référence** : ADR-011 (Pricing au MVP)
>
> **5 itérations ont été nécessaires. La solution finale, simple et
> puissante, vient d'une intuition de Mika sur ce qu'il aimerait
> avoir.**

### Le problème posé

Comment l'app doit capturer le pricing au MVP? Une seule valeur (le
prix de vente final)? Plusieurs valeurs (prix initial, changements,
prix final)? Des suggestions prédictives?

Sous la question opérationnelle se cachait une question stratégique :
**quel effort Mika est-il prêt à faire pour capturer plus de
données, en échange de meilleures analyses futures?**

### Itération 1 — Assistant propose de capturer un seul prix

L'approche minimale, déjà en place dans l'Excel actuel. Pas de
nouvelle charge de saisie. Simple.

**Mais** : ça ne permet pas d'analyser le rabais de négociation.
L'info du "prix affiché initial" est perdue à jamais.

### Itération 2 — Mika dévoile sa vision ambitieuse

Mika a décrit ce qu'il aimerait idéalement :

> « ce serait cool de pouvoir avec des pri predictif basé sur les
> données, le pri initial, les changements apporté durant l'annonce,
> peut-être meme des données sur le nombre de clic, vue et interets,
> l'information du client (Pour marketing), le pri de vente reel. Et
> plein de données analytiques qui aide a la construction »

Cette vision ressemble à un **assistant de pricing intelligent** qui
analyse l'historique et suggère des scénarios. C'est ambitieux.

### Itération 3 — Assistant propose 3 niveaux

L'assistant a structuré la vision en 3 options :

**Option A** — Un seul prix capturé (prix de vente final uniquement)
**Option B** — Deux prix capturés (affiché + vente)
**Option C** — Historique complet (tous les changements
intermédiaires)

### La décision de Mika — Option B

Mika a choisi **Option B** : capturer le prix affiché + le prix de
vente final, sans l'historique intermédiaire.

**Raisonnement implicite** :

- Minimum vital pour mesurer le rabais de négociation
- Préparation à l'assistant prédictif futur (Phase C)
- Pas de saisie redondante (si l'app ne se synchronise pas avec
  Marketplace, capturer les changements intermédiaires serait du
  double travail)

### Itération 4 — Les "ventes comparables"

L'assistant a proposé un ajout : pendant que Mika saisit le prix
affiché, l'app affiche **sur le côté** les kits similaires déjà
vendus dans l'historique.

**Critères de matching proposés initialement** :
- Marque exacte
- Taille exacte
- Saison exacte
- Usure exacte

### Le challenge de Mika

Mika a expliqué comment il cherche réellement dans l'Excel
aujourd'hui :

> « Probablement cherche Michelin, taille simialire. Pas assez
> distorique sur 10 ans par eemple pour consulter seulement la
> dernière années. »

Et plus tard, sur l'usure :

> « Neuf (10 ou 11), Très bon 8-9 Bon 7, en dessous de 7 on essaie
> de pas en acheter »

**Révélation** : les critères exacts sont trop restrictifs. Mika
cherche par **catégorie**, pas par valeur exacte. Marque précise pour
les grandes marques, taille proche, usure catégorisée, saison
indicative.

### Itération 5 — Matching par catégories + saisons restantes

L'assistant a reformulé la logique de matching :

1. **Marque** — critique pour les grandes marques (Michelin,
   Continental, Bridgestone, Pirelli, Goodyear)
2. **Taille** — correspondance exacte ou très proche
3. **Usure** — catégorisation par plages (voir tableau ci-dessous)
4. **Saison** — indicatif, pas critique

Et une catégorisation de l'usure en **saisons restantes** a émergé :

| Usure (32e) | Saisons restantes | Catégorie |
|-------------|-------------------|-----------|
| 10-11       | 4-5 saisons       | Neuf      |
| 8-9         | 3-4 saisons       | Très bon  |
| 7           | 2-3 saisons       | Bon       |
| 6           | 2 saisons         | Moyen     |
| 5           | 1-2 saisons       | Limite    |
| 4 et moins  | 1 saison max      | Fin de vie|

### La validation par Revenu Québec

Une recherche web a confirmé que cette catégorisation est cohérente
avec les standards de l'industrie. CAA-Québec recommande 6/32e
minimum pour commencer une saison d'hiver. Un pneu d'hiver neuf est
entre 9 et 12/32e. La règle de calcul `(usure - 2) / 2 =
saisons_restantes` tient la route.

### Le choix des fourchettes vs chiffres uniques

Mika a insisté :

> « J'aime mieu 3-4 saison, parce que ça depends. »

**Pourquoi fourchettes** :
- Honnête avec la variabilité d'usage (conduite, conditions routières)
- Évite les frustrations clients (« tu avais dit 3 saisons, ça a
  duré 2 »)
- Attire un acheteur qui comprend la nuance

Cette simple précision "c'est une fourchette, pas un chiffre exact"
est devenue un détail structurant du pricing.

### L'ajout de la date sur les comparables

En fin d'itération, Mika a fait une observation de bon sens :

> « Vente comparable devrait tout de mem indiqué l'années de la
> vente, pour contetualiser »

Un comparable de 2024 n'a pas la même pertinence qu'un comparable de
2026. Les prix évoluent, le marché évolue. La date doit être
visible.

### Le tri par récence

Trois options proposées :

**Option A** — Affichage sans tri spécifique, Mika juge lui-même
**Option B** — Tri automatique par récence, rien masqué
**Option C** — Masquage automatique des ventes anciennes

**Décision de Mika** : **Option B**. Tri par récence, sans masquage.
Simple, intelligent, pas de logique cachée.

### Le bouton "Copier la description"

En bonus, l'assistant a proposé une feature simple : un bouton qui
génère automatiquement une description formatée à partir des infos
du kit (marque, taille, saison, usure, saisons restantes, prix).

**Mika accepte immédiatement** : c'est exactement ce qui manque à
son workflow actuel. Il tape toujours les mêmes descriptions à la
main.

### Ce qui aurait été perdu

Sans les 5 itérations :

**Itération 1 seule** → seulement le prix de vente capturé → pas
d'analyse de négociation possible

**Critères de matching exacts** → aucun comparable ne serait jamais
trouvé (les kits ne sont jamais exactement identiques)

**Pas de catégorisation d'usure** → comparables dispersés entre
kits à 8/32 et kits à 9/32, analyses faussées

**Pas de fourchettes de saisons** → descriptions trop précises,
risque de conflit client

**Pas de tri par récence** → comparables de 2024 en haut de liste,
données obsolètes qui trompent

### Pattern identifié

**Pattern — La granularité doit suivre la pratique, pas la précision technique**

L'assistant a d'abord proposé des critères exacts (marque exacte,
usure exacte). C'était techniquement plus précis. Mais Mika cherche
par catégorie dans l'Excel, pas par valeur exacte.

**Leçon** : demander **comment tu cherches aujourd'hui** est plus
utile que **comment on devrait chercher en théorie**.

---

## Section 3 — Les emplacements physiques (ajout au scope MVP)

> **ADR de référence** : ADR-012 (Gestion des emplacements physiques
> au MVP)
>
> **Un ajout au scope MVP qui n'était pas prévu. Il est venu de la
> réalité opérationnelle de Mika.**

### Le contexte qui a fait émerger le sujet

Pendant la discussion sur les marges (question B), Mika a parlé
naturellement de ses entrepôts :

> « Nous tentons actuellement de deplacer les lot d'hiver dans une
> entrepot moins accessible (Des conteneur, pour faire de la place
> pour la saison actuel) »

Puis plus tard :

> « Nous aurons trois entrepot, donc meme si c'est manuel, il va
> falloir un mechanisme pour le faire. L'espect lieu doit eister
> dans le système, les deplacement, et autres doivent eister, mais
> en dehors de quoi que ce soit d'automatique »

### Pourquoi ce n'était pas dans le scope initial

Au Paquet 1, la gestion des emplacements n'avait pas été discutée.
L'hypothèse implicite était "tout est dans un seul endroit, pas
besoin de tracker".

Mika a lui-même confirmé qu'aujourd'hui il gère ça via **un deuxième
Excel** pour les lots dans les conteneurs. C'était manuel, mais
gérable.

### Le déclencheur — 3 entrepôts à venir

Avec un 3e entrepôt en vue, le système "deux Excel" ne scale plus.
Il faut **une structure**, même simple.

### Le premier réflexe de l'assistant — ça fait beaucoup

L'assistant a identifié plusieurs implications :

- Nouvelle entité `Emplacement` dans le modèle
- Événement `mouvement` dans le journal
- UI pour déplacer un kit
- Filtres de recherche par emplacement
- Inventaire initial au moment de la bascule

**Réaction initiale** : "Ça peut passer en MVP+ ou Phase B, selon
combien ça te fait mal aujourd'hui."

### La correction de Mika

Mika a fait une analyse différente :

> « Je ne suis pas completement d'accord. Si on avait une methode de
> mettre à jour la liste sur lequel on travail et qu'on mettent se
> champ dans les nouvelles listes, on pourrait regler ça en partie
> immediatement. On a 130 kits actuellement, l'inventaire complet
> n'est pas un gros probleme »

**Deux révélations** :

1. **Le volume est gérable** — 130 kits (pas 500 comme l'assistant
   supposait). Un inventaire est une demi-journée, pas un chantier.
2. **On peut commencer dès maintenant** — ajouter une colonne
   "Emplacement" dans les Excel actuels. Pas besoin d'attendre l'app.

### L'émergence de la notion "pratiques pré-MVP"

C'est à ce moment qu'est née une idée puissante : **certaines
décisions de cadrage peuvent être appliquées immédiatement dans les
outils actuels, avant que l'app existe**.

Double bénéfice :

1. **Debug du concept dans la vraie vie** — tester avant l'app
   révèle les problèmes
2. **Migration plus facile** — le jour de la bascule, les données
   sont déjà au bon format

Cette idée est devenue le document `pratiques-pre-mvp.md`.

### Décisions finales pour les emplacements

**Dans le scope MVP** :

- Entité `Emplacement` avec attributs minimaux (nom,
  description, statut)
- Champ `emplacement_actuel_id` sur chaque Kit
- Événement `mouvement` dans le journal
- Mouvements en lot (sélection multiple → déplacement groupé)
- Filtre de recherche par emplacement

**Hors scope MVP** (backlog) :

- Géolocalisation GPS
- Sous-emplacements (rangée, étagère)
- Automatisation via scanner
- Optimisation automatique
- Capacité physique des emplacements

### Ce qui aurait été perdu sans cette discussion

Si le sujet n'avait pas émergé au Paquet 2 :

- **Découverte en phase de développement** que "deux Excel" ne
  scale pas → refactor forcé
- **Inventaire massif à la bascule** → 1-2 jours de travail
  concentré, stressant
- **Pas de pratique préalable** → découverte du vocabulaire et des
  conventions en plein MVP

### Pattern identifié

**Pattern — Mika calibre les enjeux mieux que l'assistant**

L'assistant avait tendance à gonfler l'effort nécessaire (« ça fait
beaucoup »). Mika a tempéré : 130 kits, ajout d'une colonne Excel,
c'est gérable.

**Leçon** : quand l'assistant estime qu'un ajout est "trop", Mika
doit avoir le dernier mot sur l'effort réel — c'est lui qui fait le
travail.

---

## Section 4 — L'intégration QuickBooks en profondeur

> **Document de référence** : `docs/11-integration-quickbooks.md`
>
> **Le document est né pendant la discussion sur les taxes, a évolué
> pour couvrir bien plus, et a révélé plusieurs enjeux qu'on n'avait
> pas identifiés.**

### Le point de départ — la question des taxes

Après le recadrage de Section 1 (séparation app/QuickBooks), une
question pratique est restée : **comment gérer les taxes dans
l'app?**

Deux options évoquées :

**Option A** — L'app calcule et stocke les taxes décomposées
**Option B** — L'app stocke juste le prix "tout inclus", QuickBooks
fait la décomposition

Mika a posé la bonne question :

> « verifie si le fait de decomposer les taes dans l'app est ce qui
> est le plus robuste avec Quickbook, ou sa cause d'autre problème.
> Dans les fait, est-ce que la facture imprimable sera produite par
> l'app ou par Quickbook. »

### La recherche web

L'assistant a cherché les best practices. Résultats clairs :

- **QuickBooks doit produire les factures** (pas l'app) — évite les
  doublons de numérotation, centralise la conformité fiscale
- **QuickBooks peut renvoyer les données** à l'app (numéros de
  facture, décomposition fiscale, statuts de paiement) — confirmé
  par la doc API Intuit
- **Les webhooks QuickBooks** permettent des notifications temps
  réel à l'app quand une facture est payée, modifiée, etc.

### La deuxième question de Mika

> « est-ce que Quickbook peut renvoyer de l'information continue à
> l'app pour garder des information sur chacun des kit, par eemple
> les taes reel, numero de facture QB, etc? »

Excellente question. La réponse : **oui, dans les deux sens**.

### La notion de "champs miroir"

De cette recherche est née la notion de **champs miroir** : des
champs sur la table `ventes` de l'app qui stockent les informations
renvoyées par QuickBooks.

Au MVP, ces champs sont vides. En Phase C (intégration activée),
ils se remplissent automatiquement.

**Avantage** : pas de refactor de base de données plus tard. Les
champs sont prévus dès le départ.

### L'inquiétude de Mika — sur-engineering?

À un moment, l'assistant proposait de creuser les champs en détail
tout de suite. Mika a posé une bonne question :

> « Les champs a creer, devrait nous aider avec l'API, on devrait
> creuser ça? »

L'assistant a eu un bon réflexe : **non, pas maintenant**. Voici
pourquoi :

- L'intégration QuickBooks c'est Phase C, pas MVP
- Entre maintenant et Phase C, il y aura 12-18 mois
- QuickBooks va évoluer son API
- Les besoins de Mika vont évoluer

**Ce qu'on doit faire maintenant** : capturer la **vision
architecturale** et s'assurer que le modèle de données MVP est
"intégration-compatible". Pas plus.

C'est ainsi qu'est né le document `integration-quickbooks-vision.md`
(renommé `11-integration-quickbooks.md`) — léger, stratégique, pas
détaillé.

### Les 4 principes retenus

- **Principe A** : flux unidirectionnel pour les données
  opérationnelles
- **Principe B** : flux retour pour les données comptables
- **Principe C** : pas de doublons, pas de recalcul
- **Principe D** : dégradation propre

### L'ajout ultérieur — cas particuliers

Plus tard, pendant la question D (cas particuliers), Mika a
identifié une faiblesse :

> « je veu m'assurer que la partie d'integratio avec Quickbook est
> aussi rebioste que le reste »

L'intégration générale était couverte. Mais les cas particuliers
(cadeaux, notes de crédit rétroactives, ventes à perte) avaient des
implications QuickBooks non cadrées.

Cette inquiétude a mené à la création de **Q9** dans
`questions-ouvertes.md` : le cadrage détaillé de l'intégration
QuickBooks (incluant tous les cas particuliers) devra être fait
avant la Phase C.

### Ce qui a été évité

**Piège 1 — Sur-engineering au MVP**
Sans la retenue de Mika, l'assistant aurait listé 50 champs
QuickBooks "au cas où". Travail obsolète dans 18 mois.

**Piège 2 — Sous-engineering du MVP**
Sans le document d'intégration, le modèle de données MVP aurait pu
omettre les champs miroir. Refactor douloureux en Phase C.

**Piège 3 — Fausse sensation de complétude**
Sans Q9, on aurait pu croire que l'intégration est "cadrée" alors
que les cas particuliers ne sont pas couverts. Découverte pénible
en Phase C.

### Pattern identifié

**Pattern — L'équilibre entre vision et détail**

Pour les sujets en aval (Phase C+), la vision suffit. Les détails
techniques viendront avec les bons outils à disposition.

Pour les sujets en amont (MVP), les détails sont nécessaires.

Le document `11-integration-quickbooks.md` est un exemple réussi :
**détaillé sur les décisions MVP** (champs miroir à prévoir
maintenant), **léger sur les décisions futures** (structure de
payload, retry logic).

---

## Section 5 — L'intégration physique/réseau (fusion d'une autre conversation)

> **Document de référence** : `docs/12-integration-physique-reseau.md`
>
> **Un ajout majeur qui n'était pas dans le plan initial. Il est né
> du fait que Mika avait une autre conversation Claude en parallèle.**

### L'apparition surprenante

À un moment du Paquet 2, Mika partage dans la conversation **un
rapport de contexte complet d'une autre conversation Claude**.

Cette autre conversation portait sur :

- L'impression d'étiquettes (imprimante Zebra ZD421t, étiquettes
  Multi-Action de L'Ange-Gardien, ruban resin)
- Les scanners de code-barres (Zebra DS2208)
- Les paiements électroniques (Helcim vs Stripe vs Moneris, ~12 500$/an)
- L'intégration QuickBooks via Synder
- Facebook Shop + Catalog (vs Marketplace qui n'a pas d'API)
- Le ZPL généré directement par le code (pas de BarTender)
- La topologie réseau complète

### La vraie question de Mika

Il ne demandait pas juste "lis ça". Il demandait :

> « Je penses qu'on pourrait rajouter ça dans le projet global;
> qu'en penses-tu? Regarde ça et dit moi si il y a des elements
> accrochant entre ceci et ce qu'on a fait jusqu'à maintenant? »

### L'analyse honnête des chevauchements

L'assistant a identifié plusieurs conflits réels entre les deux
conversations :

**Conflit 1 — Le volume du business**
Notre projet : ~500-2000 items/an. L'autre conversation : ~1M$/an
de chiffre d'affaires, moins de 10 transactions/jour. Les deux ne
correspondent pas à la même réalité.

**Conflit 2 — Le type de commerce**
Notre projet : revente informelle via Marketplace. L'autre
conversation : commerce au comptoir traditionnel avec POS, scanner,
paiement Helcim.

**Conflit 3 — Les clients**
Notre projet : pas de CRM au MVP. L'autre conversation : CRM léger
dès le début (clients qui reviennent, RDV).

### La question de clarification

Plutôt que de tout fusionner aveuglément, l'assistant a demandé à
Mika :

> Comment tu vois la relation entre les deux conversations?
>
> - Même business — ma vision évolue vers comptoir + Marketplace
> - Deux volets dans le même business
> - Projet différent
> - J'explore les deux pistes en parallèle

### La réponse éclairante de Mika

> « En fait la vente au comptoir sera probablement l'haboutissement
> d'une buisness qui aua qu'une entrepot eventuellement, au lieu
> d'echange depneu informel (Ou seulement informel), chez nous, ou
> devant une des deu entrepot actuel »

**Révélation** : les deux conversations parlent du **même business**,
mais **à des moments différents**.

- **Notre projet** = le business d'aujourd'hui (informel, Marketplace) → MVP
- **L'autre conversation** = le business de demain (comptoir,
  consolidé) → Phase B/C

### Conséquence — ne rien casser, capturer la vision

L'assistant n'a **pas** intégré tout le contenu de l'autre
conversation dans nos documents existants. Ça aurait changé le scope
du MVP et complexifié énormément.

À la place : **création d'un document de vision dédié** qui capture
l'évolution future sans l'imposer au MVP.

### La question du document technique

Initialement, l'assistant a proposé un document "vision"
stratégique et léger. Mika a poussé plus loin :

> « Et pourquoi on aurait pas un document technique d'integration des
> elements physique et reseautique; ca pourrait pas? »

**Ça pourrait absolument**. Et c'est même **mieux** que le document
vision que l'assistant proposait.

### Le document final — `12-integration-physique-reseau.md`

Structure adoptée :

1. **Principes généraux** (P1-P5) — réseau local, dégradation, IPs
   statiques, identification par appareil, isolation réseau
2. **Topologie réseau** en 3 états (MVP → pré-comptoir → comptoir
   structuré)
3. **Imprimante Zebra ZD421t** — section détaillée (on a les infos
   concrètes)
4. **Scanner Zebra DS2208** — section moyenne
5. **Terminal Helcim** — grandes lignes
6. **Placeholders** pour les appareils futurs (caméra, lecteur DOT,
   balance, imprimante de reçus)
7. **Gestion des pannes** — stratégie de dégradation par appareil

### L'étiquetage comme apprentissage parallèle

Mika a voulu explorer si l'étiquetage pouvait être commencé **avant
le MVP**, comme apprentissage parallèle :

> « j'avais l'impression que c'est utilse de commencer à tenter,
> meme partiellement, d'utiliser ce systeme pour se pratiquer et
> debugger »

L'assistant a structuré ça en 3 apprentissages distincts :

**Apprentissage 1 — L'équipement physique** (faisable sans l'app,
commander matos et tester)
**Apprentissage 2 — Le workflow humain** (intégrer "coller
étiquette" au workflow d'inspection)
**Apprentissage 3 — L'intégration app → imprimante** (nécessite
l'app, donc plus tard)

Les deux premiers peuvent se faire **dès maintenant**, en parallèle
du MVP, sans toucher au code.

### Ce qui aurait été perdu sans ce document

Si on n'avait pas capturé cette intelligence :

- **Perte des références concrètes** (modèles exacts, fournisseurs
  locaux, tarifs). Dans 6 mois, il aurait fallu refaire toute la
  recherche.
- **Perte du raisonnement** "pourquoi Zebra ZD421t et pas GC420d"
- **Perte des chiffres Helcim** (~12 500$/an vs autres)
- **Pas de plan d'apprentissage parallèle** — Mika aurait attendu
  la Phase B pour tester

### Pattern identifié

**Pattern — Les conversations parallèles sont une richesse, pas un
chaos**

L'assistant aurait pu voir l'autre conversation comme un conflit ou
une complication. En fait, c'était **de l'intelligence
supplémentaire** gratuite.

**Leçon** : quand un utilisateur mentionne une autre conversation
sur le même projet, demander à voir le contexte, identifier les
chevauchements, capturer ce qui est utile sans forcer la fusion.

---

## Section 6 — Les cas particuliers (question D)

> **Documents de référence** : enrichissements de `06-modele-donnees.md`
> (statut `donne`, événement `cadeau`), enrichissements de `backlog.md`,
> Q9 dans `questions-ouvertes.md`
>
> **La question D devait traiter les cas comptables bizarres. Elle a
> produit un minimum de features et un maximum de clarté sur ce qui
> n'est pas dans le scope.**

### Les 6 cas identifiés au départ

L'assistant a listé 6 cas typiques de commerce :

1. **Bonus dans les lots** — fournisseur donne 2 kits gratuits
   dans un lot de 10
2. **Pneus offerts** — cadeau à un ami, à la famille, en promotion
3. **Ajustements fournisseur** — ristourne rétroactive, note de
   crédit
4. **Pneus récupérés gratuitement** — trouvés, donnés
5. **Ventes à perte volontaires** — liquidation
6. **Échanges de services** — troc sans argent

Mika a confirmé : **tous ces cas arrivent** chez lui, à des
fréquences variables.

### Cas 1 — Bonus dans les lots (vite réglé)

Mika a été direct :

> « Je vois pas pourquoi c'est un probleme de la maniere dont ont
> assign des cout pour chaque kit »

**Il avait raison** : ADR-008 (allocation hybride) couvre déjà le
cas. Mika choisit : 0$ aux bonus (méthode actuelle) ou répartition
au prorata. L'app ne force pas.

Pas de nouveau travail. Cas fermé.

### Cas 2 — Pneus offerts (le bon équilibre)

Mika a donné les bons critères :

> « ce qui arrivent doit être clair (Bouton cadeau, promotion?) en
> plus d'etre logique de maniere comptable. Que me suggere tu qui
> serait simple »

L'assistant a fait une recherche web pour comprendre les règles
fiscales québécoises. Résultat : **pas de TPS/TVQ sur les cadeaux
de promotion**, juste de la traçabilité.

Proposition initiale trop complexe (bouton "Sortie non-vendue" avec
sous-catégories cadeau/promotion/usage personnel).

### Le recadrage de Mika — "pas MVP"

> « Ca me plait, mais ça me parait pas MVP. Je veu m'assurer que la
> partie d'integratio avec Quickbook est aussi rebioste que le
> reste »

**Double signal** :

1. Ne pas tout mettre au MVP (discipline de scope)
2. S'inquiéter que l'intégration QuickBooks soit aussi robuste que
   le reste du cadrage (ce qui a mené à Q9 plus tard)

### La version minimale retenue

Après discussion, une version **vraiment minimale** a émergé :

- **3 actions disponibles** sur un kit en stock : Vendre / Donner /
  Rebuter
- **Statut `donne`** sur le Kit
- **Événement `cadeau`** dans le journal
- **Note libre obligatoire** (à qui, pourquoi)
- **Pas d'intégration QuickBooks** (conforme à la règle Revenu
  Québec)

Les sous-catégorisations (cadeau familial, promotion marketing,
etc.) → backlog Phase B.

### Cas 3 — Notes de crédit fournisseur (la nuance)

L'assistant a d'abord creusé dans QuickBooks. Résultat : QuickBooks
a une feature native **"Vendor Credit"** qui gère ça.

**Première conclusion** : laisser ça à QuickBooks, pas dans l'app.

Mais Mika a reformulé :

> « Pour les notes de credit j'aimerais revister ca plus tard; pas
> MVP surtout en dehors de QB. »

**Nuance** : il ne veut pas simplement "en dehors de QuickBooks". Il
veut **revisiter le sujet** plus tard pour décider si l'app a
besoin de visibilité sur ces ajustements (pour calculer un coût
réel ajusté par fournisseur, par exemple).

Cette précision a mené à **Q9** : ne pas trancher maintenant, mais
capturer le sujet pour le cadrage détaillé avant la Phase C.

### Cas 4 — Pneus récupérés gratuitement

Différent des cadeaux (le kit existe toujours mais a été acquis sans
transaction). Backlog Phase B : nouveau champ "source
d'acquisition" sur Lot. Workaround MVP : lot à 0$.

### Cas 5 — Ventes à perte volontaires

Confusion sur le vocabulaire. L'assistant a parlé de "liquidation"
au sens "vente à perte". Mika a corrigé :

> « Liquidation au Quebec veut dre rabais; c'est ce que tu veu
> dire? »

Reformulation : "vente à perte volontaire" (vendre en dessous du
coût).

**Décision de Mika** : pas besoin de champ "motif".

> « Je crois que c'est consideré comme une vente à perte. »

Le système détecte automatiquement (prix < coût alloué). Pas besoin
de catégoriser la raison. Le chiffre parle de lui-même.

### Cas 6 — Échanges de services

Rare. Backlog Phase C. Workaround MVP : traiter comme cadeau +
comptabiliser manuellement dans QuickBooks.

### La distinction cadeau vs rebut vs vente

Au milieu de la discussion, une ambiguïté a émergé. L'assistant a
soulevé :

> Si on permet "prix de vente à 0$", on crée une ambiguïté :
> est-ce une destruction maquillée en vente, ou est-ce vraiment une
> vente?

Puis l'assistant a dérivé en proposant un prix minimum à 1$.

Mika a recadré simplement :

> « Non, je veu donner. On peut pas juste decider cadeau ou
> rebut? »

**Oui, on peut**. Et c'est exactement la bonne distinction :

- **Cadeau** = le kit existe encore (juste sans argent)
- **Rebut** = le kit est détruit

Ces deux statuts sont distincts. Pas besoin de "vente à 0$".

### Le tour complet avant fermeture

Vers la fin, Mika a demandé :

> « Fait un derneir tou vant question de rien oublier »

**Discipline exemplaire**. L'assistant a fait un tableau récapitulatif
de 14 cas (les 6 originaux + 8 connexes) et leur statut. Tous
étaient soit traités, soit consciemment différés.

### Ce qui aurait été perdu sans la question D

- **Pas d'action "Donner" au MVP** — workaround bancal via note
  libre
- **Pas de Q9** — découverte tardive des ajustements fournisseur
- **Confusion vente/destruction** si prix à 0$ autorisé
- **Scope creep** si tous les cas particuliers étaient ajoutés au
  MVP

### Pattern identifié

**Pattern — Le tour final est précieux**

Avant de fermer un paquet, faire un **tour complet honnête** de
tous les cas identifiés. Chaque cas doit être :

- **Traité** (décision prise, ADR mis à jour)
- **Différé consciemment** (backlog ou question ouverte, avec
  justification)
- **Fermé comme couvert** (déjà dans un ADR existant)

Jamais **oublié** ou **glissé sous le tapis**.

Mika a systématiquement demandé ce tour final. L'assistant, seul,
aurait déclaré le paquet bouclé plus vite (pattern "synthèse
optimiste" déjà identifié au Paquet 1).

---

## Section 7 — La philosophie "pratiques pré-MVP"

> **Document de référence** : `docs/pratiques-pre-mvp.md`
>
> **Une idée née de Mika pendant la discussion sur les emplacements.
> Elle est devenue un pattern structurant du projet.**

### L'émergence

Pendant la discussion sur les emplacements (Section 3), Mika a
refusé l'idée d'un "inventaire massif à la bascule" :

> « Si on avait une methode de mettre à jour la liste sur lequel on
> travail et qu'on mettent se champ dans les nouvelles listes, on
> pourrait regler ça en partie immediatement »

**Principe implicite** : certaines décisions de cadrage peuvent être
appliquées **immédiatement** dans les outils actuels, sans attendre
l'app.

### Le double bénéfice identifié

**Bénéfice 1 — Debug du concept dans la vraie vie**

Tester une convention avant l'app révèle :

- Les problèmes d'ergonomie ("le nom d'emplacement est trop long")
- Les cas particuliers non prévus ("mais comment je gère les kits
  en transit?")
- Les incohérences de vocabulaire ("je disais 'saison courte', on a
  mis '2 saisons'")

Ces découvertes sont **beaucoup moins coûteuses** à corriger avant
le développement que pendant.

**Bénéfice 2 — Migration plus facile**

Le jour de la bascule, les données sont déjà au bon format. Pas de
chantier massif de reformatage ou d'inventaire.

### Les 4 pratiques initiales retenues

**Pratique 1 — Capturer l'emplacement de chaque kit**
Ajouter une colonne "Emplacement" dans les Excel actuels. Remplir
pour les 130 kits existants (demi-journée). Convention de nommage
simple.

**Pratique 2 — Capturer le prix affiché en plus du prix vendu**
Ajouter une colonne "Prix affiché". Saisir au moment de la
publication sur Marketplace, pas juste à la vente.

**Pratique 3 — Standardiser le vocabulaire "saisons restantes"**
Utiliser le vocabulaire standardisé dans les annonces ("3-4
saisons" en fourchette). Debug du vocabulaire avant l'app.

**Pratique 4 — Démarrer la numérotation A247 pour les nouveaux kits**
Pour les nouveaux lots, utiliser le nouveau format. Sans les 50
ancres (impossible sans app), mais avec une réservation de plage
manuelle.

### Les garde-fous

Toutes les décisions ne peuvent pas être pratiquées en pré-MVP :

**À éviter** :
- Ce qui dépend trop de l'app (50 ancres aléatoires, journal
  immutable avec événements structurés)
- Ce qui n'est pas encore décidé (ex: structure clients
  particulier/commerce avant le Paquet 4)

**À inclure** :
- Ce qui apporte de la valeur immédiate
- Ce qui est facile à capturer manuellement
- Ce qui prépare directement la migration

### L'impact sur la stratégie de bascule

Cette philosophie change la nature de la bascule MVP. Au lieu d'un
"big bang" où tout change d'un coup :

**Bascule progressive** :
- Les données sont déjà structurées avant l'app
- Les conventions sont déjà éprouvées
- La formation est déjà commencée (par l'usage)
- Le risque de rupture est minimisé

Cette idée a renforcé l'importance de **Q8** (stratégie de bascule)
comme sujet dédié à traiter avant le développement MVP.

### Pattern identifié

**Pattern — La capture précède le développement**

Plutôt que de penser "le cadrage → le développement → la bascule",
penser "le cadrage → la capture pré-MVP → le développement → la
bascule douce".

**Leçon** : pour chaque décision de cadrage future, se demander :
**"Est-ce que ça peut être pratiqué dès maintenant dans les outils
actuels?"** Si oui → ajouter à `pratiques-pre-mvp.md`.

---

## Section 8 — Patterns émergents du Paquet 2

Plusieurs patterns de collaboration ont émergé ou se sont renforcés
pendant le Paquet 2. Certains étaient déjà identifiés au Paquet 1,
d'autres sont nouveaux.

### Pattern A (récurrent) — Mika recadre les scopes mal posés

**Exemples Paquet 2** :

- "Les marges nettes c'est la job de QuickBooks" → a évité des
  semaines de sur-ingénierie comptable
- "Pas MVP" sur les cadeaux → a contraint l'assistant à une version
  minimale
- "Une question à la fois SVP" → a obligé l'assistant à ralentir

**Leçon** : l'assistant doit constamment se demander *"est-ce que la
question mérite d'être posée ainsi?"* avant de cadrer en profondeur.

### Pattern B (récurrent) — Solution smart vs solution explicite

Déjà identifié au Paquet 1, toujours présent au Paquet 2 :

**Exemples** :
- Allocation des coûts : auto-fill vs champs vides → champs vides
  retenus (Principe 11)
- Catégorisation cadeau : sous-catégories automatiques vs note
  libre → note libre retenue

**Leçon** : pour les champs à impact, préférer l'explicite au smart.
Pour les champs sans impact, le smart est acceptable.

### Pattern C (récurrent) — Synthèse optimiste de l'assistant

Déjà identifié au Paquet 1, toujours présent au Paquet 2 :

**Exemples** :
- Déclarer le Paquet 2 "bouclé" avant la question D (recadré par
  Mika)
- Proposer de fermer la question D avant d'avoir fait le tour des 6
  cas (recadré par "Fait un derneir tou")

**Leçon** : pour chaque fermeture de paquet, demander explicitement
"qu'est-ce qu'on n'a pas traité?" avant de déclarer la fin.

### Pattern D (nouveau) — Mika calibre les enjeux mieux que l'assistant

Nouveau au Paquet 2. L'assistant a plusieurs fois gonflé l'effort
nécessaire :

**Exemples** :
- "Ajouter les emplacements, ça fait beaucoup" → Mika : "130 kits,
  c'est une demi-journée"
- "Sur-engineering des champs QuickBooks" → Mika a validé la
  retenue
- "Trop de features pour le MVP" → Mika a coupé ce qui n'était pas
  essentiel

**Leçon** : quand l'assistant estime un effort, Mika doit avoir le
dernier mot — c'est lui qui travaille.

### Pattern E (nouveau) — La capture précède le développement

Nouveau au Paquet 2, devient un pattern structurant :

**Exemple principal** : émergence de `pratiques-pre-mvp.md`

**Leçon** : pour chaque décision future, se demander si elle peut
être pratiquée immédiatement.

### Pattern F (nouveau) — Le tour final est précieux

Nouveau au Paquet 2 :

**Exemple** : le tour complet des 14 cas particuliers avant
fermeture de la question D

**Leçon** : jamais fermer un paquet sans un tour honnête de tout ce
qui a été évoqué.

### Pattern G (nouveau) — Les conversations parallèles enrichissent

Nouveau au Paquet 2 :

**Exemple** : l'autre conversation Claude intégrée dans le projet

**Leçon** : ne pas voir les conversations parallèles comme des
conflits. Les traiter comme de l'intelligence supplémentaire
gratuite.

### Pattern H (nouveau) — Mika recadre le vocabulaire

Nouveau au Paquet 2 :

**Exemples** :
- "Liquidation au Quebec veut dre rabais" → correction sur "vente à
  perte"
- "SVP parle en langage humain" → correction sur le jargon formel
- "Une question à la fois SVP" → correction sur la quantité

**Leçon** : l'assistant doit être attentif au vocabulaire et au
style. Un terme technique mal interprété peut créer de la
confusion.

---

## Section 9 — L'intégration de l'autre conversation Claude

> **Une section dédiée parce que c'est un apport unique du Paquet 2
> qui mérite d'être documenté en tant que pattern.**

### Le contexte

Au milieu du Paquet 2, Mika a partagé le contexte complet d'une
**autre conversation Claude** qu'il avait en parallèle sur le même
business. Cette conversation portait sur les aspects physiques du
commerce (étiquettes, scanner, paiements, imprimante).

### Les deux possibilités

**Possibilité 1 — Ignorer ou traiter à part**

"C'est une autre conversation, pas notre sujet. Continuons sur notre
cadrage."

**Inconvénient** : perte d'intelligence, risque que les deux
conversations produisent des projets incompatibles.

**Possibilité 2 — Fusion aveugle**

"Intégrons tout, on verra bien."

**Inconvénient** : scope creep massif, conflits entre les deux
visions, MVP qui explose.

### L'approche retenue — Fusion intelligente

L'approche adoptée a été de **fusionner ce qui est cohérent, garder
séparé ce qui diverge, capturer ce qui est utile pour plus tard**.

**Concrètement** :

1. **Identifier les conflits réels** (volumes, type de commerce,
   clients)
2. **Demander clarification à Mika** sur comment il voit la relation
   entre les deux
3. **Déterminer qu'il s'agit du même business à des moments
   différents**
4. **Capturer l'intelligence dans un document dédié**
   (`12-integration-physique-reseau.md`)
5. **Ne pas changer le scope MVP** — le MVP reste sur la réalité
   d'aujourd'hui

### Ce que l'autre conversation a apporté

**Intelligence technique immédiatement utile** :

- Recommandations matérielles précises (Zebra ZD421t)
- Rejet argumenté de mauvais choix (GC420d discontinué)
- Fournisseurs locaux identifiés (Multi-Action, Étiquettes Écono)
- Protocoles techniques (ZPL direct dans le code)
- Tarifs comparatifs des paiements (Helcim, Stripe, Moneris, Square)

**Vision stratégique pour l'évolution** :

- Évolution du commerce informel vers le comptoir
- Progression matérielle (imprimante → scanner → terminal paiement)
- Topologie réseau à 3 états (MVP → pré-comptoir → comptoir)

**Enjeux techniques identifiés** :

- Facebook Marketplace n'a pas d'API publique
- QuickBooks + Synder comme bridge possible
- PCI-DSS pour les terminaux de paiement

### Ce qui aurait été perdu

Sans cette fusion intelligente :

- **Perte des recommandations matérielles** (il aurait fallu les
  refaire)
- **Découverte tardive du problème Marketplace** (peut-être au
  milieu de la Phase B)
- **Pas de plan d'apprentissage parallèle** pour l'étiquetage
- **Conflits potentiels** si les deux conversations produisaient
  deux projets différents

### Pattern pour l'avenir

Quand un utilisateur mentionne une autre conversation sur le même
projet :

1. **Demander à voir le contexte** (l'utilisateur partage)
2. **Identifier les chevauchements** (factuels, pas subjectifs)
3. **Poser la question de la relation** (même projet? deux
   projets? moments différents?)
4. **Fusionner intelligemment** selon la réponse
5. **Capturer l'intelligence** dans un document approprié
6. **Ne pas élargir le scope courant** sans raison claire

### Dernière réflexion

Il est possible, voire probable, que **d'autres conversations
parallèles** existent ou existeront sur ce projet. Le pattern établi
ici — documenter dans `docs/integration-*.md` les apports
stratégiques, sans casser le cadrage courant — devrait servir pour
ces cas futurs.

---

## Section 10 — Auto-critique honnête de l'assistant

> **Cette section est inhabituelle mais importante. Elle documente
> les erreurs répétées de l'assistant pendant le Paquet 2 pour que
> les futures sessions n'aient pas à les redécouvrir.**

### Pourquoi cette section existe

L'assistant (moi) a fait plusieurs erreurs pendant le Paquet 2.
Certaines étaient répétées malgré les avertissements précédents.
Documenter honnêtement ces erreurs :

- **Évite aux futures sessions** de faire les mêmes
- **Préserve la dynamique de travail** qui fonctionne avec Mika
- **Honore le principe** de transparence et d'honnêteté du projet

Cette section n'est pas une auto-flagellation. C'est un outil.

### Erreur 1 — Sur-structuration et jargon formel

**Manifestation** : plusieurs réponses commençaient par "Q : ... R : ..."
ou utilisaient du jargon de cadrage de produit alors que Mika est à
l'aise en langage conversationnel.

**Moment déclencheur** : Mika a dit explicitement :

> « SVP parle en langage humain »

Cette phrase a révélé que l'assistant avait construit un mur
stylistique sans s'en rendre compte.

**Pattern sous-jacent** : l'assistant s'appuie sur des formats
structurés (tableaux, listes, encadrés) par défaut, pensant que
c'est "professionnel". Mais pour une conversation itérative, c'est
du **sur-formatage** qui crée de la distance.

**Correction** : l'assistant a ajusté son ton pour le reste de la
session. Réponses plus conversationnelles, moins de listes
imbriquées.

**Leçon pour les futures sessions** : surveiller le style dès le
début. Si Mika parle en langage courant, répondre en langage
courant. Les tableaux et listes sont des outils, pas des obligations.

### Erreur 2 — Questions empilées

**Manifestation** : l'assistant posait 3-4 questions dans une seule
réponse, demandant à Mika de répondre à tout en même temps.

**Moment déclencheur** :

> « Une question à la fois SVP »

**Pattern sous-jacent** : vouloir "avancer vite" en traitant
plusieurs sujets en parallèle. Mais ça fragmente la réflexion et
force Mika à tout suivre simultanément.

**Correction** : l'assistant a limité à **une question à la fois**
pour le reste de la session sur le pricing.

**Leçon pour les futures sessions** : une question par réponse, en
mode conversation. Les sous-questions peuvent venir dans les
réponses suivantes.

### Erreur 3 — Synthèse optimiste (récurrent)

**Manifestation** : déclarer des paquets ou sous-paquets "bouclés"
avant d'avoir vraiment fait le tour.

**Exemples au Paquet 2** :

- Déclarer le Paquet 2 prêt pour fermeture avant la question D
- Proposer de fermer la question D avant d'avoir traité les 6 cas
- Suggérer de passer à la suite quand Q9 émergeait

**Moment révélateur** :

> « Fait un derneir tou vant question de rien oublier »

Mika a dû **explicitement demander un tour final** parce que
l'assistant aurait fermé trop vite.

**Pattern sous-jacent** : vouloir "clore un sujet" pour avancer.
Mais c'est la dynamique qui produit les oublis qui deviennent des
problèmes plus tard.

**Correction** : systématiquement demander "qu'est-ce qu'on n'a pas
traité?" avant de fermer.

**Leçon pour les futures sessions** : à la fin de chaque paquet,
l'assistant doit **proactivement** faire un tour final, pas
attendre que Mika le demande.

### Erreur 4 — Sur-engineering des propositions

**Manifestation** : proposer des solutions complexes avant de vérifier
que c'est nécessaire.

**Exemples au Paquet 2** :

- "Sortie non-vendue" avec sous-catégories élaborées → Mika : "pas
  MVP"
- Champs QuickBooks détaillés "pour être prêts" → l'assistant lui-
  même s'est repris (Principe 6)
- Prix minimum 1$ pour éviter les "ventes à 0$" → Mika : "je veu
  donner, on peut pas juste decider cadeau ou rebut?"

**Pattern sous-jacent** : l'assistant s'appuie sur des best
practices génériques SaaS qui supposent des contextes variés. Mais
Mika a un contexte précis et relativement simple.

**Correction** : toujours commencer par la version minimale viable,
ajouter de la complexité seulement si justifiée par un besoin réel.

**Leçon pour les futures sessions** : appliquer le Principe 6 (la
technologie suit le besoin réel) et le Principe 13 (cas standard
d'abord) avant de proposer.

### Erreur 5 — Confusion de contexte (l'autre conversation)

**Manifestation** : au moment d'analyser l'autre conversation
Claude, l'assistant a failli soit l'ignorer totalement, soit la
fusionner aveuglément.

**Point critique** : Mika a posé la bonne question :

> « Regarde ça et dit moi si il y a des elements accrochant entre
> ceci et ce qu'on a fait jusqu'à maintenant? »

L'assistant s'en est bien sorti en identifiant les conflits
factuels (volumes, type de commerce) et en demandant clarification.
Mais le réflexe initial aurait pu être mauvais.

**Leçon pour les futures sessions** : ne jamais traiter une
conversation parallèle comme un "bloc à intégrer ou ignorer". La
traiter comme **une autre source d'information** qui mérite analyse
factuelle.

### Erreur 6 — Sommaires trop longs

**Manifestation** : produire des sommaires techniques de 948 lignes
quand 300 auraient pu suffire.

**Exemple concret** : le sommaire intermédiaire du Paquet 2 (948
lignes) contenait beaucoup de "zones de confort" — des explications
détaillées de pourquoi faire chaque action.

**Pattern sous-jacent** : vouloir "tout expliquer" à Claude Code au
cas où. Mais Claude Code lit bien et n'a pas besoin de sur-
explication.

**Correction** : après le sommaire intermédiaire, les sommaires
suivants ont été plus concis (388 lignes pour la fermeture Paquet 2,
496 pour l'archivage).

**Leçon pour les futures sessions** : un sommaire technique doit
contenir exactement ce qu'il faut pour l'exécution, pas des
justifications pédagogiques. Si la justification est importante,
elle va dans le document narratif (celui-ci), pas dans le sommaire
d'exécution.

### Ce que ces erreurs révèlent ensemble

Un thème commun : l'assistant a tendance à faire **"plus que
demandé"**. Plus de structure, plus de questions, plus de features,
plus d'explications.

**Le contre-modèle à adopter** :

- **Moins de structure** → langage conversationnel
- **Moins de questions** → une à la fois
- **Moins de features** → le minimum viable
- **Moins d'explications** → l'essentiel

**Principe implicite** : **la retenue est une vertu**. L'assistant
doit résister à l'élan d'en faire "trop bien".

### Pourquoi c'est précieux de documenter ça

Dans 6 mois, une nouvelle session Claude sur ce projet lira ce
document. Elle verra ces erreurs et pourra les éviter dès le
début, au lieu de les redécouvrir par les corrections de Mika.

Mika n'aura pas à refaire les mêmes recadrages stylistiques. Il
pourra aller directement au fond.

C'est un **gain de productivité** réel pour les futures sessions.

---

## Section 11 — Questions ouvertes issues du Paquet 2

Le Paquet 2 a produit **3 nouvelles questions ouvertes** qui
rejoignent celles du Paquet 1 dans `docs/questions-ouvertes.md`.

### Q7 — Stratégie de backup et continuité des données

**Émergée** : au milieu des discussions sur l'intégration QuickBooks,
Mika a demandé "est-ce qu'on aura une session sur la backup?"

**Constat** : Supabase gère des backups automatiques, mais plusieurs
scénarios nécessitent une politique explicite (erreur humaine,
export, compromission de compte, panne prolongée, archivage long
terme).

**Quand la trancher** : après le Paquet 4, avant le début du
développement MVP.

**Pourquoi pas maintenant** : pas connexe aux finances. Meilleur
moment après avoir cadré la structure complète de la BD.

### Q8 — Stratégie de bascule

**Émergée** : pendant la discussion sur les emplacements et
l'inventaire initial.

**Constat** : le jour de la bascule MVP, il faut gérer migration des
données, cohabitation Excel/app, tests, formation. Sans plan
explicite, risque de mise en production chaotique.

**Sous-sujets identifiés** :

- A — Migration des données
- B — Cohabitation
- C — Plan de test
- D — Formation et onboarding

**Quand la trancher** : dans un "Paquet 8 dédié" entre la fin du
cadrage fonctionnel et le début du développement MVP.

**Pourquoi pas maintenant** : sujet transversal qui bénéficie
d'avoir toutes les décisions fonctionnelles en main.

### Q9 — Notes de crédit fournisseur rétroactives

**Émergée** : pendant la question D (cas particuliers).

**Constat** : QuickBooks a une feature native "Vendor Credit" pour
gérer ces ajustements. La question ouverte : est-ce que l'app a
besoin de visibilité sur ces notes (pour calculer un coût réel
ajusté par fournisseur) ou ça reste purement dans QuickBooks?

**Quand la trancher** : lors du cadrage détaillé de l'intégration
QuickBooks, avant la Phase C.

**Pourquoi pas maintenant** : pas pertinent au MVP (intégration
QuickBooks n'existe pas encore).

### État global des questions ouvertes

Après le Paquet 2, `docs/questions-ouvertes.md` contient :

- **Q1** — Initiation d'achat / Work Order (Paquet 3 ou 4)
- **Q2** — Liste exhaustive des champs sensibles (Principe 8) (avant
  développement MVP)
- **Q3** — Rendez-vous clients liés aux items (Paquet 4)
- **Q4** — Seuils d'alerte de stagnation par saison (Paquet 6)
- **Q5** — Migration des codes legacy au nouveau système (Paquet 3)
- **Q6** — Gestion de la date de vente après retour (Paquet 2)
- **Q7** — Stratégie de backup et continuité (après Paquet 4)
- **Q8** — Stratégie de bascule (entre cadrage et développement)
- **Q9** — Notes de crédit fournisseur rétroactives (avant Phase C)

**Observation** : plusieurs questions pointent vers **Paquet 3
(données historiques)** ou **Paquet 4 (mécaniques de vente)**. Ce
sont les prochains paquets naturels à traiter.

---

## Épilogue

Le Paquet 2 était annoncé comme "les finances". Il a produit :

- **2 ADR** structurants (pricing, emplacements)
- **2 documents de vision** (QuickBooks, physique/réseau)
- **1 document de pratiques** (pré-MVP)
- **3 nouvelles questions ouvertes** (Q7, Q8, Q9)
- **Un recadrage architectural majeur** (app vs QuickBooks)
- **L'intégration d'une conversation parallèle**
- **Une nouvelle convention documentaire** (docs/sessions/)

C'est **beaucoup plus** que ce qui était attendu. Cette leçon vaut
pour les paquets futurs : le cadrage n'est pas un plan d'exécution
linéaire, c'est une conversation structurée qui découvre ses
ramifications.

### Ce qu'on a appris sur la méthode

**Méthode 1 — Les patterns de collaboration sont persistants**

Les patterns du Paquet 1 se sont retrouvés au Paquet 2. Certains se
sont renforcés, de nouveaux sont apparus. Documenter ces patterns
produit une amélioration continue de la dynamique.

**Méthode 2 — La documentation narrative préserve l'intelligence**

Les ADR capturent les décisions. Mais c'est ce document narratif
qui capture **comment on a pensé**. Les deux sont complémentaires.

**Méthode 3 — L'honnêteté sur les erreurs est un outil**

La Section 10 (auto-critique de l'assistant) est inhabituelle mais
utile. Elle transforme les frictions en apprentissages.

### Ce qui reste à faire

Après le Paquet 2, plusieurs chantiers restent :

- **Paquet 3** — Données historiques (import legacy Excel,
  migration)
- **Paquet 4** — Mécaniques de vente (entité Client
  particulier/commerce, canaux, rendez-vous)
- **Paquet 5** — Utilisateurs / permissions (largement tranché par
  ADR-007)
- **Paquet 6** — Dashboard (spécifications détaillées)
- **Paquet 7** — Validation finale MVP
- **Paquet 8** — Stratégie de bascule (nouveau, Q8)

### La vision long terme toujours présente

Au-delà des décisions techniques, le Paquet 2 a renforcé plusieurs
visions long terme déjà exprimées :

- **Assistant prédictif de pricing** — ADR-011 capture le minimum
  pour le nourrir
- **Commerce au comptoir** — `12-integration-physique-reseau.md`
  anticipe l'évolution
- **Système fool-proof** — chaque décision facilite la délégation
- **Amazon du pneu usagé** — les 3 entrepôts sont une étape vers
  l'échelle future

Ces visions continuent de guider les décisions architecturales. Les
principes 6 (tech suit le besoin) et 7 (scalabilité latente)
restent les étoiles polaires du projet.

---

**Version** : 1.0 (Paquet 2 complété)
**Date** : Avril 2026
**À mettre à jour à** : fin du Paquet 3, en ajoutant
`raisonnement-paquet-3.md`

Ce document a été produit dans une session dédiée à la préservation
du raisonnement du Paquet 2. Comme son frère `raisonnement-paquet-1.md`,
il sert de mémoire narrative et d'outil pour les futures sessions.
