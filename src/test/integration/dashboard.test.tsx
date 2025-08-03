import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VIPDashboard from '../../pages/Dashboard/VIPDashboard';

// Mock pour window.electronAPI
const mockElectronAPI = {
  executeSystemCommand: vi.fn(),
  openExternal: vi.fn(),
  selectBackupFolder: vi.fn(),
  backupUserFolders: vi.fn(),
};

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    // Reset des mocks
    vi.clearAllMocks();
    
    // Mock window.electronAPI
    Object.defineProperty(window, 'electronAPI', {
      value: mockElectronAPI,
      writable: true,
    });
  });

  it('should render all quick action tiles', () => {
    render(<VIPDashboard />);
    
    // Vérifier que toutes les tuiles principales sont présentes
    expect(screen.getByText('Sauvegarder')).toBeInTheDocument();
    expect(screen.getByText('Intégrité')).toBeInTheDocument();
    expect(screen.getByText('Nettoyer')).toBeInTheDocument();
    expect(screen.getByText('Désactiver l\'UAC')).toBeInTheDocument();
    expect(screen.getByText('Options de Redémarrage')).toBeInTheDocument();
  });

  it('should render additional action tiles', () => {
    render(<VIPDashboard />);
    
    // Vérifier les tuiles supplémentaires
    expect(screen.getByText('Sauvegarder Favoris')).toBeInTheDocument();
    expect(screen.getByText('Désactiver Télémétrie')).toBeInTheDocument();
    expect(screen.getByText('Point de Restauration')).toBeInTheDocument();
    expect(screen.getByText('Activer GodMode')).toBeInTheDocument();
    expect(screen.getByText('Rapport Batterie')).toBeInTheDocument();
    expect(screen.getByText('Vérifier Secure Boot')).toBeInTheDocument();
  });

  it('should display current time', () => {
    render(<VIPDashboard />);
    
    // Vérifier que l'heure est affichée
    const timeElement = screen.getByText(/\d{1,2}:\d{2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });

  it('should have correct grid layout', () => {
    render(<VIPDashboard />);
    
    const gridContainer = screen.getByText('Sauvegarder').closest('.quick-actions-grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('quick-actions-grid');
  });

  it('should render logo correctly', () => {
    render(<VIPDashboard />);
    
    const logo = screen.getByAltText('VestyWinBox Logo');
    expect(logo).toBeInTheDocument();
  });

  it('should have responsive design classes', () => {
    render(<VIPDashboard />);
    
    const dashboard = screen.getByText('Sauvegarder').closest('.vip-dashboard');
    expect(dashboard).toBeInTheDocument();
    expect(dashboard).toHaveClass('vip-dashboard');
  });
}); 