# ADR-013 — Clients et modes de facturation au MVP

## Statut

Acceptée — Paquet 4 (mécaniques de vente).

## Contexte

Au MVP, l'intégration QuickBooks n'existe pas encore (prévue Phase C).
Pendant 12-18 mois, Mika va saisir les données client dans deux
endroits : l'app et QuickBooks. Cette double saisie doit être réduite
au minimum.

Parallèlement, Mika identifie un besoin réel : **envoyer la facture à
100% du temps** à ses clients, ce qui n'est pas toujours le cas
aujourd'hui (oublis post-vente). L'app doit aider à tracker les
factures à envoyer.

Par ailleurs, la distinction entre ventes à des particuliers (75% du
volume) et ventes à des commerces (25%) demande un traitement
différent fiscalement et opérationnellement.

## Décision

### Pas d'entité Client séparée au MVP

Au MVP, il n'y a **pas d'entité `Client`** indépendante. Les
informations client vivent directement dans la fiche de vente
(enrichie) et dans les fiches de rendez-vous.

**Raison** : créer une entité Client complète au MVP sans intégration
QuickBooks créerait une double saisie massive pour les commerces
récurrents. Mieux vaut rester minimaliste et laisser QuickBooks
gérer les fiches clients détaillées jusqu'à la Phase C.

### Entité Vente enrichie

La table `ventes` existante reçoit de nouveaux champs :

**Champs communs** :
- `type_client` — enum `particulier` / `commerce`
- `mode_paiement` — enum `cash` / `interac` / `autre`
- `statut_paiement` — enum `paye` / `a_recevoir`
- `mode_facturation` — enum `email` / `sms` / `papier` / `refuse_par_client`
- `coordonnee_facturation` — texte (email ou téléphone selon `mode_facturation`)
- `facture_envoyee` — booléen (false par défaut)
- `date_envoi_facture` — timestamp (rempli automatiquement quand `facture_envoyee` passe à true)

**Champs pour Particulier** (tous optionnels) :
- `particulier_prenom` — texte libre
- `particulier_telephone` — texte
- `particulier_email` — texte

**Champs pour Commerce** :
- `commerce_nom` — texte (obligatoire si type_client = commerce)
- `commerce_personne_ressource` — texte (optionnel)
- `commerce_email` — texte (optionnel)
- `commerce_telephone` — texte (optionnel)
- `commerce_termes_paiement` — enum `comptant` / `net_15` / `net_30` / `net_60` / `autre`

### Validation conditionnelle

- Si `mode_facturation = email` → `coordonnee_facturation` doit être
  un email valide et non vide
- Si `mode_facturation = sms` → `coordonnee_facturation` doit être un
  numéro de téléphone valide et non vide
- Si `mode_facturation = papier` → `coordonnee_facturation` optionnel
- Si `mode_facturation = refuse_par_client` → `coordonnee_facturation`
  optionnel, note libre suggérée pour trace

### Champs exclus du MVP (restent dans QuickBooks)

Les champs suivants **ne sont pas** dans la table `ventes` au MVP :

- Adresse postale complète
- Numéro TPS, numéro TVQ
- Détails de facturation (conditions, pénalités, etc.)
- Historique comptable détaillé

Ces données vivent dans QuickBooks et seront synchronisées en Phase C
via l'intégration.

### Tableau de bord "Factures à envoyer"

Nouvelle vue opérationnelle dans le Module 3 (Finance) :

- Liste des ventes où `facture_envoyee = false` et `mode_facturation
  ≠ refuse_par_client`
- Triée par date de vente (plus ancien en haut)
- Action "Marquer comme envoyée" sur chaque ligne (checkbox)
- Filtres : par mode de facturation, par période

**Objectif** : rappel visuel permanent à Mika qu'il a des factures
en retard. Plus d'oublis.

### Workflow de vente depuis un RDV

Quand une vente est créée à partir d'un RDV existant (voir ADR-014) :

1. La fiche RDV passe à `honore_vendu`
2. Le kit passe à `vendu`
3. Les autres RDV sur le même kit reçoivent un signal visuel
   "à annuler ou rediriger"
4. Le prix négocié attendu (si renseigné sur le RDV) est affiché en
   référence non-éditable dans le formulaire de vente

## Justification

### Pourquoi minimaliste au MVP

**Principe 6 (la technologie suit le besoin réel)** : au MVP, l'app
n'a besoin que de ce qui lui sert à elle-même. Les détails comptables
appartiennent à QuickBooks.

**Principe 1 (aucune feature ne ralentit le workflow actuel)** : une
saisie de 5 minutes par vente commerce serait pénible et
dissuaderait Mika. 30 secondes est acceptable.

**Cohérence avec `docs/11-integration-quickbooks.md`** : séparation
claire des rôles (app = opérationnel, QuickBooks = comptable).

### Pourquoi le tableau de bord "Factures à envoyer"

Problème opérationnel réel identifié par Mika : oublis fréquents
post-vente. L'app doit aider à résoudre ça dès le MVP, sans attendre
l'automatisation de Phase B/C.

### Pourquoi 4 modes de facturation

- `email` : cas le plus fréquent, facile à automatiser en Phase C
- `sms` : préférence de certains clients, automatisation Phase B+
- `papier` : pour Mika qui veut remettre une facture imprimée plus
  tard
- `refuse_par_client` : engagement explicite du client (il choisit de
  ne pas recevoir) — traçabilité

## Conséquences

### Positives

- Friction minimale au MVP (30 sec par vente particulier, 1-2 min par
  commerce)
- Plus d'oublis de facturation (tableau de bord)
- Structure prête pour la Phase C (enrichissement via intégration
  QuickBooks)
- Engagement explicite sur la facturation (Principe 11)

### Négatives

- Double saisie résiduelle pour les commerces (nom + infos minimales
  dans l'app, détails complets dans QuickBooks) pendant 12-18 mois
- Fiches commerce pas réutilisables au MVP (chaque vente recrée les
  infos minimales)

### Atténuation

- La double saisie est **courte** (nom + peut-être 1 coordonnée)
- Phase C réglera définitivement le problème via sync QuickBooks

## Impacts sur d'autres documents

- `docs/06-modele-donnees.md` : ajout des champs sur la table
  `ventes`
- `docs/04-modules.md` : Module 3 (Finance) enrichi avec le tableau
  de bord "Factures à envoyer"
- `docs/11-integration-quickbooks.md` : reste cohérent (Phase C
  synchronisera les fiches clients complètes)

## Alternatives considérées

1. **Entité Client complète au MVP** — rejeté, double saisie massive
   pendant 12-18 mois
2. **Aucune info client au MVP** — rejeté, impossible d'envoyer des
   factures ou d'identifier les commerces récurrents
3. **Intégration QuickBooks dès le MVP** — rejeté, hors scope MVP
   (prévu Phase C)

## Auteur

Décision co-construite pendant le Paquet 4. Mika a explicitement
soulevé l'inquiétude de la double saisie, ce qui a conduit à la
version minimaliste retenue. La notion de "mode de facturation avec
refus explicite" est une correction de Mika par rapport à la
proposition initiale de l'assistant.

---
