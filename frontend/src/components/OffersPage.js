import React, { useState, useEffect } from "react";
import { Search, User, ShoppingBag, ArrowLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/OffersPage.css";

function OffersPage({ isLoggedIn, onToggleMenu }) {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);

  const fallbackOffers = [
    { badge: "NEW CUSTOMER", title: "Welcome Offer", description: "Get 20% off on your first purchase. Valid on all items except sale products.", code: "WELCOME20" },
    { badge: "LIMITED TIME", title: "Flash Sale", description: "Up to 50% off on selected items. Hurry, limited stock available!", code: "FLASH50" },
    { badge: "FREE SHIPPING", title: "No Delivery Charges", description: "Free shipping on all orders above ₹2,000. No minimum purchase required for premium members.", code: "FREESHIP" },
    { badge: "SEASONAL", title: "Winter Collection", description: "Special discount on winter wear. Stay warm and stylish with our latest collection.", code: "WINTER25" },
    { badge: "VIP MEMBERS", title: "Exclusive Access", description: "Early access to new collections and exclusive member-only discounts.", code: "VIP15" },
    { badge: "BULK ORDER", title: "Corporate Discounts", description: "Special pricing for bulk orders. Perfect for corporate events and team uniforms.", code: "BULK30" }
  ];

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("/api/offers");
        setOffers(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load offers. Showing default deals.");
        setOffers(fallbackOffers);
      }
    };
    fetchOffers();
  }, []);

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
        <div className="offers-grid">
          {offers.map((offer, index) => (
            <div key={index} className="offer-card">
              <div className="offer-badge">{offer.badge}</div>
              <h3 className="offer-title">{offer.title}</h3>
              <p className="offer-description">{offer.description}</p>
              <button
                className="offer-button"
                onClick={() => navigate("/products")}
              >
                Shop Now
              </button>
            </div>
          ))}
        </div>

        <div className="promo-section">
          <h2 className="promo-title">
            Special Promo <span className="title-accent">Code</span>
          </h2>
          <div className="promo-code">CLIQUE20</div>
          <p className="promo-text">
            Use this code at checkout to get 20% off on your entire order. Valid until the end of this month!
          </p>
        </div>
      </main>
    </div>
  );
}

export default OffersPage;