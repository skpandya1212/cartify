import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    try {

      setLoading(true);

      const { data } = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(data);
      
      navigate("/home");

    } catch (err) {

      setError(err.response?.data?.message || "Invalid email or password");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="login-page">

      {/* LEFT SIDE */}

      <div className="login-left">

        <h1>Cartify</h1>

        <h2>Welcome Back</h2>

        <p>
          Login to continue shopping and explore thousands
          of amazing products from trusted sellers.
        </p>

        <div className="features">
          <div>Secure Shopping</div>
          <div>Easy Order Tracking</div>
          <div>Fast Checkout</div>
        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="login-right">

        <div className="login-card">

          <h2>User Login</h2>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

        </div>

      </div>

    </div>

  );
}

export default Login;