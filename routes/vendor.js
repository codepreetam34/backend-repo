const { Router } = require("express");
const router = Router();
const {
  deleteVendor,
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
} = require("../controllers/vendorController");
const {
  requireSignin,
  adminMiddleware,
  uploadField,
  upload,

} = require("../common-middleware");
router.post(
  "/vendor/create",
  requireSignin,
  adminMiddleware,
  upload.fields([
    { name: "gstCertificate", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  createVendor
);
router.post("/vendor/getByid", getVendorById);
router.post("/vendor/delete", requireSignin, adminMiddleware, deleteVendor);
router.post(
  "/vendor/update",
  requireSignin,
  adminMiddleware,
  uploadField,
  updateVendor
);
router.post("/vendor/getAll", requireSignin, adminMiddleware, getAllVendors);

module.exports = router;
