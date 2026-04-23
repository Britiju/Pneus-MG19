# Questions ouvertes

## Pourquoi ce document existe

Pendant le cadrage du projet, plusieurs sujets ont été **soulevés mais
pas tranchés**. Ils ne relèvent pas du backlog (qui contient des
idées d'évolution) ni des ADR (qui contiennent des décisions
formelles). Ce sont des **questions** qui attendent soit plus
d'information, soit un moment opportun pour être discutées.

Ce document est la **mémoire persistante** des sujets non tranchés.
Il évite qu'une question importante ne soit oubliée parce qu'elle
n'avait pas sa place dans un autre document.

## Comment utiliser ce document

- **Ajouter** une entrée chaque fois qu'une question est soulevée sans
  être tranchée
- **Mettre à jour** une entrée quand de nouveaux éléments éclairent la
  question
- **Archiver** une entrée quand la question est tranchée (déplacer
  vers le backlog si c'est une idée, vers un ADR si c'est une
  décision)

Chaque entrée suit cette structure :
- **Question** : la question posée
- **Contexte** : ce qui a mené à la question
- **Dimensions à considérer** : les facteurs à évaluer
- **Quand la trancher** : à quel paquet ou à quelle phase
- **Dernière discussion** : date de la dernière réflexion

---

## Questions ouvertes actuelles

### Q1 — Initiation d'achat / Work Order

**Question** : Comment modéliser la phase pré-acquisition d'un lot
(prospection, négociation) dans le système?

**Contexte**

Quand Mika identifie un lot potentiel chez un fournisseur, il y a une
phase de négociation qui peut durer de quelques heures à plusieurs
jours. Pendant cette phase :

- Le lot n'est pas encore physiquement possédé
- Des codes peuvent être réservés en avance (pour étiquetage anticipé
  lors d'une visite)
- Des engagements financiers peuvent exister (acompte versé)
- La localisation physique est chez le fournisseur, pas encore chez
  Mika
- Des rôles multiples peuvent être impliqués (qui négocie, qui va
  ramasser)

Le modèle actuel traite un lot comme existant dès son acquisition. Il
ne capture pas la phase amont.

**Dimensions à considérer**

- **Financière** : engagements, acomptes, prix négocié (différent du
  prix final payé?)
- **Physique** : localisation des pneus (chez fournisseur, en transit,
  chez Mika)
- **Statuts** : "en prospection", "en négociation", "accord en cours",
  "confirmé"
- **Rôles** : qui a trouvé, qui négocie, qui ramasse, qui paie
- **Temporel** : délais typiques, deadlines

**Questions secondaires**

- Les codes réservés pendant la négociation sont-ils "voided" si
  l'achat tombe à l'eau?
- Comment calculer les KPI de conversion (lots évalués vs achetés)?
- Faut-il un module dédié "Prospection" ou intégrer au Module 2
  (Inventaire)?

**Quand la trancher** : Paquet 3 (données historiques) ou Paquet 4
(mécaniques de vente), selon la pression business.

**Dernière discussion** : Paquet 1, identifié comme hors-scope du
paquet en cours.

---

### Q2 — Liste exhaustive des champs sensibles (Principe 8)

**Question** : Quels sont exactement les champs considérés "sensibles"
au sens du Principe 8 (Protection des données sensibles)?

**Contexte**

Le Principe 8 stipule : "Les champs identifiant unique et à impact
business ne sont jamais éditables en mode saisie normale."

Cette définition reste large. Pour l'implémentation, il faut une
liste précise.

**Dimensions à considérer**

- Champs **identifiants** : `display_code`, `lot_id`, `kit_id`,
  `uuid`, `internal_id`
- Champs **financiers** : `prix_achat_total`, `prix_achat_alloue`,
  `prix_vente_affiche`, `prix_vente_effectif`, montants des
  remboursements et indemnisations
- Champs **temporels** : `date_acquisition`, `date_vente` (une fois
  la vente committed)
- Champs **relations** : `lot_id` sur un kit, `kit_id` sur une
  variante (liens vers le parent)
- Champs **statut** : `statut` des entités (modifiables via workflows
  de transition, mais pas directement)

**Quand la trancher** : avant le début du développement MVP (Phase 4
design technique).

**Dernière discussion** : Paquet 1, principe énoncé sans liste
formelle.

---

### Q3 — Rendez-vous clients liés aux items

**Question** : Comment gérer les rendez-vous avec les clients (essais,
livraisons) en lien avec les items de l'inventaire?

**Contexte**

Quand un client demande à essayer des pneus ou à venir les chercher,
il y a un rendez-vous qui pourrait être structuré dans l'app. Cela
ouvrirait des possibilités :

- Pipeline de ventes visible
- Réservation automatique de l'item (statut "réservé" pendant le
  rendez-vous)
