import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log en mode développement seulement
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center bg-gradient-to-br from-red-900 to-red-800 h-full">
          <div className="bg-black/20 backdrop-blur-xl p-8 border border-red-500/20 rounded-2xl text-center">
            <h1 className="mb-4 font-bold text-white text-2xl">Erreur détectée</h1>
            <p className="mb-4 text-white/70">
              Une erreur s'est produite lors du chargement de cette page.
            </p>
            <div className="bg-red-500/20 mb-4 p-4 border border-red-500/30 rounded-xl">
              <p className="font-mono text-red-300 text-sm">
                {this.state.error?.message}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-white transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 