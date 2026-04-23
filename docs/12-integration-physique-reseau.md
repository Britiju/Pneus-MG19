# Intégration physique et réseau

## Statut de ce document

**Document de référence technique vivant.**

Ce document capture l'architecture d'intégration des **éléments
physiques** (imprimantes, scanners, terminaux de paiement) et **du
réseau local** associé.

Il se remplit **progressivement** à mesure que de nouveaux appareils
s'intègrent au business. Certaines sections sont détaillées (quand
l'information est connue), d'autres sont des placeholders (pour les
appareils futurs).

**Ce qu'il n'est pas** :

- Pas un ADR (ce sont des specs techniques, pas des décisions
  architecturales)
- Pas une liste d'achats (voir backlog pour les priorités
  d'investissement)
- Pas un manuel utilisateur (voir documentation opérationnelle
  future)

---

## Pourquoi ce document existe

Au-delà du logiciel (Next.js, Supabase, etc.), le business utilise
**des appareils physiques** qui doivent s'intégrer à l'application.
Ces appareils posent des questions techniques spécifiques :

- Comment communiquent-ils avec l'app? (réseau local, USB, cloud)
- Comment on gère les pannes quand l'appareil est offline?
- Quelles sont les contraintes réseau à respecter?
- Quels modèles sont recommandés et pourquoi?

Sans un document dédié, ces questions se dispersent dans du code, des
discussions informelles ou la mémoire. Avec un document dédié, on a
une référence unique qui grandit avec le business.

---

## Principes généraux d'intégration

### Principe P1 — Réseau local comme défaut

Les appareils physiques (imprimantes, scanners, terminaux de
paiement) communiquent avec l'app via le **réseau local** quand c'est
possible, pas via le cloud.

**Pourquoi** :

- Latence très faible (imprimer une étiquette doit être instantané)
- Fonctionne même si internet tombe
- Pas de dépendance à un service tiers pour des opérations critiques
- Moins de surface d'attaque de sécurité

**Exception** : les terminaux de paiement qui nécessitent une
autorisation bancaire passent obligatoirement par internet. Ce n'est
pas un choix, c'est une contrainte du réseau bancaire.

### Principe P2 — Dégradation propre

Si un appareil physique est indisponible (éteint, déconnecté, en
panne), l'app **continue de fonctionner en mode dégradé** :

- L'opération alternative est documentée (ex: étiquette manuelle au
  marqueur si imprimante en panne)
- L'app affiche clairement ce qui est indisponible
- Les opérations qui nécessitent absolument l'appareil sont bloquées
  avec un message clair (pas un écran qui plante)
- La reprise est automatique quand l'appareil revient en ligne

### Principe P3 — IPs statiques pour les appareils critiques

Les appareils qui doivent être accessibles depuis l'app ont une
**IP statique** sur le réseau local, pas une IP DHCP qui change.

**Pourquoi** : une IP qui change = l'app perd contact = code qui
doit chercher l'appareil = complexité inutile.

**Plage recommandée** : `192.168.1.50` à `192.168.1.99` réservée aux
appareils business.

### Principe P4 — Identification unique par appareil

Chaque appareil physique porte un **identifiant dans l'app** (pas
juste une IP). Permet :

- Plusieurs appareils du même type si le business grandit (2
  imprimantes, 2 scanners)
- Traçabilité des actions par appareil (telle étiquette imprimée sur
  telle imprimante à telle heure)
- Remplacement d'un appareil sans refactor de code

### Principe P5 — Isolation réseau des appareils

Les appareils physiques du business sont sur un **réseau séparé** du
Wi-Fi invité ou du réseau personnel (si applicable). Permet :

