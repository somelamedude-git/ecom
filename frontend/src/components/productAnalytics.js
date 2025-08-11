import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, ShoppingCart, Package, TrendingUp, TrendingDown, Users, RotateCcw, BarChart3, PieChart, Activity } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductAnalytics = () => {
    const {product_id} = useParams(); 
  const [analytics, setAnalytics] = useState({
    views: 0,
    times_ordered: 0,
    added_to_cart: 0,
    average_age_customers: 0,
    times_returned: 0,
    order_ratio: 0,
    return_ratio: 0,
    cart_ratio: 0
  });
  const [product, setProduct] = useState({
    name: '',
    price: 0
  });
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/seller/${product_id}/analytics`,
        {withCredentials: true}
      );
      setAnalytics(response.data.analytics);
      setProduct(response.data.info);
      setLoading(false);
    } catch (error) {
        console.log('Ive entered here');
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  fetchAnalytics();
}, [product_id]);

  const formatPercentage = (ratio) => {
    return `${(ratio * 100).toFixed(1)}%`;
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const getPerformanceColor = (ratio, type) => {
    if (type === 'positive') {
      return ratio > 0.3 ? '#10b981' : ratio > 0.15 ? '#f59e0b' : '#ef4444';
    } else {
      return ratio < 0.05 ? '#10b981' : ratio < 0.15 ? '#f59e0b' : '#ef4444';
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-main">
          <div className="loading">
            <Activity className="animate-pulse mb-4" size={48} />
            Loading analytics data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-main">
        {/* Header */}
        <button className="backb">
          <ArrowLeft size={20} />
          Back to Products
        </button>

        {/* Product Info Header */}
        <div className="profileheader">
          <div className="profileinfo">
            <div className="avatar">
              <Package size={40} color="#000" />
            </div>
            <div>
              <h1 className="profilename">{product.name}</h1>
              <p className="username">${product.price}</p>
              <p className="membersince">Analytics Dashboard</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="profilestats">
          <div className="statcard">
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Eye size={24} color="#000" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', marginBottom: '4px' }}>
              {formatNumber(analytics.views)}
            </div>
            <h3>Total views</h3>
          </div>

          <div className="statcard">
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <ShoppingCart size={24} color="#000" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', marginBottom: '4px' }}>
              {formatNumber(analytics.times_ordered)}
            </div>
            <h3>Orders</h3>
          </div>

          <div className="statcard">
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Package size={24} color="#000" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', marginBottom: '4px' }}>
              {formatNumber(analytics.added_to_cart)}
            </div>
            <h3>Added to Cart</h3>
          </div>

          <div className="statcard">
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Users size={24} color="#000" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', marginBottom: '4px' }}>
              {analytics.average_age_customers.toFixed(1)}
            </div>
            <h3>Avg Customer Age</h3>
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="profilesec">
          <div className="secheader">
            <h2>
              <TrendingUp size={20} />
              Conversion Metrics
            </h2>
          </div>
          <div className="infogrid">
            <div className="infoitem">
              <label>View to Cart Rate</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: getPerformanceColor(analytics.cart_ratio, 'positive')
                }}>
                  {formatPercentage(analytics.cart_ratio)}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#9ca3af',
                  background: '#1f2937',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {analytics.added_to_cart} / {analytics.views}
                </div>
              </div>
            </div>

            <div className="infoitem">
              <label>Cart to Order Rate</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: getPerformanceColor(analytics.order_ratio, 'positive')
                }}>
                  {formatPercentage(analytics.order_ratio)}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#9ca3af',
                  background: '#1f2937',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {analytics.times_ordered} / {analytics.added_to_cart}
                </div>
              </div>
            </div>

            <div className="infoitem">
              <label>Return Rate</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: getPerformanceColor(analytics.return_ratio, 'negative')
                }}>
                  {formatPercentage(analytics.return_ratio)}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#9ca3af',
                  background: '#1f2937',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {analytics.times_returned} / {analytics.times_ordered}
                </div>
              </div>
            </div>

            <div className="infoitem">
              <label>Overall Conversion</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: getPerformanceColor(analytics.views > 0 ? analytics.times_ordered / analytics.views : 0, 'positive')
                }}>
                  {formatPercentage(analytics.views > 0 ? analytics.times_ordered / analytics.views : 0)}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#9ca3af',
                  background: '#1f2937',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  Views → Orders
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="profilesec">
          <div className="secheader">
            <h2>
              <BarChart3 size={20} />
              Performance Insights
            </h2>
          </div>
          <div className="list">
            <div className="listitem" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                <TrendingUp size={16} />
                <strong>Strong Point</strong>
              </div>
              <p style={{ margin: 0, color: '#d1d5db', fontSize: '14px' }}>
                {analytics.cart_ratio > 0.1 
                  ? "Good view-to-cart conversion rate indicates attractive product presentation"
                  : analytics.order_ratio > 0.4
                  ? "High cart-to-order conversion shows strong purchase intent"
                  : "Low return rate indicates good product quality and customer satisfaction"
                }
              </p>
            </div>

            <div className="listitem" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
                <TrendingDown size={16} />
                <strong>Improvement Opportunity</strong>
              </div>
              <p style={{ margin: 0, color: '#d1d5db', fontSize: '14px' }}>
                {analytics.cart_ratio < 0.05 
                  ? "Low view-to-cart rate suggests need for better product images or descriptions"
                  : analytics.order_ratio < 0.3
                  ? "Cart abandonment rate is high - consider reviewing pricing or checkout process"
                  : analytics.return_ratio > 0.1
                  ? "Return rate is above average - review product quality or description accuracy"
                  : "Focus on increasing overall visibility to drive more views"
                }
              </p>
            </div>

            <div className="listitem" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6' }}>
                <RotateCcw size={16} />
                <strong>Returns Analysis</strong>
              </div>
              <p style={{ margin: 0, color: '#d1d5db', fontSize: '14px' }}>
                {analytics.times_returned} returns out of {analytics.times_ordered} orders. 
                {analytics.return_ratio < 0.05 ? " Excellent return rate!" : 
                 analytics.return_ratio < 0.1 ? " Good return rate." : 
                 " Consider reviewing product quality or descriptions."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="profilesec">
          <div className="secheader">
            <h2>
              <PieChart size={20} />
              Recommended Actions
            </h2>
            <button className="addb">
              Refresh Data
              {/* TODO: Connect refresh functionality to re-fetch analytics */}
            </button>
          </div>
          <div className="list">
            {analytics.cart_ratio < 0.1 && (
              <div className="listitem">
                <span>Optimize product images and descriptions to improve view-to-cart conversion</span>
                <span style={{ color: '#f59e0b' }}>High Priority</span>
              </div>
            )}
            {analytics.order_ratio < 0.4 && (
              <div className="listitem">
                <span>Review pricing strategy and checkout process to reduce cart abandonment</span>
                <span style={{ color: '#f59e0b' }}>Medium Priority</span>
              </div>
            )}
            {analytics.return_ratio > 0.1 && (
              <div className="listitem">
                <span>Investigate return reasons and improve product quality or descriptions</span>
                <span style={{ color: '#ef4444' }}>High Priority</span>
              </div>
            )}
            {analytics.views < 1000 && (
              <div className="listitem">
                <span>Increase marketing efforts to boost product visibility</span>
                <span style={{ color: '#8b5cf6' }}>Growth</span>
              </div>
            )}
            <div className="listitem">
              <span>Monitor competitor pricing and adjust strategy accordingly</span>
              <span style={{ color: '#6b7280' }}>Ongoing</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          background: #000;
          color: #fff;
          font-family: 'Inter', sans-serif;
        }

        .profile-main {
          max-width: 768px;
          margin: 0 auto;
          padding: 32px 16px;
        }

        .backb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 32px;
          transition: all 0.3s ease;
        }

        .backb:hover {
          background: linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .profileheader {
          background: #111827;
          border: 1px solid #374151;
          padding: 32px;
          border-radius: 16px;
          margin-bottom: 32px;
          box-shadow: 0 0 0 1px #1f2937;
        }

        .profileinfo {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .avatar {
          width: 96px;
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%);
          border-radius: 50%;
        }

        .profilename {
          font-size: 32px;
          font-weight: 700;
          color: #f9fafb;
          margin-bottom: 0;
        }

        .username {
          color: #d1d5db;
          font-size: 15px;
          font-weight: 500;
          margin: 4px 0;
          letter-spacing: 0.3px;
        }

        .membersince {
          color: #9ca3af;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .profilestats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .statcard {
          background: #111827;
          border: 1px solid #374151;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 1px #1f2937;
        }

        .statcard:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(251, 191, 36, 0.1);
        }

        .statcard h3 {
          margin-top: 12px;
          font-size: 18px;
          font-weight: 600;
          color: #f3f4f6;
        }

        .profilesec {
          background: #111827;
          border: 1px solid #374151;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 0 0 1px #1f2937;
        }

        .secheader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .secheader h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 600;
          color: #f9fafb;
        }

        .addb {
          background: none;
          border: none;
          color: #d1d5db;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.3s;
          font-size: 14px;
        }

        .addb:hover {
          color: #fff;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .listitem {
          background: #1f2937;
          padding: 16px;
          border-radius: 8px;
          color: #e5e7eb;
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          font-weight: 500;
          border: 1px solid #374151;
        }

        .infogrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .infoitem label {
          font-weight: 500;
          color: #d1d5db;
          margin-bottom: 8px;
          display: block;
          font-size: 14px;
        }

        .infoitem p {
          color: #f3f4f6;
          font-size: 15px;
          font-weight: 400;
        }

        .loading {
          padding: 100px;
          text-align: center;
          color: #9ca3af;
          font-size: 18px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductAnalytics;