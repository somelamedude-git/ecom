# Clique – E-Commerce Platform

Clique is a desktop-focused, full-stack e-commerce app. It features multi-role authentication, cart & wishlist systems, checkout flows, order tracking, and secure payments using modern web technologies.

---

## Features
### Frontend
- **React Router** ([docs](https://reactrouter.com/en/main)) for client-side routing.
- **React Toastify** ([docs](https://fkhadra.github.io/react-toastify/introduction)) for toast notifications.
- **Lucide React** ([site](https://lucide.dev/)) icon library.
- Product listing, search, and detail pages.
- Cart management with quantity updates.
- Wishlist functionality.
- User authentication and profile management.
- Checkout flow with address handling.
- Order history and status tracking.
- Static desktop-oriented layout with modern CSS styling.

### Backend
- **Multi-Role Authentication** with JWT ([JWT.io](https://jwt.io/)).
- **MongoDB** with Mongoose ODM ([docs](https://mongoosejs.com/)).
- Razorpay payment integration ([Razorpay Docs](https://razorpay.com/docs/)).
- Order lifecycle management.
- Stock tracking per product size using MongoDB Maps.
- File/image uploads via Cloudinary.
- Email verification and notifications via Nodemailer.
- Request validation with Express Validator.
- Security middleware with Helmet and CORS.
- Gzip compression with Compression middleware.
- **User Roles & Authentication**  
  Buyers, Sellers, and Admins—handled with secure JSON Web Tokens (JWT) and Bcrypt password hashing.

---
## Screenshots

*Screenshots will be added here*

----
## Getting Started
### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

1. **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd <repo-root>
    ```

2. **Backend:**
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # configure .env
    npm run dev
    ```

3. **Frontend:**
    ```bash
    cd ../frontend
    npm install
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
-To access the application remember to set ports in your .env file. 
---

## Technologies Used

| Layer     | Key Tools & Libraries |
|-----------|------------------------|
| **Frontend** | React · React Router · Axios · Lucide React · React Toastify · CSS3 (Flexbox/Grid) |
| **Backend**  | Node.js · MongoDB/Mongoose · JWT · Bcrypt · Razorpay · Cloudinary · Nodemailer · Helmet · Express Validator · Compression |

---

## Structure

```plaintext
frontend/  → React UI components, pages, styles  
backend/   → API controllers, routes, models, middleware  
```

## Team Members

- Prapti – 2024BMS-016  
- Yashasvi Jain – 2024BEE-037  
- Samiksha Agarwal – 2024IMT-074

## Demo Video

*Add demo video link here*
