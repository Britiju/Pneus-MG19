# ADR-018 — Réservation de la lettre T pour le prototype stealth

## Statut

Acceptée — avril 2026, dans le contexte de la création du
prototype d'apprentissage stealth.

**Amende** : ADR-004 (système de numérotation A247 avec 50 ancres).

## Contexte

Le projet a établi dans **ADR-004** un système de numérotation pour
les kits app-native, basé sur :

- Format `[1 lettre][3 chiffres]` (ex: `A247`)
- 50 ancres distribuées dans l'espace des 26 000 codes possibles
  (26 lettres × 1000 chiffres)
- Garantie d'unicité, opacité visuelle entre plages, scalabilité
  latente

Pendant le cadrage du Paquet 6 (avril 2026), un **prototype
d'apprentissage stealth** a été défini pour tester en conditions
réelles le workflow acquisition → photo → reconnaissance →
publication Marketplace, avant le développement du Module 4 (Saisie
mobile) et du Module 5 (Listing automatique) en Phase B.

Le prototype utilise un système de numérotation **distinct** :

- Format `T##-##` (ex: `T01-01`, `T01-02`, `T02-01`)
- T = préfixe Test
- Premier groupe de 2 chiffres = numéro de lot séquentiel
- Tiret = séparateur
- Deuxième groupe de 2 chiffres = numéro de kit dans le lot

Les codes du prototype seront migrés à terme dans le futur Module 2
en `data_quality_tier = legacy_migrated` avec un sous-marqueur
`legacy_source = stealth_test` (cohérent avec ADR-002 et ADR-017).

**Le risque à mitiger** : sans précaution, le système A247 final
pourrait générer des codes dans l'espace de la lettre T (T000 à
T999) qui entreraient en collision visuelle avec les codes du
prototype (T01-01, T02-03, etc.).

Bien que les formats soient techniquement distincts (4 caractères
sans tiret pour A247, 6 caractères avec tiret pour le stealth), une
collision visuelle dans les rapports, l'interface, ou les exports
créerait de la confusion et du risque opérationnel.

## Décision

**La lettre T est définitivement réservée aux codes du prototype
d'apprentissage stealth.**

Aucune ancre du système A247 (ADR-004) ne peut être placée dans la
zone T000-T999. Les 50 ancres du système A247 sont distribuées
dans les **25 lettres de l'alphabet excluant T**.

### Conséquence sur l'espace de codes A247

- Espace de codes A247 disponible : 25 lettres × 1000 chiffres =
  **25 000 codes** (au lieu de 26 000)
- Cette réduction est marginale par rapport au volume cible
- ADR-004 mentionne déjà que le Palier 2 (format de code différent,
  par exemple `AB247`) sera activé bien avant la saturation, ce qui
  rend la perte de 1000 codes négligeable

### Justification défensive

Même si les formats sont distincts (T01-01 ≠ T247), réserver toute
la lettre T élimine **tout risque d'ambiguïté visuelle** dans :

- L'interface utilisateur de l'app finale (un T### est forcément
  legacy stealth, jamais app-native)
- Les rapports financiers et analytiques
- Les exports CSV/Excel
- Les recherches dans l'inventaire
- Les conversations clients ("le kit T01-01" est sans ambiguïté)

Cette discipline défensive coûte 1000 codes (négligeable) pour
gagner une clarté permanente.

### Effet sur la migration future

À la migration du prototype dans le Module 2 :

- Les kits stealth gardent leur code historique `T##-##` (immutabilité
  des identifiants, cohérent avec ADR-005)
- Ils sont importés en `data_quality_tier = legacy_migrated` avec
  `legacy_source = stealth_test`
- Le moteur de recherche du Module 2 reconnaît les 4 conventions de
  codes : legacy 2025 (`1A`, `2B`), legacy 2026 (`V01`, `V02`),
  stealth (`T01-01`), app-native (`A247` excluant la lettre T)

## Justification des choix

### Pourquoi un ADR séparé plutôt qu'amender ADR-004 directement ?

Trois raisons :

**1. Préservation historique** — ADR-004 capture le raisonnement
original du système A247 avec les 50 ancres. Le modifier
rétrospectivement obscurcirait le fait que cette réservation est une
décision **postérieure**, prise dans le contexte spécifique de
l'introduction du prototype stealth.

**2. Pattern cohérent avec le projet** — le projet a déjà établi le
pattern d'ADR successifs qui précisent ou amendent les précédents
(par exemple ADR-016 qui précise ADR-007, ADR-017 qui étend
ADR-002). Cette discipline rend l'historique des décisions lisible.

**3. Décision isolée et focalisée** — réserver une lettre est une
décision technique simple qui mérite son propre document court,
plutôt que d'alourdir ADR-004 avec un cas particulier.

### Pourquoi la lettre T plutôt qu'une autre ?

Plusieurs lettres auraient pu convenir. La lettre T a été choisie
parce qu'elle est :

- **Mnémotechnique** : T comme **Test** ou **Transitoire**
- **Distinctive** dans le format physique : facile à écrire au
  marqueur, peu de risque de confusion avec d'autres lettres
  (contrairement à I/L, O/0, etc.)
- **Pas une lettre fréquente** dans les marques de pneus
  internationales (réduit le risque de coïncidences sémantiques)

## Conséquences

### Positives

- Aucun risque de collision visuelle entre codes app-native et
  codes du prototype, même dans les rapports et exports
- Migration future fluide : la distinction est claire pour le
  système et pour les utilisateurs
- Documentation claire pour les futurs contributeurs (humains ou IA)
- Coût marginal sur l'espace de codes A247 (1000 codes sur 26 000)

### Négatives

- Une lettre de moins disponible pour le système A247 (25 au lieu
  de 26) — impact négligeable
- Une exception à retenir lors de l'implémentation du Module 4 (le
  générateur d'ancres doit exclure la lettre T)

### Atténuation des négatifs

- L'exclusion de la lettre T sera codée explicitement dans le
  générateur d'ancres au moment du développement Module 4. Tests
  unitaires obligatoires.
- Documentation dans le code et dans `06-modele-donnees.md`

## Alternatives considérées

1. **Pas de réservation, gérer les conflits a posteriori** —
   rejeté car la migration deviendrait risquée et ambiguë
2. **Réserver une lettre différente (S, X, Z)** — équivalent en
   pratique, T choisie pour sa valeur mnémotechnique
3. **Format complètement différent pour le prototype** (par exemple
   `STEALTH-001`) — rejeté car trop long à écrire sur le terrain
   (cf. workflow marqueur d'ADR-004)
4. **Réserver toute une plage numérique au lieu d'une lettre** —
   rejeté car la cohabitation des formats devient confuse

## Liens avec d'autres décisions

- **Amende ADR-004** (numérotation A247 avec 50 ancres) : ajoute
  l'exclusion de la lettre T
- **Cohérent avec ADR-002** (tiering) : le prototype sera importé en
  `legacy_migrated`
- **Cohérent avec ADR-005** (immutabilité) : les codes T##-## sont
  préservés à la migration
- **Cohérent avec ADR-017** (tiering opérationnel) : tier unique
  conservé à vie, sous-marqueur ajouté pour préciser l'origine
- **Document dépendant** : `docs/apprentissage-stealth-test.md`
  (créé en même temps que cet ADR)

## Auteur

Décision prise pendant le cadrage du Paquet 6 (avril 2026), dans le
cadre de la création du prototype d'apprentissage stealth.
Co-construite par Mika et l'assistant après identification du
risque de collision lors de l'audit de cohérence.

---
