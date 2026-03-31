    import axios from "axios";

// ==============================
// Axios Instance
// ==============================

const API = axios.create({
  baseURL: "https://cartify-2wo9.onrender.com/api",
});

// ==============================
// Add Token Automatically
// ==============================

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// =====================================================
// AUTH API
// =====================================================

// Register
export const registerUser = (data) => API.post("/auth/register", data);

// Login
export const loginUser = (data) => API.post("/auth/login", data);

// Get logged-in user
export const getMe = () => API.get("/auth/me");

// Logout
export const logoutUser = () => API.post("/auth/logout");


// =====================================================
// PRODUCT API
// =====================================================

// Get all products
export const getProducts = () => API.get("/products");

// Add product (Seller)
export const addProduct = (data) =>
  API.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getProductById = (id) =>
  API.get(`/products/${id}`);
// Update product
export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data);

// Delete product
export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);
// Get logged-in seller products
export const getSellerProducts = () =>
  API.get("/products/seller-products");

// =====================================================
// CART API
// =====================================================

// Get cart
export const getCart = () => API.get("/cart");

// Add to cart
export const addToCart = (data) =>
  API.post("/cart/add", data);


// =====================================================
// ORDER API (if you created)
// =====================================================

// Create order
export const createOrder = (data) =>
  API.post("/orders", data);

// Get user orders
export const getUserOrders = () =>
  API.get("/orders/my");

// Update order status
export const updateOrderStatus = (id, data) =>
  API.put(`/orders/${id}`, data);


// =====================================================
// Default export
// =====================================================



// =====================================================
// USER PROFILE API
// =====================================================

// Get seller profile
export const getSellerProfile = () =>
  API.get("/auth/seller-profile");

// Update seller profile
export const updateSellerProfile = (data) =>
  API.put("/auth/seller-profile", data);


export const resetPassword = (data) =>
  API.post("/auth/reset-password", data);


// =====================================================
// SELLER API
// =====================================================

// Get seller orders
export const getSellerOrders = () =>
  API.get("/seller/orders");



export default API;
