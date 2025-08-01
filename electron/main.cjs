const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

// Configuration pour réduire les erreurs de cache
app.commandLine.appendSwitch('--disable-gpu-cache');
app.commandLine.appendSwitch('--disable-software-rasterizer');
app.commandLine.appendSwitch('--disable-background-timer-throttling');
app.commandLine.appendSwitch('--disable-renderer-backgrounding');

let mainWindow;

function createWindow() {
  // Obtenir les dimensions de l'écran principal
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  
  // Calculer les dimensions optimales de la fenêtre
  const windowWidth = Math.min(1400, screenWidth * 0.9);
  const windowHeight = Math.min(900, screenHeight * 0.9);
  const minWidth = Math.min(800, screenWidth * 0.6);
  const minHeight = Math.min(600, screenHeight * 0.6);
  
  // Centrer la fenêtre sur l'écran
  const x = Math.round((screenWidth - windowWidth) / 2);
  const y = Math.round((screenHeight - windowHeight) / 2);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: x,
    y: y,
    minWidth: minWidth,
    minHeight: minHeight,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, '../assets/icon.ico'),
    show: false,
    titleBarStyle: 'hidden',
    frame: false,
    backgroundColor: '#0f0f23',
    resizable: true,
    maximizable: true,
    minimizable: true,
    fullscreenable: true
  });

  // Charger l'application
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Gérer les liens externes
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Menu de l'application
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Nouveau',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // Action pour nouveau
          }
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Édition',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Fenêtre',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
});

// Gestionnaires IPC pour les contrôles de fenêtre
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

// Gestionnaires pour les événements de fenêtre
mainWindow?.on('maximize', () => {
  mainWindow.webContents.send('window-maximized');
});

mainWindow?.on('unmaximize', () => {
  mainWindow.webContents.send('window-unmaximized');
});

// Autres APIs
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-platform', () => {
  return process.platform;
});

ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron
  };
});

ipcMain.on('show-notification', (event, { title, body }) => {
  // Implémentation des notifications système
  console.log('Notification:', title, body);
});

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

// Gestionnaire pour le lancement d'exécutables
ipcMain.handle('launch-executable', async (event, filePath) => {
  try {
    console.log('🚀 Tentative de lancement:', filePath);
    
    // Construire le chemin complet
    const fullPath = path.resolve(__dirname, '..', filePath);
    console.log('📁 Chemin complet:', fullPath);
    
    // Vérifier si le fichier existe
    const fs = require('fs');
    if (!fs.existsSync(fullPath)) {
      console.error('❌ Fichier non trouvé:', fullPath);
      return { success: false, error: 'Fichier non trouvé' };
    }
    
    // Lancer l'exécutable
    const child = spawn(fullPath, [], {
      detached: true,
      stdio: 'ignore'
    });
    
    // Détacher le processus enfant
    child.unref();
    
    console.log('✅ Exécutable lancé avec succès:', fullPath);
    return { success: true, message: 'Exécutable lancé avec succès' };
    
  } catch (error) {
    console.error('❌ Erreur lors du lancement:', error);
    return { success: false, error: error.message };
  }
});

// Gestionnaire pour les commandes système
ipcMain.handle('execute-system-command', async (event, command, args = []) => {
  try {
    console.log('🔧 Exécution de commande:', command, args);
    
    return new Promise((resolve, reject) => {
      exec(command, { windowsHide: true }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Erreur commande:', error);
          resolve({ success: false, error: error.message });
        } else {
          console.log('✅ Commande exécutée:', stdout);
          resolve({ success: true, output: stdout, error: stderr });
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:', error);
    return { success: false, error: error.message };
  }
}); 