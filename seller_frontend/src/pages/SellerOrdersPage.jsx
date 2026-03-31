import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SellerOrdersPage.css";

function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "https://cartify-2wo9.onrender.com/api/seller/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (orderId, itemId, status) => {
    try {
      await axios.put(
        `https://cartify-2wo9.onrender.com/api/seller/orders/${orderId}/items/${itemId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="seller-orders">
      <h2>Seller Orders</h2>

      {orders.length === 0 ? (
        <p className="empty">No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">

            {/* CUSTOMER INFO */}
            <div className="order-header">
              <div>
                <h4>{order.user?.name}</h4>
                <p>{order.user?.email}</p>
              </div>

              <div className="payment-info">
                <span className="method">
                  {order.payment_method}
                </span>
                <span
                  className={
                    order.payment_status === "Paid"
                      ? "paid"
                      : "unpaid"
                  }
                >
                  {order.payment_status}
                </span>
              </div>
            </div>

            {/* ITEMS */}
            {order.items.map((item) => (
              <div key={item._id} className="order-item">

                <div className="item-info">
                  <h3>{item.product_name}</h3>
                  <p>₹{item.price} × {item.quantity}</p>
                </div>

                <div className="status">
                  <span>{item.status}</span>
                </div>

                <div className="actions">
                  {item.status === "Pending" && (
                    <>
                      <button
                        className="approve"
                        onClick={() =>
                          updateStatus(order._id, item._id, "Approved")
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="reject"
                        onClick={() =>
                          updateStatus(order._id, item._id, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {item.status === "Approved" && (
                    <button
                      className="ship"
                      onClick={() =>
                        updateStatus(order._id, item._id, "Shipped")
                      }
                    >
                      Ship
                    </button>
                  )}

                  {item.status === "Shipped" && (
                    <button
                      className="deliver"
                      onClick={() =>
                        updateStatus(order._id, item._id, "Delivered")
                      }
                    >
                      Deliver
                    </button>
                  )}
                </div>

              </div>
            ))}

            {/* TOTAL */}
            <div className="order-footer">
              <h3>Total: ₹{order.total_amount}</h3>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default SellerOrdersPage;