import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Trash2,
  Shield,
  Save,
  Sun,
  Unlock,
  Star,
  Ban,
  HardDrive,
  Zap,
  Battery,
  Lock,
  LucideIcon
} from 'lucide-react';
import './VIPDashboard.css';
import logoPage1 from '../../../assets/logo-page-1.png';
import BackupModal from '../../components/BackupModal';
import SystemCheckModal from '../../components/SystemCheckModal';
import CleanupModal from '../../components/CleanupModal';
import MonitorModal from '../../components/MonitorModal';
import FavoritesModal from '../../components/FavoritesModal';
import TelemetryModal from '../../components/TelemetryModal';
import SecureBootModal from '../../components/SecureBootModal';

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
  const [isMonitorModalOpen, setIsMonitorModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);
  const [isSecureBootModalOpen, setIsSecureBootModalOpen] = useState(false);

  // Fonction pour ouvrir les paramètres de thèmes Windows
  const openThemeSettings = () => {
    try {
      console.log('🔧 Ouverture des paramètres de thèmes Windows...');
      
      // Méthode 1: Utiliser shell.openExternal via Electron (recommandé)
      if (window.electronAPI && 'openExternal' in window.electronAPI) {
        const electronAPI = window.electronAPI as typeof window.electronAPI & { openExternal: (url: string) => Promise<{ success: boolean; error?: string }> };
        electronAPI.openExternal('ms-settings:themes')
          .then((result: { success: boolean; error?: string }) => {
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
          .catch((error: unknown) => {
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

  // Fonction pour désactiver l'UAC
  const disableUAC = () => {
    try {
      console.log('🔓 Démarrage de la désactivation de l\'UAC...');
      
      if (window.electronAPI?.executeSystemCommand) {
        // Afficher une confirmation avant de procéder
        const confirmed = window.confirm(
          '⚠️ ATTENTION - Désactivation de l\'UAC\n\n' +
          'Cette action va désactiver le Contrôle de Compte Utilisateur (UAC) de Windows.\n\n' +
          '⚠️ AVERTISSEMENTS :\n' +
          '• Votre système sera moins sécurisé\n' +
          '• Les applications pourront s\'exécuter avec des privilèges élevés\n' +
          '• Redémarrage requis pour appliquer les changements\n\n' +
          'Êtes-vous sûr de vouloir continuer ?'
        );

        if (confirmed) {
          // Exécuter la commande pour désactiver l'UAC
          window.electronAPI.executeSystemCommand('powershell.exe', [
            '-Command', 
            'Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "EnableLUA" -Value 0; Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "ConsentPromptBehaviorAdmin" -Value 0; Write-Host "UAC désactivé avec succès. Redémarrage requis."'
          ])
          .then((result) => {
            if (result.success) {
              console.log('✅ UAC désactivé avec succès');
              alert(
                '✅ UAC désactivé avec succès !\n\n' +
                'Les modifications ont été appliquées.\n' +
                'Un redémarrage est requis pour que les changements prennent effet.\n\n' +
                'Voulez-vous redémarrer maintenant ?'
              );
              
              // Proposer le redémarrage
              const restart = window.confirm('Voulez-vous redémarrer votre ordinateur maintenant ?');
              if (restart) {
                window.electronAPI.executeSystemCommand('shutdown.exe', ['/r', '/t', '10', '/c', 'Redémarrage pour appliquer les changements UAC']);
              }
            } else {
              console.log('❌ Erreur lors de la désactivation de l\'UAC:', result.error);
              alert('❌ Erreur lors de la désactivation de l\'UAC.\n\nVeuillez exécuter en tant qu\'administrateur.');
            }
          })
          .catch((error) => {
            console.error('❌ Erreur lors de l\'exécution:', error);
            alert('❌ Erreur lors de l\'exécution de la commande.\n\nVeuillez exécuter en tant qu\'administrateur.');
          });
        }
      } else {
        // Fallback : instructions manuelles
        alert(
          '🔓 Désactivation manuelle de l\'UAC\n\n' +
          '1. Ouvrez l\'Éditeur de registre (regedit)\n' +
          '2. Naviguez vers : HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\n' +
          '3. Modifiez la valeur "EnableLUA" à 0\n' +
          '4. Modifiez la valeur "ConsentPromptBehaviorAdmin" à 0\n' +
          '5. Redémarrez votre ordinateur\n\n' +
          '⚠️ ATTENTION : Cette action réduit la sécurité de votre système.'
        );
      }
    } catch (error) {
      console.error('❌ Erreur lors de la désactivation de l\'UAC:', error);
      alert('❌ Erreur lors de la désactivation de l\'UAC.');
    }
  };

  // Fonction pour créer un point de restauration
  const createRestorePoint = () => {
    try {
      console.log('💾 Création d\'un point de restauration système...');
      
      if (window.electronAPI?.executeSystemCommand) {
        const confirmed = window.confirm(
          '💾 Créer un Point de Restauration\n\n' +
          'Cette action va créer un point de restauration système.\n\n' +
          '⚠️ ATTENTION :\n' +
          '• Nécessite des privilèges administrateur\n' +
          '• Peut prendre quelques minutes\n\n' +
          'Êtes-vous sûr de vouloir continuer ?'
        );

        if (confirmed) {
          window.electronAPI.executeSystemCommand('powershell.exe', [
            '-Command', 'Checkpoint-Computer -Description "RestaurerAvantManip" -RestorePointType "MODIFY_SETTINGS"'
          ])
          .then((result) => {
            if (result.success) {
              console.log('✅ Point de restauration créé avec succès');
              alert('✅ Point de restauration créé avec succès !\n\nDescription : "RestaurerAvantManip"\nType : MODIFY_SETTINGS');
            } else {
              console.log('❌ Erreur lors de la création:', result.error);
              alert('❌ Erreur lors de la création du point de restauration.\n\nVeuillez exécuter en tant qu\'administrateur.');
            }
          })
          .catch((error) => {
            console.error('❌ Erreur lors de l\'exécution:', error);
            alert('❌ Erreur lors de l\'exécution de la commande.');
          });
        }
      } else {
        alert('⚠️ API Electron non disponible.\n\nExécutez manuellement en tant qu\'administrateur :\nCheckpoint-Computer -Description "RestaurerAvantManip" -RestorePointType "MODIFY_SETTINGS"');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création du point de restauration:', error);
      alert('❌ Erreur lors de la création du point de restauration.');
    }
  };

  // Fonction pour activer le GodMode
  const enableGodMode = () => {
    try {
      console.log('🛡️ Activation du GodMode...');
      
      if (window.electronAPI?.executeSystemCommand) {
        const confirmed = window.confirm(
          '🛡️ Activer le GodMode\n\n' +
          'Cette action va créer un raccourci "GodMode" sur votre Bureau.\n\n' +
          '⚠️ ATTENTION :\n' +
          '• Accès à toutes les options système avancées\n' +
          '• Utilisez avec précaution\n\n' +
          'Êtes-vous sûr de vouloir continuer ?'
        );

        if (confirmed) {
          window.electronAPI.executeSystemCommand('cmd.exe', [
            '/c', 'md "%USERPROFILE%\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"'
          ])
          .then((result) => {
            if (result.success) {
              console.log('✅ GodMode activé avec succès');
              alert('✅ GodMode activé avec succès !\n\nUn raccourci "GodMode" a été créé sur votre Bureau.\nDouble-cliquez dessus pour accéder aux options système avancées.');
            } else {
              console.log('❌ Erreur lors de l\'activation:', result.error);
              alert('❌ Erreur lors de l\'activation du GodMode.\n\nLe GodMode existe peut-être déjà.');
            }
          })
          .catch((error) => {
            console.error('❌ Erreur lors de l\'exécution:', error);
            alert('❌ Erreur lors de l\'exécution de la commande.');
          });
        }
      } else {
        alert('⚠️ API Electron non disponible.\n\nExécutez manuellement :\nmd "%USERPROFILE%\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'activation du GodMode:', error);
      alert('❌ Erreur lors de l\'activation du GodMode.');
    }
  };

  // Fonction pour générer un rapport batterie
  const generateBatteryReport = () => {
    try {
      console.log('🔋 Génération du rapport batterie...');
      
      if (window.electronAPI?.executeSystemCommand) {
        const confirmed = window.confirm(
          '🔋 Générer un Rapport Batterie\n\n' +
          'Cette action va générer un rapport détaillé de la batterie.\n\n' +
          '⚠️ ATTENTION :\n' +
          '• Fonctionne uniquement sur les ordinateurs portables\n' +
          '• Le rapport sera sauvegardé sur le Bureau\n\n' +
          'Êtes-vous sûr de vouloir continuer ?'
        );

        if (confirmed) {
          window.electronAPI.executeSystemCommand('cmd.exe', [
            '/c', 'powercfg /batteryreport /output "%USERPROFILE%\\Desktop\\battery-report.html"'
          ])
          .then((result) => {
            if (result.success) {
              console.log('✅ Rapport batterie généré avec succès');
              alert('✅ Rapport batterie généré avec succès !\n\nLe fichier "battery-report.html" a été créé sur votre Bureau.\nOuvrez-le dans votre navigateur pour voir les détails.');
            } else {
              console.log('❌ Erreur lors de la génération:', result.error);
              alert('❌ Erreur lors de la génération du rapport batterie.\n\nVérifiez que vous êtes sur un ordinateur portable avec une batterie.');
            }
          })
          .catch((error) => {
            console.error('❌ Erreur lors de l\'exécution:', error);
            alert('❌ Erreur lors de l\'exécution de la commande.');
          });
        }
      } else {
        alert('⚠️ API Electron non disponible.\n\nExécutez manuellement :\npowercfg /batteryreport /output "%USERPROFILE%\\Desktop\\battery-report.html"');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la génération du rapport batterie:', error);
      alert('❌ Erreur lors de la génération du rapport batterie.');
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
      title: 'Désactiver l\'UAC',
      description: 'Désactiver le Contrôle de Compte Utilisateur Windows',
      icon: Unlock,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      action: disableUAC,
      status: 'available'
    },
    {
      id: 'monitor',
      title: 'Options de Redémarrage',
      description: 'Redémarrage avancé et mode sans échec',
      icon: Activity,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      action: () => setIsMonitorModalOpen(true),
      status: 'available'
    },
    {
      id: 'favorites',
      title: 'Sauvegarder Favoris',
      description: 'Sauvegarder les favoris Chrome et Edge',
      icon: Star,
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      action: () => setIsFavoritesModalOpen(true),
      status: 'available'
    },
    {
      id: 'telemetry',
      title: 'Désactiver Télémétrie',
      description: 'Désactiver la collecte de données Windows',
      icon: Ban,
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      action: () => setIsTelemetryModalOpen(true),
      status: 'available'
    },
    {
      id: 'restore',
      title: 'Point de Restauration',
      description: 'Créer un point de restauration système',
      icon: HardDrive,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      action: () => createRestorePoint(),
      status: 'available'
    },
    {
      id: 'godmode',
      title: 'Activer GodMode',
      description: 'Ajouter le raccourci GodMode sur le Bureau',
      icon: Zap,
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      action: () => enableGodMode(),
      status: 'available'
    },
    {
      id: 'battery',
      title: 'Rapport Batterie',
      description: 'Générer un rapport batterie sur le Bureau',
      icon: Battery,
      color: '#0891b2',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
      action: () => generateBatteryReport(),
      status: 'available'
    },
    {
      id: 'secureboot',
      title: 'Vérifier Secure Boot',
      description: 'Vérifier l\'état du Secure Boot UEFI',
      icon: Lock,
      color: '#1d4ed8',
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
      action: () => setIsSecureBootModalOpen(true),
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
      
      {/* Modals */}
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
      <MonitorModal 
        isOpen={isMonitorModalOpen}
        onClose={() => setIsMonitorModalOpen(false)}
      />
      <FavoritesModal 
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
      />
      <TelemetryModal 
        isOpen={isTelemetryModalOpen}
        onClose={() => setIsTelemetryModalOpen(false)}
      />
      <SecureBootModal 
        isOpen={isSecureBootModalOpen}
        onClose={() => setIsSecureBootModalOpen(false)}
      />
    </div>
  );
};

export default VIPDashboard;