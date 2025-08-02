import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HardDrive, 
  Network, 
  Upload,
  Download,
  Share2,
  Search,
  Plus,
  Folder,
  File,
  Trash2
} from 'lucide-react';
import './NASExplorerPage.css';

const NASExplorerPage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleFileSelect = (fileName: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileName) 
        ? prev.filter(f => f !== fileName)
        : [...prev, fileName]
    );
  };

  return (
    <div className="nas-explorer-page">
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <h1 className="page-title">NAS Explorer</h1>
          <p className="page-subtitle">Explorateur de stockage réseau</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <HardDrive size={20} />
            <div className="stat-info">
              <span className="stat-value">2.5 TB</span>
              <span className="stat-label">Espace libre</span>
            </div>
          </div>
          <div className="stat-card">
            <Network size={20} />
            <div className="stat-info">
              <span className="stat-value">3</span>
              <span className="stat-label">Connexions</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div 
        className="toolbar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="toolbar-left">
          <button className="btn btn-secondary">
            <Upload size={16} />
            Upload
          </button>
          <button className="btn btn-secondary">
            <Download size={16} />
            Download
          </button>
          <button className="btn btn-secondary">
            <Share2 size={16} />
            Partager
          </button>
        </div>
        <div className="toolbar-right">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher des fichiers..."
              className="search-input"
            />
          </div>
          <button className="btn btn-primary">
            <Plus size={16} />
            Nouveau
          </button>
        </div>
      </motion.div>

      {/* Breadcrumb */}
      <motion.div 
        className="breadcrumb"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span className="breadcrumb-item">NAS</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item">Documents</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item active">Projets</span>
      </motion.div>

      {/* File Explorer */}
      <motion.div 
        className="file-explorer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="sidebar">
          <div className="sidebar-section">
            <h3>Raccourcis</h3>
            <div className="sidebar-item">
              <Folder size={16} />
              <span>Documents</span>
            </div>
            <div className="sidebar-item">
              <Folder size={16} />
              <span>Images</span>
            </div>
            <div className="sidebar-item">
              <Folder size={16} />
              <span>Vidéos</span>
            </div>
            <div className="sidebar-item">
              <Folder size={16} />
              <span>Musique</span>
            </div>
          </div>
          
          <div className="sidebar-section">
            <h3>Réseau</h3>
            <div className="sidebar-item">
              <Network size={16} />
              <span>NAS Principal</span>
            </div>
            <div className="sidebar-item">
              <Network size={16} />
              <span>Backup Server</span>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="files-grid">
            {[
              { name: 'Projet Web', type: 'folder', size: '2.3 GB', modified: '2024-01-15' },
              { name: 'rapport.pdf', type: 'file', size: '1.2 MB', modified: '2024-01-14' },
              { name: 'presentation.pptx', type: 'file', size: '5.7 MB', modified: '2024-01-13' },
              { name: 'Images', type: 'folder', size: '856 MB', modified: '2024-01-12' },
              { name: 'video.mp4', type: 'file', size: '125 MB', modified: '2024-01-11' },
              { name: 'code.zip', type: 'file', size: '45.2 MB', modified: '2024-01-10' }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                className={`file-item ${selectedFiles.includes(item.name) ? 'selected' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                onClick={() => handleFileSelect(item.name)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="file-icon">
                  {item.type === 'folder' ? <Folder size={32} /> : <File size={32} />}
                </div>
                <div className="file-info">
                  <h4>{item.name}</h4>
                  <p>{item.size}</p>
                  <span>{item.modified}</span>
                </div>
                <div className="file-actions">
                  <button className="action-btn">
                    <Download size={14} />
                  </button>
                  <button className="action-btn">
                    <Share2 size={14} />
                  </button>
                  <button className="action-btn">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NASExplorerPage; 