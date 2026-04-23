# Raisonnement préservé — Paquet 1

> Ce document n'est pas une spec technique. C'est la mémoire narrative du
> projet. Il capture **comment** on est arrivés aux décisions, pas
> seulement ce qu'on a décidé.

---

## Pourquoi ce document existe

Les ADR capturent les **décisions finales** du projet : quoi a été
décidé, quand, et avec quelles conséquences. Ils sont structurés,
formels, orientés action.

Ce document-ci capture le **chemin qui a mené à ces décisions** : les
alternatives considérées, les arguments échangés, les intuitions
terrain qui ont tout changé, les erreurs de raisonnement évitées.

Il sert à :

- **Justifier une décision** quand elle est remise en cause dans 6 mois
  ou 3 ans
- **Comprendre pourquoi certaines options ont été écartées** (et ne pas
  les reproposer naïvement)
- **Préserver les patterns de pensée de Mika** qui ont émergé pendant
  le cadrage
- **Éviter de refaire les mêmes débats** quand de nouveaux contributeurs
  rejoignent le projet (humains ou IA)
- **Transmettre le contexte émotionnel et stratégique** qui manque aux
  specs techniques

## Comment lire ce document

Chaque grande décision suit une structure narrative :

1. **Le problème posé** — ce qu'on cherchait à résoudre
2. **Les itérations** — les propositions successives, avec qui proposait
   quoi
3. **Les challenges** — les cas terrain qui ont fait échouer certaines
   options
4. **La décision finale** — ce qui a été retenu et pourquoi
5. **Ce qui aurait été perdu** — les risques évités par le chemin
   emprunté

Les sections sont indépendantes. Tu peux lire celle qui t'intéresse
sans lire les autres.

## Note sur les conventions d'attribution

Dans ce document :

- **« Mika »** désigne le propriétaire du projet (utilisateur humain)
- **« L'assistant »** désigne l'IA de cadrage (Claude) qui a participé
  aux discussions

Cette distinction est importante. Beaucoup des décisions finales
viennent de Mika **après** avoir rejeté une proposition initiale de
l'assistant. Préserver cette attribution permet de ne pas idéaliser
rétrospectivement le processus et de documenter honnêtement les
apports de chacun.

---

## Contexte initial du projet

### D'où on est parti

Mika opère un business de revente de pneus usagés depuis plusieurs
années. Les données sont centralisées dans un fichier Excel
(`Database_Pneus_Unifiee.xlsx`) contenant 607 enregistrements
accumulés sur environ 18 mois.

Chiffres du point de départ (ordre de grandeur) :

- 607 enregistrements, 2 sources (saison 2025 + début 2026)
- 4 types de produits : pneus purs, pneus+rims, jantes seules, autre
- 72 marques différentes, taux de vente ~82%
- ~92k$ d'achats, ~191k$ de ventes, marge brute globale ~52%
- Saisonnalité marquée : pneus d'hiver se vendent en ~161 jours en
  moyenne, pneus d'été en ~98 jours

Problèmes visibles dans le fichier Excel source :

- Dates stockées en format numérique Excel (46133 au lieu de dates)
- Marques non standardisées (« Gt Radial » vs « GT Radial »)
- Tailles avec casse incohérente (« 265/70r17 » vs « 265/70R17 »)
- Champ `Profit_calcule` toujours vide
- Champ `Annee_usinage` jamais rempli
- Prix d'achat parfois mis à 0 pour les items « bonus » d'un lot, sans
  règle explicite d'allocation

### La vision que Mika a dévoilée progressivement

Au démarrage du cadrage, Mika a présenté le projet comme « structurer
mon Excel avec une app web ». Mais au fil des discussions, une vision
beaucoup plus ambitieuse a émergé :

1. **Court terme** — remplacer Excel, réduire la friction opérationnelle
2. **Moyen terme** — permettre la délégation à un employé (se libérer
   des tâches répétitives)
3. **Long terme** — devenir « l'Amazon du pneu usagé », potentiellement
   des centaines de milliers d'items par an

Cette révélation progressive a changé plusieurs décisions
architecturales. Notamment, la scalabilité latente (Principe 7) est
devenue une contrainte sur **chaque** choix technique : rien ne doit
fermer la porte au scénario long terme, même si le MVP sert le
court terme.

### Le scénario terrain de référence

Un cas d'usage réel est devenu la pierre de touche pour tester les
propositions du cadrage :

> Mika est **dehors**, chez un fournisseur ou devant son entrepôt. Il
> étiquette des pneus avec un **marqueur** (pas d'étiquettes
> imprimées au MVP). Ses mains peuvent être sales. Il ne veut pas
> sortir son téléphone à chaque pneu — idéalement, il retient
> mentalement la prochaine valeur (V17, V18, V19...) et l'écrit
> directement. L'admin (saisie détaillée dans l'app, prix, photos) se
> fait plus tard, à la maison.

Chaque proposition qui cassait ce scénario a été rejetée. Ce scénario
a justifié :

- Le rejet des codes aléatoires individuels (type K4M, H3P)
- Le principe 6 (« la technologie suit le besoin réel »)
- Le workflow de réservation de plage de codes

---

## Section 1 — Numérotation des kits

> **ADR de référence** : ADR-004
>
> **Cinq itérations ont été nécessaires pour arriver à la décision
> finale.** L'architecture des 50 ancres est largement une invention
> de Mika, pas une proposition de l'assistant.

### Le problème posé

Il fallait un système d'identifiants pour chaque kit. Ces identifiants
sont utilisés physiquement (écrits au marqueur sur les pneus), dans les
conversations (clients, partenaires), dans l'app (recherche), et dans
l'historique (traçabilité perpétuelle).

Plusieurs contraintes en tension :

1. **Workflow terrain de Mika** — étiquetage dehors, marqueur,
   incrémentation mentale
2. **Confidentialité des volumes** — les partenaires occasionnels ne
   doivent pas pouvoir déduire le chiffre d'affaires mensuel depuis les
   codes visibles
3. **Scalabilité** — prêt pour la vision « Amazon du pneu usagé »
4. **Robustesse** — pas de doublons, pas de collisions, pas de
   corruption
5. **Cohabitation avec le legacy** — 607 enregistrements avec 2
   conventions historiques (1A/2B en 2025, V01/V02 en 2026)

### Itération 1 — Codes opaques aléatoires (rejetée)

**Proposition de l'assistant** : codes aléatoires individuels type
`K4M`, `H3P`, `M7B`, inspirés des best practices SaaS.

**Raisonnement de l'assistant** : confidentialité totale, standard
professionnel, facilement scalable, zéro fuite d'information sur le
volume du business.

**Le challenge de Mika** : « Ça ne marche pas sur le terrain. Si je
suis dehors en train d'étiqueter 20 pneus à la chaîne, je ne peux pas
consulter mon téléphone à chaque pneu pour voir quel code aléatoire
écrire. J'ai besoin d'une logique d'incrémentation mentale. »

**L'insight clé que l'assistant avait manqué** : le workflow terrain
n'est pas un workflow devant un écran. Les best practices SaaS
supposent implicitement que l'utilisateur est **en face de l'app au
moment** où il fait l'action. Pas Mika. Mika est dehors, avec un
marqueur.

Mika a formulé à ce moment-là ce qui deviendra le **Principe 6** :

> « La technologie doit servir un vrai service au moment où elle est
> implémentée. Avoir un système hyper complexe quand le volume ne le
> justifie pas est une perte d'énergie. »

### Itération 2 — Séquentiel pur (aussi rejeté)

**Proposition (co-construite)** : `A001, A002, A003...` — simple
séquence alphabétique.

**Avantage** : incrémentation mentale parfaite. Mika écrit A247, il
sait que le prochain est A248.

