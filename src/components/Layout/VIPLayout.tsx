import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Package, 
  FolderOpen, 
  FileText, 
  Database, 
  Zap,
  Menu,
  X,
  Settings,
  User,
  Bell,
  Search
} from 'lucide-react';
import './VIPLayout.css';

interface VIPLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const VIPLayout: React.FC<VIPLayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'gold' | 'violet' | 'rgb'>('gold');

  const menuItems = [
    { id: 'dashboard', label: 'Accueil', icon: Home, featured: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, featured: false },
    { id: 'software', label: 'Logiciels', icon: Package, featured: false },
    { id: 'portable-apps', label: 'Apps Portable', icon: FolderOpen, featured: false },
    { id: 'file-converter', label: 'Convertisseur', icon: FileText, featured: false },
    { id: 'nas-explorer', label: 'Explorateur NAS', icon: Database, featured: false },
    { id: 'godmode', label: 'GodMode', icon: Zap, featured: true }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleThemeChange = (newTheme: 'gold' | 'violet' | 'rgb') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={`vip-layout ${theme}`} data-theme={theme}>
      {/* Sidebar */}
      <motion.aside 
        className={`vip-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.4 
        }}
      >
        {/* Header Sidebar */}
        <motion.div 
          className="sidebar-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="logo-container">
            <motion.img
              src="/logo-barre-laterale.png"
              alt="VestyWinBox"
              className="logo"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                delay: 0.3 
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.3 }
              }}
            />
            <motion.h1 
              className="app-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              VestyWinBox
            </motion.h1>
          </div>
          
          <motion.button
            className="close-sidebar-btn"
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <X size={20} />
          </motion.button>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <motion.ul 
            className="nav-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {menuItems.map((item, index) => (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.6 + index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <motion.button
                  className={`nav-item ${currentPage === item.id ? 'active' : ''} ${item.featured ? 'featured' : ''}`}
                  onClick={() => onPageChange(item.id)}
                  whileHover={{ 
                    scale: 1.05, 
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <motion.div 
                    className="nav-icon"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon size={20} />
                  </motion.div>
                  <span className="nav-label">{item.label}</span>
                  
                  {/* Indicateur actif animé */}
                  {currentPage === item.id && (
                    <motion.div
                      className="active-indicator"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* Footer Sidebar */}
        <motion.div 
          className="sidebar-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="theme-selector">
            <span className="theme-label">Thème</span>
            <div className="theme-buttons">
              {(['gold', 'violet', 'rgb'] as const).map((themeOption) => (
                <motion.button
                  key={themeOption}
                  className={`theme-btn ${theme === themeOption ? 'active' : ''}`}
                  onClick={() => handleThemeChange(themeOption)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className={`theme-color ${themeOption}`} />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        className={`vip-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          delay: 0.3 
        }}
      >
        {/* Top Bar */}
        <motion.header 
          className="top-bar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="top-bar-left">
            <motion.button
              className="menu-toggle"
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Menu size={24} />
            </motion.button>
            
            <motion.div 
              className="breadcrumb"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="current-page">
                {menuItems.find(item => item.id === currentPage)?.label || 'Accueil'}
              </span>
            </motion.div>
          </div>

          <div className="top-bar-right">
            <motion.div 
              className="search-container"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="search-input"
              />
            </motion.div>

            <motion.div 
              className="top-actions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                className="action-btn"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Bell size={20} />
              </motion.button>
              
              <motion.button
                className="action-btn"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Settings size={20} />
              </motion.button>
              
              <motion.button
                className="action-btn user-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <User size={20} />
              </motion.button>
            </motion.div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.div 
          className="page-content"
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.4 
          }}
        >
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default VIPLayout; 