# E-commerce Backend API

A comprehensive Node.js/Express.js e-commerce backend with advanced features including AI-powered recommendation systems, secure payment processing, and robust user management.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Buyers, Sellers, and Admins with JWT-based security
- **Product Management**: Full CRUD operations with image uploads via Cloudinary
- **Shopping Cart**: Real-time cart management with size-based inventory tracking
- **Wishlist System**: User wishlist functionality with stock status monitoring
- **Order Processing**: Complete order lifecycle management with multiple status tracking
- **Payment Integration**: Razorpay payment gateway with webhook support
- **Advanced Search**: Fuzzy search with Levenshtein distance algorithm
- **AI Recommendations**: BitMask-based collaborative filtering system

### Security & Performance
- **Security Headers**: Helmet.js implementation with CSRF protection
- **Rate Limiting**: Request throttling (100 req/min)
- **Input Validation**: Express-validator with custom sanitization
- **Password Security**: Bcrypt hashing with salt rounds
- **File Upload Security**: Multer with file type validation
- **Response Compression**: Gzip compression for optimal performance

### Advanced Features
- **Age-Based User Clustering**: Demographic recommendation grouping
- **BitMask Recommendation Engine**: Advanced collaborative filtering
- **Email Verification**: Secure token-based email verification
- **Google Analytics Integration**: GA4 analytics tracking
- **Real-time Stock Management**: Map-based size inventory tracking

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access & Refresh Tokens)
- **File Storage**: Cloudinary
- **Payment Gateway**: Razorpay
- **Email Service**: Nodemailer
- **Search**: Natural.js (Levenshtein Distance)
- **Security**: Helmet, CORS, Rate Limiting, HPP
- **Analytics**: Google Analytics 4

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account
- Razorpay account
- Email service provider (Gmail recommended)
- Google Analytics 4 property (optional)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and configure:
   ```env
   # Server Configuration
   PORT=3001
   CORS_ORIGIN=http://localhost:3002
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/EcommerceDB
   
   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
   REFRESH_TOKEN_EXPIRY=10d
   EMAIL_VERIFY_SECRET=your_email_verification_secret
   
   # Cloudinary Configuration
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_SECRET=your_cloudinary_api_secret
   
   # Razorpay Configuration
   razor_key=your_razorpay_key_id
   razor_secret=your_razorpay_key_secret
   
   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_specific_password
   EMAIL_SERVICE=gmail
   FROM_NAME=Your App Name
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   
   # Google Analytics (Optional)
   GA4_PROPERTY_ID=your_ga4_property_id
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📁 Project Structure

```
src/
├── APIs/                     # API endpoint handlers
│   ├── addToCart.js         # Cart management operations
│   ├── fetchCart.js         # Cart retrieval with middleware
│   ├── wishlistAPI.js       # Wishlist CRUD operations
│   ├── productDisplay.js    # Product display & search
│   ├── payment.js           # Razorpay payment integration
│   ├── fetchOrders.js       # Order history retrieval
│   ├── popularProds.js      # Popular products endpoint
│   ├── defaultRecom.js      # AI recommendation engine
│   └── cartAndWishCount.js  # Counter utilities
├── controllers/             # Business logic controllers
│   ├── userControllers.js   # User management & auth
│   ├── product.controller.js # Product CRUD operations
│   ├── orderControllers.js  # Order lifecycle management
│   └── address.controller.js # Address management
├── middlewares/             # Custom middleware functions
│   ├── auth.middleware.js   # JWT authentication
│   ├── multer.js           # File upload handling
│   ├── address.validator.js # Address validation
│   └── fetchCart.middleware.js # Cart preprocessing
├── models/                  # Database schemas
│   ├── user.models.js      # User discriminator models
│   ├── product.models.js   # Product schema with hooks
│   ├── order.models.js     # Order management schema
│   ├── category.models.js  # Product categorization
│   ├── tags.model.js       # Tag management for search
│   └── address.model.js    # Address schema
├── routes/                  # Route definitions
│   ├── auth.routes.js      # Authentication routes
│   ├── products.router.js  # Product management routes
│   ├── cart.routes.js      # Shopping cart routes
│   ├── wishlist.routes.js  # Wishlist routes
│   ├── admin.routes.js     # Admin panel routes
│   └── api.routes.js       # General API routes
├── utils/                   # Utility functions
│   ├── asyncHandler.js     # Async error handling
│   ├── ApiError.js         # Custom error class
│   ├── ApiResponse.js      # Standardized responses
│   ├── cloudinary.js       # Image upload utilities
│   ├── bitmask.util.js     # Recommendation bitmask
│   ├── verification.util.js # Email verification
│   ├── tokens.utils.js     # JWT token generation
│   └── errorHandler.js     # Centralized error handling
├── services/                # Business logic services
│   └── address.service.js  # Address management service
├── config/                  # Configuration files
│   └── razorpay.js         # Payment gateway config
└── app.js                   # Express application setup
```

## 🔗 API Endpoints

### Authentication & User Management
```
POST   /user/register              # User registration with email verification
POST   /user/login                 # Manual login with JWT tokens
GET    /user/verifyLogin           # Check authentication status
GET    /user/profile               # Get user profile data
PATCH  /user/editProfile           # Update user information
GET    /user/getCWL                # Get cart/wishlist/order counts
GET    /api/auth/verifyEmail/:token # Email verification endpoint
```

### Product Management
```
GET    /product/display            # Get paginated products
GET    /product/display/:productId # Get single product details
GET    /product/search?q=query     # Search products with fuzzy matching
GET    /product/popular            # Get top 30 popular products
POST   /product/addProduct         # Add new product (Sellers only)
POST   /product/updateProduct      # Update product details (Sellers only)
```

### Shopping Cart
```
GET    /cart/getItems              # Get user's cart items
POST   /cart/addItem/:product_id   # Add item to cart
PATCH  /cart/increment/:product_id # Increase item quantity
PATCH  /cart/decrement/:product_id # Decrease item quantity
DELETE /cart/deleteItem/:product_id # Remove item from cart
```

### Wishlist Management
```
GET    /wishlist/getItems          # Get user's wishlist
POST   /wishlist/addItem           # Add item to wishlist
DELETE /wishlist/deleteItem/:product_id # Remove item from wishlist
```

### Order Management
```
GET    /orders                     # Get user orders (with status filter)
POST   /orders/create              # Create single order
POST   /orders/createFromCart      # Convert cart to orders
PATCH  /orders/cancel/:orderId     # Cancel pending order
PATCH  /orders/return/:orderId     # Request return
PATCH  /orders/approve-return      # Approve return (Admin)
```

### Payment Processing
```
POST   /payment/create/:order_id   # Create Razorpay payment order
POST   /payment/webhook            # Razorpay webhook handler
POST   /payment/refund             # Process refund
```

### Admin Operations
```
POST   /admin/deleteUser           # Delete user account
POST   /admin/banUser              # Ban user account
```

## 🗃️ Database Architecture

### User Models (Mongoose Discriminators)

**BaseUser Schema**
```javascript
{
  username: String (unique, indexed),
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  name: String,
  address: [AddressSchema],
  isVerified: Boolean,
  isBan: Boolean,
  verificationToken: String,
  phone_number: String,
  kind: String // Discriminator key
}
```

**Buyer Extension**
```javascript
{
  wishlist: [{ product: ObjectId, size: Enum }],
  cart: [{ product: ObjectId, quantity: Number, size: Enum }],
  orderHistory: [[ObjectId]], // Nested arrays for batch orders
  age: Number,
  ageBucket: Number, // Auto-calculated age grouping
  recommend_masking: String, // BitMask for recommendations
  prev_order_bit: String,
  creditPoints: Number
}
```

**Seller Extension**
```javascript
{
  selling_products: [{ product: ObjectId }],
  store_information: ObjectId,
  average_rating: Number,
  verification_documents: [String],
  order_quo: [ObjectId] // Incoming orders
}
```

### Product Schema
```javascript
{
  name: String (lowercase, indexed),
  description: String,
  price: Number,
  stock: Map<String, Number>, // Size-based inventory
  category: ObjectId,
  tags: [Number], // For recommendation system
  bitmask: String, // Auto-generated from tags
  popularity: Number, // Auto-calculated
  views: Number,
  reviews: Number,
  productImages: [String], // Cloudinary URLs
  owner: ObjectId
}
```

### Order Schema
```javascript
{
  customer: ObjectId,
  product: ObjectId,
  quantity: Number,
  status: Enum [
    'pending', 'delivered', 'cancelled', 
    'schedule_return', 'returned', 
    'approve_return', 'shipped'
  ]
}
```

## 🎯 Advanced Features Deep Dive


### Advanced Search Implementation

**Fuzzy Search with Levenshtein Distance**
```javascript
const searchProduct = async (query) => {
    const queryTokens = query.toLowerCase().split(" ");
    const allTags = await Product.distinct('tags');
    
    const similarTags = allTags.filter(tag => {
        return queryTokens.some(word => {
            const distance = natural.DamerauLevenshteinDistance(word, tag);
            return distance <= 2; // Tolerance for typos
        });
    });
    
    return await Product.find({ tags: { $in: similarTags } });
}
```

### Size-Based Inventory Management

Products use MongoDB Maps for efficient size-based stock tracking:
```javascript
// Stock structure
stock: {
  "XS": 10,
  "S": 25,
  "M": 30,
  "L": 20,
  "XL": 15,
  "XXL": 5
}
```

## 🛡️ Security Implementation

### Authentication Flow
1. **Registration**: Email verification with crypto-generated tokens
2. **Login**: Dual JWT tokens (access + refresh)
3. **Authorization**: Role-based middleware protection
4. **Session Management**: Secure cookie-based token storage

### Input Validation & Sanitization
```javascript
// Custom validator utility
const SafebaseValidator = (field, message, escape, optional) => {
    let validator = body(field).trim();
    if (!optional) {
        validator = validator.notEmpty().withMessage(message);
    }
    if (escape) {
        validator = validator.escape();
    }
    return validator;
}
```

### Security Headers & Protection
- **Helmet.js**: Comprehensive security headers
- **CORS**: Configured for specific origins
- **Rate Limiting**: 100 requests per minute per IP
- **HPP**: HTTP Parameter Pollution protection
- **File Upload**: Type validation and size limits

## 📊 Error Handling & Logging

### Centralized Error Management
```javascript
class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
    }
}
```

### Error Types Handled
- **Validation Errors**: Input validation failures
- **Authentication Errors**: JWT and login issues
- **Business Logic Errors**: Custom application errors
- **Database Errors**: MongoDB operation failures
- **File Upload Errors**: Multer and Cloudinary errors

## 🚀 Deployment Guide

### Production Environment Setup

1. **Database Configuration**
   ```bash
   # MongoDB Atlas connection
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
   ```

2. **Security Configuration**
   ```bash
   # Generate secure secrets
   openssl rand -base64 64  # For JWT secrets
   ```

3. **Cloudinary Setup**
   - Create Cloudinary account
   - Configure upload presets
   - Set up transformation rules

4. **Razorpay Configuration**
   - Create Razorpay account
   - Configure webhooks
   - Set up payment methods

### Production Deployment
```bash
# Using PM2
npm install -g pm2
pm2 start src/index.js --name "ecommerce-api"
pm2 startup
pm2 save

