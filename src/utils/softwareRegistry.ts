// Registre des logiciels et applications avec informations de mise à jour
export interface SoftwareRegistry {
  id: string;
  name: string;
  category: string;
  type: 'portable' | 'installer';
  path: string;
  executable?: string;
  versionFile?: string;
  currentVersion?: string;
  updateCheck: {
    method: 'api' | 'website' | 'github' | 'manual';
    url?: string;
    apiUrl?: string;
    versionPattern?: string;
    downloadUrl?: string;
    changelogUrl?: string;
  };
  metadata?: {
    description?: string;
    website?: string;
    author?: string;
    license?: string;
  };
}

// Configuration des logiciels embarqués
export const softwareRegistry: SoftwareRegistry[] = [
  // Navigateurs
  {
    id: 'chrome',
    name: 'Google Chrome',
    category: 'Navigateurs',
    type: 'installer',
    path: 'assets/tools/logiciels/navigateurs/',
    executable: 'chrome.exe',
    updateCheck: {
      method: 'api',
      apiUrl: 'https://omahaproxy.appspot.com/all.json',
      versionPattern: 'version',
      downloadUrl: 'https://dl.google.com/chrome/install/latest/chrome_installer.exe'
    },
    metadata: {
      description: 'Navigateur web rapide et sécurisé',
      website: 'https://www.google.com/chrome/',
      author: 'Google LLC'
    }
  },
  {
    id: 'firefox',
    name: 'Mozilla Firefox',
    category: 'Navigateurs',
    type: 'portable',
    path: 'assets/tools/Apps portable/Internet/',
    executable: 'firefox.exe',
    updateCheck: {
      method: 'api',
      apiUrl: 'https://product-details.mozilla.org/1.0/firefox_versions.json',
      versionPattern: 'LATEST_FIREFOX_VERSION',
      downloadUrl: 'https://download.mozilla.org/?product=firefox-latest&os=win64&lang=fr'
    },
    metadata: {
      description: 'Navigateur web open source et respectueux de la vie privée',
      website: 'https://www.mozilla.org/firefox/',
      author: 'Mozilla Foundation'
    }
  },

  // Compression
  {
    id: '7zip',
    name: '7-Zip',
    category: 'Compression',
    type: 'portable',
    path: 'assets/tools/Apps portable/Gestion de fichiers & compression/',
    executable: '7zFM.exe',
    updateCheck: {
      method: 'website',
      url: 'https://7-zip.org/',
      versionPattern: '7-Zip (\\d+\\.\\d+)',
      downloadUrl: 'https://7-zip.org/a/7z2302-x64.exe'
    },
    metadata: {
      description: 'Compresseur de fichiers haute performance',
      website: 'https://7-zip.org/',
      author: 'Igor Pavlov'
    }
  },

  // Éditeurs de code
  {
    id: 'notepadpp',
    name: 'Notepad++',
    category: 'Éditeurs de code',
    type: 'portable',
    path: 'assets/tools/logiciels/Éditeurs de code & Développement/',
    executable: 'notepad++.exe',
    updateCheck: {
      method: 'github',
      url: 'https://github.com/notepad-plus-plus/notepad-plus-plus/releases/latest',
      versionPattern: 'v(\\d+\\.\\d+\\.\\d+)',
      downloadUrl: 'https://github.com/notepad-plus-plus/notepad-plus-plus/releases/latest/download/npp.8.6.3.Installer.x64.exe'
    },
    metadata: {
      description: 'Éditeur de texte avancé pour développeurs',
      website: 'https://notepad-plus-plus.org/',
      author: 'Don Ho'
    }
  },

  // Multimédia
  {
    id: 'vlc',
    name: 'VLC Media Player',
    category: 'Multimédia',
    type: 'portable',
    path: 'assets/tools/Apps portable/Graphisme & multimédia/',
    executable: 'vlc.exe',
    updateCheck: {
      method: 'api',
      apiUrl: 'https://api.github.com/repos/videolan/vlc/releases/latest',
      versionPattern: 'tag_name',
      downloadUrl: 'https://get.videolan.org/vlc/last/win64/vlc-3.0.20-win64.exe'
    },
    metadata: {
      description: 'Lecteur multimédia universel',
      website: 'https://www.videolan.org/vlc/',
      author: 'VideoLAN'
    }
  },

  // Maintenance
  {
    id: 'ccleaner',
    name: 'CCleaner',
    category: 'Maintenance',
    type: 'portable',
    path: 'assets/tools/Apps portable/Maintenance système/',
    executable: 'CCleaner.exe',
    updateCheck: {
      method: 'website',
      url: 'https://www.ccleaner.com/ccleaner/download',
      versionPattern: 'CCleaner (\\d+\\.\\d+)',
      downloadUrl: 'https://download.ccleaner.com/ccsetup613.exe'
    },
    metadata: {
      description: 'Nettoyeur de système et optimiseur',
      website: 'https://www.ccleaner.com/',
      author: 'Piriform'
    }
  },

  // Sécurité
  {
    id: 'malwarebytes',
    name: 'Malwarebytes',
    category: 'Sécurité',
    type: 'portable',
    path: 'assets/tools/Apps portable/securite/',
    executable: 'mbam.exe',
    updateCheck: {
      method: 'website',
      url: 'https://www.malwarebytes.com/mwb-download/',
      versionPattern: 'Malwarebytes (\\d+\\.\\d+\\.\\d+)',
      downloadUrl: 'https://downloads.malwarebytes.com/file/mb4_offline'
    },
    metadata: {
      description: 'Antivirus et anti-malware',
      website: 'https://www.malwarebytes.com/',
      author: 'Malwarebytes Corporation'
    }
  },

  // Utilitaires
  {
    id: 'winrar',
    name: 'WinRAR',
    category: 'Compression',
    type: 'installer',
    path: 'assets/tools/logiciels/Compression & Archivage/',
    executable: 'WinRAR.exe',
    updateCheck: {
      method: 'website',
      url: 'https://www.win-rar.com/download.html',
      versionPattern: 'WinRAR (\\d+\\.\\d+)',
      downloadUrl: 'https://www.win-rar.com/fileadmin/winrar-versions/winrar/winrar-x64-611.exe'
    },
    metadata: {
      description: 'Compresseur de fichiers populaire',
      website: 'https://www.win-rar.com/',
      author: 'RARLAB'
    }
  },

  // Communication
  {
    id: 'discord',
    name: 'Discord',
    category: 'Communication',
    type: 'installer',
    path: 'assets/tools/logiciels/Communication/',
    executable: 'Discord.exe',
    updateCheck: {
      method: 'api',
      apiUrl: 'https://discord.com/api/v9/updates/distro/stable/channel',
      versionPattern: 'version',
      downloadUrl: 'https://discord.com/api/downloads/distro/app/stable/win/x86'
    },
    metadata: {
      description: 'Plateforme de communication pour gamers',
      website: 'https://discord.com/',
      author: 'Discord Inc.'
    }
  },

  // Monitoring
  {
    id: 'hwmonitor',
    name: 'HWiNFO',
    category: 'Monitoring',
    type: 'portable',
    path: 'assets/tools/logiciels/Outils système & Monitoring matériel/',
    executable: 'HWiNFO64.exe',
    updateCheck: {
      method: 'website',
      url: 'https://www.hwinfo.com/download/',
      versionPattern: 'HWiNFO (\\d+\\.\\d+\\.\\d+)',
      downloadUrl: 'https://www.hwinfo.com/files/hwi_732.exe'
    },
    metadata: {
      description: 'Moniteur système et matériel',
      website: 'https://www.hwinfo.com/',
      author: 'REALiX'
    }
  }
];

