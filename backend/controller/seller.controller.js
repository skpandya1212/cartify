import Order from "../models/order.model.js";


// =====================================
// ✅ GET SELLER ORDERS (FULLY UPDATED)
// =====================================
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find({
      "items.seller_id": sellerId,
    })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    // ✅ FILTER ONLY SELLER ITEMS + ADD IMPORTANT DATA
    const formattedOrders = orders.map((order) => {
      const sellerItems = order.items.filter(
        (item) => item.seller_id.toString() === sellerId
      );

      // ✅ Calculate seller revenue per order
      const sellerTotal = sellerItems.reduce(
        (acc, item) => acc + item.subtotal,
        0
      );

      return {
        _id: order._id,
        user: order.user_id,

        items: sellerItems,

        total_amount: sellerTotal, // ✅ seller-specific total
        payment_method: order.payment_method, // ✅ NEW
        payment_status: order.payment_status, // ✅ NEW

        createdAt: order.createdAt,
      };
    });

    res.json(formattedOrders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =====================================
// ✅ UPDATE SELLER ORDER ITEM STATUS
// =====================================
export const updateSellerOrderStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const sellerId = req.user.id;

    // ✅ VALID STATUS CHECK
    const validStatus = [
      "Pending",
      "Approved",
      "Rejected",
      "Shipped",
      "Delivered",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const item = order.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // 🔐 SECURITY CHECK
    if (item.seller_id.toString() !== sellerId) {
      return res.status(403).json({
        message: "You cannot update this item",
      });
    }

    // ✅ UPDATE STATUS
    item.status = status;

    // ✅ AUTO PAYMENT UPDATE FOR COD
    if (
      status === "Delivered" &&
      order.payment_method === "COD"
    ) {
      order.payment_status = "Paid";
    }

    await order.save();

    res.json({
      message: "Item status updated successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =====================================
// ✅ SELLER DASHBOARD STATS 💰
// =====================================
export const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find({
      "items.seller_id": sellerId,
    });

    let totalRevenue = 0;
    let totalOrders = 0;
    let pending = 0;
    let delivered = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.seller_id.toString() === sellerId) {
          totalOrders++;

          if (item.status === "Pending") pending++;
          if (item.status === "Delivered") {
            delivered++;
            totalRevenue += item.subtotal;
          }
        }
      });
    });

    res.json({
      totalOrders,
      pending,
      delivered,
      totalRevenue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};