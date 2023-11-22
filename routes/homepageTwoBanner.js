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
} = require("../controllers/homepageTwoBannerController");

router.post(
    "/bannerTwoAds/create",
    requireSignin,
    adminMiddleware,
    upload.single("banner"),
    //upload.array("banner"),
    createBanner
);

router.get("/bannerTwoAds/:id", getBannerById);

router.get("/bannerTwoAds/:slug", getBannersBySlug);

router.post(
    "/bannerTwoAds/deleteBannerById",
    requireSignin,
    adminMiddleware,
    deleteBannerById
);

router.post("/bannerTwoAds/getBanners", getBanners);

router.patch(
    "/bannerTwoAds/update",
    requireSignin,
    adminMiddleware,
    upload.single("banner"),
    updateBanner
);

module.exports = router;