import React, { useCallback, useState } from 'react';
import './FileUploader.css';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  selectedFile
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'webp':
        return '🖼️';
      case 'exe':
        return '⚙️';
      case 'ico':
      case 'cur':
        return '🎯';
      case 'txt':
      case 'md':
        return '📄';
      case 'pdf':
        return '📕';
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'flac':
        return '🎵';
      case 'mp4':
      case 'avi':
      case 'mkv':
      case 'mov':
        return '🎬';
      default:
        return '📁';
    }
  };

  return (
    <div className="file-uploader">
      <h3>📁 Sélectionner un fichier</h3>
      
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
      >
        <input 
          type="file" 
          onChange={handleFileInput} 
          accept=".png,.jpg,.jpeg,.gif,.bmp,.webp,.ico,.exe,.txt,.md,.pdf,.mp3,.wav,.ogg,.flac,.mp4,.avi,.mkv,.mov"
        />
        
        {selectedFile ? (
          <div className="selected-file">
            <div className="file-icon">{getFileIcon(selectedFile.name)}</div>
            <div className="file-info">
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-size">{formatFileSize(selectedFile.size)}</div>
              <div className="file-type">{selectedFile.type || 'Type inconnu'}</div>
            </div>
            <button 
              className="change-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null as unknown as File);
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="dropzone-content">
            <div className="dropzone-icon">📁</div>
            <p>Glissez-déposez un fichier ici ou cliquez pour sélectionner</p>
            <p className="dropzone-hint">Formats supportés: Images, Documents, Audio, Vidéo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader; 