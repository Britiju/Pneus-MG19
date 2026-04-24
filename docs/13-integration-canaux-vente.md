# Intégration des canaux de vente — Vision stratégique

## Statut de ce document

**Document de direction, pas de spécification.**

L'évolution des canaux de vente est prévue en Phase B et Phase C.
Ce document ne décrit pas comment coder ces évolutions — il capture
les décisions architecturales à respecter **dès maintenant** pour
ne pas fermer la porte à une évolution propre plus tard.

Les détails techniques (structure des intégrations, APIs, UI)
seront formalisés **au moment de démarrer chaque phase**, avec les
outils et contextes en vigueur à ce moment-là.

---

## Pourquoi ce document existe

Pendant le Paquet 4 (mécaniques de vente), plusieurs évolutions
long terme ont émergé :

- Intégration Google Calendar (RDV structurés, rappels automatiques)
- Évolution vers un site web (ventes en ligne, portail vendeurs
  externes)
- Commerce au comptoir (déjà esquissé dans
  `docs/12-integration-physique-reseau.md`)
- CRM complet (newsletter, relances, programme de fidélité)
- Intégration Messenger (capture automatique des conversations)

Ces évolutions ne sont **pas** au MVP, mais elles **façonnent les
décisions architecturales** prises maintenant. Ce document les
capture sans les imposer.

---

## Direction architecturale

### Principe fondamental : l'app reste la source de vérité opérationnelle

Quel que soit le canal de vente (Messenger, téléphone, site web,
comptoir physique), **la vente finale et l'inventaire** vivent
dans l'app. Les canaux sont des **points d'entrée**, pas des
systèmes de vérité concurrents.

### Les canaux actuels (MVP) et futurs

```
                            ┌─────────────┐
                            │   Mika      │
                            │   (cadre)   │
                            └──────┬──────┘
                                   │
    ┌──────────────┬───────────────┼──────────────┬──────────────┐
    │              │               │              │              │
┌───▼──┐      ┌────▼───┐      ┌───▼────┐    ┌────▼────┐   ┌─────▼─────┐
│Market│      │Messenger│      │Téléphone│   │Site web │   │ Comptoir  │
│place │      │         │      │         │    │         │   │ physique  │
└───┬──┘      └────┬───┘       └───┬────┘    └────┬────┘   └─────┬─────┘
    │              │               │              │              │
    └──────────────┴───────────────┴──────────────┴──────────────┘
                                   │
                            ┌──────▼──────┐
                            │     App     │
                            │ (Supabase)  │
                            └──────┬──────┘
                                   │
                            ┌──────▼──────┐
                            │ QuickBooks  │
                            │ (comptable) │
                            └─────────────┘
```

**Au MVP** : Marketplace, Messenger, téléphone sont les canaux
actifs. Mika capture les infos dans l'app manuellement.

**Phase B/C** : intégrations progressives des canaux avec l'app
pour réduire la friction.

---

## Les 5 chantiers d'évolution

### Chantier 1 — Intégration Google Calendar

**Situation MVP** : iframe Google Calendar dans l'app (lecture seule,
zéro code). Fiches RDV de l'app **indépendantes** de Google Calendar.

**Évolutions possibles (Phase B)** :

- **Niveau 1 — Création unidirectionnelle** : Mika crée le RDV dans
  l'app, l'app pousse vers Google Calendar automatiquement
- **Niveau 2 — Lecture API** : l'app lit les événements Google et
  les affiche dans son propre composant (au lieu de l'iframe)
- **Niveau 3 — Sync bidirectionnelle** : tout est sync dans les deux
  sens (complexe)

**Recommandation Phase B** : Niveau 1 (unidirectionnel). Suffisant
pour les besoins, complexité acceptable.

**Prérequis technique** :
- Migration des Tâches Google Calendar vers des Événements
  (Événements permettent invitations, rappels, calendrier dédié
  MG19)
- Authentification OAuth Google

**Bénéfice attendu** : fin de la double saisie, rappels automatiques
clients possibles.

### Chantier 2 — Site web

**Situation MVP** : pas de site web. Les ventes passent par
Marketplace et contact direct.

**Évolutions possibles (Phase C ou plus tard)** :

- Site web vitrine affichant l'inventaire en temps réel (lecture
  depuis Supabase)
- Formulaire de contact qui crée automatiquement un RDV dans l'app
- E-commerce complet (paiement en ligne, livraison)
- Portail d'estimation pour vendeurs externes (déjà dans le backlog)

**Prérequis architectural** :
- Les kits ont toutes les données nécessaires pour affichage public
  (photos, description, caractéristiques, prix)
