import { logger } from './LoggerService';

// Service pour les opérations système via IPC Electron
declare global {
  interface Window {
    electronAPI: {
      launchExecutable: (path: string) => Promise<{ success: boolean; message?: string; error?: string }>;
      executeSystemCommand: (command: string, args?: string[]) => Promise<{ success: boolean; output?: string; error?: string; code?: number }>;
      getWinSATScore: () => Promise<null | {
        cpu: string;
        memory: string;
        disk: string;
        graphics: string;
        gaming: string;
        base: string;
      }>;
      getActivityLog: () => Promise<unknown[]>;
      addActivityLogEntry: (entry: unknown) => Promise<boolean>;
      clearActivityLog: () => Promise<boolean>;
      addBenchmarkHistory: (entry: unknown) => Promise<boolean>;
      getBenchmarkHistory: () => Promise<unknown[]>;
      clearBenchmarkHistory: () => Promise<boolean>;
      checkToolInstalled: (path: string) => Promise<boolean>;
      getSystemStats: () => Promise<unknown>;
      installChocolatey: () => Promise<{ success: boolean; output?: string; error?: string }>;
      getUserInfo: () => Promise<{ username: string }>;
      listNasFiles: (params: { type: 'ftp' | 'sftp', host: string, port?: number, user: string, pass: string, path?: string }) => Promise<NasFileList>;
      listTools: () => Promise<{ success: boolean, tools?: { name: string, path: string, category: string }[], error?: string }>;
      addTool: (category: string) => Promise<{ success: boolean, tool?: { name: string, path: string, category: string }, error?: string }>;
      removeTool: (relPath: string) => Promise<{ success: boolean, error?: string }>;
      getTerminalHistory: () => Promise<string[]>;
      addTerminalHistory: (command: string) => Promise<boolean>;
      clearTerminalHistory: () => Promise<boolean>;
    };
  }
}

// Types d'interfaces
interface SystemInfo {
  osName: string;
  osVersion: string;
  processor: string;
  memory: string;
  computerName: string;
  uptime?: string;
  diskSpace?: string;
}

interface QuickAction {
  [key: string]: () => Promise<{ success: boolean; output?: string; error?: string; code?: number }>;
}

interface NasFile {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
  path: string;
}

interface NasFileList {
  success: boolean;
  files?: NasFile[];
  error?: string;
}

export class SystemService {
  // ===== GESTION DES EXÉCUTABLES =====
  
  static async launchExecutable(executablePath: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.launchExecutable(executablePath);
        logger.info(`Exécutable lancé: ${executablePath}`, { success: result.success }, 'EXECUTABLE');
        return result;
      } else {
        logger.debug(`Simulation du lancement: ${executablePath}`, null, 'EXECUTABLE');
        return { success: true, message: 'Exécutable lancé (simulation)' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error(`Erreur lors du lancement: ${executablePath}`, { error: errorMessage }, 'EXECUTABLE');
      return { success: false, error: errorMessage };
    }
  }

  // ===== COMMANDES SYSTÈME =====
  