**Le challenge de Mika** : « Mais alors mes partenaires voient
directement mon volume. Si la semaine dernière j'étiquetais autour de
A220 et qu'aujourd'hui je suis à A280, ils déduisent 60 kits en une
semaine. Ça fait partie des infos que je veux garder privées, surtout
pour un ami qui est aussi dans le marché. »

**L'insight** : la confidentialité des volumes n'est pas un caprice.
C'est un enjeu business réel. Mika collabore avec des gens qui sont
parfois en relation de quasi-concurrence. La visibilité des volumes
via les codes séquentiels casse la confidentialité par construction.

### Itération 3 — La vraie vision apparaît : « Amazon du pneu usagé »

À ce moment, Mika a dévoilé une vision beaucoup plus ambitieuse que ce
qui était supposé au départ. Il ne s'agit pas juste de gérer 500 items
par an avec un Excel. Il s'agit éventuellement d'opérer à l'échelle de
centaines de milliers d'items.

**Ce changement de cadrage a tout modifié.**

Le système de numérotation devait maintenant :

- Servir le présent simple (workflow marqueur, petits volumes)
- Supporter l'ambition future (volumes massifs)
- Protéger la confidentialité actuelle
- Ne rien fermer pour l'avenir

Ce n'est pas un compromis entre ces 3 contraintes. C'est une exigence
**conjointe**. On ne sacrifie aucune des 3.

**Émergence du Principe 7** : « Scalabilité latente. Chaque décision
technique doit servir le présent tout en ne fermant aucune porte vers
le futur. »

### Itération 4 — Retour à l'aléatoire (encore rejeté)

**Proposition de l'assistant** : « OK, si la confidentialité est
critique, revenons aux codes aléatoires mais avec une meilleure
explication. »

**Le challenge de Mika** (répété, avec plus de force cette fois) :
« Non. L'incrémentation mentale n'est pas négociable. Je suis dehors
au marqueur, je retiens 17, 18, 19. Je ne veux pas sortir le téléphone
à chaque pneu. »

L'assistant a failli s'enfermer dans un faux dilemme : soit
confidentialité via aléatoire, soit incrémentation via séquentiel. Les
deux semblaient incompatibles.

### Itération 5 — L'intuition de Mika : ancres multiples

**Proposition de Mika** (c'est sa proposition, pas celle de l'assistant) :

> « Et si, au lieu d'un seul point de départ, on avait plusieurs
> points de départ prédéfinis dans l'espace des codes possibles?
> Quand je demande une plage de codes, l'app choisit au hasard un des
> points de départ, et me donne des codes consécutifs à partir de là.
> Comme ça, intra-plage j'ai mon incrémentation mentale. Mais
> inter-plage, c'est aléatoire — personne ne peut déduire le volume
> total. »

**Réaction de l'assistant** : cette idée porte un nom en informatique.
C'est un pattern connu comme « **reservoir sampling with bucketing** »
ou « **bucket allocation with random bucket selection** ». Mika l'a
réinventée sans connaître le terme technique.

**Pourquoi ça marche** :

- Intra-plage (pendant une session d'étiquetage) : codes consécutifs,
  incrémentation mentale préservée
- Inter-plage (entre deux sessions, visible pour un observateur
  externe) : positions aléatoires, volume non déductible
- Zéro gaspillage : les codes sont tous utilisés, pas de fragmentation
- Scalable : le nombre d'ancres peut être ajusté

### Itération finale — Combien d'ancres? Analyse mathématique

Une fois le principe des ancres accepté, restait à déterminer le
nombre. L'assistant a fait les calculs pour 3 scénarios (30, 50, 100
ancres) à différents volumes projetés (500, 2000, 10 000 items/an).

**Résultats** :

- À 500 items/an (volume actuel) : 30 ancres = rotation tous les
  ~14 mois, 50 ancres = tous les ~2 ans, 100 ancres = tous les ~4 ans
- À 2000 items/an : saturation de l'espace (26 000 codes totaux) dans
  ~13 ans — largement suffisant pour le Palier 1
- À 10 000 items/an (scénario Amazon) : saturation dans ~2,6 ans,
  moment où le Palier 2 (format de code différent, ex: `AB247`) sera
  activé

**Conclusion** : à long terme, toutes les options ont une durée de vie
équivalente (le Palier 2 arrive au même moment). La différence se fait
sur la rotation visible à court terme.

**50 ancres** a été choisi comme sweet spot :

- Opacité visuelle suffisante entre plages (520 codes par zone)
- Rotation des ancres pas trop fréquente pour l'administrateur
- Implémentation raisonnable (pas de sur-ingénierie)

### Ce qui aurait été perdu sans les challenges de Mika

Sans l'intervention répétée de Mika à chaque itération :

**Itération 1 non challengée** → codes opaques → workflow terrain cassé
→ Mika abandonne l'outil au bout de 2 semaines parce que trop lourd à
utiliser en extérieur.

**Itération 2 non challengée** → séquentiel pur → confidentialité
nulle → fuite de volume au premier ami-concurrent → dégradation de la
relation business.

**Itération 4 non challengée** → retour à l'aléatoire → même problème
que l'itération 1 → retour en arrière coûteux.

Le système final préserve les 3 propriétés critiques
**simultanément** : simplicité terrain, confidentialité inter-session,
scalabilité long terme. Aucune n'est sacrifiée.

### Décisions connexes adoptées

**Format `A247`** (1 lettre + 3 chiffres) plutôt que `AB47` (2 lettres
+ 2 chiffres) :

- Même nombre de caractères à écrire au marqueur (4)
- 10× plus de codes par préfixe (1000 vs 100)
- Incrémentation mentale plus naturelle : lettre fixe, seuls les
  chiffres changent
- Identité temporelle plus forte : « j'étais dans la lettre M à
  l'automne 2027 »

**Bouton « Annuler la réservation »** : si Mika réserve 20 codes et
n'en utilise que 12, il peut annuler les 8 restants. Le pointeur de
l'ancre recule à son état avant la réservation. Zéro gaspillage
systématique.

**Bouton « Code différent »** : si Mika a écrit un code différent de
celui proposé par l'app (erreur, distraction, retour arrière), un
workflow explicite permet de saisir le code réellement écrit. L'app
vérifie l'unicité et journalise l'événement.

**Bouton « Étiquette illisible »** : si le marqueur s'est effacé ou
qu'un pneu a été nettoyé, un bouton génère un nouveau code pour
réétiquetage.

**Verrouillage des ancres en fin de zone** : si une ancre arrive en
fin de sa zone (520 codes consommés), elle se verrouille. Pas de saut
vers une autre zone. Alerte admin si moins de 10 ancres actives.

**Immutabilité des codes voided** : un code annulé ou perdu n'est
jamais réutilisé. Même si un kit est rebuté, son code reste
historiquement lié à ce kit. Pas de réaffectation.

### Patterns de collaboration dans cette section

Cette section est emblématique d'un pattern qui s'est répété pendant
tout le cadrage :

**Pattern A — L'assistant propose une « solution smart »**

L'assistant a tendance à proposer des solutions techniquement
élégantes (codes aléatoires, auto-fill, détection automatique). Ces
propositions s'appuient sur des best practices génériques des
industries SaaS.

**Pattern B — Mika teste contre un cas terrain réel**

Mika ne répond pas à la proposition sur son mérite théorique. Il la
confronte à un cas d'usage précis de son quotidien. Si la proposition
casse ce cas, elle est rejetée — peu importe son élégance.

**Pattern C — L'itération converge vers une solution non-triviale**

La solution finale n'est presque jamais la première proposition de
l'assistant. Elle émerge après 3-5 itérations, souvent avec une
contribution créative de Mika que l'assistant n'avait pas envisagée.

Ce pattern est devenu la dynamique de travail du projet. Il est
**précieux** et doit être préservé pour les futures sessions.

---

