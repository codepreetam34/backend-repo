const express = require("express");
const {
  requireSignin,
  adminMiddleware,
  upload,
} = require("../common-middleware");

const {
  createBanner,
  getBannerById,
  getBannersBySlug,
  deleteBannerById,
  getBanners,
  updateBanner,
} = require("../controllers/homepageBanner");

const router = express.Router();

router.post(
  "/banner/create",
  requireSignin,
  adminMiddleware,
  upload.single('banner'),
  createBanner
);

router.get("/banner/:id", getBannerById);

router.get("/banners/:slug", getBannersBySlug);

router.post(
  "/banner/delete",
  requireSignin,
  adminMiddleware,
  deleteBannerById
 );

router.post(
  "/banner/getBanners",
   getBanners
);

router.patch(
  "/banner/update",
  requireSignin,
  adminMiddleware,
  upload.single("banner"),
  updateBanner
);

module.exports = router;

