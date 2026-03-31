import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  // =========================
  // GET CART
  // =========================
  const fetchCart = async () => {
    try {
      const { data } = await axios.get("https://cartify-2wo9.onrender.com/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ filter invalid products
      const validItems = (data.items || []).filter(
        (item) => item.product_id !== null
      );

      setCartItems(validItems);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeFromCart = async (productId) => {
    try {
      await axios.delete("https://cartify-2wo9.onrender.com/api/cart/remove", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { product_id: productId },
      });

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // UPDATE QTY
  // =========================
  const updateQty = async (productId, qty) => {
    if (qty <= 0) return;

    try {
      await axios.put(
        "https://cartify-2wo9.onrender.com/api/cart/update",
        {
          product_id: productId,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // TOTAL PRICE (SAFE)
  // =========================
  const totalPrice = cartItems.reduce((acc, item) => {
    if (!item.product_id) return acc; // ✅ important
    return acc + item.product_id.price * item.quantity;
  }, 0);

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty">Your cart is empty</p>
      ) : (
        <div className="cart-container">

          {/* LEFT */}
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = item.product_id;

              if (!product) return null; // ✅ double safety

              return (
                <div key={product._id} className="cart-item">

                  <img
                    src={
                      product.images?.[0]
                        ? `https://cartify-2wo9.onrender.com${product.images[0]}`
                        : "/placeholder.png"
                    }
                    alt={product.name}
                  />
                  <div className="details">
                    <h3>{product.name}</h3>
                    <p>₹{product.price}</p>

                    <div className="qty-control">
                      <button onClick={() => updateQty(product._id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(product._id, item.quantity + 1)}>+</button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(product._id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {cartItems.length}</p>
            <h2>Total: ₹{totalPrice}</h2>

            <button
              className="checkout-btn"
              onClick={() => {
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                localStorage.setItem("totalAmount", totalPrice);
                navigate("/checkout");
              }}

            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default CartPage;