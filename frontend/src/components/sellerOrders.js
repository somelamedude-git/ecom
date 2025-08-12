import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, Calendar, DollarSign, Truck, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import axios from 'axios';
import '../styles/SellerOrders.css';

function SellerOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentFilter, setCurrentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const filters = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'returned', label: 'Returned' }
  ];

  const statusIcons = {
    pending: <Clock size={16} />,
    shipped: <Truck size={16} />,
    delivered: <CheckCircle size={16} />,
    cancelled: <XCircle size={16} />,
    returned: <RotateCcw size={16} />,
    schedule_return: <RotateCcw size={16} />,
    approve_return: <RotateCcw size={16} />
  };

  const fetchOrders = async (filter = '', page = 1, reset = false) => {
    try {
      setLoading(true);
      const response = await axios.get('api/seller/orders', {
        params: {
          filter,
          page,
          limit: 10
        },
        withCredentials: true
      });

      if (response.data.success) {
        const newOrders = response.data.seller_orders;
        
        if (reset || page === 1) {
          setOrders(newOrders);
        } else {
          setOrders(prev => [...prev, ...newOrders]);
        }
        
        setHasMore(newOrders.length === 10);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentFilter, 1, true);
    setCurrentPage(1);
  }, [currentFilter]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchOrders(currentFilter, nextPage, false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'processing';
      case 'shipped':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
      case 'returned':
        return 'cancelled';
      default:
        return 'processing';
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`api/seller/orders/${orderId}/status`, {
        status: newStatus
      }, {
        withCredentials: true
      });
      
      // Refresh orders after status update
      fetchOrders(currentFilter, 1, true);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  return (
    <div className="orders-container">
      <main className="orders-main">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="orders-hero">
          <h1 className="orders-title">
            Manage <span className="orders-highlight">Orders</span>
          </h1>
          <p className="orders-subtitle">
            Track and manage all your customer orders in one place. 
            Update order status, view customer details, and keep your business running smoothly.
          </p>
        </div>

        <div className="orders-filter">
          {filters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-btn ${currentFilter === filter.value ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading && orders.length === 0 ? (
          <div className="orders-status-msg">Loading your orders...</div>
        ) : error ? (
          <div className="orders-error-msg">{error}</div>
        ) : orders.length === 0 ? (
          <div className="orders-status-msg">
            {currentFilter ? `No ${currentFilter} orders found.` : 'No orders found. Your orders will appear here once customers start purchasing.'}
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      <Package size={20} style={{ marginRight: '8px', display: 'inline' }} />
                      Order #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div className={`order-status ${getStatusClass(order.status)}`}>
                      {statusIcons[order.status]}
                      {order.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="order-details">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <p style={{ color: '#9ca3af', marginBottom: '4px' }}>
                          <User size={16} style={{ marginRight: '6px', display: 'inline' }} />
                          Customer
                        </p>
                        <p style={{ fontWeight: '500' }}>
                          {order.customer?.name || 'Customer Name'}
                        </p>
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                          {order.customer?.email || 'customer@email.com'}
                        </p>
                      </div>
                      
                      <div>
                        <p style={{ color: '#9ca3af', marginBottom: '4px' }}>
                          <Calendar size={16} style={{ marginRight: '6px', display: 'inline' }} />
                          Order Date
                        </p>
                        <p style={{ fontWeight: '500' }}>
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div style={{ 
                      backgroundColor: '#1f2937', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      marginBottom: '16px' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                            {order.product?.name || 'Product Name'}
                          </p>
                          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                            Size: {order.size} • Quantity: {order.quantity}
                          </p>
                          {order.product?.images && order.product.images[0] && (
                            <img 
                              src={order.product.images[0]} 
                              alt={order.product.name}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '1px solid #374151'
                              }}
                            />
                          )}
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>
                            <DollarSign size={16} style={{ marginRight: '4px', display: 'inline' }} />
                            Total Amount
                          </p>
                          <p style={{ 
                            fontSize: '24px', 
                            fontWeight: '700', 
                            color: '#10b981' 
                          }}>
                            {formatPrice(order.total)}
                          </p>
                          {order.paymentVerified && (
                            <p style={{ color: '#10b981', fontSize: '12px' }}>
                              ✓ Payment Verified
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'shipped')}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                          <Truck size={14} />
                          Mark as Shipped
                        </button>
                        
                        <button
                          onClick={() => updateOrderStatus(order._id, 'cancelled')}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#ef4444';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#ef4444';
                          }}
                        >
                          <XCircle size={14} />
                          Cancel Order
                        </button>
                      </div>
                    )}

                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'delivered')}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                      >
                        <CheckCircle size={14} />
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && !loading && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button
                  onClick={loadMore}
                  style={{
                    backgroundColor: '#facc15',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#eab308';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#facc15';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Load More Orders
                </button>
              </div>
            )}

            {loading && orders.length > 0 && (
              <div className="orders-status-msg">Loading more orders...</div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default SellerOrdersPage;