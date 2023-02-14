const mongoose = require("mongoose");
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
    ratings: { type: String },

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
   
   reviews: {type: String},
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
