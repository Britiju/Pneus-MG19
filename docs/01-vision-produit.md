# Vision produit

## Problème à résoudre

Mika opère aujourd'hui son business de revente de pneus usagés via un
fichier Excel et une méthode artisanale basée sur sa mémoire personnelle.
Cette approche fonctionne à petite échelle mais présente trois limitations
structurelles :

1. **Dépendance au propriétaire** — Toute la connaissance du stock, des
   clients, des fournisseurs et des décisions de pricing réside dans la
   tête de Mika. Aucune délégation n'est possible sans formation intensive.

2. **Processus chronophage et fragmenté** — Chaque étape (inspection,
   transcription, création d'annonces, suivi des leads) est manuelle
   et nécessite de jongler entre plusieurs outils (cahier papier, photos
   cellulaire, Excel, Messenger).

3. **Absence d'insights analytiques** — Les données existent mais ne
   permettent pas de répondre facilement à des questions stratégiques
   comme "quelles marques sont les plus rentables?", "quel lot a le
   meilleur ROI?", "quels items stagnent anormalement?".

## Solution proposée

Une plateforme web qui structure l'ensemble du cycle de vie d'un lot
de pneus, de l'acquisition à la vente, tout en produisant des tableaux
de bord analytiques en temps réel.

La plateforme est conçue selon neuf principes directeurs.

### Les 9 principes directeurs

**Principe 1 — Aucune feature ne ralentit le workflow actuel**

Toute fonctionnalité ajoutée doit soit réduire, soit conserver le temps
de traitement actuel. Une feature qui allonge le processus, même pour
un bénéfice analytique futur, est rejetée.

**Principe 2 — Scope MVP figé**

Les idées hors-scope identifiées pendant le développement sont capturées
dans `docs/backlog.md`. Aucune n'est intégrée au MVP sans passer par une
évaluation explicite.

**Principe 3 — Données historiques et nouvelles séparées par tiering**

Les données importées depuis l'Excel historique et celles saisies dans
la nouvelle app sont distinguées par un champ `data_quality_tier` et
affichées dans des vues dashboards séparées par défaut.

**Principe 4 — Architecture modulaire**

Chaque module est indépendant et remplaçable. Le MVP se concentre sur
les modules essentiels (Dashboard, Inventaire, Finance) et les modules
futurs s'ajoutent sans nécessiter de refactor.

**Principe 5 — Mobile-first responsive web**

L'application est une webapp responsive optimisée d'abord pour mobile,
pas une app native. Accessible depuis navigateur sur tous appareils.

**Principe 6 — La technologie suit le besoin réel**

Pas de complexité technique pour "faire mieux" si ça ne sert pas un
usage concret. Une feature techniquement élégante qui complique le
workflow terrain sans valeur business immédiate est rejetée. Exemple
d'application : garder les marqueurs manuels au lieu d'imposer des
étiquettes imprimées au MVP.

**Principe 7 — Scalabilité latente**

Chaque décision technique doit servir le présent tout en ne fermant
aucune porte vers le futur. La vision long terme est un "Amazon du
pneu usagé" avec potentiellement des centaines de milliers d'items
par an. Aucun choix d'architecture ne doit nécessiter une migration
douloureuse plus tard.

**Principe 8 — Protection des données sensibles**

Les champs identifiant unique (codes, IDs, références) ne sont jamais
éditables en mode saisie normale. Toute modification passe par un
workflow explicite qui demande confirmation, demande la raison,
journalise l'événement et vérifie les permissions. Ce principe
s'applique aux codes d'étiquettes, aux prix d'achat, aux liens entre
entités, et à tout champ ayant un impact business ou comptable.

**Principe 9 — Immutabilité des faits engagés**

Les données représentant des faits historiques engagés (ventes,
rebuts, détachements, paiements) ne peuvent jamais être modifiées ni
effacées après leur création. Les corrections d'erreurs sur du
"committed" passent par des actions correctives explicites qui créent
de nouveaux événements plutôt que de modifier les originaux. Aucune
suppression physique n'est faite — toute "suppression" est un
changement de statut (soft delete) qui reste traçable.

## Objectif long terme

Libérer Mika de l'ensemble des activités opérationnelles répétitives
pour lui permettre de se concentrer sur les décisions stratégiques,
puis permettre au business de scaler vers une plateforme commerciale
ambitieuse ("Amazon du pneu usagé") gérant des volumes importants sans
refactor architectural.

## Non-objectifs

Ce que ce projet n'est **pas** :

- Un ERP complet concurrent à QuickBooks ou SAP
- Une marketplace publique ouverte aux clients finaux (au MVP)
- Un outil de e-commerce avec paiement en ligne au MVP
- Un clone de Marketplace Facebook
- Un outil généraliste pour d'autres commerces de pièces automobiles

## Critères de succès du projet global

Le projet est considéré comme un succès si, après 12 mois d'utilisation :

- Mika peut déléguer l'ensemble de la saisie et du suivi à un partenaire
  ou employé sans perte de qualité
- Les décisions de pricing et de rachat sont prises à partir de données
  structurées, non plus d'intuitions
- Le temps moyen entre l'acquisition d'un lot et sa première mise en
  vente est réduit d'au moins 50%
- Les ventes par canal, par saison, par marque sont mesurées en
  continu et disponibles sans effort

## Audience de ce document

- Le propriétaire (source de vérité pour les décisions scope)
- Les partenaires collaborant au projet
- Claude Code, qui s'appuie dessus pour comprendre l'intention derrière
  chaque feature
- Tout futur contributeur au projet

---
