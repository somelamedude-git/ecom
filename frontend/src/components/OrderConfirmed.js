import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Package, MapPin, User} from 'lucide-react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/OrderConfirmedPage.css';

toast.configure();

const OrderConfirmedPage= ()=> {
  const location= useLocation();
  const navigate= useNavigate();
  const [showTick, setShowTick]= useState(false);
  const [showContent, setShowContent]= useState(false)
  const orderData= location.state;

  useEffect(()=> {
    if (!orderData || !orderData.orderId) {
      toast.error('Order data is missing. Redirecting to home...');
      setTimeout(()=> navigate('/'), 2000);
      return;
   }
    const tickTimer= setTimeout(()=> setShowTick(true), 500);
    const contentTimer= setTimeout(()=> setShowContent(true), 1800);
    return ()=> {
      clearTimeout(tickTimer);
      clearTimeout(contentTimer);
   };
 }, [orderData, navigate]);

  if (!orderData || !orderData.orderId) {
    return null;
  }
  const {orderId, paymentId, paymentMethod, orderDetails}= orderData;
  const generateOrderNumber= (id)=> {
    const timestamp= new Date().getFullYear();
    const shortId= id.slice(-4).toUpperCase();
    return `ORD-${timestamp}-${shortId}`;
 };
  const handleTrackOrder= ()=> {
    navigate('/orders', {state:{highlightOrder:orderId}});
 };
  const handleContinueShopping= ()=> {
    navigate('/products');
 };

  return (
    <div className="container">
      <div className="background-pattern"></div>

      <div className="tick-container">
        <div className={`circle ${showTick ? 'pulse' :''}`}>
          <svg className="tick" viewBox="0 0 60 30">
            <path
              className={`tick-path ${showTick ? 'draw' :''}`}
              d="M5 15 L20 25 L55 5"
            />
          </svg>
        </div>
      </div>
      <div className={`content ${showContent ? 'show' :''}`}>
        <h1 className="title">Order Confirmed!</h1>
        <p className="subtitle">
          Thank you for your purchase. Your order has been successfully placed and is being processed.
        </p>

        <div className="order-number">
          Order Number:<span className="highlight">{generateOrderNumber(orderId)}</span>
        </div>
        <div className="order-details-container">
          <div className="order-details-card">
            <div className="card-title">
              <Package size={20} /> Order Summary
            </div>
            <div className="items-list">
              {orderDetails.items?.map((item, index)=> (
                <div key={index} className="order-item">
                  <div className="item-name">
                    {item.name}
                    <div className="item-details">
                      Size:{item.size} | Qty:{item.quantity}
                    </div>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="total-section">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>₹{orderDetails.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              {orderDetails.deliveryPrice > 0 && (
                <div className="total-line">
                  <span>Delivery:</span>
                  <span>₹{orderDetails.deliveryPrice?.toFixed(2)}</span>
                </div>
              )}
              {orderDetails.discount > 0 && (
                <div className="total-line">
                  <span>Discount:</span>
                  <span style={{color:'#4ade80'}}>
                    -₹{orderDetails.discount?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="total-final">
                <span>Total:</span>
                <span>₹{orderDetails.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
          {/*deliver n payment yaha aate he*/}
          <div className="order-details-card">
            <div className="card-title">
              <MapPin size={20} /> Delivery & Payment Info
            </div>
            <div className="order-info">
              <span>Estimated Delivery:</span>
              <span className="highlight">{orderDetails.deliveryDate || 'TBD'}</span>
            </div>
            <div className="order-info">
              <span>Delivery Method:</span>
              <span className="highlight">{orderDetails.deliveryMethod || 'Standard'}</span>
            </div>
            <div className="order-info">
              <span>Payment Method:</span>
              <span className="highlight">
                {paymentMethod=== 'cod' ? 'Cash on Delivery' :'Razorpay'}
              </span>
            </div>
            {paymentId && (
              <div className="order-info">
                <span>Payment ID:</span>
                <span className="highlight">{paymentId.slice(-8)}</span>
              </div>
            )}
          </div>

          {/* Customer ke baareme */}
          <div className="order-details-card">
            <div className="card-title">
              <User size={20} /> Customer Information
            </div>
            <div className="order-info">
              <span>Name:</span>
              <span className="highlight">{orderDetails.customerName || 'N/A'}</span>
            </div>
            <div className="order-info">
              <span>Email:</span>
              <span className="highlight">{orderDetails.customerEmail || 'N/A'}</span>
            </div>
            <div className="order-info">
              <span>Phone:</span>
              <span className="highlight">{orderDetails.customerPhone || 'N/A'}</span>
            </div>
          </div>

          <div className="order-details-card">
            <div className="card-title">
              <MapPin size={20} /> Shipping Address
            </div>
            <div className="order-info column">
              <span className="highlight">
                {orderDetails.shippingAddress || 'Address not provided'}
              </span>
            </div>
          </div>
        </div>

        <div className="buttons-container">
          <button className="button" onClick={handleTrackOrder}>
            Track Order
          </button>
          <button className="button-secondary" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmedPage;
