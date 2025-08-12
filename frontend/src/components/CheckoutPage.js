import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, MapPin, Truck, Shield, Lock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './Header';
import './styles/CheckoutPage.css';
import image from '../assets/checkout-image.jpg';

function CheckoutPage({ 
  loggedin, 
  menumove, 
  cartcount = 0, 
  wishlistcount = 0 
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
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
//call the order/wishlist api here abhi hardcode maar rhai hu. pk gayi me ab
  const orderItems = [
    {
      id: 1,
      name: "Jacket",
      price: 299.99, //hehehehe
      quantity: 1,
      image: {image},
      size: "M",
      color: "Black"
    },
  ];

  const addresses = [
    { id: 'home', label: 'Home', address: 'yay' },
    { id: 'work', label: 'Work', address: 'no yay' }
  ];

  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: 0 },
    { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: 15.99 },
    { id: 'overnight', name: 'Overnight Delivery', time: 'Next business day', price: 29.99 }
  ];

  // Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'checkout.js';
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          toast.error('Failed to load payment gateway. Please try again.');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
//enter fields send it to backend
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
    
    // Mock promo code validation
    if (promoCode.toLowerCase() === 'clique20') {
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

  const createRazorpayOrder = async (orderData) => {
    try {
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: orderData.total * 100, // Convert
          currency: 'INR',
          orderItems: orderData.items,
          customerInfo: formData,
          deliveryInfo: {
            option: selectedDelivery,
            address: selectedAddress
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async (orderData) => {
//razorpay ka yahan payment wala code
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryPrice = deliveryOptions.find(option => option.id === selectedDelivery)?.price || 0;
    const discount = promoApplied ? subtotal * 0.2 : 0;
    const total = subtotal + deliveryPrice - discount;

    const orderData = {
      items: orderItems, subtotal, deliveryPrice, discount,
      total,
      promoApplied
    };

    if (selectedPayment === 'razorpay') {
      await handleRazorpayPayment(orderData);
    } else if (selectedPayment === 'cod') {
      try {
        setLoading(true);
        // Handle COD order

        if (!response.ok) {
          throw new Error('Failed to place order');
        }

        const data = await response.json();
        toast.success('Order placed successfully!');
        navigate('/order-confirmed', { 
          state: { 
            orderId: data.orderId,
            orderDetails: data.orderDetails 
          }
        });
      } catch (error) {
        console.error('COD order error:', error);
        toast.error('Failed to place order. Please try again.');
      } finally {
        setLoading(false);
      }
    }
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
              <div className="checkout-section-header">
                <div className="checkout-section-title">Contact Information</div>
              </div>
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
                      placeholder="First name"
                      required
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
                      placeholder="Last name"
                      required
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
                    placeholder="email@example.com"
                    required
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
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <MapPin size={20} className="checkout-section-icon" />
                <div className="checkout-section-title">Shipping Address</div>
              </div>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => setSelectedAddress(address.id)}
                  className={`checkout-address-card ${selectedAddress === address.id ? 'selected' : ''}`}
                >
                  <div className="checkout-address-label">{address.label}</div>
                  <div className="checkout-address-text">{address.address}</div>
                </div>
              ))}
              
              <div
                onClick={() => setSelectedAddress('new')}
                className={`checkout-address-card ${selectedAddress === 'new' ? 'selected' : ''}`}
              >
                <div className="checkout-address-label">New Address</div>
                <div className="checkout-address-text">Add a new delivery address</div>
              </div>

              {selectedAddress === 'new' && (
                <div className="checkout-form" style={{ marginTop: '16px' }}>
                  <div className="checkout-form-group">
                    <label className="checkout-label">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="checkout-input"
                      placeholder="Street address"
                      required
                    />
                  </div>
                  <div className="checkout-form-row">
                    <div className="checkout-form-group">
                      <label className="checkout-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="checkout-input"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="checkout-form-group">
                      <label className="checkout-label">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="checkout-input"
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>
                  <div className="checkout-form-group">
                    <label className="checkout-label">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="checkout-input"
                      placeholder="Pincode"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Method */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <Truck size={20} className="checkout-section-icon" />
                <div className="checkout-section-title">Delivery Method</div>
              </div>
              {deliveryOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedDelivery(option.id)}
                  className={`checkout-delivery-card ${selectedDelivery === option.id ? 'selected' : ''}`}
                >
                  <div className="checkout-delivery-info">
                    <div className="checkout-delivery-name">{option.name}</div>
                    <div className="checkout-delivery-time">{option.time}</div>
                  </div>
                  <div className="checkout-delivery-price">
                    {option.price > 0 ? `₹${option.price.toFixed(2)}` : 'Free'}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <CreditCard size={20} className="checkout-section-icon" />
                <div className="checkout-section-title">Payment Method</div>
              </div>
              <div
                onClick={() => setSelectedPayment('razorpay')}
                className={`checkout-payment-card ${selectedPayment === 'razorpay' ? 'selected' : ''}`}
              >
                <Shield size={18} />
                <span>Pay Securely via Razorpay</span>
              </div>
              <div
                onClick={() => setSelectedPayment('cod')}
                className={`checkout-payment-card ${selectedPayment === 'cod' ? 'selected' : ''}`}
              >
                <Lock size={18} />
                <span>Cash on Delivery</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <div className="checkout-section-title">Promo Code</div>
              </div>
              <div className="checkout-promo">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="checkout-input"
                />
                {!promoApplied ? (
                  <button onClick={applyPromoCode} className="checkout-promo-button">
                    Apply
                  </button>
                ) : (
                  <button onClick={removePromoCode} className="checkout-promo-remove">
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="checkout-summary-items">
              {orderItems.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <img src={item.image} alt={item.name} className="checkout-summary-image" />
                  <div className="checkout-summary-details">
                    <div className="checkout-summary-name">{item.name}</div>
                    <div className="checkout-summary-meta">
                      Size: {item.size} | Color: {item.color}
                    </div>
                    <div className="checkout-summary-quantity">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="checkout-summary-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-summary-line">
              <span>Delivery</span>
              <span>{deliveryPrice > 0 ? `₹${deliveryPrice.toFixed(2)}` : 'Free'}</span>
            </div>
            {promoApplied && (
              <div className="checkout-summary-line discount">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="checkout-summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              className="checkout-place-order"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
