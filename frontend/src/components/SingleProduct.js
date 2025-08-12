import React, { useState, useEffect } from 'react';
import {ArrowLeft, Heart, ShoppingBag, Star, Plus, Minus, Share, Shield, Truck, RotateCcw, Send, User} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/singleProduct.css'

function ProductDescriptionPage() {
  const { product_id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [stockInfo, setStockInfo] = useState({});
  
  
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    description: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

 
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/product/details/${product_id}`);
      const { product_info, product_sizes } = response.data;
      
      setProduct(product_info);
      setAvailableSizes(product_sizes);
      setStockInfo(product_info.stock || {});
      setSelectedSize(product_sizes[0] || '');
    } catch (err) {
      setError('Failed to load product details. Please try again later.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };


  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(`http://localhost:3000/product/getReviews/${product_id}`);
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };


  const submitReview = async () => {
    try {
     setSubmittingReview(true);
const response = await axios.post(
  `http://localhost:3000/product/${product_id}/addReview`,
  {
    rating: newReview.rating,
    description: newReview.description,
  },
  {
    withCredentials: true,
  }
);

      setReviews(prev => [response.data.review, ...prev]);
      setShowReviewForm(false);
      setNewReview({ rating: 0, description: '' });
      
      if (response.data.updatedProduct) {
        setProduct(prev => ({
          ...prev,
          popularity: response.data.updatedProduct.popularity
        }));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };


  const handleAddToCart = async (size) => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    const availableStock = stockInfo[selectedSize] || 0;
    if (availableStock < quantity) {
      alert(`Only ${availableStock} items available in size ${selectedSize}`);
      return;
    }

    try{
        await axios.post(`http://localhost:3000/cart/addItem/${product_id}`, {
        size_: selectedSize
    },
{withCredentials: true}
)
    } catch(error){
        console.log(error);
    }

    console.log('Added to cart', { 
      productId: product._id, 
      selectedSize, 
      quantity,
      price: product.price 
    });
    alert(`${formatProductName(product.name)} (Size: ${selectedSize}) added to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: API call to add/remove from wishlist
  };

const handleSubmitReview = () => {
  if (newReview.rating === 0) {
    alert('Please select a rating');
    return;
  }
  if (newReview.description.trim().length < 10) {
    alert('Please write a review with at least 10 characters');
    return;
  }

  submitReview(); 
};

useEffect(()=>{
    fetchProduct();
    fetchReviews();
}, [])

  const formatProductName = (name) => {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderStars = (rating, interactive = false, onStarClick = null, onStarHover = null) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starRating = i + 1;
      const isFilled = interactive 
        ? (hoverRating >= starRating || (!hoverRating && newReview.rating >= starRating))
        : i < Math.floor(rating);
      
      return (
        <Star
          key={i}
          size={interactive ? 24 : 16}
          className={`star ${isFilled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => onStarClick(starRating) : undefined}
          onMouseEnter={interactive ? () => onStarHover(starRating) : undefined}
          onMouseLeave={interactive ? () => onStarHover(0) : undefined}
          style={interactive ? { cursor: 'pointer' } : {}}
        />
      );
    });
  };

  const getStockStatus = (size) => {
    const stock = stockInfo[size] || 0;
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  };

  const getStockText = (size) => {
    const stock = stockInfo[size] || 0;
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return `Only ${stock} left`;
    return 'In Stock';
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderTabContent = () => {
    if (!product) return null;
    
    switch (activeTab) {
      case 'description':
        return (
          <div className="tab-description">
            <h3>Product Details</h3>
            <p>{product.description}</p>
            
            <div className="product-stats">
              <div className="stat-item">
                <span className="stat-label">Views:</span>
                <span className="stat-value">{product.views?.toLocaleString() || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Times Ordered:</span>
                <span className="stat-value">{product.times_ordered?.toLocaleString() || 0}</span>
              </div>
              {product.popularity && (
                <div className="stat-item">
                  <span className="stat-label">Popularity Score:</span>
                  <span className="stat-value">{product.popularity}</span>
                </div>
              )}
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="reviews-section">
            <div className="reviews-header">
              <div className="reviews-summary">
                <h3>Customer Reviews ({reviews.length})</h3>
                {reviews.length > 0 && (
                  <div className="average-rating">
                    <div className="stars">{renderStars(calculateAverageRating())}</div>
                    <span className="rating-text">
                      {calculateAverageRating()} out of 5 ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
              
              <button 
  className="add-review-btn"
  onClick={() => setShowReviewForm(!showReviewForm)}
>
  {showReviewForm ? 'Cancel' : 'Write a Review'}
</button>

            </div>

            {showReviewForm && (
              <div className="review-form">
                <h4>Write Your Review</h4>
                
                <div className="rating-input">
                  <label>Rating:</label>
                  <div className="star-rating">
                    {renderStars(
                      newReview.rating, 
                      true, 
                      (rating) => setNewReview(prev => ({ ...prev, rating })),
                      setHoverRating
                    )}
                  </div>
                </div>

                <div className="review-text-input">
                  <label htmlFor="review-description">Your Review:</label>
                  <textarea
                    id="review-description"
                    value={newReview.description}
                    onChange={(e) => setNewReview(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    maxLength={500}
                  />
                  <div className="character-count">
                    {newReview.description.length}/500 characters
                  </div>
                </div>

                <div className="review-form-actions">
                  <button 
                    className="submit-review-btn"
                    onClick={handleSubmitReview}
                    disabled={submittingReview || newReview.rating === 0}
                  >
                    <Send size={16} />
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            )}

            {reviewsLoading ? (
              <div className="reviews-loading">Loading reviews...</div>
            ) : reviews.length > 0 ? (
              <div className="reviews-grid">
                {reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="reviewer-name">
                            {review.user_reviewd?.name || 'Anonymous'}
                          </div>
                          <div className="review-date">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="review-rating">{renderStars(review.rating)}</div>
                    </div>
                    <p className="review-text">{review.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        );
      case 'info':
        return (
          <div className="shipping-info">
            <h3>Additional Information</h3>
            <p>{product.description}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  // Handle single image or array of images
  const productImages = Array.isArray(product.productImages) 
    ? product.productImages 
    : [product.productImages];

  return (
    <div className="product-container">

      <div className="main-content">
        <button className="back-button" onClick={() => navigate('/products')}>
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="product-grid">
          <div className="image-section">
            <img 
              src={productImages[selectedImage] || productImages[0]} 
              alt={formatProductName(product.name)} 
              className="main-image" 
            />
            {productImages.length > 1 && (
              <div className="thumbnail-grid">
                {productImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${formatProductName(product.name)} ${i + 1}`}
                    className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="product-header">
              <div>
                <h1 className="product-title">{formatProductName(product.name)}</h1>
                <div className="product-meta">
                  <span className="product-views">{product.views} views</span>
                  {product.times_ordered > 0 && (
                    <span className="product-orders">{product.times_ordered} orders</span>
                  )}
                </div>
                <div className="rating-section">
                  {reviews.length > 0 ? (
                    <>
                      <div className="stars">{renderStars(calculateAverageRating())}</div>
                      <span className="rating-text">
                        {calculateAverageRating()} ({reviews.length} reviews)
                      </span>
                    </>
                  ) : (
                    <span className="no-ratings">No ratings yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className="price-section">
              <span className="current-price">${product.price}</span>
            </div>

            <p className="description">{product.description}</p>

            <div className="variant-section">
              <h3>Size</h3>
              <div className="variant-options">
                {availableSizes.map((size) => {
                  const stockStatus = getStockStatus(size);
                  const isOutOfStock = stockStatus === 'out-of-stock';
                  
                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`variant-btn ${selectedSize === size ? 'active' : ''} ${stockStatus}`}
                      title={getStockText(size)}
                    >
                      {size}
                      {stockStatus === 'low-stock' && <span className="stock-indicator">!</span>}
                    </button>
                  );
                })}
              </div>
              {selectedSize && (
                <div className="stock-info">
                  <span className={`stock-status ${getStockStatus(selectedSize)}`}>
                    {getStockText(selectedSize)}
                  </span>
                </div>
              )}
            </div>

            <div className="quantity-section">
              <span>Quantity</span>
              <div className="quantity-control">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => {
                    const maxStock = stockInfo[selectedSize] || 0;
                    setQuantity(Math.min(quantity + 1, maxStock));
                  }}
                  disabled={quantity >= (stockInfo[selectedSize] || 0)}
                >
                  <Plus size={16} />
                </button>
              </div>
              {selectedSize && (
                <span className="max-quantity">
                  Max: {stockInfo[selectedSize] || 0}
                </span>
              )}
            </div>

            <div className="action-buttons">
              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={!selectedSize || (stockInfo[selectedSize] || 0) === 0}
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={handleWishlist}
              >
                <Heart size={20} fill={isWishlisted ? '#facc15' : 'transparent'} />
              </button>
              <button className="share-btn">
                <Share size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="tab-section">
          <div className="tab-buttons">
            {['description', 'reviews', 'info'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'info' ? 'Info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && reviews.length > 0 && (
                  <span className="tab-count">({reviews.length})</span>
                )}
              </button>
            ))}
          </div>
          <div className="tab-content">{renderTabContent()}</div>
        </div>
      </div>


    </div>
  );
}

export default ProductDescriptionPage;