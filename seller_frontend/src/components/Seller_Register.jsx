import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "./Seller_Register.css";

function Seller_Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await registerUser({
        ...formData,
        role: "seller",
      });

      setMessage({ 
        text: "Account created successfully! Redirecting...", 
        type: "success" 
      });
      
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });
      setAgreeTerms(false);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Registration failed. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-register-container">
      <div className="register-wrapper">
        {/* Left Side - Brand Section */}
        <div className="register-brand-section">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="logo-icon">🛒</span>
              <div>
                <span className="logo-text">Cartify</span>
                <div className="brand-tagline">Shop Smart, Live Better</div>
              </div>
            </div>
            <h1>Start Selling Today</h1>
            <p className="brand-description">
              Join thousands of sellers and grow your business with our platform. 
              Get access to millions of customers worldwide.
            </p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div>
                  <h4>Reach More Customers</h4>
                  <p>Access to a global customer base</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div>
                  <h4>Easy Management</h4>
                  <p>Powerful tools to manage your store</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div>
                  <h4>Secure Payments</h4>
                  <p>Safe and reliable payment processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-form-section">
          <div className="form-header">
            <h2>Create Seller Account</h2>
            <p>Please fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Business Address</label>
              <textarea
                id="address"
                name="address"
                placeholder="Enter your complete business address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "error" : ""}
                rows="3"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="terms-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  I agree to the <a href="/terms">Terms of Service</a> and{" "}
                  <a href="/privacy">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && <span className="error-message">{errors.terms}</span>}
            </div>

            <div className="form-footer">
              <button 
                type="submit" 
                disabled={loading}
                className={loading ? "loading" : ""}
              >
                {loading ? "Creating Account..." : "Create Seller Account"}
              </button>
              
              <p className="login-link">
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </div>
          </form>

          {message.text && (
            <div className={`message-popup ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Seller_Register;