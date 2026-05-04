import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getSellerProducts,
  getCategories,
  addReview,
} from "../controller/product.controller.js";

import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/seller-products", authMiddleware, getSellerProducts);

router.post("/", authMiddleware, upload.array("images", 5), addProduct);

router.get("/:id", getSingleProduct);

router.put("/:id", authMiddleware, upload.array("images", 5), updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);

router.post("/:id/review", authMiddleware, addReview);

export default router;
