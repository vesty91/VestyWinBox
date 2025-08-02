import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BackgroundGradientDemo from '../background-gradient-demo';

describe('BackgroundGradientDemo', () => {
  it('renders the component correctly', () => {
    render(<BackgroundGradientDemo />);
    
    expect(screen.getByText('VestyWinBox Analytics')).toBeInTheDocument();
  });

  it('displays the description text', () => {
    render(<BackgroundGradientDemo />);
    
    expect(screen.getByText(/Système d'analyse avancé/)).toBeInTheDocument();
  });

  it('renders the action button', () => {
    render(<BackgroundGradientDemo />);
    
    expect(screen.getByText('Voir les stats')).toBeInTheDocument();
  });

  it('displays the Live badge', () => {
    render(<BackgroundGradientDemo />);
    
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('has the monitor icon', () => {
    render(<BackgroundGradientDemo />);
    
    expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
  });

  it('has correct structure with gradient container', () => {
    render(<BackgroundGradientDemo />);
    
    const container = screen.getByText('VestyWinBox Analytics').closest('.group');
    expect(container).toBeInTheDocument();
  });
}); 