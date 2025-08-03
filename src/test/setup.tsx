import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Déclaration globale pour TypeScript
declare global {
  var ResizeObserver: typeof ResizeObserver;
}

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
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => 
      React.createElement('div', props, children),
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => 
      React.createElement('button', props, children),
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => 
      React.createElement('span', props, children),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren<Record<string, unknown>>) => children,
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
  Sparkles: () => React.createElement('div', { 'data-testid': 'sparkles-icon' }, 'Sparkles'),
  Server: () => React.createElement('div', { 'data-testid': 'server-icon' }, 'Server'),
  Database: () => React.createElement('div', { 'data-testid': 'database-icon' }, 'Database'),
  Globe: () => React.createElement('div', { 'data-testid': 'globe-icon' }, 'Globe'),
  Wifi: () => React.createElement('div', { 'data-testid': 'wifi-icon' }, 'Wifi'),
  Printer: () => React.createElement('div', { 'data-testid': 'printer-icon' }, 'Printer'),
  Users: () => React.createElement('div', { 'data-testid': 'users-icon' }, 'Users'),
  User: () => React.createElement('div', { 'data-testid': 'user-icon' }, 'User'),
  Palette: () => React.createElement('div', { 'data-testid': 'palette-icon' }, 'Palette'),
  Calendar: () => React.createElement('div', { 'data-testid': 'calendar-icon' }, 'Calendar'),
  Languages: () => React.createElement('div', { 'data-testid': 'languages-icon' }, 'Languages'),
  Package: () => React.createElement('div', { 'data-testid': 'package-icon' }, 'Package'),
  Command: () => React.createElement('div', { 'data-testid': 'command-icon' }, 'Command'),
  Terminal: () => React.createElement('div', { 'data-testid': 'terminal-icon' }, 'Terminal'),
  Gauge: () => React.createElement('div', { 'data-testid': 'gauge-icon' }, 'Gauge'),
  BarChart: () => React.createElement('div', { 'data-testid': 'barchart-icon' }, 'BarChart'),
  Settings2: () => React.createElement('div', { 'data-testid': 'settings2-icon' }, 'Settings2'),
  FileText: () => React.createElement('div', { 'data-testid': 'filetext-icon' }, 'FileText'),
  MonitorSmartphone: () => React.createElement('div', { 'data-testid': 'monitorsmartphone-icon' }, 'MonitorSmartphone'),
  Power: () => React.createElement('div', { 'data-testid': 'power-icon' }, 'Power'),
  RotateCcw: () => React.createElement('div', { 'data-testid': 'rotateccw-icon' }, 'RotateCcw'),
  Trash2: () => React.createElement('div', { 'data-testid': 'trash2-icon' }, 'Trash2'),
  Star: () => React.createElement('div', { 'data-testid': 'star-icon' }, 'Star'),
  Ban: () => React.createElement('div', { 'data-testid': 'ban-icon' }, 'Ban'),
  Battery: () => React.createElement('div', { 'data-testid': 'battery-icon' }, 'Battery'),
  Lock: () => React.createElement('div', { 'data-testid': 'lock-icon' }, 'Lock'),
  Unlock: () => React.createElement('div', { 'data-testid': 'unlock-icon' }, 'Unlock'),
  Save: () => React.createElement('div', { 'data-testid': 'save-icon' }, 'Save'),
  CheckCircle: () => React.createElement('div', { 'data-testid': 'checkcircle-icon' }, 'CheckCircle'),
  AlertCircle: () => React.createElement('div', { 'data-testid': 'alertcircle-icon' }, 'AlertCircle'),
  Info: () => React.createElement('div', { 'data-testid': 'info-icon' }, 'Info'),
  X: () => React.createElement('div', { 'data-testid': 'x-icon' }, 'X'),
  Plus: () => React.createElement('div', { 'data-testid': 'plus-icon' }, 'Plus'),
  Minus: () => React.createElement('div', { 'data-testid': 'minus-icon' }, 'Minus'),
  ChevronDown: () => React.createElement('div', { 'data-testid': 'chevrondown-icon' }, 'ChevronDown'),
  ChevronUp: () => React.createElement('div', { 'data-testid': 'chevronup-icon' }, 'ChevronUp'),
  ChevronLeft: () => React.createElement('div', { 'data-testid': 'chevronleft-icon' }, 'ChevronLeft'),
  ChevronRight: () => React.createElement('div', { 'data-testid': 'chevronright-icon' }, 'ChevronRight'),
  Home: () => React.createElement('div', { 'data-testid': 'home-icon' }, 'Home'),
  Folder: () => React.createElement('div', { 'data-testid': 'folder-icon' }, 'Folder'),
  File: () => React.createElement('div', { 'data-testid': 'file-icon' }, 'File'),
  Download: () => React.createElement('div', { 'data-testid': 'download-icon' }, 'Download'),
  Upload: () => React.createElement('div', { 'data-testid': 'upload-icon' }, 'Upload'),
  RefreshCw: () => React.createElement('div', { 'data-testid': 'refreshcw-icon' }, 'RefreshCw'),
  ExternalLink: () => React.createElement('div', { 'data-testid': 'externallink-icon' }, 'ExternalLink'),
  Mail: () => React.createElement('div', { 'data-testid': 'mail-icon' }, 'Mail'),
  Phone: () => React.createElement('div', { 'data-testid': 'phone-icon' }, 'Phone'),
  MessageCircle: () => React.createElement('div', { 'data-testid': 'messagecircle-icon' }, 'MessageCircle'),
  Heart: () => React.createElement('div', { 'data-testid': 'heart-icon' }, 'Heart'),
  ThumbsUp: () => React.createElement('div', { 'data-testid': 'thumbsup-icon' }, 'ThumbsUp'),
  ThumbsDown: () => React.createElement('div', { 'data-testid': 'thumbsdown-icon' }, 'ThumbsDown'),
  Eye: () => React.createElement('div', { 'data-testid': 'eye-icon' }, 'Eye'),
  EyeOff: () => React.createElement('div', { 'data-testid': 'eyeoff-icon' }, 'EyeOff'),
  Sun: () => React.createElement('div', { 'data-testid': 'sun-icon' }, 'Sun'),
  Moon: () => React.createElement('div', { 'data-testid': 'moon-icon' }, 'Moon'),
  Volume2: () => React.createElement('div', { 'data-testid': 'volume2-icon' }, 'Volume2'),
  VolumeX: () => React.createElement('div', { 'data-testid': 'volumex-icon' }, 'VolumeX'),
  Play: () => React.createElement('div', { 'data-testid': 'play-icon' }, 'Play'),
  Pause: () => React.createElement('div', { 'data-testid': 'pause-icon' }, 'Pause'),
  Stop: () => React.createElement('div', { 'data-testid': 'stop-icon' }, 'Stop'),
  SkipBack: () => React.createElement('div', { 'data-testid': 'skipback-icon' }, 'SkipBack'),
  SkipForward: () => React.createElement('div', { 'data-testid': 'skipforward-icon' }, 'SkipForward'),
  Repeat: () => React.createElement('div', { 'data-testid': 'repeat-icon' }, 'Repeat'),
  Shuffle: () => React.createElement('div', { 'data-testid': 'shuffle-icon' }, 'Shuffle'),
  Volume: () => React.createElement('div', { 'data-testid': 'volume-icon' }, 'Volume'),
  Volume1: () => React.createElement('div', { 'data-testid': 'volume1-icon' }, 'Volume1'),
  Mic: () => React.createElement('div', { 'data-testid': 'mic-icon' }, 'Mic'),
  MicOff: () => React.createElement('div', { 'data-testid': 'micoff-icon' }, 'MicOff'),
  Video: () => React.createElement('div', { 'data-testid': 'video-icon' }, 'Video'),
  VideoOff: () => React.createElement('div', { 'data-testid': 'videooff-icon' }, 'VideoOff'),
  Camera: () => React.createElement('div', { 'data-testid': 'camera-icon' }, 'Camera'),
  CameraOff: () => React.createElement('div', { 'data-testid': 'cameraoff-icon' }, 'CameraOff'),
  Image: () => React.createElement('div', { 'data-testid': 'image-icon' }, 'Image'),
  Music: () => React.createElement('div', { 'data-testid': 'music-icon' }, 'Music'),
  Headphones: () => React.createElement('div', { 'data-testid': 'headphones-icon' }, 'Headphones'),
  Speaker: () => React.createElement('div', { 'data-testid': 'speaker-icon' }, 'Speaker'),
  Gamepad2: () => React.createElement('div', { 'data-testid': 'gamepad2-icon' }, 'Gamepad2'),
  Controller: () => React.createElement('div', { 'data-testid': 'controller-icon' }, 'Controller'),
  Mouse: () => React.createElement('div', { 'data-testid': 'mouse-icon' }, 'Mouse'),
  Keyboard: () => React.createElement('div', { 'data-testid': 'keyboard-icon' }, 'Keyboard'),
  Monitor: () => React.createElement('div', { 'data-testid': 'monitor-icon' }, 'Monitor'),
  Smartphone: () => React.createElement('div', { 'data-testid': 'smartphone-icon' }, 'Smartphone'),
  Tablet: () => React.createElement('div', { 'data-testid': 'tablet-icon' }, 'Tablet'),
  Laptop: () => React.createElement('div', { 'data-testid': 'laptop-icon' }, 'Laptop'),
  Desktop: () => React.createElement('div', { 'data-testid': 'desktop-icon' }, 'Desktop'),
  Server: () => React.createElement('div', { 'data-testid': 'server-icon' }, 'Server'),
  Database: () => React.createElement('div', { 'data-testid': 'database-icon' }, 'Database'),
  Cloud: () => React.createElement('div', { 'data-testid': 'cloud-icon' }, 'Cloud'),
  CloudOff: () => React.createElement('div', { 'data-testid': 'cloudoff-icon' }, 'CloudOff'),
  CloudRain: () => React.createElement('div', { 'data-testid': 'cloudrain-icon' }, 'CloudRain'),
  CloudSnow: () => React.createElement('div', { 'data-testid': 'cloudsnow-icon' }, 'CloudSnow'),
  CloudLightning: () => React.createElement('div', { 'data-testid': 'cloudlightning-icon' }, 'CloudLightning'),
  CloudDrizzle: () => React.createElement('div', { 'data-testid': 'clouddrizzle-icon' }, 'CloudDrizzle'),
  CloudFog: () => React.createElement('div', { 'data-testid': 'cloudfog-icon' }, 'CloudFog'),
  CloudHail: () => React.createElement('div', { 'data-testid': 'cloudhail-icon' }, 'CloudHail'),
  CloudSleet: () => React.createElement('div', { 'data-testid': 'cloudsleet-icon' }, 'CloudSleet'),
  CloudSun: () => React.createElement('div', { 'data-testid': 'cloudsun-icon' }, 'CloudSun'),
  CloudMoon: () => React.createElement('div', { 'data-testid': 'cloudmoon-icon' }, 'CloudMoon'),
  Wind: () => React.createElement('div', { 'data-testid': 'wind-icon' }, 'Wind'),
  Umbrella: () => React.createElement('div', { 'data-testid': 'umbrella-icon' }, 'Umbrella'),
  Droplets: () => React.createElement('div', { 'data-testid': 'droplets-icon' }, 'Droplets'),
  Thermometer: () => React.createElement('div', { 'data-testid': 'thermometer-icon' }, 'Thermometer'),
  ThermometerSnowflake: () => React.createElement('div', { 'data-testid': 'thermometersnowflake-icon' }, 'ThermometerSnowflake'),
  ThermometerSun: () => React.createElement('div', { 'data-testid': 'thermometersun-icon' }, 'ThermometerSun'),
  SunDim: () => React.createElement('div', { 'data-testid': 'sundim-icon' }, 'SunDim'),
  SunMedium: () => React.createElement('div', { 'data-testid': 'sunmedium-icon' }, 'SunMedium'),
  SunSnow: () => React.createElement('div', { 'data-testid': 'sunsnow-icon' }, 'SunSnow'),
  Moon: () => React.createElement('div', { 'data-testid': 'moon-icon' }, 'Moon'),
  Star: () => React.createElement('div', { 'data-testid': 'star-icon' }, 'Star'),
  StarOff: () => React.createElement('div', { 'data-testid': 'staroff-icon' }, 'StarOff'),
  StarHalf: () => React.createElement('div', { 'data-testid': 'starhalf-icon' }, 'StarHalf'),
  Sparkles: () => React.createElement('div', { 'data-testid': 'sparkles-icon' }, 'Sparkles'),
}));

// Mock pour HeroUI
vi.mock('@heroui/react', () => ({
  Spacer: ({ x }: { x: number }) => React.createElement('div', { style: { width: `${x * 0.25}rem` } }),
  Card: ({ children, className, radius }: React.PropsWithChildren<{ className?: string; radius?: string }>) => 
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