# Intégration QuickBooks — Vision stratégique

## Statut de ce document

**Document de direction, pas de spécification.**

L'intégration QuickBooks est prévue en **Phase C**, pas au MVP. Ce
document ne décrit pas comment coder l'intégration — il capture les
décisions architecturales à respecter **dès maintenant** pour ne pas
fermer la porte à une intégration propre plus tard.

Les détails techniques (structure exacte des payloads, gestion des
tokens OAuth, retry logic, etc.) seront formalisés **au moment de
démarrer la Phase C**, avec les versions d'API en vigueur à ce
moment-là.

---

## Pourquoi ce document existe

Pendant le Paquet 2 (finances), la question s'est posée de savoir
comment l'app va interagir avec QuickBooks à terme. Plusieurs
décisions MVP dépendent de cette vision :

- Doit-on stocker les taxes décomposées dans l'app ou pas?
- Doit-on générer les factures dans l'app ou pas?
- Quels champs prévoir dès maintenant pour éviter un refactor en
  Phase C?

Sans une direction claire, le risque est de faire des choix MVP qui
bloqueront l'intégration future, ou à l'inverse de sur-ingénierer
pour une intégration qui arrivera dans 18 mois.

---

## Direction architecturale

### Principe fondamental : séparation des rôles

**L'app est la source de vérité opérationnelle.**
Inventaire, kits, lots, caractérisations, processus de vente,
événements post-vente. Tout ce qui concerne "le business tel qu'il se
passe" vit dans l'app.

**QuickBooks est la source de vérité comptable.**
Factures officielles, numérotation des factures, calcul des taxes,
rapports fiscaux, comptabilité, déclarations de TPS/TVQ. Tout ce qui
concerne "la conformité comptable et fiscale" vit dans QuickBooks.

Cette séparation n'est pas arbitraire. Elle reflète une réalité :
QuickBooks fait mieux que nous la comptabilité, nous faisons mieux que
lui la gestion d'inventaire. Chacun son métier.

### Implication directe

**L'app ne génère pas de factures PDF au MVP ni en Phase C.**

C'est QuickBooks qui produira toutes les factures officielles, avec
sa propre numérotation séquentielle, ses taux de taxes conformes, son
format légal. L'app envoie les données de vente, QuickBooks renvoie
la facture.

**L'app ne calcule pas les taxes.**

Les montants hors taxes, TPS, TVQ sont calculés par QuickBooks selon
les règles fiscales québécoises à jour. L'app reçoit ces montants
calculés et les stocke dans ses champs miroir.

---

## Les 4 principes de l'intégration

### Principe A — Flux unidirectionnel pour les données opérationnelles

Les données créées dans l'app (ventes, kits, clients) descendent vers
QuickBooks. Jamais l'inverse pour ces types de données. Ça évite :

- Les conflits de modification (qui a raison?)
- La duplication de saisie (où je modifie, ici ou là?)
- La confusion utilisateur

### Principe B — Flux retour pour les données comptables

QuickBooks renvoie à l'app les données qu'**il** maîtrise :

- Numéro de facture officiel
- Décomposition fiscale (montants HT, TPS, TVQ)
- Statut de paiement (surtout pour les commerces avec termes de
  paiement)
- Modifications faites directement dans QuickBooks

L'app stocke ces données en **miroir**, jamais en source de vérité.

### Principe C — Pas de doublons, pas de recalcul

L'app n'a pas sa propre numérotation de factures. L'app ne recalcule
pas les taxes à partir du montant total. L'app ne génère pas son
propre PDF de facture en parallèle de celui de QuickBooks.

Une donnée, une source, un calcul.

### Principe D — Dégradation propre

Si l'intégration QuickBooks est temporairement indisponible (panne
API, token expiré, etc.), l'app continue de fonctionner en mode
autonome :

- Les ventes peuvent être saisies normalement
- Les champs miroir QuickBooks restent simplement vides
- Une file d'attente de synchronisation se constitue
- Dès que QuickBooks est de nouveau accessible, le sync se fait
  automatiquement

L'utilisateur n'est jamais bloqué par un problème d'intégration.

---

## Champs miroir à prévoir dès le MVP

Ces champs sont **à créer dès le MVP** sur la table `ventes`, même
s'ils restent vides jusqu'à la Phase C. Les créer maintenant évite un
refactor de la BD plus tard.

**Règle** : ces champs sont **tous nullable**. Au MVP ils sont vides.
En Phase C ils se remplissent automatiquement.

### Identifiants QuickBooks

- `qb_invoice_id` — identifiant unique de la facture côté QuickBooks
- `qb_invoice_number` — numéro de facture lisible (ex : "2026-0127")
- `qb_customer_id` — identifiant QuickBooks du client (pour relier
  aux achats futurs du même client)

### Détail fiscal

- `qb_montant_ht` — montant hors taxes retourné par QuickBooks
- `qb_tps` — montant TPS calculé par QuickBooks
- `qb_tvq` — montant TVQ calculé par QuickBooks
- `qb_montant_ttc` — montant total avec taxes retourné par QuickBooks

### Suivi du paiement

- `qb_statut_paiement` — `paye` / `en_attente` / `en_retard` /
  `partiel`
