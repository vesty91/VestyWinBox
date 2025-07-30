import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ selectedFile, onFileSelect }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.ico'],
      'application/x-msdownload': ['.exe'],
      'text/*': ['.txt', '.md'],
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.flac'],
      'video/*': ['.mp4', '.avi', '.mkv', '.mov']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false)
  });

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
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'drag-active' : ''} ${isDragReject ? 'drag-reject' : ''}`}
      >
        <input {...getInputProps()} />
        
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