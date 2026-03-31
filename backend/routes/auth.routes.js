import express from "express";
import { register, login ,getSellerProfile,updateSellerProfile ,resetPassword} from "./../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { getUserProfile, updateUserProfile } from "../controller/auth.controller.js";


const router = express.Router();


// ==========================
// Public Routes
// ==========================

// Register User / Seller / Admin
// POST /api/auth/register
router.post("/register", register);


// Login User / Seller / Admin
// POST /api/auth/login
router.post("/login", login);


// ==========================
// Protected Routes
// ==========================

// Get Logged-in User Info
// GET /api/auth/me
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "User authenticated successfully",
    user: req.user,
  });
});


// ==========================
// Logout Route (Optional)
// ==========================

router.post("/logout", authMiddleware, (req, res) => {
  res.json({
    message: "Logout successful (client should delete token)",
  });
});





// Reset Password
// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);  



router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
