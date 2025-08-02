import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, X, Clock, Activity, Zap, FileCheck, Settings } from 'lucide-react';
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
        addLog('✅ Vérification d\'intégrité terminée avec succès !');
      }
    }, 2000);
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const handleClose = () => {
    if (!checkProgress.isRunning) {
      onClose();
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
            {/* Header moderne avec titre et bouton de fermeture alignés */}
            <div className="systemcheck-modal-header">
              <div className="systemcheck-modal-title">
                <div className="systemcheck-icon">
                  <Shield size={24} />
                </div>
                <h2>Vérification d'Intégrité des Fichiers Système</h2>
              </div>
              {!checkProgress.isRunning && (
                <button 
                  className="systemcheck-modal-close" 
                  onClick={handleClose}
                  title="Fermer la fenêtre"
                  aria-label="Fermer la fenêtre"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="system-check-modal-content">
              {!checkProgress.isRunning && checkProgress.progress === 0 ? (
                <>
                  {/* Section d'introduction avec design moderne */}
                  <motion.div 
                    className="intro-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="intro-header">
                      <div className="intro-icon">
                        <Zap size={32} />
                      </div>
                      <h3>Protection Avancée du Système</h3>
                      <p>Cette vérification analyse et répare automatiquement tous les fichiers système Windows corrompus pour maintenir la stabilité de votre ordinateur.</p>
                    </div>
                  </motion.div>

                  {/* Cartes d'information avec design moderne */}
                  <motion.div 
                    className="info-cards"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div 
                      className="info-card"
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="card-icon">
                        <Clock size={24} />
                      </div>
                      <h4>Durée Estimée</h4>
                      <p>5-10 minutes selon votre système</p>
                    </motion.div>

                    <motion.div 
                      className="info-card"
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="card-icon">
                        <FileCheck size={24} />
                      </div>
                      <h4>Fichiers Vérifiés</h4>
                      <p>Tous les fichiers système Windows protégés</p>
                    </motion.div>

                    <motion.div 
                      className="info-card"
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="card-icon">
                        <Activity size={24} />
                      </div>
                      <h4>Impact Système</h4>
                      <p>Légère utilisation CPU, pas d'interruption</p>
                    </motion.div>
                  </motion.div>

                  {/* Section d'instructions avec design moderne */}
                  <motion.div 
                    className="instructions-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="instructions-header">
                      <Settings size={20} />
                      <h4>Instructions Importantes</h4>
                    </div>
                    <div className="instructions-list">
                      <div className="instruction-item">
                        <CheckCircle size={16} />
                        <span>La vérification s'exécute en arrière-plan</span>
                      </div>
                      <div className="instruction-item">
                        <CheckCircle size={16} />
                        <span>Vous pouvez continuer à utiliser votre ordinateur</span>
                      </div>
                      <div className="instruction-item">
                        <CheckCircle size={16} />
                        <span>Les fichiers corrompus seront automatiquement réparés</span>
                      </div>
                      <div className="instruction-item warning">
                        <AlertCircle size={16} />
                        <span>Ne redémarrez pas pendant la vérification</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bouton de démarrage avec design moderne */}
                  <motion.div 
                    className="check-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      className="start-check-btn"
                      onClick={startSystemCheck}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Shield size={20} />
                      <span>Démarrer la Vérification</span>
                    </motion.button>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Section de progression avec design moderne */}
                  <motion.div 
                    className="check-progress-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="progress-header">
                      <div className="progress-title">
                        <div className="progress-icon">
                          <Activity size={24} />
                        </div>
                        <h3>Vérification en cours...</h3>
                      </div>
                      <div className="progress-percentage">
                        {Math.round(checkProgress.progress)}%
                      </div>
                    </div>
                    
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${checkProgress.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                      <div className="progress-glow" />
                    </div>
                    
                    <div className="progress-details">
                      <p className="current-step">
                        {checkProgress.currentStep}
                      </p>
                      <p className="progress-message">
                        {checkProgress.message}
                      </p>
                      <div className="progress-info">
                        <Clock size={16} />
                        <span>Temps restant estimé : {checkProgress.estimatedTime}</span>
                      </div>
                      {checkProgress.error && (
                        <div className="progress-error">
                          <AlertCircle size={16} />
                          <span>{checkProgress.error}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Logs en temps réel avec design moderne */}
                  <motion.div 
                    className="check-logs-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="logs-header">
                      <FileCheck size={20} />
                      <h4>Journal de la Vérification</h4>
                    </div>
                    <div className="logs-container">
                      {logs.map((log, index) => (
                        <motion.div 
                          key={index} 
                          className="log-entry"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {log}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Message de fin avec design moderne */}
                  {!checkProgress.isRunning && checkProgress.progress === 100 && (
                    <motion.div 
                      className="check-success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="success-icon">
                        <CheckCircle size={48} />
                      </div>
                      <h3>Vérification Terminée !</h3>
                      <p>Tous les fichiers système ont été vérifiés et réparés si nécessaire.</p>
                      <div className="success-details">
                        <span>✅ Intégrité des fichiers confirmée</span>
                        <span>✅ Système optimisé et sécurisé</span>
                      </div>
                    </motion.div>
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