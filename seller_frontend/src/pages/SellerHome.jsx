import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SellerHome.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

function SellerHome() {
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
  });

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  // 🔥 UPDATE STATUS FUNCTION
  const updateStatus = async (orderId, itemId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/seller/orders/${orderId}/item/${itemId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/seller/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersData = Array.isArray(res.data)
        ? res.data
        : res.data.orders || res.data.data || [];

      setOrders(ordersData);

      let total = 0,
        pending = 0,
        shipped = 0,
        delivered = 0,
        totalRevenue = 0;

      ordersData.forEach(order => {
        order.items?.forEach(item => {
          total++;

          if (item.status === "Pending") pending++;
          if (item.status === "Shipped") shipped++;
          if (item.status === "Delivered") {
            delivered++;
            totalRevenue += item.price * item.quantity;
          }
        });
      });

      setStats({ total, pending, shipped, delivered });
      setRevenue(totalRevenue);

    } catch (err) {
      console.error("ERROR:", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 📊 CHART DATA
  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "Shipped", value: stats.shipped },
    { name: "Delivered", value: stats.delivered },
  ];

  return (
    <div className="seller-home">

      {/* HEADER */}
      <div className="home-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, Seller 👋</p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card total">
          <h4>Total Orders</h4>
          <span>{stats.total}</span>
        </div>

        <div className="stat-card pending">
          <h4>Pending</h4>
          <span>{stats.pending}</span>
        </div>

        <div className="stat-card shipped">
          <h4>Shipped</h4>
          <span>{stats.shipped}</span>
        </div>

        <div className="stat-card delivered">
          <h4>Delivered</h4>
          <span>{stats.delivered}</span>
        </div>

        {/* 💰 REVENUE */}
        <div className="stat-card revenue">
          <h4>Revenue</h4>
          <span>₹{revenue}</span>
        </div>
      </div>

      {/* 📊 CHART */}
      <div className="chart-container">
        <h3>Order Status</h3>

        <PieChart width={350} height={300}>
          <Pie data={chartData} dataKey="value" outerRadius={100}>
            {chartData.map((entry, index) => (
              <Cell key={index} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* ORDERS */}
      <div className="orders-container">
        <h3>Recent Orders</h3>

        {orders.length === 0 ? (
          <p className="empty">No orders available</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-card">

              <div className="order-header">
                <div>
                  <p className="order-id">
                    #{order._id?.slice(-6)}
                  </p>
                  <p className="customer">
                    {order.user?.name || "Unknown"}
                  </p>
                </div>
                <p className="date">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </div>

              {order.items?.map(item => (
                <div key={item._id} className="order-item">

                  <div className="item-info">
                    <p className="product">{item.product_name}</p>
                    <p className="details">
                      Qty: {item.quantity} • ₹{item.price}
                    </p>
                  </div>

                  <div className="item-actions">

                    <div className={`status ${item.status?.toLowerCase()}`}>
                      {item.status}
                    </div>

                    {/* 🔥 BUTTONS */}
                    {item.status === "Pending" && (
                      <button
                        className="btn ship"
                        onClick={() =>
                          updateStatus(order._id, item._id, "Shipped")
                        }
                      >
                        Ship
                      </button>
                    )}

                    {item.status === "Shipped" && (
                      <button
                        className="btn deliver"
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

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default SellerHome;