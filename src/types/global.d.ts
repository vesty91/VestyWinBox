// Types globaux pour les APIs DOM
declare global {
  interface File {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }

  interface FileReader {
    readAsText(file: File): void;
    readAsDataURL(blob: Blob): void;
    result: string | null;
    onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null;
    onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null;
  }

  var FileReader: {
    new(): FileReader;
  };

  interface ProgressEvent<T = EventTarget> extends Event {
    readonly lengthComputable: boolean;
    readonly loaded: number;
    readonly total: number;
  }

  // Types pour l'API Electron
  interface ElectronAPI {
    minimizeWindow: () => void;
    maximizeWindow: () => void;
    closeWindow: () => void;
    onMaximize: (callback: () => void) => void;
    onUnmaximize: (callback: () => void) => void;
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
    showNotification: (title: string, body: string) => void;
    openExternal: (url: string) => Promise<{ success: boolean; error?: string }>;
    getSystemInfo: () => Promise<any>;
    launchExecutable: (filePath: string) => Promise<{ success: boolean; message?: string; error?: string }>;
    executeSystemCommand: (command: string, args?: string[]) => Promise<{ success: boolean; output?: string; error?: string }>;
    selectBackupFolder: () => Promise<{ success: boolean; folderPath?: string; error?: string }>;
    backupUserFolders: (destinationPath: string) => Promise<{ success: boolean; message?: string; error?: string; progress?: number }>;
  }

  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {}; 