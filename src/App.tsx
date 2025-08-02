import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VIPLayout from './components/Layout/VIPLayout';
import VIPDashboard from './pages/Dashboard/VIPDashboard';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import SoftwarePage from './pages/Software/SoftwarePage';
import PortableAppsPage from './pages/PortableApps/PortableAppsPage';
import FileConverter from './pages/FileConverter/FileConverter';
import NASExplorerPage from './pages/NasExplorer/NASExplorerPage';
import GodModePage from './pages/GodMode/GodModePage';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import './App.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const renderPage = (page: string) => {
    switch (page) {
      case 'dashboard':
        return <VIPDashboard />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'software':
        return <SoftwarePage />;
      case 'portableapps':
        return <PortableAppsPage />;
      case 'fileconverter':
        return <FileConverter />;
      case 'nasexplorer':
        return <NASExplorerPage />;
      case 'godmode':
        return <GodModePage />;
      default:
        return <VIPDashboard />;
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="app">
          <VIPLayout currentPage={currentPage} onPageChange={setCurrentPage}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="page-content"
              >
                {renderPage(currentPage)}
              </motion.div>
            </AnimatePresence>
          </VIPLayout>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;