import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/ui/toast';
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
import iconUAC from '../../../assets/tools/icons/icon-page-accueil/secure-boot.png'; // Utilise secure-boot pour UAC

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  modal?: React.ComponentType<{ isOpen: boolean; onClose: () => void }>;
}

const VIPDashboard: React.FC = () => {
  const { addToast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openModal, setOpenModal] = useState<string | null>(null);

  // Définition des actions rapides avec leurs modales
  const quickActions: QuickAction[] = [
    {
      id: 'backup',
      title: 'Sauvegarder',
      description: 'Sauvegarde des dossiers utilisateur',
      icon: iconSauvegarde,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      modal: BackupModal
    },
    {
      id: 'system-check',
      title: 'Intégrité des fichiers système',
      description: 'Vérification SFC /scannow',
      icon: iconIntegrite,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      modal: SystemCheckModal
    },
    {
      id: 'cleanup',
      title: 'Nettoyer',
      description: 'Nettoyage système avancé',
      icon: iconNetoyage,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      modal: CleanupModal
    },
    {
      id: 'monitor',
      title: 'Options de Redémarrage',
      description: 'Redémarrage avancé',
      icon: iconRedemarer,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      modal: MonitorModal
    },
    {
      id: 'favorites',
      title: 'Sauvegarder Favoris',
      description: 'Backup des favoris navigateurs',
      icon: iconFavoris,
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      modal: FavoritesModal
    },
    {
      id: 'telemetry',
      title: 'Désactiver Télémétrie',
      description: 'Désactiver la collecte de données',
      icon: iconTelemetrie,
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      modal: TelemetryModal
    },
    {
      id: 'secure-boot',
      title: 'Vérifier Secure Boot',
      description: 'Statut Secure Boot UEFI',
      icon: iconSecureBoot,
      color: '#1e40af',
      gradient: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
      modal: SecureBootModal
    },
    {
      id: 'restore-point',
      title: 'Point de Restauration',
      description: 'Créer un point de restauration',
      icon: iconRestorePoint,
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      modal: GodModeModal
    },
    {
      id: 'god-mode',
      title: 'Activer GodMode',
      description: 'Accès au panneau de contrôle avancé',
      icon: iconGodMode,
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      modal: GodModeModal
    },
    {
      id: 'battery-report',
      title: 'Générer un rapport batterie',
      description: 'Rapport détaillé de la batterie',
      icon: iconBattery,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      modal: BatteryReportModal
    },
    {
      id: 'uac',
      title: 'Désactiver l\'UAC',
      description: 'Désactiver le contrôle de compte utilisateur',
      icon: iconUAC,
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      modal: UACModal
    }
  ];

  // Mise à jour de l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Gestion des actions rapides
  const handleQuickAction = (action: QuickAction) => {
    if (action.modal) {
      setOpenModal(action.id);
      addToast({
        type: 'info',
        title: 'Ouverture de la fonctionnalité',
        message: `Ouverture de ${action.title}...`,
        duration: 2000
      });
    } else {
      addToast({
        type: 'warning',
        title: 'Fonctionnalité en développement',
        message: `${action.title} sera bientôt disponible.`,
        duration: 3000
      });
    }
  };

  // Fermeture des modales
  const closeModal = () => {
    setOpenModal(null);
  };

  // Formatage de l'heure
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="vip-dashboard">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          duration: 0.8 
        }}
      >
        <div className="hero-content">
          <motion.div 
            className="logo-container"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              delay: 0.3 
            }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 5,
              transition: { duration: 0.3 }
            }}
          >
            <img 
              src="/logo-barre-laterale.png" 
              alt="VestyWinBox" 
              className="main-logo"
            />
          </motion.div>
          
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              VestyWinBox
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              Gestionnaire système Windows avancé
            </motion.p>
          </motion.div>

          <motion.div 
            className="current-time-display"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
          >
            <span className="time-text">{formatTime(currentTime)}</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Actions Grid */}
      <motion.section 
        className="quick-actions-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          Actions Rapides
        </motion.h2>
        
        <motion.div 
          className="quick-actions-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
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
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  delay: 1.3 + index * 0.1 
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action)}
              >
                {/* Effet de brillance */}
                <motion.div
                  className="card-shine"
                  initial={{ x: -100, opacity: 0 }}
                  whileHover={{ x: 100, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6 }}
                />
                
                <div className="action-icon">
                  <motion.img
                    src={action.icon}
                    alt={action.title}
                    className="custom-icon"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      transition: { duration: 0.3 }
                    }}
                  />
                </div>
                
                <div className="action-content">
                  <motion.h3 
                    className="action-title"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {action.title}
                  </motion.h3>
                  <p className="action-description">{action.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* Modales */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-container"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.4 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const action = quickActions.find(a => a.id === openModal);
                if (action?.modal) {
                  const ModalComponent = action.modal;
                  return <ModalComponent isOpen={true} onClose={closeModal} />;
                }
                return null;
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VIPDashboard; 