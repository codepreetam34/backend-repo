// models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String },
  discount: { type: Number },
});

module.exports = mongoose.model("Coupon", couponSchema);
