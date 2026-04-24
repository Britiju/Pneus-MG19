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

### Q7 — Stratégie de backup et continuité des données

**Question** : Quelle est la stratégie de backup, d'export et de
continuité d'activité pour les données du système?

**Contexte**

Supabase offre des backups automatiques (quotidiens avec rétention
selon le plan, point-in-time recovery sur le plan Pro). C'est une
base, mais plusieurs scénarios nécessitent une vraie discussion :

- **Erreur humaine** : un partenaire supprime par accident des kits.
  L'ADR-005 (immutabilité) et le soft delete systématique adressent
  largement ce risque, mais la politique doit être explicite.
- **Export des données** : capacité à sortir toutes les données dans
  un format portable (CSV, JSON, backup SQL) pour migration future,
  audit, comptable, obligation légale.
- **Compromission du compte Supabase** : une copie hors-Supabase
  protège des cas extrêmes (credentials volés, attaquant qui supprime
  le projet).
- **Panne prolongée de Supabase** : rare mais possible. Stratégie de
  continuité d'activité pendant 24-48h d'indisponibilité.
- **Backup des fichiers** (photos) : les photos stockées dans
  Supabase Storage ont des règles potentiellement différentes de la
  BD principale.
- **Archivage long terme** : quand une donnée devient réellement
  "vieille" (5 ans? 10 ans?), que fait-on? Archive froide?
  Suppression conforme aux obligations légales?

**Dimensions à considérer**

- **Fréquence** des backups hors-Supabase (quotidien, hebdomadaire?)
- **Destination** des backups (S3, Google Drive, disque local
  chiffré, plusieurs emplacements?)
- **Rétention** (combien de versions garder?)
- **Mécanisme d'export** intégré à l'app (bouton "télécharger mes
  données") ou script externe?
- **Test de restauration** (un backup qui n'a jamais été testé n'est
  pas un backup fiable)
- **Documentation du plan de reprise** (qui fait quoi en cas de
  panne?)
- **Chiffrement** des backups (surtout s'ils contiennent des données
  clients)
- **Conformité** aux obligations québécoises (Loi 25 sur les
  renseignements personnels, si applicable)

**Questions secondaires**

- Quelle politique de rétention par type de donnée (ventes
  immuables vs logs éphémères)?
- Faut-il un "mode hors-ligne" de l'app pour fonctionner pendant une
  panne Supabase?
- Les exports manuels par l'utilisateur sont-ils journalisés (qui a
  exporté quoi et quand)?

**Quand la trancher** : **après le Paquet 4** (mécaniques de vente),
avant le début du développement MVP. La structure complète de la BD
doit être connue pour définir une stratégie cohérente.

**Dernière discussion** : Paquet 2, identifié comme question
transversale non couverte par le cadrage initial.

---

### Q8 — Stratégie de bascule (migration, cohabitation, tests, formation)

**Question** : Comment on transitionne proprement du système actuel
(Excel) vers l'app, sans perte de données ni rupture opérationnelle?

**Contexte**

Le jour J de la mise en production de l'app, il faut gérer plusieurs
choses simultanément :

- Importer l'historique (607 enregistrements + données récentes)
- Établir les emplacements actuels de tous les kits
- Gérer une période de cohabitation Excel ↔ App (possible risque de
  divergence)
- Former Mika et les partenaires au nouvel outil
- Détecter rapidement les bugs qui pourraient corrompre des données

Sans plan explicite, le risque est une mise en production chaotique
avec perte de confiance dans l'outil.

**Sous-sujets à traiter**

**A — Migration des données**
- Structure de l'import Excel vers la BD
- Quels champs migrer, quels calculer, quels laisser vides
- Validation de l'import (vérification d'intégrité)
- Inventaire initial des emplacements (voir `docs/pratiques-pre-mvp.md`)

**B — Cohabitation**
- Combien de temps les deux systèmes cohabitent
- Quel système est la source de vérité pendant la transition
- Comment gérer les ventes qui arrivent pendant la transition
- Quand arrêter officiellement Excel
- Plan de retour en arrière si catastrophe

