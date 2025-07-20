# 🛒 E-Commerce Backend API

A backend API built for a feature-rich e-commerce application. Built with Node.js, Express, MongoDB, and Razorpay for payment processing.

---

## 📦 Features Covered So Far

- **🔒 Authentication & Authorization**
- **🛍️ Product Display & Search**
- **🔥 Popular Products**
- **💳 Razorpay Payments**
- **↩️ Refund & Webhook Support**

---

## 📁 API Endpoints

---

### 🛍️ Product Display

#### 📄 Get All Products (Paginated)

**Endpoint:** `GET /api/products`  
**Description:** Fetch a paginated list of products (20 per page), sorted by creation time.

**Query Parameters:**
- `page` *(optional)*: Page number (defaults to 1)

**Success Response:**
```json
{
  "success": true,
  "currentPage": 1,
  "totalPages": 5,
  "totalProducts": 100,
  "products": [ ... ]
}
