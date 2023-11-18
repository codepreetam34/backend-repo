const express = require("express");
const { signup, signin, signout } = require("../../controllers/admin/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../../validators/auth");
const { requireSignin, superAdminMiddleware } = require("../../common-middleware");
const router = express.Router();

router.post("/admin/signup", validateSignupRequest, isRequestValidated,requireSignin, superAdminMiddleware, signup);
router.post("/admin/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/admin/signout", signout);

module.exports = router;