// Fonctions utilitaires pour la gestion des logiciels
export const getSoftwareById = (id: string): SoftwareRegistry | undefined => {
  return softwareRegistry.find(software => software.id === id);
};

export const getSoftwareByCategory = (category: string): SoftwareRegistry[] => {
  return softwareRegistry.filter(software => software.category === category);
};

export const getSoftwareByType = (type: 'portable' | 'installer'): SoftwareRegistry[] => {
  return softwareRegistry.filter(software => software.type === type);
};

export const getAllSoftware = (): SoftwareRegistry[] => {
  return softwareRegistry;
};

// Fonction pour vérifier si un logiciel existe dans le système
export const checkSoftwareExists = async (software: SoftwareRegistry): Promise<boolean> => {
  try {
    // Vérifier si le chemin existe
    const fs = require('fs');
    const path = require('path');
    
    const fullPath = path.join(process.cwd(), software.path);
    return fs.existsSync(fullPath);
  } catch (error) {
    console.error(`Erreur lors de la vérification de ${software.name}:`, error);
    return false;
  }
};

// Fonction pour obtenir la version actuelle d'un logiciel
export const getCurrentVersion = async (software: SoftwareRegistry): Promise<string | null> => {
  try {
    // Logique pour extraire la version depuis le fichier exécutable ou un fichier de version
    // Cette fonction peut être étendue selon les besoins spécifiques de chaque logiciel
    
    if (software.currentVersion) {
      return software.currentVersion;
    }
    
    // Par défaut, retourner une version simulée
    return '1.0.0';
  } catch (error) {
    console.error(`Erreur lors de la récupération de la version de ${software.name}:`, error);
    return null;
  }
}; 