import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, FileText, Download, Info, CheckCircle, AlertTriangle, X } from 'lucide-react';
import './BatteryReportModal.css';

interface BatteryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BatteryReportModal: React.FC<BatteryReportModalProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportPath, setReportPath] = useState<string>('');

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      if (window.electronAPI?.executeSystemCommand) {
        const result = await window.electronAPI.executeSystemCommand('cmd.exe', [
          '/c', 
          'powercfg /batteryreport /output "%USERPROFILE%\\Desktop\\battery-report.html"'
        ]);

        if (result.success) {
          setIsSuccess(true);
          setReportPath('%USERPROFILE%\\Desktop\\battery-report.html');
        } else {
          setError(result.error || 'Erreur inconnue lors de la génération du rapport batterie');
        }
      } else {
        setError('API Electron non disponible. Veuillez exécuter manuellement cette commande :\n\npowercfg /batteryreport /output "%USERPROFILE%\\Desktop\\battery-report.html"');
      }
    } catch (err) {
      setError('Erreur lors de la génération du rapport batterie : ' + (err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenReport = () => {
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(`file://${reportPath.replace('%USERPROFILE%', process.env.USERPROFILE || '')}`);
    } else {
      // Fallback pour ouvrir le fichier
      window.open(`file://${reportPath.replace('%USERPROFILE%', process.env.USERPROFILE || '')}`, '_blank');
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setIsSuccess(false);
      setError(null);
      setReportPath('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="battery-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="battery-modal"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="battery-modal-header">
              <div className="battery-modal-title">
                <div className="battery-icon">
                  <Battery size={32} />
                </div>
                <h2>Générer un rapport batterie</h2>
              </div>
              <button
                className="battery-modal-close"
                onClick={handleClose}
                disabled={isGenerating}
                title="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="battery-modal-content">
              {/* Intro Section */}
              <div className="intro-section">
                <div className="intro-header">
                  <Info size={24} />
                  <h3>Rapport de diagnostic batterie</h3>
                </div>
                <p>
                  Ce rapport détaillé analyse l'état de votre batterie et fournit des informations 
                  sur sa capacité, son cycle de vie, et ses performances. Idéal pour diagnostiquer 
                  les problèmes de batterie sur les ordinateurs portables.
                </p>
              </div>

              {/* Info Cards */}
              <div className="info-cards">
                <div className="info-card">
                  <div className="card-icon">
                    <Battery size={20} />
                  </div>
                  <h4>État de la batterie</h4>
                  <p>Capacité actuelle et capacité de conception</p>
                </div>
                <div className="info-card">
                  <div className="card-icon">
                    <FileText size={20} />
                  </div>
                  <h4>Rapport HTML</h4>
                  <p>Fichier détaillé avec graphiques et statistiques</p>
                </div>
                <div className="info-card">
                  <div className="card-icon">
                    <Download size={20} />
                  </div>
                  <h4>Sur le Bureau</h4>
                  <p>Rapport sauvegardé directement sur votre Bureau</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="instructions-section">
                <h4>Ce que contient le rapport :</h4>
                <ul>
                  <li>Informations détaillées sur la batterie</li>
                  <li>Historique des cycles de charge/décharge</li>
                  <li>Capacité de conception vs capacité actuelle</li>
                  <li>Graphiques de performance</li>
                  <li>Recommandations d'optimisation</li>
                  <li>Statistiques d'utilisation</li>
                </ul>
              </div>

              {/* Note */}
              <div className="note-section">
                <div className="note-header">
                  <Info size={20} />
                  <span>Note importante</span>
                </div>
                <p>
                  Ce rapport est particulièrement utile pour les ordinateurs portables. 
                  Sur les PC de bureau, le rapport peut être vide ou contenir des informations limitées.
                </p>
              </div>

              {/* Action Button */}
              <div className="battery-actions">
                <button
                  className={`generate-battery-btn ${isGenerating ? 'loading' : ''} ${isSuccess ? 'success' : ''}`}
                  onClick={handleGenerateReport}
                  disabled={isGenerating || isSuccess}
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner"></div>
                      Génération en cours...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle size={20} />
                      Rapport Généré !
                    </>
                  ) : (
                    <>
                      <Battery size={20} />
                      Générer le rapport batterie
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
                    <h4>Rapport batterie généré avec succès !</h4>
                    <p>
                      Le fichier "battery-report.html" a été créé sur votre Bureau. 
                      Ouvrez ce fichier dans votre navigateur pour voir les détails de votre batterie.
                    </p>
                    <button
                      className="open-report-btn"
                      onClick={handleOpenReport}
                    >
                      <FileText size={16} />
                      Ouvrir le rapport
                    </button>
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
                    <h4>Erreur lors de la génération</h4>
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

export default BatteryReportModal; 