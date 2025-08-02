import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LucideIcon,
  Sparkles,
  Clock
} from 'lucide-react';
import './VIPDashboard.css';
import logoPage1 from '../../../assets/logo-page-1.png';

// Import des icônes personnalisées
import iconSauvegarde from '../../../assets/tools/icons/icon-page-accueil/sauvegarde.png';
import iconIntegrite from '../../../assets/tools/icons/icon-page-accueil/Intégrité.png';
import iconNettoyage from '../../../assets/tools/icons/icon-page-accueil/netoyage.png';
import iconRedemarrer from '../../../assets/tools/icons/icon-page-accueil/redemarer.png';
import iconFavoris from '../../../assets/tools/icons/icon-page-accueil/favoris.png';
import iconTelemetrie from '../../../assets/tools/icons/icon-page-accueil/telemetrie.png';
import iconRestauration from '../../../assets/tools/icons/icon-page-accueil/Restauration.png';
import iconGodMode from '../../../assets/tools/icons/icon-page-accueil/GodMode-removebg-preview.png';
import iconBatterie from '../../../assets/tools/icons/icon-page-accueil/batrie.png';
import iconSecureBoot from '../../../assets/tools/icons/icon-page-accueil/secure-boot.png';

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
  icon: string;
  color: string;
  gradient: string;
  action: () => void;
  status: 'available' | 'running' | 'completed' | 'error';
  category?: string;
  priority?: 'high' | 'medium' | 'low';
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mise à jour de l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Configuration des actions rapides avec icônes personnalisées
  const quickActions: QuickAction[] = [
    {
      id: 'backup',
      title: 'Sauvegarder',
      description: 'Sauvegarder les dossiers utilisateur',
      icon: iconSauvegarde,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      action: () => setIsBackupModalOpen(true),
      status: 'available',
      category: 'Sécurité',
      priority: 'high'
    },
    {
      id: 'systemcheck',
      title: 'Intégrité des fichiers système',
      description: 'Vérifier l\'intégrité des fichiers système',
      icon: iconIntegrite,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: () => runSystemFileChecker(),
      status: 'available',
      category: 'Maintenance',
      priority: 'high'
    },
    {
      id: 'cleanup',
      title: 'Nettoyer',
      description: 'Nettoyer le système',
      icon: iconNettoyage,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      action: () => setIsCleanupModalOpen(true),
      status: 'available',
      category: 'Maintenance',
      priority: 'medium'
    },
    {
      id: 'monitor',
      title: 'Options de Redémarrage',
      description: 'Options de redémarrage avancées',
      icon: iconRedemarrer,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      action: () => setIsMonitorModalOpen(true),
      status: 'available',
      category: 'Système',
      priority: 'high'
    },
    {
      id: 'favorites',
      title: 'Sauvegarder Favoris',
      description: 'Sauvegarder les favoris Chrome et Edge',
      icon: iconFavoris,
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      action: () => setIsFavoritesModalOpen(true),
      status: 'available',
      category: 'Données',
      priority: 'medium'
    },
    {
      id: 'telemetry',
      title: 'Désactiver Télémétrie',
      description: 'Désactiver la collecte de données Windows',
      icon: iconTelemetrie,
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      action: () => setIsTelemetryModalOpen(true),
      status: 'available',
      category: 'Sécurité',
      priority: 'medium'
    },
    {
      id: 'restore',
      title: 'Point de Restauration',
      description: 'Créer un point de restauration système',
      icon: iconRestauration,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      action: () => setIsRestorePointModalOpen(true),
      status: 'available',
      category: 'Sécurité',
      priority: 'high'
    },
    {
      id: 'godmode',
      title: 'Activer le GodMode',
      description: 'Créer le raccourci GodMode sur le Bureau',
      icon: iconGodMode,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      action: () => enableGodMode(),
      status: 'available',
      category: 'Système',
      priority: 'low'
    },
    {
      id: 'battery',
      title: 'Générer un rapport batterie',
      description: 'Créer un rapport détaillé de la batterie',
      icon: iconBatterie,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: () => generateBatteryReport(),
      status: 'available',
      category: 'Diagnostic',
      priority: 'low'
    },
    {
      id: 'secureboot',
      title: 'Vérifier Secure Boot',
      description: 'Vérifier le statut Secure Boot',
      icon: iconSecureBoot,
      color: '#1d4ed8',
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
      action: () => setIsSecureBootModalOpen(true),
      status: 'available',
      category: 'Sécurité',
      priority: 'medium'
    }
  ];

  const handleQuickAction = (action: QuickAction) => {
    setSelectedQuickAction(action.id);
    action.action();
    setTimeout(() => setSelectedQuickAction(null), 2000);
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
      {/* Effet de particules en arrière-plan */}
      <div className="particles-background">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header Hero Section */}
      <motion.div 
        className="dashboard-hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="hero-content">
          {/* Logo Central avec effet de brillance */}
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
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src={logoPage1} 
                alt="VestyWinBox Logo" 
                className="dashboard-logo"
              />
              <motion.div
                className="logo-shine"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 100, opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </motion.div>

          {/* Titre Principal avec effet de typewriter */}
          <motion.div 
            className="hero-title-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Bienvenue dans VestyWinBox
              <motion.span
                className="sparkle-icon"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={40} />
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Tableau de bord principal pour la gestion avancée de votre système Windows
            </motion.p>
          </motion.div>

          {/* Heure actuelle */}
          <motion.div
            className="current-time-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div 
              className="time-container"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock size={24} />
              <span className="time-text">{currentTime.toLocaleTimeString()}</span>
            </motion.div>
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Actions Rapides
            <motion.span
              className="header-sparkle"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={24} />
            </motion.span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Accédez rapidement aux fonctionnalités essentielles
          </motion.p>
        </div>
        
        <div className="quick-actions-grid">
          <AnimatePresence>
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                className={`quick-action-card ${selectedQuickAction === action.id ? 'selected' : ''}`}
                style={{ background: action.gradient }}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 20px 40px ${action.color}40`,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action)}
                layout
              >
                {/* Indicateur de priorité */}
                {action.priority && (
                  <motion.div
                    className="priority-indicator"
                    style={{ backgroundColor: getPriorityColor(action.priority) }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  />
                )}

                <div className="action-icon">
                  <motion.div
                    className="icon-container"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <img 
                      src={action.icon} 
                      alt={action.title}
                      className="custom-icon"
                    />
                  </motion.div>
                </div>
                
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                  {action.category && (
                    <span className="action-category">{action.category}</span>
                  )}
                </div>
                
                <div className="action-status">
                  <div className={`status-dot ${action.status}`} />
                </div>

                {/* Effet de brillance au survol */}
                <motion.div
                  className="card-shine"
                  initial={{ x: -100, opacity: 0 }}
                  whileHover={{ x: 100, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
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