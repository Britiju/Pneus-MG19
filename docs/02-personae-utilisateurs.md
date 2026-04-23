# Personae utilisateurs

## Vue d'ensemble

Le projet est conçu pour trois types d'utilisateurs, avec des niveaux
d'accès et des besoins distincts. Au MVP, seul le premier persona est
activement servi — les deux autres sont pris en compte dans l'architecture
pour éviter les refactors futurs.

## Persona 1 — Mika, le propriétaire opérationnel (MVP)

**Rôle** : propriétaire et décideur unique du scope du projet.

**Niveau technique** : non-développeur, à l'aise avec Excel et les outils
web modernes (Marketplace, Messenger, email). Apprend rapidement les
nouveaux outils.

**Contextes d'utilisation** :

- Sur le terrain (chez un fournisseur) — depuis son téléphone, pour
  saisir l'inspection d'un lot. Mobile-first.
- À la maison ou au bureau — depuis un ordinateur, pour consulter les
  dashboards et mettre à jour les statuts.
- En déplacement — depuis son téléphone, pour répondre à un client qui
  demande "as-tu du 225/65r17 hiver?".

**Besoins principaux** :

- Vision synthétique de l'état du business à tout moment
- Recherche rapide dans l'inventaire depuis mobile
- Suivi automatique des marges par item et par lot
- Alertes sur les items qui stagnent anormalement
- Historique consultable des ventes et des fournisseurs

**Frustrations actuelles** :

- Transcription manuelle des notes terrain dans Excel
- Rédaction répétitive d'annonces Marketplace à la main
- Tri manuel des photos entre les lots
- Calcul de marge à la calculatrice mentale
- Mémoire humaine comme seul système de suivi

**Métrique de succès individuelle** :

Mika peut s'absenter une semaine du business et, à son retour, reprendre
le pilotage sans avoir perdu d'informations critiques.

## Persona 2 — Les partenaires occasionnels (MVP, accès limité)

**Rôle** : amis et collaborateurs qui aident Mika ponctuellement sur des
tâches spécifiques (inspection d'un lot, livraison à un client, prise
de photos).

**Niveau technique** : variable, certains sont très à l'aise avec les
outils numériques, d'autres moins.

**Contextes d'utilisation** :

- Aide ponctuelle lors de visites de lots importants
- Remplacement occasionnel de Mika pour une vente
- Support sur la préparation physique des pneus

**Besoins principaux** :

- Interface simple et guidée — pas de tableau Excel à décrypter
- Pouvoir saisir des items sans voir les données sensibles (marges,
  prix d'achat, volumes totaux)
- Accès limité aux actions qui leur sont confiées

**Considération de design importante** :

Mika a exprimé une préoccupation légitime sur la **visibilité des volumes
business** aux partenaires occasionnels. Le système doit permettre à un
partenaire d'utiliser l'app sans pouvoir déduire le chiffre d'affaires
mensuel de Mika. Cela influence deux choix architecturaux :

- **IDs opaques** : les codes d'étiquettes sont aléatoires (ex: `H3K`,
  `M7P`), non séquentiels, pour empêcher la déduction du volume total
- **Rôles utilisateurs dès le MVP** : même simple, une séparation
  "propriétaire" vs "partenaire" existe, avec masquage des données
  financières pour les partenaires

## Persona 3 — Les employés futurs (Phase C)

**Rôle** : hypothétiques employés à venir si le business scale, chargés
de l'exécution opérationnelle pendant que Mika se concentre sur la
stratégie.

**Niveau technique** : à définir au recrutement, mais potentiellement
minimal — le système doit être apprenable en quelques heures.

**Contextes d'utilisation** : essentiellement la saisie terrain, la
gestion des listings, la réponse aux leads.

**Besoins principaux** :

- Workflows guidés étape par étape (pas de tableaux de bord ouverts)
- Documentation intégrée à l'interface (tooltips, aide contextuelle)
- Validation automatique des données saisies pour éviter les erreurs
- Journal d'audit pour permettre à Mika de vérifier le travail

**Ce persona conditionne l'objectif "fool-proof"**

Même si aucun employé n'existe au MVP, chaque écran doit être conçu
comme si un nouvel employé allait l'utiliser demain matin sans
formation. C'est la métrique ultime de qualité du produit.

## Synthèse des implications

| Persona | Impact sur le MVP |
|---------|-------------------|
| Mika | Toutes les features du MVP sont pour lui |
| Partenaires | Système de rôles simple + IDs opaques obligatoires |
| Employés futurs | Pas de feature dédiée, mais chaque écran doit passer le test "apprenable en 15 minutes" |

---
