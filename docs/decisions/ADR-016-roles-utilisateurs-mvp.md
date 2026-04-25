# ADR-016 — Rôles utilisateurs au MVP : admin + power_user

## Statut

Acceptée — Phase 1 de cadrage, Paquet 5.

**Supersède partiellement ADR-007.** Voir section "Relation avec ADR-007" en
fin de document.

## Contexte

ADR-007 avait tranché un accès 100% ouvert au MVP, avec protection par
traçabilité (journal d'événements immutable). Cette décision partait du
principe que tous les utilisateurs avaient un niveau de confiance et
d'enjeu équivalent.

Pendant le cadrage du Paquet 5, Patrick (admin système, VP opérations) a
reconnu que cette décision n'avait pas été poussée assez loin dans ses
conséquences opérationnelles :

- Patrick porte la responsabilité architecturale, financière, et système
- Mika (et les partenaires occasionnels) porte la responsabilité
  opérationnelle quotidienne
- Certaines actions (inviter des utilisateurs, configurer des intégrations,
  éditer des données historiques) ne devraient pas être accessibles à un
  power user, non pas par méfiance, mais parce qu'elles sortent du cadre
  opérationnel normal et qu'une erreur peut avoir des conséquences système

Le principe "protection par traçabilité" de ADR-007 reste valide et utile
— il devient juste un des deux piliers au lieu d'être le seul.

## Décision

### Structure à 2 rôles hardcodés au MVP

Deux rôles sont définis en dur dans le code :

**`admin`** : accès complet, superset de `power_user`. Un seul utilisateur
au MVP (Patrick).

**`power_user`** : accès aux opérations quotidiennes. Plusieurs utilisateurs
possibles (Mika + 1-2 partenaires occasionnels au MVP).

L'admin est un **surensemble** du power user — il peut faire tout ce que
fait un power user, plus les actions admin spécifiques. Ce n'est pas un
rôle distinct qui remplacerait le rôle power user ; c'est un rôle qui
s'ajoute par-dessus.

### Stratégie de scalabilité en 4 paliers

**Palier 1 (MVP)** : 2 rôles hardcodés (admin, power_user).

**Palier 1.5 (Phase B early, "juste après MVP")** : 3 rôles hardcodés
(admin, power_user, partenaire). Le rôle `partenaire` se distinguera du
power user sur des points à définir à ce moment-là (probablement : pas
d'accès aux marges, pas d'accès au dashboard financier global).

**Palier 2 (Phase B/C)** : interface d'assignation des rôles existants à
des utilisateurs via l'application. Les rôles et leurs permissions restent
préconfigurés. Seule l'assignation devient dynamique.

**Palier 3 (phase tardive)** : vrai système de permissions granulaires
feature-par-feature, une fois que l'application est stabilisée et que les
vrais patterns d'usage sont connus.

### Matrice rôle × action (Palier 1 MVP)

Chaque action applicative est catégorisée selon son rôle minimum requis.
"Les deux" signifie power_user ET admin (rappel : admin a tout).

#### Gestion des utilisateurs

| Action | Rôle | Notes |
|---|---|---|
| Inviter un nouvel utilisateur | admin | Via email d'invitation Supabase |
| Désactiver un utilisateur | admin | |
| Voir la liste des utilisateurs actifs | les deux | |
| Modifier son propre mot de passe / email | les deux | Via Supabase natif |
| Modifier le mot de passe / email d'un autre | admin | Cas exceptionnel |

#### Inventaire

| Action | Rôle | Notes |
|---|---|---|
| Créer un lot, un kit | les deux | |
| Modifier les champs descriptifs d'un kit non-finalisé (legacy ou app-native) | les deux | Statut non-final = `draft`, `en_stock`, `en_vente` |
| Modifier les champs descriptifs d'un kit finalisé | personne | Voir ADR-006 pour workflows correctifs |
| Changer le statut d'un kit | les deux | |
| Créer une variante | les deux | |
| Correction de code (workflow explicite) | les deux | **Notification admin** |
| Archiver un lot ou un kit | les deux | |
| Supprimer physiquement | personne | Soft delete systématique (ADR-005) |

#### Ventes et post-vente

| Action | Rôle | Notes |
|---|---|---|
| Enregistrer une vente | les deux | |
| Annuler une vente (erreur de saisie) | les deux | **Notification admin** |
| Retour (complet ou partiel) | les deux | |
| Indemnisation post-vente | les deux | **Notification admin** |
| Échange | les deux | |
| Modifier une vente déjà transmise à QuickBooks | admin | Phase C seulement |

#### Finances et pricing

| Action | Rôle | Notes |
|---|---|---|
| Voir prix d'achat, marges, profit | les deux | |
| Modifier le prix de vente affiché | les deux | |
| Modifier le prix d'achat alloué (workflow ADR-008) | les deux | |
| Voir le dashboard financier global | les deux | |
| Exporter les données financières | admin | Enjeu fiscal/comptable |

#### Clients et rendez-vous

| Action | Rôle | Notes |
|---|---|---|
| Créer, modifier un rendez-vous | les deux | |
| Modifier les infos d'un client | les deux | |
| Exporter les coordonnées clients en masse | admin | Enjeu Loi 25 |

#### Actions "sortie de stock sans vente"

| Action | Rôle | Notes |
|---|---|---|
| Donner un kit (cadeau) | les deux | **Notification admin** |
| Rebut total d'un kit à valeur d'achat > 0 | les deux | **Notification admin** |
| Rebut total d'un kit à valeur d'achat = 0 | les deux | Pas de notification |
| Rebut partiel | les deux | |
| Détachement jantes/pneus | les deux | |

#### Configuration système et intégrations

| Action | Rôle | Notes |
|---|---|---|
| Configurer l'intégration QuickBooks | admin | Phase C |
| Configurer l'intégration Google Calendar | admin | |
| Configurer les canaux de vente | admin | |
| Modifier les modèles d'emails/SMS de facturation | admin | |
| Modifier les seuils d'alerte du dashboard | admin | Affecte tout le monde |
| Configurer l'imprimante d'étiquettes | les deux | Opérationnel |

#### Audit et journal

| Action | Rôle | Notes |
|---|---|---|
| Voir le journal d'événements d'un kit/lot/vente | les deux | |
| Voir le journal d'activité complet d'un utilisateur | admin | |
| Exporter le journal complet | admin | |

#### Données et continuité

| Action | Rôle | Notes |
|---|---|---|
| Déclencher un export/backup manuel | admin | |
| Restaurer des données | admin | |
| Accéder aux logs techniques | admin | |

### Note sur les modifications de kits et lots historiques

La règle "les deux rôles peuvent modifier les champs descriptifs d'un kit
non-finalisé" s'applique **identiquement aux kits legacy et app-native**.
La distinction de tier n'affecte pas les droits d'édition — elle affecte
seulement l'affichage (indicateur discret sur la fiche) et les calculs
analytiques (voir ADR-017).

Cette règle révise explicitement une décision intermédiaire qui restreignait
les modifications de données `legacy_migrated` à l'admin seul. Cette
restriction a été jugée sacralisante d'erreurs historiques sans bénéfice
réel, étant donné qu'une modification sur un kit non-finalisé n'a aucune
conséquence externe (pas de facture émise, pas de revenu comptabilisé).

Le `display_code`, en revanche, reste toujours éditable via workflow
explicite uniquement, peu importe le tier et le statut (voir ADR-017 pour
le raisonnement détaillé).

### Pattern "Notification admin asynchrone"

Certaines actions sensibles mais opérationnelles ne bloquent pas le power
user mais déclenchent un email immédiat vers l'admin.

**Actions concernées au MVP** :

1. Correction de code (workflow explicite)
2. Donner un kit (cadeau)
3. Rebut total d'un kit à valeur d'achat > 0
4. Annulation de vente
5. Indemnisation post-vente

**Format au MVP** : un email par action, immédiat, envoyé à l'adresse
associée au compte admin.

**Contenu minimal de l'email** : nature de l'action, utilisateur qui l'a
déclenchée, entité concernée (kit/lot/vente avec son display_code),
horodatage, raison fournie si applicable, lien direct vers la fiche dans
l'app.

**Évolution backlog** : regroupement en digest quotidien configurable en
Phase B (voir entrée backlog correspondante).

### Inscription, désactivation, récupération

**Inscription de nouveaux utilisateurs** : par invitation uniquement.
L'admin dispose d'un écran "Inviter un utilisateur" dans l'application.
Un email d'invitation Supabase est envoyé au destinataire, qui clique le
lien et choisit son mot de passe. Son compte est créé avec le rôle
`power_user` par défaut (le rôle peut être changé par l'admin au palier 2
— au MVP, seul Patrick est admin, donc pas de question).

**Désactivation d'un utilisateur** : seul l'admin peut désactiver un
compte. Les actions passées de l'utilisateur désactivé **restent
attribuées à son nom** dans le journal d'événements (immutabilité —
ADR-005). L'interface peut afficher un indicateur discret
"(compte désactivé)" à côté du nom pour éviter la confusion lors des
consultations futures, mais l'attribution technique ne change pas.

