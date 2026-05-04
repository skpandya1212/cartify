import React, { useEffect, useState } from "react";
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
  const [previewUrls, setPreviewUrls] = useState([]);

  const categories = [
    "Shoes",
    "Electronics",
    "Clothing",
    "Watches",
    "Bags",
    "Sports",
  ];

  useEffect(() => {
    const urls = formData.images.map((img) => URL.createObjectURL(img));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.images]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory =
      formData.category === "custom" ? newCategory.trim() : formData.category;

    if (!selectedCategory) {
      setMessage("Please select or enter a category");
      return;
    }

    if (formData.images.length === 0) {
      setMessage("Please upload at least one product image");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("category", selectedCategory);

      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await addProduct(formDataToSend);

      setMessage("Product added successfully");

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
      setMessage(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h2>Add New Product</h2>

        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

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

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}

              <option value="custom">Add New Category</option>
            </select>
          </div>

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

          <div className="form-group">
            <label>Product Images</label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

            <div className="preview">
              {previewUrls.map((url, index) => (
                <img
                  key={url}
                  src={url}
                  alt={`preview-${index + 1}`}
                  width="70"
                  style={{ marginRight: "10px", marginTop: "10px" }}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default AddProduct;
