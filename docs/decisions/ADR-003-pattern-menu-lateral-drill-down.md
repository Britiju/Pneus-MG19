# ADR-003 — Pattern UX : Menu latéral + Home avec drill-down

## Statut

Acceptée — Phase 1 de cadrage. À valider en Phase 3 (UX Designer) avec
des mockups concrets.

## Contexte

Quatre patterns UX modernes ont été considérés pour organiser la
navigation de l'application :

1. **Onglets** (ex: Google Analytics ancien)
2. **Menu latéral** (ex: Linear, Notion, Stripe)
3. **Home + drill-down** (ex: Apple Health, Mint)
4. **Dashboard unifié scrollable** (ex: Vercel)

Le projet doit accueillir potentiellement 7 modules (3 au MVP, 4 en
phases ultérieures), ce qui impose une navigation scalable.

## Décision

Le pattern retenu est une **combinaison** :

- **Menu latéral gauche** pour la navigation principale entre les 7
  modules
- **Page d'accueil** utilisant le pattern **cartes de drill-down** pour
  accéder aux 3 sous-dashboards (A, B, C) depuis le Module 1

## Justification

### Menu latéral

- Standard absolu des apps SaaS modernes depuis 2020
- Scale naturellement à 10+ modules
- État permanent visible (l'utilisateur sait où il est)
- Se transforme en hamburger sur mobile (bien accepté)

### Drill-down sur la home

- Vision synthétique à l'ouverture de l'app (KPIs visibles
  immédiatement)
- Cartes cliquables pour zoomer sur chaque sous-dashboard
- Hyper moderne, style apps finance 2024-2026
- Permet de visualiser la roadmap (cartes Phase B en grisé)

### Rejet des alternatives

- **Onglets** — limité à ~5 sections, ne scale pas à 7+
- **Dashboard unifié scrollable** — devient trop long avec le volume
  de données, pas adapté aux 3 sous-dashboards distincts
- **Home + drill-down seul sans menu** — pas scalable au-delà de la
  page d'accueil

## Conséquences

### Positives

- Architecture de navigation pérenne pour toute la durée du projet
- Ajout de nouveaux modules = nouvelle entrée dans le menu, zéro
  refonte
- Cohérence avec les attentes des utilisateurs modernes

### Négatives

- Le menu latéral consomme de l'espace sur mobile (mitigé par le
  hamburger)
- Deux niveaux de navigation à apprendre (menu + cartes drill-down)

## Validation attendue

Cette décision sera **validée ou ajustée en Phase 3** (UX Designer)
avec des mockups concrets et éventuellement un test utilisateur.

## Références d'inspiration

Apps dont l'UX a été étudiée :

- **Linear** — menu latéral, palette de commandes, KPIs en home
- **Notion** — navigation hiérarchique dans le menu latéral
- **Stripe Dashboard** — cartes de drill-down, KPIs en haut
- **Vercel** — home avec cartes par projet, drill-down
- **Mint** (archivé) — dashboard finance avec drill-down

## Auteur

Recommandation proposée lors de la Phase 1, à valider formellement en
Phase 3 UX.

---
