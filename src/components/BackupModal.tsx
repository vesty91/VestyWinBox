import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FolderOpen, CheckCircle, AlertCircle, X } from 'lucide-react';
import './BackupModal.css';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BackupProgress {
  isRunning: boolean;
  progress: number;
  currentFolder: string;
  message: string;
  error?: string;
}

const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [backupProgress, setBackupProgress] = useState<BackupProgress>({
    isRunning: false,
    progress: 0,
    currentFolder: '',
    message: ''
  });

  const handleSelectFolder = async () => {
    try {
      if (window.electronAPI?.selectBackupFolder) {
        const result = await window.electronAPI.selectBackupFolder();
        if (result.success && result.folderPath) {
          setSelectedFolder(result.folderPath);
        } else {
          console.error('Erreur lors de la sélection du dossier:', result.error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du dossier:', error);
    }
  };

  const handleStartBackup = async () => {
    if (!selectedFolder) {
      alert('Veuillez sélectionner un dossier de destination');
      return;
    }

    setBackupProgress({
      isRunning: true,
      progress: 0,
      currentFolder: 'Préparation...',
      message: 'Démarrage de la sauvegarde...'
    });

    try {
      if (window.electronAPI?.backupUserFolders) {
        const result = await window.electronAPI.backupUserFolders(selectedFolder);
        
        if (result.success) {
          setBackupProgress({
            isRunning: false,
            progress: 100,
            currentFolder: 'Terminé',
            message: result.message || 'Sauvegarde terminée avec succès!'
          });
          
          // Fermer automatiquement après 3 secondes
          setTimeout(() => {
            onClose();
            setBackupProgress({
              isRunning: false,
              progress: 0,
              currentFolder: '',
              message: ''
            });
          }, 3000);
        } else {
          setBackupProgress({
            isRunning: false,
            progress: 0,
            currentFolder: 'Erreur',
            message: 'Erreur lors de la sauvegarde',
            error: result.error
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setBackupProgress({
        isRunning: false,
        progress: 0,
        currentFolder: 'Erreur',
        message: 'Erreur lors de la sauvegarde',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const foldersToBackup = [
    'Bureau',
    'Images', 
    'Documents',
    'Vidéos',
    'Téléchargements',
    'Musique'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="backup-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="backup-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="backup-modal-header">
              <div className="backup-modal-title">
                <Save className="backup-icon" />
                <h2>Sauvegarde des Dossiers Utilisateur</h2>
              </div>
              <button className="backup-modal-close" onClick={onClose} title="Fermer">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="backup-modal-content">
              {!backupProgress.isRunning && backupProgress.progress === 0 ? (
                <>
                  {/* Sélection du dossier */}
                  <div className="backup-section">
                    <h3>Dossier de destination</h3>
                    <div className="folder-selection">
                      <input
                        type="text"
                        value={selectedFolder}
                        placeholder="Sélectionnez un dossier de destination..."
                        readOnly
                        className="folder-input"
                      />
                      <button 
                        className="select-folder-btn"
                        onClick={handleSelectFolder}
                      >
                        <FolderOpen size={16} />
                        Parcourir
                      </button>
                    </div>
                  </div>

                  {/* Dossiers à sauvegarder */}
                  <div className="backup-section">
                    <h3>Dossiers qui seront sauvegardés :</h3>
                    <div className="folders-list">
                      {foldersToBackup.map((folder, index) => (
                        <motion.div
                          key={folder}
                          className="folder-item"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="folder-icon">📁</div>
                          <span>{folder}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Bouton de démarrage */}
                  <div className="backup-actions">
                    <button
                      className="start-backup-btn"
                      onClick={handleStartBackup}
                      disabled={!selectedFolder}
                    >
                      <Save size={16} />
                      Démarrer la Sauvegarde
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Barre de progression */}
                  <div className="backup-progress-section">
                    <div className="progress-header">
                      <h3>Sauvegarde en cours...</h3>
                      <span className="progress-percentage">
                        {Math.round(backupProgress.progress)}%
                      </span>
                    </div>
                    
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${backupProgress.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <div className="progress-details">
                      <p className="current-folder">
                        {backupProgress.currentFolder}
                      </p>
                      <p className="progress-message">
                        {backupProgress.message}
                      </p>
                      {backupProgress.error && (
                        <p className="progress-error">
                          <AlertCircle size={16} />
                          {backupProgress.error}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bouton de fermeture si terminé */}
                  {!backupProgress.isRunning && backupProgress.progress === 100 && (
                    <div className="backup-success">
                      <CheckCircle className="success-icon" />
                      <p>Sauvegarde terminée avec succès!</p>
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

export default BackupModal; 