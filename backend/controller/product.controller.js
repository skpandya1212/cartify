import Product from "../models/product.model.js";

// Add Product (Seller)
export const addProduct = async (req, res) => {
  try {

    // Get uploaded image paths
    const imagePaths = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    const product = await Product.create({
      ...req.body,
      images: imagePaths,
      seller_id: req.user.id,
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSingleProduct = async (req, res) => {

  try {
    const product = await Product.findById(req.params.id)
      .populate("seller_id", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

};

export const getProducts = async (req, res) => {
  try {
    let query = {};

    // 🔍 Search
    if (req.query.keyword) {
      query.name = {
        $regex: req.query.keyword,
        $options: "i",
      };
    }

    // 🗂 Category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // 🔃 Sorting
    let sortOption = {};
    if (req.query.sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    // 🚀 MAIN QUERY
    let productsQuery = Product.find(query)
      .populate("seller_id", "name email")
      .sort(sortOption);

    // ✅ LIMIT (THIS IS MISSING IN YOUR CODE)
    if (req.query.limit) {
      productsQuery = productsQuery.limit(Number(req.query.limit));
    }

    const products = await productsQuery;

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If new images uploaded
    let imagePaths = product.images;

    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: imagePaths,
      },
      { new: true }
    );

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Logged-in Seller Products
export const getSellerProducts = async (req, res) => {

  try {

    const products = await Product.find({
      seller_id: req.user.id
    }).populate("seller_id", "name email");

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



export const getCategories = async (req, res) => {
  try {

    const categories = await Product.distinct("category");

    res.json(categories);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


export const addReview = async (req, res) => {
  try {

    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(201).json({ message: "Review added" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






