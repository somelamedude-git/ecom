import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, Shield, ShoppingBag, LogIn, UserX } from 'lucide-react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/CartPage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CartPage() {
  const [cartitems, setcartitems] = useState([]);
  const [loading, setloading] = useState(true);
  const [loggedIn, setLoggedin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setloading(true);
        
        // Fetch cart items directly - let the backend handle authentication
        const response = await axios.get('http://localhost:3000/cart/getItems', {
          withCredentials: true
        });
        
        // If we get a successful response, user is logged in
        setLoggedin(true);
        setcartitems(response.data.cart || []);
      } catch (err) {
        console.error('Load data error:', err);
        
        // Handle authentication errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          setLoggedin(true);
          setcartitems([]);
        } else {
          // For other errors, also assume not logged in for safety
          setLoggedin(true);
          setcartitems([]);
          console.error('Failed to load cart data:', err);
        }
      } finally {
        setloading(false);
      }
    };
    
    loadData();
  }, []);

  const updateQuantity = async (item_id, item_size, new_quantity) => {
    const item = cartitems.find(i => i.product._id === item_id && i.size === item_size);
    if (!item) {
      toast.error('Item not found in cart');
      return;
    }
    
    const old_quantity = item.quantity;
    
    // Immediate UI update (optimistic)
    if (new_quantity === 0) {
      setcartitems(prev =>
        prev.filter(i => !(i.product._id === item_id && i.size === item_size))
      );
    } else {
      setcartitems(prev =>
        prev.map(i =>
          i.product._id === item_id && i.size === item_size
            ? { ...i, quantity: new_quantity }
            : i
        )
      );
    }

    try {
      // API call in background
      if (new_quantity === 0) {
        await axios.delete(`http://localhost:3000/cart/deleteItem/${item_id}`, {
          data: { size: item_size },
          withCredentials: true
        });
      } else if (old_quantity < new_quantity) {
        // Increment
        await axios.patch(`http://localhost:3000/cart/increment/${item_id}`, {
          size: item_size
        }, {
          withCredentials: true
        });
      } else if (old_quantity > new_quantity) {
        // Decrement
        await axios.patch(`http://localhost:3000/cart/decrement/${item_id}`, {
          size: item_size
        }, {
          withCredentials: true
        });
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      
      // Check if error is due to authentication
      if (error.response?.status === 401 || error.response?.status === 403) {
        setLoggedin(false);
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      
      // Revert optimistic update on error
      if (new_quantity === 0) {
        // Restore the removed item
        setcartitems(prev => [...prev, item]);
      } else {
        // Revert quantity change
        setcartitems(prev =>
          prev.map(i =>
            i.product._id === item_id && i.size === item_size
              ? { ...i, quantity: old_quantity }
              : i
          )
        );
      }
      
      // Show error message to user
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const removeItem = async (item_id, item_size) => {
    const item = cartitems.find(i => i.product._id === item_id && i.size === item_size);
    if (!item) {
      toast.error('Item not found in cart');
      return;
    }
    
    // Immediate UI update (optimistic)
    setcartitems(prev =>
      prev.filter(i => !(i.product._id === item_id && i.size === item_size))
    );

    try {
      // API call in background
      await axios.delete(`http://localhost:3000/cart/deleteItem/${item_id}`, {
        data: { size: item_size },
        withCredentials: true
      });
      
      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Remove item error:', err);
      
      // Check if error is due to authentication
      if (err.response?.status === 401 || err.response?.status === 403) {
        setLoggedin(false);
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      
      // Revert optimistic update on error
      setcartitems(prev => [...prev, item]);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  // Optimized increment/decrement functions for better UX
  const incrementQuantity = (item_id, item_size) => {
    const item = cartitems.find(i => i.product._id === item_id && i.size === item_size);
    if (!item) return;
    updateQuantity(item_id, item_size, item.quantity + 1);
  };

  const decrementQuantity = (item_id, item_size) => {
    const item = cartitems.find(i => i.product._id === item_id && i.size === item_size);
    if (!item) return;
    const new_quantity = Math.max(0, item.quantity - 1);
    updateQuantity(item_id, item_size, new_quantity);
  };

  const handleCheckout = () => {
    if (!loggedIn) {
      toast.error('Please log in to proceed with checkout.');
      navigate('/login');
      return;
    }

    if (cartitems.length === 0) {
      toast.error('Your cart is empty. Add items before checkout.');
      return;
    }

    // User is logged in and has items, proceed to checkout
    navigate('/checkout');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const subtotal = !loading && loggedIn && cartitems.length > 0
    ? cartitems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    : 0;

  // Render login prompt when user is not logged in
  const renderLoginPrompt = () => (
    <div className="login-prompt">
      <UserX size={64} className="login-prompt-icon" />
      <h3>Please log in to view your cart</h3>
      <p>You need to be logged in to access your shopping cart and saved items.</p>
      <button className="login-button" onClick={handleLogin}>
        <LogIn size={20} /> Log In
      </button>
      <button className="continue-shopping-button" onClick={() => navigate('/')}>
        Continue Shopping as Guest
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-main">
          <div className="loading">Loading your cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-main">
        <button className="backb" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Continue Shopping
        </button>

        <div className="cartgrid">
          <div>
            <h1>Shopping Cart</h1>
            
            {/* Show different content based on login status */}
            {!loggedIn ? (
              renderLoginPrompt()
            ) : !cartitems.length ? (
              <div className="emptycart">
                <ShoppingBag size={64} className="emptycarticon" />
                <h3>Your cart is empty</h3>
                <p>Add items to begin</p>
              </div>
            ) : (
              cartitems.map(item => (
                <Link key={`${item.product._id}-${item.size}`} className='cart-item-link'>
                  <div className="cart-item">
                    <div className="itemcontent">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="itemimg"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'; // Fallback image
                        }}
                      />
                      <div className="iteminfo">
                        <h3>{item.product.name}</h3>
                        <div>Size: {item.size} • Color: {item.product.color}</div>
                        <div className="itemprice">${item.product.price.toFixed(2)}</div>
                      </div>
                      <div className="itemactions">
                        <div className="qtycontrol">
                          <button 
                            onClick={(e) => {
                              e.preventDefault(); // Prevent Link navigation
                              decrementQuantity(item.product._id, item.size);
                            }}
                            disabled={loading}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault(); // Prevent Link navigation
                              incrementQuantity(item.product._id, item.size);
                            }}
                            disabled={loading}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          className="removeb"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent Link navigation
                            removeItem(item.product._id, item.size);
                          }}
                          disabled={loading}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Only show sidebar when logged in and has items */}
          {loggedIn && cartitems.length > 0 && (
            <div className="cartsidebar">
              <div className="sidebarcard summary">
                <h3>Order Summary</h3>
                <div className="row">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="row total">
                  <span>Total</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <button
                  className="checkoutb"
                  disabled={!cartitems.length || loading}
                  onClick={handleCheckout}
                >
                  {loading ? 'Loading...' : 'Proceed to Checkout'}
                </button>
                <div className="securityline">
                  <Shield size={16} /> Secure checkout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;