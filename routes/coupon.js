// routes/couponRoutes.js
const express = require("express");
const router = express.Router();
const {
    applyCoupon, updateCoupon, addCoupon
} = require("../controllers/couponController");
const { requireSignin } = require("../common-middleware");

// Apply a coupon
router.post("/applyCoupon", requireSignin, applyCoupon);

router.post("/addCoupon", requireSignin, addCoupon);


router.put("/updateCoupon", requireSignin, updateCoupon);

module.exports = router;

