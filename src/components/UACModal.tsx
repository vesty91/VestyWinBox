import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Settings, CheckCircle, X, Info } from 'lucide-react';
import './UACModal.css';

interface UACModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UACModal: React.FC<UACModalProps> = ({ isOpen, onClose }) => {
  const [isDisabling, setIsDisabling] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRestartPrompt, setShowRestartPrompt] = useState(false);

  const handleDisableUAC = async () => {
    setIsDisabling(true);
    setError(null);

    try {
      if (window.electronAPI?.executeSystemCommand) {
        const result = await window.electronAPI.executeSystemCommand('cmd.exe', [
          '/c', 
          'reg add "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v "EnableLUA" /t REG_DWORD /d 0 /f'
        ]);

        if (result.success) {
          setIsSuccess(true);
          setShowRestartPrompt(true);
        } else {
          setError(result.error || 'Erreur inconnue lors de la désactivation de l\'UAC');
        }
      } else {
        setError('API Electron non disponible. Veuillez exécuter manuellement cette commande :\n\nreg add "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v "EnableLUA" /t REG_DWORD /d 0 /f');
      }
    } catch (err) {
      setError('Erreur lors de la désactivation de l\'UAC : ' + (err as Error).message);
    } finally {
      setIsDisabling(false);
    }
  };

  const handleRestart = async () => {
    try {
      if (window.electronAPI?.executeSystemCommand) {
        await window.electronAPI.executeSystemCommand('cmd.exe', [
          '/c', 
          'shutdown /r /t 5 /c "Redémarrage pour appliquer les changements UAC"'
        ]);
      } else {
        // Fallback
        window.open('shutdown /r /t 5', '_blank');
      }
    } catch (err) {
      console.error('Erreur lors du redémarrage:', err);
    }
  };

  const handleClose = () => {
    if (!isDisabling) {
      setIsSuccess(false);
      setError(null);
      setShowRestartPrompt(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="uac-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="uac-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="uac-modal-header">
              <div className="uac-modal-title">
                <div className="uac-icon">
                  <Shield size={32} />
                </div>
                <h2>Désactiver l'UAC</h2>
              </div>
              <button
                className="uac-modal-close"
                onClick={handleClose}
                disabled={isDisabling}
                title="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="uac-modal-content">
              {/* Intro Section */}
              <div className="intro-section">
                <div className="intro-header">
                  <Settings size={24} />
                  <h3>Contrôle de Compte Utilisateur (UAC)</h3>
                </div>
                <p>
                  L'UAC est une fonctionnalité de sécurité Windows qui demande confirmation 
                  avant d'autoriser les modifications système. La désactiver peut exposer 
                  votre système à des risques de sécurité.
                </p>
              </div>

              {/* Warning Section */}
              <div className="warning-section">
                <div className="warning-header">
                  <AlertTriangle size={24} />
                  <span>⚠️ ATTENTION - RISQUE DE SÉCURITÉ</span>
                </div>
                <p>
                  <strong>Désactiver l'UAC peut exposer votre système à des risques :</strong>
                </p>
                <ul>
                  <li>Programmes malveillants peuvent s'exécuter sans avertissement</li>
                  <li>Modifications système non autorisées</li>
                  <li>Vulnérabilités de sécurité accrues</li>
                  <li>Perte de protection contre les logiciels malveillants</li>
                </ul>
                <p>
                  <strong>Recommandation :</strong> Gardez l'UAC activé pour une meilleure sécurité.
                  Ne le désactivez que si vous comprenez parfaitement les risques.
                </p>
              </div>

              {/* Info Cards */}
              <div className="info-cards">
                <div className="info-card">
                  <div className="card-icon">
                    <Shield size={20} />
                  </div>
                  <h4>Protection</h4>
                  <p>L'UAC protège contre les modifications système non autorisées</p>
                </div>
                <div className="info-card">
                  <div className="card-icon">
                    <AlertTriangle size={20} />
                  </div>
                  <h4>Risques</h4>
                  <p>Désactiver l'UAC augmente les risques de sécurité</p>
                </div>
                <div className="info-card">
                  <div className="card-icon">
                    <Settings size={20} />
                  </div>
                  <h4>Redémarrage</h4>
                  <p>Un redémarrage sera nécessaire pour appliquer les changements</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="instructions-section">
                <h4>Ce qui va se passer :</h4>
                <ul>
                  <li>Modification du registre Windows pour désactiver l'UAC</li>
                  <li>Redémarrage automatique du système (optionnel)</li>
                  <li>L'UAC sera complètement désactivé après redémarrage</li>
                  <li>Vous pourrez réactiver l'UAC via les Paramètres Windows</li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="uac-actions">
                <button
                  className={`disable-uac-btn ${isDisabling ? 'loading' : ''} ${isSuccess ? 'success' : ''}`}
                  onClick={handleDisableUAC}
                  disabled={isDisabling || isSuccess}
                >
                  {isDisabling ? (
                    <>
                      <div className="spinner"></div>
                      Désactivation en cours...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle size={20} />
                      UAC Désactivé !
                    </>
                  ) : (
                    <>
                      <Shield size={20} />
                      Désactiver l'UAC (RISQUÉ)
                    </>
                  )}
                </button>
              </div>

              {/* Success Message */}
              {isSuccess && (
                <motion.div
                  className="success-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={24} />
                  <div>
                    <h4>UAC désactivé avec succès !</h4>
                    <p>
                      L'UAC a été désactivé dans le registre Windows. 
                      Un redémarrage est nécessaire pour appliquer les changements.
                    </p>
                    {showRestartPrompt && (
                      <div className="restart-prompt">
                        <p>Voulez-vous redémarrer maintenant ?</p>
                        <div className="restart-buttons">
                          <button
                            className="restart-now-btn"
                            onClick={handleRestart}
                          >
                            Redémarrer maintenant
                          </button>
                          <button
                            className="restart-later-btn"
                            onClick={() => setShowRestartPrompt(false)}
                          >
                            Plus tard
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle size={24} />
                  <div>
                    <h4>Erreur lors de la désactivation</h4>
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Note */}
              <div className="note-section">
                <div className="note-header">
                  <Info size={20} />
                  <span>Note importante</span>
                </div>
                <p>
                  Pour réactiver l'UAC plus tard, allez dans Paramètres Windows → 
                  Comptes → Options de connexion → Contrôle de compte utilisateur.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UACModal; 