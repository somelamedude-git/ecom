import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Analytics.css';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    sessions: '0',
    newUsers: '0',
    activeUsers: '0',
    screenPageViews: '0',
    engagedSessions: '0',
    ecommercePurchases: '0',
    transactions: '0',
    itemsPurchased: '0',
    averageSessionDuration: '0',
    bounceRate: '0',
    engagementRate: '0',
  });

  const [chartData, setChartData] = useState({
    sessions: [],
    users: [],
    purchases: [],
    pageViews: [],
    engagementRate: [],
    bounceRate: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Fetch data from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = response.data;
        
        // Set current stats
        setStats(data);
        
        // Generate chart data based on current values
        const generateTrendData = (currentValue) => {
          const numValue = parseInt(currentValue.toString().replace(/[,%]/g, '')) || 0;
          const baseValue = numValue * 0.7;
          const increment = (numValue - baseValue) / 6;
          
          return Array.from({ length: 7 }, (_, i) => 
            Math.round(baseValue + (increment * i))
          );
        };

        const generatePercentageTrend = (currentPercentage) => {
          const numValue = parseFloat(currentPercentage.toString().replace('%', '')) || 0;
          const baseValue = numValue * 0.9;
          const increment = (numValue - baseValue) / 6;
          
          return Array.from({ length: 7 }, (_, i) => 
            parseFloat((baseValue + (increment * i)).toFixed(1))
          );
        };

        setChartData({
          sessions: generateTrendData(data.sessions),
          users: generateTrendData(data.newUsers),
          purchases: generateTrendData(data.ecommercePurchases),
          pageViews: generateTrendData(data.screenPageViews),
          engagementRate: generatePercentageTrend(data.engagementRate),
          bounceRate: generatePercentageTrend(data.bounceRate)
        });

      } catch (err) {
        console.error('Error fetching stats:', err);
        
        if (err.response) {
          const status = err.response.status;
          if (status === 401) {
            setError('Unauthorized - Please log in again');
          } else if (status === 403) {
            setError('Access denied - Admin privileges required');
          } else {
            setError(`Server error: ${err.response.data?.message || 'Something went wrong'}`);
          }
        } else if (err.request) {
          setError('Network error - Please check your connection');
        } else {
          setError(err.message || 'An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num) => {
    if (typeof num === 'string' && (num.includes('%') || num.includes('m') || num.includes('s'))) {
      return num;
    }
    const cleanNum = num.toString().replace(/[,%]/g, '');
    return parseInt(cleanNum).toLocaleString();
  };

  const refreshData = () => {
    window.location.reload();
  };

  // Chart Components
  const LineChart = ({ data, color, height = 200, showArea = false }) => {
    if (!data || data.length === 0) return <div className="chart-placeholder">No data available</div>;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 300;
      const y = height - ((value - minValue) / range) * (height - 40) - 20;
      return `${x},${y}`;
    }).join(' ');

    const areaPath = showArea ? `M 0,${height} L ${points.split(' ').map(p => p.split(',')[0] + ',' + p.split(',')[1]).join(' L ')} L 300,${height} Z` : '';

    return (
      <svg width="100%" height={height} viewBox={`0 0 300 ${height}`} className="chart-svg">
        {showArea && (
          <path
            d={areaPath}
            fill={`url(#gradient-${color.replace('#', '')})`}
            opacity="0.2"
          />
        )}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="chart-line"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 300;
          const y = height - ((value - minValue) / range) * (height - 40) - 20;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              className="chart-point"
              style={{ 
                filter: `drop-shadow(0 0 6px ${color})`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          );
        })}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const BarChart = ({ data, color, height = 200 }) => {
    if (!data || data.length === 0) return <div className="chart-placeholder">No data available</div>;
    
    const maxValue = Math.max(...data);
    const barWidth = 35;
    const spacing = 8;
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 300 ${height}`} className="chart-svg">
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * (height - 40);
          const x = index * (barWidth + spacing) + 10;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={height - 20}
                width={barWidth}
                height={barHeight}
                fill={`url(#barGradient-${color.replace('#', '')})`}
                rx="4"
                className="chart-bar"
                style={{ 
                  transformOrigin: `${x + barWidth/2}px ${height - 20}px`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
              <text
                x={x + barWidth/2}
                y={height - 5}
                textAnchor="middle"
                fill="#888"
                fontSize="10"
                fontWeight="500"
              >
                {weekLabels[index]}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id={`barGradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={`${color}80`} />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const DonutChart = ({ percentage, color, size = 120 }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    
    return (
      <div className="donut-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={circumference / 4}
            strokeLinecap="round"
            className="donut-circle"
            style={{ filter: `drop-shadow(0 0 10px ${color}40)` }}
          />
        </svg>
        <div className="donut-text">
          <div className="donut-percentage" style={{ color: color }}>
            {percentage}%
          </div>
        </div>
      </div>
    );
  };

  const metricCards = [
    { key: 'sessions', label: 'Sessions', icon: '👥', color: '#ffd700' },
    { key: 'newUsers', label: 'New Users', icon: '✨', color: '#ffed4a' },
    { key: 'activeUsers', label: 'Active Users', icon: '🔥', color: '#ffd700' },
    { key: 'screenPageViews', label: 'Page Views', icon: '👁️', color: '#ffed4a' },
    { key: 'engagedSessions', label: 'Engaged Sessions', icon: '💫', color: '#ffd700' },
    { key: 'ecommercePurchases', label: 'Purchases', icon: '🛒', color: '#ffed4a' },
    { key: 'transactions', label: 'Transactions', icon: '💳', color: '#ffd700' },
    { key: 'itemsPurchased', label: 'Items Sold', icon: '📦', color: '#ffed4a' },
    { key: 'averageSessionDuration', label: 'Avg. Duration', icon: '⏱️', color: '#ffd700' },
    { key: 'bounceRate', label: 'Bounce Rate', icon: '📈', color: '#ffed4a' },
    { key: 'engagementRate', label: 'Engagement', icon: '❤️', color: '#ffd700' },
  ];

  const LoadingSkeleton = () => (
    <div className="loading-skeleton" />
  );

  return (
    <div className="dashboard">
      {/* Animated background particles */}
      <div className="background-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="dashboard-container">
        {/* Header */}
        <div className="header">
          <div className="header-glow" />
          <h1 className="main-title">Analytics Dashboard</h1>
          <p className="subtitle">E-commerce Performance Metrics</p>
          <div className="date-badge">📅 Last 7 Days</div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Failed to Load Analytics Data</h3>
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={refreshData}>
              🔄 Retry
            </button>
          </div>
        )}

        {/* Loading State for Charts */}
        {loading && (
          <div className="charts-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="chart-card">
                <div className="chart-loading-skeleton" />
              </div>
            ))}
          </div>
        )}

        {/* Main Charts Section */}
        {!loading && !error && chartData.sessions.length > 0 && (
          <div className="charts-grid">
            {/* Sessions Chart */}
            <div className="chart-card">
              <h3 className="chart-title gold">👥 Sessions Trend</h3>
              <LineChart data={chartData.sessions} color="#ffd700" showArea={true} />
              <div className="chart-labels">
                {weekLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>

            {/* Users Chart */}
            <div className="chart-card">
              <h3 className="chart-title yellow">✨ New Users</h3>
              <BarChart data={chartData.users} color="#ffed4a" />
            </div>

            {/* Purchases Chart */}
            <div className="chart-card">
              <h3 className="chart-title gold">🛒 E-commerce Purchases</h3>
              <LineChart data={chartData.purchases} color="#ffd700" />
              <div className="chart-labels">
                {weekLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="chart-card engagement-card">
              <div className="engagement-section">
                <h3 className="chart-title yellow">Engagement Rate</h3>
                <DonutChart 
                  percentage={parseFloat(stats.engagementRate.toString().replace('%', '')) || 0} 
                  color="#ffed4a" 
                />
              </div>
              <div className="engagement-section">
                <h3 className="chart-title gold">Bounce Rate</h3>
                <DonutChart 
                  percentage={parseFloat(stats.bounceRate.toString().replace('%', '')) || 0} 
                  color="#ffd700" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid - REMOVED THE PROBLEMATIC metric-top-bar ELEMENT */}
        <div className="metrics-grid">
          {metricCards.map((metric, index) => (
            <div
              key={metric.key}
              className="metric-card"
              style={{
                animationDelay: `${index * 0.1}s`,
                '--metric-color': metric.color
              }}
            >
              {/* REMOVED THIS LINE COMPLETELY:
                  <div className="metric-top-bar" style={{ background: `linear-gradient(90deg, ${metric.color}, transparent)` }} />
              */}
              
              <div className="metric-header">
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-indicator">
                  <div className="indicator-dot" style={{ background: metric.color, boxShadow: `0 0 10px ${metric.color}` }} />
                </div>
              </div>
              
              <h3 className="metric-label">{metric.label}</h3>
              
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <div className="metric-value" style={{ color: metric.color, textShadow: `0 0 20px ${metric.color}40` }}>
                  {formatNumber(stats[metric.key])}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="footer">
          <p>🚀 Powered by Google Analytics 4 | Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;