  static async executeSystemCommand(command: string, args: string[] = []): Promise<{ success: boolean; output?: string; error?: string; code?: number }> {
    const startTime = Date.now();
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.executeSystemCommand(command, args);
        const duration = Date.now() - startTime;
        logger.info(`Commande système exécutée: ${command}`, { 
          args, 
          success: result.success, 
          duration,
          code: result.code 
        }, 'SYSTEM_CMD');
        return result;
      } else {
        logger.debug(`Simulation de commande: ${command}`, { args }, 'SYSTEM_CMD');
        return { success: true, output: 'Commande exécutée (simulation)', code: 0 };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      const duration = Date.now() - startTime;
      logger.error(`Erreur lors de l'exécution: ${command}`, { 
        args, 
        error: errorMessage, 
        duration 
      }, 'SYSTEM_CMD');
      return { success: false, error: errorMessage };
    }
  }

  // ===== INFORMATIONS SYSTÈME =====
  
  static async getSystemInfo(): Promise<SystemInfo> {
    try {
      const result = await this.executeSystemCommand('systeminfo');
      if (result.success) {
        const systemInfo = this.parseSystemInfo(result.output || '');
        logger.systemInfo(systemInfo);
        return systemInfo;
      } else {
        const mockInfo = this.getMockSystemInfo();
        logger.warn('Utilisation des informations système simulées', mockInfo, 'SYSTEM_INFO');
        return mockInfo;
      }
    } catch (error) {
      const mockInfo = this.getMockSystemInfo();
      logger.error('Erreur lors de la récupération des infos système', { error }, 'SYSTEM_INFO');
      return mockInfo;
    }
  }

  private static parseSystemInfo(output: string): SystemInfo {
    const lines = output.split('\n');
    const info: Record<string, string> = {};

    lines.forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) {
        info[key] = value;
      }
    });

    return {
      osName: info['Nom du système d\'exploitation'] || 'Windows',
      osVersion: info['Version du système'] || '10',
      processor: info['Processeur'] || 'Intel Core i7',
      memory: info['Mémoire physique totale'] || '16 GB',
      computerName: info['Nom de l\'ordinateur'] || 'VestyWinBox'
    };
  }

  private static getMockSystemInfo(): SystemInfo {
    return {
      osName: 'Windows 10 Pro',
      osVersion: '22H2',
      processor: 'Intel Core i7-12700K',
      memory: '32 GB',
      computerName: 'VestyWinBox',
      uptime: '2 jours, 14 heures',
      diskSpace: '1.2 TB libre sur 2 TB'
    };
  }

  // ===== COMMANDES RAPIDES =====
  
  static async quickActions(): Promise<QuickAction> {
    return {
      'ipconfig': async () => await this.executeSystemCommand('ipconfig', ['/all']),
      'systeminfo': async () => await this.executeSystemCommand('systeminfo'),
      'tasklist': async () => await this.executeSystemCommand('tasklist'),
      'diskpart': async () => await this.executeSystemCommand('diskpart', ['/s']),
      'hostname': async () => await this.executeSystemCommand('hostname'),
      'netstat': async () => await this.executeSystemCommand('netstat', ['-an']),
      'wmic': async () => await this.executeSystemCommand('wmic', ['os', 'get', 'caption,version']),
      'chkdsk': async () => await this.executeSystemCommand('chkdsk'),
      'sfc /scannow': async () => await this.executeSystemCommand('sfc', ['/scannow']),
      'dir': async () => await this.executeSystemCommand('cmd', ['/c', 'dir']),
      'ver': async () => await this.executeSystemCommand('ver'),
      'whoami': async () => await this.executeSystemCommand('whoami')
    };
  }

  // ===== PERFORMANCE ET SCORES =====
  
  static async getWinSATScore(): Promise<null | {
    cpu: string;
    memory: string;
    disk: string;
    graphics: string;
    gaming: string;
    base: string;
  }> {
    if (window.electronAPI && window.electronAPI.getWinSATScore) {
      return await window.electronAPI.getWinSATScore();
    }
    return null;
  }

  // ===== JOURNAL D'ACTIVITÉ =====
  
  static async getActivityLog(): Promise<unknown[]> {
    if (window.electronAPI && window.electronAPI.getActivityLog) {
      return await window.electronAPI.getActivityLog();
    }
    return [];
  }

  static async addActivityLogEntry(entry: unknown): Promise<boolean> {
    if (window.electronAPI && window.electronAPI.addActivityLogEntry) {
      return await window.electronAPI.addActivityLogEntry(entry);
    }
    return false;
  }

  static async clearActivityLog(): Promise<boolean> {
    if (window.electronAPI && window.electronAPI.clearActivityLog) {
      return await window.electronAPI.clearActivityLog();
    }
    return false;
  }

  static async addBenchmarkHistory(entry: unknown): Promise<boolean> {
    if (window.electronAPI && window.electronAPI.addBenchmarkHistory) {
      return await window.electronAPI.addBenchmarkHistory(entry);
    }
    return false;
  }

  static async getBenchmarkHistory(): Promise<unknown[]> {
    if (window.electronAPI && window.electronAPI.getBenchmarkHistory) {
      return await window.electronAPI.getBenchmarkHistory();
    }
    return [];
  }

  static async clearBenchmarkHistory(): Promise<boolean> {
    if (window.electronAPI && window.electronAPI.clearBenchmarkHistory) {
      return await window.electronAPI.clearBenchmarkHistory();
    }
    return false;
  }

  static async checkToolInstalled(executablePath: string): Promise<boolean> {
    if (window.electronAPI && window.electronAPI.checkToolInstalled) {
      return await window.electronAPI.checkToolInstalled(executablePath);
    }
    return false;
  }

  static async getSystemStats(): Promise<unknown> {
    if (window.electronAPI && window.electronAPI.getSystemStats) {
      return await window.electronAPI.getSystemStats();
    }
    return null;
  }

  static async installChocolatey(): Promise<{ success: boolean; output?: string; error?: string }> {
    if (window.electronAPI && window.electronAPI.installChocolatey) {
      return await window.electronAPI.installChocolatey();
    }
    return { success: false, error: 'API non disponible' };
  }

  static async getUserInfo(): Promise<{ username: string }> {
    if (window.electronAPI && window.electronAPI.getUserInfo) {
      return await window.electronAPI.getUserInfo();
    }
    return { username: 'Utilisateur' };
  }

  // ===== NAS EXPLORER =====
  static async listNasFiles(params: { type: 'ftp' | 'sftp', host: string, port?: number, user: string, pass: string, path?: string }): Promise<NasFileList> {
    try {
      if (window.electronAPI && window.electronAPI.listNasFiles) {
        return await window.electronAPI.listNasFiles(params);
      } else {
        return { success: false, error: 'API NAS non disponible (simulation)' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  // ===== TOOLS MANAGER =====
  static async listTools(): Promise<{ success: boolean, tools?: { name: string, path: string, category: string }[], error?: string }> {
    try {
      if (window.electronAPI && window.electronAPI.listTools) {
        return await window.electronAPI.listTools();
      } else {
        return { success: false, error: 'API Tools non disponible (simulation)' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  static async addTool(category: string): Promise<{ success: boolean, tool?: { name: string, path: string, category: string }, error?: string }> {
    try {
      if (window.electronAPI && window.electronAPI.addTool) {
        return await window.electronAPI.addTool(category);
      } else {
        return { success: false, error: 'API addTool non disponible (simulation)' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  static async removeTool(relPath: string): Promise<{ success: boolean, error?: string }> {
    try {
      if (window.electronAPI && window.electronAPI.removeTool) {
        return await window.electronAPI.removeTool(relPath);
      } else {
        return { success: false, error: 'API removeTool non disponible (simulation)' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  // ===== TERMINAL HISTORY =====
  static async getTerminalHistory(): Promise<string[]> {
    if (window.electronAPI && window.electronAPI.getTerminalHistory) {
      return await window.electronAPI.getTerminalHistory();
    }
    return [];
  }
  static async addTerminalHistory(command: string): Promise<boolean> {
    if (window.electronAPI && window.electronAPI.addTerminalHistory) {
      return await window.electronAPI.addTerminalHistory(command);
    }
    return false;
  }
  static async clearTerminalHistory(): Promise<boolean> {
    if (window.electronAPI && window.electronAPI.clearTerminalHistory) {
      return await window.electronAPI.clearTerminalHistory();
    }
    return false;
  }
} 