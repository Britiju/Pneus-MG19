# Sommaire Paquet 6 — Prototype d'apprentissage stealth (fermeture)

**STATUT : EXÉCUTÉ**
**Date** : Avril 2026
**Durée session** : longue (plusieurs heures)

## Origine du paquet

Pendant le cadrage du Paquet 6, Mika a identifié la friction de
publication Marketplace comme goulot d'étranglement principal pour
scaler. Plusieurs voies ont été explorées (outils manuels, app
complète, intégration Marketplace impossible). La conclusion : un
prototype d'apprentissage minimaliste qui teste le workflow complet
sur le terrain, pour informer le cadrage du Module 4 (Saisie mobile)
et du Module 5 (Listing automatique) en Phase B.

Audit de cohérence effectué : 10 points d'incohérence potentiels
avec le projet existant identifiés et tranchés avant production du
sommaire.

## Décisions prises

### Périmètre du prototype

- **Hors scope MVP, hors scope Phase B, hors scope Phase C** —
  activité parallèle d'apprentissage
- **3-5 lots, 30-50 kits, 6 mois maximum**
- **5 features acceptées**, anti-patterns explicites
- **Date de mort programmée** (Module 4 prend le relais, ou échec)

### Les 5 features acceptées

1. Capture mobile d'un kit (PWA, 6 photos par kit dans ordre fixe)
2. Reconnaissance automatique (API Claude, extraction structurée)
3. Excel maître (Google Sheets dans Drive, validation bloquante)
4. Génération des fichiers texte Marketplace (titre.txt + description.txt)
5. Tracking minimal du statut (5 valeurs cohérentes avec MVP)

### Format de codes T##-##

Hiérarchie lot/kit visible dans le code (T01-01 = lot 1, kit 1).
Format à 6 caractères avec tiret, distinguable visuellement des
codes A247 (4 caractères sans tiret). La lettre T est définitivement
réservée au prototype (ADR-018), le système A247 ne la générera
jamais.

### Sous-marqueur `legacy_source`

À la migration future, les kits stealth seront importés avec
`data_quality_tier = legacy_migrated` + `legacy_source = stealth_test`,
distinct du legacy Excel historique (`legacy_source = excel_historique`).

## Livrables produits

1. **ADR-018 créé** (réservation lettre T amendant ADR-004)
2. **`docs/apprentissage-stealth-test.md` créé** — document principal
   du prototype (contrat Mika-Patrick-assistant)
3. **`docs/06-modele-donnees.md` enrichi** — 4e convention de codes,
   sous-marqueur `legacy_source` sur Lot et Kit
4. **`docs/pratiques-pre-mvp.md` enrichi** — Pratique 4 réécrite pour
   intégrer la séquence T01-01 (test) puis A247 (app finale)
5. **`docs/questions-ouvertes.md` enrichi** — Q5 mise à jour pour la
   4e convention, entrée d'historique Paquet 6
6. **`docs/08-roadmap.md` enrichi** — nouvelle section "Activités
   parallèles au cadrage"
7. **`CLAUDE.md` enrichi** — référence au prototype dans la navigation
8. **`docs/journal-avancement.md` enrichi** — Paquet 6 ajouté aux
   complétés, activité parallèle mentionnée
9. **Ce sommaire archivé**

## Patterns de collaboration observés

- L'assistant a initialement sous-estimé les conflits de cohérence
  potentiels avec le projet existant. Mika a explicitement demandé un
  audit, qui a révélé 10 points à régler avant production du sommaire.
- Mika a poussé pour intégrer le numéro de lot dans le code physique
  du sticker (T01-01 visible), contre la première proposition de
  l'assistant qui les séparait artificiellement.
- Discipline rigoureuse sur les anti-patterns : "tout ce qui n'est
  pas dans la liste des 5 features est REFUSÉ", même si "ça
  prendrait juste 30 minutes".
- Pattern récurrent : Patrick connaît le projet par cœur (avantage)
  mais doit résister à la tentation de "bien faire" sur un prototype
  conçu pour mourir.

## Prochaine étape

Patrick développe le prototype en weekend project. Le cadrage Paquet
3 (données historiques + Q1 + Q5) reste la prochaine étape de
cadrage, bloquée sur les fichiers historiques manquants. Aucune
dépendance entre les deux activités — elles se déroulent en
parallèle.

À surveiller pendant le test : documenter les apprentissages dans
`docs/apprentissages-stealth-test.md` (à créer progressivement par
Mika après chaque lot). Sans cette discipline, le prototype perd
80% de sa valeur.

---

**Fin du sommaire Paquet 6.**
