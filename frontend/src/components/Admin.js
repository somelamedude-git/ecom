import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import
import '../styles/Admin.css';

const AdminPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const navigate = useNavigate(); // Add this hook
  const API_BASE_URL = 'http://localhost:5000';
  
  axios.defaults.withCredentials = true;

  const transformUserData = (backendUser) => {
    const joinDate = backendUser.createdAt ? new Date(backendUser.createdAt).toISOString().split('T')[0] : 'N/A';
    
    return {
      id: backendUser._id,
      username: backendUser.username || 'N/A',
      email: backendUser.email || 'N/A',
      name: backendUser.name || 'N/A',
      address: Array.isArray(backendUser.address) && backendUser.address.length > 0 
        ? `${backendUser.address[0].address_line_one || ''} ${backendUser.address[0].city || ''} ${backendUser.address[0].state || ''}`.trim()
        : 'Address not provided',
      isBanned: backendUser.isBan || false,
      joinDate: joinDate,
      userType: backendUser.kind === 'Buyer' ? 'Buyer' : backendUser.kind === 'Seller' ? 'Seller' : 'Admin',
      age: backendUser.age || 'N/A',
      
      // Buyer specific fields
      creditPoints: backendUser.creditPoints || 0,
      totalOrders: Array.isArray(backendUser.orderHistory) ? backendUser.orderHistory.length : 0,
      reviewsAdded: Array.isArray(backendUser.reviews_added) ? backendUser.reviews_added.length : 0,
      
      // Seller specific fields
      isVerified: backendUser.verification_documents ? true : false,
      averageRating: backendUser.average_rating || 0,
      productsListed: Array.isArray(backendUser.selling_products) ? backendUser.selling_products.length : 0,
      storeName: backendUser.store_information?.name || 'Store Name N/A'
    };
  };

  const fetchUsers = async (page = 1, type = '', status = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: page,
        limit: 10
      };
      
      if (type) params.type = type;
      if (status === 'banned') params.status = 'ban';
      else if (status === 'active') params.status = 'unban';

      const response = await axios.get(`${API_BASE_URL}/admin/listusers`, { params });
      
      if (response.data.status) {
        const transformedUsers = response.data.users.map(transformUserData);
        setUsers(transformedUsers);
        setTotalPages(response.data.totalPages || 1);
        setTotalUsers(response.data.totalUsers || 0);
        setCurrentPage(page);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users. Please ensure you are logged in as an admin.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, userEmail, isBanned) => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = isBanned ? '/admin/unbanUser' : '/admin/banUser';
      
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {}, {
        params: { email: userEmail }
      });

      if (response.data.status) {
        // Update the user in the local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, isBanned: !user.isBanned }
              : user
          )
        );
      } else {
        throw new Error(response.data.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userEmail) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/admin/deleteUser`, {
        email: userEmail
      });

      if (response.data.status) {
        // Refresh the user list after deletion
        fetchUsers(currentPage, typeFilter, statusFilter);
      } else {
        throw new Error(response.data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, typeFilter, statusFilter);
  }, [typeFilter, statusFilter]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage, typeFilter, statusFilter);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="admin-container">
      <div className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">User Management</h1>
            <p className="admin-subtitle">Manage user accounts and permissions ({totalUsers} total users)</p>
          </div>
          <button
            onClick={() => navigate('/admin/stats')}
            className="action-button button-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              borderColor: 'rgba(59, 130, 246, 0.3)',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📊 Analytics Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="filters-card">
          {error && <div className="error-message">{error}</div>}
          <div className="filters-grid">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              disabled={loading}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              <option value="">All Types</option>
              <option value="buyers">Buyers</option>
              <option value="sellers">Sellers</option>
              <option value="admins">Admins</option>
            </select>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="action-button button-secondary"
              >
                Previous
              </button>
              <span style={{ color: '#ffffff', alignSelf: 'center' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="action-button button-secondary"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* User List */}
        {loading && users.length === 0 ? (
          <div className="empty-state">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '16px', color: '#888888' }}>Loading users...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="user-list" style={{ position: 'relative' }}>
            {loading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
            )}
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-content">
                  <div className="user-info">
                    <div className="user-header">
                      <h3 className="user-name">{user.name}</h3>
                      <span className={`status-badge ${user.isBanned ? 'status-banned' : 'status-active'}`}>
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                      <span className={`type-badge ${user.userType === 'Buyer' ? 'type-buyer' : user.userType === 'Seller' ? 'type-seller' : 'type-admin'}`}>
                        {user.userType}
                      </span>
                      {user.userType === 'Seller' && (
                        <span className={`verification-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      )}
                    </div>
                    <p className="user-email">{user.email}</p>
                    <p className="user-address">{user.address}</p>
                    <div className="user-details">
                      <span>Username: {user.username}</span>
                      <span>Age: {user.age}</span>
                      <span>Joined: {user.joinDate}</span>
                      <span>User ID: {user.id.slice(-6)}</span>
                    </div>
                    
                    {/* User Statistics */}
                    <div className="user-stats">
                      {user.userType === 'Buyer' ? (
                        <>
                          <div className="stat-item">
                            <span className="stat-label">Credit Points</span>
                            <span className="stat-value">{user.creditPoints}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Orders</span>
                            <span className="stat-value">{user.totalOrders}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Reviews</span>
                            <span className="stat-value">{user.reviewsAdded}</span>
                          </div>
                        </>
                      ) : user.userType === 'Seller' ? (
                        <>
                          <div className="stat-item">
                            <span className="stat-label">Store</span>
                            <span className="stat-value">{user.storeName}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Products</span>
                            <span className="stat-value">{user.productsListed}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Orders</span>
                            <span className="stat-value">{user.totalOrders}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Rating</span>
                            <div className="rating-display">
                              <span className="rating-stars">★</span>
                              <span className="stat-value">{user.averageRating.toFixed(1)}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="stat-item">
                          <span className="stat-label">Role</span>
                          <span className="stat-value">Administrator</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="user-actions">
                    {user.userType !== 'Admin' && (
                      <>
                        <button
                          onClick={() => toggleUserStatus(user.id, user.email, user.isBanned)}
                          className="action-button button-primary"
                          disabled={loading}
                        >
                          {user.isBanned ? 'Unban User' : 'Ban User'}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
                              deleteUser(user.email);
                            }
                          }}
                          className="action-button button-secondary"
                          disabled={loading}
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        >
                          Delete User
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3 className="empty-title">No users found</h3>
            <p className="empty-text">
              {searchTerm ? 'Try adjusting your search criteria' : 'No users match the current filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;