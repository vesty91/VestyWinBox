import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, FolderOpen, FileText, Image, X } from 'lucide-react';
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
  // eslint-disable-next-line @typescript-eslint/no-undef
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [conversionTasks, setConversionTasks] = useState<ConversionTask[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const conversionService = FileConversionService.getInstance();

  // eslint-disable-next-line @typescript-eslint/no-undef
  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    // logger.info(`Fichier sélectionné: ${file.name}`, { size: file.size, type: file.type }, 'FILE_CONVERTER'); // Removed logger
  }, []);

  const handleFormatSelect = useCallback((format: string) => {
    setTargetFormat(format);
    // logger.debug(`Format cible sélectionné: ${format}`, null, 'FILE_CONVERTER'); // Removed logger
  }, []);

  const startConversion = useCallback(async () => {
    if (!selectedFile || !targetFormat) {
      // addNotification({ // Removed addNotification
      //   type: 'error',
      //   title: 'Erreur',
      //   message: 'Veuillez sélectionner un fichier et un format cible'
      // });
      alert('Veuillez sélectionner un fichier et un format cible'); // Replaced addNotification
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
        
        // addNotification({ // Removed addNotification
        //   type: 'success',
        //   title: 'Conversion réussie',
        //   message: `${selectedFile.name} a été converti en ${targetFormat}`
        // });
        alert(`${selectedFile.name} a été converti en ${targetFormat}`); // Replaced addNotification

        // logger.info(`Conversion réussie: ${selectedFile.name} -> ${targetFormat}`, null, 'FILE_CONVERTER'); // Removed logger
      } else {
        setConversionTasks(prev => prev.map(t => 
          t.id === taskId 
            ? { ...t, status: 'error', error: result.error }
            : t
        ));
        
        // addNotification({ // Removed addNotification
        //   type: 'error',
        //   title: 'Erreur de conversion',
        //   message: result.error || 'Une erreur est survenue lors de la conversion'
        // });
        alert(result.error || 'Une erreur est survenue lors de la conversion'); // Replaced addNotification
      }
    } catch (error) {
      setConversionTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'error', error: 'Erreur inconnue' }
          : t
      ));
      
      // addNotification({ // Removed addNotification
      //   type: 'error',
      //   title: 'Erreur de conversion',
      //   message: 'Une erreur est survenue lors de la conversion'
      // });
      alert('Une erreur est survenue lors de la conversion'); // Replaced addNotification

      // logger.error(`Erreur de conversion: ${error}`, null, 'FILE_CONVERTER'); // Removed logger
    } finally {
      setIsConverting(false);
      setSelectedFile(null);
      setTargetFormat('');
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
          
          // addNotification({ // Removed addNotification
          //   type: 'success',
          //   title: 'Image téléchargée',
          //   message: `L'image a été convertie et téléchargée en ${task.targetFormat.toUpperCase()}`
          // });
          alert(`L'image a été convertie et téléchargée en ${task.targetFormat.toUpperCase()}`); // Replaced addNotification
          
          // logger.info(`Image téléchargée: ${task.result}`, { // Removed logger
          //   originalFile: task.fileName,
          //   targetFormat: task.targetFormat,
          //   size: blob.size 
          // }, 'FILE_CONVERTER');
        } catch {
          // addNotification({ // Removed addNotification
          //   type: 'error',
          //   title: 'Erreur de téléchargement',
          //   message: 'Impossible de télécharger l\'image convertie'
          // });
          alert('Impossible de télécharger l\'image convertie'); // Replaced addNotification
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
        
        // addNotification({ // Removed addNotification
        //   type: 'success',
        //   title: 'Téléchargement',
        //   message: `${task.result} a été téléchargé dans votre dossier Downloads`
        // });
        alert(`${task.result} a été téléchargé dans votre dossier Downloads`); // Replaced addNotification
        
        // logger.info(`Fichier téléchargé: ${task.result}`, { // Removed logger
        //   originalFile: task.fileName,
        //   targetFormat: task.targetFormat,
        //   size: blob.size 
        // }, 'FILE_CONVERTER');
      }
    }
  }, []); // Removed addNotification from dependency array

  const openOutputDirectory = useCallback(async () => {
    try {
      await conversionService.openOutputDirectory();
      // addNotification({ // Removed addNotification
      //   type: 'success',
      //   title: 'Dossier ouvert',
      //   message: 'Le dossier de conversions a été ouvert'
      // });
      alert('Le dossier de conversions a été ouvert'); // Replaced addNotification
    } catch {
      // Gérer l'erreur silencieusement ou logger
      // addNotification({ // Removed addNotification
      //   type: 'error',
      //   title: 'Erreur',
      //   message: 'Impossible d\'ouvrir le dossier de conversions'
      // });
      alert('Impossible d\'ouvrir le dossier de conversions'); // Replaced addNotification
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