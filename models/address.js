const mongoose = require("mongoose");

// C
const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
  pinCode: {
    type: String,
    trim: true,
  },
  locality: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  cityDistrictTown: {
    type: String,
  },
  state: {
    type: String,
  },
  landmark: {
    type: String,
    trim: true,
  },
  alternatePhone: {
    type: String,
  },
  addressType: {
    type: String,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

// B
const userAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    address: [addressSchema],
  },
  { timestamps: true }
);

mongoose.model("Address", addressSchema);
module.exports = mongoose.model("UserAddress", userAddressSchema);
