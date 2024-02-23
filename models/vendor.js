const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    gstCertificate: {
      type: String,
      required: true,
    },
    aadharCard: {
      type: String,
      required: true,
    },
    officeAddress1: {
      type: String,
      required: true,
    },
    officeAddress2: {
      type: String,
    },
    officeCity: {
      type: String,
      required: true,
    },
    officeState: {
      type: String,
      required: true,
    },
    officePincode: {
      type: String,
      required: true,
    },
    officePhone: {
      type: String,
    },
    officeEmail: {
      type: String,
    },
    homeAddress1: {
      type: String,
      required: true,
    },
    homeAddress2: {
      type: String,
    },
    homeCity: {
      type: String,
      required: true,
    },
    homeState: {
      type: String,
      required: true,
    },
    homePincode: {
      type: String,
      required: true,
    },
    homePhone: {
      type: String,
    },
    homeEmail: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
