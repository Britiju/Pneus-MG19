# ADR-014 — Rendez-vous au MVP

## Statut

Acceptée — Paquet 4 (mécaniques de vente).

## Contexte

Le workflow réel de Mika implique une dynamique complexe avec
plusieurs prospects en parallèle sur un même kit :

1. Plusieurs personnes contactent Mika sur Messenger pour un kit
2. Mika évalue les signaux d'achat, prend le téléphone des plus
   sérieux
3. Il peut prendre **plusieurs rendez-vous en parallèle** sur le même
   kit, arbitrant selon les prix négociés
4. Si le kit se vend, les autres rendez-vous sont annulés (avec
   proposition d'équivalents)

Aujourd'hui, cette dynamique est gérée via :
- Messenger pour les conversations initiales
- Google Calendar (tâches) pour les rendez-vous fermes
- Mémoire de Mika pour l'arbitrage

**Problème** : risque de conflits (deux prospects croient avoir
réservé le même kit), perte d'info (conversations qui se perdent),
friction cognitive pour Mika.

## Décision

### Entité RendezVous minimaliste

Création d'une nouvelle entité `rendez_vous` avec les champs :

- `rendez_vous_id` — identifiant technique (UUID + internal_id)
- `kit_id` — référence vers le kit concerné (obligatoire)
- `prenom` — texte libre (optionnel)
- `telephone` — texte (obligatoire — c'est le seuil d'entrée)
- `date_heure` — timestamp
- `prix_negocie_attendu` — décimal (optionnel, **non-éditable après
  saisie** — note de rappel)
- `statut` — enum `planifie` / `honore_vendu` / `honore_pas_vendu` /
  `no_show` / `annule`
- `notes` — texte libre
- `lien_google` — URL optionnelle (copie-collage manuel vers la
  tâche/événement Google)
- `data_quality_tier` — hérité
- Timestamps standards (`created_at`, `updated_at`)

### Plusieurs RDV possibles par kit

Un kit peut avoir **plusieurs `rendez_vous` actifs** en parallèle
(statut `planifie`). C'est intentionnel et reflète la réalité.

**Pas de statut `reserve` sur le kit**. Le kit reste `en_vente`
tant qu'il n'est pas vendu. Les RDV sont indicatifs, pas exclusifs.

### Statuts et transitions

- `planifie` → état initial quand Mika crée le RDV
- `honore_vendu` → le client est venu et a acheté (déclenche le
  workflow de vente du kit)
- `honore_pas_vendu` → le client est venu mais n'a pas acheté
- `no_show` → le client ne s'est pas présenté
- `annule` → le RDV a été annulé avant d'avoir lieu (par Mika ou le
  client)

**Transitions typiques** :
- `planifie` → `honore_vendu` (conversion)
- `planifie` → `honore_pas_vendu` (pas de conversion)
- `planifie` → `no_show` (absence)
- `planifie` → `annule` (annulation pré-RDV)

### Workflow "Vendu" depuis un RDV

Quand Mika clique "Vendu" sur une fiche RDV :

1. Le workflow de vente s'ouvre (formulaire de vente du kit)
2. Le prix négocié attendu (si renseigné) est affiché en référence
   non-éditable
3. Le prix de vente est saisi explicitement (Principe 11)
4. À la validation : RDV passe à `honore_vendu`, kit passe à `vendu`
5. Les autres RDV actifs sur ce kit reçoivent un signal visuel
   "à annuler ou rediriger"

### Écrans requis

**Vue "Mes RDV à venir"** (nouveau) :
- Liste chronologique des RDV `planifie`
- Information : kit, prénom/téléphone, date/heure, prix négocié
- Actions rapides : "Vendu", "Pas vendu", "No show", "Annuler"

**Section RDV sur la fiche d'un kit** :
- Liste des RDV actifs sur ce kit (prix négociés visibles pour
  arbitrage)
- Bouton "Créer un RDV pour ce kit"

**Indicateur visuel sur les listes d'inventaire** :
- Icône ou pastille signalant la présence de RDV actifs sur un kit

### Pas de synchronisation Google Calendar au MVP

