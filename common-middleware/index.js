const jwt = require("jsonwebtoken");
const multer = require("multer");
const AWS = require("aws-sdk");
const { S3 } = require("aws-sdk");

// Initialize AWS S3
const s3 = new S3({
  endpoint: "https://vibezter-spaces.blr1.digitaloceanspaces.com",
  accessKeyId: "DO00XDVVVLMUEJCKADRM",
  secretAccessKey: "SIFlABu43WE1DvoOHi87bmZmykG0ECL+6t5+O+qBacU",
  s3ForcePathStyle: true,
});


// Set storage engine for multer
const storage = multer.memoryStorage(); // Store files in memory for uploading to Spaces

// Multer middleware for file uploads
const upload = multer({ storage: storage });

// Multer middleware for specific fields
const uploadField = multer({ storage: storage }).fields([
  { name: "gstCertificate", maxCount: 2 },
  { name: "aadharCard", maxCount: 10 },
]);

// Middleware to check if user is signed in with a valid JWT token
const requireSignin = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res
        .status(400)
        .json({ message: "Authorization required; use a valid token" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Authorization required, use a valid token" });
  }
};

// Middleware to check if the user's role is "user"
const userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "User access denied" });
  }
  next();
};

// Middleware to check if the user's role is "admin" or "super-admin"
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super-admin") {
    return res.status(400).json({ message: "Admin access denied" });
  }
  next();
};
const vendorMiddleware = (req, res, next) => {
  if (req.user.role !== "vendor") {
    return res.status(400).json({ message: "Vendor access denied" });
  }
  next();
};

// Middleware to check if the user's role is "super-admin"
const superAdminMiddleware = (req, res, next) => {
  if (req.user.role !== "super-admin") {
    return res.status(200).json({ message: "Super Admin access denied" });
  }
  next();
};

// Middleware to set local variables
const localVariable = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

// Export all functions and middleware as an object
module.exports = {
  requireSignin,
  userMiddleware,
  adminMiddleware,
  superAdminMiddleware,
  localVariable,
  vendorMiddleware,
  upload,
  uploadField,
  s3
};
