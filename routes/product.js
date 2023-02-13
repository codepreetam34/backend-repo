const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
  // uploadS3,
} = require("../common-middleware");

const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProducts,
} = require("../controllers/product");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const router = express.Router();
const { isRequestValidated } = require('../validators/auth');

//const upload = multer({dest: 'uploads/'});

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(path.dirname(__dirname),'uploads'));
  },
  filename: function (req, file, callback) {
    callback(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  // uploadS3.array("productPicture"),
  upload.array('productPicture'),
  createProduct
);

router.get("/products/:slug", getProductsBySlug);
//router.get('/category/getcategory', getCategories);
router.get("/product/:productId", getProductDetailsById);
router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
 );
router.get(
  "/product/getProducts",
  getProducts
);

module.exports = router;
