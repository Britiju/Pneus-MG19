# Apprentissages au fil de l'eau du prototype stealth

Ce fichier accumule les apprentissages issus de l'expérimentation du prototype d'apprentissage stealth (voir `apprentissage-stealth-test.md` pour le cadrage). Il distingue explicitement quatre niveaux :

- **Faits empiriques validés** : observations confirmées par expérimentation directe
- **Dettes techniques reconnues** : ce qui n'a pas pu être résolu et la piste pour plus tard
- **Propositions issues du design** : idées non encore confirmées, à tester par usage
- **Vision** : pistes à plus long terme, pas planifiées maintenant

Cette discipline évite de fixer prématurément dans le projet des conventions qui n'ont pas été validées par la pratique.

---

## Section 1 — Découvertes techniques Marketplace (faits)

Observations validées lors du développement du script Tampermonkey v0.7.

### Structure du formulaire en deux phases

Le formulaire de création d'annonce Marketplace charge ses champs en deux temps :

- **Phase 1 (formulaire vierge)** : 8 labels visibles — Titre, Prix, Catégorie, État, Description, plus 3 labels vides (probablement réservés à l'upload des photos et à des contrôles internes)
- **Phase 2 (après choix de catégorie)** : 12 labels — ajout de Disponibilité, Identifications de produits, UGS, Lieu

Implication : la stratégie de remplissage doit faire choisir la catégorie en premier, puis remplir les autres champs dans un second temps. Ce qu'impose le script v0.7 (l'utilisateur choisit la catégorie manuellement avant de cliquer le bouton Remplir).

### Champs auto-remplissables identifiés

Cinq champs ont été automatisés avec succès :

- **Titre** : input text, lecture par le label voisin "Titre"
- **Prix** : input text, lecture par le label voisin "Prix"
- **Description** : textarea, lecture par le label voisin "Description"
- **UGS** : input text, label "UGS" (équivalent SKU). Champ officiel pour la référence interne du kit (ex: T01-01)
- **Lieu** : input text avec autocomplétion. Le script remplit puis simule flèche bas + Entrée pour valider la suggestion

### Catégorie et État : structures différentes

- **Catégorie** : panneau de navigation (pas un dropdown ARIA), sans `aria-haspopup`. Probablement un panneau qui slide ou remplace le formulaire
- **État** : vrai dropdown ARIA avec `aria-haspopup="listbox"`. Plus simple à automatiser en théorie

### Quatre valeurs exactes du dropdown État

Le dropdown État de Marketplace propose exactement quatre valeurs :

- Neuf
- D'occasion – Comme neuf
- D'occasion – Bon état
- D'occasion – Assez bon état

