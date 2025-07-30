import React from 'react';
import { ConversionTask } from './FileConverter';

interface ConversionProgressProps {
  tasks: ConversionTask[];
}

const ConversionProgress: React.FC<ConversionProgressProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="conversion-progress">
        <h3>⏳ Progression</h3>
        <div className="no-tasks">
          <p>Aucune conversion en cours</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'converting':
        return '🔄';
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
      case 'pending':
        return 'En attente';
      case 'converting':
        return 'Conversion en cours';
      case 'completed':
        return 'Terminé';
      case 'error':
        return 'Erreur';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="conversion-progress">
      <h3>⏳ Progression ({tasks.length})</h3>
      
      <div className="progress-list">
        {tasks.map(task => (
          <div key={task.id} className="progress-item">
            <div className="progress-header">
              <div className="progress-icon">{getStatusIcon(task.status)}</div>
              <div className="progress-info">
                <div className="progress-filename">{task.fileName}</div>
                <div className="progress-status">{getStatusText(task.status)}</div>
              </div>
            </div>
            
            {task.status === 'converting' && (
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <div className="progress-percentage">{task.progress}%</div>
              </div>
            )}
            
            <div className="progress-details">
              <span className="progress-format">
                {task.originalFormat.toUpperCase()} → {task.targetFormat.toUpperCase()}
              </span>
              <span className="progress-time">
                {task.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionProgress; 