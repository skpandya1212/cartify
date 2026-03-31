import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// ==============================
// CREATE ORDER (UPDATED)
// ==============================
export const createOrder = async (req, res) => {
  try {
    const { shipping_address, payment_method } = req.body;

    const cart = await Cart.findOne({ user_id: req.user.id })
      .populate("items.product_id");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

   const validItems = cart.items.filter(item => item.product_id !== null);

if (validItems.length === 0) {
  return res.status(400).json({
    message: "All products in cart are invalid",
  });
}

let total = 0;

const orderItems = validItems.map((item) => {
  const subtotal = item.product_id.price * item.quantity;

  total += subtotal;

  return {
    product_id: item.product_id._id,
    seller_id: item.product_id.seller_id,
    product_name: item.product_id.name,
    price: item.product_id.price,
    quantity: item.quantity,
    subtotal,
    status: "Pending",
  };
});
    // ✅ PAYMENT LOGIC
    let paymentStatus = "Unpaid";

    if (payment_method === "ONLINE") {
      paymentStatus = "Paid"; // assume success (or update later via webhook)
    }

    // ✅ CREATE ORDER
    const order = await Order.create({
      user_id: req.user.id,
      items: orderItems,
      total_amount: total,
      shipping_address,
      payment_method,
      payment_status: paymentStatus,
    });

    // ✅ CLEAR CART
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// GET USER ORDERS
// ==============================
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==============================
// GET SELLER ORDERS (VERY IMPORTANT)
// ==============================
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.seller_id": req.user.id,
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==============================
// UPDATE ORDER STATUS (Approve / Ship)
// ==============================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, itemId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ Only seller can update their product
    if (item.seller_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    item.status = status;

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};