import React, { lazy, Suspense } from 'react';

// Composant de chargement optimisé
const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Chargement...</p>
  </div>
);

// Boundary d'erreur pour le lazy loading
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erreur de chargement lazy:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>Erreur de chargement</h3>
          <p>Impossible de charger le composant demandé.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper pour le lazy loading avec gestion d'erreurs
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = lazy(importFunc);
  const FallbackComponent = fallback || LoadingSpinner;

  return (props: P) => (
    <LazyErrorBoundary>
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
};

// Composants lazy avec optimisations
export const AnalyticsPage = withLazyLoading(
  () => import('../pages/Analytics/AnalyticsPage'),
  () => (
    <div className="page-loading">
      <div className="loading-animation">
        <div className="chart-icon">📊</div>
        <p>Chargement des Analytics...</p>
      </div>
    </div>
  )
);

export const GodModePage = withLazyLoading(
  () => import('../pages/GodMode/GodModePage'),
  () => (
    <div className="page-loading">
      <div className="loading-animation">
        <div className="godmode-icon">⚡</div>
        <p>Chargement du GodMode...</p>
      </div>
    </div>
  )
);

export const DashboardPage = withLazyLoading(
  () => import('../pages/Dashboard/VIPDashboard'),
  () => (
    <div className="page-loading">
      <div className="loading-animation">
        <div className="dashboard-icon">🏠</div>
        <p>Chargement du Dashboard...</p>
      </div>
    </div>
  )
);

export const PortableAppsPage = withLazyLoading(
  () => import('../pages/PortableApps/PortableAppsPage'),
  () => (
    <div className="page-loading">
      <div className="loading-animation">
        <div className="apps-icon">📱</div>
        <p>Chargement des Applications...</p>
      </div>
    </div>
  )
);

export const SoftwarePage = withLazyLoading(
  () => import('../pages/Software/SoftwarePage'),
  () => (
    <div className="page-loading">
      <div className="loading-animation">
        <div className="software-icon">💾</div>
        <p>Chargement du Logiciel...</p>
      </div>
    </div>
  )
);

// Composants modaux lazy
export const BackupModal = withLazyLoading(
  () => import('../components/BackupModal'),
  () => <div className="modal-loading">Chargement du modal...</div>
);

export const SystemCheckModal = withLazyLoading(
  () => import('../components/SystemCheckModal'),
  () => <div className="modal-loading">Chargement du modal...</div>
);

export const CleanupModal = withLazyLoading(
  () => import('../components/CleanupModal'),
  () => <div className="modal-loading">Chargement du modal...</div>
);

// Hook pour optimiser le chargement
export const useLazyLoad = (importFunc: () => Promise<any>) => {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error('Erreur de chargement lazy:', err);
      });
  }, [importFunc]);

  return { Component, loading, error };
};

// Optimisation des images
export const useImagePreload = (src: string) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = src;
  }, [src]);

  return { loaded, error };
};

// Cache pour les composants chargés
const componentCache = new Map<string, React.ComponentType>();

export const getCachedComponent = (key: string, importFunc: () => Promise<any>) => {
  if (componentCache.has(key)) {
    return componentCache.get(key)!;
  }

  const Component = withLazyLoading(importFunc);
  componentCache.set(key, Component);
  return Component;
}; 