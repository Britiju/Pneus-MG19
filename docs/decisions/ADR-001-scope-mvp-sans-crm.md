# ADR-001 — Le MVP ne contient pas de CRM

## Statut

Acceptée — Phase 1 de cadrage.

## Contexte

Lors du cadrage initial, plusieurs features CRM ont été discutées :
capture systématique du nom du client lors d'une vente, pipeline de
leads actifs, historique client, relances saisonnières automatiques.

Ces features sont à forte valeur business à terme, notamment pour :
- Maximiser les ventes récurrentes
- Détecter les demandes non satisfaites
- Construire la fidélité client

## Décision

**Aucune fonctionnalité CRM n'est incluse dans le MVP.**

Le champ « nom du client » et « canal de vente » ne sont pas ajoutés
au formulaire de vente, même s'ils prennent peu de place techniquement.

## Justification

Le propriétaire a identifié un risque clé : **toute feature qui ajoute
du temps à un workflow déjà long est rejetée**, même si le bénéfice
semble évident.

Capturer manuellement « nom du client » ajouterait une étape de saisie
à chaque vente, sans automatisation possible dans les conditions
actuelles (vente via Messenger sans API).

La logique retenue : **le CRM ne sera construit que si la capture des
données clients devient automatique**, ce qui ne sera possible qu'avec
le Module 5 (Listing automatique) en Phase B, via intégration
Marketplace.

## Conséquences

### Positives

- Le MVP reste focalisé sur les modules essentiels
- Aucune friction ajoutée au workflow de vente existant
- Le risque de scope creep est contenu

### Négatives

- Aucune capture des données clients pendant la Phase MVP
- Quand le CRM sera construit (Phase C), il n'aura pas de données
  historiques clients pour démarrer
- Les ventes récurrentes ne peuvent pas être analysées pendant la
  période MVP

## Compensation

Un champ `notes` libre est prévu sur chaque vente dans le Module 2
(Inventaire). Mika peut y écrire ce qu'il veut (nom informel, canal,
observation). Ce champ n'est **pas structuré** mais capture de
l'information opportuniste sans imposer de workflow.

Si Mika souhaite capturer quelque chose ponctuellement, il peut le
faire. Mais **rien n'est obligatoire**.

## Condition de réévaluation

Cette décision sera réévaluée au démarrage de la Phase B. Si à ce
moment-là le Module 5 permet la capture automatique des contacts
clients, alors le Module 6 (CRM) pourra être planifié.

## Alternatives considérées

1. **Capturer manuellement au MVP** — rejeté car ajoute du temps au
   workflow
2. **Capturer uniquement les clients récurrents** — rejeté car
   nécessite de définir « récurrent », donc du CRM déguisé
3. **Capturer via une intégration Messenger au MVP** — rejeté car
   complexité technique trop élevée pour un MVP

## Auteur

Décision prise par Mika lors de la Phase 1 de cadrage, avec analyse
collaborative.

---
