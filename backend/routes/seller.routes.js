import express from "express";
import {
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerStats,
} from "../controller/seller.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ==============================
// ✅ GET SELLER ORDERS
// ==============================
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("seller"),
  getSellerOrders
);

// ==============================
// ✅ UPDATE ITEM STATUS
// ==============================
router.put(
  "/orders/:orderId/items/:itemId",
  authMiddleware,
  roleMiddleware("seller"),
  updateSellerOrderStatus
);

// ==============================
// ✅ SELLER STATS 💰
// ==============================
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("seller"),
  getSellerStats
);

export default router;