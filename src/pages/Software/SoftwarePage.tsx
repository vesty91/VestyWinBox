import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  Play, 
  X,
  Package,
  Monitor,
  Code,
  Globe,
  Shield,
  Settings,
  FileText,
  HardDrive,
  Zap,
  Info
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

  const handleLaunch = async (logiciel: Tool) => {
    console.log('▶️ Lancement de:', logiciel.name);
    try {
    if (window.electronAPI?.launchExecutable) {
        const result = await window.electronAPI.launchExecutable(logiciel.path);
        if (result.success) {
          console.log('✅', result.message);
          // Optionnel : afficher une notification de succès
        } else {
          console.error('❌ Erreur:', result.error);
          alert(`Erreur lors du lancement de ${logiciel.name}: ${result.error}`);
        }
    } else {
        console.log('⚠️ API Electron non disponible, simulation...');
        alert(`Lancement de ${logiciel.name}... (mode simulation)`);
      }
    } catch (error) {
      console.error('❌ Erreur lors du lancement:', error);
      alert(`Erreur lors du lancement de ${logiciel.name}: ${error}`);
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Communication': <FileText size={20} />,
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
        <>
          <img 
            src={logiciel.iconPath} 
            alt={logiciel.name}
            className="logiciel-icon"
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
            {getCategoryIcon(logiciel.category)}
          </div>
        </>
      );
    }
    return getCategoryIcon(logiciel.category);
  };

  const getLogicielDescription = (logiciel: Tool) => {
    const descriptions: { [key: string]: string } = {
      'WhatsApp': 'Application de messagerie instantanée populaire. Communication simple et sécurisée avec chiffrement de bout en bout.',
      '7-Zip': 'Compresseur et décompresseur de fichiers très efficace. Support de nombreux formats d\'archives avec taux de compression élevé.',
      'WinRAR': 'Compresseur de fichiers populaire avec interface graphique. Création et extraction d\'archives avec protection par mot de passe.',
      'Chrome': 'Navigateur web rapide et sécurisé. Interface moderne avec synchronisation des données et nombreuses extensions.',
      'Firefox': 'Navigateur web open source avec protection de la vie privée. Personnalisation avancée et respect de la confidentialité.',
      'Opera': 'Navigateur web avec VPN intégré et économiseur de batterie. Fonctionnalités avancées pour une navigation optimisée.',
      'Brave': 'Navigateur web axé sur la confidentialité. Blocage automatique des publicités et protection contre le tracking.',
      'Visual Studio Code': 'Éditeur de code source léger et puissant. Support de nombreux langages de programmation avec extensions.',
      'Git': 'Système de contrôle de version distribué. Gestion des versions de code et collaboration en équipe.',
      'Node.js': 'Runtime JavaScript pour le développement côté serveur. Exécution de JavaScript en dehors du navigateur.',
      'Cursor': 'Éditeur de code avec IA intégrée. Assistance intelligente pour le développement et la génération de code.',
      'CPU-Z': 'Informations détaillées sur le processeur, la carte mère et la mémoire. Identification complète des composants système.',
      'CrystalDiskInfo': 'Outil de surveillance de la santé des disques durs. Affiche les informations SMART et les températures en temps réel.',
      'CrystalDiskMark': 'Test de performance des disques durs et SSD. Mesure des vitesses de lecture et d\'écriture.',
      'AIDA64': 'Diagnostic système complet et benchmark. Informations détaillées sur tous les composants matériels.',
      'HWiNFO': 'Informations système détaillées et monitoring en temps réel. Surveillance complète des composants.',
      'MSI Afterburner': 'Overclocking et monitoring GPU avancé. Contrôle des performances graphiques et surveillance des températures.',
      'HD Tune': 'Test et diagnostic des disques durs. Analyse des performances et détection des problèmes.',
      'Hard Disk Sentinel': 'Surveillance de la santé des disques durs. Prévention des pannes et optimisation des performances.',
      'OCCT': 'Test de stabilité système complet. Vérification de la stabilité du matériel sous charge.',
      'BurnIn Test': 'Test de stress matériel professionnel. Validation de la fiabilité des composants système.',
      'Performance Test': 'Benchmark système complet et détaillé. Comparaison des performances avec d\'autres systèmes.',
      'RAM Saver': 'Optimisation de la mémoire RAM. Libération automatique de la mémoire pour améliorer les performances.',
      'HashTab': 'Calcul et vérification de hashes de fichiers. Intégration dans l\'explorateur Windows pour vérification d\'intégrité.',
      'Hash Check': 'Vérification d\'intégrité des fichiers. Calcul de hashes MD5, SHA1 et SHA256 pour sécuriser les fichiers.',
      'VirtualBox': 'Plateforme de virtualisation open source. Création et gestion de machines virtuelles gratuites.',
      'VMware Workstation': 'Solution de virtualisation professionnelle. Environnements virtuels avancés pour développeurs et testeurs.',
      'Driver Booster': 'Mise à jour automatique des pilotes système. Optimisation des performances et résolution des conflits.',
      'ProduKey': 'Récupération des clés de produit Windows et Office. Sauvegarde et restauration des licences logiciels.',
      'Pause Update': 'Pause des mises à jour Windows automatiques. Contrôle total sur les mises à jour système.'
    };
    
    return descriptions[logiciel.name] || logiciel.description || 'Logiciel système sans description détaillée.';
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
            placeholder="Rechercher un logiciel..."
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
                title="Trier les logiciels"
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
                </div>
              </div>

              <div className="card-content">
                <h3 className="logiciel-name">{logiciel.name}</h3>
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
                  onClick={() => {
                    setSelectedLogiciel(logiciel);
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
                  <p>{getLogicielDescription(selectedLogiciel)}</p>
                </div>
                
                <div className="modal-details">
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
                    setShowModal(false);
                  }}
                >
                  <X size={16} />
                  Fermer
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

 
 