**Récupération de mot de passe** : mécanisme natif Supabase. L'utilisateur
clique "Mot de passe oublié" sur l'écran de login, reçoit un email de
réinitialisation. Pas de passage par l'admin pour les resets de routine.
Si le flux échoue (email perdu, adresse obsolète, etc.), l'admin peut
intervenir directement en base Supabase — c'est un cas exceptionnel, pas
un workflow applicatif.

### Création du premier compte admin

Au déploiement initial de l'application, la base de données est vide.
Un **script de setup** exécuté une fois par Patrick crée le premier
compte admin (lui-même) directement en base. Après ça, tous les comptes
suivants passent par l'interface d'invitation normale.

Ce script sera à produire au moment du développement. Il doit être
idempotent ou protégé contre les ré-exécutions (erreur si un admin existe
déjà).

### Cas "Patrick absent"

Si Patrick est indisponible (vacances, maladie) et qu'une action admin
devient nécessaire, Mika attend le retour de Patrick. Aucun mécanisme de
délégation temporaire au MVP.

Si cette contrainte devient pénalisante à l'usage, le backlog prévoit
l'introduction d'un rôle "admin délégué" ou d'un second admin. Décision à
réévaluer après quelques mois d'utilisation réelle.

## Relation avec ADR-007

ADR-007 n'est **pas annulé**. Son principe fondamental — "protection par
traçabilité plutôt que par permissions granulaires" — reste le fondement
du modèle d'accès. Le journal d'événements reste complet et immutable.