## Section 2 — Modèle de données : Kit, Nature, Variantes

> **ADR de référence** : documentation dans `docs/06-modele-donnees.md`
>
> **Le modèle a évolué à travers 4 versions intermédiaires avant
> d'arriver au Modèle 3.5 final.** Chaque version a été écartée à
> cause d'un cas terrain concret que Mika a évoqué.

### Le problème posé

Comment modéliser un « kit de 4 pneus » dans la base de données?

Ça semble trivial. Ce ne l'est pas. Parce que la réalité terrain est
beaucoup plus désordonnée que ce qu'un modèle naïf peut capturer :

- Un lot contient plusieurs kits vendus souvent séparément
- Un kit de 4 pneus peut arriver avec des jantes cosmétiques qui sont
  **parfois** vendues séparément, **parfois** non
- Un kit peut être vendu partiellement (2 pneus sur 4)
- Un kit peut avoir des pneus d'usures différentes (2 à 9mm, 2 à 6mm)
- Certains pneus peuvent être rebutés en cours de route (percés,
  défectueux)
- Un kit peut subir un échange (client retourne 4 pneus, achète 4
  autres)

Chacune de ces situations doit être modélisée **sans refactor** du
jour au lendemain.

### Itération 1 — Modèle 1 : « Tout est kit »

**Proposition** : une seule entité `Kit`, avec un champ
`quantite_pneus` (généralement 4).

**Avantage** : simplicité maximale.

**Le challenge de Mika** : « Et les jantes? Certains lots arrivent sur
jantes cosmétiques alu. Les jantes se vendent parfois avec les pneus,
parfois séparément. Mon modèle doit gérer ça. »

**Verdict** : Modèle 1 insuffisant. Il gère les pneus mais pas les
structures composites.

### Itération 2 — Modèle 2 : « Tout est pneu individuel »

**Proposition de l'assistant** : granularité maximale. Chaque pneu est
une entité. Un kit est juste une collection de pneus.

**Avantage** : flexibilité totale. Chaque pneu peut avoir son propre
statut, sa propre usure, son propre prix.

**Le challenge de Mika** : « Mais je ne fonctionne pas comme ça. Dans
95% des cas, j'étiquette par kit, pas par pneu. Je vends par kit. Je
fais la marge par kit. Si je dois saisir 4 pneus individuels à chaque
fois, c'est 4× plus de temps à chaque étape. »

**Insight** : la granularité technique doit suivre la granularité
métier. Aller plus fin que nécessaire = friction pure.

**Verdict** : Modèle 2 trop granulaire. Inadapté au workflow réel.

### Itération 3 — Modèle 3 : Lot → Kit → Variantes optionnelles

**Proposition (co-construite)** :

- **Lot** : l'acquisition (un achat chez un fournisseur)
- **Kit** : l'unité vendable (4 pneus typiquement)
- **Variante** : subdivision optionnelle, créée seulement quand
  nécessaire

Les variantes n'existent que dans les cas exceptionnels : usure
mixte (2 pneus à 9mm, 2 à 6mm) ou vente partielle (2 vendus, 2
restants).

Dans 98% des cas, un kit n'a pas de variantes. C'est une économie
cognitive importante.

**Cas majoritaire gérable** : un kit de 4 pneus, usure uniforme, vendu
d'un coup. Modèle 3 gère ça avec une seule ligne en base.

**Cas minoritaire gérable** : un kit subdivisé. Modèle 3 gère ça avec
le kit parent + N variantes.

**Premier acceptation** de Mika. Mais il soulève un autre cas.

### Itération 4 — L'insight des jantes cosmétiques détachables

**Challenge de Mika** : « Je dois pouvoir détacher physiquement les
jantes cosmétiques des pneus et les vendre séparément. Comment tu
gères ça dans ton Modèle 3? »

**Exploration** :

- Un kit Nature A (pneus purs) ne pose pas problème
- Un kit avec pneus + jantes cosmétiques attachés doit pouvoir se
  **scinder** en : (1) kit-pneus purs + (2) kit-jantes seules
- Avant scission, les deux composantes partagent la même identité
  physique et la même entrée en base

**Émergence du Modèle 3.5** : ajout d'un attribut `nature` au Kit.

**Trois natures possibles** :

- **Nature A** : pneus purs (ou pneus avec jantes acier
  indissociables)
- **Nature B** : pneus + jantes cosmétiques **attachés** mais
  détachables
- **Nature C** : jantes seules (créées soit par détachement d'un
  Nature B, soit saisies directement — cas rare)

**Action explicite « Détachement »** : transforme un kit Nature B en
deux kits (Nature A + Nature C), avec traçabilité complète dans le
journal d'événements. Le code original est préservé pour historique.

**Verdict** : Modèle 3.5 adopté.

### Ce qui aurait été perdu sans l'insight « jantes détachables »

Si l'assistant était resté sur le Modèle 3 :

- Pas de notion de Nature
- Les kits composites étaient modélisés comme un seul objet
- Détacher les jantes aurait nécessité de **supprimer** le kit
  original et d'en créer deux nouveaux
- Perte de traçabilité (on ne pourrait plus remonter à l'acquisition
  d'origine)
- En cas de vente de jantes seules, impossible d'analyser « combien
  j'ai vendu de jantes cette année » vs « combien de pneus »

**Refactor obligé en Phase B** avec migration douloureuse des données
historiques. Un cas où un insight terrain a évité plusieurs semaines
de refactor futur.

### Cas particulier — Le rebut partiel

**Challenge de Mika** : « Qu'est-ce qu'il se passe si j'achète un kit
et que je découvre après coup que 1 pneu est percé? Je ne vais pas
rebuter tout le kit. »

**Options considérées** :

1. Créer une variante pour le pneu défectueux et la rebuter → lourd
   (nécessite de créer 3-4 variantes pour gérer un seul pneu)
2. Garder le kit en état et modifier `quantite_pneus` → casse
   l'immutabilité
3. **Événement `rebut_partiel`** qui journalise la mise au rebut tout
   en gardant le kit intact — retenu

**Décision** : le kit conserve son identité et ses attributs. Un
événement `rebut_partiel` documente le changement. La quantité
effective restante est calculée dynamiquement depuis l'historique des
événements.

C'est une application du **Principe 9 (immutabilité des faits
engagés)** : le kit original n'est pas modifié. Les changements sont
ajoutés comme événements.

### Journal d'événements parallèle à l'état

**Décision architecturale importante** : le système maintient
**en parallèle** :

- Un **état courant** de chaque entité (pour les requêtes rapides et
  l'affichage)
- Un **journal complet d'événements** (pour la traçabilité et les
  audits)

**Pourquoi pas juste le journal (event sourcing pur)?**

- Performance : recalculer l'état depuis les événements à chaque
  affichage est coûteux
- Complexité : plus difficile à déboguer pour un projet à cette
  échelle
- Utilité marginale : au volume prévu, l'event sourcing pur est du
  sur-dimensionnement

**Pourquoi pas juste l'état (sans journal)?**

- Perte de traçabilité
- Aucun audit possible
- Ne sert pas les principes d'immutabilité

**Option 3 hybride retenue** : état + journal, avec règle que l'état
peut toujours être reconstruit depuis le journal en cas de doute.

### Champs obligatoires MVP

**Décision** : 4 champs sont obligatoires à la saisie d'un kit :

- Marque
- Taille
- Saison
- Usure moyenne (en 32e)

Tous les autres champs (véhicule compatible, notes, photos, prix) sont
**optionnels** au moment de la création.

**Raisonnement** : ces 4 champs sont ceux nécessaires pour qu'un kit
soit **listable et recherchable**. Sans eux, un kit est inutilisable
pour la vente. Avec eux, on a le minimum viable pour gérer le stock.

Tout le reste peut être ajouté progressivement (enrichissement
progressif — une feature inscrite au backlog pour la Phase B).

