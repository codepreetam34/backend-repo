const { Router } = require("express");
const router = Router();
const {
  deleteVendor,
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
} = require("../controllers/vendorController");
const { requireSignin, adminMiddleware } = require("../common-middleware");
router.post("/vendor/create", requireSignin, adminMiddleware, createVendor);
router.post("/vendor/getByid", getVendorById);
router.post("/vendor/delete", requireSignin, adminMiddleware, deleteVendor);
router.post("/vendor/update", requireSignin, adminMiddleware, updateVendor);
router.post("/vendor/getAll", requireSignin, adminMiddleware, getAllVendors);

module.exports = router;
