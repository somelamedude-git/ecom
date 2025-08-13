# E-Commerce Platform

## Project Description

A comprehensive full-stack e-commerce platform featuring AI-powered recommendations, secure payment processing, and advanced inventory management. The platform supports multi-role authentication (Buyers, Sellers, Admins) with real-time cart management, wishlist functionality, and order tracking. Built with modern web technologies and optimized for performance and security.

## Screenshots

*Screenshots will be added here*


## Features Implemented

### Frontend
- **Responsive Design**: Mobile-first responsive UI with modern CSS
- **Shopping Cart**: Real-time cart management with quantity controls
- **Checkout Flow**: Multi-step checkout with address management
- **Payment Integration**: Razorpay payment gateway integration
- **Product Search**: Advanced search with fuzzy matching
- **User Authentication**: Login/Register with email verification
- **Product Display**: Dynamic product listing with pagination
- **Wishlist Management**: Add/remove items from wishlist
- **Order Tracking**: Real-time order status monitoring
- **Profile Management**: User profile editing and address management

### Backend
- **Multi-Role Authentication**: JWT-based auth for Buyers, Sellers, Admins
- **AI Recommendations**: BitMask-based collaborative filtering system
- **Advanced Search**: Levenshtein distance algorithm for fuzzy search
- **Payment Processing**: Razorpay integration with webhook support
- **Inventory Management**: Size-based stock tracking with MongoDB Maps
- **Order Management**: Complete order lifecycle with status tracking
- **Security Features**: Rate limiting, input validation, CSRF protection
- **File Upload**: Cloudinary integration for image management
- **Email Services**: Automated email verification and notifications
- **Age-Based Clustering**: Demographic recommendation grouping
- **Promo Code System**: Dynamic discount code management
- **Review System**: Product reviews and ratings
- **Sales Analytics**: Heatmap data for seller dashboard

## Technologies/Libraries/Packages Used

### Frontend
- **React.js**: Component-based UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **Lucide React**: Modern icon library
- **React Toastify**: Toast notifications
- **CSS3**: Custom styling with flexbox/grid

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing and security
- **Cloudinary**: Cloud-based image management
- **Razorpay**: Payment gateway integration
- **Nodemailer**: Email service integration
- **Natural.js**: Natural language processing for search
- **Helmet.js**: Security headers and protection
- **Express Validator**: Input validation and sanitization
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing
- **Compression**: Response compression middleware

### DevOps & Tools
- **Git**: Version control system
- **npm**: Package management
- **Environment Variables**: Configuration management
- **RESTful APIs**: Standard API architecture

## Local Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

### Backend Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Configure the following variables in `.env`:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   CORS_ORIGIN=http://localhost:3000
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   EMAIL_VERIFY_SECRET=your_email_verification_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_SERVICE=gmail
   razor_key=your_razorpay_key_id
   razor_secret=your_razorpay_key_secret
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Database Setup
1. **Start MongoDB service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Database will be automatically created on first run**

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- MongoDB: mongodb://localhost:27017

## Team Members

*2024BMS016 - Prapti*
*2024BEE037 - Yashasvi Jain*
*2024IMT074 - Samiksha Agarwal*

## Demo Video

*Add demo video link here*