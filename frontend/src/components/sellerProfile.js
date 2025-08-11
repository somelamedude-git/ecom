import React, { useState, useEffect } from 'react';
import { ArrowLeft, Store, Package, ShoppingCart, Star, Edit, Camera, MapPin, Phone, Mail, Calendar, Award } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SellerProfile = () => {
  const nav = useNavigate();
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        setLoading(true);
       const response = await axios.get('http://localhost:3000/seller/profile', {
        withCredentials: true
       })
        
        setSellerData(response.data);
      } catch (err) {
        setError('Failed to load seller profile');
        console.error('Error fetching seller profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProfile();
  }, []);

  const handleImageUpload = (type) => {
    // TODO: Implement image upload functionality
    console.log(`Upload ${type} image`);
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile page or open modal
    console.log('Edit profile');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-main">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sellerData) {
    return (
      <div className="profile-container">
        <div className="profile-main">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Oops! Something went wrong</h3>
            <p className="error-description">{error || 'Failed to load your profile data'}</p>
            <button 
              className="retry-btn" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { user, number_of_products, number_of_orders } = sellerData;
  const primaryAddress = user.address?.[0];

  return (
    <div className="profile-container">
      <div className="profile-main">
        {/* Back Button */}
        <button className="back-btn" onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="cover-image-section">
            <div className="cover-image">
              {user.coverImage ? (
                <img src={user.coverImage} alt="Cover" />
              ) : (
                <div className="cover-placeholder">
                  <Camera size={48} />
                  <span>Add Cover Image</span>
                </div>
              )}
              <button className="cover-upload-btn" onClick={() => handleImageUpload('cover')}>
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div className="profile-info-section">
            <div className="profile-avatar">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button className="avatar-upload-btn" onClick={() => handleImageUpload('profile')}>
                <Camera size={14} />
              </button>
            </div>

            <div className="profile-details">
              <div className="profile-name-section">
                <h1 className="profile-name">{user.name}</h1>
                <div className="verification-badge">
                  {user.isVerified ? (
                    <span className="verified">
                      <Award size={16} />
                      Verified Seller
                    </span>
                  ) : (
                    <span className="unverified">Pending Verification</span>
                  )}
                </div>
              </div>

              <div className="profile-meta">
                <span className="username">@{user.username}</span>
              </div>

              <button className="edit-profile-btn" onClick={handleEditProfile}>
                <Edit size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products">
              <Package size={24} />
            </div>
            <div className="stat-content" onClick={()=>nav('/seller/products')}>
              <h3>{number_of_products}</h3>
              <p>Products Listed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-content">
              <h3>{number_of_orders}</h3>
              <p>Orders Received</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon store">
              <Store size={24} />
            </div>
            <div className="stat-content">
              <h3>{user.store_information ? 'Active' : 'Setup'}</h3>
              <p>Store Status</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            Store Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="info-grid">
                <div className="info-card">
                  <h3>Account Information</h3>
                  <div className="info-item">
                    <span className="label">Username:</span>
                    <span className="value">{user.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Age:</span>
                    <span className="value">{user.age} years</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Member Since:</span>
                    <span className="value">January 2024</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Account Status:</span>
                    <span className={`status ${user.isVerified ? 'active' : 'pending'}`}>
                      {user.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Performance Metrics</h3>
                  <div className="info-item">
                    <span className="label">Total Products:</span>
                    <span className="value">{number_of_products}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total Orders:</span>
                    <span className="value">{number_of_orders}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Success Rate:</span>
                    <span className="value">96%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="store-section">
              {user.store_information ? (
                <div className="store-info-card">
                  <h3>Store Information</h3>
                  <div className="store-details">
                    <div className="store-header">
                      <div className="store-logo">
                        {user.store_information.store_logo ? (
                          <img src={user.store_information.store_logo} alt="Store Logo" />
                        ) : (
                          <Store size={32} />
                        )}
                      </div>
                      <div>
                        <h4>{user.store_information.store_name}</h4>
                        <p>{user.store_information.store_description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-store-card">
                  <Store size={48} />
                  <h3>No Store Setup</h3>
                  <p>Create your store to start selling products</p>
                  <button className="create-store-btn">Create Store</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="contact-section">
              <div className="contact-info-card">
                <h3>Contact Information</h3>
                <div className="contact-details">
                  <div className="contact-item">
                    <Mail size={20} />
                    <div>
                      <span className="contact-label">Email</span>
                      <span className="contact-value">{user.email}</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Phone size={20} />
                    <div>
                      <span className="contact-label">Phone</span>
                      <span className="contact-value">{user.phone_number}</span>
                    </div>
                  </div>
                  {primaryAddress && (
                    <div className="contact-item">
                      <MapPin size={20} />
                      <div>
                        <span className="contact-label">Address</span>
                        <span className="contact-value">
                          {primaryAddress.street}, {primaryAddress.city}, {primaryAddress.state} {primaryAddress.zipCode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          background-color: #000;
          color: #fff;
        }

        .profile-main {
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 16px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9ca3af;
          background: none;
          border: none;
          font-size: 16px;
          margin-bottom: 32px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .back-btn:hover {
          color: #facc15;
        }

        .profile-header {
          background-color: #111827;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #374151;
          margin-bottom: 32px;
        }

        .cover-image-section {
          position: relative;
          height: 200px;
        }

        .cover-image {
          width: 100%;
          height: 100%;
          position: relative;
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cover-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cover-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6b7280;
        }

        .cover-upload-btn, .avatar-upload-btn {
          position: absolute;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .cover-upload-btn {
          top: 12px;
          right: 12px;
        }

        .cover-upload-btn:hover, .avatar-upload-btn:hover {
          background: rgba(0, 0, 0, 0.9);
        }

        .profile-info-section {
          padding: 24px;
          position: relative;
          margin-top: -60px;
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .profile-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .profile-avatar img, .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid #111827;
        }

        .avatar-placeholder {
          background: linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: bold;
          color: #000;
        }

        .avatar-upload-btn {
          bottom: 8px;
          right: 8px;
        }

        .profile-details {
          flex: 1;
          margin-top: 40px;
        }

        .profile-name-section {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
        }

        .profile-name {
          font-size: 32px;
          font-weight: bold;
          margin: 0;
        }

        .verification-badge .verified {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: #10b981;
          color: #fff;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
        }

        .verification-badge .unverified {
          background-color: #f59e0b;
          color: #000;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
        }

        .profile-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          color: #9ca3af;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .edit-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%);
          color: #000;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .edit-profile-btn:hover {
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background-color: #111827;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #374151;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.products {
          background-color: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .stat-icon.orders {
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .stat-icon.store {
          background-color: rgba(250, 204, 21, 0.1);
          color: #facc15;
        }

        .stat-content h3 {
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 4px 0;
        }

        .stat-content p {
          color: #9ca3af;
          margin: 0;
        }

        .profile-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid #374151;
        }

        .tab-btn {
          background: none;
          border: none;
          color: #9ca3af;
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .tab-btn:hover {
          color: #fff;
        }

        .tab-btn.active {
          color: #facc15;
          border-bottom-color: #facc15;
        }

        .tab-content {
          margin-top: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .info-card, .store-info-card, .contact-info-card, .no-store-card {
          background-color: #111827;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #374151;
        }

        .info-card h3, .store-info-card h3, .contact-info-card h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #374151;
        }

        .info-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .info-item .label {
          color: #9ca3af;
        }

        .info-item .value {
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status.active {
          color: #10b981;
        }

        .status.pending {
          color: #f59e0b;
        }

        .no-store-card {
          text-align: center;
          padding: 48px 24px;
        }

        .no-store-card h3 {
          margin: 16px 0 8px 0;
        }

        .create-store-btn {
          background: linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 16px;
        }

        .store-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .store-logo {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background-color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .store-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background-color: #1f2937;
          border-radius: 8px;
        }

        .contact-item svg {
          color: #facc15;
          margin-top: 2px;
        }

        .contact-label {
          display: block;
          color: #9ca3af;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .contact-value {
          font-weight: 500;
        }

        .loading-spinner, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          color: #9ca3af;
        }

        .error-state {
          background-color: #111827;
          border-radius: 16px;
          border: 1px solid #374151;
          padding: 48px 32px;
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
        }

        .error-icon {
          font-size: 64px;
          margin-bottom: 24px;
          filter: grayscale(1) opacity(0.8);
        }

        .error-title {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          margin: 0 0 12px 0;
        }

        .error-description {
          color: #9ca3af;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }

        .retry-btn {
          background: linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .retry-btn:hover {
          transform: translateY(-2px);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #374151;
          border-top: 4px solid #facc15;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-info-section {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .profile-name {
            font-size: 24px;
          }

          .profile-name-section {
            flex-direction: column;
            gap: 8px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .profile-tabs {
            overflow-x: auto;
          }
        }

        @media (max-width: 480px) {
          .profile-main {
            padding: 16px 12px;
          }

          .profile-avatar img, .avatar-placeholder {
            width: 80px;
            height: 80px;
          }

          .avatar-placeholder {
            font-size: 32px;
          }

          .profile-info-section {
            margin-top: -40px;
          }

          .profile-details {
            margin-top: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SellerProfile;