const { Router } = require("express");
const router = Router();
const {
  paytmInitiateTransaction,paytmCallBack
} = require("../controllers/paymentController");
const { requireSignin } = require("../common-middleware");

router.post(
  "/paytm/initiateTransaction",
  paytmInitiateTransaction
);
router.post("/paytm/paytm-callback", paytmCallBack);

module.exports = router;