- Sécurité (un invité ne peut pas accéder à l'imprimante)
- Contrôle de bande passante
- Plus facile à diagnostiquer en cas de problème

**Mise en œuvre** : VLAN séparé ou routeur dédié. Détails à préciser
quand le comptoir/entrepôt se structure.

---

## Topologie réseau

### État actuel (MVP, pré-comptoir)

**Topologie minimale** :

- Aucun appareil physique intégré à l'app au MVP
- Pas de contrainte réseau particulière
- L'app fonctionne depuis n'importe quel réseau (mobile, wifi maison,
  wifi entrepôt)

### État intermédiaire (étiquetage pratique, pré-comptoir)

**Quand l'imprimante d'étiquettes arrive** (voir section dédiée) :

```
Internet
   │
   ▼
Routeur principal (192.168.1.1)
   │
   ├── Poste de travail (laptop/desktop) — DHCP
   │
   └── Imprimante Zebra ZD421t (IP statique 192.168.1.50)
```

Configuration simple, accessible pour un usage personnel ou petit
entrepôt.

### État cible (commerce au comptoir structuré)

**Topologie projetée** (horizon 8-24 mois selon évolution business) :

```
Internet (fibre recommandée)
   │
   ▼
Routeur/Firewall (VLAN capable)
   │
   ├── VLAN Business
   │    ├── Poste comptoir (IP statique 192.168.1.10)
   │    ├── Imprimante étiquettes (192.168.1.50)
   │    ├── Imprimante reçus (192.168.1.51) — si applicable
   │    ├── Scanner code-barres (USB sur poste comptoir)
   │    └── Terminal paiement (internet direct, passerelle bancaire)
   │
   ├── VLAN Invités (Wi-Fi clients)
   │
   └── VLAN Admin (administration, mises à jour, monitoring)
```

À détailler et valider quand l'ouverture du comptoir physique
approche.

---

## Imprimante d'étiquettes

### Modèle recommandé

**Zebra ZD421t** (prix indicatif ~650$ CAD)

**Caractéristiques clés** :

- Thermal transfer (avec ruban) — **essentiel** pour durabilité sur
  caoutchouc
- Ethernet intégré — connexion réseau directe à l'app
- Ruban cartridge — chargement facile, moins d'erreurs
- Supporté activement par Zebra — firmware, drivers, durée de vie
- Largeur 4 pouces — standard retail

**Alternative budget** : Zebra ZD230t (~400$ CAD) — même
fonctionnement, moins d'options et durée de vie moindre.

**Modèles à éviter** :

- GC420d — discontinué depuis 2020, support terminé en 2023, direct
  thermal seulement (dégradation dans le temps)
- ZP450 — imprimante UPS shipping, USB seulement, non supportée par
  Zebra pour usage business

### Consommables

**Étiquettes** :

- Format : 4" × 6" (standard retail, polyvalent)
- Type : thermal transfer (compatible avec ruban)
- Adhésif : **agressif spécifique caoutchouc**, avec "dry edge" ou
  colle sélective pour éviter d'encrasser l'imprimante
- Fournisseur local recommandé : **Multi-Action** (L'Ange-Gardien, ~20
  min de Québec) — fabricant spécialisé, technologie d'encollage
  propre aux pneus, peut pré-imprimer logos en couleur par
  flexographie

**Ruban** :

- Type : **resin** (pas wax, pas wax/resin) — résistance aux
  conditions extérieures québécoises
- Dimensions : 4.33" × 1476' (standard pour ZD421t)

### Topologie de branchement

```
App (Next.js sur poste de travail)
   │
   ▼ TCP port 9100
Imprimante Zebra ZD421t
   IP statique : 192.168.1.50
```

**Configuration imprimante** :

- IP statique : `192.168.1.50`
- Masque : `255.255.255.0`
- Passerelle : `192.168.1.1`
- Port : `9100` (standard Zebra/PCL)

Configuration via l'interface web de l'imprimante (accessible à
`http://192.168.1.50` après premier branchement DHCP).

### Protocole de communication : ZPL

**ZPL (Zebra Programming Language)** est un langage texte ASCII simple
que l'imprimante comprend nativement. L'app **génère du ZPL dans le
code**, sans logiciel tiers intermédiaire.

**Pas besoin de** :

- BarTender (~500$/an)
- Zebra Designer
- NiceLabel
- Aucun logiciel de conception

**Avantages du ZPL direct** :

- Version control Git (les templates d'étiquettes dans le repo)
- Tests automatisés (on peut tester le ZPL généré sans impression
  réelle)
- Intégration native avec la BD Supabase
- Gratuit, portable, durable

**Outil de validation** : `labelary.com` — simulateur gratuit en
ligne qui prend du ZPL et affiche l'étiquette résultante. Très utile
pendant le développement.

### Format d'étiquette prévu (à affiner)

**Information à afficher** sur chaque étiquette de kit :

- Code lisible (ex: `A247`) — grand et visible
- Code-barres correspondant au code lisible
- Marque et taille des pneus
- Saison (pictogramme ou texte)
- Date d'étiquetage (petit, bas de l'étiquette)

**À préciser** : template exact, polices, position — au moment de
l'intégration.

### Intégration à l'app (code futur)

**Architecture** (pour implémentation en Phase B ou C) :

```
Utilisateur clique "Imprimer étiquette"
   │
   ▼
API route /api/print (Next.js)
   │
   ├── Lit le kit depuis Supabase (via kit_id)
   │
   ├── Génère le ZPL à partir du template
   │
   └── Envoie via socket TCP au port 9100 de 192.168.1.50
```

**Gestion d'erreurs minimale** :

- Imprimante offline (timeout socket) → message clair, proposer
  étiquette manuelle
- Erreur de ZPL (syntax) → log + alerte (ne devrait jamais arriver
  en production)
- File d'attente si imprimante occupée → attente automatique (ZD421t
  gère ça nativement)

