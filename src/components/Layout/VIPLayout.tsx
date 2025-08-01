import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Minimize2 as MinimizeIcon,
  Maximize2,
  X as CloseIcon,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Battery,
  Thermometer
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
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    ram: 62,
    disk: 28,
    network: 78,
    battery: 85,
    temp: 42
  });

  // Simulation des métriques système en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics({
        cpu: Math.floor(Math.random() * 40) + 20,
        ram: Math.floor(Math.random() * 50) + 30,
        disk: Math.floor(Math.random() * 30) + 10,
        network: Math.floor(Math.random() * 100) + 50,
        battery: Math.floor(Math.random() * 40) + 60,
        temp: Math.floor(Math.random() * 20) + 25
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

  const metrics = [
    { icon: Cpu, value: systemMetrics.cpu, label: 'CPU', unit: '%', color: '#667eea' },
    { icon: MemoryStick, value: systemMetrics.ram, label: 'RAM', unit: '%', color: '#10b981' },
    { icon: HardDrive, value: systemMetrics.disk, label: 'DISK', unit: '%', color: '#f59e0b' },
    { icon: Wifi, value: systemMetrics.network, label: 'NET', unit: 'Mbps', color: '#8b5cf6' },
    { icon: Battery, value: systemMetrics.battery, label: 'BAT', unit: '%', color: '#06b6d4' },
    { icon: Thermometer, value: systemMetrics.temp, label: 'TEMP', unit: '°C', color: '#ef4444' }
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

        {/* Métriques Système dans le Header */}
        <div className="header-metrics">
          {metrics.map((metric) => (
            <span key={metric.label} className="metric-text" data-metric={metric.label}>
              {metric.label} : {metric.value}{metric.unit}
            </span>
          ))}
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
                {/* Menu items supprimés - plus de boutons d'action */}
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