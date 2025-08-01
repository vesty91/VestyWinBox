import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, AlertCircle, X, RefreshCw, Package, Zap, Info } from 'lucide-react';
import './UpdateModal.css';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SoftwareInfo {
  id: string;
  name: string;
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  category: string;
  type: 'portable' | 'installer';
  path: string;
  downloadUrl?: string;
  changelog?: string;
  size?: string;
  status: 'idle' | 'checking' | 'updating' | 'completed' | 'error';
  error?: string;
}

interface UpdateProgress {
  isRunning: boolean;
  currentStep: string;
  message: string;
  totalSoftware: number;
  checkedSoftware: number;
  updatedSoftware: number;
  failedSoftware: number;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose }) => {
  const [softwareList, setSoftwareList] = useState<SoftwareInfo[]>([]);
  const [updateProgress, setUpdateProgress] = useState<UpdateProgress>({
    isRunning: false,
    currentStep: '',
    message: '',
    totalSoftware: 0,
    checkedSoftware: 0,
    updatedSoftware: 0,
    failedSoftware: 0
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([]);

  // Simuler la découverte des logiciels
  useEffect(() => {
    if (isOpen) {
      discoverSoftware();
    }
  }, [isOpen]);

  const discoverSoftware = async () => {
    addLog('🔍 Découverte des logiciels et applications...');
    
    // Simulation de la découverte des logiciels
    const discoveredSoftware: SoftwareInfo[] = [
      {
        id: 'chrome',
        name: 'Google Chrome',
        currentVersion: '120.0.6099.109',
        latestVersion: '120.0.6099.130',
        updateAvailable: true,
        category: 'Navigateurs',
        type: 'installer',
        path: 'assets/tools/logiciels/navigateurs/',
        downloadUrl: 'https://dl.google.com/chrome/install/latest/chrome_installer.exe',
        changelog: 'Corrections de sécurité et améliorations de performance',
        size: '85.2 MB',
        status: 'idle'
      },
      {
        id: 'firefox',
        name: 'Mozilla Firefox',
        currentVersion: '121.0',
        latestVersion: '121.0.1',
        updateAvailable: true,
        category: 'Navigateurs',
        type: 'portable',
        path: 'assets/tools/Apps portable/Internet/',
        downloadUrl: 'https://download.mozilla.org/?product=firefox-latest&os=win64&lang=fr',
        changelog: 'Corrections de bugs et améliorations de stabilité',
        size: '45.8 MB',
        status: 'idle'
      },
      {
        id: '7zip',
        name: '7-Zip',
        currentVersion: '23.01',
        latestVersion: '23.02',
        updateAvailable: true,
        category: 'Compression',
        type: 'portable',
        path: 'assets/tools/Apps portable/Gestion de fichiers & compression/',
        downloadUrl: 'https://7-zip.org/a/7z2302-x64.exe',
        changelog: 'Nouvelles fonctionnalités de compression',
        size: '1.5 MB',
        status: 'idle'
      },
      {
        id: 'notepadpp',
        name: 'Notepad++',
        currentVersion: '8.6.2',
        latestVersion: '8.6.3',
        updateAvailable: true,
        category: 'Éditeurs de code',
        type: 'portable',
        path: 'assets/tools/logiciels/Éditeurs de code & Développement/',
        downloadUrl: 'https://github.com/notepad-plus-plus/notepad-plus-plus/releases/latest/download/npp.8.6.3.Installer.x64.exe',
        changelog: 'Corrections de bugs et améliorations',
        size: '4.2 MB',
        status: 'idle'
      },
      {
        id: 'vlc',
        name: 'VLC Media Player',
        currentVersion: '3.0.18',
        latestVersion: '3.0.20',
        updateAvailable: true,
        category: 'Multimédia',
        type: 'portable',
        path: 'assets/tools/Apps portable/Graphisme & multimédia/',
        downloadUrl: 'https://get.videolan.org/vlc/last/win64/vlc-3.0.20-win64.exe',
        changelog: 'Support de nouveaux formats et corrections',
        size: '32.1 MB',
        status: 'idle'
      },
      {
        id: 'ccleaner',
        name: 'CCleaner',
        currentVersion: '6.12',
        latestVersion: '6.13',
        updateAvailable: true,
        category: 'Maintenance',
        type: 'portable',
        path: 'assets/tools/Apps portable/Maintenance système/',
        downloadUrl: 'https://download.ccleaner.com/ccsetup613.exe',
        changelog: 'Améliorations de performance et sécurité',
        size: '15.7 MB',
        status: 'idle'
      }
    ];

    setSoftwareList(discoveredSoftware);
    setUpdateProgress(prev => ({
      ...prev,
      totalSoftware: discoveredSoftware.length
    }));

    addLog(`✅ ${discoveredSoftware.length} logiciels découverts`);
    
    // Simuler la vérification des mises à jour
    await checkForUpdates(discoveredSoftware);
  };

  const checkForUpdates = async (software: SoftwareInfo[]) => {
    addLog('🔄 Vérification des mises à jour disponibles...');
    setUpdateProgress(prev => ({
      ...prev,
      isRunning: true,
      currentStep: 'Vérification des mises à jour',
      message: 'Connexion aux serveurs de mise à jour...'
    }));

    for (let i = 0; i < software.length; i++) {
      const item = software[i];
      
      setUpdateProgress(prev => ({
        ...prev,
        currentStep: `Vérification : ${item.name}`,
        message: `Connexion à ${item.name}...`,
        checkedSoftware: i + 1
      }));

      addLog(`📋 Vérification de ${item.name} (${item.currentVersion})...`);

      // Simuler la vérification
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (item.updateAvailable) {
        addLog(`🆕 ${item.name} : Mise à jour disponible (${item.latestVersion})`);
      } else {
        addLog(`✅ ${item.name} : À jour`);
      }
    }

    setUpdateProgress(prev => ({
      ...prev,
      isRunning: false,
      currentStep: 'Vérification terminée',
      message: 'Toutes les vérifications sont terminées'
    }));

    addLog('✅ Vérification des mises à jour terminée');
  };

  const toggleSoftwareSelection = (id: string) => {
    setSelectedSoftware(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    const updatableSoftware = softwareList.filter(software => software.updateAvailable);
    setSelectedSoftware(updatableSoftware.map(software => software.id));
  };

  const deselectAll = () => {
    setSelectedSoftware([]);
  };

  const updateSelectedSoftware = async () => {
    if (selectedSoftware.length === 0) {
      alert('Veuillez sélectionner au moins un logiciel à mettre à jour.');
      return;
    }

    setUpdateProgress({
      isRunning: true,
      currentStep: 'Démarrage des mises à jour',
      message: 'Préparation des téléchargements...',
      totalSoftware: selectedSoftware.length,
      checkedSoftware: 0,
      updatedSoftware: 0,
      failedSoftware: 0
    });

    addLog('🚀 Démarrage des mises à jour sélectionnées...');

    for (let i = 0; i < selectedSoftware.length; i++) {
      const softwareId = selectedSoftware[i];
      const software = softwareList.find(s => s.id === softwareId);
      
      if (!software) continue;

      setUpdateProgress(prev => ({
        ...prev,
        currentStep: `Mise à jour : ${software.name}`,
        message: `Téléchargement de ${software.name}...`,
        checkedSoftware: i + 1
      }));

      // Mettre à jour le statut du logiciel
      setSoftwareList(prev => 
        prev.map(s => 
          s.id === softwareId 
            ? { ...s, status: 'updating' }
            : s
        )
      );

      addLog(`📥 Téléchargement de ${software.name} (${software.latestVersion})...`);

      try {
        if (window.electronAPI?.executeSystemCommand) {
          // Simuler le téléchargement et l'installation
          await simulateUpdate(software);
          
          setSoftwareList(prev => 
            prev.map(s => 
              s.id === softwareId 
                ? { ...s, status: 'completed', currentVersion: s.latestVersion }
                : s
            )
          );

          setUpdateProgress(prev => ({
            ...prev,
            updatedSoftware: prev.updatedSoftware + 1
          }));

          addLog(`✅ ${software.name} : Mise à jour terminée avec succès`);
        } else {
          throw new Error('API Electron non disponible');
        }
      } catch (error) {
        setSoftwareList(prev => 
          prev.map(s => 
            s.id === softwareId 
              ? { ...s, status: 'error', error: error.toString() }
              : s
          )
        );

        setUpdateProgress(prev => ({
          ...prev,
          failedSoftware: prev.failedSoftware + 1
        }));

        addLog(`❌ ${software.name} : Erreur lors de la mise à jour - ${error}`);
      }

      // Pause entre les mises à jour
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setUpdateProgress(prev => ({
      ...prev,
      isRunning: false,
      currentStep: 'Mises à jour terminées',
      message: `Terminé : ${prev.updatedSoftware} réussies, ${prev.failedSoftware} échouées`
    }));

    addLog('🎉 Processus de mise à jour terminé');
    
    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
      onClose();
    }, 5000);
  };

  const simulateUpdate = async (software: SoftwareInfo) => {
    // Simuler les étapes de mise à jour
    const steps = [
      'Téléchargement en cours...',
      'Vérification de l\'intégrité...',
      'Sauvegarde de l\'ancienne version...',
      'Installation de la nouvelle version...',
      'Configuration...',
      'Nettoyage...'
    ];

    for (const step of steps) {
      addLog(`  └─ ${step}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleClose = () => {
    if (!updateProgress.isRunning) {
      onClose();
      // Reset state
      setSoftwareList([]);
      setUpdateProgress({
        isRunning: false,
        currentStep: '',
        message: '',
        totalSoftware: 0,
        checkedSoftware: 0,
        updatedSoftware: 0,
        failedSoftware: 0
      });
      setLogs([]);
      setSelectedSoftware([]);
    }
  };

  const updatableSoftware = softwareList.filter(software => software.updateAvailable);
  const selectedCount = selectedSoftware.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="update-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="update-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="update-modal-header">
              <div className="update-modal-title">
                <Download className="update-icon" />
                <h2>Mise à Jour des Logiciels</h2>
              </div>
              {!updateProgress.isRunning && (
                <button className="update-modal-close" onClick={handleClose} title="Fermer">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="update-modal-content">
              {!updateProgress.isRunning && softwareList.length > 0 ? (
                <>
                  {/* Résumé */}
                  <div className="update-summary">
                    <div className="summary-stats">
                      <div className="stat-item">
                        <Package size={20} />
                        <span>Total : {softwareList.length}</span>
                      </div>
                      <div className="stat-item">
                        <RefreshCw size={20} />
                        <span>Mises à jour : {updatableSoftware.length}</span>
                      </div>
                      <div className="stat-item">
                        <CheckCircle size={20} />
                        <span>À jour : {softwareList.length - updatableSoftware.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Liste des logiciels */}
                  <div className="software-list-section">
                    <div className="list-header">
                      <h3>Logiciels et Applications</h3>
                      <div className="list-actions">
                        <button onClick={selectAll} className="select-all-btn">
                          Tout sélectionner
                        </button>
                        <button onClick={deselectAll} className="deselect-all-btn">
                          Tout désélectionner
                        </button>
                      </div>
                    </div>
                    
                    <div className="software-list">
                      {softwareList.map((software) => (
                        <div
                          key={software.id}
                          className={`software-item ${software.status} ${software.updateAvailable ? 'updatable' : ''}`}
                        >
                          <div className="software-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedSoftware.includes(software.id)}
                              onChange={() => toggleSoftwareSelection(software.id)}
                              disabled={!software.updateAvailable || updateProgress.isRunning}
                              title={software.updateAvailable ? `Mettre à jour ${software.name}` : `${software.name} est à jour`}
                            />
                          </div>
                          
                          <div className="software-icon">
                            <Package size={20} />
                          </div>
                          
                          <div className="software-info">
                            <div className="software-header">
                              <h4>{software.name}</h4>
                              <span className={`software-type ${software.type}`}>
                                {software.type === 'portable' ? 'Portable' : 'Installer'}
                              </span>
                            </div>
                            <p className="software-category">{software.category}</p>
                            <div className="software-versions">
                              <span className="current-version">Actuel : {software.currentVersion}</span>
                              {software.updateAvailable && (
                                <span className="latest-version">Nouveau : {software.latestVersion}</span>
                              )}
                            </div>
                            {software.changelog && (
                              <p className="software-changelog">{software.changelog}</p>
                            )}
                          </div>
                          
                          <div className="software-status">
                            {software.status === 'updating' && <RefreshCw className="spinning" size={16} />}
                            {software.status === 'completed' && <CheckCircle size={16} />}
                            {software.status === 'error' && <AlertCircle size={16} />}
                            {software.updateAvailable && software.status === 'idle' && <Zap size={16} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="update-actions">
                    <button
                      className="update-all-btn"
                      onClick={updateSelectedSoftware}
                      disabled={selectedCount === 0 || updateProgress.isRunning}
                    >
                      <Download size={16} />
                      Mettre à Jour ({selectedCount} sélectionnés)
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Progression */}
                  <div className="update-progress-section">
                    <div className="progress-header">
                      <h3>{updateProgress.currentStep}</h3>
                      <span className="progress-stats">
                        {updateProgress.checkedSoftware}/{updateProgress.totalSoftware}
                      </span>
                    </div>
                    
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${(updateProgress.checkedSoftware / updateProgress.totalSoftware) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <div className="progress-details">
                      <p className="progress-message">{updateProgress.message}</p>
                      <div className="progress-stats">
                        <span>✅ Réussies : {updateProgress.updatedSoftware}</span>
                        <span>❌ Échouées : {updateProgress.failedSoftware}</span>
                      </div>
                    </div>
                  </div>

                  {/* Logs */}
                  <div className="update-logs-section">
                    <h3>Journal des mises à jour</h3>
                    <div className="logs-container">
                      {logs.map((log, index) => (
                        <div key={index} className="log-entry">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message de fin */}
                  {!updateProgress.isRunning && updateProgress.updatedSoftware > 0 && (
                    <div className="update-success">
                      <CheckCircle className="success-icon" />
                      <p>Mises à jour terminées avec succès!</p>
                      <p className="success-details">
                        {updateProgress.updatedSoftware} logiciels mis à jour, {updateProgress.failedSoftware} échecs.
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

export default UpdateModal; 