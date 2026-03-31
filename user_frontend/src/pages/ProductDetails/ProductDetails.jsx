import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import API from "../../services/api";
import "./ProductDetails.css";
import StarRating from "../../components/Rating/StarRating";
import RatingSummary from "../../components/RatingSummary/RatingSummary";
import { useNavigate } from "react-router-dom";
function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeImage, setActiveImage] = useState(0);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        alert("Please login first");
        return;
      }

      await API.post(
        "/cart/add",
        {
          product_id: id,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      alert(`${qty} item(s) added to cart ✅`);
      navigate("/cart");
    } catch (error) {
      console.error("Cart error", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };
  // ⭐ NEW: Quantity state
  const [qty, setQty] = useState(1);



  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Product fetch error", error);
    }
  };

  // ⭐ Quantity Controls
  const increaseQty = () => {
    if (qty < product.stock) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  // ⭐ SUBMIT REVIEW
  const submitReview = async (e) => {

    e.preventDefault();

    try {

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        alert("Please login to add review");
        return;
      }

      await API.post(
        `/products/${id}/review`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      alert("Review added successfully");

      setRating(0);
      setComment("");

      fetchProduct();

    } catch (error) {

      console.error("Review error", error.response?.data || error.message);
      alert(error.response?.data?.message || "Review failed");

    }

  };

  if (!product) return <p className="loading">Loading...</p>;

  // ⭐ SORT REVIEWS
  const sortedReviews = [...(product.reviews || [])];

  if (sort === "highest") {
    sortedReviews.sort((a, b) => b.rating - a.rating);
  }

  if (sort === "lowest") {
    sortedReviews.sort((a, b) => a.rating - b.rating);
  }

  if (sort === "newest") {
    sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return (

    <div className="product-details-page">

      <div className="product-container">

        {/* LEFT IMAGE */}
        <div className="product-images">

          {/* MAIN IMAGE */}
          <img
            src={
              product.images?.[activeImage]
                ? `https://cartify-2wo9.onrender.com${product.images[activeImage]}`
                : "https://via.placeholder.com/500"
            }
            alt={product.name}
            className="main-image"
          />

          {/* THUMBNAILS */}
          <div className="thumbnail-container">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={`https://cartify-2wo9.onrender.com${img}`}
                alt="thumb"
                className={`thumbnail ${index === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>

        </div>

        {/* RIGHT INFO */}
        <div className="product-info">

          <span className="category">{product.category}</span>

          <h1>{product.name}</h1>

          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(product.rating) ? "star filled" : "star"}
              />
            ))}
            <span className="review-count">
              ({product.numReviews} reviews)
            </span>
          </div>

          <h2 className="price">₹{product.price}</h2>

          <p className={product.stock > 0 ? "stock" : "out-stock"}>
            {product.stock > 0
              ? `In Stock (${product.stock})`
              : "Out Of Stock"}
          </p>

          <p className="description">
            {product.description}
          </p>

          {/* ⭐ NEW CART SECTION */}
          <div className="cart-section">

            <div className="qty-control">
              <button onClick={decreaseQty}>-</button>
              <span>{qty}</span>
              <button onClick={increaseQty}>+</button>
            </div>

            <button
              className="add-cart-btn"
              disabled={product.stock === 0}
              onClick={addToCart}
            >
              <FaShoppingCart />
              Add {qty}
            </button>
          </div>

        </div>

      </div>

      {/* ⭐ RATING SUMMARY */}
      <RatingSummary reviews={product.reviews || []} />

      {/* ⭐ REVIEWS */}
      <div className="reviews-section">

        <div className="review-header">

          <h2>Customer Reviews</h2>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>

        </div>

        {sortedReviews.length === 0 && (
          <p>No reviews yet</p>
        )}

        {sortedReviews.map((review) => (

          <div className="review-card" key={review._id}>

            <h4>{review.name}</h4>

            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>

            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < review.rating ? "star filled" : "star"}
                />
              ))}
            </div>

            <p>{review.comment}</p>

          </div>

        ))}

      </div>

      {/* ⭐ ADD REVIEW */}
      <div className="review-form">

        <h3>Add Your Review</h3>

        <form onSubmit={submitReview}>

          <StarRating rating={rating} setRating={setRating} />

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <button type="submit">
            Submit Review
          </button>

        </form>

      </div>

    </div>

  );

}

export default ProductDetails;