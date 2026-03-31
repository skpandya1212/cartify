import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",

  });

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
       const { data } = await API.get("/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

        setForm({
  name: data.user.name || "",
  email: data.user.email || "",
  phone: data.user.phone || "",
  address: data.user.address || "",
});

      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  // handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // continue to payment
  const handleSubmit = (e) => {
    e.preventDefault();

    // optionally save address to backend here
    localStorage.setItem("shippingAddress",form.address);
    navigate("/payment");
  };

  return (
    <div className="checkout-page">
      <h2>Shipping Details</h2>

      <form className="checkout-form" onSubmit={handleSubmit}>

        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
     
        <button type="submit">Continue to Payment</button>

      </form>
    </div>
  );
}

export default CheckoutPage;