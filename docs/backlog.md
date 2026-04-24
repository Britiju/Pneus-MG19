# Backlog — idées hors-scope

## Objectif de ce document

Ce fichier capture toutes les idées qui émergent pendant le
développement mais qui ne sont pas prioritaires pour la phase en cours.

Règle : **aucune idée n'est perdue, mais aucune n'est développée sans
évaluation**.

## Comment utiliser ce fichier

Lorsqu'une idée nouvelle apparaît :

1. Vérifier si elle correspond à une phase planifiée (MVP/B/C)
2. Si oui → aller dans le document du module concerné
3. Si non ou incertain → ajouter une entrée ici

À chaque démarrage de phase, le backlog est revu pour éventuellement
promouvoir des idées vers le scope actif.

## Idées capturées

### Impression d'étiquettes depuis l'app

**Date** : capturé en Phase 1
**Description** : générer et imprimer des étiquettes pour coller
physiquement sur les pneus, avec code-barres scannable.
**Valeur** : haute (scalabilité opérationnelle)
**Complexité** : moyenne
**Phase potentielle** : Phase B ou début Phase C

### Scan de code lors de la vente

**Description** : scanner l'étiquette d'un pneu au moment de la vente
pour mettre à jour automatiquement le statut.
**Valeur** : haute (réduit erreurs de saisie)
**Phase potentielle** : Phase B
**Dépendance** : impression d'étiquettes

### Reconnaissance automatique par photo

**Description** : prendre une photo d'un pneu et que l'app identifie
automatiquement marque, taille, DOT, indice de charge.
**Valeur** : très haute (élimine la saisie manuelle)
**Phase potentielle** : Phase C

### Assistant IA pour compatibilité véhicule

**Description** : chatbot qui répond aux acheteurs Marketplace sur les
questions de compatibilité.
**Phase potentielle** : Phase C, Module 7

### Rendez-vous clients intégrés au calendrier

**Description** : lier les rendez-vous avec des clients au système
d'inventaire pour créer un pipeline de ventes visible.
**Phase potentielle** : Phase B, lié au Module 6 (CRM)

### Recommandations de prix automatiques

**Description** : suggérer un prix de vente optimal basé sur
l'historique de ventes similaires.
**Phase potentielle** : Phase B, Dashboard C

### Alerte stock anormalement stagnant

