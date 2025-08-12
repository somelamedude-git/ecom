import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import '../styles/Heatmap.css'

const SalesHeatmap = () => {
  const [salesData, setSalesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearUserJoined, setYearUserJoined] = useState(null); // Store join year in state
  const [stats, setStats] = useState({
    totalSales: 0,
    bestDay: null,
    currentStreak: 0,
    longestStreak: 0
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('api/seller/SalesMap', {
            withCredentials: true
        });

        setSalesData(response.data.salesByDate);
        calculateStats(response.data.salesByDate);
        setYearUserJoined(response.data.year_joined); // Store in state
        setError(null);
      } catch (err) {
        console.log('hi');
        setError('Failed to fetch sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedYear]);

  const calculateStats = (data) => {
    const dates = Object.keys(data);
    const totalSales = Object.values(data).reduce((sum, count) => sum + count, 0);
    
    const bestDay = dates.reduce((best, date) => 
      data[date] > (data[best] || 0) ? date : best, dates[0]);
    
    const sortedDates = dates.sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (data[today] || data[yesterday]) {
      let checkDate = new Date();
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (data[dateStr]) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = i > 0 ? new Date(sortedDates[i - 1]) : null;
      
      if (prevDate && (currentDate - prevDate) === 86400000) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    setStats({
      totalSales,
      bestDay: bestDay ? { date: bestDay, count: data[bestDay] } : null,
      currentStreak,
      longestStreak
    });
  };

  // Generate year options dynamically
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = yearUserJoined || currentYear; // Fallback to current year if join year not available
    const years = [];
    
    // Generate years from join year to current year
    for (let year = Math.min(startYear, currentYear); year <= currentYear; year++) {
      years.push(year);
    }
    
    return years.reverse(); // Show most recent years first
  };

  const getMonthlyMaxSales = (month, year) => {
    const monthData = Object.entries(salesData).filter(([date, count]) => {
      const dateObj = new Date(date);
      return dateObj.getMonth() === month && dateObj.getFullYear() === year;
    });
    
    if (monthData.length === 0) return 1; 
    return Math.max(...monthData.map(([date, count]) => count));
  };

  const getIntensityOpacity = (count, month, year) => {
    if (!count) return 0;
    const monthMax = getMonthlyMaxSales(month, year);
    const opacity = (count / monthMax);
    return Math.max(0.2, opacity); 
  };

  const getIntensityColor = (count, month, year) => {
    if (!count) {
      return 'rgba(55, 65, 81, 0.3)'; 
    }
    
    const opacity = getIntensityOpacity(count, month, year);
    return `rgba(250, 204, 21, ${opacity})`; // Yellow with dynamic opacity
  };

  const generateCalendarData = () => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    const weeks = [];
    
    const firstDay = new Date(startDate);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());
    
    let currentDate = new Date(firstDay);
    
    while (currentDate <= endDate || weeks.length === 0 || weeks[weeks.length - 1].length < 7) {
      if (weeks.length === 0 || weeks[weeks.length - 1].length === 7) {
        weeks.push([]);
      }
      
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = salesData[dateStr] || 0;
      const isCurrentYear = currentDate.getFullYear() === selectedYear;
      
      weeks[weeks.length - 1].push({
        date: new Date(currentDate),
        dateStr,
        count,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentYear
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return weeks;
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calendarData = generateCalendarData();
  const availableYears = generateYearOptions();

  return (
    <div className="heatmap-container">
      <div className="heatmap-main">
        <button className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="heatmap-hero">
          <h1 className="heatmap-title">
            Sales <span className="heatmap-highlight">Activity</span>
          </h1>
          <p className="heatmap-subtitle">
            Track your daily sales performance and identify patterns in your business activity.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalSales}</div>
              <div className="stat-label">Total Sales</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.bestDay?.count || 0}</div>
              <div className="stat-label">Best Day</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.currentStreak}</div>
              <div className="stat-label">Current Streak</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.longestStreak}</div>
              <div className="stat-label">Longest Streak</div>
            </div>
          </div>
        </div>

        <div className="year-selector">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="year-select"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="heatmap-status-msg">
            <div className="loading-spinner"></div>
            Loading sales data...
          </div>
        )}

        {error && (
          <div className="heatmap-error-msg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="calendar-container">
            {/* Month labels */}
            <div className="month-labels">
              {months.map((month, index) => (
                <div key={month} className="month-label">
                  {month}
                </div>
              ))}
            </div>

            <div className="calendar-wrapper">
              {/* Weekday labels */}
              <div className="weekday-labels">
                {weekdays.map((day, index) => (
                  <div key={day} className="weekday-label" style={{
                    visibility: index % 2 === 1 ? 'visible' : 'hidden'
                  }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="calendar-grid">
                {calendarData.map((week, weekIndex) => (
                  <div key={weekIndex} className="calendar-week">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`calendar-day ${!day.isCurrentYear ? 'other-year' : ''}`}
                        style={{
                          backgroundColor: day.isCurrentYear ? getIntensityColor(day.count, day.month, day.year) : 'transparent'
                        }}
                        onMouseEnter={() => setHoveredDate(day)}
                        onMouseLeave={() => setHoveredDate(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="calendar-legend">
              <span className="legend-label">Less</span>
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, index) => (
                <div
                  key={index}
                  className="legend-square"
                  style={{ 
                    backgroundColor: opacity === 0 ? 'rgba(55, 65, 81, 0.3)' : `rgba(250, 204, 21, ${opacity})` 
                  }}
                />
              ))}
              <span className="legend-label">More</span>
            </div>

            {/* Tooltip */}
            {hoveredDate && (
              <div className="tooltip">
                <div className="tooltip-date">{formatDate(hoveredDate.date)}</div>
                <div className="tooltip-count">
                  {hoveredDate.count} {hoveredDate.count === 1 ? 'sale' : 'sales'}
                </div>
                <div className="tooltip-intensity">
                  {hoveredDate.count > 0 && (
                    <span>
                      {Math.round(getIntensityOpacity(hoveredDate.count, hoveredDate.month, hoveredDate.year) * 100)}% of month's peak
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHeatmap;