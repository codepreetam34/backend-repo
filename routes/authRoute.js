const router = require("express").Router();
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

	//	const token = user.generateAuthToken();
		res.status(200).send({data:user,message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;





















// // const router = require("express").Router();
// // const User = require("../models/User");
// // // Register 
// // router.post("/register", async (req, res) =>{
// //     const newUser = new User ({
// //         username: req.body.username,
// //         email:req.body.email,
// //         password: req.body.password,
// //     });

// //     try{
// //     const savedUser = await newUser.save();
// //     res.status(201).json(savedUser)
// //     }
// //     catch(err) {
// //      res.status(500).json(err);
// //     }
// // })
// // module.exports = router



// const { Router } = require('express');
// const authController = require('../controllers/authControllers');
// const router = Router();
// const auth = require('../middleware/auth');

// router.post('/register', authController.signup);
// router.post('/login', authController.login);
// router.get('/user', auth, authController.get_user);

// module.exports = router;








