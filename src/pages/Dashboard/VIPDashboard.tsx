import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Folder, 
  Database, 
  Thermometer,
  Zap,
  Trash2,
  Shield,
  Settings,
  Download,
  Save,
  AlertTriangle,
  Package
} from 'lucide-react';
import './VIPDashboard.css';

interface SystemStats {
  cpu: number;
  disk: number;
  ram: number;
  temp: number;
}

interface RecentActivity {
  id: string;
  action: string;
  description: string;
  time: string;
  icon: React.ComponentType<any>;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface SystemProcess {
  id: string;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'stopped' | 'error';
}

const VIPDashboard: React.FC = () => {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    disk: 0,
    ram: 0,
    temp: 0
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      action: 'Scan système',
      description: 'Scan de sécurité terminé avec succès',
      time: 'Il y a 2 minutes',
      icon: Shield,
      status: 'success'
    },
    {
      id: '2',
      action: 'Nettoyage',
      description: '2.3 GB de fichiers temporaires supprimés',
      time: 'Il y a 15 minutes',
      icon: Trash2,
      status: 'success'
    },
    {
      id: '3',
      action: 'Mise à jour',
      description: 'Mise à jour système disponible',
      time: 'Il y a 1 heure',
      icon: Download,
      status: 'warning'
    },
    {
      id: '4',
      action: 'Optimisation',
      description: 'Optimisation automatique effectuée',
      time: 'Il y a 3 heures',
      icon: Settings,
      status: 'success'
    },
    {
      id: '5',
      action: 'Sauvegarde',
      description: 'Sauvegarde système créée',
      time: 'Il y a 6 heures',
      icon: Save,
      status: 'success'
    },
    {
      id: '6',
      action: 'Surveillance',
      description: 'Activité suspecte détectée',
      time: 'Il y a 12 heures',
      icon: AlertTriangle,
      status: 'error'
    },
    {
      id: '7',
      action: 'Maintenance',
      description: 'Maintenance planifiée effectuée',
      time: 'Il y a 1 jour',
      icon: Package,
      status: 'info'
    },
    {
      id: '8',
      action: 'Installation',
      description: 'Nouveau logiciel installé',
      time: 'Il y a 2 jours',
      icon: Package,
      status: 'success'
    }
  ]);

  const [systemProcesses] = useState<SystemProcess[]>([
    { id: '1', name: 'System', cpu: 2.5, memory: 512, status: 'running' },
    { id: '2', name: 'Explorer.exe', cpu: 1.8, memory: 256, status: 'running' },
    { id: '3', name: 'Chrome.exe', cpu: 15.2, memory: 2048, status: 'running' },
    { id: '4', name: 'Discord.exe', cpu: 8.7, memory: 1024, status: 'running' },
    { id: '5', name: 'Steam.exe', cpu: 12.3, memory: 1536, status: 'running' },
    { id: '6', name: 'VestyWinBox.exe', cpu: 3.2, memory: 768, status: 'running' },
    { id: '7', name: 'Windows Defender', cpu: 5.1, memory: 384, status: 'running' },
    { id: '8', name: 'Update Service', cpu: 1.2, memory: 128, status: 'running' },
    { id: '9', name: 'Print Spooler', cpu: 0.8, memory: 64, status: 'running' },
    { id: '10', name: 'Audio Service', cpu: 0.5, memory: 32, status: 'running' }
  ]);

  // Simuler les données système
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 30) + 10,
        disk: Math.floor(Math.random() * 20) + 5,
        ram: Math.floor(Math.random() * 40) + 20,
        temp: Math.floor(Math.random() * 20) + 30
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      id: 'scan',
      title: 'Scan Système',
      description: 'Analyse complète du système',
      icon: Zap,
      color: '#3b82f6',
      action: () => {
        console.log('🔍 Lancement du scan système...');
        setTimeout(() => {
          alert('✅ Scan système terminé !\n\n• Fichiers analysés: 15,432\n• Menaces détectées: 0\n• Système sécurisé');
        }, 3000);
      }
    },
    {
      id: 'cleanup',
      title: 'Nettoyage',
      description: 'Supprime les fichiers temporaires',
      icon: Trash2,
      color: '#10b981',
      action: () => {
        console.log('🧹 Lancement du nettoyage...');
        setTimeout(() => {
          alert('🧹 Nettoyage terminé !\n\n• Fichiers temporaires supprimés: 2.3 GB\n• Cache nettoyé\n• Système optimisé');
        }, 2500);
      }
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Vérification antivirus',
      icon: Shield,
      color: '#ef4444',
      action: () => {
        console.log('🛡️ Lancement de la vérification sécurité...');
        setTimeout(() => {
          alert('🛡️ Vérification sécurité terminée !\n\n• Base de données mise à jour\n• Aucune menace détectée\n• Système protégé');
        }, 4000);
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getProcessStatusColor = (status: string) => {
    switch (status) {
      case 'running': return '#10b981';
      case 'stopped': return '#6b7280';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="dashboard-modern">
      {/* Welcome Section */}
      <motion.div 
        className="welcome-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="welcome-title">Bienvenue dans VestyWinBox</h1>
        <p className="welcome-subtitle">
          Tableau de bord principal pour la gestion avancée de votre système Windows
        </p>
      </motion.div>

      {/* System Statistics */}
      <motion.div 
        className="system-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">CPU</div>
            <div className="stat-value">{systemStats.cpu}%</div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill" 
                style={{ width: `${systemStats.cpu}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Folder size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Disque</div>
            <div className="stat-value">{systemStats.disk}.0 GB</div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill" 
                style={{ width: `${systemStats.disk * 2}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Database size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">RAM</div>
            <div className="stat-value">{systemStats.ram}%</div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill" 
                style={{ width: `${systemStats.ram}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Thermometer size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Temp CPU</div>
            <div className="stat-value">{systemStats.temp}°C</div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill" 
                style={{ width: `${(systemStats.temp - 30) * 2}%` }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="quick-actions-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="section-title">Actions Rapides</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                className="quick-action-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={action.action}
              >
                <div className="action-icon" style={{ backgroundColor: action.color }}>
                  <Icon size={24} />
                </div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
                <button className="action-btn" style={{ backgroundColor: action.color }}>
                  Exécuter
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="recent-activity-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="section-title">Activité Récente</h2>
        <div className="activity-list">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                className="activity-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="activity-icon" style={{ backgroundColor: getStatusColor(activity.status) }}>
                  <Icon size={20} />
                </div>
                <div className="activity-content">
                  <div className="activity-message">{activity.action}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
                <div className="activity-status">
                  <div className="status-dot" style={{ backgroundColor: getStatusColor(activity.status) }}></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* System Processes */}
      <motion.div 
        className="processes-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="section-title">Processus Système</h2>
        <div className="processes-grid">
          {systemProcesses.map((process, index) => (
            <motion.div
              key={process.id}
              className="process-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 + index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="process-header">
                <div className="process-name">{process.name}</div>
                <div className="process-status" style={{ backgroundColor: getProcessStatusColor(process.status) }}>
                  {process.status}
                </div>
              </div>
              <div className="process-metrics">
                <div className="process-metric">
                  <span>CPU: {process.cpu}%</span>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${process.cpu}%` }}></div>
                  </div>
                </div>
                <div className="process-metric">
                  <span>RAM: {process.memory} MB</span>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${process.memory / 20}%` }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Additional Content to Force Scrollbars */}
      <motion.div 
        className="additional-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h2 className="section-title">Informations Système</h2>
        <div className="info-grid">
          {Array.from({ length: 50 }, (_, i) => (
            <motion.div
              key={i}
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.4 + i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="info-icon">
                <Settings size={20} />
              </div>
              <div className="info-content">
                <h3>Information Système {i + 1}</h3>
                <p>Description détaillée de l'information système numéro {i + 1} avec des détails supplémentaires pour remplir l'espace et forcer l'apparition des scrollbars. Cette section contient beaucoup de contenu pour s'assurer que les scrollbars soient visibles.</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Extra Content Section */}
      <motion.div 
        className="extra-content-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <h2 className="section-title">Contenu Supplémentaire</h2>
        <div className="extra-grid">
          {Array.from({ length: 30 }, (_, i) => (
            <motion.div
              key={`extra-${i}`}
              className="extra-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.8 + i * 0.03 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="extra-icon">
                <Activity size={18} />
              </div>
              <div className="extra-content">
                <h3>Élément Supplémentaire {i + 1}</h3>
                <p>Contenu supplémentaire pour forcer les scrollbars à apparaître. Cet élément contient des informations détaillées sur le système et ses performances.</p>
                <div className="extra-metrics">
                  <span>CPU: {Math.floor(Math.random() * 20) + 10}%</span>
                  <span>RAM: {Math.floor(Math.random() * 30) + 20}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default VIPDashboard; 