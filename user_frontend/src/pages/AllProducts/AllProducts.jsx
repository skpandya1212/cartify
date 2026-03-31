import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../../services/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./AllProducts.css";

function Products() {
  const [products, setProducts] = useState([]);

  const location = useLocation();

  // ✅ get keyword from URL
  const keyword = new URLSearchParams(location.search).get("keyword") || "";
  const category = new URLSearchParams(location.search).get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = "?";

        if (keyword) query += `keyword=${keyword}&`;
        if (category) query += `category=${category}&`;

        const res = await getProducts(query);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [keyword, category]);


  return (
    <div className="all-products">
      <h1>
        {keyword
          ? `Search Results for "${keyword}"`
          : category
            ? `${category} Products`
            : "All Products"}
      </h1>

      {/* ✅ No results message */}
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;