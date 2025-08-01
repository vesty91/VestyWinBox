const { contextBridge, ipcRenderer } = require('electron');

// Exposer l'API Electron de manière sécurisée
contextBridge.exposeInMainWorld('electronAPI', {
  // Contrôles de fenêtre
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  
  // Événements de fenêtre
  onMaximize: (callback) => ipcRenderer.on('window-maximized', callback),
  onUnmaximize: (callback) => ipcRenderer.on('window-unmaximized', callback),
  
  // Autres APIs utiles
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Notifications
  showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),
  
  // Système
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Lancement d'exécutables
  launchExecutable: (filePath) => ipcRenderer.invoke('launch-executable', filePath),
  
  // Commandes système
  executeSystemCommand: (command, args) => ipcRenderer.invoke('execute-system-command', command, args)
}); 