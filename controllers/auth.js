const User = require("../models/user");
const Token = require("../models/Token.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const sendEmail = require("../utils/email/sendEmail");
const otpGenerator = require("otp-generator");

const crypto = require("crypto");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.requestVerifyEmail = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  if (!user) throw new Error("Email does not exist");

  const link = `${process.env.CLIENT_URL}/verifyemail?otp=${req.app.locals.OTP}&id=${user._id}`;

  sendEmail(
    user.email,
    "Request Verify Email",
    {
      name: user.fullName,
      otp: req.app.locals.OTP,
      link: link,
    },
    "./template/requestVerifyEmail.handlebars"
  );

  return res.status(201).json({
    link,
  });
};

exports.verifyEmailViaOtp = async (req, res) => {
  const { otp, id } = req.body;
  console.log(otp, parseInt(req.app.locals.OTP));
  if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
    req.app.locals.OTP = null; // reset the otp

    await User.updateOne(
      { _id: id },
      { $set: { verified: true } },
      { new: true }
    );

    const user = await User.findById({ _id: id });

    sendEmail(
      user.email,
      "Email Verified",
      {
        name: user.fullName,
      },
      "./template/verifyEmail.handlebars"
    );

    req.app.locals.resetSession = true; // start session for reset password

    return res.status(201).json({
      message: "Email verified successfully",
      user: user,
    });
  }
  return res.status(400).send({ error: "Invalid OTP" });
};


exports.createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // start session for reset password
    return res.status(201).send({ msg: "access granted !" });
  }
  return res.status(440).send({ error: "Session expired !" });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        error: "User already registered",
      });

    const { firstName, lastName, email, password, contactNumber } = req.body;

    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      contactNumber,
      email,
      hash_password,
      username: shortid.generate(),
    });

    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      if (user) {
        req.app.locals.OTP = otpGenerator.generate(6, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        if (!user) throw new Error("Email does not exist");
      
        const link = `${process.env.CLIENT_URL}/verifyemail?otp=${req.app.locals.OTP}&id=${user._id}`;
      
        sendEmail(
          user.email,
          "Request Verify Email",
          {
            name: user.fullName,
            otp: req.app.locals.OTP,
            link: link,
          },
          "./template/requestVerifyEmail.handlebars"
        );
      
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email,contactNumber, role, fullName } = user;
        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, contactNumber, email, role, fullName },
          message: "Email Verification Sent",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        // const token = jwt.sign(
        //   { _id: user._id, role: user.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1d" }
        // );
        const token = generateJwtToken(user._id, user.role);
        const {
          _id,
          firstName,
          lastName,
          email,
          role,
          fullName,
          gender,
          dob,
          contactNumber,
          profilePicture,
        } = user;
        res.cookie("token", token, { expiresIn: "7d" });
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
            gender,
            dob,
            contactNumber,
            profilePicture,
          },
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};


exports.updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    gender,
    contactNumber,
    password,
    dob,
  } = req.body;
  try {
    // Create a newMember object
    let userId = req.body.userId;
    let user = await User.findById(userId).select("-password");

    const salt = await bcrypt.genSalt(10);
    const newUser = {};

    if (firstName) {
      newUser.firstName = firstName;
    }
    if (lastName) {
      newUser.lastName = lastName;
    }
    if (username) {
      newUser.username = username;
    }
    if (gender) {
      newUser.gender = gender;
    }

    if (contactNumber) {
      newUser.contactNumber = contactNumber;
    }

    if (password) {
      newUser.hash_password = await bcrypt.hash(password, salt);
    }

    if (dob) {
      newUser.dob = dob;
    }

    if (req.file) {
      newUser.profilePicture = process.env.API + "/public/" + req.file.filename;
    }

    // Find the userID to be updated and update it
    user = await User.findByIdAndUpdate(
      userId,
      { $set: newUser },
      { new: true }
    );
    //console.log(user," ", userId)
    res.json({ status: "profile updated Successfuly", user: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      res.status(201).send({ success: true, msg: "Password Reset" });
    } else {
      res
        .status(200)
        .send({ success: true, msg: "This email does not exists." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.requestPasswordReset = async (req, res) => {
  //  console.log("mail", req.body.email);

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new Error("Email does not exist");

  let token = await Token.findOne({ userId: user._id });

  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(resetToken, salt);

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;
  console.log(link);
  sendEmail(
    user.email,
    "Password Reset Request",
    {
      name: user.fullName,
      link: link,
    },
    "./template/requestResetPassword.handlebars"
  );

  return res.status(201).json({
    link,
  });
};

exports.resetPassword = async (req, res) => {
  const { userId, token, password } = req.body;
  let passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }

  //console.log(passwordResetToken.token, token);

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  await User.updateOne(
    { _id: userId },
    { $set: { hash_password: hash } },
    { new: true }
  );

  const user = await User.findById({ _id: userId });

  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.fullName,
    },
    "./template/resetPassword.handlebars"
  );

  await passwordResetToken.deleteOne();

  return res.status(201).json({
    message: "Password reset was successful",
    user: user,
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};


exports.generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
};

exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;
  if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
    req.app.locals.OTP = null; // reset the otp
    req.app.locals.resetSession = true; // start session for reset password
    User.updateOne({ _id: req.body.id }, { $set: { verified: true } });
    return res.status(201).send({ msg: "Verify Successfullt !" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
};
