import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Package, 
  FolderOpen, 
  FileText, 
  Database, 
  Zap,
  Settings
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import './VIPLayout.css';

interface VIPLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const VIPLayout: React.FC<VIPLayoutProps> = ({ children, currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Accueil', icon: Home, featured: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, featured: false },
    { id: 'software', label: 'Logiciels', icon: Package, featured: false },
    { id: 'portableapps', label: 'Apps Portable', icon: FolderOpen, featured: false },
    { id: 'fileconverter', label: 'Convertisseur', icon: FileText, featured: false },
    { id: 'nasexplorer', label: 'NAS Explorer', icon: Database, featured: false },
    { id: 'godmode', label: 'GodMode', icon: Zap, featured: true },
  ];

  return (
    <div className="vip-layout">
      {/* Sidebar */}
      <motion.aside 
        className="vip-sidebar"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="sidebar-header">
          <motion.div 
            className="logo-container"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src="/logo-barre-laterale.png" 
              alt="VestyWinBox Logo" 
              className="sidebar-logo"
            />
          </motion.div>
          <h1 className="sidebar-title">VestyWinBox</h1>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
              >
                <motion.button
                  className={`nav-item ${currentPage === item.id ? 'active' : ''} ${item.featured ? 'featured' : ''}`}
                  onClick={() => onPageChange(item.id)}
                  whileHover={{ 
                    scale: 1.05,
                    x: 5,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="nav-icon">
                    <item.icon size={20} />
                  </div>
                  <span className="nav-label">{item.label}</span>
                  {item.featured && (
                    <motion.div 
                      className="featured-badge"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <motion.div
            className="theme-toggle-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        className="vip-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default VIPLayout; 