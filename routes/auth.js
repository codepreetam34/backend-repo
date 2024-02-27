const express = require("express");
const {
  signup,
  signin,
  signout,
  updatePassword,
  updateProfile,
  forgotPassword,
  requestVerifyEmail,
  verifyEmailViaOtp,
  resetPassword,
  requestPasswordReset,
  generateOTP,
  verifyOTP,
  getUserData,
  authControllerlogin
} = require("../controllers/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");
const {
  requireSignin,
  localVariable,
  upload,
} = require("../common-middleware");
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);

router.post("/signin", validateSigninRequest, isRequestValidated, signin);

router.post(
  "/updateprofile",
  requireSignin,
  upload.single("profilePicture"),
  updateProfile
);

router.post("/forgotpassword", forgotPassword);

router.post("/resetpassword", resetPassword);

router.post("/requestpasswordreset", requestPasswordReset);

router.post("/requestVerifyEmail", localVariable, requestVerifyEmail);

router.post("/verifyEmailViaOtp", verifyEmailViaOtp);

router.get("/generateOTP", localVariable, generateOTP);

router.post("/verifyOTP", localVariable, verifyOTP);

router.post("/updatePassword", requireSignin, updatePassword);

router.post("/signout", signout);

router.get("/user", requireSignin, getUserData);

router.post('/google', authControllerlogin);

module.exports = router;
