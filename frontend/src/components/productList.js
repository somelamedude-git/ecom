import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Filter,
  Eye,
  ShoppingCart,
  Package,
  Star,
  ArrowLeft,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import '../styles/sellerProd.css';
import { useNavigate } from 'react-router-dom';

const SellerProductsPage = () => {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // This is what gets sent to API
  const [searchInput, setSearchInput] = useState(''); // This is what user types
  const [sortBy, setSortBy] = useState('newest');
  const [limit] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy: sortBy,
        search: searchTerm
      };

      const response = await axios.get('api/seller/productList', {
        params: queryParams,
        withCredentials: true
      });

      const data = response.data;

      if (data.success) {
        setProducts(data.productsOfUser || []);
        setTotalPages(data.numberOfPages || 1);
        setTotalProducts(data.totalProducts || 0);
        setHasNextPage(data.hasNextPage || false);
        setHasPrevPage(data.hasPrevPage || false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response) {
        // Server responded with error status
        console.error('Server Error:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network Error:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Request Error:', error.message);
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered - calling fetchProducts');
    console.log('Dependencies changed:', { currentPage, sortBy, searchTerm });
    fetchProducts();
  }, [currentPage, sortBy, searchTerm]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setSearchTerm(searchInput.trim());
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (productId, productName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    setDeletingProductId(productId);

    try {
      const response = await axios.delete(
        `api/seller/removeProduct/${productId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Show success message
        alert('Product deleted successfully!');

        // Refresh the products list
        await fetchProducts();

        // If we're on a page with no products after deletion, go to previous page
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);

      let errorMessage = 'Failed to delete product. Please try again.';

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }

      alert(errorMessage);
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStockTotal = (stockMap) => {
    if (!stockMap || typeof stockMap !== 'object') return 0;

    // Handle both Map objects and plain objects
    if (stockMap instanceof Map) {
      return Array.from(stockMap.values()).reduce((total, qty) => total + qty, 0);
    } else {
      return Object.values(stockMap).reduce((total, qty) => total + (qty || 0), 0);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-main">
          <div className="loading">Loading your products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-main">
        {/* Header */}
        <button className="backb" onClick={() => nav('/')}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="cartgrid">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1>My Products ({totalProducts})</h1>
              <button onClick={()=>nav('/seller/add-product')}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>

            {/* Search and Filter Controls */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '250px', display: 'flex' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      onKeyDown={handleSearchKeyDown}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 3rem',
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem 0 0 0.5rem',
                        color: '#fff',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#374151',
                      border: '1px solid #374151',
                      borderLeft: 'none',
                      borderRadius: '0 0.5rem 0.5rem 0',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                  >
                    <Search size={16} />
                  </button>
                </form>
              </div>

              <div style={{ position: 'relative' }}>
                <Filter
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }}
                />
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  style={{
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    minWidth: '150px'
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="popular">Most Popular</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>

            {/* Show active search term if different from input */}
            {searchTerm && searchTerm !== searchInput && (
              <div style={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#9ca3af'
              }}>
                Showing results for: "<span style={{ color: '#fff' }}>{searchTerm}</span>"
                <button
                  onClick={handleClearSearch}
                  style={{
                    marginLeft: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Clear
                </button>
              </div>
            )}

            {/* Products List */}
            {products.length === 0 ? (
              <div className="emptycart">
                <Package size={64} className="emptycarticon" />
                <h3>No Products Found</h3>
                <p>
                  {searchTerm
                    ? `No products match "${searchTerm}". Try a different search term.`
                    : "You haven't added any products yet. Start by adding your first product!"
                  }
                </p>
              </div>
            ) : (
              <>
                {products.map((product) => (
                  <div key={product._id} className="cart-item">
                    <div className="itemcontent" onClick={()=>nav(`/seller/analysis/product/${product._id}`)}>
                      <img
                        src={product.productImages || '/api/placeholder/80/80'}
                        alt={product.name}
                        className="itemimg"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/80/80';
                        }}
                      />

                      <div className="iteminfo">
                        <h3 style={{ textTransform: 'capitalize' }}>{product.name}</h3>
                        <div>{product.description}</div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Eye size={14} />
                            {product.views || 0} views
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ShoppingCart size={14} />
                            {product.added_to_cart || 0} in carts
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Package size={14} />
                            {product.times_ordered || 0} ordered
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Star size={14} />
                            {product.popularity || 0}
                          </span>
                        </div>
                        <div className="itemprice">{formatPrice(product.price)}</div>
                      </div>

                      <div className="itemactions">
                        <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#9ca3af' }}>
                          <div>Stock: {getStockTotal(product.stock)}</div>
                          <div>Added: {formatDate(product.createdAt)}</div>
                          {product.times_returned > 0 && (
                            <div style={{ color: '#ef4444' }}>
                              Returns: {product.times_returned}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="qtycontrol"
                            style={{
                              padding: '0.5rem',
                              background: '#1f2937',
                              border: '1px solid #374151'
                            }}
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="removeb"
                            title="Delete Product"
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            disabled={deletingProductId === product._id}
                            style={{
                              opacity: deletingProductId === product._id ? 0.5 : 1,
                              cursor: deletingProductId === product._id ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {deletingProductId === product._id ? (
                              <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #ef4444',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }} />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '2rem'
                  }}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: hasPrevPage ? '#374151' : '#1f2937',
                        color: hasPrevPage ? '#fff' : '#6b7280',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        cursor: hasPrevPage ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Previous
                    </button>

                    <span style={{ color: '#9ca3af' }}>
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: hasNextPage ? '#374151' : '#1f2937',
                        color: hasNextPage ? '#fff' : '#6b7280',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        cursor: hasNextPage ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar with Statistics */}
          <div className="cartsidebar">
            <div className="sidebarcard">
              <div className="summary">
                <h3>Product Statistics</h3>

                <div className="row">
                  <span>Total Products</span>
                  <span>{totalProducts}</span>
                </div>

                <div className="row">
                  <span>Total Views</span>
                  <span>
                    {products.reduce((sum, product) => sum + (product.views || 0), 0)}
                  </span>
                </div>

                <div className="row">
                  <span>Total Orders</span>
                  <span>
                    {products.reduce((sum, product) => sum + (product.times_ordered || 0), 0)}
                  </span>
                </div>

                <div className="row">
                  <span>Items in Carts</span>
                  <span>
                    {products.reduce((sum, product) => sum + (product.added_to_cart || 0), 0)}
                  </span>
                </div>

                <div className="row total">
                  <span>Total Stock</span>
                  <span>
                    {products.reduce((sum, product) => sum + getStockTotal(product.stock), 0)}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#9ca3af' }}>
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}>
                    Bulk Edit
                  </button>
                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}>
                    Export Data
                  </button>
                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }} onClick={()=>nav('/seller/analytics')}>
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS for spinner animation */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SellerProductsPage;