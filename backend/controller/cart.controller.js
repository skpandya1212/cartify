import Cart from "../models/cart.model.js";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    let cart = await Cart.findOne({ user_id: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    }
    else {
      cart.items.push({ product_id, quantity });
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user.id })
      .populate("items.product_id");

    if (!cart) {
      return res.json({ items: [] }); // ✅ prevent null error
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// REMOVE ITEM
export const removeFromCart = async (req, res) => {
  const { product_id } = req.body;

  const cart = await Cart.findOne({ user_id: req.user.id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  cart.items = cart.items.filter(
    item => item.product_id.toString() !== product_id
  );

  await cart.save();

  res.json(cart);
};
// UPDATE ITEM QUANTITY
export const updateCartQty = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || quantity < 1) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const cart = await Cart.findOne({ user_id: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      item => item.product_id.toString() === product_id
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ Replace quantity (IMPORTANT)
    item.quantity = quantity;

    await cart.save();

    const updatedCart = await cart.populate("items.product_id");

    res.json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};