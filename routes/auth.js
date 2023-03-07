const express = require("express");
const { signup,signin,signout,updatePassword, updateProfile, forgotPassword,requestVerifyEmail,verifyEmailViaOtp, resetPassword, requestPasswordReset, generateOTP, verifyOTP } = require("../controllers/auth");
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
const { requireSignin, localVariable } = require('../common-middleware');
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


router.post("/signup", validateSignupRequest, isRequestValidated, signup);

router.post("/signin", validateSigninRequest, isRequestValidated, signin);

router.post('/updateprofile', requireSignin, upload.single("profilePicture"), updateProfile);

router.post('/forgotpassword', forgotPassword);

router.post('/resetpassword', resetPassword);
router.post('/requestpasswordreset', requestPasswordReset);

router.post('/requestVerifyEmail',localVariable, requestVerifyEmail);
router.post('/verifyEmailViaOtp', verifyEmailViaOtp);


router.get('/generateOTP',localVariable, generateOTP);

router.post('/verifyOTP',localVariable, verifyOTP);

router.post('/updatePassword',requireSignin, updatePassword);



router.post('/signout', signout);

router.post('/profile', requireSignin, (req, res) => {
    res.status(200).json({ user: 'profile' })
});

module.exports = router;

// const router = require("express").Router();
// const { User, validate } = require("../models/User");
// const bcrypt = require("bcrypt");

// router.post("/", async (req, res) => {
// 	try {
// 		const { error } = validate(req.body);
// 		if (error)
// 			return res.status(400).send({ message: error.details[0].message });

// 		const user = await User.findOne({ email: req.body.email });
// 		if (user)
// 			return res
// 				.status(409)
// 				.send({ message: "User with given email already Exist!" });

// 		const salt = await bcrypt.genSalt(Number(process.env.SALT));
// 		const hashPassword = await bcrypt.hash(req.body.password, salt);

// 		await new User({ ...req.body, password: hashPassword }).save();
// 		res.status(201).send({ message: "User created successfully" });
// 	} catch (error) {
// 		res.status(500).send({ message: "Internal Server Error" });
// 	}
// });

// module.exports = router;

// // router.get("/usertest", (req,res) => {
// //     res.send("user test is successfull");
// // })

// // router.post("/userposttest", (req,res) =>{
// //     const username =  req.body.username;
// //     res.send("your user name is "+ username)
// //     console.log(username);
// // })
