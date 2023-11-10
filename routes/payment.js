const { Router } = require('express');
const router = Router();
const RazorpayController = require("../controllers/paymentController");

router.post("/create-order", RazorpayController.createOrder);

module.exports = router;



