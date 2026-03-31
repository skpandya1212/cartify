  import express from "express";
  import dotenv from "dotenv";
  import connectDB from "./config/db.js";
  import authRoutes from "./routes/auth.routes.js";
  import productRoutes from "./routes/product.routes.js";
  import cartRoutes from "./routes/cart.routes.js";
  import orderRoutes from "./routes/order.routes.js";
  import adminRoutes from "./routes/admin.routes.js";
  import sellerRoutes from "./routes/seller.routes.js";
  import cors from 'cors';

  dotenv.config();

  // Connect Database
  connectDB();

  const app = express();
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://cartify-nine-chi.vercel.app",
    "https://cartify-gu4h.vercel.app"
  ];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));

  app.options("*", cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: " E-Commerce API Running" });
  });

  app.use("/uploads", express.static("uploads"));
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/seller", sellerRoutes);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
