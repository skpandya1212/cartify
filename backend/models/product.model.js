import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  name: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },

  comment: {
    type: String,
  },

},
{ timestamps: true }
);


const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  images: [
    {
      type: String,
    }
  ],

  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  reviews: [reviewSchema],

  createdAt: {
      type: Date,
      default: Date.now
    },

  rating: {
    type: Number,
    default: 0
  },

  numReviews: {
    type: Number,
    default: 0
  }

},
{ timestamps: true }
);

export default mongoose.model("Product", productSchema);