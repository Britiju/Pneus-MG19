# Sommaire Paquet 5 — Utilisateurs et permissions (fermeture)

**STATUT : EXÉCUTÉ**
**Date** : Avril 2026
**Durée session** : ~2 heures (dans une session plus longue qui a aussi
commencé le cadrage du Paquet 3 avant de basculer sur le Paquet 5)

## Objectif du paquet

Trancher le modèle de rôles et d'accès au MVP, en tenant compte des
partenaires occasionnels et de la séparation des responsabilités entre
Patrick (admin) et Mika (power user quotidien).

## Décisions prises

### Révision d'ADR-007

Le principe "accès 100% ouvert" défini dans ADR-007 est **précisé** (pas
annulé) par ADR-016. L'accès reste ouvert mais dans le périmètre du rôle.
Le principe fondamental "protection par traçabilité" reste le fondement.

### Modèle à 2 rôles hardcodés au MVP

- `admin` : Patrick. Superset du power user + actions système.
- `power_user` : Mika + partenaires occasionnels. Accès aux opérations
  quotidiennes.

### Stratégie de scalabilité en 4 paliers

1. MVP : 2 rôles hardcodés
2. Phase B early : 3 rôles hardcodés (ajout de `partenaire`)
3. Phase B/C : interface d'assignation des rôles
4. Phase tardive : permissions granulaires feature-par-feature

### Matrice rôle × action

Documentée en détail dans ADR-016. Tranche chaque action applicative entre
"admin seul", "les deux", ou "personne" (soft delete).

### Pattern "Notification admin asynchrone"

Invention de la session. Cinq actions sensibles mais opérationnelles
(correction de code, cadeau, rebut à valeur, annulation de vente,
indemnisation) déclenchent un email immédiat vers l'admin sans bloquer
l'action. Évolution backlog : digest quotidien en Phase B.

### Inscription, désactivation, récupération

- Inscription par invitation (admin seul peut inviter)
- Désactivation par admin ; actions passées restent attribuées
- Récupération mot de passe : flux natif Supabase
- Premier compte admin : script de setup one-time

### Clarification terminologique

- "Propriétaires du projet" = Patrick + Mika
- "Admin système" = Patrick
- "Power user" = Mika + partenaires occasionnels

### Cas "Patrick absent"

Aucun mécanisme de délégation au MVP. Mika attend le retour. À réévaluer
si ça devient pénalisant.

## Livrables produits

1. ADR-016 créé
2. ADR-007 mis à jour avec note de révision
3. Backlog enrichi (4 entrées)
4. CLAUDE.md mis à jour (propriétaires, utilisateurs, navigation)
5. questions-ouvertes.md : note de mise à jour, aucune Q ajoutée
6. Ce sommaire
7. Journal d'avancement mis à jour

## Patterns de collaboration observés

- Patrick a pris l'initiative de challenger sa propre décision antérieure
  (ADR-007). L'assistant avait tendance à rester dans le cadre déjà posé ;
  c'est Patrick qui a ouvert le recalibrage.
- Patrick a inventé le pattern "notification admin asynchrone" pendant la
  session. L'assistant l'a formalisé et élargi.
- À un moment, l'assistant a empilé 3 questions en une — Patrick a rappelé
  "une question à la fois" (pattern #1 du protocole de sessions). Bien
  vu.
- L'assistant a failli produire des livrables incohérents en mélangeant le
  Paquet 5 avec la question de tiering opérationnel soulevée par Patrick.
  Bonne récupération en proposant de fermer Paquet 5 d'abord.

## Prochaine étape

La question soulevée par Patrick à la fin du Paquet 5 — "comment les kits
legacy se comportent dans les workflows app-native ?" — devient la prochaine
étape à traiter. C'est un sujet qui appartient au Paquet 3 mais qui peut
être attaqué sans les données historiques manquantes (contrairement à Q5
qui, elle, les requiert).

Le Paquet 3 complet reste bloqué en attente que Patrick rassemble les
fichiers historiques manquants. La nouvelle question sur la portée du
tiering ouvre un "Paquet 3A" ou une question ouverte Q10 — à trancher en
prochaine session.
