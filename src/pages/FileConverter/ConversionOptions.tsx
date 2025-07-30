import React, { useMemo, useState } from 'react';

interface ConversionOptionsProps {
  selectedFile: File | null;
  targetFormat: string;
  onFormatSelect: (format: string) => void;
  onConvert: () => void;
  isConverting: boolean;
}

const ConversionOptions: React.FC<ConversionOptionsProps> = ({
  selectedFile,
  targetFormat,
  onFormatSelect,
  onConvert,
  isConverting
}) => {
  const [quality, setQuality] = useState(90);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);

  const availableFormats = useMemo(() => {
    if (!selectedFile) return [];

    const extension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    
    // Formats de conversion disponibles selon le type de fichier
    const formatMap: Record<string, string[]> = {
      // Images
      'png': ['jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico'],
      'jpg': ['png', 'gif', 'bmp', 'webp', 'ico'],
      'jpeg': ['png', 'gif', 'bmp', 'webp', 'ico'],
      'gif': ['png', 'jpg', 'jpeg', 'bmp', 'webp'],
      'bmp': ['png', 'jpg', 'jpeg', 'gif', 'webp'],
      'webp': ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
      
      // Exécutables et icônes
      'exe': ['ico', 'cur'],
      'ico': ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
      'cur': ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico'],
      
      // Documents
      'txt': ['md', 'pdf'],
      'md': ['txt', 'pdf'],
      'pdf': ['txt', 'md'],
      
      // Audio
      'mp3': ['wav', 'ogg', 'flac'],
      'wav': ['mp3', 'ogg', 'flac'],
      'ogg': ['mp3', 'wav', 'flac'],
      'flac': ['mp3', 'wav', 'ogg'],
      
      // Vidéo
      'mp4': ['avi', 'mkv', 'mov'],
      'avi': ['mp4', 'mkv', 'mov'],
      'mkv': ['mp4', 'avi', 'mov'],
      'mov': ['mp4', 'avi', 'mkv']
    };

    return formatMap[extension] || [];
  }, [selectedFile]);

  const isImageConversion = useMemo(() => {
    if (!selectedFile) return false;
    return selectedFile.type.startsWith('image/') || 
           /\.(png|jpg|jpeg|gif|bmp|webp|ico|svg)$/i.test(selectedFile.name);
  }, [selectedFile]);

  const isLossyFormat = useMemo(() => {
    return ['jpg', 'jpeg', 'webp'].includes(targetFormat.toLowerCase());
  }, [targetFormat]);

  const getFormatIcon = (format: string): string => {
    switch (format) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'webp':
        return '🖼️';
      case 'ico':
      case 'cur':
        return '🎯';
      case 'exe':
        return '⚙️';
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

  const getFormatDescription = (format: string): string => {
    switch (format) {
      case 'png':
        return 'Portable Network Graphics - Transparence supportée';
      case 'jpg':
      case 'jpeg':
        return 'Joint Photographic Experts Group - Compression avec perte';
      case 'gif':
        return 'Graphics Interchange Format - Animations supportées';
      case 'bmp':
        return 'Bitmap - Format non compressé';
      case 'webp':
        return 'WebP - Format moderne de Google';
      case 'ico':
        return 'Icône Windows - Format d\'icône standard';
      case 'cur':
        return 'Curseur Windows - Format de curseur';
      case 'exe':
        return 'Exécutable Windows - Programme exécutable';
      case 'txt':
        return 'Texte brut - Format simple';
      case 'md':
        return 'Markdown - Format de texte enrichi';
      case 'pdf':
        return 'Portable Document Format - Document universel';
      case 'mp3':
        return 'MPEG Audio Layer III - Audio compressé';
      case 'wav':
        return 'Waveform Audio - Audio non compressé';
      case 'ogg':
        return 'Ogg Vorbis - Audio libre';
      case 'flac':
        return 'Free Lossless Audio Codec - Audio sans perte';
      case 'mp4':
        return 'MPEG-4 - Vidéo moderne';
      case 'avi':
        return 'Audio Video Interleave - Format vidéo classique';
      case 'mkv':
        return 'Matroska Video - Conteneur vidéo libre';
      case 'mov':
        return 'QuickTime Movie - Format Apple';
      default:
        return 'Format inconnu';
    }
  };

  if (!selectedFile) {
    return (
      <div className="conversion-options">
        <h3>⚙️ Options de conversion</h3>
        <div className="no-file-selected">
          <p>Veuillez d'abord sélectionner un fichier pour voir les options de conversion disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="conversion-options">
      <h3>⚙️ Options de conversion</h3>
      
      <div className="current-file-info">
        <h4>Fichier sélectionné :</h4>
        <p>{selectedFile.name}</p>
      </div>

      {availableFormats.length > 0 ? (
        <>
          <div className="format-selection">
            <h4>Formats de conversion disponibles :</h4>
            <div className="format-grid">
              {availableFormats.map(format => (
                <button
                  key={format}
                  className={`format-option ${targetFormat === format ? 'selected' : ''}`}
                  onClick={() => onFormatSelect(format)}
                >
                  <div className="format-icon">{getFormatIcon(format)}</div>
                  <div className="format-details">
                    <div className="format-name">.{format.toUpperCase()}</div>
                    <div className="format-description">{getFormatDescription(format)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options pour les images */}
          {isImageConversion && targetFormat && (
            <div className="image-options">
              <h4>🖼️ Options d'image</h4>
              
              {isLossyFormat && (
                <div className="quality-option">
                  <label htmlFor="quality">Qualité : {quality}%</label>
                  <input
                    id="quality"
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="quality-slider"
                  />
                  <div className="quality-labels">
                    <span>Faible</span>
                    <span>Élevée</span>
                  </div>
                </div>
              )}

              <div className="resize-option">
                <label>
                  <input
                    type="checkbox"
                    checked={resizeEnabled}
                    onChange={(e) => setResizeEnabled(e.target.checked)}
                  />
                  Redimensionner l'image
                </label>
                
                {resizeEnabled && (
                  <div className="resize-controls">
                    <div className="resize-input">
                      <label>Largeur max :</label>
                      <input
                        type="number"
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                        min="1"
                        max="4000"
                        title="Largeur maximale en pixels"
                        placeholder="1920"
                      />
                      <span>px</span>
                    </div>
                    <div className="resize-input">
                      <label>Hauteur max :</label>
                      <input
                        type="number"
                        value={maxHeight}
                        onChange={(e) => setMaxHeight(parseInt(e.target.value))}
                        min="1"
                        max="4000"
                        title="Hauteur maximale en pixels"
                        placeholder="1080"
                      />
                      <span>px</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {targetFormat && (
            <div className="conversion-action">
              <button
                className="convert-btn"
                onClick={onConvert}
                disabled={isConverting}
              >
                {isConverting ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    Conversion en cours...
                  </>
                ) : (
                  <>
                    🔄 Convertir en .{targetFormat.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-formats-available">
          <p>❌ Aucun format de conversion disponible pour ce type de fichier.</p>
          <p>Formats supportés : PNG, JPG, EXE, ICO, TXT, PDF, MP3, MP4, etc.</p>
        </div>
      )}
    </div>
  );
};

export default ConversionOptions; 