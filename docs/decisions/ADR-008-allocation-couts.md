# ADR-008 — Allocation des coûts d'achat d'un lot

## Statut

Acceptée — Paquet 2.

## Contexte

Quand Mika achète un lot, il paie un prix global pour l'ensemble.
Pour calculer la marge par kit, il faut allouer ce prix total entre
les kits du lot. Plusieurs stratégies d'allocation sont possibles
(égale, proportionnelle, manuelle) et chacune a des implications
sur la précision des marges et la charge de travail terrain.

Le risque central est le **biais d'ancrage** : si l'app pré-calcule
et affiche une valeur suggérée, Mika risque de la valider passivement
sans y réfléchir, même si elle est inexacte pour certains kits.

## Décision

### Stratégie : Hybride avec champs vides par défaut

**Comportement à la création d'un lot** :

- Les champs `prix_achat_alloue` de chaque kit sont **vides par défaut**
- L'app affiche en temps réel : somme actuelle des allocations vs prix
  total du lot, et l'écart restant
- Le bouton **"Valider"** est bloqué tant que `somme ≠ prix total` exactement

**Boutons raccourcis disponibles** :

- **"Diviser également entre kits"** — remplit chaque champ avec
  `prix_total / nombre_kits` (arrondi, l'écart centimétrique est
  assigné au dernier kit)
- **"Diviser proportionnellement aux pneus"** — remplit chaque champ
  proportionnellement au `quantite_pneus` de chaque kit
- **"Tout remettre à 0"** — efface tous les champs pour recommencer

**Édition manuelle** :

- Chaque champ est librement éditable
- Le calcul en temps réel s'actualise à chaque saisie
- Aucune valeur n'est imposée

**Règle de validation** :

- L'écart autorisé est **zéro** — pas de tolérance de $1 ou $0.01
- Si `somme ≠ prix_total`, le bouton Valider reste grisé avec message :
  *"Il reste X$ à allouer"* ou *"Tu as alloué X$ de trop"*

### Immutabilité après engagement

Une fois au moins un kit du lot vendu, l'allocation devient immuable
(principe ADR-005). Les corrections d'allocation sur un lot committed
passent par un "lot ajusteur" (événement séparé).

## Justification

**Champs vides** vs valeur suggérée :

- Élimine le biais d'ancrage (Principe 11)
- Force un choix conscient
- L'égalité est souvent la bonne réponse mais pas toujours — ne pas
  l'imposer silencieusement

**Boutons raccourcis** :

- Vitesse quand la répartition est évidente (Principe 1)
- Explicites et réversibles (pas de magie)

**Blocage sur écart** :

- Cohérence comptable stricte (Principe 9)
- Évite les marges calculées sur des données incomplètes
- L'affichage de l'écart en temps réel guide l'utilisateur sans bloquer
  sa saisie intermédiaire

## Conséquences

### Positives

- Marges fiables dès le premier lot
- Aucun biais d'ancrage possible
- Flexibilité totale pour les allocations non-uniformes (kits rares
  premium vs kits communs)
- Comptabilité préparée (alignement futur QuickBooks)

### Négatives

- Étape de saisie supplémentaire obligatoire vs une répartition
  automatique silencieuse
- Atténuation : les boutons raccourcis rendent ça rapide dans 80%
  des cas (Principe 13)

## Alternatives considérées

1. **Auto-égalité silencieuse** — rejeté car biais d'ancrage et fausse
   précision
2. **Proportionnel aux pneus automatique** — rejeté même raison
3. **Saisie libre sans validation de somme** — rejeté car marges
   incohérentes (somme ≠ prix total = données corrompues)
4. **Tolérance de $1** — rejeté car crée une zone grise comptable

## Auteur

Décision prise pendant l'audit Paquet 2, Question A.

---
