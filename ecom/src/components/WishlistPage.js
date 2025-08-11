import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/WishlistPage.css';
import axios from 'axios';

function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('http://localhost:3000/wishlist/getItems', {  
          withCredentials: true,
        });
        setWishlist(res.data.wish_items_info);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const remove = async (product_id, item_size) => {
    // Store the current wishlist for rollback if needed
    const previousWishlist = [...wishlist];
    
    // Update UI immediately (optimistic update)
    setWishlist(wishlist.filter(i => !(i.item.product._id == product_id && i.item.size === item_size)));
    
    try {
      // Call API after UI update
      await axios.delete(`http://localhost:3000/wishlist/deleteItem/${product_id}`, {
        data: { size: item_size },
        withCredentials: true
      });
    } catch (e) {
      console.error(e);
      // Rollback UI changes if API call fails
      setWishlist(previousWishlist);
      alert('Failed to remove item from wishlist. Please try again.');
    }
  };

  const addCart = async (item) => {
    // Store the current wishlist for rollback if needed
    const previousWishlist = [...wishlist];
    
    // Update UI immediately by removing the item
    setWishlist(prev => prev.filter(i => !(i.item.product._id == item.item.product._id && i.item.size === item.item.size)));
    
    try {
      // Add to cart
      await axios.post(`http://localhost:3000/cart/addItem/${item.item.product._id}`, {
        size_: item.item.size
      }, {
        withCredentials: true
      });
      
      // Remove from wishlist (API call)
      await axios.delete(`http://localhost:3000/wishlist/deleteItem/${item.item.product._id}`, {
        data: { size: item.item.size },
        withCredentials: true
      });
      
      alert(`${item.item.product.name} added to cart`);
    } catch (error) {
      console.log(error);
      // Rollback UI changes if any API call fails
      setWishlist(previousWishlist);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const addAll = async () => {
    const inStockItems = wishlist.filter(i => i.inStock);
    const previousWishlist = [...wishlist];
    
    // Update UI immediately by removing all in-stock items
    setWishlist(prev => prev.filter(i => !i.inStock));
    
    try {
      // Process all items
      await Promise.all(inStockItems.map(async (item) => {
        // Add to cart
        await axios.post(`http://localhost:3000/cart/addItem/${item.item.product._id}`, {
          size_: item.item.size
        }, {
          withCredentials: true
        });
        
        // Remove from wishlist
        await axios.delete(`http://localhost:3000/wishlist/deleteItem/${item.item.product._id}`, {
          data: { size: item.item.size },
          withCredentials: true
        });
      }));
      
      alert('Added all in-stock items to cart!');
    } catch (error) {
      console.error(error);
      // Rollback UI changes if any API calls fail
      setWishlist(previousWishlist);
      alert('Failed to add some items to cart. Please try again.');
    }
  };

  const total = wishlist.reduce((sum, i) => sum + i.item.product.price, 0);
  const inStockCount = wishlist.filter(i => i.inStock).length;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="cart-container">
      <div className="cart-main">
        <button className="backb" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Continue Shopping
        </button>

        <div className="cartgrid">
          <div>
            <h1>My Wishlist</h1>
            {!wishlist.length ? (
              <div className="emptycart">
                <Heart className="emptycarticon" size={64} />
                <h3>Your wishlist is empty</h3>
                <p className="emptycarttext">Save items you love for later</p>
              </div>
            ) : (
              wishlist.map(item => (
                <div key={`${item.item.product._id}-${item.item.size}`} className="cartitem">
                  <div className="itemcontent">
                    <img
                      src={item.item.product.image}
                      alt=""
                      className="itemimg"
                    />
                    <div className="iteminfo">
                      <h3>{item.item.product.name}</h3>
                      <div>
                        Size: {item.item.size} • Color:{' '}
                        {item.item.product.color}
                      </div>
                      <div className="itemprice">
                        ${item.item.product.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="itemactions">
                      <button
                        className="addtocartb"
                        disabled={!item.inStock}
                        onClick={() => addCart(item)}
                      >
                        <ShoppingBag size={16} /> Add to Cart
                      </button>
                      <button
                        className="removeb"
                        onClick={() => remove(item.item.product._id, item.item.size)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cartsidebar">
            <div className="sidebarcard">
              <h3>
                <Heart size={20} /> Wishlist Summary
              </h3>
              <div className="summary">
                <div className="row">
                  <span>Total Items</span>
                  <span>{wishlist.length}</span>
                </div>
                <div className="row">
                  <span>In Stock</span>
                  <span>{inStockCount}</span>
                </div>
                <div className="row total">
                  <span>Total Value</span>
                  <span className="totalval">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="checkoutb"
                disabled={!inStockCount}
                onClick={addAll}
              >
                Add All to Cart ({inStockCount})
              </button>
              <button
                className="secondaryb"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>

            <div className="sidebarcard">
              <h3>Recently Viewed</h3>
              <p className="emptycarttext">Items you have recently viewed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;