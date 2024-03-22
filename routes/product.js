const express = require("express");
//const {  } = require('../controller/category');

const {
  requireSignin,
  adminMiddleware,
  upload,
  userMiddleware,
  vendorMiddleware,
  // uploadS3,
} = require("../common-middleware");

const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProducts,
  createProductReview,
  getProductsByCategoryId,
  updateProducts,
  getProductsByTag,
  getProductsBySorting,
  getProductsByBestSeller,
  getProductsByTopCategory,
  checkProductPurchase,
  getProductReview,
  getProductsByTagOnly,
  createVendorProduct,
  getVendorProduct,
  getAdminVendorProductApproval,
  approvedBySuperAdmin,
  deleteVendorProductById,
} = require("../controllers/product");

const router = express.Router();

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
);

router.post(
  "/product/vendor/create",
  requireSignin,
  vendorMiddleware,
  upload.array("productPicture"),
  createVendorProduct
);

router.get("/product/vendor/get", requireSignin, getVendorProduct);

router.get(
  "/product/vendor/getAdminApproval",
  requireSignin,
  getAdminVendorProductApproval
);

router.patch(
  "/product/vendor/approvedBySuperAdmin",
  requireSignin,
  approvedBySuperAdmin
);

router.get("/products/:slug", getProductsBySlug);

// router.get('/category/getcategory', getCategories);

router.post("/product/getProducts/categoryid", getProductsByCategoryId);

router.get("/product/:productId", getProductDetailsById);

router.delete(
  "/product/deleteProductById/:productId",
  requireSignin,
  adminMiddleware,
  deleteProductById
);

router.delete(
  "/product/deleteVendorProductById/:productId",
  requireSignin,
  adminMiddleware,
  deleteVendorProductById
);

router.post("/product/getProducts", getProducts);

router.post("/product/getProductsByTagName", getProductsByTag);

router.post("/product/getProductsByTagOnly", getProductsByTagOnly);

router.post("/product/getProductsBySorting", getProductsBySorting);

router.post("/product/getBestSellerProducts", getProductsByBestSeller);

router.post("/product/getTopCategoryProducts", getProductsByTopCategory);

router.patch(
  "/product/update",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  updateProducts
);

router.post(
  "/product/reviews",
  requireSignin,
  userMiddleware,
  upload.single("image"),
  createProductReview
);

router.post(
  "/product/user/review",
  requireSignin,
  userMiddleware,
  getProductReview
);

router.get(
  "/checkProductPurchase/:productId",
  requireSignin,
  userMiddleware,
  checkProductPurchase
);

module.exports = router;
