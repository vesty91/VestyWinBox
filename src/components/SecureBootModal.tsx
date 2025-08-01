import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, CheckCircle, AlertCircle, X, Info, Zap } from 'lucide-react';
import './SecureBootModal.css';

interface SecureBootModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SecureBootStatus {
  isEnabled: boolean;
  isRunning: boolean;
  message: string;
  error?: string;
  details?: {
    secureBootEnabled: boolean;
    uefiMode: boolean;
    tpmVersion?: string;
    virtualizationEnabled?: boolean;
  };
  debugInfo?: {
    secureBootRaw?: string;
    uefiRaw?: string;
    tpmRaw?: string;
    virtualizationRaw?: string;
  };
}

const SecureBootModal: React.FC<SecureBootModalProps> = ({ isOpen, onClose }) => {
  const [secureBootStatus, setSecureBootStatus] = useState<SecureBootStatus>({
    isEnabled: false,
    isRunning: false,
    message: ''
  });

  const handleCheckSecureBoot = async () => {
    setSecureBootStatus({
      isEnabled: false,
      isRunning: true,
      message: 'Vérification du Secure Boot en cours...'
    });

    try {
      // Vérifier le Secure Boot avec plusieurs méthodes
      let isSecureBootEnabled = false;
      let secureBootOutput = '';
      let secureBootRaw = '';

      try {
        const secureBootResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
          '-Command', 'Confirm-SecureBootUEFI'
        ]);
        
        if (secureBootResult?.success) {
          secureBootOutput = secureBootResult.output || '';
          secureBootRaw = `Méthode 1: ${secureBootOutput}`;
          isSecureBootEnabled = secureBootOutput.includes('True');
        }
      } catch (error) {
        console.log('Méthode 1 échouée, tentative méthode 2...');
        secureBootRaw = 'Méthode 1: Échec';
      }

      // Méthode de fallback pour Secure Boot
      if (!secureBootOutput) {
        try {
          const fallbackResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
            '-Command', 'Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecureBoot\\State" -Name "UEFISecureBootEnabled" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty UEFISecureBootEnabled'
          ]);
          
          if (fallbackResult?.success && fallbackResult.output) {
            secureBootRaw += `\nMéthode 2: ${fallbackResult.output}`;
            isSecureBootEnabled = fallbackResult.output.trim() === '1';
          } else {
            secureBootRaw += '\nMéthode 2: Aucun résultat';
          }
        } catch (error) {
          console.log('Méthode 2 échouée, tentative méthode 3...');
          secureBootRaw += '\nMéthode 2: Échec';
        }
      }

      // Vérifier le mode UEFI avec plusieurs méthodes
      let isUefiMode = false;
      let uefiOutput = '';
      let uefiRaw = '';

      try {
        const uefiResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
          '-Command', 'Get-ComputerInfo | Select-Object -ExpandProperty BiosFirmwareType'
        ]);
        
        if (uefiResult?.success) {
          uefiOutput = uefiResult.output || '';
          uefiRaw = `Méthode 1: ${uefiOutput}`;
          isUefiMode = uefiOutput.includes('UEFI');
        }
      } catch (error) {
        console.log('Vérification UEFI méthode 1 échouée...');
        uefiRaw = 'Méthode 1: Échec';
      }

      // Méthode de fallback pour UEFI
      if (!uefiOutput) {
        try {
          const fallbackUefiResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
            '-Command', 'Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty BootupState'
          ]);
          
          if (fallbackUefiResult?.success && fallbackUefiResult.output) {
            uefiRaw += `\nMéthode 2: ${fallbackUefiResult.output}`;
            isUefiMode = fallbackUefiResult.output.includes('Normal boot');
          } else {
            uefiRaw += '\nMéthode 2: Aucun résultat';
          }
        } catch (error) {
          console.log('Vérification UEFI méthode 2 échouée...');
          uefiRaw += '\nMéthode 2: Échec';
        }
      }

      // Vérifier la version TPM
      let tpmVersion = undefined;
      let tpmRaw = '';
      try {
        const tpmResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
          '-Command', 'Get-WmiObject -Namespace "root\\CIMV2\\Security\\MicrosoftTpm" -Class "Win32_Tpm" | Select-Object -ExpandProperty SpecVersion'
        ]);
        
        if (tpmResult?.success && tpmResult.output) {
          tpmVersion = tpmResult.output.trim();
          tpmRaw = tpmResult.output;
        } else {
          tpmRaw = 'Aucun résultat';
        }
      } catch (error) {
        console.log('Vérification TPM échouée...');
        tpmRaw = 'Échec';
      }

      // Vérifier la virtualisation
      let virtualizationEnabled = false;
      let virtualizationRaw = '';
      try {
        const virtualizationResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
          '-Command', 'Get-ComputerInfo | Select-Object -ExpandProperty HyperVRequirementVirtualizationFirmwareEnabled'
        ]);
        
        if (virtualizationResult?.success) {
          virtualizationRaw = `Méthode 1: ${virtualizationResult.output || 'Aucun résultat'}`;
          virtualizationEnabled = virtualizationResult.output?.includes('True') || false;
        }
      } catch (error) {
        console.log('Vérification virtualisation échouée...');
        virtualizationRaw = 'Méthode 1: Échec';
      }

      // Méthode de fallback pour la virtualisation
      if (!virtualizationEnabled) {
        try {
          const fallbackVirtResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
            '-Command', 'Get-WmiObject -Class Msvm_VirtualSystemSettingData -Namespace "root\\virtualization\\v2" -ErrorAction SilentlyContinue'
          ]);
          
          if (fallbackVirtResult?.success) {
            virtualizationRaw += '\nMéthode 2: Virtualisation détectée';
            virtualizationEnabled = true;
          } else {
            virtualizationRaw += '\nMéthode 2: Aucun résultat';
          }
        } catch (error) {
          console.log('Vérification virtualisation méthode 2 échouée...');
          virtualizationRaw += '\nMéthode 2: Échec';
        }
      }

      setSecureBootStatus({
        isEnabled: isSecureBootEnabled,
        isRunning: false,
        message: isSecureBootEnabled ? 'Secure Boot est activé !' : 'Secure Boot n\'est pas activé ou non détecté.',
        details: {
          secureBootEnabled: isSecureBootEnabled,
          uefiMode: isUefiMode,
          tpmVersion,
          virtualizationEnabled
        },
        debugInfo: {
          secureBootRaw,
          uefiRaw,
          tpmRaw,
          virtualizationRaw
        }
      });

    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setSecureBootStatus({
        isEnabled: false,
        isRunning: false,
        message: 'Erreur lors de la vérification - Vérifiez les privilèges administrateur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const handleClose = () => {
    if (!secureBootStatus.isRunning) {
      setSecureBootStatus({
        isEnabled: false,
        isRunning: false,
        message: ''
      });
      onClose();
    }
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? '#10b981' : '#ef4444';
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? <CheckCircle size={20} /> : <AlertCircle size={20} />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="secureboot-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="secureboot-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="secureboot-modal-header">
              <div className="secureboot-modal-title">
                <Lock className="secureboot-icon" />
                <h2>Vérifier Secure Boot</h2>
              </div>
              <button className="secureboot-modal-close" onClick={handleClose} title="Fermer">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="secureboot-modal-content">
              {!secureBootStatus.isRunning && !secureBootStatus.details ? (
                <>
                  {/* Introduction */}
                  <div className="secureboot-intro">
                    <h3>Vérification du Secure Boot UEFI</h3>
                    <p className="intro-description">
                      Le Secure Boot est une fonctionnalité de sécurité UEFI qui empêche l'exécution de logiciels non signés au démarrage.
                    </p>
                    
                    <div className="info-cards">
                      <div className="info-card">
                        <Shield size={24} />
                        <h4>Sécurité</h4>
                        <p>Protège contre les rootkits et logiciels malveillants</p>
                      </div>
                      <div className="info-card">
                        <Zap size={24} />
                        <h4>Performance</h4>
                        <p>Démarrage plus rapide et sécurisé</p>
                      </div>
                      <div className="info-card">
                        <Lock size={24} />
                        <h4>Intégrité</h4>
                        <p>Vérifie l'authenticité du firmware</p>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="instructions-section">
                      <h4>⚠️ Informations importantes</h4>
                      <ul>
                        <li>Nécessite des privilèges administrateur</li>
                        <li>Fonctionne uniquement en mode UEFI</li>
                        <li>Peut nécessiter une activation dans le BIOS</li>
                        <li>Compatible Windows 8+ et Windows Server 2012+</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bouton de vérification */}
                  <button
                    className="check-secureboot-btn"
                    onClick={handleCheckSecureBoot}
                  >
                    <Lock size={20} />
                    Vérifier le Secure Boot
                  </button>
                </>
              ) : (
                <>
                  {/* Progress */}
                  {secureBootStatus.isRunning && (
                    <div className="secureboot-progress">
                      <h3>Vérification en cours...</h3>
                      <div className="progress-spinner">
                        <div className="spinner"></div>
                      </div>
                      <p className="progress-message">{secureBootStatus.message}</p>
                    </div>
                  )}

                  {/* Résultat */}
                  {!secureBootStatus.isRunning && secureBootStatus.details && (
                    <div className="secureboot-result">
                      <div className="result-header">
                        <div 
                          className="status-indicator"
                          style={{ color: getStatusColor(secureBootStatus.isEnabled) }}
                        >
                          {getStatusIcon(secureBootStatus.isEnabled)}
                        </div>
                        <h3>Résultat de la vérification</h3>
                        <p className="result-message">{secureBootStatus.message}</p>
                      </div>

                      {/* Détails */}
                      <div className="details-section">
                        <h4>Détails de la configuration</h4>
                        
                        <div className="detail-item">
                          <div className="detail-label">
                            <Shield size={16} />
                            <span>Secure Boot</span>
                          </div>
                          <div 
                            className="detail-value"
                            style={{ color: getStatusColor(secureBootStatus.details.secureBootEnabled) }}
                          >
                            {secureBootStatus.details.secureBootEnabled ? 'Activé' : 'Désactivé'}
                          </div>
                        </div>

                        <div className="detail-item">
                          <div className="detail-label">
                            <Zap size={16} />
                            <span>Mode Firmware</span>
                          </div>
                          <div 
                            className="detail-value"
                            style={{ color: getStatusColor(secureBootStatus.details.uefiMode) }}
                          >
                            {secureBootStatus.details.uefiMode ? 'UEFI' : 'Legacy BIOS'}
                          </div>
                        </div>

                        {secureBootStatus.details.tpmVersion && (
                          <div className="detail-item">
                            <div className="detail-label">
                              <Lock size={16} />
                              <span>Version TPM</span>
                            </div>
                            <div className="detail-value">
                              {secureBootStatus.details.tpmVersion}
                            </div>
                          </div>
                        )}

                        <div className="detail-item">
                          <div className="detail-label">
                            <Info size={16} />
                            <span>Virtualisation</span>
                          </div>
                          <div 
                            className="detail-value"
                            style={{ color: getStatusColor(secureBootStatus.details.virtualizationEnabled) }}
                          >
                            {secureBootStatus.details.virtualizationEnabled ? 'Activée' : 'Désactivée'}
                          </div>
                        </div>
                      </div>

                      {/* Recommandations */}
                      <div className="recommendations-section">
                        <h4>Recommandations</h4>
                        {!secureBootStatus.isEnabled ? (
                          <div className="recommendation-warning">
                            <AlertCircle size={20} />
                            <div>
                              <h5>Secure Boot désactivé</h5>
                              <p>Pour activer le Secure Boot :</p>
                              <ol>
                                <li>Redémarrez et accédez au BIOS/UEFI</li>
                                <li>Recherchez l'option "Secure Boot"</li>
                                <li>Activez-la et sauvegardez</li>
                                <li>Redémarrez Windows</li>
                              </ol>
                            </div>
                          </div>
                        ) : (
                          <div className="recommendation-success">
                            <CheckCircle size={20} />
                            <div>
                              <h5>Configuration sécurisée</h5>
                              <p>Votre système est correctement configuré avec le Secure Boot activé.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="result-actions">
                        <button onClick={handleClose} className="close-btn">
                          Fermer
                        </button>
                        <button 
                          onClick={handleCheckSecureBoot}
                          className="refresh-btn"
                        >
                          Vérifier à nouveau
                        </button>
                      </div>

                      {/* Debug Info */}
                      {secureBootStatus.debugInfo && (
                        <div className="debug-section">
                          <details>
                            <summary className="debug-summary">
                              🔍 Informations de diagnostic (cliquez pour voir)
                            </summary>
                            <div className="debug-content">
                              <div className="debug-item">
                                <strong>Secure Boot (brut):</strong>
                                <pre>{secureBootStatus.debugInfo.secureBootRaw || 'Aucune donnée'}</pre>
                              </div>
                              <div className="debug-item">
                                <strong>UEFI (brut):</strong>
                                <pre>{secureBootStatus.debugInfo.uefiRaw || 'Aucune donnée'}</pre>
                              </div>
                              <div className="debug-item">
                                <strong>TPM (brut):</strong>
                                <pre>{secureBootStatus.debugInfo.tpmRaw || 'Aucune donnée'}</pre>
                              </div>
                              <div className="debug-item">
                                <strong>Virtualisation (brut):</strong>
                                <pre>{secureBootStatus.debugInfo.virtualizationRaw || 'Aucune donnée'}</pre>
                              </div>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Erreur */}
                  {secureBootStatus.error && (
                    <div className="error-section">
                      <AlertCircle size={48} className="error-icon" />
                      <h3>Erreur lors de la vérification</h3>
                      <p>{secureBootStatus.error}</p>
                      <button onClick={handleCheckSecureBoot} className="retry-btn">
                        Réessayer
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

export default SecureBootModal; 