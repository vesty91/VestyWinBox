import React, { useState } from 'react';
import { 
  Menu, 
  Settings,
  Activity,
  Minimize2 as MinimizeIcon,
  Maximize2,
  X as CloseIcon
} from 'lucide-react';
import './VIPLayout.css';
import logoBarreLaterale from '../../../assets/logo-barre-laterale.png';
import Footer from './Footer';

interface VIPLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onPageChange?: (page: string) => void;
}

const VIPLayout: React.FC<VIPLayoutProps> = ({ children, activePage, onPageChange }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        </div>

        <div className="top-bar-center">
          <div className="app-brand">
            <img 
              src={logoBarreLaterale} 
              alt="VestyWinBox Logo" 
              className="top-bar-logo"
            />
            <span className="brand-text">VestyWinBox</span>
            <div className="brand-badge">
              <span>PRO</span>
            </div>
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
                <div className="mobile-menu-brand">
                  <img 
                    src={logoBarreLaterale} 
                    alt="VestyWinBox Logo" 
                    className="mobile-menu-logo"
                  />
                  <h3>VestyWinBox</h3>
                </div>
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
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : 'open'}`}>
          <div className="sidebar-logo-container">
            <img 
              src={logoBarreLaterale} 
              alt="VestyWinBox Logo" 
              className="sidebar-logo"
            />
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
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="page-content">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VIPLayout; 