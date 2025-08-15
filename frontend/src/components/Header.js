import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { User, ShoppingBag, Menu, Heart, Package, BarChart3, Plus, Store, Settings, Users, AlertTriangle, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/clique_logo.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Header.css';

function Header({ menumove }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loggedin, setLoggedin] = useState(false);
  const [userType, setUserType] = useState('Buyer');
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    reportedItems: 0,
    pendingReviews: 0
  });

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      const res_login_status = await axios.get('http://localhost:3000/user/verifyLogin', {
        withCredentials: true
      });
      
      if (res_login_status.data.isLoggedIn) {
        setLoggedin(true);
        setUserType(res_login_status.data.userType || 'Buyer'); 
        
        // Only fetch cart/wishlist data for buyers
        if (res_login_status.data.userType === 'Buyer') {
          const res_CWL = await axios.get('http://localhost:3000/user/getCWL', {
            withCredentials: true
          });
          setWishlistCount(res_CWL.data.wish_length);
          setCartCount(res_CWL.data.cart_length);
        } else if (res_login_status.data.userType === 'Seller') {
          // Only fetch seller stats for sellers
          try {
            const res_seller_stats = await axios.get('http://localhost:3000/seller/stats', {
              withCredentials: true
            });
            setSellerStats(res_seller_stats.data);
          } catch (error) {
            console.error('Error fetching seller stats:', error);
          }
        } else if (res_login_status.data.userType === 'Admin') {
          // Fetch admin stats for admins
          try {
            const res_admin_stats = await axios.get('http://localhost:3000/admin/stats', {
              withCredentials: true
            });
            setAdminStats(res_admin_stats.data);
          } catch (error) {
            console.error('Error fetching admin stats:', error);
          }
        }
      } else {
        setLoggedin(false);
        setUserType('Buyer');
        setCartCount(0);
        setWishlistCount(0);
        setSellerStats({
          totalProducts: 0,
          totalOrders: 0,
          pendingOrders: 0
        });
        setAdminStats({
          totalUsers: 0,
          totalProducts: 0,
          reportedItems: 0,
          pendingReviews: 0
        });
      }
    } catch(error) {
      console.log(error);
      setLoggedin(false);
      setUserType('Buyer');
      setCartCount(0);
      setWishlistCount(0);
      setSellerStats({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0
      });
      setAdminStats({
        totalUsers: 0,
        totalProducts: 0,
        reportedItems: 0,
        pendingReviews: 0
      });
    }
  }, []);

  // Listen for route changes and check auth status
  useEffect(() => {
    fetchData();
  }, [location.pathname, fetchData]);

  // Also listen for focus events to update when user returns to the tab
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  // Listen for custom events (useful for immediate updates after login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      fetchData();
    };

    window.addEventListener('authStatusChanged', handleAuthChange);
    return () => window.removeEventListener('authStatusChanged', handleAuthChange);
  }, [fetchData]);

  // Updated currentpath logic to handle buyer, seller, and admin routes
  const currentpath = useMemo(() => {
    const path = location.pathname;
    
    if (path === '/') return 'home';
    
    if (path.startsWith('/seller/')) {
      const sellerPath = path.replace('/seller/', '');
      return sellerPath || 'dashboard';
    }
    
    if (path.startsWith('/admin/')) {
      const adminPath = path.replace('/admin/', '');
      return adminPath || 'dashboard';
    }
    
    return path.slice(1) || 'home';
  }, [location.pathname]);

  const safenav = (path) => {
    if (typeof path === 'string') {
      try {
        navigate(path);
      } catch (error) {
        console.error(`Navigation error: ${path}`, error);
      }
    }
  };

  // Updated activated function to handle buyer, seller, and admin routes
  const activated = (page) => {
    if (userType === 'Seller') {
      // For sellers, check if current path matches the seller route
      if (page === 'dashboard') return currentpath === 'dashboard' || currentpath === 'home';
      if (page === 'my-products') return currentpath === 'my-products';
      if (page === 'orders') return currentpath === 'orders';
      if (page === 'analytics') return currentpath === 'analytics';
      return currentpath === page;
    } else if (userType === 'Admin') {
      // For admins, check if current path matches the admin route
      if (page === 'dashboard') return currentpath === 'dashboard' || currentpath === 'home' || currentpath === 'analytics';
      if (page === 'users') return currentpath === 'users';
      if (page === 'products') return currentpath === 'products';
      if (page === 'analytics') return currentpath === 'analytics';
      if (page === 'reports') return currentpath === 'reports';
      return currentpath === page;
    } else {
      // For buyers, use the original logic
      return currentpath === page;
    }
  };

  const navbclasss = (page) => `navLink${activated(page) ? ' act' : ''}`;
  const iconclass = (page) => `iconb${activated(page) ? ' aicon' : ''}`;

  const BuyerHeader = () => (
    <header className="header">
      <div className="headercontent">
        <div
          className="logo"
          onClick={() => safenav('/')}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img src={logo} alt="CLIQUE Logo" className="logoImage" />
          CLIQUE
        </div>

        <nav className="nav hiddenm">
          <div className="navlinks">
            {[
              { key: 'home', label: 'Home', route: '/' },
              { key: 'products', label: 'Products', route: '/products' },
              { key: 'about', label: 'About Us', route: '/about' },
              { key: 'cart', label: 'Cart', route: '/cart' }
            ].map((page) => (
              <button
                key={page.key}
                className={navbclasss(page.key)}
                onClick={() => safenav(page.route)}
                onMouseEnter={(e) => !activated(page.key) && (e.currentTarget.style.color = '#f9fafb')}
                onMouseLeave={(e) => !activated(page.key) && (e.currentTarget.style.color = '#ffffff')}
                style={{ cursor: activated(page.key) ? 'default' : 'pointer' }}
              >
                {page.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="headerActions">
          <button onClick={() => safenav('/wishlist')} className={iconclass('wishlist')}>
            <Heart size={20} />
            <span className="cartthingy">{wishlistCount}</span>
          </button>
          <button onClick={() => safenav('/profile')} className={iconclass('profile')}>
            <User size={20} />
          </button>
          <button onClick={() => safenav('/cart')} className={iconclass('cart')}>
            <ShoppingBag size={20} />
            <span className="cartthingy">{cartCount}</span>
          </button>

          {loggedin ? (
            <button onClick={menumove} className="iconb" onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
              <Menu size={20} />
            </button>
          ) : (
            <>
              <button onClick={() => safenav('/login')} className="authibutton">Login</button>
              <button onClick={() => safenav('/signup')} className="signUpButton">Sign up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );

  // Seller Header Component
  const SellerHeader = () => (
    <header className="header">
      <div className="headercontent">
        <div
          className="logo"
          onClick={() => safenav('/')}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img src={logo} alt="CLIQUE Logo" className="logoImage" />
          <span>CLIQUE</span>
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#fbbf24',
            marginLeft: '8px',
            padding: '2px 6px',
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '4px'
          }}>
            SELLER
          </span>
        </div>

        <nav className="nav hiddenm">
          <div className="navlinks">
            {[
              { key: 'dashboard', label: 'Dashboard', route: '/' },
              { key: 'my-products', label: 'My Products', route: '/seller/products' },
              { key: 'orders', label: 'Orders', route: '/seller/orders' },
              { key: 'analytics', label: 'Analytics', route: '/seller/analytics' }
            ].map((page) => (
              <button
                key={page.key}
                className={navbclasss(page.key)}
                onClick={() => safenav(page.route)}
                onMouseEnter={(e) => !activated(page.key) && (e.currentTarget.style.color = '#f9fafb')}
                onMouseLeave={(e) => !activated(page.key) && (e.currentTarget.style.color = '#ffffff')}
                style={{ cursor: activated(page.key) ? 'default' : 'pointer' }}
              >
                {page.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="headerActions">
          {/* Quick Add Product Button */}
          <button 
            onClick={() => safenav('/seller/add-product')} 
            className="iconb"
            style={{
              backgroundColor: '#fbbf24',
              color: '#000',
              borderRadius: '6px',
              padding: '8px 12px',
              fontWeight: '500',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f59e0b';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fbbf24';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={16} />
            Add Product
          </button>

          {/* Products Count */}
          <button onClick={() => safenav('/seller/products')} className={iconclass('my-products')}>
            <Package size={20} />
            <span className="cartthingy">{sellerStats.totalProducts}</span>
          </button>

          {/* Orders Count */}
          <button onClick={() => safenav('/seller/orders')} className={iconclass('orders')}>
            <ShoppingBag size={20} />
            <span className="cartthingy" style={{
              backgroundColor: sellerStats.pendingOrders > 0 ? '#ef4444' : '#6b7280'
            }}>
              {sellerStats.pendingOrders}
            </span>
          </button>

          {/* Analytics */}
          <button onClick={() => safenav('/seller/analytics')} className={iconclass('analytics')}>
            <BarChart3 size={20} />
          </button>

          {/* Seller Store */}
          <button onClick={() => safenav('/seller/store')} className={iconclass('store')}>
            <Store size={20} />
          </button>

          {/* Profile */}
          <button onClick={() => safenav('/seller/profile')} className={iconclass('profile')}>
            <User size={20} />
          </button>

          {/* Settings */}
          <button onClick={() => safenav('/seller/settings')} className={iconclass('settings')}>
            <Settings size={20} />
          </button>

          {loggedin && (
            <button onClick={menumove} className="iconb" onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
              <Menu size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );

  // Admin Header Component
  const AdminHeader = () => (
    <header className="header">
      <div className="headercontent">
        <div
          className="logo"
          onClick={() => safenav('/analytics')}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img src={logo} alt="CLIQUE Logo" className="logoImage" />
          <span>CLIQUE</span>
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#8b5cf6',
            marginLeft: '8px',
            padding: '2px 6px',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '4px',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            ADMIN
          </span>
        </div>

        <nav className="nav hiddenm">
          <div className="navlinks">
            {[
              { key: 'dashboard', label: 'Analytics', route: '/analytics' },
              { key: 'users', label: 'User Management', route: '/admin/users' },
              { key: 'products', label: 'Product Management', route: '/admin/products' },
              { key: 'reports', label: 'Reports & Moderation', route: '/admin/reports' }
            ].map((page) => (
              <button
                key={page.key}
                className={navbclasss(page.key)}
                onClick={() => safenav(page.route)}
                onMouseEnter={(e) => !activated(page.key) && (e.currentTarget.style.color = '#f9fafb')}
                onMouseLeave={(e) => !activated(page.key) && (e.currentTarget.style.color = '#ffffff')}
                style={{ cursor: activated(page.key) ? 'default' : 'pointer' }}
              >
                {page.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="headerActions">
          {/* Quick Analytics Button */}
          <button 
            onClick={() => safenav('/analytics')} 
            className="iconb"
            style={{
              backgroundColor: '#8b5cf6',
              color: '#fff',
              borderRadius: '6px',
              padding: '8px 12px',
              fontWeight: '500',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#7c3aed';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#8b5cf6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <BarChart3 size={16} />
            Analytics
          </button>

          {/* Total Users */}
          <button onClick={() => safenav('/admin/users')} className={iconclass('users')}>
            <Users size={20} />
            <span className="cartthingy" style={{
              backgroundColor: '#3b82f6'
            }}>
              {adminStats.totalUsers}
            </span>
          </button>

          {/* Total Products */}
          <button onClick={() => safenav('/admin/products')} className={iconclass('products')}>
            <Package size={20} />
            <span className="cartthingy" style={{
              backgroundColor: '#10b981'
            }}>
              {adminStats.totalProducts}
            </span>
          </button>

          {/* Reported Items */}
          <button onClick={() => safenav('/admin/reports')} className={iconclass('reports')}>
            <AlertTriangle size={20} />
            <span className="cartthingy" style={{
              backgroundColor: adminStats.reportedItems > 0 ? '#ef4444' : '#6b7280',
              animation: adminStats.reportedItems > 0 ? 'pulse 2s infinite' : 'none'
            }}>
              {adminStats.reportedItems}
            </span>
          </button>

          {/* System Settings */}
          <button onClick={() => safenav('/admin/settings')} className={iconclass('settings')}>
            <Settings size={20} />
          </button>

          {/* Admin Profile */}
          <button onClick={() => safenav('/admin/profile')} className={iconclass('profile')}>
            <Shield size={20} />
          </button>

          {loggedin && (
            <button onClick={menumove} className="iconb" onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
              <Menu size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );

  if (!loggedin) {
    return <BuyerHeader />; 
  }

  // Return appropriate header based on user type
  switch (userType) {
    case 'Admin':
      return <AdminHeader />;
    case 'Seller':
      return <SellerHeader />;
    case 'Buyer':
    default:
      return <BuyerHeader />;
  }
}

Header.propTypes = {
  menumove: PropTypes.func
};

export default Header;