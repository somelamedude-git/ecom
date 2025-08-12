import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  X, Venus, Heart, ShoppingBag, Mars, User, Footprints, Watch, Palette, LogOut,
  Package, BarChart3, Settings, Store, Plus, TrendingUp
} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import '../styles/SideMenu.css';

function SideMenu({isopen, onclose}) {
  const [profile, setprofile] = useState({name:'', status:''});
  const [counts, setcounts] = useState({wish_length:0, cart_length:0});
  const [userType, setUserType] = useState('Buyer');
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const navigate = useNavigate();
  
  // Buyer categories - ensure these match your database category names exactly
  const buyerCategories = [
    {name: "Women's", displayName: "Women's", icon: Venus},
    {name: "Men's", displayName: "Men's", icon: Mars},
    {name: "Footwear", displayName: "Footwear", icon: Footprints},
    {name: "Accessories", displayName: "Accessories", icon: Watch},
    {name: "Makeup", displayName: "Makeup", icon: Palette}
  ];

  // Seller menu items
  const sellerMenuItems = [
    {name: "Dashboard", path: "/seller", icon: BarChart3},
    {name: "My Products", path: "/seller/products", icon: Package},
    {name: "Add Product", path: "/seller/add-product", icon: Plus},
    {name: "Orders", path: "/seller/orders", icon: ShoppingBag},
    {name: "Analytics", path: "/seller/analytics", icon: TrendingUp},
    {name: "My Store", path: "/seller/store", icon: Store},
    {name: "Settings", path: "/seller/settings", icon: Settings}
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check login status and user type
        const loginRes = await axios.get('http://localhost:3000/user/verifyLogin', {
          withCredentials: true
        });
        
        if (loginRes.data.isLoggedIn) {
          setUserType(loginRes.data.userType || 'Buyer');
          
          // Fetch profile data
          const profileRes = await axios.get('http://localhost:3000/user/profile', {
            withCredentials: true
          });
          const user = profileRes.data.user || {};
          setprofile({
            name: user.name || 'Guest',
            status: loginRes.data.userType === 'Seller' ? 'Seller' : 'Member',
          });

          // Fetch user-specific data
          if (loginRes.data.userType === 'Buyer') {
            const countsRes = await axios.get('http://localhost:3000/user/getCWL', {
              withCredentials: true
            });
            setcounts({
              wish_length: countsRes.data.wish_length,
              cart_length: countsRes.data.cart_length,
            });
          } else if (loginRes.data.userType === 'Seller') {
            const statsRes = await axios.get('http://localhost:3000/seller/stats', {
              withCredentials: true
            });
            setSellerStats(statsRes.data);
          }
        }
      } catch (error) {
        console.error('Error loading side menu data:', error);
        setprofile({name: 'Guest', status: 'Member'});
      }
    };
    
    if (isopen) {
      fetchData();
    }
  }, [isopen]);

  const handleNavigate = (path) => {
    navigate(path);
    onclose();
  };

  // Handle category navigation with proper encoding
  const handleCategoryNavigate = (categoryName) => {
    // Encode the category name to handle special characters and spaces
    const encodedCategory = encodeURIComponent(categoryName);
    console.log(`Navigating to category: ${categoryName} (encoded: ${encodedCategory})`);
    navigate(`/products?category=${encodedCategory}`);
    onclose();
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/user/logout', {}, {
        withCredentials: true
      });
      navigate('/');
      onclose();
    } catch (error) {
      console.error('Error logging out:', error);
      navigate('/');
      onclose();
    }
  };

  // Buyer Side Menu
  const BuyerSideMenu = () => (
    <>
      <div className="profilesec">
        <div className="profileinfo">
          <div className="avatar">
            <User size={32} color="#000000" />
          </div>
          <div className="profiledetails">
            <h3 className="profilename">{profile.name}</h3>
            <p className="profilestatus">{profile.status}</p>
          </div>
        </div>
        <button className="viewprofileb" onClick={() => handleNavigate('/profile')}>
          View profile
        </button>
      </div>

      <div className="sec">
        <h4 className="sectitle">Quick Actions</h4>
        <div className="menulist">
          <button className="menuitem" onClick={() => handleNavigate('/wishlist')}>
            <Heart size={20} />
            <span>Wishlist ({counts.wish_length})</span>
          </button>
          <button className="menuitem" onClick={() => handleNavigate('/cart')}>
            <ShoppingBag size={20} />
            <span>Cart ({counts.cart_length})</span>
          </button>
        </div>
      </div>

      <div className="sec">
        <h4 className="sectitle">Categories</h4>
        <div className="menulist">
          {buyerCategories.map((category, i) => (
            <button
              key={i}
              className="menuitem"
              onClick={() => handleCategoryNavigate(category.name)}
            >
              <category.icon size={20} />
              <span>{category.displayName}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  // Seller Side Menu
  const SellerSideMenu = () => (
    <>
      <div className="profilesec">
        <div className="profileinfo">
          <div className="avatar" style={{ backgroundColor: '#fbbf24' }}>
            <User size={32} color="#000000" />
          </div>
          <div className="profiledetails">
            <h3 className="profilename">{profile.name}</h3>
            <p className="profilestatus" style={{ color: '#fbbf24' }}>{profile.status}</p>
          </div>
        </div>
        <button className="viewprofileb" onClick={() => handleNavigate('/seller/profile')}>
          View profile
        </button>
      </div>

      <div className="sec">
        <h4 className="sectitle">Quick Stats</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700' }}>
              {sellerStats.totalProducts || 0}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '12px' }}>Products</div>
          </div>
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ef4444', fontSize: '20px', fontWeight: '700' }}>
              {sellerStats.pendingOrders || 0}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '12px' }}>Pending</div>
          </div>
        </div>
      </div>

      <div className="sec">
        <h4 className="sectitle">Seller Tools</h4>
        <div className="menulist">
          {sellerMenuItems.map((item, i) => (
            <button
              key={i}
              className="menuitem"
              onClick={() => handleNavigate(item.path)}
              style={item.name === "Add Product" ? {
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: '#fbbf24'
              } : {}}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
              {item.name === "Orders" && sellerStats.pendingOrders > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {sellerStats.pendingOrders}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className={`side-overlay ${isopen ? 'open' :''}`} onClick={onclose} />

      <div className={`side-menu ${isopen ? 'open' :''}`}>
        <div className="menucontent">

          <div className="menuheader">
            <h2 className="menutitle">
              {userType === 'Seller' ? 'Seller Menu' : 'Menu'}
            </h2>
            <button className="closeb" onClick={onclose}>
              <X size={24} />
            </button>
          </div>

          {userType === 'Seller' ? <SellerSideMenu /> : <BuyerSideMenu />}

          {/* Logout Button */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ef4444';
                e.target.style.color = '#ffffff';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#ef4444';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'translateY(0) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'translateY(-1px) scale(1)';
              }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default SideMenu;