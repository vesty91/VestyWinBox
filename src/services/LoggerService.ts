// Service de logging professionnel pour VestyWinBox
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  context?: string;
  userId?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  maxFileSize: number; // en MB
  maxFiles: number;
  logDirectory?: string;
}

class LoggerService {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private readonly MAX_BUFFER_SIZE = 100;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: process.env.NODE_ENV === 'development',
      enableFile: true,
      maxFileSize: 10, // 10MB
      maxFiles: 5,
      logDirectory: process.env.APPDATA ? `${process.env.APPDATA}/vestywinbox/logs` : undefined,
      ...config
    };

    // Nettoyer le buffer périodiquement
    setInterval(() => this.flushBuffer(), 5000);
  }

  private formatMessage(entry: LogEntry): string {
    const levelStr = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toISOString();
    const context = entry.context ? `[${entry.context}]` : '';
    const data = entry.data ? ` | Data: ${JSON.stringify(entry.data)}` : '';
    
    return `${timestamp} [${levelStr}]${context} ${entry.message}${data}`;
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    if (!this.config.enableFile || !this.config.logDirectory) return;

    try {
      // Créer le répertoire de logs s'il n'existe pas
      if (window.electronAPI?.createDirectory) {
        await window.electronAPI.createDirectory(this.config.logDirectory);
      }

      const logFile = `${this.config.logDirectory}/vestywinbox-${new Date().toISOString().split('T')[0]}.log`;
      const logLine = this.formatMessage(entry) + '\n';

      if (window.electronAPI?.appendToFile) {
        await window.electronAPI.appendToFile(logFile, logLine);
      }
    } catch (error) {
      // Fallback vers console si l'écriture de fichier échoue
      if (this.config.enableConsole) {
        console.error('Erreur lors de l\'écriture du log:', error);
      }
    }
  }

  private writeToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const message = this.formatMessage(entry);
    const styles = {
      [LogLevel.DEBUG]: 'color: #6c757d',
      [LogLevel.INFO]: 'color: #17a2b8',
      [LogLevel.WARN]: 'color: #ffc107',
      [LogLevel.ERROR]: 'color: #dc3545',
      [LogLevel.FATAL]: 'color: #721c24; background: #f8d7da'
    };

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`%c${message}`, styles[entry.level]);
        break;
      case LogLevel.INFO:
        console.info(`%c${message}`, styles[entry.level]);
        break;
      case LogLevel.WARN:
        console.warn(`%c${message}`, styles[entry.level]);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(`%c${message}`, styles[entry.level]);
        break;
    }
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (level < this.config.level) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context
    };

    // Ajouter au buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
      this.logBuffer.shift();
    }

    // Écrire immédiatement
    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  private async flushBuffer(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const entries = [...this.logBuffer];
    this.logBuffer = [];

    for (const entry of entries) {
      await this.writeToFile(entry);
    }
  }

  // Méthodes publiques
  debug(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.ERROR, message, data, context);
  }

  fatal(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.FATAL, message, data, context);
  }

  // Méthodes spécialisées
  systemInfo(info: unknown): void {
    this.info('Informations système', info, 'SYSTEM');
  }

  userAction(action: string, details?: unknown): void {
    this.info(`Action utilisateur: ${action}`, details, 'USER');
  }

  performance(operation: string, duration: number, details?: unknown): void {
    this.info(`Performance: ${operation} (${duration}ms)`, details, 'PERF');
  }

  security(event: string, details?: unknown): void {
    this.warn(`Événement de sécurité: ${event}`, details, 'SECURITY');
  }

  // Récupération des logs
  async getRecentLogs(limit: number = 100): Promise<LogEntry[]> {
    // Cette méthode pourrait être implémentée pour lire les logs depuis le fichier
    return this.logBuffer.slice(-limit);
  }

  // Nettoyage des logs
  async clearLogs(): Promise<void> {
    this.logBuffer = [];
    // Ici on pourrait aussi nettoyer les fichiers de logs
  }

  // Configuration
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Instance singleton
export const logger = new LoggerService();

// Export des types pour utilisation externe
export { LoggerService }; 