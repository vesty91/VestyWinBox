import React, { useState } from 'react';
import { FolderOpen, FileText, HardDrive } from 'lucide-react';
import './NasExplorer.css';
import { SystemService } from '../../services/SystemService';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  path: string;
}

const NasExplorer: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState<'ftp' | 'sftp'>('sftp');
  const [host, setHost] = useState('');
  const [port, setPort] = useState<number | undefined>(undefined);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, file: FileItem} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SystemService.listNasFiles({
        type: connectionType,
        host,
        port,
        user,
        pass,
        path: '/'
      });
      if (res.success && res.files) {
        setFiles(res.files.map((f, idx) => ({
          id: f.path || f.name || idx.toString(),
          name: f.name,
          type: f.type === 'directory' ? 'folder' : 'file',
          size: f.size ? `${f.size} octets` : undefined,
          modified: f.modified ? f.modified.slice(0, 10) : '',
          path: f.path
        })));
        setIsConnected(true);
        setCurrentPath('/');
      } else {
        setError(res.error || 'Erreur inconnue');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    }
    setLoading(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setFiles([]);
    setSelectedFiles([]);
    setCurrentPath('/');
    setError(null);
  };

  const handleNavigate = async (folder: FileItem) => {
    if (folder.type !== 'folder') return;
    setLoading(true);
    setError(null);
    try {
      const res = await SystemService.listNasFiles({
        type: connectionType,
        host,
        port,
        user,
        pass,
        path: folder.path
      });
      if (res.success && res.files) {
        setFiles(res.files.map((f, idx) => ({
          id: f.path || f.name || idx.toString(),
          name: f.name,
          type: f.type === 'directory' ? 'folder' : 'file',
          size: f.size ? `${f.size} octets` : undefined,
          modified: f.modified ? f.modified.slice(0, 10) : '',
          path: f.path
        })));
        setCurrentPath(folder.path);
      } else {
        setError(res.error || 'Erreur inconnue');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    }
    setLoading(false);
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDownload = async () => {
    if (selectedFiles.length === 0) return;
    
    // Log en mode développement seulement
    if (process.env.NODE_ENV === 'development') {
      console.log('Downloading files:', selectedFiles);
    }
    
    // Simulation de téléchargement
    setTimeout(() => {
      setSelectedFiles([]);
      // Removed addNotification as per edit hint
    }, 2000);
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return <FolderOpen className="w-5 h-5 text-blue-400" />;
    }
    return <FileText className="w-5 h-5 text-white/70" />;
  };

  return (
    <div className="space-y-6 bg-background p-6 min-h-screen text-text" role="region" aria-label="NAS Explorer">
      {/* Header */}
      <div className="bg-card backdrop-blur-xl p-6 border border-white/10 rounded-2xl">
        <div className="flex flex-col items-center w-full">
          <h1 className="bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-lg mb-2 font-orbitron font-bold text-transparent text-3xl text-center">
          NAS Explorer
        </h1>
          <p className="font-sans text-textSecondary text-center">
          Explorateur de fichiers réseau avec support FTP, SFTP et WebDAV
        </p>
        </div>
      </div>

      {/* Connection Panel */}
      <div className="bg-card backdrop-blur-xl p-6 border border-white/10 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center gap-2 font-semibold text-primary text-xl">
            <HardDrive className="w-5 h-5 text-accent" />
            Connexion NAS
          </h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-success/20 text-success border border-success/30' 
              : 'bg-error/20 text-error border border-error/30'
          }`}>
            {/* Removed Wifi icon as it's not imported */}
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </div>
        </div>

        {!isConnected ? (
          <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
            {/* Connection Form */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-textSecondary text-sm">Type de connexion</label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value as 'ftp' | 'sftp')}
                  className="bg-background p-2 border border-white/10 focus:border-primary/50 rounded-xl focus:outline-none w-full text-text"
                  title="Sélectionner le type de connexion"
                  aria-label="Type de connexion"
                >
                  <option value="sftp">SFTP</option>
                  <option value="ftp">FTP</option>
                  <option value="webdav" disabled>WebDAV (bientôt)</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-textSecondary text-sm">Serveur</label>
                <input
                  type="text"
                  placeholder="192.168.1.100"
                  value={host}
                  onChange={e => setHost(e.target.value)}
                  className="bg-background p-2 border border-white/10 focus:border-primary/50 rounded-xl focus:outline-none w-full text-text placeholder-textSecondary"
                />
              </div>
              <div className="gap-4 grid grid-cols-2">
                <div>
                  <label className="block mb-2 text-textSecondary text-sm">Utilisateur</label>
                  <input
                    type="text"
                    placeholder="admin"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    className="bg-background p-2 border border-white/10 focus:border-primary/50 rounded-xl focus:outline-none w-full text-text placeholder-textSecondary"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-textSecondary text-sm">Mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    className="bg-background p-2 border border-white/10 focus:border-primary/50 rounded-xl focus:outline-none w-full text-text placeholder-textSecondary"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-textSecondary text-sm">Port (optionnel)</label>
                <input
                  type="number"
                  placeholder={connectionType === 'ftp' ? '21' : '22'}
                  value={port === undefined ? '' : port}
                  onChange={e => setPort(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="bg-background p-2 border border-white/10 focus:border-primary/50 rounded-xl focus:outline-none w-full text-text placeholder-textSecondary"
                />
              </div>
            </div>
            {/* Connection Info */}
            <div className="bg-card p-4 border border-white/10 rounded-xl">
              <h3 className="mb-3 font-medium text-primary">Protocoles supportés</h3>
              <div className="space-y-2 text-textSecondary text-sm">
                <div>• <strong>SFTP:</strong> Transfert sécurisé via SSH</div>
                <div>• <strong>FTP:</strong> Protocole de transfert standard</div>
                <div>• <strong>WebDAV:</strong> Accès via HTTPS</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="text-textSecondary">
              Connecté à: <span className="text-text">{host} ({connectionType.toUpperCase()})</span>
            </div>
            <button
              onClick={handleDisconnect}
              aria-label="Déconnecter du NAS"
              tabIndex={0}
              className="bg-error/20 hover:bg-error/30 px-4 py-2 border border-error/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-error transition-all duration-300"
            >
              Déconnecter
            </button>
          </div>
        )}
        {!isConnected && (
          <button
            onClick={handleConnect}
            aria-label="Se connecter au NAS"
            tabIndex={0}
            className="bg-primary hover:bg-secondary mt-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full font-medium text-white transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        )}
        {error && <div className="mt-4 text-error text-sm">{error}</div>}
      </div>

      {/* File Explorer */}
      {isConnected && (
        <div className="bg-card backdrop-blur-xl p-6 border border-white/10 rounded-2xl" role="region" aria-label="Explorateur de fichiers NAS">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button 
                className="hover:bg-white/10 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white/70 hover:text-white transition-all duration-300"
                title="Actualiser"
                aria-label="Actualiser la liste des fichiers"
                tabIndex={0}
                onClick={() => handleNavigate({ type: 'folder', path: currentPath, name: '', id: '', modified: '', size: undefined })}
                disabled={loading}
              >
                {/* Removed RefreshCw icon as it's not imported */}
              </button>
              <span className="text-white/70 text-sm">Chemin: {currentPath}</span>
            </div>

            <div className="flex items-center gap-2">
              {selectedFiles.length > 0 && (
                <>
                  <button
                    onClick={handleDownload}
                    aria-label="Télécharger les fichiers sélectionnés"
                    tabIndex={0}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 hover:from-green-600 to-emerald-400 hover:to-emerald-500 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium text-white transition-all duration-300"
                  >
                    {/* Removed Download icon as it's not imported */}
                    Télécharger ({selectedFiles.length})
                  </button>
                  <button
                    onClick={() => setSelectedFiles([])}
                    aria-label="Annuler la sélection de fichiers"
                    tabIndex={0}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white/70 transition-all duration-300"
                  >
                    Annuler
                  </button>
                </>
              )}
              
              <button 
                className="hover:bg-white/10 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white/70 hover:text-white transition-all duration-300"
                title="Téléverser"
                aria-label="Téléverser des fichiers"
                tabIndex={0}
              >
                {/* Removed Upload icon as it's not imported */}
              </button>
            </div>
          </div>

          {/* File List */}
          <div className="space-y-2">
            {loading && <div className="py-8 text-white/70 text-center">Chargement des fichiers NAS...</div>}
            {files.map((file) => (
              <div
                key={file.id}
                className={`group flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedFiles.includes(file.id)
                    ? 'bg-blue-500/20 border-blue-500/30'
                    : 'border-white/10 hover:bg-white/5 hover:border-white/20'
                }`}
                onClick={() => file.type === 'folder' ? handleNavigate(file) : handleFileSelect(file.id)}
                onContextMenu={e => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, file });
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => handleFileSelect(file.id)}
                  className="w-4 h-4 accent-blue-500"
                  title={`Sélectionner ${file.name}`}
                  aria-label={`Sélectionner ${file.name}`}
                />
                
                {getFileIcon(file)}
                
                <div className="flex-1">
                  <div className="font-medium text-white">{file.name}</div>
                  <div className="text-white/80 text-sm">
                    Modifié le {file.modified}
                    {file.size && ` • ${file.size}`}
                  </div>
                </div>

                {file.type === 'file' && (
                  <button 
                    className="opacity-0 group-hover:opacity-100 p-2 focus:outline-none focus:ring-2 focus:ring-primary text-white/70 hover:text-white transition-all duration-300"
                    tabIndex={0}
                    title={`Télécharger ${file.name}`}
                    aria-label={`Télécharger ${file.name}`}
                  >
                    {/* Removed Download icon as it's not imported */}
                  </button>
                )}
              </div>
            ))}
            {/* Menu contextuel custom */}
            {contextMenu && (
              <div
                className="z-50 absolute bg-card shadow-lg p-2 border border-white/10 rounded-lg"
                style={{ top: contextMenu.y, left: contextMenu.x }}
              >
                <button
                  onClick={() => {
                    handleDownload();
                    setContextMenu(null);
                  }}
                  className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-md w-full text-white/70 text-left"
                >
                  {/* Removed Download icon as it's not imported */}
                  Télécharger
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(contextMenu.file.name);
                    setContextMenu(null);
                  }}
                  className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-md w-full text-white/70 text-left"
                >
                  {/* Removed Copy icon as it's not imported */}
                  Copier le nom
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(contextMenu.file.path);
                    setContextMenu(null);
                  }}
                  className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-md w-full text-white/70 text-left"
                >
                  {/* Removed Copy icon as it's not imported */}
                  Copier le chemin
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NasExplorer;