# Sommaire technique — Fermeture du Paquet 2

> **Ce document est destiné à Claude Code.** Il liste les actions
> concrètes à effectuer sur le repo pour fermer proprement le
> Paquet 2 (finances). Ce sont les derniers ajustements issus de la
> question D (cas particuliers).
>
> **Contexte** : le sommaire intermédiaire du Paquet 2 a déjà été
> poussé (ADR-011 pricing, ADR-012 emplacements, module 2/3 enrichis,
> Q8 bascule, pratiques-pre-mvp). Ce commit complète avec les
> dernières décisions.
>
> **STATUT** : EXÉCUTÉ. Ce document est archivé à titre historique.
> Les futures sessions de Claude Code ne doivent PAS ré-exécuter ces
> actions — elles ont toutes été faites et pushées.

## Actions qui ont été exécutées dans ce commit

1. Ajout de Q9 dans `docs/questions-ouvertes.md` — notes de crédit
   fournisseur rétroactives (ristournes annuelles, bonus de fidélité,
   rebates volume) à traiter lors du cadrage détaillé de
   l'intégration QuickBooks avant la Phase C

2. Enrichissement de `docs/backlog.md` avec 4 nouvelles entrées :
   - Pneus récupérés gratuitement (source d'acquisition, Phase B)
   - Échanges de services / troc (Phase C, rare)
   - Sous-catégorisation des cadeaux (Phase B)
   - Motif de vente à perte volontaire (rejeté au MVP)

3. Enrichissement de `docs/04-modules.md` — Module 2 enrichi avec la
   nouvelle action "Donner" au MVP (alternative à Vendre et Rebuter
   pour les sorties non-vendues)

4. Enrichissement de `docs/06-modele-donnees.md` :
   - Statut `donne` ajouté dans les statuts possibles de Kit
   - Événement `cadeau` ajouté dans le journal d'événements
   - Règle d'exclusivité mutuelle des 3 statuts finaux (`vendu` /
     `donne` / `rebute_total`)

## Message de commit utilisé

```
docs: fermer le Paquet 2 avec les dernières décisions de la question D

Documente les dernières décisions du Paquet 2 (finances) sur les cas
particuliers :

- Q9 ajoutée dans questions-ouvertes.md : notes de crédit fournisseur
  rétroactives, à traiter lors du cadrage détaillé de l'intégration
  QuickBooks avant la Phase C
- Backlog enrichi : pneus récupérés gratuits, échanges de services,
  sous-catégorisation des cadeaux, motif de vente à perte
- Module 2 enrichi dans 04-modules.md : nouvelle action "Donner" au
  MVP (alternative à Vendre et Rebuter pour les sorties non-vendues)
- Modèle de données mis à jour dans 06-modele-donnees.md : statut
  `donne` sur Kit + événement `cadeau` dans le journal

Le Paquet 2 est maintenant fonctionnellement bouclé. Le document
narratif raisonnement-paquet-2.md sera produit dans une session
dédiée pour préserver le contexte complet des décisions.
```

## Contexte historique

Ce sommaire a fermé le Paquet 2 sur la question D (cas particuliers).
Les décisions structurantes :

**Sur les bonus dans les lots** : pas de nouveau travail, ADR-008
(allocation hybride) suffit. Mika choisit au moment de l'allocation
si les bonus reçoivent 0$ (méthode actuelle) ou une part au prorata.

**Sur les pneus offerts / cadeaux** : action "Donner" ajoutée au MVP
minimal (statut `donne` + événement `cadeau`, note libre obligatoire,
pas d'intégration QuickBooks — conforme à la règle Revenu Québec sur
les cadeaux de promotion).

**Sur les notes de crédit fournisseur rétroactives** : Q9 créée,
cadrage reporté avant la Phase C. QuickBooks a une feature native
"Vendor Credit" qui pourrait suffire, mais la question de la
visibilité côté app reste ouverte.

**Sur les ventes à perte volontaires** : Mika considère que "c'est
toujours une vente à perte" peu importe le motif. Le système détecte
automatiquement (prix vente < coût alloué) sans catégorisation. Motif
optionnel à revisiter en Phase B si les analyses le justifient.

**Sur les échanges de services / troc** : rare, reporté en Phase C.

---

**Fin du sommaire de fermeture Paquet 2.**
