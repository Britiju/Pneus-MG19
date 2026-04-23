# ADR-004 — Système de numérotation des kits

## Statut

Acceptée — Phase 1 de cadrage, audit approfondi Paquet 1.

## Contexte

Le système doit générer des identifiants pour chaque kit vendable.
Cette décision est structurante car les identifiants sont utilisés :

- Physiquement (écrits au marqueur sur les pneus)
- Dans les conversations (clients, partenaires)
- Dans l'app (recherche, navigation)
- Dans l'historique (traçabilité perpétuelle)

Le système doit respecter plusieurs contraintes parfois contradictoires :

1. **Workflow terrain de Mika** : étiquetage dehors avec un marqueur,
   sans consulter l'app en permanence, incrémentation mentale possible
2. **Confidentialité des volumes** : les partenaires occasionnels ne
   doivent pas pouvoir déduire le volume total du business depuis les
   codes visibles
3. **Scalabilité** : prêt pour la vision "Amazon du pneu usagé"
   (centaines de milliers d'items par an à terme)
4. **Robustesse** : pas de doublons, pas de collisions, pas de
   corruption
5. **Cohabitation avec le legacy** : 607 enregistrements historiques
   avec 2 conventions différentes (1A/2B/3C en 2025, V01/V02 en 2026)

## Décision

Un système à **trois niveaux** d'identifiants :

### Niveau technique (invisible)

- **UUID** : identifiant global unique, standard RFC 4122, pour
  intégrations futures et échanges inter-systèmes
- **internal_id** : entier auto-incrémenté, pour performance et
  jointures

### Niveau affichage (visible)

- **display_code** : format `A247` (1 lettre + 3 chiffres concaténés,
  4 caractères visuels)
- Palier 1 : 26 000 codes uniques possibles

### Mécanique de génération

**50 ancres réparties uniformément** dans l'espace des 26 000 codes
(une ancre tous les ~520 codes).

**Réservation d'une plage** :

1. Mika demande N codes (typiquement 10-50)
2. L'app choisit au hasard une ancre parmi celles ayant assez
   d'espace restant dans leur zone
3. L'app renvoie la plage `pointeur_courant` à
   `pointeur_courant + N - 1`
4. Le pointeur de l'ancre avance de N
5. Si l'ancre arrive en fin de zone, elle se verrouille

**Propriétés résultantes** :

- **Intra-plage** : codes consécutifs (incrémentation mentale de Mika
  préservée)
- **Inter-plage** : positions visuellement aléatoires (confidentialité)
- **Zéro gaspillage** : fragmentation minimale
- **Bouton "Annuler la réservation"** disponible (remet le pointeur à
  son état précédent si Mika n'a pas encore utilisé la plage)

### Gestion des erreurs

**Workflow "Code différent"** (Solution 1+ sécurisée) :

- Par défaut, Mika accepte le prochain code proposé
- Bouton explicite "Code différent" s'il a écrit un code différent sur
  le pneu
- Note optionnelle pour documenter
- Validation d'unicité en base
- Journalisation complète de l'événement

**Bouton "Étiquette illisible"** :

- Génère un nouveau code dans la plage actuelle
- Mika réétiquette physiquement plus tard
- Événement journalisé

### Règle d'immutabilité

- Un code **n'est jamais réutilisé**, même si voided
- Un code rebuté garde son code
- Les codes perdus (réservés non utilisés, sautés par erreur) sont
  marqués `voided` pour toujours

### Cohabitation legacy

- Les 3 conventions (`1A`, `V01`, `A247`) cohabitent
- La différence de format (longueur, structure) lève les ambiguïtés
- Nouveau système démarre à `A001` (pas de réutilisation de lettres
  legacy car la distinction de format suffit)
- Les items legacy gardent leur code original ET portent le tier
  `legacy_migrated` (voir ADR-002)

### Concurrence et intégrité

- **Transactions atomiques** côté serveur pour chaque réservation
- **Contrainte UNIQUE** en base sur `display_code`
- **Tests automatiques** au déploiement vérifiant la cohérence des 50
  ancres (couverture 100% sans chevauchement)

## Justification des choix clés

### Pourquoi 50 ancres (et pas 30 ou 100)?

Analyse mathématique basée sur volumes projetés (500-2000 items/an) :

- 30 ancres : retour à chaque ancre tous les ~14 mois
- 50 ancres : retour tous les ~2 ans (équilibre optimal)
- 100 ancres : retour tous les ~4 ans (marginal bénéfice, complexité
  équivalente)

À 10 000 items/an (scénario Amazon du pneu), les 3 options saturent en
~2.6 ans, moment où le Palier 2 (format de code différent) sera
activé. Donc durabilité équivalente.

50 ancres offre le meilleur compromis entre :
- Opacité visuelle entre plages
- Durée de vie des ancres individuelles
- Simplicité d'implémentation

### Pourquoi le format A247 et pas AB47?

- Même nombre de caractères à écrire (4)
- 10× plus de codes par préfixe (1000 vs 100)
- Incrémentation mentale plus naturelle (lettre fixe, chiffres
  changent)
- Identité temporelle plus forte par préfixe

### Pourquoi les codes visuellement aléatoires entre plages?

La confidentialité pure des volumes n'est pas garantie par l'aléatoire
seul (les dates de création révèlent la fréquence). Cependant,
l'aléatoire **augmente significativement** l'opacité apparente pour un
observateur qui ne voit que des codes isolés (sans contexte de date).

C'est une couche de protection additionnelle à celle gérée au niveau
des permissions d'écran (les partenaires ne voient pas les totaux).

## Conséquences

### Positives

- Workflow terrain préservé (incrémentation mentale intra-session)
- Confidentialité améliorée (codes non déductibles)
- Scalabilité assurée (palier 1 valable ~40 ans à volume actuel, prêt
  pour palier 2)
- Robustesse (zéro doublon garanti par construction)
- Audit trail complet (chaque correction tracée)
- Alignement avec les 9 principes directeurs

### Négatives

- Implémentation plus complexe qu'une séquence pure A001, A002, A003
- Surface de bug accrue (mais compensée par tests automatiques)
- Dashboard admin nécessaire pour surveillance des ancres (ajouté au
  backlog)

## Alternatives considérées

1. **Séquence alphabétique pure** (A001, A002...) — rejeté car
   confidentialité nulle
2. **Codes complètement aléatoires** (K4M, H3P, aléatoires individuels)
   — rejeté car casse l'incrémentation mentale
3. **Format AB47** (2 lettres + 2 chiffres) — rejeté car 100 codes par
   préfixe s'épuisent vite (changement de préfixe en cours de lot)
4. **Reset annuel** (V247/26) — rejeté car 2 caractères de plus à
   écrire
5. **Générations aléatoires par réservation** (sans ancres) — rejeté
   car risque de fragmentation et collision

## Auteur

Décision co-construite par Mika et l'assistant Claude pendant la
session d'audit approfondi du Paquet 1. La proposition des 50 ancres
vient directement de Mika, optimisant le design initial proposé par
l'assistant.

---
