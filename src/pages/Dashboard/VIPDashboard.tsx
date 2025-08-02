import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Trash2,
  Shield,
  Save,
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
import RestorePointModal from '../../components/RestorePointModal';

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

const VIPDashboard: React.FC = () => {
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isSystemCheckModalOpen, setIsSystemCheckModalOpen] = useState(false);
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);
  const [isMonitorModalOpen, setIsMonitorModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);
  const [isSecureBootModalOpen, setIsSecureBootModalOpen] = useState(false);
  const [isRestorePointModalOpen, setIsRestorePointModalOpen] = useState(false);

  // Fonction pour exécuter la vérification d'intégrité des fichiers système
  const runSystemFileChecker = () => {
    console.log('🔧 Lancement de la vérification d\'intégrité des fichiers système...');
    setIsSystemCheckModalOpen(true);
  };

  // Fonction pour activer le GodMode
  const enableGodMode = () => {
    console.log('🔧 Activation du GodMode...');
    
    if (window.electronAPI?.executeSystemCommand) {
      window.electronAPI.executeSystemCommand('cmd.exe', [
        '/c', 
        'md "%USERPROFILE%\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"'
      ]).then((result) => {
        if (result.success) {
          alert('✅ GodMode activé avec succès !\n\nUn raccourci "GodMode" a été créé sur votre Bureau.\n\n' +
                'Ce raccourci donne accès à toutes les options de configuration Windows avancées.');
        } else {
          alert('❌ Erreur lors de l\'activation du GodMode :\n' + result.error);
        }
      });
    } else {
      alert('❌ API Electron non disponible.\n\nVeuillez exécuter manuellement cette commande :\n\n' +
            'md "%USERPROFILE%\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"');
    }
  };

  // Fonction pour générer un rapport batterie
  const generateBatteryReport = () => {
    console.log('🔧 Génération du rapport batterie...');
    
    if (window.electronAPI?.executeSystemCommand) {
      window.electronAPI.executeSystemCommand('cmd.exe', [
        '/c', 
        'powercfg /batteryreport /output "%USERPROFILE%\\Desktop\\battery-report.html"'
      ]).then((result) => {
        if (result.success) {
          alert('✅ Rapport batterie généré avec succès !\n\n' +
                'Le fichier "battery-report.html" a été créé sur votre Bureau.\n\n' +
                'Ouvrez ce fichier dans votre navigateur pour voir les détails de votre batterie.');
        } else {
          alert('❌ Erreur lors de la génération du rapport batterie :\n' + result.error);
        }
      });
    } else {
      alert('❌ API Electron non disponible.\n\nVeuillez exécuter manuellement cette commande :\n\n' +
            'powercfg /batteryreport /output "%USERPROFILE%\\Desktop\\battery-report.html"');
    }
  };

  // Configuration des actions rapides
  const quickActions: QuickAction[] = [
    {
      id: 'backup',
      title: 'Sauvegarder',
      description: 'Sauvegarder les dossiers utilisateur',
      icon: Save,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      action: () => setIsBackupModalOpen(true),
      status: 'available'
    },
    {
      id: 'systemcheck',
      title: 'Intégrité des fichiers système',
      description: 'Vérifier l\'intégrité des fichiers système',
      icon: Shield,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: () => runSystemFileChecker(),
      status: 'available'
    },
    {
      id: 'cleanup',
      title: 'Nettoyer',
      description: 'Nettoyer le système',
      icon: Trash2,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      action: () => setIsCleanupModalOpen(true),
      status: 'available'
    },
    {
      id: 'monitor',
      title: 'Options de Redémarrage',
      description: 'Options de redémarrage avancées',
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
      action: () => setIsRestorePointModalOpen(true),
      status: 'available'
    },
    {
      id: 'godmode',
      title: 'Activer le GodMode',
      description: 'Créer le raccourci GodMode sur le Bureau',
      icon: Zap,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      action: () => enableGodMode(),
      status: 'available'
    },
    {
      id: 'battery',
      title: 'Générer un rapport batterie',
      description: 'Créer un rapport détaillé de la batterie',
      icon: Battery,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: () => generateBatteryReport(),
      status: 'available'
    },
    {
      id: 'secureboot',
      title: 'Vérifier Secure Boot',
      description: 'Vérifier le statut Secure Boot',
      icon: Lock,
      color: '#1d4ed8',
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
      action: () => setIsSecureBootModalOpen(true),
      status: 'available'
    }
  ];

  const handleQuickAction = (action: QuickAction) => {
    setSelectedQuickAction(action.id);
    action.action();
    setTimeout(() => setSelectedQuickAction(null), 2000);
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
      <RestorePointModal 
        isOpen={isRestorePointModalOpen}
        onClose={() => setIsRestorePointModalOpen(false)}
      />
    </div>
  );
};

export default VIPDashboard; 