// Types d'erreurs
export enum ErrorType {
  SYSTEM_COMMAND = 'SYSTEM_COMMAND',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  RESOURCE = 'RESOURCE',
  UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Interface pour les erreurs structurées
export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: unknown;
  timestamp: Date;
  stack?: string;
  context?: Record<string, unknown>;
}

// Classe principale de gestion d'erreurs
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 1000;
  private listeners: ((error: AppError) => void)[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Créer une nouvelle erreur
  createError(
    type: ErrorType,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    details?: unknown,
    context?: Record<string, unknown>
  ): AppError {
    const error: AppError = {
      id: this.generateErrorId(),
      type,
      severity,
      message,
      details,
      timestamp: new Date(),
      stack: new Error().stack,
      context
    };

    this.logError(error);
    this.notifyListeners(error);
    return error;
  }

  // Logger une erreur
  private logError(error: AppError): void {
    this.errorLog.push(error);
    
    // Limiter la taille du log
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log dans la console avec formatage
    const logMessage = this.formatLogMessage(error);
    
    switch (error.severity) {
      case ErrorSeverity.LOW:
        console.log(logMessage);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(logMessage);
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        console.error(logMessage);
        break;
    }
  }

  // Formater le message de log
  private formatLogMessage(error: AppError): string {
    const timestamp = error.timestamp.toISOString();
    const severity = `[${error.severity}]`;
    const type = `[${error.type}]`;
    const id = `[${error.id}]`;
    
    let message = `${timestamp} ${severity} ${type} ${id} ${error.message}`;
    
    if (error.details) {
      message += `\nDetails: ${JSON.stringify(error.details, null, 2)}`;
    }
    
    if (error.context) {
      message += `\nContext: ${JSON.stringify(error.context, null, 2)}`;
    }
    
    return message;
  }

  // Générer un ID unique pour l'erreur
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Notifier les listeners
  private notifyListeners(error: AppError): void {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Erreur dans le listener:', listenerError);
      }
    });
  }

  // Ajouter un listener
  addListener(listener: (error: AppError) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Obtenir le log d'erreurs
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  // Obtenir les erreurs par type
  getErrorsByType(type: ErrorType): AppError[] {
    return this.errorLog.filter(error => error.type === type);
  }

  // Obtenir les erreurs par sévérité
  getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
    return this.errorLog.filter(error => error.severity === severity);
  }

  // Vider le log d'erreurs
  clearErrorLog(): void {
    this.errorLog = [];
  }

  // Exporter le log d'erreurs
  exportErrorLog(): string {
    return JSON.stringify(this.errorLog, null, 2);
  }
}

// Wrapper pour les commandes système avec gestion d'erreurs
export const executeSystemCommandWithErrorHandling = async (
  command: string,
  args?: string[]
): Promise<{ success: boolean; result?: unknown; error?: AppError }> => {
  const errorHandler = ErrorHandler.getInstance();
  
  try {
    if (!window.electronAPI?.executeSystemCommand) {
      throw new Error('API Electron non disponible');
    }

    const result = await window.electronAPI.executeSystemCommand(command, args);
    
    if (!result.success) {
      const error = errorHandler.createError(
        ErrorType.SYSTEM_COMMAND,
        `Échec de l'exécution de la commande: ${command}`,
        ErrorSeverity.HIGH,
        { command, args, result },
        { timestamp: new Date().toISOString() }
      );
      
      return { success: false, error };
    }

    return { success: true, result };
  } catch (error) {
    const appError = errorHandler.createError(
      ErrorType.SYSTEM_COMMAND,
      `Erreur lors de l'exécution de la commande: ${command}`,
      ErrorSeverity.CRITICAL,
      { command, args, originalError: error },
      { timestamp: new Date().toISOString() }
    );
    
    return { success: false, error: appError };
  }
};