---

## Section 3 — Immutabilité et actions correctives

> **ADR de référence** : ADR-005, ADR-006
>
> **Cette section a été moins conflictuelle que les autres, parce que
> Mika avait déjà en tête l'importance de ce principe avant que
> l'assistant ne le propose.**

### Le problème posé

Le système manipule des données à impact business et comptable :
ventes, rebuts, prix d'achat, marges. Sans règles explicites
d'intégrité, il existe un risque qu'un utilisateur (même
bien-intentionné) modifie rétroactivement des données engagées,
faussant les analyses et créant des dérives invisibles.

Classique exemple de dérive :

- Mika vend un kit à 400$ en mars
- En avril, il se rend compte qu'il aurait dû le vendre 450$
- Tenté de « corriger » la vente dans l'app à 450$
- Les chiffres de mars sont maintenant faux rétroactivement
- Le dashboard affiche des marges différentes selon le jour de
  consultation
- Impossible d'auditer ce qui s'est vraiment passé

### Itération 1 — Proposition initiale : édition libre partout

**Proposition de l'assistant** : permettre l'édition libre des champs
pour simplifier l'UX. L'utilisateur peut toujours corriger une erreur.

**Le challenge de Mika** : « Non. Une fois qu'une vente est faite,
elle est faite. On ne modifie pas. Si quelque chose a changé, c'est un
nouvel événement, pas une modification de l'ancien. »

Mika a énoncé ici ce qui deviendra le **Principe 9 (immutabilité des
faits engagés)** :

> « Les données représentant des faits historiques engagés (ventes,
> rebuts, détachements, paiements) ne peuvent jamais être modifiées ni
> effacées après leur création. »

**L'insight clé** : Mika a expérience d'outils (comptables, bancaires)
où l'immutabilité est la norme. Il savait déjà que c'est la bonne
pratique. L'assistant a d'abord proposé la simplicité UX, qui s'est
avérée incompatible avec l'intégrité métier.

### Itération 2 — Les 3 états : draft / active / committed

**Proposition** : pas tout doit être immuable. Il y a une différence
entre :

- Une entité **en cours de création** (un kit pas encore étiqueté, une
  vente brouillon) — librement éditable
- Une entité **active** (un kit en stock, une vente récente dans la
  journée) — éditable avec journalisation
- Une entité **committed** (une vente de la semaine dernière, un kit
  vendu) — immuable

**Trois états donc** :

- `draft` — liberté totale
- `active` — modifications autorisées mais journalisées, chaque
  changement crée un événement
- `committed` — aucune modification directe, corrections uniquement
  via actions correctives explicites

**Règle de transition** : les transitions sont unidirectionnelles
(draft → active → committed), **sauf** dans le cas exceptionnel d'une
annulation de vente (un kit committed redevient active quand la vente
est annulée).

### Itération 3 — Les 5 événements post-vente

La question naturelle qui suit est : « Si une vente committed ne peut
pas être modifiée, comment gère-t-on les cas réels où il faut
'corriger' une vente? »

Réponse : **pas en modifiant, mais en ajoutant des événements
correctifs**.

**Cinq événements post-vente sont supportés** :

**1. Annulation de vente (erreur de saisie)**

Mika a coché par erreur « vendu » sur le mauvais kit, ou a attribué la
vente au mauvais client. Les pneus n'ont jamais physiquement bougé.

- Vente originale → statut `annulée`
- Kit revient à `en_stock`
- Pas d'impact financier (pas de vraie transaction)
- Événement journalisé avec raison

**2. Retour complet**

Le client ramène physiquement tout le kit vendu. Remboursement total.

- Vente → statut `retournée`
- Kit revient à `en_stock`
- Remboursement enregistré (impact caisse : -montant)
- Événement journalisé

**Comportement par défaut validé par Mika** : les pneus reviennent
sous leur code original, caractéristiques inchangées. C'est le
**principe des 99% des cas** : la majorité des retours sont sans
dégradation.

**3. Retour partiel**

Le client ramène une partie des pneus (ex: 2 sur 4). Remboursement
proportionnel.

- Création de variantes si pas déjà existantes
- Variante retournée → `en_stock`
- Variante gardée → reste `vendue`

**4. Indemnisation / rabais post-vente**

Client garde tous les pneus mais signale un défaut (usure
sous-estimée, micro-craquelure). Mika accorde un rabais a posteriori.

- Kit reste `vendu`
- Prix de vente effectif ajusté (= prix original - indemnisation)
- Marge nette diminue

**5. Échange**

Client ramène un kit et repart avec un autre. Peut inclure un delta
financier.

- Techniquement : retour + nouvelle vente, liés par référence croisée
- Delta financier : +, -, ou 0

### Itération 4 — Le cas terrain du retour partiel fréquent

**Challenge de Mika** : « Le retour partiel, c'est vraiment rare. Dans
la vraie vie, 99% des retours sont 'j'ai changé d'avis, reprenez le
tout'. Pas besoin de workflow compliqué pour le cas rare. »

**Ajustement** : le workflow de retour par défaut traite le cas simple
(retour complet, remise en stock sans modification). Les cas
compliqués (dégradation partielle, subdivision) sont gérés via
**actions séparées** :

- Rebut partiel (événement distinct, si pneus dégradés au retour)
- Note ajoutée au kit (si observation qualitative)
- Prix de vente ajusté à la remise en vente (si nécessaire)

**Principe émergent** : **« Saisie d'abord, exceptions ensuite »**
(deviendra Principe 10). Le workflow uniforme traite le cas standard.
Les exceptions passent par des actions distinctes, pas par une
complexification du workflow principal.

### Trois niveaux de défense

Pour enforcer l'immutabilité de façon robuste, trois niveaux :

**1. Validation applicative**
Le code de l'app refuse les modifications interdites. Messages
d'erreur pédagogiques : « Ce kit est vendu, modification interdite.
Utilise 'Annulation de vente' si nécessaire. »

**2. Contraintes base de données**
Des triggers SQL bloquent les modifications directes en base, même
via accès admin technique. Défense en profondeur. Si quelqu'un bypass
l'app (via un script, une console Supabase), la base refuse quand
même.

**3. Soft delete systématique**
Aucune donnée n'est jamais effacée physiquement. Toute « suppression »
est un changement de statut (`archive` ou autre). Le journal
d'événements reste intact.

### Ce qui aurait été perdu sans le principe d'immutabilité

Si on avait accepté l'édition libre :

- **Dashboard incohérent** : les chiffres changent rétroactivement
- **Audit impossible** : impossible de savoir qui a modifié quoi et
  quand
- **Migration comptable bloquée** : QuickBooks exige l'immutabilité
  pour l'intégration (Phase C)
- **Conflits entre partenaires** : « j'ai vu 400$ la semaine dernière,
  pourquoi c'est 320$ maintenant? »
- **Perte de confiance** : l'outil devient une source de désordre au
  lieu d'une source de vérité

L'immutabilité est **le principe qui transforme un outil opérationnel
en source de vérité**. Sans lui, l'app n'est qu'un Excel amélioré avec
plus de friction.

---

## Section 4 — Accès ouvert vs permissions granulaires

> **ADR de référence** : ADR-007
>
> **Cette section illustre un pattern récurrent : l'assistant propose
> une approche défensive, Mika la rejette en faveur d'une approche
> adaptée à son contexte réel.**

### Le problème posé

Le système gère plusieurs utilisateurs (Mika + partenaires
occasionnels). Quelle approche pour les permissions?

Deux philosophies s'opposent :

**Philosophie restrictive** : permissions granulaires par rôle. Les
partenaires ne peuvent pas voir les données financières, ne peuvent
pas modifier les prix, ne peuvent pas supprimer. Workflows
d'approbation pour certaines actions.

