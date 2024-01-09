const express = require("express");
const { getAllUsers, updateUser } = require("../controllers/user");

const {
  requireSignin,
  adminMiddleware,
  upload,
} = require("../common-middleware");

const router = express.Router();

router.get("/user/getAll", requireSignin, adminMiddleware, getAllUsers);

router.patch(
  "/user/update",
  requireSignin,
  adminMiddleware,
  upload.single("profilePicture"),
  updateUser
);

module.exports = router;