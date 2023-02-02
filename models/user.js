const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
      required: true
    },
  
    lastName: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
      required: true
    },
  
    username: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
      unique: true,
      index: true,
      lowercase: true,
    },
  
    email: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
      lowercase: true,
    },

    dob: {
      type: Date,
      trim: true,
    },

    gender: {
      type: String,
      trim: true,
      lowercase: true,
    },

    hash_password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    contactNumber: { type: String },
  
    profilePicture: { type: String },
  
  },
  
  { timestamps: true }
);

// userSchema.virtual('password')
// .set(function(password){

// 	this.hash_password = bcrypt.hashSync(password, 10);
// });



userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
  });  

userSchema.methods.authenticate= function(password) {
		return bcrypt.compareSync(password,this.hash_password);
	}


module.exports = mongoose.model("User", userSchema);




















// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const Joi = require("joi");
// const passwordComplexity = require("joi-password-complexity");

// const userSchema = new mongoose.Schema({
// 	firstName: { type: String, required: true },
// 	lastName: { type: String, required: true },
// 	email: { type: String, required: true },
// 	password: { type: String, required: true },
// });

// // userSchema.methods.generateAuthToken = function () {
// // 	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
// // 		expiresIn: "7d",
// // 	});
// // 	return token;
// // };

// const User = mongoose.model("User", userSchema);

// const validate = (data) => {
// 	const schema = Joi.object({
// 		firstName: Joi.string().required().label("First Name"),
// 		lastName: Joi.string().required().label("Last Name"),
// 		email: Joi.string().email().required().label("Email"),
// 		password: passwordComplexity().required().label("Password"),
// 	});
// 	return schema.validate(data);
// };

// module.exports = { User, validate };

// // // const mongoose = require("mongoose");

// // // const userSchema = new mongoose.Schema(
// // //     {
// // //         username:{type: String, required:true,unique:true},
// // //         email:{type:String, required:true, unique:true},
// // //         password:{type: String,unique:true},
// // //         isAdmin:{
// // //             type:Boolean, default:false,
// // //         },
// // //     },{timestamps: true});

// // //     module.exports = mongoose.model('User',userSchema)

// // const mongoose = require("mongoose");
// // const Schema = mongoose.Schema;
// // const { isEmail } = require("validator");

// // const UserSchema = new Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //   },
// //   email: {
// //     type: String,
// //     required: [true, "Please enter an email"],
// //     unique: true,
// //     lowercase: true,
// //     validate: [isEmail, "Please enter a valid email"],
// //   },
// //   password: {
// //     type: String,
// //     required: [true, "Please enter a valid password"],
// //     minlength: [6, "Minimum password length must be 6 characters"],
// //   },
// //   register_date: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // module.exports = User = mongoose.model("User", UserSchema);
