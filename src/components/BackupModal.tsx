import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FolderOpen, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from './ui/toast';
import './BackupModal.css';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFolder, setCurrentFolder] = useState('');

  const userFolders = [
    { name: 'Bureau', path: 'Desktop' },
    { name: 'Images', path: 'Pictures' },
    { name: 'Documents', path: 'Documents' },
    { name: 'Vidéos', path: 'Videos' },
    { name: 'Téléchargements', path: 'Downloads' },
    { name: 'Musique', path: 'Music' }
  ];

  const selectBackupFolder = async () => {
    try {
      if (window.electronAPI?.selectBackupFolder) {
        const result = await window.electronAPI.selectBackupFolder();
        if (result.success && result.folderPath) {
          setSelectedFolder(result.folderPath);
          addToast({
            type: 'success',
            title: 'Dossier sélectionné',
            message: `Dossier de sauvegarde : ${result.folderPath}`,
            duration: 3000
          });
        } else {
          addToast({
            type: 'error',
            title: 'Erreur de sélection',
            message: 'Impossible de sélectionner le dossier de destination.',
            duration: 4000
          });
        }
      } else {
        addToast({
          type: 'error',
          title: 'API non disponible',
          message: 'L\'API Electron n\'est pas disponible.',
          duration: 4000
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la sélection du dossier.',
        duration: 4000
      });
    }
  };

  const startBackup = async () => {
    if (!selectedFolder) {
      addToast({
        type: 'warning',
        title: 'Dossier requis',
        message: 'Veuillez sélectionner un dossier de destination.',
        duration: 3000
      });
      return;
    }

    setIsBackingUp(true);
    setProgress(0);

    try {
      if (window.electronAPI?.backupUserFolders) {
        const result = await window.electronAPI.backupUserFolders(selectedFolder);
        
        if (result.success) {
          addToast({
            type: 'success',
            title: 'Sauvegarde terminée',
            message: 'Tous les dossiers ont été sauvegardés avec succès !',
            duration: 5000
          });
          onClose();
        } else {
          addToast({
            type: 'error',
            title: 'Erreur de sauvegarde',
            message: result.error || 'Une erreur est survenue lors de la sauvegarde.',
            duration: 5000
          });
        }
      } else {
        addToast({
          type: 'error',
          title: 'API non disponible',
          message: 'L\'API Electron n\'est pas disponible.',
          duration: 4000
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur inattendue est survenue.',
        duration: 4000
      });
    } finally {
      setIsBackingUp(false);
      setProgress(0);
      setCurrentFolder('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="backup-modal"
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
            {/* Header */}
            <motion.div 
              className="modal-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="header-content">
                <motion.div
                  className="header-icon"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20,
                    delay: 0.3 
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Save size={32} />
                </motion.div>
                <div className="header-text">
                  <h2>Sauvegarde des Dossiers Utilisateur</h2>
                  <p>Sauvegardez vos dossiers principaux en toute sécurité</p>
                </div>
              </div>
              <motion.button
                className="close-button"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <X size={24} />
              </motion.button>
            </motion.div>

            {/* Content */}
            <motion.div 
              className="modal-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Introduction */}
              <motion.div 
                className="intro-section"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3>Dossiers à sauvegarder :</h3>
                <p>Les dossiers suivants seront copiés dans le dossier de destination :</p>
              </motion.div>

              {/* Folders Grid */}
              <motion.div 
                className="folders-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {userFolders.map((folder, index) => (
                  <motion.div
                    key={folder.path}
                    className="folder-card"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 0.7 + index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="folder-icon">
                      <FolderOpen size={24} />
                    </div>
                    <div className="folder-info">
                      <h4>{folder.name}</h4>
                      <span>{folder.path}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Destination Selection */}
              <motion.div 
                className="destination-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3>Dossier de destination :</h3>
                <div className="destination-input">
                  <input
                    type="text"
                    value={selectedFolder}
                    placeholder="Sélectionnez un dossier de destination..."
                    readOnly
                    className="folder-input"
                  />
                  <motion.button
                    className="select-folder-btn"
                    onClick={selectBackupFolder}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <FolderOpen size={20} />
                    Parcourir
                  </motion.button>
                </div>
              </motion.div>

              {/* Progress Section */}
              <AnimatePresence>
                {isBackingUp && (
                  <motion.div 
                    className="progress-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="progress-header">
                      <h3>Sauvegarde en cours...</h3>
                      <span className="progress-percentage">{progress}%</span>
                    </div>
                    
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    {currentFolder && (
                      <p className="current-folder">En cours : {currentFolder}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="modal-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                className="cancel-btn"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                disabled={isBackingUp}
              >
                Annuler
              </motion.button>
              
              <motion.button
                className="backup-btn"
                onClick={startBackup}
                disabled={!selectedFolder || isBackingUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isBackingUp ? (
                  <>
                    <motion.div
                      className="loading-spinner"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Sauvegarde en cours...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Démarrer la sauvegarde
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackupModal; 