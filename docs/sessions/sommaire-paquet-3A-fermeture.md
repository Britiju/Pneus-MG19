# Sommaire Paquet 3A — Portée opérationnelle du tiering (fermeture)

**STATUT : EXÉCUTÉ**
**Date** : Avril 2026
**Durée** : ~1 heure (en extension immédiate du Paquet 5 dans la même
session)

## Origine du paquet

Extension du Paquet 5 (utilisateurs et permissions). En fin de cadrage
Paquet 5, Patrick a soulevé une question sur la portée opérationnelle du
`data_quality_tier` : "Dans le matériel legacy, est-ce qu'il apparaîtra
comme vendu (s'il est vendu) comme un kit qui a été entré initialement
directement dans l'app? Est-ce que le kit sera reconnu comme lot
historique? Cependant, un lot qui n'est pas encore vendu mais qui provient
d'un Excel, est-ce qu'il se retrouvera exactement dans le même workflow
que les nouvelles entrées?"

Cette question appartenait conceptuellement au Paquet 3 (données
historiques), mais pouvait être traitée sans les fichiers historiques
manquants — d'où le label "3A".

## Décisions prises

9 décisions détaillées dans ADR-017 :

1. Tier unique conservé à vie (pas de transition entre legacy et
   app-native)
2. Indicateur discret sur la fiche (pas de marquage dans les listes)
3. Workflows identiques legacy et app-native
4. Champs descriptifs modifiables librement sur kits/lots non-finalisés
5. `display_code` toujours via workflow explicite (correction de code)
6. Champs critiques vides bloquent la finalisation de vente
7. Pas de distinction dans les rapports au MVP
8. Cas "app-native devient historique" non modélisé
9. Lots suivent la même logique que les kits

## Révision significative d'ADR-016

La ligne "Modifier des données `legacy_migrated` | admin" de la matrice
rôle × action d'ADR-016 a été **supprimée** suite à une remise en cause
explicite par Patrick : "Dans les faits, je ne vois pas le problème avec
les modifications de kit non vendu librement, qu'est-ce que ça cause
vraiment comme problème?"

Cette question pragmatique a fait émerger que la restriction
"admin seul pour legacy" ne protégeait de rien de concret (aucune
conséquence externe tant que le kit n'est pas finalisé) tout en créant
une friction opérationnelle réelle. La règle a été remplacée par une
distinction basée sur le **statut** (finalisé ou non) et le **type de
champ** (descriptif vs identifiant), qui s'applique uniformément à
legacy et app-native.

## Livrables produits

- ADR-017 créé (tiering opérationnel)
- ADR-016 révisé (matrice corrigée, section de justification ajoutée,
  mention d'ADR-017 en relation)
- Backlog : 2 entrées ajoutées (distinction rapports en Phase B, tier
  granulaire)
- Journal d'avancement mis à jour (état actuel, prochaine étape,
  paquets complétés, session actuelle)
- Ce sommaire

## Patterns de collaboration observés

- Patrick a initié la remise en cause d'une décision prise moins d'une
  heure plus tôt. Bonne démonstration du pattern 5 du protocole de
  sessions : "Mika calibre les enjeux mieux que l'assistant" — ici,
  Patrick a mieux calibré qu'une restriction "safe par défaut" est
  parfois juste sacralisante.
- L'assistant a initialement proposé des options trop techniques
  (tier granulaire, workflows divergents) ; Patrick a demandé "Je
  comprends pas ton langage technique", forçant une reformulation en
  langage humain. Bon rappel du pattern 2 du protocole.
- L'assistant a empilé 3 questions en une à un moment ; Patrick a
  rappelé "pose-moi le reste des questions une à une SVP". Pattern 1
  respecté ensuite.

## Prochaine étape

Paquet 3 complet (données historiques + Q5 + Q1) reste en attente que
Patrick rassemble les fichiers historiques manquants. Pas de session
active prévue immédiatement.
