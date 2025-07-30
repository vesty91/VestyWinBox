import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Crown, 
  User,
  Settings,
  Activity,
  LogOut,
  Minimize2 as MinimizeIcon,
  Maximize2,
  X as CloseIcon
} from 'lucide-react';
import './VIPLayout.css';

interface VIPLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onPageChange?: (page: string) => void;
}

const VIPLayout: React.FC<VIPLayoutProps> = ({ children, activePage, onPageChange }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    cpu: '45%',
    ram: '8.2/16 GB',
    status: 'Système OK'
  });

  // Simuler les données système
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemInfo({
        cpu: `${Math.floor(Math.random() * 30) + 20}%`,
        ram: `${(Math.random() * 8 + 4).toFixed(1)}/16 GB`,
        status: 'Système OK'
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fonctions réelles pour les contrôles de fenêtre
  const handleMinimize = () => {
    if (window.electronAPI?.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    } else {
      console.log('Minimize window');
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximizeWindow) {
      window.electronAPI.maximizeWindow();
    } else {
      console.log('Maximize window');
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
    } else {
      console.log('Close window');
    }
  };

  // Fonctions pour les actions rapides
  const handleQuickScan = () => {
    console.log('🔍 Scan rapide du système...');
    // Simulation d'un scan
    setTimeout(() => {
      alert('✅ Scan rapide terminé ! Aucune menace détectée.');
    }, 2000);
  };

  const handleOptimize = () => {
    console.log('⚡ Optimisation du système...');
    // Simulation d'une optimisation
    setTimeout(() => {
      alert('🚀 Optimisation terminée ! Système plus rapide.');
    }, 3000);
  };

  // Fonction de navigation
  const handleNavigation = (pageId: string) => {
    console.log('🧭 Navigation vers:', pageId);
    if (onPageChange) {
      onPageChange(pageId);
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    console.log('🚪 Déconnexion...');
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      alert('👋 Déconnexion réussie !');
    }
  };

  // Fonction pour gérer le menu mobile
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Accueil',
      featured: true
    },
    {
      id: 'portable',
      label: 'Apps Portable'
    },
    {
      id: 'software',
      label: 'Logiciels'
    },
    {
      id: 'nas',
      label: 'NAS'
    },
    {
      id: 'converter',
      label: 'Convertisseur'
    },
    {
      id: 'analytics',
      label: 'Analytics'
    }
  ];

  return (
    <div className="vip-layout desktop-pro">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Réduire/Étendre la sidebar"
            aria-label="Réduire/Étendre la sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="app-brand">
            <Crown className="brand-icon" size={24} />
            <span className="brand-text">VestyWinBox</span>
            <div className="brand-badge">
              <span>PRO</span>
            </div>
          </div>
        </div>

        <div className="top-bar-center">
          <div className="quick-actions">
            <button className="action-btn scan-btn" onClick={handleQuickScan}>
              <Activity size={16} />
              <span>Scan Rapide</span>
            </button>
            <button className="action-btn optimize-btn" onClick={handleOptimize}>
              <Settings size={16} />
              <span>Optimiser</span>
            </button>
          </div>
        </div>

        <div className="top-bar-right">
          {/* Menu Burger pour Mobile */}
          <button 
            className="mobile-menu-toggle"
            onClick={handleMobileMenuToggle}
            title="Menu"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>

          <div className="window-controls">
            <button 
              className="window-control minimize" 
              onClick={handleMinimize}
              title="Minimiser"
              aria-label="Minimiser"
            >
              <MinimizeIcon size={16} />
            </button>
            <button 
              className="window-control maximize" 
              onClick={handleMaximize}
              title="Maximiser"
              aria-label="Maximiser"
            >
              <Maximize2 size={16} />
            </button>
            <button 
              className="window-control close" 
              onClick={handleClose}
              title="Fermer"
              aria-label="Fermer"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>

        {/* Menu Mobile Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={handleMobileMenuToggle}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <h3>Menu</h3>
                <button 
                  onClick={handleMobileMenuToggle}
                  title="Fermer le menu"
                  aria-label="Fermer le menu"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
              <div className="mobile-menu-content">
                <button className="mobile-menu-item" onClick={handleQuickScan}>
                  <Activity size={16} />
                  <span>Scan Rapide</span>
                </button>
                <button className="mobile-menu-item" onClick={handleOptimize}>
                  <Settings size={16} />
                  <span>Optimiser</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-container">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <Settings size={24} />
              {!sidebarCollapsed && (
                <>
                  <span className="brand-name">VestyWinBox</span>
                  <span className="brand-subtitle">Gestion Système</span>
                </>
              )}
            </div>
          </div>

          <div className="sidebar-content">
            <div className="nav-section">
              <div className="nav-section-title">
                <span>NAVIGATION</span>
              </div>
              <div className="nav-items">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`nav-item ${activePage === item.id ? 'active' : ''} ${item.featured ? 'featured' : ''}`}
                    onClick={() => handleNavigation(item.id)}
                  >
                    <div className="nav-item-text">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="system-status-sidebar">
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span>{systemInfo.status}</span>
              </div>
              <div className="system-metrics">
                <div className="metric">
                  <span>CPU: {systemInfo.cpu}</span>
                </div>
                <div className="metric">
                  <span>RAM: {systemInfo.ram}</span>
                </div>
              </div>
            </div>
            
            <div className="user-profile">
              <div className="user-avatar">
                <User size={20} />
              </div>
              {!sidebarCollapsed && (
                <div className="user-info">
                  <div className="user-name">Administrateur</div>
                  <div className="user-role">Admin Système</div>
                </div>
              )}
            </div>
            
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              {!sidebarCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="page-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPLayout; 