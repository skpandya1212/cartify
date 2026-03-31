import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./CategorySection.css";

function CategorySection() {

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {

    try {

      const { data } = await API.get("/products/categories");

      setCategories(data);

    } catch (error) {

      console.error("Category error", error);

    }

  };

  return (

    <section className="category-section">

      <h2>Browse <span> Categories </span> </h2>

      <div className="category-list">

        <button
          className="category-btn"
          onClick={() => navigate("/products")}
        >
          All
        </button>

        {categories.map((cat, index) => (

          <button
            key={index}
            className="category-btn"
            onClick={() => navigate(`/products?category=${cat.name || cat}`)}
          >
            {cat.name || cat}
          </button>

        ))}

      </div>

    </section>

  );

}

export default CategorySection;