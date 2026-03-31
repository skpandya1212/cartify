import axios from "axios";

const API = axios.create({
  baseURL: "https://cartify-2wo9.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// CART APIs

export const addToCartAPI = (data, token) =>
  API.post("/cart/add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getCartAPI = (token) =>
  API.get("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });


  export const getProducts = (query = "") => {
  return API.get(`/products${query}`);
};
export default API;

