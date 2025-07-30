# Dossier des Outils Exécutables

Ce dossier contient les exécutables système que VestyWinBox peut utiliser.

## Structure recommandée :

```
assets/tools/
├── nettoyage/
│   ├── ccleaner.exe
│   └── bleachbit.exe
├── diagnostic/
│   ├── cpuz.exe
│   ├── hwinfo.exe
│   └── crystaldiskinfo.exe
├── securite/
│   ├── malwarebytes.exe
│   └── defender.exe
├── compression/
│   ├── 7zip.exe
│   └── winrar.exe
└── system/
    ├── defrag.exe
    └── sfc.exe
```

## Instructions :

1. **Place tes exécutables** dans les sous-dossiers appropriés
2. **Nomme-les clairement** (ex: `ccleaner.exe`, `cpuz.exe`)
3. **Vérifie les permissions** (certains outils nécessitent des droits admin)
4. **Ajoute les outils** dans la configuration `ToolsManager.tsx`

## Exemple d'utilisation :

```typescript
// Dans ToolsManager.tsx
const tools = [
  {
    id: 'ccleaner',
    name: 'CCleaner',
    executable: 'assets/tools/nettoyage/ccleaner.exe',
    category: 'nettoyage'
  }
];
``` 