# Using Docker
docker build -t ecommerce-api .
docker run -p 3001:3001 --env-file .env ecommerce-api
```

## 📈 Performance Optimization

### Database Optimization
- **Indexing Strategy**: Strategic indexes on frequently queried fields
- **Aggregation Pipelines**: Efficient data processing
- **Connection Pooling**: Mongoose connection optimization

### Caching & Compression
- **Response Compression**: Gzip compression middleware
- **Static File Serving**: Efficient static asset delivery
- **Query Optimization**: Lean queries and selective population

### Monitoring & Analytics
- **Google Analytics 4**: Comprehensive user behavior tracking
- **Custom Events**: Business-specific analytics
- **Performance Monitoring**: Response time tracking

## 🧪 Testing

### Test Structure
```bash
# Run tests
npm test

# Test files located in /tests
tests/
├── user.test.js         # User authentication tests
├── product.test.js      # Product management tests
├── cart.test.js         # Shopping cart tests
└── payment.test.js      # Payment processing tests
```

### Testing Strategy
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Authentication Tests**: JWT and user flow testing
- **Database Tests**: Model validation and operations

## 🔧 Development Tools

### Debugging & Development
```bash
# Development with nodemon
npm run dev

# Debug mode
DEBUG=* npm start

# Environment validation
npm run validate-env
```

### Code Quality
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting consistency
- **Husky**: Git hooks for quality checks

## 📄 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | Yes | `3001` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/ecommerce` |
| `CORS_ORIGIN` | Allowed CORS origins | Yes | `http://localhost:3002` |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Yes | `your_secret_key` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Yes | `your_refresh_secret` |
| `CLOUD_NAME` | Cloudinary cloud name | Yes | `your_cloud_name` |
| `razor_key` | Razorpay key ID | Yes | `rzp_test_xxxxx` |
| `EMAIL_USER` | Email service username | Yes | `your_email@gmail.com` |
| `GA4_PROPERTY_ID` | Google Analytics property ID | No | `G-XXXXXXXXXX` |