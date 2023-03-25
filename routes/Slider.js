const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
  // uploadS3,
} = require("../common-middleware");

const {
  createSlider,
  getSliderById,
  getSlidersBySlug,
  deleteSliderById,
  getSliders,
} = require("../controllers/Slider");

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
  "/slider/create",
  requireSignin,
  // uploadS3.array("productPicture"),
  upload.array('slider'),
  createSlider
);

router.get("/slider/:id", getSliderById);
router.get("/sliders/:slug", getSlidersBySlug);

router.delete(
  "/slider/deletesliderById",
  requireSignin,
  adminMiddleware,
  deleteSliderById
 );

 router.post(
  "/slider/getsliders",
 getSliders
);

module.exports = router;




