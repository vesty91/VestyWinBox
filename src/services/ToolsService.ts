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

  // Scanner tous les logiciels (mise à jour avec les vrais chemins)
  static async scanLogiciels(): Promise<Tool[]> {
    const logiciels: Tool[] = [];
    
    try {
      // Données basées sur les vrais fichiers trouvés
      const logicielsData = [
        // Communication
        {
          name: 'WhatsApp',
          category: 'Communication',
          path: 'assets/tools/logiciels/Communication/WhatsApp.exe',
          iconPath: 'assets/tools/icons/Communication/WhatsApp.ico',
          description: 'Application de messagerie instantanée',
          version: '2.24.15.78',
          size: '17 KB'
        },
        // Navigateurs
        {
          name: 'Chrome',
          category: 'navigateurs',
          path: 'assets/tools/logiciels/navigateurs/Chrome.exe',
          iconPath: 'assets/tools/icons/navigateurs/Chrome.ico',
          description: 'Navigateur web rapide et sécurisé',
          version: '120.0.6099.109',
          size: '11 MB'
        },
        {
          name: 'Firefox',
          category: 'navigateurs',
          path: 'assets/tools/logiciels/navigateurs/Firefox.exe',
          iconPath: 'assets/tools/icons/navigateurs/Firefox.ico',
          description: 'Navigateur web open source',
          version: '121.0',
          size: '375 KB'
        },
        {
          name: 'Opera',
          category: 'navigateurs',
          path: 'assets/tools/logiciels/navigateurs/Opera.exe',
          iconPath: 'assets/tools/icons/navigateurs/Opera.ico',
          description: 'Navigateur web avec VPN intégré',
          version: '105.0.4970.63',
          size: '2.5 MB'
        },
        {
          name: 'Brave',
          category: 'navigateurs',
          path: 'assets/tools/logiciels/navigateurs/Brave.exe',
          iconPath: 'assets/tools/icons/navigateurs/Brave.ico',
          description: 'Navigateur web axé sur la confidentialité',
          version: '1.60.109',
          size: '1.2 MB'
        },
        // Compression
        {
          name: '7-Zip',
          category: 'Compression & Archivage',
          path: 'assets/tools/logiciels/Compression & Archivage/7zip.exe',
          iconPath: 'assets/tools/icons/Compression & Archivage/7zip.ico',
          description: 'Compresseur et décompresseur de fichiers',
          version: '23.01',
          size: '1.5 MB'
        },
        {
          name: 'WinRAR',
          category: 'Compression & Archivage',
          path: 'assets/tools/logiciels/Compression & Archivage/WinRAR1.exe',
          iconPath: 'assets/tools/icons/Compression & Archivage/winrar.ico',
          description: 'Compresseur de fichiers populaire',
          version: '6.24',
          size: '3.5 MB'
        },
        // Maintenance Windows
        {
          name: 'KMS',
          category: 'Maintenance & Utilitaires Windows',
          path: 'assets/tools/logiciels/Maintenance & Utilitaires Windows/KMS.cmd',
          iconPath: 'assets/tools/icons/Maintenance & Utilitaires Windows/kms.ico',
          description: 'Outil d\'activation Windows',
          version: '1.0',
          size: '2 KB'
        },
        {
          name: 'ProduKey',
          category: 'Maintenance & Utilitaires Windows',
          path: 'assets/tools/logiciels/Maintenance & Utilitaires Windows/produkey/ProduKey.exe',
          iconPath: 'assets/tools/icons/Maintenance & Utilitaires Windows/produkey.ico',
          description: 'Récupérateur de clés de produit',
          version: '1.97',
          size: '1.5 MB'
        },
        {
          name: 'Pause Update',
          category: 'Maintenance & Utilitaires Windows',
          path: 'assets/tools/logiciels/Maintenance & Utilitaires Windows/Pause_Update_12-30-3000.cmd',
          iconPath: 'assets/tools/icons/Maintenance & Utilitaires Windows/pause.ico',
          description: 'Pause des mises à jour Windows',
          version: '1.0',
          size: '1 KB'
        },
        {
          name: 'Uninstaller',
          category: 'Maintenance & Utilitaires Windows',
          path: 'assets/tools/logiciels/Maintenance & Utilitaires Windows/Uninstaller.exe',
          iconPath: 'assets/tools/icons/Maintenance & Utilitaires Windows/uninstaller.ico',
          description: 'Désinstallateur avancé',
          version: '1.0',
          size: '25 MB'
        },
        {
          name: 'Driver Booster',
          category: 'Maintenance & Utilitaires Windows',
          path: 'assets/tools/logiciels/Maintenance & Utilitaires Windows/Driver Booster.exe',
          iconPath: 'assets/tools/icons/Maintenance & Utilitaires Windows/driver-booster.ico',
          description: 'Mise à jour automatique des pilotes',
          version: '12.0.0',
          size: '25 MB'
        },
        // Vérification & Hash
        {
          name: 'HashTab',
          category: 'Outils de vérification & hash',
          path: 'assets/tools/logiciels/Outils de vérification & hash/Hash.Tab.exe',
          iconPath: 'assets/tools/icons/Outils de vérification & hash/hashtab.ico',
          description: 'Calcul de hash de fichiers',
          version: '6.0.0.34',
          size: '1.1 MB'
        },
        {
          name: 'Hash Check',
          category: 'Outils de vérification & hash',
          path: 'assets/tools/logiciels/Outils de vérification & hash/Hash.Check.exe',
          iconPath: 'assets/tools/icons/Outils de vérification & hash/hash-check.ico',
          description: 'Vérification d\'intégrité des fichiers',
          version: '2.4.0',
          size: '497 KB'
        },
        // Système & Monitoring
        {
          name: 'CrystalDiskInfo',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/crystaldiskinfo/DiskInfo64.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/crystaldiskinfo.ico',
          description: 'Surveillance de la santé des disques',
          version: '9.1.1',
          size: '2.8 MB'
        },
        {
          name: 'CPU-Z',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/cpu-z.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/cpu-z.ico',
          description: 'Informations détaillées sur le matériel',
          version: '2.06',
          size: '4.5 MB'
        },
        {
          name: 'HWiNFO',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/HWiNFO 8.28.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/hwinfo.ico',
          description: 'Informations système détaillées',
          version: '8.28',
          size: '14 MB'
        },
        {
          name: 'AIDA64',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/AIDA.64.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/AIDA.64.ico',
          description: 'Diagnostic système complet',
          version: '7.3.6400',
          size: '69 MB'
        },
        {
          name: 'BurnIn Test',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/Burn.In.Test.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/Burn.In.Test.ico',
          description: 'Test de stress matériel',
          version: '10.1.1001',
          size: '45 MB'
        },
        {
          name: 'Hard Disk Sentinel',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/Hard.Disk.Sentinel.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/Hard.Disk.Sentinel.ico',
          description: 'Surveillance de la santé des disques',
          version: '6.10',
          size: '27 MB'
        },
        {
          name: 'HD Tune',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/HD.Tune.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/HD.Tune.ico',
          description: 'Test et diagnostic des disques',
          version: '5.75',
          size: '3.5 MB'
        },
        {
          name: 'MSI Afterburner',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/MSI.Afterburner.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/MSI.Afterburner.ico',
          description: 'Overclocking et monitoring GPU',
          version: '4.6.5',
          size: '53 MB'
        },
        {
          name: 'OCCT',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/O.C.C.T.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/O.C.C.T.ico',
          description: 'Test de stabilité système',
          version: '11.2.8',
          size: '82 MB'
        },
        {
          name: 'Performance Test',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/Performance.Test.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/Performance.Test.ico',
          description: 'Benchmark système complet',
          version: '11.0.1001',
          size: '56 MB'
        },
        {
          name: 'RAM Saver',
          category: 'Outils système & Monitoring matériel',
          path: 'assets/tools/logiciels/Outils système & Monitoring matériel/RAM.Saver.exe',
          iconPath: 'assets/tools/icons/Outils système & Monitoring matériel/RAM.Saver.ico',
          description: 'Optimisation de la mémoire RAM',
          version: '24.0',
          size: '2.2 MB'
        },
        // Développement
        {
          name: 'NodeJS',
          category: 'Éditeurs de code & Développement',
          path: 'assets/tools/logiciels/Éditeurs de code & Développement/NodeJS.msi',
          iconPath: 'assets/tools/icons/Éditeurs de code & Développement/nodejs.ico',
          description: 'Runtime JavaScript',
          version: '20.10.0',
          size: '25 MB'
        },
        {
          name: 'Visual Studio Code',
          category: 'Éditeurs de code & Développement',
          path: 'assets/tools/logiciels/Éditeurs de code & Développement/VS-Code.exe',
          iconPath: 'assets/tools/icons/Éditeurs de code & Développement/VS-Code.ico',
          description: 'Éditeur de code moderne et extensible',
          version: '1.85.1',
          size: '106 MB'
        },
        {
          name: 'Git',
          category: 'Éditeurs de code & Développement',
          path: 'assets/tools/logiciels/Éditeurs de code & Développement/Git-2.50.0-64-bit.exe',
          iconPath: 'assets/tools/icons/Éditeurs de code & Développement/Git-2.50.0-64-bit.ico',
          description: 'Système de contrôle de version',
          version: '2.50.0',
          size: '68 MB'
        },
        {
          name: 'Cursor',
          category: 'Éditeurs de code & Développement',
          path: 'assets/tools/logiciels/Éditeurs de code & Développement/CursorUserSetup-x64-0.50.5.exe',
          iconPath: 'assets/tools/icons/Éditeurs de code & Développement/cursorusersetup-x64-0.50.5.ico',
          description: 'Éditeur de code avec IA',
          version: '0.50.5',
          size: '111 MB'
        },
        // Virtualisation
        {
          name: 'VirtualBox',
          category: 'virtualisation',
          path: 'assets/tools/logiciels/virtualisation/Virtual.Box.exe',
          iconPath: 'assets/tools/icons/virtualisation/virtualbox.ico',
          description: 'Machine virtuelle open source',
          version: '7.0.12',
          size: '104 MB'
        },
        {
          name: 'VMware Workstation',
          category: 'virtualisation',
          path: 'assets/tools/logiciels/virtualisation/VMware.Workstation.exe',
          iconPath: 'assets/tools/icons/virtualisation/VMware.Workstation.ico',
          description: 'Solution de virtualisation professionnelle',
          version: '17.5.0',
          size: '329 MB'
        }
      ];

      // Convertir en objets Tool
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

  // Scanner toutes les apps portables (mise à jour avec les vrais chemins)
  static async scanPortableApps(): Promise<Tool[]> {
    const portableApps: Tool[] = [];
    
    try {
      // Données basées sur les vrais fichiers trouvés
      const portableData = [
        // Bureautique & PDF
        {
          name: 'PDF-XChange Editor',
          category: 'Bureautique & PDF',
          path: 'assets/tools/Apps portable/Bureautique & PDF/PDF-XChangeEditorPortable/App/PDFXEdit/PDFXEdit.exe',
          iconPath: 'assets/tools/icons/Bureautique & PDF/pdf-xchange.ico',
          description: 'Éditeur PDF avancé',
          version: '10.1.2',
          size: '289 KB'
        },
        {
          name: 'Foxit Reader',
          category: 'Bureautique & PDF',
          path: 'assets/tools/Apps portable/Bureautique & PDF/FoxitReaderPortable/App/Foxit Reader/FoxitPDFReader.exe',
          iconPath: 'assets/tools/icons/Bureautique & PDF/foxit.ico',
          description: 'Lecteur PDF rapide et léger',
          version: '12.1.2',
          size: '45 MB'
        },
        {
          name: 'Sumatra PDF',
          category: 'Bureautique & PDF',
          path: 'assets/tools/Apps portable/Bureautique & PDF/SumatraPDF/SumatraPDF-3.5.2-64.exe',
          iconPath: 'assets/tools/icons/Bureautique & PDF/sumatra.ico',
          description: 'Lecteur PDF minimaliste',
          version: '3.5.2',
          size: '8.5 MB'
        },
        // Utilitaires & divers
        {
          name: 'ShareX',
          category: 'Utilitaires & divers',
          path: 'assets/tools/Apps portable/Utilitaires & divers/ShareXPortable/ShareXPortable.exe',
          iconPath: 'assets/tools/icons/Utilitaires & divers/sharex.ico',
          description: 'Capture d\'écran et partage',
          version: '15.0.0',
          size: '12 MB'
        },
        {
          name: 'Ditto',
          category: 'Utilitaires & divers',
          path: 'assets/tools/Apps portable/Utilitaires & divers/DittoPortable/DittoPortable.exe',
          iconPath: 'assets/tools/icons/Utilitaires & divers/ditto.ico',
          description: 'Gestionnaire de presse-papiers',
          version: '3.24.238.0',
          size: '5.2 MB'
        },
        {
          name: 'WinDirStat',
          category: 'Utilitaires & divers',
          path: 'assets/tools/Apps portable/Utilitaires & divers/WinDirStatPortable/WinDirStatPortable.exe',
          iconPath: 'assets/tools/icons/Utilitaires & divers/windirstat.ico',
          description: 'Analyseur d\'espace disque',
          version: '1.1.2',
          size: '212 KB'
        },
        {
          name: 'Notepad++',
          category: 'Utilitaires & divers',
          path: 'assets/tools/Apps portable/Utilitaires & divers/Notepad++Portable/Notepad++Portable.exe',
          iconPath: 'assets/tools/icons/Utilitaires & divers/notepad++.ico',
          description: 'Éditeur de texte avancé',
          version: '8.6.2',
          size: '4.5 MB'
        },
        // Maintenance système
        {
          name: 'CCleaner',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/ccsetup/CCleaner.exe',
          iconPath: 'assets/tools/icons/Maintenance système/ccleaner.ico',
          description: 'Nettoyage et optimisation système',
          version: '6.12',
          size: '18 MB'
        },
        {
          name: 'Speccy',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/specPortable/spec.exe',
          iconPath: 'assets/tools/icons/Maintenance système/speccy.ico',
          description: 'Informations système détaillées',
          version: '1.32.740',
          size: '6.8 MB'
        },
        {
          name: 'GPU-Z',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/GPU-ZPortable/App/GPU-Z/GPU-Z.exe',
          iconPath: 'assets/tools/icons/Maintenance système/gpuz.png',
          description: 'Informations détaillées GPU',
          version: '2.51.0',
          size: '8.5 MB'
        },
        {
          name: 'CPU-Z',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/CPU-ZPortable/App/CPU-Z/cpuz_x64.exe',
          iconPath: 'assets/tools/icons/Maintenance système/cpuz.ico',
          description: 'Informations détaillées CPU',
          version: '2.06',
          size: '8.5 MB'
        },
        {
          name: 'HWMonitor',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/HWMonitorPortable/App/HWMonitor/HWMonitor_x64.exe',
          iconPath: 'assets/tools/icons/Maintenance système/hwmonitor.ico',
          description: 'Surveillance des températures',
          version: '1.52',
          size: '5.2 MB'
        },
        {
          name: 'Revo Uninstaller',
          category: 'Maintenance système',
          path: 'assets/tools/Apps portable/Maintenance système/RevoUninstallerPortable/App/RevoUninstaller/x64/RevoUn.exe',
          iconPath: 'assets/tools/icons/Maintenance système/revouninstaller.ico',
          description: 'Désinstallateur avancé',
          version: '2.4.5',
          size: '18 MB'
        },
        // Internet
        {
          name: 'Chrome Portable',
          category: 'Internet',
          path: 'assets/tools/Apps portable/Internet/GoogleChrome/App/Chrome-bin/chrome.exe',
          iconPath: 'assets/tools/icons/Internet/chrome-portable.ico',
          description: 'Navigateur Chrome portable',
          version: '120.0.6099.109',
          size: '85 MB'
        },
        {
          name: 'Firefox Portable',
          category: 'Internet',
          path: 'assets/tools/Apps portable/Internet/FirefoxPortable/App/Firefox64/firefox.exe',
          iconPath: 'assets/tools/icons/Internet/firefox-portable.ico',
          description: 'Navigateur Firefox portable',
          version: '121.0',
          size: '65 MB'
        },
        {
          name: 'qBittorrent',
          category: 'Internet',
          path: 'assets/tools/Apps portable/Internet/qBittorrentPortable/App/qBittorrent/qbittorrent.exe',
          iconPath: 'assets/tools/icons/Internet/qbittorrent.ico',
          description: 'Client BitTorrent open source',
          version: '4.6.2',
          size: '266 KB'
        },
        {
          name: 'FileZilla',
          category: 'Internet',
          path: 'assets/tools/Apps portable/Internet/FileZillaPortable/App/Filezilla64/filezilla.exe',
          iconPath: 'assets/tools/icons/Internet/filezilla.ico',
          description: 'Client FTP/SFTP',
          version: '3.66.5',
          size: '201 KB'
        },
        // Graphisme & multimédia
        {
          name: 'GIMP Portable',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/GIMPPortable/App/gimp/bin/gimp.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/gimp.ico',
          description: 'Éditeur d\'image open source',
          version: '2.10.36',
          size: '180 MB'
        },
        {
          name: 'Inkscape Portable',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/InkscapePortable/App/Inkscape/bin/inkscape.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/inkscape.ico',
          description: 'Éditeur de graphiques vectoriels',
          version: '1.3.2',
          size: '95 MB'
        },
        {
          name: 'VLC Media Player',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/VLCPortable/App/vlc/vlc.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/vlc.ico',
          description: 'Lecteur multimédia universel',
          version: '3.0.18',
          size: '229 KB'
        },
        {
          name: 'Paint.NET',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/PaintDotNetPortable/App/PaintDotNet64/paintdotnet.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/paintdotnet.ico',
          description: 'Éditeur d\'image avancé',
          version: '5.0.12',
          size: '15 MB'
        },
        {
          name: 'Krita',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/KritaPortable/App/Krita64/bin/krita.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/krita.ico',
          description: 'Logiciel de peinture numérique',
          version: '5.2.2',
          size: '120 MB'
        },
        {
          name: 'Audacity',
          category: 'Graphisme & multimédia',
          path: 'assets/tools/Apps portable/Graphisme & multimédia/AudacityPortable/App/Audacity/Audacity.exe',
          iconPath: 'assets/tools/icons/Graphisme & multimédia/audacity.ico',
          description: 'Éditeur audio open source',
          version: '3.4.2',
          size: '25 MB'
        },
        // Gestion de fichiers & compression
        {
          name: '7-Zip',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/7-ZipPortable/App/7-Zip/7zFM.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/7zip.ico',
          description: 'Compresseur et décompresseur',
          version: '23.01',
          size: '241 KB'
        },
        {
          name: 'Everything',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/EverythingPortable/App/Everything/Everything.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/everything.ico',
          description: 'Recherche ultra-rapide de fichiers',
          version: '1.4.1.1024',
          size: '2.1 MB'
        },
        {
          name: 'Explorer++',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/Explorer++Portable/App/Explorer++/Explorer++.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/explorer++.ico',
          description: 'Explorateur de fichiers alternatif',
          version: '1.4.0.1895',
          size: '1.8 MB'
        },
        {
          name: 'FreeCommander',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/FreeCommanderPortable/App/FreeCommanderXE/FreeCommander.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/freecommander.ico',
          description: 'Gestionnaire de fichiers avancé',
          version: '2023 Build 880',
          size: '12 MB'
        },
        {
          name: 'Q-Dir',
          category: 'Gestion de fichiers & compression',
          path: 'assets/tools/Apps portable/Gestion de fichiers & compression/Q-DirPortable/App/Q-Dir/Q-Dir.exe',
          iconPath: 'assets/tools/icons/Gestion de fichiers & compression/qdir.ico',
          description: 'Explorateur quadri-paneaux',
          version: '10.85',
          size: '2.2 MB'
        },
        // Sécurité
        {
          name: 'Emsisoft Emergency Kit',
          category: 'securite',
          path: 'assets/tools/Apps portable/Utilitaires & divers/EmsisoftEmergencyKitPortable/EmsisoftEmergencyKitPortable.exe',
          iconPath: 'assets/tools/icons/securite/emsisoft.ico',
          description: 'Kit d\'urgence antivirus',
          version: '2024.1.0.11828',
          size: '250 MB'
        },
        {
          name: 'Malwarebytes',
          category: 'securite',
          path: 'assets/tools/Apps portable/securite/malwarebytes/Malwarebytes.exe',
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

      // Convertir en objets Tool
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