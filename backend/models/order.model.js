import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product_name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    // ✅ UPDATED STATUS (IMPORTANT)
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    total_amount: {
      type: Number,
      required: true,
    },

    payment_method: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    payment_status: {
      type: String,
      enum: ["Paid", "Unpaid", "Refunded"],
      default: "Unpaid",
    },

    shipping_address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;