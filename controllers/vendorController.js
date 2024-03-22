const Vendor = require("../models/vendor");
const { S3 } = require("aws-sdk");
const User = require("../models/user");
const Token = require("../models/Token.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const sendEmail = require("../utils/email/sendEmail");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const s3 = new S3({
  endpoint: "https://vibezter-spaces.blr1.digitaloceanspaces.com",
  accessKeyId: "DO00XDVVVLMUEJCKADRM",
  secretAccessKey: "SIFlABu43WE1DvoOHi87bmZmykG0ECL+6t5+O+qBacU",
  s3ForcePathStyle: true,
});

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.createVendor = async (req, res) => {
  try {
    const {
      shopName,
      vendorName,
      panNumber,
      gstNumber,
      officeAddress1,
      officeAddress2,
      officeCity,
      officeState,
      officePincode,
      officePhone,
      officeEmail,
      homeAddress1,
      homeAddress2,
      homeCity,
      homeState,
      homePincode,
      homePhone,
      homeEmail,
    } = req.body;

    // Extracting uploaded files
    const { gstCertificate, aadharCard } = req.files;

    // Upload files to S3 and get their URLs
    const uploadToS3 = async (file) => {
      const fileContent = file[0].buffer;
      const filename = shortid.generate() + "-" + file[0].originalname;
      const uploadParams = {
        Bucket: "vibezter-spaces",
        Key: filename,
        Body: fileContent,
        ACL: "public-read",
      };
      const uploadedFile = await s3.upload(uploadParams).promise();
      return uploadedFile.Location;
    };

    // Upload gstCertificate and aadharCard to S3
    const gstCertificateUrl = await uploadToS3(gstCertificate);
    const aadharCardUrl = await uploadToS3(aadharCard);

    // Create a new Vendor instance with the extracted information and file URLs
    const vendor = new Vendor({
      shopName,
      vendorName,
      panNumber,
      gstNumber,
      officeAddress1,
      officeAddress2,
      officeCity,
      officeState,
      officePincode,
      officePhone,
      officeEmail,
      homeAddress1,
      homeAddress2,
      homeCity,
      homeState,
      homePincode,
      homePhone,
      homeEmail,
      gstCertificate: gstCertificateUrl,
      aadharCard: aadharCardUrl,
    });

    // Save the vendor to the database
    await vendor.save();

    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.vendorSignUp = async (req, res) => {
  try {
    // Check if user with provided email already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser && existingUser.role === "vendor") {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Proceed with user creation
    const { firstName, lastName, email, password, contactNumber } = req.body;

    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      contactNumber,
      email,
      hash_password,
      role: "vendor",
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.vendorSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "vendor" });

    if (
      !user ||
      !(await user.authenticate(password)) ||
      user.role !== "vendor"
    ) {
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

exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    let gstCertificate = {};
    let aadharCard = {};

    if (req.files && req.files["gstCertificate"]) {
      const gstFile = req.files["gstCertificate"][0];
      const gstContent = gstFile.buffer;
      const gstFilename = shortid.generate() + "-" + gstFile.originalname;
      const gstUploadParams = {
        Bucket: "vibezter-spaces",
        Key: gstFilename,
        Body: gstContent,
        ACL: "public-read",
      };

      // Upload the PDF file to DigitalOcean Spaces
      const uploadedgst = await s3.upload(gstUploadParams).promise();

      // Set the PDF URL in the catalogueObj
      gstCertificate = uploadedgst.Location;
    }

    if (req.files && req.files["aadharCard"]) {
      const aadharCardFile = req.files["aadharCard"][0];
      const aadharCardContent = aadharCardFile.buffer;
      const aadharCardFilename =
        shortid.generate() + "-" + aadharCardFile.originalname;
      const aadharCardUploadParams = {
        Bucket: "vibezter-spaces", // Replace with your DigitalOcean Spaces bucket name
        Key: aadharCardFilename,
        Body: aadharCardContent,
        ACL: "public-read",
      };

      // Upload the PDF file to DigitalOcean Spaces
      const uploadedAadharCard = await s3
        .upload(aadharCardUploadParams)
        .promise();
      // Set the PDF URL in the catalogueObj
      aadharCard = uploadedAadharCard.Location;
    }

    // Object to store updated vendor data
    const updatedVendorData = {};

    if (gstCertificate && gstCertificate != undefined) {
      updatedVendorData.gstCertificate = gstCertificate;
    }

    if (aadharCard && aadharCard != undefined) {
      updatedVendorData.aadharCard = aadharCard;
    }

    // Conditionally assign values from request body to updatedVendorData object
    const updateFields = [
      "shopName",
      "vendorName",
      "panNumber",
      "gstNumber",
      "officeAddress1",
      "officeAddress2",
      "officeCity",
      "officeState",
      "officePincode",
      "officePhone",
      "officeEmail",
      "homeAddress1",
      "homeAddress2",
      "homeCity",
      "homeState",
      "homePincode",
      "homePhone",
      "homeEmail",
    ];
    updateFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        updatedVendorData[field] = req.body[field];
      }
    });

    // Update the vendor in the database
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.body._id,
      updatedVendorData,
      {
        new: true,
      }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(updatedVendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a vendor by ID
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.body._id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
