import React, { useEffect, useState } from "react";
import API from "../../services/api";
import ProductCard from "../ProductCard/ProductCard";
import "./FeaturedProducts.css";

function FeaturedProducts() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    try {

      const { data } = await API.get("/products");

      setProducts(data.slice(0, 4));

    } catch (error) {

      console.error("Product error", error);

    }

  };

  return (

    <section className="featured-products">

      <div className="section-header">

        <h2>Featured Products</h2>
        <p>Explore our most popular items</p>

      </div>

      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* ✅ VIEW ALL BUTTON */}
      <div className="view-all-container">
        <button
          className="view-all-btn"
          onClick={() => window.location.href = "/products"}
        >
          View All Products →
        </button>
      </div>

    </section>
  );

}

export default FeaturedProducts;