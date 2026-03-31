import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import sellerRoutes from "./routes/seller.routes.js";

import cors from "cors";

dotenv.config();

// ✅ Connect Database
connectDB();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://cartify-nine-chi.vercel.app",
  "https://cartify-gu4h.vercel.app"
];

// ✅ CORS CONFIG (FIXED)
app.use(
  cors({
    origin: function (origin, callback) {
      // ✅ allow requests with no origin (mobile apps, postman)
      if (!origin) return callback(null, true);

      // ✅ allow localhost (any port)
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // ✅ allow production domains
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❌ block others
      return callback(null, false);
    },
    credentials: true,
  })
);

// ✅ VERY IMPORTANT: Handle preflight requests
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "E-Commerce API Running 🚀" });
});

// ✅ Static folder
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});