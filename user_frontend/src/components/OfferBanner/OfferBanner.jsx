import React from "react";
import { useNavigate } from "react-router-dom";
import "./OfferBanner.css";

function OfferBanner() {
  const navigate = useNavigate();

  return (
    <section className="offer-banner">
      <div className="offer-content">
        <h2>Big Sale is Live </h2>
        <p>Up to 50% OFF on all products</p>

        <button onClick={() => navigate("/products")}>
          Shop Now
        </button>
      </div>
    </section>
  );
}

export default OfferBanner;