import React, { useState } from "react";
import "./AddProduct.css";
import { addProduct } from "../services/api.js";

function AddProduct() {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Categories
  const categories = [
    "Shoes",
    "Electronics",
    "Clothing",
    "Watches",
    "Bags",
    "Sports"
  ];

  // Handle text input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData({
      ...formData,
      images: files,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const formDataToSend = new FormData();

      // Normal fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("stock", formData.stock);

      // Category (custom support)
      formDataToSend.append(
        "category",
        formData.category === "custom"
          ? newCategory
          : formData.category
      );

      // Images
      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // API Call
      await addProduct(formDataToSend);

      setMessage("✅ Product added successfully");

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        images: [],
      });

      setNewCategory("");

    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">

        <h2>Add New Product</h2>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Price + Stock */}
          <div className="form-row">

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                placeholder="Enter stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}

              <option value="custom">➕ Add New Category</option>

            </select>
          </div>

          {/* Custom Category */}
          {formData.category === "custom" && (
            <div className="form-group">
              <label>New Category</label>
              <input
                type="text"
                placeholder="Enter new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
            </div>
          )}

          {/* Images */}
          <div className="form-group">
            <label>Product Images</label>

            <input
              type="file"
              multiple
              onChange={handleImageChange}
            />

            {/* Preview */}
            <div className="preview">
              {formData.images.length > 0 &&
                formData.images.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    width="70"
                    style={{ marginRight: "10px", marginTop: "10px" }}
                  />
                ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

        </form>

        {message && <p className="message">{message}</p>}

      </div>
    </div>
  );
}

export default AddProduct;