À utiliser exactement ainsi (avec le tiret cadratin `–`, pas un trait d'union) si automatisation future du dropdown.

### Blocage console Facebook

Facebook affiche un avertissement "Arrêtez!" et désactive `console.log` côté utilisateur dans la DevTools, comme protection anti-fraude. Tampermonkey contourne ce blocage parce qu'il s'exécute dans son propre contexte isolé. Conséquence pour le diagnostic : il faut intégrer les outils de debug dans le script lui-même (boutons diagnostic), pas se reposer sur des commandes manuelles dans la console.

### Comportement label dynamique

Quand une valeur est sélectionnée dans un dropdown, le label est concaténé avec la valeur dans le DOM. Exemples observés :
- Label après sélection Catégorie : "CatégoriePièces automobiles"
- Label après sélection État : "ÉtatD'occasion – Comme neuf"

C'est un mécanisme de Facebook pour afficher la valeur actuelle. Utile pour détecter qu'un dropdown a déjà été rempli.

### Liste complète des 12 labels (formulaire post-catégorie)

Pour référence future :
1. (vide)
2. (vide)
3. Titre
4. Prix
5. Catégorie + valeur sélectionnée
6. État
7. Description
8. Disponibilité + valeur sélectionnée
9. Identifications de produits
10. UGS
11. Lieu
12. (autres)

---

## Section 2 — Dette technique : dropdowns Catégorie + État (à reprendre plus tard)

### Ce qui a été essayé

Versions v0.5 et v0.5.1 du script ont tenté d'automatiser les dropdowns Catégorie et État. Approches testées :
- Cliquer sur le dropdown via le label voisin
- Attendre que le popup apparaisse
- Chercher l'option par texte dans le DOM
- Cliquer sur l'option

### Pourquoi ça n'a pas marché

Le mécanisme principal de blocage observé : **le clic sur le bouton de diagnostic du script ferme le popup avant que le diagnostic puisse capturer son contenu**. Facebook interprète tout clic en dehors du popup comme "fermer le popup". Donc le script ne peut pas observer la structure du popup pour s'y adapter.

Pour Catégorie spécifiquement, complexité supplémentaire : ce n'est pas un dropdown ARIA standard mais un panneau de navigation, probablement à plusieurs niveaux (catégorie parente puis enfant).

### Piste pour la prochaine itération

Plutôt qu'un clic synchrone sur un bouton diagnostic, utiliser un **timer post-clic** : l'utilisateur clique sur le dropdown manuellement, le script déclenche un diagnostic 3 secondes plus tard automatiquement, le temps que le popup soit chargé et stable. Le diagnostic capture alors le contenu réel du popup ouvert.

Une fois la structure connue, on peut écrire le code de remplissage avec les bons sélecteurs.

### Déclencheur pour reprendre

Si après usage réel les 2 clics manuels (Catégorie + État) deviennent l'irritant principal du flow, ouvrir une session dédiée pour automatiser proprement avec la stratégie timer post-clic. Sinon, garder en l'état : l'effort d'automatisation pourrait dépasser le gain de temps réel.

---

## Section 3 — Protocole photo validé empiriquement (faits)

Ce protocole a été validé sur 3 kits de pneus de calibration en avril 2026.

### Ce qui marche

- **Lumière naturelle ambiante** suffit (extérieur jour nuageux, ombre de mur). Pas besoin de flash, pas besoin de lumière artificielle
- **Coup de wipe** sur le flanc avant la photo : élimine la poussière qui réduit le contraste sur les inscriptions gravées en relief
- **Cadrage adapté à la zone d'intérêt** :
  - Photo flanc large : marque + modèle + dimensions visibles dans le cadre
  - Photo DOT rapprochée dédiée : la séquence DOT complète (11 caractères) doit tenir dans le cadre, particulièrement les 4 derniers chiffres qui donnent semaine et année

### Ce qui dégrade la lecture

- **Flash** : crée des reflets brillants sur le caoutchouc noir, aplatit les reliefs gravés. Avec flash, la lecture est moins fiable qu'en lumière naturelle
- **Cadrage trop large sur le DOT** : la séquence devient illisible. Le DOT mérite sa propre photo rapprochée
- **Photo unique pour tout** : impossible d'avoir à la fois marque/dimensions et DOT lisibles dans une seule photo

### Validation empirique

Sur les 3 kits testés (Yokohama Avid Ascend GT 225/60R18 100H, Bridgestone Turanza LS100 235/40R19 92V, Sailun Inspire 235/65R18 106H) :

- **Première série de photos** : flash, cadrage large, sans wipe → marque/dimensions devinées avec faible confiance, DOT illisible
- **Deuxième série** : sans flash, après wipe, photo DOT rapprochée → marque/modèle/dimensions lus à 100%, DOT lu correctement quand le cadrage englobait les 4 chiffres date finale

---

## Section 4 — Capacités IA de lecture validées (faits)

Test de la capacité de Claude (Opus 4.7) à lire les inscriptions sur des flancs de pneus à partir de photos optimisées selon le protocole de la Section 3.

### Ce qui se lit fiablement

- **Marque** : 100% des cas (Yokohama, Bridgestone, Sailun lus correctement)
- **Modèle** : 100% des cas avec photo flanc claire (Avid Ascend GT, Turanza LS100, Inspire)
- **Dimensions** : 100% des cas avec photo flanc claire (225/60R18 100H, 235/40R19 92V, 235/65R18 106H)
- **DOT** : lisible quand la photo dédiée englobe la séquence complète. Variations de format observées (DOT 4UHD 6HF 2323, DOT EU5371 17X 18L10A, DOT 05Y JDPTLY)

### Limite identifiée

Quand la photo DOT coupe avant les 4 chiffres date finale, la date de fabrication est perdue. C'est une limite de cadrage, pas d'IA — les chiffres sont là sur le pneu, juste pas dans le cadre.

### Implication pour la Feature 2 du prototype

Quand Patrick implémentera la reconnaissance auto via API Claude, il peut s'attendre à une lecture fiable de marque/modèle/dimensions. Pour le DOT, il devra :
- Soit imposer une photo dédiée (et signaler l'erreur si la séquence est incomplète)
- Soit accepter qu'une partie des kits ait un DOT manquant et permettre la saisie manuelle de complément

---

## Section 5 — Propositions issues du design de cette session (à valider par usage)

Ces propositions ont émergé lors de la session de design d'avril 2026. Elles sont **conceptuelles**, pas validées par expérimentation. Une session d'ajustement de flow viendra après 2-3 vrais lots testés pour les valider, les réviser ou les abandonner.

### 5.1 Nombre de photos variable + étiquette comme délimiteur

**Proposition** : remplacer le nombre fixe de 6 photos par kit (cadrage Paquet 6) par un nombre variable, avec la **dernière photo systématiquement = étiquette d'identification** comme délimiteur entre kits.

**Pourquoi** : certains kits nécessitent 5 photos, d'autres 6+ (vue de dos pour bolt pattern, défaut, etc.). Forcer un nombre fixe ajoute de la friction sans valeur. L'étiquette reconnaissable par l'IA (texte alphanumérique court type T01-01) sert de délimiteur.

**Risques identifiés** :
- Photos manquantes pourraient passer inaperçues (par opposition à un schéma fixe où un fichier manquant est détectable). Mitigation possible : audit IA par kit qui signale les infos manquantes.
- Détection de l'étiquette doit être fiable. Mitigation : convention claire pour les étiquettes (fond blanc, texte court, format standardisé).

**Status** : à valider lors du test V1 prévu.

### 5.2 Étiquetage à la demande (étiquettes vierges écrites au début du lot)

**Proposition** : au lieu d'écrire au marqueur sur sticker pour chaque kit individuellement, Mika place les pneus en piles, wipe le premier de chaque pile, compte les kits, puis écrit toutes les étiquettes en un coup avant de commencer les photos.

**Workflow proposé** :
1. Pneus arrivent, placés en piles par kit
2. Wipe du premier pneu de chaque pile (confirmation visuelle de cohérence du kit)
3. Comptage : "12 kits dans ce lot"
4. Demande à l'app le numéro de lot (futur Module 4)
5. Écriture de 12 étiquettes (T05-01 à T05-12)
6. Application des étiquettes sur chaque kit
7. Début des photos

**Pourquoi** : préparation à la juste quantité (pas de surplus, pas de manque), démarrage rapide, geste minimal sur le terrain par rapport à écrire le code complet kit par kit pendant la session photo.

**Status** : conceptuel uniquement. Pour le test V1, on garde le système initial du Paquet 6 (sticker + marqueur + code complet, kit par kit) pour ne pas mélanger les variables.

### 5.3 Format `_annonce.txt` clé-valeur

**Proposition** : un seul fichier texte par kit, format clé-valeur, avec les 5 champs auto-remplissables du script Tampermonkey (TITRE, PRIX, LIEU, UGS, DESCRIPTION).

**Status** : utilisé dans le script v0.7 et fonctionnel sur formulaire. Pas encore testé en publication réelle. Le cadrage Paquet 6 mentionnait deux fichiers séparés (titre.txt + description.txt). La proposition d'un fichier unique sera tranchée à l'ajustement de flow.

### 5.4 Convention dossier plat avec sous-dossier `_meta/`

**Proposition** : un dossier par lot, fichiers de tous les kits à plat dans le dossier (avec préfixe pour groupement alphabétique), stickers d'identification dans un sous-dossier `_meta/` séparé.

```
Lot_T01_Tremblay_20260428/
├── T01-01_1.jpg
├── T01-01_2.jpg
├── ...
├── T01-01_etiquette.jpg
├── T01-01_annonce.txt
├── T01-02_1.jpg
├── ...
└── _meta/
    └── (stickers d'identification archivés)
```

**Pourquoi par rapport au cadrage Paquet 6** : le cadrage initial proposait un dossier par kit avec sous-dossier `_identification/`. L'expérience pratique (sélection multiple drag-drop dans Marketplace) suggère qu'un dossier plat est plus efficace : pas de navigation entre dossiers, sélection au clavier (Click photo 1 + Shift+Click photo N) plus rapide.

**Status** : proposition non validée. Le test V1 utilisera cette structure pour la valider ou la réviser.

---

## Section 6 — Test V1 prévu (intention immédiate)

**Objectif** : valider la chaîne photos → analyse IA → renommage → génération `_annonce.txt` → drag-drop Marketplace, **en mode calibration sans publication**.

**Périmètre minimal** :
1. Mika sélectionne les photos d'un kit dans la pellicule de son cell (3 kits de calibration disponibles)
2. Upload dans une conversation Claude
3. Claude analyse, suggère un nom de fichier par photo selon convention proposée, génère le contenu de `_annonce.txt`
4. Mika renomme manuellement les fichiers, crée le `_annonce.txt` dans un dossier local ou Drive
5. Mika ouvre Marketplace, choisit Catégorie + État manuellement, glisse les photos sur la zone photos, glisse le `.txt` sur le bouton Tampermonkey
6. Vérification que les 5 champs sont bien remplis
7. **Pas de publication** : fermeture du formulaire après vérification

**Ce que ça valide** :
- Capacité de l'IA à lire fiablement les pneus avec le protocole photo
- Format du `_annonce.txt` accepté par Marketplace
- Convention de fichiers proposée (Section 5.4)
- Protocole photo (Section 3)

**Ce que ça ne valide pas** :
- Convention d'étiquetage à la demande (Section 5.2) : système Paquet 6 utilisé
- Volume Facebook : pas de publication
- Workflow batch sur 30+ kits : test sur 1-3 kits uniquement

---

## Section 7 — Anti-patterns à valider par usage (hypothèses)

Ces anti-patterns ont été identifiés conceptuellement mais ne sont pas confirmés empiriquement.

### 7.1 Volume Facebook — limite de publications par jour

**Hypothèse** : Facebook limite le nombre d'annonces qu'un compte peut publier dans un laps de temps. Les seuils observés par d'autres utilisateurs (non confirmés officiellement) :
- Compte normal : 5-10 annonces par jour avant warning
- Compte vendeur établi : 20-30 annonces par jour
- Au-delà : risque de shadowban (annonces invisibles aux autres) sans notification

**Status** : à observer pendant l'usage réel par Mika avec le compte productif. Respecter prudence (10-15 annonces/jour étalées).

### 7.2 Macros AutoHotkey système

**Hypothèse** : automatiser le navigateur avec des outils système (clics simulés à coordonnées X/Y, simulation clavier OS) augmente le risque de détection bot par Facebook (mouvements souris en ligne droite, timings réguliers, patterns identifiables).

**Status** : non testé. Documenté comme anti-pattern conceptuel — le script Tampermonkey reste dans le navigateur (moins détectable) et c'est l'approche retenue.

### 7.3 Automatisation Catégorie/État

**Hypothèse** : automatiser les dropdowns Catégorie et État est techniquement faisable mais coûteux à maintenir (interface React de Facebook change fréquemment).

**Status** : voir Section 2. À reconsidérer si les 2 clics manuels deviennent l'irritant principal du flow après usage réel.

---

## Section 8 — Vision : pistes à reprendre plus tard

Idées émergées lors de la session de design qui dépassent le périmètre du prototype actuel mais méritent d'être consignées pour ne pas être perdues. Aucune n'est planifiée à ce stade.

### 8.1 Test V2 — intégration cell-Drive avec lot+vendeur attribués à la prise

**Idée** : sur le cell, au moment de prendre les photos, l'app permet d'assigner un lot et un vendeur. Les photos sont automatiquement synchronisées dans le bon dossier Drive avec le bon préfixe de nommage. Plus de transfert manuel après la prise.

**Pourquoi pertinent** : élimine une étape complète du flow (transfert cell → ordi → renommage). Mika m'a dit : *"Si je pouvais prendre mes photos, l'assigner à un lot et un client à même ma pellicule sur mon cell, ce serait déjà incroyable."*

**Pas planifié maintenant** : complexité technique non triviale (probablement PWA ou app native interagissant avec la pellicule). Distraction du test V1 simple.

**Déclencheur pour reprendre** : après le test V1 validé, ouvrir une session de design dédiée à cette intégration.

### 8.2 Méthodologie de tests à l'aveugle réutilisables

**Idée** : pouvoir tester périodiquement les capacités de l'IA sur un référentiel stable de kits de calibration, sans biais de mémoire de conversation.

**Approche envisagée** : nouvelle conversation Claude à chaque test (la mémoire est désactivée), upload des kits de calibration, comparaison du résultat avec une vérité-terrain documentée, accumulation longitudinale dans `apprentissages-stealth-test.md`.

**Pourquoi pertinent** : pour la Feature 2 (reconnaissance auto par API Claude) en Phase B, Patrick aura besoin de données comparatives sur la performance de l'IA dans le temps pour calibrer ses prompts.

**Pas planifié maintenant** : pas urgent tant que le pipeline V1 n'est pas validé. Pas pertinent comme première activité.

**Déclencheur pour reprendre** : quand Patrick commencera le cadrage du Module 4 et de la Feature 2 en Phase B.

### 8.3 Compte Facebook fictif pour stress-testing du volume

**Idée** : créer un compte Facebook fictif distinct pour tester les limites de volume (50+ annonces/jour) sans risquer le compte productif de Mika. Si le compte fictif se fait bannir, c'est son rôle ; le compte productif reste intact.

**Pourquoi pertinent** : le compte productif est un canal de vente actif. Mesurer où sont les vraies limites de Facebook (warning, shadowban, ban) sur le compte productif est trop risqué.

**Pas planifié maintenant** :
- Trop tôt : le flow normal n'a pas été testé en conditions réelles. Pas besoin de stress-tester avant d'avoir une baseline.
- Création d'un compte fictif crédible non-triviale (Facebook lutte contre les comptes multiples).
- Les limites prudentes (10-15/jour) sont validables sur le compte productif sans risque.
- Risque de violation des CGU Facebook à assumer.

**Déclencheur pour reprendre** : quand Module 5 (Listing automatique) entrera en cadrage en Phase B et qu'il faudra valider précisément les seuils anti-bot.

### 8.4 Continuité d'activité — re-création rapide d'un compte vendeur

**Idée** : capacité de republier rapidement N annonces existantes sur un nouveau compte Facebook, en cas de bannissement du compte productif.

**Pourquoi pertinent** : le compte productif peut être banni pour de multiples raisons (volume, contenu, fausse alerte). Sans capacité de re-création rapide, Mika perd plusieurs jours/semaines à reconstruire son inventaire actif sur un nouveau compte. Avec capacité de re-création rapide, l'impact est minimisé.

**Implication architecturale** : Marketplace ne doit pas être source de vérité. Le système (Excel maître, Drive, futures features de pneus-MG19) doit tracker explicitement quelles annonces sont actives sur Marketplace à un moment donné, pour pouvoir les republier en lot.

**Pas planifié maintenant** : c'est un élément architectural du Module 5 (Listing automatique) en Phase B, pas du prototype stealth.

**Déclencheur pour reprendre** : lors du cadrage du Module 5 en Phase B, intégrer ce cas d'usage comme exigence ("republier rapidement N annonces existantes sur un nouveau compte").

### 8.5 Bonification du dataset pour canaux additionnels

**Idée** : le travail fait pour Marketplace (photos optimisées, descriptions structurées, métadonnées propres) peut alimenter d'autres canaux que Marketplace :
- Site web vitrine de consultation (B2B : garagistes, recycleurs, pneus en gros)
- Site web transactionnel (achat direct hors Marketplace)
- Autres marketplaces (Kijiji, LesPAC, etc.)

**Pourquoi pertinent** :
- Justifie l'investissement actuel : le travail pour Marketplace n'est pas perdu si le canal pivote
- Informe le format des données stockées : photos haute résolution, descriptions complètes, métadonnées riches (pas juste ce que Marketplace consomme)
- Suggère une trajectoire long terme : site web pourrait être Phase C ou D du projet

**Pas planifié maintenant** : prématuré tant que le canal Marketplace n'est pas stabilisé.

**Déclencheur pour reprendre** : quand le volume de ventes Marketplace deviendra prévisible et que la capacité de production dépassera le canal C2C, ouvrir un cadrage de canal B2B.

---

## Index des sessions futures anticipées

Cette liste recense les sessions futures déclenchables. Pas de date — chacune a son propre déclencheur logique.

1. **Session d'ajustement de flow** : après 2-3 vrais lots testés. Trancher sur les propositions de Section 5 (étiquetage à la demande, convention dossier, format `.txt`).
2. **Session de design Test V2** : après validation du Test V1. Concevoir l'intégration cell-Drive (Section 8.1).
3. **Session de cadrage Module 4 et Feature 2** : en Phase B. Activer la méthodologie de tests à l'aveugle (Section 8.2).
4. **Session de cadrage Module 5** : en Phase B. Intégrer la continuité d'activité (Section 8.4).
5. **Session de cadrage canal B2B** : Phase C ou D. Activer la bonification du dataset (Section 8.5).
6. **Session compte fictif** : déclenchée par cadrage Module 5 si validation des seuils anti-bot devient nécessaire (Section 8.3).
7. **Session reprise dette dropdowns** : si les 2 clics manuels Catégorie+État deviennent l'irritant principal après usage réel (Section 2).

---

## Historique des entrées

- **Avril 2026** : création du fichier suite à la session de design technique (script Tampermonkey v0.7 développé en session AI tierce + calibration vision IA sur 3 kits + design du flow d'étiquetage et du Test V1).
