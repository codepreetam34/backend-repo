const User = require("../models/user");
const Token = require("../models/Token.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const sendEmail = require("../utils/email/sendEmail");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const googleOAuth = require("../common-middleware/googleOAuth");

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
  if (!user) {
    return res.status(400).json({
      message: "User not found. Please check your credentials or sign up.",
    });
  }

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
  verifyEmailViaOtp(req, res);
  return res.status(201).json({
    link,
  });
};

exports.verifyEmailViaOtp = async (req, res) => {
  const { otp, id } = req.body;
  console.log("OTP from request:", otp);
  console.log("OTP from locals:", req.app.locals.OTP);
  //
  // if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
  if (req.app.locals.OTP === undefined) {
    return res.status(400).send({ error: "OTP not set" });
  }

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
  } else {
    return res.status(400).send({ error: "Invalid OTP format" });
  }
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
      if (user.role === "user") {
        return res.status(400).json({
          error: "User with role 'user' already registered",
        });
      }

    const { firstName, lastName, email, password, contactNumber } = req.body;

    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      contactNumber,
      email,
      hash_password,
      username: `${firstName}_${shortid.generate()}`,
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
        if (!user) {
          return res.status(400).json({
            message:
              "User not found. Please check your credentials or sign up.",
          });
        }
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
        const {
          _id,
          firstName,
          lastName,
          email,
          contactNumber,
          role,
          fullName,
        } = user;
        return res.status(201).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            contactNumber,
            email,
            role,
            fullName,
          },
          message: "Email Verification Sent",
        });
      }
    });
  });
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "user" });

    if (!user || !(await user.authenticate(password)) || user.role !== "user") {
      return res.status(400).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    const token = generateJwtToken(user._id, user.role);

    const {
      _id,
      firstName,
      lastName,
      role,
      fullName,
      gender,
      dob,
      contactNumber,
      profilePicture,
    } = user;

    res.cookie("token", token, { expiresIn: "7d" });

    return res.status(200).json({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
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
      res.status(200).send({
        success: true,
        msg: "User not found. Please check your credentials or sign up.",
      });
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

  if (!user) {
    return res.status(400).json({
      message: "User not found. Please check your credentials or sign up.",
    });
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(resetToken, salt);

  // , {
  //   expiresIn: "1h",
  // }

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;
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
    message:
      "Your password reset email has been sent. Please check your email inbox.",
  });
};

exports.resetPassword = async (req, res) => {
  const { userId, token, password } = req.body;
  let passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
    return res.status(400).json({
      message: "Invalid or expired password reset token",
    });
  }

  //console.log(passwordResetToken.token, token);

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    return res.status(400).json({
      message: "Invalid or expired password reset token",
    });
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

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    //console.log(req.user._id)
    // Find user in database by ID
    const user = await User.findById(req.user._id);

    // Check if the current password matches the one stored in the database
    const isMatch = bcrypt.compareSync(currentPassword, user.hash_password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(newPassword, salt);
    // Update the user's password and save changes to the database
    user.hash_password = hash;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    return res.status(200).json({ user: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.authControllerlogin = async (req, res) => {
  try {
    const code = req.body.code;
    const profile = await googleOAuth.getProfileInfo(code);

    const user = {
      googleId: profile.sub,
      name: profile.name,
      firstName: profile.given_name,
      lastName: profile.family_name,
      email: profile.email,
      profilePic: profile.picture,
    };

    res.send({ user });
  } catch (e) {
    console.log(e);
    res.status(401).send();
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful. Have a great day!",
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
