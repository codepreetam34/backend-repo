const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
  // uploadS3,
} = require("../common-middleware");

const {
  createBanner,
  getBannerById,
  getBannersBySlug,
  deleteBannerById,
  getBanners,
} = require("../controllers/homepageBanner");

const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const router = express.Router();

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
  "/banner/create",
  requireSignin,
  adminMiddleware,
  // uploadS3.array("productPicture"),
  upload.array('banner'),
  createBanner
);

router.get("/banner/:id", getBannerById);
router.get("/banners/:slug", getBannersBySlug);
router.delete(
  "/banner/deleteBannerById",
  requireSignin,
  adminMiddleware,
  deleteBannerById
 );
router.post(
  "/banner/getBanners",
  requireSignin,
  adminMiddleware,
  getBanners
);

module.exports = router;

