import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Settings, 
  Shield, 
  Wifi, 
  Monitor, 
  Users, 
  Palette, 
  Clock, 
  Globe, 
  Package, 
  Wrench,
  HardDrive,
  Network,
  Database,
  Activity,
  Zap,
  Lock,
  FileText,
  Server,
  Terminal,
  Volume2,
  Printer,
  Gamepad2,
  Gauge,
  CheckCircle,
  Info,
  LucideIcon
} from 'lucide-react';
import './GodModePage.css';

interface GodModeCard {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  command: string;
  color: string;
  gradient: string;
  priority: 'high' | 'medium' | 'low';
  requiresAdmin?: boolean;
}

const GodModePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Définition des cartes GodMode
  const godModeCards: GodModeCard[] = [
    // Système & Sécurité
    {
      id: 'system-properties',
      title: 'Propriétés système',
      description: 'Informations système et paramètres avancés',
      category: 'Système & Sécurité',
      icon: Settings,
      command: 'sysdm.cpl',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      priority: 'high'
    },
    {
      id: 'device-manager',
      title: 'Gestionnaire de périphériques',
      description: 'Gérer les pilotes et périphériques',
      category: 'Système & Sécurité',
      icon: Monitor,
      command: 'devmgmt.msc',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      priority: 'high',
      requiresAdmin: true
    },
    {
      id: 'services',
      title: 'Services Windows',
      description: 'Gérer les services système',
      category: 'Système & Sécurité',
      icon: Server,
      command: 'services.msc',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      priority: 'high',
      requiresAdmin: true
    },
    {
      id: 'task-manager',
      title: 'Gestionnaire des tâches',
      description: 'Surveiller les processus et performances',
      category: 'Système & Sécurité',
      icon: Activity,
      command: 'taskmgr',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      priority: 'high'
    },
    {
      id: 'disk-management',
      title: 'Gestion des disques',
      description: 'Partitionner et gérer les disques',
      category: 'Système & Sécurité',
      icon: HardDrive,
      command: 'diskmgmt.msc',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      priority: 'medium',
      requiresAdmin: true
    },
    {
      id: 'event-viewer',
      title: 'Observateur d\'événements',
      description: 'Consulter les logs système',
      category: 'Système & Sécurité',
      icon: FileText,
      command: 'eventvwr.msc',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      priority: 'medium',
      requiresAdmin: true
    },
    {
      id: 'firewall',
      title: 'Pare-feu Windows',
      description: 'Configurer le pare-feu',
      category: 'Système & Sécurité',
      icon: Shield,
      command: 'wf.msc',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      priority: 'medium',
      requiresAdmin: true
    },

    // Réseau & Internet
    {
      id: 'network-connections',
      title: 'Connexions réseau',
      description: 'Gérer les connexions réseau',
      category: 'Réseau & Internet',
      icon: Wifi,
      command: 'ncpa.cpl',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      priority: 'high'
    },
    {
      id: 'internet-options',
      title: 'Options Internet',
      description: 'Paramètres de navigation',
      category: 'Réseau & Internet',
      icon: Globe,
      command: 'inetcpl.cpl',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      priority: 'medium'
    },
    {
      id: 'network-settings',
      title: 'Paramètres réseau',
      description: 'Configuration réseau avancée',
      category: 'Réseau & Internet',
      icon: Network,
      command: 'ms-settings:network',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      priority: 'medium'
    },

    // Matériel & Périphériques
    {
      id: 'sound-settings',
      title: 'Son et audio',
      description: 'Configurer l\'audio',
      category: 'Matériel & Périphériques',
      icon: Volume2,
      command: 'mmsys.cpl',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      priority: 'medium'
    },
    {
      id: 'display-settings',
      title: 'Affichage',
      description: 'Résolution et paramètres d\'écran',
      category: 'Matériel & Périphériques',
      icon: Monitor,
      command: 'desk.cpl',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      priority: 'medium'
    },
    {
      id: 'printer-settings',
      title: 'Imprimantes',
      description: 'Gérer les imprimantes',
      category: 'Matériel & Périphériques',
      icon: Printer,
      command: 'control printers',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      priority: 'low'
    },
    {
      id: 'game-controllers',
      title: 'Contrôleurs de jeu',
      description: 'Configurer les manettes',
      category: 'Matériel & Périphériques',
      icon: Gamepad2,
      command: 'joy.cpl',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      priority: 'low'
    },

    // Comptes utilisateurs
    {
      id: 'user-accounts',
      title: 'Comptes utilisateurs',
      description: 'Gérer les comptes',
      category: 'Comptes utilisateurs',
      icon: Users,
      command: 'netplwiz',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      priority: 'high',
      requiresAdmin: true
    },
    {
      id: 'local-users',
      title: 'Utilisateurs et groupes',
      description: 'Gestion avancée des utilisateurs',
      category: 'Comptes utilisateurs',
      icon: Users,
      command: 'lusrmgr.msc',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      priority: 'medium',
      requiresAdmin: true
    },

    // Apparence & Personnalisation
    {
      id: 'personalization',
      title: 'Personnalisation',
      description: 'Thèmes et apparence',
      category: 'Apparence & Personnalisation',
      icon: Palette,
      command: 'ms-settings:personalization',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      priority: 'medium'
    },
    {
      id: 'desktop-settings',
      title: 'Paramètres du bureau',
      description: 'Configurer le bureau',
      category: 'Apparence & Personnalisation',
      icon: Monitor,
      command: 'desk.cpl',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      priority: 'medium'
    },

    // Date & Heure
    {
      id: 'date-time',
      title: 'Date et heure',
      description: 'Configurer l\'heure système',
      category: 'Date & Heure',
      icon: Clock,
      command: 'timedate.cpl',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      priority: 'low'
    },

    // Options régionales
    {
      id: 'regional-settings',
      title: 'Options régionales',
      description: 'Langue et format',
      category: 'Options régionales',
      icon: Globe,
      command: 'intl.cpl',
      color: '#84cc16',
      gradient: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
      priority: 'low'
    },

    // Programmes
    {
      id: 'programs-features',
      title: 'Programmes et fonctionnalités',
      description: 'Désinstaller des programmes',
      category: 'Programmes',
      icon: Package,
      command: 'appwiz.cpl',
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      priority: 'medium'
    },
    {
      id: 'default-programs',
      title: 'Programmes par défaut',
      description: 'Configurer les associations',
      category: 'Programmes',
      icon: Package,
      command: 'control /name Microsoft.DefaultPrograms',
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      priority: 'low'
    },

    // Outils d'administration
    {
      id: 'computer-management',
      title: 'Gestion de l\'ordinateur',
      description: 'Console d\'administration complète',
      category: 'Outils d\'administration',
      icon: Wrench,
      command: 'compmgmt.msc',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      priority: 'high',
      requiresAdmin: true
    },
    {
      id: 'group-policy',
      title: 'Stratégie de groupe',
      description: 'Éditeur de stratégie de groupe',
      category: 'Outils d\'administration',
      icon: Lock,
      command: 'gpedit.msc',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      priority: 'high',
      requiresAdmin: true
    },
    {
      id: 'registry-editor',
      title: 'Éditeur de registre',
      description: 'Modifier le registre Windows',
      category: 'Outils d\'administration',
      icon: Database,
      command: 'regedit',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      priority: 'high',
      requiresAdmin: true
    },
    {
      id: 'command-prompt',
      title: 'Invite de commandes',
      description: 'Ouvrir CMD',
      category: 'Outils d\'administration',
      icon: Terminal,
      command: 'cmd',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      priority: 'medium'
    },
    {
      id: 'powershell',
      title: 'PowerShell',
      description: 'Ouvrir PowerShell',
      category: 'Outils d\'administration',
      icon: Terminal,
      command: 'powershell',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      priority: 'medium'
    },
    {
      id: 'performance-monitor',
      title: 'Moniteur de performances',
      description: 'Surveiller les performances',
      category: 'Outils d\'administration',
      icon: Gauge,
      command: 'perfmon',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      priority: 'medium',
      requiresAdmin: true
    },
    {
      id: 'resource-monitor',
      title: 'Moniteur de ressources',
      description: 'Surveiller l\'utilisation des ressources',
      category: 'Outils d\'administration',
      icon: Activity,
      command: 'resmon',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      priority: 'medium'
    },
    {
      id: 'system-configuration',
      title: 'Configuration système',
      description: 'MSConfig - Démarrage et services',
      category: 'Outils d\'administration',
      icon: Settings,
      command: 'msconfig',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      priority: 'high',
      requiresAdmin: true
    },
    {
      id: 'directx-diagnostic',
      title: 'Diagnostic DirectX',
      description: 'Diagnostiquer les problèmes graphiques',
      category: 'Outils d\'administration',
      icon: Gamepad2,
      command: 'dxdiag',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      priority: 'low'
    }
  ];

  // Obtenir les catégories uniques
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(godModeCards.map(card => card.category))];
    return cats;
  }, []);

  // Filtrer les cartes
  const filteredCards = useMemo(() => {
    return godModeCards.filter(card => {
      const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Exécuter une commande
  const executeCommand = async (card: GodModeCard) => {
    setIsExecuting(card.id);
    
    try {
      if (window.electronAPI?.executeSystemCommand) {
        const result = await window.electronAPI.executeSystemCommand('cmd.exe', ['/c', card.command]);
        
        if (result.success) {
          setShowSuccess(card.id);
          setTimeout(() => setShowSuccess(null), 3000);
        } else {
          console.error('Erreur lors de l\'exécution:', result.error);
        }
      } else {
        console.error('API Electron non disponible');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsExecuting(null);
    }
  };

  // Obtenir la couleur de priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="godmode-page">
      {/* Header */}
      <motion.div 
        className="godmode-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-content">
          <div className="header-title">
            <motion.div
              className="godmode-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Zap size={48} />
            </motion.div>
            <div className="title-text">
              <h1>GodMode - Super Panneau de Contrôle</h1>
              <p>Accès rapide à tous les outils système Windows</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="search-filters-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un outil ou une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="category-filters">
          <div className="filters-scroll">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === 'all' ? 'Toutes les catégories' : category}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div 
        className="cards-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {filteredCards.length === 0 ? (
          <motion.div 
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Info size={48} />
            <h3>Aucun résultat trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </motion.div>
        ) : (
          <div className="cards-grid">
            <AnimatePresence>
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="godmode-card"
                  style={{ background: card.gradient }}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -50 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 20px 40px ${card.color}40`,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => executeCommand(card)}
                >
                  {/* Indicateur de priorité */}
                  <motion.div
                    className="priority-indicator"
                    style={{ backgroundColor: getPriorityColor(card.priority) }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.5 }}
                  />

                  {/* Indicateur Admin */}
                  {card.requiresAdmin && (
                    <motion.div
                      className="admin-indicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.6 }}
                    >
                      <Shield size={12} />
                    </motion.div>
                  )}

                  {/* Card Content */}
                  <div className="card-content">
                    <div className="card-icon">
                      <motion.div
                        className="icon-wrapper"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <card.icon size={32} />
                      </motion.div>
                    </div>
                    
                    <div className="card-text">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      <span className="card-category">{card.category}</span>
                    </div>
                  </div>

                  {/* Loading State */}
                  {isExecuting === card.id && (
                    <motion.div
                      className="card-loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="spinner"></div>
                    </motion.div>
                  )}

                  {/* Success State */}
                  {showSuccess === card.id && (
                    <motion.div
                      className="card-success"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <CheckCircle size={24} />
                    </motion.div>
                  )}

                  {/* Effet de brillance */}
                  <motion.div
                    className="card-shine"
                    initial={{ x: -100, opacity: 0 }}
                    whileHover={{ x: 100, opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Stats Footer */}
      <motion.div 
        className="stats-footer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="stats-content">
          <div className="stat-item">
            <span className="stat-number">{filteredCards.length}</span>
            <span className="stat-label">Outils disponibles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{categories.length - 1}</span>
            <span className="stat-label">Catégories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{godModeCards.filter(c => c.requiresAdmin).length}</span>
            <span className="stat-label">Nécessitent Admin</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GodModePage; 