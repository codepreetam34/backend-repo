const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
  upload,
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
} = require("../controllers/product");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const router = express.Router();
const { isRequestValidated } = require("../validators/auth");

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

router.patch(
  "/product/update",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  updateProducts
);

router.post("/product/:id/reviews", requireSignin, createProductReview);

module.exports = router;
