import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalyticsPage from '../AnalyticsPage';

// Mock pour les données d'analytics
const mockAnalyticsData = {
  systemPerformance: {
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 85
  },
  trends: {
    cpu: 'up',
    memory: 'down',
    disk: 'up',
    network: 'up'
  },
  recentActivity: [
    {
      id: 1,
      type: 'system',
      message: 'Mise à jour système terminée',
      time: '2 min',
      icon: 'Shield',
      status: 'success'
    }
  ],
  metrics: [
    {
      id: 1,
      title: 'Temps de réponse',
      value: '12ms',
      change: '+2.3%',
      trend: 'up',
      icon: 'Clock',
      color: 'emerald'
    }
  ]
};

describe('AnalyticsPage', () => {
  beforeEach(() => {
    // Reset des mocks
    vi.clearAllMocks();
  });

  it('renders the page title correctly', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Analytics & Rapports')).toBeInTheDocument();
  });

  it('renders the page subtitle', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText(/Analyses détaillées des performances/)).toBeInTheDocument();
  });

  it('renders performance cards', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText('Mémoire')).toBeInTheDocument();
    expect(screen.getByText('Disque')).toBeInTheDocument();
    expect(screen.getByText('Réseau')).toBeInTheDocument();
  });

  it('renders metrics section', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Métriques clés')).toBeInTheDocument();
  });

  it('renders activity section', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Activité récente')).toBeInTheDocument();
  });

  it('renders background gradient section', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Composant Background Gradient')).toBeInTheDocument();
  });

  it('renders HeroUI cards section', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Cartes HeroUI')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<AnalyticsPage />);
    
    const refreshButton = screen.getByTitle('Actualiser');
    const exportButton = screen.getByTitle('Exporter');
    
    expect(refreshButton).toBeInTheDocument();
    expect(exportButton).toBeInTheDocument();
  });

  it('displays performance values', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('45%')).toBeInTheDocument();
      expect(screen.getByText('68%')).toBeInTheDocument();
      expect(screen.getByText('32%')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });
  });

  it('renders metric cards with correct data', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Temps de réponse')).toBeInTheDocument();
    expect(screen.getByText('12ms')).toBeInTheDocument();
    expect(screen.getByText('+2.3%')).toBeInTheDocument();
  });

  it('renders activity items', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Mise à jour système terminée')).toBeInTheDocument();
    expect(screen.getByText('2 min')).toBeInTheDocument();
  });

  it('has correct section structure', () => {
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
}); 