**Philosophie ouverte** : tout le monde a accès à tout. La protection
repose sur la traçabilité complète et la confiance mutuelle.

### Itération 1 — Proposition initiale : permissions restrictives

**Proposition de l'assistant** : construire un système de rôles dès
le MVP. Rôle propriétaire (Mika, accès complet) + rôle partenaire
(accès limité, pas de données financières, modifications nécessitent
approbation).

**Raisonnement de l'assistant** : standard de l'industrie, protection
préventive, scalabilité (si de nouveaux partenaires arrivent plus
tard).

**Le challenge de Mika** : « Mes partenaires actuels sont des amis
proches. Leur mettre des barrières serait insultant et ralentirait
leur capacité à m'aider. Si je leur demande de faire une inspection
pour moi, je ne veux pas qu'ils soient bloqués par des permissions. »

### Itération 2 — La vraie philosophie de Mika : confiance + traçabilité

**Proposition de Mika** : « Au MVP, tout le monde a accès à tout.
La protection ne vient pas des permissions, elle vient du journal
d'événements. Chaque action est tracée. Si un partenaire fait une
erreur, je le vois dans le journal le soir, on en discute. »

**Les 4 arguments de Mika** :

**Argument 1** — Les utilisateurs actuels sont des amis de confiance.
Mettre des barrières serait insultant.

**Argument 2** — Volume faible permet la surveillance manuelle. Au
volume actuel (~500 items/an), Mika peut consulter le journal le soir
et voir toutes les actions importantes.

**Argument 3** — Les permissions granulaires sont un « MVP killer ».
Implémenter proprement un système de rôles ajoute des semaines de
travail MVP sans valeur tangible au volume actuel.

**Argument 4** — Scalabilité latente. L'architecture d'authentification
et le journal d'événements permettent d'ajouter les permissions plus
tard sans refactor majeur.

### L'acceptation de l'assistant

L'assistant a accepté l'argumentaire, mais a demandé que les
conditions d'activation futures soient **explicitement documentées**
pour ne pas oublier de faire évoluer le système.

**Conditions d'activation des permissions granulaires (Phase B/C)** :

- Ajout d'utilisateurs moins proches (employés recrutés, partenaires
  externes)
- Volume qui empêche la surveillance manuelle par Mika
- Demande légale/comptable de contrôles stricts
- Intégration avec systèmes tiers exigeant séparation des rôles

Ces conditions sont écrites dans ADR-007 et dans le backlog
(`docs/backlog.md`).

### Pourquoi la traçabilité suffit (au MVP)

**Mécanique de protection via traçabilité** :

- Authentification individuelle (pas de compte partagé)
- Chaque action porte l'identité de son auteur
- Chaque modification crée un événement dans le journal
- Le journal est consultable par Mika à tout moment
- L'immutabilité garantit qu'aucune action ne peut être « effacée »

**Conséquence comportementale** : un partenaire sait qu'il est tracé.
Cela suffit généralement à éviter les actions malveillantes. Les
actions accidentelles sont visibles et discutables a posteriori.

### Ce qui aurait été perdu sans cette approche

Si on avait implémenté les permissions granulaires au MVP :

- **Surcoût de développement** : plusieurs semaines pour concevoir et
  tester un système de rôles cohérent
- **Friction partenaires** : amis bloqués par des barrières
artificielles
- **Sur-ingénierie** : résoudre un problème qui n'existe pas encore
- **Retard MVP** : risque que l'app ne sorte jamais à cause de la
  complexité accumulée

La décision « accès ouvert + traçabilité » est un exemple du
**Principe 6 (la technologie suit le besoin réel)** appliqué à la
sécurité. On construit ce dont on a besoin aujourd'hui, avec les
hooks architecturaux pour évoluer demain.

---

## Section 5 — Allocation des coûts d'un lot

> **ADR à créer** : ADR-008 (en attente de rédaction)
>
> **Cette section a initié le Paquet 2 (finances). Elle illustre le
> pattern « solution smart vs solution explicite ».**

### Le problème posé

Mika achète un lot pour un montant total (ex: 1200$ pour 8 kits).
Comment répartir ce prix d'achat sur les 8 kits individuels?

C'est fondamental pour calculer la marge par kit. Sans allocation, on
ne peut pas faire d'analyse financière fine.

Plusieurs stratégies possibles :

1. **Diviser également** : 1200$ / 8 = 150$ par kit
2. **Proportionnel au nombre de pneus** : si certains kits ont 2
   pneus et d'autres 4, répartir en proportion
3. **Proportionnel à la valeur de revente estimée**
4. **Manuel** : Mika alloue chaque kit à la main

### Itération 1 — Proposition initiale : auto-fill intelligent

**Proposition de l'assistant** : allocation automatique par défaut
(proportionnel au nombre de pneus), avec possibilité de modifier
manuellement après.

**Raisonnement** : réduire le temps de saisie. L'utilisateur n'a rien
à faire dans 90% des cas. Il peut override si nécessaire.

**Le challenge de Mika** : « Non. Je ne veux pas que l'app pré-remplisse
des valeurs financières. Si c'est pré-rempli, je risque de valider
sans réfléchir. Pour les champs sensibles (prix, marges, allocations),
je veux faire un choix conscient. »

**Insight clé** : Mika a formulé ce qui deviendra le **Principe 11
(engagement explicite sur données sensibles)** :

> « Pas de pré-remplissage automatique sur les champs à impact
> business ou comptable. L'utilisateur doit faire un acte conscient. »

### Itération 2 — Stratégie 4 hybride : champs vides + boutons raccourcis

**Proposition de Mika** :

- Champs d'allocation **vides** par défaut (pas d'auto-fill)
- **Boutons raccourcis** disponibles si l'utilisateur veut utiliser une
  règle standard :
  - « Diviser également entre kits » (bouton)
  - « Diviser proportionnellement aux pneus » (bouton)
  - « Tout remettre à 0 » (bouton)
- L'utilisateur peut toujours **saisir manuellement** les montants
- **Validation bloquante** : l'app refuse la sauvegarde si la somme
  des allocations ≠ prix total du lot exactement

**Propriétés résultantes** :

- Pas de risque de validation distraite (champs vides obligent à
  réfléchir)
- Raccourcis accessibles pour les cas standards (2 clics au lieu de
  saisir 8 valeurs)
- Contrôle total de l'utilisateur (pas d'opacité)
- Intégrité garantie (somme exacte obligatoire)

### Le choix du défaut « égal entre kits »

**Question sous-jacente** : quand l'utilisateur clique « Diviser », la
division par défaut doit-elle être égale entre kits, ou
proportionnelle aux pneus?

**Argument pour égal entre kits** : un kit est l'unité économique. Un
kit de 4 pneus n'est pas « 2× plus valuable » qu'un kit de 2 pneus
(le marché ne fonctionne pas linéairement).

**Argument pour proportionnel aux pneus** : un kit de 2 pneus coûte
littéralement moitié moins à acquérir.

**Décision de Mika** : égal entre kits. « Un kit est une unité. Je
peux toujours surcharger si je veux. »

### Ce qui aurait été perdu avec l'auto-fill intelligent

Si on avait implémenté l'auto-fill :

- **Validation distraite** : Mika clique « OK » sans vérifier →
  allocations incorrectes en base → marges faussées pendant des mois
- **Illusion de précision** : le chiffre affiché semble « validé » par
  l'utilisateur, mais il ne l'a pas vraiment regardé
- **Difficulté de correction** : après-coup, impossible de distinguer
  les allocations validées consciemment des allocations auto-remplies
- **Violation du principe d'engagement explicite** : les champs
  sensibles méritent un acte conscient

Le « smart » était en fait dangereux. L'« explicite » est plus lent
(2 secondes de plus) mais plus fiable.

### Pattern général : « solution smart » vs « solution explicite »

