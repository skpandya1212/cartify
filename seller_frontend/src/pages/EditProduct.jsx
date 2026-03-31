import React, { useEffect, useState } from "react";
import "./EditProduct.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getProductById } from "../services/api";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [] // mix of old + new
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        const product = res.data;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          images: product.images || [] // old images
        });

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // handle text
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ SAME AS ADD PRODUCT
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files] // keep old + add new
    }));
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);

      // ✅ separate old images
      const existingImages = formData.images.filter(
        (img) => typeof img === "string"
      );

      data.append("existingImages", JSON.stringify(existingImages));

      // ✅ new images
      formData.images.forEach((img) => {
        if (img instanceof File) {
          data.append("images", img);
        }
      });

      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product updated successfully");
      navigate("/dashboard/products");

    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading product data...</p>;

  return (
    <div className="edit-product-container">

      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit} className="edit-product-form">

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />

        {/* ✅ CLEAN IMAGE SECTION */}
        <div className="image-section">

          <label>Product Images</label>

          <input
            type="file"
            multiple
            onChange={handleImageChange}
          />

          {/* Preview */}
          <div className="preview">
            {formData.images.map((img, index) => (
              <img
                key={index}
                src={
                  img instanceof File
                    ? URL.createObjectURL(img)
                    : `http://localhost:5000${img}`
                }
                alt="preview"
                className="image-preview"
              />
            ))}
          </div>

        </div>

        <button type="submit">
          Update Product
        </button>

      </form>

    </div>
  );
}

export default EditProduct;