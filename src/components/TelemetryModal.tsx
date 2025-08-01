import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ban, Shield, CheckCircle, AlertCircle, X, Activity, Eye } from 'lucide-react';
import './TelemetryModal.css';

interface TelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TelemetryProgress {
  isRunning: boolean;
  progress: number;
  currentStep: string;
  message: string;
  error?: string;
}

const TelemetryModal: React.FC<TelemetryModalProps> = ({ isOpen, onClose }) => {
  const [telemetryProgress, setTelemetryProgress] = useState<TelemetryProgress>({
    isRunning: false,
    progress: 0,
    currentStep: '',
    message: ''
  });

  const [selectedOptions, setSelectedOptions] = useState<{
    disableDiagTrack: boolean;
    disableWMPNetworkSvc: boolean;
    disableDmwappushservice: boolean;
    disablePcaSvc: boolean;
  }>({
    disableDiagTrack: true,
    disableWMPNetworkSvc: true,
    disableDmwappushservice: true,
    disablePcaSvc: true
  });

  const handleStartDisable = async () => {
    const confirmed = window.confirm(
      '🚫 Désactiver la Télémétrie Windows\n\n' +
      'Cette action va désactiver plusieurs services de collecte de données.\n\n' +
      '⚠️ ATTENTION :\n' +
      '• Nécessite des privilèges administrateur\n' +
      '• Peut affecter certaines fonctionnalités Windows\n' +
      '• Redémarrage recommandé après les modifications\n\n' +
      'Êtes-vous sûr de vouloir continuer ?'
    );

    if (!confirmed) return;

    setTelemetryProgress({
      isRunning: true,
      progress: 0,
      currentStep: '',
      message: 'Démarrage de la désactivation...'
    });

    try {
      const steps = [];
      let progress = 0;
      const stepIncrement = 100 / Object.values(selectedOptions).filter(Boolean).length;

      if (selectedOptions.disableDiagTrack) {
        steps.push({
          name: 'DiagTrack',
          command: 'sc stop DiagTrack && sc config DiagTrack start=disabled',
          description: 'Service de télémétrie connectée'
        });
      }

      if (selectedOptions.disableWMPNetworkSvc) {
        steps.push({
          name: 'WMPNetworkSvc',
          command: 'sc stop WMPNetworkSvc && sc config WMPNetworkSvc start=disabled',
          description: 'Service Windows Media Player Network'
        });
      }

      if (selectedOptions.disableDmwappushservice) {
        steps.push({
          name: 'dmwappushservice',
          command: 'sc stop dmwappushservice && sc config dmwappushservice start=disabled',
          description: 'Service WAP Push Message Routing'
        });
      }

      if (selectedOptions.disablePcaSvc) {
        steps.push({
          name: 'PcaSvc',
          command: 'sc stop PcaSvc && sc config PcaSvc start=disabled',
          description: 'Service Program Compatibility Assistant'
        });
      }

      for (const step of steps) {
        setTelemetryProgress(prev => ({
          ...prev,
          currentStep: step.name,
          message: `Désactivation de ${step.description}...`
        }));

        const result = await window.electronAPI?.executeSystemCommand('cmd.exe', ['/c', step.command]);
        
        if (result?.success) {
          progress += stepIncrement;
          setTelemetryProgress(prev => ({ ...prev, progress }));
        } else {
          console.warn(`Échec pour ${step.name}:`, result?.error);
        }
      }

      setTelemetryProgress({
        isRunning: false,
        progress: 100,
        currentStep: '',
        message: 'Désactivation terminée avec succès !'
      });

    } catch (error) {
      setTelemetryProgress({
        isRunning: false,
        progress: 0,
        currentStep: '',
        message: 'Erreur lors de la désactivation',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const handleClose = () => {
    if (!telemetryProgress.isRunning) {
      setTelemetryProgress({
        isRunning: false,
        progress: 0,
        currentStep: '',
        message: ''
      });
      onClose();
    }
  };

  const toggleOption = (option: keyof typeof selectedOptions) => {
    setSelectedOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const selectAll = () => {
    setSelectedOptions({
      disableDiagTrack: true,
      disableWMPNetworkSvc: true,
      disableDmwappushservice: true,
      disablePcaSvc: true
    });
  };

  const deselectAll = () => {
    setSelectedOptions({
      disableDiagTrack: false,
      disableWMPNetworkSvc: false,
      disableDmwappushservice: false,
      disablePcaSvc: false
    });
  };

  const selectedCount = Object.values(selectedOptions).filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="telemetry-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="telemetry-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="telemetry-modal-header">
              <div className="telemetry-modal-title">
                <Ban className="telemetry-icon" />
                <h2>Désactiver la Télémétrie</h2>
              </div>
              <button className="telemetry-modal-close" onClick={handleClose} title="Fermer">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="telemetry-modal-content">
              {!telemetryProgress.isRunning && telemetryProgress.progress === 0 ? (
                <>
                  {/* Configuration */}
                  <div className="telemetry-config">
                    <h3>Services à désactiver</h3>
                    <p className="config-description">
                      Sélectionnez les services de télémétrie que vous souhaitez désactiver :
                    </p>
                    
                    {/* Options */}
                    <div className="options-section">
                      <div className="options-header">
                        <span>Services sélectionnés : {selectedCount}/4</span>
                        <div className="options-actions">
                          <button onClick={selectAll} className="action-btn">Tout sélectionner</button>
                          <button onClick={deselectAll} className="action-btn">Tout désélectionner</button>
                        </div>
                      </div>
                      
                      <div className="options-list">
                        <label className="option-item">
                          <input
                            type="checkbox"
                            checked={selectedOptions.disableDiagTrack}
                            onChange={() => toggleOption('disableDiagTrack')}
                          />
                          <div className="option-content">
                            <div className="option-header">
                              <Activity size={20} />
                              <span className="option-name">DiagTrack</span>
                            </div>
                            <span className="option-description">Service de télémétrie connectée Windows</span>
                          </div>
                        </label>

                        <label className="option-item">
                          <input
                            type="checkbox"
                            checked={selectedOptions.disableWMPNetworkSvc}
                            onChange={() => toggleOption('disableWMPNetworkSvc')}
                          />
                          <div className="option-content">
                            <div className="option-header">
                              <Eye size={20} />
                              <span className="option-name">WMPNetworkSvc</span>
                            </div>
                            <span className="option-description">Service Windows Media Player Network</span>
                          </div>
                        </label>

                        <label className="option-item">
                          <input
                            type="checkbox"
                            checked={selectedOptions.disableDmwappushservice}
                            onChange={() => toggleOption('disableDmwappushservice')}
                          />
                          <div className="option-content">
                            <div className="option-header">
                              <Activity size={20} />
                              <span className="option-name">dmwappushservice</span>
                            </div>
                            <span className="option-description">Service WAP Push Message Routing</span>
                          </div>
                        </label>

                        <label className="option-item">
                          <input
                            type="checkbox"
                            checked={selectedOptions.disablePcaSvc}
                            onChange={() => toggleOption('disablePcaSvc')}
                          />
                          <div className="option-content">
                            <div className="option-header">
                              <Shield size={20} />
                              <span className="option-name">PcaSvc</span>
                            </div>
                            <span className="option-description">Service Program Compatibility Assistant</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="info-section">
                      <h4>⚠️ Informations importantes</h4>
                      <ul>
                        <li>Nécessite des privilèges administrateur</li>
                        <li>Peut affecter certaines fonctionnalités Windows</li>
                        <li>Redémarrage recommandé après les modifications</li>
                        <li>Les services peuvent être réactivés par Windows Update</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bouton de démarrage */}
                  <button
                    className="start-disable-btn"
                    onClick={handleStartDisable}
                    disabled={selectedCount === 0}
                  >
                    <Ban size={20} />
                    Désactiver la télémétrie ({selectedCount} services)
                  </button>
                </>
              ) : (
                <>
                  {/* Progress */}
                  <div className="telemetry-progress">
                    <h3>Désactivation en cours...</h3>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${telemetryProgress.progress}%` }}
                      />
                    </div>
                    
                    <div className="progress-details">
                      <p className="current-step">
                        {telemetryProgress.currentStep && `${telemetryProgress.currentStep}...`}
                      </p>
                      <p className="progress-message">{telemetryProgress.message}</p>
                    </div>

                    {telemetryProgress.error && (
                      <div className="error-message">
                        <AlertCircle size={16} />
                        <span>{telemetryProgress.error}</span>
                      </div>
                    )}
                  </div>

                  {/* Résultat */}
                  {!telemetryProgress.isRunning && telemetryProgress.progress === 100 && (
                    <div className="telemetry-result">
                      <CheckCircle size={48} className="success-icon" />
                      <h3>Télémétrie désactivée !</h3>
                      <p>Les services sélectionnés ont été arrêtés et désactivés.</p>
                      <div className="result-actions">
                        <button onClick={handleClose} className="close-btn">
                          Fermer
                        </button>
                        <button 
                          onClick={() => window.electronAPI?.executeSystemCommand('shutdown.exe', ['/r', '/t', '10', '/c', 'Redémarrage recommandé après désactivation télémétrie'])}
                          className="restart-btn"
                        >
                          Redémarrer maintenant
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TelemetryModal; 