import React, { useState } from "react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./ProductCard.css";


function ProductCard({ product }) {
  const BASE_URL = "http://localhost:5000";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const rating = Math.round(product.rating || 0);
  const reviews = product.numReviews || 0;

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  // 👉 Open product details
  const openProduct = () => {
    navigate(`/product/${product._id}`);
  };

  // 👉 Add to cart + redirect
  const handleAddToCart = async (e) => {
    e.stopPropagation(); // prevent card click

    if (product.stock === 0) return;

    try {
      setLoading(true);

      await API.post(
        "/cart/add",
        {
          product_id: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Redirect to cart page
      navigate("/cart");

    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card" onClick={openProduct}>

      <div className="product-img">
        <img
          src={
            product.images?.length
              ? `${BASE_URL}${product.images[0]}`
              : "https://via.placeholder.com/300"
          }
          alt={product.name}
        />
      </div>

      <div className="product-details">

        <span className="category">{product.category}</span>

        <h3 className="product-name">{product.name}</h3>

        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? "star filled" : "star"}
            />
          ))}
          <span className="review-count">({reviews} reviews)</span>
        </div>

        <p className="description">
          {product.description
            ? product.description.slice(0, 60) + "..."
            : "No description available"}
        </p>

        <p className={product.stock > 0 ? "stock" : "out-stock"}>
          {product.stock > 0
            ? `In Stock (${product.stock})`
            : "Out of Stock"}
        </p>

        <div className="bottom">

          <span className="price">₹{product.price}</span>

          <button
            className="cart-btn"
            disabled={product.stock === 0 || loading}
            onClick={handleAddToCart}
          >
            <FaShoppingCart />
            {loading ? "Adding..." : "Add"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;