- `qb_date_facturation` — date officielle côté QuickBooks
- `qb_date_paiement` — date de paiement (surtout pour commerces)
- `qb_termes_paiement` — `comptant` / `net_15` / `net_30` / `net_60`
  / `autre`

### Métadonnées de synchronisation

- `qb_synced_at` — dernier sync réussi avec QuickBooks
- `qb_sync_status` — `never_synced` / `pending` / `synced` / `error`
- `qb_sync_error` — dernier message d'erreur (pour debugging)

**Note importante** : cette liste peut évoluer avant la Phase C. Elle
représente le minimum raisonnable pour démarrer sans refactor. On
pourra en ajouter, mais retirer serait un problème.

---

## Champs MVP à capturer côté app (pour alimenter QuickBooks)

Ces champs sont **à saisir par l'utilisateur** pour chaque vente au
MVP. Ils seront ensuite envoyés à QuickBooks en Phase C.

### Type de client

Distinction importante — détermine le traitement fiscal et la
facturation :

- `type_client` — `particulier` / `commerce`

### Données client minimales

**Pour un particulier** (MVP minimaliste, conforme ADR-001) :

- `client_nom_informel` — texte libre (ex : "Marc de Sherbrooke")
- Pas d'email, pas d'adresse obligatoires

**Pour un commerce** (structurés car nécessaires pour la facture) :

- `commerce_nom` — raison sociale de l'entreprise
- `commerce_adresse` — adresse de facturation complète
- `commerce_email` — pour envoyer la facture
- `commerce_telephone` — optionnel mais utile
- `commerce_no_tps` — optionnel (si le client le fournit)
- `commerce_no_tvq` — optionnel (si le client le fournit)

### Termes de paiement

- `termes_paiement` — `comptant` (par défaut pour particulier) /
  `net_15` / `net_30` / `net_60` / `autre`
- Si `autre` : champ texte libre

### Montant

- `prix_vente_total` — prix total payé par le client, taxes incluses
  (un seul chiffre, pas de décomposition dans l'app)

---

## Questions à creuser **au moment de la Phase C**

Ces questions n'ont pas besoin de réponse aujourd'hui. Elles sont
listées pour qu'on sache quoi traiter quand la Phase C démarrera.

1. **Version de l'API QuickBooks** à utiliser (peut évoluer d'ici là)
2. **Stratégie de gestion des tokens OAuth** (refresh, expiration)
3. **Retry logic** en cas d'échec de sync
4. **Ordre de synchronisation** lors du premier branchement (clients
   d'abord, puis historique des ventes?)
5. **Traitement de l'historique pré-intégration** — les ventes faites
   pendant le MVP, sans QuickBooks, comment on les rattrape?
6. **Gestion des webhooks entrants** (QuickBooks nous notifie) —
   architecture technique
7. **Multi-devise** — pertinent si tu commences à vendre hors Québec
8. **Gestion des annulations et remboursements** — comment ça se
   reflète dans QuickBooks (crédit, remboursement, note de crédit?)
9. **Rapport d'écarts** — tableau de bord "transactions non
   synchronisées" pour détecter les problèmes silencieux
10. **Stratégie de migration** si tu changes un jour d'outil
    comptable (abstraction à prévoir?)

---

## Impacts sur les décisions déjà prises

### Cohérent avec

- **ADR-001** (pas de CRM au MVP) — les données client minimales
  capturées ici sont l'opposé d'un CRM, juste le nécessaire pour la
  future facturation QuickBooks
- **ADR-005** (immutabilité) — cohérent avec le modèle comptable de
  QuickBooks qui est aussi immutable
- **Principe 6** (la technologie suit le besoin réel) — on ne code
  pas l'intégration maintenant, on prépare juste le terrain
- **Principe 7** (scalabilité latente) — les champs miroir permettent
  d'ajouter l'intégration sans refactor BD

### Évolution nécessaire

- **docs/06-modele-donnees.md** doit ajouter les champs miroir
  QuickBooks à la table `ventes` (même s'ils restent vides au MVP)
- Les formulaires de vente au MVP doivent distinguer **particulier vs
  commerce** et capturer les données adaptées
- Une nouvelle entité `Client` légère (surtout pour les commerces)
  devient probablement nécessaire — à préciser au Paquet 4
  (mécaniques de vente)

---

## Ce que ce document n'est PAS

Pour être clair sur les limites :

- **Pas une spec technique** — on n'indique pas les structures JSON,
  les endpoints API, les formats de données
- **Pas une roadmap détaillée** — l'ordre d'implémentation en Phase C
  sera défini à ce moment-là
- **Pas une liste exhaustive de champs** — on a limité au minimum
  raisonnable, sans prétendre couvrir tous les cas
- **Pas une garantie de stabilité** — QuickBooks va évoluer son API,
  ce document pourrait devoir être révisé

---

## Auteur et évolution

Document créé pendant le Paquet 2 (finances) pour capturer la
direction stratégique de l'intégration QuickBooks sans fermer de
portes.

**À relire** au démarrage de la Phase C, avant de commencer le
développement de l'intégration.

**Dernière mise à jour** : Paquet 2, début.

---