- Authentification publique séparée de l'authentification interne
- Séparation claire données publiques vs privées (marges, coûts
  d'achat invisibles au public)

**Bénéfice attendu** : canal de vente additionnel, inversion du flux
commercial (clients viennent à Mika au lieu de Marketplace).

### Chantier 3 — Commerce au comptoir

**Situation MVP** : pas de comptoir. Ventes informelles devant
entrepôt.

**Évolutions possibles (Phase B ou C)** :

- Interface POS (Point of Sale) dans l'app pour ventes rapides au
  comptoir
- Intégration terminal de paiement Helcim (voir
  `docs/12-integration-physique-reseau.md`)
- Impression de reçus/factures sur place (voir
  `docs/12-integration-physique-reseau.md`)
- Scanner de codes-barres pour identification rapide des kits
- Gestion des files d'attente / réservations client

**Prérequis architectural** :
- Workflow de vente rapide optimisé pour terminal tactile
- Intégration paiement (Helcim, Stripe, ou autre)
- Impression depuis l'app (voir chantier intégration physique/réseau)

**Bénéfice attendu** : professionnalisation du commerce, scalabilité
opérationnelle.

### Chantier 4 — CRM complet

**Situation MVP** : pas de CRM. Fiches client minimales dans les
ventes et RDV.

**Évolutions possibles (Phase B puis C)** :

**Phase B (premier niveau)** :
- Fusion automatique des fiches clients par téléphone ou email
- Historique d'achat consolidé par client
- Fiche "Intérêt" (pré-RDV) pour capturer les prospects

**Phase C (CRM complet)** :
- Newsletter avec opt-in
- Relances saisonnières automatiques (ex: "Vos pneus d'hiver ont 4
  ans, est-ce le moment de changer?")
- Programme de fidélité (rabais en échange d'inscription)
- Segmentation (clients particuliers réguliers, commerces, etc.)
- Intégration Messenger (capture automatique des conversations)

**Prérequis architectural** :
- Flags de consentement distincts (facturation, newsletter, relances)
  — ajoutés dès le MVP en infrastructure latente (voir ADR-015)
- Politique de confidentialité formelle (voir ADR-015 et Q8)
- Intégration service email/SMS (ex: Twilio, SendGrid)

**Bénéfice attendu** : maximisation de la valeur client, ventes
récurrentes, insights business.

### Chantier 5 — Intégration Messenger

**Situation MVP** : Messenger reste séparé de l'app. Mika gère
mentalement les conversations.

**Évolutions possibles (Phase C)** :

- Capture automatique des messages Messenger dans des fiches
  "Intérêt"
- Création de fiches RDV depuis Messenger (bouton "Prendre RDV"
  dans la conversation)
- Historique complet client ↔ conversations

**Prérequis technique** :
- API Messenger (Meta / Facebook Business)
- Authentification OAuth Meta
- Gestion des permissions et consentements

**Bénéfice attendu** : fin de la perte d'information des
conversations, meilleure conversion des prospects.

**Risque** : API Messenger est **notoirement capricieuse** et
changeante. Évaluation sérieuse avant investissement.

---

## Les 3 principes qui guident ces évolutions

### Principe A — Flux unidirectionnel par défaut

Quand on intègre un canal externe (Google Calendar, Messenger, etc.),
**l'app est la source de vérité opérationnelle**. Le flux va de l'app
vers le canal, pas l'inverse.

Bidirectionnalité **seulement si justifiée** par un besoin réel
(complexité élevée).

### Principe B — Chaque canal doit pouvoir être désactivé sans rupture

L'app fonctionne **sans aucune intégration de canal**. C'est le cas
au MVP.

Chaque intégration ajoutée est une **amélioration**, pas une
dépendance. Si Messenger tombe, l'app continue. Si Google Calendar
est indisponible, l'app continue.

### Principe C — Respect du Principe 6 (tech suit le besoin)

Aucune intégration n'est ajoutée pour la beauté technique. Chaque
chantier répond à un **besoin opérationnel réel** vérifié :

- Chantier 1 (Google Calendar) : quand la double saisie devient
  pénible
- Chantier 2 (site web) : quand la demande justifie un canal propre
- Chantier 3 (comptoir) : quand le commerce physique s'ouvre
- Chantier 4 (CRM) : quand la base client justifie l'effort
- Chantier 5 (Messenger) : quand la perte d'info devient critique

---

## Questions ouvertes à creuser au moment de chaque chantier

**Chantier 1 (Google Calendar)** :
- Migration Tâches → Événements : comment récupérer l'historique?
- Calendrier MG19 dédié : partagé avec qui?
- Gestion des conflits si Mika modifie un RDV dans Google sans
  passer par l'app

**Chantier 2 (site web)** :
- Architecture : Next.js séparé ou intégré à l'app interne?
- Hébergement : Vercel dédié?
- Authentification publique : quel provider?

**Chantier 3 (comptoir)** :
- Terminal de paiement : Helcim (confirmé) ou autre?
- Imprimante reçus : thermal dédiée?
- Scanner : Zebra DS2208 (déjà recommandé dans
  `12-integration-physique-reseau.md`)

**Chantier 4 (CRM)** :
- Service d'envoi email : SendGrid? Mailgun? Intégration QuickBooks?
- Service d'envoi SMS : Twilio? Autre?
- Conformité Loi 25 pour marketing (consentements actifs, désinscription)

**Chantier 5 (Messenger)** :
- API Meta : quelle version et stabilité?
- Alternatives si API trop instable (capture manuelle assistée?)
- Conformité Loi 25 pour stockage de conversations

---

## Impacts sur les décisions déjà prises

### Cohérent avec

- **ADR-013** (clients au MVP) : structure minimaliste qui pourra
  évoluer vers un CRM complet
- **ADR-014** (RDV au MVP) : structure prête pour sync Google
  Calendar en Phase B
- **ADR-015** (Loi 25 au MVP) : infrastructure de consentements
  latente pour activation en Phase B/C
- **Principe 7** (scalabilité latente) : aucune décision actuelle ne
  bloque ces évolutions

### Documents complémentaires

- `docs/11-integration-quickbooks.md` : intégration comptable
- `docs/12-integration-physique-reseau.md` : éléments physiques
  (imprimante, scanner, terminal paiement)
- `docs/13-integration-canaux-vente.md` : **ce document** — canaux
  de vente

Ces trois documents forment la **vision d'intégration externe**
complète du projet.

---

## Auteur et évolution

Document créé pendant le Paquet 4 (mécaniques de vente) pour
capturer la vision long terme des canaux de vente sans fermer de
portes.

**À relire** au démarrage de chaque chantier (Phase B pour Google
Calendar, Phase C pour les autres).

**Dernière mise à jour** : Paquet 4.

---
