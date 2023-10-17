const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategories,
  updateCategories,
  deleteCategories,
  getChildCategories,
  getCategoriesById,
} = require("../controllers/category");
const {
  requireSignin,
  adminMiddleware,
  upload,
  //  superAdminMiddleware,
} = require("../common-middleware");

router.post(
  "/category/create",
  requireSignin,
  adminMiddleware,
  upload.single("categoryImage"),
  addCategory
);
router.get("/category/getcategories", getCategories);

router.post("/category/getchildrens", getChildCategories);

router.get("/category/:id", getCategoriesById);

router.patch(
  "/category/update",
  requireSignin,
  adminMiddleware,
  upload.single("categoryImage"),
  updateCategories
);
router.post(
  "/category/delete",
  requireSignin,
  adminMiddleware,
  deleteCategories
);

module.exports = router;
