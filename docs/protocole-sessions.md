# Protocole de sessions — Projet pneus-MG19

## Principe central

**Le système se souvient pour toi.**

Tu ne dois pas avoir à te rappeler où tu en étais pour démarrer une
session. Le journal d'avancement (`docs/journal-avancement.md`)
contient l'état actuel. Claude lit le journal et te propose la
suite. Tu approuves ou tu choisis autre chose.

**Tes seuls efforts** :
- **30 secondes au démarrage** : coller un script de 3 lignes
- **30 secondes à la fin** : pousser le commit de mise à jour du
  journal que Claude aura préparé

## Démarrer une session

### Le script de reprise (à coller au début de chaque nouvelle conversation Claude)

```
Bonjour Claude. On reprend le projet pneus-MG19.
Lis d'abord CLAUDE.md à la racine du repo pour le contexte général,
puis docs/journal-avancement.md pour savoir où on en est.
Propose-moi les prochaines étapes basées sur ce que tu as lu.
```

**C'est tout.** Pas besoin d'ajouter où tu en étais, ce que tu veux
faire, ou quel est le prochain sujet. Claude va lire, comprendre, et
te proposer.

### Ce que Claude devrait faire ensuite

1. Lire `CLAUDE.md` → contexte général du projet
2. Lire `docs/journal-avancement.md` → état actuel
3. Éventuellement consulter des ADR ou documents spécifiques selon
   la prochaine étape prévue
4. Te présenter **un résumé court** de où on en est
5. Te **proposer** la prochaine étape (selon ce qui est noté dans
   le journal)
6. Te demander **confirmation ou redirection** (on continue comme
   prévu, ou tu veux autre chose?)

### Cas où tu n'utilises pas Claude Code

Si tu es dans l'interface web ou mobile de Claude (pas Claude Code),
Claude ne peut pas lire directement le filesystem. Tu as alors deux
options :

**Option A — Partager les documents manuellement** : copie-colle le
contenu de `CLAUDE.md` et `docs/journal-avancement.md` dans la
conversation.

**Option B — Donner le repo public/privé** : si tu as un lien vers
le repo GitHub, Claude peut parfois le consulter.

Claude Code reste la façon la plus fluide de démarrer une session.

## Conduire une session

### Patterns à garder en tête

Le document `docs/decisions/raisonnement-paquet-1.md` et
`docs/decisions/raisonnement-paquet-2.md` documentent honnêtement les
patterns de collaboration. Les plus importants à rappeler :

**1. Une question à la fois**
Si Claude empile 3 questions dans un message, tu peux rappeler :
"Une question à la fois s'il te plaît."

**2. Langage humain**
Si Claude utilise trop de jargon ou de format structuré, tu peux
rappeler : "Parle en langage humain."

**3. Synthèse optimiste à surveiller**
Claude a tendance à déclarer des paquets "bouclés" trop vite.
Demande systématiquement "fait un dernier tour avant qu'on ferme,
qu'est-ce qu'on a pas traité?".

**4. Solution smart vs explicite**
Pour les données à impact (prix, finances, clients), préfère
l'explicite à l'automatique. Principe 11 du projet.

**5. Mika calibre les enjeux mieux que l'assistant**
Quand Claude estime qu'un effort est "trop", tu as le dernier mot.
C'est toi qui fais le travail.

### Format recommandé pour les commits

Les commits produits par Claude Code suivent un format cohérent :

```
docs: [action courte]

[Description détaillée]

- [Point clé 1]
- [Point clé 2]
```

Les sommaires techniques de Paquet sont archivés après exécution
dans `docs/sessions/` avec en-tête "STATUT : EXÉCUTÉ".

## Fermer une session

### Ce que Claude doit faire à la fin de chaque session

Avant de te laisser partir, Claude doit **toujours** :

1. **Résumer** ce qui a été accompli dans la session
2. **Identifier** la prochaine étape logique (celle qui sera écrite
   dans le journal)
3. **Produire une mise à jour du journal** (`docs/journal-avancement.md`)
   sous forme de sommaire technique court à pousser
4. **Te demander** si tu veux pousser maintenant ou reporter

### Checklist de fermeture

Avant de fermer vraiment la session, vérifie :

- [ ] Tous les commits de la session sont-ils poussés?
- [ ] Le journal d'avancement est-il à jour?
- [ ] La prochaine étape est-elle explicitement nommée dans le
      journal?
- [ ] Y a-t-il des décisions prises oralement qui ne sont pas encore
      documentées?

Si tout est coché, tu peux fermer sereinement.

## Cas particuliers

### Tu veux changer de sujet en cours de session

Pas de problème. Dis-le à Claude : "En fait, on va plutôt
travailler sur X." Claude s'adapte et note le changement de
direction dans le résumé de fin de session.

### Tu veux reprendre un sujet abandonné il y a longtemps

Claude consulte le journal et les ADR correspondants pour retrouver
le contexte. Tu peux aussi pointer directement le document
pertinent : "Reprends le cadrage de ce qu'on avait commencé sur
[sujet], c'est dans `docs/questions-ouvertes.md` Q[N]."

### Tu es perdu sur où on en est

Demande à Claude : "Fais-moi un état des lieux complet du projet."
Claude va lire tous les documents clés et te produire une synthèse.

### Tu veux faire une session courte / rapide

Dis-le dès le début : "Session courte aujourd'hui, je veux juste
[tâche précise]." Claude évitera d'ouvrir de nouveaux sujets et
restera focalisé.

## Fréquence recommandée

Il n'y a **pas** de fréquence imposée. Les sessions peuvent être :

- **Intenses** : 2-3 heures, un ou plusieurs paquets
- **Courtes** : 30 minutes, une décision précise
- **Espacées** : plusieurs jours ou semaines entre deux sessions

Le journal tient le fil. Tu ne perds rien en espaçant.

## Principe directeur implicite

Ce protocole respecte le **Principe 1** du projet (aucune feature ne
ralentit le workflow actuel). Travailler avec Claude ne doit pas
être plus pénible que ne pas travailler avec lui.

Si à un moment le protocole devient lourd, c'est qu'il faut le
simplifier. Pas t'y conformer.

---

**Dernière mise à jour** : création initiale du protocole.
