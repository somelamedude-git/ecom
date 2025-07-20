This is a backend server for an e-commerce platform built using **Node.js**, **Express**, and **MongoDB**. It provides RESTful API endpoints for product listing, search, popular products, user profile, payment integration (Razorpay), and refund management.

---

## 📁 Project Structure

```
src/
├── api/
│   ├── fetchProfile.js
│   ├── payment.js
│   ├── popularProds.js
│   ├── productDisplay.js
├── config/
├── models/
├── utils/
```

---

## 📦 Installation

```bash
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend
npm install
```

Create a `.env` file and add the following:

```env
RAZOR_KEY=your_razorpay_key
RAZOR_SECRET=your_razorpay_secret
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

---

## ▶️ Start the Server

```bash
npm start
```

---

## 📌 API Endpoints

### 👤 User

#### GET `/api/user/profile`
- **Protected route**
- Returns authenticated user’s profile (excluding password)

```json
{
  "user_": {
    "_id": "123456",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 🛍️ Products

#### GET `/api/products`
- Fetches paginated list of products (20 per page)
- Query param: `page` (optional)

#### GET `/api/products/:productId`
- Fetches a single product by ID

#### GET `/api/products/search?q=searchTerm`
- Fuzzy search using product tags (Damerau-Levenshtein distance)
- Query param: `q` is required

#### GET `/api/products/popular`
- Returns top 30 products sorted by popularity

---

### 💳 Payments (Razorpay Integration)

#### POST `/api/payment/initiate/:order_id`
- Initiates a Razorpay order for the given order ID (must belong to logged-in user)
- Returns Razorpay order ID, amount, and public key

#### POST `/api/payment/refund`
- Refunds a Razorpay payment
- Body: `{ paymentId: string, amount?: number }`

#### POST `/api/payment/webhook`
- Razorpay webhook to verify payment authenticity
- Signature is verified via HMAC SHA256

---

## 🛠️ Tech Stack

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **Razorpay**
- **JWT (Authentication)**
- **dotenv** (for managing secrets)
- **natural** (for fuzzy search)

---

## 🧪 Sample `.env`

```env
RAZOR_KEY=your_razorpay_key
RAZOR_SECRET=your_razorpay_secret
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb+srv://your_uri
```

---