Cette section illustre un pattern qui s'est répété pendant le cadrage :

**L'assistant propose « smart »** : auto-fill, pré-remplissage,
détection automatique, suggestions.

**Mika préfère « explicite »** : champs vides, boutons d'action,
choix conscients.

Les deux approches ne sont pas équivalentes. « Smart » est plus rapide
mais introduit des risques invisibles. « Explicite » est plus lent
mais plus fiable.

**Pour les champs à impact business**, Mika a systématiquement choisi
« explicite ». Pour les champs sans impact (notes, photos, tags), le
« smart » est acceptable.

Cette distinction devient le **Principe 11**.

---

## Section 6 — Retours au fournisseur (pré-mise-en-stock)

> **ADR à créer** : ADR-009 (en attente de rédaction)
>
> **Un cas que l'assistant n'avait pas prévu, identifié par Mika. Un
> exemple de vérification contre cas terrain qui a ajouté une feature
> au scope MVP.**

### Le problème posé

**Challenge de Mika** : « Qu'est-ce qui se passe si j'achète un lot,
je le ramène à la maison, et en l'inspectant je découvre qu'un kit a
un problème majeur (pneu fissuré, taille fausse par rapport à ce qui
était annoncé)? Je retourne le kit au fournisseur et il me rembourse.
Comment ton modèle gère ça? »

**L'assistant avait manqué ce cas** : jusque-là, le modèle ne prévoyait
que des **retours post-vente** (client qui ramène), pas des **retours
pré-vente** (Mika qui ramène au fournisseur).

### Itération 1 — Événement `retour_fournisseur`

**Proposition** : nouveau type d'événement dans le journal,
`retour_fournisseur`. Déclenché par une action explicite « Retourner
au fournisseur ».

**Effet sur les entités** :

- Le kit concerné → statut `retourne_fournisseur` (soft delete,
  traçable)
- Le kit disparaît de l'inventaire visible
- Le journal garde la trace complète

**Effet financier** : un remboursement partiel est enregistré sur le
lot d'acquisition.

### Itération 2 — La question de la granularité

**Sous-question** : si un kit a 4 pneus et que seul 1 est défectueux,
le fournisseur reprend-il les 4 ou seulement le 1?

**Réponse de Mika** : « En pratique, le fournisseur reprend le kit
entier. Les kits sont vendus en ensemble, retournés en ensemble. Je
ne négocie pas pneu par pneu avec un fournisseur. »

**Simplification** : pas besoin de gérer le retour partiel d'un kit au
fournisseur. Tous les pneus d'un kit sont retournés ensemble, même si
un seul est défectueux.

### Itération 3 — L'impact sur le prix du lot

**Question suivante** : si je retourne un kit au fournisseur pour 200$
de remboursement, est-ce que le prix total du lot diminue de 200$?

**Deux approches possibles** :

**Option A** — Modifier le prix du lot
- Prix lot avant : 1200$
- Après retour : 1000$
- Problème : viole le principe d'immutabilité (prix lot est un fait
  committed dès la première vente)

**Option B** — Garder le prix immuable + calcul dynamique
- Prix lot reste 1200$ (immuable)
- Événement `retour_fournisseur` enregistre le remboursement de 200$
- Le « coût effectif » du lot = prix_achat - remboursements, calculé
  dynamiquement quand nécessaire

**Décision de Mika** : Option B. Cohérent avec le principe
d'immutabilité. Le prix d'achat reste un fait historique engagé. Les
ajustements sont des événements séparés.

### Ce qui aurait été perdu sans ce cas

Si Mika n'avait pas soulevé ce cas :

- **Pas de gestion des retours fournisseur** dans le MVP
- **Refactor requis en Phase B** pour ajouter cette capacité
- **Données historiques polluées** : les kits retournés au fournisseur
  auraient été traités comme des rebuts totaux, faussant les analyses
  de fournisseurs (taux de défauts, fiabilité)

C'est un exemple où le cadrage terrain a ajouté une feature au MVP
**sans scope creep** : la feature était nécessaire, juste pas encore
identifiée.

---

## Section 7 — Principes émergents du cadrage

Plusieurs principes directeurs ont émergé **pendant** le cadrage, pas
en amont. Ils méritent d'être préservés parce qu'ils guident les
décisions futures.

### Les 4 principes initiaux (standards)

Les 5 premiers principes de `docs/01-vision-produit.md` sont des
standards de méthodologie produit :

1. Aucune feature ne ralentit le workflow actuel
2. Scope MVP figé, hors-scope → backlog
3. Données historiques et nouvelles séparées par tiering
4. Architecture modulaire
5. Mobile-first responsive web

Ces principes sont classiques. Tout bon cadrage produit aboutit à
quelque chose de similaire.

### Les 4 principes ajoutés par Mika (distinctifs)

Les principes 6 à 9 sont différents. Ils viennent directement des
challenges de Mika pendant les discussions. Ils encodent des valeurs
spécifiques à son contexte.

**Principe 6 — La technologie suit le besoin réel**

> « Pas de complexité technique pour 'faire mieux' si ça ne sert pas
> un usage concret. »

Origine : rejet des codes opaques K4M au profit du workflow marqueur.
Application : permissions granulaires reportées à Phase B, étiquettes
imprimées reportées à Phase B.

**Principe 7 — Scalabilité latente**

> « Chaque décision technique doit servir le présent tout en ne
> fermant aucune porte vers le futur. »

Origine : révélation de la vision « Amazon du pneu usagé ». Application :
UUID + internal_id en parallèle du display_code (ADR-004), journal
d'événements prêt pour audit comptable (ADR-005), architecture
modulaire (Principe 4 renforcé).

**Principe 8 — Protection des données sensibles**

> « Les champs identifiant unique ne sont jamais éditables en mode
> saisie normale. »

Origine : discussions sur l'édition du display_code. Application :
workflow explicite « Code différent », protection au triple niveau
(app + DB + soft delete).

**Principe 9 — Immutabilité des faits engagés**

> « Les données représentant des faits historiques engagés ne peuvent
> jamais être modifiées ni effacées. »

Origine : Mika avait ce principe en tête dès le départ. Formalisé dans
ADR-005. Application : 3 états (draft/active/committed), événements
correctifs au lieu de modifications directes.

### Principes 10-13 à ajouter

Pendant le cadrage du Paquet 1 et début Paquet 2, quatre nouveaux
principes ont émergé. Ils ne sont pas encore dans
`docs/01-vision-produit.md` mais doivent y être ajoutés.

**Principe 10 — Saisie d'abord, exceptions ensuite**

> « Le workflow standard traite le cas majoritaire. Les exceptions
> passent par des actions séparées, pas par une complexification du
> workflow principal. »

Origine : gestion des retours. Au lieu d'un formulaire de retour
complexe qui gère toutes les variantes, un workflow simple « Retour
normal » + actions séparées (rebut partiel, note, ajustement prix)
pour les cas rares.

**Principe 11 — Engagement explicite sur données sensibles**

> « Pas de pré-remplissage automatique sur les champs à impact
> business ou comptable. L'utilisateur doit faire un acte conscient. »

Origine : allocation des coûts. Champs vides + boutons raccourcis vs
auto-fill.

**Principe 12 — Formulaires d'abord, IA en enrichissement**

> « Les interfaces principales sont des formulaires explicites. La
> voix et l'IA sont des couches optionnelles par-dessus, pas des
> remplacements. »

Origine : discussions sur la saisie vocale. Rejet de l'idée d'une app
« conversationnelle » comme interface principale. La saisie vocale est
une feature d'enrichissement (Phase B, backlog), pas l'interface
principale.

**Principe 13 — Cas standard d'abord (80/20)**

> « Optimiser pour le cas majoritaire. Les cas rares sont supportés
> mais ne dictent pas le design. »

