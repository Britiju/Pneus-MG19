# Questions ouvertes et sujets en cours

## Préoccupation méta

La perte de contexte entre sessions est un risque réel. Ce document
sert de mémoire persistante consultable en début de chaque session.

**À lire en début de session** : ce fichier + `CLAUDE.md` + les ADR
pertinents au sujet traité.

## Questions non tranchées

### Initiation d'achat / Work Order

**Contexte** : concept proposé par Mika pour tracer le cycle de vie
multi-dimensionnel d'un lot (financier, physique, géographique, rôles).

**Dimensions identifiées** :
- Financière (payé / acompte / facture reçue / où est la facture)
- Physique (chez vendeur / transit / entrepôt / traité)
- Géographique (localisation actuelle)
- Rôles (qui négocie / qui paye / qui transporte / qui caractérise)

**À trancher** :
- Entité distincte "Work Order" ou extension du Lot avec statuts?
- Quels statuts exactement?
- MVP ou Phase B?

**Statut** : À discuter au Paquet 3 ou 4

---

### Liste exhaustive des champs sensibles

**Contexte** : Principe 8 validé mais liste des champs protégés
non exhaustive.

**Liste provisoire** :
- `display_code` (codes d'étiquettes)
- `prix_achat_alloue` (après committed)
- `prix_vente_final` (après committed)
- `lot_code` et `prix_total` (après premières ventes)
- `uuid` et `internal_id`
- Références entre entités (lot_id sur un kit)

**À trancher** : compléter la liste et formaliser dans un ADR dédié
(extension d'ADR-005 ou nouveau ADR-011?)

**Statut** : En attente — à traiter avant Phase 4 (dev)

---

### Rendez-vous clients liés aux items

**Contexte** : évoqué comme Phase B mais information à capturer
dès MVP?

**Question** : est-ce que le champ `notes` libre sur une vente est
suffisant pour capturer l'info "rendez-vous prévu le..."?

**Statut** : À discuter au Paquet 4 (mécaniques de vente)

---

### Questions B, C, D du Paquet 2 (en cours)

**Question B — Calcul et affichage des marges** : à traiter

**Question C — Pricing à la vente** : à traiter

**Question D — Cas particuliers** : à traiter

**Statut** : Sessions suivantes

---

## Décisions récentes (pour rappel rapide)

| ADR | Décision clé |
|-----|-------------|
| ADR-004 | Codes format A247, 50 ancres, aléatoire inter-plages |
| ADR-005 | Immutabilité des faits engagés, soft delete systématique |
| ADR-006 | 5 événements post-vente (annulation, retour complet/partiel, indemnisation, échange) |
| ADR-007 | Accès ouvert au MVP, traçabilité comme protection |
| ADR-008 | Allocation des coûts : champs vides + boutons raccourcis + blocage sur écart |
| ADR-009 | Retours fournisseur = événement distinct, coût effectif calculé dynamiquement |
| ADR-010 | Formulaires d'abord, voix/IA en Phase B/C |

---
