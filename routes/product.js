const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
  upload,
  userMiddleware,
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
} = require("../controllers/product");
const router = express.Router();

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
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

router.post("/product/getProducts", getProducts);

router.post("/product/getProductsByTagName", getProductsByTag);

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

router.post("/product/:id/reviews", requireSignin, userMiddleware, createProductReview);

module.exports = router;