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
  upload.fields([
    { name: "gstCertificate", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  createVendor
);
router.post("/vendor/getByid",requireSignin, getVendorById);
router.post("/vendor/delete", requireSignin, adminMiddleware, deleteVendor);
router.post(
  "/vendor/update",
  requireSignin,
  uploadField,
  updateVendor
);
router.post("/vendor/getAll", requireSignin, getAllVendors);

module.exports = router;
