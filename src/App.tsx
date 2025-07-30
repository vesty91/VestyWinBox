import React, { useState } from 'react';
import VIPLayout from './components/Layout/VIPLayout';
import VIPDashboard from './pages/Dashboard/VIPDashboard';
import SoftwarePage from './pages/Software/SoftwarePage';
import PortableAppsPage from './pages/PortableApps/PortableAppsPage';
import NasExplorer from './pages/NasExplorer/NasExplorer';
import FileConverter from './pages/FileConverter/FileConverter';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import './styles/globals.css';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  const renderPage = () => {
      switch (activePage) {
        case 'dashboard':
        return <VIPDashboard />;
      case 'software':
        return <SoftwarePage />;
        case 'portable':
        return <PortableAppsPage />;
        case 'nas':
          return <NasExplorer />;
      case 'converter':
        return <FileConverter />;
      case 'analytics':
        return <AnalyticsPage />;
        default:
        return <VIPDashboard />;
    }
  };

  return (
    <VIPLayout activePage={activePage} onPageChange={handlePageChange}>
      {renderPage()}
    </VIPLayout>
  );
};

export default App;