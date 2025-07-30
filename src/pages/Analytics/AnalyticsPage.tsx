import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Cpu, 
  HardDrive, 
  Network, 
  Clock,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Shield
} from 'lucide-react';
import './AnalyticsPage.css';

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState({
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
        icon: Shield,
        status: 'success'
      },
      {
        id: 2,
        type: 'performance',
        message: 'Optimisation CPU effectuée',
        time: '5 min',
        icon: Cpu,
        status: 'info'
      },
      {
        id: 3,
        type: 'network',
        message: 'Connexion réseau établie',
        time: '8 min',
        icon: Network,
        status: 'success'
      },
      {
        id: 4,
        type: 'storage',
        message: 'Nettoyage disque terminé',
        time: '12 min',
        icon: HardDrive,
        status: 'warning'
      }
    ],
    metrics: [
      {
        id: 1,
        title: 'Temps de réponse',
        value: '12ms',
        change: '+2.3%',
        trend: 'up',
        icon: Clock,
        color: 'emerald'
      },
      {
        id: 2,
        title: 'Efficacité énergétique',
        value: '94%',
        change: '+1.8%',
        trend: 'up',
        icon: Zap,
        color: 'amber'
      },
      {
        id: 3,
        title: 'Sécurité',
        value: '100%',
        change: '0%',
        trend: 'stable',
        icon: Shield,
        color: 'sapphire'
      },
      {
        id: 4,
        title: 'Objectifs atteints',
        value: '87%',
        change: '+5.2%',
        trend: 'up',
        icon: Target,
        color: 'purple'
      }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        systemPerformance: {
          cpu: Math.floor(Math.random() * 40 + 30),
          memory: Math.floor(Math.random() * 30 + 50),
          disk: Math.floor(Math.random() * 20 + 25),
          network: Math.floor(Math.random() * 20 + 70)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="analytics-page">
      {/* Header */}
      <motion.div 
        className="analytics-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="header-title">
            <BarChart3 className="header-icon" />
            <h1>Analytics & Rapports</h1>
          </div>
          <p className="header-subtitle">
            Analyses détaillées des performances système et métriques avancées
          </p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" title="Actualiser">
            <Activity size={20} />
          </button>
          <button className="export-btn" title="Exporter">
            <TrendingUp size={20} />
          </button>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div 
        className="performance-overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="section-title">
          <Activity size={24} />
          Vue d'ensemble des performances
        </h2>
        
        <div className="performance-grid">
          <div className="performance-card">
            <div className="performance-header">
              <Cpu size={24} />
              <span>CPU</span>
              {getTrendIcon(analyticsData.trends.cpu)}
            </div>
            <div className="performance-value">{analyticsData.systemPerformance.cpu}%</div>
            <div className="performance-bar">
              <div 
                className="performance-fill cpu-fill"
                style={{ width: `${analyticsData.systemPerformance.cpu}%` }}
              />
            </div>
          </div>

          <div className="performance-card">
            <div className="performance-header">
              <HardDrive size={24} />
              <span>Mémoire</span>
              {getTrendIcon(analyticsData.trends.memory)}
            </div>
            <div className="performance-value">{analyticsData.systemPerformance.memory}%</div>
            <div className="performance-bar">
              <div 
                className="performance-fill memory-fill"
                style={{ width: `${analyticsData.systemPerformance.memory}%` }}
              />
            </div>
          </div>

          <div className="performance-card">
            <div className="performance-header">
              <HardDrive size={24} />
              <span>Disque</span>
              {getTrendIcon(analyticsData.trends.disk)}
            </div>
            <div className="performance-value">{analyticsData.systemPerformance.disk}%</div>
            <div className="performance-bar">
              <div 
                className="performance-fill disk-fill"
                style={{ width: `${analyticsData.systemPerformance.disk}%` }}
              />
            </div>
          </div>

          <div className="performance-card">
            <div className="performance-header">
              <Network size={24} />
              <span>Réseau</span>
              {getTrendIcon(analyticsData.trends.network)}
            </div>
            <div className="performance-value">{analyticsData.systemPerformance.network}%</div>
            <div className="performance-bar">
              <div 
                className="performance-fill network-fill"
                style={{ width: `${analyticsData.systemPerformance.network}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div 
        className="metrics-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="section-title">
          <Target size={24} />
          Métriques clés
        </h2>
        
        <div className="metrics-grid">
          {analyticsData.metrics.map((metric) => (
            <div key={metric.id} className="metric-card">
              <div className="metric-header">
                <metric.icon size={24} className={`metric-icon ${metric.color}`} />
                <div className="metric-trend">
                  {getTrendIcon(metric.trend)}
                  <span className={`trend-value ${metric.trend}`}>{metric.change}</span>
                </div>
              </div>
              <div className="metric-content">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-title">{metric.title}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="activity-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="section-title">
          <Clock size={24} />
          Activité récente
        </h2>
        
        <div className="activity-list">
          {analyticsData.recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div 
                className="activity-icon"
                style={{ backgroundColor: getStatusColor(activity.status) }}
              >
                <activity.icon size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-message">{activity.message}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
              <div className="activity-status">
                <div 
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor(activity.status) }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage; 