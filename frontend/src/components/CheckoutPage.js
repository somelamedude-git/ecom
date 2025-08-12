import React, { useState } from 'react';
import { ArrowLeft, CreditCard, MapPin, Truck, Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './Header';
import './styles/CheckoutPage.css';
import image from '../assets/checkout-image.jpg';

function CheckoutPage({loggedin, menumove, cartcount = 0, wishlistcount = 0}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // hardcoded cause I'm tiiiiiired~ so let it gooo let it goooo
  const orderItems = [
    {
      id: 1,
      name: "Jacket",
      price: 299.99,
      quantity: 1,
      image: {image},
      size: "M",
      color: "Black"
    },
  ];

  const addresses = [
    { id: 'home', label: 'Home', address: 'yay!' },
    { id: 'work', label: 'Work', address: 'no yay :(' }
  ];

  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: 0 },
    { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: 15.99 },
    { id: 'overnight', name: 'Overnight Delivery', time: 'Next business day', price: 29.99 }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email) {
      toast.error('Please enter your email');
      return false;
    }
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!formData.phone) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (selectedAddress === 'new' && (!formData.address || !formData.city || !formData.pincode)) {
      toast.error('Please fill in all address fields');
      return false;
    }
    return true;
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    if (promoCode.toLowerCase() === 'clique20:p') {
      setPromoApplied(true);
      toast.success('Promo code applied successfully! 20% off');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setPromoApplied(false);
    setPromoCode('');
    toast.info('Promo code removed');
  };

  // Yay kese toh bhi chal gayaaa
  const handleMockPayment = (orderData) => {
    toast.success('Mock payment success');
    navigate('/order-confirmed', {
      state: {
        orderId: 'HappyHappyHappy',
        orderDetails: orderData
      }
    });
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryPrice = deliveryOptions.find(option => option.id === selectedDelivery)?.price || 0;
    const discount = promoApplied ? subtotal * 0.2 : 0;
    const total = subtotal + deliveryPrice - discount;

    const orderData = {
      items: orderItems,
      subtotal,
      deliveryPrice,
      discount,
      total,
      promoApplied
    };

    setLoading(true);

    if (selectedPayment === 'razorpay') {
      handleMockPayment(orderData);
    } else if (selectedPayment === 'cod') {
      toast.success('Mock COD order placed.');
      navigate('/order-confirmed', {
        state: {
          orderId: 'TEMP-COD',
          orderDetails: orderData
        }
      });
    }

    setLoading(false);
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryPrice = deliveryOptions.find(option => option.id === selectedDelivery)?.price || 0;
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const total = subtotal + deliveryPrice - discount;

  return (
    <div className="checkout-container">
      <Header
        currentPage="checkout"
        cartcount={cartcount}
        wishlistcount={wishlistcount}
        loggedin={loggedin}
        menumove={menumove}
      />

      <div className="checkout-main-content">
        <button 
          onClick={() => navigate('/cart')}
          className="checkout-back-button"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <h1 className="checkout-page-title">Checkout</h1>
        <p className="checkout-subtitle">Complete your order securely</p>

        <div className="checkout-content-grid">
          {/* Checkout Form */}
          <div className="checkout-section-container">
            {/* Contact Information */}
            <div className="checkout-section">
              <div className="checkout-section-title">Contact Information</div>
              <div className="checkout-form">
                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label className="checkout-label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="checkout-input"
                    />
                  </div>
                  <div className="checkout-form-group">
                    <label className="checkout-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="checkout-input"
                    />
                  </div>
                </div>
                <div className="checkout-form-group">
                  <label className="checkout-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="checkout-input"
                  />
                </div>
                <div className="checkout-form-group">
                  <label className="checkout-label">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="checkout-input"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="checkout-section">
              <MapPin size={20} />
              <div className="checkout-section-title">Shipping Address</div>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => setSelectedAddress(address.id)}
                  className={`checkout-address-card ${selectedAddress === address.id ? 'selected' : ''}`}
                >
                  <div>{address.label}</div>
                  <div>{address.address}</div>
                </div>
              ))}
              <div
                onClick={() => setSelectedAddress('new')}
                className={`checkout-address-card ${selectedAddress === 'new' ? 'selected' : ''}`}
              >
                <div>New Address</div>
              </div>

              {selectedAddress === 'new' && (
                <>
                  <input name="address" placeholder="Street" value={formData.address} onChange={handleInputChange} />
                  <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} />
                  <input name="state" placeholder="State" value={formData.state} onChange={handleInputChange} />
                  <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} />
                </>
              )}
            </div>

            {/* Delivery Method */}
            <div className="checkout-section">
              <Truck size={20} />
              <div className="checkout-section-title">Delivery Method</div>
              {deliveryOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedDelivery(option.id)}
                  className={`checkout-delivery-card ${selectedDelivery === option.id ? 'selected' : ''}`}
                >
                  <div>{option.name} - {option.time}</div>
                  <div>{option.price > 0 ? `₹${option.price}` : 'Free'}</div>
                </div>
              ))}
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <CreditCard size={20} />
              <div className="checkout-section-title">Payment Method</div>
              <div onClick={() => setSelectedPayment('razorpay')} className={`checkout-payment-card ${selectedPayment === 'razorpay' ? 'selected' : ''}`}>
                <Shield size={18} /> Pay via Razorpay (Mock)
              </div>
              <div onClick={() => setSelectedPayment('cod')} className={`checkout-payment-card ${selectedPayment === 'cod' ? 'selected' : ''}`}>
                <Lock size={18} /> Cash on Delivery
              </div>
            </div>

            {/* Promo Code */}
            <div className="checkout-section">
              <div className="checkout-section-title">Promo Code</div>
              <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter promo code" />
              {!promoApplied ? <button onClick={applyPromoCode}>Apply</button> : <button onClick={removePromoCode}>Remove</button>}
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            {orderItems.map(item => (
              <div key={item.id}>
                <img src={item.image} alt={item.name} width="50" />
                {item.name} x {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            ))}
            <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
            <div>Delivery: {deliveryPrice > 0 ? `₹${deliveryPrice.toFixed(2)}` : 'Free'}</div>
            {promoApplied && <div>Discount: -₹{discount.toFixed(2)}</div>}
            <div>Total: ₹{total.toFixed(2)}</div>
            <button onClick={handlePlaceOrder} disabled={loading}>{loading ? 'Processing...' : 'Place Order'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
