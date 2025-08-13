import React, { useState, useEffect } from "react";
import { Search, User, ShoppingBag, ArrowLeft, Menu, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/OffersPage.css";

function OffersPage({ isLoggedIn, onToggleMenu }) {
  const navigate = useNavigate();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint URL
        const response = await axios.get("http://localhost:3000/promo/fetchCodes"); // Update this URL to match your backend endpoint
        
        if (response.data.success) {
          setPromos(response.data.promo_info);
        } else {
          toast.error("Failed to load promotional offers");
        }
      } catch (error) {
        console.error("Error fetching promos:", error);
        toast.error("Failed to load offers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const copyPromoCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Promo code copied to clipboard!");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy promo code");
    }
  };

  if (loading) {
    return (
      <div className="offers-container">
        <main className="main-content">
          <button className="back-button" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <div className="loading-container">
            <p>Loading exclusive offers...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="offers-container">
      <main className="main-content">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <h1 className="title">
          Exclusive <span className="title-accent">Offers</span>
        </h1>
        <p className="subtitle">
          Discover amazing deals and special discounts on your favorite fashion items
        </p>

        {promos.length === 0 ? (
          <div className="no-offers">
            <p>No promotional offers available at the moment.</p>
            <button
              className="shop-button"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="offers-grid">
            {promos.map((promo) => (
              <div key={promo._id || promo.code} className="offer-card">
                <div className="offer-badge">{promo.badge}</div>
                <h3 className="offer-title">{promo.title}</h3>
                <p className="offer-description">{promo.description}</p>
                
                {promo.discount_provided && (
                  <div className="discount-info">
                    <span className="discount-amount">
                      {promo.discount_provided}% OFF
                    </span>
                  </div>
                )}

                {promo.code && (
                  <div className="promo-code-section">
                    <div className="promo-code-display">
                      <span className="promo-code-text">{promo.code}</span>
                      <button
                        className="copy-button"
                        onClick={() => copyPromoCode(promo.code)}
                        title="Copy promo code"
                      >
                        {copiedCode === promo.code ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  className="offer-button"
                  onClick={() => navigate("/products")}
                >
                  Shop Now
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="cta-section">
          <h2 className="cta-title">
            Ready to <span className="title-accent">Save?</span>
          </h2>
          <p className="cta-text">
            Don't miss out on these exclusive deals. Start shopping now and save big on your favorite items!
          </p>
          <button
            className="cta-button"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
        </div>
      </main>
    </div>
  );
}

export default OffersPage;