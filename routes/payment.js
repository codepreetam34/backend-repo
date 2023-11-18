const { Router } = require('express');
const router = Router();
const { createOrder } = require("../controllers/paymentController");
const { requireSignin } = require('../common-middleware');

//router.post("/create-order", RazorpayController.createOrder);
router.post("/create-order", requireSignin, createOrder);
//router.post("/paytm-callback", RazorpayController.paytmCallbackUrl);

module.exports = router;



