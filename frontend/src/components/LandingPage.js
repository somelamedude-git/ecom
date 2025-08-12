import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Package, Users, DollarSign, Plus, BarChart3, ShoppingBag, Eye } from 'lucide-react';
import axios from 'axios';
import '../styles/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState('Buyer');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    storeViews: 0,
    recentOrders: []
  });

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('api/user/verifyLogin', {
        withCredentials: true
      });
      
      if (res.data.isLoggedIn) {
        setLoggedIn(true);
        setUserType(res.data.userType || 'Buyer');
        
        // Only fetch seller stats if user is a seller
        if (res.data.userType === 'Seller') {
          try {
            const statsRes = await axios.get('api/seller/stats', {
              withCredentials: true
            });
            setSellerStats(statsRes.data);
          } catch (statsError) {
            console.error('Error fetching seller stats:', statsError);
            // Set default values if stats fetch fails
            setSellerStats({
              totalProducts: 0,
              totalSales: 0,
              totalOrders: 0,
              pendingOrders: 0,
              monthlyRevenue: 0,
              storeViews: 0,
              recentOrders: []
            });
          }
        } else {
          // Reset seller stats for buyers
          setSellerStats({
            totalProducts: 0,
            totalSales: 0,
            totalOrders: 0,
            pendingOrders: 0,
            monthlyRevenue: 0,
            storeViews: 0,
            recentOrders: []
          });
        }
      } else {
        setLoggedIn(false);
        setUserType('Buyer');
        setSellerStats({
          totalProducts: 0,
          totalSales: 0,
          totalOrders: 0,
          pendingOrders: 0,
          monthlyRevenue: 0,
          storeViews: 0,
          recentOrders: []
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoggedIn(false);
      setUserType('Buyer');
      setSellerStats({
        totalProducts: 0,
        totalSales: 0,
        totalOrders: 0,
        pendingOrders: 0,
        monthlyRevenue: 0,
        storeViews: 0,
        recentOrders: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for route changes and check auth status
  useEffect(() => {
    fetchUserData();
  }, [location.pathname, fetchUserData]);

  // Listen for window focus events to update when user returns to the tab
  useEffect(() => {
    const handleFocus = () => {
      fetchUserData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchUserData]);

  // Listen for custom events (useful for immediate updates after login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      fetchUserData();
    };

    const handleStatsUpdate = () => {
      if (loggedIn && userType === 'Seller') {
        fetchUserData();
      }
    };

    window.addEventListener('authStatusChanged', handleAuthChange);
    window.addEventListener('sellerStatsUpdated', handleStatsUpdate);
    
    return () => {
      window.removeEventListener('authStatusChanged', handleAuthChange);
      window.removeEventListener('sellerStatsUpdated', handleStatsUpdate);
    };
  }, [fetchUserData, loggedIn, userType]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="landing-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)'
      }}>
        <div style={{
          color: '#f9fafb',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  // Buyer Landing Page
  const BuyerLandingPage = () => (
    <div className="landing-container">
      <main className="landinghero">
        <div className="herokaoverlay" />

        <div className="herocontent">
          <button className="herothingy" onClick={() => navigate('/products')}>
            Latest Collection 2025
          </button>

          <h1 className="heroheadline">
            <span className="headlinestatic">People are going to Stare -</span>
            <span className="headlinedynamic typing-animation">Make it Worth the While</span>
          </h1>

          <p className="herosubtit">
            Unveiling a fashion destination where trends blend seamlessly with your individual
            style aspirations. Discover today!
          </p>

          <div className="herocta">
            <button
              className="ctaprim"
              onClick={() => navigate('/products')}
            >
              New Collection
            </button>
            <button
              className="ctasec"
              onClick={() => navigate('/cart')}
            >
              View Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  // Seller Landing Page (Dashboard)
  const SellerLandingPage = () => (
    <div className="landing-container">
      <main className="landinghero" style={{ 
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)',
        minHeight: '100vh'
      }}>
        <div className="herokaoverlay" style={{ opacity: 0.3 }} />

        <div className="herocontent" style={{ maxWidth: '1200px', padding: '40px 20px' }}>
          {/* Welcome Section */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <button 
              className="herothingy" 
              style={{ 
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#000',
                fontWeight: '600'
              }}
            >
              Seller Dashboard
            </button>

            <h1 className="heroheadline" style={{ marginBottom: '20px' }}>
              <span className="headlinestatic">Welcome Back,</span>
              <span className="headlinedynamic typing-animation">Ready to Sell More?</span>
            </h1>

            <p className="herosubtit" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Manage your store, track sales, and grow your business with our comprehensive seller tools.
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '50px'
          }}>
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(251, 191, 36, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => navigate('/seller/products')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Package size={24} color="#fbbf24" />
                <h3 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  Total Products
                </h3>
              </div>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#fbbf24', margin: '8px 0' }}>
                {sellerStats.totalProducts || 0}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                Click to manage products
              </p>
            </div>

            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => navigate('/seller/analytics')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <DollarSign size={24} color="#22c55e" />
                <h3 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  Monthly Revenue
                </h3>
              </div>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e', margin: '8px 0' }}>
                ₹{(sellerStats.monthlyRevenue || 0).toLocaleString()}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                View detailed analytics
              </p>
            </div>

            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => navigate('/seller/orders')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <ShoppingBag size={24} color="#3b82f6" />
                <h3 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  Total Orders
                </h3>
              </div>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6', margin: '8px 0' }}>
                {sellerStats.totalOrders || 0}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                Manage your orders
              </p>
            </div>

            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => navigate('/seller/orders')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <TrendingUp size={24} color="#ef4444" />
                <h3 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  Pending Orders
                </h3>
              </div>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444', margin: '8px 0' }}>
                {sellerStats.pendingOrders || 0}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                Orders awaiting action
              </p>
            </div>
          </div>

          {/* Recent Activity Section */}
          {sellerStats.recentOrders && sellerStats.recentOrders.length > 0 && (
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '40px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ color: '#f9fafb', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                Recent Orders
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sellerStats.recentOrders.slice(0, 3).map((order, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(55, 65, 81, 0.5)',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <p style={{ color: '#f9fafb', margin: 0, fontWeight: '500' }}>
                        Order #{order.id}
                      </p>
                      <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>
                        {order.customerName}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#22c55e', margin: 0, fontWeight: '600' }}>
                        ₹{order.amount}
                      </p>
                      <p style={{ color: '#9ca3af', margin: 0, fontSize: '12px' }}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="herocta" style={{ 
            justifyContent: 'center', 
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              className="ctaprim"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600'
              }}
              onClick={() => navigate('/seller/add-product')}
            >
              <Plus size={20} />
              Add New Product
            </button>
            
            <button
              className="ctasec"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => navigate('/seller/analytics')}
            >
              <BarChart3 size={20} />
              View Analytics
            </button>

            <button
              className="ctasec"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => navigate('/seller/orders')}
            >
              <ShoppingBag size={20} />
              Manage Orders
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  // Return appropriate landing page based on user type
  if (!loggedIn) {
    return <BuyerLandingPage />;
  }

  return userType === 'Seller' ? <SellerLandingPage /> : <BuyerLandingPage />;
}

export default LandingPage;