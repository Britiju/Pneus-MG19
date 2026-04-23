# ADR-012 — Gestion des emplacements physiques au MVP

## Statut

Acceptée — Paquet 2, discussion connexe à la question B (marges).

## Contexte

Le business opère depuis plusieurs entrepôts (2 actuellement, 3
bientôt). Les kits se déplacent entre ces emplacements selon la
saisonnalité :

- Lots d'hiver → entrepôt principal pendant la saison hivernale
- Lots d'hiver → conteneurs (accès moins pratique) pendant l'été
- Lots d'été → entrepôt principal pendant la saison estivale
- Etc.

Aujourd'hui, cette gestion se fait manuellement via un deuxième
fichier Excel. Ça marche pour 2 entrepôts, ça ne scalera pas à 3.

Initialement, la gestion d'emplacements n'était pas dans le scope
MVP. Lors du Paquet 2, il est apparu que c'est un besoin suffisamment
critique pour être ajouté — même en version minimale.

## Décision

### Entité Emplacement au MVP

Ajout d'une entité `Emplacement` dans le modèle de données avec les
attributs minimaux :

- `emplacement_id` — identifiant technique (UUID + internal_id)
- `nom` — nom lisible (ex: "Entrepôt A", "Conteneurs", "Entrepôt C")
- `description` — texte libre optionnel (adresse, notes d'accès)
- `statut` — `actif` / `archive`
- `data_quality_tier` — hérité de la convention (voir ADR-002)

Les emplacements sont **créés et gérés par Mika lui-même**. Pas de
liste pré-définie. Pas de hiérarchie (pas de sous-emplacements au
MVP).

### Chaque kit a un emplacement actuel

Nouveau champ sur la table `Kit` :

- `emplacement_actuel_id` — référence vers l'emplacement actuel

**Comportement à la création** : l'app propose par défaut le dernier
emplacement utilisé (évite la friction quand Mika saisit une série
de kits). Il peut être changé.

### Événement `mouvement` dans le journal

Nouveau type d'événement dans le journal :

- `type_evenement` : `mouvement`
- Attributs : `kit_id`, `emplacement_source_id`, `emplacement_destination_id`,
  `timestamp`, `utilisateur`, `note` (optionnelle)

Chaque déplacement physique d'un kit d'un emplacement à un autre
génère un événement `mouvement`. L'historique complet des mouvements
est reconstruit depuis le journal.

### Mouvements en lot

L'interface permet de sélectionner **plusieurs kits simultanément**
et de les déplacer ensemble vers un nouvel emplacement.

**Cas d'usage principal** : déplacer 30 kits d'hiver vers les
conteneurs en une opération, au changement de saison.

**Implémentation** :
- Liste d'inventaire avec cases à cocher
- Bouton "Déplacer les kits sélectionnés"
- Modal demandant l'emplacement de destination
- Un seul événement en base par kit, mais groupement logique dans
  l'interface

### Filtre de recherche par emplacement

Dans la liste d'inventaire et la recherche, filtre disponible :
"Montre-moi tout ce qui est dans [Emplacement X]".

### Inventaire initial lors de la bascule

**Pas un inventaire massif le jour de la bascule.**

Stratégie retenue : capturer l'information d'emplacement **dès
maintenant** dans les Excel existants (avant même que l'app existe).
Le jour de la bascule, l'import utilise ces données. Pas de vide
à combler massivement.

Détails dans `docs/pratiques-pre-mvp.md`.

## Ce qui n'est PAS dans le MVP

Pour être clair sur la portée :

- **Pas de géolocalisation** (GPS, adresse structurée)
- **Pas de sous-emplacements** (rangée, étagère, position)
- **Pas d'automatisation** (scanner qui déclenche un mouvement
  automatique)
- **Pas de suggestions** (l'app ne propose pas "tu devrais déplacer
  ces kits")
- **Pas de capacité** (l'app ne connaît pas la capacité physique d'un
  emplacement)
- **Pas d'optimisation** (pas de suggestion de réarrangement)

Tout ça reste en **backlog** pour quand ce sera vraiment utile.

## Justification

### Pourquoi au MVP plutôt qu'en Phase B?

Trois raisons :

**1. Besoin immédiat** : avec 3 entrepôts en vue, le système à
plusieurs Excel ne fonctionne plus. Il faut une structure.

**2. Volume gérable** : 130 kits actuellement, capturable
manuellement dans les Excel existants avant la bascule. Pas un
chantier énorme.

**3. Peu coûteux techniquement** : une table, un champ sur Kit, un
type d'événement. Investissement raisonnable pour la valeur apportée.

### Pourquoi pas plus sophistiqué?

Le Principe 6 (la technologie suit le besoin réel) s'applique. Tant
que Mika n'a pas d'employé qui doit trouver rapidement un kit sans
le connaître, pas besoin de sous-emplacements. Tant qu'il n'y a pas
de scanner physique, pas besoin d'automatisation.

La structure MVP est **extensible** : on pourra ajouter des
sous-emplacements, de l'automatisation, de l'optimisation en Phase
B ou C sans refactor majeur.

## Conséquences

### Positives

- Fin du problème "deux Excel à maintenir"
- Traçabilité complète des mouvements (historique + audit)
- Support du scénario 3 entrepôts sans refactor
- Base pour features futures (optimisation saisonnière, etc.)

### Négatives

- Complexité accrue du modèle de données (une entité et un type
  d'événement de plus)
- Formation utilisateur : penser à saisir le mouvement quand on
  déplace physiquement des kits

### Atténuation

- Workflow de déplacement en lot réduit la friction pour le cas
  principal (changement saisonnier)
- Valeur par défaut intelligente (dernier emplacement utilisé)
  réduit la friction à la création de kits

## Alternatives considérées

1. **Pas de gestion d'emplacements au MVP** → rejeté, trop
   contraignant avec 3 entrepôts
2. **Emplacements structurés avec adresses GPS** → rejeté, pas de
   besoin
3. **Sous-emplacements (rangée/étagère)** → rejeté, pas de besoin,
   pas d'employé
4. **Automatisation via scanner** → rejeté, scanner pas dans le
   scope MVP (voir `docs/12-integration-physique-reseau.md`)

## Liens avec d'autres décisions

- **ADR-002** (tiering qualité données) : les emplacements suivent la
  convention `data_quality_tier`
- **ADR-005** (immutabilité) : les événements `mouvement` sont
  immuables, les corrections passent par de nouveaux événements
- **Principe 6** (la technologie suit le besoin réel) : on construit
  le minimum utile, pas l'optimum théorique
- **Principe 7** (scalabilité latente) : la structure permet
  l'extension sans refactor
- **`docs/pratiques-pre-mvp.md`** : capture de l'info dès maintenant
  dans les Excel existants

## Auteur

Décision ajoutée pendant le Paquet 2 après que Mika a identifié la
nécessité avec 3 entrepôts en vue. Initialement hors-scope MVP, mais
le besoin réel et la faisabilité technique ont justifié l'inclusion.

---
