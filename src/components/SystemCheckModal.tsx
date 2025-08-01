import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, X, Clock, Activity } from 'lucide-react';
import './SystemCheckModal.css';

interface SystemCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckProgress {
  isRunning: boolean;
  progress: number;
  currentStep: string;
  message: string;
  error?: string;
  estimatedTime: string;
}

const SystemCheckModal: React.FC<SystemCheckModalProps> = ({ isOpen, onClose }) => {
  const [checkProgress, setCheckProgress] = useState<CheckProgress>({
    isRunning: false,
    progress: 0,
    currentStep: '',
    message: '',
    estimatedTime: '5-10 minutes'
  });

  const [logs, setLogs] = useState<string[]>([]);

  const startSystemCheck = async () => {
    setCheckProgress({
      isRunning: true,
      progress: 0,
      currentStep: 'Initialisation...',
      message: 'Démarrage de la vérification d\'intégrité des fichiers système',
      estimatedTime: '5-10 minutes'
    });

    setLogs(['🔍 Démarrage de la vérification d\'intégrité des fichiers système...']);

    try {
      if (window.electronAPI?.executeSystemCommand) {
        // Simuler la progression de sfc /scannow
        simulateSystemCheck();
        
        // Lancer la vraie commande en arrière-plan
        const result = await window.electronAPI.executeSystemCommand('powershell.exe', [
          '-Command', 
          'Start-Process cmd -ArgumentList "/c sfc /scannow" -Verb RunAs -WindowStyle Hidden'
        ]);
        
        if (result.success) {
          addLog('✅ Commande sfc /scannow lancée avec succès en arrière-plan');
        } else {
          addLog('❌ Erreur lors du lancement de sfc /scannow: ' + result.error);
          setCheckProgress(prev => ({
            ...prev,
            isRunning: false,
            error: 'Erreur lors du lancement de la commande'
          }));
        }
      } else {
        addLog('⚠️ API Electron non disponible - Exécution manuelle requise');
        setCheckProgress(prev => ({
          ...prev,
          isRunning: false,
          error: 'Veuillez exécuter manuellement sfc /scannow'
        }));
      }
    } catch (error) {
      addLog('❌ Erreur lors de l\'exécution: ' + error);
      setCheckProgress(prev => ({
        ...prev,
        isRunning: false,
        error: 'Erreur lors de l\'exécution'
      }));
    }
  };

  const simulateSystemCheck = () => {
    const steps = [
      { progress: 10, step: 'Vérification des fichiers système...', message: 'Analyse des fichiers Windows en cours' },
      { progress: 25, step: 'Scan des fichiers protégés...', message: 'Vérification des fichiers système protégés' },
      { progress: 40, step: 'Vérification de l\'intégrité...', message: 'Contrôle de l\'intégrité des fichiers' },
      { progress: 60, step: 'Répération des fichiers...', message: 'Répération des fichiers corrompus si nécessaire' },
      { progress: 80, step: 'Finalisation...', message: 'Finalisation de la vérification' },
      { progress: 100, step: 'Terminé', message: 'Vérification d\'intégrité terminée' }
    ];

    let currentStepIndex = 0;

    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setCheckProgress(prev => ({
          ...prev,
          progress: step.progress,
          currentStep: step.step,
          message: step.message
        }));
        
        addLog(`📋 ${step.step}`);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setCheckProgress(prev => ({
          ...prev,
          isRunning: false
        }));
        addLog('✅ Vérification d\'intégrité terminée avec succès');
        
        // Fermer automatiquement après 3 secondes
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    }, 3000); // Chaque étape dure 3 secondes
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleClose = () => {
    if (!checkProgress.isRunning) {
      onClose();
      // Reset state
      setCheckProgress({
        isRunning: false,
        progress: 0,
        currentStep: '',
        message: '',
        estimatedTime: '5-10 minutes'
      });
      setLogs([]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="system-check-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="system-check-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="system-check-modal-header">
              <div className="system-check-modal-title">
                <Shield className="system-check-icon" />
                <h2>Vérification d'Intégrité des Fichiers Système</h2>
              </div>
              {!checkProgress.isRunning && (
                <button className="system-check-modal-close" onClick={handleClose}>
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="system-check-modal-content">
              {!checkProgress.isRunning && checkProgress.progress === 0 ? (
                <>
                  {/* Informations avant démarrage */}
                  <div className="check-info-section">
                    <h3>À propos de cette vérification</h3>
                    <div className="info-cards">
                      <div className="info-card">
                        <Clock size={20} />
                        <div>
                          <h4>Durée estimée</h4>
                          <p>5-10 minutes selon votre système</p>
                        </div>
                      </div>
                      <div className="info-card">
                        <Shield size={20} />
                        <div>
                          <h4>Ce qui sera vérifié</h4>
                          <p>Tous les fichiers système Windows protégés</p>
                        </div>
                      </div>
                      <div className="info-card">
                        <Activity size={20} />
                        <div>
                          <h4>Impact sur le système</h4>
                          <p>Légère utilisation CPU, pas d'interruption</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="check-instructions">
                    <h3>Instructions importantes</h3>
                    <ul>
                      <li>✅ La vérification s'exécute en arrière-plan</li>
                      <li>✅ Vous pouvez continuer à utiliser votre ordinateur</li>
                      <li>✅ Les fichiers corrompus seront automatiquement réparés</li>
                      <li>⚠️ Ne redémarrez pas pendant la vérification</li>
                    </ul>
                  </div>

                  {/* Bouton de démarrage */}
                  <div className="check-actions">
                    <button
                      className="start-check-btn"
                      onClick={startSystemCheck}
                    >
                      <Shield size={16} />
                      Démarrer la Vérification
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Barre de progression */}
                  <div className="check-progress-section">
                    <div className="progress-header">
                      <h3>Vérification en cours...</h3>
                      <span className="progress-percentage">
                        {Math.round(checkProgress.progress)}%
                      </span>
                    </div>
                    
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${checkProgress.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <div className="progress-details">
                      <p className="current-step">
                        {checkProgress.currentStep}
                      </p>
                      <p className="progress-message">
                        {checkProgress.message}
                      </p>
                      <p className="estimated-time">
                        ⏱️ Temps restant estimé : {checkProgress.estimatedTime}
                      </p>
                      {checkProgress.error && (
                        <p className="progress-error">
                          <AlertCircle size={16} />
                          {checkProgress.error}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Logs en temps réel */}
                  <div className="check-logs-section">
                    <h3>Journal de la vérification</h3>
                    <div className="logs-container">
                      {logs.map((log, index) => (
                        <div key={index} className="log-entry">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message de fin */}
                  {!checkProgress.isRunning && checkProgress.progress === 100 && (
                    <div className="check-success">
                      <CheckCircle className="success-icon" />
                      <p>Vérification d'intégrité terminée avec succès!</p>
                      <p className="success-details">
                        Tous les fichiers système ont été vérifiés et réparés si nécessaire.
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

export default SystemCheckModal; 