const express = require("express");
const router = express.Router();

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
} = require("../controllers/homepageShopByOccasionController");

router.post(
    "/bannerShopByOccasion/create",
    requireSignin,
    adminMiddleware,
    upload.single("banner"),
    //upload.array("banner"),
    createBanner
);

router.get("/bannerShopByOccasion/:id", getBannerById);

router.get("/bannersShopByOccasion/:slug", getBannersBySlug);

router.post(
    "/bannerShopByOccasion/delete",
    requireSignin,
    adminMiddleware,
    deleteBannerById
);

router.post("/bannerShopByOccasion/getBanners", getBanners);

router.patch(
    "/bannerShopByOccasion/update",
    requireSignin,
    adminMiddleware,
    upload.single("banner"),
    updateBanner
);

module.exports = router;