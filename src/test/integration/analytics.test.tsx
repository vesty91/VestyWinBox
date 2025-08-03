import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalyticsPage from '../../pages/Analytics/AnalyticsPage';

describe('Analytics Integration Tests', () => {
  beforeEach(() => {
    // Reset des mocks
    vi.clearAllMocks();
  });

  it('should render Analytics page title', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Analytics & Rapports')).toBeInTheDocument();
    expect(screen.getByText(/Analyses détaillées des performances/)).toBeInTheDocument();
  });

  it('should render performance cards', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText('Mémoire')).toBeInTheDocument();
    expect(screen.getByText('Disque')).toBeInTheDocument();
    expect(screen.getByText('Réseau')).toBeInTheDocument();
  });

  it('should display performance values', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('45%')).toBeInTheDocument();
      expect(screen.getByText('68%')).toBeInTheDocument();
      expect(screen.getByText('32%')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });
  });

  it('should render metrics section', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Métriques clés')).toBeInTheDocument();
    expect(screen.getByText('Temps de réponse')).toBeInTheDocument();
    expect(screen.getByText('12ms')).toBeInTheDocument();
    expect(screen.getByText('+2.3%')).toBeInTheDocument();
  });

  it('should render activity section', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Activité récente')).toBeInTheDocument();
    expect(screen.getByText('Mise à jour système terminée')).toBeInTheDocument();
    expect(screen.getByText('2 min')).toBeInTheDocument();
  });

  it('should render background gradient component', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Composant Background Gradient')).toBeInTheDocument();
    expect(screen.getByText('VestyWinBox Analytics')).toBeInTheDocument();
    expect(screen.getByText('Système d\'analyse avancé')).toBeInTheDocument();
  });

  it('should render HeroUI cards', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Cartes HeroUI')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(<AnalyticsPage />);
    
    const refreshButton = screen.getByTitle('Actualiser');
    const exportButton = screen.getByTitle('Exporter');
    
    expect(refreshButton).toBeInTheDocument();
    expect(exportButton).toBeInTheDocument();
  });

  it('should display trend indicators', () => {
    render(<AnalyticsPage />);
    
    // Vérifier les indicateurs de tendance
    const trendElements = screen.getAllByText('+2.3%');
    expect(trendElements.length).toBeGreaterThan(0);
  });

  it('should have correct section structure', () => {
    render(<AnalyticsPage />);
    
    const sections = [
      'Composant Background Gradient',
      'Cartes HeroUI',
      'Vue d\'ensemble des performances',
      'Métriques clés',
      'Activité récente'
    ];
    
    sections.forEach(section => {
      expect(screen.getByText(section)).toBeInTheDocument();
    });
  });

  it('should display performance trends', () => {
    render(<AnalyticsPage />);
    
    // Vérifier les tendances de performance
    expect(screen.getByText('up')).toBeInTheDocument();
    expect(screen.getByText('down')).toBeInTheDocument();
  });

  it('should show activity status', () => {
    render(<AnalyticsPage />);
    
    // Vérifier le statut des activités
    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('should have responsive layout', () => {
    render(<AnalyticsPage />);
    
    const analyticsContainer = screen.getByText('Analytics & Rapports').closest('.analytics-page');
    expect(analyticsContainer).toBeInTheDocument();
  });
}); 