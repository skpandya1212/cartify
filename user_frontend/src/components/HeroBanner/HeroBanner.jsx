import React from "react";
import { Link } from "react-router-dom";
import "./HeroBanner.css";
import herobanner from './../../assets/hero-banner.png'
function HeroBanner() {
  return (
    <section className="hero">

      <div className="hero-content">

        {/* LEFT SIDE */}
        <div className="hero-left">

          <h1>
            Discover Amazing <span>Deals</span> Online
          </h1>

          <p>
            Shop thousands of products from trusted sellers. 
            Enjoy fast delivery, secure payments, and the best prices.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="shop-btn">
              Shop Now
            </Link>

            <Link to="/register" className="explore-btn">
              Join Now
            </Link>
          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="hero-right">

          <img
            src={herobanner}
            alt="shopping"
          />

        </div>

      </div>

    </section>
  );
}

export default HeroBanner;