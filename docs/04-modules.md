# Architecture modulaire

## Principe directeur

Le système est conçu comme un ensemble de modules indépendants plutôt
qu'une application monolithique. Chaque module a une responsabilité
unique, peut être développé, testé et remplacé sans impacter les
autres.

## Les 7 modules identifiés

### Module 1 — Dashboard central (MVP)

Vision synthétique et analytique du business. Voir `docs/05-dashboard.md`.

### Module 2 — Inventaire (MVP)

Gestion structurée des lots, kits et variantes.

**Responsabilités clés** :

- Liste des lots avec filtres
- Fiche détaillée d'un kit (avec variantes si applicable)
- Recherche rapide multi-critères (marque, taille, saison, véhicule,
  code, fournisseur)
- Import des données historiques (tier legacy)
- Saisie manuelle de nouveaux kits depuis desktop
- Gestion du détachement pneus/jantes cosmétiques
- Gestion des 5 événements post-vente (annulation, retour complet,
  retour partiel, indemnisation, échange)
- Gestion des rebuts partiels et totaux
- Gestion des retours fournisseur (avant mise en stock — ADR-009)
- Workflow d'allocation des coûts avec champs vides + boutons raccourcis
  (ADR-008) : "Diviser également", "Diviser proportionnellement aux pneus",
  "Tout remettre à 0"
- Workflow de correction des codes d'étiquettes :
  - Bouton **"Code différent"** — si Mika a écrit un code différent sur le pneu
  - Bouton **"Étiquette illisible"** — pour réattribuer un nouveau code
  - Bouton **"Annuler la réservation"** — si la plage réservée n'a pas été utilisée
- Journal d'événements complet par kit

**Détails techniques** :

Voir `docs/06-modele-donnees.md` pour le modèle de données détaillé.
Voir `docs/decisions/ADR-004-numerotation.md` pour la numérotation.
Voir `docs/decisions/ADR-005-immutabilite.md` pour les règles
d'immutabilité.
Voir `docs/decisions/ADR-006-evenements-post-vente.md` pour les
événements.
Voir `docs/decisions/ADR-008-allocation-couts-lot.md` pour l'allocation.
Voir `docs/decisions/ADR-009-retours-fournisseur.md` pour les retours
fournisseur.

### Module 3 — Finance (MVP)

Suivi des marges et rapports financiers.

**Responsabilités clés** :

- Marge par kit (prix vente - prix achat alloué)
- ROI par lot (vue agrégée)
- Rapports par saison, marque, fournisseur
- Vues mensuelle, trimestrielle, annuelle
- Segmentation legacy vs nouveau (tiering)
- Gestion des indemnisations et retours (impact sur marges)

**Structure préparée pour Phase B/C** :

- Table `expenses` prévue mais non active au MVP
- Champs pour coûts indirects (transport, storage) désactivés au MVP

### Module 4 — Saisie mobile (Phase B)

Alimentation de l'inventaire depuis le terrain.

### Module 5 — Listing automatique (Phase B)

Création et publication d'annonces sur les canaux de vente.

### Module 6 — CRM (Phase C, conditionnel)

Gestion des relations clients et historique. Activé uniquement si la
capture automatique des clients est possible (dépend du Module 5).

### Module 7 — Assistant IA (Phase C)

Intelligence décisionnelle et automatisation.

## Schéma de dépendances

```
            Module 1 (Dashboard)
                    |
         +----------+----------+
         |                     |
    Module 2                Module 3
    (Inventaire)            (Finance)
         |
    +----+----+
    |         |
Module 4   Module 5
(Mobile)   (Listing)
              |
         +----+----+
         |         |
    Module 6   Module 7
    (CRM)      (IA)
```

## Règle de décision pour toute nouvelle idée

1. À quel module appartient-elle?
2. Ce module est-il en MVP ou en phase ultérieure?
3. Si phase ultérieure → `docs/backlog.md`

Pas de débat, pas d'exception.

---
