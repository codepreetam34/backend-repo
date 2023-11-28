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
} = require("../controllers/homepagePamerZonerController");

router.post(
    "/bannerPamperZone/create",
    requireSignin,
    adminMiddleware,
    upload.single("banner"),
    //upload.array("banner"),
    createBanner
);

router.get("/bannerPamperZone/:id", getBannerById);

router.get("/bannersPamperZone/:slug", getBannersBySlug);

router.post(
    "/bannerPamperZone/delete",
    requireSignin,
    adminMiddleware,
    deleteBannerById
);

router.post("/bannerPamperZone/getBanners", getBanners);

router.patch(
    "/bannerPamperZone/update",
    requireSignin,
    adminMiddleware,
    upload.single("banner"),
    updateBanner
);

module.exports = router;