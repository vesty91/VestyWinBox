import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Thermometer,
  Zap,
  Trash2,
  Shield,
  Download,
  Save,
  RefreshCw,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Bell,
  BellOff,
  Sun,
  Moon,
  Battery
} from 'lucide-react';
import './VIPDashboard.css';
import logoPage1 from '../../../assets/logo-page-1.png';

interface SystemStats {
  cpu: number;
  disk: number;
  ram: number;
  temp: number;
  network: number;
  gpu: number;
  battery: number;
  uptime: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
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
  icon: React.ComponentType<any>;
}

const VIPDashboard: React.FC = () => {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    disk: 0,
    ram: 0,
    temp: 0,
    network: 0,
    gpu: 0,
    battery: 0,
    uptime: '0j 0h 0m'
  });

  const [weatherData] = useState<WeatherData>({
    temperature: 22,
    condition: 'Ensoleillé',
    humidity: 65,
    windSpeed: 12,
    icon: Sun
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);

  // Fonction pour ouvrir les paramètres de thèmes Windows via PowerShell
  const openThemeSettingsWithPowerShell = () => {
    try {
      // Méthode 1: PowerShell avec Start-Process
      if (window.electronAPI?.executeSystemCommand) {
        window.electronAPI.executeSystemCommand('powershell.exe', ['-Command', 'Start-Process "ms-settings:themes"'])
          .then((result) => {
            if (result.success) {
              console.log('✅ Paramètres de thèmes Windows ouverts via PowerShell');
            } else {
              console.log('❌ Erreur PowerShell, tentative cmd...');
              // Fallback vers cmd
              window.electronAPI.executeSystemCommand('cmd.exe', ['/c', 'start', 'ms-settings:themes'])
                .then((cmdResult) => {
                  if (cmdResult.success) {
                    console.log('✅ Paramètres de thèmes Windows ouverts via cmd');
                  } else {
                    console.log('❌ Erreur cmd, tentative navigateur...');
                    // Dernier fallback : ouvrir dans le navigateur
                    window.open('ms-settings:themes', '_blank');
                  }
                });
            }
          });
      } else {
        // Si pas d'Electron, essayer directement le protocole
        window.open('ms-settings:themes', '_blank');
      }
    } catch (error) {
      console.log('❌ Erreur lors de l\'ouverture des paramètres de thèmes:', error);
      // Dernier recours : message à l'utilisateur
      alert('Impossible d\'ouvrir les paramètres de thèmes Windows automatiquement. Veuillez les ouvrir manuellement.');
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
      action: () => {
        console.log('🔧 Ouverture des paramètres de thèmes Windows...');
        
        // Méthode 1: Electron (si disponible)
        if (window.electronAPI?.executeSystemCommand) {
          // Utiliser le protocole ms-settings:themes pour ouvrir les paramètres de thèmes Windows
          window.electronAPI.executeSystemCommand('start', ['ms-settings:themes'])
            .then((result) => {
              if (result.success) {
                console.log('✅ Paramètres de thèmes Windows ouverts via Electron');
              } else {
                console.log('❌ Erreur Electron, tentative PowerShell...');
                openThemeSettingsWithPowerShell();
              }
            })
            .catch((error) => {
              console.log('❌ Erreur Electron:', error);
              openThemeSettingsWithPowerShell();
            });
        } else {
          // Méthode 2: PowerShell (fallback)
          openThemeSettingsWithPowerShell();
        }
      },
      status: 'available'
    },
    {
      id: 'optimize',
      title: 'Optimiser',
      description: 'Performance maximale',
      icon: Zap,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: () => console.log('Optimiser'),
      status: 'available'
    },
    {
      id: 'clean',
      title: 'Nettoyer',
      description: 'Libérer de l\'espace',
      icon: Trash2,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      action: () => console.log('Nettoyer'),
      status: 'available'
    },
    {
      id: 'backup',
      title: 'Sauvegarder',
      description: 'Protection des données',
      icon: Save,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      action: () => console.log('Sauvegarder'),
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

  useEffect(() => {
    // Simulation des données système en temps réel
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 40) + 20,
        disk: Math.floor(Math.random() * 30) + 10,
        ram: Math.floor(Math.random() * 50) + 30,
        temp: Math.floor(Math.random() * 20) + 25,
        network: Math.floor(Math.random() * 100) + 50,
        gpu: Math.floor(Math.random() * 60) + 20,
        battery: Math.floor(Math.random() * 40) + 60,
        uptime: '2j 14h 32m'
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

      {/* System Metrics */}
      <motion.div 
        className="system-metrics-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="section-header">
          <h2>Métriques Système</h2>
          <p>Surveillance en temps réel des performances</p>
        </div>
        
        <div className="metrics-grid">
              <motion.div
            className="metric-card cpu"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="metric-header">
              <div className="metric-icon">
                <Cpu />
              </div>
              <div className="metric-info">
                <h3>CPU</h3>
                <span className="metric-value">{systemStats.cpu}%</span>
                </div>
                </div>
            <div className="metric-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${systemStats.cpu}%` }}
              />
                </div>
              </motion.div>

          <motion.div 
            className="metric-card ram"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="metric-header">
              <div className="metric-icon">
                <MemoryStick />
              </div>
              <div className="metric-info">
                <h3>RAM</h3>
                <span className="metric-value">{systemStats.ram}%</span>
              </div>
            </div>
            <div className="metric-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${systemStats.ram}%` }}
              />
        </div>
      </motion.div>

      <motion.div 
            className="metric-card disk"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
      >
            <div className="metric-header">
              <div className="metric-icon">
                <HardDrive />
              </div>
              <div className="metric-info">
                <h3>DISQUE</h3>
                <span className="metric-value">{systemStats.disk}%</span>
              </div>
            </div>
            <div className="metric-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${systemStats.disk}%` }}
              />
            </div>
          </motion.div>

            <motion.div
            className="metric-card temp"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            >
            <div className="metric-header">
              <div className="metric-icon">
                <Thermometer />
              </div>
              <div className="metric-info">
                <h3>TEMP CPU</h3>
                <span className="metric-value">{systemStats.temp}°C</span>
                  </div>
                </div>
            <div className="metric-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${(systemStats.temp / 100) * 100}%` }}
              />
            </div>
          </motion.div>

          <motion.div 
            className="metric-card network"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="metric-header">
              <div className="metric-icon">
                <Wifi />
              </div>
              <div className="metric-info">
                <h3>RÉSEAU</h3>
                <span className="metric-value">{systemStats.network} Mbps</span>
                  </div>
                </div>
            <div className="metric-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${(systemStats.network / 1000) * 100}%` }}
              />
            </div>
          </motion.div>

          <motion.div 
            className="metric-card battery"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="metric-header">
              <div className="metric-icon">
                <Battery />
              </div>
              <div className="metric-info">
                <h3>BATTERIE</h3>
                <span className="metric-value">{systemStats.battery}%</span>
              </div>
            </div>
            <div className="metric-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${systemStats.battery}%` }}
              />
              </div>
            </motion.div>
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

      {/* Floating Action Buttons */}
      <motion.div 
        className="floating-actions"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <motion.button
          className="fab fab-theme"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </motion.button>
        
        <motion.button
          className="fab fab-notifications"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
        >
          {isNotificationsEnabled ? <Bell /> : <BellOff />}
        </motion.button>
        
        <motion.button
          className="fab fab-refresh"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
        >
          <RefreshCw />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default VIPDashboard; 