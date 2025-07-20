# 🛍️ E-Commerce Backend API

This project is a Node.js-powered backend for an e-commerce platform, designed to handle user profiles, product listings, cart functionality, secure payments with Razorpay, and fuzzy tag-based search. Built for scalability and developer clarity.

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Razorpay API
- Natural language tools (for fuzzy search)
- Custom error handling & middleware utilities

---

## 📁 API Endpoints

### 👤 Fetch Profile

`GET /api/profile`

Retrieves the current user's profile (without password).

---

### 🛍️ Add to Cart

`POST /api/bag/:product_id`

Adds a product to the authenticated user's cart. Increases quantity if it already exists.

---

### 💳 Payments

#### ➕ Create Razorpay Order  
`POST /api/payment/:order_id`

Generates a Razorpay order for payment.

#### 🔐 Verify Webhook  
`POST /api/webhook`

Authenticates Razorpay's webhook signature.

#### ♻️ Refund  
`POST /api/refund`

Triggers a refund for a completed payment.

---

### 🌟 Popular Products

`GET /api/popular`

Returns the top 30 products sorted by popularity.

---

### 🛒 Product Display & Search

#### 📄 Fetch Single or Paginated  
`GET /api/products/:productId`  
`GET /api/products?page=1`

Fetches either a single product or paginated list (20 per page).

#### 🔍 Fuzzy Search  
`GET /api/search?q=laptop&page=1`

Returns products with tags similar to the search keyword using Damerau-Levenshtein distance.

---

## ⚠️ Error Handling

Each route uses custom `ApiError` objects and centralized `asyncHandler` for clean, consistent error management.

---

## 🔐 Authenticated Access

All endpoints require user authentication via `req.user._id`. 