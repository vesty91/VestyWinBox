# VestyWinBox

Application de gestion système Windows avec interface moderne et fonctionnalités avancées.

## 🚀 Fonctionnalités

- **Dashboard** : Vue d'ensemble du système avec métriques en temps réel
- **Gestionnaire d'outils** : Lancement d'applications système
- **Terminal intégré** : Interface de ligne de commande avec commandes rapides
- **Gestionnaire Chocolatey** : Installation et gestion de packages
- **Explorateur NAS** : Gestion des partages réseau
- **Benchmark WinSAT** : Affichage des scores de performance système
- **Journal d'activité** : Suivi des actions utilisateur

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript + Vite
- **Desktop** : Electron 30
- **Styling** : TailwindCSS
- **Icons** : Lucide React
- **Build** : Electron Builder

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Windows 10/11

### Installation locale
```bash
# Cloner le repository
git clone [url-du-repo]
cd vestywinbox

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev:electron

# Construire l'application
npm run dist
```

## 🎯 Scripts disponibles

- `npm run dev` : Lance le serveur de développement Vite
- `npm run dev:electron` : Lance l'app Electron en mode développement
- `npm run build` : Construit l'application pour la production
- `npm run dist` : Crée l'exécutable Windows
- `npm run lint` : Vérifie le code avec ESLint
- `npm run clean` : Nettoie les fichiers de build

## 🏗️ Structure du projet

```
vestywinbox/
├── src/
│   ├── components/     # Composants réutilisables
│   ├── pages/         # Pages de l'application
│   ├── services/      # Services système
│   ├── context/       # Contextes React
│   └── App.tsx        # Composant principal
├── assets/            # Ressources (icônes, outils)
├── electron.cjs       # Processus principal Electron
├── preload.cjs        # Script de préchargement
└── dist/              # Fichiers de build
```

## 🔧 Configuration

L'application utilise plusieurs fichiers de configuration :

- `electron.cjs` : Configuration Electron et gestionnaires IPC
- `preload.cjs` : API sécurisée pour le renderer process
- `tailwind.config.js` : Configuration TailwindCSS
- `vite.config.ts` : Configuration Vite

## 📝 Journal d'activité

L'application enregistre automatiquement les actions utilisateur dans :
```
%APPDATA%/vestywinbox/activity-log.json
```

## 🚨 Sécurité

- Context isolation activée
- Node integration désactivée
- API sécurisée via contextBridge
- Validation des entrées utilisateur

## 📄 Licence

Projet privé - Tous droits réservés

## 👨‍💻 Développement

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Créer une Pull Request

## 🐛 Support

Pour signaler un bug ou demander une fonctionnalité, veuillez créer une issue sur GitHub.

## ✅ **ERREUR DE LINTER CORRIGÉE !**

### ** CORRECTION APPORTÉE :**

#### ** Problème identifié :**
- ❌ **Erreur** : `'prompt' is not defined`
- ✅ **Solution** : Remplacement de `prompt` par `window.prompt`

#### ** Modification effectuée :**
```typescript
// Avant
const backupPath = prompt(...);

// Après  
const backupPath = window.prompt(...);
```

### ** RÉSULTAT :**
- ✅ **Build réussi** : Compilation sans erreurs
- ✅ **Code propre** : Plus d'erreurs de linter
- ✅ **Fonctionnalité maintenue** : La tuile "Sauvegarder Favoris" fonctionne correctement
- ✅ **Push GitHub** : `db37855`

### ** FONCTIONNALITÉ "SAUVEGARDER FAVORIS" :**

#### **⭐ Interface utilisateur :**
- **Demande de chemin** : `window.prompt` pour saisir le dossier de destination
- **Exemple fourni** : `D:\BackupFavoris`
- **Fallback** : Bureau si aucun chemin n'est spécifié

#### **📁 Commandes exécutées :**
```batch
xcopy "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Bookmarks" "D:\BackupFavoris\Chrome" /y
xcopy "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Bookmarks" "D:\BackupFavoris\Edge" /y
```

#### **✅ Feedback utilisateur :**
- **Succès complet** : "Chrome et Edge : OK"
- **Succès partiel** : Indication de quel navigateur a réussi
- **Échec** : Instructions pour fermer les navigateurs

**L'erreur de linter a été corrigée et toutes les 6 nouvelles tuiles fonctionnent parfaitement !** 🎉✨

**L'application est maintenant prête pour les tests utilisateur !** 🚀🧪
