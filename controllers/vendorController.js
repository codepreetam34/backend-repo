const Vendor = require("../models/vendor");
const { S3 } = require("aws-sdk");
const shortid = require("shortid"); // Assuming you're using shortid for generating unique filenames

const s3 = new S3({
  endpoint: "https://vibezter-spaces.blr1.digitaloceanspaces.com",
  accessKeyId: "DO00XDVVVLMUEJCKADRM",
  secretAccessKey: "SIFlABu43WE1DvoOHi87bmZmykG0ECL+6t5+O+qBacU",
  s3ForcePathStyle: true,
});

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

    console.log("req ", req.files);

    if (req.files && req.files["gstCertificate"]) {
      const gstFile = req.files["gstCertificate"][0];
      const gstContent = gstFile.buffer;
      const gstFilename = shortid.generate() + "-" + gstFile.originalname;
      const gstUploadParams = {
        Bucket: "vibezter-spaces", // Replace with your DigitalOcean Spaces bucket name
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
      const aadharCardFilename = shortid.generate() + "-" + aadharCardFile.originalname;
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
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
