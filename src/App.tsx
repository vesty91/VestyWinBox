import React, { useState } from 'react';
import VIPLayout from './components/Layout/VIPLayout';
import Dashboard from './pages/Dashboard/VIPDashboard';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import SoftwarePage from './pages/Software/SoftwarePage';
import PortableAppsPage from './pages/PortableApps/PortableAppsPage';
import FileConverter from './pages/FileConverter/FileConverter';
import NASExplorerPage from './pages/NasExplorer/NASExplorerPage';
import GodModePage from './pages/GodMode/GodModePage';
import { ToastProvider } from './components/ui/toast';
import './styles/globals.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'software':
        return <SoftwarePage />;
      case 'portable-apps':
        return <PortableAppsPage />;
      case 'file-converter':
        return <FileConverter />;
      case 'nas-explorer':
        return <NASExplorerPage />;
      case 'godmode':
        return <GodModePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ToastProvider>
      <div className="app">
        <VIPLayout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderPage()}
        </VIPLayout>
      </div>
    </ToastProvider>
  );
};

export default App;