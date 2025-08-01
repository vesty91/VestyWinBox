import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Zap,
  Trash2,
  Shield,
  Download,
  Save,
  Sun,
  LucideIcon
} from 'lucide-react';
import './VIPDashboard.css';
import logoPage1 from '../../../assets/logo-page-1.png';
import BackupModal from '../../components/BackupModal';
import SystemCheckModal from '../../components/SystemCheckModal';
import CleanupModal from '../../components/CleanupModal';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  action: () => void;
  status: 'available' | 'running' | 'completed' | 'error';
}

interface SystemProcess {
  id: string;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'stopped' | 'error';
  priority: 'high' | 'medium' | 'low';
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: LucideIcon;
}

const VIPDashboard: React.FC = () => {
  const [weatherData] = useState<WeatherData>({
    temperature: 22,
    condition: 'Ensoleillé',
    humidity: 65,
    windSpeed: 12,
    icon: Sun
  });

  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isSystemCheckModalOpen, setIsSystemCheckModalOpen] = useState(false);
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);

  // Fonction pour ouvrir les paramètres de thèmes Windows
  const openThemeSettings = () => {
    try {
      console.log('🔧 Ouverture des paramètres de thèmes Windows...');
      
      // Méthode 1: Utiliser shell.openExternal via Electron (recommandé)
      if (window.electronAPI?.openExternal) {
        window.electronAPI.openExternal('ms-settings:themes')
          .then((result) => {
            if (result.success) {
              console.log('✅ Paramètres de thèmes Windows ouverts via shell.openExternal');
            } else {
              console.log('❌ Erreur shell.openExternal, tentative cmd...');
              // Fallback vers cmd
              if (window.electronAPI?.executeSystemCommand) {
                window.electronAPI.executeSystemCommand('cmd.exe', ['/c', 'start', 'ms-settings:themes'])
                  .then((cmdResult) => {
                    if (cmdResult.success) {
                      console.log('✅ Paramètres de thèmes Windows ouverts via cmd');
                    } else {
                      console.log('❌ Erreur cmd, tentative window.open...');
                      window.open('ms-settings:themes', '_blank');
                    }
                  });
              } else {
                window.open('ms-settings:themes', '_blank');
              }
            }
          })
          .catch((error) => {
            console.log('❌ Erreur shell.openExternal:', error);
            // Fallback vers window.open
            window.open('ms-settings:themes', '_blank');
          });
      } else {
        // Fallback direct vers window.open si pas d'API Electron
        window.open('ms-settings:themes', '_blank');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'ouverture des paramètres de thèmes:', error);
      // Fallback final
      window.open('ms-settings:themes', '_blank');
    }
  };

  // Fonction pour vérifier l'intégrité des fichiers système
  const runSystemFileChecker = () => {
    try {
      console.log('🔍 Ouverture du modal de vérification d\'intégrité...');
      setIsSystemCheckModalOpen(true);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ouverture du modal:', error);
      alert('❌ Erreur lors de l\'ouverture du modal de vérification.');
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'scan',
      title: 'Thèmes Windows',
      description: 'Ouvrir les paramètres de thèmes',
      icon: Shield,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: openThemeSettings,
      status: 'available'
    },
    {
      id: 'optimize',
      title: 'Intégrité des fichiers système',
      description: 'Vérifier et réparer les fichiers système Windows',
      icon: Shield,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: runSystemFileChecker,
      status: 'available'
    },
    {
      id: 'clean',
      title: 'Nettoyer',
      description: 'Libérer de l\'espace',
      icon: Trash2,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      action: () => setIsCleanupModalOpen(true),
      status: 'available'
    },
    {
      id: 'backup',
      title: 'Sauvegarder',
      description: 'Protection des données',
      icon: Save,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      action: () => setIsBackupModalOpen(true),
      status: 'available'
    },
    {
      id: 'update',
      title: 'Mettre à jour',
      description: 'Dernières versions',
      icon: Download,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      action: () => console.log('Mettre à jour'),
      status: 'available'
    },
    {
      id: 'monitor',
      title: 'Surveiller',
      description: 'Surveillance temps réel',
      icon: Activity,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      action: () => console.log('Surveiller'),
      status: 'available'
    }
  ];

  const systemProcesses: SystemProcess[] = [
    { id: '1', name: 'VestyWinBox', cpu: 15, memory: 25, status: 'running', priority: 'high' },
    { id: '2', name: 'Chrome', cpu: 8, memory: 18, status: 'running', priority: 'medium' },
    { id: '3', name: 'Discord', cpu: 5, memory: 12, status: 'running', priority: 'medium' },
    { id: '4', name: 'Steam', cpu: 3, memory: 8, status: 'running', priority: 'low' },
    { id: '5', name: 'Windows Defender', cpu: 2, memory: 6, status: 'running', priority: 'high' }
  ];

  const handleQuickAction = (action: QuickAction) => {
    setSelectedQuickAction(action.id);
    action.action();
    setTimeout(() => setSelectedQuickAction(null), 2000);
  };

  const getProcessStatusColor = (status: string) => {
    switch (status) {
      case 'running': return '#10b981';
      case 'stopped': return '#6b7280';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="vip-dashboard">
      {/* Header Hero Section */}
      <motion.div 
        className="dashboard-hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="hero-content">
          {/* Logo Central */}
          <motion.div 
            className="hero-logo-section"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="hero-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src={logoPage1} 
                alt="VestyWinBox Logo" 
                className="dashboard-logo"
              />
            </motion.div>
          </motion.div>

          {/* Titre Principal */}
          <motion.div 
            className="hero-title-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1>Bienvenue dans VestyWinBox</h1>
            <p>Tableau de bord principal pour la gestion avancée de votre système Windows</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div 
        className="quick-actions-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="section-header">
          <h2>Actions Rapides</h2>
          <p>Accédez rapidement aux fonctionnalités essentielles</p>
        </div>
        
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
              className={`quick-action-card ${selectedQuickAction === action.id ? 'selected' : ''}`}
              style={{ background: action.gradient }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 20px 40px ${action.color}40`
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction(action)}
              >
              <div className="action-icon">
                <action.icon size={32} />
                </div>
                <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-status">
                <div className={`status-dot ${action.status}`} />
                </div>
              </motion.div>
          ))}
        </div>
      </motion.div>

      {/* System Processes & Weather */}
      <div className="bottom-section">
        <motion.div 
          className="processes-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="section-header">
            <h2>Processus Système</h2>
            <p>Gestion des processus en cours</p>
          </div>
          
          <div className="processes-list">
            {systemProcesses.map((process, index) => (
              <motion.div
                key={process.id}
                className="process-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="process-info">
                  <h4>{process.name}</h4>
                  <div className="process-metrics">
                    <span>CPU: {process.cpu}%</span>
                    <span>RAM: {process.memory}%</span>
                  </div>
                </div>
                <div className="process-status">
                  <div 
                    className={`status-indicator ${process.status}`}
                    style={{ backgroundColor: getProcessStatusColor(process.status) }}
                  />
                  <div 
                    className="priority-indicator"
                    style={{ backgroundColor: getPriorityColor(process.priority) }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="weather-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="section-header">
            <h2>Météo Locale</h2>
            <p>Conditions météorologiques actuelles</p>
          </div>
          
          <div className="weather-card">
            <div className="weather-icon">
              <weatherData.icon size={48} />
            </div>
            <div className="weather-info">
              <h3>{weatherData.temperature}°C</h3>
              <p>{weatherData.condition}</p>
              <div className="weather-details">
                <span>Humidité: {weatherData.humidity}%</span>
                <span>Vent: {weatherData.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Modal de sauvegarde */}
      <BackupModal 
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
      <SystemCheckModal 
        isOpen={isSystemCheckModalOpen}
        onClose={() => setIsSystemCheckModalOpen(false)}
      />
      <CleanupModal 
        isOpen={isCleanupModalOpen}
        onClose={() => setIsCleanupModalOpen(false)}
      />
    </div>
  );
};

export default VIPDashboard; 