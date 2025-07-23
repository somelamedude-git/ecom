# 🛒 E-Commerce Backend API

A robust and modular backend for an e-commerce platform, built with **Node.js**, **Express**, and **MongoDB**. Features include user authentication, seller product management, image upload, payments with Razorpay, and more.

---

## 📁 Folder Structure

```
├── api/
│   ├── auth.routes.js
│   ├── order.routes.js
│   ├── product.routes.js
│   └── seller.routes.js
├── config/
│   └── razorpay.js
├── controllers/
│   ├── auth.controllers.js
│   ├── order.controllers.js
│   ├── product.controllers.js
│   └── seller.controllers.js
├── db/
│   └── db.js
├── middlewares/
│   ├── addressValidator.js
│   ├── auth.middlewares.js
│   └── multer.js
```

---

## 🌐 API Folder

This folder contains all the Express route definitions.

### `auth.routes.js`

* **POST /register** – User registration
* **POST /login** – User login
* **POST /refresh-token** – Refresh access token
* **POST /logout** – Logout

### `order.routes.js`

* **POST /create** – Create Razorpay order
* **POST /verify** – Verify Razorpay signature

### `product.routes.js`

* **POST /add** – Add a product (seller-only, with image upload)
* **PATCH /update/\:productId** – Update product details
* **GET /get/\:productId** – Get product details

### `seller.routes.js`

* **GET /products** – Get all products of the logged-in seller
* **PATCH /toggle/\:productId** – Enable/disable a product
* **GET /profile** – Get seller profile

---

## 📦 Config Folder

### `razorpay.js`

Initializes Razorpay instance with keys from `.env`.

---

## 🧠 Controllers

### `auth.controllers.js`

* Handles register, login, logout, and token refresh logic.
* Uses hashed passwords and JWT tokens.

### `order.controllers.js`

* Generates and verifies Razorpay orders and payments.

### `product.controllers.js`

* Adds and updates products.
* Handles image uploads with Cloudinary.
* Associates products with sellers.

### `seller.controllers.js`

* Provides seller dashboards and product management tools.

---

## 🛢️ Database Folder

### `db.js`

Connects to MongoDB using Mongoose.

---

## 🧱 Middlewares

### `addressValidator.js`

* Validates address fields using `express-validator`.

### `auth.middlewares.js`

* Verifies JWT tokens and attaches the authenticated user to the request.

### `multer.js`

* Handles image uploads (JPEG, PNG, GIF).
* Limits file size to 1 MB.
* Stores files temporarily in `/public/temp`.

---

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_uri
DB_NAME=your_database_name
ACCESS_TOKEN_SECRET=your_jwt_secret
razor_key=your_razorpay_key_id
razor_secret=your_razorpay_key_secret
```

---