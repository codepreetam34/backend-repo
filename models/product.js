const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    pincode: { type: Array, required: true },

    deliveryDay: { type: String },

    tags: { type: Array },

    halfkgprice: { type: String },

    onekgprice: { type: String },

    twokgprice: { type: String },
    
    
    actualPrice: {
      type: Number,
    },

    discountPrice: {
      type: Number,
    },

    quantity: {
      type: Number,
      required: true,
    },
    
    description: {
      type: String,
      required: true,
      trim: true,
    },
    
    offer: { type: Number },
    
    productPictures: [{ img: { type: String } }],

    reviews: [reviewSchema],
    
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },

    // reviews: { type: String },
    // reviews: [
    //   {
    //     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     review: String,
    //   },
    // ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedAt: Date,
  },

  { timestamps: true }

  );

module.exports = mongoose.model("Product", productSchema);
