const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');
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
    icon: path.join(__dirname, '../public/icon.png'),
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

ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors de l\'ouverture externe:', error);
    return { success: false, error: error.message };
  }
});

// Gestionnaire pour le lancement d'exécutables
ipcMain.handle('launch-executable', async (event, filePath) => {
  try {
    console.log('🚀 Tentative de lancement:', filePath);
    
    // Construire le chemin complet
    const fullPath = path.resolve(__dirname, '..', filePath);
    console.log('📁 Chemin complet:', fullPath);
    
    // Vérifier si le fichier existe
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
      // Construire la commande complète avec les arguments
      const fullCommand = args.length > 0 ? `${command} ${args.join(' ')}` : command;
      console.log('🔧 Commande complète:', fullCommand);
      
      exec(fullCommand, { 
        windowsHide: true,
        timeout: 10000 // 10 secondes de timeout
      }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Erreur commande:', error);
          resolve({ success: false, error: error.message, stderr });
        } else {
          console.log('✅ Commande exécutée avec succès');
          console.log('📄 Sortie stdout:', stdout);
          console.log('⚠️ Sortie stderr:', stderr);
          resolve({ success: true, output: stdout, error: stderr });
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:', error);
    return { success: false, error: error.message };
  }
});

// Gestionnaire pour sélectionner le dossier de sauvegarde
ipcMain.handle('select-backup-folder', async (event) => {
  try {
    console.log('📁 Sélection du dossier de sauvegarde...');
    
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Sélectionner le dossier de destination pour la sauvegarde',
      buttonLabel: 'Sélectionner ce dossier',
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: path.join(process.env.USERPROFILE || '', 'Desktop', 'Sauvegarde_VestyWinBox')
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const selectedPath = result.filePaths[0];
      console.log('✅ Dossier sélectionné:', selectedPath);
      return { success: true, folderPath: selectedPath };
    } else {
      console.log('❌ Aucun dossier sélectionné');
      return { success: false, error: 'Aucun dossier sélectionné' };
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la sélection du dossier:', error);
    return { success: false, error: error.message };
  }
});

// Gestionnaire pour sauvegarder les dossiers utilisateur
ipcMain.handle('backup-user-folders', async (event, destinationPath) => {
  try {
    console.log('💾 Début de la sauvegarde vers:', destinationPath);
    
    // Dossiers à sauvegarder
    const userFolders = [
      { name: 'Bureau', path: path.join(process.env.USERPROFILE || '', 'Desktop') },
      { name: 'Images', path: path.join(process.env.USERPROFILE || '', 'Pictures') },
      { name: 'Documents', path: path.join(process.env.USERPROFILE || '', 'Documents') },
      { name: 'Vidéos', path: path.join(process.env.USERPROFILE || '', 'Videos') },
      { name: 'Téléchargements', path: path.join(process.env.USERPROFILE || '', 'Downloads') },
      { name: 'Musique', path: path.join(process.env.USERPROFILE || '', 'Music') }
    ];
    
    let totalProgress = 0;
    const totalFolders = userFolders.length;
    
    // Créer le dossier de destination s'il n'existe pas
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    
    // Ajouter un timestamp au nom du dossier de sauvegarde
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFolderName = `Sauvegarde_${timestamp}`;
    const backupPath = path.join(destinationPath, backupFolderName);
    
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }
    
    // Sauvegarder chaque dossier
    for (let i = 0; i < userFolders.length; i++) {
      const folder = userFolders[i];
      const sourcePath = folder.path;
      const targetPath = path.join(backupPath, folder.name);
      
      console.log(`📁 Sauvegarde de ${folder.name}...`);
      
      // Vérifier si le dossier source existe
      if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️ Dossier ${folder.name} non trouvé:`, sourcePath);
        continue;
      }
      
      try {
        // Copier le dossier avec robocopy (plus fiable que fs.cp)
        await new Promise((resolve, reject) => {
          const robocopy = spawn('robocopy', [
            sourcePath,
            targetPath,
            '/E',    // Copier les sous-dossiers
            '/R:3',  // 3 tentatives en cas d'erreur
            '/W:1',  // Attendre 1 seconde entre les tentatives
            '/TEE',  // Afficher la sortie dans la console et le fichier log
            '/NP',   // Pas de barre de progression
            '/NDL',  // Pas de liste des fichiers
            '/NC',   // Pas de classe
            '/NS',   // Pas de taille
            '/MT:4'  // Utiliser 4 threads pour la copie
          ], {
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe']
          });
          
          robocopy.on('close', (code) => {
            // Robocopy retourne des codes spéciaux : 0-7 = succès, 8+ = erreur
            if (code <= 7) {
              console.log(`✅ ${folder.name} sauvegardé avec succès (code: ${code})`);
              resolve();
            } else {
              console.log(`❌ Erreur lors de la sauvegarde de ${folder.name} (code: ${code})`);
              reject(new Error(`Erreur robocopy: ${code}`));
            }
          });
          
          robocopy.on('error', (error) => {
            console.log(`❌ Erreur robocopy pour ${folder.name}:`, error);
            reject(error);
          });
        });
        
        totalProgress = ((i + 1) / totalFolders) * 100;
        console.log(`📊 Progression: ${Math.round(totalProgress)}%`);
        
      } catch (error) {
        console.error(`❌ Erreur lors de la sauvegarde de ${folder.name}:`, error);
        // Continuer avec les autres dossiers même en cas d'erreur
      }
    }
    
    console.log('✅ Sauvegarde terminée!');
    return { 
      success: true, 
      message: `Sauvegarde terminée avec succès dans: ${backupPath}`,
      progress: 100
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    return { success: false, error: error.message };
  }
}); 