Origine : discussions sur les variantes (98% des kits n'en ont pas),
les retours partiels (rares), les jantes détachables (minoritaires).

### Ces principes forment un système cohérent

Les 13 principes forment un système cohérent, pas une liste
juxtaposée. Plusieurs s'articulent :

- Principe 1 + Principe 6 + Principe 13 = « Ne pas ajouter de
  friction. Construire ce dont on a besoin maintenant, optimiser pour
  le cas standard. »
- Principe 7 + Principe 4 = « Architecture prête à scaler sans refactor. »
- Principe 8 + Principe 9 + Principe 11 = « Les données sérieuses
  méritent un traitement sérieux : protection, immutabilité,
  engagement explicite. »
- Principe 12 + Principe 6 = « L'outil suit le besoin. Pas de
  technologie décorative. »

---

## Section 8 — Patterns de collaboration identifiés

Pendant le cadrage, plusieurs patterns récurrents ont émergé dans la
dynamique entre Mika et l'assistant. Les documenter permet :

1. De reconnaître ces patterns dans les sessions futures
2. D'éviter de retomber dans les pièges identifiés
3. De transmettre à un nouveau contributeur comment bien collaborer
   avec Mika

### Pattern 1 — Assistant : tendance « solution smart »

**Description** : l'assistant a tendance à proposer des solutions
techniquement élégantes mais qui optimisent pour des critères
abstraits (élégance, généralité, best practices) plutôt que pour les
contraintes concrètes du contexte.

**Exemples observés** :

- Codes opaques K4M (confidentialité théorique, workflow terrain
  cassé)
- Auto-fill d'allocation (réduction du temps de saisie, risque de
  validation distraite)
- Permissions granulaires au MVP (sécurité théorique, friction entre
  amis)
- Auto-détection du type d'événement post-vente (UX lisse, perte de
  contrôle)

**Pourquoi ce pattern apparaît** : l'assistant s'appuie sur des
patterns génériques des industries SaaS. Ces patterns sont conçus pour
des contextes généralistes avec des utilisateurs variés. Ils ne sont
pas adaptés aux contraintes spécifiques d'un petit business
opérationnel.

### Pattern 2 — Mika : « solution explicite »

**Description** : Mika préfère systématiquement les solutions où
l'utilisateur fait un **choix conscient** plutôt que d'accepter un
défaut pré-calculé.

**Exemples observés** :

- Champs d'allocation vides + boutons raccourcis (vs auto-fill)
- Workflow « Code différent » explicite (vs édition libre)
- Action « Détachement jantes » explicite (vs détection automatique)
- Boutons « Retour complet / partiel / indemnisation » explicites (vs
  formulaire unique intelligent)

**Rationale de Mika** : pour les actions à impact, la friction minimale
de l'acte conscient est une **feature**, pas un bug. Elle prévient les
erreurs distraites.

**Règle pratique** : pour les champs à impact business, aller vers
l'explicite. Pour les champs sans impact (notes, photos), le smart est
acceptable.

### Pattern 3 — Assistant : « synthèse optimiste »

**Description** : l'assistant a tendance à déclarer qu'un paquet est
« bouclé » ou « validé » alors que des questions importantes restent
ouvertes. Ce pattern apparaît notamment quand plusieurs décisions ont
été prises dans une session et que l'assistant veut passer à la suite.

**Exemples observés** :

- Fin de Paquet 1 déclarée après avoir tranché numérotation +
  immutabilité + événements post-vente, alors que le cas des retours
  fournisseur n'avait pas été discuté
- Début de Paquet 2 présenté comme « les finances sont simples » alors
  que l'allocation de coûts cachait plusieurs sous-questions
- Plusieurs moments où une idée nouvelle a été « notée pour le backlog »
  alors qu'elle méritait d'être discutée en profondeur

**Correction appliquée** : Mika a plusieurs fois forcé un audit
honnête avant de fermer un sujet. « Avant qu'on passe au suivant,
qu'est-ce qu'on n'a pas encore discuté? »

**Règle pratique** : à la fin de chaque paquet, faire explicitement
une section « Questions ouvertes / Cas non traités » avant de déclarer
la clôture.

### Pattern 4 — Mika : « vérification par cas terrain »

**Description** : Mika teste systématiquement les propositions de
l'assistant contre des cas terrain **réels et concrets** tirés de son
quotidien. Pas des cas hypothétiques. Des cas qui se sont vraiment
produits ou qui se produiront inévitablement.

**Exemples observés** :

- Workflow marqueur dehors (vs best practices SaaS)
- Ami-concurrent qui déduit les volumes (vs aléatoire théorique)
- Fournisseur qui reprend un kit défectueux (vs modèle post-vente
  uniquement)
- Jantes cosmétiques détachables (vs kit monolithique)
- Pneu percé découvert après achat (vs état binaire en_stock / vendu)

**Puissance de ce pattern** : chaque cas terrain révèle une
**asymétrie** entre le modèle proposé et la réalité. Quand le modèle
ne peut pas gérer un cas réel fréquent, il est rejeté — peu importe
son élégance théorique.

**Règle pratique** : pour chaque proposition nouvelle, chercher
activement le cas terrain qui pourrait la casser. Si on ne trouve pas,
c'est probablement qu'on n'a pas assez réfléchi.

### Synthèse : le workflow de collaboration qui fonctionne

La dynamique qui a produit les meilleures décisions suit cette
structure :

1. **L'assistant propose** une solution basée sur best practices
2. **Mika challenge** avec un cas terrain concret
3. **L'assistant ajuste** en intégrant la contrainte
4. **Mika valide ou re-challenge** si un nouveau cas apparaît
5. **Itération jusqu'à convergence** sur une solution qui passe tous
   les cas terrain

Ce workflow prend **plus de temps** qu'une décision unilatérale de
l'assistant. Mais il produit des décisions **beaucoup plus robustes**.
Les solutions issues de ce workflow tiennent face à la réalité
opérationnelle.

**Pour les futures sessions** : ne jamais court-circuiter cette
dynamique. Si l'assistant est tenté de « prendre une décision rapide
pour avancer », c'est le signe qu'il faut au contraire ralentir et
demander à Mika un cas terrain.

---

## Section 9 — Vision long terme préservée

Au-delà des décisions techniques du MVP, Mika a exprimé plusieurs
visions long terme pendant le cadrage. Elles méritent d'être
préservées ici, pas pour être implémentées maintenant, mais pour
**rester visibles comme étoiles polaires**.

Ces visions guident les décisions architecturales actuelles (via le
Principe 7 — Scalabilité latente) et rappellent pourquoi le projet
existe vraiment.

### Étoile polaire 1 — « Amazon du pneu usagé »

**Vision** : une plateforme capable de gérer des **centaines de
milliers d'items par an**, avec automatisation poussée, gestion de
stock multi-entrepôts, logistique intégrée.

**Implication actuelle** : aucune décision technique ne doit rendre ce
scénario impossible. Les UUID, le journal d'événements, la séparation
display_code / internal_id — tous ces choix servent cette vision.

**Ce qu'il faut éviter** : refactors massifs dans 3 ans. Chaque choix
aujourd'hui doit tenir dans ce scénario futur.

### Étoile polaire 2 — Système « fool-proof » délégable

**Vision** : Mika doit pouvoir s'extraire de l'opération quotidienne.
Un employé non-spécialiste doit pouvoir utiliser le système sans
formation extensive. Tous les écrans doivent passer le test
« apprenable en 15 minutes ».

**Implication actuelle** : chaque écran, chaque workflow, chaque
message d'erreur est conçu comme si un nouvel employé allait
l'utiliser demain matin sans formation. C'est un filtre de qualité
implicite sur tout le design.

**Ce qu'il faut éviter** : les workflows qui nécessitent du « tribal
knowledge ». Chaque choix doit être documenté dans l'app elle-même
(tooltips, messages contextuels).

