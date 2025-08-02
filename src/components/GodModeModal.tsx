import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Settings, CheckCircle, AlertTriangle, X } from 'lucide-react';
import './GodModeModal.css';

interface GodModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GodModeModal: React.FC<GodModeModalProps> = ({ isOpen, onClose }) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivateGodMode = async () => {
    setIsActivating(true);
    setError(null);

    try {
      if (window.electronAPI?.executeSystemCommand) {
        const result = await window.electronAPI.executeSystemCommand('cmd.exe', [
          '/c', 
          'md "%USERPROFILE%\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"'
        ]);

        if (result.success) {
          setIsSuccess(true);
        } else {
          setError(result.error || 'Erreur inconnue lors de l\'activation du GodMode');
        }
      } else {
        setError('API Electron non disponible. Veuillez exécuter manuellement cette commande :\n\nmd "%USERPROFILE%\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"');
      }
    } catch (err) {
      setError('Erreur lors de l\'activation du GodMode : ' + (err as Error).message);
    } finally {
      setIsActivating(false);
    }
  };

  const handleClose = () => {
    if (!isActivating) {
      setIsSuccess(false);
      setError(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="godmode-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="godmode-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="godmode-modal-header">
              <div className="godmode-modal-title">
                <div className="godmode-icon">
                  <Zap size={32} />
                </div>
                <h2>Activer le GodMode</h2>
              </div>
              <button
                className="godmode-modal-close"
                onClick={handleClose}
                disabled={isActivating}
                title="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="godmode-modal-content">
              {/* Intro Section */}
              <div className="intro-section">
                <div className="intro-header">
                  <Shield size={24} />
                  <h3>Qu'est-ce que le GodMode ?</h3>
                </div>
                <p>
                  Le GodMode est un raccourci spécial qui donne accès à toutes les options de configuration Windows avancées 
                  dans une seule fenêtre organisée. C'est un outil puissant pour les administrateurs système.
                </p>
              </div>

              {/* Info Cards */}
              <div className="info-cards">
                <div className="info-card">
                  <div className="card-icon">
                    <Settings size={20} />
                  </div>
                  <h4>Accès Complet</h4>
                  <p>Plus de 200 paramètres système accessibles en un clic</p>
                </div>
                <div className="info-card">
                  <div className="card-icon">
                    <Shield size={20} />
                  </div>
                  <h4>Sécurisé</h4>
                  <p>Nécessite des privilèges administrateur pour certaines options</p>
                </div>
                <div className="info-card">
                  <div className="card-icon">
                    <Zap size={20} />
                  </div>
                  <h4>Rapide</h4>
                  <p>Interface organisée et recherche intégrée</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="instructions-section">
                <h4>Instructions :</h4>
                <ul>
                  <li>Un raccourci "GodMode" sera créé sur votre Bureau</li>
                  <li>Double-cliquez sur ce raccourci pour ouvrir le panneau</li>
                  <li>Naviguez dans les catégories pour trouver les paramètres</li>
                  <li>Utilisez la barre de recherche pour trouver rapidement une option</li>
                </ul>
              </div>

              {/* Warning */}
              <div className="warning-section">
                <div className="warning-header">
                  <AlertTriangle size={20} />
                  <span>Attention</span>
                </div>
                <p>
                  Certaines options peuvent modifier des paramètres système critiques. 
                  Assurez-vous de comprendre les conséquences avant de modifier des paramètres.
                </p>
              </div>

              {/* Action Button */}
              <div className="godmode-actions">
                <button
                  className={`activate-godmode-btn ${isActivating ? 'loading' : ''} ${isSuccess ? 'success' : ''}`}
                  onClick={handleActivateGodMode}
                  disabled={isActivating || isSuccess}
                >
                  {isActivating ? (
                    <>
                      <div className="spinner"></div>
                      Activation en cours...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle size={20} />
                      GodMode Activé !
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Activer le GodMode
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
                    <h4>GodMode activé avec succès !</h4>
                    <p>
                      Le raccourci "GodMode" a été créé sur votre Bureau. 
                      Double-cliquez dessus pour accéder à toutes les options de configuration Windows.
                    </p>
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
                    <h4>Erreur lors de l'activation</h4>
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GodModeModal; 