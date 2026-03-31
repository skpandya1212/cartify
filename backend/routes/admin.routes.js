import express from "express";
import {
  getUsers,
  getAllOrders,
  deleteProductByAdmin
} from "./../controller/admin.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all users
router.get("/users", authMiddleware, getUsers);

// Get all orders
router.get("/orders", authMiddleware, getAllOrders);

// Delete product
router.delete("/product/:id", authMiddleware, deleteProductByAdmin);

export default router;
