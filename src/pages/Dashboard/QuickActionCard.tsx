import React, { useState } from 'react';
import { LucideIcon, Play, Copy } from 'lucide-react';
import { SystemService } from '../../services/SystemService';

interface QuickActionCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  action: string;
  winSatScore?: string | null;
  onBenchmarkScore?: (score: string | null) => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  action,
  winSatScore,
  onBenchmarkScore
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      let result;
      let logEntry = null;
      switch (action) {
        case 'clean':
          result = await SystemService.executeSystemCommand('cleanmgr');
          logEntry = {
            type: 'clean',
            title: 'Nettoyage système',
            message: result.success ? 'Nettoyage du disque lancé.' : (result.error || 'Erreur lors du nettoyage'),
            date: new Date().toISOString(),
            success: result.success
          };
          break;
        case 'disk':
          result = await SystemService.executeSystemCommand('chkdsk');
          logEntry = {
            type: 'disk',
            title: 'Analyse Disque',
            message: result.success ? (result.output?.slice(0, 200) || 'Analyse disque lancée.') : (result.error || 'Erreur lors de l\'analyse disque'),
            date: new Date().toISOString(),
            success: result.success
          };
          break;
        case 'scan':
          result = await SystemService.executeSystemCommand('sfc', ['/scannow']);
          logEntry = {
            type: 'scan',
            title: 'Scan Système',
            message: result.success ? 'Scan système terminé.' : (result.error || 'Erreur lors du scan'),
            date: new Date().toISOString(),
            success: result.success
          };
          break;
        case 'update':
          result = await SystemService.executeSystemCommand('powershell', ['-Command', 'Start-Process', 'ms-settings:windowsupdate']);
          logEntry = {
            type: 'update',
            title: 'Mises à jour',
            message: result.success ? 'Fenêtre de mise à jour Windows ouverte.' : (result.error || 'Erreur lors de la recherche de mises à jour'),
            date: new Date().toISOString(),
            success: result.success
          };
          break;
        case 'security':
          result = await SystemService.executeSystemCommand('powershell', ['-Command', 'Start-Process', 'windowsdefender:']);
          logEntry = {
            type: 'security',
            title: 'Sécurité',
            message: result.success ? 'Centre de sécurité Windows ouvert.' : (result.error || 'Erreur lors de l\'ouverture du centre de sécurité'),
            date: new Date().toISOString(),
            success: result.success
          };
          break;
        case 'benchmark': {
          result = await SystemService.executeSystemCommand('winsat', ['formal']);
          let score = null;
          if (result.success) {
            // Attendre 5 secondes puis essayer de lire le score, réessayer 3 fois si besoin
            for (let i = 0; i < 3; i++) {
              await new Promise(res => setTimeout(res, i === 0 ? 5000 : 2000));
              score = await SystemService.getWinSATScore();
              if (score) break;
            }
          }
          const scoreText = result.success && score
            ? `Score global : ${score.base}\nCPU : ${score.cpu} | RAM : ${score.memory} | Disque : ${score.disk} | Graphique : ${score.graphics} | Gaming : ${score.gaming}`
            : null;
          if (onBenchmarkScore) onBenchmarkScore(scoreText);
          // Ajout à l'historique si benchmark réussi
          if (result.success && score) {
            await SystemService.addBenchmarkHistory({
              date: new Date().toISOString(),
              base: score.base,
              cpu: score.cpu,
              memory: score.memory,
              disk: score.disk,
              graphics: score.graphics,
              gaming: score.gaming
            });
          }
          logEntry = {
            type: 'benchmark',
            title: 'Benchmark système',
            message: scoreText || (result.error || 'Erreur lors du benchmark ou score non trouvé'),
            date: new Date().toISOString(),
            success: result.success && !!score
          };
          break;
        }
        default:
          logEntry = {
            type: action,
            title,
            message: `${title} exécuté.`,
            date: new Date().toISOString(),
            success: true
          };
      }
      if (logEntry) await SystemService.addActivityLogEntry(logEntry);
      
      // Utiliser alert au lieu de addNotification
      if (result && result.success) {
        alert(`${title} exécuté avec succès.`);
      } else {
        alert(`${title} échoué.`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Erreur lors de l'exécution de ${title}: ${error.message}`);
      } else {
        alert(`Erreur lors de l'exécution de ${title}: ${String(error)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="group relative overflow-hidden"
      role="region"
      aria-label={`Action rapide : ${title}`}
      onContextMenu={e => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      {/* Menu contextuel custom */}
      {contextMenu && (
        <div
          className="z-50 fixed bg-card shadow-2xl backdrop-blur-xl border border-white/10 rounded-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="p-2">
            <button
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg w-full text-left transition-colors"
              onClick={() => {
                handleAction();
                setContextMenu(null);
              }}
            >
              <Play className="w-4 h-4" />
              Exécuter
            </button>
            <button
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg w-full text-left transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(title);
                setContextMenu(null);
              }}
            >
              <Copy className="w-4 h-4" />
              Copier le titre
            </button>
            <button
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg w-full text-left transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(description);
                setContextMenu(null);
              }}
            >
              <Copy className="w-4 h-4" />
              Copier la description
            </button>
          </div>
        </div>
      )}
      
      {/* Carte principale */}
      <div className="bg-card hover:shadow-2xl backdrop-blur-xl p-6 border border-white/10 hover:border-accent/40 rounded-2xl hover:scale-105 transition-all duration-300">
        {/* Effet d'accent au survol */}
        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
        <div className="z-10 relative">
          {/* Icon */}
          <div className="flex justify-center items-center bg-primary/80 shadow-lg mb-4 rounded-xl w-12 h-12 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <h3 className="mb-2 font-semibold text-primary group-hover:text-accent text-lg transition-colors duration-300">
            {title}
          </h3>
          <p className="mb-4 text-textSecondary group-hover:text-text text-sm transition-colors duration-300">
            {description}
          </p>

          {/* Action Button */}
          <button
            onClick={handleAction}
            disabled={isLoading}
            aria-label={`Exécuter l'action rapide : ${title}`}
            tabIndex={0}
            className="relative bg-primary hover:bg-secondary disabled:opacity-50 hover:shadow-lg px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full overflow-hidden font-medium text-white transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                <div className="border-2 border-white/30 border-t-white rounded-full w-4 h-4 animate-spin"></div>
                <span>Exécution...</span>
              </div>
            ) : (
              'Exécuter'
            )}
          </button>
          
          {/* Affichage du score WinSAT sous le bouton */}
          {action === 'benchmark' && (
            <>
              {winSatScore && (
                <div className="bg-background mt-3 p-2 border border-accent/20 rounded-xl font-semibold text-accent text-sm whitespace-pre-line">
                  {winSatScore}
                </div>
              )}
              {/* Bouton d'actualisation */}
              <button
                className="bg-accent hover:bg-primary mt-2 px-3 py-1 rounded font-medium text-white text-xs transition-all"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const score = await SystemService.getWinSATScore();
                    const scoreText = score
                      ? `Score global : ${score.base}\nCPU : ${score.cpu} | RAM : ${score.memory} | Disque : ${score.disk} | Graphique : ${score.graphics} | Gaming : ${score.gaming}`
                      : null;
                    if (onBenchmarkScore) onBenchmarkScore(scoreText);
                  } catch {
                    if (onBenchmarkScore) onBenchmarkScore(null);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                Actualiser
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActionCard;