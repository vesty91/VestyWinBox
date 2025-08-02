import React, { useState, useCallback } from 'react';
import FileUploader from './FileUploader';
import ConversionOptions from './ConversionOptions';
import ConversionProgress from './ConversionProgress';
import ConversionHistory from './ConversionHistory';
import { FileConversionService } from '../../services/FileConversionService';
import './FileConverter.css';

export interface ConversionTask {
  id: string;
  fileName: string;
  originalFormat: string;
  targetFormat: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress: number;
  result?: string;
  error?: string;
  timestamp: Date;
  outputPath?: string;
}

export const FileConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [conversionTasks, setConversionTasks] = useState<ConversionTask[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const conversionService = FileConversionService.getInstance();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleFormatSelect = useCallback((format: string) => {
    setTargetFormat(format);
  }, []);

  const startConversion = useCallback(async () => {
    if (!selectedFile || !targetFormat) {
      alert('Veuillez sélectionner un fichier et un format cible');
      return;
    }

    const taskId = Date.now().toString();
    const task: ConversionTask = {
      id: taskId,
      fileName: selectedFile.name,
      originalFormat: selectedFile.name.split('.').pop()?.toLowerCase() || '',
      targetFormat,
      status: 'pending',
      progress: 0,
      timestamp: new Date()
    };

    setConversionTasks(prev => [task, ...prev]);
    setIsConverting(true);

    try {
      // Utiliser le service de conversion
      const result = await conversionService.convertFile(selectedFile, targetFormat);
      
      if (result.success) {
        setConversionTasks(prev => prev.map(t => 
          t.id === taskId 
            ? { 
                ...t, 
                status: 'completed',
                result: result.outputPath?.split('/').pop() || `converted.${targetFormat}`,
                outputPath: result.outputPath
              }
            : t
        ));
        
        alert(`${selectedFile.name} a été converti en ${targetFormat}`);

      } else {
        setConversionTasks(prev => prev.map(t => 
          t.id === taskId 
            ? { ...t, status: 'error', error: result.error }
            : t
        ));
        
        alert(`Erreur lors de la conversion: ${result.error}`);
      }
    } catch (error) {
      setConversionTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'error', error: error instanceof Error ? error.message : 'Erreur inconnue' }
          : t
      ));
      
      alert(`Erreur lors de la conversion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile, targetFormat, conversionService]);

  const removeTask = useCallback((taskId: string) => {
    setConversionTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const getMimeType = (format: string): string => {
    switch (format.toLowerCase()) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'bmp':
        return 'image/bmp';
      case 'webp':
        return 'image/webp';
      case 'ico':
        return 'image/x-icon';
      default:
        return 'image/png';
    }
  };

  const downloadResult = useCallback((task: ConversionTask) => {
    if (task.result) {
      // Vérifier si c'est une image
      const isImage = /\.(png|jpg|jpeg|gif|bmp|webp|ico)$/i.test(task.targetFormat);
      
      if (isImage) {
        try {
          // Pour les images, créer un blob à partir du base64
          const base64Data = task.result; // Le résultat contient le base64
          const byteCharacters = window.atob(base64Data.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          const mimeType = getMimeType(task.targetFormat);
          const blob = new Blob([byteArray], { type: mimeType });
          
          // Télécharger l'image
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          // Générer un nom de fichier unique
          const timestamp = new Date().getTime();
          const originalName = task.fileName.replace(/\.[^/.]+$/, '');
          link.download = `converted_${originalName}_${timestamp}.${task.targetFormat}`;
          
          link.click();
          URL.revokeObjectURL(url);
          
        } catch {
          alert('Impossible de télécharger l\'image convertie');
        }
        
      } else {
        // Pour les fichiers texte, utiliser la méthode existante
        let fileContent = '';
        let mimeType = 'text/plain';
        
        // Simuler différents types de contenu selon le format
        switch (task.targetFormat) {
          case 'txt':
            fileContent = `Fichier converti depuis ${task.fileName}\nFormat original: ${task.originalFormat}\nFormat cible: ${task.targetFormat}\nDate de conversion: ${task.timestamp.toLocaleString()}`;
            mimeType = 'text/plain';
            break;
          case 'md':
            fileContent = `# Fichier converti\n\n**Source:** ${task.fileName}\n**Format original:** ${task.originalFormat}\n**Format cible:** ${task.targetFormat}\n**Date:** ${task.timestamp.toLocaleString()}`;
            mimeType = 'text/markdown';
            break;
          case 'json':
            fileContent = JSON.stringify({
              originalFile: task.fileName,
              originalFormat: task.originalFormat,
              targetFormat: task.targetFormat,
              conversionDate: task.timestamp.toISOString(),
              status: 'converted'
            }, null, 2);
            mimeType = 'application/json';
            break;
          case 'html':
            fileContent = `<!DOCTYPE html>
<html>
<head>
    <title>Fichier converti - ${task.fileName}</title>
</head>
<body>
    <h1>Fichier converti</h1>
    <p><strong>Source:</strong> ${task.fileName}</p>
    <p><strong>Format original:</strong> ${task.originalFormat}</p>
    <p><strong>Format cible:</strong> ${task.targetFormat}</p>
    <p><strong>Date de conversion:</strong> ${task.timestamp.toLocaleString()}</p>
</body>
</html>`;
            mimeType = 'text/html';
            break;
          default:
            fileContent = `Fichier converti: ${task.fileName} -> ${task.targetFormat}`;
            mimeType = 'text/plain';
        }
        
        // Créer le blob et télécharger
        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = task.result;
        
        // Ajouter un timestamp pour éviter les conflits
        const timestamp = new Date().getTime();
        link.download = `converted_${timestamp}_${task.result}`;
        
        link.click();
        
        // Nettoyer l'URL
        URL.revokeObjectURL(url);
        
      }
    }
  }, []);

  const openOutputDirectory = useCallback(async () => {
    try {
      await conversionService.openOutputDirectory();
      alert('Le dossier de conversions a été ouvert');
    } catch {
      alert('Impossible d\'ouvrir le dossier de conversions');
    }
  }, [conversionService]);

  return (
    <div className="file-converter">
      <div className="converter-header">
        <h1>🔄 Convertisseur de Fichiers</h1>
        <p>Convertissez vos fichiers entre différents formats</p>
        <div className="header-actions">
          <button 
            className="open-folder-btn"
            onClick={openOutputDirectory}
            title="Ouvrir le dossier de conversions"
          >
            📁 Ouvrir le dossier de conversions
          </button>
        </div>
      </div>

      <div className="converter-content">
        <div className="converter-main">
          <FileUploader 
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
          
          <ConversionOptions 
            selectedFile={selectedFile}
            targetFormat={targetFormat}
            onFormatSelect={handleFormatSelect}
            onConvert={startConversion}
            isConverting={isConverting}
          />
        </div>

        <div className="converter-sidebar">
          <ConversionProgress 
            tasks={conversionTasks.filter(task => task.status === 'converting' || task.status === 'pending')}
          />
          
          <ConversionHistory 
            tasks={conversionTasks.filter(task => task.status === 'completed' || task.status === 'error')}
            onRemove={removeTask}
            onDownload={downloadResult}
          />
        </div>
      </div>
    </div>
  );
};

export default FileConverter; 