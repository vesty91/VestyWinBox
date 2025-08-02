// Déclarations de types globales pour VestyWinBox

// API Electron
declare global {
  interface Window {
    electronAPI: {
      launchExecutable: (path: string) => Promise<{ success: boolean; error?: string }>;
      executeSystemCommand: (command: string, args?: string[]) => Promise<{ success: boolean; output?: string; error?: string; stderr?: string }>;
      selectBackupFolder: () => Promise<{ success: boolean; path?: string; error?: string }>;
      backupUserFolders: (sourcePaths: string[], destinationPath: string) => Promise<{ success: boolean; error?: string }>;
      openExternal: (url: string) => Promise<{ success: boolean; error?: string }>;
    };
  }

  // Types pour les APIs Web
  interface File {
    name: string;
    type: string;
    size: number;
    arrayBuffer(): Promise<ArrayBuffer>;
    slice(start?: number, end?: number): File;
  }

  interface FileReader {
    readAsArrayBuffer(blob: Blob): void;
    readAsDataURL(blob: Blob): void;
    result: string | ArrayBuffer | null;
    onload: ((this: FileReader, ev: Event) => void) | null;
    onerror: ((this: FileReader, ev: Event) => void) | null;
  }

  var FileReader: {
    prototype: FileReader;
    new(): FileReader;
  };

  // Types pour les éléments DOM
  interface HTMLInputElement extends HTMLElement {
    files: FileList | null;
    value: string;
  }

  interface FileList {
    readonly length: number;
    item(index: number): File | null;
    [index: number]: File;
  }

  interface DataTransfer {
    files: FileList;
  }

  interface DragEvent extends Event {
    dataTransfer: DataTransfer;
  }
}

export {}; 