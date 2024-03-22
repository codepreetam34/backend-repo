const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String },
    rating: { type: Number },
    comment: { type: String },
    image: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const tagSchema = mongoose.Schema({
  tagType: { type: String },
  names: { type: Array },
});
const vendorProductSchema = new mongoose.Schema(
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

    tags: [tagSchema],

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
    categoryName: {
      type: String,
    },

    specifications: {
      type: String,
      required: true,
      trim: true,
    },

    vendorName: {
      type: String,
      trim: true,
    },

    approvedBySuperAdmin: {
      type: Boolean,
      default: false,
    },

    offer: { type: Number },

    productPictures: [
      { img: { type: String }, imageAltText: { type: String } },
    ],

    reviews: [reviewSchema],

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

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

module.exports = mongoose.model("VendorProduct", vendorProductSchema);