Ce qui change :

- ADR-007 posait "accès 100% ouvert pour tous les utilisateurs
  authentifiés". ADR-016 précise : "accès ouvert **dans le périmètre du
  rôle** de l'utilisateur".
- Les arguments de ADR-007 (cercle restreint, volume faible,
  surveillance manuelle possible) restent valides pour le power user.
  Ils sont renforcés côté admin par une séparation des rôles système.

ADR-007 est mis à jour avec une note de révision en tête de document.

## Conséquences

### Positives

- Séparation claire des responsabilités opérationnelle vs système
- Protection renforcée des actions à impact structurel (intégrations,
  données historiques, gestion utilisateurs)
- MVP toujours livrable rapidement (2 rôles hardcodés, pas de
  complexité de gestion de rôles)
- Trajectoire claire vers palier 1.5, 2, 3 sans refactor majeur
- Pattern "notification admin asynchrone" = traçabilité proactive sans
  friction opérationnelle

### Négatives

- Légère complexité additionnelle au MVP (matrice rôle × action à
  respecter dans l'implémentation)
- Risque de fatigue de notification si le volume est mal calibré (à
  surveiller — seuil indicatif : si plus de 3-5 emails/jour en moyenne,
  revoir la liste des actions notifiantes)
- Cas "Patrick absent" non couvert au MVP (risque opérationnel assumé)

### Atténuations

- Matrice explicite documentée → pas d'ambiguïté d'implémentation
- Notifications par email immédiat simples à coder et à auditer
- Évolution vers digest quotidien prévue au backlog
- Principe d'immutabilité (ADR-005) préserve la traçabilité intégrale

## Alternatives considérées

1. **Rester sur ADR-007 tel quel** — rejeté par Patrick après réflexion,
   jugé "trop simple" au regard des conséquences réelles.
2. **Permissions granulaires feature-par-feature dès le MVP** — rejeté
   comme MVP killer (complexité disproportionnée pour le volume actuel).
3. **Rôle `partenaire` distinct dès le MVP** — rejeté faute de vision
   claire sur ce que les partenaires font vraiment. Reporté au palier 1.5
   "rapidement post-MVP".
4. **Notifications admin bloquantes (approbation requise)** — rejeté car
   contredit le Principe 1 (aucune feature ne ralentit le workflow).

## Décisions connexes

- Le modèle de données (`docs/06-modele-donnees.md`) devra intégrer un
  champ `role` sur la table utilisateurs au moment du développement.
- Le journal d'événements (ADR-005) capture déjà le `utilisateur` — pas
  de changement structurel, juste la cohérence avec le rôle à vérifier.
- Le flux d'invitation utilisateur utilisera le mécanisme d'auth natif
  de Supabase — à valider au moment du développement.
- ADR-017 précise la portée opérationnelle du tiering et les règles
  spécifiques de modification basées sur le statut du kit/lot.

## Auteur

Décision prise par Patrick pendant le cadrage du Paquet 5. L'assistant a
aidé à formaliser la matrice rôle × action et à identifier le pattern de
notification asynchrone. Patrick a challengé sa propre décision antérieure
(ADR-007) en reconnaissant qu'elle n'avait pas été poussée assez loin.
