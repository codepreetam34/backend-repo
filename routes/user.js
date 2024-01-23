const express = require("express");
const { getAllUsers, updateUser, deleteUser } = require("../controllers/user");

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
  upload.single("profilePicture"),
  updateUser
);

router.post(
  "/user/delete",
  requireSignin,
  adminMiddleware,
  deleteUser
);

module.exports = router;
