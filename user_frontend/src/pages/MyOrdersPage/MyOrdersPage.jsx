import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrdersPage.css";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  // =========================
  // FETCH USER ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "https://cartify-2wo9.onrender.com/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">

            {/* ORDER HEADER */}
            <div className="order-header">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Total:</strong> ₹{order.total_amount}</p>
              <p><strong>Payment:</strong> {order.payment_status}</p>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item._id} className="order-item">

                  <div className="details">
                    <h4>{item.product_name}</h4>
                    <p>Price: ₹{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Status: <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default MyOrdersPage;