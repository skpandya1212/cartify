import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";


// Get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Product
export const deleteProductByAdmin = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted by admin",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
