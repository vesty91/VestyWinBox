import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Cpu, 
  HardDrive, 
  Network, 
  Clock,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Shield,
  Users,
  Globe,
  Database,
  Server,
  Monitor,
  Smartphone,
  Wifi,
  Battery,
  Thermometer,
  Gauge,
  PieChart,
  LineChart,
  BarChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Award,
  Trophy,
  Crown,
  Sparkles
} from 'lucide-react';
import { Spacer, Card } from "@heroui/react";
import './AnalyticsPage.css';

// Composant CustomCard avec HeroUI
const CustomCard = () => (
  <Card className="space-y-5 p-4 w-[200px]" radius="lg">
    <div className="bg-default-300 rounded-lg h-24" />
    <div className="space-y-3">
      <div className="bg-default-200 rounded-lg w-3/5 h-3" />
      <div className="bg-default-200 rounded-lg w-4/5 h-3" />
      <div className="bg-default-300 rounded-lg w-2/5 h-3" />
    </div>
  </Card>
);

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [analyticsData, setAnalyticsData] = useState({
    // Métriques principales
    mainMetrics: {
      systemHealth: 94,
      performance: 87,
      security: 100,
      efficiency: 92
    },
    
    // Performance système en temps réel
    systemPerformance: {
      cpu: { current: 45, average: 42, peak: 78 },
      memory: { current: 68, average: 65, peak: 89 },
      disk: { current: 32, average: 35, peak: 67 },
      network: { current: 85, average: 82, peak: 95 },
      gpu: { current: 23, average: 25, peak: 45 },
      temperature: { current: 42, average: 40, peak: 58 }
    },
    
    // Tendances
    trends: {
      cpu: { direction: 'up', value: 2.3, period: '1h' },
      memory: { direction: 'down', value: 1.8, period: '1h' },
      disk: { direction: 'up', value: 0.5, period: '1h' },
      network: { direction: 'up', value: 3.2, period: '1h' },
      gpu: { direction: 'stable', value: 0, period: '1h' },
      temperature: { direction: 'down', value: 1.2, period: '1h' }
    },
    
    // Activité récente
    recentActivity: [
      {
        id: 1,
        type: 'system',
        message: 'Mise à jour système terminée avec succès',
        time: '2 min',
        icon: Shield,
        status: 'success',
        priority: 'high',
        category: 'Sécurité'
      },
      {
        id: 2,
        type: 'performance',
        message: 'Optimisation CPU automatique effectuée',
        time: '5 min',
        icon: Cpu,
        status: 'info',
        priority: 'medium',
        category: 'Performance'
      },
      {
        id: 3,
        type: 'network',
        message: 'Connexion réseau haute vitesse établie',
        time: '8 min',
        icon: Network,
        status: 'success',
        priority: 'medium',
        category: 'Réseau'
      },
      {
        id: 4,
        type: 'storage',
        message: 'Nettoyage disque intelligent terminé',
        time: '12 min',
        icon: HardDrive,
        status: 'warning',
        priority: 'low',
        category: 'Stockage'
      },
      {
        id: 5,
        type: 'security',
        message: 'Scan antivirus en arrière-plan',
        time: '15 min',
        icon: Shield,
        status: 'info',
        priority: 'high',
        category: 'Sécurité'
      },
      {
        id: 6,
        type: 'energy',
        message: 'Mode économie d\'énergie activé',
        time: '18 min',
        icon: Zap,
        status: 'success',
        priority: 'low',
        category: 'Énergie'
      }
    ],
    
    // Métriques détaillées
    detailedMetrics: [
      {
        id: 1,
        title: 'Temps de réponse',
        value: '12ms',
        change: '+2.3%',
        trend: 'up',
        icon: Clock,
        color: 'emerald',
        category: 'Performance',
        description: 'Temps de réponse moyen du système'
      },
      {
        id: 2,
        title: 'Efficacité énergétique',
        value: '94%',
        change: '+1.8%',
        trend: 'up',
        icon: Zap,
        color: 'amber',
        category: 'Énergie',
        description: 'Optimisation de la consommation'
      },
      {
        id: 3,
        title: 'Sécurité système',
        value: '100%',
        change: '0%',
        trend: 'stable',
        icon: Shield,
        color: 'sapphire',
        category: 'Sécurité',
        description: 'Niveau de protection maximal'
      },
      {
        id: 4,
        title: 'Objectifs atteints',
        value: '87%',
        change: '+5.2%',
        trend: 'up',
        icon: Target,
        color: 'purple',
        category: 'Objectifs',
        description: 'Taux de réussite des objectifs'
      },
      {
        id: 5,
        title: 'Utilisateurs actifs',
        value: '1,247',
        change: '+12.5%',
        trend: 'up',
        icon: Users,
        color: 'cyan',
        category: 'Utilisateurs',
        description: 'Nombre d\'utilisateurs connectés'
      },
      {
        id: 6,
        title: 'Trafic réseau',
        value: '2.4TB',
        change: '+8.7%',
        trend: 'up',
        icon: Globe,
        color: 'indigo',
        category: 'Réseau',
        description: 'Volume de données transférées'
      }
    ],
    
    // Graphiques et visualisations
    charts: {
      cpuHistory: [45, 42, 48, 51, 47, 43, 49, 52, 48, 45, 41, 44],
      memoryHistory: [68, 65, 72, 75, 70, 67, 73, 76, 71, 68, 64, 66],
      networkHistory: [85, 82, 88, 91, 87, 84, 90, 93, 89, 86, 82, 85],
      temperatureHistory: [42, 40, 45, 48, 44, 41, 46, 49, 45, 42, 39, 41]
    },
    
    // Alertes et notifications
    alerts: [
      {
        id: 1,
        type: 'warning',
        message: 'Utilisation CPU élevée détectée',
        time: '1 min',
        icon: AlertTriangle,
        priority: 'medium'
      },
      {
        id: 2,
        type: 'info',
        message: 'Mise à jour disponible',
        time: '5 min',
        icon: Info,
        priority: 'low'
      },
      {
        id: 3,
        type: 'success',
        message: 'Optimisation terminée',
        time: '10 min',
        icon: CheckCircle,
        priority: 'low'
      }
    ],
    
    // Statistiques avancées
    advancedStats: {
      uptime: '99.8%',
      totalProcesses: 156,
      activeConnections: 89,
      cacheHitRate: '94.2%',
      errorRate: '0.02%',
      throughput: '1.2GB/s'
    }
  });

  // Simulation des données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      
      setTimeout(() => {
        setAnalyticsData(prev => ({
          ...prev,
          systemPerformance: {
            cpu: { 
              current: Math.floor(Math.random() * 40 + 30), 
              average: prev.systemPerformance.cpu.average, 
              peak: Math.max(prev.systemPerformance.cpu.peak, Math.floor(Math.random() * 40 + 30))
            },
            memory: { 
              current: Math.floor(Math.random() * 30 + 50), 
              average: prev.systemPerformance.memory.average, 
              peak: Math.max(prev.systemPerformance.memory.peak, Math.floor(Math.random() * 30 + 50))
            },
            disk: { 
              current: Math.floor(Math.random() * 20 + 25), 
              average: prev.systemPerformance.disk.average, 
              peak: Math.max(prev.systemPerformance.disk.peak, Math.floor(Math.random() * 20 + 25))
            },
            network: { 
              current: Math.floor(Math.random() * 20 + 70), 
              average: prev.systemPerformance.network.average, 
              peak: Math.max(prev.systemPerformance.network.peak, Math.floor(Math.random() * 20 + 70))
            },
            gpu: { 
              current: Math.floor(Math.random() * 30 + 15), 
              average: prev.systemPerformance.gpu.average, 
              peak: Math.max(prev.systemPerformance.gpu.peak, Math.floor(Math.random() * 30 + 15))
            },
            temperature: { 
              current: Math.floor(Math.random() * 20 + 25), 
              average: prev.systemPerformance.temperature.average, 
              peak: Math.max(prev.systemPerformance.temperature.peak, Math.floor(Math.random() * 20 + 25))
            }
          }
        }));
        setIsRefreshing(false);
      }, 500);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp size={16} className="trend-up" />;
      case 'down':
        return <ArrowDown size={16} className="trend-down" />;
      default:
        return <Activity size={16} className="trend-stable" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'var(--vip-emerald)';
      case 'warning':
        return 'var(--vip-amber)';
      case 'error':
        return 'var(--vip-ruby)';
      default:
        return 'var(--vip-sapphire)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'var(--vip-ruby)';
      case 'medium':
        return 'var(--vip-amber)';
      case 'low':
        return 'var(--vip-emerald)';
      default:
        return 'var(--vip-sapphire)';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'network', label: 'Réseau', icon: Network },
    { id: 'storage', label: 'Stockage', icon: HardDrive },
    { id: 'energy', label: 'Énergie', icon: Zap }
  ];

  const timeRanges = [
    { value: '1h', label: '1 heure' },
    { value: '24h', label: '24 heures' },
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' }
  ];

  return (
    <div className="analytics-page">
      {/* Header Premium */}
      <motion.div 
        className="analytics-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-content">
          <div className="header-title">
            <motion.div
              className="header-icon-wrapper"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <BarChart3 className="header-icon" />
              <div className="icon-glow" />
            </motion.div>
            <div className="title-text">
              <h1>Analytics & Rapports Premium</h1>
              <p>Analyses avancées des performances système et métriques en temps réel</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{analyticsData.mainMetrics.systemHealth}%</span>
              <span className="stat-label">Santé système</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{analyticsData.advancedStats.uptime}</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{analyticsData.advancedStats.totalProcesses}</span>
              <span className="stat-label">Processus</span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="time-range-selector">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
              title="Sélectionner la période d'analyse"
              aria-label="Période d'analyse"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`} 
            title="Actualiser"
            onClick={() => setIsRefreshing(true)}
          >
            <RefreshCw size={20} />
          </button>
          
          <button className="export-btn" title="Exporter">
            <Download size={20} />
          </button>
          
          <button className="settings-btn" title="Paramètres">
            <Settings size={20} />
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div 
        className="analytics-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="tabs-container">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="tab-indicator"
                  layoutId="tab-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* HeroUI Custom Cards Section */}
      <motion.div 
        className="heroui-cards-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="section-title">
          <Sparkles size={24} />
          Cartes HeroUI
        </h2>
        
        <div className="heroui-cards-container">
          <div className="flex">
            <CustomCard />
            <Spacer x={4} />
            <CustomCard />
            <Spacer x={4} />
            <CustomCard />
          </div>
        </div>
      </motion.div>

      {/* Performance Overview - Section Premium */}
      <motion.div 
        className="performance-overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="section-header">
          <h2 className="section-title">
            <Activity size={24} />
            Vue d'ensemble des performances
          </h2>
          <div className="section-actions">
            <button className="view-btn">
              <Eye size={16} />
              Vue détaillée
            </button>
          </div>
        </div>
        
        <div className="performance-grid">
          {Object.entries(analyticsData.systemPerformance).map(([key, data]) => {
            const trend = analyticsData.trends[key as keyof typeof analyticsData.trends];
            const icons = { cpu: Cpu, memory: HardDrive, disk: HardDrive, network: Network, gpu: Monitor, temperature: Thermometer };
            const Icon = icons[key as keyof typeof icons];
            
            return (
              <motion.div 
                key={key}
                className="performance-card premium"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="performance-header">
                  <div className="performance-icon">
                    <Icon size={24} />
                  </div>
                  <div className="performance-info">
                    <span className="performance-label">
                      {key === 'cpu' ? 'CPU' : 
                       key === 'memory' ? 'Mémoire' : 
                       key === 'disk' ? 'Disque' : 
                       key === 'network' ? 'Réseau' : 
                       key === 'gpu' ? 'GPU' : 'Température'}
                    </span>
                    <div className="performance-trend">
                      {getTrendIcon(trend.direction)}
                      <span className={`trend-value ${trend.direction}`}>
                        {trend.value > 0 ? '+' : ''}{trend.value}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="performance-values">
                  <div className="current-value">{data.current}%</div>
                  <div className="stats-row">
                    <span className="stat">Moy: {data.average}%</span>
                    <span className="stat">Pic: {data.peak}%</span>
                  </div>
                </div>
                
                <div className="performance-bar">
                  <div 
                    className="performance-fill"
                    style={{ 
                      width: `${data.current}%`,
                      background: `linear-gradient(90deg, var(--vip-${key === 'temperature' ? 'ruby' : key === 'cpu' ? 'amber' : key === 'memory' ? 'sapphire' : key === 'network' ? 'emerald' : 'purple'}) 0%, var(--vip-${key === 'temperature' ? 'ruby' : key === 'cpu' ? 'amber' : key === 'memory' ? 'sapphire' : key === 'network' ? 'emerald' : 'purple'}-light) 100%)`
                    }}
                  />
                  <div className="performance-glow" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Metrics Grid - Version Premium */}
      <motion.div 
        className="metrics-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="section-header">
          <h2 className="section-title">
            <Target size={24} />
            Métriques avancées
          </h2>
          <div className="section-actions">
            <button className="filter-btn">
              <Filter size={16} />
              Filtrer
            </button>
          </div>
        </div>
        
        <div className="metrics-grid">
          {analyticsData.detailedMetrics.map((metric, index) => (
            <motion.div 
              key={metric.id} 
              className="metric-card premium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="metric-header">
                <div className="metric-icon-wrapper">
                  <metric.icon size={24} className={`metric-icon ${metric.color}`} />
                  <div className="icon-background" />
                </div>
                <div className="metric-trend">
                  {getTrendIcon(metric.trend)}
                  <span className={`trend-value ${metric.trend}`}>{metric.change}</span>
                </div>
              </div>
              
              <div className="metric-content">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-title">{metric.title}</div>
                <div className="metric-description">{metric.description}</div>
                <div className="metric-category">{metric.category}</div>
              </div>
              
              <div className="metric-glow" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity - Version Premium */}
      <motion.div 
        className="activity-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="section-header">
          <h2 className="section-title">
            <Clock size={24} />
            Activité récente
          </h2>
          <div className="section-actions">
            <button className="view-all-btn">
              Voir tout
            </button>
          </div>
        </div>
        
        <div className="activity-list">
          {analyticsData.recentActivity.map((activity, index) => (
            <motion.div 
              key={activity.id} 
              className="activity-item premium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ x: 5, scale: 1.02 }}
            >
              <div className="activity-priority" style={{ backgroundColor: getPriorityColor(activity.priority) }} />
              
              <div 
                className="activity-icon"
                style={{ backgroundColor: getStatusColor(activity.status) }}
              >
                <activity.icon size={16} />
              </div>
              
              <div className="activity-content">
                <div className="activity-header">
                  <div className="activity-message">{activity.message}</div>
                  <div className="activity-category">{activity.category}</div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
              
              <div className="activity-status">
                <div 
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor(activity.status) }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Alerts Section */}
      <motion.div 
        className="alerts-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="section-header">
          <h2 className="section-title">
            <AlertTriangle size={24} />
            Alertes et notifications
          </h2>
        </div>
        
        <div className="alerts-grid">
          {analyticsData.alerts.map((alert, index) => (
            <motion.div 
              key={alert.id} 
              className={`alert-card ${alert.type}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="alert-icon">
                <alert.icon size={20} />
              </div>
              <div className="alert-content">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-time">{alert.time}</div>
              </div>
              <div className="alert-priority" style={{ backgroundColor: getPriorityColor(alert.priority) }} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Advanced Stats Footer */}
      <motion.div 
        className="advanced-stats-footer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Trophy size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.advancedStats.uptime}</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Database size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.advancedStats.totalProcesses}</div>
              <div className="stat-label">Processus</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Wifi size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.advancedStats.activeConnections}</div>
              <div className="stat-label">Connexions</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Gauge size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.advancedStats.cacheHitRate}</div>
              <div className="stat-label">Cache Hit Rate</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <AlertTriangle size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.advancedStats.errorRate}</div>
              <div className="stat-label">Taux d'erreur</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.advancedStats.throughput}</div>
              <div className="stat-label">Débit</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage; 