import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Plus, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductForm = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tagNames: [],
    status: 'active',
    stock: new Map()
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stockVariants, setStockVariants] = useState([{ variant: '', quantity: 0 }]);

  // Fetch categories and tags on component mount
  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  const fetchCategoriesAndTags = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/fetchCT');
      setTags(response.data.tag_names);
      setCategories(response.data.category_names);
    } catch (error) {
      console.error('Error fetching categories and tags:', error);
      setError('Failed to load categories and tags');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleTagToggle = (tagName) => {
    setFormData(prev => ({
      ...prev,
      tagNames: prev.tagNames.includes(tagName)
        ? prev.tagNames.filter(t => t !== tagName)
        : [...prev.tagNames, tagName]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleStockVariantChange = (index, field, value) => {
    const updatedVariants = [...stockVariants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setStockVariants(updatedVariants);
    
    // Update stock map
    const stockMap = new Map();
    updatedVariants.forEach(variant => {
      if (variant.variant && variant.quantity >= 0) {
        stockMap.set(variant.variant, parseInt(variant.quantity) || 0);
      }
    });
    setFormData(prev => ({ ...prev, stock: stockMap }));
  };

  const addStockVariant = () => {
    setStockVariants(prev => [...prev, { variant: '', quantity: 0 }]);
  };

  const removeStockVariant = (index) => {
    if (stockVariants.length > 1) {
      setStockVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      if (!image) {
        throw new Error('Please upload a product image');
      }

      if (parseFloat(formData.price) <= 0) {
        throw new Error('Price must be greater than 0');
      }

     
      const stockObject = {};
      formData.stock.forEach((value, key) => {
        stockObject[key] = value;
      });

    
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('stock', JSON.stringify(stockObject));
      formDataToSend.append('tagNames', JSON.stringify(formData.tagNames));

      formDataToSend.append('productImages', image);

      const response = await axios.post('http://localhost:3000/seller/addProduct', formDataToSend, {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  withCredentials: true
});

      const data = response.data;

      if (!(response.status===200)) {
        throw new Error(data.message || 'Failed to create product');
      }

      setSuccess('Product created successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        tagNames: [],
        status: 'active',
        stock: new Map()
      });
      setImage(null);
      setImagePreview('');
      setStockVariants([{ variant: '', quantity: 0 }]);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <style>{`
        .add-product-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #9ca3af;
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 3rem;
          padding: 0;
        }

        .back-button:hover {
          color: #fbbf24;
        }

        .back-icon-container {
          padding: 0.5rem;
          border-radius: 0.5rem;
          background-color: #1f2937;
          transition: all 0.3s ease;
        }

        .back-button:hover .back-icon-container {
          background-color: #374151;
        }

        .back-text {
          font-weight: 500;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #ffffff 0%, #fef3c7 50%, #fbbf24 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #9ca3af;
          max-width: 600px;
          margin: 0 auto;
        }

        .alert {
          padding: 1.5rem;
          border-radius: 1rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          backdrop-filter: blur(10px);
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .alert-success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #86efac;
        }

        .alert-icon {
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alert-error .alert-icon {
          background: rgba(239, 68, 68, 0.2);
        }

        .alert-success .alert-icon {
          background: rgba(34, 197, 94, 0.2);
        }

        .alert-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        .alert-content p {
          margin: 0;
          opacity: 0.9;
        }

        .form-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          background: linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.8) 100%);
          border: 1px solid rgba(55, 65, 81, 0.5);
          border-radius: 1.5rem;
          padding: 2rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-indicator {
          width: 0.5rem;
          height: 2rem;
          border-radius: 0.25rem;
        }

        .section-indicator-yellow {
          background: linear-gradient(to bottom, #fbbf24, #f59e0b);
        }

        .section-indicator-blue {
          background: linear-gradient(to bottom, #60a5fa, #3b82f6);
        }

        .section-indicator-purple {
          background: linear-gradient(to bottom, #a78bfa, #8b5cf6);
        }

        .section-indicator-pink {
          background: linear-gradient(to bottom, #f472b6, #ec4899);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-group-full {
          grid-column: 1 / -1;
          margin-top: 2rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #d1d5db;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .form-input {
          width: 100%;
          background: rgba(17, 24, 39, 0.8);
          border: 2px solid rgba(75, 85, 99, 0.5);
          border-radius: 0.75rem;
          padding: 1rem 1.5rem;
          color: #ffffff;
          font-size: 1.125rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #fbbf24;
          box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.1);
        }

        .form-input::placeholder {
          color: #6b7280;
        }

        .form-textarea {
          resize: none;
          height: 120px;
        }

        .price-input-container {
          position: relative;
        }

        .price-prefix {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1.125rem;
          pointer-events: none;
        }

        .price-input {
          padding-left: 3rem;
        }

        .stock-variant {
          display: flex;
          gap: 1.5rem;
          align-items: flex-end;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: rgba(17, 24, 39, 0.5);
          border-radius: 0.75rem;
          border: 1px solid rgba(75, 85, 99, 0.3);
        }

        .stock-variant-input {
          flex: 1;
        }

        .stock-actions {
          display: flex;
          gap: 0.75rem;
        }

        .stock-button {
          padding: 1rem;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .stock-button:hover {
          transform: scale(1.05);
        }

        .add-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .add-button:hover {
          background: linear-gradient(135deg, #059669, #047857);
        }

        .remove-button {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .remove-button:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tag-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid;
        }

        .tag-button-inactive {
          background: rgba(17, 24, 39, 0.5);
          color: #d1d5db;
          border-color: rgba(75, 85, 99, 0.5);
        }

        .tag-button-inactive:hover {
          border-color: rgba(168, 139, 250, 0.5);
          color: #c4b5fd;
        }

        .tag-button-active {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border-color: #a78bfa;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .image-upload-area {
          border: 3px dashed rgba(75, 85, 99, 0.5);
          border-radius: 1.5rem;
          padding: 3rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.3), rgba(31, 41, 55, 0.3));
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .image-upload-area:hover {
          background: linear-gradient(135deg, rgba(31, 41, 55, 0.4), rgba(55, 65, 81, 0.4));
          border-color: rgba(75, 85, 99, 0.7);
        }

        .upload-icon-container {
          display: inline-flex;
          padding: 1.5rem;
          background: rgba(55, 65, 81, 0.5);
          border-radius: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .upload-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: white;
        }

        .upload-subtitle {
          font-size: 1.125rem;
          color: #9ca3af;
          margin-bottom: 0.5rem;
        }

        .upload-note {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .image-preview-container {
          margin-top: 2rem;
          text-align: center;
        }

        .image-preview {
          position: relative;
          display: inline-block;
        }

        .preview-image {
          width: 320px;
          height: 320px;
          object-fit: cover;
          border-radius: 1.5rem;
          border: 4px solid rgba(75, 85, 99, 0.5);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .remove-image-button {
          position: absolute;
          top: -1rem;
          right: -1rem;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          border-radius: 50%;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .image-preview:hover .remove-image-button {
          opacity: 1;
        }

        .remove-image-button:hover {
          transform: scale(1.1);
        }

        .submit-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .submit-button {
          padding: 1.25rem 3rem;
          background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
          color: #000000;
          border: none;
          border-radius: 0.75rem;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(251, 191, 36, 0.3);
          background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
        }

        .submit-button:disabled {
          background: #374151;
          color: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .loading-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .loading-spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(0, 0, 0, 0.3);
          border-top: 2px solid #000000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .hidden {
          display: none;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .main-title {
            font-size: 2.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .form-group-full {
            margin-top: 1.5rem;
          }

          .stock-variant {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .stock-actions {
            justify-content: center;
          }

          .tags-container {
            gap: 0.75rem;
          }

          .preview-image {
            width: 280px;
            height: 280px;
          }

          .submit-button {
            width: 100%;
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2rem;
          }

          .form-section {
            padding: 1.5rem;
          }

          .image-upload-area {
            padding: 2rem;
          }

          .preview-image {
            width: 240px;
            height: 240px;
          }
        }
      `}</style>

      <div className="container">
        <button className="back-button" onClick={()=>nav('/')}>
          <div className="back-icon-container">
            <ArrowLeft size={20} />
          </div>
          <span className="back-text">Back to Dashboard</span>
        </button>

        <div className="header">
          <h1 className="main-title">Create New Product</h1>
          <p className="subtitle">
            Build your next bestseller with our intuitive product creation tool
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">
              <AlertCircle size={24} />
            </div>
            <div className="alert-content">
              <h4>Error</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <div className="alert-icon">
              <CheckCircle size={24} />
            </div>
            <div className="alert-content">
              <h4>Success!</h4>
              <p>{success}</p>
            </div>
          </div>
        )}

        <div className="form-sections">
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">
              <div className="section-indicator section-indicator-yellow"></div>
              Basic Information
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter an amazing product name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price *</label>
                <div className="price-input-container">
                  <span className="price-prefix">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input price-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group-full">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input form-textarea"
                placeholder="Tell customers why they'll love this product..."
                required
              />
            </div>

            <div className="form-grid" style={{ marginTop: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Choose category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="active">🟢 Active</option>
                  <option value="inactive">🔴 Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stock Management */}
          <div className="form-section">
            <h3 className="section-title">
              <div className="section-indicator section-indicator-blue"></div>
              Inventory Management
            </h3>
            
            {stockVariants.map((variant, index) => (
              <div key={index} className="stock-variant">
                <div className="stock-variant-input">
                  <label className="form-label">Variant</label>
                  <input
                    type="text"
                    value={variant.variant}
                    onChange={(e) => handleStockVariantChange(index, 'variant', e.target.value)}
                    className="form-input"
                    placeholder="Size, Color, Model..."
                  />
                </div>
                <div className="stock-variant-input">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) => handleStockVariantChange(index, 'quantity', e.target.value)}
                    className="form-input"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="stock-actions">
                  <button
                    type="button"
                    onClick={addStockVariant}
                    className="stock-button add-button"
                  >
                    <Plus size={20} />
                  </button>
                  {stockVariants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStockVariant(index)}
                      className="stock-button remove-button"
                    >
                      <Minus size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="form-section">
            <h3 className="section-title">
              <div className="section-indicator section-indicator-purple"></div>
              Product Tags
            </h3>
            <div className="tags-container">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`tag-button ${
                    formData.tagNames.includes(tag)
                      ? 'tag-button-active'
                      : 'tag-button-inactive'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-section">
            <h3 className="section-title">
              <div className="section-indicator section-indicator-pink"></div>
              Product Image
            </h3>
            
            <div className="image-upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <div className="upload-icon-container">
                  <Upload size={64} color="#9ca3af" />
                </div>
                <p className="upload-title">Upload Product Image</p>
                <p className="upload-subtitle">Click here or drag and drop your image</p>
                <p className="upload-note">Supports JPG, PNG, WebP (Max 5MB)</p>
              </label>
            </div>

            {imagePreview && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="preview-image"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="remove-image-button"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  Creating Product...
                </div>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;