// Niveaux de log
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

// Interface pour les entrées de log
export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: Date;
  category: string;
  data?: unknown;
  context?: Record<string, unknown>;
  performance?: {
    duration?: number;
    memory?: number;
    cpu?: number;
  };
}

// Configuration du logger
export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  maxEntries: number;
  categories: string[];
}

// Classe principale du logger
export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private performanceMarks: Map<string, number> = new Map();
  private listeners: ((entry: LogEntry) => void)[] = [];

  private constructor() {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      enableRemote: false,
      maxEntries: 10000,
      categories: ['system', 'ui', 'performance', 'error', 'debug']
    };
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Configuration du logger
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    this.log(LogLevel.INFO, 'Logger configuré', 'system', { config: this.config });
  }

  // Méthodes de log principales
  debug(message: string, category: string = 'debug', data?: unknown, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, category, data, context);
  }

  info(message: string, category: string = 'info', data?: unknown, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, category, data, context);
  }

  warn(message: string, category: string = 'warn', data?: unknown, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, category, data, context);
  }

  error(message: string, category: string = 'error', data?: unknown, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, category, data, context);
  }

  critical(message: string, category: string = 'critical', data?: unknown, context?: Record<string, unknown>): void {
    this.log(LogLevel.CRITICAL, message, category, data, context);
  }

  // Méthode principale de log
  private log(
    level: LogLevel,
    message: string,
    category: string,
    data?: unknown,
    context?: Record<string, unknown>
  ): void {
    if (level < this.config.level) return;

    const entry: LogEntry = {
      id: this.generateLogId(),
      level,
      message,
      timestamp: new Date(),
      category,
      data,
      context,
      performance: this.getPerformanceData()
    };

    this.addLogEntry(entry);
    this.outputLog(entry);
  }

  // Ajouter une entrée de log
  private addLogEntry(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Limiter le nombre d'entrées
    if (this.logs.length > this.config.maxEntries) {
      this.logs = this.logs.slice(-this.config.maxEntries);
    }

    // Notifier les listeners
    this.notifyListeners(entry);
  }

  // Sortie du log
  private outputLog(entry: LogEntry): void {
    const formattedMessage = this.formatLogMessage(entry);

    if (this.config.enableConsole) {
      this.outputToConsole(entry, formattedMessage);
    }

    if (this.config.enableFile) {
      this.outputToFile(entry);
    }

    if (this.config.enableRemote) {
      this.outputToRemote(entry);
    }
  }

  // Formatage du message
  private formatLogMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level].padEnd(8);
    const category = `[${entry.category}]`.padEnd(12);
    const id = `[${entry.id}]`;
    
    let message = `${timestamp} ${level} ${category} ${id} ${entry.message}`;
    
    if (entry.data) {
      message += `\nData: ${JSON.stringify(entry.data, null, 2)}`;
    }
    
    if (entry.context) {
      message += `\nContext: ${JSON.stringify(entry.context, null, 2)}`;
    }
    
    if (entry.performance) {
      message += `\nPerformance: ${JSON.stringify(entry.performance, null, 2)}`;
    }
    
    return message;
  }

  // Sortie console
  private outputToConsole(entry: LogEntry, formattedMessage: string): void {
    const styles = {
      [LogLevel.DEBUG]: 'color: #6c757d; font-weight: bold;',
      [LogLevel.INFO]: 'color: #0d6efd; font-weight: bold;',
      [LogLevel.WARN]: 'color: #ffc107; font-weight: bold;',
      [LogLevel.ERROR]: 'color: #dc3545; font-weight: bold;',
      [LogLevel.CRITICAL]: 'color: #dc3545; font-weight: bold; background: #dc3545; color: white;'
    };

    console.group(`%c${LogLevel[entry.level]}`, styles[entry.level]);
    console.log(formattedMessage);
    console.groupEnd();
  }

  // Sortie fichier (simulation)
  private outputToFile(entry: LogEntry): void {
    // Dans un environnement Electron, on pourrait écrire dans un fichier
    // Pour l'instant, on simule avec localStorage
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(entry);
      localStorage.setItem('app_logs', JSON.stringify(logs.slice(-1000)));
    } catch (error) {
      console.error('Erreur lors de l\'écriture du log:', error);
    }
  }

  // Sortie remote (simulation)
  private outputToRemote(entry: LogEntry): void {
    // Envoi vers un service de logging distant
    // fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
  }

  // Performance monitoring
  startPerformanceMark(name: string): void {
    this.performanceMarks.set(name, window.performance.now());
    this.debug(`Performance mark started: ${name}`, 'performance');
  }

  endPerformanceMark(name: string): number | null {
    const startTime = this.performanceMarks.get(name);
    if (!startTime) {
      this.warn(`Performance mark not found: ${name}`, 'performance');
      return null;
    }

    const duration = window.performance.now() - startTime;
    this.performanceMarks.delete(name);
    
    this.info(`Performance mark ended: ${name}`, 'performance', { duration });
    return duration;
  }

  // Mesure de performance automatique
  measurePerformance<T>(name: string, operation: () => T | Promise<T>): T | Promise<T> {
    this.startPerformanceMark(name);
    
    try {
      const result = operation();
      
      if (result instanceof Promise) {
        return result.finally(() => this.endPerformanceMark(name));
      } else {
        this.endPerformanceMark(name);
        return result;
      }
    } catch (error) {
      this.endPerformanceMark(name);
      throw error;
    }
  }

  // Données de performance système
  private getPerformanceData(): LogEntry['performance'] {
    if ('performance' in window && 'memory' in window.performance) {
      const memory = (window.performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
      return {
        memory: memory.usedJSHeapSize,
        cpu: this.estimateCPUUsage()
      };
    }
    return {};
  }

  // Estimation de l'utilisation CPU
  private estimateCPUUsage(): number {
    // Simulation simple - dans un vrai environnement, on utiliserait des APIs système
    return Math.random() * 100;
  }

  // Génération d'ID unique
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Notifier les listeners
  private notifyListeners(entry: LogEntry): void {
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (error) {
        console.error('Erreur dans le listener de log:', error);
      }
    });
  }

  // Ajouter un listener
  addListener(listener: (entry: LogEntry) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Obtenir les logs
  getLogs(
    level?: LogLevel,
    category?: string,
    limit?: number
  ): LogEntry[] {
    let filteredLogs = this.logs;

    if (level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level >= level);
    }

    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }

    return filteredLogs;
  }

  // Exporter les logs
  exportLogs(format: 'json' | 'text' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    } else {
      return this.logs.map(entry => this.formatLogMessage(entry)).join('\n');
    }
  }

  // Vider les logs
  clearLogs(): void {
    this.logs = [];
    this.info('Logs vidés', 'system');
  }

  // Logs spécifiques pour les composants React
  logComponentLifecycle(componentName: string, lifecycle: string, props?: unknown): void {
    this.debug(
      `Component ${lifecycle}: ${componentName}`,
      'react',
      { lifecycle, componentName, props }
    );
  }

  // Logs pour les commandes système
  logSystemCommand(command: string, args?: string[], result?: unknown): void {
    this.info(
      `Commande système exécutée: ${command}`,
      'system',
      { command, args, result }
    );
  }

  // Logs pour les erreurs utilisateur
  logUserError(error: Error, context?: Record<string, unknown>): void {
    this.error(
      `Erreur utilisateur: ${error.message}`,
      'user',
      { error: error.stack, context }
    );
  }

  // Logs pour les performances UI
  logUIPerformance(operation: string, duration: number): void {
    this.info(
      `Performance UI: ${operation}`,
      'ui',
      { operation, duration }
    );
  }
}

// Instance globale du logger
export const logger = Logger.getInstance();

// Hook React pour le logging
export const useLogger = () => {
  return {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    critical: logger.critical.bind(logger),
    startPerformanceMark: logger.startPerformanceMark.bind(logger),
    endPerformanceMark: logger.endPerformanceMark.bind(logger),
    measurePerformance: logger.measurePerformance.bind(logger),
    logComponentLifecycle: logger.logComponentLifecycle.bind(logger)
  };
};

// Décorateur pour mesurer automatiquement les performances
export const withPerformanceLogging = <T extends (...args: unknown[]) => unknown>(
  name: string,
  fn: T
): T => {
  return ((...args: Parameters<T>) => {
    return logger.measurePerformance(name, () => fn(...args));
  }) as T;
};

// Initialisation du logger global
export const initializeLogger = (config?: Partial<LoggerConfig>): void => {
  if (config) {
    logger.configure(config);
  }
  
  logger.info('Logger initialisé', 'system', { 
    config: logger['config'],
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
}; 