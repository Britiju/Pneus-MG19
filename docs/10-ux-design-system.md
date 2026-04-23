# UX et design system

## Philosophie de design

Le projet suit trois principes UX directeurs :

### 1. Mobile-first responsive web

L'application est **une webapp responsive**, pas une app native. Elle
fonctionne dans un navigateur mobile, tablette ou desktop. Le design
est d'abord pensé pour mobile (iPhone/Android), puis adapté à des
écrans plus larges.

Ce choix évite la complexité d'une app native (stores, permissions,
updates) tout en offrant une expérience mobile optimale — suffisante
pour les besoins du projet.

### 2. Flat et fonctionnel

Esthétique moderne flat design, pas de gradients ni d'effets
décoratifs. Priorité à la lisibilité, la hiérarchie claire, les
espaces blancs généreux. L'interface doit ressembler aux SaaS modernes
(Linear, Notion, Vercel) plutôt qu'aux ERP traditionnels.

### 3. Workflow guidé plutôt que tableaux ouverts

Pour chaque tâche, l'utilisateur doit savoir **quoi faire maintenant**.
Les tableaux de bord ouverts (qui nécessitent de savoir quoi chercher)
sont réservés aux utilisateurs expérimentés. Pour les actions
quotidiennes, un flux étape par étape est préféré.

## Pattern retenu pour la navigation

**Menu latéral + Home avec drill-down**.

Référence : Linear, Notion, Vercel, Stripe Dashboard.

### Structure de navigation

- **Menu latéral gauche** avec les 7 modules (certains dégradés si
  non-actifs)
- **Zone de contenu principal** à droite qui affiche le module
  sélectionné
- **Page d'accueil** (sélection « Dashboard » dans le menu) affiche
  Dashboard B par défaut avec cartes de drill-down vers A, B, C

### Comportement responsive

- **Desktop** (> 1024px) : menu latéral toujours visible
- **Tablette** (768-1024px) : menu latéral rétractable
- **Mobile** (< 768px) : menu en hamburger, page d'accueil optimisée
  pour scrolling vertical

## Choix de couleurs

À définir en Phase 4 (UX Designer dédié). Principes directeurs :

- Palette limitée (3-4 couleurs principales)
- Couleurs sémantiques réservées aux alertes (vert = ok, jaune =
  attention, rouge = problème)
- Mode clair au MVP, mode sombre envisageable en Phase B

## Choix typographiques

À définir en Phase 4. Principes directeurs :

- Police sans-serif moderne (ex: Inter, IBM Plex Sans, Geist)
- Hiérarchie à 3 niveaux maximum (H1, H2, corps)
- Tailles généreuses pour la lisibilité mobile

## Composants UI réutilisables

Le projet utilisera un design system existant plutôt que de créer ses
composants from scratch. Candidats :

- **shadcn/ui** — collection de composants React copiables, très
  moderne
- **Radix UI** — primitives accessibles
- **Tailwind CSS** — utilitaires pour le styling

Décision finale en Phase 4.

## Règles de hiérarchie visuelle

Toute page suit cette structure :

1. **Titre** de la page (contexte)
2. **KPIs ou actions principales** (valeur immédiate)
3. **Contenu principal** (données, formulaires, listes)
4. **Actions secondaires** (exports, paramètres)

Cette structure aide les nouveaux utilisateurs à comprendre chaque
écran sans formation.

## Critères d'accessibilité MVP

- Contraste minimum AA (WCAG 2.1)
- Navigation clavier fonctionnelle
- Textes alt sur les images
- Tailles de police ajustables par le navigateur

## Prototypes et mockups

Les mockups détaillés de chaque écran sont produits en Phase 3 (UX
Designer dédié) avant implémentation. Le MVP ne commence pas sans
mockups validés pour :

- Page d'accueil (Dashboard B + cartes drill-down)
- Liste inventaire
- Fiche item détaillée
- Formulaire de saisie nouveau lot
- Page Dashboard A
- Page Finance

---
