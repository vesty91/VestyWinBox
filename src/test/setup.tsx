import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock pour window.electronAPI
Object.defineProperty(window, 'electronAPI', {
  value: {
    executeSystemCommand: vi.fn(),
    openExternal: vi.fn(),
    selectBackupFolder: vi.fn(),
    backupUserFolders: vi.fn(),
  },
  writable: true,
});

// Mock pour Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock pour les icônes Lucide
vi.mock('lucide-react', () => ({
  Search: () => React.createElement('div', { 'data-testid': 'search-icon' }, 'Search'),
  Settings: () => React.createElement('div', { 'data-testid': 'settings-icon' }, 'Settings'),
  Shield: () => React.createElement('div', { 'data-testid': 'shield-icon' }, 'Shield'),
  Monitor: () => React.createElement('div', { 'data-testid': 'monitor-icon' }, 'Monitor'),
  Activity: () => React.createElement('div', { 'data-testid': 'activity-icon' }, 'Activity'),
  Cpu: () => React.createElement('div', { 'data-testid': 'cpu-icon' }, 'Cpu'),
  HardDrive: () => React.createElement('div', { 'data-testid': 'harddrive-icon' }, 'HardDrive'),
  Network: () => React.createElement('div', { 'data-testid': 'network-icon' }, 'Network'),
  Clock: () => React.createElement('div', { 'data-testid': 'clock-icon' }, 'Clock'),
  ArrowUp: () => React.createElement('div', { 'data-testid': 'arrowup-icon' }, 'ArrowUp'),
  ArrowDown: () => React.createElement('div', { 'data-testid': 'arrowdown-icon' }, 'ArrowDown'),
  Target: () => React.createElement('div', { 'data-testid': 'target-icon' }, 'Target'),
  Zap: () => React.createElement('div', { 'data-testid': 'zap-icon' }, 'Zap'),
  BarChart3: () => React.createElement('div', { 'data-testid': 'barchart3-icon' }, 'BarChart3'),
  TrendingUp: () => React.createElement('div', { 'data-testid': 'trendingup-icon' }, 'TrendingUp'),
}));

// Mock pour HeroUI
vi.mock('@heroui/react', () => ({
  Spacer: ({ x }: { x: number }) => React.createElement('div', { style: { width: `${x * 0.25}rem` } }),
  Card: ({ children, className, radius }: any) => 
    React.createElement('div', { className: `card ${className} radius-${radius}` }, children),
}));

// Mock pour les modules CSS
vi.mock('*.css', () => ({}));
vi.mock('*.scss', () => ({}));

// Configuration globale pour les tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock pour matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}); 