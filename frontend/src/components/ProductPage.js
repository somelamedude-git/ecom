import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Grid, List, Star, Heart, ShoppingCart, Eye, TrendingUp, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/products.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [wishlist, setWishlist] = useState(new Set());
  const [cartLoading, setCartLoading] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(new Set());
  const [currentCategory, setCurrentCategory] = useState('');
  
  // Size selection popup states
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [popupAction, setPopupAction] = useState(''); // 'cart' or 'wishlist'

  // Get category from URL query parameters
  const getCategoryFromURL = () => {
    const urlParams = new URLSearchParams(location.search);
    const category = urlParams.get('category');
    return category ? decodeURIComponent(category) : '';
  };

  const fetchProducts = async (page = 0, currentSortBy = sortBy, currentLimit = limit, category = '') => {
    try {
      const params = {
        page: page,
        limit: currentLimit,
        sortBy: currentSortBy
      };

      // Add category to params if it exists
      if (category) {
        params.category = category;
      }

      console.log('Fetching products with params:', params);

      const response = await axios.get('http://localhost:3000/product/fetchProducts', {
        params: params
      });

      const data = response.data;

      // Backend returns sortedProducts - use them directly without re-sorting
      setProducts(data.sortedProducts || []);
      setTotalCount(data.totalCount);
      setTotalPages(data.num_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
      setCurrentPage(0);
    }
  };

  // Fetch user's wishlist on component mount
  const fetchWishlist = async () => {
    try {
      const response = await axios.get('http://localhost:3000/wishlist/getItems', {
        withCredentials: true
      });
      
      if (response.data.success) {
        const wishlistIds = new Set(response.data.wishlist.map(item => item.product._id || item.product));
        setWishlist(wishlistIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Navigate to product detail page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle quick view (optional - could open a modal instead of navigating)
  const handleQuickView = (e, product) => {
    e.stopPropagation(); // Prevent product click navigation
    // You can implement a quick view modal here or navigate to product page
    handleProductClick(product._id);
  };

  // Open size selection popup for cart or wishlist
  const openSizeSelection = (product, action) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setPopupAction(action);
    setShowSizePopup(true);
  };

  // Close size selection popup
  const closeSizeSelection = () => {
    setShowSizePopup(false);
    setSelectedProduct(null);
    setSelectedSize('');
    setPopupAction('');
  };

  // Add to cart function with size
  const addToCart = async (productId, size) => {
    if (!size) {
      alert('Please select a size');
      return;
    }

    setCartLoading(prev => new Set(prev).add(productId));
    
    try {
      const response = await axios.post(`http://localhost:3000/cart/addItem/${productId}`, {
        size_: size
      });

      if (response.data.success) {
        alert('Product added to cart successfully!');
        closeSizeSelection(); 
      } else {
        alert(response.data.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        alert('Please login to add items to cart');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to add product to cart. Please try again.');
      }
    } finally {
      setCartLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Add to wishlist function with size
  const addToWishlist = async (productId, size) => {
    setWishlistLoading(prev => new Set(prev).add(productId));

    try {
      const response = await axios.post(
        `http://localhost:3000/wishlist/add/${productId}`, 
        {
          size: size
        }, 
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        setWishlist(prev => new Set(prev).add(productId));
        alert('Product added to wishlist successfully!');
        closeSizeSelection();
      } else {
        alert(response.data.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error.response?.status === 401) {
        alert('Please login to manage your wishlist');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to add to wishlist. Please try again.');
      }
    } finally {
      setWishlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Remove from wishlist function
  const removeFromWishlist = async (productId) => {
    setWishlistLoading(prev => new Set(prev).add(productId));

    try {
      const response = await axios.delete(`http://localhost:3000/wishlist/remove/${productId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setWishlist(prev => {
          const newWishlist = new Set(prev);
          newWishlist.delete(productId);
          return newWishlist;
        });
        alert('Product removed from wishlist successfully!');
      } else {
        alert(response.data.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to remove from wishlist. Please try again.');
      }
    } finally {
      setWishlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle add to cart with size selection
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent product click navigation
    if (product.stock && Object.keys(product.stock).length > 0) {
      // Product has sizes, show size selection popup
      openSizeSelection(product, 'cart');
    } else {
      // Product has no sizes, add directly
      addToCart(product._id, null);
    }
  };

  // Handle wishlist toggle with size selection
  const handleWishlistToggle = (e, product) => {
    e.stopPropagation(); // Prevent product click navigation

    const isInWishlist = wishlist.has(product._id);

    if (isInWishlist) {
      // Remove from wishlist - no size needed for removal
      removeFromWishlist(product._id);
    } else {
      // Add to wishlist
      if (product.stock && Object.keys(product.stock).length > 0) {
        // Product has sizes, show size selection popup
        openSizeSelection(product, 'wishlist');
      } else {
        // Product has no sizes, add directly
        addToWishlist(product._id, null);
      }
    }
  };

  // Handle size selection confirmation
  const handleSizeSelectionConfirm = () => {
    if (!selectedProduct || !selectedSize) {
      alert('Please select a size');
      return;
    }

    if (popupAction === 'cart') {
      addToCart(selectedProduct._id, selectedSize);
    } else if (popupAction === 'wishlist') {
      addToWishlist(selectedProduct._id, selectedSize);
    }
  };

  // Initial load and URL change detection
  useEffect(() => {
    const category = getCategoryFromURL();
    setCurrentCategory(category);
    console.log('Current category from URL:', category);
    
    // Reset page when URL changes (including category changes)
    setCurrentPage(0);
    fetchProducts(0, sortBy, limit, category);
    fetchWishlist();
  }, [location.search]); // Re-run when URL search params change

  // Handle pagination, sorting, and limit changes
  useEffect(() => {
    const category = getCategoryFromURL();
    fetchProducts(currentPage, sortBy, limit, category);
  }, [currentPage, limit, sortBy]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        const searchLower = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.name.toLowerCase().includes(searchLower)
        );
      });
      setFilteredProducts(filtered);
    }
  }, [products, searchQuery]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const handlePageChange = (newPage) => {
    if (searchQuery) {
      // For search results, handle pagination client-side
      setCurrentPage(newPage);
    } else {
      // For regular results, let backend handle pagination
      if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(0); // Reset to first page when sorting changes
  };

  // Calculate pagination for search results (client-side)
  const searchTotalPages = Math.ceil(filteredProducts.length / limit);
  
  // Get current page results for display
  const getCurrentProducts = () => {
    if (searchQuery) {
      // For search results, handle pagination client-side
      const startIndex = currentPage * limit;
      const endIndex = startIndex + limit;
      return filteredProducts.slice(startIndex, endIndex);
    } else {
      // For regular results, backend already handles pagination
      return products;
    }
  };

  const currentProducts = getCurrentProducts();

  // Get correct pagination values
  const getDisplayTotalPages = () => searchQuery ? searchTotalPages : totalPages;
  const getDisplayTotalCount = () => searchQuery ? filteredProducts.length : totalCount;

  // Get page title based on category
  const getPageTitle = () => {
    if (currentCategory) {
      return `${currentCategory} Products`;
    }
    return 'All Products';
  };

  const getPageSubtitle = () => {
    if (currentCategory) {
      return `Discover our ${currentCategory.toLowerCase()} collection`;
    }
    return 'Discover our curated collection of premium products';
  };

  // Size Selection Popup Component
  const SizeSelectionPopup = () => {
    if (!showSizePopup || !selectedProduct) return null;

    const availableSizes = selectedProduct.stock ? Object.keys(selectedProduct.stock).filter(size => selectedProduct.stock[size] > 0) : [];
    const isLoading = popupAction === 'cart' ? cartLoading.has(selectedProduct._id) : wishlistLoading.has(selectedProduct._id);
    const actionText = popupAction === 'cart' ? 'Add to Cart' : 'Add to Wishlist';
    const loadingText = popupAction === 'cart' ? 'Adding...' : 'Adding...';

    return (
      <div className="size-popup-overlay" onClick={closeSizeSelection}>
        <div className="size-popup" onClick={(e) => e.stopPropagation()}>
          <div className="size-popup-header">
            <h3>Select Size</h3>
            <button className="close-btn" onClick={closeSizeSelection}>
              <X size={20} />
            </button>
          </div>
          
          <div className="size-popup-content">
            <div className="product-info-mini">
              <img src={selectedProduct.productImages} alt={selectedProduct.name} className="product-mini-image" />
              <div>
                <h4>{selectedProduct.name}</h4>
                <p className="product-price">${selectedProduct.price}</p>
                <p className="popup-action-label">
                  {popupAction === 'cart' ? 'Adding to Cart' : 'Adding to Wishlist'}
                </p>
              </div>
            </div>

            <div className="size-options">
              <h5>Available Sizes:</h5>
              <div className="size-grid">
                {availableSizes.length > 0 ? (
                  availableSizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.toUpperCase()}
                      <span className="stock-count">({selectedProduct.stock[size]} left)</span>
                    </button>
                  ))
                ) : (
                  <p className="no-sizes">No sizes available</p>
                )}
              </div>
            </div>
          </div>

          <div className="size-popup-footer">
            <button className="cancel-btn" onClick={closeSizeSelection}>
              Cancel
            </button>
            <button 
              className={`confirm-add-btn ${isLoading ? 'loading' : ''}`}
              onClick={handleSizeSelectionConfirm}
              disabled={!selectedSize || isLoading || availableSizes.length === 0}
            >
              {popupAction === 'cart' ? <ShoppingCart size={16} className={isLoading ? 'spin' : ''} /> : <Heart size={16} className={isLoading ? 'spin' : ''} />}
              {isLoading ? loadingText : actionText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product }) => {
    const avgRating = calculateAverageRating(product.reviews);
    const stockCount = Object.values(product.stock || {}).reduce((sum, count) => sum + count, 0);
    const isInWishlist = wishlist.has(product._id);
    const isWishlistLoading = wishlistLoading.has(product._id);
    const isCartLoading = cartLoading.has(product._id);
    
    return (
      <div 
        className={`product-card ${viewMode}`}
        onClick={() => handleProductClick(product._id)}
      >
        <div className="product-image-container">
          <img 
            src={product.productImages} 
            alt={product.name}
            className="product-image"
          />
          <div className="product-overlay">
            <button 
              className={`wishlist-btn ${isInWishlist ? 'active' : ''} ${isWishlistLoading ? 'loading' : ''}`}
              onClick={(e) => handleWishlistToggle(e, product)}
              disabled={isWishlistLoading}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart 
                size={18} 
                fill={isInWishlist ? '#ef4444' : 'none'} 
                className={isWishlistLoading ? 'spin' : ''}
              />
            </button>
            <button 
              className="quick-view-btn" 
              title="Quick view"
              onClick={(e) => handleQuickView(e, product)}
            >
              <Eye size={18} />
            </button>
          </div>
          {product.popularity >= 90 && (
            <div className="popular-badge">
              <TrendingUp size={14} />
              Popular
            </div>
          )}
          {stockCount < 10 && stockCount > 0 && (
            <div className="low-stock-badge">
              Only {stockCount} left
            </div>
          )}
          {stockCount === 0 && (
            <div className="out-of-stock-badge">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="product-info">
          <div className="product-category">{product.category.name}</div>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          
          <div className="product-stats">
            <div className="rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(avgRating) ? '#fbbf24' : 'none'}
                    color={i < Math.floor(avgRating) ? '#fbbf24' : '#6b7280'}
                  />
                ))}
              </div>
              <span className="rating-text">({product.reviews.length})</span>
            </div>
            <div className="views">
              <Eye size={14} />
              {product.views}
            </div>
          </div>
          
          <div className="product-footer">
            <div className="price-section">
              <span className="price">${product.price}</span>
              <span className="orders">{product.times_ordered} sold</span>
            </div>
            <button 
              className={`add-to-cart-btn ${isCartLoading ? 'loading' : ''}`}
              disabled={stockCount === 0 || isCartLoading}
              onClick={(e) => handleAddToCart(e, product)}
            >
              <ShoppingCart size={16} className={isCartLoading ? 'spin' : ''} />
              {isCartLoading ? 'Adding...' : stockCount === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="products-container">
      <div className="products-main">
        {/* Header */}
        <button className="backb" onClick={()=>navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="products-header">
          <h1>{getPageTitle()}</h1>
          <p className="products-subtitle">{getPageSubtitle()}</p>
          {currentCategory && (
            <div className="category-badge">
              <span>Category: {currentCategory}</span>
            </div>
          )}
        </div>

        {/* Search and Controls */}
        <div className="controls-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="controls-right">
            <div className="limit-dropdown">
              <span>Show:</span>
              <select value={limit} onChange={(e) => handleLimitChange(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="sort-dropdown">
              <SlidersHorizontal size={18} />
              <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="views">Most Viewed</option>
              </select>
              <ChevronDown size={16} />
            </div>
            
            <button 
              className={`filters-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
            </button>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <span>
            Showing {currentProducts.length} of {getDisplayTotalCount()} products
            {searchQuery && ` for "${searchQuery}"`}
            {currentCategory && !searchQuery && ` in ${currentCategory}`}
          </span>
          <span className="page-info">
            Page {currentPage + 1} of {getDisplayTotalPages()}
          </span>
        </div>

        {/* Search Results Summary */}
        {searchQuery && (
          <div className="search-summary">
            {filteredProducts.length === 0 ? (
              <span className="no-results">No products found matching your search.</span>
            ) : (
              <span className="search-results">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
                {currentCategory && ` in ${currentCategory}`}
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {currentProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">
              <Search size={48} />
            </div>
            <h3>No products found</h3>
            <p>
              {searchQuery 
                ? `No products match "${searchQuery}"${currentCategory ? ` in ${currentCategory}` : ''}. Try different keywords or clear your search.`
                : currentCategory 
                  ? `No products found in ${currentCategory} category.`
                  : 'Try adjusting your search or filters'
              }
            </p>
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={`products-grid ${viewMode}`}>
            {currentProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {getDisplayTotalPages() > 1 && (
          <div className="pagination">
            <button 
              className="page-btn"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            
            <div className="page-numbers">
              {[...Array(getDisplayTotalPages())].map((_, i) => {
                const maxPages = getDisplayTotalPages();
                // Show first page, last page, current page, and pages around current
                const showPage = i === 0 || 
                                i === maxPages - 1 || 
                                Math.abs(i - currentPage) <= 2;
                
                if (!showPage && i === 1 && currentPage > 3) {
                  return <span key="start-ellipsis" className="ellipsis">...</span>;
                }
                if (!showPage && i === maxPages - 2 && currentPage < maxPages - 4) {
                  return <span key="end-ellipsis" className="ellipsis">...</span>;
                }
                if (!showPage) return null;

                return (
                  <button
                    key={i}
                    className={`page-number ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            
            <button 
              className="page-btn"
              disabled={currentPage === getDisplayTotalPages() - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* Size Selection Popup */}
      <SizeSelectionPopup />
    </div>
  );
};

export default ProductsPage;