### Apprentissage parallèle (hors MVP)

L'étiquetage imprimé n'est **pas dans le scope MVP**, mais peut être
testé en parallèle **sans toucher à l'app** :

1. Commander le matériel (imprimante + étiquettes + ruban)
2. Utiliser le logiciel gratuit **ZebraDesigner Essentials** pour
   créer des templates simples
3. Imprimer manuellement quelques centaines d'étiquettes de test
4. Coller sur des pneus réels (intérieur flanc, extérieur flanc,
   bande de roulement — tester les surfaces)
5. Observer dans le temps (2-4 semaines) : tenue de l'adhésif,
   lisibilité, résistance aux conditions québécoises

**Coût total estimé** : ~800-1000$ CAD pour démarrer (imprimante +
étiquettes test + ruban + scanner optionnel).

**Valeur de l'apprentissage** : énorme. On valide la viabilité
physique avant d'investir en code.

### Fournisseurs locaux recommandés (région de Québec)

**Multi-Action** (L'Ange-Gardien)
- Fabricant d'étiquettes spécialisé
- Technologie d'encollage propre aux pneus
- Peut faire des logos couleur préimprimés
- Recommandé pour : étiquettes de qualité, commandes personnalisées

**Étiquettes Écono** (Lévis)
- Distributeur d'équipement
- Service de réparation d'imprimantes à domicile
- Recommandé pour : achat imprimante, support technique

**Étiquettes Québec / Rive-Sud**
- E-commerce avec prix en ligne
- Recommandé pour : réappros rapides, produits standards

**Stratégie suggérée** : combiner les trois selon les besoins.

---

## Scanner de code-barres

### Modèle recommandé

**Zebra DS2208** (prix indicatif ~150$ CAD)

**Caractéristiques** :

- 2D (lit les code-barres 1D classiques ET les QR codes)
- USB (pas besoin de réseau, branché au poste de travail)
- Robuste, designed for retail
- Compatible avec tous les codes que l'imprimante Zebra génère

### Usage prévu

**Au moment de la vente au comptoir** (Phase B/C) :

- Scanner l'étiquette du kit → app trouve automatiquement le kit
  dans la BD → prix et détails affichés → pas de saisie manuelle

**Pour inventaire** :

- Scanner rapide d'une zone de l'entrepôt pour vérifier la présence
- Mise à jour en masse du statut de kits

### Intégration technique

Le DS2208 fonctionne en **émulation clavier** — il envoie les chiffres
scannés comme si tu les tapais au clavier. Pas besoin d'API ou de
driver spécifique.

**Conséquence pratique** : un champ "Scanner le code" dans l'app
recoit le scan comme une saisie clavier. Très simple à implémenter.

### Quand intégrer

**Hors MVP.** Pertinent à partir de :

- L'intégration de l'impression d'étiquettes (sinon rien à scanner)
- L'ouverture du comptoir physique (principal cas d'usage)

---

## Terminal de paiement (commerce au comptoir)

### Solution envisagée

**Helcim** (processeur de paiement canadien)

**Grandes lignes** (connues de discussions antérieures) :

- Canadien, pas de contrat, frais transparents
- Estimation à volume projeté (~1M$/an) : ~12 500-13 000$ en frais
  annuels
- API correcte pour intégration custom
- Support terminal physique + paiement web

**Alternatives évaluées** :

- Stripe : ~17 500$/an estimé — plus cher
- Moneris : ~13 200$/an — comparable, mais API moins moderne
- Square : ~17 200$/an — cher, écosystème moins canadien

### Architecture réseau

Les terminaux de paiement ont des **contraintes réseau particulières** :

- Connexion internet directe (passerelle bancaire)
- Certification PCI-DSS du réseau (sécurité des données de carte)
- Chiffrement bout-en-bout

**Implication** : le terminal ne passe pas par l'app comme
l'imprimante. Il a sa propre connexion sécurisée vers Helcim, qui
relaie à la banque. L'app reçoit juste la **confirmation** du
paiement via webhook.

### Flux de paiement (Phase B/C)

```
Client présente carte au terminal
   │
   ▼
Terminal → Helcim → Banque → autorisation
   │
   ▼
Helcim confirme à l'app via webhook
   │
   ▼
App marque la vente comme payée, génère le reçu
```

### Quand intégrer

**Hors MVP.** Pertinent quand :

