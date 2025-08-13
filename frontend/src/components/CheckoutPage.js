import React, { useState, useEffect, useMemo, useCallback, use } from 'react';
import { ArrowLeft, CreditCard, MapPin, Truck, Shield, Lock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from './Header';
import '../styles/CheckoutPage.css';
import image from '../assets/checkout-image.jpg';

function CheckoutPage({ 
  loggedin, 
  menumove, 
  cartcount = 0, 
  wishlistcount = 0 
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('new');
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromoData, setAppliedPromoData] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});
  const [loggedin, setLoggedin] = useState(false);

  const fetchData = useCallback(async()=>{
    try{
       const res_login_status = await axios.get('http://localhost:3000/user/verifyLogin', {
              withCredentials: true
            });

            if(res_login_status.data.isLoggedIn){
              setLoggedin(true);
            }
    }catch(error){
      console.log(error);
    }
  })
  
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

  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: 0 },
    { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: 15.99 },
    { id: 'overnight', name: 'Overnight Delivery', time: 'Next business day', price: 29.99 }
  ];

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // Helper function for API error handling
  const handleApiError = (error, context) => {
    console.error(`${context} error:`, error);
    
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
    } else if (error.response?.status === 404) {
      toast.error(`${context}: Resource not found`);
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(error.response?.data?.message || error.message || `${context} failed`);
    }
  };

  // Fetch cart items and user data on component mount
  useEffect(() => {
    if (!loggedin) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    fetchCartItems();
    fetchUserProfile();
  }, [loggedin, navigate]);

  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/getItems`);
      
      if (response.data.status) {
        // Transform cart data to match our orderItems format
        const transformedItems = response.data.cart.map(item => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          // Handle array of images or single image
          image: Array.isArray(item.product.productImages) 
            ? item.product.productImages[0] 
            : item.product.productImages,
          size: item.size,
          color: item.product.color || 'Default',
          productId: item.product._id
        }));
        setOrderItems(transformedItems);
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart items');
      }
    } catch (error) {
      handleApiError(error, 'Cart fetch');
      navigate('/cart');
    } finally {
      setCartLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`);
      
      if (response.data.status) {
        const user = response.data.user;
        setUserProfile(user);
        
        // Safer name parsing
        const fullName = user.name || '';
        const nameParts = fullName.trim().split(' ');
        
        // Auto-fill form data from user profile
        setFormData(prevData => ({
          ...prevData,
          email: user.email || '',
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: user.phone_number || ''
        }));

        // Set addresses with better error handling
        if (user.addresses && Array.isArray(user.addresses) && user.addresses.length > 0) {
          const userAddresses = user.addresses.map((addr, index) => {
            // Ensure all address fields exist
            const street = addr.street || '';
            const city = addr.city || '';
            const state = addr.state || '';
            const pincode = addr.pincode || '';
            
            return {
              id: `address_${index}`,
              label: addr.type || `Address ${index + 1}`,
              address: `${street}, ${city}, ${state} - ${pincode}`.replace(/^,\s*|,\s*$/g, ''),
              data: addr
            };
          });
          setAddresses(userAddresses);
          if (userAddresses.length > 0) {
            setSelectedAddress(userAddresses[0].id);
          }
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch user profile');
      }
    } catch (error) {
      handleApiError(error, 'User profile fetch');
    }
  };

  // Razorpay script loading with cleanup
  useEffect(() => {
    let script = null;
    
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
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
    
    // Cleanup function
    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    
    if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    
    if (selectedAddress === 'new') {
      const requiredFields = ['address', 'city', 'pincode'];
      const missingFields = requiredFields.filter(field => !formData[field]?.trim());
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(', ')}`);
        return false;
      }
      
      // Basic pincode validation (6 digits for India)
      if (!/^\d{6}$/.test(formData.pincode)) {
        toast.error('Please enter a valid 6-digit pincode');
        return false;
      }
    }
    
    return true;
  };

  const saveAddress = async () => {
    try {
      setAddressSaving(true);
      const addressData = {
        street: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        type: 'shipping'
      };

      const response = await axios.post(`${API_BASE_URL}/address/ChangeAddress`, addressData);
      
      if (response.data.success) {
        toast.success('Address saved successfully');
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to save address');
      }
    } catch (error) {
      handleApiError(error, 'Address save');
      return false;
    } finally {
      setAddressSaving(false);
    }
  };

  // Updated promo code function to use the API
  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    
    if (promoApplied) {
      toast.info('A promo code is already applied');
      return;
    }

    try {
      setPromoLoading(true);
      
      // Calculate current total (before promo)
      const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryPrice = deliveryOptions.find(option => option.id === selectedDelivery)?.price || 0;
      const currentTotal = subtotal + deliveryPrice;

      const response = await axios.patch(`${API_BASE_URL}/promo/apply`, {
        total_cost: currentTotal,
        code_used: promoCode.trim()
      });

      if (response.data.success) {
        setPromoApplied(true);
        setAppliedPromoData({
          code: promoCode.trim(),
          newCost: response.data.new_cost,
          originalCost: currentTotal,
          discount: currentTotal - response.data.new_cost
        });
        toast.success(`Promo code applied successfully! You saved ₹${(currentTotal - response.data.new_cost).toFixed(2)}`);
      } else {
        throw new Error(response.data.message || 'Failed to apply promo code');
      }
    } catch (error) {
      console.error('Promo code error:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid promo code');
      } else {
        handleApiError(error, 'Promo code application');
      }
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromoCode = () => {
    setPromoApplied(false);
    setPromoCode('');
    setAppliedPromoData(null);
    toast.info('Promo code removed');
  };

//   const createRazorpayOrder = async (orderData) => {
//     try {
//       const response = await fetch('/api/create-razorpay-order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           amount: orderData.total * 100, // Convert
//           currency: 'INR',
//           orderItems: orderData.items,
//           customerInfo: formData,
//           deliveryInfo: {
//             option: selectedDelivery,
//             address: selectedAddress
//           }
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create order');
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error creating Razorpay order:', error);
//       throw error;
//     }
//   };
  const createOrderFromCart = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/order/cart`);
      return response.data;
    } catch (error) {
      console.error('Error creating order from cart:', error);
      throw error;
    }
  };

  const createRazorpayOrder = async (orderId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/pay`, {
        order_id: orderId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    try {
      setLoading(true);
      
      // Save address if new address is selected
      if (selectedAddress === 'new') {
        const addressSaved = await saveAddress();
        if (!addressSaved) {
          setLoading(false);
          return;
        }
      }
      
      // First create order from cart
      const orderResponse = await createOrderFromCart();
      
      if (!orderResponse.status) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      // Get the first order ID from successful orders
      const orderId = orderResponse.successOrders[0];
      
      if (!orderId) {
        throw new Error('No valid order created');
      }
      
      // Create Razorpay payment order
      const paymentData = await createRazorpayOrder(orderId);

      if (!paymentData.success) {
        throw new Error('Failed to initialize payment');
      }

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Your Store Name',
        description: 'Order Payment',
        order_id: paymentData.order_id,
        handler: function (response) {
          toast.success('Payment successful!');
          navigate('/order-confirmed', {
            state: {
              orderId: orderId,
              paymentId: response.razorpay_payment_id,
              orderDetails: orderResponse,
              promoApplied: appliedPromoData
            }
          });
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: selectedAddress === 'new' ? 
            `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}` :
            addresses.find(addr => addr.id === selectedAddress)?.address || '',
          promoCode: appliedPromoData?.code || ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Razorpay payment error:', error);
      handleApiError(error, 'Payment');
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    try {
      setLoading(true);
      
      // Save address if new address is selected
      if (selectedAddress === 'new') {
        const addressSaved = await saveAddress();
        if (!addressSaved) {
          return;
        }
      }

      // Create order from cart for COD
      const orderResponse = await createOrderFromCart();
      
      if (!orderResponse.status) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      toast.success('Order placed successfully!');
      navigate('/order-confirmed', {
        state: {
          orderId: orderResponse.successOrders[0],
          paymentMethod: 'cod',
          orderDetails: orderResponse,
          promoApplied: appliedPromoData
        }
      });

    } catch (error) {
      console.error('COD order error:', error);
      handleApiError(error, 'Order placement');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // if (selectedPayment === 'razorpay') {
    //   await handleRazorpayPayment(orderData);
    // } else if (selectedPayment === 'cod') {
    //   try {
    //     setLoading(true);
    //     // Handle COD order

    //     if (!response.ok) {
    //       throw new Error('Failed to place order');
    //     }

    //     const data = await response.json();
    //     toast.success('Order placed successfully!');
    //     navigate('/order-confirmed', { 
    //       state: { 
    //         orderId: data.orderId,
    //         orderDetails: data.orderDetails 
    //       }
    //     });
    //   } catch (error) {
    //     console.error('COD order error:', error);
    //     toast.error('Failed to place order. Please try again.');
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    if (selectedPayment === 'razorpay') {
      await handleRazorpayPayment();
    } else if (selectedPayment === 'cod') {
      await handleCODOrder();
    } 
  };

  // Calculate totals with promo consideration
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryPrice = deliveryOptions.find(option => option.id === selectedDelivery)?.price || 0;
  
  let discount = 0;
  let total = subtotal + deliveryPrice;
  
  if (promoApplied && appliedPromoData) {
    // Use the exact discount and total from API response
    total = appliedPromoData.newCost;
    discount = appliedPromoData.discount;
  }

  if (cartLoading) {
    return (
      <div className="checkout-container">
        <Header
          currentPage="checkout"
          cartcount={cartcount}
          wishlistcount={wishlistcount}
          loggedin={loggedin}
          menumove={menumove}
        />
        <div className="checkout-loading">
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (orderItems.length === 0) {
    return (
      <div className="checkout-container">
        <Header
          currentPage="checkout"
          cartcount={cartcount}
          wishlistcount={wishlistcount}
          loggedin={loggedin}
          menumove={menumove}
        />
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/shop')} className="checkout-shop-button">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

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
                  {addressSaving && (
                    <div className="checkout-saving-indicator">
                      Saving address...
                    </div>
                  )}
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
                {!razorpayLoaded && <span className="checkout-loading-text">(Loading...)</span>}
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
                  disabled={promoApplied || promoLoading}
                />
                {!promoApplied ? (
                  <button 
                    onClick={applyPromoCode} 
                    className="checkout-promo-button"
                    disabled={promoLoading || !promoCode.trim()}
                  >
                    {promoLoading ? 'Applying...' : 'Apply'}
                  </button>
                ) : (
                  <button onClick={removePromoCode} className="checkout-promo-remove">
                    Remove
                  </button>
                )}
              </div>
              {promoApplied && appliedPromoData && (
                <div className="checkout-promo-success">
                  <Check size={16} />
                  <span>{appliedPromoData.code.toUpperCase()} applied - You saved ₹{appliedPromoData.discount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="checkout-summary-items">
              {orderItems.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="checkout-summary-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg'; // Fallback image
                    }}
                  />
                  <div className="checkout-summary-details">
                    <div className="checkout-summary-name">{item.name}</div>
                    <div className="checkout-summary-meta">
                      Size: {item.size} {item.color && `| Color: ${item.color}`}
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
            {promoApplied && discount > 0 && (
              <div className="checkout-summary-line discount">
                <span>Discount ({appliedPromoData?.code.toUpperCase()})</span>
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
              disabled={loading || addressSaving || promoLoading}
            >
              {loading ? 'Processing...' : addressSaving ? 'Saving...' : promoLoading ? 'Applying Promo...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;