# ADR-015 — Approche Loi 25 minimaliste au MVP

## Statut

Acceptée — Paquet 4 (mécaniques de vente).

## Contexte

La Loi 25 du Québec (Loi modernisant des dispositions législatives
en matière de protection des renseignements personnels) s'applique à
toutes les entreprises collectant des renseignements personnels au
Québec, sans seuil de taille. Les exigences sont **proportionnelles
à la nature et au volume des données traitées**.

Les obligations principales incluent :
- Désignation d'un responsable de la protection des renseignements
  personnels (RPRP)
- Politique de confidentialité claire et accessible
- Consentement éclairé pour la collecte
- Registre des incidents de confidentialité (notification à la CAI
  dans les 72h si risque sérieux)
- Droits des personnes (accès, rectification, retrait, portabilité,
  oubli)

**Situation actuelle** : Mika collecte **très peu** de données
personnelles (téléphone et prénom occasionnels, de façon
opportuniste). La collecte est minimale, pour raisons pratiques
(confirmation de RDV, envoi de facture), pas stratégique.

**Question centrale** : quel niveau de conformité Loi 25 au MVP?

## Décision

### Au MVP : conformité minimale proportionnelle

Au MVP, dans un **contexte d'usage interne** (Mika seul, + partenaires
de confiance existants), la collecte de données personnelles reste :
- **Minimale** : téléphone, prénom, email (si fournis volontairement)
- **Opportuniste** : capturée pour raisons pratiques (RDV, facture),
  pas pour stratégie marketing
- **Contextualisée** : la finalité est évidente pour le client
  (envoi de facture, rappel de RDV)

**Pas de politique de confidentialité formelle requise au stade MVP
interne.**

### Pas de collecte massive

L'app ne collecte **pas** au MVP :
- Données de profilage (comportement, préférences)
- Données sensibles (revenus, santé, etc.)
- Données d'entreprise hors Québec
- Données de mineurs

### Pas d'envoi marketing au MVP

L'app n'envoie **aucune communication marketing** au MVP :
- Pas de newsletter
- Pas de relances automatiques
- Pas de campagnes email ou SMS

Les seuls contacts clients sont **opérationnels** (confirmation RDV,
envoi de facture demandé par le client).

### Obligations différées au Paquet 8

**Avant toute ouverture externe** (employés recrutés, partenaires
non-intimes, site web public, commerce au comptoir), les obligations
suivantes devront être remplies :

1. **Désigner officiellement un RPRP** (par défaut Mika, mais
   documenté)
2. **Rédiger une politique de confidentialité** simple et claire
   (1-2 pages, modèles disponibles)
3. **Établir un mécanisme de consentement** pour les nouveaux usages
   (newsletter, relances)
4. **Établir un registre d'incidents** (même vide) avec processus
   documenté
5. **Former les utilisateurs de l'app** (Mika + partenaires) aux
   règles de la Loi 25

**Moment de bascule** : Paquet 8 (stratégie de bascule), avant la
mise en production ouverte.

### Infrastructure latente pour conformité future

Même si la conformité complète n'est pas requise au MVP, l'app doit
prévoir :

- **Champs de consentement** distincts dans le modèle de données
  (inactifs au MVP, utilisables en Phase B) :
  - `consentement_facturation` (implicite si email fourni pour
    facture)
  - `consentement_newsletter` (opt-in explicite requis)
  - `consentement_relances` (opt-in explicite requis)
- **Horodatage** de chaque capture de données personnelles (pour
  audit)
- **Soft delete** systématique (voir ADR-005) permet de "supprimer"
  une fiche sans perdre l'audit trail

### Pas de transfert hors Québec

L'app utilise Supabase (voir `docs/09-stack-technique.md`).
**Vérification à faire** : la région de stockage Supabase. Si
hors-Québec, une Évaluation des Facteurs Relatifs à la Vie Privée
(EFVP) peut être requise. **À traiter au Paquet 8**, pas au MVP.

## Justification

### Pourquoi approche minimaliste

**Principe 6 (la technologie suit le besoin réel)** : la conformité
doit être proportionnelle aux risques réels. À faible volume de
données et usage interne, les exigences complètes seraient
disproportionnées.

**Principe de minimum nécessaire** de la Loi 25 : "Plus vous avez
de renseignements personnels, plus vous êtes à risque". La pratique
actuelle de Mika (collecte minimale) est **en phase** avec l'esprit
de la loi.

**Pragmatisme** : rédiger une politique de confidentialité formelle
pour un usage interne serait du travail qui sera refait au Paquet 8
(au moment de la vraie mise en production ouverte).

### Pourquoi l'infrastructure latente

Ajouter des champs de consentement dès le MVP (même inactifs)
évite un refactor de base de données au moment de Phase B quand
les features marketing seront activées.

## Conséquences

### Positives

- MVP livrable sans surcoût de conformité
- Pratique de Mika déjà alignée avec l'esprit de la loi
- Infrastructure prête pour l'expansion
- Clarté sur les obligations à remplir au Paquet 8

### Négatives

- Risque marginal si la CAI considère que même l'usage interne est
  visé
- Chantier de conformité complet à faire au Paquet 8 (pas repoussé
  indéfiniment)

### Atténuation

- Collecte vraiment minimale au MVP
- Pas d'envoi marketing
- Paquet 8 dédié avant ouverture externe
- Consultation d'un professionnel recommandée au Paquet 8 pour
  validation finale

## Décisions connexes

- **Q8** (stratégie de bascule) : traitement complet des obligations
  Loi 25 avant mise en production
- **ADR-007** (accès MVP ouvert) : cohérent — le cercle de confiance
  actuel ne nécessite pas les garde-fous externes
- **ADR-013** (clients au MVP) : collecte minimale cohérente avec
  cette approche

## Alternatives considérées

1. **Conformité complète dès le MVP** — rejeté, disproportionné par
   rapport aux risques réels
2. **Aucune considération Loi 25 jusqu'à la mise en production** —
   rejeté, risque d'oublis structurels (champs de consentement
   manquants)
3. **Délégation complète à un professionnel dès maintenant** —
   différé au Paquet 8, trop tôt pour investir

## Recommandations pour la mise en œuvre

**Au MVP, Mika doit** :
- Garder à l'esprit le principe de minimum nécessaire
- Ne pas étendre la collecte sans raison pratique claire
- Noter mentalement les demandes éventuelles de clients (accès,
  suppression) pour les traiter manuellement

**Au Paquet 8** :
- Consultation d'un professionnel en conformité
- Mise en place du RPRP officiel
- Rédaction de la politique de confidentialité
- Vérification de la région Supabase
- Formation des utilisateurs

## Auteur

Décision co-construite pendant le Paquet 4. Mika a soulevé la
question de la Loi 25 sans bien la connaître dans ce contexte
business. L'analyse web a confirmé que la pratique actuelle
minimaliste est en phase avec l'esprit de la loi, et que les
obligations complètes peuvent être différées.

---
