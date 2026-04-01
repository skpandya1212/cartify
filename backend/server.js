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

// ✅ NEW (IMPORTANT for static path fix)
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ✅ Fix __dirname (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect Database
connectDB();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://cartify-nine-chi.vercel.app",
  "https://cartify-gu4h.vercel.app",
];

// ✅ CORS CONFIG
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ❌ REMOVED (DO NOT ADD AGAIN)
// app.options("/*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "E-Commerce API Running 🚀" });
});

// ✅ 🔥 FIXED STATIC FOLDER (IMPORTANT CHANGE)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    message: err.message || "Server Error",
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});