**Description** : notifier quand un item dépasse un seuil contextualisé
par saison (ex: pneu d'hiver > 200 jours en stock).
**Valeur** : haute
**Complexité** : basse
**Phase potentielle** : MVP possible → à évaluer

### Détection d'opportunités de rachat

**Description** : identifier les demandes fréquentes de tailles/marques
non en stock.
**Phase potentielle** : Phase C (dépend du Module 6)

### Intégration comptable QuickBooks

**Description** : synchroniser les ventes avec QuickBooks pour la
comptabilité.
**Phase potentielle** : Phase C

### Coûts indirects (transport, storage, listing)

**Description** : tracking pour marge nette plus précise.
**Phase potentielle** : Phase B ou Phase C

### [NOUVEAU] Workflow d'approbation partenaire → Mika

**Description** : les partenaires peuvent demander des corrections sur
des données sensibles (codes, prix), les demandes sont envoyées à Mika
pour approbation avec vérification photo de l'étiquette physique.
**Phase potentielle** : Phase B ou C, selon évolution
**Condition de démarrage** : ajout de nouveaux partenaires moins
proches, ou volume qui empêche Mika de tout surveiller manuellement,
ou demande légale/comptable de contrôles stricts

### [NOUVEAU] Permissions granulaires par rôle

**Description** : différencier les actions possibles par rôle
(propriétaire, partenaire, employé).
**Phase potentielle** : Phase B ou C
**Au MVP** : tout le monde a accès à tout (voir ADR-007)

### [NOUVEAU] Workflow intégré de retour avec qualification d'état

**Description** : lors d'un retour, proposer de qualifier l'état
physique (identique / dégradé / inutilisable) avec suggestion
automatique d'ajustement (prix, usure, rebut).
**Phase potentielle** : Phase B ou C
**Au MVP** : retour = remise en stock simple (99% des cas), ajustements
manuels si nécessaire via actions séparées (rebut partiel, note)

### [NOUVEAU] KPI détaillés des retours et indemnisations

**Description** : taux de retour, taux d'indemnisation, marge nette
ajustée, raisons principales, montant moyen.
**Phase potentielle** : Phase B, après collecte de données

### [NOUVEAU] Démonte-pneus pour jantes acier

**Description** : acquisition d'équipement permettant de détacher les
pneus des jantes en acier. Ouvrirait la possibilité de vendre pneus et
jantes séparément (comme pour les jantes cosmétiques).
**Nature** : investissement physique, pas fonction logicielle
**Valeur** : potentiellement élevée (diversification ventes)

### [NOUVEAU] Dashboard admin — état des ancres

**Description** : écran admin pour visualiser l'état des 50 ancres de
numérotation (pointeur actuel, zone, codes consommés, ancres actives
vs verrouillées). Alerte automatique si < 10 ancres actives.
**Phase potentielle** : MVP si simple, Phase B sinon
**Lié à** : ADR-004 numérotation

### [NOUVEAU] Assistant de pricing intelligent pour acheteurs

**Description** : modèle prédictif entraîné sur les données historiques
propres (`app_native` uniquement) qui suggère une fourchette de prix
d'achat pour un kit caractérisé : "bon prix", "acceptable", "plafond".
Utilisable terrain pendant la négociation. Permettrait de déléguer
l'achat à des acheteurs moins expérimentés que Mika.
**Phase cible** : Phase C (Module 7 — IA)
**Prérequis** : minimum 12-18 mois de données app_native, volume
critique (~500+ achats avec prix granulaire)
**Architecture préparée dès MVP** : données granulaires par kit
(Modèle 3.5), prix alloué par kit (ADR-008), tiering (ADR-002)

### [NOUVEAU] Portail d'estimation à distance pour vendeurs

**Description** : formulaire public où des vendeurs potentiels saisissent
photos + mesures. Le système renvoie une estimation de prix d'achat. Mika
reçoit une notification des opportunités qualifiées. Inverse le flux
commercial (ils viennent à Mika plutôt que l'inverse).
**Phase cible** : Phase C ou D
**Valeur stratégique** : transition vers "Amazon du pneu usagé"

### [NOUVEAU] Saisie conversationnelle voice-to-data

**Description** : bouton microphone sur les formulaires de saisie.
L'utilisateur dicte (ex: "Michelin 225/65r17 hiver 9 millimètres"),
l'IA extrait les données et pré-remplit les champs, l'utilisateur
valide ou corrige. Utilisable à plusieurs points du workflow :
acquisition, caractérisation, consultation.
**Exemples** :
- Terrain : *"J'ai un lot de 15 kits pour 2200$"* → crée 15 kits shells
- Entrepôt : *"Kit 1 = Michelin 225/65r17 hiver 8mm"* → remplit le kit
- Consultation : *"Combien j'ai payé en moyenne pour des Michelin hiver?"*
**Phase cible** : Phase B (tôt) ou C
**Technique** : APIs modernes (Whisper + Claude API)
**Lié à** : ADR-010

### [NOUVEAU] Enrichissement progressif des kits

**Description** : les kits peuvent exister avec des attributs partiels.
Statuts intermédiaires : `shell` → `description_partielle` →
`caracterise` → `en_stock`. Photos et détails ajoutés au fil de l'eau.
Prix d'achat alloué plus tard (après négociation finalisée).
**Phase cible** : MVP+ ou Phase B (à discuter)
**Note** : architecture déjà préparée par modèle de données nullable

### [NOUVEAU] Initiation d'achat / Work Order

**Description** : nouveau statut de Lot : `en_prospection` /
`en_negociation`. Création d'un Work Order pendant la négociation
avant paiement. Génère automatiquement les codes de la plage réservée
pour étiquetage physique pendant la visite. Tracking multi-dimensionnel :
financier + physique + géographique + rôles.
**Phase cible** : Phase B
**Lié à** : questions-ouvertes.md (question "Initiation d'achat")

### [NOUVEAU] Pneus récupérés gratuitement — source d'acquisition

**Description** : permettre de marquer un lot comme ayant une source
d'acquisition "gratuit" (pneus trouvés, donnés par un ami mécanicien,
récupérés sans transaction). Distinct d'un lot acheté à 0$, car ça
permet de catégoriser les acquisitions dans les rapports.

**Workaround MVP** : créer un lot avec prix d'achat 0$. Fonctionne
mais ne permet pas de distinguer un lot "bonus commercial" d'un lot
"trouvé" dans les statistiques.

**Valeur** : moyenne (utile pour analyses de sources d'acquisition)
**Complexité** : basse (nouveau champ sur Lot)
**Phase potentielle** : Phase B

---

### [NOUVEAU] Échanges de services / troc

**Description** : gérer les cas où des pneus sont échangés contre un
service (plomberie, réparation, etc.) sans argent qui change de
mains. Nécessite une valorisation comptable du service reçu.

**Workaround MVP** : traiter comme un cadeau (statut `donne` avec
note) + comptabiliser manuellement dans QuickBooks.

**Valeur** : faible (très rare)
**Complexité** : haute (valorisation comptable, multi-parties)
**Phase potentielle** : Phase C, si fréquence augmente

---

### [NOUVEAU] Sortie non-vendue avec sous-catégorisation

**Description** : enrichir l'action "Donner" du MVP avec des
sous-catégories (cadeau familial, promotion marketing, cadeau
client, usage personnel) pour analyses fines. Au MVP, l'action
"Donner" existe avec note libre seulement.

**Valeur** : moyenne (utile pour analyses fiscales)
**Complexité** : basse (liste déroulante + règles de catégorisation)
**Phase potentielle** : Phase B

**Lien** : feature MVP de base introduite dans le Paquet 2 (question
D). L'enrichissement concerne uniquement la sous-catégorisation.

---

### [NOUVEAU] Motif de vente à perte volontaire

**Description** : permettre de marquer une vente comme "vente à perte
volontaire" avec motif (liquidation saisonnière, défaut découvert
tardivement, kit stagnant). Au MVP, le système détecte
automatiquement les ventes à perte par calcul (prix < coût alloué)
mais sans catégorisation du motif.

**Valeur** : moyenne (utile pour analyses stratégiques)
**Complexité** : basse (champ optionnel)
**Phase potentielle** : Phase B

**Décision MVP** : rejeté au MVP — Mika considère que "c'est toujours
une vente à perte", peu importe le motif. Le chiffre parle de
lui-même. À revisiter si les analyses futures révèlent un besoin.

---
