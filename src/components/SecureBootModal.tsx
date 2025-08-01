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

    // Timeout pour éviter les boucles infinies
    const timeout = setTimeout(() => {
      setSecureBootStatus({
        isEnabled: false,
        isRunning: false,
        message: 'Timeout - Vérification trop longue',
        error: 'La vérification a pris trop de temps'
      });
    }, 15000); // 15 secondes

    try {
      console.log('🔍 Début de la vérification Secure Boot...');

      // Vérifier le Secure Boot avec une commande simple
      let isSecureBootEnabled = false;
      let secureBootRaw = '';

      try {
        console.log('🔍 Exécution de Confirm-SecureBootUEFI...');
        const secureBootResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
          '-Command', 'Confirm-SecureBootUEFI'
        ]);
        
        console.log('🔍 Résultat Secure Boot:', secureBootResult);
        
        if (secureBootResult?.success) {
          secureBootRaw = secureBootResult.output || '';
          isSecureBootEnabled = secureBootRaw.includes('True');
          console.log('🔍 Secure Boot enabled:', isSecureBootEnabled);
        } else {
          secureBootRaw = `Erreur: ${secureBootResult?.error || 'Commande échouée'}`;
          console.log('🔍 Erreur Secure Boot:', secureBootRaw);
        }
      } catch (error) {
        secureBootRaw = `Exception: ${error}`;
        console.log('🔍 Exception Secure Boot:', error);
      }

      // Vérifier le mode UEFI avec une commande plus simple
      let isUefiMode = false;
      let uefiRaw = '';

      try {
        console.log('🔍 Exécution de Get-ComputerInfo...');
        const uefiResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
          '-Command', 'Get-ComputerInfo'
        ]);
        
        console.log('🔍 Résultat UEFI:', uefiResult);
        
        if (uefiResult?.success) {
          uefiRaw = uefiResult.output || '';
          // Chercher spécifiquement les informations de firmware
          isUefiMode = uefiRaw.includes('UEFI') || uefiRaw.includes('Uefi');
          console.log('🔍 UEFI mode:', isUefiMode);
        } else {
          uefiRaw = `Erreur: ${uefiResult?.error || 'Commande échouée'}`;
          console.log('🔍 Erreur UEFI:', uefiRaw);
        }
      } catch (error) {
        uefiRaw = `Exception: ${error}`;
        console.log('🔍 Exception UEFI:', error);
      }

      // Vérifier la version TPM avec la bonne commande
      let tpmVersion = undefined;
      let tpmRaw = '';
      
      try {
        console.log('🔍 Exécution de Get-Tpm...');
        const tpmResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
          '-Command', 'Get-Tpm'
        ]);
        
        console.log('🔍 Résultat TPM:', tpmResult);
        
        if (tpmResult?.success && tpmResult.output) {
          tpmRaw = tpmResult.output;
          // Extraire la version TPM de la sortie
          const versionMatch = tpmResult.output.match(/ManufacturerVersion\s*:\s*([^\r\n]+)/);
          if (versionMatch) {
            tpmVersion = versionMatch[1].trim();
          }
          console.log('🔍 TPM version:', tpmVersion);
        } else {
          tpmRaw = `Erreur: ${tpmResult?.error || 'Aucun résultat'}`;
          console.log('🔍 Erreur TPM:', tpmRaw);
        }
      } catch (error) {
        tpmRaw = `Exception: ${error}`;
        console.log('🔍 Exception TPM:', error);
      }

      // Vérifier la virtualisation avec une commande simple
      let virtualizationEnabled = false;
      let virtualizationRaw = '';
      
      try {
        console.log('🔍 Exécution de Get-ComputerInfo Virtualization...');
        const virtualizationResult = await window.electronAPI?.executeSystemCommand('powershell.exe', [
          '-Command', 'Get-ComputerInfo'
        ]);
        
        console.log('🔍 Résultat Virtualization:', virtualizationResult);
        
        if (virtualizationResult?.success) {
          virtualizationRaw = virtualizationResult.output || 'Aucun résultat';
          // Chercher les informations de virtualisation dans la sortie complète
          virtualizationEnabled = virtualizationResult.output?.includes('Virtualization') || false;
          console.log('🔍 Virtualization enabled:', virtualizationEnabled);
        } else {
          virtualizationRaw = `Erreur: ${virtualizationResult?.error || 'Commande échouée'}`;
          console.log('🔍 Erreur Virtualization:', virtualizationRaw);
        }
      } catch (error) {
        virtualizationRaw = `Exception: ${error}`;
        console.log('🔍 Exception Virtualization:', error);
      }

      // Annuler le timeout
      clearTimeout(timeout);

      console.log('🔍 Vérification terminée, mise à jour du statut...');

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
      // Annuler le timeout
      clearTimeout(timeout);
      
      console.error('🔍 Erreur générale lors de la vérification:', error);
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
                            style={{ color: getStatusColor(secureBootStatus.details.virtualizationEnabled || false) }}
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

                      {/* Section diagnostic toujours visible après vérification */}
                      {!secureBootStatus.isRunning && (
                        <div className="debug-section">
                          <details>
                            <summary className="debug-summary">
                              🔍 Informations de diagnostic (cliquez pour voir)
                            </summary>
                            <div className="debug-content">
                              <div className="debug-item">
                                <strong>Secure Boot (brut):</strong>
                                <pre>{secureBootStatus.debugInfo?.secureBootRaw || 'Aucune donnée'}</pre>
                              </div>
                              <div className="debug-item">
                                <strong>UEFI (brut):</strong>
                                <pre>{secureBootStatus.debugInfo?.uefiRaw || 'Aucune donnée'}</pre>
                              </div>
                              <div className="debug-item">
                                <strong>TPM (brut):</strong>
                                <pre>{secureBootStatus.debugInfo?.tpmRaw || 'Aucune donnée'}</pre>
                              </div>
                              <div className="debug-item">
                                <strong>Virtualisation (brut):</strong>
                                <pre>{secureBootStatus.debugInfo?.virtualizationRaw || 'Aucune donnée'}</pre>
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