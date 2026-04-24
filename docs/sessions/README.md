# `docs/sessions/` — Archives des sommaires de cadrage

## Qu'est-ce que ce dossier

Ce dossier contient les **sommaires techniques produits pendant les
sessions de cadrage** du projet.

Un sommaire technique de cadrage est un document qui :

1. A été produit pendant une session de cadrage avec un humain
2. Contient une liste d'actions concrètes à exécuter sur le repo
3. A été **entièrement exécuté** (les commits correspondants ont
   été faits et pushés)
4. N'a plus de valeur opérationnelle, seulement une valeur
   historique et de traçabilité

## Règle absolue

**Les documents de ce dossier ne doivent PAS être ré-exécutés.**

Ils représentent des instructions one-shot qui ont déjà été
accomplies. Les ré-exécuter produirait des changements indésirables
ou des erreurs (documents déjà existants, actions déjà faites, etc.).

Si une future session de Claude Code (ou un humain) consulte ce
dossier, c'est uniquement pour :

- **Comprendre** l'historique des décisions du projet
- **Retrouver** le contexte d'un changement spécifique
- **Tracer** l'origine d'un document ou d'une décision

Pas pour exécuter quoi que ce soit.

## Convention de nommage

Les sommaires suivent la convention :

```
sommaire-paquet-{N}-{type}.md
```

Où :

- `{N}` est le numéro du paquet de cadrage (1, 2, 3, etc.)
- `{type}` est optionnel et précise si plusieurs sommaires existent
  pour le même paquet (ex: `intermediaire`, `fermeture`)

Exemples :

- `sommaire-paquet-1.md` — le sommaire unique du Paquet 1
- `sommaire-paquet-2-intermediaire.md` — sommaire produit en cours
  de Paquet 2
- `sommaire-paquet-2-fermeture.md` — sommaire de clôture du
  Paquet 2

## Structure d'un sommaire

Chaque sommaire archivé dans ce dossier doit commencer par un
**en-tête qui mentionne explicitement "STATUT : EXÉCUTÉ"** pour que
Claude Code (ou toute autre IA) comprenne immédiatement qu'il ne
s'agit pas d'instructions à exécuter.

Les actions listées sont **au passé** (ce qui a été fait) plutôt
qu'à l'impératif (ce qu'il faut faire).

## Documents présents

À la création de ce dossier (avril 2026) :

- `sommaire-paquet-1.md` — 10 actions sur le Paquet 1 (corrections
  d'incohérences, ajout des Principes 10-13, création d'ADR-008/009/010,
  création du document stack-technique, etc.)
- `sommaire-paquet-2-intermediaire.md` — 5 actions sur le début du
  Paquet 2 (ADR-011 pricing, ADR-012 emplacements, etc.)
- `sommaire-paquet-2-fermeture.md` — 4 actions sur la fin du Paquet 2
  (Q9 notes de crédit, action Donner, etc.)

De nouveaux sommaires seront ajoutés au fil des paquets futurs
(Paquet 3 données historiques, Paquet 4 mécaniques de vente, etc.).

## Ce dossier n'est PAS

- Un endroit pour les ADR (ceux-ci vont dans `docs/decisions/`)
- Un endroit pour les documents durables du projet (ceux-ci vont à
  la racine de `docs/`)
- Un endroit pour les instructions à exécuter (celles-ci ne sont pas
  dans le repo du tout, elles vivent dans les conversations avec
  Claude)

---

**Convention établie** : avril 2026, audit de cohérence de `CLAUDE.md`.
