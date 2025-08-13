import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, Shield, ShoppingBag } from 'lucide-react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/CartPage.css';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartitems, setcartitems] = useState([]);
  const [loading, setloading] = useState(true);

  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cart/getItems', {
          withCredentials: true
        });
        setcartitems(response.data.cart);
      } catch (err) {
        console.log(err);
      } finally {
        setloading(false);
      }
    };
    loadData();
  }, []);

  const updateQuantity = async (item_id, item_size, new_quantity) => {
    const item = cartitems.find(i => i.product._id === item_id && i.size === item_size);
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
        await axios.patch(`http://localhost:3000/cart/increment/${item_id}`,
          { size: item_size },
          { withCredentials: true }
        );
      } else if (old_quantity > new_quantity) {
        // Decrement
        await axios.patch(`http://localhost:3000/cart/decrement/${item_id}`, {
          size: item_size
        }, {
          withCredentials: true
        });
      }
    } catch (error) {
      console.log('API Error:', error);
      
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
      alert('Failed to update cart. Please try again.');
    }
  };

  const removeItem = async (item_id, item_size) => {
    const item = cartitems.find(i => i.product._id === item_id && i.size === item_size);
    
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
    } catch (err) {
      console.log('Remove item error:', err);
      
      // Revert optimistic update on error
      setcartitems(prev => [...prev, item]);
      alert('Failed to remove item. Please try again.');
    }
  };

  // Optimized increment/decrement functions for better UX
  const incrementQuantity = (item_id, item_size) => {
    const item = cartitems.find(i => i.product._id === item_id && i.size === item_size);
    updateQuantity(item_id, item_size, item.quantity + 1);
  };

  const decrementQuantity = (item_id, item_size) => {
    const item = cartitems.find(i => i.product._id === item_id && i.size === item_size);
    const new_quantity = Math.max(0, item.quantity - 1);
    updateQuantity(item_id, item_size, new_quantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const subtotal = !loading
    ? (cartitems || []).reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      )
    : 0;

  return (
    <div className="cart-container">
      <div className="cart-main">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <button className="backb" onClick={() => navigate('/')}>
              <ArrowLeft size={20} /> Continue Shopping
            </button>

            <div className="cartgrid">
              <div>
                <h1>Shopping Cart</h1>
                {!cartitems.length ? (
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
                          <img src={item.product.image} alt={item.product.name} className="itemimg" />
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
                              >
                                <Minus size={16} />
                              </button>
                              <span>{item.quantity}</span>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent Link navigation
                                  incrementQuantity(item.product._id, item.size);
                                }}
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
                    disabled={!cartitems.length}
  
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                  <div className="securityline">
                    <Shield size={16} /> Secure checkout
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;