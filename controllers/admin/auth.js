const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: "Admin already registered",
      });

    User.estimatedDocumentCount(async (err, count) => {
      if (err) return res.status(400).json({ error });
      let role = "admin";
      if (count === 0) {
        role = "super-admin";
      }

      const { firstName, lastName, email, password } = req.body;
      const hash_password = await bcrypt.hash(password, 10);
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: shortid.generate(),
        role,
      });

      _user.save((error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong",
            error,
          });
        }

        if (data) {
          if (data.role === "super-admin") {
            return res.status(201).json({
              message: "Super Admin created Successfully..!",
            });
          }
          return res.status(201).json({
            message: "Admin created Successfully..!",
          });
        }
      });
    });
  });
};

exports.signin = (req, res) => {
  try {
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        const isPassword = await user.authenticate(req.body.password);
        if (
          isPassword &&
          (user.role === "admin" || user.role === "super-admin")
        ) {
          const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15d" }
          );
          const {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
            profilePicture,
          } = user;
          res.cookie("token", token, { expiresIn: "15d" });

          res.status(200).json({
            token,
            user: {
              _id,
              firstName,
              lastName,
              email,
              role,
              fullName,
              profilePicture,
            },
          });
        } else {
          return res.status(400).json({
            message: "Incorrect login credentials. Please verify and retry.",
          });
        }
      } else {
        return res.status(400).json({
          message: "User not found. Please check your credentials or sign up.",
        });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful. Have a great day!",
  });
};
