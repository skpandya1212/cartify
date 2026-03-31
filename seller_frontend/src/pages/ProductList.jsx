import React, { useEffect, useState } from "react";
import "./ProductList.css";
import { deleteProduct, getSellerProducts } from "../services/api";
import { useNavigate } from "react-router-dom";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = "https://cartify-2wo9.onrender.com";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getSellerProducts();
      setProducts(res.data);

      // Initialize image indexes for each product
      const initialIndexes = {};
      res.data.forEach(product => {
        initialIndexes[product._id] = 0;
      });
      setCurrentImageIndexes(initialIndexes);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      setDeleteId(id);
      await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));

      // Clean up image index for deleted product
      const newIndexes = { ...currentImageIndexes };
      delete newIndexes[id];
      setCurrentImageIndexes(newIndexes);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeleteId(null);
    }
  };

  const handlePrevImage = (productId, event) => {
    event.stopPropagation();
    const product = products.find(p => p._id === productId);
    const images = product?.images || [];

    if (images.length <= 1) return;

    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: prev[productId] === 0 ? images.length - 1 : prev[productId] - 1
    }));
  };

  const handleNextImage = (productId, event) => {
    event.stopPropagation();
    const product = products.find(p => p._id === productId);
    const images = product?.images || [];

    if (images.length <= 1) return;

    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: prev[productId] === images.length - 1 ? 0 : prev[productId] + 1
    }));
  };

  const handleIndicatorClick = (productId, index, event) => {
    event.stopPropagation();
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: index
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your products...</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>My Products</h2>
        <button 
          className="add-product-btn"
          onClick={() => navigate("/dashboard/add-product")}
        >
          <span>+</span> Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No products yet</h3>
          <p>Start selling by adding your first product</p>
          <button 
            className="empty-add-btn"
            onClick={() => navigate("/dashboard/add-product")}
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => {
            const images = product.images || [];
            const currentIndex = currentImageIndexes[product._id] || 0;
            const hasMultipleImages = images.length > 1;
            const isDeleting = deleteId === product._id;

            return (
              <div className={`product-card ${isDeleting ? 'deleting' : ''}`} key={product._id}>
                <div className="product-image-section">
                  <div className="product-img">
                    <img
                      src={
                        images[currentIndex]
                          ? `${BASE_URL}${images[currentIndex]}`
                          : "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={product.name}
                      loading="lazy"
                    />

                    {hasMultipleImages && (
                      <>
                        <button
                          className="slider-btn prev"
                          onClick={(e) => handlePrevImage(product._id, e)}
                          aria-label="Previous image"
                        >
                          ‹
                        </button>

                        <button
                          className="slider-btn next"
                          onClick={(e) => handleNextImage(product._id, e)}
                          aria-label="Next image"
                        >
                          ›
                        </button>

                        <div className="image-dots">
                          {images.map((_, index) => (
                            <span
                              key={index}
                              className={`dot ${currentIndex === index ? "active" : ""}`}
                              onClick={(e) => handleIndicatorClick(product._id, index, e)}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="stock-badge low-stock">Low Stock: {product.stock}</span>
                  )}
                  {product.stock === 0 && (
                    <span className="stock-badge out-of-stock">Out of Stock</span>
                  )}
                </div>

                <div className="product-details">
                  <div className="product-info">
                    <h3 title={product.name}>{product.name}</h3>
                    <p className="description">
                      {product.description || product.discription || "No description available"}
                    </p>
                    <div className="price-stock">
                      <p className="price">{formatPrice(product.price)}</p>
                      <p className="stock-info">
                        <span className="stock-label">Stock:</span> 
                        <span className={`stock-value ${product.stock === 0 ? 'zero' : ''}`}>
                          {product.stock}
                        </span>
                      </p>
                    </div>
                    <p className="seller-info">
                      <strong>Seller:</strong> {product.seller_id?.name || "Unknown"}
                    </p>
                    <p className="date">
                      Added on {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/dashboard/edit-product/${product._id}`)}
                      aria-label="Edit product"
                    >
                      <span>✏️</span> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product._id)}
                      disabled={isDeleting}
                      aria-label="Delete product"
                    >
                      {isDeleting ? 'Deleting...' : <span>🗑️</span>}
                      {!isDeleting && ' Delete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductsList;