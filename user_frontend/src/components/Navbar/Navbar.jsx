import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Check login status on component mount and when localStorage changes
  useEffect(() => {
    checkLoginStatus();
    updateCartCount();

    // Listen for storage changes (in case user logs out in another tab)
    window.addEventListener('storage', checkLoginStatus);

    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const checkLoginStatus = () => {
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setIsLoggedIn(true);
        setUserInfo(user);
      } catch (error) {
        console.error("Error parsing user info:", error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error("Error updating cart count:", error);
      setCartCount(0);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword}`);
      setShowSearch(false);
      setMenuOpen(false);
    } else {
      navigate("/products");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserInfo(null);
    setShowDropdown(false);
    navigate("/");
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  // Handle profile click
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate(userInfo?.role === "seller" ? "/dashboard" : "/profile");
    } else {
      navigate("/login");
    }

    setMenuOpen(false);
    setShowDropdown(false);
  };
  // Get user initials for avatar
  const getUserInitials = () => {
    if (userInfo?.name) {
      return userInfo.name.charAt(0).toUpperCase();
    }
    return <FaUserCircle />;
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <Link to="/" onClick={() => setMenuOpen(false)}>Cartify</Link>
      </div>

      {/* SEARCH ICON (MOBILE) */}
      <div className="mobile-search-icon" onClick={() => setShowSearch(!showSearch)}>
        <FaSearch />
      </div>

      {/* Search Bar */}
      <form
        className={`nav-search-wrapper ${showSearch ? "active" : ""}`}
        onSubmit={handleSearch}
      >
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search for products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" aria-label="Submit search">
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>

        {/* Cart Link */}
        <Link to="/cart" className="cart-icon" onClick={() => setMenuOpen(false)}>
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {/* User Profile / Login with Dropdown */}
        <div className="user-menu">
          {isLoggedIn ? (
            <>
              <button
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="User menu"
              >
                <span className="user-avatar">
                  {typeof getUserInitials() === 'string' ? getUserInitials() : <FaUserCircle />}
                </span>
                <span className="user-name">{userInfo?.name?.split(' ')[0]}</span>
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {typeof getUserInitials() === 'string' ? getUserInitials() : <FaUserCircle />}
                    </div>
                    <div className="dropdown-info">
                      <p className="dropdown-name">{userInfo?.name}</p>
                      <p className="dropdown-email">{userInfo?.email}</p>
                      <span className="dropdown-role">{userInfo?.role || 'user'}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link
                    to={userInfo?.role === "seller" ? "/dashboard" : "/profile"}
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaUserCircle /> My Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <FaShoppingCart /> My Orders
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="login-link" onClick={() => setMenuOpen(false)}>
              <FaUser />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)}></div>}
    </nav>
  );
}

export default Navbar;