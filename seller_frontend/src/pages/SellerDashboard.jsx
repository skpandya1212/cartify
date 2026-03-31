

import React, { useEffect, useState } from "react";
import "./SellerDashboard.css";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

function SellerDashboard() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); // 👈 NEW

  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    delivered: 0,
    totalRevenue: 0,
  });

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        "https://cartify-2wo9.onrender.com/api/seller/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="seller-container">

      {/* ☰ HAMBURGER */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${isOpen ? "active" : ""}`}>

        <div>

          <div className="sidebar-header">
            <h2>Cartify Seller</h2>
          </div>

          <ul className="sidebar-menu">
            <li><NavLink to="/dashboard" className="menu-link">📊 Dashboard</NavLink></li>
            <li><NavLink to="/dashboard/products" className="menu-link">📦 Products</NavLink></li>
            <li><NavLink to="/dashboard/orders" className="menu-link">🧾 Orders</NavLink></li>
            <li><NavLink to="/dashboard/add-product" className="menu-link">➕ Add Product</NavLink></li>
            <li><NavLink to="/dashboard/profile" className="menu-link">👤 Profile</NavLink></li>
          </ul>

        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* OVERLAY (click outside to close) */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

      {/* MAIN */}
      <div className="main-content">
        <Outlet />
      </div>

    </div>
  );
}


export default SellerDashboard;