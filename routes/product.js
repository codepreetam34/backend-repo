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
router.post(
  "/product/getProducts",
  requireSignin,
  adminMiddleware,
  getProducts
);

module.exports = router;

// const Product = require("../models/Product");
// const router = require("express").Router();
// const multer = require("multer");

// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "./uploads");
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + "-" + Date.now());
//   },
// });
// var upload = multer({ storage: storage }).array("img", 10);

// //CREATE
// router.post("/", upload, async (req, res) => {
//   const imgUrl = req.files;
//   try {
//     const { title, desc, variantList, location, SKU, pinCode } = req.body;
// console.log("variant", variantList);
//     // If there are errors, return Bad request and the errors
//     //   const errors = validationResult(req);
//     //   if (req.user.role !== "admin") {
//     //     return res.status(400).send("You are not authorized");
//     //   }
//     //   if (!errors.isEmpty()) {
//     //     return res.status(400).json({ errors: errors.array() });
//     //   }
//     const newProduct = new Product({
//       title,
//       desc,
//       img: imgUrl,
//       variantList,
//       location,
//       SKU,
//       pinCode,
//     });
//     const savedProduct = await newProduct.save();
//     res.status(200).json(savedProduct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // //UPDATE
// // router.put("/:id", async (req, res) => {
// //   try {
// //     const updatedProduct = await Product.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         $set: req.body,
// //       },
// //       { new: true }
// //     );
// //     res.status(200).json(updatedProduct);
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });

// // //DELETE
// // router.delete("/:id", async (req, res) => {
// //   try {
// //     await Product.findByIdAndDelete(req.params.id);
// //     res.status(200).json("Product has been deleted...");
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });

// //GET PRODUCT
// router.get("/find/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     res.status(200).json(product);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //GET ALL PRODUCTS
// router.get("/", async (req, res) => {
//   const qNew = req.query.new;
//   const qCategory = req.query.weight;
//   try {
//     let products;

//     if (qNew) {
//       products = await Product.find().sort({ createdAt: -1 }).limit(1);
//     } else if (qCategory) {
//       products = await Product.find({
//         weight: {
//           $in: qCategory,
//         },
//       });
//     } else {
//       products = await Product.find();
//     }

//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// const getResult = async (req, res) => {
//   if (req.body.img.length <= 0) {
//     return res.send(`You must select at least 1 image.`);
//   }

//   const images = req.body.img.map((image) => "" + image + "").join("");

//   return res.send(`Images were uploaded:${images}`);
// };

// module.exports = router;