- Suivi des rendez-vous non honorés
- Relation avec le futur Module 6 (CRM)

**Dimensions à considérer**

- Capture minimale au MVP (champ texte libre?) ou structure complète?
- Lien avec le CRM (Q1 relié à la notion plus large de CRM)
- Statut "réservé" vs "en vente" sur un kit
- Impact sur le dashboard B (alertes rendez-vous à venir)

**Quand la trancher** : Paquet 4 (mécaniques de vente).

**Dernière discussion** : Paquet 1, différé.

---

### Q4 — Seuils d'alerte de stagnation par saison

**Question** : Quels sont les seuils précis qui déclenchent une alerte
"item stagnant anormalement" dans le Dashboard B?

**Contexte**

L'analyse des 607 données historiques montre des temps de vente
moyens très différents par saison :

- Pneus d'hiver : ~161 jours
- Pneus d'été : ~98 jours

Un seuil uniforme (ex: "alerte après 180 jours") est inadapté : il
alerterait sur des pneus d'hiver normaux et raterait des pneus d'été
vraiment stagnants.

**Dimensions à considérer**

- Saisonnalité des seuils
- Effet marque / taille sur les temps de vente
- Définition de "stagnant anormalement" : percentile 75? 90?
- Alertes trop fréquentes = ignorées (fatigue d'alerte)

**Quand la trancher** : Paquet 6 (dashboard).

**Dernière discussion** : Paquet 1, mentionné pendant l'analyse de la
saisonnalité.

---

### Q5 — Migration des codes legacy au nouveau système

**Question** : Les codes legacy (1A, V01, etc.) sont-ils migrés vers
le nouveau format (A001, A002, etc.) ou conservés tels quels?

**Contexte**

ADR-004 stipule que les 3 conventions cohabitent (legacy 2025, legacy
2026, nouveau système). La distinction de format lève les ambiguïtés
à la recherche.

Cependant, la question "faut-il quand même migrer pour uniformiser?"
reste ouverte.

**Arguments pour conservation** :
- Traçabilité historique (le code original reste celui écrit sur les
  pneus)
- Aucun coût de migration
- Pas de risque de confusion avec les identifiants physiques

**Arguments pour migration** :
- Uniformité visuelle dans les rapports
- Simplicité des exports et intégrations futures

**Quand la trancher** : Paquet 3 (données historiques).

**Dernière discussion** : Paquet 1, ADR-004 laisse la cohabitation
comme décision officielle, mais la question de "forcer la migration
plus tard" reste ouverte.

---

### Q6 — Gestion de la date de vente après retour

**Question** : Quand un kit est retourné et remis en stock, puis
revendu, quelle est sa "date de vente" dans les rapports?

**Contexte**

Si un kit est vendu le 10 mars, retourné le 15 mars, et revendu le
20 avril, quelle date utiliser pour :

- La comptabilité du mois de mars vs avril?
- Le calcul du "time-to-sell"?
- Les rapports par période?

**Deux approches possibles**

- **Dernière vente** : la date effective est le 20 avril
- **Première vente** : la date initiale est le 10 mars, les
  événements correctifs sont ajustements

**Impacts**

- Les rapports mensuels vont être différents selon l'approche
- L'analyse de saisonnalité peut être biaisée
- La cohérence avec QuickBooks (Phase C) doit être vérifiée

**Quand la trancher** : Paquet 2 (finances), avant fin de cadrage.

**Dernière discussion** : non encore soulevée explicitement —
identifiée comme conséquence du cadrage des événements post-vente
(ADR-006).

---

## Questions archivées

*Cette section accueillera les questions tranchées au fil du temps,
avec référence à l'ADR ou au document qui les a tranchées.*

(Aucune question archivée pour l'instant.)

---

## Historique des mises à jour

- **Paquet 1 (cadrage initial)** : création du document, ajout de Q1
  à Q6.
