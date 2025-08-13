import './App.css';
import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loading from "./components/loading";

const LandingPage = React.lazy(() => import("./components/LandingPage"));
const Login = React.lazy(() => import("./pages/loginPage"));
const RegistrationPage = React.lazy(() => import("./pages/registrationPage"));
const CartPage = React.lazy(() => import("./components/CartPage"));
const ProductsPage = React.lazy(() => import("./components/ProductPage"));
const ProfilePage = React.lazy(() => import("./components/ProfilePage"));
const AboutPage = React.lazy(() => import("./components/AboutUs"));
const Layout = React.lazy(() => import("./components/Layout"));
const WishlistPage = React.lazy(() => import("./components/WishlistPage"));
const SellerProductsPage = React.lazy(() => import("./components/productList"));
const SellerOrdersPage = React.lazy(() => import("./components/sellerOrders"));
const SalesHeatmap = React.lazy(() => import("./components/HeatMap"));
const AddProductForm = React.lazy(() => import("./components/AddProduct"));
const SellerProfile = React.lazy(() => import("./components/sellerProfile"));
const ProductDescriptionPage = React.lazy(() => import("./components/SingleProduct"));
const ProductAnalytics = React.lazy(() => import("./components/productAnalytics"));
const AdminPortal = React.lazy(() => import('./components/Admin'));
const AnalyticsDashboard = React.lazy(() => import('./components/Analytics'));
const WorkWithUsPage = React.lazy(() => import("./pages/workwithusPage"));
const ContactPage = React.lazy(() => import("./components/ContactPage")); 
const Checkout = React.lazy(() => import("./components/CheckoutPage"));
const Offers = React.lazy(() => import("./components/OffersPage"));
const OrderConfirmedPage = React.lazy(() => import('./components/OrderConfirmed'));

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <div className={`loader-overlay ${loading ? "show" : ""}`}>
        <Loading />
      </div>

      {!loading && (
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/signup" element={<Layout><RegistrationPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
            <Route path="/seller/products" element={<Layout><SellerProductsPage /></Layout>} />
            <Route path="/seller/orders" element={<Layout><SellerOrdersPage /></Layout>} />
            <Route path="/seller/analytics" element={<Layout><SalesHeatmap /></Layout>} />
            <Route path="/seller/add-product" element={<Layout><AddProductForm /></Layout>} />
            <Route path="/seller/profile" element={<Layout><SellerProfile /></Layout>} />
            <Route path="/product/:product_id" element={<Layout><ProductDescriptionPage/></Layout>} />
            <Route path="/seller/analysis/product/:product_id" element={<Layout><ProductAnalytics/></Layout>} />
            <Route path="/admin/portal" element={<Layout><AdminPortal/></Layout>} />
            <Route path="/admin/stats" element={<Layout><AnalyticsDashboard/></Layout>} />
            <Route path="/work-with-us" element={<Layout><WorkWithUsPage/></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage/></Layout>} />
            <Route path="/checkout" element={<Layout><Checkout/></Layout>} />
            <Route path="/confirmation" element={<Layout><OrderConfirmedPage/></Layout>} />
            <Route path='/offers' element={<Layout><Offers/></Layout>}></Route>
          </Routes>
        </Suspense>
      )}
    </>
  );
}

export default function App() {
  return <AppContent />;
}