**C — Plan de test**
- Scénarios concrets à tester avant mise en production
- Qui teste et avec quels critères
- Gestion des bugs découverts en production

**D — Formation et onboarding**
- Comment Mika et les partenaires apprennent l'app
- Documentation opérationnelle
- Plan de support pour les premières semaines

**Quand la trancher** : dans un **Paquet de bascule dédié** (appelons-le
provisoirement Paquet 8), à traiter **entre la fin du cadrage
fonctionnel et le début du développement MVP**. Certaines pratiques
peuvent commencer dès aujourd'hui (voir `docs/pratiques-pre-mvp.md`).

**Dernière discussion** : Paquet 2, identifié comme préoccupation
critique pendant la discussion sur les emplacements. Insistance de
Mika sur l'importance de planifier plutôt que d'improviser.

---

### Q9 — Notes de crédit fournisseur rétroactives non-spécifiques

**Question** : Comment traiter les notes de crédit fournisseur qui ne
sont pas liées à un lot spécifique (ristournes annuelles, bonus de
fidélité, rebates volume, ajustements de fin d'année)?

**Contexte**

Les notes de crédit rétroactives sont des ajustements financiers qui
**ne correspondent à aucun lot ou kit précis**. Exemples :

- Ristourne annuelle de fidélité : le fournisseur t'envoie 300$ en
  fin d'année pour ton volume d'achat total
- Rebate volume : après un seuil d'achats atteint, remise appliquée
  sur les futures factures
- Ajustement commercial : correction d'une erreur fournisseur sur
  plusieurs lots

Ces ajustements diffèrent des retours fournisseur traités dans
l'ADR-009 (qui concernent un kit précis défectueux).

**QuickBooks offre une feature native pour ça** — "Vendor Credit" —
qui gère ces ajustements dans le flux comptable standard. La
question est : est-ce suffisant, ou l'app doit-elle avoir une
visibilité sur ces ajustements?

**Dimensions à considérer**

- **Séparation des rôles** (vision ADR integration-quickbooks) :
  QuickBooks = source de vérité comptable. Argument pour laisser
  ces notes uniquement dans QuickBooks.
- **Visibilité opérationnelle** : si on veut calculer le coût réel
  ajusté par fournisseur (incluant les ristournes annuelles), l'app
  a besoin de ces données.
- **Calcul de marge fournisseur** : les rapports comparant les
  fournisseurs entre eux seraient plus précis avec les notes de
  crédit incluses.
- **Complexité d'intégration** : remonter les Vendor Credits de
  QuickBooks vers l'app ajoute une couche bidirectionnelle.

**Questions secondaires**

- Les notes de crédit doivent-elles être visibles dans la fiche
  fournisseur de l'app, ou rester invisibles?
- Les rapports de marge par fournisseur doivent-ils être "brut"
  (sans notes de crédit) ou "net ajusté"?
- Y a-t-il un risque de double comptage si l'app et QuickBooks
  suivent tous les deux ces ajustements?

**Quand la trancher** : lors du **cadrage détaillé de l'intégration
QuickBooks** (avant la Phase C). Pas pertinent au MVP puisque
l'intégration QuickBooks n'existe pas encore.

**Dernière discussion** : Paquet 2 (finances), question D. Mika a
explicitement demandé de revisiter ce sujet plus tard, en
s'assurant que la robustesse du traitement soit équivalente au
reste du cadrage.

---

## Questions archivées

*Cette section accueillera les questions tranchées au fil du temps,
avec référence à l'ADR ou au document qui les a tranchées.*

(Aucune question archivée pour l'instant.)

---

## Historique des mises à jour

- **Paquet 1 (cadrage initial)** : création du document, ajout de Q1
  à Q6.
- **Paquet 2 (finances)** : ajout de Q7 (stratégie de backup et
  continuité des données).
- **Paquet 2 (finances, intermédiaire)** : ajout de Q8 (stratégie de
  bascule : migration, cohabitation, tests, formation).
- **Paquet 2 (fermeture)** : ajout de Q9 (notes de crédit fournisseur
  rétroactives non-spécifiques).
