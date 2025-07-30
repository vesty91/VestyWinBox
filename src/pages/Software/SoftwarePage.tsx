import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  Download, 
  Play, 
  MoreVertical,
  Heart,
  Share2,
  Package,
  Monitor,
  Code,
  Globe,
  MessageCircle,
  HardDrive,
  Shield,
  Settings
} from 'lucide-react';
import { ToolsService, Tool } from '../../services/ToolsService';
import './SoftwarePage.css';

const SoftwarePage: React.FC = () => {
  const [logiciels, setLogiciels] = useState<Tool[]>([]);
  const [filteredLogiciels, setFilteredLogiciels] = useState<Tool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'size'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLogiciel, setSelectedLogiciel] = useState<Tool | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogiciels();
  }, []);

  useEffect(() => {
    filterAndSortLogiciels();
  }, [logiciels, selectedCategory, searchQuery, sortBy]);

  const loadLogiciels = async () => {
    setLoading(true);
    try {
      const data = await ToolsService.scanLogiciels();
      setLogiciels(data);
    } catch (error) {
      console.error('Erreur lors du chargement des logiciels:', error);
    }
    setLoading(false);
  };

  const filterAndSortLogiciels = () => {
    let filtered = logiciels;

    // Filtrer par catégorie
    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(logiciel => logiciel.category === selectedCategory);
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

    setFilteredLogiciels(filtered);
  };

  const handleInstall = (logiciel: Tool) => {
    console.log('🚀 Installation de:', logiciel.name);
    alert(`Installation de ${logiciel.name} en cours...`);
  };

  const handleUninstall = (logiciel: Tool) => {
    console.log('🗑️ Désinstallation de:', logiciel.name);
    alert(`Désinstallation de ${logiciel.name} en cours...`);
  };

  const handleLaunch = (logiciel: Tool) => {
    console.log('▶️ Lancement de:', logiciel.name);
    if (window.electronAPI?.launchExecutable) {
      window.electronAPI.launchExecutable(logiciel.path);
    } else {
      alert(`Lancement de ${logiciel.name}...`);
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Communication': <MessageCircle size={20} />,
      'Maintenance Windows': <Settings size={20} />,
      'Vérification & Hash': <Shield size={20} />,
      'Système & Monitoring': <Monitor size={20} />,
      'Développement': <Code size={20} />,
      'Navigateurs': <Globe size={20} />,
      'Compression': <Package size={20} />,
      'Virtualisation': <HardDrive size={20} />
    };
    return iconMap[category] || <Package size={20} />;
  };

  const getLogicielIcon = (logiciel: Tool) => {
    if (logiciel.iconPath) {
      return (
        <img 
          src={logiciel.iconPath} 
          alt={logiciel.name}
          className="logiciel-icon"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    return getCategoryIcon(logiciel.category);
  };

  const categories = ['Tous', ...ToolsService.getCategories(logiciels)];

  if (loading) {
    return (
      <div className="software-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des logiciels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="software-page">
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <h1 className="page-title">Logiciels</h1>
          <p className="page-subtitle">Gestionnaire de logiciels système</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <Package size={20} />
            <div className="stat-info">
              <span className="stat-value">{logiciels.length}</span>
              <span className="stat-label">Logiciels</span>
            </div>
          </div>
          <div className="stat-card">
            <Grid size={20} />
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
            placeholder="Rechercher un logiciel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'Tous' ? <Package size={16} /> : getCategoryIcon(category)}
                <span>{category}</span>
              </button>
            ))}
          </div>

          <div className="view-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'size')}
              className="sort-select"
              title="Trier les logiciels"
            >
              <option value="name">Trier par nom</option>
              <option value="category">Trier par catégorie</option>
              <option value="size">Trier par taille</option>
            </select>

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
        </div>
      </motion.div>

      {/* Grille des logiciels */}
      <motion.div 
        className={`software-grid ${viewMode}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence>
          {filteredLogiciels.map((logiciel) => (
            <motion.div
              key={logiciel.id}
              className="software-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="card-header">
                <div className="logiciel-icon-container">
                  {getLogicielIcon(logiciel)}
                  {getCategoryIcon(logiciel.category)}
                </div>
                <div className="card-actions">
                  <button className="action-btn favorite" title="Favoris">
                    <Heart size={16} />
                  </button>
                  <button className="action-btn share" title="Partager">
                    <Share2 size={16} />
                  </button>
                  <button 
                    className="action-btn more" 
                    title="Plus d'options"
                    onClick={() => {
                      setSelectedLogiciel(logiciel);
                      setShowModal(true);
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              <div className="card-content">
                <h3 className="logiciel-name">{logiciel.name}</h3>
                <p className="logiciel-description">{logiciel.description}</p>
                
                <div className="logiciel-meta">
                  <span className="logiciel-category">{logiciel.category}</span>
                  {logiciel.version && (
                    <span className="logiciel-version">v{logiciel.version}</span>
                  )}
                  {logiciel.size && (
                    <span className="logiciel-size">{logiciel.size}</span>
                  )}
                </div>
              </div>

              <div className="card-footer">
                <button 
                  className="btn-primary"
                  onClick={() => handleLaunch(logiciel)}
                  title="Lancer"
                >
                  <Play size={16} />
                  <span>Lancer</span>
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => handleInstall(logiciel)}
                  title="Installer"
                >
                  <Download size={16} />
                  <span>Installer</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal de détails */}
      <AnimatePresence>
        {showModal && selectedLogiciel && (
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
                  {getLogicielIcon(selectedLogiciel)}
                </div>
                <div className="modal-info">
                  <h2>{selectedLogiciel.name}</h2>
                  <p>{selectedLogiciel.description}</p>
                </div>
                <button 
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-details">
                  <div className="detail-item">
                    <span className="detail-label">Catégorie:</span>
                    <span className="detail-value">{selectedLogiciel.category}</span>
                  </div>
                  {selectedLogiciel.version && (
                    <div className="detail-item">
                      <span className="detail-label">Version:</span>
                      <span className="detail-value">{selectedLogiciel.version}</span>
                    </div>
                  )}
                  {selectedLogiciel.size && (
                    <div className="detail-item">
                      <span className="detail-label">Taille:</span>
                      <span className="detail-value">{selectedLogiciel.size}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Chemin:</span>
                    <span className="detail-value">{selectedLogiciel.path}</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-primary"
                  onClick={() => {
                    handleLaunch(selectedLogiciel);
                    setShowModal(false);
                  }}
                >
                  <Play size={16} />
                  Lancer
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    handleInstall(selectedLogiciel);
                    setShowModal(false);
                  }}
                >
                  <Download size={16} />
                  Installer
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => {
                    handleUninstall(selectedLogiciel);
                    setShowModal(false);
                  }}
                >
                  <MoreVertical size={16} />
                  Désinstaller
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoftwarePage;

 
 