# Sommaire technique — Fermeture du Paquet 4

> **Ce document est destiné à Claude Code.** Il liste les actions
> concrètes à effectuer sur le repo pour documenter les décisions du
> Paquet 4 (mécaniques de vente, clients, rendez-vous).
>
> **STATUT** : EXÉCUTÉ. Ce document est archivé à titre historique.
> Les futures sessions de Claude Code ne doivent PAS ré-exécuter ces
> actions — elles ont toutes été faites et pushées.

## Actions qui ont été exécutées dans ce commit

1. Création de `docs/decisions/ADR-013-clients-facturation-mvp.md` —
   structure client minimaliste au MVP (Particulier vs Commerce),
   4 modes de facturation dont `refuse_par_client`, tableau de bord
   "Factures à envoyer"

2. Création de `docs/decisions/ADR-014-rendez-vous-mvp.md` — entité
   RendezVous minimaliste attachée au kit, plusieurs RDV parallèles
   possibles, pas de statut `reserve` sur le kit, prix négocié
   attendu non-éditable après saisie, iframe Google Calendar au MVP

3. Création de `docs/decisions/ADR-015-loi25-mvp.md` — approche
   minimaliste de conformité Loi 25 (collecte opportuniste, pas de
   politique formelle au MVP, obligations différées au Paquet 8)

4. Création de `docs/13-integration-canaux-vente.md` — document de
   vision stratégique sur les 5 chantiers d'évolution des canaux de
   vente (Google Calendar, site web, commerce comptoir, CRM,
   Messenger) + 3 principes directeurs

5. Enrichissement de `docs/06-modele-donnees.md` — nouvelle entité
   RendezVous, champs enrichis sur Vente (type_client, modes de
   paiement et facturation, coordonnées particulier/commerce,
   termes de paiement, facture_envoyee), champ notes_prospection
   sur Kit, infrastructure latente de consentements Loi 25

6. Enrichissement de `docs/04-modules.md` — Module 2 (Inventaire)
   enrichi avec la gestion RDV, calendrier intégré, notes de
   prospection ; Module 3 (Finance) enrichi avec distinction
   client particulier/commerce, modes de facturation, tableau de
   bord "Factures à envoyer"

7. Enrichissement de `docs/backlog.md` avec 10 nouvelles entrées :
   intégration Google Calendar Niveau 1, rappels automatiques
   SMS/email, fusion automatique des RDV par téléphone, fiche
   Intérêt / pipeline, suggestions automatiques de kits équivalents,
   envoi automatique de factures via QuickBooks, envoi automatique
   de factures par SMS, statistiques de conversion RDV, fiches
   commerce réutilisables, politique de confidentialité Loi 25

8. Mise à jour de `CLAUDE.md` — ajout de
   `docs/13-integration-canaux-vente.md` dans la section Navigation

## Message de commit utilisé

```
docs: fermer le Paquet 4 (mécaniques de vente, clients, RDV)

Documente les décisions du Paquet 4 sur les mécaniques de vente,
avec une approche minimaliste au MVP et une vision stratégique des
évolutions futures.

Nouveaux ADR :
- ADR-013 : Clients et modes de facturation au MVP
- ADR-014 : Rendez-vous au MVP
- ADR-015 : Approche Loi 25 minimaliste au MVP

Nouveau document de vision :
- 13-integration-canaux-vente.md : vision long terme (Google
  Calendar, site web, commerce comptoir, CRM, Messenger)

Enrichissements :
- Modèle de données : entité RendezVous, champs Vente enrichis,
  notes_prospection sur Kit, consentements latents Loi 25
- Modules 2 et 3 enrichis
- Backlog : 10 nouvelles entrées
- CLAUDE.md : navigation mise à jour

Le Paquet 4 est fonctionnellement bouclé. Le narratif
raisonnement-paquet-4.md sera produit dans une session dédiée.
```

## Contexte historique

Ce sommaire a fermé le Paquet 4 en cadrant les mécaniques de vente,
les clients, et les rendez-vous. Les décisions structurantes :

**Sur les clients** : approche minimaliste au MVP pour éviter la
double saisie massive avec QuickBooks (pas encore intégré). Les
détails comptables restent dans QuickBooks. L'app capture
l'essentiel opérationnel (type client, nom, coordonnée minimale).

**Sur les rendez-vous** : entité RendezVous nouvelle mais
minimaliste. Plusieurs RDV parallèles sur un même kit possibles,
reflétant la réalité d'arbitrage de Mika entre prospects. Pas de
statut "réservé" qui bloquerait le kit — il reste en vente. Le prix
négocié attendu est capturé mais non-éditable après saisie (engagement
historique).

**Sur Google Calendar** : iframe simple au MVP (zéro code). Google
Calendar reste la source de vérité visuelle. Double saisie acceptée
temporairement. Sync technique évaluée pour Phase B.

**Sur les factures** : capture du mode de facturation souhaité par
le client (email / sms / papier / refusé) + tableau de bord
"Factures à envoyer" pour éliminer les oublis post-vente. Automation
complète en Phase C via QuickBooks.

**Sur la Loi 25** : approche minimaliste au MVP (collecte
opportuniste, pas de politique formelle). Infrastructure latente de
consentements prévue dès le MVP pour éviter un refactor en Phase B.
Obligations formelles à traiter au Paquet 8.

**Sur les évolutions futures** : document `13-integration-canaux-vente.md`
capture la vision des 5 chantiers d'évolution (Google Calendar, site
web, comptoir, CRM, Messenger) sans les imposer au MVP. Complète la
série avec `11-integration-quickbooks.md` (comptable) et
`12-integration-physique-reseau.md` (physique).

**Sujets différés** :
- Q1 (Work Order / initiation d'achat) → Paquet 3 (données
  historiques)
- Q3 (rendez-vous clients) → résolu par ADR-014
- Intégration Google Calendar technique → Phase B (backlog)
- CRM complet → Phase C (backlog)

---

**Fin du sommaire de fermeture Paquet 4.**
