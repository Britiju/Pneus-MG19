# Sommaire technique — Documentation intermédiaire Paquet 2

> **Ce document est destiné à Claude Code.** Il liste les actions
> concrètes à effectuer sur le repo pour documenter les décisions
> déjà prises pendant le Paquet 2 (finances), avant de passer à la
> question D (cas particuliers).
>
> **Contexte important** : le Paquet 2 n'est pas encore terminé. Ce
> commit intermédiaire évite d'accumuler une dette de documentation
> trop importante. Un deuxième commit arrivera à la fin du Paquet 2
> avec le raisonnement narratif.
>
> **STATUT** : EXÉCUTÉ. Ce document est archivé à titre historique.
> Les futures sessions de Claude Code ne doivent PAS ré-exécuter ces
> actions — elles ont toutes été faites et pushées.

## Actions qui ont été exécutées dans ce commit

1. Création de `docs/decisions/ADR-011-pricing-mvp.md` — pricing au
   MVP (prix affiché + vente, comparables triés par récence,
   catégorisation usure en saisons restantes, bouton "Copier la
   description")

2. Création de `docs/decisions/ADR-012-emplacements-mvp.md` — gestion
   des emplacements physiques au MVP (entité Emplacement minimale,
   événement `mouvement`, mouvements en lot, filtrage par
   emplacement, pas de sous-emplacements ni GPS)

3. Mise à jour de `docs/04-modules.md` — Module 2 enrichi
   (emplacements, mouvements en lot, catégorisation usure, bouton
   description) avec références ADR-011 et ADR-012 ; Module 3 enrichi
   (profit par lot, prix affiché, comparables, kits stagnants) avec
   référence ADR-011

4. Ajout de Q8 dans `docs/questions-ouvertes.md` — stratégie de
   bascule (migration, cohabitation, tests, formation) à trancher
   entre la fin du cadrage et le début du développement MVP

5. Création de `docs/pratiques-pre-mvp.md` — 4 pratiques actionnables
   dès maintenant dans les Excel (capturer l'emplacement de chaque
   kit, capturer le prix affiché en plus du prix vendu, standardiser
   le vocabulaire "saisons restantes", démarrer la numérotation A247
   pour les nouveaux kits)

## Message de commit utilisé

```
docs: documenter les décisions intermédiaires du Paquet 2

Documente les décisions prises pendant le Paquet 2 (finances) avant
de passer à la question D (cas particuliers). Évite d'accumuler une
dette de documentation.

- ADR-011 : Pricing au MVP (prix affiché + vente, comparables triés
  par récence, catégorisation usure en saisons restantes, bouton
  copier la description)
- ADR-012 : Gestion des emplacements physiques au MVP (entité,
  mouvements, filtrage, mouvements en lot)
- Module 2 et 3 enrichis dans 04-modules.md
- Q8 ajoutée dans questions-ouvertes.md : stratégie de bascule
  (migration, cohabitation, tests, formation) - à traiter entre fin
  cadrage et début développement MVP
- Nouveau document pratiques-pre-mvp.md : ce que Mika peut commencer
  à pratiquer dès maintenant dans ses Excel (emplacements, prix
  affiché, vocabulaire saisons, numérotation A247)

Le raisonnement narratif du Paquet 2 sera produit séparément à la
fin du paquet, avec un commit dédié.
```

## Contexte historique

Ce sommaire a été produit pendant la session de cadrage du Paquet 2,
à un moment où plusieurs décisions critiques avaient été prises mais
pas encore documentées dans le repo. Pour éviter une dette de
documentation trop importante (au cas où la session serait
interrompue), un commit intermédiaire a été jugé préférable à
attendre la fin complète du Paquet 2.

Ce pattern "sommaire intermédiaire + sommaire de fermeture" pourra
être réutilisé pour les paquets futurs complexes.

---

**Fin du sommaire intermédiaire Paquet 2.**
