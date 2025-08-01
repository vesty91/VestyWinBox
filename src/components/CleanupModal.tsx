import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle, AlertCircle, X, HardDrive, Clock, Activity, Shield } from 'lucide-react';
import './CleanupModal.css';

interface CleanupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CleanupOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  size: string;
  selected: boolean;
  command: string;
  args: string[];
}

interface CleanupProgress {
  isRunning: boolean;
  progress: number;
  currentStep: string;
  message: string;
  error?: string;
  spaceFreed: string;
}

const CleanupModal: React.FC<CleanupModalProps> = ({ isOpen, onClose }) => {
  const [cleanupOptions, setCleanupOptions] = useState<CleanupOption[]>([
    {
      id: 'temp',
      name: 'Fichiers temporaires',
      description: 'Fichiers temporaires Windows et applications',
      icon: <Clock size={20} />,
      size: '~500 MB',
      selected: true,
      command: 'cleanmgr',
      args: ['/sagerun:1']
    },
    {
      id: 'recycle',
      name: 'Corbeille',
      description: 'Vider la corbeille complètement',
      icon: <Trash2 size={20} />,
      size: 'Variable',
      selected: true,
      command: 'powershell.exe',
      args: ['-Command', 'Clear-RecycleBin -Force']
    },
    {
      id: 'downloads',
      name: 'Dossier Téléchargements',
      description: 'Nettoyer les fichiers téléchargés anciens',
      icon: <HardDrive size={20} />,
      size: 'Variable',
      selected: false,
      command: 'powershell.exe',
      args: ['-Command', 'Get-ChildItem $env:USERPROFILE\\Downloads -File | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | Remove-Item -Force']
    },
    {
      id: 'browser',
      name: 'Cache navigateurs',
      description: 'Nettoyer le cache des navigateurs web',
      icon: <Activity size={20} />,
      size: '~200 MB',
      selected: false,
      command: 'powershell.exe',
      args: ['-Command', 'Remove-Item -Path "$env:LOCALAPPDATA\\Google\\Chrome\\User Data\\Default\\Cache\\*" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path "$env:LOCALAPPDATA\\Mozilla\\Firefox\\Profiles\\*\\cache2\\*" -Recurse -Force -ErrorAction SilentlyContinue']
    },
    {
      id: 'windows',
      name: 'Fichiers Windows Update',
      description: 'Nettoyer les fichiers d\'installation Windows Update',
      icon: <Shield size={20} />,
      size: '~1-3 GB',
      selected: false,
      command: 'dism.exe',
      args: ['/online', '/cleanup-image', '/startcomponentcleanup', '/resetbase']
    }
  ]);

  const [cleanupProgress, setCleanupProgress] = useState<CleanupProgress>({
    isRunning: false,
    progress: 0,
    currentStep: '',
    message: '',
    spaceFreed: '0 MB'
  });

  const [logs, setLogs] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    setCleanupOptions(prev => 
      prev.map(option => 
        option.id === id ? { ...option, selected: !option.selected } : option
      )
    );
  };

  const selectAll = () => {
    setCleanupOptions(prev => 
      prev.map(option => ({ ...option, selected: true }))
    );
  };

  const deselectAll = () => {
    setCleanupOptions(prev => 
      prev.map(option => ({ ...option, selected: false }))
    );
  };

  const startCleanup = async () => {
    const selectedOptions = cleanupOptions.filter(option => option.selected);
    
    if (selectedOptions.length === 0) {
      alert('Veuillez sélectionner au moins une option de nettoyage.');
      return;
    }

    setCleanupProgress({
      isRunning: true,
      progress: 0,
      currentStep: 'Initialisation...',
      message: 'Démarrage du nettoyage système',
      spaceFreed: '0 MB'
    });

    setLogs(['🧹 Démarrage du nettoyage système...']);

    try {
      if (window.electronAPI?.executeSystemCommand) {
        let totalProgress = 0;
        const progressPerStep = 100 / selectedOptions.length;

        for (let i = 0; i < selectedOptions.length; i++) {
          const option = selectedOptions[i];
          
          setCleanupProgress(prev => ({
            ...prev,
            progress: totalProgress,
            currentStep: `Nettoyage : ${option.name}`,
            message: `Exécution de ${option.name}...`
          }));

          addLog(`📋 Début du nettoyage : ${option.name}`);

          try {
            const result = await window.electronAPI.executeSystemCommand(option.command, option.args);
            
            if (result.success) {
              addLog(`✅ ${option.name} : Nettoyage terminé avec succès`);
            } else {
              addLog(`⚠️ ${option.name} : ${result.error || 'Erreur lors du nettoyage'}`);
            }
          } catch (error) {
            addLog(`❌ ${option.name} : Erreur - ${error}`);
          }

          totalProgress += progressPerStep;
          
          // Pause entre les opérations
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Finalisation
        setCleanupProgress(prev => ({
          ...prev,
          progress: 100,
          currentStep: 'Nettoyage terminé',
          message: 'Toutes les opérations de nettoyage sont terminées',
          spaceFreed: 'Espace libéré avec succès'
        }));

        addLog('✅ Nettoyage système terminé avec succès');
        
        // Fermer automatiquement après 3 secondes
        setTimeout(() => {
          onClose();
        }, 3000);

      } else {
        addLog('⚠️ API Electron non disponible - Nettoyage manuel requis');
        setCleanupProgress(prev => ({
          ...prev,
          isRunning: false,
          error: 'Veuillez utiliser le Nettoyeur de disque Windows'
        }));
      }
    } catch (error) {
      addLog('❌ Erreur lors du nettoyage: ' + error);
      setCleanupProgress(prev => ({
        ...prev,
        isRunning: false,
        error: 'Erreur lors du nettoyage'
      }));
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleClose = () => {
    if (!cleanupProgress.isRunning) {
      onClose();
      // Reset state
      setCleanupProgress({
        isRunning: false,
        progress: 0,
        currentStep: '',
        message: '',
        spaceFreed: '0 MB'
      });
      setLogs([]);
      setCleanupOptions(prev => 
        prev.map(option => ({ ...option, selected: option.id === 'temp' || option.id === 'recycle' }))
      );
    }
  };

  const selectedCount = cleanupOptions.filter(option => option.selected).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cleanup-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="cleanup-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="cleanup-modal-header">
              <div className="cleanup-modal-title">
                <Trash2 className="cleanup-icon" />
                <h2>Nettoyage Système</h2>
              </div>
              {!cleanupProgress.isRunning && (
                <button className="cleanup-modal-close" onClick={handleClose} title="Fermer">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="cleanup-modal-content">
              {!cleanupProgress.isRunning && cleanupProgress.progress === 0 ? (
                <>
                  {/* Options de nettoyage */}
                  <div className="cleanup-options-section">
                    <div className="options-header">
                      <h3>Options de nettoyage</h3>
                      <div className="options-actions">
                        <button onClick={selectAll} className="select-all-btn">
                          Tout sélectionner
                        </button>
                        <button onClick={deselectAll} className="deselect-all-btn">
                          Tout désélectionner
                        </button>
                      </div>
                    </div>
                    
                    <div className="options-list">
                      {cleanupOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`cleanup-option ${option.selected ? 'selected' : ''}`}
                          onClick={() => toggleOption(option.id)}
                        >
                          <div className="option-checkbox">
                            <input
                              type="checkbox"
                              checked={option.selected}
                              onChange={() => toggleOption(option.id)}
                            />
                          </div>
                          <div className="option-icon">
                            {option.icon}
                          </div>
                          <div className="option-content">
                            <h4>{option.name}</h4>
                            <p>{option.description}</p>
                          </div>
                          <div className="option-size">
                            {option.size}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Résumé */}
                  <div className="cleanup-summary">
                    <div className="summary-info">
                      <span>Options sélectionnées : {selectedCount}/{cleanupOptions.length}</span>
                      <span>Espace potentiellement libéré : ~2-4 GB</span>
                    </div>
                  </div>

                  {/* Bouton de démarrage */}
                  <div className="cleanup-actions">
                    <button
                      className="start-cleanup-btn"
                      onClick={startCleanup}
                      disabled={selectedCount === 0}
                    >
                      <Trash2 size={16} />
                      Démarrer le Nettoyage ({selectedCount} options)
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Barre de progression */}
                  <div className="cleanup-progress-section">
                    <div className="progress-header">
                      <h3>Nettoyage en cours...</h3>
                      <span className="progress-percentage">
                        {Math.round(cleanupProgress.progress)}%
                      </span>
                    </div>
                    
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${cleanupProgress.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <div className="progress-details">
                      <p className="current-step">
                        {cleanupProgress.currentStep}
                      </p>
                      <p className="progress-message">
                        {cleanupProgress.message}
                      </p>
                      <p className="space-freed">
                        💾 Espace libéré : {cleanupProgress.spaceFreed}
                      </p>
                      {cleanupProgress.error && (
                        <p className="progress-error">
                          <AlertCircle size={16} />
                          {cleanupProgress.error}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Logs en temps réel */}
                  <div className="cleanup-logs-section">
                    <h3>Journal du nettoyage</h3>
                    <div className="logs-container">
                      {logs.map((log, index) => (
                        <div key={index} className="log-entry">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message de fin */}
                  {!cleanupProgress.isRunning && cleanupProgress.progress === 100 && (
                    <div className="cleanup-success">
                      <CheckCircle className="success-icon" />
                      <p>Nettoyage système terminé avec succès!</p>
                      <p className="success-details">
                        L'espace disque a été optimisé et les fichiers inutiles supprimés.
                      </p>
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

export default CleanupModal; 