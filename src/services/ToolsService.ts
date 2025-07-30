export interface Tool {
  id: string;
  name: string;
  category: string;
  type: 'logiciel' | 'portable';
  path: string;
  iconPath?: string;
  description?: string;
  version?: string;
  size?: string;
}

export class ToolsService {
  // Structure des catégories
  static readonly LOGICIELS_CATEGORIES = {
    'Communication': 'Communication',
    'Maintenance & Utilitaires Windows': 'Maintenance Windows',
    'Outils de vérification & hash': 'Vérification & Hash',
    'Outils système & Monitoring matériel': 'Système & Monitoring',
    'Éditeurs de code & Développement': 'Développement',
    'navigateurs': 'Navigateurs',
    'Compression & Archivage': 'Compression',
    'virtualisation': 'Virtualisation'
  };

  static readonly PORTABLE_CATEGORIES = {
    'Bureautique & PDF': 'Bureautique & PDF',
    'Utilitaires & divers': 'Utilitaires',
    'Maintenance système': 'Maintenance',
    'Internet': 'Internet',
    'Graphisme & multimédia': 'Graphisme',
    'Gestion de fichiers & compression': 'Gestion fichiers',
    'securite': 'Sécurité'
  };

  // Scanner tous les logiciels
  static async scanLogiciels(): Promise<Tool[]> {
    const logiciels: Tool[] = [];
    
    try {
      // Simulation des données basée sur la structure des dossiers
      const logicielsData = [
        {
          name: 'WhatsApp',
          category: 'Communication',
          path: 'assets/tools/logiciels/Communication/WhatsApp.exe',
          iconPath: 'assets/tools/icons/Communication/WhatsApp.ico',
          description: 'Application de messagerie instantanée',
          version: '2.24.15.78',
          size: '17 KB'
        },
        {
          name: '7-Zip',
          category: 'Compression & Archivage',
          path: 'assets/tools/logiciels/Compression & Archivage/7zFM.exe',
          iconPath: 'assets/tools/icons/Compression & Archivage/7-Zip.ico',
          description: 'Compresseur et décompresseur de fichiers',
          version: '23.01',
          size: '1.2 MB'
        },
        {
          name: 'Chrome',
          category: 'navigateurs',
          path: 'assets/tools/logiciels/navigateurs/chrome.exe',
          iconPath: 'assets/tools/icons/navigateurs/chrome.ico',
          description: 'Navigateur web rapide et sécurisé',
          version: '120.0.6099.109',
          size: '85 MB'
        },
        {
          name: 'Firefox',
          category: 'navigateurs',
          path: 'assets/tools/logiciels/navigateurs/firefox.exe',
          iconPath: 'assets/tools/icons/navigateurs/firefox.ico',
          description: 'Navigateur web open source',
          version: '121.0',
          size: '65 MB'
        },
        {
          name: 'Visual Studio Code',
          category: 'Éditeurs de code & Développement',
          path: 'assets/tools/logiciels/Éditeurs de code & Développement/Code.exe',
          iconPath: 'assets/tools/icons/Éditeurs de code & Développement/vscode.ico',
          description: 'Éditeur de code moderne et extensible',
          version: '1.85.1',
          size: '45 MB'
        },
        {
          name: 'CPU-Z',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/cpuz.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/cpuz.ico',
          description: 'Informations détaillées sur le matériel',
          version: '2.06',
          size: '8.5 MB'
        },
        {
          name: 'CCleaner',
          category: 'Maintenance & Utilitaires Windows',
          path: 'assets/tools/logiciels/Maintenance & Utilitaires Windows/ccleaner.exe',
          iconPath: 'assets/tools/icons/Maintenance & Utilitaires Windows/ccleaner.ico',
          description: 'Nettoyage et optimisation du système',
          version: '6.12',
          size: '15 MB'
        },
        {
          name: 'HashTab',
          category: 'Outils de vérification & hash',
          path: 'assets/tools/logiciels/Outils de vérification & hash/hashtab.exe',
          iconPath: 'assets/tools/icons/Outils de vérification & hash/hashtab.ico',
          description: 'Calcul et vérification de hash',
          version: '6.0.0.34',
          size: '2.1 MB'
        },
        {
          name: 'VirtualBox',
          category: 'virtualisation',
          path: 'assets/tools/logiciels/virtualisation/VirtualBox.exe',
          iconPath: 'assets/tools/icons/virtualisation/virtualbox.ico',
          description: 'Plateforme de virtualisation',
          version: '7.0.12',
          size: '120 MB'
        }
      ];

      logicielsData.forEach((item, index) => {
        logiciels.push({
          id: `logiciel-${index}`,
          name: item.name,
          category: item.category,
          type: 'logiciel',
          path: item.path,
          iconPath: item.iconPath,
          description: item.description,
          version: item.version,
          size: item.size
        });
      });

    } catch (error) {
      console.error('Erreur lors du scan des logiciels:', error);
    }

    return logiciels;
  }

