const express = require("express");
const {
  getTags,
  addTags,
  getTagsById,
  updateTags,
  deleteTags,
} = require("../controllers/tags");
const {
  requireSignin,
  adminMiddleware,
  //  superAdminMiddleware,
} = require("../common-middleware");

const router = express.Router();

router.get("/tags/getTags", getTags);

router.post("/tags/create", requireSignin, adminMiddleware, addTags);

router.get("/tags/:id", getTagsById);

router.patch("/tags/update", requireSignin, adminMiddleware, updateTags);

router.post("/tags/delete", requireSignin, adminMiddleware, deleteTags);

module.exports = router;
