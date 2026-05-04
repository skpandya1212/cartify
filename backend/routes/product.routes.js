import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getSellerProducts,
  getCategories,
  addReview
} from "./../controller/product.controller.js";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get categories
router.get("/categories", getCategories);

// Seller products
router.get("/seller-products", authMiddleware, getSellerProducts);

// Get single product
router.get("/:id", getSingleProduct);

// Add product
router.post("/", authMiddleware,   upload.array("images", 5),addProduct);

// Update product
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  updateProduct
);

// Delete product
router.delete("/:id", authMiddleware, deleteProduct);
//review
router.post("/:id/review", authMiddleware, addReview);

export default router;