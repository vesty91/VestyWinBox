import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';
import BackupModal from '../../components/BackupModal';
import SystemCheckModal from '../../components/SystemCheckModal';
import CleanupModal from '../../components/CleanupModal';
import MonitorModal from '../../components/MonitorModal';
import FavoritesModal from '../../components/FavoritesModal';
import TelemetryModal from '../../components/TelemetryModal';
import SecureBootModal from '../../components/SecureBootModal';
import GodModeModal from '../../components/GodModeModal';
import BatteryReportModal from '../../components/BatteryReportModal';
import UACModal from '../../components/UACModal';
import './VIPDashboard.css';

// Import des icônes personnalisées
import iconSauvegarde from '../../../assets/tools/icons/icon-page-accueil/sauvegarde.png';
import iconIntegrite from '../../../assets/tools/icons/icon-page-accueil/Intégrité.png';
import iconNetoyage from '../../../assets/tools/icons/icon-page-accueil/netoyage.png';
import iconRedemarer from '../../../assets/tools/icons/icon-page-accueil/redemarer.png';
import iconFavoris from '../../../assets/tools/icons/icon-page-accueil/favoris.png';
import iconTelemetrie from '../../../assets/tools/icons/icon-page-accueil/telemetrie.png';
import iconSecureBoot from '../../../assets/tools/icons/icon-page-accueil/secure-boot.png';
import iconRestorePoint from '../../../assets/tools/icons/icon-page-accueil/Restauration.png';
import iconGodMode from '../../../assets/tools/icons/icon-page-accueil/GodMode-removebg-preview.png';
import iconBattery from '../../../assets/tools/icons/icon-page-accueil/batrie.png';
import iconUAC from '../../../assets/tools/icons/icon-page-accueil/secure-boot.png'; // Utilise secure-boot temporairement

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  modal?: React.ComponentType<any>;
}

const VIPDashboard: React.FC = () => {
  const { addToast } = useToast();
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: 'backup',
      title: 'Sauvegarder',
      description: 'Sauvegarde des dossiers utilisateur',
      icon: iconSauvegarde,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      modal: BackupModal
    },
    {
      id: 'system-check',
      title: 'Intégrité des fichiers système',
      description: 'Vérification SFC /scannow',
      icon: iconIntegrite,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      modal: SystemCheckModal
    },
    {
      id: 'cleanup',
      title: 'Nettoyer',
      description: 'Nettoyage système avancé',
      icon: iconNetoyage,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      modal: CleanupModal
    },
    {
      id: 'uac',
      title: 'Désactiver l\'UAC',
      description: 'Contrôle de compte utilisateur',
      icon: iconUAC,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      modal: UACModal
    },
    {
      id: 'restart-options',
      title: 'Options de Redémarrage',
      description: 'Redémarrage avancé',
      icon: iconRedemarer,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      modal: MonitorModal
    },
    {
      id: 'favorites',
      title: 'Sauvegarder Favoris',
      description: 'Backup des favoris navigateurs',
      icon: iconFavoris,
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)',
      modal: FavoritesModal
    },
    {
      id: 'telemetry',
      title: 'Désactiver Télémétrie',
      description: 'Désactiver la collecte de données',
      icon: iconTelemetrie,
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      modal: TelemetryModal
    },
    {
      id: 'secure-boot',
      title: 'Vérifier Secure Boot',
      description: 'Statut Secure Boot UEFI',
      icon: iconSecureBoot,
      color: '#1e40af',
      gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      modal: SecureBootModal
    },
    {
      id: 'restore-point',
      title: 'Point de Restauration',
      description: 'Créer un point de restauration',
      icon: iconRestorePoint,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      modal: () => null // À implémenter
    },
    {
      id: 'god-mode',
      title: 'Activer GodMode',
      description: 'Accès au panneau de contrôle avancé',
      icon: iconGodMode,
      color: '#ffd700',
      gradient: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
      modal: GodModeModal
    },
    {
      id: 'battery-report',
      title: 'Générer un rapport batterie',
      description: 'Rapport détaillé de la batterie',
      icon: iconBattery,
      color: '#16a34a',
      gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
      modal: BatteryReportModal
    }
  ];

  const handleActionClick = (action: QuickAction) => {
    if (action.modal) {
      setActiveModal(action.id);
      addToast({
        type: 'info',
        title: 'Ouverture du module',
        message: `Ouverture de ${action.title}...`,
        duration: 2000
      });
    } else {
      addToast({
        type: 'warning',
        title: 'Fonctionnalité en développement',
        message: 'Cette fonctionnalité sera bientôt disponible.',
        duration: 3000
      });
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="vip-dashboard">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div 
            className="logo-container"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
          >
            <img 
              src="/logo-barre-laterale.png" 
              alt="VestyWinBox Logo" 
              className="main-logo"
            />
          </motion.div>
          
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="hero-title">VestyWinBox</h1>
            <p className="hero-subtitle">
              Gestionnaire système avancé pour Windows
            </p>
          </motion.div>

          <motion.div 
            className="current-time-display"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="time">{formatTime(currentTime)}</div>
            <div className="date">{formatDate(currentTime)}</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Actions Grid */}
      <motion.section 
        className="quick-actions-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2 className="section-title">Actions Rapides</h2>
        
        <div className="quick-actions-grid">
          <AnimatePresence>
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                className="quick-action-card"
                style={{ background: action.gradient }}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
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
                onClick={() => handleActionClick(action)}
              >
                <div className="action-icon">
                  <img 
                    src={action.icon} 
                    alt={action.title}
                    className="custom-icon"
                  />
                </div>
                
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>

                {/* Effet de brillance */}
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
      </motion.section>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'backup' && (
          <BackupModal onClose={closeModal} />
        )}
        {activeModal === 'system-check' && (
          <SystemCheckModal onClose={closeModal} />
        )}
        {activeModal === 'cleanup' && (
          <CleanupModal onClose={closeModal} />
        )}
        {activeModal === 'uac' && (
          <UACModal onClose={closeModal} />
        )}
        {activeModal === 'restart-options' && (
          <MonitorModal onClose={closeModal} />
        )}
        {activeModal === 'favorites' && (
          <FavoritesModal onClose={closeModal} />
        )}
        {activeModal === 'telemetry' && (
          <TelemetryModal onClose={closeModal} />
        )}
        {activeModal === 'secure-boot' && (
          <SecureBootModal onClose={closeModal} />
        )}
        {activeModal === 'god-mode' && (
          <GodModeModal onClose={closeModal} />
        )}
        {activeModal === 'battery-report' && (
          <BatteryReportModal onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VIPDashboard; 