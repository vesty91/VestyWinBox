import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, CheckCircle, AlertCircle, X, Info, Clock, Shield } from 'lucide-react';
import './RestorePointModal.css';

interface RestorePointModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RestorePointStatus {
  isRunning: boolean;
  isCompleted: boolean;
  message: string;
  error?: string;
  restorePointId?: string;
  timestamp?: string;
}

const RestorePointModal: React.FC<RestorePointModalProps> = ({ isOpen, onClose }) => {
  const [restorePointStatus, setRestorePointStatus] = useState<RestorePointStatus>({
    isRunning: false,
    isCompleted: false,
    message: ''
  });

  const [description, setDescription] = useState('Point de restauration VestyWinBox');

  const handleCreateRestorePoint = async () => {
    if (!description.trim()) {
      alert('Veuillez entrer une description pour le point de restauration.');
      return;
    }

    setRestorePointStatus({
      isRunning: true,
      isCompleted: false,
      message: 'Création du point de restauration en cours...'
    });

    try {
      console.log('🔧 Création point de restauration:', description);
      
      const result = await window.electronAPI?.executeSystemCommand('powershell.exe', [
        '-Command', `Checkpoint-Computer -Description "${description}" -RestorePointType "MODIFY_SETTINGS"`
      ]);

      console.log('🔧 Résultat création:', result);

      if (result?.success) {
        const timestamp = new Date().toLocaleString('fr-FR');
        setRestorePointStatus({
          isRunning: false,
          isCompleted: true,
          message: 'Point de restauration créé avec succès !',
          restorePointId: `RP_${Date.now()}`,
          timestamp
        });
      } else {
        setRestorePointStatus({
          isRunning: false,
          isCompleted: false,
          message: 'Erreur lors de la création du point de restauration',
          error: result?.error || 'Erreur inconnue'
        });
      }
    } catch (error) {
      console.error('🔧 Erreur création point de restauration:', error);
      setRestorePointStatus({
        isRunning: false,
        isCompleted: false,
        message: 'Erreur lors de la création du point de restauration',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const handleClose = () => {
    if (!restorePointStatus.isRunning) {
      setRestorePointStatus({
        isRunning: false,
        isCompleted: false,
        message: ''
      });
      setDescription('Point de restauration VestyWinBox');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="restorepoint-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="restorepoint-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="restorepoint-modal-header">
              <div className="restorepoint-modal-title">
                <HardDrive className="restorepoint-icon" />
                <h2>Point de Restauration</h2>
              </div>
              <button className="restorepoint-modal-close" onClick={handleClose} title="Fermer">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="restorepoint-modal-content">
              {!restorePointStatus.isRunning && !restorePointStatus.isCompleted ? (
                <>
                  {/* Introduction */}
                  <div className="restorepoint-intro">
                    <h3>Créer un point de restauration système</h3>
                    <p className="intro-description">
                      Un point de restauration permet de revenir à un état précédent du système en cas de problème.
                    </p>
                    
                    <div className="info-cards">
                      <div className="info-card">
                        <Shield size={24} />
                        <h4>Sécurité</h4>
                        <p>Protection contre les modifications système</p>
                      </div>
                      <div className="info-card">
                        <Clock size={24} />
                        <h4>Récupération</h4>
                        <p>Retour rapide à un état stable</p>
                      </div>
                      <div className="info-card">
                        <HardDrive size={24} />
                        <h4>Données</h4>
                        <p>Vos fichiers personnels sont préservés</p>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="instructions-section">
                      <h4>⚠️ Informations importantes</h4>
                      <ul>
                        <li>Nécessite des privilèges administrateur</li>
                        <li>Création rapide (quelques secondes)</li>
                        <li>N'affecte pas vos fichiers personnels</li>
                        <li>Recommandé avant toute modification système</li>
                      </ul>
                    </div>
                  </div>

                  {/* Formulaire */}
                  <div className="form-section">
                    <label htmlFor="description" className="form-label">
                      Description du point de restauration :
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: Avant installation logiciel"
                      className="form-input"
                      maxLength={100}
                    />
                    <small className="form-help">
                      Décrivez brièvement pourquoi vous créez ce point de restauration
                    </small>
                  </div>

                  {/* Bouton de création */}
                  <button
                    className="create-restorepoint-btn"
                    onClick={handleCreateRestorePoint}
                    disabled={!description.trim()}
                  >
                    <HardDrive size={20} />
                    Créer le point de restauration
                  </button>
                </>
              ) : (
                <>
                  {/* Progress */}
                  {restorePointStatus.isRunning && (
                    <div className="restorepoint-progress">
                      <h3>Création en cours...</h3>
                      <div className="progress-spinner">
                        <div className="spinner"></div>
                      </div>
                      <p className="progress-message">{restorePointStatus.message}</p>
                      <div className="progress-info">
                        <Info size={16} />
                        <span>Cette opération prend généralement quelques secondes</span>
                      </div>
                    </div>
                  )}

                  {/* Résultat */}
                  {!restorePointStatus.isRunning && restorePointStatus.isCompleted && (
                    <div className="restorepoint-result">
                      <div className="result-header">
                        <div className="status-indicator success">
                          <CheckCircle size={48} />
                        </div>
                        <h3>Point de restauration créé !</h3>
                        <p className="result-message">{restorePointStatus.message}</p>
                      </div>

                      {/* Détails */}
                      <div className="details-section">
                        <h4>Détails du point de restauration</h4>
                        
                        <div className="detail-item">
                          <div className="detail-label">
                            <HardDrive size={16} />
                            <span>Description</span>
                          </div>
                          <div className="detail-value">
                            {description}
                          </div>
                        </div>

                        <div className="detail-item">
                          <div className="detail-label">
                            <Clock size={16} />
                            <span>Date de création</span>
                          </div>
                          <div className="detail-value">
                            {restorePointStatus.timestamp}
                          </div>
                        </div>

                        <div className="detail-item">
                          <div className="detail-label">
                            <Shield size={16} />
                            <span>Type</span>
                          </div>
                          <div className="detail-value">
                            Modification des paramètres
                          </div>
                        </div>
                      </div>

                      {/* Instructions de restauration */}
                      <div className="restore-instructions">
                        <h4>Comment utiliser ce point de restauration</h4>
                        <ol>
                          <li>Ouvrez "Protection du système" dans les Paramètres Windows</li>
                          <li>Cliquez sur "Restauration du système"</li>
                          <li>Sélectionnez ce point de restauration</li>
                          <li>Suivez les instructions pour restaurer</li>
                        </ol>
                      </div>

                      {/* Actions */}
                      <div className="result-actions">
                        <button onClick={handleClose} className="close-btn">
                          Fermer
                        </button>
                        <button 
                          onClick={() => {
                            setRestorePointStatus({
                              isRunning: false,
                              isCompleted: false,
                              message: ''
                            });
                            setDescription('Point de restauration VestyWinBox');
                          }}
                          className="create-another-btn"
                        >
                          Créer un autre point
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Erreur */}
                  {restorePointStatus.error && (
                    <div className="error-section">
                      <AlertCircle size={48} className="error-icon" />
                      <h3>Erreur lors de la création</h3>
                      <p>{restorePointStatus.error}</p>
                      <div className="error-help">
                        <h4>Solutions possibles :</h4>
                        <ul>
                          <li>Vérifiez que vous avez les privilèges administrateur</li>
                          <li>Assurez-vous que la protection système est activée</li>
                          <li>Redémarrez l'application en tant qu'administrateur</li>
                        </ul>
                      </div>
                      <button onClick={handleClose} className="retry-btn">
                        Fermer
                      </button>
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

export default RestorePointModal; 