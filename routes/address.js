const express = require("express");
const { requireSignin, userMiddleware } = require("../common-middleware");
const {
  addAddress,
  getAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/address");
const router = express.Router();

router.post("/user/address/create", requireSignin, addAddress);
router.post("/user/getaddress", requireSignin, getAddress);
router.delete("/user/address/delete/:addressId", requireSignin, deleteAddress);
router.put(
  "/user/address/setDefaultAddress/:addressId",
  requireSignin,
  setDefaultAddress
);
module.exports = router;
