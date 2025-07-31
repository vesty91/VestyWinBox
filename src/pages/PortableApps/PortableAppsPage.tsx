import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  Download, 
  Play, 
  X,
  Package,
  Monitor,
  Code,
  Globe,
  Shield,
  Settings,
  FileText,
  Smartphone,
  Zap,
  Info,
  Image
} from 'lucide-react';
import { ToolsService, Tool } from '../../services/ToolsService';
import './PortableAppsPage.css';

const PortableAppsPage: React.FC = () => {
  const [portableApps, setPortableApps] = useState<Tool[]>([]);
  const [filteredApps, setFilteredApps] = useState<Tool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'size'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedApp, setSelectedApp] = useState<Tool | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortableApps();
  }, []);

  useEffect(() => {
    filterAndSortApps();
  }, [portableApps, selectedCategory, searchQuery, sortBy]);

  const loadPortableApps = async () => {
    setLoading(true);
    try {
      const data = await ToolsService.scanPortableApps();
      setPortableApps(data);
    } catch (error) {
      console.error('Erreur lors du chargement des apps portables:', error);
    }
    setLoading(false);
  };

  const filterAndSortApps = () => {
    let filtered = portableApps;

    // Filtrer par catégorie
    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    // Filtrer par recherche
    if (searchQuery) {
      filtered = ToolsService.searchTools(filtered, searchQuery);
    }

    // Trier
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'size':
          return a.size?.localeCompare(b.size || '') || 0;
        default:
          return 0;
      }
    });

    setFilteredApps(filtered);
  };

  const handleLaunch = (app: Tool) => {
    console.log('▶️ Lancement de:', app.name);
    if (window.electronAPI?.launchExecutable) {
      window.electronAPI.launchExecutable(app.path);
    } else {
      alert(`Lancement de ${app.name}...`);
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Bureautique & PDF': <FileText size={20} />,
      'Utilitaires & divers': <Settings size={20} />,
      'Maintenance système': <Monitor size={20} />,
      'Internet': <Globe size={20} />,
      'Graphisme & multimédia': <Image size={20} />,
      'Gestion de fichiers & compression': <Package size={20} />,
      'securite': <Shield size={20} />
    };
    return iconMap[category] || <Smartphone size={20} />;
  };

  const getAppIcon = (app: Tool) => {
    if (app.iconPath) {
      return (
        <>
          <img 
            src={app.iconPath} 
            alt={app.name}
            className="app-icon"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Afficher l'icône de catégorie en fallback
              const fallbackIcon = target.parentElement?.querySelector('.fallback-icon');
              if (fallbackIcon) {
                fallbackIcon.classList.remove('hidden');
              }
            }}
          />
          <div className="hidden fallback-icon">
            {getCategoryIcon(app.category)}
          </div>
        </>
      );
    }
    return getCategoryIcon(app.category);
  };

  const getAppDescription = (app: Tool) => {
    const descriptions: { [key: string]: string } = {
      '7-Zip': 'Compresseur et décompresseur de fichiers très efficace avec support de nombreux formats. Idéal pour réduire la taille des fichiers et créer des archives.',
      'PDF-XChange Editor': 'Éditeur PDF avancé avec outils d\'annotation, de modification et de création. Parfait pour travailler avec des documents PDF professionnels.',
      'Foxit Reader': 'Lecteur PDF rapide et léger avec interface moderne. Excellente alternative à Adobe Reader avec des fonctionnalités avancées.',
      'Sumatra PDF': 'Lecteur PDF minimaliste et ultra-rapide. Parfait pour une lecture simple et efficace sans surcharge d\'interface.',
      'WinDirStat': 'Analyseur d\'espace disque visuel qui affiche l\'utilisation de l\'espace sous forme d\'arborescence et de graphiques colorés.',
      'ShareX': 'Outil de capture d\'écran avancé avec partage automatique. Capture d\'écran, enregistrement vidéo et partage en un clic.',
      'Notepad++': 'Éditeur de texte avancé avec coloration syntaxique, support de nombreux langages de programmation et plugins extensibles.',
      'Emsisoft Emergency Kit': 'Kit d\'urgence antivirus portable pour nettoyer les systèmes infectés. Scan rapide et suppression des menaces.',
      'Ditto': 'Gestionnaire de presse-papiers avancé qui garde l\'historique des éléments copiés. Accès rapide aux éléments précédents.',
      'CCleaner': 'Nettoyage système portable pour optimiser les performances. Supprime les fichiers temporaires et nettoie le registre.',
      'SPEC': 'Test de performance système pour évaluer les capacités de votre ordinateur. Benchmarks complets et détaillés.',
      'GPU-Z': 'Informations détaillées sur votre carte graphique. Spécifications techniques, températures et performances en temps réel.',
      'CPU-Z': 'Informations complètes sur votre processeur, carte mère et mémoire. Détails techniques et identification des composants.',
      'HWMonitor': 'Surveillance des températures et tensions en temps réel. Monitoring complet des composants système.',
      'Process Explorer': 'Gestionnaire de processus avancé avec informations détaillées. Alternative puissante au Gestionnaire des tâches Windows.',
      'Revo Uninstaller': 'Désinstallateur avancé qui supprime complètement les applications et leurs traces. Nettoyage en profondeur.',
      'qBittorrent': 'Client BitTorrent open source sans publicité. Téléchargement de fichiers via le protocole BitTorrent.',
      'FileZilla': 'Client FTP/SFTP pour transférer des fichiers vers et depuis des serveurs. Interface simple et efficace.',
      'Google Chrome': 'Navigateur Chrome portable avec tous vos favoris et extensions. Navigation rapide et sécurisée.',
      'Firefox': 'Navigateur Firefox portable avec protection de la vie privée. Navigation privée et personnalisable.',
      'VLC Media Player': 'Lecteur multimédia universel qui lit presque tous les formats vidéo et audio. Lecteur de référence.',
      'Paint.NET': 'Éditeur d\'image avancé avec outils de retouche photo. Alternative gratuite à Photoshop pour les tâches courantes.',
      'Krita': 'Logiciel de peinture numérique professionnel pour artistes. Outils de dessin et peinture avancés.',
      'Inkscape': 'Éditeur de graphiques vectoriels open source. Création d\'illustrations, logos et designs vectoriels.',
      'GIMP': 'Éditeur d\'image open source puissant. Retouche photo et création graphique professionnelle.',
      'Audacity': 'Éditeur audio open source pour enregistrer et modifier des fichiers audio. Outils de montage audio avancés.',
      'Everything': 'Moteur de recherche ultra-rapide pour fichiers et dossiers. Indexation instantanée et recherche en temps réel.',
      'Explorer++': 'Explorateur de fichiers alternatif avec onglets multiples. Navigation plus efficace que l\'explorateur Windows.',
      'FreeCommander': 'Gestionnaire de fichiers avancé avec interface à deux panneaux. Outils de gestion de fichiers puissants.',
      'PeaZip': 'Compresseur avec interface graphique moderne. Support de nombreux formats d\'archives.',
      'Q-Dir': 'Explorateur quadri-paneaux pour une navigation multi-dossiers. Vue simultanée de plusieurs répertoires.',
      'Malwarebytes': 'Protection contre les malwares et logiciels espions. Scan en temps réel et suppression des menaces.',
      'Autoruns': 'Gestionnaire de démarrage système avancé. Contrôle des programmes qui se lancent au démarrage.',
      'Process Explorer Security': 'Explorateur de processus avancé avec informations détaillées. Monitoring système professionnel.',
      'Kaspersky Virus Removal Tool': 'Outil de suppression de virus portable. Nettoyage des infections sans installation.',
      'Windows Firewall Control': 'Contrôle avancé du pare-feu Windows. Gestion fine des règles de sécurité réseau.'
    };
    
    return descriptions[app.name] || app.description || 'Application portable sans description détaillée.';
  };

  const categories = ['Tous', ...ToolsService.getCategories(portableApps)];

  if (loading) {
    return (
      <div className="portable-apps-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des apps portables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portable-apps-page">
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <h1 className="page-title">Apps Portable</h1>
          <p className="page-subtitle">Applications portables sans installation</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <Smartphone size={20} />
            <div className="stat-info">
              <span className="stat-value">{portableApps.length}</span>
              <span className="stat-label">Apps</span>
            </div>
          </div>
          <div className="stat-card">
            <Zap size={20} />
            <div className="stat-info">
              <span className="stat-value">{categories.length - 1}</span>
              <span className="stat-label">Catégories</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div 
        className="filters-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher une app portable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-dropdowns">
            <div className="dropdown-container">
              <label htmlFor="category-select">Catégorie</label>
              <select 
                id="category-select"
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
                title="Filtrer par catégorie"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown-container">
              <label htmlFor="sort-select">Trier par</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'size')}
                className="filter-select"
                title="Trier les applications"
              >
                <option value="name">Nom</option>
                <option value="category">Catégorie</option>
                <option value="size">Taille</option>
              </select>
            </div>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vue grille"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vue liste"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grille des apps */}
      <motion.div 
        className={`apps-grid ${viewMode}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence>
          {filteredApps.map((app) => (
            <motion.div
              key={app.id}
              className="app-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="card-header">
                <div className="app-icon-container">
                  {getAppIcon(app)}
                </div>
              </div>

              <div className="card-content">
                <h3 className="app-name">{app.name}</h3>
                <p className="app-description">{getAppDescription(app)}</p>
                
                <div className="app-meta">
                  {app.version && (
                    <span className="app-version">v{app.version}</span>
                  )}
                  {app.size && (
                    <span className="app-size">{app.size}</span>
                  )}
                </div>
              </div>

              <div className="card-footer">
                <button 
                  className="btn-primary"
                  onClick={() => handleLaunch(app)}
                  title="Lancer"
                >
                  <Play size={16} />
                  <span>Lancer</span>
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedApp(app);
                    setShowModal(true);
                  }}
                  title="Plus d'infos"
                >
                  <Info size={16} />
                  <span>Infos</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal de détails */}
      <AnimatePresence>
        {showModal && selectedApp && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-icon">
                  {getAppIcon(selectedApp)}
                </div>
                <div className="modal-info">
                  <h2>{selectedApp.name}</h2>
                </div>
                <button 
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-description">
                  <p>{getAppDescription(selectedApp)}</p>
                </div>
                
                <div className="modal-details">
                  {selectedApp.version && (
                    <div className="detail-item">
                      <span className="detail-label">Version:</span>
                      <span className="detail-value">{selectedApp.version}</span>
                    </div>
                  )}
                  {selectedApp.size && (
                    <div className="detail-item">
                      <span className="detail-label">Taille:</span>
                      <span className="detail-value">{selectedApp.size}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-primary"
                  onClick={() => {
                    handleLaunch(selectedApp);
                    setShowModal(false);
                  }}
                >
                  <Play size={16} />
                  Lancer
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  <X size={16} />
                  Fermer
                </button>
                {/* <button 
                  className="btn-favorite"
                  onClick={() => {
                    handleFavorite(selectedApp);
                    setShowModal(false);
                  }}
                >
                  <Heart size={16} />
                  Favoris
                </button> */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortableAppsPage; 