  // Scanner tous les apps portables
  static async scanPortableApps(): Promise<Tool[]> {
    const portableApps: Tool[] = [];
    
    try {
      // Simulation des données basées sur la structure des dossiers réels
      const portableData = [
        // Bureautique & PDF
        {
          name: 'PDF-XChange Editor',
          category: 'Bureautique & PDF',
          path: 'assets/tools/Apps portable/Bureautique & PDF/PDF-XChangeEditorPortable/PDFXEdit.exe',
          iconPath: 'assets/tools/icons/Bureautique & PDF/pdfxchange.ico',
          description: 'Éditeur PDF avancé portable',
          version: '10.2.1',
          size: '45 MB'
        },
        {
          name: 'Foxit Reader',
          category: 'Bureautique & PDF',
          path: 'assets/tools/Apps portable/Bureautique & PDF/FoxitReaderPortable/FoxitReader.exe',
          iconPath: 'assets/tools/icons/Bureautique & PDF/foxitreader.ico',
          description: 'Lecteur PDF rapide et léger',
          version: '12.1.2',
          size: '35 MB'
        },
        {
          name: 'Sumatra PDF',
          category: 'Bureautique & PDF',
          path: 'assets/tools/Apps portable/Bureautique & PDF/SumatraPDF/SumatraPDF.exe',
          iconPath: 'assets/tools/icons/Bureautique & PDF/SumatraPDF.ico',
          description: 'Lecteur PDF minimaliste',
          version: '3.5.2',
          size: '8 MB'
        },
        
        // Utilitaires & divers
        {
          name: 'WinDirStat',
          category: 'Utilitaires & divers',
          path: 'assets/tools/Apps portable/Utilitaires & divers/WinDirStatPortable/WinDirStat.exe',
          iconPath: 'assets/tools/icons/Utilitaires & divers/windirstat.ico',
          description: 'Analyseur d\'espace disque',
          version: '1.1.2',
          size: '2.5 MB'
        },
        {
          name: 'ShareX',
          category: 'Utilitaires & divers',
          path: 'assets/tools/Apps portable/Utilitaires & divers/ShareXPortable/ShareX.exe',
          iconPath: 'assets/tools/icons/Utilitaires & divers/sharex.ico',
          description: 'Capture d\'écran et partage',
          version: '15.0.0',
          size: '12 MB'
        },
        {
          name: 'Notepad++',
          category: 'Utilitaires & divers',
          path: 'assets/tools/Apps portable/Utilitaires & divers/Notepad++Portable/notepad++.exe',
          iconPath: 'assets/tools/icons/Utilitaires & divers/notepad++.ico',
          description: 'Éditeur de texte avancé',
          version: '8.6.2',
          size: '4.5 MB'
        },
        {
          name: 'Emsisoft Emergency Kit',
          category: 'Utilitaires & divers',
          path: 'assets/tools/Apps portable/Utilitaires & divers/EmsisoftEmergencyKitPortable/EmsisoftEmergencyKit.exe',
          iconPath: 'assets/tools/icons/Utilitaires & divers/emsisoft.ico',
          description: 'Kit d\'urgence antivirus',
          version: '2024.1',
          size: '180 MB'
        },
        {
          name: 'Ditto',
          category: 'Utilitaires & divers',
          path: 'assets/tools/Apps portable/Utilitaires & divers/DittoPortable/Ditto.exe',
          iconPath: 'assets/tools/icons/Utilitaires & divers/ditto.ico',
          description: 'Gestionnaire de presse-papiers',
          version: '3.24.244.0',
          size: '3.2 MB'
        },
        
        // Maintenance système
        {
          name: 'CCleaner',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/ccsetup/ccleaner.exe',
          iconPath: 'assets/tools/icons/Maintenance système/l.ico',
          description: 'Nettoyage système portable',
          version: '6.12',
          size: '15 MB'
        },
        {
          name: 'SPEC',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/specPortable/SPEC.exe',
          iconPath: 'assets/tools/icons/Maintenance système/spec.ico',
          description: 'Test de performance système',
          version: '2.1.0',
          size: '25 MB'
        },
        {
          name: 'GPU-Z',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/GPU-ZPortable/GPU-Z.exe',
          iconPath: 'assets/tools/icons/Maintenance système/gpuz.png',
          description: 'Informations détaillées GPU',
          version: '2.51.0',
          size: '8.5 MB'
        },
        {
          name: 'CPU-Z',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/CPU-ZPortable/cpuz.exe',
          iconPath: 'assets/tools/icons/Maintenance système/cpuz.ico',
          description: 'Informations détaillées CPU',
          version: '2.06',
          size: '8.5 MB'
        },
        {
          name: 'HWMonitor',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/HWMonitorPortable/HWMonitor.exe',
          iconPath: 'assets/tools/icons/Maintenance système/hwmonitor.ico',
          description: 'Surveillance des températures',
          version: '1.52',
          size: '5.2 MB'
        },
        {
          name: 'Process Explorer',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/ProcessExplorerPortable/procexp.exe',
          iconPath: 'assets/tools/icons/Maintenance système/processexplorer.ico',
          description: 'Gestionnaire de processus avancé',
          version: '17.05',
          size: '2.8 MB'
        },
        {
          name: 'Revo Uninstaller',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/RevoUninstallerPortable/RevoUninstaller.exe',
          iconPath: 'assets/tools/icons/Maintenance système/revouninstaller.ico',
          description: 'Désinstallateur avancé',
          version: '2.4.5',
          size: '18 MB'
        },
        
        // Internet
        {
          name: 'qBittorrent',
          category: 'Internet',
          path: 'assets/tools/Apps portable/Internet/qBittorrentPortable/qbittorrent.exe',
          iconPath: 'assets/tools/icons/Internet/qBittorrent.ico',
          description: 'Client BitTorrent open source',
          version: '4.6.2',
          size: '28 MB'
        },
        {
          name: 'FileZilla',
          category: 'Internet',
          path: 'assets/tools/Apps portable/Internet/FileZillaPortable/FileZilla.exe',
          iconPath: 'assets/tools/icons/Internet/filezilla.ico',
          description: 'Client FTP/SFTP',
          version: '3.66.5',
          size: '12 MB'
        },
        {
          name: 'Google Chrome',
          category: 'Internet',
          path: 'assets/tools/Apps portable/Internet/GoogleChrome/Chrome.exe',
          iconPath: 'assets/tools/icons/Internet/google.ico',
          description: 'Navigateur Chrome portable',
          version: '120.0.6099.109',
          size: '85 MB'
        },
        {
          name: 'Firefox',
          category: 'Internet',
          path: 'assets/tools/Apps portable/Internet/FirefoxPortable/Firefox.exe',
          iconPath: 'assets/tools/icons/Internet/firefox.ico',
          description: 'Navigateur Firefox portable',
          version: '121.0',
          size: '65 MB'
        },
        
        // Graphisme & multimédia
        {
          name: 'VLC Media Player',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/VLCPortable/VLC.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/vlc.ico',
          description: 'Lecteur multimédia universel',
          version: '3.0.18',
          size: '42 MB'
        },
        {
          name: 'Paint.NET',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/PaintDotNetPortable/PaintDotNet.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/paintdotnet.ico',
          description: 'Éditeur d\'image avancé',
          version: '5.0.12',
          size: '15 MB'
        },
        {
          name: 'Krita',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/KritaPortable/Krita.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/krita.ico',
          description: 'Logiciel de peinture numérique',
          version: '5.2.2',
          size: '180 MB'
        },
        {
          name: 'Inkscape',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/InkscapePortable/Inkscape.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/inkscape.ico',
          description: 'Éditeur de graphiques vectoriels',
          version: '1.3.2',
          size: '95 MB'
        },
        {
          name: 'GIMP',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/GIMPPortable/GIMP.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/gimp.ico',
          description: 'Éditeur d\'image open source',
          version: '2.10.36',
          size: '120 MB'
        },
        {
          name: 'Audacity',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/AudacityPortable/Audacity.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/audacity.ico',
          description: 'Éditeur audio open source',
          version: '3.4.2',
          size: '25 MB'
        },
        
        // Gestion de fichiers & compression
        {
          name: '7-Zip',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/7-ZipPortable/7zFM.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/7zip.ico',
          description: 'Compresseur et décompresseur',
          version: '23.01',
          size: '1.2 MB'
        },
        {
          name: 'Everything',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/EverythingPortable/Everything.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/everything.ico',
          description: 'Recherche ultra-rapide de fichiers',
          version: '1.4.1.1024',
          size: '2.1 MB'
        },
        {
          name: 'Explorer++',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/Explorer++Portable/Explorer++.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/explorer++.ico',
          description: 'Explorateur de fichiers alternatif',
          version: '1.4.0.1895',
          size: '1.8 MB'
        },
        {
          name: 'FreeCommander',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/FreeCommanderPortable/FreeCommander.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/freecommander.ico',
          description: 'Gestionnaire de fichiers avancé',
          version: '2023 Build 880',
          size: '12 MB'
        },
        {
          name: 'PeaZip',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/PeaZipPortable/PeaZip.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/peazip.ico',
          description: 'Compresseur avec interface graphique',
          version: '9.5.0',
          size: '8.5 MB'
        },
        {
          name: 'Q-Dir',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/Q-DirPortable/Q-Dir.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/qdir.ico',
          description: 'Explorateur quadri-paneaux',
          version: '10.85',
          size: '2.2 MB'
        },
        
        // Sécurité
        {
          name: 'Malwarebytes',
          category: 'securite',
          path: 'assets/tools/Apps portable/securite/malwarebytes/MBAM.exe',
          iconPath: 'assets/tools/icons/securite/malwarebytes.ico',
          description: 'Protection contre les malwares',
          version: '4.6.1',
          size: '25 MB'
        },
        {
          name: 'Autoruns',
          category: 'securite',
          path: 'assets/tools/Apps portable/securite/autoruns.exe',
          iconPath: 'assets/tools/icons/securite/autoruns.ico',
          description: 'Gestionnaire de démarrage système',
          version: '14.10',
          size: '1.7 MB'
        },
        {
          name: 'Process Explorer',
          category: 'securite',
          path: 'assets/tools/Apps portable/securite/procexp.exe',
          iconPath: 'assets/tools/icons/securite/procexp.ico',
          description: 'Explorateur de processus avancé',
          version: '17.05',
          size: '4.3 MB'
        },
        {
          name: 'Kaspersky Virus Removal Tool',
          category: 'securite',
          path: 'assets/tools/Apps portable/securite/KVRT.exe',
          iconPath: 'assets/tools/icons/securite/kvrt.ico',
          description: 'Outil de suppression de virus',
          version: '21.3.10.391',
          size: '110 MB'
        },
        {
          name: 'Windows Firewall Control',
          category: 'securite',
          path: 'assets/tools/Apps portable/securite/Windows.Firewall.Control.exe',
          iconPath: 'assets/tools/icons/securite/wfc.ico',
          description: 'Contrôle avancé du pare-feu',
          version: '6.9.2.0',
          size: '2.3 MB'
        }
      ];

      portableData.forEach((item, index) => {
        portableApps.push({
          id: `portable-${index}`,
          name: item.name,
          category: item.category,
          type: 'portable',
          path: item.path,
          iconPath: item.iconPath,
          description: item.description,
          version: item.version,
          size: item.size
        });
      });

    } catch (error) {
      console.error('Erreur lors du scan des apps portables:', error);
    }

    return portableApps;
  }

  // Obtenir les catégories uniques
  static getCategories(tools: Tool[]): string[] {
    return [...new Set(tools.map(tool => tool.category))];
  }

  // Filtrer par catégorie
  static filterByCategory(tools: Tool[], category: string): Tool[] {
    return tools.filter(tool => tool.category === category);
  }

  // Rechercher des outils
  static searchTools(tools: Tool[], query: string): Tool[] {
    const lowerQuery = query.toLowerCase();
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description?.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
    );
  }
} 