# Marketplace Helper — Composant côté consommation du prototype stealth

Script Tampermonkey qui automatise le remplissage des champs textes du formulaire de création d'annonce Facebook Marketplace, à partir d'un fichier `.txt` glissé sur un bouton flottant.

## Statut

Prototype d'apprentissage. Version 0.7. Développé en session de design technique (avril 2026). Pas encore testé en conditions réelles avec publication d'annonces.

## Ce que ça fait

Le script crée un bouton bleu flottant en haut à gauche des pages de création/édition d'annonces Marketplace. Quand l'utilisateur glisse un fichier `.txt` structuré sur le bouton, le script :

1. Lit le contenu du fichier
2. Parse les sections clé-valeur
3. Remplit automatiquement 5 champs : Titre, Prix, Description, UGS, Lieu
4. Gère l'autocomplétion du champ Lieu (flèche bas + Entrée pour valider la suggestion)

L'utilisateur reste responsable de :
- Choisir manuellement la Catégorie (toujours "Pièces automobiles" pour le projet)
- Choisir manuellement l'État du pneu
- Glisser les photos sur la zone photos de Marketplace
- Cliquer Publier

## Pourquoi pas tout automatisé

Catégorie et État sont des dropdowns React complexes que l'automatisation tend à casser à chaque changement d'interface Facebook. Voir la section "Dette technique : dropdowns Catégorie + État" dans `docs/apprentissages-stealth-test.md` pour le détail de ce qui a été essayé et la piste pour la prochaine itération.

## Format du fichier `.txt`

Le fichier suit un format clé-valeur simple :

```
TITRE: 225/65R17 Michelin Defender - 4 pneus d'été
PRIX: 320
LIEU: Québec
UGS: T01-01
DESCRIPTION:
Pneus d'été Michelin Defender en bon état

Dimensions: 225/65R17
Profondeur: 8/32
DOT: 2419 (semaine 24, 2019)
Quantité: 4

Texto/téléphone disponible
Messenger disponible
```

La clé `DESCRIPTION:` consomme tout ce qui suit jusqu'à la fin du fichier (multi-lignes). Les autres clés sont sur une seule ligne.

Voir `exemple-annonce.txt` pour un fichier prêt à utiliser pour les tests.

## Installation

Prérequis : Chrome avec extension Tampermonkey installée et configurée correctement.

Sur Chrome moderne (depuis 2025), Tampermonkey nécessite deux paramètres activés dans `chrome://extensions/` :
- **Mode développeur** (interrupteur en haut à droite de la page)
- **Autoriser les scripts utilisateur** (dans les détails de Tampermonkey)

Sans ces deux paramètres, le script s'installe mais ne s'exécute pas.

Installation du script :
1. Double-cliquer sur `pneus-marketplace-helper.user.js`
2. Tampermonkey propose l'installation, accepter
3. Aller sur `https://www.facebook.com/marketplace/create/item`
4. Vérifier que le bouton bleu apparaît en haut à gauche

## Limitations connues

- Catégorie et État restent manuels (voir dette technique)
- Le DOT format Marketplace ne supporte pas les caractères spéciaux complexes
- Facebook change ses sélecteurs régulièrement : si le script cesse de fonctionner après une mise à jour Marketplace, c'est attendu et il faudra ajuster

## Cycle de vie

Ce composant fait partie du prototype d'apprentissage stealth. Il a une **date de mort programmée** : il sera remplacé par le Module 5 (Listing automatique) en Phase B du projet pneus-MG19. Voir `docs/apprentissage-stealth-test.md` pour le cadrage du prototype.