- Ouverture du comptoir physique avec paiement sur place
- Volume de transactions qui justifie les frais de terminal (seuil à
  évaluer)

En attendant : Interac e-Transfer (mode actuel) reste viable et
gratuit pour le propriétaire.

---

## Imprimante de reçus (optionnelle)

### Contexte

Pour un comptoir physique, imprimer un reçu client au moment de la
vente est une attente standard.

**Options** :

- Imprimante thermique dédiée (Epson, Star) — standard restauration/retail
- Impression directe depuis le terminal de paiement Helcim (si
  supporté)
- Reçu numérique par email/SMS uniquement (pas d'imprimante
  physique)

### Décision différée

Pas une priorité. À évaluer quand le comptoir ouvrira vraiment. La
décision dépendra :

- Du volume réel de transactions
- Du profil clientèle (préfèrent papier ou numérique?)
- Des intégrations disponibles avec Helcim à ce moment-là

**Placeholder** — section à remplir quand l'intégration deviendra
concrète.

---

## Autres appareils à prévoir (placeholders)

### Caméra / poste photo

Pour la caractérisation visuelle des kits. Probable à partir de Phase
B (saisie mobile optimisée).

**À documenter** : pas nécessairement un appareil dédié — peut être
juste un téléphone sur trépied avec app de capture.

### Lecteur/scanner DOT (future)

Les numéros DOT sur les pneus permettent de traquer l'année de
fabrication. Un scanner photo + OCR pourrait automatiser la capture.

**À documenter** : techno pas encore évaluée, à voir si la
reconnaissance photo ne fait pas ça naturellement en Phase C.

### Balance (rare, si achat au poids)

Certains fournisseurs facturent leurs lots au poids. Une balance
Bluetooth connectée à l'app permettrait la capture automatique.

**À documenter** : si le cas devient fréquent.

---

## Gestion des pannes et dégradation

### Stratégie générale

Pour chaque appareil intégré, documenter **le plan de dégradation** :

1. Qu'est-ce qui arrête de fonctionner dans l'app quand l'appareil
   est offline?
2. Quel est le workflow alternatif?
3. Comment les opérations reprennent-elles quand l'appareil revient?

### Exemple — Imprimante offline

- **Impact** : pas d'impression automatique d'étiquettes
- **Alternative** : étiquetage manuel au marqueur (comme MVP)
- **Reprise** : l'app détecte l'imprimante au prochain `/api/print`
  et fonctionne normalement

### Exemple — Terminal paiement offline

- **Impact** : pas de paiement par carte au comptoir
- **Alternative** : Interac e-Transfer, paiement remis plus tard
- **Reprise** : dès que le terminal se reconnecte

### Exemple — Scanner offline/défectueux

- **Impact** : saisie manuelle du code
- **Alternative** : champ de saisie texte à côté du champ scanner
- **Reprise** : immédiate dès rebranchement

---

## Sécurité physique des appareils

### Principes

- Appareils dans zone contrôlée (entrepôt, comptoir fermé à clé)
- Pas d'accès physique pour les clients
- Pas d'appareil visible depuis l'extérieur (risque de vol)
- Backups des configurations (IP, templates) dans le repo Git ou
  Supabase

### À détailler

Au moment de l'ouverture du comptoir ou de la structuration de
l'entrepôt principal. Pas une préoccupation MVP.

---

## Liens avec les autres documents du projet

- `docs/01-vision-produit.md` — les principes directeurs (P6 —
  technologie suit le besoin, P7 — scalabilité latente — guident
  l'intégration des appareils)
- `docs/09-stack-technique.md` — la stack logicielle qui communique
  avec ces appareils
- `docs/08-roadmap.md` — quand chaque appareil devient pertinent
- `docs/backlog.md` — les features qui dépendent des appareils
  physiques
- `docs/11-integration-quickbooks.md` — l'intégration comptable est
  connexe (reçoit les données de ventes générées au comptoir)

---

## Historique des mises à jour

- **Paquet 2 (finances)** : création du document, sections imprimante
  Zebra détaillée, grandes lignes des autres appareils (scanner,
  Helcim), principes généraux et topologie.

**À compléter** au fil des intégrations réelles.

---

## Auteur et évolution

Document créé pendant le Paquet 2 pour capturer les décisions
techniques sur les éléments physiques et le réseau. L'information
détaillée sur l'imprimante Zebra provient d'une session d'exploration
dédiée qui a identifié les fournisseurs locaux, les modèles
recommandés et rejetés, ainsi que la stratégie d'intégration via ZPL
direct.

Ce document **grandit avec le business**. Chaque nouvel appareil
intégré reçoit sa section dédiée.

---
