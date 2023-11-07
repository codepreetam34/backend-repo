// controllers/couponController.js
const Coupon = require("../models/coupon");

// Apply a coupon
exports.applyCoupon = async (req, res) => {
    const { code } = req.body;

    try {
        const coupon = await Coupon.findOne({ code });

        if (coupon) {
            res.json({ discount: coupon.discount });
        } else {
            res.status(404).json({ error: "Coupon not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};



exports.addCoupon = async (req, res) => {
    const { code, discount } = req.body;

    try {
        const existingCoupon = await Coupon.findOne({ code });

        if (existingCoupon) {
            return res.status(400).json({ error: "Coupon code already exists" });
        }

        const newCoupon = new Coupon({
            code,
            discount,
        });

        await newCoupon.save();
        res.json({ message: "Coupon added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.updateCoupon = async (req, res) => {
    const { code, newCode, discount } = req.body;
  
    try {
      const existingCoupon = await Coupon.findOne({ code });
  
      if (!existingCoupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
  
      // Update the coupon code and discount
      existingCoupon.code = newCode;
      existingCoupon.discount = discount;
  
      await existingCoupon.save();
  
      res.json({ message: "Coupon updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };