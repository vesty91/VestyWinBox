# 📚 Documentation Technique - VestyWinBox

## 🎯 Vue d'ensemble

VestyWinBox est une application de gestion système Windows moderne développée avec Electron, React, TypeScript et Framer Motion. Elle offre une interface utilisateur premium avec des fonctionnalités avancées de gestion système.

## 🏗️ Architecture

### Structure du Projet
```
VestyWinBox-New/
├── electron/                 # Processus principal Electron
│   ├── main.cjs             # Point d'entrée principal
│   └── preload.cjs          # Script de préchargement
├── src/                     # Code source React
│   ├── components/          # Composants réutilisables
│   │   ├── ui/             # Composants UI de base
│   │   └── Layout/         # Composants de mise en page
│   ├── pages/              # Pages de l'application
│   ├── services/           # Services métier
│   ├── types/              # Définitions TypeScript
│   └── utils/              # Utilitaires
├── public/                 # Assets statiques
├── assets/                 # Ressources (icônes, images)
└── docs/                   # Documentation
```

### Technologies Utilisées

#### Frontend
- **React 18** : Framework UI avec hooks modernes
- **TypeScript** : Typage statique pour la sécurité du code
- **Framer Motion** : Animations fluides et déclaratives
- **Lucide React** : Icônes modernes et cohérentes
- **HeroUI** : Composants UI premium

#### Backend (Electron)
- **Node.js** : Runtime JavaScript côté serveur
- **Electron** : Framework pour applications desktop
- **child_process** : Exécution de commandes système

#### Styling
- **CSS Modules** : Styles modulaires et encapsulés
- **CSS Variables** : Système de thèmes dynamiques
- **Glassmorphism** : Effets visuels modernes

## 🔧 Configuration

### Prérequis
- Node.js 18+
- npm ou yarn
- Windows 10/11 (pour les fonctionnalités système)

### Installation
```bash
# Cloner le repository
git clone https://github.com/vesty91/VestyWinBox.git
cd VestyWinBox-New

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build

# Lancer les tests
npm test
```

## 🎨 Système de Design

### Thèmes
L'application supporte 3 thèmes premium :

1. **Gold VIP** : Thème doré premium
2. **Violet Neon** : Thème violet néon
3. **RGB Gaming** : Thème RGB dynamique

### Variables CSS
```css
:root {
  /* Couleurs principales */
  --primary-gold: #FFD700;
  --vip-purple: #8B5CF6;
  --vip-emerald: #10B981;
  
  /* Espacements */
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  
  /* Rayons de bordure */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
}
```

## 🔌 API Electron

### Interface TypeScript
```typescript
interface ElectronAPI {
  executeSystemCommand(command: string, args?: string[]): Promise<{
    success: boolean;
    stdout?: string;
    stderr?: string;
    error?: string;
  }>;
  
  openExternal(url: string): Promise<{
    success: boolean;
    error?: string;
  }>;
  
  selectBackupFolder(): Promise<{
    success: boolean;
    folderPath?: string;
    error?: string;
  }>;
  
  backupUserFolders(sourceFolders: string[], destination: string): Promise<{
    success: boolean;
    progress?: number;
    error?: string;
  }>;
}
```

### Sécurité
- Communication IPC sécurisée entre processus
- Validation des commandes système
- Gestion des permissions administrateur

## 🧪 Tests

### Configuration
- **Vitest** : Framework de test rapide
- **Testing Library** : Tests d'intégration React
- **jsdom** : Environnement DOM pour les tests

### Structure des Tests
```
src/
├── components/
│   └── __tests__/          # Tests des composants
├── pages/
│   └── __tests__/          # Tests des pages
└── test/
    └── setup.ts            # Configuration des tests
```

### Commandes de Test
```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test:coverage

# Tests spécifiques
npm test -- --run AnalyticsPage
```

## 🚀 Optimisation des Performances

### Lazy Loading
```typescript
// Chargement différé des pages
const AnalyticsPage = lazy(() => import('./pages/Analytics/AnalyticsPage'));
const GodModePage = lazy(() => import('./pages/GodMode/GodModePage'));
```

### Mémoisation
```typescript
// Optimisation des calculs coûteux
const filteredCards = useMemo(() => {
  return cards.filter(card => 
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [searchTerm, cards]);
```

### Code Splitting
- Séparation automatique par routes
- Chargement à la demande des composants
- Optimisation des bundles

## 🐛 Gestion d'Erreurs

### Système de Logging
```typescript
class Logger {
  static info(message: string, data?: any) {
    console.log(`[INFO] ${message}`, data);
  }
  
  static error(message: string, error?: Error) {
    console.error(`[ERROR] ${message}`, error);
  }
  
  static warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data);
  }
}
```

### Gestion des Erreurs Electron
```typescript
// Gestion des erreurs de commandes système
try {
  const result = await window.electronAPI.executeSystemCommand(command);
  if (!result.success) {
    throw new Error(result.error);
  }
} catch (error) {
  Logger.error('Erreur lors de l\'exécution de la commande', error);
  // Affichage d'un message utilisateur
}
```

### Boundary d'Erreurs React
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    Logger.error('Erreur React', error, errorInfo);
  }
}
```

## 📊 Monitoring et Analytics

### Métriques de Performance
- Temps de chargement des pages
- Utilisation mémoire
- Performance des animations
- Temps de réponse des commandes système

### Logs Détaillés
```typescript
// Logs structurés pour le debugging
Logger.info('Commande système exécutée', {
  command: 'sfc /scannow',
  duration: '2m 30s',
  success: true,
  timestamp: new Date().toISOString()
});
```

## 🔒 Sécurité

### Bonnes Pratiques
- Validation des entrées utilisateur
- Sanitisation des commandes système
- Gestion sécurisée des permissions
- Communication IPC chiffrée

### Permissions
- Vérification des droits administrateur
- Gestion des UAC prompts
- Isolation des processus

## 🚀 Déploiement

### Build de Production
```bash
# Build optimisé
npm run build

# Package Electron
npm run electron:build

# Création de l'installateur
npm run dist
```

### Configuration Electron Builder
```json
{
  "build": {
    "appId": "com.vestywinbox.app",
    "productName": "VestyWinBox",
    "directories": {
      "output": "dist"
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "public/icon.png"
    }
  }
}
```

## 📈 Roadmap

### Fonctionnalités Futures
- [ ] Support multi-plateforme (macOS, Linux)
- [ ] Plugins système extensibles
- [ ] API REST pour intégrations
- [ ] Mode sombre/clair automatique
- [ ] Synchronisation cloud des paramètres

### Optimisations Planifiées
- [ ] Web Workers pour les tâches lourdes
- [ ] Cache intelligent des données système
- [ ] Compression des assets
- [ ] Optimisation des animations

## 🤝 Contribution

### Guidelines
1. Respecter les conventions de code
2. Ajouter des tests pour les nouvelles fonctionnalités
3. Documenter les changements
4. Suivre le workflow Git

### Structure des Commits
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactorisation
test: tests
chore: maintenance
```

## 📞 Support

### Contact
- **Développeur** : Vesty
- **Repository** : https://github.com/vesty91/VestyWinBox
- **Issues** : https://github.com/vesty91/VestyWinBox/issues

### Ressources
- [Documentation Electron](https://www.electronjs.org/docs)
- [Documentation React](https://react.dev)
- [Documentation TypeScript](https://www.typescriptlang.org/docs)
- [Documentation Framer Motion](https://www.framer.com/motion) 