import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GodModePage from '../../pages/GodMode/GodModePage';

// Mock pour window.electronAPI
const mockElectronAPI = {
  executeSystemCommand: vi.fn(),
  openExternal: vi.fn(),
};

describe('GodMode Integration Tests', () => {
  beforeEach(() => {
    // Reset des mocks
    vi.clearAllMocks();
    
    // Mock window.electronAPI
    Object.defineProperty(window, 'electronAPI', {
      value: mockElectronAPI,
      writable: true,
    });
  });

  it('should render GodMode page title', () => {
    render(<GodModePage />);
    
    expect(screen.getByText('GodMode')).toBeInTheDocument();
    expect(screen.getByText('Super Panneau de Contrôle Moderne')).toBeInTheDocument();
  });

  it('should render search functionality', () => {
    render(<GodModePage />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un outil...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render category filters', () => {
    render(<GodModePage />);
    
    // Vérifier les boutons de catégorie
    expect(screen.getByText('Tous')).toBeInTheDocument();
    expect(screen.getByText('Système & Sécurité')).toBeInTheDocument();
    expect(screen.getByText('Réseau & Internet')).toBeInTheDocument();
    expect(screen.getByText('Matériel & Périphériques')).toBeInTheDocument();
  });

  it('should render system tools cards', () => {
    render(<GodModePage />);
    
    // Vérifier quelques outils système
    expect(screen.getByText('Gestionnaire de périphériques')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Pare-feu Windows')).toBeInTheDocument();
    expect(screen.getByText('Éditeur de registre')).toBeInTheDocument();
  });

  it('should filter tools by search', async () => {
    render(<GodModePage />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un outil...');
    
    // Rechercher "registre"
    fireEvent.change(searchInput, { target: { value: 'registre' } });
    
    await waitFor(() => {
      expect(screen.getByText('Éditeur de registre')).toBeInTheDocument();
      // Vérifier que d'autres outils ne sont pas visibles
      expect(screen.queryByText('Gestionnaire de périphériques')).not.toBeInTheDocument();
    });
  });

  it('should filter tools by category', async () => {
    render(<GodModePage />);
    
    const securityButton = screen.getByText('Système & Sécurité');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Gestionnaire de périphériques')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Pare-feu Windows')).toBeInTheDocument();
    });
  });

  it('should display tool descriptions', () => {
    render(<GodModePage />);
    
    // Vérifier que les descriptions sont affichées
    expect(screen.getByText('Gestion du matériel système')).toBeInTheDocument();
    expect(screen.getByText('Services système Windows')).toBeInTheDocument();
  });

  it('should show admin indicators', () => {
    render(<GodModePage />);
    
    // Vérifier les indicateurs administrateur
    const adminElements = screen.getAllByText('Admin');
    expect(adminElements.length).toBeGreaterThan(0);
  });

  it('should show priority indicators', () => {
    render(<GodModePage />);
    
    // Vérifier les indicateurs de priorité
    const priorityElements = screen.getAllByText('Haute');
    expect(priorityElements.length).toBeGreaterThan(0);
  });

  it('should have correct grid layout', () => {
    render(<GodModePage />);
    
    const gridContainer = screen.getByText('Gestionnaire de périphériques').closest('.godmode-grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('godmode-grid');
  });

  it('should display stats footer', () => {
    render(<GodModePage />);
    
    expect(screen.getByText('Outils disponibles')).toBeInTheDocument();
    expect(screen.getByText('Catégories')).toBeInTheDocument();
  });
}); 