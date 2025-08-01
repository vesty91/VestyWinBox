import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, FolderOpen, CheckCircle, AlertCircle, X, Chrome, Globe } from 'lucide-react';
import './FavoritesModal.css';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BackupProgress {
  isRunning: boolean;
  progress: number;
  currentBrowser: string;
  message: string;
  error?: string;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose }) => {
  const [backupPath, setBackupPath] = useState<string>('D:\\BackupFavoris');
  const [selectedBrowsers, setSelectedBrowsers] = useState<{ chrome: boolean; edge: boolean }>({
    chrome: true,
    edge: true
  });
  const [backupProgress, setBackupProgress] = useState<BackupProgress>({
    isRunning: false,
    progress: 0,
    currentBrowser: '',
    message: ''
  });

  const handleSelectFolder = async () => {
    try {
      if (window.electronAPI && 'selectBackupFolder' in window.electronAPI) {
        const electronAPI = window.electronAPI as typeof window.electronAPI & { selectBackupFolder: () => Promise<{ success: boolean; folderPath?: string; error?: string }> };
        const result = await electronAPI.selectBackupFolder();
        if (result.success && result.folderPath) {
          setBackupPath(result.folderPath);
        }
      } else {
        const path = window.prompt('Chemin de destination:', backupPath);
        if (path) setBackupPath(path);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du dossier:', error);
    }
  };

  const handleStartBackup = async () => {
    if (!selectedBrowsers.chrome && !selectedBrowsers.edge) {
      alert('Veuillez sélectionner au moins un navigateur.');
      return;
    }

    setBackupProgress({
      isRunning: true,
      progress: 0,
      currentBrowser: '',
      message: 'Démarrage de la sauvegarde...'
    });

    try {
      const results = [];
      let progress = 0;

      if (selectedBrowsers.chrome) {
        setBackupProgress(prev => ({ ...prev, currentBrowser: 'Chrome', message: 'Sauvegarde Chrome...' }));
        const chromeBackup = `xcopy "%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Bookmarks" "${backupPath}\\Chrome" /y`;
        const result = await window.electronAPI?.executeSystemCommand('cmd.exe', ['/c', chromeBackup]);
        results.push({ browser: 'Chrome', success: result?.success || false, error: result?.error });
        progress += 50;
        setBackupProgress(prev => ({ ...prev, progress }));
      }

      if (selectedBrowsers.edge) {
        setBackupProgress(prev => ({ ...prev, currentBrowser: 'Edge', message: 'Sauvegarde Edge...' }));
        const edgeBackup = `xcopy "%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Bookmarks" "${backupPath}\\Edge" /y`;
        const result = await window.electronAPI?.executeSystemCommand('cmd.exe', ['/c', edgeBackup]);
        results.push({ browser: 'Edge', success: result?.success || false, error: result?.error });
        progress += 50;
        setBackupProgress(prev => ({ ...prev, progress }));
      }

      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;

      setBackupProgress({
        isRunning: false,
        progress: 100,
        currentBrowser: '',
        message: successCount === totalCount ? 'Sauvegarde terminée avec succès !' : 'Sauvegarde partielle'
      });

    } catch (error) {
      setBackupProgress({
        isRunning: false,
        progress: 0,
        currentBrowser: '',
        message: 'Erreur lors de la sauvegarde',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const handleClose = () => {
    if (!backupProgress.isRunning) {
      setBackupProgress({
        isRunning: false,
        progress: 0,
        currentBrowser: '',
        message: ''
      });
      onClose();
    }
  };

  const toggleBrowser = (browser: 'chrome' | 'edge') => {
    setSelectedBrowsers(prev => ({ ...prev, [browser]: !prev[browser] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="favorites-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="favorites-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="favorites-modal-header">
              <div className="favorites-modal-title">
                <Star className="favorites-icon" />
                <h2>Sauvegarder les Favoris</h2>
              </div>
              <button className="favorites-modal-close" onClick={handleClose} title="Fermer">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="favorites-modal-content">
              {!backupProgress.isRunning && backupProgress.progress === 0 ? (
                <>
                  {/* Configuration */}
                  <div className="favorites-config">
                    <h3>Configuration de la sauvegarde</h3>
                    
                    {/* Dossier de destination */}
                    <div className="path-section">
                      <label>Dossier de destination :</label>
                      <div className="path-input">
                        <input
                          type="text"
                          value={backupPath}
                          onChange={(e) => setBackupPath(e.target.value)}
                          placeholder="D:\BackupFavoris"
                        />
                        <button onClick={handleSelectFolder} className="select-folder-btn">
                          <FolderOpen size={16} />
                          Parcourir
                        </button>
                      </div>
                    </div>

                    {/* Sélection des navigateurs */}
                    <div className="browsers-section">
                      <label>Navigateurs à sauvegarder :</label>
                      <div className="browser-options">
                        <label className="browser-option">
                          <input
                            type="checkbox"
                            checked={selectedBrowsers.chrome}
                            onChange={() => toggleBrowser('chrome')}
                          />
                          <Chrome size={20} />
                          <span>Chrome</span>
                        </label>
                        <label className="browser-option">
                          <input
                            type="checkbox"
                            checked={selectedBrowsers.edge}
                            onChange={() => toggleBrowser('edge')}
                          />
                          <Globe size={20} />
                          <span>Edge</span>
                        </label>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="info-section">
                      <h4>Informations importantes :</h4>
                      <ul>
                        <li>Fermez les navigateurs avant la sauvegarde</li>
                        <li>Les favoris seront copiés dans des sous-dossiers séparés</li>
                        <li>Les fichiers existants seront remplacés</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bouton de démarrage */}
                  <button
                    className="start-backup-btn"
                    onClick={handleStartBackup}
                    disabled={!selectedBrowsers.chrome && !selectedBrowsers.edge}
                  >
                    <Star size={20} />
                    Démarrer la sauvegarde
                  </button>
                </>
              ) : (
                <>
                  {/* Progress */}
                  <div className="backup-progress">
                    <h3>Sauvegarde en cours...</h3>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${backupProgress.progress}%` }}
                      />
                    </div>
                    
                    <div className="progress-details">
                      <p className="current-browser">
                        {backupProgress.currentBrowser && `${backupProgress.currentBrowser}...`}
                      </p>
                      <p className="progress-message">{backupProgress.message}</p>
                    </div>

                    {backupProgress.error && (
                      <div className="error-message">
                        <AlertCircle size={16} />
                        <span>{backupProgress.error}</span>
                      </div>
                    )}
                  </div>

                  {/* Résultat */}
                  {!backupProgress.isRunning && backupProgress.progress === 100 && (
                    <div className="backup-result">
                      <CheckCircle size={48} className="success-icon" />
                      <h3>Sauvegarde terminée !</h3>
                      <p>Les favoris ont été sauvegardés dans :</p>
                      <code>{backupPath}</code>
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

export default FavoritesModal; 