// Wrapper pour les opérations de sauvegarde
export const backupOperationWithErrorHandling = async (
  operation: () => Promise<unknown>,
  context: string
): Promise<{ success: boolean; result?: unknown; error?: AppError }> => {
  const errorHandler = ErrorHandler.getInstance();
  
  try {
    const result = await operation();
    return { success: true, result };
  } catch (error) {
    const appError = errorHandler.createError(
      ErrorType.RESOURCE,
      `Erreur lors de l'opération de sauvegarde: ${context}`,
      ErrorSeverity.HIGH,
      { context, originalError: error },
      { timestamp: new Date().toISOString() }
    );
    
    return { success: false, error: appError };
  }
};

// Validation des entrées utilisateur
export const validateUserInput = (
  input: unknown,
  rules: {
    required?: boolean;
    type?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => boolean;
  }
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const errorHandler = ErrorHandler.getInstance();

  try {
    // Validation required
    if (rules.required && (!input || input === '')) {
      errors.push('Ce champ est requis');
    }

    // Validation type
    if (rules.type && input !== null && input !== undefined) {
      if (rules.type === 'string' && typeof input !== 'string') {
        errors.push('Le type attendu est une chaîne de caractères');
      }
      if (rules.type === 'number' && typeof input !== 'number') {
        errors.push('Le type attendu est un nombre');
      }
    }

    // Validation longueur
    if (typeof input === 'string') {
      if (rules.minLength && input.length < rules.minLength) {
        errors.push(`Longueur minimale: ${rules.minLength} caractères`);
      }
      if (rules.maxLength && input.length > rules.maxLength) {
        errors.push(`Longueur maximale: ${rules.maxLength} caractères`);
      }
    }

    // Validation pattern
    if (rules.pattern && typeof input === 'string' && !rules.pattern.test(input)) {
      errors.push('Format invalide');
    }

    // Validation personnalisée
    if (rules.custom && !rules.custom(input)) {
      errors.push('Validation personnalisée échouée');
    }

    if (errors.length > 0) {
      errorHandler.createError(
        ErrorType.VALIDATION,
        `Validation échouée pour l'entrée utilisateur`,
        ErrorSeverity.MEDIUM,
        { input, rules, errors },
        { timestamp: new Date().toISOString() }
      );
    }

    return { valid: errors.length === 0, errors };
  } catch (error) {
    const appError = errorHandler.createError(
      ErrorType.VALIDATION,
      'Erreur lors de la validation',
      ErrorSeverity.HIGH,
      { input, rules, originalError: error },
      { timestamp: new Date().toISOString() }
    );
    
    return { valid: false, errors: ['Erreur de validation'] };
  }
};

// Gestionnaire d'erreurs global pour les promesses non gérées
export const setupGlobalErrorHandling = (): void => {
  const errorHandler = ErrorHandler.getInstance();

  // Gestionnaire pour les erreurs non capturées
  window.addEventListener('error', (event) => {
    const appError = errorHandler.createError(
      ErrorType.UNKNOWN,
      'Erreur JavaScript non gérée',
      ErrorSeverity.CRITICAL,
      { 
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      },
      { timestamp: new Date().toISOString() }
    );
  });

  // Gestionnaire pour les promesses rejetées
  window.addEventListener('unhandledrejection', (event) => {
    const appError = errorHandler.createError(
      ErrorType.UNKNOWN,
      'Promesse rejetée non gérée',
      ErrorSeverity.HIGH,
      { 
        reason: event.reason,
        promise: event.promise
      },
      { timestamp: new Date().toISOString() }
    );
  });
};

// Hook React pour la gestion d'erreurs
export const useErrorHandler = () => {
  const errorHandler = ErrorHandler.getInstance();
  
  return {
    createError: errorHandler.createError.bind(errorHandler),
    getErrorLog: errorHandler.getErrorLog.bind(errorHandler),
    clearErrorLog: errorHandler.clearErrorLog.bind(errorHandler),
    exportErrorLog: errorHandler.exportErrorLog.bind(errorHandler),
    addListener: errorHandler.addListener.bind(errorHandler)
  };
}; 