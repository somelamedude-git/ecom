import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Package, MapPin, CreditCard, Calendar, User, Phone, Mail } from 'lucide-react';

const OrderConfirmedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showTick, setShowTick] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  // Get order data from navigation state
  const orderData = location.state;
  
  useEffect(() => {
    // If no order data, redirect to home
    if (!orderData || !orderData.orderId) {
      navigate('/');
      return;
    }
    
    // Trigger tick animation after component mounts
    const tickTimer = setTimeout(() => {
      setShowTick(true);
    }, 500);

    // Show content after tick animation
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1800);

    return () => {
      clearTimeout(tickTimer);
      clearTimeout(contentTimer);
    };
  }, [orderData, navigate]);

  // If no order data, don't render anything (will redirect)
  if (!orderData || !orderData.orderId) {
    return null;
  }

  const { orderId, paymentId, paymentMethod, orderDetails } = orderData;

  // Generate order number from orderId
  const generateOrderNumber = (id) => {
    const timestamp = new Date().getFullYear();
    const shortId = id.slice(-4).toUpperCase();
    return `ORD-${timestamp}-${shortId}`;
  };

  const handleTrackOrder = () => {
    // Navigate to orders page or specific tracking page
    navigate('/orders', { state: { highlightOrder: orderId } });
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      color: '#ffffff',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at 25% 25%, #ffd700 0%, transparent 2%), radial-gradient(circle at 75% 75%, #ffd700 0%, transparent 2%)',
      backgroundSize: '60px 60px',
      opacity: 0.1,
      animation: 'float 20s ease-in-out infinite'
    },
    tickContainer: {
      position: 'relative',
      marginBottom: '40px'
    },
    circle: {
      width: '120px',
      height: '120px',
      border: '4px solid #ffd700',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
      boxShadow: '0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.1)',
      animation: showTick ? 'pulseGold 0.6s ease-out' : 'none'
    },
    tick: {
      width: '60px',
      height: '30px',
      position: 'relative',
      transform: showTick ? 'scale(1)' : 'scale(0)',
      transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transitionDelay: showTick ? '0.3s' : '0s'
    },
    tickPath: {
      fill: 'none',
      stroke: '#ffd700',
      strokeWidth: '6',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeDasharray: '100',
      strokeDashoffset: showTick ? '0' : '100',
      animation: showTick ? 'drawTick 0.8s ease-out 0.6s forwards' : 'none',
      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))'
    },
    content: {
      textAlign: 'center',
      opacity: showContent ? 1 : 0,
      transform: showContent ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 0.8s ease-out',
      maxWidth: '800px',
      width: '100%'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '20px',
      background: 'linear-gradient(45deg, #ffd700, #ffed4a, #ffd700)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 2px 10px rgba(255, 215, 0, 0.3)',
      letterSpacing: '1px'
    },
    subtitle: {
      fontSize: '1.2rem',
      marginBottom: '30px',
      color: '#cccccc',
      lineHeight: '1.6'
    },
    orderDetailsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    orderDetailsCard: {
      background: 'rgba(255, 215, 0, 0.1)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '15px',
      padding: '25px',
      backdropFilter: 'blur(10px)'
    },
    cardTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#ffd700',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    orderNumber: {
      fontSize: '1.1rem',
      marginBottom: '15px',
      textAlign: 'center'
    },
    orderInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      fontSize: '0.95rem',
      color: '#e0e0e0'
    },
    highlight: {
      color: '#ffd700',
      fontWeight: '600'
    },
    itemsList: {
      maxHeight: '200px',
      overflowY: 'auto',
      marginBottom: '15px'
    },
    orderItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
      fontSize: '0.9rem'
    },
    itemName: {
      flex: 1,
      textAlign: 'left'
    },
    itemDetails: {
      fontSize: '0.8rem',
      color: '#ccc',
      marginTop: '2px'
    },
    itemPrice: {
      fontWeight: '600',
      color: '#ffd700'
    },
    totalSection: {
      borderTop: '2px solid rgba(255, 215, 0, 0.3)',
      paddingTop: '15px',
      marginTop: '15px'
    },
    totalLine: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '0.95rem'
    },
    totalFinal: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#ffd700',
      borderTop: '1px solid rgba(255, 215, 0, 0.3)',
      paddingTop: '10px',
      marginTop: '10px'
    },
    buttonsContainer: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    button: {
      background: 'linear-gradient(45deg, #ffd700, #ffed4a)',
      color: '#000000',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    buttonSecondary: {
      background: 'transparent',
      color: '#ffd700',
      border: '2px solid #ffd700',
      padding: '13px 28px',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    '@media (max-width: 768px)': {
      orderDetailsContainer: {
        gridTemplateColumns: '1fr'
      },
      buttonsContainer: {
        flexDirection: 'column',
        alignItems: 'center'
      },
      button: {
        width: '100%',
        maxWidth: '300px'
      },
      buttonSecondary: {
        width: '100%',
        maxWidth: '300px'
      }
    }
  };

  const keyframes = `
    @keyframes drawTick {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }

    @keyframes pulseGold {
      0% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.1); }
      50% { transform: scale(1.1); box-shadow: 0 0 50px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2); }
      100% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.1); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-10px) rotate(1deg); }
      66% { transform: translateY(5px) rotate(-1deg); }
    }

    @media (max-width: 768px) {
      .order-details-container {
        grid-template-columns: 1fr !important;
      }
      .buttons-container {
        flex-direction: column !important;
      }
      .button, .button-secondary {
        width: 100% !important;
        max-width: 300px !important;
      }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.tickContainer}>
        <div style={styles.circle}>
          <svg style={styles.tick} viewBox="0 0 60 30">
            <path 
              style={styles.tickPath}
              d="M5 15 L20 25 L55 5"
            />
          </svg>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>Order Confirmed!</h1>
        <p style={styles.subtitle}>
          Thank you for your purchase. Your order has been successfully placed and is being processed.
        </p>

        <div style={styles.orderNumber}>
          Order Number: <span style={styles.highlight}>{generateOrderNumber(orderId)}</span>
        </div>

        <div style={styles.orderDetailsContainer} className="order-details-container">
          {/* Order Summary Card */}
          <div style={styles.orderDetailsCard}>
            <div style={styles.cardTitle}>
              <Package size={20} />
              Order Summary
            </div>
            
            <div style={styles.itemsList}>
              {orderDetails.items?.map((item, index) => (
                <div key={index} style={styles.orderItem}>
                  <div style={styles.itemName}>
                    {item.name}
                    <div style={styles.itemDetails}>
                      Size: {item.size} | Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={styles.itemPrice}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.totalSection}>
              <div style={styles.totalLine}>
                <span>Subtotal:</span>
                <span>₹{orderDetails.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              {orderDetails.deliveryPrice > 0 && (
                <div style={styles.totalLine}>
                  <span>Delivery:</span>
                  <span>₹{orderDetails.deliveryPrice?.toFixed(2)}</span>
                </div>
              )}
              {orderDetails.discount > 0 && (
                <div style={styles.totalLine}>
                  <span>Discount:</span>
                  <span style={{color: '#4ade80'}}>-₹{orderDetails.discount?.toFixed(2)}</span>
                </div>
              )}
              <div style={styles.totalFinal}>
                <span>Total:</span>
                <span>₹{orderDetails.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info Card */}
          <div style={styles.orderDetailsCard}>
            <div style={styles.cardTitle}>
              <MapPin size={20} />
              Delivery & Payment Info
            </div>
            
            <div style={styles.orderInfo}>
              <span>Estimated Delivery:</span>
              <span style={styles.highlight}>{orderDetails.deliveryDate || 'TBD'}</span>
            </div>
            <div style={styles.orderInfo}>
              <span>Delivery Method:</span>
              <span style={styles.highlight}>{orderDetails.deliveryMethod || 'Standard'}</span>
            </div>
            <div style={styles.orderInfo}>
              <span>Payment Method:</span>
              <span style={styles.highlight}>
                {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
              </span>
            </div>
            {paymentId && (
              <div style={styles.orderInfo}>
                <span>Payment ID:</span>
                <span style={styles.highlight}>{paymentId.slice(-8)}</span>
              </div>
            )}
          </div>

          {/* Customer Info Card */}
          <div style={styles.orderDetailsCard}>
            <div style={styles.cardTitle}>
              <User size={20} />
              Customer Information
            </div>
            
            <div style={styles.orderInfo}>
              <span>Name:</span>
              <span style={styles.highlight}>{orderDetails.customerName || 'N/A'}</span>
            </div>
            <div style={styles.orderInfo}>
              <span>Email:</span>
              <span style={styles.highlight}>{orderDetails.customerEmail || 'N/A'}</span>
            </div>
            <div style={styles.orderInfo}>
              <span>Phone:</span>
              <span style={styles.highlight}>{orderDetails.customerPhone || 'N/A'}</span>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div style={styles.orderDetailsCard}>
            <div style={styles.cardTitle}>
              <MapPin size={20} />
              Shipping Address
            </div>
            
            <div style={{...styles.orderInfo, flexDirection: 'column', alignItems: 'flex-start'}}>
              <span style={styles.highlight}>
                {orderDetails.shippingAddress || 'Address not provided'}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.buttonsContainer} className="buttons-container">
          <button 
            style={styles.button}
            className="button"
            onClick={handleTrackOrder}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
            }}
          >
            Track Order
          </button>
          <button 
            style={styles.buttonSecondary}
            className="button-secondary"
            onClick={handleContinueShopping}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 215, 0, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmedPage;