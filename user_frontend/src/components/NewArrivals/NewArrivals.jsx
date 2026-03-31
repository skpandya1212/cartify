import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import { getProducts } from "../../services/api";
import ProductCard from "../ProductCard/ProductCard";
import "./NewArrivals.css";


function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await getProducts("?sort=newest&limit=4");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="new-arrivals">

      {/* HEADER */}
      <div className="section-header">
        <h2>New Arrivals</h2>
        <p>Fresh products just added</p>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="new-arrivals-grid">
            {products.map((product) => (
              <div className="new-badge-wrapper" key={product._id}>
                
                {/* 🔥 NEW BADGE */}
                <span className="new-badge">NEW</span>

                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* VIEW ALL */}
          <div className="view-all-container">
            <button
              className="view-all-btn"
              onClick={() => navigate("/products?sort=newest")}
            >
              View All New Arrivals →
            </button>
          </div>
        </>
      )}
    </section>
  );
}
export default NewArrivals;