### Étoile polaire 3 — Assistant prédictif de pricing

**Vision** : un acheteur (pas forcément Mika, pourrait être un employé
ou un partenaire) se présente chez un fournisseur. Il prend une photo
d'un lot de pneus. L'app lui suggère un prix d'achat **raisonnable**
basé sur :

- L'historique de ventes de tailles/marques similaires
- La saisonnalité
- L'usure estimée
- Le temps de vente prévisionnel

**Raison d'être** : permettre à des acheteurs **moins experts** que
Mika de négocier intelligemment. Scale l'expertise de Mika.

**Phase** : Phase C, Module 7 (Assistant IA).

**Prérequis** : suffisamment de données app_native (minimum 12 mois).

### Étoile polaire 4 — Portail d'estimation à distance

**Vision** : un vendeur externe (quelqu'un qui veut vendre ses pneus)
utilise un portail web pour soumettre des photos et mesures de ses
pneus. Le portail renvoie une estimation automatique. Si l'estimation
est acceptée, rendez-vous pris pour ramassage.

**Raison d'être** : inverser le flux commercial. Au lieu que Mika
cherche des lots, les lots viennent à lui.

**Phase** : Phase C ou D. Dépend de la maturité du Module 7.

### Étoile polaire 5 — Saisie vocale omniprésente

**Vision** : dans de nombreux points du workflow (saisie terrain,
inspection, mise à jour), l'utilisateur peut parler au lieu de saisir.
La voix est transcrite (Whisper) et les données structurées extraites
(Claude API).

**Raison d'être** : workflow terrain dans des conditions difficiles
(extérieur, mains sales, mobilité). La saisie vocale élimine la
friction clavier.

**Phase** : Phase B.

**Principe retenu** : la saisie vocale est une **couche optionnelle
par-dessus** les formulaires. Pas l'interface principale. Les
formulaires restent le fallback universel (Principe 12).

### Étoile polaire 6 — Libération de Mika

**Vision ultime** : Mika n'opère plus le business au quotidien. Il
supervise, décide la stratégie, mais l'exécution est automatisée ou
déléguée.

**Métrique** : Mika peut partir en vacances une semaine sans que le
business ralentisse.

**Implication** : toutes les décisions du projet doivent répondre à la
question « est-ce que ça rapproche Mika de cette vision? ». Les
fonctionnalités qui augmentent sa charge cognitive (même si elles
ajoutent de la valeur) sont suspectes.

---

## Section 10 — Questions ouvertes à date

Cette section capture les sujets qui ont été **soulevés mais pas
tranchés** pendant le Paquet 1 et début Paquet 2. Ils ne doivent pas
être oubliés.

### Q1 — Initiation d'achat / Work Order (Paquet 3 ou 4)

**Contexte** : quand Mika identifie un lot potentiel, il y a une phase
de négociation qui peut durer plusieurs jours. Pendant cette phase :

- Les codes peuvent être réservés (étiquetage anticipé pour démo)
- Le lot n'est pas encore physiquement possédé
- Des statuts « en prospection », « en négociation » pourraient être
  utiles

**Dimensions à tracker** : financière (engagements, acomptes),
physique (localisation des pneus), géographique (chez le fournisseur,
en transit, chez Mika), rôles (qui a négocié, qui va ramasser).

**À discuter** : Paquet 3 (données historiques) ou Paquet 4 (mécaniques
de vente).

### Q2 — Liste exhaustive des champs sensibles (Principe 8)

**Contexte** : le Principe 8 s'applique aux « champs identifiants
uniques et à impact business ». Mais cette liste n'est pas formalisée.

**À formaliser** : liste précise des champs concernés. Exemples
probables : display_code, prix_achat, prix_vente, marge_allouée,
lot_id, date_vente.

**À discuter** : avant développement du MVP.

### Q3 — Rendez-vous clients liés aux items (Paquet 4)

**Contexte** : quand un client demande à essayer des pneus, il y a un
rendez-vous. Ce rendez-vous pourrait être lié à l'item dans l'app.
Cela ouvre la porte au Module 6 (CRM).

**À discuter** : Paquet 4 (mécaniques de vente).

### Q4 — Stack technique détaillée (doc manquant)

**Contexte** : le fichier `docs/09-stack-technique.md` est référencé
dans `CLAUDE.md` mais n'existe pas actuellement dans le repo.

**À faire** : soit créer le fichier, soit retirer la référence.

### Q5 — Incohérences à corriger dans docs/02-personae-utilisateurs.md

**Contexte** : ce document mentionne actuellement :

- « IDs opaques K4M, M7P » → **PÉRIMÉ** (voir ADR-004 : format A247
  avec 50 ancres)
- « Rôles utilisateurs dès le MVP, masquage données financières
  partenaires » → **PÉRIMÉ** (voir ADR-007 : accès ouvert au MVP)

**À faire** : mettre à jour `docs/02-personae-utilisateurs.md` pour
refléter les décisions des ADR-004 et ADR-007.

### Q6 — ADR à créer

Trois ADR supplémentaires sont à rédiger à partir des décisions déjà
prises mais pas encore formalisées :

- **ADR-008** : Allocation des coûts d'un lot (Stratégie 4 hybride —
  Section 5 de ce document)
- **ADR-009** : Retours au fournisseur pré-mise-en-stock (Section 6
  de ce document)
- **ADR-010** : Architecture conversationnelle hybride (voix/IA en
  couches optionnelles par-dessus les formulaires — Principe 12)

---

## Section 11 — Paquets restants

**Paquet 2 (finances)** — partiellement entamé.
- Question A (allocation coûts) : **tranchée** — Section 5
- Question B (marges) : en attente
- Question C (pricing vente) : en attente
- Question D (cas particuliers) : en attente

**Paquet 3** — données historiques.
- Import du legacy Excel
- Gestion du tiering (ADR-002 déjà validé)
- Migration des codes legacy (1A, V01) vers le nouveau système

**Paquet 4** — mécaniques de vente.
- Rendez-vous clients
- Canaux de vente
- Négociation

**Paquet 5** — utilisateurs / permissions.
- Largement tranché par ADR-007 (accès ouvert au MVP)
- Reste à définir le workflow d'onboarding d'un nouveau partenaire

**Paquet 6** — dashboard.
- Déjà cadré dans `docs/05-dashboard.md`
- Reste à préciser les widgets exacts de chaque sous-dashboard

**Paquet 7** — validation finale MVP.
- Revue complète avant développement
- Définition des critères d'acceptation

---

## Épilogue — Pourquoi ce document a été écrit

Ce document a été écrit à la demande de Mika, qui s'inquiétait de
perdre **le raisonnement** derrière les décisions si seul un sommaire
technique était conservé.

Son intuition était juste. Les ADR capturent les décisions, mais pas
le chemin. Le chemin contient :

- Les alternatives écartées (pour ne pas les reproposer)
- Les cas terrain qui ont fait la différence
- Les patterns de pensée qui guident les décisions
- La vision long terme qui justifie les choix actuels
- Les erreurs évitées grâce aux challenges répétés

**Ce document est la mémoire narrative du projet.**

Il doit être mis à jour à la fin de chaque paquet (Paquet 2, 3, etc.)
pour préserver le raisonnement au fil des décisions. Un paquet qui se
termine sans section ajoutée ici est un paquet dont l'intelligence est
partiellement perdue.

Il doit être **lu en début de chaque session** par tout nouveau
contributeur (humain ou IA) pour charger le contexte. Pas juste les
ADR. Les ADR disent quoi faire. Ce document dit **pourquoi**.

---

**Version** : 1.0 (Paquet 1 complété, début Paquet 2)
**Dernière mise à jour** : 2026-04-23
**À mettre à jour à** : fin de chaque paquet suivant
