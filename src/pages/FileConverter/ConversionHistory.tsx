import React from 'react';
import { ConversionTask } from './FileConverter';

interface ConversionHistoryProps {
  tasks: ConversionTask[];
  onRemove: (taskId: string) => void;
  onDownload: (task: ConversionTask) => void;
}

const ConversionHistory: React.FC<ConversionHistoryProps> = ({
  tasks,
  onRemove,
  onDownload
}) => {
  if (tasks.length === 0) {
    return (
      <div className="conversion-history">
        <h3>📋 Historique</h3>
        <div className="no-history">
          <p>Aucune conversion terminée</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Réussi';
      case 'error':
        return 'Échec';
      default:
        return 'Inconnu';
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="conversion-history">
      <h3>📋 Historique ({tasks.length})</h3>
      
      <div className="history-list">
        {tasks.map(task => (
          <div key={task.id} className={`history-item ${task.status}`}>
            <div className="history-header">
              <div className="history-icon">{getStatusIcon(task.status)}</div>
              <div className="history-info">
                <div className="history-filename">{task.fileName}</div>
                <div className="history-status">{getStatusText(task.status)}</div>
              </div>
              <div className="history-actions">
                {task.status === 'completed' && task.result && (
                  <button
                    className="download-btn"
                    onClick={() => onDownload(task)}
                    title="Télécharger le résultat"
                  >
                    📥
                  </button>
                )}
                <button
                  className="remove-btn"
                  onClick={() => onRemove(task.id)}
                  title="Supprimer de l'historique"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="history-details">
              <span className="history-format">
                {task.originalFormat.toUpperCase()} → {task.targetFormat.toUpperCase()}
              </span>
              <span className="history-time">
                {formatTimeAgo(task.timestamp)}
              </span>
            </div>
            
            {task.status === 'completed' && task.result && (
              <div className="history-result">
                <span className="result-label">Résultat :</span>
                <span className="result-filename">{task.result}</span>
              </div>
            )}
            
            {task.status === 'error' && task.error && (
              <div className="history-error">
                <span className="error-label">Erreur :</span>
                <span className="error-message">{task.error}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {tasks.length > 10 && (
        <div className="history-footer">
          <button className="clear-history-btn">
            🗑️ Vider l'historique
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversionHistory; 