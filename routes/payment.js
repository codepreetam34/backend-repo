const { Router } = require('express');
const router = Router();
const { createOrder } = require("../controllers/paymentController");

//router.post("/create-order", RazorpayController.createOrder);
router.post("/create-order", createOrder);
//router.post("/paytm-callback", RazorpayController.paytmCallbackUrl);

module.exports = router;



