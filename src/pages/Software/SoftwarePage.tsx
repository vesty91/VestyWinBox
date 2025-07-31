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
  HardDrive,
  Zap
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

  const getLogicielDescription = (logiciel: Tool) => {
    const descriptions: { [key: string]: string } = {
      'CrystalDiskInfo': 'Outil de surveillance de la santé des disques durs. Affiche les informations SMART et les températures en temps réel.',
      'CPU-Z': 'Informations détaillées sur le processeur, la carte mère et la mémoire. Identification complète des composants système.',
      'GPU-Z': 'Informations techniques détaillées sur la carte graphique. Spécifications, températures et performances.',
      'HWMonitor': 'Surveillance en temps réel des températures, tensions et vitesses de ventilateurs. Monitoring complet du système.',
      'Process Explorer': 'Gestionnaire de processus avancé avec informations détaillées. Alternative puissante au Gestionnaire des tâches.',
      'Autoruns': 'Gestionnaire de démarrage système avancé. Contrôle des programmes qui se lancent au démarrage.',
      'Revo Uninstaller': 'Désinstallateur avancé qui supprime complètement les applications et leurs traces. Nettoyage en profondeur.',
      'CCleaner': 'Nettoyage système pour optimiser les performances. Supprime les fichiers temporaires et nettoie le registre.',
      'Malwarebytes': 'Protection contre les malwares et logiciels espions. Scan en temps réel et suppression des menaces.',
      'Kaspersky Virus Removal Tool': 'Outil de suppression de virus portable. Nettoyage des infections sans installation.',
      'Windows Firewall Control': 'Contrôle avancé du pare-feu Windows. Gestion fine des règles de sécurité réseau.',
      '7-Zip': 'Compresseur et décompresseur de fichiers très efficace. Support de nombreux formats d\'archives.',
      'WinRAR': 'Compresseur de fichiers populaire avec interface graphique. Création et extraction d\'archives.',
      'PeaZip': 'Compresseur open source avec interface moderne. Support de nombreux formats d\'archives.',
      'VirtualBox': 'Plateforme de virtualisation open source. Création et gestion de machines virtuelles.',
      'VMware Workstation': 'Solution de virtualisation professionnelle. Environnements virtuels avancés.',
      'Google Chrome': 'Navigateur web rapide et sécurisé. Interface moderne avec synchronisation des données.',
      'Mozilla Firefox': 'Navigateur web open source avec protection de la vie privée. Personnalisation avancée.',
      'Microsoft Edge': 'Navigateur web moderne de Microsoft. Intégration avec les services Microsoft.',
      'Visual Studio Code': 'Éditeur de code source léger et puissant. Support de nombreux langages de programmation.',
      'Notepad++': 'Éditeur de texte avancé avec coloration syntaxique. Support de nombreux langages.',
      'Sublime Text': 'Éditeur de texte rapide et extensible. Interface minimaliste et performances élevées.',
      'Atom': 'Éditeur de texte hackable pour le 21ème siècle. Personnalisation complète.',
      'FileZilla': 'Client FTP/SFTP pour transférer des fichiers. Interface simple et efficace.',
      'PuTTY': 'Client SSH et Telnet pour Windows. Connexion sécurisée aux serveurs distants.',
      'WinSCP': 'Client SFTP, SCP et FTP pour Windows. Transfert de fichiers sécurisé.',
      'HashTab': 'Calcul et vérification de hashes de fichiers. Intégration dans l\'explorateur Windows.',
      'HashMyFiles': 'Calcul de hashes MD5, SHA1 et SHA256. Vérification d\'intégrité des fichiers.',
      'FCIV': 'Outil de ligne de commande pour calculer les hashes. Intégration dans les scripts.',
      'TeamViewer': 'Logiciel de contrôle à distance et partage d\'écran. Accès distant sécurisé.',
      'AnyDesk': 'Logiciel de bureau à distance rapide et sécurisé. Connexion à distance simple.',
      'VNC Viewer': 'Client VNC pour accès distant. Connexion aux serveurs VNC.',
      'Discord': 'Plateforme de communication pour les joueurs et développeurs. Chat vocal et textuel.',
      'Slack': 'Plateforme de collaboration d\'équipe. Communication et partage de fichiers.',
      'Telegram': 'Messagerie instantanée sécurisée. Chiffrement de bout en bout.',
      'WhatsApp': 'Application de messagerie populaire. Communication simple et sécurisée.',
      'Skype': 'Logiciel de communication vocale et vidéo. Appels internationaux.',
      'Zoom': 'Plateforme de visioconférence professionnelle. Réunions en ligne.',
      'Microsoft Teams': 'Plateforme de collaboration Microsoft. Réunions et chat d\'équipe.'
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
                <p className="logiciel-description">{getLogicielDescription(logiciel)}</p>
                
                <div className="logiciel-meta">
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
                  onClick={() => {
                    setSelectedLogiciel(logiciel);
                    setShowModal(true);
                  }}
                  title="Plus d'infos"
                >
                  <Download size={16} />
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

 
 