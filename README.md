# MoodTune

MoodTune est une application web développée avec React utilisant l’intelligence artificielle afin de générer des playlists musicales personnalisées selon l’humeur de l’utilisateur.

---

# Installation et lancement du projet

## 1. Télécharger le projet

Ouvrir le dépôt GitHub puis cliquer sur :

```text
Code → Download ZIP
```

Une fois le fichier téléchargé :

* extraire le fichier ZIP ;
* ouvrir le dossier obtenu (`moodtune-main` par exemple).

---

## 2. Ouvrir le projet dans Visual Studio Code

Ouvrir Visual Studio Code.

Puis :

```text
File → Open Folder
```

Sélectionner ensuite le dossier du projet extrait précédemment.

---

## 3. Ouvrir un terminal dans VS Code

Dans la barre supérieure de Visual Studio Code :

```text
Terminal → New Terminal
```

Un terminal apparaîtra en bas de la fenêtre.

Vérifier que le terminal se trouve bien dans le dossier du projet :

```text
...\moodtune-main>
```

---

## 4. Autoriser temporairement les scripts PowerShell (Windows uniquement)

Sur certains ordinateurs Windows, PowerShell bloque l’exécution des commandes npm par sécurité.

Entrer alors la commande suivante dans le terminal :

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Puis confirmer avec :

```text
O
```

et appuyer sur Entrée.

Cette autorisation est uniquement temporaire et ne concerne que la session actuelle du terminal.

---

## 5. Installer les dépendances du projet

Dans le terminal, entrer :

```bash
npm install
```

Cette commande installe automatiquement toutes les dépendances nécessaires au fonctionnement du projet (React, Vite, etc.).

Patienter jusqu’à la fin de l’installation.

---

## 6. Lancer l’application

Dans le terminal, entrer :

```bash
npm run dev
```

Le terminal affichera alors un lien similaire à :

```text
http://localhost:5173
```

---

## 7. Ouvrir l’application

Effectuer :

```text
Ctrl + clic gauche
```

sur le lien affiché dans le terminal afin d’ouvrir MoodTune dans le navigateur.

---

# Important

L’application utilise l’API Claude d’Anthropic.

Pour des raisons de sécurité, la clé API personnelle n’est pas fournie dans le dépôt GitHub.

Ainsi :

* l’interface React ;
* les animations ;
* les thèmes dynamiques ;
* et l’ensemble du frontend

fonctionnent normalement.

Cependant, la génération réelle des playlists nécessite d’ajouter une clé API Anthropic personnelle dans les headers de la requête.
