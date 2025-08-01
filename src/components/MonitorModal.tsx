import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Settings, RotateCcw, X, Activity } from 'lucide-react';
import './MonitorModal.css';

interface MonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RestartButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  action: () => void;
  status: 'idle' | 'running' | 'success' | 'error';
}

const MonitorModal: React.FC<MonitorModalProps> = ({ isOpen, onClose }) => {
  const [buttonStates, setButtonStates] = useState<{ [key: string]: 'idle' | 'running' | 'success' | 'error' }>({
    safeMode: 'idle',
    bios: 'idle',
    advanced: 'idle'
  });

  // Fonction pour redémarrer en mode sans échec
  const restartSafeMode = () => {
    try {
      console.log('🔄 Démarrage du redémarrage en mode sans échec...');
      setButtonStates(prev => ({ ...prev, safeMode: 'running' }));
      
      const confirmed = confirm(
        '🔄 Redémarrage en Mode Sans Échec\n\n' +
        'Cette action va redémarrer votre ordinateur en mode sans échec.\n\n' +
        '⚠️ ATTENTION :\n' +
        '• Votre ordinateur va redémarrer immédiatement\n' +
        '• Vous serez en mode sans échec au prochain démarrage\n' +
        '• Pour sortir du mode sans échec, redémarrez normalement\n\n' +
        'Êtes-vous sûr de vouloir continuer ?'
      );

      if (confirmed) {
        if (window.electronAPI?.executeSystemCommand) {
          // Configurer le mode sans échec et redémarrer
          window.electronAPI.executeSystemCommand('cmd.exe', [
            '/c', 'bcdedit /set {current} safeboot minimal && shutdown /r /t 0'
          ])
          .then((result) => {
            if (result.success) {
              console.log('✅ Redémarrage en mode sans échec lancé');
              setButtonStates(prev => ({ ...prev, safeMode: 'success' }));
              alert('✅ Redémarrage en mode sans échec lancé !\n\nVotre ordinateur va redémarrer dans quelques secondes.');
            } else {
              console.log('❌ Erreur lors du redémarrage en mode sans échec:', result.error);
              setButtonStates(prev => ({ ...prev, safeMode: 'error' }));
              alert('❌ Erreur lors du redémarrage en mode sans échec.\n\nVeuillez exécuter en tant qu\'administrateur.');
            }
          })
          .catch((error) => {
            console.error('❌ Erreur lors de l\'exécution:', error);
            setButtonStates(prev => ({ ...prev, safeMode: 'error' }));
            alert('❌ Erreur lors de l\'exécution de la commande.');
          });
        } else {
          setButtonStates(prev => ({ ...prev, safeMode: 'error' }));
          alert('⚠️ API Electron non disponible.\n\nVeuillez exécuter manuellement :\nbcdedit /set {current} safeboot minimal && shutdown /r /t 0');
        }
      } else {
        setButtonStates(prev => ({ ...prev, safeMode: 'idle' }));
      }
    } catch (error) {
      console.error('❌ Erreur lors du redémarrage en mode sans échec:', error);
      setButtonStates(prev => ({ ...prev, safeMode: 'error' }));
      alert('❌ Erreur lors du redémarrage en mode sans échec.');
    }
  };

  // Fonction pour redémarrer dans le BIOS
  const restartBIOS = () => {
    try {
      console.log('🔧 Démarrage du redémarrage vers le BIOS...');
      setButtonStates(prev => ({ ...prev, bios: 'running' }));
      
      const confirmed = confirm(
        '🔧 Redémarrage vers le BIOS\n\n' +
        'Cette action va redémarrer votre ordinateur et accéder directement au BIOS.\n\n' +
        '⚠️ ATTENTION :\n' +
        '• Votre ordinateur va redémarrer immédiatement\n' +
        '• Vous accéderez directement au BIOS/UEFI\n' +
        '• Ne modifiez pas les paramètres BIOS sans connaissance\n\n' +
        'Êtes-vous sûr de vouloir continuer ?'
      );

      if (confirmed) {
        if (window.electronAPI?.executeSystemCommand) {
          // Redémarrer vers le BIOS
          window.electronAPI.executeSystemCommand('shutdown.exe', [
            '/r', '/fw', '/t', '0'
          ])
          .then((result) => {
            if (result.success) {
              console.log('✅ Redémarrage vers le BIOS lancé');
              setButtonStates(prev => ({ ...prev, bios: 'success' }));
              alert('✅ Redémarrage vers le BIOS lancé !\n\nVotre ordinateur va redémarrer et accéder au BIOS.');
            } else {
              console.log('❌ Erreur lors du redémarrage vers le BIOS:', result.error);
              setButtonStates(prev => ({ ...prev, bios: 'error' }));
              alert('❌ Erreur lors du redémarrage vers le BIOS.\n\nVeuillez exécuter en tant qu\'administrateur.');
            }
          })
          .catch((error) => {
            console.error('❌ Erreur lors de l\'exécution:', error);
            setButtonStates(prev => ({ ...prev, bios: 'error' }));
            alert('❌ Erreur lors de l\'exécution de la commande.');
          });
        } else {
          setButtonStates(prev => ({ ...prev, bios: 'error' }));
          alert('⚠️ API Electron non disponible.\n\nVeuillez exécuter manuellement :\nshutdown /r /fw /t 0');
        }
      } else {
        setButtonStates(prev => ({ ...prev, bios: 'idle' }));
      }
    } catch (error) {
      console.error('❌ Erreur lors du redémarrage vers le BIOS:', error);
      setButtonStates(prev => ({ ...prev, bios: 'error' }));
      alert('❌ Erreur lors du redémarrage vers le BIOS.');
    }
  };

  // Fonction pour le démarrage avancé
  const advancedStartup = () => {
    try {
      console.log('⚙️ Démarrage des options de démarrage avancées...');
      setButtonStates(prev => ({ ...prev, advanced: 'running' }));
      
      const confirmed = confirm(
        '⚙️ Démarrage Avancé\n\n' +
        'Cette action va redémarrer votre ordinateur vers les options de démarrage avancées.\n\n' +
        '⚠️ ATTENTION :\n' +
        '• Votre ordinateur va redémarrer immédiatement\n' +
        '• Vous accéderez aux options de démarrage avancées\n' +
        '• Options disponibles : Mode sans échec, Récupération, etc.\n\n' +
        'Êtes-vous sûr de vouloir continuer ?'
      );

      if (confirmed) {
        if (window.electronAPI?.executeSystemCommand) {
          // Redémarrer vers les options de démarrage avancées
          window.electronAPI.executeSystemCommand('shutdown.exe', [
            '/r', '/o', '/f', '/t', '0'
          ])
          .then((result) => {
            if (result.success) {
              console.log('✅ Démarrage avancé lancé');
              setButtonStates(prev => ({ ...prev, advanced: 'success' }));
              alert('✅ Démarrage avancé lancé !\n\nVotre ordinateur va redémarrer vers les options de démarrage avancées.');
            } else {
              console.log('❌ Erreur lors du démarrage avancé:', result.error);
              setButtonStates(prev => ({ ...prev, advanced: 'error' }));
              alert('❌ Erreur lors du démarrage avancé.\n\nVeuillez exécuter en tant qu\'administrateur.');
            }
          })
          .catch((error) => {
            console.error('❌ Erreur lors de l\'exécution:', error);
            setButtonStates(prev => ({ ...prev, advanced: 'error' }));
            alert('❌ Erreur lors de l\'exécution de la commande.');
          });
        } else {
          setButtonStates(prev => ({ ...prev, advanced: 'error' }));
          alert('⚠️ API Electron non disponible.\n\nVeuillez exécuter manuellement :\nshutdown /r /o /f /t 0');
        }
      } else {
        setButtonStates(prev => ({ ...prev, advanced: 'idle' }));
      }
    } catch (error) {
      console.error('❌ Erreur lors du démarrage avancé:', error);
      setButtonStates(prev => ({ ...prev, advanced: 'error' }));
      alert('❌ Erreur lors du démarrage avancé.');
    }
  };

  const restartButtons: RestartButton[] = [
    {
      id: 'safeMode',
      icon: <Power size={32} />,
      label: 'Redémarrer en Mode Sans Échec',
      tooltip: 'Redémarre immédiatement en mode sans échec (invite admin)',
      action: restartSafeMode,
      status: buttonStates.safeMode
    },
    {
      id: 'bios',
      icon: <Settings size={32} />,
      label: 'Redémarrer dans le BIOS',
      tooltip: 'Redémarre et accède directement au BIOS',
      action: restartBIOS,
      status: buttonStates.bios
    },
    {
      id: 'advanced',
      icon: <RotateCcw size={32} />,
      label: 'Démarrage Avancé',
      tooltip: 'Redémarre vers les options de démarrage avancées (admin)',
      action: advancedStartup,
      status: buttonStates.advanced
    }
  ];

  const handleClose = () => {
    onClose();
    // Reset button states
    setButtonStates({
      safeMode: 'idle',
      bios: 'idle',
      advanced: 'idle'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="monitor-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="monitor-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="monitor-modal-header">
              <div className="monitor-modal-title">
                <Activity className="monitor-icon" />
                <h2>Options de Redémarrage Système</h2>
              </div>
              <button className="monitor-modal-close" onClick={handleClose} title="Fermer">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="monitor-modal-content">
              <div className="monitor-description">
                <h3>Actions de Redémarrage Avancées</h3>
                <p>Sélectionnez une option de redémarrage pour accéder aux fonctionnalités système avancées.</p>
              </div>

              {/* Boutons ronds rouges */}
              <div className="restart-buttons-container">
                {restartButtons.map((button) => (
                  <motion.div
                    key={button.id}
                    className={`restart-button ${button.status}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={button.action}
                    title={button.tooltip}
                  >
                    <div className="button-glow"></div>
                    <div className="button-content">
                      <div className="button-icon">
                        {button.icon}
                      </div>
                      <div className="button-label">
                        {button.label}
                      </div>
                      <div className="button-status">
                        {button.status === 'idle' && <span className="status-idle">Prêt</span>}
                        {button.status === 'running' && <span className="status-running">En cours...</span>}
                        {button.status === 'success' && <span className="status-success">Succès</span>}
                        {button.status === 'error' && <span className="status-error">Erreur</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Informations de sécurité */}
              <div className="security-info">
                <h4>⚠️ Informations de Sécurité</h4>
                <ul>
                  <li>Toutes les actions nécessitent des privilèges administrateur</li>
                  <li>Les redémarrages sont immédiats - sauvegardez vos travaux</li>
                  <li>Le mode sans échec peut être désactivé en redémarrant normalement</li>
                  <li>Ne modifiez pas les paramètres BIOS sans connaissance</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonitorModal; 