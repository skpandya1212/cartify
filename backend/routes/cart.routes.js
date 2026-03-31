import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart  
  ,updateCartQty 
} from "./../controller/cart.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Add to cart
router.post("/add", authMiddleware, addToCart);

// Get cart
router.get("/", authMiddleware, getCart);
// REMOVE ITEM ROUTE
router.delete("/remove", authMiddleware, removeFromCart);
router.put("/update", authMiddleware, updateCartQty);
export default router;
