import express from "express";
import {
  createOrder,
  getUserOrders
} from "./../controller/order.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create order
router.post("/", authMiddleware, createOrder);

// Get logged-in user orders
router.get("/my-orders", authMiddleware, getUserOrders);

export default router;