**Scénario 1 retenu** : Google Calendar reste la source de vérité
visuelle des rendez-vous (où Mika voit son planning). L'app
contient les **fiches RDV structurées** (données business) mais pas
de sync technique.

**Double saisie acceptée au MVP** : Mika crée le RDV dans Google
Calendar (comme aujourd'hui) **et** dans l'app (pour les données
business).

**Mitigation** : un champ `lien_google` permet à Mika de copier
l'URL de sa tâche/événement Google dans la fiche RDV de l'app, pour
retrouver rapidement l'info.

### Affichage Google Calendar dans l'app (Option simple)

Une section "Calendrier" dans l'app affiche Google Calendar via une
**iframe** (sans développement). Mika voit son calendrier Google
directement dans l'app, sans quitter l'interface.

**Limitation** : lecture seule, pas de lien avec les kits.

**Alternatives plus riches** (API, sync bidirectionnelle) sont
explicitement hors scope MVP — voir `docs/13-integration-canaux-vente.md`.

## Justification

### Pourquoi une entité RendezVous (et pas juste des notes)

Le volume et la complexité de la gestion des RDV (plusieurs en
parallèle, arbitrage de prix, kits liés) dépassent ce que Mika peut
gérer mentalement à grande échelle. Structurer les RDV est
nécessaire pour scaler.

### Pourquoi pas de statut `reserve` sur le kit

La réalité de Mika est qu'un kit avec un RDV pris **reste vendable**
à un autre prospect qui offrirait mieux. Bloquer le kit serait
incohérent avec la dynamique réelle.

### Pourquoi téléphone obligatoire

Mika a défini la règle : "un client n'est pas dans le système avant
de s'être commis avec un numéro de téléphone et un rendez-vous". Le
téléphone est le seuil d'entrée dans le système.

### Pourquoi prix négocié non-éditable après saisie

Cohérent avec le **Principe 11 (engagement explicite sur données
sensibles)**. Le prix négocié est un engagement verbal avec le
prospect. Le modifier rétroactivement créerait de la confusion ou
des problèmes de traçabilité.

### Pourquoi pas de sync Google Calendar

Complexité technique élevée (OAuth, gestion des erreurs, conflits,
bidirectionnalité) pour un bénéfice MVP modeste. La double saisie
est acceptée temporairement. Décision à revisiter en Phase B selon
la pénibilité réelle.

## Conséquences

### Positives

- Gestion structurée des RDV multiples sur un même kit
- Arbitrage de prix facilité (visibilité des prix négociés)
- Traçabilité complète (historique des RDV par kit)
- Base pour les features Phase B (suggestions automatiques, rappels)
- Workflow de vente fluide depuis un RDV

### Négatives

- Double saisie avec Google Calendar
- Nouvelle entité à gérer techniquement
- Courbe d'apprentissage pour Mika (créer RDV dans l'app + Google)

### Atténuation

- Iframe Google Calendar dans l'app réduit le changement de contexte
- La double saisie est courte (quelques secondes)
- Phase B pourra apporter la sync si besoin

## Alternatives considérées

1. **Pas de RDV dans l'app, juste Google Calendar** — rejeté, perte
   de la structure business (prix négocié, lien avec kits)
2. **Statut `reserve` sur le kit** — rejeté, incohérent avec la
   dynamique réelle d'arbitrage
3. **Sync bidirectionnelle Google Calendar dès le MVP** — rejeté,
   complexité technique hors scope
4. **Entité `Client` distincte avec historique RDV** — rejeté au MVP
   (voir ADR-013), peut émerger en Phase B via fusion automatique
   par téléphone

## Impacts sur d'autres documents

- `docs/06-modele-donnees.md` : ajout de l'entité `rendez_vous`
- `docs/04-modules.md` : Module 2 (Inventaire) enrichi avec la
  gestion RDV
- `docs/backlog.md` : plusieurs features Phase B identifiées

## Auteur

Décision co-construite pendant le Paquet 4. Les itérations
successives (pipeline complet, réservation stricte, CRM léger) ont
été progressivement simplifiées par Mika jusqu'à la version
minimaliste retenue. Le modèle de "plusieurs RDV parallèles sans
réservation stricte" est une contribution directe de Mika qui
reflète sa pratique réelle.

---
